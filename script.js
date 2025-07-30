let characterButton = document.getElementById("characater");
let frontpage = document.getElementById("frontPage");
let homeButton = document.getElementById("homebutton");
let secodCharacter = document.getElementById("showAllData");
let totalPage = 42;
let searchdata = document.getElementById('searchdata');
const list = document.getElementById('characterList');

let activeFilters = {
  species: null,
  status: null,
  gender: null
};

// Show character section
characterButton.addEventListener('click', function () {
  frontpage.style.display = "none";
  secodCharacter.style.display = "flex";
  searchdata.style.display = "flex";
  loadCharactersByPage(1);
  renderNumberButtons();
});

// Show home page
homeButton.addEventListener('click', function () {
  frontpage.style.display = "flex";
  secodCharacter.style.display = "none";
  searchdata.style.display = "none";
});

let matched = false;
// Search functionality
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener('click', async function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (!searchTerm) return;

  list.innerHTML = "";
  try {
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
    });

    numberContainer.insertBefore(numberDiv, dots);
  }

  numberArrow.style.display = end < totalPages ? 'grid' : 'none';
  dots.style.display = end < totalPages ? 'grid' : 'none';
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

let selectedItems = document.querySelectorAll(".selected");

selectedItems.forEach(selected => {
  selected.addEventListener("click", function () {

    // Pehle sab dropdowns close han
    selectedItems.forEach(item => {
      const dropdown = item.nextElementSibling;
      const arrow = item.querySelector(".imagee");
      if (item !== selected) {
        dropdown.style.display = "none";
        if (arrow) arrow.style.transform = "rotate(0deg)";
      }
    });
    // Ab current dropdown toggle karen gy
    const dropdown = selected.nextElementSibling;
    const arrow = selected.querySelector(".imagee");

    if (dropdown.style.display === "grid" || dropdown.style.display === "block") {
      dropdown.style.display = "none";
      arrow.style.transform = "rotate(0deg)";
    }
     else {
      dropdown.style.display = "grid"; 
      arrow.style.transform = "rotate(180deg)";
    }
  });
});

//  Filter Logic 
document.querySelectorAll('#showinner li').forEach(item => {
  item.addEventListener('click', async function () {
    const selectedText = item.textContent.trim();
    const parentDropdown = item.closest('.dropdown');
    const category = parentDropdown.querySelector('h1').textContent.trim().toLowerCase();

    if (['species', 'status', 'gender'].includes(category)) {
      activeFilters[category] = selectedText;
      list.innerHTML = "";
    }

    let matchFound = false; 

    try {
      for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        const data = await response.json();
        const characters = data.results;

        characters.forEach(character => {
          const matchSpecies = !activeFilters.species || character.species.toLowerCase() === activeFilters.species.toLowerCase();
          const matchStatus = !activeFilters.status || character.status.toLowerCase() === activeFilters.status.toLowerCase();
          const matchGender = !activeFilters.gender || character.gender.toLowerCase() === activeFilters.gender.toLowerCase();

          if (matchSpecies && matchStatus && matchGender) {
            matchFound = true;
            displayCharacter(character);
          }
        });
      }

      if (!matchFound) {
        list.innerHTML = "<p class='text-xl text-red-600 font-bold'>No characters found with that name.</p>";
      }

    } catch (err) {
      console.error("Filtering error:", err);
    }
  });
});


// Clear filters and reset 
function clearFilters() {
  activeFilters = { species: null, status: null, gender: null };
  loadCharactersByPage(1);
}

//  render
renderNumberButtons();
loadCharactersByPage(1);
