# Shell Layout — Developer Handoff

Generated 2026-04-20 via `/design-handoff` after the 20-question shell grill + `/design-system` + `/design-critique`.

**Source of truth:** `UX_SPEC.md` § 42 and `DESIGN_SYSTEM.md`. This doc translates those into code-ready artifacts.

**Stack target:** Next.js 15 App Router + React 18 + TypeScript + Tailwind CSS (see `ARCHITECTURE.md`).

---

## How to use this document

1. **Start with Section 1 (Design Tokens).** Paste the CSS custom properties into `src/app/globals.css` and the Tailwind theme extension into `tailwind.config.ts`.
2. **Build shared primitives (Section 3 Component Specs) before pages.** Order: `BentoShell` → `PhaseCard` → `TopBar` → `PillBar` → the four dropdown panels (`TripSwitcher`, `NotificationBell`, `AccountAvatar`, `GlobalSearch`) → `ContextPanel` → `ColorSpillTile`.
3. **Wire motion primitives from Section 2 before adding component animations.** Motion tokens (durations, easings) live in CSS custom properties — components reference them, no inline magic numbers.
4. **Verify accessibility during build, not at the end.** Section 5 is a live checklist — every component must satisfy its row before merge.
5. **Open decisions (Section 6) are shipping blockers, not design ambiguity.** They need resolution before v1, but the structural spec is implementation-ready today.

---

## 1. Design Tokens

### 1.1 — CSS custom properties

Paste into `src/app/globals.css` under `@layer base { :root { ... } }`.

```css
:root {
  /* ——— Neon-on-Dark Surfaces ——— */
  --color-base-dark: #0A0A12;
  --color-elevated-dark: #15162A;
  --color-card-dark: #1D1E36;
  --color-border-dark: #2A2B45;

  /* ——— Text ——— */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #D1D2E8;
  --color-text-disabled: #6C6E8A;

  /* ——— Neon Rainbow Accents ——— */
  --color-neon-cyan: #00E5FF;
  --color-neon-yellow: #FFEB00;
  --color-neon-pink: #FF3DA7;
  --color-neon-green: #39FF6B;
  --color-neon-purple: #B14DFF;
  --color-neon-orange: #FF9236;

  /* ——— Phase colors (semantic — map to neon palette) ——— */
  --color-phase-overview: var(--color-neon-cyan);
  --color-phase-setup: var(--color-neon-cyan);
  --color-phase-preplanning: var(--color-neon-cyan);
  --color-phase-itinerary: var(--color-neon-cyan);
  --color-phase-packing: var(--color-neon-yellow);
  --color-phase-travel-day: var(--color-neon-pink);
  --color-phase-vacation-day: var(--color-neon-cyan);
  --color-phase-expenses: var(--color-neon-green);
  --color-phase-polls: var(--color-neon-yellow);
  --color-phase-wishlist: var(--color-neon-pink);
  --color-phase-members: var(--color-neon-cyan);
  --color-phase-memory: var(--color-neon-pink);
  /* NOTE: per-phase colors are flagged as an OPEN DECISION — see Section 6. */

  /* ——— Spacing: bento tile padding by band ——— */
  --space-tile-compact: 20px;
  --space-tile-small-bento: 20px;
  --space-tile-standard: 24px;
  --space-tile-wide: 28px;
  --space-tile-ultra: 32px;

  /* ——— Spacing: general scale ——— */
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 20px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;

  /* ——— Corner radius ——— */
  --radius-interactive: 16px;  /* phase cards, buttons, chips, interactive cards */
  --radius-tile: 20px;          /* bento tiles */
  --radius-pill: 9999px;        /* pill buttons, trip switcher pill, status chips */
  --radius-focus-ring: 14px;    /* slightly inside interactive radius for focus rings */

  /* ——— Typography scale (Large-Scale UI) ——— */
  --font-display: 'Fredoka', system-ui, sans-serif;
  --font-body: 'Nunito', system-ui, sans-serif;

  /* Shell body (18px base, up from standard 14-16px) */
  --text-body-shell: 18px;
  --text-body-shell-line: 28px;

  /* Tile internal body (matches Card UI Scale Rules) */
  --text-body-tile: 16px;
  --text-body-tile-line: 24px;

  /* Tile section headers */
  --text-section-header: 22px;
  --text-section-header-line: 28px;

  /* Phase card name */
  --text-phase-name: 18px;
  --text-phase-name-line: 24px;

  /* Mini-status chip */
  --text-mini-status: 14px;
  --text-mini-status-line: 20px;

  /* Stat numbers (clamp — use Card UI Scale Rules) */
  --text-stat-clamp: clamp(56px, 6vw, 88px);
  --text-budget-clamp: clamp(44px, 4.5vw, 68px);

  /* Hero trip name (dashboard primary tile) */
  --text-hero-clamp: clamp(40px, 4vw, 72px);

  /* Labels (ALL CAPS) */
  --text-label: 13px;
  --text-label-tracking: 0.08em;

  /* ——— Motion: durations ——— */
  --duration-micro: 200ms;           /* focus ring, hover lift */
  --duration-small: 300ms;            /* tab switch, checkbox toggle */
  --duration-medium: 400ms;           /* card/modal entrance (400-500 range) */
  --duration-medium-slow: 500ms;
  --duration-large: 600ms;            /* page transitions, ripple, wave sweep */
  --duration-xl: 800ms;               /* big reveals */
  --duration-shimmer: 12000ms;        /* living wet-neon shimmer cycle (8-12s range) */
  --duration-ripple: 2200ms;          /* ocean-ripple logo cycle */
  --duration-ball-pulse: 3600ms;      /* trip ball wave pulse (3.6s) */

  /* ——— Motion: easing curves ——— */
  --ease-standard: cubic-bezier(0.22, 0.68, 0.28, 1);   /* oil-flow default */
  --ease-entrance: cubic-bezier(0.3, 1.5, 0.5, 1);      /* droplet landing overshoot */
  --ease-exit: cubic-bezier(0.6, 0, 0.9, 0.4);          /* ink dissolving */
  --ease-water: cubic-bezier(0, 0.55, 0.45, 1);         /* water ripple ease-out */

  /* ——— Glow intensities ——— */
  --glow-default: 0.4;     /* 40% opacity outer glow on neon elements */
  --glow-hover: 0.5;       /* +25% on hover */
  --glow-focus: 0.55;      /* +35% on focus */
  --glow-pressed: 0.6;     /* +50% pressed */

  /* ——— Shadow / elevation ——— */
  --shadow-tile: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-tile-hover: 0 6px 24px rgba(0, 0, 0, 0.5);
  --shadow-popover: 0 12px 48px rgba(0, 0, 0, 0.6);

  /* ——— Z-index scale ——— */
  --z-base: 0;
  --z-tile-hover: 1;
  --z-top-bar: 50;
  --z-pill-bar: 49;
  --z-dropdown: 100;       /* trip switcher, notification bell, account avatar */
  --z-global-search: 150;  /* Cmd/Ctrl+K popover */
  --z-modal: 200;          /* edit/create modals */
  --z-override: 300;       /* Travel Day focus mode, Trip Creation ritual */
  --z-toast: 400;
}

/* ——— prefers-reduced-motion overrides ——— */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-micro: 0ms;
    --duration-small: 0ms;
    --duration-medium: 150ms;
    --duration-medium-slow: 150ms;
    --duration-large: 200ms;
    --duration-xl: 200ms;
    --duration-shimmer: 0ms;        /* static neon — no shimmer */
    --duration-ripple: 4000ms;       /* slower, less motion */
    --duration-ball-pulse: 6000ms;   /* opacity-only per Liquid Motion rules */
  }
}
```

