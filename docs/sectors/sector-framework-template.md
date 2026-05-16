# AHM Platform — Sector Framework Template
**Version 1.0 · Official Standard**

> This document is the authoritative specification for building sector pages on the AHM Platform.
> Every sector — Banking, Cement, Oil & Gas, Fertiliser, Power, Automobile, Textiles, and all future sectors —
> must be built by following this document exactly.
>
> **Banking is the master reference implementation.** When in doubt, read `components/sectors/banking/BankingFrameworkPage.tsx`.

---

## 1. Purpose

The AHM Sector Framework is a three-level progressive disclosure system that presents sector intelligence
in a layered way — from retail-accessible overview to institutional-grade analytics — without overwhelming
users and without removing depth.

The framework exists to:

- Enforce a consistent intelligence hierarchy across all sectors
- Enable retail users to understand a sector in under 2 minutes
- Enable institutional users to drill into the full analytical depth
- Prevent sector-by-sector layout chaos and component duplication
- Create a scalable foundation for future AI-powered intelligence layers

Every sector module built on this framework is a structured financial intelligence report, not a
collection of widgets.

---

## 2. Three-Level Structure

The page renders three levels in strict order. This order is non-negotiable.

```
┌─────────────────────────────────────────────────────────────┐
│  HERO — Always visible. Full width. No interaction required. │
│  Accent stripe · Breadcrumb · Name · Subtitle · Stats strip  │
├─────────────────────────────────────────────────────────────┤
│  LEVEL 1 — RETAIL OVERVIEW                                   │
│  Visible without interaction. The "opening brief."           │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Snapshot    → Live sector stock prices              │    │
│  │  Drivers     → 4–6 key sector variables              │    │
│  │  Intelligence→ Editorial sector overview             │    │
│  └──────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  ─────────── Advanced Analytics · Level 2 ───────────       │
│  LEVEL 2 — ADVANCED ANALYTICS                                │
│  Expandable accordion sections. Each section has a           │
│  always-visible takeaway + full depth behind expand.         │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  [Section 1 — defaultOpen]  Takeaway · Expand ↓     │    │
│  │  [Section 2]                Takeaway · Expand ↓     │    │
│  │  [Section N]                Takeaway · Expand ↓     │    │
│  └──────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  ─────────────────── border-t ──────────────────────        │
│  LEVEL 3 — RESEARCH LAYER · Institutional                    │
│  Live research_reports links + AI summary placeholder        │
└─────────────────────────────────────────────────────────────┘
```

### Level 1 — Retail Overview

Level 1 is always rendered, requires no user action, and must be sufficient to give a retail investor
a complete understanding of the sector's current state. These three sections always appear in this order:

| Section | Component | ID |
|---|---|---|
| Live Prices | `SectorSnapshot` | `sector-snapshot` |
| Key Drivers | `SectorDrivers` | `sector-drivers` |
| Intelligence | `SectorIntelligenceSummary` | `sector-intelligence` |

### Level 2 — Advanced Analytics

Level 2 is the institutional depth layer. It is composed of `ExpandableSection` blocks passed as the
`analyticsSlot` prop. Each block has a `takeaway` that is always visible even when collapsed.

A user who only reads the takeaways across all Level 2 sections has effectively read a full sector brief.

The Level 2 anchor ID is always `sector-analytics` — defined on the wrapper in `SectorPageFrame`.

### Level 3 — Research Layer

Level 3 shows live research reports linked to `research_reports` database rows. When no reports exist,
it shows a structured placeholder indicating what is coming. The ID is always `sector-research`.

---

## 3. SectorFrameworkConfig — Data Standard

`SectorFrameworkConfig` is the pure-data config object passed from the sector page to `SectorPageFrame`.
It contains only serialisable values. **No ReactNode. No functions. No JSX.**

```typescript
type SectorFrameworkConfig = {
  slug:                string;        // URL slug — must match sectorMap key
  name:                string;        // Display name: "Banking", "Cement"
  accentColor:         string;        // Hex colour — accent stripe + labels
  subtitle:            string;        // 2–3 sentence hero paragraph
  stats:               SectorStat[];  // Up to 5 headline statistics
  drivers:             SectorDriver[];// 4–6 key sector drivers
  intelligenceSummary: string;        // Editorial paragraph (AI-ready slot)
};

type SectorStat = {
  val: string;  // e.g. "Rs594.6B"
  lbl: string;  // e.g. "Listed Sector PAT CY2024"
};

type SectorDriver = {
  label:       string;       // e.g. "SBP Policy Rate"
  description: string;       // Why this variable moves the sector
  current:     string;       // Current reading or status
  trend:       DriverTrend;  // "positive" | "negative" | "neutral" | "watch"
};
```

