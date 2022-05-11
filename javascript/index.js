// functions to load once the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  submitPokeSearch();
  clickAddButton();
  submitToTeam();
  resetDefaultTeam();
  getDefaultTeam();
})

// functions for searching for pokemon
function submitPokeSearch() {
  const submit = document.getElementById('poke-form');
  submit.addEventListener('submit', e => handlePokeSearch(e))
}

function handlePokeSearch(event) {
  event.preventDefault();
  const searchInput = document.getElementById('search');
  const pokemon = searchInput.value.toLowerCase();
  const searchList = document.getElementById('search-list');
  searchList.textContent = '';
  const listItem = document.createElement('li');
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
  .then(res => res.json())
  .then(data => {
    listItem.textContent = `${data.name[0].toUpperCase()}${data.name.slice(1)}`;
    listItem.dataset.id = data.id;
    document.getElementById('click').textContent = "Click a Pok\xE9mon"
    searchList.append(listItem);
    getPokeSpecies(data);
  })
  document.getElementById('poke-form').reset();
  document.getElementById('add-poke').hidden = true;
}

function getPokeSpecies(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
    .then(res => res.json())
    .then(data => {
      clickPokeName(pokemon, data);
  });
}

// functions for populating the pokedex form
function clickPokeName(data, species) {
  const pokeList = document.getElementById('search-list');
  const pokemon = [...pokeList.childNodes]
  pokemon.map(poke => poke.addEventListener('click', e => handlePokeName(e, data, species)))
}

function handlePokeName(e, data, species) {
  const pokeName = document.getElementById('poke-name');
  const pokeNum = document.getElementById('poke-number');
  const pokeImg = document.getElementById('poke-img');
  const pokeHeight = document.getElementById('poke-height');
  const pokeWeight = document.getElementById('poke-weight');
  const pokeGenders = document.getElementById('poke-genders');
  const pokeTypes = document.getElementById('poke-types');
  const pokeFlavorText = document.getElementById('poke-flavor-text')
  const addButton = document.getElementById('add-btn');

  pokeName.textContent = `Name: ${data.name[0].toUpperCase()}${data.name.slice(1)}`;
  pokeNum.textContent = `National #: ${data.id}`;
  pokeNum.dataset.id = data.id;
  pokeImg.src = data.sprites.other['official-artwork'].front_default;
  pokeImg.alt = `Image of ${data.name}`;
  pokeImg.hidden = false;
  pokeHeight.textContent = `Height: ${(data.height * 3.937).toFixed(2)} inches`;
  pokeWeight.textContent = `Weight: ${(data.weight / 4.536).toFixed(2)} pounds`;
  pokeGenders.textContent = getPokeGenders(species.gender_rate);
  pokeTypes.textContent = getPokeTypes(data.types)
  pokeFlavorText.textContent = `${species.flavor_text_entries[0].flavor_text}`
  addButton.hidden = false;
  document.getElementById('gender-select').replaceChildren('');
  document.getElementById('pokedex').hidden = false;
}

function getPokeGenders(genderRate) {
  switch (genderRate) {
    case -1:
      return `Gender: None`;
    case 0:
      return `Gender: Male`;
    case 8:
      return `Gender: Female`;
    default:
      return `Genders: Male, Female`;
  }
}

function getPokeTypes(typeArray) {
  const type = typeArray.map(type => type.type.name[0].toUpperCase() + type.type.name.slice(1));
  if (type.length === 1) {
    return `Type: ${type}`;
  } else {
    return `Types: ${type.join(', ')}`
  }
}

// bringing up the add pokemon form
function clickAddButton() {
  const addButton = document.getElementById('add-btn');
  addButton.addEventListener('click', e => handleAddButton(e))
}

function handleAddButton(e) {
  console.log('peace');
  const addPokeForm = document.getElementById('add-poke');
  addPokeForm.hidden = false;
  const genders = document.getElementById('poke-genders');
  const genderSelect = document.getElementById('gender-select');
  pokeGenderOptions(genders.textContent).map(gender => genderSelect.append(gender));
  addPokeForm.reset();
  ifTeamIsFull();
}

function pokeGenderOptions(genders) {
  let optionElement = document.createElement('option');
  let optionElement2 = document.createElement('option');
  switch (genders) {
    case 'Gender: None':
      optionElement.textContent = "None";
      return [optionElement];
    case 'Gender: Male':
      optionElement.textContent = "Male";
      return [optionElement];
    case 'Gender: Female':
      optionElement.textContent = "Female";
      return [optionElement];
    default:
      optionElement.textContent = "Male";
      optionElement2.textContent = "Female";
      return [optionElement, optionElement2];
  }
}