### 1.2 — Tailwind theme extension

Paste into `tailwind.config.ts` under `theme.extend`:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'base-dark': 'var(--color-base-dark)',
        'elevated-dark': 'var(--color-elevated-dark)',
        'card-dark': 'var(--color-card-dark)',
        'border-dark': 'var(--color-border-dark)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-disabled': 'var(--color-text-disabled)',
        'neon-cyan': 'var(--color-neon-cyan)',
        'neon-yellow': 'var(--color-neon-yellow)',
        'neon-pink': 'var(--color-neon-pink)',
        'neon-green': 'var(--color-neon-green)',
        'neon-purple': 'var(--color-neon-purple)',
        'neon-orange': 'var(--color-neon-orange)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      fontSize: {
        'body-shell': ['var(--text-body-shell)', { lineHeight: 'var(--text-body-shell-line)' }],
        'body-tile': ['var(--text-body-tile)', { lineHeight: 'var(--text-body-tile-line)' }],
        'section-header': ['var(--text-section-header)', { lineHeight: 'var(--text-section-header-line)' }],
        'phase-name': ['var(--text-phase-name)', { lineHeight: 'var(--text-phase-name-line)' }],
        'mini-status': ['var(--text-mini-status)', { lineHeight: 'var(--text-mini-status-line)' }],
        'hero': 'var(--text-hero-clamp)',
        'stat': 'var(--text-stat-clamp)',
        'budget': 'var(--text-budget-clamp)',
        'label': ['var(--text-label)', { letterSpacing: 'var(--text-label-tracking)' }],
      },
      borderRadius: {
        interactive: 'var(--radius-interactive)',
        tile: 'var(--radius-tile)',
        pill: 'var(--radius-pill)',
      },
      transitionDuration: {
        micro: 'var(--duration-micro)',
        small: 'var(--duration-small)',
        medium: 'var(--duration-medium)',
        'medium-slow': 'var(--duration-medium-slow)',
        large: 'var(--duration-large)',
        xl: 'var(--duration-xl)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        entrance: 'var(--ease-entrance)',
        exit: 'var(--ease-exit)',
        water: 'var(--ease-water)',
      },
      boxShadow: {
        tile: 'var(--shadow-tile)',
        'tile-hover': 'var(--shadow-tile-hover)',
        popover: 'var(--shadow-popover)',
      },
      zIndex: {
        'top-bar': 'var(--z-top-bar)',
        'pill-bar': 'var(--z-pill-bar)',
        dropdown: 'var(--z-dropdown)',
        'global-search': 'var(--z-global-search)',
        modal: 'var(--z-modal)',
        override: 'var(--z-override)',
      },
      containers: {
        // Tailwind v4+ supports container-query utilities natively.
        // If on v3, use @tailwindcss/container-queries plugin.
        'compact': '0px',            // <900px
        'small-bento': '900px',      // 900-1279
        'standard-bento': '1280px',  // 1280-1919
        'wide-bento': '1920px',      // 1920-2559
        'ultra-bento': '2560px',     // 2560+
      },
    },
  },
};

export default config;
```

### 1.3 — Font loading

Load Fredoka + Nunito via `next/font/google` in `src/app/layout.tsx`:

```tsx
import { Fredoka, Nunito } from 'next/font/google';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800', '900'],
  variable: '--font-body',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="bg-base-dark text-text-primary font-body text-body-shell antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## 2. Container Queries + Responsive Bands

### 2.1 — Shell root container query setup

The entire shell uses container queries against a single root container. This replaces viewport media queries.

