// Works page filtering logic (chips toggle + grid filter)
(() => {
  const container = document.querySelector('.works-search');
  if (!container) return;

  const chips = Array.from(container.querySelectorAll('.works-search__chip'));
  const items = Array.from(container.querySelectorAll('.works-search__grid-item'));
  const searchInput = container.querySelector('#works-search-input');

  const normalize = (s) => (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const getSelectedTags = () => chips
    .filter(ch => ch.getAttribute('aria-pressed') === 'true')
    .map(ch => normalize(ch.dataset.tag));

  const matchesAnyTag = (itemTagsStr, selected) => {
    if (!selected.length) return true; // aucun tag sélectionné => tout afficher
    const itemTags = itemTagsStr.split('|').map(t => normalize(t));
    return selected.some(t => itemTags.includes(t));
  };

  const matchesSearch = (el, q) => {
    if (!q) return true;
    const text = normalize(el.textContent || '');
    return text.includes(q);
  };

  const applyFilter = () => {
    const selected = getSelectedTags();
    const q = normalize(searchInput && searchInput.value);
    items.forEach(el => {
      const tags = el.getAttribute('data-tags') || '';
      const ok = matchesAnyTag(tags, selected) && matchesSearch(el, q);
      el.style.display = ok ? '' : 'none';
    });
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const pressed = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', pressed ? 'false' : 'true');
      chip.classList.toggle('is-selected');
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyFilter();
    });
  }

  // Filtre initial (aucun tag actif => tout visible)
  applyFilter();
})();
