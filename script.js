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
  const viewerCaption = pcbDialog.querySelector('p');
  document.querySelectorAll('[data-lightbox-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      viewerImage.src = trigger.dataset.imageSrc;
      viewerImage.alt = trigger.dataset.imageAlt || 'BLDC Motor Board';
      viewerCaption.textContent = trigger.dataset.imageTitle || 'BLDC Motor Board';
      pcbDialog.classList.toggle('viewing-render', trigger.classList.contains('husky-render-button'));
      if (typeof pcbDialog.showModal === 'function') pcbDialog.showModal();
    });
  });
  pcbDialog.querySelector('.pcb-lightbox-close')?.addEventListener('click', () => pcbDialog.close());
  pcbDialog.addEventListener('click', (event) => {
    if (event.target === pcbDialog) pcbDialog.close();
  });
}

// Compact hardware / firmware process navigation. Keeps all original images and lightboxes.
(() => {
  const workflow = document.getElementById('spacelabs-workflow');
  if (!workflow) return;
  const tabs = [...workflow.querySelectorAll('[data-workflow-tab]')];
  const panels = [...workflow.querySelectorAll('[data-workflow-panel]')];
  const selections = { hardware: 7, firmware: 0 }; // Show finished fixture first.
  const controllers = {};
  panels.forEach((panel) => {
    const type = panel.dataset.workflowPanel;
    const stages = [...panel.querySelectorAll('.process-step')];
    const nav = document.createElement('nav');
    nav.className = 'spacelabs-stage-nav';
    nav.setAttribute('aria-label', type + ' process steps');
    const footer = document.createElement('div');
    footer.className = 'spacelabs-stage-footer';
    const prev = document.createElement('button'); prev.type = 'button'; prev.textContent = '← Previous';
    const count = document.createElement('span'); count.className = 'spacelabs-stage-count';
    const next = document.createElement('button'); next.type = 'button'; next.textContent = 'Next →';
    footer.append(prev, count, next);
    const buttons = stages.map((stage, i) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'spacelabs-stage-button';
      btn.textContent = String(i + 1).padStart(2, '0');
      btn.title = stage.querySelector('.process-step-header h4')?.textContent || 'Step ' + (i + 1);
      btn.setAttribute('aria-label', btn.title);
      btn.addEventListener('click', () => show(i));
      nav.appendChild(btn); return btn;
    });
    const container = panel.querySelector('.spacelabs-process-grid, .spacelabs-process');
    container.before(nav); container.after(footer);
    function show(i) {
      selections[type] = Math.max(0, Math.min(stages.length - 1, i));
      stages.forEach((stage, index) => { stage.hidden = index !== selections[type]; });
      buttons.forEach((btn, index) => {
        const active = index === selections[type];
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-current', active ? 'step' : 'false');
      });
      count.textContent = 'Step ' + (selections[type] + 1) + ' of ' + stages.length;
      prev.disabled = selections[type] === 0; next.disabled = selections[type] === stages.length - 1;
    }
    prev.addEventListener('click', () => show(selections[type] - 1));
    next.addEventListener('click', () => show(selections[type] + 1));
    controllers[type] = show;
    show(selections[type]);
  });
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const type = tab.dataset.workflowTab;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.workflowPanel !== type; });
  }));
})();
