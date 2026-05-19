const LAT = 40.7608;
const LON = -111.8910;

async function getWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset` +
      `&timezone=America%2FDenver&temperature_unit=fahrenheit&forecast_days=4`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();

    displayWeather(data);
    displayForecast(data);
  } catch (err) {
    console.error('Weather fetch failed:', err);
    document.getElementById('weather-desc').textContent = 'Weather unavailable';
  }
}

function wmoDescription(code) {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 48) return 'Foggy';
  if (code <= 55) return 'Drizzle';
  if (code <= 65) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  return 'Thunderstorm';
}

function formatTime12h(isoStr) {
  const [h, m] = isoStr.split('T')[1].split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function displayWeather(data) {
  const c = data.current;
  const d = data.daily;

  document.getElementById('weather-temp').textContent = `${Math.round(c.temperature_2m)}°F`;
  document.getElementById('weather-desc').textContent = wmoDescription(c.weather_code);
  document.getElementById('w-high').textContent = `${Math.round(d.temperature_2m_max[0])}°`;
  document.getElementById('w-low').textContent = `${Math.round(d.temperature_2m_min[0])}°`;
  document.getElementById('w-humidity').textContent = `${c.relative_humidity_2m}%`;
  document.getElementById('w-sunrise').textContent = formatTime12h(d.sunrise[0]);
  document.getElementById('w-sunset').textContent = formatTime12h(d.sunset[0]);
}

function displayForecast(data) {
  const d = data.daily;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 1; i <= 3; i++) {
    const date = new Date(d.time[i] + 'T12:00:00');
    document.getElementById(`fc-day${i}`).textContent = dayNames[date.getDay()];
    document.getElementById(`fc-temp${i}`).textContent = `${Math.round(d.temperature_2m_max[i])}°F`;
  }
}

async function getSpotlights() {
  try {
    const res = await fetch('./data/members.json');
    if (!res.ok) throw new Error('Failed to load members');
    const data = await res.json();

    const eligible = data.members.filter(m => m.membership >= 2);
    const shuffled = eligible.sort(() => Math.random() - 0.5);
    const count = shuffled.length >= 3 && Math.random() < 0.5 ? 3 : 2;

    displaySpotlights(shuffled.slice(0, count));
  } catch (err) {
    console.error('Spotlights fetch failed:', err);
  }
}

function displaySpotlights(members) {
  const container = document.getElementById('spotlights');
  container.innerHTML = members.map(m => {
    const levelText = m.membership === 3 ? 'Gold' : 'Silver';
    const levelClass = m.membership === 3 ? 'gold' : 'silver';
    return `
      <div class="spotlight-card">
        <div class="spotlight-card-top">
          <h3 class="spotlight-name">${m.name}</h3>
          <p class="spotlight-tagline">${m.tagline}</p>
        </div>
        <div class="spotlight-card-body">
          <div class="spotlight-logo">
            <img src="./images/${m.image}" alt="${m.name} logo" loading="lazy">
          </div>
          <div class="spotlight-contact">
            <p><strong>Phone</strong> ${m.phone}</p>
            <p><strong>Addr</strong> ${m.address}</p>
            <p><strong>URL</strong> <a href="${m.website}" target="_blank" rel="noopener">${m.websiteText}</a></p>
            <span class="spotlight-badge badge-${levelClass}">${levelText} Member</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

function startClocks() {
  const slcEl = document.getElementById('clock-slc');
  if (!slcEl) return;

  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });

  function tick() {
    slcEl.textContent = fmt.format(new Date());
  }
  tick();
  setInterval(tick, 1000);
}

getWeather();
getSpotlights();
startClocks();
