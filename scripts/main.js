'use strict';

document.getElementById('copy-year').textContent = new Date().getFullYear();
document.getElementById('last-mod').textContent  = document.lastModified;

const menuBtn = document.getElementById('menu-btn');
const nav     = document.getElementById('primary-nav');

menuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
  menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

nav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  })
);

const darkBtn = document.getElementById('dark-toggle');

function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  localStorage.setItem('slc-theme', dark ? 'dark' : 'light');
}

const saved = localStorage.getItem('slc-theme');
if (saved) {
  setTheme(saved === 'dark');
} else {
  setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

darkBtn.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));

const members = [
  {
    name:       'Red Iguana',
    tagline:    'Legendary Mexican Cuisine Since 1985',
    email:      'info@rediguana.com',
    phone:      '(801) 322-1489',
    url:        'rediguana.com',
    initials:   'RI',
    membership: 'Gold',
  },
  {
    name:       'Ken Sanders Rare Books',
    tagline:    "Salt Lake City's Premier Antiquarian Bookshop",
    email:      'info@kensandersbooks.com',
    phone:      '(801) 521-3819',
    url:        'kensandersbooks.com',
    initials:   'KS',
    membership: 'Silver',
  },
  {
    name:       'The Leonardo Museum',
    tagline:    'Where Art, Science & Technology Converge',
    email:      'info@theleonardo.org',
    phone:      '(801) 531-9800',
    url:        'theleonardo.org',
    initials:   'TL',
    membership: 'Gold',
  },
  {
    name:       "Squatter's Pub Brewery",
    tagline:    "Utah's Original Craft Brewery",
    email:      'hello@squatters.com',
    phone:      '(801) 363-2739',
    url:        'squatters.com',
    initials:   'SP',
    membership: 'Silver',
  },
  {
    name:       'RoHa Brewing Project',
    tagline:    'Craft Beer Brewed in the Heart of SLC',
    email:      'hello@rohabrewing.com',
    phone:      '(801) 906-8474',
    url:        'rohabrewing.com',
    initials:   'RH',
    membership: 'Gold',
  },
];

function buildSpotlightCard(member) {
  const badgeClass = member.membership === 'Gold' ? 'badge-gold' : 'badge-silver';

  const card = document.createElement('div');
  card.classList.add('spotlight-card');
  card.innerHTML = `
    <div class="spotlight-card-top">
      <p class="spotlight-name">${member.name}</p>
      <p class="spotlight-tagline">${member.tagline}</p>
    </div>
    <div class="spotlight-card-body">
      <div class="spotlight-logo" aria-hidden="true">${member.initials}</div>
      <div class="spotlight-contact">
        <p><strong>EMAIL</strong> ${member.email}</p>
        <p><strong>PHONE</strong> ${member.phone}</p>
        <p><strong>URL</strong> ${member.url}</p>
        <span class="spotlight-badge ${badgeClass}">${member.membership} Member</span>
      </div>
    </div>`;
  return card;
}

function renderSpotlights() {
  const container = document.getElementById('spotlights');
  if (!container) return;

  const eligible = members.filter(m => m.membership === 'Gold' || m.membership === 'Silver');

  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }

  eligible.slice(0, 3).forEach(m => container.appendChild(buildSpotlightCard(m)));
}

renderSpotlights();

const SLC_LAT = 40.7608;
const SLC_LON = -111.8910;

const WMO_DESC = {
  0: 'Clear Sky',       1: 'Mainly Clear',    2: 'Partly Cloudy',
  3: 'Overcast',        45: 'Foggy',           48: 'Icy Fog',
  51: 'Light Drizzle',  53: 'Drizzle',         55: 'Heavy Drizzle',
  61: 'Light Rain',     63: 'Rain',            65: 'Heavy Rain',
  71: 'Light Snow',     73: 'Snow',            75: 'Heavy Snow',
  77: 'Snow Grains',    80: 'Rain Showers',    81: 'Showers',
  82: 'Heavy Showers',  85: 'Snow Showers',    86: 'Heavy Snow Showers',
  95: 'Thunderstorm',   96: 'Thunderstorm',    99: 'Thunderstorm',
};

function parseLocalTime(isoStr) {
  const [, time] = isoStr.split('T');
  let [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

async function loadWeather() {
  try {
    const url = [
      'https://api.open-meteo.com/v1/forecast',
      `?latitude=${SLC_LAT}&longitude=${SLC_LON}`,
      '&current=temperature_2m,relative_humidity_2m,weather_code',
      '&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset',
      '&temperature_unit=fahrenheit',
      '&timezone=America%2FDenver',
      '&forecast_days=3',
    ].join('');

    const data  = await fetch(url).then(r => r.json());
    const cur   = data.current;
    const daily = data.daily;

    document.getElementById('weather-temp').textContent = `${Math.round(cur.temperature_2m)}°F`;
    document.getElementById('weather-desc').textContent = WMO_DESC[cur.weather_code] ?? 'Unknown';
    document.getElementById('w-high').textContent       = `${Math.round(daily.temperature_2m_max[0])}°`;
    document.getElementById('w-low').textContent        = `${Math.round(daily.temperature_2m_min[0])}°`;
    document.getElementById('w-humidity').textContent   = `${cur.relative_humidity_2m}%`;
    document.getElementById('w-sunrise').textContent    = parseLocalTime(daily.sunrise[0]);
    document.getElementById('w-sunset').textContent     = parseLocalTime(daily.sunset[0]);

    const dayIds  = ['fc-day1',  'fc-day2',  'fc-day3'];
    const tempIds = ['fc-temp1', 'fc-temp2', 'fc-temp3'];

    daily.time.slice(0, 3).forEach((dateStr, i) => {
      const label = i === 0
        ? 'Today'
        : new Date(`${dateStr}T12:00`).toLocaleDateString('en-US', {
            weekday:  'long',
            timeZone: 'America/Denver',
          });
      document.getElementById(dayIds[i]).textContent  = label;
      document.getElementById(tempIds[i]).textContent = `${Math.round(daily.temperature_2m_max[i])}°F`;
    });

  } catch (err) {
    console.warn('Weather unavailable:', err.message);
  }
}

loadWeather();
