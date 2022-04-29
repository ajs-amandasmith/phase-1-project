document.addEventListener('DOMContentLoaded', () => {
  getPokeData();
  submitPokeSearch();
})

function getPokeData() {
  fetch('https://pokeapi.co/api/v2/pokemon/')
  .then(res => res.json())
  .then(data => console.log(data))
}

function submitPokeSearch() {
  const submit = document.getElementById('submit');
  submit.addEventListener('click', e => {
    e.preventDefault();
    console.log(e);
  })
}