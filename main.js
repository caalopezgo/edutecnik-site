/* Edutecnik: idioma (ES/EN), estado del header y reveal al hacer scroll.
   El HTML se sirve en español; el inglés vive en atributos data-en / data-en-html. */

(function () {
  'use strict';

  var STORAGE_KEY = 'edutecnik:lang';

  var TITLES = {
    es: 'Edutecnik: Inteligencia académica para profesores',
    en: 'Edutecnik: Academic intelligence for instructors',
  };

  /** Texto directo de un elemento, ignorando hijos como el SVG de la flecha. */
  function readOwnText(el) {
    var out = '';
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i];
      if (node.nodeType === 3) out += node.nodeValue;
    }
    return out.replace(/\s+/g, ' ').trim();
  }

  /** Escribe texto sin destruir hijos (iconos, puntos de las pills). */
  function writeOwnText(el, value) {
    var textNodes = [];
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i];
      if (node.nodeType === 3 && node.nodeValue.trim() !== '') textNodes.push(node);
    }
    if (textNodes.length === 0) {
      el.appendChild(document.createTextNode(value));
      return;
    }
    textNodes[0].nodeValue = value;
    for (var j = 1; j < textNodes.length; j++) textNodes[j].nodeValue = '';
  }

  /** Guarda la versión española una sola vez, para poder volver a ella. */
  function captureSpanish() {
    var nodes = document.querySelectorAll('[data-en], [data-en-html], [data-en-href]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.hasAttribute('data-en-html') && !el.hasAttribute('data-es-html')) {
        el.setAttribute('data-es-html', el.innerHTML);
      } else if (el.hasAttribute('data-en') && !el.hasAttribute('data-es')) {
        el.setAttribute(
          'data-es',
          el.tagName === 'META' ? el.getAttribute('content') || '' : readOwnText(el)
        );
      }
      if (el.hasAttribute('data-en-href') && !el.hasAttribute('data-es-href')) {
        el.setAttribute('data-es-href', el.getAttribute('href') || '');
      }
    }
  }

  function applyLang(lang) {
    var nodes = document.querySelectorAll('[data-en], [data-en-html], [data-en-href]');

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];

      if (el.hasAttribute('data-en-html')) {
        var html = lang === 'en' ? el.getAttribute('data-en-html') : el.getAttribute('data-es-html');
        if (html !== null) el.innerHTML = html;
      } else if (el.hasAttribute('data-en')) {
        var text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
        if (text !== null) {
          if (el.tagName === 'META') el.setAttribute('content', text);
          else writeOwnText(el, text);
        }
      }

      if (el.hasAttribute('data-en-href')) {
        var href = lang === 'en' ? el.getAttribute('data-en-href') : el.getAttribute('data-es-href');
        if (href) el.setAttribute('href', href);
      }
    }

    document.documentElement.setAttribute('lang', lang);
    document.title = TITLES[lang] || TITLES.es;

    var buttons = document.querySelectorAll('.lang button[data-lang]');
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].setAttribute(
        'aria-pressed',
        buttons[b].getAttribute('data-lang') === lang ? 'true' : 'false'
      );
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* modo privado: seguimos sin persistir */
    }
  }

  function preferredLang() {
    /* ?lang=es / ?lang=en gana: permite compartir el enlace en un idioma concreto. */
    var fromUrl = (window.location.search.match(/[?&]lang=(es|en)\b/i) || [])[1];
    if (fromUrl) return fromUrl.toLowerCase();

    var stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      /* ignorar */
    }
    if (stored === 'es' || stored === 'en') return stored;
    var nav = (navigator.language || 'es').toLowerCase();
    return nav.indexOf('es') === 0 ? 'es' : 'en';
  }

  captureSpanish();
  applyLang(preferredLang());

  document.addEventListener('click', function (event) {
    var button = event.target.closest ? event.target.closest('.lang button[data-lang]') : null;
    if (!button) return;
    applyLang(button.getAttribute('data-lang'));
  });

  /* Hairline del header solo cuando la página ya se movió */
  var header = document.getElementById('header');
  if (header) {
    var syncHeader = function () {
      header.setAttribute('data-scrolled', window.scrollY > 4 ? 'true' : 'false');
    };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  /* Aparición progresiva */
  var revealables = document.querySelectorAll('.reveal');
  var reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    for (var r = 0; r < revealables.length; r++) revealables[r].classList.add('is-visible');
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    for (var k = 0; k < revealables.length; k++) observer.observe(revealables[k]);
  }
})();
