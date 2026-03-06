/**
 * DollhouseMCP Collection Browser
 *
 * Functionality-first client-side app. No framework, no build step.
 * Fetches collection-index.json at runtime, renders dynamically.
 * All presentation is delegated to styles.css.
 *
 * Design hooks: class names follow BEM-ish conventions.
 * JS hooks: data-* attributes. Never use JS-hook classes for styling.
 */

(() => {
  const REPO    = 'DollhouseMCP/collection';
  const BRANCH  = 'main';
  const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
  const GITHUB_BASE = `https://github.com/${REPO}/blob/${BRANCH}`;

  // ── State ──────────────────────────────────────────────────────────────────

  let allElements = [];     // flat array of all IndexedElement objects
  let filteredElements = []; // currently displayed after search + type filter
  let activeType = 'all';
  let searchQuery = '';
  let currentElement = null; // element shown in modal

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  async function init() {
    try {
      showGridMessage('loading', 'Loading collection…');
      const res = await fetch('./collection-index.json');
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching collection-index.json`);
      const data = await res.json();

      // Flatten { type: [elements] } → single array with type injected
      allElements = Object.entries(data.index).flatMap(([type, elements]) =>
        elements.map(el => ({ ...el, type }))
      );

      renderStats(data);
      renderTypeFilters();
      applyFilters();

      // Footer timestamp
      const updated = document.getElementById('footer-updated');
      if (updated && data.generated) {
        updated.textContent = `Updated ${formatDate(data.generated)}`;
      }

    } catch (err) {
      showGridMessage('error', `Could not load collection: ${err.message}`);
      console.error('[DollhouseMCP]', err);
    }
  }

  // ── Stats bar ──────────────────────────────────────────────────────────────

  function renderStats(data) {
    const el = document.getElementById('stats');
    if (!el) return;
    const types = Object.keys(data.index).length;
    el.innerHTML = `
      <span class="stat"><strong>${data.total_elements}</strong> elements</span>
      <span class="stat"><strong>${types}</strong> types</span>
    `;
  }

  // ── Type filter chips ──────────────────────────────────────────────────────

  function renderTypeFilters() {
    const container = document.getElementById('type-filters');
    if (!container) return;

    const typeCounts = allElements.reduce((acc, el) => {
      acc[el.type] = (acc[el.type] || 0) + 1;
      return acc;
    }, {});

    const types = ['all', ...Object.keys(typeCounts).sort()];

    container.innerHTML = types.map(type => {
      const count = type === 'all' ? allElements.length : typeCounts[type];
      const isActive = type === activeType;
      return `<button
        class="type-filter${isActive ? ' active' : ''}"
        data-type="${escapeAttr(type)}"
        aria-pressed="${isActive}"
      >${capitalize(type)} <span class="filter-count">${count}</span></button>`;
    }).join('');

    container.addEventListener('click', e => {
      const btn = e.target.closest('[data-type]');
      if (!btn) return;
      activeType = btn.dataset.type;
      container.querySelectorAll('.type-filter').forEach(b => {
        const active = b.dataset.type === activeType;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', active);
      });
      applyFilters();
    });
  }

  // ── Search ─────────────────────────────────────────────────────────────────

  let searchTimer;
  function onSearch(e) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    }, 150);
  }

  // ── Filter + render pipeline ───────────────────────────────────────────────

  function applyFilters() {
    filteredElements = allElements.filter(el => {
      if (activeType !== 'all' && el.type !== activeType) return false;
      if (!searchQuery) return true;
      return (
        el.name?.toLowerCase().includes(searchQuery) ||
        el.description?.toLowerCase().includes(searchQuery) ||
        el.author?.toLowerCase().includes(searchQuery) ||
        el.category?.toLowerCase().includes(searchQuery) ||
        el.tags?.some(t => t.toLowerCase().includes(searchQuery)) ||
        el.keywords?.some(k => k.toLowerCase().includes(searchQuery))
      );
    });
    renderResults();
  }

  // ── Card grid ──────────────────────────────────────────────────────────────

  function renderResults() {
    const grid = document.getElementById('elements-grid');
    const countEl = document.getElementById('results-count');
    if (!grid) return;

    if (countEl) {
      if (filteredElements.length === allElements.length) {
        countEl.textContent = `${allElements.length} elements`;
      } else {
        countEl.textContent = `${filteredElements.length} of ${allElements.length} elements`;
      }
    }

    if (filteredElements.length === 0) {
      showGridMessage('empty-state', searchQuery
        ? `No elements match "${searchQuery}".`
        : 'No elements found.');
      return;
    }

    grid.innerHTML = filteredElements.map((el, i) => `
      <article
        class="element-card"
        data-index="${i}"
        data-type="${escapeAttr(el.type)}"
        role="listitem button"
        tabindex="0"
        aria-label="View ${escapeHtml(el.name)}"
      >
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(el.name)}</h3>
          <span class="type-badge" data-type="${escapeAttr(el.type)}">${capitalize(el.type)}</span>
        </div>
        ${el.description
          ? `<p class="card-description">${escapeHtml(el.description)}</p>`
          : ''}
        <footer class="card-footer">
          <div class="card-meta">
            ${el.author   ? `<span class="meta-author">by ${escapeHtml(el.author)}</span>` : ''}
            ${el.version  ? `<span class="meta-version">v${escapeHtml(el.version)}</span>` : ''}
            ${el.category ? `<span class="meta-category">${escapeHtml(el.category)}</span>` : ''}
          </div>
          ${el.tags?.length
            ? `<ul class="card-tags" aria-label="Tags">${
                el.tags.slice(0, 5).map(t =>
                  `<li class="tag">${escapeHtml(t)}</li>`
                ).join('')
              }</ul>`
            : ''}
        </footer>
      </article>
    `).join('');

    // Single delegated listener for the grid
    grid.onclick = handleCardClick;
    grid.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick(e);
      }
    };
  }

  function showGridMessage(cls, text) {
    const grid = document.getElementById('elements-grid');
    if (grid) grid.innerHTML = `<p class="${escapeAttr(cls)}">${escapeHtml(text)}</p>`;
  }

  // ── Modal ──────────────────────────────────────────────────────────────────

  function handleCardClick(e) {
    const card = e.target.closest('[data-index]');
    if (!card) return;
    openModal(filteredElements[parseInt(card.dataset.index, 10)]);
  }

  async function openModal(element) {
    currentElement = element;
    const modal = document.getElementById('element-modal');
    if (!modal) return;

    // Populate static metadata immediately
    modal.querySelector('.modal-title').textContent = element.name;
    modal.querySelector('.modal-type').textContent  = capitalize(element.type);
    modal.querySelector('.modal-author').textContent = element.author ? `by ${element.author}` : '';
    modal.querySelector('.modal-version').textContent = element.version ? `v${element.version}` : '';

    // GitHub link
    const ghLink = modal.querySelector('#btn-github');
    if (ghLink) {
      ghLink.href = `${GITHUB_BASE}/${element.path}`;
    }

    // Reset action buttons
    const copyBtn     = modal.querySelector('#btn-copy');
    const downloadBtn = modal.querySelector('#btn-download');
    copyBtn.onclick     = null;
    downloadBtn.onclick = null;
    copyBtn.textContent = 'Copy to clipboard';

    // Show modal with loading state
    const body = document.getElementById('modal-body');
    body.innerHTML = '<p class="loading">Loading content…</p>';
    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close').focus();

    // Fetch full .md file
    try {
      const url = `${RAW_BASE}/${element.path}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = await res.text();

      body.innerHTML = `<pre class="element-source"><code class="element-code">${escapeHtml(content)}</code></pre>`;

      copyBtn.onclick     = () => copyToClipboard(content, copyBtn);
      downloadBtn.onclick = () => downloadFile(element.name, content);

    } catch (err) {
      body.innerHTML = `<p class="error">Could not load content: ${escapeHtml(err.message)}</p>
        <p class="error-hint">
          <a href="${GITHUB_BASE}/${element.path}" target="_blank" rel="noopener noreferrer">
            View on GitHub directly
          </a>
        </p>`;
    }
  }

  function closeModal() {
    const modal = document.getElementById('element-modal');
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.classList.remove('modal-open');
    currentElement = null;
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async function copyToClipboard(text, btn) {
    const original = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied!';
    } catch {
      // Fallback for non-https contexts
      try {
        const ta = Object.assign(document.createElement('textarea'), {
          value: text,
          style: 'position:fixed;opacity:0;top:-9999px'
        });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
      } catch {
        btn.textContent = 'Copy failed';
      }
    }
    setTimeout(() => { btn.textContent = original; }, 2000);
  }

  function downloadFile(name, content) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: `${slug}.md` });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  function escapeAttr(str) {
    return String(str || '').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch {
      return iso;
    }
  }

  // ── Event wiring ───────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {

    // Theme toggle
    const themeToggleBtn  = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const themeToggleLbl  = document.getElementById('theme-toggle-label');
    const html = document.documentElement;

    function applyTheme(theme) {
      html.setAttribute('data-theme', theme);
      const isDark = theme === 'dark';
      if (themeToggleIcon) themeToggleIcon.textContent = isDark ? '☀' : '☾';
      if (themeToggleLbl)  themeToggleLbl.textContent  = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      if (themeToggleBtn)  themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      try { localStorage.setItem('color-scheme', theme); } catch {}
    }

    // Restore saved preference; fall back to OS preference
    const saved = (() => { try { return localStorage.getItem('color-scheme'); } catch {} })();
    const preferred = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(preferred);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      });
    }

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', onSearch);

    // Modal close
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-overlay')?.addEventListener('click', closeModal);

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      // Press / to focus search (unless already in an input)
      if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInput?.focus();
      }
    });

    init();
  });

})();
