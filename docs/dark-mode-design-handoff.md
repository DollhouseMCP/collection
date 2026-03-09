# Dark Mode Design Handoff — DollhouseMCP Collection

## Summary

The collection site's dark mode was redesigned to fix two related problems:

1. **Background/surface colors were too saturated** — deep navy blues gave a "neon dance floor" feel instead of a professional neutral dark.
2. **Text was too dim** — all ink levels read as flat gray rather than legible, hierarchical content.

This document captures every change made and the reasoning behind each, so the same fixes can be applied to other DollhouseMCP properties (e.g. the main website).

---

## Problem 1: Over-saturated Backgrounds

### Root Cause
The `--paper` base color was `#0d1a2e` — a deep, saturated navy. All surfaces, gradients, and shadows inherited that blue cast. At full-screen width in a dark room, the page felt electric rather than calm.

### Fix: Shift to Neutral Near-Black

| Token | Before | After | Notes |
|---|---|---|---|
| `--paper` | `#0d1a2e` | `#111318` | Neutral near-black, no blue cast |
| `--paper-strong` | `#132139` | `#161b24` | Slightly lifted neutral |
| `--surface-1` | `#162847` | `#1c2230` | Card backgrounds — calm dark |
| `--surface-2` | `#1a2f50` | `#212838` | Nested surfaces — subtle step |
| `--line` | `#253a5a` | `#2b3445` | Dividers/borders — quieter |
| `--ink-950` (text) | `#edf4ff` | `#f6f9fd` | Less blue-tinted, brighter |
| `--ink-900` | `#cddaf0` | `#dce6f2` | Noticeably brighter |
| `--ink-700` | `#94aed0` | `#a8bcce` | Secondary labels |
| `--ink-500` | `#6b89b0` | `#7b93a7` | Muted/dim text |
| `--shadow-soft` opacity | `0.6` | `0.4` | Softer depth |
| `--shadow-card` opacity | `0.72` | `0.5` | Less dramatic |

**Reference palette:** GitHub dark (`#0d1117` base), Linear, Vercel — all use neutral near-blacks, not blue-blacks.

---

## Problem 2: Over-saturated Type Color Accents on Cards

### Root Cause
Each element type (agent, persona, skill, etc.) has a color family (`--family-1` through `--family-4`). These were used at high percentages on card borders, card background gradients, the diamond icon, and the list-view left stripe — all simultaneously. On a dark background, the cumulative effect was overwhelming.

### Design Principle
The **type label pill** (the colored badge in the corner of each card) already carries full type identity at a glance. Everything else — border, background tint, diamond, stripe — is supporting detail and should be nearly invisible in dark mode.

### Fix: Dark Mode Overrides for Card Accents

Add these overrides **after** the existing card styles. They apply only in dark mode and leave light mode unchanged.

```css
/* Dark mode: pull color accents back — the type label pill carries identity;
   card surfaces should be calm. Light mode keeps fuller saturation. */
[data-theme="dark"] .element-card {
  border: 1px solid color-mix(in srgb, var(--family-2) 8%, var(--line));
  background:
    radial-gradient(circle at 95% 6%,
      color-mix(in srgb, var(--family-1) 5%, transparent), transparent 40%),
    var(--surface-1);
}
[data-theme="dark"] .element-card::before {
  background: color-mix(in srgb, var(--family-1) 28%, var(--surface-2));
  opacity: 0.45;
}
[data-theme="dark"] .elements-grid[data-view="list"] .element-card {
  border-left: 3px solid color-mix(in srgb, var(--family-1) 45%, var(--line));
}
```

| Element | Light mode % | Dark mode % | What changed |
|---|---|---|---|
| Card border color mix | ~20% family-2 | 8% family-2 | Near-invisible tint |
| Card background radial | ~16% family-1 | 5% family-1 | Barely-there glow |
| Diamond `::before` | 60% family-1, opacity 0.7 | 28% family-1, opacity 0.45 | Subtle |
| List-view left stripe | 4px, 100% family-1 | 3px, 45% family-1 mixed with `--line` | Muted stripe |

---

## Problem 3: Body Background Gradient

The dark body had a `radial-gradient` blending signal blue and accent orange into the paper color at 4%/3%. Reduce to 2%/2%:

```css
[data-theme="dark"] body {
  background:
    radial-gradient(110% 55% at 0% 0%,
      color-mix(in srgb, var(--signal) 2%, var(--paper)),
      transparent 60%),
    radial-gradient(90% 50% at 100% 100%,
      color-mix(in srgb, var(--accent) 2%, var(--paper)),
      transparent 55%),
    var(--paper);
}
```

---

## Checklist for Applying to Another Site

- [ ] Replace deep navy `--paper` with neutral near-black (e.g. `#111318` or similar `#10-14` range with no blue bias)
- [ ] Step up all `--ink-*` values — primary text should be near `#f5-f8` range, not `#e0-e6`
- [ ] Reduce shadow opacity — `0.4`–`0.5` is enough on dark surfaces
- [ ] Audit any `color-mix()` calls using type/brand colors in card/surface backgrounds — cap at 5–8% in dark mode
- [ ] Check that colored decorative elements (borders, stripes, icons) are overridden in dark mode to use much lower percentages
- [ ] Verify the type/category label or badge still reads clearly — it should be the brightest color identifier on the card
- [ ] Test in a dark room at full brightness and at reduced brightness — the "dance floor" effect is most obvious at high screen brightness

---

## Files Changed (Collection Repo)

- `public/styles.css` — all changes above; dark mode tokens at top of file in `[data-theme="dark"]` block, card overrides in a dedicated comment block after the per-type family variable assignments

## Commits

- `style(dark-mode): desaturate navy palette toward neutral charcoal` — base palette shift
- `style(dark-mode): reduce element type color bleeding on cards` — card accent overrides
- `style(dark-mode): brighten text ink scale` — first ink pass
- `style(dark-mode): further brighten text ink scale` — second ink pass
