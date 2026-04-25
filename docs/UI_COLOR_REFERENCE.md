# UI Color Quick Reference

**READ THIS BEFORE WRITING ANY JSX, HTML, OR CSS.**

This is the permanent single source of truth for all color, surface, and component styling in TripWave. It reflects the actual shipped UI (charcoal palette). Every page, input, button, card, and label follows these exact values — no exceptions, no guessing.

---

## Surface Colors (Charcoal Palette — What Ships Today)

| Surface | Hex | Tailwind / inline | Used for |
|---|---|---|---|
| App background | `#404040` | `style={{ backgroundColor: "#404040" }}` | Root background of all authenticated pages |
| Header / sticky bars | `#282828` | `bg-[#282828]` | Top nav, sticky section headers, phase headers |
| Main cards / panels | `#2E2E2E` | `bg-[#2E2E2E]` | Primary content cards, action panels |
| Nested panels | `#252525` | `bg-[#252525]` | Sub-panels inside cards, section containers |
| Inputs | `#1E1E1E` | `bg-[#1E1E1E]` | All form inputs and text areas |
| Border / card edge | `#3A3A3A` | `border-[#3A3A3A]` | Card and input borders |
| Internal divider | `#333333` | `border-[#333333]` | Dividers within cards and panels |

> The app layout (`src/app/app/layout.tsx`) uses `bg-[#444444]` — very close. Individual pages override it by setting `style={{ backgroundColor: "#404040" }}` on the page root element.

---

## Text Colors

| Role | Value | Tailwind | Notes |
|---|---|---|---|
| Primary | `#FFFFFF` | `text-white` | All headings, labels, body copy — always white |
| Secondary | `rgba(255,255,255,0.9)` | `text-white/90` | Subtitles, section subheadings, secondary labels |
| Muted | `rgba(255,255,255,0.8)` | `text-white/80` | Helper text, captions, ALL CAPS tile labels, timestamps |
| Placeholder | `rgba(255,255,255,0.8)` | `text-white/80` | Input placeholder text (use `placeholder:text-white/80`) |

**White text rule — THREE values only, no exceptions:**

| Class | Opacity | Use for |
|---|---|---|
| `text-white` | 100% | Headings, trip names, primary labels, button text, stat numbers |
| `text-white/90` | 90% | Subtitles, secondary labels, body copy inside cards |
| `text-white/80` | 80% | Helper text, captions, ALL CAPS tile labels, placeholder text, timestamps |

**Never use:** `text-[#9CA3AF]`, `text-white/50`, `text-white/40`, `text-white/30`, `text-white/60`, `text-gray-*`, or any other opacity level. If text needs to be de-emphasized, step down exactly one level (primary → `/90` → `/80`). If `/80` is still too prominent, reconsider whether the element needs to be visible at all.

---

## Accent Colors (Neon Rainbow Palette)

TripWave uses **all six neon accent colors freely** to create a vibrant, energetic brand feel — not just blue and purple. Think of them as a rainbow set: every color should appear regularly across the UI. Semantic roles below are the *primary* anchors, but any accent may appear in decorative contexts (gradients, borders, icon fills, highlight moments) throughout the app.

| Color | Hex | Tailwind | Primary semantic role | Also appears in |
|---|---|---|---|---|
| Cyan | `#00A8CC` | `bg-[#00A8CC]` / `text-[#00A8CC]` | Primary CTAs, active nav, focus rings | Morning greeting, stat numbers, active states |
| Pink | `#FF2D8B` | `bg-[#FF2D8B]` / `text-[#FF2D8B]` | Active pills, phase accents, invite moments | Evening greeting, error tints, badges |
| Yellow | `#FFD600` | `text-[#FFD600]` | Confirmation codes, badges, "settle up" signals | Afternoon greeting, highlights, packing actions |
| Green | `#00C96B` | `text-[#00C96B]` | Expenses and financial contexts (primary) | Settled/complete states, success signals |
| Purple | `#A855F7` | `text-[#A855F7]` | Dream Mode, wishlist moments | Night greeting, decorative gradients, special moments |
| Orange | `#FF8C00` | `text-[#FF8C00]` | Travel day, urgency | Departure countdown, warmth accents |

