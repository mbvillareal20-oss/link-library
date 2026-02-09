const searchInput = document.getElementById('search');
const linkList = document.getElementById('linkList');
const submitButton = document.getElementById('submitLink');
const formMessage = document.getElementById('formMessage');
const newName = document.getElementById('newName');
const newURL = document.getElementById('newURL');
const newCategory = document.getElementById('newCategory');

// Replace with your Apps Script Web App URL
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxbiKtJ5QK-avmDnkVeoGxukrrldVQUnYS7QxTcO4yTig0eoDtMFmFHuHpx4oJ6ObI/exec"; 

const categoryColors = {};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for(let i=0;i<6;i++) color += letters[Math.floor(Math.random()*16)];
  return color;
}

// Fetch links from Google Sheet
function fetchLinks() {
  fetch(SHEET_API_URL)
    .then(res => res.json())
    .then(data => {
      linkList.innerHTML = "";
      data.forEach(item => {
        const categoryKey = item.Category.toLowerCase();
        if (!categoryColors[categoryKey]) categoryColors[categoryKey] = getRandomColor();

        const li = document.createElement("li");
        li.dataset.category = categoryKey;
        li.innerHTML = `
          <a href="${item.URL}" target="_blank">${item.Name}</a>
          <span class="category" style="background:${categoryColors[categoryKey]}">${item.Category}</span>
        `;
        linkList.appendChild(li);
      });
    })
    .catch(err => console.error("Error fetching links:", err));
}

fetchLinks();

// Search filter
searchInput.addEventListener('input', function() {
  const filter = this.value.toLowerCase();
  Array.from(linkList.getElementsByTagName('li')).forEach(li => {
    const text = li.querySelector('a').textContent.toLowerCase();
    li.style.display = text.includes(filter) ? '' : 'none';
  });
});

// Add link form
submitButton.addEventListener('click', () => {
  const Name = newName.value.trim();
  const URL = newURL.value.trim();
  const Category = newCategory.value.trim();

  if (!Name || !URL || !Category) {
    formMessage.textContent = "All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  const newLink = { Name, URL, Category };

  fetch(SHEET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newLink)
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      formMessage.textContent = "Link added successfully!";
      formMessage.style.color = "green";

      // Clear form
      newName.value = "";
      newURL.value = "";
      newCategory.value = "";

      // Add link immediately to DOM
      const categoryKey = Category.toLowerCase();
      if (!categoryColors[categoryKey]) categoryColors[categoryKey] = getRandomColor();

      const li = document.createElement("li");
      li.dataset.category = categoryKey;
      li.innerHTML = `
        <a href="${URL}" target="_blank">${Name}</a>
        <span class="category" style="background:${categoryColors[categoryKey]}">${Category}</span>
      `;
      linkList.appendChild(li);
    } else {
      formMessage.textContent = "Failed to add link!";
      formMessage.style.color = "red";
    }
  })
  .catch(err => {
    console.error(err);
    formMessage.textContent = "Error adding link!";
    formMessage.style.color = "red";
  });
});