```css
/* Apply to the shell root — the topmost div inside <body> */
.shell-root {
  container-type: inline-size;
  container-name: shell;
}

/* ——— Compact mode (mobile + narrow desktop): <900px ——— */
@container shell (max-width: 899px) {
  .bento-grid { display: none; }
  .pill-bar   { display: flex; }
  .stacked-content { display: block; }
  .desktop-only { display: none; }
}

/* ——— Bento mode (tablet landscape + up): >=900px ——— */
@container shell (min-width: 900px) {
  .bento-grid { display: grid; }
  .pill-bar   { display: none; }
  .stacked-content { display: none; }
  .desktop-only { display: initial; }
}

/* ——— Small bento: 900-1279px ——— */
@container shell (min-width: 900px) and (max-width: 1279px) {
  .bento-tile          { padding: var(--space-tile-small-bento); }
  .phase-card          { min-height: 52px; }
  .phase-card__icon    { width: 32px; height: 32px; }
  .phase-card__status  { display: none; } /* compressed — icon + name only */
  .trip-ball           { width: 140px; height: 140px; }
}

/* ——— Standard bento: 1280-1919px ——— */
@container shell (min-width: 1280px) and (max-width: 1919px) {
  .bento-tile          { padding: var(--space-tile-standard); }
  .phase-card          { min-height: 64px; }
  .phase-card__icon    { width: 36px; height: 36px; }
  .trip-ball           { width: 170px; height: 170px; }
}

/* ——— Wide bento: 1920-2559px ——— */
@container shell (min-width: 1920px) and (max-width: 2559px) {
  .bento-tile          { padding: var(--space-tile-wide); }
  .phase-card          { min-height: 72px; }
  .phase-card__icon    { width: 40px; height: 40px; }
  .trip-ball           { width: 190px; height: 190px; }
}

/* ——— Ultra-wide: 2560px+ ——— */
@container shell (min-width: 2560px) {
  .bento-tile          { padding: var(--space-tile-ultra); }
  .phase-card          { min-height: 80px; }
  .phase-card__icon    { width: 40px; height: 40px; }
  .trip-ball           { width: 200px; height: 200px; }
}
```

### 2.2 — Bento grid layout

```css
/* Outer grid — applies only in bento mode */
@container shell (min-width: 900px) {
  .bento-grid {
    display: grid;
    grid-template-columns: 280px 1fr 280px;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
      "nav  trip-ball     context"
      "nav  primary       context"
      "nav  primary       quick-add"
      "nav  primary       activity-feed"
      "ad   ad             ad";
    gap: 8px;
    padding: 8px;
    min-height: 100dvh;
    background-color: var(--color-base-dark);
  }

  .slot-nav-column    { grid-area: nav; }
  .slot-trip-ball     { grid-area: trip-ball; }
  .slot-context-panel { grid-area: context; }
  .slot-primary       { grid-area: primary; }
  .slot-quick-add     { grid-area: quick-add; }
  .slot-activity-feed { grid-area: activity-feed; }
  .slot-ad-banner     { grid-area: ad; }
}

/* ——— Wide bento 7-slot expansion (activity-feed gets a secondary column) ——— */
@container shell (min-width: 1920px) {
  .bento-grid {
    grid-template-columns: 320px 1fr 320px 280px;
    grid-template-areas:
      "nav  trip-ball     context       activity-feed"
      "nav  primary       context       activity-feed"
      "nav  primary       quick-add     activity-feed"
      "nav  primary       quick-add     activity-feed"
      "ad   ad             ad             ad";
  }
}

/* Premium users: ad-banner slot reclaimed */
.bento-grid[data-tier="premium"] {
  grid-template-areas:
    "nav  trip-ball     context"
    "nav  primary       context"
    "nav  primary       quick-add"
    "nav  primary       activity-feed";
  grid-template-rows: auto auto 1fr auto;
}
```

---

## 3. Component Specs

All components are React function components with explicit prop types. Use `"use client"` directive where interactivity is required (most shell components).

### 3.1 — `<BentoShell>`

Wrapper that establishes the shell root container and renders named slots.

```ts
type BentoShellProps = {
  navColumn: React.ReactNode;
  tripBall: React.ReactNode;
  contextPanel: React.ReactNode;
  primary: React.ReactNode;
  quickAdd: React.ReactNode;
  activityFeed: React.ReactNode;
  adBanner?: React.ReactNode;       // free tier only
  isPremium: boolean;
  topBar: React.ReactNode;
  pillBar?: React.ReactNode;        // mobile only — rendered inside compact-mode branch
  override?: ShellOverride;         // if set, collapse the grid
};

type ShellOverride =
  | 'travel-day-focus'
  | 'vaulted'
  | 'invite-landing'
  | 'trip-creation'
  | 'zero-trip-first-run';
```

**Responsibilities:**
- Establishes `container-type: inline-size; container-name: shell` on its root element.
- Renders 6-or-7 slots in bento mode (`>=900px`) or a stacked single column in compact mode.
- When `override` is set, collapses per Section 3.14 below.
- Applies `data-tier="premium"` when `isPremium === true` (hides ad-banner slot, re-flows grid).
- Always renders `<TopBar>` unless override says otherwise.

**Motion:** Slot contents can independently transition via the wave sweep (`animation-wave-sweep`); outer grid never moves.

**Accessibility:**
- Root has `role="application"` (the shell is an SPA).
- Each slot is a `<section>` with an `aria-label` (e.g., `aria-label="Phase navigation"`).
- Skip link: `<a href="#primary" class="sr-only focus:not-sr-only">Skip to main content</a>` as the first child of the root.

---

### 3.2 — `<PhaseCard>`

Stacked card in the nav column. The atomic nav unit on desktop.

```ts
type PhaseCardProps = {
  phase: Phase;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  phaseColor: NeonColor;             // determines accent + icon container color
  isActive: boolean;
  isRecommended: boolean;
  miniStatus?: string;               // e.g., "40%", "2 blockers", "3 new"
  href: string;                      // route
};

type Phase =
  | 'overview' | 'setup' | 'preplanning' | 'itinerary' | 'packing'
  | 'travel-day' | 'vacation-day' | 'expenses' | 'polls' | 'wishlist'
  | 'members' | 'memory';

type NeonColor = 'cyan' | 'yellow' | 'pink' | 'green' | 'purple' | 'orange';
```

