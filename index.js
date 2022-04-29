document.addEventListener('DOMContentLoaded', () => {
  submitPokeSearch();
})

function getPokeData() {
  fetch('https://pokeapi.co/api/v2/pokemon/')
  .then(res => res.json())
  .then(data => console.log(data))
}

function submitPokeSearch() {
  const submit = document.getElementById('submit');
  submit.addEventListener('click', e => handlePokeSearch(e))
}

function handlePokeSearch(event) {
  event.preventDefault();
  const searchInput = document.getElementById('search');
  console.log(searchInput.value);
  console.log(event);
}

// take input data in the form field and use that to search the API and return the data it finds