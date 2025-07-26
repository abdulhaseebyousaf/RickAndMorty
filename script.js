// for Button
let characterButton = document.getElementById("characater");

fetch('https://rickandmortyapi.com/api/character')
      .then(response => response.json())
      .then(data => {
        const characters = data.results;
        characters.forEach(character => {
        const list = document.getElementById('characterList');
        // create div for charachters
        const div = document.createElement('div')
        div.classList.add("characterdata");
        div.style.display = "none";
        // for text
        const textdiv = document.createElement('div');
        textdiv.classList.add("textdata");
        // create element
        const images = document.createElement('img');
        const name = document.createElement('h5');
          const status = document.createElement('h1');
          const gender = document.createElement('h2');
          const species = document.createElement('h3');
          const type = document.createElement('h4');
          // now give location
          images.src = character.image;
          name.textContent = character.name;
          type.textContent = character.type;
          status.textContent = character.status;
          gender.textContent = character.gender;
          species.textContent = character.species;
          // innerThml
          name.innerHTML = `Name: ${character.name}`
          type.innerHTML =`Type: ${character.type}`
          status.innerHTML= `Status: ${character.status}`
          gender.innerText =`Gender: ${character.gender}`
          species.innerHTML = `Species: ${character.species}`
          // for appendChild
          div.appendChild(images);
          textdiv.appendChild(name);
          textdiv.appendChild(status);
          textdiv.appendChild(gender);
          textdiv.appendChild(species);
          textdiv.appendChild(type);
          div.appendChild(textdiv);
          list.appendChild(div);      
        });
      console.log(data)
      })
// for charasters
characterButton.addEventListener('click',function () {

})