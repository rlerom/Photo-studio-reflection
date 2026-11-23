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
      logo.focus({ preventScroll: true });
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

function initPortfolioAutoplay() {
  const list = document.querySelector('.portfolio-list');
  const pauseButton = document.querySelector('#portfolio-pause');

  if (!list || !pauseButton) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    const scrollContainer = document.querySelector('.portfolio__scroll-container');
    if (scrollContainer) {
      scrollContainer.setAttribute('tabindex', '0');
    }
  }

  if (!prefersReducedMotion) {
    const originalCards = Array.from(list.children);
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      list.append(clone);
    });
  }

  pauseButton.addEventListener('click', () => {

    const willPause = pauseButton.getAttribute('aria-pressed') !== 'true';

    pauseButton.setAttribute('aria-pressed', String(willPause));
    list.classList.toggle('portfolio-list--paused', willPause);
  });
}

const REVIEWS_URL = 'data/reviews.json';

const fetchReviews = async () => {
  const response = await fetch(REVIEWS_URL);

  if (!response.ok) {
    throw new Error(`Сервер ответил ${response.status} ${response.statusText}`);
  }

  return response.json();
};

function initReviews() {
  const list = document.querySelector('[data-reviews-list]');
  const status = document.querySelector('[data-reviews-status]');
  const retry = document.querySelector('[data-reviews-retry]');
  const template = document.querySelector('#review-card-template');

  if (!list || !status || !retry || !template) {
    return;
  }

  const createReviewCard = (review) => {
    const card = template.content.firstElementChild.cloneNode(true);

    card.querySelector('.review-card__title').textContent = review.name;
    card.querySelector('.review-card__text').textContent = review.description;

    return card;
  };

  const loadReviews = async () => {
    list.setAttribute('aria-busy', 'true');
    status.textContent = 'Загружаем отзывы…';
    retry.hidden = true;

    try {
      const reviews = await fetchReviews();

      list.replaceChildren(...reviews.map(createReviewCard));

      status.textContent = reviews.length === 0 ? 'Отзывов пока нет' : '';
    } catch (error) {
      console.error('Не удалось загрузить отзывы:', error);
      status.textContent =
        'Не удалось загрузить отзывы. Проверьте соединение и попробуйте ещё раз.';
      retry.hidden = false;
    } finally {
      list.removeAttribute('aria-busy');
    }
  };

  retry.addEventListener('click', async () => {
    await loadReviews();

    if (retry.hidden) {
      const title = document.querySelector('#reviews-title');
      if (title) {
        title.setAttribute('tabindex', '-1');
        title.focus();
      }
    }
  });

  loadReviews();
}

initBackToTop();
initFloatingHeader();
initPortfolioAutoplay();
initReviews();