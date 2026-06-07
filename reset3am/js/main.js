'use strict';

/* ─────────────────────────────────────────
   Meta Pixel stub — inserir PIXEL_ID para ativar

  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL_ID');
  fbq('track', 'PageView');
*/

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     1. REVEAL ON SCROLL
     Threshold 0.12 — stagger delay para grids (n × 80ms)
  ───────────────────────────────────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var parent = el.parentElement;
      var delay = 0;
      if (parent) {
        var siblings = Array.from(parent.children).filter(function (c) {
          return c.classList.contains('reveal');
        });
        var idx = siblings.indexOf(el);
        if (idx > 0) delay = idx * 80;
      }
      setTimeout(function () { el.classList.add('visible'); }, delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ─────────────────────────────────────────
     2. FAQ ACCORDION
  ───────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isExpanded = this.getAttribute('aria-expanded') === 'true';
      var answerId  = this.getAttribute('aria-controls');
      var answer    = document.getElementById(answerId);

      // Colapsa todos os outros
      document.querySelectorAll('.faq-q').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var otherId = other.getAttribute('aria-controls');
          var otherAnswer = document.getElementById(otherId);
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });

      this.setAttribute('aria-expanded', String(!isExpanded));
      if (answer) answer.hidden = isExpanded;
    });
  });


  /* ─────────────────────────────────────────
     3. STICKY MOBILE BAR
     Aparece após 700px em telas < 768px
     Some quando #planos está visível
  ───────────────────────────────────────── */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]') || carousel.querySelector('.testimonial-track');
    var slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
    if (!slides.length) slides = Array.from(carousel.querySelectorAll('.testimonial-slide'));
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var index = 0;

    function updateCarousel() {
      if (!track || !slides.length) return;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (slide, slideIndex) {
        slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        index = (index - 1 + slides.length) % slides.length;
        updateCarousel();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        index = (index + 1) % slides.length;
        updateCarousel();
      });
    }

    updateCarousel();
  });

  var stickyBar  = document.getElementById('sticky-bar');
  var planosSection = document.getElementById('planos');

  if (stickyBar && window.innerWidth < 768) {
    var planosVisible = false;

    if (planosSection) {
      var planosObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          planosVisible = entry.isIntersecting;
          updateSticky();
        });
      }, { threshold: 0.1 });
      planosObserver.observe(planosSection);
    }

    function updateSticky() {
      if (window.scrollY > 700 && !planosVisible) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', updateSticky, { passive: true });
  }


  /* ─────────────────────────────────────────
     4. CTA CLICKS — Meta Pixel stub
  ───────────────────────────────────────── */
  document.querySelectorAll('.cta-link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // fbq('track', 'InitiateCheckout', { value: 37, currency: 'BRL' });
      console.log('[Reset3AM] CTA click');
    });
  });


  /* ─────────────────────────────────────────
     5. SCROLL PROGRESS BAR (1px no topo)
  ───────────────────────────────────────── */
  var progressEl = document.querySelector('.scroll-progress');
  if (progressEl) {
    var updateProgress = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      progressEl.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }


  /* ─────────────────────────────────────────
     6. SMOOTH SCROLL para âncoras
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
