// OpenWeatherMap API — sign up free at openweathermap.org to get your key
const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
const LAT = 40.7608;
const LON = -111.8910;

async function getWeather() {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&cnt=24&appid=${API_KEY}`)
    ]);

    if (!currentRes.ok || !forecastRes.ok) throw new Error('Weather API error');

    const [current, forecast] = await Promise.all([currentRes.json(), forecastRes.json()]);

    displayWeather(current);
    displayForecast(forecast);
  } catch (err) {
    console.error('Weather fetch failed:', err);
    document.getElementById('weather-desc').textContent = 'Weather unavailable';
  }
}

function displayWeather(data) {
  document.getElementById('weather-temp').textContent = `${Math.round(data.main.temp)}°F`;
  document.getElementById('weather-desc').textContent = data.weather[0].description;
  document.getElementById('w-high').textContent = `${Math.round(data.main.temp_max)}°`;
  document.getElementById('w-low').textContent = `${Math.round(data.main.temp_min)}°`;
  document.getElementById('w-humidity').textContent = `${data.main.humidity}%`;

  const fmt = { hour: 'numeric', minute: '2-digit' };
  document.getElementById('w-sunrise').textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], fmt);
  document.getElementById('w-sunset').textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString([], fmt);

  const icon = data.weather[0].icon;
  const desc = data.weather[0].description;
  document.getElementById('weather-icon-wrap').innerHTML =
    `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" width="64" height="64">`;
}

function displayForecast(data) {
  const days = [];
  const seen = new Set();
  const todayStr = new Date().toDateString();

  for (const item of data.list) {
    const date = new Date(item.dt * 1000);
    const key = date.toDateString();
    if (!seen.has(key) && days.length < 3) {
      seen.add(key);
      days.push({ date, temp: item.main.temp });
    }
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  days.forEach((d, i) => {
    const label = d.date.toDateString() === todayStr ? 'Today' : dayNames[d.date.getDay()];
    document.getElementById(`fc-day${i + 1}`).textContent = label;
    document.getElementById(`fc-temp${i + 1}`).textContent = `${Math.round(d.temp)}°F`;
  });
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

getWeather();
getSpotlights();
