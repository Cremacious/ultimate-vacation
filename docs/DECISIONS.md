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

### 2026-04-16 - Travel day UI is a vertical timeline with sequential task completion

- Status: accepted
- Context: Travel days are high-stress and time-sensitive. Users need a focused interface that shows exactly what to do next and keeps them moving forward without decision fatigue.
- Decision: Travel day pages show a single vertical timeline. Tasks are listed in chronological order from top to bottom -- wake up, eat breakfast, double check you have your tickets, turn off all appliances and electronics, leave the house, arrive at the airport, and so on. As the user checks off each task, the view auto-scrolls with a smooth animation to bring the next incomplete task into focus near the top of the screen. Completed tasks remain visible but visually de-emphasized. Users can customize the task list for each travel day, both during the planning phase and on the day itself.
- Why: A sequential vertical timeline with auto-scroll eliminates all uncertainty on departure day. The user never has to wonder what comes next -- the app moves them forward automatically. The format is mobile-first by nature since users will be on their phones while physically moving through the day.
- Follow-up: Define default task presets per transport mode (flight, drive, train). Define auto-scroll animation timing and easing. Allow task customization: add, remove, reorder, and rename tasks. Same timeline UI applies to vacation days with a different default task structure.

### 2026-04-16 - Work on master branch until foundation is complete

- Status: accepted
- Context: The project is in early foundation phase with structure, shell, and core primitives still being established.
- Decision: All work happens directly on the master branch until the foundation is complete. Foundation includes: app shell, navigation, auth scaffold, trip workspace skeleton, and core component primitives. Once the foundation is stable, individual features get their own branches.
- Why: Branching before a stable base creates fragile, conflict-prone branches that diverge from moving ground. A stable foundation first means feature branches start from something solid and merges stay clean.
- Follow-up: When foundation work is done, move to a branch-per-feature workflow. Each feature branch should map to a discrete backlog item.
