import { registerSW } from 'virtual:pwa-register';

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

// An installed Android PWA resumed from the background never navigates, so the browser's own
// "check for a new service worker on navigation" never fires; and GitHub Pages serves sw.js with
// max-age=600, so even a plain registration.update() can be answered from the HTTP cache. We
// therefore poll ourselves, and fetch sw.js uncached first so update() only runs against a
// fresh copy. registerType 'autoUpdate' then activates the new worker and reloads the page.
async function checkForUpdate(swUrl, registration) {
  if (!navigator.onLine) return;
  try {
    const response = await fetch(swUrl, {
      cache: 'no-store',
      headers: { 'cache-control': 'no-cache' },
    });
    if (!response.ok) {
      console.warn(`Update check skipped: ${swUrl} returned HTTP ${response.status}`);
      return;
    }
    await registration.update();
  } catch (error) {
    console.warn('Update check failed:', error);
  }
}

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!registration) {
      console.warn('Service worker registered without a registration; update checks disabled.');
      return;
    }
    const check = () => checkForUpdate(swUrl, registration);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check();
    });
    // Only while visible: a hidden page's timers are throttled and a check there is wasted.
    setInterval(() => {
      if (document.visibilityState === 'visible') check();
    }, CHECK_INTERVAL_MS);
  },
  onRegisterError(error) {
    console.warn('Service worker registration failed:', error);
  },
});
