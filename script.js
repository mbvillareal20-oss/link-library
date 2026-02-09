const searchInput = document.getElementById('search');
const linkList = document.getElementById('linkList');

// Form elements
const submitButton = document.getElementById('submitLink');
const formMessage = document.getElementById('formMessage');
const newName = document.getElementById('newName');
const newURL = document.getElementById('newURL');
const newCategory = document.getElementById('newCategory');

// Your Google Apps Script Web App URL
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz17JF_tQaD7GK8hSkZY7qiQXye2etSmDdRh0bKgLcICnrboYvwFGGggdtkjehsbvta/exec";

// --- Function to fetch links ---
function fetchLinks() {
  fetch(SHEET_API_URL)
    .then(res => res.json())
    .then(data => {
      linkList.innerHTML = ""; // Clear existing content

      data.forEach(item => {
        const li = document.createElement("li");
        li.dataset.category = item.Category.toLowerCase();
        li.innerHTML = `
          <a href="${item.URL}" target="_blank">${item.Name}</a>
          <span class="category">${item.Category}</span>
        `;
        linkList.appendChild(li);
      });
    })
    .catch(err => console.error("Error fetching links:", err));
}

// Initial load
fetchLinks();

// --- Search functionality ---
searchInput.addEventListener('input', function() {
  const filter = this.value.toLowerCase();
  const links = linkList.getElementsByTagName('li');
  Array.from(links).forEach(li => {
    const text = li.querySelector('a').textContent.toLowerCase();
    li.style.display = text.includes(filter) ? '' : 'none';
  });
});

// --- Add New Link form functionality ---
submitButton.addEventListener('click', () => {
  const Name = newName.value.trim();
  const URL = newURL.value.trim();
  const Category = newCategory.value.trim();

  if (!Name || !URL || !Category) {
    formMessage.textContent = "All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  fetch(SHEET_API_URL, {
    method: "POST",
    body: JSON.stringify({ Name, URL, Category })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        formMessage.textContent = "Link added successfully!";
        formMessage.style.color = "green";

        // Clear form fields
        newName.value = "";
        newURL.value = "";
        newCategory.value = "";

        // Refresh link list
        fetchLinks();
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
