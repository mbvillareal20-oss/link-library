const searchInput = document.getElementById('search');
const linkList = document.getElementById('linkList');
const submitButton = document.getElementById('submitLink');
const formMessage = document.getElementById('formMessage');
const newName = document.getElementById('newName');
const newURL = document.getElementById('newURL');
const newCategory = document.getElementById('newCategory');

const formName = document.getElementById('formName');
const formURL = document.getElementById('formURL');
const formCategory = document.getElementById('formCategory');
const hiddenForm = document.getElementById('hiddenForm');

const categoryColors = {};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

// Add a card to the page
function addLinkCard(Name, URL, Category) {
  const key = Category.toLowerCase();
  if (!categoryColors[key]) categoryColors[key] = getRandomColor();

  const card = document.createElement("div");
  card.classList.add("link-card");
  card.innerHTML = `<a href="${URL}" target="_blank">${Name}</a>
                    <span class="category" style="background:${categoryColors[key]}">${Category}</span>`;
  linkList.appendChild(card);
}

// Fetch links from your Apps Script Web App
function fetchLinks() {
  fetch("https://script.google.com/macros/s/AKfycbypGNjElBRpIoWiTyMuuv4shp8FV3hH0pTNx9eoyMepMj36D6Qk7Oo3plEMgCINW_0q/exec")
    .then(res => res.json())
    .then(data => {
      linkList.innerHTML = "";
      data.forEach(item => addLinkCard(item.Name, item.URL, item.Category));
    })
    .catch(err => console.error("Error fetching links:", err));
}

// Initial fetch
fetchLinks();

// Filter links
searchInput.addEventListener("input", function () {
  const filter = this.value.toLowerCase();
  Array.from(linkList.getElementsByClassName("link-card")).forEach(card => {
    const text = card.querySelector("a").textContent.toLowerCase();
    card.style.display = text.includes(filter) ? "" : "none";
  });
});

// Add new link using hidden form
submitButton.addEventListener("click", () => {
  const Name = newName.value.trim();
  const URL = newURL.value.trim();
  const Category = newCategory.value.trim();

  if (!Name || !URL || !Category) {
    formMessage.textContent = "⚠️ All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  // Set hidden form values
  formName.value = Name;
  formURL.value = URL;
  formCategory.value = Category;

  // Submit hidden form to Apps Script
  hiddenForm.submit();

  // Feedback
  formMessage.textContent = "✅ Link sent! Refresh to see it in the list.";
  formMessage.style.color = "green";

  // Optional: add immediately to page
  addLinkCard(Name, URL, Category);

  // Clear input fields
  newName.value = "";
  newURL.value = "";
  newCategory.value = "";
});
