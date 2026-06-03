const params = new URLSearchParams(window.location.search);

const fields = [
  { key: 'first-name',  label: 'First Name' },
  { key: 'last-name',   label: 'Last Name' },
  { key: 'email',       label: 'Email Address' },
  { key: 'phone',       label: 'Mobile Phone' },
  { key: 'org-name',    label: 'Business / Organization' },
  { key: 'timestamp',   label: 'Submitted At' },
];

const container = document.getElementById('submission-details');
if (container) {
  fields.forEach(({ key, label }) => {
    const value = params.get(key) || '—';
    const row = document.createElement('div');
    row.className = 'detail-row';
    row.innerHTML = `<span class="detail-label">${label}</span><span class="detail-value">${value}</span>`;
    container.appendChild(row);
  });
}
