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
  const BRANCH  = 'develop';
  const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
  const GITHUB_BASE = `https://github.com/${REPO}/blob/${BRANCH}`;

  // ── State ──────────────────────────────────────────────────────────────────

  let allElements = [];     // flat array of all IndexedElement objects
  let filteredElements = []; // currently displayed after search + type filter
  let activeType = 'all';
  let activeTopic = 'all';
  let activeSort = 'date-desc';
  let searchQuery = '';

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

      // Probe a sample to detect branch availability (HEAD request, non-blocking)
      checkBranchAvailability();

      renderStats(data);
      renderTypeFilters();
      renderTopicFilters();
      applyFilters();

      // Footer timestamp
      const updated = document.getElementById('footer-updated');
      if (updated && data.generated) {
        updated.textContent = `Updated ${formatDate(data.generated)}`;
      }

    } catch (err) {
      showGridMessage('error', `Could not load collection: ${err.message}`);
      console.error('[DollhouseMCP]', {
        error: err.message,
        context: 'collectionLoad',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ── Branch availability check ──────────────────────────────────────────────

  async function checkBranchAvailability() {
    // Probe each element's path; mark unavailable ones so the grid can show them dimmed.
    // Uses HEAD requests in parallel, capped at 8 concurrent to avoid rate limits.
    const CONCURRENCY = 8;
    const queue = [...allElements];
    let dirty = false;

    async function probe(el) {
      try {
        const res = await fetch(`${RAW_BASE}/${el.path}`, { method: 'HEAD' });
        if (!res.ok) { el._unavailable = true; dirty = true; }
      } catch { el._unavailable = true; dirty = true; }
    }

    while (queue.length) {
      await Promise.all(queue.splice(0, CONCURRENCY).map(probe));
    }

    if (dirty) renderResults(); // re-render with unavailable badges applied
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

    const types = ['all', ...Object.keys(typeCounts).sort((a, b) => a.localeCompare(b))];

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

  // ── Topic filter chips ─────────────────────────────────────────────────────

  // Map raw tags → normalized topic buckets
  const TOPIC_MAP = {
    'professional': 'Professional',
    'business': 'Business', 'strategy': 'Business', 'consulting': 'Business', 'finance': 'Business',
    'development': 'Development', 'programming': 'Development', 'code': 'Development',
      'software-engineering': 'Development', 'code-review': 'Development', 'code-quality': 'Development',
    'security': 'Security', 'vulnerability': 'Security', 'compliance': 'Security',
      'code-security': 'Security', 'codeql': 'Security', 'security-analysis': 'Security',
    'writing': 'Writing', 'creative-writing': 'Writing', 'storytelling': 'Writing',
      'content': 'Writing', 'copywriting': 'Writing', 'narrative': 'Writing',
    'research': 'Research', 'academic': 'Research', 'analysis': 'Research',
      'literature-review': 'Research', 'data-analysis': 'Research',
    'productivity': 'Productivity', 'task-management': 'Productivity', 'organization': 'Productivity',
      'workflow': 'Productivity', 'efficiency': 'Productivity',
    'education': 'Education', 'learning': 'Education', 'teaching': 'Education', 'tutorial': 'Education',
    'creative': 'Creative', 'design': 'Creative', 'art': 'Creative',
    'personal': 'Personal',
  };

  function getTopicForElement(el) {
    if (!el.tags?.length) return el.category ? capitalize(el.category) : null;
    for (const tag of el.tags) {
      const t = tag.toLowerCase();
      if (TOPIC_MAP[t]) return TOPIC_MAP[t];
    }
    return null;
  }

  function renderTopicFilters() {
    const container = document.getElementById('topic-filters');
    if (!container) return;

    const topicCounts = {};
    allElements.forEach(el => {
      const topic = getTopicForElement(el);
      if (topic) topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    const topics = ['all', ...Object.keys(topicCounts).sort((a, b) => a.localeCompare(b))];
    if (topics.length <= 2) { container.hidden = true; return; } // not enough to be useful

    container.hidden = false;
    container.innerHTML = topics.map(topic => {
      const count = topic === 'all' ? allElements.length : topicCounts[topic];
      const isActive = topic === activeTopic;
      return `<button
        class="topic-filter${isActive ? ' active' : ''}"
        data-topic="${escapeAttr(topic)}"
        aria-pressed="${isActive}"
      >${escapeHtml(topic === 'all' ? 'All topics' : topic)} <span class="filter-count">${count}</span></button>`;
    }).join('');

    container.addEventListener('click', e => {
      const btn = e.target.closest('[data-topic]');
      if (!btn) return;
      activeTopic = btn.dataset.topic;
      container.querySelectorAll('.topic-filter').forEach(b => {
        const active = b.dataset.topic === activeTopic;
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
      if (activeTopic !== 'all' && getTopicForElement(el) !== activeTopic) return false;
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

  function sortElements(elements) {
    const sorted = [...elements];
    switch (activeSort) {
      case 'name-asc':  return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-desc': return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'date-asc':  return sorted.sort((a, b) => (a.created || '').localeCompare(b.created || ''));
      case 'date-desc': return sorted.sort((a, b) => (b.created || '').localeCompare(a.created || ''));
      case 'type-asc':  return sorted.sort((a, b) => (a.type || '').localeCompare(b.type || '') || (a.name || '').localeCompare(b.name || ''));
      default:          return sorted;
    }
  }

  function renderResults() {
    const grid = document.getElementById('elements-grid');
    const countEl = document.getElementById('results-count');
    const announcer = document.getElementById('results-announcer');
    if (!grid) return;

    filteredElements = sortElements(filteredElements);

    if (countEl) {
      if (filteredElements.length === allElements.length) {
        countEl.textContent = `${allElements.length} elements`;
      } else {
        countEl.textContent = `${filteredElements.length} of ${allElements.length} elements`;
      }
    }

    if (announcer) {
      announcer.textContent = filteredElements.length === allElements.length
        ? `Showing all ${allElements.length} elements`
        : `Found ${filteredElements.length} of ${allElements.length} elements`;
    }

    if (filteredElements.length === 0) {
      showGridMessage('empty-state', searchQuery
        ? `No elements match "${searchQuery}".`
        : 'No elements found.');
      return;
    }

    grid.innerHTML = filteredElements.map((el, i) => {
      const unavailable = el._unavailable;
      const compSummary = renderComponentSummary(el);
      return `
      <article
        class="element-card"
        data-index="${i}"
        data-type="${escapeAttr(el.type)}"
        ${unavailable ? 'data-unavailable=""' : ''}
        role="listitem button"
        tabindex="0"
        aria-label="${unavailable ? 'Unavailable: ' : 'View '}${escapeHtml(el.name)}"
      >
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(el.name)}</h3>
          <span class="type-badge" data-type="${escapeAttr(el.type)}">${capitalize(el.type)}</span>
          ${unavailable ? '<span class="unavailable-badge">unavailable</span>' : ''}
          <span class="card-expand-icon" aria-hidden="true">▾</span>
        </div>
        ${el.description
          ? `<p class="card-description">${escapeHtml(el.description)}</p>`
          : ''}
        ${compSummary}
        <footer class="card-footer">
          <div class="card-meta">
            ${el.author   ? `<span class="meta-author">${escapeHtml(el.author)}</span>` : ''}
            ${el.version  ? `<span class="meta-version">v${escapeHtml(el.version)}</span>` : ''}
            ${el.category ? `<span class="meta-category">${escapeHtml(el.category)}</span>` : ''}
            ${el.created  ? `<span class="meta-date">${formatDate(el.created)}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="card-download-btn" data-action="download" aria-label="Download ${escapeHtml(el.name)}">⤓</button>
          </div>
          ${el.tags?.length
            ? `<ul class="card-tags" aria-label="Tags">${
                el.tags.slice(0, 5).map(t =>
                  `<li class="tag">${escapeHtml(t)}</li>`
                ).join('')
              }</ul>`
            : ''}
        </footer>
        <div class="card-inline-detail"></div>
      </article>
    `}).join('');

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
    // Download button — fetch and save without opening modal/expand
    if (e.target.closest('[data-action="download"]')) {
      e.stopPropagation();
      const card = e.target.closest('[data-index]');
      if (!card) return;
      const el = filteredElements[Number.parseInt(card.dataset.index, 10)];
      const btn = e.target.closest('[data-action="download"]');
      const prev = btn.textContent;
      btn.textContent = '…';
      fetch(`${RAW_BASE}/${el.path}`)
        .then(r => r.ok ? r.text() : Promise.reject(r.status))
        .then(content => { downloadFile(el.name, content); btn.textContent = prev; })
        .catch(() => { btn.textContent = '✗'; setTimeout(() => { btn.textContent = prev; }, 1500); });
      return;
    }

    const card = e.target.closest('[data-index]');
    if (!card) return;
    const el = filteredElements[Number.parseInt(card.dataset.index, 10)];
    const grid = document.getElementById('elements-grid');
    const isListView = grid?.dataset.view === 'list';

    if (isListView) {
      toggleInlineExpand(card, el);
    } else {
      if (!card.dataset.unavailable) openModal(el);
    }
  }

  async function toggleInlineExpand(card, el) {
    const detail = card.querySelector('.card-inline-detail');
    if (!detail) return;

    if (card.dataset.expanded !== undefined) {
      delete card.dataset.expanded;
      detail.innerHTML = '';
      return;
    }

    card.dataset.expanded = '';
    detail.innerHTML = '<p class="loading" style="font-size:0.8rem;padding:0.4rem 0">Loading…</p>';

    try {
      const url = `${RAW_BASE}/${el.path}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = await res.text();
      detail.innerHTML = renderDetailView(content, el.type);
      detail.querySelectorAll('pre code').forEach(block => {
        if (globalThis.hljs) hljs.highlightElement(block);
      });
    } catch (err) {
      detail.innerHTML = `<p class="error" style="font-size:0.8rem">Could not load: ${escapeHtml(err.message)}</p>`;
    }
  }

  async function openModal(element) {
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
    copyBtn.textContent = '⎘ Copy';

    // Show modal with loading state
    const body = document.getElementById('modal-body');
    body.innerHTML = '<p class="loading">Loading content…</p>';
    modal.showModal();
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close').focus();

    // Fetch full .md file
    try {
      const url = `${RAW_BASE}/${element.path}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = await res.text();

      let showRaw = false;
      const renderBtn = modal.querySelector('#btn-render');

      function renderModalBody() {
        if (showRaw) {
          body.innerHTML = `<pre class="element-source"><code class="element-code">${escapeHtml(content)}</code></pre>`;
          if (globalThis.hljs) body.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
        } else {
          body.innerHTML = renderDetailView(content, element.type);
          body.querySelectorAll('pre code').forEach(b => {
            if (globalThis.hljs) hljs.highlightElement(b);
          });
        }
      }

      renderModalBody();

      if (renderBtn) {
        renderBtn.textContent = '⇄ Raw';
        renderBtn.dataset.mode = 'rendered';
        renderBtn.onclick = () => {
          showRaw = !showRaw;
          renderBtn.textContent = showRaw ? '⇄ Rendered' : '⇄ Raw';
          renderBtn.dataset.mode = showRaw ? 'raw' : 'rendered';
          renderModalBody();
        };
      }

      copyBtn.onclick     = () => copyToClipboard(content, copyBtn);
      downloadBtn.onclick = () => downloadFile(element.name, content);

    } catch (err) {
      body.innerHTML = `<p class="error">Could not load content: ${escapeHtml(err.message)}</p>
        <p class="error-hint">
          <a href="${GITHUB_BASE}/${element.path}" target="_blank" rel="noopener noreferrer">
            View on GitHub directly
          </a>
        </p>`;
      console.error('[DollhouseMCP]', {
        error: err.message,
        context: 'modalLoad',
        element: element.path,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ── Detail view renderer ───────────────────────────────────────────────────

  function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { frontmatter: {}, body: raw };
    let fm = {};
    try {
      fm = (globalThis.jsyaml ? jsyaml.load(match[1]) : {}) || {};
    } catch {
      fm = {};
    }
    const body = raw.slice(match[0].length).trim();
    return { frontmatter: fm, body };
  }

  function renderComponentSummary(el) {
    // Only for ensembles — show component type counts from index metadata
    if (el.type !== 'ensemble' && el.type !== 'ensembles') return '';
    const counts = ['personas','skills','tools','templates','prompts','memories']
      .filter(k => Array.isArray(el[k]) && el[k].length)
      .map(k => `${el[k].length} ${k}`);
    if (!counts.length) return '';
    return `<p class="card-components">${counts.join(' · ')}</p>`;
  }

  function renderDetailView(content, type) {
    const { frontmatter: fm, body } = parseFrontmatter(content);

    const section = (label, html) =>
      `<section class="detail-section">
        <h4 class="detail-section-title">${escapeHtml(label)}</h4>
        <div class="detail-section-body">${html}</div>
      </section>`;

    const pill = (text, cls = '') =>
      `<span class="detail-pill${cls ? ` ${cls}` : ''}">${escapeHtml(String(text))}</span>`;

    const field = (label, value) =>
      value ? `<div class="detail-field"><span class="detail-label">${escapeHtml(label)}</span><span class="detail-value">${escapeHtml(String(value))}</span></div>` : '';

    const pillList = (items, cls) =>
      Array.isArray(items) && items.length
        ? `<div class="detail-pills">${items.map(t => pill(t, cls)).join('')}</div>`
        : '';

    let html = '';

    // ── Core metadata ──
    const coreFields = [
      field('Category', fm.category),
      field('License', fm.license),
      field('Age rating', fm.age_rating),
      field('Created', formatDate(fm.created || fm.created_date)),
    ].filter(Boolean).join('');
    if (coreFields) html += section('Details', coreFields);

    // ── Tags ──
    if (Array.isArray(fm.tags) && fm.tags.length) {
      html += section('Tags', pillList(fm.tags, 'pill-tag'));
    }

    // ── Triggers (personas) ──
    if (Array.isArray(fm.triggers) && fm.triggers.length) {
      html += section('Trigger words', pillList(fm.triggers, 'pill-trigger'));
    }

    // ── Components (ensembles) ──
    const compTypes = ['personas','skills','tools','templates','prompts','memories'];
    const compEntries = compTypes
      .filter(k => Array.isArray(fm[k]) && fm[k].length)
      .map(k => `<div class="detail-field"><span class="detail-label">${capitalize(k)}</span><span class="detail-value">${pillList(fm[k])}</span></div>`)
      .join('');
    if (compEntries) html += section('Components', compEntries);

    // ── Ensemble coordination ──
    if (fm.coordination_strategy) html += section('Coordination', `<p class="detail-prose">${escapeHtml(fm.coordination_strategy)}</p>`);

    // ── Use cases ──
    if (Array.isArray(fm.use_cases) && fm.use_cases.length) {
      html += section('Use cases',
        `<ul class="detail-list">${fm.use_cases.map(u => `<li>${escapeHtml(u)}</li>`).join('')}</ul>`);
    }

    // ── Parameters (skills/tools) ──
    if (fm.parameters && typeof fm.parameters === 'object' && !Array.isArray(fm.parameters)) {
      const paramRows = Object.entries(fm.parameters).map(([name, def]) => {
        const d = typeof def === 'object' && def !== null ? def : {};
        return `<div class="detail-param">
          <span class="detail-param-name">${escapeHtml(name)}</span>
          ${d.description ? `<span class="detail-param-desc">${escapeHtml(d.description)}</span>` : ''}
          ${d.type ? `<span class="detail-pill pill-meta">${escapeHtml(d.type)}</span>` : ''}
          ${d.required ? `<span class="detail-pill pill-required">required</span>` : ''}
          ${d.default !== undefined ? `<span class="detail-label">default: </span><span class="detail-value">${escapeHtml(String(d.default))}</span>` : ''}
        </div>`;
      }).join('');
      if (paramRows) html += section('Parameters', paramRows);
    }

    // ── Proficiency levels (skills) ──
    if (fm.proficiency_levels && typeof fm.proficiency_levels === 'object') {
      const levels = Object.entries(fm.proficiency_levels)
        .map(([lvl, desc]) => field(capitalize(lvl), desc)).join('');
      if (levels) html += section('Proficiency levels', levels);
    }

    // ── Body content ──
    if (body) {
      const rendered = globalThis.marked
        ? `<div class="element-rendered">${marked.parse(body)}</div>`
        : `<pre class="element-source"><code class="element-code">${escapeHtml(body)}</code></pre>`;
      html += section('Content', rendered);
    }

    return html || `<pre class="element-source"><code class="element-code">${escapeHtml(content)}</code></pre>`;
  }

  function closeModal() {
    const modal = document.getElementById('element-modal');
    if (!modal) return;
    modal.close();
    document.body.classList.remove('modal-open');
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
        // NOSONAR - Intentional fallback for non-HTTPS contexts where Clipboard API is unavailable
        document.execCommand('copy');
        ta.remove();
        btn.textContent = 'Copied!';
      } catch {
        btn.textContent = 'Copy failed';
      }
    }
    setTimeout(() => { btn.textContent = original; }, 2000);
  }

  function downloadFile(name, content) {
    const slug = name.toLowerCase().split(/[^a-z0-9]/).filter(Boolean).join('-');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: `${slug}.md` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#x27;');
  }

  function escapeAttr(str) {
    return String(str || '').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
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
      html.dataset.theme = theme;
      const isDark = theme === 'dark';
      if (themeToggleIcon) themeToggleIcon.textContent = isDark ? '☀' : '☾';
      if (themeToggleLbl)  themeToggleLbl.textContent  = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      if (themeToggleBtn)  themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      // Sync highlight.js theme
      const hljsLight = document.getElementById('hljs-theme-light');
      const hljsDark  = document.getElementById('hljs-theme-dark');
      if (hljsLight) hljsLight.disabled = isDark;
      if (hljsDark)  hljsDark.disabled  = !isDark;
      try { localStorage.setItem('color-scheme', theme); } catch {}
    }

    // Restore saved preference; fall back to OS preference
    const saved = (() => { try { return localStorage.getItem('color-scheme'); } catch {} })();
    const preferred = saved || (globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(preferred);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
      });
    }

    // View toggle
    const viewToggle = document.getElementById('view-toggle');
    const elemGrid   = document.getElementById('elements-grid');
    let activeView = (() => { try { return localStorage.getItem('collection-view') || 'grid'; } catch { return 'grid'; } })();

    function applyView(view) {
      activeView = view;
      if (elemGrid) elemGrid.dataset.view = view;
      viewToggle?.querySelectorAll('.view-btn').forEach(btn => {
        const on = btn.dataset.view === view;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on);
      });
      try { localStorage.setItem('collection-view', view); } catch {}
    }

    applyView(activeView);

    viewToggle?.addEventListener('click', e => {
      const btn = e.target.closest('[data-view]');
      if (btn) applyView(btn.dataset.view);
    });

    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.value = activeSort;
      sortSelect.addEventListener('change', e => {
        activeSort = e.target.value;
        applyFilters();
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
