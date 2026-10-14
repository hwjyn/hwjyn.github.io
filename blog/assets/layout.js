(() => {
  'use strict';

  const stylesheet = document.getElementById('mobile-theme');
  if (!stylesheet) return;
  const breakpoint = window.matchMedia('(max-width: 600px)');
  const storageKey = 'hwjh-blog-layout';
  const validChoice = choice => choice === 'desktop' || choice === 'mobile' ? choice : null;
  let preference = null;
  try { preference = validChoice(localStorage.getItem(storageKey)); } catch { /* Use screen width when storage is unavailable. */ }

  function apply() {
    const layout = preference || (breakpoint.matches ? 'mobile' : 'desktop');
    stylesheet.media = preference ? (layout === 'mobile' ? 'screen' : 'not all')
      : 'screen and (max-width: 600px)';
    document.documentElement.dataset.layout = layout;
    for (const button of document.querySelectorAll('[data-layout-choice]')) {
      button.setAttribute('aria-pressed', String(button.dataset.layoutChoice === layout));
    }
  }

  // Restore a preference before displaying the page content.
  apply();
  breakpoint.addEventListener('change', apply);

  function initialize() {
    const control = document.getElementById('layout-switch');
    if (!control) return;
    for (const button of control.querySelectorAll('[data-layout-choice]')) {
      button.addEventListener('click', () => {
        preference = validChoice(button.dataset.layoutChoice);
        apply();
        try { localStorage.setItem(storageKey, preference); } catch { /* Switching still works without persistence. */ }
      });
    }
    apply();
    control.hidden = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
