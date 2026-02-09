submitButton.addEventListener("click", () => {
  const Name = newName.value.trim();
  const URL = newURL.value.trim();
  const Category = newCategory.value.trim();

  if (!Name || !URL || !Category) {
    formMessage.textContent = "⚠️ All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  // Use URLSearchParams to send form data
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
