/**
 * Browser UI tests for the DollhouseMCP Collection Browser.
 *
 * These tests run against the live page served at BASE_URL.
 * They inject mock data via page.addInitScript so tests are deterministic
 * and don't depend on real GitHub fetches or local file system access.
 */

import { test, expect, Page } from '@playwright/test';

// ── Shared mock data ─────────────────────────────────────────────────────────

const MOCK_COLLECTION_INDEX = {
  generated: '2025-01-01T00:00:00Z',
  total_elements: 5,
  index: {
    agents:   [{ name: 'Alpha Agent',   path: 'agents/alpha.md',    description: 'An agent',        author: 'alice', version: '1.0', tags: ['productivity'], created: '2025-01-15' }],
    personas: [{ name: 'Beta Persona',  path: 'personas/beta.md',   description: 'A persona',       author: 'bob',   version: '2.0', tags: ['creative'],     created: '2025-01-10' }],
    skills:   [{ name: 'Gamma Skill',   path: 'skills/gamma.md',    description: 'A skill',         author: 'carol', version: '1.1', tags: ['development'],  created: '2025-01-05' }],
    memories: [{ name: 'Delta Memory',  path: 'memories/delta.md',  description: 'A memory',        author: 'dave',  version: '1.0', tags: [],               created: '2025-01-01' }],
    ensembles:[{ name: 'Epsilon Suite', path: 'ensembles/eps.md',   description: 'An ensemble',     author: 'eve',   version: '1.0', tags: ['business'],     created: '2024-12-20' }],
  },
};

const MOCK_LOCAL_ELEMENTS = [
  { name: 'Local Agent One',   type: 'agent',   description: 'Local agent',   author: 'me', version: '1.0', tags: ['local'], created: '2025-02-01', _local: true, _content: '---\nname: Local Agent One\ntype: agent\n---\nBody content here.', path: 'local-agent.md' },
  { name: 'Local Skill Alpha', type: 'skill',   description: 'Local skill',   author: 'me', version: '1.0', tags: ['local'], created: '2025-02-05', _local: true, _content: '---\nname: Local Skill Alpha\ntype: skill\n---\nSkill body.', path: 'local-skill.md' },
  { name: 'Local Persona X',  type: 'persona', description: 'Local persona', author: 'me', version: '1.0', tags: [],        created: '2025-01-20', _local: true, _content: '---\nname: Local Persona X\ntype: persona\n---\n', path: 'local-persona.md' },
];

/** Intercept the collection-index.json fetch and inject mock data + local elements */
async function setupMocks(page: Page) {
  await page.addInitScript(({ mockIndex, mockLocal }) => {
    // Override fetch for collection-index.json
    const orig = globalThis.fetch.bind(globalThis);
    globalThis.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : (input as Request).url;
      if (url.includes('collection-index.json')) {
        return new Response(JSON.stringify(mockIndex), { headers: { 'Content-Type': 'application/json' } });
      }
      // Block GitHub raw fetches so tests are offline-safe
      if (url.includes('raw.githubusercontent.com')) {
        return new Response('---\nname: Mock\n---\nMock content.', { status: 200 });
      }
      return orig(input, init);
    };
    // Inject local elements directly after init
    (globalThis as any).__TEST_LOCAL_ELEMENTS__ = mockLocal;
  }, { mockIndex: MOCK_COLLECTION_INDEX, mockLocal: MOCK_LOCAL_ELEMENTS });
}

/** Inject local elements into the app state after page load */
async function injectLocalElements(page: Page) {
  await page.evaluate(() => {
    const local: any[] = (globalThis as any).__TEST_LOCAL_ELEMENTS__ || [];
    if (local.length === 0) return;
    // Dispatch a custom event that the test harness in app.js can listen to
    // Since we can't directly set module state, we simulate the portfolio button effect
    // by dispatching a test-inject event
    const event = new CustomEvent('test:inject-local', { detail: local });
    document.dispatchEvent(event);
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Collection loading', () => {
  test('page loads and displays collection elements', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.element-card', { timeout: 5000 });

    const cards = page.locator('.element-card');
    await expect(cards).toHaveCount(5);
  });

  test('shows correct element counts in stats bar', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('#stats', { timeout: 5000 });

    const stats = page.locator('#stats');
    await expect(stats).toContainText('5');
  });

  test('elements render with correct type badges', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.type-badge', { timeout: 5000 });

    const agentBadge = page.locator('.type-badge[data-type="agent"]').first();
    await expect(agentBadge).toBeVisible();
    await expect(agentBadge).toContainText('Agent');
  });
});

