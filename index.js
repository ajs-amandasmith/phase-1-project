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
  const pokemon = searchInput.value;
  const searchList = document.getElementById('search-list');
  searchList.textContent = '';
  const listItem = document.createElement('li');
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
  .then(res => res.json())
  .then(data => {
    console.log('data', data);
    listItem.textContent = data.name;
    console.log(listItem.textContent);
    searchList.append(listItem);
  })
}