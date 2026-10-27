const seen = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      seen.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => seen.observe(element));


// Full-screen-style viewer shared by the assembled PCB and Altium 3D render.
const pcbDialog = document.getElementById('pcb-lightbox');
if (pcbDialog) {
  const viewerImage = pcbDialog.querySelector('img');
  pcbDialog.querySelector('p')?.remove();
  document.querySelectorAll('[data-lightbox-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      viewerImage.src = trigger.dataset.imageSrc;
      viewerImage.alt = trigger.dataset.imageAlt || 'BLDC Motor Board';

      pcbDialog.classList.toggle('viewing-render', trigger.classList.contains('husky-render-button'));
      pcbDialog.classList.toggle('viewing-rotated', trigger.dataset.imageRotate === '-90');
      if (typeof pcbDialog.showModal === 'function') pcbDialog.showModal();
    });
  });
  pcbDialog.querySelector('.pcb-lightbox-close')?.addEventListener('click', () => pcbDialog.close());
  pcbDialog.addEventListener('click', (event) => {
    if (event.target === pcbDialog) pcbDialog.close();
  });
}