**Rainbow gradient pattern** (banner stripes, dividers, hero accents):
```tsx
style={{ background: "linear-gradient(90deg, #00A8CC 0%, #A855F7 25%, #FF2D8B 50%, #FFD600 75%, #FF8C00 100%)" }}
```

**Never use** the over-saturated neon variants (listed in the Never Use table below). The six values above are the canonical set.

---

## Copy-Paste Component Patterns

### Page root (every authenticated page)
```tsx
<div style={{ backgroundColor: "#404040", minHeight: "100vh" }}>
  {/* page content */}
</div>
```

### Card (primary content panel)
```tsx
<div
  className="rounded-2xl border border-[#3A3A3A] p-6"
  style={{ backgroundColor: "#2E2E2E" }}
/>
```

### Nested panel (sub-panel inside a card)
```tsx
<div
  className="rounded-xl border border-[#3A3A3A] p-4"
  style={{ backgroundColor: "#252525" }}
/>
```

### Input / text area
```tsx
<input
  className="w-full rounded-xl border border-[#3A3A3A] bg-[#1E1E1E] px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00A8CC] focus:outline-none transition-colors text-sm font-medium"
/>
```

### Button 3D shadow rule — MANDATORY for all interactive buttons

Every clickable button gets a bottom shadow that creates a pressed/3D effect. Shadow color is a darkened version of the button's background:

