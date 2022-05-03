document.addEventListener('DOMContentLoaded', () => {
  submitPokeSearch();
})

function getPokeData(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    return pokemon;
  })
}

function submitPokeSearch() {
  const submit = document.getElementById('submit');
  submit.addEventListener('click', e => handlePokeSearch(e))
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
    searchList.append(listItem);
    getPokeSpecies(data);
  })
  document.getElementById('poke-form').reset();
}

function clickPokeName(data, species) {
  const pokeList = document.getElementById('search-list');
  const pokemon = [...pokeList.childNodes]
  pokemon.map(poke => poke.addEventListener('click', e => handlePokeName(e, data, species)))
}

function handlePokeName(e, data, species) {
  console.log('e', e);
  console.log('data', data);
  const pokeName = document.getElementById('poke-name');
  const pokeNum = document.getElementById('poke-number');
  const pokeImg = document.getElementById('poke-img');
  const pokeHeight = document.getElementById('poke-height');
  const pokeWeight = document.getElementById('poke-weight');
  const pokeGenders = document.getElementById('poke-genders');

  console.log('species', species)

  pokeName.textContent = `Name: ${data.name[0].toUpperCase()}${data.name.slice(1)}`;
  pokeNum.textContent = `National #: ${data.id}`;
  pokeImg.src = data.sprites.other['official-artwork'].front_default;
  pokeImg.alt = `Image of ${data.name}`;
  pokeHeight.textContent = `Height: ${(data.height * 3.937)} inches`;
  pokeWeight.textContent = `Weight: ${(data.weight / 4.536)} pounds`;
  pokeGenders.textContent = getPokeGenders(species.gender_rate);
  
}

function getPokeSpecies(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
  .then(res => res.json())
  .then(data => {
    console.log('species data', data);
    clickPokeName(pokemon, data);
    return getPokeGenders(data.gender_rate);
  });
}

function getPokeGenders(genderRate) {
  console.log('genders genderRate', genderRate);
  switch (genderRate) {
    case -1:
      return `Gender: None`;
    case 0:
      return `Gender: Male`;
    case 8:
      return `Gender: Female`;
    default:
      return `Genders: Male or Female`;
  }
}

