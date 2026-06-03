export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

export function stopsLabel(stops) {
  if (stops === 0) return 'Nonstop';
  return stops === 1 ? '1 Stop' : `${stops} Stops`;
}

export function stopsClass(stops) {
  if (stops === 0) return 'tag-nonstop';
  if (stops === 1) return 'tag-one';
  return 'tag-multi';
}

// Google Flights–style list card (airline colors via data-airline CSS attribute selectors)
export function buildCard(flight) {
  const price    = formatPrice(flight.price);
  const stops    = stopsLabel(flight.stops);
  const stopsCls = stopsClass(flight.stops);
  const depDate  = new Date(flight.departure).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const catLabel = flight.category === 'domestic' ? 'Domestic' : 'International';

  return `
    <article class="flight-card" data-id="${flight.id}" data-price="${flight.price}" data-stops="${flight.stops}" data-category="${flight.category}">
      <div class="fc-airline-row">
        <span class="fc-badge" data-airline="${flight.airlineCode}" aria-hidden="true">${flight.airlineCode}</span>
        <span class="fc-airline-name">${flight.airline}</span>
        <span class="fc-flag" aria-hidden="true">${flight.flag}</span>
        <span class="fc-price">${price}</span>
      </div>

      <div class="fc-route-row">
        <div class="fc-time-col">
          <span class="fc-time">${flight.departureTime}</span>
          <span class="fc-iata">${flight.origin}</span>
          <span class="fc-city-name">${flight.originCity}</span>
        </div>

        <div class="fc-middle">
          <span class="fc-duration-label">${flight.duration}</span>
          <div class="fc-flight-line" aria-hidden="true">
            <span class="fc-dot"></span>
            <span class="fc-bar"></span>
            <span class="fc-plane-icon">✈</span>
          </div>
          <span class="fc-tag ${stopsCls}">${stops}</span>
        </div>

        <div class="fc-time-col fc-time-col--right">
          <span class="fc-time">${flight.arrivalTime}</span>
          <span class="fc-iata">${flight.destination}</span>
          <span class="fc-city-name">${flight.destinationCity}</span>
        </div>
      </div>

      <div class="fc-bottom-row">
        <span class="fc-depart-date">${depDate} · ${catLabel}</span>
        <button class="fc-btn" type="button" data-id="${flight.id}">View Deal</button>
      </div>
    </article>
  `;
}

// Destination visual card for home page featured section
export function buildDestCard(flight) {
  const price = formatPrice(flight.price);
  return `
    <article class="dest-card" data-id="${flight.id}">
      <figure class="dest-figure">
        <img src="${flight.image}" alt="${flight.destinationCity}, ${flight.country}" loading="lazy" width="320" height="200">
        <div class="dest-overlay">
          <span class="dest-flag" aria-hidden="true">${flight.flag}</span>
          <span class="dest-price">From ${price}</span>
        </div>
      </figure>
      <div class="dest-body">
        <h3 class="dest-city">${flight.destinationCity}</h3>
        <p class="dest-meta">${flight.country} · ${flight.duration}</p>
        <p class="dest-airline">
          <span class="fc-badge fc-badge--sm" data-airline="${flight.airlineCode}" aria-hidden="true">${flight.airlineCode}</span>
          ${flight.airline}
        </p>
      </div>
      <button class="dest-btn" type="button" data-id="${flight.id}">View Deal</button>
    </article>
  `;
}

export function buildModal(flight) {
  const price    = formatPrice(flight.price);
  const stops    = stopsLabel(flight.stops);
  const stopsCls = stopsClass(flight.stops);
  const date     = new Date(flight.departure).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return `
    <div class="modal-img-wrap">
      <img src="${flight.image}" alt="${flight.destinationCity}" width="560" height="240" loading="lazy">
      <div class="modal-img-overlay">
        <span class="modal-flag" aria-hidden="true">${flight.flag}</span>
        <span class="modal-dest-name">${flight.destinationCity}, ${flight.country}</span>
      </div>
    </div>
    <div class="modal-detail">
      <div class="modal-airline-row">
        <span class="fc-badge" data-airline="${flight.airlineCode}" aria-hidden="true">${flight.airlineCode}</span>
        <span class="modal-airline">${flight.airline}</span>
        <span class="modal-price">${price}</span>
      </div>
      <p class="modal-desc">${flight.description}</p>
      <dl class="modal-dl">
        <div class="modal-row"><dt>Route</dt><dd>${flight.originCity} (${flight.origin}) → ${flight.destinationCity} (${flight.destination})</dd></div>
        <div class="modal-row"><dt>Schedule</dt><dd>${flight.departureTime} → ${flight.arrivalTime}</dd></div>
        <div class="modal-row"><dt>Duration</dt><dd>${flight.duration}</dd></div>
        <div class="modal-row"><dt>Stops</dt><dd><span class="fc-tag ${stopsCls}">${stops}</span></dd></div>
        <div class="modal-row"><dt>Date</dt><dd>${date}</dd></div>
        <div class="modal-row"><dt>Category</dt><dd class="modal-category">${flight.category}</dd></div>
      </dl>
      <button class="btn-book" type="button">Book This Flight</button>
    </div>
  `;
}
