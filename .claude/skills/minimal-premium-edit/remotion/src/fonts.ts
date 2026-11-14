import {continueRender, delayRender} from 'remotion';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700-italic.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';

// Fontes embutidas (offline): o render só começa quando todas carregarem.
if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.fonts) {
  const h = delayRender('Carregando fontes');
  Promise.all([
    document.fonts.load('italic 700 40px "Playfair Display"'),
    document.fonts.load('italic 400 40px "Playfair Display"'),
    document.fonts.load('400 40px Inter'),
    document.fonts.load('600 40px Inter'),
    document.fonts.load('800 40px Inter'),
  ])
    .catch(() => undefined)
    .finally(() => continueRender(h));
}