### Stats standard

Provide exactly 3–5 stats. These are the most important numbers a retail user sees first.
Use current figures. Label them with context (period, YoY, etc).

```typescript
// GOOD
{ val: "Rs594.6B", lbl: "Listed Sector PAT CY2024 (+5% YoY)" }

// BAD
{ val: "594.6",    lbl: "Profit" }
```

### Drivers standard

Provide exactly 4–6 drivers. Each driver must explain:
1. **What the variable is** and why it moves sector earnings
2. **The current state** of that variable
3. **The trend signal** — positive, negative, neutral, or watch

Do not pad with generic macros. Every driver must be sector-specific.

### intelligenceSummary standard

One editorial paragraph. Written as if by a senior analyst. Should cover:
- Current sector environment
- Primary near-term risk or opportunity
- Structural trend that matters for the next 1–3 years

This field is the AI-ready slot — it will be dynamically generated in a future sprint.
For now, it is static editorial content updated manually.

---

## 4. Analytics Slot Pattern — RSC Boundary

### Why this pattern exists

`SectorPageFrame` is a **Server Component**. `ExpandableSection` is a **Client Component**.
React Server Components cannot include ReactNode inside a serialised config object passed
across the server/client boundary.

Storing `ExpandableSection` blocks inside `SectorFrameworkConfig` would cause a build error.

### The correct pattern

The sector page (server component) composes `ExpandableSection` blocks as a ReactNode and passes
them to `SectorPageFrame` via the `analyticsSlot` prop:

```tsx
// BankingFrameworkPage.tsx — server component
export default async function BankingFrameworkPage() {
  const analyticsSlot = (
    <>
      <ExpandableSection id="overview" label="..." takeaway="...">
        <HtmlTab html={tab("overview")} />
      </ExpandableSection>
      {/* more sections */}
    </>
  );

  return (
    <SectorPageFrame
      config={BANKING_CONFIG}     // pure data — safe across RSC boundary
      analyticsSlot={analyticsSlot} // ReactNode — composed server-side
      navItems={BANKING_NAV}
      snapshotData={companies}
      reports={reports}
    />
  );
}
```

`SectorPageFrame` receives `analyticsSlot` as `React.ReactNode` and renders it directly inside
the Level 2 section. No data extraction or transformation happens in the frame.

**Rule: `SectorFrameworkConfig` is always pure data. ReactNode always flows through `analyticsSlot`.**

---

## 5. Required Shared Components

These components must be used as-is. Do not create sector-specific versions of any of these.

| Component | Location | Role |
|---|---|---|
| `SectorPageFrame` | `framework/SectorPageFrame.tsx` | Layout shell — three-level structure |
| `SectorHero` | `framework/SectorHero.tsx` | Accent stripe, heading, stats strip |
| `SectorSnapshot` | `framework/SectorSnapshot.tsx` | Live price cards |
| `SectorDrivers` | `framework/SectorDrivers.tsx` | Key driver cards with trend badges |
| `SectorIntelligenceSummary` | `framework/SectorIntelligenceSummary.tsx` | Editorial intelligence block |
| `ExpandableSection` | `framework/ExpandableSection.tsx` | Accordion section with takeaway |
| `SectorSideNav` | `framework/SectorSideNav.tsx` | Sticky desktop sidebar + mobile pill nav |
| `SectorResearchLayer` | `framework/SectorResearchLayer.tsx` | L3 research links + placeholder |
| `SectionLabel` | `framework/SectionLabel.tsx` | Standard section header primitive |

All components are exported from `components/sectors/framework/index.ts`.

**Do not import directly from sub-files. Always import from the barrel.**

```typescript
// CORRECT
import { SectorPageFrame, ExpandableSection, SectionLabel } from "@/components/sectors/framework";

// WRONG
import SectorPageFrame from "@/components/sectors/framework/SectorPageFrame";
```

---

## 6. Takeaway Standard

Every `ExpandableSection` **must** have a `takeaway` prop. No exceptions.

