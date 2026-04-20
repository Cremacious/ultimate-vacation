# Naming & Product Vocabulary

This is the canonical source of truth for every user-facing and internal name in TripWave. Established by the 2026-04-20 naming audit. When other docs conflict with this file, this file wins.

Historical docs (DECISIONS.md entries, older UX_SPEC sections) are not retroactively rewritten — the ledger stays honest. But all **forward work** uses the names in this document.

---

## Philosophy

- **Primary nav and page names are literal.** A first-time user must know what a nav item does in one second with no hover, tooltip, or onboarding.
- **Branded flavor concentrates in 3–4 flagship moments only.** Too many poetic names = users need a glossary. Too few = product feels generic.
- **Internal vocabulary can stay playful.** The "trip ball" is a valid internal term. It is never a user-facing label.

Current flagship branded surfaces (the only names allowed to be non-literal):
1. **TripWave** — product
2. **Dream Mode** — mode
3. **Afterglow** — post-trip recap
4. **Vault** — archival / document storage

Everything else is literal.

---

## Canonical rename table (2026-04-20 audit)

| Surface | Old name | New name | Notes |
|---|---|---|---|
| In-trip daily view | Vacation Day | **Today** | Nav label hidden or muted until Day 1 of trip. Inside: *"Today · Day 3 of 7."* |
| Pre-itinerary planning hub | Preplan / Preplan Hub | **Basics** | One word. Scales for real/dream/solo trips. Distinct from Itinerary. |
| Utilities page | Tools Hub | **Tools** | Interim rename. Drop "Hub" now. Final name to be re-audited Post-MVP when page content is locked. |
| Post-trip recap page | Memory recap / Memory page | **Afterglow** | Flagship branded moment. On-brand with neon/wave vocabulary. |
| App-level home | Dashboard | **Home** | The top-level landing when the user isn't inside a specific trip. |
| Premium tier (user-facing) | Premium | **Supporter** | Aligns with supporter thank-you framing. Purchase sheet: *"Become a Supporter · $4.99"*. Badge: *"♥ Supporter"*. "Premium" may persist as dev shorthand. |
| Trip phase (internal) | In-progress | **Active** | Docs reference only; users rarely see this label. |

---

## Names kept as-is (audit verdict: pass)

**User-facing nav and page names:**
- TripWave, Overview, Itinerary, Expenses, Packing, Travel Day, Budget, Invite, Wishlist, Polls, Scavenger Hunt, Notes, Members, Settings, Vault

**Branded modes / concepts:**
- Dream Mode

**Internal vocabulary (docs only, not user-facing):**
- Trip ball · trip switcher · phase pill bar · action center · Next-up card · notifications bell

---

## Trip ball — special handling

The "trip ball" is an internal docs term only. It **does not appear in user-facing copy**. Rules:

- Color picker label: simply "Color" (no ball reference)
- First-run poetic framing may say *"every trip has its own glow"* — "glow" is acceptable; "ball" is not
- Tooltips, settings, onboarding never use the word "ball"
- The ball is a visual, not a named thing, from the user's perspective

---

## Watch list (kept but flagged for future audit)

| Name | Reason to re-audit |
|---|---|
| **Overview** | Defensible but generic. Re-audit when the in-trip home state gets its v2 polish pass. Not urgent. |
| **Tools** | Interim. Re-audit when Post-MVP page content is locked — final name depends on whether page is utilities-only or also includes destination discovery. |

---

## Rules for future naming decisions

1. New nav or page names must pass the one-second test.
2. Branded concept names are rationed — additions to the flagship list must justify their seat by replacing or strongly earning it.
3. Internal dev vocabulary is free; it just can't leak to users.
4. If a name needs a glossary entry to be understood, it is the wrong name for user-facing copy.
5. Parallel-sounding name pairs (e.g. "Travel Day / Vacation Day") are a naming trap. If two names sound parallel, they must be parallel concepts — otherwise rename one.

---

## Historical continuity

Older DECISIONS.md entries and UX_SPEC sections may still reference old names (Vacation Day, Preplan, Memory recap, Dashboard, Premium). Those entries are the historical record and are not rewritten. New work uses the names in this document. When a doc section is materially revised, update its names to match this file at that time.
