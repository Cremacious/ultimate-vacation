# Decision Log

This file records meaningful decisions so we do not lose context as the project grows.

## Template

Use this format for new entries:

### YYYY-MM-DD - Decision title

- Status: proposed | accepted | superseded
- Context:
- Decision:
- Why:
- Follow-up:

## Entries

### 2026-04-17 - Trip ball click opens health breakdown modal

- Status: accepted
- Context: The trip ball is the core visual identity and appears on many screens. We needed a consistent interaction for when a user clicks or taps it inside the trip workspace.
- Decision: Clicking the ball opens a modal showing the fill breakdown by preplanning category, the current next best action, blockers if any, and a color picker for the ball.
- Why: Keeps users in context (modal, not navigation), teaches the mental model that preplanning fills the ball, works identically on desktop and mobile, avoids designing another full route.
- Follow-up: Ball modal spec lives in docs/UX_SPEC.md.

### 2026-04-17 - Dashboard is a hybrid of trip list plus action center

- Status: accepted
- Context: Users planning 2 or 3 trips need to see their trips emotionally (ball, countdown, progress) but also need a cross-trip queue of things needing attention.
- Decision: Dashboard has three vertical sections -- "Next up" dark hero at top (tappable, routes to that trip's recommended phase), trip list in the middle, and "Needs your attention" action center at the bottom.
- Why: Combines emotional pull with practical utility. Single-trip smart redirect was rejected as inconsistent. Pure action center was rejected as cold.
- Follow-up: Layout spec lives in docs/UX_SPEC.md.

### 2026-04-17 - Trip creation is a 4-step playful flow

- Status: accepted
- Context: Creating a trip is the commit moment. We want the ritual to feel warm and fun rather than administrative.
- Decision: Four full-screen steps -- Name (with listening-ball animation), Dates (optional with sassy copy), Pick a Color (fills the ball for instant payoff), Reveal (ball hero moment + "Meet [name]" + CTA). Wipe transitions between steps.
- Why: Multi-step keeps each moment simple and focused. Color pick makes the trip feel personal before any work is done. Dates are optional to respect vague-intent trips like "summer 2026". The reveal step celebrates the commitment.
- Follow-up: Full creation flow spec lives in docs/UX_SPEC.md.

### 2026-04-17 - Preplanning uses a section picker hub

- Status: accepted
- Context: Preplanning has 8 sections and dozens of fields. We had to decide how the user navigates through them all.
- Decision: A section picker hub. The hub shows 8 cards (one per section) with colored icons, progress indicators, and status badges. The user picks sections in any order. Each card opens a focused editor page for that section. Not-applicable sections can be marked as such and are excluded from the ball fill denominator.
- Why: Preplanning data rarely comes in a natural order. Linear wizards get abandoned when users hit fields they cannot answer. The hub shows overall progress at a glance. Each section as a focused editor keeps cognitive load low. Matches the ball mental model (each section fills a piece).
- Follow-up: Individual section editor layouts still TBD. Full hub spec in docs/UX_SPEC.md.

### 2026-04-17 - Preplanning section editor is a single scrollable form

- Status: accepted
- Context: Each preplanning section has 3 to 20+ fields and some have conditional fields based on primary choices (e.g., flight details only appear if transport mode is "flying").
- Decision: Each section opens as a single long scrollable form with all fields visible. Conditional fields animate in and out as relevant. Sticky footer offers "Save and return to hub" plus "Save and continue to [next section]". A "Mark not applicable" toggle at the top hides the section from the fill denominator. All fields autosave.
- Why: User deliberately picked the section from the hub, so wizarding them again inside is redundant. Single scroll keeps focus without hiding work. Conditionals keep the form clean. Consistent pattern across all 8 sections simplifies the design.
- Follow-up: Full editor spec in docs/UX_SPEC.md.

### 2026-04-17 - Itinerary uses day-by-day vertical scroll as primary view

- Status: accepted
- Context: The itinerary holds events, reservations, activities, and notes across every trip day. We needed a primary layout that balances trip-wide overview with per-event legibility.
- Decision: Vertical scroll down through the whole trip, each day a distinct section with a colored header card and event cards stacked beneath sorted by time. Sticky day-pill jumper at the top. Quick-add FAB on mobile, persistent + button on desktop. Optional fold-out compact calendar panel on desktop.
- Why: Trips are mentally organized by days, not hours. Calendar grids kill legibility. Flat lists lose structure. Horizontal timelines and tab layouts hide trip flow. Vertical scroll scales gracefully and works identically on desktop and mobile.
- Follow-up: Individual item shape and category differentiation still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Itinerary items differentiated by left stripe and header icon

- Status: accepted
- Context: Itinerary items span several categories (activity, reservation, transport, note, expense-linked). We needed to decide how much visual differentiation to apply per category.
- Decision: All item cards share a uniform shape. Category is signaled by a 4px colored left stripe plus a matching filled icon in the header row. Expense-linked items add a small green coin badge on top of their base category treatment. Color mapping uses brand language: activity yellow, reservation cyan, transport pink, note gray.
- Why: Stripes read faster at a glance than icon-only differentiation. Per-category layouts would fragment visual rhythm. Background tints would compete with the day headers. Uniform shape preserves the cohesive feel of a day while the stripe still telegraphs type.
- Follow-up: Full anatomy spec in docs/UX_SPEC.md.

### 2026-04-17 - Packing uses three tabs for My / Group / Suggestions

- Status: accepted
- Context: Packing mixes personal items (each user's own), group items (shared responsibility), and smart suggestions (premium feature). We had to decide how to present all three without overwhelming users.
- Decision: Three tabs at the top of the Packing phase. Default tab is "My list". Second tab "Group list" shows items with traveler assignment. Third tab "Suggestions" is premium-gated -- free users see a preview with an upgrade card. New items default to private. Privacy toggle lives in each item's three-dot menu.
- Why: Users want a personal-first view without group items leaking in. Group packing is a separate conversation. Premium suggestions get their own tab so the free-tier upgrade prompt has room to breathe. Tabs scale identically across mobile and desktop.
- Follow-up: Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Travel Day uses auto-route plus focus mode on the day of

- Status: accepted
- Context: Travel Day is a core differentiator. Outside of the actual travel day it is a normal planning phase, but on the day itself the app should reorder itself to execute the travel plan.
- Decision: Hybrid behavior. Far from the travel day, Travel Day is a normal editable phase. T-minus 24h adds a pulse dot on the sidebar tab. T-minus 6h triggers auto-route-on-open plus focus mode: sidebar collapses to icons, top bar becomes a minimal status strip, main view becomes a single-task-at-a-time execution checklist with giant tap targets and a live "you are here" marker. Focus mode exits automatically after arrival. Users can exit manually at any time and can manually activate focus mode outside the auto window.
- Why: Planning weeks before travel should feel calm and flexible. The actual travel day needs focus and stress reduction. Full app takeover would be patronizing and hide useful info. A banner alone does not reorder UI as required.
- Follow-up: Execution-mode checklist visual details, "leave in X minutes" guidance, and segment transitions to be specced later. Full mode spec in docs/UX_SPEC.md.

### 2026-04-17 - Vacation Day uses a single "Today" feed with morning briefing

- Status: accepted
- Context: During an in-progress trip, users need daily coordination rather than full planning. The docs specify priorities in the order: today's schedule, next meetup, active reservations, quick add, group activity, today's expenses.
- Decision: Vacation Day is a single-page scroll feed. Top: warm morning briefing card that updates at local sunrise. Middle: today's events using the itinerary card anatomy. Activity strip: horizontal chips of recent group changes. Quick actions: add event / log expense / start poll. Bottom: peek-tomorrow link. Auto-route to Vacation Day on trip open during in-progress trip days. No focus mode.
- Why: Users on vacation are distracted and jetlagged -- linear scroll beats widget grids or swipe decks. The morning briefing is a warm daily ritual. Auto-route keeps the user in the right context without locking them out of other phases.
- Follow-up: Quick-log expense and quick-poll interaction details TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Expenses uses a balances-first primary view

- Status: accepted
- Context: Expenses is a dense feature with ledger, splits, settlement, budget, receipt scanning, and currency conversion. We needed the primary view to answer the question users care about most.
- Decision: Balances hero card at the top showing the user's personal net and per-person breakdown with Mark settled and Mark paid buttons. Trip total strip below. Ledger filtered by chips (All / Yours / By category / By day). FAB for Add expense plus a premium-gated Scan receipt action.
- Why: The #1 user question is "do I owe / is anyone owed" not "what did we spend on food". Balances-first answers that question immediately and doubles as social pressure to settle. Ledger-only buries the answer. Tabs force users to hunt.
- Follow-up: Add-expense flow details, split interaction, and settlement state transitions still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Polls page uses active-as-big-cards plus closed-as-compact-rows

- Status: accepted
- Context: Polls live in a dedicated phase but have two clear states -- active (needs your vote, live) and closed (historical reference, possibly convertible to an itinerary item). We needed to decide how to surface both without making users hunt.
- Decision: Active polls are large cards at the top with the full voting UI inline (one-tap vote on big option pills). Closed polls are compact rows below showing the winner and a Convert-to-itinerary pill if not yet converted. Start-a-poll is a slide-up sheet / modal with an optional "quick vote" mode for in-trip snap decisions.
- Why: Visual weight follows user action -- active polls need voting, closed ones are reference. Tabs would hide active polls behind a click. Chronological feeds mix live and dead polls awkwardly.
- Follow-up: Notifications for new polls and quick-vote UI detail in later passes. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Wishlist uses hot-section plus explicit promote actions

- Status: accepted
- Context: Wishlists tend to accumulate noise if the path from idea to reality is obscured. We needed to surface the best ideas and make promotion to the itinerary friction-free.
- Decision: Top section shows "The group is into" (most-liked ideas, horizontally scrollable cards). Below, a full vertical list of idea cards, each with Like and Add-to-itinerary buttons. Promoting an idea removes it from the wishlist with an Undo toast. Restricted mode hides the Add-idea button for non-organizers when the organizer disables participant adds.
- Why: Wishlists die when ideas get buried. Hot section doubles as social proof. Explicit promote button keeps the action one tap away. Categories and pinboards add unnecessary friction.
- Follow-up: Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Notes use a social feed with reactions and event link chips

- Status: accepted
- Context: Notes are shared posts used to communicate reminders, tips, and observations with the group. We had to decide between social-feed, tabbed, categorized, and bulletin layouts.
- Decision: Chronological social feed, newest first. Each note card shows author, body, optional photo / link, an event-link chip (when attached to an itinerary item), reactions row, and a reply thread preview. Filter chips: All / Mine / Event-linked / Pre-trip / On-trip / Post-trip. Replies are single-level threaded. Reactions are emoji toggles.
- Why: Notes are communication, not filing. Feed shape matches the mental model. Chronology is essential and would be lost in tabs. Categories over-organize. Bulletin boards get chaotic at volume.
- Follow-up: Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Vault uses category sections plus search plus "Needed today" strip

- Status: accepted
- Context: The Vault holds high-stress documents (passports, boarding passes, hotel confirmations). Speed of retrieval matters more than browsing pleasure.
- Decision: Sticky search bar at the top. Conditional "Needed today" strip surfaces date-relevant docs during in-progress trips. Below that, collapsible category sections (Passports, Flights, Lodging, Insurance, Reservations, Other) with thumbnail grids. Floating upload FAB on mobile, top-right button on desktop. Doc detail view opens full-screen with Download / Share (expiring link) / Mark as expired / Edit / Delete actions. Premium-gated OCR auto-extracts details on upload.
- Why: At border counters users cannot browse. Categories provide scannable shortcuts. Search is the escape hatch. "Needed today" automates the right-doc-right-moment behavior. Flat grids and traveler-scoped layouts both break down at volume or force premature organization.
- Follow-up: Sharing link expiration rules and OCR detection heuristics still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Tools hub uses phase-aware smart surfacing plus full library

- Status: accepted
- Context: Tools holds 20+ mini-features split across free and premium tiers. Each tool is most relevant at a specific phase or trip state. A static grid forces users to do the discovery work themselves.
- Decision: Top of the Tools page shows a "Useful right now" row of 3 to 5 larger cards adapted to the current phase and trip data. Below sits the full categorized library (Planning / Destination / On the trip / Accessibility). Smart surfacing responds to phase, destination, and group composition. Premium tools show lock icons and inline paywalls on the free tier.
- Why: Users should not have to hunt for a tool when the app knows what phase they are in. Surfacing drives discovery without forcing alphabetical or search-first interaction. Full library remains available below for browsing and power users.
- Follow-up: Per-tool surface logic refinement in a later doc pass. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Memory phase uses a two-section stacked layout

- Status: accepted
- Context: Post-trip wrap-up is simultaneously emotional (celebrate the trip) and practical (settle expenses, close loose ends). The two vibes do not mix cleanly in the same UI block.
- Decision: "Your trip in review" section on top (hero card with the nostalgic ball, auto-generated stats, highlights carousel, post-trip poll, scavenger hunt, shareable recap). "Loose ends" section below (unsettled expenses, unresolved polls, pending wishlist, archive action). Ball enters nostalgic fade on Memory entry and dimmed state on archive. Shareable recap has a TripWave watermark for free users.
- Why: The app should celebrate before asking for paperwork. Tabs would hide the celebration. Slideshows force users through an intro. Splitting across phases dilutes the purpose of Memory. Two-section stack lets users linger in the recap and see to-dos without context-switching.
- Follow-up: Highlight auto-generation heuristics, share-link permissions, and export format still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Organizer invite screen uses share-card plus invited-list hybrid

- Status: accepted
- Context: The invite experience needs to handle initial sharing, permission preset selection, seeing who has joined, resending to pending invitees, and removing people. Scattering these across separate screens adds friction.
- Decision: One page. Top: share card with invite link, human-readable invite code, QR code, and quick share actions. Middle: permission preset strip to set the default role for new joiners. Bottom: invited list split into Joined (with permission badge and three-dot menu) and Pending (with Resend and Revoke). Regenerate link action in the footer invalidates old links while keeping joined users.
- Why: Single-link modals cannot handle follow-up. Contact-based flows need phone contacts access and SMS sending infrastructure that we do not have early on. List-only separates sharing from status. A single page covers the whole lifecycle.
- Follow-up: Per-user permission toggle UI (for custom overrides beyond presets) still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Invitee lands on a trip-themed branded Join page before auth

- Status: accepted
- Context: Invitees tap a link with no prior context. We had to decide whether to route straight to auth, show marketing, or warm them up with the trip itself.
- Decision: Branded Join landing page themed to the trip's ball color, showing the trip ball, name, dates, destination, organizer name, and traveler avatars. Primary CTA "Sign up and join", secondary "Log in". Only preview fields are visible before auth -- no itinerary, no expenses. Post-auth shows a welcome splash and routes to the trip overview. First-session banner prompts them to fill their traveler profile (dietary, mobility, emergency contact). Invalid links show a warm "expired" message rather than a generic error.
- Why: The invite is an emotional moment. Cold auth pages kill it. Long marketing interstitials are the wrong timing. Anonymous preview would violate the account-required rule.
- Follow-up: Traveler profile editor layout TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Mobile phase nav uses a horizontal scrollable pill bar

- Status: accepted
- Context: The trip workspace has 14+ phases. The desktop left sidebar does not work on mobile. We needed a pattern that keeps every phase reachable in one tap without buried menus.
- Decision: On mobile, a horizontal scrollable pill bar sits below the top nav, sticky during scroll. Each pill is a colored circle icon + phase name with bright-background active state and pale inactive state. Active phase auto-scrolls into view. Colored pills match the phase-color language used in the desktop sidebar and dashboard. Desktop keeps the left sidebar unchanged.
- Why: Bottom tab bars force picking a few "winner" phases that do not match all trip states. Hamburger menus hide the trip map. Dropdowns add friction. Horizontal pills show all phases, teach colors by repetition, and scale gracefully.
- Follow-up: Pill-bar scroll feel, snapping behavior, and phase-group dots implementation still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Permissions use preset-with-override hybrid member management

- Status: accepted
- Context: Organizers need fine-grained control over what each traveler can do (add items, vote, invite, etc.) without turning the settings page into a spreadsheet.
- Decision: Member list with per-user preset dropdown (Organizer / Trusted / Standard / View-only / Custom) plus a "Customize" link that expands an inline toggle panel grouped by category (Itinerary / Expenses / Polls / Social / Administrative). Transfer ownership and Remove from trip live in the member card three-dot menu with confirmation modals. Removed members leave anonymized contributions in place.
- Why: Presets cover the common case with one tap. Customize preserves fine-grained control without exposing it to every organizer. Matrix tables feel cold. Dedicated per-user pages are too heavy for simple cases. Feature-scoped controls spread the mental model across phases.
- Follow-up: Preset exact definitions and default toggle mapping still need formal lockdown. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Premium prompts use inline lock cards plus contextual moment cards

- Status: accepted
- Context: Premium is a one-time $5 unlock covering ad removal, offline mode, receipt scanning, currency converter, advanced smart suggestions, travel-day templates, trip export, and trip duplication. We needed a prompt style that respects free users while converting at the right moments.
- Decision: Inline lock cards as the default, replacing the feature's normal entry point (cyan-tinted card, lock icon, feature name, one-line value, Unlock button). Moment cards escalate at context-rich triggers (offline mid-trip, tapping a currency field, 5+ expenses without scan, pre-archive). Both are inline -- never modal takeovers, never persistent banners, never scarcity language. Prompt-free zones include travel-day focus mode, vacation day quick actions, the new-trip onboarding overview, and settlement actions. Purchase flow is a slide-up sheet with Stripe (web) and Apple/Google Pay (future native).
- Why: Modal takeovers are punishing and the docs forbid them. Auto-redirects disrupt flow. Persistent banners erode trust. Inline lock cards respect in-progress work, moment cards catch genuine high-intent conversion windows.
- Follow-up: Moment-card trigger logic and post-purchase celebration animation still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Free-tier ads use a persistent bottom banner plus native cards in long feeds

- Status: accepted
- Context: The free tier is ad-supported. The docs define ad-hostile zones (travel day execution, checklists, expense entry) and ad-friendly zones (dashboards, between sections). We needed a concrete placement pattern that balances impressions with UX.
- Decision: Persistent bottom banner (Cozi-style) on most pages, 50 to 60px tall, with an AdMob adaptive unit or AdSense responsive unit. Banner has an "Ad" label, a close-for-session X, and a small "Remove ads for $5" upsell link on the right. Native card ads inject into long content feeds (Itinerary, Notes, Expenses ledger, Polls list) at roughly positions 4, 12, 20 with clear Ad labels. Suppression zones include travel-day focus mode, vacation day briefing view, expense entry modal, trip creation flow, invite join landing, Memory hero recap, trip ball modal, and the first minute of a new user's session.
- Why: Banner delivers baseline impressions. Native cards catch attention where banner blindness sets in. Suppression protects high-stakes UX moments. The upsell hint turns every impression into a conversion opportunity.
- Follow-up: AdMob / AdSense unit IDs, ad fetch timing, and ad-block detection behavior still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Established trip overview uses one flexible layout with state-aware content

- Status: accepted
- Context: A trip lives in Planning, Ready, In-progress, and Completed states across most of its existence. The docs require state-aware workspace behavior but building entirely separate layouts per state would be a maintenance burden.
- Decision: One overview page layout with state-aware content per region. Hero strip shows the ball (state-reactive animation), trip name, dates, destination, countdown. Stats row adapts tiles to state. Primary next-action card routes to the phase that reduces the most trip risk per state. Blockers card is conditional. Recent activity feed shows group actions. Quick jump grid links to the 6 most relevant phases per state. Bottom CTA surfaces only at transitions (ready to advance at 90%, close trip when completed).
- Why: State-specific layouts would duplicate design work. Widget grids feel corporate. Minimal link pages underserve the trip home. Feed-based overviews bury the primary next action. One flexible layout is easier to build, learn, and maintain.
- Follow-up: Blocker detection logic and next-action precedence rules still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Notifications use in-app surfaces plus future push, no notification emails

- Status: accepted
- Context: TripWave has many "look at this" moments (polls, expenses, invites, travel day, settlement). We had to decide where notifications surface and which channels we support.
- Decision: In-app notifications are delivered through three surfaces -- a bell icon in the top nav opening a grouped panel (Today / This week / Earlier), real-time toasts for live events while the user is in the app, and the dashboard action center for actionable items. Push notifications added later when the native app ships, opt-in at the OS level. Email is used only for the password reset flow. No SMS. No phone number collection. No email verification on signup. No digest emails. No invite emails (invites are shared via link, code, or QR).
- Why: Reduces external dependency scope for the MVP (no email deliverability tuning, no SMS provider contract). Users do not need to hand over a phone number. Push is the right long-term channel for urgency. Email becomes noise for most users.
- Follow-up: Push notification trigger logic and native-app permission-request timing TBD. Full spec in docs/UX_SPEC.md. MONETIZATION.md, ARCHITECTURE.md, and LOGIC_FLOW.md also updated to reflect the narrower email scope.

### 2026-04-17 - Trip switcher is a top-nav dropdown with mini-balls

- Status: accepted
- Context: Users with multiple trips need to hop between workspaces without returning to the dashboard each time. The trip-name pill in TopNav is the natural switcher entry point.
- Decision: Tapping the trip pill opens a dropdown below it. Current trip shown at top grayed out for context. Other trips listed below, each with a small colored ball, name, and subtitle (countdown or dates). Tap routes to that trip's overview or recommended phase. Dropdown footer has All-trips and New-trip links. On mobile, narrow screens expand the dropdown into a full-width sheet.
- Why: Matches the industry-standard workspace-switcher pattern (Notion, Linear, Slack). Modals and side drawers are overkill. Forcing dashboard returns doubles the taps per switch.
- Follow-up: Switcher behavior on 20+ trips (long-list scrolling and search) to be refined later. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Empty states use a unified skeleton with per-feature playful variations

- Status: accepted
- Context: Empty states appear across every feature (no trips, no events, no expenses, etc.). The docs require them to act like guided onboarding rather than placeholder text.
- Decision: One shared empty-state skeleton (centered illustration at 96-120px, Fredoka headline max 8 words, Nunito gray description max 25 words, cyan pill CTA, optional collaborative chip). Per-feature illustrations and copy give each feature its own playful variation while the skeleton teaches the pattern. Illustrations use line art and flat shapes in brand colors only with circular ball-motif composition. Tone is warm and never scolding. CTAs always spell out the first action.
- Why: Consistent skeleton teaches the pattern after 2-3 encounters. Per-feature variations preserve TripWave's warm brand personality. Free-form per feature would break visual consistency. Generic placeholders would fail the guided-onboarding requirement. Separate templates for first-time vs later-empty add complexity with no clear benefit.
- Follow-up: Actual illustration assets to be designed. Animation treatments (gentle float or pulse) deferred to a later polish pass. Full copy catalog in docs/UX_SPEC.md.

### 2026-04-17 - Traveler profile uses account-level defaults with per-trip overrides

- Status: accepted
- Context: Traveler profile data (dietary restrictions, allergies, mobility needs, emergency contact) is mostly consistent across trips but occasionally needs to differ. We had to decide whether to make it account-level, per-trip, or hybrid.
- Decision: Hybrid two-tier model. Account-level profile at /app/account/profile stores defaults. Per-trip profile editor auto-pre-fills from defaults and allows overrides. Overridden fields show labels ("Synced from account" vs "Overridden for this trip"). Reset-to-account-defaults link available. Privacy defaults restrict fields to self and organizer; opt-in per field to share with the group. Emergency contact requires explicit per-trip opt-in to share.
- Why: Most users have stable info -- single entry at account level saves effort. Per-trip overrides handle edge cases like different emergency contact or dietary changes for a specific trip. Single profile misses nuance. Per-trip only frustrates repeat users.
- Follow-up: Field-by-field privacy defaults, avatar upload flow, and passport-expiry blocker integration TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Trip settings uses sub-routes with secondary sidebar on desktop

- Status: accepted
- Context: Trip settings has distinct concerns (trip info, members, invites, preferences, advanced, danger zone). A single flat page becomes overwhelming; tabs trap the user and complicate deep linking.
- Decision: Each category is its own sub-route under /app/trips/[tripId]/settings. Mobile shows a card list as the main settings page; desktop shows a secondary sidebar once inside settings. Danger zone is pink-bordered with individual confirmation flows; Delete-trip requires typing the trip name and cannot be dismissed via outside-click.
- Why: Sub-routes enable deep linking per category, focused pages per concern, clean back-button behavior, and scale as we add more settings without cluttering tabs or creating long scrolls.
- Follow-up: Trip export format, template save fields, and ball-animation-toggle details still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Brand new trip uses a dedicated onboarding overview

- Status: accepted
- Context: A freshly-created trip has no preplanning, no itinerary, no activity. Using the same overview layout as an established trip would show empty cards and zero stats, which feels broken.
- Decision: Brand new trips get a dedicated onboarding overview -- huge dashed ball, playful greeting copy referencing the trip by name, ONE primary action card (Start preplanning) and ONE secondary (Invite your crew). Overview transforms into the established-trip layout as soon as any preplanning data is added.
- Why: Intentional empty state feels like the product cares. Keeps focus on the two things that matter at day zero. Avoids filler UI.
- Follow-up: Full overview spec lives in docs/UX_SPEC.md.

### 2026-04-11 - Build web-first before mobile packaging

- Status: accepted
- Context: The product vision includes iOS, Android, and web, but the app is still in the earliest planning and foundation phase.
- Decision: Build a stable and high-quality web product in Next.js before packaging for mobile.
- Why: This keeps scope manageable, reduces cost, and lets us validate the product with one strong codebase first.
- Follow-up: Revisit mobile packaging strategy after the web experience and offline requirements are clearer.

### 2026-04-11 - Use Vercel and Neon as core infrastructure direction

- Status: accepted
- Context: Cost control and margin are explicit business goals.
- Decision: Plan around Vercel hosting and Neon database infrastructure.
- Why: Existing subscriptions reduce overhead and keep the stack familiar.
- Follow-up: Document provider-specific constraints as backend work begins.

### 2026-04-11 - Treat travel-day execution as a core differentiator

- Status: accepted
- Context: Many trip planners handle itineraries, but fewer help travelers actually move through departure day without forgetting important tasks.
- Decision: Prioritize travel-day schedule and checklist experiences as one of the app's signature features.
- Why: It is distinctive, genuinely useful, and aligned with the user's strongest product instinct.
- Follow-up: Reflect this clearly in MVP scope, IA, and landing-page messaging.

### 2026-04-11 - Establish project docs before heavy implementation

- Status: accepted
- Context: The codebase is new, and the product surface is broad.
- Decision: Create project planning, roadmap, architecture, layout, and design docs before deeper implementation work.
- Why: This should reduce rework and keep product, UX, and engineering decisions aligned.
- Follow-up: Keep the docs updated as code lands rather than letting them drift.

### 2026-04-11 - Charge the organizer rather than every participant

- Status: accepted
- Context: The product is centered around one person acting as the trip organizer and paying user, while other travelers join through invites.
- Decision: Premium access should be purchased by the organizer and apply to the trip workspace they own.
- Why: This matches the product mental model, keeps billing simple, and lowers friction for participant adoption.
- Follow-up: Revisit only if later collaboration complexity or team-style use cases justify a different model.

### 2026-04-15 - One-time $5 premium pricing instead of subscription

- Status: accepted
- Context: The app targets trip planners who may only use it heavily around one trip. A recurring subscription creates ongoing billing guilt and churn risk.
- Decision: Premium is a single one-time $5 payment per account. No monthly or annual subscription.
- Why: Low-friction for the core user, ad revenue covers operating costs, and premium revenue is additive margin. The $5 price point is low enough to be an impulse buy before a trip.
- Follow-up: Monitor whether a per-trip purchase option makes sense for users who want premium for one trip without committing their account.

### 2026-04-15 - Ad-supported free tier with premium ad removal

- Status: accepted
- Context: Free users need a sustainable revenue path. Ads are the most direct mechanism without gating core features.
- Decision: Both web and app versions are ad-supported for free users. Purchasing premium removes ads permanently.
- Why: Ad revenue is expected to cover Vercel and Neon infrastructure costs. Premium is pure upside. Ads should be placed in low-interruption locations (not during travel-day execution or active expense entry).
- Follow-up: Evaluate ad network options. Avoid ad placements that degrade core trip actions.

### 2026-04-15 - Expense splitting and polls are free features

- Status: accepted
- Context: Previously considered as premium candidates.
- Decision: Expense splitting, settlement, and polls are available to all users at no cost.
- Why: Fairness tools (splitting expenses) and group coordination (polls) should not be paywalled. They are core to the collaborative value proposition, and gating them would punish the use case the app is built for.
- Follow-up: Receipt scanning (the expensive part of expense workflows) remains premium.

### 2026-04-15 - Account required for all app features

- Status: accepted
- Context: Lightweight anonymous joining was previously under consideration.
- Decision: Users must have an account to access any app feature. Non-authenticated users can only see marketing pages, login, signup, legal, and contact.
- Why: Keeps data integrity clean, simplifies permission and collaboration modeling, and avoids anonymous editing chaos from day one.
- Follow-up: Keep signup flow fast and low-friction to compensate for the hard account requirement.

### 2026-04-15 - Tech stack finalized: Vercel, Neon, Azure, Resend

- Status: accepted
- Context: Multiple provider options were under consideration.
- Decision: The confirmed infrastructure stack is Vercel (hosting), Neon (Postgres database), Azure (receipt scanning OCR, premium only), and Resend (transactional email for password reset and invite notifications).
- Why: Vercel and Neon are already on paid plans shared with another app, reducing marginal cost to near zero. Azure is pay-per-use and only activated for premium receipt scanning. Resend is lightweight and developer-friendly for transactional email.
- Follow-up: TripWave has no image hosting requirement. Stripe or equivalent still needed for processing the one-time $5 premium payment.

### 2026-04-15 - Build features without paid third-party APIs where possible

- Status: accepted
- Context: The business model requires low operating costs to be profitable on ad revenue alone.
- Decision: Prefer building features with self-contained logic, free data sources, or open APIs rather than paid API subscriptions.
- Why: Keeps operating costs predictable and under control. Exceptions are Azure (receipt scanning, premium-gated) and payment processing for premium.
- Follow-up: Currency converter should use a free or self-managed exchange rate source. Smart suggestions should use deterministic rules before any AI inference costs.

### 2026-04-15 - The Trip Ball as core visual identity

- Status: accepted
- Context: The product needs a distinctive visual element that represents trip health and reinforces the TripWave brand identity.
- Decision: A circular ball character serves as the persistent visual representation of each trip. It fills from the center outward as preplanning is completed. It rolls between phases as the trip progresses. Users can recolor it. It has subtle personality through micro-animations rather than a cartoon face.
- Why: Gives the app a recognizable visual identity, makes trip health tangible and fun to watch grow, and fits the ocean wave personality of the TripWave brand.
- Follow-up: Design the ball animation states for each lifecycle phase. Define pulse animation rules -- ocean wave rhythm, not electronic bounce.

### 2026-04-15 - Action circle visual language

- Status: accepted
- Context: The trip ball needed a way to show that user actions are being recorded and the trip is growing.
- Decision: Meaningful user actions trigger small colored circles that animate into the trip ball. Green for expenses, cyan-blue for itinerary, yellow for packing, pink for participants joined, orange for travel day tasks. At end of trip the ball opens into a circle breakdown of the full trip.
- Why: Makes every action feel rewarding, extends the circle design language into a dynamic system, and produces a shareable end-of-trip visual that doubles as a marketing asset.
- Follow-up: Design the end-of-trip circle breakdown for the memory vault. Ensure action circle animations never block user flow.

### 2026-04-15 - Granular per-user permissions within a trip

- Status: accepted
- Context: Previous model assumed simple organizer vs participant roles.
- Decision: Organizers can set per-user permissions at trip creation (simple defaults) and adjust them in full trip settings at any time. Trip settings allows clicking a user and toggling individual capabilities on or off.
- Why: Different trips have different group dynamics. Custom per-user toggles accommodate both tight and open collaboration without inventing a complex role hierarchy.
- Follow-up: Trip creation form should surface simplified permission presets with a note pointing users to full settings for customization.

### 2026-04-15 - Packing lists are personal by default with optional sharing

- Status: accepted
- Context: Packing is often personal. Some items are private.
- Decision: Packing lists are personal by default. Users can optionally make their list visible to the group. Individual items within any list can be marked private, hiding them from all other users including the organizer.
- Why: Respects personal packing habits. Eliminates awkward moments where users need to pack personal or embarrassing items without announcing them.
- Follow-up: UI should make the private item toggle quick and non-judgmental.

### 2026-04-15 - Expense tracking begins at day 0 (preplanning)

- Status: accepted
- Context: Pre-trip costs like flights, hotels, and tickets are real trip expenses.
- Decision: Expense logging is available starting in the preplanning phase. Preplanning accommodation and transport costs link automatically to the expense ledger.
- Why: The true cost of a trip starts the moment you book. Tracking from the start gives users a complete financial picture.
- Follow-up: Ensure preplanning cost fields link to the ledger without requiring double-entry.

### 2026-04-15 - Smart suggestions are vibe-aware

- Status: accepted
- Context: Trip type and vibe affect what the app should suggest.
- Decision: Planning suggestions, packing recommendations, and itinerary ideas factor in the trip vibe (beach, city, adventure, road trip, family, romantic, etc.) as well as destination and group composition.
- Why: Generic suggestions feel unhelpful. Vibe-aware suggestions feel like a smart travel friend who actually understands the trip.
- Follow-up: Start with deterministic rule-based suggestions tied to vibe and destination type before considering any AI-driven inference.

### 2026-04-15 - Official brand slogan locked

- Status: accepted
- Context: The product needed a tagline that captures the collaborative core and the TripWave brand personality.
- Decision: The official slogan is "Get everyone on the same wave." The hero marketing headline is "Plan the trip. Not the group chat."
- Why: The slogan is brand-aligned (wave metaphor), speaks directly to the group coordination value, and has a confident sassy energy that fits the brand voice. The hero headline creates immediate recognition of the core pain point.
- Follow-up: Apply consistently across marketing pages, onboarding, and brand assets.

### 2026-04-15 - Em dash prohibited throughout the product

- Status: accepted
- Context: A style decision to keep copy feeling clean and conversational.
- Decision: The em dash character is never used anywhere in the app. Not in UI copy, tooltips, notifications, error messages, empty states, button text, marketing copy, or documentation. Use a comma, a period, parentheses, or rewrite the sentence instead.
- Why: Em dashes can feel formal or editorial. The TripWave voice is casual and direct. Avoiding em dashes keeps the copy feeling human and consistent.
- Follow-up: Enforce during all copy review. Apply retroactively to existing docs.

### 2026-04-15 - Activity wishlist is free, open to all participants by default

- Status: accepted
- Context: Users needed a place to collect ideas before they become formal itinerary items.
- Decision: All participants can add items to the activity wishlist by default. The organizer can restrict per user via the existing per-user toggle system. Wishlist items are removed from the wishlist when promoted to the itinerary, with an immediate undo action available.
- Why: Group trip inspiration should be collaborative and low-friction. The wishlist is different from polls -- no expiry, no forced decision, just a running idea board.
- Follow-up: Design the wishlist-to-itinerary promotion flow with a clear undo path.

### 2026-04-15 - Notes are individual posts, not a shared document

- Status: accepted
- Context: Shared notes needed a structure that works for groups without turning into an edit conflict problem.
- Decision: Notes are individual posts, not a single collaborative document. All posts are visible to the group in an "All" tab sorted newest first. Event-attached notes appear in a separate tab. Users can filter between views.
- Why: Individual posts avoid edit conflicts, preserve authorship, and are easier to react to and comment on.
- Follow-up: Personal notes (private) are a separate concept from shared notes posts.

### 2026-04-15 - Social layer: comments, likes, and favorites throughout the app

- Status: accepted
- Context: Users need lightweight communication within the app to avoid constantly exiting to a group chat.
- Decision: Most content items (itinerary events, wishlist items, notes posts, expenses) support comments, likes, and favorites. Favorites are personal. Notifications surface social activity. Web has in-app notifications only; native app has push notifications.
- Why: Keeps the group coordinating inside TripWave. Reduces the check-the-group-chat behavior that fragments trip communication.
- Follow-up: Comments support plain text only. Design the social layer to feel lightweight, not like a social feed.

### 2026-04-15 - Native app UI is a direct copy of web layout

- Status: accepted
- Context: Separate mobile design systems create maintenance burden and inconsistency.
- Decision: The native app (when built) uses the same UI layout as the web. No separate mobile-only nav or layout deviations.
- Why: Design once, build twice. Keeps the design system unified and reduces long-term complexity.
- Follow-up: Ensure all web design decisions account for touch targets and mobile usability from the start.

### 2026-04-15 - Trip duplication is a premium feature

- Status: accepted
- Context: Duplication is a power-user convenience that appeals most to repeat trip planners.
- Decision: Trip duplication is premium only. It copies trip structure (packing template, travel day tasks, permission presets, type and vibe) but not dates, participants, expenses, itinerary events, or confirmation numbers.
- Why: Strong upsell moment when starting a second trip. Free users get a natural prompt to upgrade.
- Follow-up: Design the duplicate flow to clearly show what is and is not copied.

### 2026-04-15 - Read-only share link is free

- Status: accepted
- Context: Organizers need a way to share the itinerary with non-members (family, friends checking in on the trip).
- Decision: Organizers can generate a read-only public link to a clean view of their itinerary. No account required to view. Expenses, packing lists, and private notes are always excluded. The public view carries TripWave branding.
- Why: Free acquisition tool. Every shared itinerary is a TripWave ad seen by people who have never heard of us.
- Follow-up: Organizer can revoke the link at any time. Include a subtle "Plan your trip with TripWave" CTA on the public view.

### 2026-04-16 - Color scheme changed from white-dominant to rich dark surfaces with vibrant accents

- Status: accepted
- Context: The original design direction used white as the dominant background with brand colors as foreground splashes. In practice this created large areas of empty white space with insufficient visual energy.
- Decision: The app UI uses deep rich dark surfaces (slate-navy base, not pure black) as the neutral foundation. Brand accent colors (cyan, yellow, pink, green, orange) are used freely as text labels, icon colors, borders, and highlight elements against the dark base. White is used for primary body text and high-contrast moments, not as a background fill. This is not a traditional dark mode -- it is a layered depth system where dark surfaces make every color element pop.
- Why: A dark base with vibrant multi-color foreground elements creates a more energetic and visually interesting product. Empty white surfaces disappear. The brand palette becomes more expressive because every accent color reads clearly against the dark background without competing with each other.
- Follow-up: Define the exact surface hex values when building the component library. Ensure text contrast ratios meet accessibility requirements on all surface tiers. Update marketing surfaces separately -- they can use more contrast between dark and light zones.

### 2026-04-16 - Mobile navigation uses a collapsible left sidebar, no bottom tab bar

- Status: accepted
- Context: Mobile navigation pattern was previously undecided (bottom tabs or drawer noted as TBD). A decision is needed before building the shell.
- Decision: Mobile navigation uses a collapsible left sidebar that matches the desktop left-rail content and structure. A hamburger toggle button in the top-left of the header opens and closes it. The sidebar slides in from the left, covers roughly 80% of viewport width, and sits above the content with a semi-transparent overlay behind it. There is no bottom tab bar.
- Why: A sidebar keeps the mobile and desktop navigation patterns consistent in content and mental model. Bottom tab bars limit the number of nav items that can be shown and create a separate design paradigm that diverges from desktop. A sidebar can show all phases, their colored icons, active state, and recommended phase badge without truncation.
- Follow-up: Implement the sidebar as a shared component used in both the app shell and trip workspace. Confirm animation duration and easing. Ensure the hamburger button is always reachable without scrolling.

### 2026-04-16 - Travel day UI is a vertical timeline with sequential task completion

- Status: accepted
- Context: Travel days are high-stress and time-sensitive. Users need a focused interface that shows exactly what to do next and keeps them moving forward without decision fatigue.
- Decision: Travel day pages show a single vertical timeline. Tasks are listed in chronological order from top to bottom -- wake up, eat breakfast, double check you have your tickets, turn off all appliances and electronics, leave the house, arrive at the airport, and so on. As the user checks off each task, the view auto-scrolls with a smooth animation to bring the next incomplete task into focus near the top of the screen. Completed tasks remain visible but visually de-emphasized. Users can customize the task list for each travel day, both during the planning phase and on the day itself.
- Why: A sequential vertical timeline with auto-scroll eliminates all uncertainty on departure day. The user never has to wonder what comes next -- the app moves them forward automatically. The format is mobile-first by nature since users will be on their phones while physically moving through the day.
- Follow-up: Define default task presets per transport mode (flight, drive, train). Define auto-scroll animation timing and easing. Allow task customization: add, remove, reorder, and rename tasks. Same timeline UI applies to vacation days with a different default task structure.

### 2026-04-16 - Bento grid layout for data-summary and edit pages

- Status: accepted
- Context: Setup and similar pages were initially built as narrow left-aligned vertical card stacks, leaving large amounts of empty white space on wider screens and making the layout feel like a list of form fields rather than a visual dashboard.
- Decision: Data-summary pages (Setup view, trip overview) and their corresponding edit forms use a bento grid layout. View and edit pages use different grid configurations from each other. The view grid emphasizes visual hierarchy with a large hero cell and solid-color stat cells for key numbers. The edit grid is organized by field complexity. The standard view pattern is a three-column grid (2fr 1fr 1fr) with a spanning hero cell. The standard edit pattern is a two-column grid (1.4fr 1fr) with full-width cells for prominent fields.
- Why: A bento grid eliminates empty whitespace, gives important data proportional visual weight, and makes the page feel like a dashboard rather than a form. It also naturally differentiates the view experience from the edit experience without feeling like the same layout with inputs swapped in.
- Follow-up: Apply bento grid layout to Preplanning summary and trip overview pages. Establish a shared pattern library for bento cell types.

### 2026-04-16 - UI scale inside dark bento cards is large by default

- Status: accepted
- Context: Initial implementation used small text sizes inside bento cells (10-11px labels, 12px pill text, small inputs) consistent with typical UI density. Against the dark card backgrounds and with the cells occupying significant screen real estate, this scale felt mismatched: cards with a lot of space and very small content. The Travelers "4" stat card made the problem obvious -- the number was large and impactful while adjacent pill cards felt like footnotes.
- Decision: All content inside dark bento cells is scaled up permanently. Hard minimums: cell labels 13px, form inputs 16px (text-base), pill text 14-15px, hint text 14px, sub-labels 12px. Stat numbers use clamp() to fill their cells responsively. Cell padding is always 24px (p-6). Pill padding is generous (10px/20px for transport, 8px/16px for type/vibe). These are floors, not targets -- go larger when the card has more room.
- Why: Dark cards occupy significant visual real estate. If the content inside them is small, the card reads as mostly empty background. Large content fills the card and makes every cell feel intentional. The scale also improves readability and touch target sizes at no cost.
- Follow-up: Apply these scale rules to all future bento-style pages. Do not introduce smaller scales for "compact" variants without explicit justification.

### 2026-04-16 - Page background is a radial gradient from white center to dark gray edges

- Status: accepted
- Context: The page background went through several iterations: flat #F5F7FA, light blue gradient, medium blue, medium gray. Each iteration was evaluated visually against the dark card surfaces.
- Decision: The authenticated app page background is a radial gradient centered on the viewport. Center is white or near-white. Edges fade to medium-dark gray (around #787878). This applies to all authenticated app pages. The gradient direction is always radial from center, not linear.
- Why: A radial gradient creates a natural focal center that draws the eye toward the content area. Dark cards on a light-center surface feel grounded and readable. The dark edges give the overall page depth without requiring decorative elements. Flat colors feel static by comparison.
- Follow-up: Adjust the gray depth as the overall UI evolves. The current stop values are #d4d4d4 center, #a8a8a8 midpoint, #787878 edge.

### 2026-04-16 - Work on master branch until foundation is complete

- Status: accepted
- Context: The project is in early foundation phase with structure, shell, and core primitives still being established.
- Decision: All work happens directly on the master branch until the foundation is complete. Foundation includes: app shell, navigation, auth scaffold, trip workspace skeleton, and core component primitives. Once the foundation is stable, individual features get their own branches.
- Why: Branching before a stable base creates fragile, conflict-prone branches that diverge from moving ground. A stable foundation first means feature branches start from something solid and merges stay clean.
- Follow-up: When foundation work is done, move to a branch-per-feature workflow. Each feature branch should map to a discrete backlog item.
