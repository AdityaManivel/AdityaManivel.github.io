const seen = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      seen.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => seen.observe(element));


// Open a full-screen-style PCB photo viewer; Escape and backdrop close it.
const pcbDialog = document.getElementById('pcb-lightbox');
const pcbOpen = document.querySelector('[data-lightbox-open]');
if (pcbDialog && pcbOpen) {
  pcbOpen.addEventListener('click', () => {
    if (typeof pcbDialog.showModal === 'function') pcbDialog.showModal();
  });
  pcbDialog.querySelector('.pcb-lightbox-close')?.addEventListener('click', () => pcbDialog.close());
  pcbDialog.addEventListener('click', (event) => {
    if (event.target === pcbDialog) pcbDialog.close();
  });
}
