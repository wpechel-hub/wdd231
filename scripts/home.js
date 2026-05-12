'use strict';

// ── Req #12: Footer – year and last modified via JavaScript ───────────────
document.getElementById('copy-year').textContent = new Date().getFullYear();
document.getElementById('last-mod').textContent  = document.lastModified;

// ── Req #5: Mobile nav toggle (wayfinding) ────────────────────────────────
const menuBtn = document.getElementById('menu-btn');
const nav     = document.getElementById('primary-nav');

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
});

nav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  })
);

// ── Req #8: Course objects array ─────────────────────────────────────────
const courses = [
  {
    subject:     'CSE',
    number:      110,
    title:       'Introduction to Programming',
    credits:     2,
    certificate: 'Web and Computer Programming',
    description: 'Introduction to computer programming using Python, covering basic syntax, control flow, and problem solving.',
    completed:   true,
  },
  {
    subject:     'WDD',
    number:      130,
    title:       'Web Fundamentals',
    credits:     2,
    certificate: 'Web and Computer Programming',
    description: 'Introduction to web development covering HTML, CSS, and the fundamentals of building web pages.',
    completed:   true,
  },
  {
    subject:     'CSE',
    number:      111,
    title:       'Programming with Functions',
    credits:     2,
    certificate: 'Web and Computer Programming',
    description: 'Deeper study of programming focusing on functions, modules, and file handling in Python.',
    completed:   true,
  },
  {
    subject:     'CSE',
    number:      210,
    title:       'Programming with Classes',
    credits:     2,
    certificate: 'Web and Computer Programming',
    description: 'Object-oriented programming concepts using Python, including classes, inheritance, and design patterns.',
    completed:   true,
  },
  {
    subject:     'WDD',
    number:      131,
    title:       'Dynamic Web Fundamentals',
    credits:     2,
    certificate: 'Web and Computer Programming',
    description: 'Expands on web basics by introducing JavaScript, DOM manipulation, and dynamic content creation.',
    completed:   true,
  },
  {
    subject:     'WDD',
    number:      231,
    title:       'Front-end Web Development I',
    credits:     2,
    certificate: 'Web and Computer Programming',
    description: 'Advanced front-end development including responsive design, APIs, and modern JavaScript techniques.',
    completed:   false,
  },
];

// ── Req #10: Total credits using reduce ──────────────────────────────────
function displayTotalCredits(list) {
  const total = list.reduce((sum, course) => sum + course.credits, 0);
  document.getElementById('total-credits').textContent = total;
}

// ── Req #8: Build and render course cards ────────────────────────────────
function buildCard(course) {
  const card = document.createElement('div');
  card.classList.add('course-card');
  if (course.completed) card.classList.add('completed');

  const badgeHTML = course.completed
    ? '<span class="course-badge badge-completed">Completed</span>'
    : '<span class="course-badge badge-progress">In Progress</span>';

  card.innerHTML = `
    <p class="course-code">${course.subject} ${course.number}</p>
    <p class="course-title">${course.title}</p>
    <div class="course-meta">
      <span class="course-credits">${course.credits} credits</span>
      ${badgeHTML}
    </div>`;

  return card;
}

function renderCourses(list) {
  const grid = document.getElementById('course-grid');
  grid.innerHTML = '';
  list.forEach(c => grid.appendChild(buildCard(c)));
  displayTotalCredits(list);
}

// ── Req #9: Filter by subject ─────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const filtered = filter === 'all'
      ? courses
      : courses.filter(c => c.subject === filter);

    renderCourses(filtered);
  });
});

// Initial render – show all
renderCourses(courses);
