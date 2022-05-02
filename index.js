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
    console.log('data', data);
    console.log('data name', data.name)
    listItem.textContent = `${data.name[0].toUpperCase()}${data.name.slice(1)}`;
    listItem.dataset.id = data.id;
    searchList.append(listItem);
    clickPokeName();
  })
  document.getElementById('poke-form').reset();
}

function clickPokeName() {
  const pokeList = document.getElementById('search-list');
  const pokemon = [...pokeList.childNodes]
  console.log(pokemon);
  pokemon.map(poke => poke.addEventListener('click', e => console.log(e, poke)))
}

// click on the name of the pokemon that shows up after being searched for
// pokemon's data should appear in the pokedex article element