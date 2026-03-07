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

  // ── Constants ──────────────────────────────────────────────────────────────
  const BRANCH_CHECK_CONCURRENCY = 8;   // max parallel HEAD requests
  const SEARCH_DEBOUNCE_MS       = 150; // ms delay before search fires
  const PORTFOLIO_MAX_DEPTH      = 3;   // max directory recursion depth
  const FILE_READ_CONCURRENCY    = 20;  // parallel file reads for portfolio loading
  const PAGE_SIZE                = 50;  // cards per page

  // ── State ──────────────────────────────────────────────────────────────────

  let collectionElements = []; // from collection-index.json
  let localElements = [];      // loaded from local portfolio (~/.dollhouse/portfolio/)
  let allElements = [];        // collectionElements + localElements
  let filteredElements = [];   // currently displayed after search + type filter
  let currentPage = 1;         // pagination — reset on every filter/search change
  let activeTypes = new Set(); // empty = show all; multi-select
  let activeTopic = 'all';

  // Normalize plural index keys → singular CSS/display type names
  const SINGULAR_TYPE = {
    agents: 'agent', personas: 'persona', skills: 'skill',
    templates: 'template', memories: 'memory', ensembles: 'ensemble',
    prompts: 'prompt', tools: 'tool',
  };
  let activeSort = 'date-desc';
  let activeSource = 'all'; // 'all' | 'collection' | 'portfolio'
  let searchQuery = '';

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  async function init() {
    try {
      showGridMessage('loading', 'Loading collection…');
      const res = await fetch('./collection-index.json');
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching collection-index.json`);
      const data = await res.json();

      // Flatten { type: [elements] } → single array with singular type injected
      collectionElements = Object.entries(data.index).flatMap(([type, elements]) =>
        elements.map(el => ({ ...el, type: SINGULAR_TYPE[type] || type }))
      );
      allElements = [...collectionElements, ...localElements];

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
    const CONCURRENCY = BRANCH_CHECK_CONCURRENCY;
    const queue = allElements.filter(el => !el._local);
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

    const isAllActive = activeTypes.size === 0;
    container.innerHTML = types.map(type => {
      const count = type === 'all' ? allElements.length : typeCounts[type];
      const isActive = type === 'all' ? isAllActive : activeTypes.has(type);
      return `<button
        class="type-filter${isActive ? ' active' : ''}"
        data-type="${escapeAttr(type)}"
        aria-pressed="${isActive}"
      >${capitalize(type)} <span class="filter-count">${count}</span></button>`;
    }).join('');

    // Replace listener (clone node removes old listeners)
    const fresh = container.cloneNode(true);
    container.parentNode.replaceChild(fresh, container);
    fresh.addEventListener('click', e => {
      const btn = e.target.closest('[data-type]');
      if (!btn) return;
      const t = btn.dataset.type;
      if (t === 'all') {
        activeTypes.clear();
      } else if (activeTypes.has(t)) {
        activeTypes.delete(t);
      } else {
        activeTypes.add(t);
      }
      fresh.querySelectorAll('.type-filter').forEach(b => {
        const isAll = b.dataset.type === 'all';
        const active = isAll ? activeTypes.size === 0 : activeTypes.has(b.dataset.type);
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
    }, SEARCH_DEBOUNCE_MS);
  }

  // ── Filter + render pipeline ───────────────────────────────────────────────

  function applyFilters() {
    currentPage = 1;
    filteredElements = allElements.filter(el => {
      if (activeTypes.size > 0 && !activeTypes.has(el.type)) return false;
      if (activeTopic !== 'all' && getTopicForElement(el) !== activeTopic) return false;
      if (activeSource === 'collection' && el._local) return false;
      if (activeSource === 'portfolio' && !el._local) return false;
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
      case 'date-asc':  return sorted.sort((a, b) => {
        const da = a.created ? new Date(a.created).getTime() : 0;
        const db = b.created ? new Date(b.created).getTime() : 0;
        return da - db;
      });
      case 'date-desc': return sorted.sort((a, b) => {
        const da = a.created ? new Date(a.created).getTime() : 0;
        const db = b.created ? new Date(b.created).getTime() : 0;
        return db - da;
      });
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

    const total = filteredElements.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const pageEnd   = Math.min(pageStart + PAGE_SIZE, total);
    const pageItems = filteredElements.slice(pageStart, pageEnd);

    if (countEl) {
      const base = total === allElements.length
        ? `${allElements.length} elements`
        : `${total} of ${allElements.length} elements`;
      const pageNote = totalPages > 1 ? ` · page ${currentPage} of ${totalPages}` : '';
      countEl.textContent = base + pageNote;
    }

    if (announcer) {
      announcer.textContent = total === allElements.length
        ? `Showing all ${allElements.length} elements`
        : `Found ${total} of ${allElements.length} elements`;
    }

    if (total === 0) {
      showGridMessage('empty-state', searchQuery
        ? `No elements match "${searchQuery}".`
        : 'No elements found.');
      renderPagination(0, 1);
      return;
    }

    grid.innerHTML = pageItems.map((el, i) => {
      const idx = pageStart + i; // absolute index into filteredElements
      const unavailable = el._unavailable;
      const compSummary = renderComponentSummary(el);
      return `
      <article
        class="element-card"
        data-index="${idx}"
        data-type="${escapeAttr(el.type)}"
        ${unavailable ? 'data-unavailable=""' : ''}
        role="listitem button"
        tabindex="0"
        aria-label="${unavailable ? 'Unavailable: ' : 'View '}${escapeHtml(el.name)}"
      >
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(el.name)}</h3>
          <div class="card-badges">
            <span class="type-badge" data-type="${escapeAttr(el.type)}">${capitalize(el.type)}</span>
            ${el._local ? '<span class="source-badge">LOCAL</span>' : ''}
            ${unavailable ? '<span class="unavailable-badge">unavailable</span>' : ''}
          </div>
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

    renderPagination(total, totalPages);
  }

  function renderPagination(total, totalPages) {
    const nav = document.getElementById('pagination');
    const prevBtn = document.getElementById('btn-prev-page');
    const nextBtn = document.getElementById('btn-next-page');
    const info    = document.getElementById('page-info');
    if (!nav) return;

    if (totalPages <= 1) { nav.hidden = true; return; }

    nav.hidden = false;
    if (prevBtn) {
      prevBtn.disabled = currentPage <= 1;
      prevBtn.onclick = () => { currentPage--; renderResults(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    }
    if (nextBtn) {
      nextBtn.disabled = currentPage >= totalPages;
      nextBtn.onclick = () => { currentPage++; renderResults(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    }
    if (info) {
      const pageStart = (currentPage - 1) * PAGE_SIZE + 1;
      const pageEnd   = Math.min(currentPage * PAGE_SIZE, total);
      info.textContent = `${pageStart}–${pageEnd} of ${total}`;
    }
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
      if (el._local && el._content) {
        downloadFile(el.name, el._content);
      } else {
        btn.textContent = '…';
        fetch(`${RAW_BASE}/${el.path}`)
          .then(r => r.ok ? r.text() : Promise.reject(r.status))
          .then(content => { downloadFile(el.name, content); btn.textContent = prev; })
          .catch(() => { btn.textContent = '✗'; setTimeout(() => { btn.textContent = prev; }, 1500); });
      }
      return;
    }

    const card = e.target.closest('[data-index]');
    if (!card) return;
    const el = filteredElements[Number.parseInt(card.dataset.index, 10)];
    const grid = document.getElementById('elements-grid');
    const isListView = grid?.dataset.view === 'list';

    if (isListView) {
      // Don't collapse when clicking inside expanded content
      if (e.target.closest('.card-inline-detail')) return;
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
    if (!el._local) {
      detail.innerHTML = '<p class="loading" style="font-size:0.8rem;padding:0.4rem 0">Loading…</p>';
    }

    try {
      let content;
      if (el._local) {
        content = el._content;
      } else {
        const res = await fetch(`${RAW_BASE}/${el.path}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        content = await res.text();
      }
      detail.innerHTML = '';

      // Action bar at TOP of expanded content
      const actions = document.createElement('div');
      actions.className = 'inline-detail-actions';
      const copyBtn = document.createElement('button');
      copyBtn.className = 'modal-action-btn';
      copyBtn.textContent = '⎘ Copy';
      copyBtn.onclick = e => { e.stopPropagation(); copyToClipboard(content, copyBtn); };

      const dlBtn = document.createElement('button');
      dlBtn.className = 'modal-action-btn';
      dlBtn.textContent = '⤓ Download';
      dlBtn.onclick = e => { e.stopPropagation(); downloadFile(el.name, content); };

      actions.appendChild(copyBtn);
      actions.appendChild(dlBtn);

      if (el._local) {
        const submitLink = document.createElement('a');
        submitLink.className = 'modal-action-btn modal-action-btn--submit';
        submitLink.href = `https://github.com/DollhouseMCP/collection/issues/new?title=${encodeURIComponent(`Submit: ${el.name}`)}&labels=submission&body=${encodeURIComponent(`**Element type:** ${el.type}\n**Name:** ${el.name}\n\nPaste your element content below:\n\n\`\`\`\n${content}\n\`\`\``)}`;
        submitLink.target = '_blank';
        submitLink.rel = 'noopener noreferrer';
        submitLink.textContent = '↑ Submit';
        actions.appendChild(submitLink);
      } else {
        const ghLink = document.createElement('a');
        ghLink.className = 'modal-action-btn';
        ghLink.href = `${GITHUB_BASE}/${el.path}`;
        ghLink.target = '_blank';
        ghLink.rel = 'noopener noreferrer';
        ghLink.textContent = '↗ GitHub';
        actions.appendChild(ghLink);
      }
      detail.appendChild(actions);

      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = renderDetailView(content, el.type);
      contentDiv.querySelectorAll('pre code').forEach(block => {
        if (globalThis.hljs) hljs.highlightElement(block);
      });
      detail.appendChild(contentDiv);

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
    const modalDate = modal.querySelector('.modal-date');
    if (modalDate) modalDate.textContent = element.created ? formatDate(element.created) : '';
    const modalSource = modal.querySelector('.modal-source');
    if (modalSource) modalSource.textContent = element._local ? 'LOCAL' : '';

    // GitHub link — hidden for local portfolio elements
    const ghLink = modal.querySelector('#btn-github');
    if (ghLink) {
      if (element._local) {
        ghLink.style.display = 'none';
      } else {
        ghLink.style.display = '';
        ghLink.href = `${GITHUB_BASE}/${element.path}`;
      }
    }

    // Submit button — shown only for local elements, hidden otherwise
    const submitBtn = modal.querySelector('#btn-submit');
    if (submitBtn) {
      if (element._local) {
        submitBtn.style.display = '';
        submitBtn.dataset.elementName = element.name;
        submitBtn.dataset.elementType = element.type;
      } else {
        submitBtn.style.display = 'none';
      }
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

    // Fetch full .md file (or use cached local content)
    try {
      let content;
      if (element._local) {
        content = element._content;
      } else {
        const res = await fetch(`${RAW_BASE}/${element.path}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        content = await res.text();
      }

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

      if (element._local && submitBtn) {
        submitBtn.href = `https://github.com/DollhouseMCP/collection/issues/new?title=${encodeURIComponent(`Submit: ${element.name}`)}&labels=submission&body=${encodeURIComponent(`**Element type:** ${element.type}\n**Name:** ${element.name}\n\nPaste your element content below:\n\n\`\`\`\n${content}\n\`\`\``)}`;
      }

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

    // ── Created date — prominent header line ──
    const createdVal = fm.created || fm.created_date;
    if (createdVal) {
      html += `<div class="detail-created"><span class="detail-created-label">Created</span><span class="detail-created-value">${escapeHtml(formatDate(createdVal))}</span></div>`;
    }

    // ── Core metadata ──
    const coreFields = [
      field('Author', fm.author),
      field('Version', fm.version ? `v${fm.version}` : null),
      field('Category', fm.category),
      field('License', fm.license),
      field('Age rating', fm.age_rating),
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

    // ── Catch-all: any remaining frontmatter fields ──
    const knownFields = new Set([
      'name','type','description','author','version','category','license','age_rating',
      'created','created_date','updated','tags','triggers','use_cases','parameters',
      'proficiency_levels','coordination_strategy',
      'personas','skills','tools','templates','prompts','memories',
    ]);
    const extraFields = Object.entries(fm)
      .filter(([k]) => !knownFields.has(k))
      .map(([k, v]) => {
        const display = Array.isArray(v) ? v.join(', ') : (typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v));
        return field(k.replace(/_/g, ' '), display);
      }).filter(Boolean).join('');
    if (extraFields) html += section('Additional metadata', extraFields);

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

  // ── Local portfolio ────────────────────────────────────────────────────────

  // Skip hidden files, index/meta files, and backup entries
  function isPortfolioSkip(name) {
    const lower = name.toLowerCase();
    return name.startsWith('.') ||     // hidden (.DS_Store, etc.)
           name.startsWith('_') ||     // meta (_index.json, etc.)
           lower.includes('backup') || // backup dirs/files
           name.endsWith('.backup');   // explicit backup extension
  }

  // Extract a YYYY-MM-DD date string from a relative file path.
  // Handles both slash-separated dirs (2026/01/15/) and hyphen-prefixed filenames (2026-01-15_topic.yaml).
  function dateFromPath(path) {
    const m = path.match(/(\d{4})[\/\-](\d{2})[\/\-](\d{2})/);
    return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
  }

  // Recursively collect files matching extensions from a directory handle.
  // Returns { name, handle, path } where path is relative to the type subdir (e.g. "2026/01/15/note.yaml").
  async function collectLocalFiles(dirHandle, extensions, maxDepth = PORTFOLIO_MAX_DEPTH, prefix = '') {
    const results = [];
    try {
      for await (const [name, handle] of dirHandle.entries()) {
        if (isPortfolioSkip(name)) continue;
        if (handle.kind === 'file' && extensions.some(ext => name.endsWith(ext))) {
          results.push({ name, handle, path: prefix + name });
        } else if (handle.kind === 'directory' && maxDepth > 0) {
          const sub = await collectLocalFiles(handle, extensions, maxDepth - 1, prefix + name + '/');
          results.push(...sub);
        }
      }
    } catch (err) {
      console.warn('[DollhouseMCP] Portfolio directory read error:', err.message);
    }
    return results;
  }

  // Parse file content — pure YAML files vs frontmatter markdown
  function parseLocalFile(content, name) {
    if (name.endsWith('.yaml') || name.endsWith('.yml')) {
      try {
        const fm = (globalThis.jsyaml ? jsyaml.load(content) : {}) || {};
        return { frontmatter: typeof fm === 'object' && fm !== null ? fm : {}, body: '' };
      } catch {
        return { frontmatter: {}, body: '' };
      }
    }
    return parseFrontmatter(content);
  }

  async function loadLocalPortfolio() {
    if (!window.showDirectoryPicker) {
      alert('Your browser does not support the File System Access API.\nTry Chrome or Edge on desktop.');
      return;
    }

    const btn = document.getElementById('btn-portfolio');
    const prevText = btn?.textContent;
    if (btn) btn.textContent = '…';

    try {
      const dirHandle = await window.showDirectoryPicker({ mode: 'read' });

      const TYPE_EXTENSIONS = {
        agents: ['.md'], personas: ['.md'], skills: ['.md'],
        templates: ['.md'], ensembles: ['.md'], prompts: ['.md'],
        memories: ['.yaml', '.yml'], tools: ['.md'],
      };

      localElements = [];

      for (const [subdirName, type] of Object.entries(SINGULAR_TYPE)) {
        const extensions = TYPE_EXTENSIONS[subdirName] || ['.md'];
        try {
          const subdir = await dirHandle.getDirectoryHandle(subdirName);
          const fileEntries = await collectLocalFiles(subdir, extensions, PORTFOLIO_MAX_DEPTH);
          // Sort descending so newest date-prefixed dirs/files load into page 1 first
          fileEntries.sort((a, b) => b.path.localeCompare(a.path));

          // Read files in parallel batches; update UI every batch so progress is visible
          for (let i = 0; i < fileEntries.length; i += FILE_READ_CONCURRENCY) {
            const batch = fileEntries.slice(i, i + FILE_READ_CONCURRENCY);
            await Promise.all(batch.map(async ({ name, handle, path }) => {
              try {
                const file = await handle.getFile();
                const content = await file.text();
                const { frontmatter: fm } = parseLocalFile(content, name);
                localElements.push({
                  name: fm.name || name.replace(/\.(md|yaml|yml)$/, ''),
                  type,
                  description: fm.description || '',
                  author: fm.author || '',
                  version: fm.version ? String(fm.version) : '',
                  tags: Array.isArray(fm.tags) ? fm.tags : [],
                  created: fm.created_date || fm.created || fm.date || dateFromPath(path) || null,
                  _local: true,
                  _content: content,
                  path,
                });
              } catch { /* skip unreadable file */ }
            }));

            // Update UI after each batch so user sees content appear progressively
            allElements = [...collectionElements, ...localElements];
            if (btn) btn.textContent = `📁 Loading… (${localElements.length})`;
            try { applyFilters(); } catch { /* non-fatal */ }
          }
        } catch { /* subdir may not exist — skip silently */ }
      }

      // Rebuild type/topic filters once with full dataset
      try { renderTypeFilters(); } catch (err) { console.warn('[DollhouseMCP] renderTypeFilters error:', err.message); }
      try { renderTopicFilters(); } catch (err) { console.warn('[DollhouseMCP] renderTopicFilters error:', err.message); }
      applyFilters();

      if (btn) {
        btn.textContent = localElements.length > 0
          ? `📁 Portfolio (${localElements.length})`
          : '📁 Portfolio (empty)';
        btn.dataset.loaded = 'true';
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('[DollhouseMCP] Portfolio load error:', err.message);
        if (btn) btn.textContent = '📁 Portfolio (error)';
      } else {
        if (btn) btn.textContent = prevText;
      }
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

    // Source toggle
    const sourceToggle = document.getElementById('source-toggle');
    if (sourceToggle) {
      sourceToggle.addEventListener('click', e => {
        const btn = e.target.closest('[data-source]');
        if (!btn) return;
        activeSource = btn.dataset.source;
        sourceToggle.querySelectorAll('[data-source]').forEach(b => {
          const on = b.dataset.source === activeSource;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', on);
        });
        applyFilters();
      });
    }

    // Portfolio button
    document.getElementById('btn-portfolio')?.addEventListener('click', loadLocalPortfolio);

    init();
  });

})();
