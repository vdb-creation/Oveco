document.addEventListener('DOMContentLoaded', () => {
  // Init all carousels (projects, testimonials, etc.)
  document.querySelectorAll('.projects__grid, .testimonials__grid').forEach(initCarouselForGrid);

  // Init mouse follower for hero section
  initMouseFollower();
});

function initCarouselForGrid(grid) {
  const root = grid.closest('.projects, .testimonials');
  if (!root) return;

  const prevBtn = root.querySelector('.projects__nav-btn--prev, .testimonials__nav-btn--prev');
  const nextBtn = root.querySelector('.projects__nav-btn--next, .testimonials__nav-btn--next');

  // Compute a single card width including gap
  const STEP_FACTOR = 0.8; // 80% d'une carte pour un scroll moins rigide
  const DRAG_THRESHOLD = 5; // px avant de considérer un vrai drag
  const getCardMetrics = () => {
    const first = grid.querySelector('.projects__card');
    if (!first) return { cardWidth: 0, gap: 0, step: 0 };
    const style = window.getComputedStyle(grid);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    const rect = first.getBoundingClientRect();
    const cardWidth = Math.round(rect.width);
    const step = Math.max(1, Math.round((cardWidth + gap) * STEP_FACTOR));
    return { cardWidth, gap, step };
  };

  let { step } = getCardMetrics();
  const recalc = () => { step = getCardMetrics().step || step; };
  window.addEventListener('resize', () => { recalc(); });

  const scrollByStep = (dir = 1) => {
    recalc();
    const target = grid.scrollLeft + dir * step;
    grid.scrollTo({ left: target, behavior: 'smooth' });
  };

  prevBtn && prevBtn.addEventListener('click', () => scrollByStep(-1));
  nextBtn && nextBtn.addEventListener('click', () => scrollByStep(1));

  // Drag to scroll (pointer events)
  let isDown = false;
  let dragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let dragRAF = 0;
  let lastMoveX = 0;
  let prevMoveX = 0;
  let lastMoveTime = 0;
  let prevMoveTime = 0;

  const onPointerDown = (e) => {
    isDown = true;
    dragging = false;
    startX = (e.clientX || (e.touches && e.touches[0]?.clientX) || 0);
    scrollLeft = grid.scrollLeft;
    lastMoveX = startX;
    prevMoveX = startX;
    const now = performance.now();
    lastMoveTime = now;
    prevMoveTime = now;
  };

  const onPointerMove = (e) => {
    if (!isDown) return;
    const x = (e.clientX || (e.touches && e.touches[0]?.clientX) || 0);
    const walk = startX - x;
    if (!dragging && Math.abs(walk) > DRAG_THRESHOLD) {
      dragging = true;
      grid.classList.add('is-grabbing');
      document.body.style.userSelect = 'none';
    }
    if (!dragging) return;
    // use rAF to avoid flooding
    cancelAnimationFrame(dragRAF);
    dragRAF = requestAnimationFrame(() => {
      grid.scrollLeft = scrollLeft + walk;
    });
    // memoriser pour momentum
    prevMoveX = lastMoveX;
    prevMoveTime = lastMoveTime;
    lastMoveX = x;
    lastMoveTime = performance.now();
  };

  const onPointerUp = () => {
    if (!isDown) return;
    isDown = false;
    if (dragging) {
      grid.classList.remove('is-grabbing');
      document.body.style.userSelect = '';
      // momentum simple basé sur la dernière vitesse
      const dt = Math.max(1, lastMoveTime - prevMoveTime);
      const vx = (lastMoveX - prevMoveX) / dt; // px/ms
      const extra = -vx * 220; // continuer ~220ms dans la même direction
      if (Math.abs(extra) > 2) {
        grid.scrollBy({ left: extra, behavior: 'smooth' });
      }
    }
    dragging = false;
  };

  // Mouse events
  grid.addEventListener('mousedown', onPointerDown, { passive: true });
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('mouseup', onPointerUp, { passive: true });

  // Touch events
  grid.addEventListener('touchstart', onPointerDown, { passive: true });
  grid.addEventListener('touchmove', onPointerMove, { passive: true });
  grid.addEventListener('touchend', onPointerUp, { passive: true });
  grid.addEventListener('touchcancel', onPointerUp, { passive: true });

  // Molette verticale => scroll horizontal plus fluide (souris)
  grid.addEventListener('wheel', (e) => {
    // si l'utilisateur n'utilise pas déjà la molette horizontale
    if (!e.shiftKey && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      e.preventDefault();
      grid.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // Keyboard support when buttons are focused
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByStep(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByStep(1); }
  };
  prevBtn && prevBtn.addEventListener('keydown', onKey);
  nextBtn && nextBtn.addEventListener('keydown', onKey);

  // Snapping désactivé pour permettre des cartes partiellement visibles
}

/**
 * Initialize mouse follower circle for hero section
 */
function initMouseFollower() {
  const follower = document.getElementById('mouseFollower');
  const heroSection = document.querySelector('.hero');

  if (!follower || !heroSection) return;

  // Ensure CSS transform centers the circle
  follower.style.transform = 'translate(-50%, -50%)';

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let insideHero = false;

  // Aucun snapping à la grille: mouvement fluide directement sous la souris

  const ease = 0.15; // smoothing factor

  function animate() {
    // ease towards the target
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    // apply as left/top relative to hero (keeps center via translate(-50%, -50%))
    follower.style.left = currentX + 'px';
    follower.style.top = currentY + 'px';

    // show/hide based on whether mouse is inside hero and viewport is desktop
    if (window.innerWidth > 768 && insideHero) {
      if (follower.style.opacity !== '1') follower.style.opacity = '1';
    } else {
      if (follower.style.opacity !== '0') follower.style.opacity = '0';
    }

    requestAnimationFrame(animate);
  }

  // Run animation loop
  animate();

  // Écoute uniquement dans le hero, mouvement fluide
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const relX = e.clientX - rect.left; // position relative au hero
    const relY = e.clientY - rect.top;

    insideHero = relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height;

    if (!insideHero) return;
    targetX = relX;
    targetY = relY;
  }, { passive: true });

  // Hide on resize for small screens
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      follower.style.opacity = '0';
    }
  });
}