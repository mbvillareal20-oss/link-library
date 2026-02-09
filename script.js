submitButton.addEventListener("click", () => {
  const Name = newName.value.trim();
  const URL = newURL.value.trim();
  const Category = newCategory.value.trim();

  if (!Name || !URL || !Category) {
    formMessage.textContent = "⚠️ All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  fetch(SHEET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Name, URL, Category })
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
