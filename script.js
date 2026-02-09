const searchInput = document.getElementById("search");
const linkList = document.getElementById("linkList");
const addLinkForm = document.getElementById("addLinkForm");
const linkNameInput = document.getElementById("linkName");
const linkURLInput = document.getElementById("linkURL");
const linkCategoryInput = document.getElementById("linkCategory");

let links = [];

// Load existing links from JSON
fetch("links.json")
  .then(res => res.json())
  .then(data => {
    links = data;
    displayLinks(links);
  })
  .catch(err => console.error("Error loading links.json:", err));

// Display links function
function displayLinks(linkArray) {
  linkList.innerHTML = "";
  linkArray.forEach(link => {
    const li = document.createElement("li");
    li.dataset.category = link.category.toLowerCase();
    li.innerHTML = `<a href="${link.url}" target="_blank">${link.name}</a>
                    <span>${link.category}</span>`;
    linkList.appendChild(li);
  });
}

// Filter/search
searchInput.addEventListener("keyup", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = links.filter(link =>
    link.name.toLowerCase().includes(value) ||
    link.category.toLowerCase().includes(value)
  );
  displayLinks(filtered);
});

// Add new link dynamically
addLinkForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newLink = {
    name: linkNameInput.value,
    url: linkURLInput.value,
    category: linkCategoryInput.value
  };

  links.push(newLink);
  displayLinks(links);

  // Clear form
  linkNameInput.value = "";
  linkURLInput.value = "";
  linkCategoryInput.value = "";
});