The takeaway is visible at all times — even when the section is collapsed. A user who reads
only the takeaways across all Level 2 sections should leave with a complete institutional brief.

### Requirements

- **Standalone**: reads as a complete thought without any surrounding context
- **Length**: 2–4 sentences. Long enough to be substantive; short enough to scan
- **Content**: must include the single most important current fact about this topic
- **Tense**: present tense wherever possible. Refer to current conditions
- **No vague phrases**: avoid "this section covers...", "here we discuss..."

```typescript
// CORRECT
takeaway={
  "NII dominates (~72%) and is directly tied to the rate cycle. " +
  "Non-interest income (fees, FX, capital gains ~28%) provides diversification but " +
  "cannot fully offset NIM compression in an easing cycle. Rising opex (25–30% YoY) " +
  "is the secondary earnings drag."
}

// WRONG
takeaway="This section explains how banks generate revenue and discusses key income streams."
```

### Badge standard

Use the `badge` prop to signal section type at a glance:

| Badge | When to use |
|---|---|
| `"Start Here"` | First section — orientation entry point |
| `"Analytical"` | Quantitative or model-driven sections |
| `"Comparative"` | Cross-company or peer-vs-peer sections |
| `"Risk"` | Risk register or downside scenario sections |
| `"Operational"` | Monitoring framework or signal-tracking sections |
| `"Reference"` | Metrics glossaries or definitional sections |
| `"Full Analysis"` | Comprehensive summary section |
| *(none)* | General analytical sections without a specific type |

---

## 7. Navigation Standard

### NavItem array

The sector page defines a `SECTOR_NAV: NavItem[]` array. IDs must exactly match the `id` props
on section DOM elements.

```typescript
const BANKING_NAV: NavItem[] = [
  // L1 — always-visible sections (fixed IDs defined by SectorPageFrame)
  { id: "sector-snapshot",     label: "Live Prices",  group: "l1" },
  { id: "sector-drivers",      label: "Key Drivers",  group: "l1" },
  { id: "sector-intelligence", label: "Intelligence", group: "l1" },
  // L2 — expandable sections (IDs must match ExpandableSection id props)
  { id: "overview",   label: "P&L Model",   group: "l2" },
  { id: "economics",  label: "Economics",   group: "l2" },
  // ... more l2 items
  // L3 — research layer (fixed ID defined by SectorPageFrame)
  { id: "sector-research", label: "Research", group: "l3" },
];
```

### Label length

Nav labels must be **12 characters or fewer**. The desktop sidebar is 192px wide. Long labels
truncate or overflow and break the layout.

```typescript
// CORRECT
{ label: "P&L Model"  }   // 9 chars
{ label: "Key Drivers" }  // 11 chars

// WRONG
{ label: "Banking P&L Model and Revenue Structure" }
```

### Fixed L1 and L3 IDs

These IDs are defined by `SectorPageFrame` and are always the same across every sector:

```
sector-snapshot      → SectorSnapshot section
sector-drivers       → SectorDrivers section
sector-intelligence  → SectorIntelligenceSummary section
sector-analytics     → Level 2 divider anchor
sector-research      → SectorResearchLayer section
```

Do not use these IDs for `ExpandableSection` blocks.

### Desktop sticky sidebar

The `<aside>` in `SectorSideNav` uses `sticky top-20 self-start`. The `self-start` is mandatory —
without it the flex parent stretches the aside to the full row height, and sticky stops working
immediately. Do not remove `self-start`. Do not move `sticky` to an inner wrapper div.

### Mobile pill navigation

The mobile nav renders as a sticky horizontal pill strip at `top-0 z-40`. It clears the app header.
Pills show `no-scrollbar` overflow-x scroll — the scrollbar is hidden but swipe-scroll works.

### Active section tracking

`SectorSideNav` uses an `IntersectionObserver` with a `useRef<Set<string>>` to track all currently-
intersecting section IDs. After each update it picks the first item (by nav order) that is
currently visible. `rootMargin: "0px 0px -50% 0px"` — the top half of the viewport is the
active zone. This prevents the active state from freezing when a section exits before the next enters.

### scroll-margin-top

All sections use the `.scroll-anchor` CSS class which sets `scroll-margin-top: 120px`.
This accounts for the 80px app header + 40px breathing room for the mobile tab strip.
Do not remove `.scroll-anchor` from section elements.

---

## 8. Progressive Disclosure Standard