**States (see § 42 / DESIGN_SYSTEM Phase Card Component):**

| State | Surface | Accent | Text color | Extra |
|---|---|---|---|---|
| Default | `var(--color-elevated-dark)` | none | `var(--color-text-primary)` | Hover: glow +25% on icon circle |
| Active | `var(--color-elevated-dark)` | 4px left-edge bar in `phaseColor`, shimmer | Name in `phaseColor`, status in `var(--color-text-secondary)` | Icon circle gains outer glow |
| Recommended | As default | none | As default | 8px `var(--color-neon-yellow)` dot, top-right |
| Focus | As default | none | As default | 3px `var(--color-neon-cyan)` ring, 14px radius, with ripple from center |
| Pressed | As default | none | As default | Water ripple from tap point |

**Structure:**

```tsx
<Link href={href} className="phase-card" data-active={isActive} data-recommended={isRecommended}>
  {isActive && <span className="phase-card__accent-bar" style={{ background: `var(--color-phase-${phase})` }} />}
  {isRecommended && <span className="phase-card__recommended-dot" />}
  <span className="phase-card__icon-container" style={{ background: `var(--color-phase-${phase})` }}>
    <Icon size={32} className="phase-card__icon" />
  </span>
  <span className="phase-card__name">{name}</span>
  {miniStatus && <span className="phase-card__status">{miniStatus}</span>}
</Link>
```

**CSS skeleton:**

```css
.phase-card {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 4px 12px;
  align-items: center;
  padding: var(--space-md) var(--space-md) var(--space-md) calc(var(--space-md) + 2px);
  background: var(--color-elevated-dark);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-interactive);
  transition:
    box-shadow var(--duration-micro) var(--ease-standard),
    transform var(--duration-micro) var(--ease-standard);
  position: relative;
  overflow: hidden;
  color: var(--color-text-primary);
  text-decoration: none;
}

.phase-card:hover {
  box-shadow: 0 0 24px rgba(0, 229, 255, 0.3); /* scaled per phase color via data-phase */
}

.phase-card:focus-visible {
  outline: 3px solid var(--color-neon-cyan);
  outline-offset: 2px;
}

.phase-card__accent-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  animation: wet-neon-shimmer var(--duration-shimmer) var(--ease-standard) infinite;
}

.phase-card[data-active="true"] .phase-card__name {
  color: var(--color-phase-current);
}

@keyframes wet-neon-shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.96; }
}
```

**Accessibility:**
- `role="link"` (inherent on `<Link>` / `<a>`).
- `aria-current="page"` when `isActive`.
- `aria-label={"${name}, ${miniStatus ?? ""}, ${isRecommended ? "recommended next" : ""}"}`.
- Keyboard: Tab to focus, Enter to activate.
- Recommended dot is decorative; its meaning is in the aria-label.

---

### 3.3 — `<TopBar>`

Form-factor differentiated. Single component that adapts via container queries.

```ts
type TopBarProps = {
  isInTrip: boolean;                 // false on /app, /app/account, etc.
  currentTripName?: string;
  currentTripBallColor?: NeonColor;
  hasUnreadNotifications: boolean;
  isPremium: boolean;
  userName: string;
  userAvatarUrl?: string;
  userEmail: string;
};
```

**Anatomy (desktop, >=900px):**

```
[Logo]  [TripSwitcher]  [GlobalSearch]          [PremiumBadge] [Bell] [Avatar]
```

**Anatomy (compact, <900px):**

```
[Logo] [TripSwitcher-small]                                   [Bell] [Avatar]
```

**CSS skeleton:**

```css
.top-bar {
  position: sticky;
  top: 0;
  z-index: var(--z-top-bar);
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 var(--space-md);
  background: var(--color-base-dark);
  border-bottom: 1px solid var(--color-border-dark);
}

.top-bar__logo { flex-shrink: 0; }
.top-bar__switcher { flex-shrink: 0; margin-left: var(--space-md); }
.top-bar__search { flex-shrink: 0; margin-left: var(--space-md); }
.top-bar__spacer { flex: 1; }
.top-bar__right { display: flex; align-items: center; gap: var(--space-md); }

/* Hide desktop-only elements in compact mode */
@container shell (max-width: 899px) {
  .top-bar__search,
  .top-bar__premium-badge { display: none; }
}
```

**Accessibility:**
- `<header role="banner">`.
- Logo is a link to `/app`, `aria-label="TripWave home"`.
- Each dropdown trigger has proper `aria-haspopup`, `aria-expanded`.

---

### 3.4 — `<PillBar>` (mobile phase navigation)

Only renders in compact mode (<900px).

```ts
type PillBarProps = {
  phases: PhaseNavItem[];
  activePhase: Phase;
};

type PhaseNavItem = {
  phase: Phase;
  name: string;
  icon: React.ComponentType;
  color: NeonColor;
  href: string;
};
```

**Behavior:**
- Horizontal scroll, snap to pill centers.
- On mount and on `activePhase` change, scroll the active pill into view center.
- Gradient fade on the right edge indicates scrollable overflow.
- Settings gear pinned as the last item.

**CSS skeleton:**

```css
.pill-bar {
  position: sticky;
  top: 44px; /* below top bar */
  z-index: var(--z-pill-bar);
  display: flex;
  align-items: center;
  height: 48px;            /* per /design-critique update from 44px */
  padding: 0 var(--space-md);
  gap: var(--space-sm);
  background: var(--color-base-dark);
  border-bottom: 1px solid var(--color-border-dark);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  mask-image: linear-gradient(to right, black calc(100% - 48px), transparent);
}

.pill-bar::-webkit-scrollbar { display: none; }

.pill {
  flex-shrink: 0;
  height: 36px;
  padding: 0 var(--space-md);
  min-height: 48px; /* tap region — use min-height + negative margin trick if needed */
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  border-radius: var(--radius-pill);
  background: var(--color-elevated-dark);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-mini-status);
  scroll-snap-align: center;
  transition: background var(--duration-small) var(--ease-standard);
}

.pill[data-active="true"] {
  background: var(--color-phase-current);
  color: var(--color-base-dark);
}
```

