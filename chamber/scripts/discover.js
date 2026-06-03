import { discoverItems } from '../data/discover.mjs';

// Last-visit message via localStorage
const visitBanner = document.getElementById('visit-message');
if (visitBanner) {
  const lastVisit = localStorage.getItem('slc-discover-last-visit');
  const now = Date.now();

  let message;
  if (!lastVisit) {
    message = 'Welcome! Let us know if you have any questions.';
  } else {
    const diffMs  = now - Number(lastVisit);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) {
      message = 'Back so soon! Awesome!';
    } else {
      const unit = diffDays === 1 ? 'day' : 'days';
      message = `You last visited ${diffDays} ${unit} ago.`;
    }
  }

  visitBanner.textContent = message;
  visitBanner.classList.add('visible');
  localStorage.setItem('slc-discover-last-visit', String(now));
}

// Build discovery cards
const grid = document.getElementById('discover-grid');
if (grid) {
  discoverItems.forEach(item => {
    const card = document.createElement('article');
    card.className = 'discover-card';
    card.style.gridArea = item.id;
    card.innerHTML = `
      <figure class="dc-figure">
        <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" width="300" height="200">
      </figure>
      <div class="dc-body">
        <h2 class="dc-title">${item.name}</h2>
        <address class="dc-address">${item.address}</address>
        <p class="dc-desc">${item.description}</p>
        <button class="dc-btn" type="button">Learn More</button>
      </div>
    `;
    grid.appendChild(card);
  });
}
