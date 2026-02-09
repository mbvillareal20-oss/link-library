const searchInput = document.getElementById('search');
const linkList = document.getElementById('linkList');
const submitButton = document.getElementById('submitLink');
const formMessage = document.getElementById('formMessage');
const newName = document.getElementById('newName');
const newURL = document.getElementById('newURL');
const newCategory = document.getElementById('newCategory');

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz17JF_tQaD7GK8hSkZY7qiQXye2etSmDdRh0bKgLcICnrboYvwFGGggdtkjehsbvta/exechttps://script.google.com/macros/s/AKfycbyUjDhZQg-x5hlzk-8PTp-MuHFDQSIV41vi91OrAIGSnAuHorX_c3X2xcjfkCa9CfgE/exec"; // replace with your Apps Script URL

const categoryColors = {}; // store dynamic colors

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for(let i=0;i<6;i++) color += letters[Math.floor(Math.random()*16)];
  return color;
}

function fetchLinks() {
  fetch(SHEET_API_URL)
    .then(res => res.json())
    .then(data => {
      linkList.innerHTML = "";

      data.forEach(item => {
        // assign dynamic color if not exists
        if (!categoryColors[item.Category.toLowerCase()]) {
          categoryColors[item.Category.toLowerCase()] = getRandomColor();
        }

        const li = document.createElement("li");
        li.dataset.category = item.Category.toLowerCase();
        li.innerHTML = `
          <a href="${item.URL}" target="_blank">${item.Name}</a>
          <span class="category" style="background:${categoryColors[item.Category.toLowerCase()]}">${item.Category}</span>
        `;
        linkList.appendChild(li);
      });
    })
    .catch(err => console.error("Error fetching links:", err));
}

fetchLinks();

searchInput.addEventListener('input', function() {
  const filter = this.value.toLowerCase();
  Array.from(linkList.getElementsByTagName('li')).forEach(li => {
    const text = li.querySelector('a').textContent.toLowerCase();
    li.style.display = text.includes(filter) ? '' : 'none';
  });
});

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
        newName.value = "";
        newURL.value = "";
        newCategory.value = "";
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
