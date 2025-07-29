
let characterButton = document.getElementById("characater");
let frontpage = document.getElementById("frontPage");
let homeButton = document.getElementById("homebutton");
let secodCharacter = document.getElementById("showAllData");
let totalPage = 42;
const list = document.getElementById('characterList');

// Show character section
characterButton.addEventListener('click', function () {
  frontpage.style.display = "none";
  secodCharacter.style.display = "flex";
  loadCharactersByPage(1);
  renderNumberButtons();
});

// Show home page
homeButton.addEventListener('click', function () {
  frontpage.style.display = "flex";
  secodCharacter.style.display = "none";
});

// Search functionality
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener('click', async function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (!searchTerm) return;

  list.innerHTML = "";
  try {
    let matched = false;
    for (let page = 1; page <= totalPage; page++) {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await response.json();
      const characters = data.results;

      characters.forEach(character => {
        if (character.name.toLowerCase().includes(searchTerm)) {
          matched = true;
          displayCharacter(character);
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

searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchButton.click();
  }
});

function displayCharacter(character) {
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

// Load characters by page
function loadCharactersByPage(pageNumber) {
  list.innerHTML = "";

  fetch(`https://rickandmortyapi.com/api/character?page=${pageNumber}`)
    .then(res => res.json())
    .then(data => {
      data.results.forEach(character => {
        displayCharacter(character);
      });
    })
    .catch(err => {
      console.error("Failed to fetch characters:", err);
    });
}
// for hidden main
const  inmain =document.getElementById('choose');
// Pagination logic
const numberContainer = document.getElementById('numbers');
const numberArrow = document.getElementById('lastArrow');
const firstArrow = document.getElementById('firstArrow');
const dots = document.getElementById('dots');
const totalPages = 42;
const buttonsPerSet = 5;
let currentSet = 0;

function renderNumberButtons() {
  const existingButtons = [...numberContainer.querySelectorAll('div')].filter(el => el !== dots);
  existingButtons.forEach(btn => btn.remove());

  const start = currentSet * buttonsPerSet + 1;
  const end = Math.min(start + buttonsPerSet - 1, totalPages);

  for (let i = start; i <= end; i++) {
    const numberDiv = document.createElement('div');
    numberDiv.textContent = i;
    numberDiv.className = "h-[30px] w-[30px] max-sm:w-[27px] max-sm:h-[27px] rounded-full flex items-center justify-center cursor-pointer text-sm font-semibold bg-orange-500 text-white";

    numberDiv.addEventListener('click', () => {
      loadCharactersByPage(i);
      highlightActive(numberDiv);
    });

    numberContainer.insertBefore(numberDiv, dots);
  }

  numberArrow.style.display = end < totalPages ? 'grid' : 'none';
  dots.style.display = end < totalPages ? 'grid' : 'none';
}

function highlightActive(activeButton) {
  const allButtons = numberContainer.querySelectorAll('div');
  allButtons.forEach(btn => {
    btn.classList.remove('bg-orange-700');
    btn.classList.add('bg-orange-500');
  });
  activeButton.classList.remove('bg-orange-500');
  activeButton.classList.add('bg-orange-700');
}

numberArrow.addEventListener('click', () => {
  if ((currentSet + 1) * buttonsPerSet < totalPages) {
    currentSet++;
    renderNumberButtons();
  }
});

firstArrow.addEventListener('click', () => {
  if (currentSet > 0) {
    currentSet--;
    renderNumberButtons();
  }
});

// Dropdown filter toggles
let selectedItems = document.querySelectorAll(".selected");
selectedItems.forEach(selected => {
  selected.addEventListener("click", function () {
    document.querySelectorAll(".showinner").forEach(drop => {
      if (drop !== selected.nextElementSibling) {
        drop.style.display = "none";
      }
    });

    document.querySelectorAll(".imagee").forEach(img => {
      if (img !== selected.querySelector(".imagee")) {
        img.style.transform = "rotate(0deg)";
      }
    });

    const dropdown = selected.nextElementSibling;
    const arrow = selected.querySelector(".imagee");

    if (dropdown.style.display === "grid" || dropdown.style.display === "block") {
      dropdown.style.display = "none";
      arrow.style.transform = "rotate(0deg)";
    } else {
      dropdown.style.display = "grid";
      arrow.style.transform = "rotate(180deg)";
    }
  });
});

// Filter logic for dropdown <li> clicks
document.querySelectorAll('#showinner li').forEach(item => {
  item.addEventListener('click', async function () {
    const selectedText = item.textContent.trim();
    const parentDropdown = item.closest('.dropdown');
    const category = parentDropdown.querySelector('h1').textContent.trim();

    let filterKey = '';
    if (category === 'Species') filterKey = 'species';
    if (category === 'Status') filterKey = 'status';
    if (category === 'Gender') filterKey = 'gender';

    list.innerHTML = "";

    try {
      for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        const data = await response.json();
        const characters = data.results;

        characters.forEach(character => {
          if (character[filterKey].toLowerCase() === selectedText.toLowerCase()) {
            
            displayCharacter(character);
          }
        });
      }
    } catch (err) {
      console.error("Filtering error:", err);
    }
  });
});
function restalldata(){
renderNumberButtons();
loadCharactersByPage(1);  

}

// Initial render
renderNumberButtons();
loadCharactersByPage(1);

