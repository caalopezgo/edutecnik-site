/* Edutecnik: language routing, access email, header state, and reveal-on-scroll. */

(function () {
  'use strict';

  function isSpanishPath() {
    return window.location.pathname === '/es' || window.location.pathname.indexOf('/es/') === 0;
  }

  function syncAccessEmail() {
    var oldEmail = 'hola@edutecnik.com';
    var newEmail = 'acceso@edutecnik.com';
    var mailLinks = document.querySelectorAll('a[href^="mailto:' + oldEmail + '"]');

    for (var i = 0; i < mailLinks.length; i++) {
      mailLinks[i].setAttribute('href', mailLinks[i].getAttribute('href').replace(oldEmail, newEmail));
    }

    var fineText = document.querySelectorAll('.fine');
    for (var j = 0; j < fineText.length; j++) {
      if (fineText[j].textContent.indexOf(oldEmail) !== -1) {
        fineText[j].textContent = fineText[j].textContent.replace(oldEmail, newEmail);
      }
    }
  }

  syncAccessEmail();

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
