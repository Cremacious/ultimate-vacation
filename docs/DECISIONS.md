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
- Why: Ad revenue is expected to cover Vercel + Neon infrastructure costs. Premium is pure upside. Ads should be placed in low-interruption locations (not during travel-day execution or active expense entry).
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
- Follow-up: TripWave has no image hosting requirement — user data is primarily text, keeping storage costs minimal. Stripe or equivalent still needed for processing the one-time $5 premium payment.

### 2026-04-15 - Build features without paid third-party APIs where possible

- Status: accepted
- Context: The business model requires low operating costs to be profitable on ad revenue alone.
- Decision: Prefer building features with self-contained logic, free data sources, or open APIs rather than paid API subscriptions.
- Why: Keeps operating costs predictable and under control. Exceptions are Azure (receipt scanning, premium-gated) and payment processing for premium.
- Follow-up: Currency converter should use a free or self-managed exchange rate source. Smart suggestions should use deterministic rules before any AI inference costs.

### 2026-04-15 - The Trip Ball as core visual identity

- Status: accepted
- Context: The product needs a distinctive visual element that represents trip health and reinforces the TripWave brand identity.
- Decision: A circular "ball" character serves as the persistent visual representation of each trip. It fills from the center outward as preplanning is completed. It "rolls" between phases as the trip progresses. Users can recolor it. It has subtle personality through micro-animations rather than a cartoon face.
- Why: Gives the app a recognizable visual identity, makes trip health tangible and fun to watch grow, and fits the ocean wave personality of the TripWave brand. The rolling motion connects to the "wave" metaphor. The fill connects to readiness and progress.
- Follow-up: Design the ball's animation states for each lifecycle phase. Define how the subtle face is implied (eye-like shadows, expressive curves) without becoming cartoonish. Define pulse animation rules — ocean wave rhythm, not electronic bounce.

### 2026-04-15 - Granular per-user permissions within a trip

- Status: accepted
- Context: Previous model assumed simple organizer vs participant roles.
- Decision: Organizers can set per-user permissions at trip creation (simple defaults) and adjust them in full trip settings at any time. The trip settings screen allows clicking a user and toggling individual capabilities on or off.
- Why: Different trips have different group dynamics. Some organizers want full collaborative freedom; others want tighter control. Custom per-user toggles accommodate both without inventing a complex role hierarchy.
- Follow-up: Trip creation form should surface simplified permission presets with a note pointing users to the full settings for customization.

### 2026-04-15 - Packing lists are personal by default with optional sharing

- Status: accepted
- Context: Packing is often personal. Some items are private.
- Decision: Packing lists are personal by default. Users can optionally make their list visible to the group. Individual items within any list can be marked private, hiding them from all other users including the organizer.
- Why: Respects personal packing habits. Eliminates awkward moments where users need to pack personal or embarrassing items without announcing them.
- Follow-up: UI should make the private item toggle quick and non-judgmental.

### 2026-04-15 - Expense tracking begins at day 0 (preplanning)

- Status: accepted
- Context: Pre-trip costs like flights, hotels, and tickets are real trip expenses.
- Decision: Expense logging is available starting in the preplanning phase. Users can enter flight costs, hotel bookings, and other pre-trip payments as part of setup. Expenses continue throughout the trip and are summarized at wrap-up from day 0 through return.
- Why: The true cost of a trip starts the moment you book. Tracking from the start gives users a complete financial picture.
- Follow-up: Certain expenses entered during preplanning (flights, hotels) should link to the corresponding planning fields so data is not duplicated unnecessarily.

### 2026-04-15 - Smart suggestions are vibe-aware

- Status: accepted
- Context: Trip type and vibe affect what the app should suggest.
- Decision: Planning suggestions, packing recommendations, and itinerary ideas should factor in the trip vibe (beach, city, adventure, road trip, family, romantic, etc.) as well as destination and group composition.
- Why: Generic suggestions feel unhelpful. Vibe-aware suggestions feel like a smart travel friend who actually understands the trip.
- Follow-up: Start with deterministic rule-based suggestions tied to vibe and destination type before considering any AI-driven inference.
