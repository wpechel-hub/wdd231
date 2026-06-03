const timestampField = document.getElementById('timestamp');
if (timestampField) {
  timestampField.value = new Date().toLocaleString();
}

document.querySelectorAll('[data-modal]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const modal = document.getElementById(link.getAttribute('data-modal'));
    if (modal) modal.showModal();
  });
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('dialog').close();
  });
});

document.querySelectorAll('.membership-modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.close();
  });
});
