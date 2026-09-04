/* Edutecnik: language routing, header state, and reveal-on-scroll. */

(function () {
  'use strict';

  function isSpanishPath() {
    return window.location.pathname === '/es' || window.location.pathname.indexOf('/es/') === 0;
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest ? event.target.closest('.lang button[data-lang]') : null;
    if (!button) return;

    var lang = button.getAttribute('data-lang');
    if (lang === 'es' && !isSpanishPath()) {
      window.location.href = '/es/';
      return;
    }
    if (lang === 'en' && isSpanishPath()) {
      window.location.href = '/';
    }
  });

  var header = document.getElementById('header');
  if (header) {
    var syncHeader = function () {
      header.setAttribute('data-scrolled', window.scrollY > 4 ? 'true' : 'false');
    };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

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
