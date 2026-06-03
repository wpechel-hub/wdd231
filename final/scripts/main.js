// Navigation hamburger
const menuBtn    = document.getElementById('menu-btn');
const primaryNav = document.getElementById('primary-nav');

if (menuBtn && primaryNav) {
  menuBtn.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
    menuBtn.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', primaryNav.classList.contains('open'));
  });
}

// Light mode toggle (dark is default per brand; toggle adds body.light)
if (localStorage.getItem('fg-light') === 'true') {
  document.body.classList.add('light');
}

const darkToggle = document.getElementById('dark-toggle');
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('fg-light', document.body.classList.contains('light'));
  });
}

// Footer year + last modified
const yr  = document.getElementById('copy-year');
const mod = document.getElementById('last-mod');
if (yr)  yr.textContent  = new Date().getFullYear();
if (mod) mod.textContent = document.lastModified;
