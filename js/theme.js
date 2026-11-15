/* Loaded synchronously in <head> so the saved theme applies before first paint.
   Stored value: "<palette>-<light|dark>" (explicit) or just "<palette>" (follow system). */
(function () {
  var KEY = 'portfolio-theme';
  var PALETTES = ['slate', 'forest', 'ocean', 'violet', 'rose', 'amber', 'mono'];
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function read() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function parse(v) {
    var p = v.split('-');
    return {
      palette: PALETTES.indexOf(p[0]) >= 0 ? p[0] : 'slate',
      mode: p[1] === 'light' || p[1] === 'dark' ? p[1] : null
    };
  }

  var state = parse(read());

  function resolvedMode() { return state.mode || (mq && mq.matches ? 'dark' : 'light'); }

  function apply() {
    document.documentElement.setAttribute('data-theme', state.palette + '-' + resolvedMode());
    document.dispatchEvent(new CustomEvent('themechange', { detail: { palette: state.palette, mode: resolvedMode() } }));
  }

  function save() { write(state.mode ? state.palette + '-' + state.mode : state.palette); }

  window.Theme = {
    palettes: PALETTES,
    get: function () { return { palette: state.palette, mode: resolvedMode() }; },
    setPalette: function (p) { state.palette = p; save(); apply(); },
    toggleMode: function () { state.mode = resolvedMode() === 'dark' ? 'light' : 'dark'; save(); apply(); }
  };

  if (mq) {
    var onChange = function () { if (!state.mode) apply(); };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
  }
  apply();
})();
