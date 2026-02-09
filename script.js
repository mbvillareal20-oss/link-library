const searchInput = document.getElementById('search');
const linkList = document.getElementById('linkList');
const submitButton = document.getElementById('submitLink');
const formMessage = document.getElementById('formMessage');
const newName = document.getElementById('newName');
const newURL = document.getElementById('newURL');
const newCategory = document.getElementById('newCategory');

// Replace with your deployed Apps Script URL
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbypGNjElBRpIoWiTyMuuv4shp8FV3hH0pTNx9eoyMepMj36D6Qk7Oo3plEMgCINW_0q/exec";

const categoryColors = {};

// Random color generator for categories
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Fetch all links from Google Sheet
function fetchLinks() {
  fetch(SHEET_API_URL)
    .then(res => res.json())
    .then(data => {
      linkList.innerHTML = ""; // clear existing
      data.forEach(item => {
        addLinkCard(item.Name, item.URL, item.Category);
      });
    })
    .catch(err => console.error("Error fetching links:", err));
}

// Add a link card to the page
function addLinkCard(Name, URL, Category) {
  const categoryKey = Category.toLowerCase();
  if (!categoryColors[categoryKey]) {
    categoryColors[categoryKey] = getRandomColor();
  }

  const card = document.createElement("div");
  card.classList.add("link-card");
  card.innerHTML = `
    <a href="${URL}" target="_blank">${Name}</a>
    <span class="category" style="background:${categoryColors[categoryKey]}">${Category}</span>
  `;
  linkList.appendChild(card);
}

// Initial fetch
fetchLinks();

// Search/filter functionality
searchInput.addEventListener("input", function() {
  const filter = this.value.toLowerCase();
  Array.from(linkList.getElementsByClassName("link-card")).forEach(card => {
    const text = card.querySelector("a").textContent.toLowerCase();
    card.style.display = text.includes(filter) ? "" : "none";
  });
});

// Add new link
submitButton.addEventListener("click", () => {
  const Name = newName.value.trim();
  const URL = newURL.value.trim();
  const Category = newCategory.value.trim();

  if (!Name || !URL || !Category) {
    formMessage.textContent = "⚠️ All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  // Send URL-encoded POST to Apps Script
  const params = new URLSearchParams();
  params.append("Name", Name);
  params.append("URL", URL);
  params.append("Category", Category);

  fetch(SHEET_API_URL, {
    method: "POST",
    body: params
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        formMessage.textContent = "✅ Link added successfully!";
        formMessage.style.color = "green";
        newName.value = "";
        newURL.value = "";
        newCategory.value = "";
        addLinkCard(Name, URL, Category);
      } else {
        formMessage.textContent = "❌ Failed to add link: " + data.message;
        formMessage.style.color = "red";
        console.error(data);
      }
    })
    .catch(err => {
      console.error(err);
      formMessage.textContent = "⚠️ Error adding link!";
      formMessage.style.color = "red";
    });
});