// adding a pokemon to the team
function submitToTeam() {
  const addForm = document.getElementById('add-poke');
  addForm.addEventListener('submit', e => handleSubmitToTeam(e))
}

function handleSubmitToTeam(e) {
  e.preventDefault();

  const nickname = document.getElementById('nickname');
  const genders = document.getElementById('gender-select');
  const shiny = document.getElementById('is-shiny');

  const nicknameValue = nickname.value;
  const genderSelected = genders.options[genders.selectedIndex].textContent;
  const isShiny = shiny.options[shiny.selectedIndex].textContent;

  updateTeam(nicknameValue, genderSelected, isShiny);

  const form = document.getElementById('add-poke');
  form.reset();
  form.hidden = true;
  document.getElementById('gender-select').replaceChildren('');
  document.getElementById('add-btn').hidden = true;
}

function updateTeam(nickname, gender, shiny) {
  fetch(`http://localhost:3000/team`)
    .then(res => res.json())
    .then(team => {
      for (let i = 0; i < team.length; i++) {
        if (team[i].name !== '') {
          continue;
        } else if (team[i].name === '') {
          populateTeamMember(team[i], nickname, gender, shiny);
          break;
        }
      }
    })
}

function populateTeamMember(teamMember, nickname = 'none', gender, shiny) {
  const pokeID = document.getElementById('poke-number').dataset.id;
  const member = document.getElementById(`${teamMember.id}`);
  const memberImage = member.querySelector('img');

  const div = document.createElement('div');
  const pokeSpecies = document.createElement('h4');
  const pokeNickname = document.createElement('h4');
  const pokeGender = document.createElement('h4');

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}`)
    .then(res => res.json())
    .then(data => {
      const imageSrc = isShiny(shiny, data, gender);
      memberImage.src = imageSrc;
      teamMember.name = data.name;

      pokeSpecies.textContent = `Pok\xE9mon: ${data.name[0].toUpperCase()}${data.name.slice(1)}`;
      pokeNickname.textContent = `Nickname: ${nickname}`;
      pokeGender.textContent = `Gender: ${gender}`;

      div.className = "memberStats";
      div.append(pokeSpecies, pokeNickname, pokeGender);
      member.append(div);

      patchNewMember(teamMember.id, data.name, memberImage.src);
    });
}

function isShiny(shiny, pokemon, gender) {
  image = '';
  if (shiny === "Yes") {
    image = pokemon.sprites.front_shiny;
    return image;
  } else {
    return isFemale(gender, pokemon)
  }
}

function isFemale(gender, pokemon) {
  image = '';
  if (gender === "Female" && pokemon.sprites.front_female !== null) {
    image = pokemon.sprites.front_female;
    return image;
  } else {
    image = pokemon.sprites.front_default;
    return image;
  }
}

function patchNewMember(id, newName, newImage) {
  fetch(`http://localhost:3000/team/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: newImage,
      name: newName
    })
  })
}

// function for when the team is full
function ifTeamIsFull() {
  const team = document.getElementById('poke-team');
  const teamArray = [...team.children];
  // the length of the children becomees 2 after a member is added
  const find = teamArray.find(member => member.children.length === 1);
  if (find === undefined) {
    window.alert("Your Team is Full!");
  }
 }

// loading the pokeballs on load and refresh
function getDefaultTeam() {
  fetch(`http://localhost:3000/team`)
    .then(res => res.json())
    .then(data => {
      showTeam(data)
    })
}

function showTeam(team) {
  const teamList = document.getElementById('poke-team');
  
  team.map(each => {
    const pokeball = document.createElement('img');
    const div = document.createElement('div');
    pokeball.src = each.image;
    pokeball.className = 'team-member-img';
    div.id = each.id;
    div.className = 'team-member';
    div.append(pokeball);
    teamList.append(div);
  })
}

function resetDefaultTeam(team) {
  for (let i = 1; i < 7; i++) {
    patchDefaultTeam(i);
  }
}

function patchDefaultTeam(id) {
  fetch(`http://localhost:3000/team/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: './images/SugimoriPokeBAll.png',
      name: ''
    })
  })
}