| Button type | Shadow |
|---|---|
| Colored (any accent) | `0 3px 0 <darkened-accent>` e.g. `0 3px 0 #007a99` for cyan |
| Dark / neutral (`#2a2a2a`, `#252525`) | `0 3px 0 rgba(0,0,0,0.5)` |
| Outline / ghost | No shadow (these are on dark surfaces, shadow wouldn't read) |

### Colored button text rule — MANDATORY

**Colored buttons always use dark text `#171717`, never white.** White text on bright neon colors is hard to read and loses contrast. This applies to ALL buttons with an accent color background (cyan, pink, yellow, green, purple, orange).

```
✅ style={{ backgroundColor: "#00A8CC", color: "#171717", boxShadow: "0 3px 0 #007a99" }}
❌ className="bg-[#00A8CC] text-white"
```

Outline/ghost buttons and dark-background buttons keep `text-white` as normal.

---

### Primary CTA button (cyan)
```tsx
<button
  className="rounded-full px-6 py-3.5 font-bold hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
  style={{ backgroundColor: "#00A8CC", color: "#171717", fontFamily: "var(--font-fredoka)", boxShadow: "0 3px 0 #007a99" }}
>
  Do the thing
</button>
```

### Active / selected pill (pink — e.g. selected transport, seat class)
```tsx
<button
  className="rounded-full px-4 py-2 text-sm font-bold"
  style={{ backgroundColor: "#FF2D8B", color: "#171717", boxShadow: "0 3px 0 #99003d" }}
/>
```

### Inactive pill (unselected option)
```tsx
<button
  className="rounded-full border border-[#3A3A3A] bg-[#252525] px-4 py-2 text-sm font-bold text-white hover:bg-[#333333] transition"
  style={{ boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }}
/>
```

### Secondary (outline) button
```tsx
<button className="rounded-full border border-[#3A3A3A] px-6 py-3 font-bold text-white hover:bg-white/5 transition" />
```

### Dark icon button (nav, toolbar)
```tsx
<button
  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2a2a] text-white hover:bg-[#333333] transition-colors"
  style={{ boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }}
/>
```

### Error / alert message
```tsx
<p
  role="alert"
  className="rounded-xl border border-[#FF2D8B]/30 bg-[#FF2D8B]/10 px-4 py-3 text-sm font-semibold text-[#FF2D8B]"
/>
```

### Back button (pill — permanent standard)

All back buttons use a pill shape containing the arrow icon and label together. Color is `#00C96B`. No external text outside the pill.

```tsx
<Link
  href="/app"
  className="inline-flex items-center gap-2 rounded-full border border-[#3A3A3A] bg-[#252525] px-4 py-2 transition-colors hover:bg-[#2E2E2E]"
  style={{ color: "#00C96B", boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }}
>
  <ArrowLeft size={13} weight="bold" />
  <span style={{ fontFamily: "var(--font-fredoka)", fontSize: "0.95rem", fontWeight: 700 }}>
    Your trips
  </span>
</Link>
```

Rules:
- Always a pill (`rounded-full`), never a bare circle with external text
- Arrow + label both in `#00C96B`
- Label always uses Fredoka
- 3D shadow: `0 3px 0 rgba(0,0,0,0.5)` (dark neutral button rule)

### Section label (ALL CAPS header inside a card)

Section labels use a **unique accent color from the neon rainbow, not `text-white/80`.** Each label in a layout gets its own color to give the UI energy and variety. Pick any of the six accents — the rule is no two adjacent labels should share the same color.

```tsx
<p
  className="text-xs font-black uppercase tracking-widest"
  style={{ color: "#FF8C00", fontFamily: "var(--font-fredoka)" }}
>
  Next up
</p>
```

Common assignments used on `/app` and `/trips/new` (treat as anchors, not hard rules):
| Label | Color |
|---|---|
| Next up | `#FF8C00` Orange |
| Your trips | `#FFD600` Yellow |
| Trip name | `#FF2D8B` Pink |
| Trip color | `#A855F7` Purple |
| Start date | `#00C96B` Green |
| End date | `#FF8C00` Orange |
| Budget | `#00C96B` Green |
| Days away | trip's own `ballColor` |

### Trip role badges

Role badges are small pill-shaped labels shown inline on member rows in the Group section.

| Role | Badge color | Background | When |
|---|---|---|---|
| Admin | `#FFD600` Yellow | `rgba(255,214,0,0.15)` | `userId === trip.ownerId` |
| Org | `#00A8CC` Cyan | `rgba(0,168,204,0.12)` | `role === "organizer"` and not owner |
| Member | `rgba(255,255,255,0.35)` | `rgba(255,255,255,0.06)` | `role === "member"` |

Admin is never stored as a separate DB value — it is always derived at runtime by comparing `userId` to `trips.ownerId`.

### Clickable list card (no border, 3D shadow)

Cards that are clickable links use a bottom shadow instead of an all-around border. This signals interactivity without adding visual noise.

```tsx
<Link
  href="..."
  className="block rounded-2xl px-5 py-5 hover:brightness-110 transition"
  style={{ backgroundColor: "#252525", boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }}
/>
```

Never put `border border-[#3A3A3A]` on a clickable card. The 3D shadow does that job.

### Bento grid layout (canonical page structure)

```tsx
<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
  {/* Left — main content, spans 2 columns */}
  <div className="lg:col-span-2 rounded-2xl border border-[#3A3A3A]" style={{ backgroundColor: "#2E2E2E" }}>
    ...
  </div>
  {/* Right — sticky stat tiles */}
  <div className="flex flex-col gap-4 lg:sticky lg:top-[4.5rem] lg:h-[calc(100vh-32rem)]">
    ...
  </div>
</div>
```

### Form input with underline affordance (large Fredoka inputs)

For big headline-style inputs where there is no visible border box, use a bottom-border underline on a wrapper div to signal the field is typeable. The underline lights up on focus.

```tsx
<div
  className="w-full border-b-2 transition-colors"
  style={{ borderBottomColor: "rgba(255,255,255,0.15)" }}
  onFocusCapture={e => (e.currentTarget.style.borderBottomColor = "#FF2D8B")}
  onBlurCapture={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
>
  <input
    className="w-full bg-transparent outline-none text-white placeholder:text-white/40 font-semibold"
    style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", paddingBottom: "2px" }}
  />
</div>
```

### Stat cell (large number display)
```tsx
<div className="rounded-xl border border-[#3A3A3A] p-4" style={{ backgroundColor: "#252525" }}>
  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#00A8CC", fontFamily: "var(--font-fredoka)" }}>Label</p>
  <p className="text-4xl font-semibold text-[#00A8CC]" style={{ fontFamily: "var(--font-fredoka)" }}>42</p>
</div>
```

---

## Typography

- **Fredoka** (`var(--font-fredoka)`) — display moments, headlines, trip names, phase nav labels, **all form labels**, **all button text**. Weight 600 for big moments, 400–700 for labels and buttons.
- **Nunito** — body copy, input values, placeholder text, timestamps, fine print. Default; no `style` needed.

**Form label font rule:** Every `<label>` uses Fredoka. Labels are uppercase, tracked wide, small size — Fredoka gives them personality without competing with the input values below.

**Button font rule:** Every button text uses Fredoka. This applies to primary CTAs, outline buttons, pill selectors, and nav buttons alike.

```tsx
// Large headline
<h1 className="text-4xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }} />

// Section header inside card
<h2 className="text-xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }} />

// Form label (always Fredoka, always uppercase)
<label className="text-xs font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-fredoka)", color: "#00A8CC" }} />

// ALL CAPS card section label (always Fredoka)
<p className="text-xs font-black uppercase tracking-widest text-white/80" style={{ fontFamily: "var(--font-fredoka)" }} />

// Primary body (Nunito — no style needed)
<p className="text-sm text-white" />

// Secondary / muted body
<p className="text-sm text-white/80" />
```

---

## Never Use These

| Wrong value | Correct replacement | Why |
|---|---|---|
| `bg-white`, `bg-gray-50`, `bg-gray-100` | `bg-[#2E2E2E]` or `bg-[#1E1E1E]` | Light-mode surfaces |
| `bg-[#0A0A12]`, `bg-[#15162A]`, `bg-[#1D1E36]` | `bg-[#404040]` / `bg-[#2E2E2E]` | Navy palette — aspirational, not current shipped UI |
| `border-gray-100`, `border-gray-200`, `border-[#2A2B45]` | `border-[#3A3A3A]` | Wrong border values |
| `text-[#1A1A1A]`, `text-gray-400`, `text-gray-500` | `text-white` or `text-white/90` | Light-mode text |
| `text-[#9CA3AF]` | `text-white/90` or `text-white/80` | Hardcoded gray — use opacity instead |
| `text-white/50`, `text-white/40`, `text-white/30`, `text-white/60` | `text-white/80` (lowest allowed) | Arbitrary opacity levels — only /80, /90, full white permitted |
| `placeholder:text-gray-300`, `placeholder:text-[#6C6E8A]`, `placeholder:text-white/30` | `placeholder:text-white/80` | Wrong placeholder opacity |
| `#00E5FF`, `#FFEB00`, `#FF3DA7`, `#39FF6B`, `#B14DFF`, `#FF9236` | Use the matching charcoal-palette accent above | Neon palette — too saturated, not current shipped UI |
| `hover:text-[#1A1A1A]` | `hover:text-white` | Dark text on dark bg = invisible |
| `focus:border-[#00E5FF]` | `focus:border-[#00A8CC]` | Neon cyan — use standard cyan |

---

## Reference Components (Already Correct — Read These First)

- `src/components/itinerary/ItineraryShell.tsx` — correct card and header styling
- `src/components/expenses/ExpensesClient.tsx` — correct nested panel and stat cell patterns
- `src/components/HomeTripList.tsx` — correct trip card anatomy
