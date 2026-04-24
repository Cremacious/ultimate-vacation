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

### Primary CTA button (cyan)
```tsx
<button
  className="rounded-full bg-[#00A8CC] px-6 py-3.5 font-bold text-white hover:bg-[#0096b8] transition disabled:opacity-60 disabled:cursor-not-allowed"
  style={{ boxShadow: "0 3px 0 #007a99" }}
>
  Do the thing
</button>
```

### Active / selected pill (pink — e.g. selected transport, seat class)
```tsx
<button className="rounded-full bg-[#FF2D8B] px-4 py-2 text-sm font-bold text-white" />
```

### Inactive pill (unselected option)
```tsx
<button className="rounded-full border border-[#3A3A3A] bg-[#252525] px-4 py-2 text-sm font-bold text-white hover:bg-[#333333] transition" />
```

### Secondary (outline) button
```tsx
<button className="rounded-full border border-[#3A3A3A] px-6 py-3 font-bold text-white hover:bg-white/5 transition" />
```

### Error / alert message
```tsx
<p
  role="alert"
  className="rounded-xl border border-[#FF2D8B]/30 bg-[#FF2D8B]/10 px-4 py-3 text-sm font-semibold text-[#FF2D8B]"
/>
```

### Back / muted link
```tsx
<Link href="/app" className="text-sm font-semibold text-white/80 hover:text-white transition-colors">
  ← Back
</Link>
```

### Section label (ALL CAPS header inside a card)
```tsx
<p className="text-xs font-black uppercase tracking-widest text-white/80 mb-2">
  Section title
</p>
```

### Stat cell (large number display)
```tsx
<div className="rounded-xl border border-[#3A3A3A] p-4" style={{ backgroundColor: "#252525" }}>
  <p className="text-xs font-black uppercase tracking-widest text-white/80 mb-1">Label</p>
  <p className="text-4xl font-semibold text-[#00A8CC]" style={{ fontFamily: "var(--font-fredoka)" }}>42</p>
</div>
```

---

## Typography

- **Fredoka** (`var(--font-fredoka)`) — display moments, headlines, trip names, phase nav labels. Weight 600 for big moments, 400 for subheadings.
- **Nunito** — all body copy, labels, form fields, button text. Default; no `style` needed.

```tsx
// Large headline
<h1 className="text-4xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }} />

// Section header inside card
<h2 className="text-xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }} />

// ALL CAPS card label
<p className="text-xs font-black uppercase tracking-widest text-white/40" />

// Primary body
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
