/* ============================================================
   main.js – Portfolio interactivity
   ============================================================ */

/* ----- Active nav link ----- */
const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.menu a').forEach(a => {
  const href = (a.getAttribute('href') || '').split('/').pop();
  if (href === path || (path === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ----- Header scroll shadow ----- */
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ----- Scroll reveal (Intersection Observer) ----- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ----- Stagger reveal for grid containers ----- */
const staggerObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll(':scope > *');
      children.forEach((child, i) => {
        child.classList.add('reveal');
        setTimeout(() => child.classList.add('visible'), i * 100);
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.stagger-reveal').forEach(el => staggerObserver.observe(el));

/* ----- Progress bars (animate on enter) ----- */
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
        requestAnimationFrame(() => {
          bar.style.width = bar.dataset.width;
        });
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.card').forEach(card => {
  if (card.querySelector('.progress-fill')) progressObserver.observe(card);
});

/* ----- Smooth internal anchor scroll ----- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
