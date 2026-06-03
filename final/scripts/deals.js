import { buildCard, buildModal } from './utils.mjs';

let allFlights = [];

// Modal
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

if (modalClose) {
  modalClose.addEventListener('click', () => modal.close());
}
if (modal) {
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
}

function attachCardListeners(container) {
  container.querySelectorAll('.fc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const flight = allFlights.find(f => f.id === Number(btn.dataset.id));
      if (flight) openModal(flight);
    });
  });
}

// Render grid
function renderDeals(flights) {
  const grid = document.getElementById('deals-grid');
  const count = document.getElementById('deals-count');
  if (!grid) return;

  grid.innerHTML = flights.length
    ? flights.map(f => buildCard(f)).join('')
    : '<p class="no-results">No flights match the current filters.</p>';

  if (count) count.textContent = `${flights.length} deal${flights.length !== 1 ? 's' : ''} found`;
  attachCardListeners(grid);
}

// Filter + sort
function applyFilters() {
  const category = document.getElementById('filter-category').value;
  const maxPrice = Number(document.getElementById('filter-price').value) || Infinity;
  const stopsVal = document.getElementById('filter-stops').value;
  const sortBy   = document.getElementById('sort-by').value;

  // Save filter state
  localStorage.setItem('fg-deals-filters', JSON.stringify({ category, maxPrice: maxPrice === Infinity ? '' : maxPrice, stopsVal, sortBy }));

  let results = allFlights.filter(f => {
    const matchCat   = category === 'all' || f.category === category;
    const matchPrice = f.price <= maxPrice;
    const matchStops = stopsVal === 'any' || String(f.stops) === stopsVal;
    return matchCat && matchPrice && matchStops;
  });

  if (sortBy === 'price-asc')  results = [...results].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') results = [...results].sort((a, b) => b.price - a.price);
  if (sortBy === 'duration')   results = [...results].sort((a, b) => {
    const toMin = s => { const [h, m] = s.split('h '); return parseInt(h) * 60 + parseInt(m); };
    return toMin(a.duration) - toMin(b.duration);
  });

  renderDeals(results);
}

function initFilters() {
  ['filter-category', 'filter-price', 'filter-stops', 'sort-by'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });

  // Price range display
  const rangeEl = document.getElementById('filter-price');
  const rangeVal = document.getElementById('price-val');
  if (rangeEl && rangeVal) {
    rangeEl.addEventListener('input', () => {
      rangeVal.textContent = rangeEl.value >= rangeEl.max ? 'Any' : `$${rangeEl.value}`;
    });
  }

  // Restore saved filters
  const saved = localStorage.getItem('fg-deals-filters');
  if (saved) {
    try {
      const { category, maxPrice, stopsVal, sortBy } = JSON.parse(saved);
      const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
      set('filter-category', category);
      set('filter-price', maxPrice);
      set('filter-stops', stopsVal);
      set('sort-by', sortBy);
      if (rangeVal && maxPrice) rangeVal.textContent = !maxPrice ? 'Any' : `$${maxPrice}`;
    } catch (_) {}
  }

  document.getElementById('reset-filters')?.addEventListener('click', () => {
    ['filter-category', 'filter-stops', 'sort-by'].forEach(id => {
      const el = document.getElementById(id); if (el) el.selectedIndex = 0;
    });
    const pr = document.getElementById('filter-price');
    if (pr) { pr.value = pr.max; if (rangeVal) rangeVal.textContent = 'Any'; }
    localStorage.removeItem('fg-deals-filters');
    renderDeals(allFlights);
  });
}

async function init() {
  try {
    const res  = await fetch('data/flights.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allFlights = await res.json();
    renderDeals(allFlights);
    initFilters();
  } catch (err) {
    console.error('Failed to load flights:', err);
    const grid = document.getElementById('deals-grid');
    if (grid) grid.innerHTML = '<p class="error-msg">Could not load flight data. Please try again later.</p>';
  }
}

init();