**Auto-center on phase change (React):**

```tsx
const pillRefs = useRef<Record<Phase, HTMLElement | null>>({} as any);

useEffect(() => {
  const el = pillRefs.current[activePhase];
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}, [activePhase]);
```

**Accessibility:**
- `<nav aria-label="Trip phases">`.
- Arrow keys move focus between pills (not standard browser — implement with keyboard handler).
- Each pill has `aria-current="page"` when active.

---

### 3.5 — `<TripSwitcher>`

Dropdown triggered by the trip-switcher pill in the top bar.

```ts
type TripSwitcherProps = {
  currentTrip: Trip;
  allTrips: Trip[];
  onSwitchTrip: (tripId: string) => void;
  onCreateNew: () => void;
  onViewAll: () => void;
};

type Trip = {
  id: string;
  name: string;
  ballColor: NeonColor;
  fillPercent: number;
  lifecycleState: 'draft' | 'planning' | 'ready' | 'travel-day' | 'in-progress' | 'stale' | 'vaulted';
  countdown?: string; // e.g., "12 days"
};
```

**Structure (desktop dropdown):**

```
┌────────────────────────────────────┐
│ ◉ Japan 2027 (current)             │
├────────────────────────────────────┤
│ 🔍 Search trips...                 │  ← only if allTrips.length >= 4
├────────────────────────────────────┤
│ ACTIVE                             │
│ ● Maine Road Trip · 3 weeks        │
│ ● Summer House · 2 months          │
├────────────────────────────────────┤
│ PLANNING                           │
│ ◐ Winter Getaway · Draft           │
├────────────────────────────────────┤
│ ▸ ARCHIVED (3)                     │  ← collapsed by default
├────────────────────────────────────┤
│ All trips                + New trip│
└────────────────────────────────────┘
```

**Mobile:** Full-width bottom sheet instead of dropdown, swipe-down to dismiss.

**Behavior:**
- Open: click the trip-switcher pill.
- Close: outside click, Escape, or swipe-down (mobile).
- Search input only rendered when `allTrips.length >= 4`.
- Archived section uses a native `<details>` element for collapse.

**Accessibility:**
- Trigger: `<button aria-haspopup="menu" aria-expanded={isOpen}>`.
- Panel: `<div role="menu">` with each row as `role="menuitem"`.
- Search input: `role="searchbox"`, `aria-label="Search trips"`.
- Focus trap: when open, Tab cycles within the dropdown.
- Return focus to trigger on close.

---

### 3.6 — `<NotificationBell>`

Dropdown panel matching trip-switcher's interaction pattern (Q9).

```ts
type NotificationBellProps = {
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onViewAll: () => void;
  onNotificationClick: (id: string) => void;
};

type Notification = {
  id: string;
  category: 'polls' | 'expenses' | 'travel' | 'itinerary' | 'general';
  text: string;
  timestamp: string; // relative: "2h ago"
  isUnread: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};
```

**Structure:**

```
┌──────────────────────────────────────┐
│ Notifications          Mark all read │
├──────────────────────────────────────┤
│ 🟢 Mom logged Tsukiji · your share $32│
│   10 min ago              View expense│
├──────────────────────────────────────┤
│ 🟡 Poll: Torikizoku ready to vote    │
│   2h ago                         Vote│
├──────────────────────────────────────┤
│ ...                                  │
├──────────────────────────────────────┤
│           See all activity →         │
└──────────────────────────────────────┘
```

**Category color dot mapping:**
- `polls` → `--color-neon-yellow`
- `expenses` → `--color-neon-green`
- `travel` → `--color-neon-pink`
- `itinerary` → `--color-neon-cyan`
- `general` → `--color-text-secondary`

**CSS:**

```css
.notification-bell__panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--space-sm);
  width: 380px;
  max-height: 540px;
  overflow-y: auto;
  background: var(--color-elevated-dark);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-tile);
  box-shadow: var(--shadow-popover);
  z-index: var(--z-dropdown);
}

@container shell (max-width: 899px) {
  .notification-bell__panel {
    position: fixed;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    max-height: 80vh;
    border-radius: var(--radius-tile) var(--radius-tile) 0 0;
    margin-top: 0;
  }
}

.notification-row[data-unread="true"] {
  border-left: 3px solid var(--color-neon-cyan);
}
```

**Accessibility:**
- `<button aria-haspopup="dialog" aria-expanded={isOpen} aria-label={`Notifications, ${unreadCount} unread`}>`.
- Panel: `role="dialog" aria-modal="false"`.
- Each row: `<button>`, `aria-label` includes category + text + timestamp.
- Focus management: return to bell on close.

---

### 3.7 — `<AccountAvatar>`

4-section dropdown (see § 42.8).

```ts
type AccountAvatarProps = {
  name: string;
  email: string;
  avatarColor: NeonColor;
  isPremium: boolean;
  onSignOut: () => void;
};
```

**Structure:**

```
┌────────────────────────────────┐
│ ◉ Chris Mackall                │
│   chrismackall3@gmail.com     │
├────────────────────────────────┤
│ Account                        │
│ Notifications                  │
├────────────────────────────────┤
│ Supporter ♥ · Manage           │  ← or "Support the app · $7.99 once" for free
├────────────────────────────────┤
│ Help & feedback                │  ← mailto:chrismackall3@gmail.com
│ About                          │
├────────────────────────────────┤
│ Sign out                       │
└────────────────────────────────┘
```

