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

function initFloatingHeader() {
  const header = document.querySelector('.site-header');
  if (!header) {
    return;
  }

  const HIDE_AFTER = 200;
  let lastScrollY = window.scrollY;

  function onWindowScroll() {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;

    if (currentScrollY <= HIDE_AFTER) {
      header.classList.remove('site-header--hidden');
    } else if (isScrollingDown) {
      header.classList.add('site-header--hidden');
    } else {
      header.classList.remove('site-header--hidden');
    }

    lastScrollY = currentScrollY;
  }

  header.addEventListener('focusin', () => {
    header.classList.remove('site-header--hidden');
  });

  window.addEventListener('scroll', onWindowScroll, { passive: true });
}

initBackToTop();
initFloatingHeader();