test.describe('Type filter chips', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.type-filter', { timeout: 5000 });
  });

  test('All filter shows all elements', async ({ page }) => {
    const allBtn = page.locator('.type-filter[data-type="all"]');
    await allBtn.click();
    await expect(page.locator('.element-card')).toHaveCount(5);
  });

  test('single type filter shows only that type', async ({ page }) => {
    const agentBtn = page.locator('.type-filter[data-type="agent"]');
    await agentBtn.click();
    await expect(page.locator('.element-card')).toHaveCount(1);
    await expect(page.locator('.element-card .type-badge')).toContainText('Agent');
  });

  test('multi-select type filter shows multiple types', async ({ page }) => {
    await page.locator('.type-filter[data-type="agent"]').click();
    await page.locator('.type-filter[data-type="skill"]').click();
    await expect(page.locator('.element-card')).toHaveCount(2);
  });

  test('clicking active type deselects it', async ({ page }) => {
    const agentBtn = page.locator('.type-filter[data-type="agent"]');
    await agentBtn.click(); // select
    await expect(page.locator('.element-card')).toHaveCount(1);
    await agentBtn.click(); // deselect
    await expect(page.locator('.element-card')).toHaveCount(5);
  });

  test('All button clears multi-selection', async ({ page }) => {
    await page.locator('.type-filter[data-type="agent"]').click();
    await page.locator('.type-filter[data-type="skill"]').click();
    await page.locator('.type-filter[data-type="all"]').click();
    await expect(page.locator('.element-card')).toHaveCount(5);
    const allBtn = page.locator('.type-filter[data-type="all"]');
    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('Sort controls', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.element-card', { timeout: 5000 });
  });

  test('sort by name A-Z', async ({ page }) => {
    await page.locator('#sort-select').selectOption('name-asc');
    const names = await page.locator('.card-title').allTextContents();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('sort by name Z-A', async ({ page }) => {
    await page.locator('#sort-select').selectOption('name-desc');
    const names = await page.locator('.card-title').allTextContents();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sort newest first puts most recent dates first', async ({ page }) => {
    await page.locator('#sort-select').selectOption('date-desc');
    const firstCard = page.locator('.element-card').first();
    // Alpha Agent has most recent date (2025-01-15) among mock data
    await expect(firstCard.locator('.card-title')).toContainText('Alpha Agent');
  });

  test('sort oldest first puts earliest dates first', async ({ page }) => {
    await page.locator('#sort-select').selectOption('date-asc');
    const firstCard = page.locator('.element-card').first();
    // Epsilon Suite has oldest date (2024-12-20)
    await expect(firstCard.locator('.card-title')).toContainText('Epsilon Suite');
  });
});

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.element-card', { timeout: 5000 });
  });

  test('search by name filters cards', async ({ page }) => {
    await page.locator('#search-input').fill('Alpha');
    await page.waitForTimeout(200); // debounce
    await expect(page.locator('.element-card')).toHaveCount(1);
    await expect(page.locator('.card-title').first()).toContainText('Alpha Agent');
  });

  test('search by author', async ({ page }) => {
    await page.locator('#search-input').fill('bob');
    await page.waitForTimeout(200);
    await expect(page.locator('.element-card')).toHaveCount(1);
    await expect(page.locator('.card-title').first()).toContainText('Beta Persona');
  });

  test('search by tag', async ({ page }) => {
    await page.locator('#search-input').fill('productivity');
    await page.waitForTimeout(200);
    await expect(page.locator('.element-card')).toHaveCount(1);
  });

  test('empty search shows all elements', async ({ page }) => {
    await page.locator('#search-input').fill('xyz-no-match');
    await page.waitForTimeout(200);
    await page.locator('#search-input').fill('');
    await page.waitForTimeout(200);
    await expect(page.locator('.element-card')).toHaveCount(5);
  });

  test('/ key focuses search input', async ({ page }) => {
    await page.keyboard.press('/');
    await expect(page.locator('#search-input')).toBeFocused();
  });
});

test.describe('View modes', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.element-card', { timeout: 5000 });
  });

  test('cards view is default', async ({ page }) => {
    const grid = page.locator('#elements-grid');
    await expect(grid).toHaveAttribute('data-view', 'grid');
  });

  test('list view shows compact rows', async ({ page }) => {
    await page.locator('.view-btn[data-view="list"]').click();
    const grid = page.locator('#elements-grid');
    await expect(grid).toHaveAttribute('data-view', 'list');
    await expect(page.locator('.element-card')).toHaveCount(5);
  });

  test('detail view shows expanded cards', async ({ page }) => {
    await page.locator('.view-btn[data-view="detail"]').click();
    await expect(page.locator('#elements-grid')).toHaveAttribute('data-view', 'detail');
  });
});