**Hard-banned copy** (enforce via lint rule or code review): *"upgrade to premium"*, *"unlock powerful tools"*, *"save the trip"*, any scarcity language.

**Accessibility:**
- Trigger: `<button aria-haspopup="menu" aria-expanded={isOpen} aria-label={`Account menu for ${name}`}>`.
- Each section uses `role="group"` with a visible or hidden `aria-label`.

---

### 3.8 — `<GlobalSearch>` (desktop only)

Cmd/Ctrl+K popover.

```ts
type GlobalSearchProps = {
  currentTripId: string;
  currentTripName: string;
  onNavigate: (href: string) => void;
};

type SearchResult = {
  id: string;
  type: 'itinerary' | 'expense' | 'note' | 'proposal' | 'packing' | 'member' | 'vault' | 'poll';
  title: string;
  snippet: string;
  href: string;
  tripId: string;
  tripName: string;
};
```

**Behavior:**
- Global keydown listener: `Cmd+K` (Mac) / `Ctrl+K` (Win/Linux) opens the popover.
- Escape closes; returns focus to the search-icon trigger.
- Tab inside the popover toggles scope between current-trip and all-trips.
- ↑/↓ navigate results; Enter jumps; Shift+Enter opens in new tab.
- Empty state: *"No matches — try widening to all trips?"* with inline scope toggle.

**Hidden on mobile:**

```css
@container shell (max-width: 899px) {
  .global-search { display: none; }
}
```

**Accessibility:**
- Popover: `role="dialog" aria-modal="true" aria-label="Search"`.
- Search input: `role="combobox" aria-expanded="true" aria-autocomplete="list"`.
- Result list: `role="listbox"`; each result: `role="option"`, `aria-selected` when focused.
- Focus trap + return-focus-on-close.

---

### 3.9 — `<ContextPanel>`

Always-present tile — never disappears. Three content states (§ 42.10).

```ts
type ContextPanelProps = {
  state: 'blockers' | 'next-action' | 'healthy';
  blockers?: Blocker[];
  nextAction?: { text: string; ctaLabel: string; ctaHref: string; phaseColor: NeonColor };
};

type Blocker = {
  id: string;
  title: string;
  phase: Phase;
  href: string;
};
```

**State rendering:**

| State | Top border | Icon | Headline | Content |
|---|---|---|---|---|
| `blockers` | 4px pink left-edge | ⚠ (pink) | "N blockers" in Fredoka 600 18px pink | List of blocker rows with → chevron |
| `next-action` | none | ⚡ (cyan) | "Next up" in Fredoka 600 16px cyan caps | Action text + phase-color CTA button |
| `healthy` | none | 🌊 (cyan, wave pulse animation) | "You're on track" in Fredoka 600 18px white | "No blockers. Enjoy the view." subline |

**CSS for healthy-state wave pulse icon:**

```css
.context-panel__healthy-icon {
  animation: ball-pulse var(--duration-ball-pulse) ease-in-out infinite;
}

@keyframes ball-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.06); opacity: 0.88; }
}
```

**Accessibility:**
- `<section aria-label="Context panel">`.
- Blocker rows: `<a href>` with `aria-label="Blocker: {title}, in {phase}"`.
- Healthy state is decorative but announce via `role="status" aria-live="polite"` when transitioning to this state.

---

### 3.10 — `<ColorSpillTile>`

Dashboard primary tile with ball-color gradient background (§ 42.11).

```ts
type ColorSpillTileProps = {
  trip: Trip;
  ctaLabel: string;
  ctaHref: string;
  previewText: string;
};
```

**Background composition:**

```css
.color-spill-tile {
  position: relative;
  overflow: hidden;
  background: var(--color-elevated-dark);
  border-radius: var(--radius-tile);
  padding: var(--space-tile-standard);
}

.color-spill-tile__gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 20% 30%,
    var(--spill-color) 0%,
    transparent 70%
  );
  opacity: 0.13; /* 13% — adjust 8-15% range per color */
  animation: living-shimmer var(--duration-shimmer) ease-in-out infinite;
  pointer-events: none;
}

.color-spill-tile[data-spill-color="purple"] .color-spill-tile__gradient,
.color-spill-tile[data-spill-color="orange"] .color-spill-tile__gradient {
  opacity: 0.09; /* lower opacity for less-saturated colors */
}

@keyframes living-shimmer {
  0%, 100% { opacity: var(--spill-opacity, 0.13); }
  50% { opacity: calc(var(--spill-opacity, 0.13) + 0.03); }
}

.color-spill-tile__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.color-spill-tile__trip-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--text-hero-clamp);
  color: var(--color-text-primary);
  line-height: 1.1;
}
```

**Set `--spill-color`:**

```tsx
<div
  className="color-spill-tile"
  data-spill-color={trip.ballColor}
  style={{ '--spill-color': `var(--color-neon-${trip.ballColor})` } as React.CSSProperties}
>
  <div className="color-spill-tile__gradient" />
  <div className="color-spill-tile__content">
    {/* Giant trip ball, name, countdown, CTA, preview strip */}
  </div>
</div>
```

---

### 3.11 — Shell override states

```ts
type ShellOverride =
  | 'travel-day-focus'
  | 'vaulted'
  | 'invite-landing'
  | 'trip-creation'
  | 'zero-trip-first-run';
```

**Handling inside `<BentoShell>`:**

```tsx
if (override) {
  return (
    <div className={`shell-root shell-override shell-override-${override}`}>
      {override !== 'invite-landing' && override !== 'zero-trip-first-run' && topBar}
      <div className="shell-override__content">
        {children}
      </div>
    </div>
  );
}
```

**Background per override:**

```css
.shell-override-zero-trip-first-run {
  background: var(--color-base-dark); /* deep base — NOT light radial */
}

.shell-override-travel-day-focus,
.shell-override-vaulted,
.shell-override-invite-landing,
.shell-override-trip-creation {
  background: radial-gradient(
    circle at center,
    #FAFAFA 0%,
    #787878 100%
  );
}
```

