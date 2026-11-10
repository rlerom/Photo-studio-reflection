function initBackToTop() {
  const button = document.querySelector('#back-to-top');

  if (!button) {
    return;
  }

  const SHOW_AFTER = 400;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateButtonVisibility() {
    button.hidden = window.scrollY <= SHOW_AFTER;
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    const logo = document.querySelector('.logo');
    if (logo) {
      logo.focus({
        preventScroll: true
    });
    }
  }

  button.addEventListener('click', scrollToTop);
  // с { passive: true } обещаем браузеру, что не будем отменять прокрутку (быстрее)
  window.addEventListener('scroll', updateButtonVisibility, { passive: true });
  updateButtonVisibility();
}

initBackToTop();