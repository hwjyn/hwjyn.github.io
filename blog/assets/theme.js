(function () {
  'use strict';

  const root = document.documentElement;
  const storageKey = 'hwjh-blog-theme';
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function validPreference(value) {
    return value === 'light' || value === 'dark' ? value : null;
  }

  let preference = validPreference(readStorage(storageKey));

  function automaticTheme() {
    return systemPreference.matches ? 'dark' : 'light';
  }

  function updateButtons() {
    const current = root.dataset.theme;
    const label = current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.dataset.themeCurrent = current;
      button.setAttribute('aria-label', label);
      button.title = label;
      button.hidden = false;
    });
  }

  function synchronizeTheme() {
    root.dataset.theme = preference || automaticTheme();
    updateButtons();
  }

  // Resolve the palette before the first paint. The icon reads this same state,
  // never a potentially delayed computed style after an attribute change.
  root.dataset.theme = preference || automaticTheme();

  function initialize() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
        synchronizeTheme();
        try {
          localStorage.setItem(storageKey, preference);
        } catch (_) {}
      });
    });
    synchronizeTheme();

    // Follow system changes when the reader has not chosen an override.
    if (systemPreference.addEventListener) systemPreference.addEventListener('change', synchronizeTheme);
    else if (systemPreference.addListener) systemPreference.addListener(synchronizeTheme);
    window.addEventListener('storage', function (event) {
      if (event.key === storageKey || event.key === null) {
        preference = validPreference(event.newValue);
        synchronizeTheme();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
