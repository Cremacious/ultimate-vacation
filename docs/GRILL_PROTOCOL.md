# Grill-Me Session Protocol

This is the canonical rulebook for every grill-me session about TripWave, regardless of which computer or which Claude Code session is running. Any agent picking up grill-me work on this repo MUST follow this protocol.

**Read this first.** Every grill-me session on UI or product decisions starts here.

---

## Core rule

Grill-me sessions on any UI topic (page layout, component design, interaction, palette, motion, copy) MUST actively integrate the Anthropic Design plugin skills. The skills are mandatory quality gates, not optional polish. The agent is responsible for **reminding the user to invoke them at the correct moments**, not for silently assuming the user will remember.

---

## Session flow with enforced skill invocation

### Before the grill begins

1. Confirm the topic is on the **Core Loop spine** (see CORE_LOOP.md). If not, route to the deferred queue in ROADMAP.md unless the user explicitly overrides
2. Confirm Step 1 (page detail inventory) exists for the page. If it does not, the grill-me session starts with producing the inventory before any visual decisions. See CORE_LOOP.md → Build Workflow

### During the grill -- agent responsibilities

The agent actively prompts the user to run design skills at these specific moments. Reminders are shown inline in the grill-me output, not in a pre-session preamble.

#### Prompt A -- At the start, if user needs are unclear

When the grill is about a page whose **user needs are ambiguous** (novel feature, uncertain audience, no research backing), the agent says:

> *"Before I grill on UI, we should clarify what users actually need here. Want to run `/user-research` first?"*

This is a suggestion, not a block. If the user says no, proceed but note the risk.

#### Prompt B -- After each mockup option is described

When the agent has described a proposed mockup or UI layout (Step 2 output), the agent says:

> *"→ Before locking this, run `/design-critique` to pressure-test the mockup. Paste the description / screenshot / sketch of [specific page or component] into the skill prompt."*

This prompt fires **every time** a mockup or visual decision is being locked. If the user skips the critique, note in the decision log that `/design-critique` was not run for this decision.

#### Prompt C -- When a new component or pattern is proposed

When the grill introduces a **new component or visual pattern not already in DESIGN_SYSTEM.md**, the agent says:

> *"→ This introduces a new pattern. Run `/design-system` with DESIGN_SYSTEM.md + the new pattern to confirm fit and catch inconsistencies."*

This is especially important when extending the neon-on-dark palette, the liquid motion rules, or the trip-ball animation vocabulary.

#### Prompt D -- When Step 2 is locked and implementation is next

When the grill-me output includes *"your call"* and the user locks the decision, the agent says:

> *"→ Mockup locked. Before any JSX is written, run `/design-handoff` with the locked mockup to generate implementation-ready specs (tokens, states, breakpoints, animations)."*

This prompt fires on every page-level decision lock.

#### Prompt E -- When the user mentions implementation or ships a page

When the user says anything like *"I'm going to build this"* or *"this is done"* or *"I pushed it"*, the agent says:

> *"→ Before shipping or merging, run `/accessibility-review` on the implementation. Catches contrast, keyboard nav, touch target, and screen reader issues."*

#### Prompt F -- Post-launch, when user feedback is mentioned

When the user references user feedback, support tickets, interview notes, or survey results, the agent says:

> *"→ Run `/research-synthesis` on that feedback pile to distill into themes, user segments, and prioritized next steps."*

---

## Agent reminder checklist (mental checklist for every grill-me session)

Before ending a grill-me session on UI, the agent confirms:

- [ ] Was the page Step 1 detail inventory produced or already in place?
- [ ] Was Prompt A (`/user-research`) offered if user needs were unclear?
- [ ] Was Prompt B (`/design-critique`) offered after each mockup was described?
- [ ] Was Prompt C (`/design-system`) offered if a new pattern was introduced?
- [ ] Was Prompt D (`/design-handoff`) offered when the mockup was locked?
- [ ] Was Prompt E (`/accessibility-review`) offered if the user talked about shipping?
- [ ] Does the decision log entry note which skills were or weren't run?

If any of these were skipped, the agent notes the gap in the decision log follow-up line.

---

## Decision log annotation rule

Every decision log entry for a page-level or component-level UI decision must end with a **Design Skills line** that reports which skills were run (or skipped and why). Example:

> **Design skills:**
>
> - `/user-research`: skipped (user needs were clear from prior grills)
> - `/design-critique`: run on the locked mockup, feedback incorporated
> - `/design-system`: run (new liquid-shimmer pattern confirmed to fit)
> - `/design-handoff`: pending -- to run before implementation

This keeps the history honest about how much external critique the decision received.

---

## Copy for the agent to use verbatim

Agents picking up grill-me work on TripWave should use these exact prompts to stay consistent. Variation is fine, but the intent -- active reminder at the right moment -- must be preserved.

- *"→ Run `/design-critique` on this mockup before we lock it."*
- *"→ This is a new pattern. Run `/design-system` to check fit."*
- *"→ Mockup locked. Run `/design-handoff` before implementation."*
- *"→ Before shipping, run `/accessibility-review` on the live implementation."*
- *"→ Run `/research-synthesis` on that feedback pile."*

---

## What this protocol is NOT

- Not a replacement for human judgment -- the user can always skip a skill invocation and the agent respects that
- Not a blocker on grill-me progress -- reminders are inline prompts, not hard stops
- Not required for tiny tweaks (color adjustments, copy fixes, bug fixes with no layout change)
- Not limited to one computer or one Claude Code session -- this protocol applies universally to any session working on TripWave

---

## Where this lives in the doc tree

- **Canonical protocol**: docs/GRILL_PROTOCOL.md (this file)
- **Build workflow discipline**: docs/CORE_LOOP.md → Build Workflow
- **Skill-to-step mapping**: docs/CORE_LOOP.md → Anthropic Design plugin subsection
- **Decision log annotation rule**: docs/DECISIONS.md (every UI decision entry ends with Design Skills line)
- **Top-level reminder**: README.md → Anthropic Design Plugin Integration section
