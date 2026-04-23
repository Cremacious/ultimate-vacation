# Documentation Index

This folder is the operating system for the project. If we keep it current, it will save time every time we make a product, design, or engineering decision.

## Core Docs

- [PROJECT_PLAN.md](C:\Code\personal\ultimate-vacation\docs\PROJECT_PLAN.md)
  The broad product vision, goals, feature themes, monetization direction, and current assumptions.

- [ROADMAP.md](C:\Code\personal\ultimate-vacation\docs\ROADMAP.md)
  The phased delivery plan from foundation work through premium, collaboration, and offline support.

- [BACKLOG.md](C:\Code\personal\ultimate-vacation\docs\BACKLOG.md)
  The active and upcoming feature backlog with priorities, dependencies, and notes.

- [ARCHITECTURE.md](C:\Code\personal\ultimate-vacation\docs\ARCHITECTURE.md)
  The high-level technical direction, system boundaries, and initial data-domain design.

- [LOGIC_FLOW.md](C:\Code\personal\ultimate-vacation\docs\LOGIC_FLOW.md)
  The product behavior blueprint for trip states, guidance rules, phase transitions, and collaboration logic.

- [STATE_MODEL.md](C:\Code\personal\ultimate-vacation\docs\STATE_MODEL.md)
  The concrete trip object, status model, readiness logic, and next-best-action rules.

- [MONETIZATION.md](C:\Code\personal\ultimate-vacation\docs\MONETIZATION.md)
  The premium strategy, free-to-paid boundaries, conversion points, and profit discipline plan.

- [APP_STRUCTURE.md](C:\Code\personal\ultimate-vacation\docs\APP_STRUCTURE.md)
  The proposed app layout, route map, workspace regions, and user flow structure.

- [DESIGN_SYSTEM.md](C:\Code\personal\ultimate-vacation\docs\DESIGN_SYSTEM.md)
  The visual and UX rules for tone, spacing, surfaces, components, motion, and content style.

- [DESIGN_ROADMAP.md](C:\Code\personal\ultimate-vacation\docs\DESIGN_ROADMAP.md)
  The step-by-step order for locking design decisions without creating rework.

- [DECISIONS.md](C:\Code\personal\ultimate-vacation\docs\DECISIONS.md)
  The running decision log for important product and engineering choices.

- [SURFACE_BLUEPRINT.md](C:\Code\personal\ultimate-vacation\docs\SURFACE_BLUEPRINT.md)
  Per-surface product-memory document: verified current state, long-term contract, deferred capabilities, and what is not owed. Read before expanding any existing surface.

- [PACKING_IMPLEMENTATION_CHECKLIST.md](C:\Code\personal\ultimate-vacation\docs\PACKING_IMPLEMENTATION_CHECKLIST.md)
  Handoff-safe implementation checklist for the Packing page: current audited state, doc conflicts, missing JSX/logic/schema, and phased work remaining.

- [PACKING_PHASE1_SCHEMA_PROPOSAL.md](C:\Code\personal\ultimate-vacation\docs\PACKING_PHASE1_SCHEMA_PROPOSAL.md)
  Concrete Phase 1 schema proposal for richer Packing: recommended columns, migration strategy, query contract, and action surface before any implementation work starts.

- [PACKING_LISTS_SCHEMA_PROPOSAL.md](C:\Code\personal\ultimate-vacation\docs\PACKING_LISTS_SCHEMA_PROPOSAL.md)
  Current recommended Packing schema direction after the named-lists contract update: `packing_lists`, list visibility, item visibility overrides, and migration guidance from the transitional schema.

- [PACKING_NAMED_LISTS_MOCKUP.md](C:\Code\personal\ultimate-vacation\docs\PACKING_NAMED_LISTS_MOCKUP.md)
  Step 2 mockup for the Packing named-lists UI: page composition, tab behavior, list strip, visibility treatment, and critique prompts.

- [PACKING_LISTS_BRIDGING_MIGRATION_DRAFT.md](C:\Code\personal\ultimate-vacation\docs\PACKING_LISTS_BRIDGING_MIGRATION_DRAFT.md)
  Draft bridge from the current transitional packing schema to `packing_lists + packing_items.list_id`, including seeding and backfill strategy.

- [PACKING_CLAUDE_HANDOFF_2026-04-23.md](C:\Code\personal\ultimate-vacation\docs\PACKING_CLAUDE_HANDOFF_2026-04-23.md)
  Claude takeover document for the current Packing implementation state: what is already real, what changed in the latest slice, remaining gaps, assumptions, and recommended next order.

## How To Use This Folder

- Update `PROJECT_PLAN.md` when the product vision or business assumptions change.
- Update `ROADMAP.md` when priorities or release sequencing change.
- Add and reprioritize items in `BACKLOG.md` as new work is discovered.
- Add an entry to `DECISIONS.md` when we make a meaningful choice that future-us will forget the reasoning behind.
- Update `ARCHITECTURE.md`, `LOGIC_FLOW.md`, `STATE_MODEL.md`, `APP_STRUCTURE.md`, and `DESIGN_SYSTEM.md` before or alongside major implementation work.

## Suggested Habits

- Before building a feature, make sure it exists in the backlog.
- Before restructuring the product, update the app structure doc.
- Before introducing a new design pattern, add it to the design system.
- Before adding expensive infrastructure, document the reason and cost impact.