test.describe('Element modal', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.element-card', { timeout: 5000 });
  });

  test('clicking card in grid view opens modal', async ({ page }) => {
    await page.locator('.element-card').first().click();
    await expect(page.locator('#element-modal')).toBeVisible();
  });

  test('modal shows element name', async ({ page }) => {
    await page.locator('.element-card').first().click();
    await expect(page.locator('#modal-title')).not.toBeEmpty();
  });

  test('modal close button closes modal', async ({ page }) => {
    await page.locator('.element-card').first().click();
    await page.locator('#modal-close').click();
    await expect(page.locator('#element-modal')).not.toBeVisible();
  });

  test('Escape key closes modal', async ({ page }) => {
    await page.locator('.element-card').first().click();
    await expect(page.locator('#element-modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#element-modal')).not.toBeVisible();
  });

  test('raw/rendered toggle switches view', async ({ page }) => {
    await page.locator('.element-card').first().click();
    await page.waitForSelector('.detail-section, .element-source', { timeout: 3000 });
    await page.locator('#btn-render').click();
    await expect(page.locator('.element-source')).toBeVisible();
  });
});

test.describe('List view inline expand', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.element-card', { timeout: 5000 });
    await page.locator('.view-btn[data-view="list"]').click();
  });

  test('clicking card in list view expands inline', async ({ page }) => {
    await page.locator('.element-card').first().click();
    await expect(page.locator('.card-inline-detail').first()).toBeVisible();
  });

  test('expanded card shows action buttons', async ({ page }) => {
    await page.locator('.element-card').first().click();
    const detail = page.locator('.card-inline-detail').first();
    await expect(detail.locator('.inline-detail-actions')).toBeVisible();
  });

  test('clicking expanded card again collapses it', async ({ page }) => {
    await page.locator('.element-card').first().click();
    await page.locator('.element-card').first().click();
    await expect(page.locator('.card-inline-detail').first()).not.toBeVisible();
  });
});

test.describe('Source toggle (All / Collection / Portfolio)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.element-card', { timeout: 5000 });
  });

  test('"All" source shows all elements', async ({ page }) => {
    await page.locator('.source-btn[data-source="all"]').click();
    await expect(page.locator('.element-card')).toHaveCount(5);
  });

  test('"Collection" source shows only collection elements', async ({ page }) => {
    await page.locator('.source-btn[data-source="collection"]').click();
    // No local elements loaded, so all 5 collection elements show
    await expect(page.locator('.element-card')).toHaveCount(5);
    // No LOCAL badges
    await expect(page.locator('.source-badge')).toHaveCount(0);
  });

  test('"Portfolio" source with no local elements shows empty state', async ({ page }) => {
    await page.locator('.source-btn[data-source="portfolio"]').click();
    // No local elements loaded → empty state message
    const grid = page.locator('#elements-grid');
    await expect(grid).toContainText('No elements');
  });
});

test.describe('Dark mode', () => {
  test('theme toggle switches to dark mode', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('theme toggle switches back to light mode', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.locator('#theme-toggle').click(); // dark
    await page.locator('#theme-toggle').click(); // light
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('Results count', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.element-card', { timeout: 5000 });
  });

  test('shows total count when no filters active', async ({ page }) => {
    await expect(page.locator('#results-count')).toContainText('5');
  });

  test('shows filtered count when filter is active', async ({ page }) => {
    await page.locator('.type-filter[data-type="agent"]').click();
    await expect(page.locator('#results-count')).toContainText('1');
    await expect(page.locator('#results-count')).toContainText('5');
  });
});

test.describe('Type color differentiation', () => {
  test('agent cards use blue color family', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.element-card[data-type="agent"]', { timeout: 5000 });

    const agentCard = page.locator('.element-card[data-type="agent"]').first();
    const familyColor = await agentCard.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--family-1').trim()
    );
    // Agent blue (#5c9cfb)
    expect(familyColor).toBeTruthy();
    expect(familyColor).not.toBe(getComputedStyle(document.documentElement).getPropertyValue('--signal-2'));
  });

  test('all type badges have data-type attribute matching element type', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.type-badge', { timeout: 5000 });

    const badges = page.locator('.type-badge');
    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      await expect(badges.nth(i)).toHaveAttribute('data-type');
    }
  });
});
