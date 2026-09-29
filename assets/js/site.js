/*
 * Vincent Gavard Électricité Générale
 * JavaScript sans dépendance : menu mobile, en-tête réduit, hero, carrousel,
 * visionneuse d'images, formulaire de contact (envoi par mailto:).
 * Sans JavaScript, tout le contenu reste lisible.
 */

// Adresse de destination du formulaire de contact (unique occurrence).
var CONTACT_EMAIL = 'mallorym@hotmail.fr';

(function () {
  'use strict';

  var root = document.documentElement;
  root.className = root.className.replace('no-js', 'js');

  var HERO_DELAY = 6000;
  var SLIDESHOW_DELAY = 5000;
  var SENT_MESSAGE = 'Votre logiciel de messagerie va s’ouvrir avec votre message.';

  function all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* ---------------------------------------------------------------
     Fondu entre des éléments : un seul actif à la fois
     --------------------------------------------------------------- */
  function cycle(items, delay, onChange) {
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + items.length) % items.length;
      items.forEach(function (item, i) {
        item.classList.toggle('is-active', i === current);
      });
      if (onChange) { onChange(current); }
    }

    function start() {
      stop();
      if (delay) { timer = window.setInterval(function () { show(current + 1); }, delay); }
    }

    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    show(0);
    start();

    return {
      goto: function (index) { show(index); start(); },
      next: function () { show(current + 1); start(); },
      prev: function () { show(current - 1); start(); }
    };
  }

  /* ---------------------------------------------------------------
     Menu mobile
     --------------------------------------------------------------- */
  function initMenu() {
    var toggle = document.getElementById('advanced_menu_toggle');
    var header = document.getElementById('header');
    if (!toggle || !header) { return; }

    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------------------------------------------------------------
     En-tête réduit et lien de retour en haut
     --------------------------------------------------------------- */
  function initScroll() {
    var header = document.getElementById('header');
    var top = document.getElementById('scroll-top-link');

    function update() {
      var y = window.pageYOffset || root.scrollTop;
      if (header) { header.classList.toggle('header-scrolled', y > 0); }
      if (top) { top.classList.toggle('is-visible', y > 600); }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     Hero : 2 diapositives en fondu enchaîné
     --------------------------------------------------------------- */
  function initHero() {
    all('.hero[data-hero]').forEach(function (hero) {
      var slides = all('.hero-slide', hero);
      if (slides.length < 2) { return; }
      hero.classList.add('is-ready');
      cycle(slides, HERO_DELAY);
    });
  }

  /* ---------------------------------------------------------------
     Carrousel d'images
     --------------------------------------------------------------- */
  function initSlideshows() {
    all('[data-slideshow]').forEach(function (box) {
      var slides = all('.avia-slideshow-inner li', box);
      var dots = all('.avia-slideshow-dots a', box);
      if (slides.length < 2) { return; }

      box.classList.add('is-ready');
      var show = cycle(slides, SLIDESHOW_DELAY, function (index) {
        dots.forEach(function (dot, i) { dot.classList.toggle('active', i === index); });
      });

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function (e) { e.preventDefault(); show.goto(i); });
      });
      var prev = box.querySelector('.prev-slide');
      var next = box.querySelector('.next-slide');
      if (prev) { prev.addEventListener('click', function (e) { e.preventDefault(); show.prev(); }); }
      if (next) { next.addEventListener('click', function (e) { e.preventDefault(); show.next(); }); }
    });
  }

  /* ---------------------------------------------------------------
     Visionneuse d'images
     --------------------------------------------------------------- */
  function initLightbox() {
    var links = all('a[data-rel]');
    if (!links.length) { return; }

    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Visionneuse d’images');
    overlay.hidden = true;
    overlay.innerHTML =
      '<button type="button" class="lightbox-btn lightbox-close" aria-label="Fermer">&times;</button>' +
      '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Précédent">&#8249;</button>' +
      '<figure class="lightbox-figure"><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lightbox-btn lightbox-next" aria-label="Suivant">&#8250;</button>';
    document.body.appendChild(overlay);

    var image = overlay.querySelector('img');
    var caption = overlay.querySelector('figcaption');
    var group = [];
    var index = 0;
    var opener = null;

    function render() {
      var link = group[index];
      var thumb = link.querySelector('img');
      image.src = link.href;
      image.alt = thumb ? thumb.alt : '';
      caption.textContent = (index + 1) + ' / ' + group.length;
      var single = group.length < 2;
      overlay.querySelector('.lightbox-prev').style.display = single ? 'none' : '';
      overlay.querySelector('.lightbox-next').style.display = single ? 'none' : '';
    }

    function open(link) {
      var rel = link.getAttribute('data-rel');
      group = links.filter(function (l) { return l.getAttribute('data-rel') === rel; });
      index = group.indexOf(link);
      opener = link;
      render();
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      overlay.querySelector('.lightbox-close').focus();
    }

    function close() {
      overlay.hidden = true;
      image.removeAttribute('src');
      document.body.style.overflow = '';
      if (opener) { opener.focus(); }
    }

    function step(delta) {
      index = (index + delta + group.length) % group.length;
      render();
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) { return; }
        e.preventDefault();
        open(link);
      });
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { close(); }
    });
    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-prev').addEventListener('click', function () { step(-1); });
    overlay.querySelector('.lightbox-next').addEventListener('click', function () { step(1); });

    document.addEventListener('keydown', function (e) {
      if (overlay.hidden) { return; }
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowLeft' && group.length > 1) { step(-1); }
      else if (e.key === 'ArrowRight' && group.length > 1) { step(1); }
      else if (e.key === 'Tab') {
        // garde le focus dans la visionneuse
        var focusable = all('button', overlay).filter(function (b) { return b.style.display !== 'none'; });
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------------------------------------------------------------
     Formulaire de contact : validation puis ouverture de la messagerie
     --------------------------------------------------------------- */
  var CHECKS = {
    is_empty: function (value) { return value.replace(/\s+/g, '') !== ''; },
    is_email: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value); },
    // chiffres, espaces et séparateurs usuels, 3 caractères minimum
    is_phone: function (value) { return /^[\d\s\-\/()\[\]+_.,:;]{3,}$/.test(value); }
  };

  function initForm() {
    var form = document.querySelector('form.avia_ajax_form');
    if (!form) { return; }

    var response = document.getElementById('ajaxresponse_1');

    function validate(field) {
      var check = field.getAttribute('data-check');
      var ok = CHECKS[check](field.value);
      var row = field.parentNode;
      row.classList.toggle('error', !ok);
      field.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    }

    var fields = all('[data-check]', form);
    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validate(field); });
      field.addEventListener('input', function () {
        if (field.parentNode.classList.contains('error')) { validate(field); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (response) { response.hidden = true; }

      var invalid = fields.filter(function (field) { return !validate(field); });
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      var values = {};
      fields.forEach(function (field) { values[field.name] = field.value.trim(); });

      var body = [
        'Nom : ' + values.nom,
        'E-Mail : ' + values.email,
        'Téléphone : ' + values.telephone,
        'Sujet : ' + values.sujet,
        '',
        'Message :',
        values.message
      ].join('\r\n').replace(/\r?\n/g, '\r\n');

      var url = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(values.sujet) +
        '&body=' + encodeURIComponent(body);

      if (response) {
        response.textContent = SENT_MESSAGE;
        response.hidden = false;
      }
      window.location.href = url;
    });
  }

  function init() {
    initMenu();
    initScroll();
    initHero();
    initSlideshows();
    initLightbox();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
