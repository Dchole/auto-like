console.log("Popup Scripts");

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach(checkbox => {
  checkbox.addEventListener("change", _ => {
    if (checkbox.checked) {
      checkbox.checked = true;
      checkbox.setAttribute("aria-checked", "true");
    } else {
      checkbox.checked = false;
      checkbox.setAttribute("aria-checked", "false");
    }

    chrome.storage.sync.set({
      [checkbox.id]: checkbox.checked
    });
  });
});
