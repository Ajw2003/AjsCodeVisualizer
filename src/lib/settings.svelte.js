const KEY = 'ajs-settings-v1';

export const FONTS = {
  default: { label: 'Device default', family: 'system-ui, sans-serif' },
  atkinson: { label: 'Atkinson Hyperlegible', family: "'Atkinson Hyperlegible', system-ui, sans-serif" },
  opendyslexic: { label: 'OpenDyslexic', family: "'OpenDyslexic', system-ui, sans-serif" },
};
export const LETTER = [
  { label: 'Normal', letter: '0em', word: '0em' },
  { label: 'Wide', letter: '0.05em', word: '0.1em' },
  { label: 'Wider', letter: '0.1em', word: '0.2em' },
];
export const LINE = [
  { label: 'Normal', value: 1.5 },
  { label: 'Relaxed', value: 1.8 },
  { label: 'Loose', value: 2.1 },
];

// calm: null means "user has not chosen", so the OS reduced-motion preference decides.
const DEFAULTS = { calm: null, font: 'default', size: 100, letter: 0, line: 0, voice: '', rate: 1 };

function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Stored data is untrusted (hand-edited, older version, corrupt): each field falls back alone.
function validate(raw) {
  const s = { ...DEFAULTS };
  if (!raw || typeof raw !== 'object') return s;
  if (typeof raw.calm === 'boolean') s.calm = raw.calm;
  if (typeof raw.font === 'string' && Object.hasOwn(FONTS, raw.font)) s.font = raw.font;
  if (Number.isInteger(raw.size) && raw.size >= 100 && raw.size <= 200 && raw.size % 10 === 0) s.size = raw.size;
  if (Number.isInteger(raw.letter) && raw.letter >= 0 && raw.letter < LETTER.length) s.letter = raw.letter;
  if (Number.isInteger(raw.line) && raw.line >= 0 && raw.line < LINE.length) s.line = raw.line;
  if (typeof raw.voice === 'string') s.voice = raw.voice;
  if (typeof raw.rate === 'number' && raw.rate >= 0.75 && raw.rate <= 1.5) s.rate = raw.rate;
  return s;
}

function load() {
  try {
    const text = localStorage.getItem(KEY);
    return validate(text === null ? null : JSON.parse(text));
  } catch (err) {
    console.warn(`Could not read saved settings from localStorage key "${KEY}"; using defaults.`, err);
    return { ...DEFAULTS };
  }
}

export const settings = $state(load());

export const calmOn = () => (settings.calm === null ? prefersReducedMotion() : settings.calm);

export function applySettings() {
  const root = document.documentElement;
  root.dataset.calm = String(calmOn());
  root.dataset.font = settings.font;
  root.style.setProperty('--font-family', FONTS[settings.font].family);
  root.style.setProperty('--text-scale', `${settings.size}%`);
  root.style.setProperty('--letter-spacing', LETTER[settings.letter].letter);
  root.style.setProperty('--word-spacing', LETTER[settings.letter].word);
  root.style.setProperty('--line-height', String(LINE[settings.line].value));
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...settings }));
  } catch (err) {
    console.warn(`Could not save settings to localStorage key "${KEY}"; changes last until reload.`, err);
  }
}

export function update(patch) {
  Object.assign(settings, patch);
  applySettings();
  save();
}

export function resetSettings() {
  Object.assign(settings, DEFAULTS);
  applySettings();
  try {
    localStorage.removeItem(KEY);
  } catch (err) {
    console.warn(`Could not clear localStorage key "${KEY}" on reset.`, err);
  }
}