```
Collapsed state  →  Header + Badge + Label + Chevron ↓
                 →  Takeaway (always visible)
                 →  "Expand full analysis ↓" prompt

Expanded state   →  Header + Badge + Label + Chevron ↑
                 →  Takeaway (still visible)
                 →  Full content (children)
                 →  "↑ Collapse section" footer
```

### Rules

- The **first section** must have `defaultOpen={true}` — gives the user an immediate content entry point
- All other sections default closed — the takeaway is the preview
- The collapse footer is always rendered at the bottom of expanded content — never omit it
- On expand, `scrollIntoView({ block: "nearest" })` fires via `requestAnimationFrame` — the section
  header must stay visible after expansion (do not remove this behaviour)
- `ExpandableSection` uses `overflow-hidden` on the container — do not add extra outer wrappers
  with conflicting overflow rules

### space-y spacing between sections

Level 2 uses `space-y-3` between `ExpandableSection` blocks. This is intentionally dense —
it reads more like a report than a collection of cards. Do not increase this to `space-y-6` or higher.

---

## 9. File Structure Standard for New Sectors

When building a new sector, create exactly these four artefacts:

```
data/sectors/{sector}.ts
  └── default export: { tabs: Array<{ id: string; content: string }> }
      Each tab ID matches an ExpandableSection id in the framework page.

constants/{sector}.ts
  └── export const {SECTOR}_SYMBOLS: string[]
      Symbols passed to getCompaniesBySymbols() for the Snapshot.

components/sectors/{sector}/{Sector}FrameworkPage.tsx
  └── Async server component.
      Defines: {SECTOR}_CONFIG, {SECTOR}_NAV, analyticsSlot.
      Fetches: getCompaniesBySymbols, getReportsBySector.
      Returns: <SectorPageFrame ... />

app/sectors/[sector]/page.tsx
  └── Add a slug branch:
      if (slug === "{sector}") return <{Sector}FrameworkPage />;
```

Do not create any other files. Do not create a custom layout. Do not create a custom nav.
All visual structure is handled by the shared framework components.

---

## 10. Sector Rollout Order

| Order | Sector | Status | Notes |
|---|---|---|---|
| 1 | Banking | ✅ Done | Master reference implementation |
| 2 | Cement | Pending | Next migration target |
| 3 | Oil & Gas | Pending | |
| 4 | Fertiliser | Pending | |
| 5 | Power | Pending | |
| 6 | Automobile | Pending | |
| 7 | Textiles | Pending | |

All sectors currently use the legacy `SectorShell` renderer (HTML tabs via `sector.css`).
The migration path is: extract tab content → write takeaways → compose ExpandableSection blocks
→ write L1 config → test sticky nav and mobile → push.

Banking is the migration reference. Read `BankingFrameworkPage.tsx` before starting any new sector.

---

## 11. Non-Negotiable Rules

These rules are enforced across all sector implementations. There are no exceptions.

1. **Do not remove intelligence.** The framework adds structure — it does not reduce content depth.
   Every existing tab of sector content must be preserved and placed into the appropriate
   `ExpandableSection` block.

2. **Do not create custom sector layouts.** All sectors use `SectorPageFrame` as the layout shell.
   Do not create a `CementPage.tsx` with a custom grid or custom nav.

3. **Do not bypass shared components.** If a shared component needs a new feature, extend it
   via a new optional prop. Do not fork it into a sector-specific version.

4. **Do not put ReactNode inside `SectorFrameworkConfig`.** Config is pure data.
   ReactNode belongs in `analyticsSlot`. See Section 4.

5. **Do not hardcode navigation.** All nav items flow through `NavItem[]`. No inline links,
   no custom anchor tags that bypass the nav tracking system.

6. **Do not flatten analytics.** Level 2 analytics must remain expandable. Do not render
   Level 2 content as always-visible cards or tables outside `ExpandableSection`.

7. **Every `ExpandableSection` must have a `takeaway`.** A section without a takeaway
   collapses to nothing and breaks the scannable brief experience.

---

## 12. Known Limitations

These are known limitations of the current implementation. They are tracked for future improvement.
Do not work around them with sector-specific hacks — wait for a platform-level fix.

