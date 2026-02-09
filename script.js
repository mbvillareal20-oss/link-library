const searchInput = document.getElementById('search');
const linkList = document.getElementById('linkList');
const submitButton = document.getElementById('submitLink');
const formMessage = document.getElementById('formMessage');
const newName = document.getElementById('newName');
const newURL = document.getElementById('newURL');
const newCategory = document.getElementById('newCategory');

const categoryColors = {};

// === Airtable settings ===
const BASE_ID = "YOUR_BASE_ID"; // replace
const TABLE_NAME = "Links";     // exact table name
const API_KEY = "YOUR_API_KEY"; // replace

const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

// Random color for category badges
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for(let i=0;i<6;i++) color += letters[Math.floor(Math.random()*16)];
  return color;
}

// Add a link card to the page
function addLinkCard(Name, URL, Category){
  const key = Category.toLowerCase();
  if(!categoryColors[key]) categoryColors[key] = getRandomColor();

  const card = document.createElement("div");
  card.classList.add("link-card");
  card.innerHTML = `<a href="${URL}" target="_blank">${Name}</a>
                    <span class="category" style="background:${categoryColors[key]}">${Category}</span>`;
  linkList.appendChild(card);
}

// Fetch all links from Airtable
function fetchLinks(){
  fetch(API_URL + "?maxRecords=1000", {
    headers: { "Authorization": `Bearer ${API_KEY}` }
  })
    .then(res => res.json())
    .then(data => {
      linkList.innerHTML = "";
      data.records.forEach(r => {
        addLinkCard(r.fields.Name, r.fields.URL, r.fields.Category);
      });
    })
    .catch(err => console.error("Error fetching links:", err));
}

// Initial fetch
fetchLinks();

// Search/filter links
searchInput.addEventListener("input", function(){
  const filter = this.value.toLowerCase();
  Array.from(linkList.getElementsByClassName("link-card")).forEach(card => {
    const text = card.querySelector("a").textContent.toLowerCase();
    card.style.display = text.includes(filter) ? "" : "none";
  });
});

// Add new link to Airtable
submitButton.addEventListener("click", () => {
  const Name = newName.value.trim();
  const URL = newURL.value.trim();
  const Category = newCategory.value.trim();

  if(!Name || !URL || !Category){
    formMessage.textContent = "⚠️ All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      records: [{ fields: { Name, URL, Category } }]
    })
  })
    .then(res => res.json())
    .then(data => {
      formMessage.textContent = "✅ Link added successfully!";
      formMessage.style.color = "green";
      addLinkCard(Name, URL, Category);

      // Clear input fields
      newName.value = "";
      newURL.value = "";
      newCategory.value = "";
    })
    .catch(err => {
      console.error(err);
      formMessage.textContent = "⚠️ Error adding link!";
      formMessage.style.color = "red";
    });
});
