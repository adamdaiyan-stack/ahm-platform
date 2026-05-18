# ADR-004: Frontend Design Language — Institutional Dark UI

**Date:** 2026-05-18  
**Status:** Accepted  
**Author:** AHM Architecture Team  
**Related:** ADR-001 (Platform Positioning)

---

## Context

Financial platforms in Pakistan typically fall into one of two visual registers:

1. **Legacy brokerage aesthetic** — white backgrounds, default Bootstrap tables, blue/green accent colors, PDF-export mentality
2. **Consumer trading app aesthetic** — bright greens and reds, gamified animations, confetti on trade execution, mobile-first simplicity over information density

AHM Platform serves neither of these users exclusively. It targets sophisticated retail investors and institutional-adjacent users who want information density with clarity — not noise reduction through dumbing-down, and not gamification through visual stimulation.

A deliberate design language decision was required early in development to prevent aesthetic drift as the product scales.

---

## Problem

Without a codified design language decision, the platform risks:

1. **Aesthetic inconsistency** — different components built by different sessions using different color approaches
2. **Trust mismatch** — visual language that contradicts the intelligence-first positioning
3. **Scalability failure** — hardcoded colors that cannot be themed or white-labeled
4. **Retail signal** — UI patterns that communicate "this is for day traders," not "this is for serious investors"
5. **Technical debt** — inconsistent color values, typography, spacing across hundreds of components

---

## Decision

**AHM Platform uses an institutional dark UI design language, implemented via a CSS variable theme system.**

The visual identity is anchored to three reference points held in simultaneous balance:
- **Bloomberg Terminal** — data density, credibility, monospace for data values
- **Linear** — dark surfaces, whitespace as information, modern engineering aesthetic
- **Stripe Dashboard** — structured card hierarchy, clean data relationships

All color values are CSS variables. No hardcoded hex values in component className strings (exception: dynamic accent colors from DB that must be set via inline style).

---

## Core Design Decisions

### Decision 1: Dark Theme as Default (Not Optional)

The platform is dark-only. There is no light mode.

**Reasoning:**
- Dark themes signal professional/terminal tools — this aligns with intelligence-first positioning
- Financial data with positive/negative semantic coloring is significantly more readable against dark surfaces
- Bloomberg, TradingView, Koyfin, and Linear (the reference platforms) are all dark-first
- Dark interfaces reduce eye strain for extended analysis sessions
- A light mode would require doubling the CSS variable set and all component testing

If a light mode is required for specific use cases (e.g., printed reports, institutional white-label), it can be implemented as a theme layer without touching component logic.

### Decision 2: CSS Variable Theme System (No Hardcoded Colors)

All semantic colors are defined as CSS variables with Tailwind utility class mappings:

```css
bg-base         → --color-base         (#0d0e11)
bg-surface      → --color-surface      (#141519)
bg-raised       → --color-raised       (#1a1b1f)
border-border-theme → --color-border-theme (#1e2026)
text-tx-primary → --color-tx-primary   (#f0f2f5)
text-tx-secondary → --color-tx-secondary (#8b909a)
text-tx-disabled → --color-tx-disabled (#4a5060)
text-gain       → --color-gain         (#22c55e)
text-loss       → --color-loss         (#ef4444)
```

**Reasoning:**
- Enables future white-labeling — change variables, not components
- Enables dark/light theme switching at the system level
- Enforces semantic consistency — "gain" always means the same color
- Prevents component-level color drift as the codebase scales

### Decision 3: Monospace for Financial Data

All ticker symbols, price values, percentage changes, and financial metrics use monospace (`font-mono`) with `tabular-nums`.

**Reasoning:**
- Tabular numbers prevent column width jitter as values change
- Monospace aligns decimal points across rows in tables
- Monospace connotes precision and terminal tools — consistent with institutional positioning
- Bloomberg and all professional financial terminals use monospace for data

### Decision 4: Section Label Pattern

All section headers use the pattern:
```
text-xs font-mono text-tx-disabled uppercase tracking-widest
```

**Reasoning:**
- Creates consistent visual rhythm across the entire platform
- "Eyebrow label" pattern is used by Bloomberg, Koyfin, and all premium financial UIs
- All-caps + wide tracking + small size = professional section delineation without visual weight
- Monospace reinforces the terminal/data aesthetic

### Decision 5: Accent Colors from Database

Company and sector accent colors are stored in the database (`company_intelligence.accent_color`, `sectors.accent_color`) and applied as left-border treatments or glow effects.

**Reasoning:**
- Accent colors are content, not design system — they should be changeable without code deploys
- Storing in DB enables per-company visual identity at scale (500 companies, 500 configurable accents)
- Keeps component code clean — no hardcoded per-company color maps

### Decision 6: No Gamification

The platform explicitly rejects gamified UX patterns:
- No confetti or celebration animations on trade execution
- No streak counters or achievement badges
- No "hot" / "trending" / "rocket" labeling for stocks
- No color-coded "buy signals" that look like mobile trading apps

**Reasoning:**
- Gamification contradicts the intelligence-first positioning
- Gamification encourages impulsive behavior — the platform's purpose is informed decision-making
- Institutional and sophisticated retail clients find gamification off-putting and trust-eroding

### Decision 7: Information Density Without Noise

The platform shows more information than most PSX platforms, but every element earns its space.

Rules:
- Empty states are informative, not apologetic
- Secondary metadata (market cap, volume) is visible but smaller than primary data
- Progressive disclosure — key data is prominent, detail is accessible on interaction
- Cards do not repeat data that is visible in the row above them

---

## Implementation Standards

### Color Usage Rules
- **Never** use `text-green-500` for positive values — use `text-gain`
- **Never** use `text-red-500` for negative values — use `text-loss`
- **Never** hardcode `#1a1b1f` — use `bg-raised`
- **Only** use inline `style={{ color: accentColor }}` for DB-sourced dynamic accent colors

### Component Pattern Rules
- Cards: `bg-surface border border-border-theme rounded-xl`
- Hover: `hover:bg-raised transition-colors`
- Dividers within cards: `divide-y divide-border-theme`
- Section labels: `text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4`

### Typography Rules
- Data values: `font-mono tabular-nums`
- Ticker symbols: `font-mono font-bold`
- Body text: default sans-serif (Tailwind default)
- Code/technical labels: `font-mono`

---

## Tradeoffs

| Benefit | Cost |
|---------|------|
| Consistent professional aesthetic at scale | Requires discipline to not deviate from variable system |
| Single theme change affects all components | Light mode requires full CSS variable duplication |
| Institutional trust signal | Some retail users prefer lighter, more colorful UIs |
| Scalable via CSS variables | Learning curve for new contributors unfamiliar with the system |
| DB-stored accent colors enable scale | Requires DB query for accent colors (minimal overhead) |

---

## Consequences

### Immediate
- All new components must use CSS variable class names only
- PR reviews should check for hardcoded color values in className
- The CSS variable documentation must be included in all frontend chat context initialization

### Long-Term
- White-labeling the platform for other brokers requires only a CSS variable override
- A light mode, if ever required, can be implemented by redefining CSS variables without touching component code
- The design system's consistency becomes a scale advantage — 500-component codebases with consistent aesthetics are rare

---

*ADR-004 | Accepted | May 2026 | Review if white-labeling, light mode, or mobile app requires design system extension*
