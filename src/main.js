import { mount } from 'svelte';
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
import '@fontsource/opendyslexic/latin-400.css';
import '@fontsource/opendyslexic/latin-700.css';
import './app.css';
import App from './App.svelte';
import { applySettings } from './lib/settings.svelte.js';

// Applied here, synchronously before mount, rather than in an inline script in index.html:
// it reuses the one validation path, and nothing is painted before this module runs anyway.
applySettings();

export default mount(App, { target: document.getElementById('app') });
