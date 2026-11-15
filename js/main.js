document.documentElement.classList.add('js');
document.getElementById('year').textContent = new Date().getFullYear();

/* Fade-in on scroll */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* Nav border once scrolled */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Highlight the nav link for the section in view */
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

/* Mobile menu */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuBtn.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!navLinks.classList.contains('open')); });
navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

/* Theme: light/dark toggle + accent palette */
const SWATCH_COLORS = { forest: '#2a6049', ocean: '#1560a8', violet: '#5b3fc8', rose: '#b53048', amber: '#9e6010', slate: '#2c5080', mono: '#555555' };
const paletteBtn = document.getElementById('paletteBtn');
const palettePop = document.getElementById('palettePop');
const swatchWrap = document.getElementById('swatches');

Theme.palettes.forEach(p => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'swatch';
  b.dataset.palette = p;
  b.innerHTML = `<span class="swatch-dot" style="background:${SWATCH_COLORS[p]}"></span>${p}`;
  b.addEventListener('click', () => Theme.setPalette(p));
  swatchWrap.appendChild(b);
});
function syncThemeUI() {
  const { palette, mode } = Theme.get();
  swatchWrap.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.palette === palette)));
  document.getElementById('modeBtn').setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
document.addEventListener('themechange', syncThemeUI);
syncThemeUI();

function setPalettePop(open) {
  palettePop.hidden = !open;
  paletteBtn.setAttribute('aria-expanded', String(open));
}
paletteBtn.addEventListener('click', (e) => { e.stopPropagation(); setPalettePop(palettePop.hidden); });
palettePop.addEventListener('click', (e) => e.stopPropagation());
document.getElementById('modeBtn').addEventListener('click', () => Theme.toggleMode());

document.addEventListener('click', () => { setPalettePop(false); setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setPalettePop(false); setMenu(false); } });

/* Copy email */
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', async () => {
  const label = copyBtn.querySelector('span');
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    label.textContent = 'Copied!';
  } catch {
    label.textContent = 'Press Ctrl+C';
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.contact-email'));
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
  }
  setTimeout(() => (label.textContent = 'Copy'), 2000);
});