| Limitation | Description | Planned fix |
|---|---|---|
| Raw HTML in Level 2 | `ExpandableSection` children are raw HTML from `data/sectors/*.ts` via `dangerouslySetInnerHTML`. Theme awareness depends on `sector.css` variable declarations. | Future: migrate to structured React intelligence components with proper design tokens |
| No expand all / collapse all | No global control to open or close all Level 2 sections simultaneously. | Future: `ExpandAllControl` component in `SectorPageFrame` |
| Nav click does not auto-expand | Clicking a Level 2 nav item scrolls to the section but does not open it if collapsed. | Future: expose `setOpen` via a ref or context to allow external control |
| No section loading state | The sector page blocks until all Supabase fetches resolve. No per-section skeleton. | Future: `Suspense` boundaries around Snapshot and Research Layer |
| SectorSnapshot silent empty state | If `getCompaniesBySymbols` returns no rows, the snapshot section disappears silently. | Future: explicit "prices unavailable" fallback state |
| Expand animation | Expand/collapse is an instant DOM mount/unmount, not animated. | Future: CSS `max-height` transition or Framer Motion |

---

## 13. Rollout Checklist

Use this checklist before marking any sector migration as complete.

### Content
- [ ] All existing tab content preserved — nothing removed
- [ ] Each `ExpandableSection` has a `takeaway` (2–4 sentences, standalone, current)
- [ ] First section has `defaultOpen={true}`
- [ ] `intelligenceSummary` is editorial, present-tense, ~150 words

### Level 1 Config
- [ ] `SectorFrameworkConfig` defined with correct slug, name, accentColor
- [ ] 3–5 `stats[]` — current figures with context labels
- [ ] 4–6 `drivers[]` — each with description, current reading, and trend signal
- [ ] `subtitle` is 2–3 sentences describing the sector's role and earnings mechanism

### Navigation
- [ ] `NavItem[]` defined — all IDs match section/ExpandableSection id props
- [ ] All labels are 12 characters or fewer
- [ ] L1 IDs use the fixed `sector-*` names
- [ ] L2 IDs match `ExpandableSection` id props exactly
- [ ] L3 ID is `sector-research`

### Behaviour
- [ ] Desktop sticky sidebar follows scroll throughout the full page
- [ ] Mobile pill nav is visible and scrollable
- [ ] Active section highlighting updates correctly during scroll
- [ ] Anchor clicks scroll to correct position with `scroll-margin-top` offset
- [ ] Expand/collapse works — section header stays visible after expand

### Theme
- [ ] Page renders correctly in dark mode (default)
- [ ] Page renders correctly in light mode
- [ ] `sector.css` variables resolve correctly inside `HtmlTab` / `.sector-root` wrapper

### Data
- [ ] `getCompaniesBySymbols` returns rows for this sector's symbols
- [ ] `getReportsBySector` query string matches sector name exactly as stored in DB
- [ ] Empty states render cleanly when no data is available (snapshot, research)

### Quality gate
- [ ] No `console.error` in browser on page load
- [ ] No layout shift on scroll
- [ ] No sticky nav positioning issues on mobile
- [ ] TypeScript build passes with no errors for the new sector files

---

## 14. Reference Implementation

The canonical implementation of this framework is:

```
components/sectors/banking/BankingFrameworkPage.tsx
```

Read this file before building any new sector. It is the living reference for:
- How `SectorFrameworkConfig` is structured
- How `NavItem[]` is defined
- How `ExpandableSection` blocks are composed
- How `HtmlTab` wraps legacy HTML content
- How server-side data fetching integrates with the framework
- How `analyticsSlot` is constructed and passed to `SectorPageFrame`

All framework components live in:

```
components/sectors/framework/
  index.ts                       ← import everything from here
  types.ts                       ← SectorFrameworkConfig, SectorDriver, etc.
  SectorPageFrame.tsx            ← layout shell
  SectorHero.tsx                 ← hero block
  SectorSnapshot.tsx             ← live prices (L1)
  SectorDrivers.tsx              ← key drivers (L1)
  SectorIntelligenceSummary.tsx  ← intelligence editorial (L1)
  ExpandableSection.tsx          ← accordion analytics (L2)
  SectorSideNav.tsx              ← sticky desktop + mobile nav
  SectorResearchLayer.tsx        ← research links + placeholder (L3)
  SectionLabel.tsx               ← shared section header primitive
```

---

*AHM Platform · Sector Framework Template v1.0 · Last updated May 2025*
*Do not modify this document without reviewing the Banking reference implementation first.*
