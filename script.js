const searchInput = document.getElementById('search');
const linkList = document.getElementById('linkList');
const submitButton = document.getElementById('submitLink');
const formMessage = document.getElementById('formMessage');
const newName = document.getElementById('newName');
const newURL = document.getElementById('newURL');
const newCategory = document.getElementById('newCategory');

const categoryColors = {};

// Replace with your deployed Apps Script Web App URL
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbypGNjElBRpIoWiTyMuuv4shp8FV3hH0pTNx9eoyMepMj36D6Qk7Oo3plEMgCINW_0q/exec";

// Random color generator for categories
function getRandomColor(){
  const letters = "0123456789ABCDEF";
  let color = "#";
  for(let i=0;i<6;i++) color += letters[Math.floor(Math.random()*16)];
  return color;
}

// Add a card to the page
function addLinkCard(Name, URL, Category){
  const key = Category.toLowerCase();
  if(!categoryColors[key]) categoryColors[key] = getRandomColor();

  const card = document.createElement("div");
  card.classList.add("link-card");
  card.innerHTML = `<a href="${URL}" target="_blank">${Name}</a>
                    <span class="category" style="background:${categoryColors[key]}">${Category}</span>`;
  linkList.appendChild(card);
}

// Fetch existing links from Google Sheets
function fetchLinks(){
  fetch(SHEET_API_URL)
    .then(res => res.json())
    .then(data => {
      linkList.innerHTML = "";
      data.forEach(item => addLinkCard(item.Name, item.URL, item.Category));
    })
    .catch(err => console.error("Error fetching links:", err));
}

// Initial fetch
fetchLinks();

// Filter/search links
searchInput.addEventListener("input", function(){
  const filter = this.value.toLowerCase();
  Array.from(linkList.getElementsByClassName("link-card")).forEach(card => {
    const text = card.querySelector("a").textContent.toLowerCase();
    card.style.display = text.includes(filter) ? "" : "none";
  });
});

// Add new link to Google Sheet
submitButton.addEventListener("click", () => {
  const Name = newName.value.trim();
  const URL = newURL.value.trim();
  const Category = newCategory.value.trim();

  if(!Name || !URL || !Category){
    formMessage.textContent = "⚠️ All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  const params = new URLSearchParams();
  params.append("Name", Name);
  params.append("URL", URL);
  params.append("Category", Category);

  fetch(SHEET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  })
    .then(res => res.json())
    .then(data => {
      if(data.status === "success"){
        formMessage.textContent = "✅ Link added successfully!";
        formMessage.style.color = "green";

        // Clear inputs
        newName.value = "";
        newURL.value = "";
        newCategory.value = "";

        // Auto-refresh the link list
        fetchLinks();
      } else {
        formMessage.textContent = "❌ Failed to add link: " + data.message;
        formMessage.style.color = "red";
      }
    })
    .catch(err => {
      console.error(err);
      formMessage.textContent = "⚠️ Error adding link!";
      formMessage.style.color = "red";
    });
});