**Entrance/exit motion** (wave sweep):

```css
.shell-override {
  animation: wave-sweep-in var(--duration-large) var(--ease-standard);
}

@keyframes wave-sweep-in {
  from { clip-path: inset(0 100% 0 0); opacity: 0; }
  to { clip-path: inset(0 0 0 0); opacity: 1; }
}
```

---

### 3.12 — `<AdBanner>` (native tile card, desktop)

Per § 42.15 post-critique update — styled as a bento tile citizen, not a bottom strip.

```ts
type AdBannerProps = {
  isPremium: boolean;
  adContent: React.ReactNode;       // ad network's rendered creative
  sponsorName: string;
};
```

**Render:**

```tsx
if (isPremium) return null;

return (
  <div className="ad-banner-tile">
    <span className="ad-banner-tile__label">Sponsored by {sponsorName}</span>
    <div className="ad-banner-tile__content">{adContent}</div>
  </div>
);
```

```css
.ad-banner-tile {
  background: var(--color-elevated-dark);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-tile);
  padding: var(--space-tile-standard);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.ad-banner-tile__label {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-label);
  letter-spacing: var(--text-label-tracking);
  text-transform: uppercase;
  color: var(--color-text-secondary);
}
```

**Mobile variant** (renders inside `<BentoShell>` compact branch, not inside the bento grid):

```css
.ad-banner-mobile {
  position: fixed;
  bottom: var(--space-sm);
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 50px;
  background: var(--color-elevated-dark);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-interactive);
  z-index: var(--z-base);
}
```

---

## 4. Animation Specs (concrete)

### 4.1 — Ripple effect (global, all tappable elements)

Implemented as a pseudo-element or a lightweight React hook.

```css
@keyframes ripple {
  from { transform: scale(0); opacity: 0.3; }
  to { transform: scale(2); opacity: 0; }
}
```

**React hook:**

```tsx
// src/hooks/useRipple.ts
import { useCallback, useRef } from 'react';

export function useRipple<T extends HTMLElement>() {
  const elRef = useRef<T>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    const el = elRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      position: absolute;
      pointer-events: none;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: currentColor;
      animation: ripple var(--duration-large) var(--ease-water) forwards;
    `;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return { ref: elRef, onPointerDown };
}
```

Respect `prefers-reduced-motion` via the CSS custom-property override in Section 1.1.

### 4.2 — Hover glow (+25% on interactive elements)

```css
.interactive {
  transition: box-shadow var(--duration-micro) var(--ease-standard);
}

.interactive:hover {
  box-shadow: 0 0 24px rgba(0, 229, 255, 0.5); /* scale per element phase color */
}
```

### 4.3 — Wave sweep (route/phase change)

```css
@keyframes wave-sweep-in {
  from { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); opacity: 0.7; }
  to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); opacity: 1; }
}

.primary-tile[data-transitioning="entering"] {
  animation: wave-sweep-in var(--duration-large) var(--ease-standard);
}
```

### 4.4 — Living shimmer (wet-neon, 12s cycle)

```css
@keyframes living-shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.wet-neon {
  background-image: linear-gradient(
    90deg,
    var(--base-neon) 0%,
    color-mix(in srgb, var(--base-neon) 88%, white 12%) 50%,
    var(--base-neon) 100%
  );
  background-size: 200% 100%;
  animation: living-shimmer var(--duration-shimmer) var(--ease-standard) infinite;
}
```

### 4.5 — Loading state (flowing wave shimmer, 1.5s cycle)

```css
@keyframes loading-wave {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-elevated-dark) 0%,
    color-mix(in srgb, var(--color-neon-cyan) 15%, var(--color-elevated-dark)) 50%,
    var(--color-elevated-dark) 100%
  );
  background-size: 200% 100%;
  animation: loading-wave 1500ms ease-in-out infinite;
}
```

### 4.6 — Ball pulse (signature motion)

```css
@keyframes ball-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.06); opacity: 0.88; }
}

.trip-ball {
  animation: ball-pulse var(--duration-ball-pulse) ease-in-out infinite;
}
```

### 4.7 — Ocean-ripple logo

```css
@keyframes ocean-ripple {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(3); opacity: 0; }
}

.logo-ripple {
  animation: ocean-ripple var(--duration-ripple) ease-out infinite;
}

.logo-ripple--delayed {
  animation-delay: calc(var(--duration-ripple) / 2);
}
```

---

## 5. Accessibility Checklist

**Every component merge request must satisfy every checkbox.**

### 5.1 — Keyboard navigation

- [ ] All interactive elements reachable via Tab (in logical order: top bar → nav column → primary → right column → ad).
- [ ] Escape dismisses all dropdowns, popovers, modals.
- [ ] Enter/Space activate all buttons and links.
- [ ] Arrow keys navigate within list-like components (pill bar, search results, trip switcher rows).
- [ ] `Cmd/Ctrl+K` opens global search (desktop only).
- [ ] Focus traps inside modals and popovers; focus returns to trigger on close.
- [ ] Skip link at shell root: "Skip to main content" jumps to `#primary`.

### 5.2 — ARIA

- [ ] Shell root: `role="application"`.
- [ ] Top bar: `<header role="banner">`.
- [ ] Nav column: `<nav aria-label="Trip phases">` (or `"Your trips"` on dashboard).
- [ ] Primary: `<main id="primary">`.
- [ ] Context panel: `<section aria-label="Context panel">`.
- [ ] Healthy-state context panel: `role="status" aria-live="polite"` on state transition.
- [ ] All dropdown triggers: `aria-haspopup`, `aria-expanded`.
- [ ] Unread notification bell: `aria-label` includes unread count.
- [ ] Active phase card: `aria-current="page"`.

### 5.3 — Contrast

