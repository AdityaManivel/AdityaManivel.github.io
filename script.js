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
      pcbDialog.classList.toggle('viewing-prototype-upright', trigger.classList.contains('lab-prototype-upright'));
      pcbDialog.classList.toggle('viewing-rotated', trigger.dataset.imageRotate === '-90');
      pcbDialog.classList.toggle('viewing-rotated-clockwise', trigger.dataset.imageRotate === '90');
      // For rotated photos, size the viewer using the *rotated* image bounds.
      // Inline important styles override legacy lightbox CSS and prevent scrollbars.
      const isLabRotated = trigger.dataset.imageRotate === '-90' &&
        (trigger.dataset.imageSrc === 'assets/IMG_4574.jpeg' ||
         trigger.dataset.imageSrc === 'assets/finalized-tile.svg');
      const setStyle = (el, key, value) => el.style.setProperty(key, value, 'important');
      const clearKeys = ['width','height','max-width','max-height','min-width','min-height',
        'padding','overflow','box-sizing','position','left','top','transform','transform-origin',
        'object-fit','display','margin'];
      clearKeys.forEach(key => { pcbDialog.style.removeProperty(key); viewerImage.style.removeProperty(key); });
      if (isLabRotated) {
        const fitRotatedImage = () => {
          if (!viewerImage.naturalWidth || !viewerImage.naturalHeight) return;
          const availableW = window.innerWidth * 0.90;
          const availableH = window.innerHeight * 0.82;
          const scale = Math.min(availableW / viewerImage.naturalHeight,
            availableH / viewerImage.naturalWidth, 1);
          const imgW = viewerImage.naturalWidth * scale;
          const imgH = viewerImage.naturalHeight * scale;
          const panelW = imgH + 24;
          const panelH = imgW + 24;
          setStyle(pcbDialog,'box-sizing','border-box');
          setStyle(pcbDialog,'width',panelW + 'px');
          setStyle(pcbDialog,'height',panelH + 'px');
          setStyle(pcbDialog,'max-width','96vw');
          setStyle(pcbDialog,'max-height','94dvh');
          setStyle(pcbDialog,'min-width','0');
          setStyle(pcbDialog,'min-height','0');
          setStyle(pcbDialog,'padding','0');
          setStyle(pcbDialog,'overflow','hidden');
          setStyle(pcbDialog,'position','fixed');
          setStyle(viewerImage,'position','absolute');
          setStyle(viewerImage,'left','50%');
          setStyle(viewerImage,'top','50%');
          setStyle(viewerImage,'display','block');
          setStyle(viewerImage,'width',imgW + 'px');
          setStyle(viewerImage,'height',imgH + 'px');
          setStyle(viewerImage,'max-width','none');
          setStyle(viewerImage,'max-height','none');
          setStyle(viewerImage,'margin','0');
          setStyle(viewerImage,'object-fit','contain');
          setStyle(viewerImage,'transform-origin','center center');
          setStyle(viewerImage,'transform','translate(-50%, -50%) rotate(-90deg)');
        };
        viewerImage.onload = fitRotatedImage;
        if (viewerImage.complete) fitRotatedImage();
      } else {
        viewerImage.onload = null;
      }
      if (typeof pcbDialog.showModal === 'function') pcbDialog.showModal();
    });
  });
  pcbDialog.querySelector('.pcb-lightbox-close')?.addEventListener('click', () => pcbDialog.close());
  pcbDialog.addEventListener('click', (event) => {
    if (event.target === pcbDialog) pcbDialog.close();
  });
}

// Subtle scroll reveal: small upward motion and fade, once as each section enters view.
// Both scrolling directions work; previously revealed content stays visible.
(() => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = document.querySelectorAll('#work .exp-card, #projects .project, #education .education-entry, #coursework .course-card, #skills .skills-grid > *, .section-heading, #contact .footer-inner');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('scroll-visible');
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -24px 0px'});
  items.forEach((item) => {
    // Avoid hiding anything already in the initial viewport.
    if (item.getBoundingClientRect().top < window.innerHeight - 24) return;
    item.classList.add('scroll-fade');
    observer.observe(item);
  });
})();
