let characterButton = document.getElementById("characater");
let frontpage = document.getElementById("frontPage");
let homeButton = document.getElementById("homebutton");
let secodCharacter = document.getElementById("showAllData");
let totalPage = 42;
let searchdata = document.getElementById('searchdata');
const list = document.getElementById('characterList');
let bottom = document.getElementById('bottom');

const numberContainer = document.getElementById('numbers');
const numberArrow = document.getElementById('lastArrow');
const firstArrow = document.getElementById('firstArrow');
const dots = document.getElementById('dots');
const totalPages = 42;
let currentPage = 1;

let activeFilters = {
  species: null,
  status: null,
  gender: null
};

// Show character
characterButton.addEventListener('click', function () {
  frontpage.style.display = "none";
  secodCharacter.style.display = "block";
  searchdata.style.display = "flex";
  bottom.style.display = "none";
  loadCharactersByPage(1);
  renderNumberButtons();
});
// Show home page
homeButton.addEventListener('click', function () {
  location.reload();
});
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

// Search functionality
// if search fast its not working fix this
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchInput.addEventListener('input', async function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm === "" || searchTerm.length <= "") {
    loadCharactersByPage(1);
    renderNumberButtons();
    document.getElementById('numbers').style.display = "flex";
    return;
  }
  list.innerHTML = "";

  let allMatchedCharacters = [];
  try {
    for (let page = 1; page <= totalPage; page++) {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await response.json();
      const characters = data.results;

      characters.forEach(character => {
        if (character.name.toLowerCase().includes(searchTerm)) {
          allMatchedCharacters.push(character);
        }
      });
    }

    const itemsPerPage = 20;
    let searchPage = 1;
    const totalSearchPages = Math.ceil(allMatchedCharacters.length / itemsPerPage);

    function renderSearchPage(page) {
      list.innerHTML = "";
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageCharacters = allMatchedCharacters.slice(start, end);
      pageCharacters.forEach(displayCharacter);

      if (allMatchedCharacters.length > itemsPerPage) {
        document.getElementById('numbers').style.display = "flex";
      } else {
        document.getElementById('numbers').style.display = "none";
      }
    }

    function renderSearchPagination() {
      numberContainer.innerHTML = "";

      // Left arrow
      const leftBtn = document.createElement('button');
      leftBtn.id = "firstArrow";
      leftBtn.type = "button";
      leftBtn.className = "w-[30px] h-[30px] max-sm:w-[27px] max-sm:h-[27px] hover:bg-slate-500 rounded-[10px] flex items-center justify-center font-extrabold bg-red-700 cursor-pointer";
      leftBtn.innerHTML = `<img class="rotate-90 w-4" src="/images/downChevron.png" alt="error" />`;
      leftBtn.onclick = () => {
        if (searchPage > 1) {
          searchPage--;
          renderSearchPage(searchPage);
          renderSearchPagination();
        }
      };
      numberContainer.appendChild(leftBtn);

      // Helper to create a page button
      function createPageBtn(page) {
        const btn = document.createElement('div');
        // give div id 
        btn.id = `page-${page}`;
        btn.textContent = page;
        btn.className = `blue h-[30px] w-[30px] hover:bg-slate-500 max-sm:w-[27px] max-sm:h-[27px] rounded-full flex items-center justify-center cursor-pointer text-sm font-semibold ${
          page === searchPage ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'
        }`;
        btn.onclick = () => {
          searchPage = page;
          renderSearchPage(searchPage);
          renderSearchPagination();
        };
        return btn;
      }

      // Always show first page
      numberContainer.appendChild(createPageBtn(1));

      // Show left dots if needed
      if (searchPage > 4) {
        const leftDots = document.createElement('div');
        leftDots.textContent = '...';
        leftDots.className = 'h-[30px] w-[30px] hover:bg-slate-500 rounded-full flex items-center justify-center text-sm font-semibold max-sm:w-[27px] max-sm:h-[27px] bg-orange-500 text-white';
        numberContainer.appendChild(leftDots);
      }

      // Calculate range to show around searchPage
      let start = Math.max(2, searchPage - 1);
      let end = Math.min(totalSearchPages - 1, searchPage + 1);

      if (searchPage <= 3) {
        start = 2;
        end = 4;
      }
      if (searchPage >= totalSearchPages - 2) {
        start = totalSearchPages - 3;
        end = totalSearchPages - 1;
      }

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalSearchPages) {
          numberContainer.appendChild(createPageBtn(i));
        }
      }

      // Show right dots
      if (searchPage < totalSearchPages - 2) {
        const rightDots = document.createElement('div');
        rightDots.textContent = '...';
        rightDots.className = 'h-[30px] w-[30px] hover:bg-slate-500 rounded-full flex items-center justify-center text-sm font-semibold max-sm:w-[27px] max-sm:h-[27px] bg-orange-500 text-white';
        numberContainer.appendChild(rightDots);
      }

      // Always show last page if more than 1
      if (totalSearchPages > 1) {
        numberContainer.appendChild(createPageBtn(totalSearchPages));
      }

      // Right arrow
      const rightBtn = document.createElement('button');
      rightBtn.id = "lastArrow";
      rightBtn.type = "button";
      rightBtn.className = "w-[30px] hover:bg-slate-500 h-[30px] rounded-[10px] max-sm:w-[27px] max-sm:h-[27px] flex items-center justify-center font-extrabold bg-red-700 cursor-pointer";
      rightBtn.innerHTML = `<img class="rotate-[273deg] w-4" src="/images/downChevron.png" alt="error" />`;
      rightBtn.onclick = () => {
        if (searchPage < totalSearchPages) {
          searchPage++;
          renderSearchPage(searchPage);
          renderSearchPagination();
        }
      };
      numberContainer.appendChild(rightBtn);
    }

    if (allMatchedCharacters.length === 0) {
      list.innerHTML = "<p class='text-xl text-red-600 font-bold'>No characters found with that name.</p>";
      document.getElementById('numbers').style.display = "none";
    } else {
      searchPage = 1;
      renderSearchPage(searchPage);
      if (allMatchedCharacters.length > itemsPerPage) {
        renderSearchPagination();
      } else {
        document.getElementById('numbers').style.display = "none";
      }
    }
  } catch (error) {
    console.error("Search error:", error);
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


// Pagination logic 
function renderNumberButtons() {
  // Clear all except arrows
  [...numberContainer.querySelectorAll('div')].forEach(btn => {
    if (btn !== numberArrow && btn !== firstArrow) btn.remove();
  });
  
  if (!numberContainer.contains(firstArrow)) {
    numberContainer.insertBefore(firstArrow, numberContainer.firstChild);
    document.getElementById('firstArrow').style.display = "none";
  }
  if (!numberContainer.contains(numberArrow)) {
    numberContainer.appendChild(numberArrow);
    document.getElementById('lastArrow').style.display = "none";
  }
  // Helper to create a page button
  function createPageBtn(page) {
    const btn = document.createElement('div');
    btn.textContent = page;
    btn.className = `blue h-[30px] w-[30px] hover:bg-slate-500 max-sm:w-[27px] max-sm:h-[27px] rounded-full flex items-center justify-center cursor-pointer text-sm font-semibold ${
      page === currentPage ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'
    }`;
    btn.addEventListener('click', () => {
      currentPage = page;
      loadCharactersByPage(currentPage);
      renderNumberButtons();
    });
    return btn;
  }
  // Insert first arrow
  numberContainer.insertBefore(firstArrow, numberContainer.firstChild);
  // Always show first page
  numberContainer.insertBefore(createPageBtn(1), numberArrow);
  // Show left dots if needed
  if (currentPage > 4) {
    const leftDots = document.createElement('div');
    leftDots.textContent = '...';
    leftDots.className = 'h-[30px] w-[30px] hover:bg-slate-500 rounded-full flex items-center justify-center text-sm font-semibold max-sm:w-[27px] max-sm:h-[27px] bg-orange-500 text-white';
    numberContainer.insertBefore(leftDots, numberArrow);
  }

  // Calculate range to show around currentPage
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);
  // Adjust if near start or end
  if (currentPage <= 3) {
    start = 2;
    end = 4;
  }
  if (currentPage >= totalPages - 2) {
    start = totalPages - 3;
    end = totalPages - 1;
  }

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < totalPages) {
      numberContainer.insertBefore(createPageBtn(i), numberArrow);
    }
  }

  // Show right dots
  if (currentPage < totalPages - 2) {
    const rightDots = document.createElement('div');
    rightDots.textContent = '...';
    rightDots.className = 'h-[30px] w-[30px] hover:bg-slate-500 rounded-full flex items-center justify-center text-sm font-semibold max-sm:w-[27px] max-sm:h-[27px] bg-orange-500 text-white';
    numberContainer.insertBefore(rightDots, numberArrow);
  }
  // Always show last page if more than 1
  if (totalPages > 1) {
    numberContainer.insertBefore(createPageBtn(totalPages), numberArrow);
  }
}