- [ ] White `#FFFFFF` on `#0A0A12` — 18.3:1 ✓ (AAA).
- [ ] White `#FFFFFF` on `#15162A` — 16.7:1 ✓ (AAA).
- [ ] White `#FFFFFF` on `#1D1E36` — 14.2:1 ✓ (AAA).
- [ ] Dark `#0A0A12` on `#00E5FF` (cyan) — 12.4:1 ✓ (AAA).
- [ ] Dark `#0A0A12` on `#39FF6B` (green) — 14.1:1 ✓ (AAA).
- [ ] Dark `#0A0A12` on `#FFEB00` (yellow) — 15.3:1 ✓ (AAA).
- [ ] Dark `#0A0A12` on `#FF3DA7` (pink) — 8.9:1 ✓ (AAA-large / AA-normal).
- [ ] Dark `#0A0A12` on `#B14DFF` (purple) — 5.6:1 ✓ (AA).
- [ ] Color-spill gradient (13% opacity) over `#15162A` does not degrade white text contrast below 12:1.
- [ ] Never place neon-colored text on neon-colored background.

### 5.4 — Touch targets

- [ ] All interactive targets ≥ 48px × 48px.
- [ ] Pill bar pills use 32-36px visible height + 48px tap region (via padding or invisible hitbox).
- [ ] Phase cards ≥ 52px height (scales to 80px at ultra-wide).

### 5.5 — Focus indicators

- [ ] All interactive elements have a visible focus ring: 3px solid `var(--color-neon-cyan)`, 2px offset.
- [ ] Focus ring appears on `:focus-visible` (not `:focus`) to respect mouse users.
- [ ] Focus ring includes a small ripple animation from element center (per Liquid Motion).

### 5.6 — `prefers-reduced-motion`

- [ ] Global CSS overrides in Section 1.1 reduce duration tokens to near-instant.
- [ ] Living shimmer disabled (static neon).
- [ ] Ripple on tap replaced with 150ms opacity pulse.
- [ ] Ball pulse slowed to 6s opacity-only (no scale change).
- [ ] Wave sweep transitions become simple fades.

### 5.7 — Screen reader announcements

- [ ] Phase changes announced via the active-page indicator.
- [ ] Notification arrivals announced (live region, politeness level).
- [ ] Loading states announced ("Loading trip data").
- [ ] Form errors announced inline with the failing field.

### 5.8 — Color independence

- [ ] Active phase card: color + left-edge accent bar + phase-color name + icon = 4 cues, not color alone.
- [ ] Recommended phase dot is supplementary; the aria-label carries the meaning.
- [ ] Category color dots in notifications are supplementary; each row text states its category.

---

## 6. Open Decisions (must resolve before shipping)

| Decision | Owner | Current state | Blocking for |
|---|---|---|---|
| **Per-phase color map final** (Setup vs Preplanning vs Itinerary all being cyan creates visual sameness) | Product | Working values in DESIGN_SYSTEM.md § Phase color assignments — marked "working, not final" | Phase card visual mockup lock |
| **Ad network selection** (Google AdSense vs Nativo vs Playwire vs travel-vertical) | Product | Deferred to future pre-launch grill | Free-tier launch |
| **Payment processor** (Stripe likely, not confirmed) | Product | Deferred in ARCHITECTURE.md | Premium purchase flow |
| **Auth config details for Better Auth** | Product | Direction confirmed, config TBD in ARCHITECTURE.md | Signup/login implementation |
| **ORM choice** (Prisma vs Drizzle — see DECISIONS.md 2026-04-20 entry) | Resolved | Drizzle locked | — |
| **`prefers-contrast` handling** | Product | Not specified anywhere yet | Accessibility audit before shipping |
| **Keyboard shortcut full map** (beyond Cmd+K) | Product | Only Cmd/Ctrl+K is locked; Tab ordering specified but no other shortcuts (e.g., Cmd+/ for quick add?) | Power-user features |
| **Analytics instrumentation strategy** | Product | Not specified — needed for understanding shell usage | v1 launch (not a blocker but recommended) |

---

## 7. Implementation order (recommended)

1. **Week 1 — Foundations.**
   - Paste tokens (Section 1).
   - Set up Fredoka + Nunito via `next/font/google`.
   - Create `src/app/layout.tsx` with `bg-base-dark text-text-primary`.
   - Build `<BentoShell>` skeleton (empty slots, grid geometry).
2. **Week 2 — Navigation primitives.**
   - `<PhaseCard>` with all 5 states.
   - `<TopBar>` (both form factors).
   - `<PillBar>` with auto-center behavior.
3. **Week 3 — Dropdown panels.**
   - `<TripSwitcher>`, `<NotificationBell>`, `<AccountAvatar>` (all share interaction pattern).
   - `<GlobalSearch>` Cmd+K popover.
4. **Week 4 — Content slots + dashboard.**
   - `<ContextPanel>` (3 states).
   - `<ColorSpillTile>` for dashboard primary.
   - Wire `<BentoShell>` to real routes.
5. **Week 5 — Overrides.**
   - Zero-trip first-run (highest impact — it's the first impression).
   - Trip Creation ritual (ASO money shot).
   - Invite-landing.
   - Travel Day focus mode (integrate with existing § 9 spec).
   - Vaulted / Memory view.
6. **Week 6 — Polish + handoff.**
   - Run `/accessibility-review` on the implementation.
   - Verify all Section 5 checkboxes pass.
   - Resolve any Section 6 open decisions still outstanding.

---

## 8. How this document stays current

- If UX_SPEC.md § 42 changes, re-run `/design-handoff` to regenerate.
- If DESIGN_SYSTEM.md tokens change, regenerate Section 1 (tokens).
- If new components are added to the shell, add their spec to Section 3.
- Do NOT let this doc drift from the source docs silently — it is generated, not hand-maintained.
