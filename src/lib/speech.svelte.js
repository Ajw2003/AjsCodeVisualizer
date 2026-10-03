import { settings } from './settings.svelte.js';

// Missing in some browsers and in locked-down webviews; every use is guarded.
export const speechSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

export const speech = $state({ speaking: false, voices: [] });
let current = null;

function refreshVoices() {
  try {
    const all = window.speechSynthesis.getVoices();
    // Local voices first because they keep working offline.
    const sorted = [...all].sort((a, b) => Number(b.localService) - Number(a.localService));
    // Android can list two voices with one voiceURI; keyed lists need unique keys, so keep the first.
    const seen = new Set();
    speech.voices = sorted.filter((v) => !seen.has(v.voiceURI) && seen.add(v.voiceURI));
  } catch (err) {
    console.warn('Could not list speech voices.', err);
  }
}

if (speechSupported) {
  refreshVoices();
  // Voices often load after startup, so the first getVoices() can be empty.
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}

export function stopReading() {
  if (!speechSupported) return;
  current = null;
  speech.speaking = false;
  try {
    window.speechSynthesis.cancel();
  } catch (err) {
    console.warn('Could not stop reading aloud.', err);
  }
}

export function readAloud(text) {
  if (!speechSupported) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = settings.rate;
    const voice = speech.voices.find((v) => v.voiceURI === settings.voice);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    // Ignore events from a cancelled utterance so they cannot reset a newer one.
    const done = () => { if (current === u) { current = null; speech.speaking = false; } };
    u.onend = done;
    u.onerror = done;
    current = u;
    speech.speaking = true;
    window.speechSynthesis.speak(u);
  } catch (err) {
    current = null;
    speech.speaking = false;
    console.warn('Read aloud failed.', err);
  }
}
