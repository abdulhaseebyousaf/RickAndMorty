 let characterButton = document.getElementById("characater");
let frontpage = document.getElementById("frontPage");
let homeButton = document.getElementById("homebutton");
let secodCharacter = document.getElementById("showAllData");
let totalPage = 1;
let page = 1;

// Show character section
characterButton.addEventListener('click', function () {
  frontpage.style.display = "none";
  secodCharacter.style.display = "flex";
  loadAllCharacters(); 
});

// Show home page
homeButton.addEventListener('click', function () {
  frontpage.style.display = "flex";
  secodCharacter.style.display = "none";
});

// Load all characters
async function loadAllCharacters () {
  const list = document.getElementById('characterList');
  list.innerHTML = "";

  for (let page = 1; page <= totalPage; page++) {
   //`https://rickandmortyapi.com/api/character?page=${page}`
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character');
      const data = await response.json();
      const characters = data.results;

      characters.forEach(character => {
        const div = document.createElement('div');
        div.classList.add("characterdata");

        const textdiv = document.createElement('div');
        textdiv.classList.add("textdata");

        const images = document.createElement('img');
        const name = document.createElement('h5');
        const status = document.createElement('h1');
        const gender = document.createElement('h2');
        const species = document.createElement('h3');

        images.src = character.image;
        name.innerHTML = `Name: ${character.name}`;
        status.innerHTML = `Status: ${character.status}`;
        gender.innerHTML = `Gender: ${character.gender}`;
        species.innerHTML = `Species: ${character.species}`;

        textdiv.appendChild(name);
        textdiv.appendChild(status);
        textdiv.appendChild(gender);
        textdiv.appendChild(species);

        div.appendChild(images);
        div.appendChild(textdiv);
        list.appendChild(div);
      });
    } catch (error) {
      console.error(error);
    }
  }
}

// for ka lea search
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener('click', async function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (!searchTerm) return;

  const list = document.getElementById('characterList');
  list.innerHTML = ""; // Clear previous results

  try {
    let matched = false;

    for (let page = 1; page <= totalPage; page++) {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await response.json();
      const characters = data.results;

      characters.forEach(character => {
        if (character.name.toLowerCase().includes(searchTerm)) {
          matched = true;

          const div = document.createElement('div');
          div.classList.add("characterdata");

          const textdiv = document.createElement('div');
          textdiv.classList.add("textdata");

          const images = document.createElement('img');
          const name = document.createElement('h5');
          const status = document.createElement('h1');
          const gender = document.createElement('h2');
          const species = document.createElement('h3');

          images.src = character.image;
          name.innerHTML = `Name: ${character.name}`;
          status.innerHTML = `Status: ${character.status}`;
          gender.innerHTML = `Gender: ${character.gender}`;
          species.innerHTML = `Species: ${character.species}`;

          textdiv.appendChild(name);
          textdiv.appendChild(status);
          textdiv.appendChild(gender);
          textdiv.appendChild(species);

          div.appendChild(images);
          div.appendChild(textdiv);
          list.appendChild(div);
        }
      });
    }

    if (!matched) {
      list.innerHTML = "<p class='text-xl text-red-600 font-bold'>No characters found with that name.</p>";
    }
  } catch (error) {
    console.error("Search error:", error);
  }
});

//enter sy search kr ga
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchButton.click();
  }
});
// for numbers 1 to 42 
const numberContainer = document.getElementById('numbers');
const numberArrow = document.getElementById('lastArrow');
const dots = document.getElementById('dots');
// Create 42 number divs
for (let i = 1; i <= 5; i++) {
  let numberDiv = document.createElement('div');
  numberDiv.textContent = i;

  // Tailwind-like classes
  numberDiv.className =
    "h-[30px] w-[30px] rounded-full flex items-center justify-center cursor-pointer text-sm font-semibold bg-orange-500 text-white";

    numberContainer.appendChild(dots);
  numberContainer.appendChild(numberDiv);
  numberContainer.appendChild(numberArrow);

}
