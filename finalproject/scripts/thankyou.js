const params = new URLSearchParams(window.location.search);
const container = document.getElementById('submission-details');

if (container) {
  // Contact form fields
  const contactFields = [
    { key: 'first-name', label: 'First Name' },
    { key: 'last-name',  label: 'Last Name' },
    { key: 'email',      label: 'Email' },
    { key: 'subject',    label: 'Subject' },
    { key: 'message',    label: 'Message' },
    { key: 'timestamp',  label: 'Submitted At' },
  ];

  // Search form fields
  const searchFields = [
    { key: 'destination', label: 'Destination' },
    { key: 'maxprice',    label: 'Max Price' },
    { key: 'stops',       label: 'Stops' },
  ];

  const isSearch = params.has('destination') || params.has('maxprice');
  const fields   = isSearch ? searchFields : contactFields;

  fields.forEach(({ key, label }) => {
    const value = params.get(key) || '—';
    const row   = document.createElement('div');
    row.className = 'detail-row';
    row.innerHTML = `<span class="detail-label">${label}</span><span class="detail-value">${value}</span>`;
    container.appendChild(row);
  });
}
