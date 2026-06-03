import { buildCard, buildDestCard, buildModal } from './utils.mjs';

let allFlights = [];

// ── Modal ─────────────────────────────────────────────────
const modal     = document.getElementById('flight-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

function openModal(flight) {
  modalBody.innerHTML = buildModal(flight);
  modal.showModal();
  modal.querySelector('.btn-book').addEventListener('click', () => {
    alert(`Booking for ${flight.destinationCity} is not available in this demo.`);
  });
}
if (modalClose) modalClose.addEventListener('click', () => modal.close());
if (modal)      modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

function attachListeners(container) {
  container.querySelectorAll('[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const flight = allFlights.find(f => f.id === Number(btn.dataset.id));
      if (flight) openModal(flight);
    });
  });
}

// ── Search form (registered immediately — not inside async) ────
const form = document.getElementById('search-form');

if (form) {
  // Swap origin ↔ destination
  document.getElementById('swap-btn')?.addEventListener('click', () => {
    const fromEl = document.getElementById('sf-from');
    const toEl   = document.getElementById('sf-to');
    if (fromEl && toEl) [fromEl.value, toEl.value] = [toEl.value, fromEl.value];
  });

  // Trip type tabs
  document.querySelectorAll('.trip-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.trip-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const returnField = document.getElementById('return-field');
      if (returnField) returnField.hidden = tab.dataset.trip === 'oneway';
      localStorage.setItem('fg-trip-type', tab.dataset.trip);
    });
  });

  // Restore trip type
  const savedTrip = localStorage.getItem('fg-trip-type');
  if (savedTrip) {
    document.querySelectorAll('.trip-tab').forEach(t => t.classList.toggle('active', t.dataset.trip === savedTrip));
    const returnField = document.getElementById('return-field');
    if (returnField) returnField.hidden = savedTrip === 'oneway';
  }

  // Submit — always intercepts the form
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (allFlights.length === 0) {
      showMessage('Flight data is loading. Make sure you are using Live Server and try again.');
      return;
    }

    // Strip airport code like "(DEN)" so "Denver (DEN)" matches just "denver"
    const rawDest = (form.querySelector('[name="destination"]')?.value || '').trim();
    const dest    = rawDest.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
    const stops   = form.querySelector('[name="stops"]')?.value || 'any';

    let results = allFlights.filter(f => {
      const matchDest  = !dest
        || f.destinationCity.toLowerCase().includes(dest)
        || f.country.toLowerCase().includes(dest)
        || f.destination.toLowerCase().includes(dest);
      const matchStops = stops === 'any' || String(f.stops) === stops;
      return matchDest && matchStops;
    });

    results = [...results].sort((a, b) => a.price - b.price);
    localStorage.setItem('fg-last-search', JSON.stringify({ dest }));
    renderResults(results);
  });

  // Restore last search destination
  const saved = localStorage.getItem('fg-last-search');
  if (saved) {
    try {
      const { dest } = JSON.parse(saved);
      const toEl = document.getElementById('sf-to');
      if (dest && toEl) toEl.value = dest;
    } catch (_) {}
  }
}

// ── Render helpers ────────────────────────────────────────

function showMessage(msg) {
  const section = document.getElementById('search-results');
  const count   = document.getElementById('results-count');
  const grid    = document.getElementById('results-grid');
  if (!section) return;
  section.hidden = false;
  if (count) count.textContent = '';
  if (grid)  grid.innerHTML = `<p class="error-msg">${msg}</p>`;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderResults(results) {
  const section = document.getElementById('search-results');
  const count   = document.getElementById('results-count');
  const grid    = document.getElementById('results-grid');
  if (!section || !grid) return;

  section.hidden = false;
  if (count) count.textContent = results.length === 0
    ? 'No flights found — try a different destination.'
    : `${results.length} flight${results.length !== 1 ? 's' : ''} found`;

  grid.innerHTML = results.length
    ? results.map(f => buildCard(f)).join('')
    : '<p class="no-results">No matches. Try a broader search.</p>';

  attachListeners(grid);
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderFeatured(flights) {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const top3 = [...flights].sort((a, b) => a.price - b.price).slice(0, 3);
  grid.innerHTML = top3.map(f => buildDestCard(f)).join('');
  attachListeners(grid);
}

function populateDatalist(flights) {
  const list = document.getElementById('dest-list');
  if (!list) return;
  const cities = [...new Set(flights.map(f => `${f.destinationCity} (${f.destination})`))].sort();
  list.innerHTML = cities.map(c => `<option value="${c}">`).join('');
}

// ── Fetch data ────────────────────────────────────────────

async function init() {
  try {
    const res = await fetch('data/flights.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allFlights = await res.json();
    renderFeatured(allFlights);
    populateDatalist(allFlights);
  } catch (err) {
    console.error('Failed to load flights:', err);
    const grid = document.getElementById('featured-grid');
    if (grid) grid.innerHTML = '<p class="error-msg">Could not load flight data. Please open the site with Live Server.</p>';
  }
}

init();