numberArrow.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadCharactersByPage(currentPage);
    renderNumberButtons();
  }
});
firstArrow.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadCharactersByPage(currentPage);
    renderNumberButtons();
  }
});

let selectedItems = document.querySelectorAll(".selected");

selectedItems.forEach(selected => {
  selected.addEventListener("click", function () {
    selectedItems.forEach(item => {
      const dropdown = item.nextElementSibling;
      const arrow = item.querySelector(".imagee");
      if (item !== selected) {
        dropdown.style.display = "none";
        if (arrow) arrow.style.transform = "rotate(0deg)";
      }
    });

    const dropdown = selected.nextElementSibling;
    const arrow = selected.querySelector(".imagee");

    if (dropdown.style.display === "grid" || dropdown.style.display === "block") {
      dropdown.style.display = "none";
      if (arrow) arrow.style.transform = "rotate(0deg)";
    } else {
      dropdown.style.display = "grid";
      if (arrow) arrow.style.transform = "rotate(180deg)";
    }
  });
});

// Filter logic
document.querySelectorAll('#showinner li').forEach(item => {
  item.addEventListener('click', async function () {
    const selectedText = item.textContent.trim();
    const parentDropdown = item.closest('.dropdown');
    const category = parentDropdown.querySelector('h1').textContent.trim().toLowerCase();
    const arrow = parentDropdown.querySelector('.imagee');
    const dropdownList = parentDropdown.querySelector("ul");

  
    const allItems = parentDropdown.querySelectorAll('li');
    allItems.forEach(li => li.classList.remove('active-filter'));
    item.classList.add('active-filter');

    if (dropdownList) dropdownList.style.display = "none";
    if (arrow) arrow.style.transform = "rotate(0deg)";

    list.innerHTML = "";

    if (['species', 'status', 'gender'].includes(category)) {
      activeFilters[category] = selectedText;
    }

    let filteredCharacters = [];

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
            filteredCharacters.push(character);
          }
        });
      }

      // Pagination for filtered results
      const itemsPerPage = 20;
      let filterPage = 1;

      function renderFilteredPage(page) {
        list.innerHTML = "";
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageCharacters = filteredCharacters.slice(start, end);
        pageCharacters.forEach(displayCharacter);

        // Show/hide pagination
        if (filteredCharacters.length > itemsPerPage) {
          document.getElementById('numbers').style.display = "flex";
        } else {
          document.getElementById('numbers').style.display = "none";
        }
      }

      // Custom pagination for filtered results (with ... and arrows)
      function renderFilteredPagination() {
        numberContainer.innerHTML = "";

        // Left arrow
        const leftBtn = document.createElement('button');
        leftBtn.id = "firstArrow";
        leftBtn.type = "button";
        leftBtn.className = "w-[30px] h-[30px] max-sm:w-[27px] max-sm:h-[27px] hover:bg-slate-500 rounded-[10px] flex items-center justify-center font-extrabold bg-red-700 cursor-pointer";
        leftBtn.innerHTML = `<img class="rotate-90 w-4" src="/images/downChevron.png" alt="error" />`;
        leftBtn.onclick = () => {
          if (filterPage > 1) {
            filterPage--;
            renderFilteredPage(filterPage);
            renderFilteredPagination();
          }
        };
        numberContainer.appendChild(leftBtn);

        const totalFilteredPages = Math.ceil(filteredCharacters.length / itemsPerPage);

        // Helper to create a page button
        function createPageBtn(page) {
          const btn = document.createElement('div');
          btn.textContent = page;
          btn.className = `blue h-[30px] w-[30px] hover:bg-slate-500 max-sm:w-[27px] max-sm:h-[27px] rounded-full flex items-center justify-center cursor-pointer text-sm font-semibold ${
            page === filterPage ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'
          }`;
          btn.onclick = () => {
            filterPage = page;
            renderFilteredPage(filterPage);
            renderFilteredPagination();
          };
          return btn;
        }

        // Always show first page
        numberContainer.appendChild(createPageBtn(1));

        // Show left dots if needed
        if (filterPage > 4) {
          const leftDots = document.createElement('div');
          leftDots.textContent = '...';
          leftDots.className = 'h-[30px] w-[30px] hover:bg-slate-500 rounded-full flex items-center justify-center text-sm font-semibold max-sm:w-[27px] max-sm:h-[27px] bg-orange-500 text-white';
          numberContainer.appendChild(leftDots);
        }

        // Calculate range to show around filterPage
        let start = Math.max(2, filterPage - 1);
        let end = Math.min(totalFilteredPages - 1, filterPage + 1);

        if (filterPage <= 3) {
          start = 2;
          end = 4;
        }
        if (filterPage >= totalFilteredPages - 2) {
          start = totalFilteredPages - 3;
          end = totalFilteredPages - 1;
        }

        for (let i = start; i <= end; i++) {
          if (i > 1 && i < totalFilteredPages) {
            numberContainer.appendChild(createPageBtn(i));
          }
        }

        // Show right dots
        if (filterPage < totalFilteredPages - 2) {
          const rightDots = document.createElement('div');
          rightDots.textContent = '...';
          rightDots.className = 'h-[30px] w-[30px] hover:bg-slate-500 rounded-full flex items-center justify-center text-sm font-semibold max-sm:w-[27px] max-sm:h-[27px] bg-orange-500 text-white';
          numberContainer.appendChild(rightDots);
        }

        // Always show last page if more than 1
        if (totalFilteredPages > 1) {
          numberContainer.appendChild(createPageBtn(totalFilteredPages));
        }

        // Right arrow
        const rightBtn = document.createElement('button');
        rightBtn.id = "lastArrow";
        rightBtn.type = "button";
        rightBtn.className = "w-[30px] hover:bg-slate-500 h-[30px] rounded-[10px] max-sm:w-[27px] max-sm:h-[27px] flex items-center justify-center font-extrabold bg-red-700 cursor-pointer";
        rightBtn.innerHTML = `<img class="rotate-[273deg] w-4" src="/images/downChevron.png" alt="error" />`;
        rightBtn.onclick = () => {
          if (filterPage < totalFilteredPages) {
            filterPage++;
            renderFilteredPage(filterPage);
            renderFilteredPagination();
          }
        };
        numberContainer.appendChild(rightBtn);
      }

      if (filteredCharacters.length === 0) {
        list.innerHTML = "<p class='text-xl text-red-600 font-bold'>No characters found with that filter.</p>";
        document.getElementById('numbers').style.display = "none";
      } else {
        filterPage = 1;
        renderFilteredPage(filterPage);
        renderFilteredPagination();
      }

    } catch (err) {
      console.error("Filtering error:", err);
    }
  });
});

// Clear filters and back to postion 
function clearFilters() {
  activeFilters = { species: null, status: null, gender: null };

  document.querySelectorAll(".imagee").forEach(arrow => {
    arrow.style.transform = "rotate(0deg)";
  });
  document.querySelectorAll(".dropdown ul").forEach(ul => {
    ul.style.display = "none";
  });

  document.querySelectorAll('li.active-filter').forEach(li => {
    li.classList.remove('active-filter');
  });
  
  document.getElementById('species').textContent = "Species";
  document.getElementById('status').textContent = "Status";
  document.getElementById('Gender').textContent = "Gender";

  searchInput.value = "";
  document.getElementById('numbers').style.display = "flex";
  currentPage = 1;
  renderNumberButtons();
  list.innerHTML = "";
  loadCharactersByPage(1);
}

// Render initially
renderNumberButtons();
loadCharactersByPage(1);
