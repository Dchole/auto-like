const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach(checkbox => {
  chrome.storage.sync.get(checkbox.id, res => {
    setChecked(checkbox, res[checkbox.id]);
  });

  checkbox.addEventListener("change", _ => {
    if (checkbox.checked) setAriaChecked(checkbox, true);
    else setAriaChecked(checkbox, false);

    chrome.storage.sync.set({
      [checkbox.id]: checkbox.checked
    });
  });
});

function setAriaChecked(checkbox, value) {
  checkbox.setAttribute("aria-checked", `${value}`);
}

function setChecked(checkbox, value) {
  checkbox.checked = value;
  setAriaChecked(checkbox, value);
}
