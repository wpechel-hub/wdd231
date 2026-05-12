const menuButton = document.querySelector("#menu-btn");
const primaryNav = document.querySelector("#primary-nav");
const darkToggle = document.querySelector("#dark-toggle");

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    primaryNav.classList.toggle("open");
    menuButton.classList.toggle("open");

    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", !expanded);
  });
}

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

const copyYear = document.querySelector("#copy-year");
const lastMod = document.querySelector("#last-mod");

if (copyYear) {
  copyYear.textContent = new Date().getFullYear();
}

if (lastMod) {
  lastMod.textContent = document.lastModified;
}