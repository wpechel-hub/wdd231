const tips = [
  {
    icon: "✈️",
    title: "Book 6–8 Weeks Ahead",
    body: "Domestic flights hit their sweet spot 6–8 weeks before departure. For international routes, book 3–6 months out to lock in the best fares before prices climb.",
    category: "booking"
  },
  {
    icon: "📅",
    title: "Fly on Tuesdays and Wednesdays",
    body: "Mid-week flights are consistently cheaper than weekend departures. Airlines release fare sales on Monday evenings, so Tuesday and Wednesday often see the lowest prices of the week.",
    category: "booking"
  },
  {
    icon: "🔔",
    title: "Set Fare Alerts",
    body: "Use Google Flights, Hopper, or Kayak to set price alerts for your target routes. When the price drops to your desired level, you'll get an instant notification.",
    category: "booking"
  },
  {
    icon: "🌐",
    title: "Use Incognito Mode",
    body: "Airlines and booking sites track your visits and may raise prices the more you search. Open a private or incognito browsing window to see prices without the tracking bias.",
    category: "booking"
  },
  {
    icon: "🔄",
    title: "Mix and Match Airlines",
    body: "Booking the outbound leg on one carrier and the return on another can save significantly. Just leave enough buffer time between connections when booking separate tickets.",
    category: "booking"
  },
  {
    icon: "🧳",
    title: "Travel with Only a Carry-On",
    body: "Checked bag fees add $30–$60 each way. Pack light with a personal item that fits under the seat and a carry-on in the overhead bin — it's free on most airlines.",
    category: "packing"
  },
  {
    icon: "📦",
    title: "Use Packing Cubes",
    body: "Compression packing cubes let you fit far more into a carry-on than you'd expect. They also keep your bag organized so security checks are faster.",
    category: "packing"
  },
  {
    icon: "💳",
    title: "Get a Travel Credit Card",
    body: "Cards like Chase Sapphire Preferred or Capital One Venture earn points on everyday spending. A single sign-up bonus is often enough for a free roundtrip flight.",
    category: "money"
  },
  {
    icon: "💱",
    title: "Never Exchange Currency at Airports",
    body: "Airport exchange kiosks charge brutal rates. Use your bank's international ATM card or a no-foreign-fee card abroad to get near-interbank exchange rates.",
    category: "money"
  },
  {
    icon: "🍜",
    title: "Eat Where Locals Eat",
    body: "Restaurants near tourist attractions charge 2–3× more for the same food. Walk a few blocks away and eat where you see locals — better food, a fraction of the price.",
    category: "money"
  },
  {
    icon: "🏨",
    title: "Book Refundable Rates First",
    body: "Book a refundable hotel rate when you first buy your flight. If prices drop closer to your trip, cancel and rebook at the lower rate.",
    category: "accommodation"
  },
  {
    icon: "🏙️",
    title: "Stay Just Outside the City Center",
    body: "Hotels a 10–15 minute metro ride from the center are often half the price. You'll spend slightly more time commuting but save hundreds of dollars on accommodation.",
    category: "accommodation"
  }
];

function renderTips(category = 'all') {
  const grid = document.getElementById('tips-grid');
  if (!grid) return;

  const filtered = category === 'all' ? tips : tips.filter(t => t.category === category);

  grid.innerHTML = filtered.map(tip => `
    <article class="tip-card">
      <div class="tip-icon" aria-hidden="true">${tip.icon}</div>
      <div class="tip-body">
        <h2 class="tip-title">${tip.title}</h2>
        <p class="tip-text">${tip.body}</p>
      </div>
    </article>
  `).join('');
}

function init() {
  renderTips();

  const saved = localStorage.getItem('fg-tips-category');
  if (saved) {
    const btn = document.querySelector(`[data-category="${saved}"]`);
    if (btn) {
      document.querySelectorAll('.tip-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTips(saved);
    }
  }

  document.querySelectorAll('.tip-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tip-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      localStorage.setItem('fg-tips-category', cat);
      renderTips(cat);
    });
  });
}

init();
