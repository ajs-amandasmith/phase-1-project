document.addEventListener('DOMContentLoaded', () => {
  submitPokeSearch();
  clickAddButton();
  submitToTeam();
  resetDefaultTeam();
  getDefaultTeam();
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

function resetDefaultTeam(team) {
  for (let i = 1; i < 7; i++) {
    patchDefaultTeam(i);
  }
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
  document.getElementById('add-btn').hidden = true;
}

function updateTeam(nickname, gender, shiny) {
  fetch(`http://localhost:3000/team`)
    .then(res => res.json())
    .then(team => {
      for (let i = 0; i < team.length; i++) {
        if (team[i].name === '') {
          console.log('current member', team[i])
          populateTeamMember(team[i], nickname, gender, shiny);
          break;
        } else {
          console.log('Your team is full');
        }
      }
    })
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
  if (gender === "Female" && pokemon.sprites.front_default !== null) {
    image = pokemon.sprites.front_default;
    return image;
  } else if (gender === "Female") {
    image = pokemon.sprites.front_female;
    return image;
  } else {
    image = pokemon.sprites.front_default;
    return image;
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

function populateTeamMember(teamMember, nickname, gender, shiny) {
  const pokeID = document.getElementById('poke-number').dataset.id;
  const member = document.getElementById(`${teamMember.id}`);
  const memberImage = member.querySelector('img');

  const pokeSpecies = document.createElement('h4');
  const pokeNickname = document.createElement('h4');
  const pokeGender = document.createElement('h4');

  console.log('image', memberImage);
  console.log('ID', pokeID);
  console.log('team member', teamMember);
  console.log('nickname', nickname);
  console.log('gender', gender);
  console.log('shiny', shiny);

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}`)
    .then(res => res.json())
    .then(data => {
      console.log('data', data)
      const imageSrc = isShiny(shiny, data, gender);
      console.log(imageSrc);
      memberImage.src = imageSrc;
      teamMember.name = data.name;
      console.log('new member', teamMember);

      pokeSpecies.textContent = `Pok\xE9mon: ${data.name}`;
      pokeNickname.textContent = `Nickname: ${nickname}`;
      pokeGender.textContent = `Gender: ${gender}`;

      member.append(pokeSpecies, pokeNickname, pokeGender);

      patchNewMember(teamMember.id, data.name, memberImage.src);
    });


  // take the inputs from the 'add-poke' form and update one of the team objects
  // update team name with input nickname
  // update team gender with chosen gender
    // default if there isn't an option
  // show pokemon image
    // if shiny, show the shiny image
}

function patchNewMember(id, newName, newImage) {
  console.log('patch id', id);
  console.log('patch name', newName);
  console.log('patch image', newImage);
  fetch(`http://localhost:3000/team/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: newImage,
      name: newName,
      nickname: '',
      gender: '',
      isShiny: '',
    })
  })
}