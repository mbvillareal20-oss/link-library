const searchInput = document.getElementById('search');
const linkList = document.getElementById('linkList');

// Your Google Apps Script Web App URL
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz17JF_tQaD7GK8hSkZY7qiQXye2etSmDdRh0bKgLcICnrboYvwFGGggdtkjehsbvta/exec";

// Fetch links dynamically
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

// Search functionality
searchInput.addEventListener('input', function() {
  const filter = this.value.toLowerCase();
  const links = linkList.getElementsByTagName('li');
  Array.from(links).forEach(li => {
    const text = li.querySelector('a').textContent.toLowerCase();
    li.style.display = text.includes(filter) ? '' : 'none';
  });
});
