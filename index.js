document.addEventListener('DOMContentLoaded', () => {
  submitPokeSearch();
  getDefaultTeam();
  clickAddButton();
  submitToTeam();
})

// function getPokeData(pokemon) {
//   fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
//   .then(res => res.json())
//   .then(data => {
//     console.log(data)
//     return pokemon;
//   })
// }

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
    getPokeTypes(data.types);
  })
  document.getElementById('poke-form').reset();
  document.getElementById('add-poke').hidden = true;
}

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
  pokeHeight.textContent = `Height: ${(data.height * 3.937)} inches`;
  pokeWeight.textContent = `Weight: ${(data.weight / 4.536)} pounds`;
  pokeGenders.textContent = getPokeGenders(species.gender_rate);
  pokeTypes.textContent = getPokeTypes(data.types)
  pokeFlavorText.textContent = `${species.flavor_text_entries[0].flavor_text}`
  addButton.hidden = false;
  document.getElementById('gender-select').replaceChildren('');
}

function clickAddButton() {
  const addButton = document.getElementById('add-btn');
  addButton.addEventListener('click', e => handleAddButton(e))
}

function getPokeSpecies(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
    .then(res => res.json())
    .then(data => {
      clickPokeName(pokemon, data);
  });
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

function getDefaultTeam() {
  fetch(`http://localhost:3000/team`)
    .then(res => res.json())
    .then(data => {
      resetDeafaultTeam(data)
      showTeam(data)
    })
}

function showTeam(team) {
  const teamList = document.getElementById('poke-team');
  
  team.map(each => {
    const pokeball = document.createElement('img');
    pokeball.src = each.image;
    pokeball.dataset.id = each.id;
    pokeball.className = 'team-member';
    teamList.append(pokeball);
  })
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

function resetDeafaultTeam(team) {
  team.forEach(member => patchDefaultTeam(member.id))
}

function handleAddButton(e) {
  const addPokeForm = document.getElementById('add-poke');
  addPokeForm.hidden = false;
  const genders = document.getElementById('poke-genders');
  const genderSelect = document.getElementById('gender-select');
  pokeGenderOptions(genders.textContent).map(gender => genderSelect.append(gender));
  addPokeForm.reset();
}

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
}

function updateTeam(nickname, gender, shiny) {
  fetch(`http://localhost:3000/team`)
    .then(res => res.json())
    .then(team => {
      for (let i = 0; i < team.length; i++) {
        if (team[i].name === '') {
          populateTeamMember(team[i], nickname, gender, shiny);
          break;
        } else {
          console.log('Your team is full');
        }
      }
    })
}

function populateTeamMember(teamMember, nickname, gender, shiny) {
  const pokeID = document.getElementById('poke-number').dataset.id;

  const teamImage = document.getElementsByClass('team-member')

  console.log('ID', pokeID);
  console.log('team member', teamMember);
  console.log('nickname', nickname);
  console.log('gender', gender);
  console.log('shiny', shiny);

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}`)
    .then(res => res.json())
    .then(data => {
      console.log('data', data)
      isShiny(shiny, data, gender);
    });


  // take the inputs from the 'add-poke' form and update one of the team objects
  // grab the data from the searched for pokemon
  // grab an empty team object
  // update team name with input nickname
  // update team gender with chosen gender
    // default if there isn't an option
  // show pokemon image
    // if shiny, show the shiny image
}

function isShiny(shiny, pokemon, gender) {
  if (shiny === "Yes") {
    console.log(pokemon.sprites.front_shiny);
  } else {
    isFemale(gender, pokemon)
  }
}

function isFemale(gender, pokemon) {
  if (gender === "Female") {
    console.log(pokemon.sprites.front_female);
  } else {
    console.log(pokemon.sprites.front_default);
  }
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