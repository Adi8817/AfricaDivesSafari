// Africa Dive Safaris — main.js
// Interaction scripts only. No content generation here.

document.addEventListener('DOMContentLoaded', function () {
  if (window.lucide) { lucide.createIcons(); }

  var toggle = document.querySelector('.site-navigation__toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) {
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        mobileMenu.removeAttribute('hidden');
        mobileMenu.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  var accordionToggles = document.querySelectorAll('.mobile-menu__accordion-toggle');
  accordionToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var submenu = btn.nextElementSibling;
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (submenu) submenu.classList.toggle('is-open');
    });
  });
  // Testimonials carousel
  var viewport = document.getElementById('testimonials-viewport');
  var track = document.getElementById('testimonials-track');
  if (viewport && track) {
    var slides = track.querySelectorAll('.testimonial-card');
    var dots = Array.prototype.slice.call(document.querySelectorAll('.testimonials__dot'));
    var arrows = document.querySelectorAll('.testimonials__arrow');
    var page = 0, autoplay = null, userInteracted = false;

    function perView() { return parseInt(getComputedStyle(track).getPropertyValue('--per-view'), 10) || 1; }
    function pageCount() { return Math.ceil(slides.length / perView()); }
    function step() { return slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0); }
    function offsetFor(p) { return Math.min(p * perView(), slides.length - perView()) * step(); }

    function render() {
      var count = pageCount();
      if (page > count - 1) page = count - 1;
      track.style.transform = 'translateX(' + (-offsetFor(page)) + 'px)';
      dots.forEach(function (d, i) {
        d.hidden = i >= count;
        d.classList.toggle('is-active', i === page);
        d.setAttribute('aria-selected', i === page ? 'true' : 'false');
      });
    }
    function go(p) { var c = pageCount(); page = (p + c) % c; render(); }
    function stopAutoplay() { userInteracted = true; clearInterval(autoplay); }

    arrows.forEach(function (btn) {
      btn.addEventListener('click', function () { stopAutoplay(); go(page + Number(btn.dataset.dir)); });
    });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { stopAutoplay(); go(i); }); });

    var startX = 0, dx = 0, dragging = false;
    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' || e.target.closest('a, button')) return;
      dragging = true; startX = e.clientX; dx = 0; track.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dx = e.clientX - startX;
      track.style.transform = 'translateX(' + (-offsetFor(page) + dx) + 'px)';
    });
    window.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false; track.classList.remove('is-dragging');
      if (Math.abs(dx) > 50) { stopAutoplay(); go(page + (dx < 0 ? 1 : -1)); } else { render(); }
    });

    viewport.addEventListener('mouseenter', function () { clearInterval(autoplay); });
    viewport.addEventListener('mouseleave', startAutoplay);
    function startAutoplay() {
      clearInterval(autoplay);
      if (userInteracted || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      autoplay = setInterval(function () { go(page + 1); }, 7000);
    }

    window.addEventListener('resize', render);
    render();
    startAutoplay();
  }
});

