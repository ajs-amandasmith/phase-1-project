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
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
  .then(res => res.json())
  .then(data => {
    console.log('data', data);
  })
  
  // console.log('search value', searchInput.value);
  // const pokeObj = getPokeData(searchInput.value);
  // console.log('pokemon', pokeObj);
  // console.log('event', event);
}

// take input data in the form field and use that to search the API and return the data it finds