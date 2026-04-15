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

### 2026-04-15 - Typography system locked: Fredoka + Nunito

- Status: accepted
- Context: Explored several font pairings including Syne + DM Sans, Bebas Neue + Nunito, Righteous + Poppins. User confirmed Nunito for UI/body and selected Fredoka as the headline font for its bubbly, rounded, 80s-adjacent personality.
- Decision: Fredoka (weight 600) for app title and large display. Fredoka (weight 400) for smaller section headings. Nunito across all UI labels, button text, and body copy.
- Why: Both fonts are rounded and geometric — they feel like the same design family. Fredoka brings personality and display presence. Nunito keeps the product UI clean, readable, and friendly. Together they reinforce the circle motif through their rounded letterforms.
- Follow-up: Set up both fonts via next/font/google during the build foundation phase.

### 2026-04-15 - Working prototype name is TripWave

- Status: accepted (temporary)
- Context: Exploring names. Jetsetta was recommended but not confirmed. TripWave was chosen as a working prototype name — it can be changed later before brand lock-in.
- Decision: Use TripWave as the working name throughout design and early build phases.
- Why: Keeps momentum without forcing a permanent naming decision before it is needed.
- Follow-up: Revisit final name before the marketing page is built or any domain/app-store registration happens.

### 2026-04-15 - App is a coordination tool, not a booking tool

- Status: accepted
- Context: There was potential ambiguity about whether the app would integrate with flight/hotel search or booking APIs.
- Decision: This app does not search for or book travel. It is a shared coordination and execution tool. Users bring their own plans; the app helps them organize, communicate, and execute together.
- Why: Keeps scope tight, avoids expensive third-party API dependencies, and focuses the product on its real differentiator — the group planning and travel-day execution experience.
- Follow-up: Make this clear in landing page copy from day one so users have accurate expectations.

### 2026-04-15 - 1980s Go-Gos aesthetic locked as the visual direction

- Status: accepted
- Context: The user provided a paint splatter reference image and referenced the Go-Gos song Vacation as the aesthetic inspiration.
- Decision: The app uses a 1980s-inspired visual direction: white base, bold circles as the primary shape motif, and cyan-blue, hot yellow, and electric pink as the three core accent colors. Energy comes from color and shape, not from retro typography or literal period styling.
- Why: Gives the product a strong, memorable, and differentiated visual identity that matches the fun sassy tone of the product.
- Follow-up: Lock font direction and finalize color tokens before building the component library.

### 2026-04-15 - Packing lists are private per user with a repack mode on return

- Status: accepted
- Context: Discussed how packing lists should work in a collaborative trip context.
- Decision: Each user manages their own private packing list. Lists are not visible to other trip members. On the return leg of the trip, the app surfaces the same packing list in reverse (repack mode) so users can verify they are bringing everything home.
- Why: Privacy avoids editing conflicts and keeps personal items personal. Repack mode is a genuinely useful feature that other planners do not offer.
- Follow-up: Design the repack mode UX alongside the initial packing list flow.

### 2026-04-15 - Travel days are manually designated, not auto-detected

- Status: accepted
- Context: Discussed how the app should know which days are travel days.
- Decision: Organizers (and participants) manually designate which dates are travel days and what type each is (departure, transit, return). A trip can have more than two travel days. The app does not infer travel days from dates alone.
- Why: Travel plans vary too much — a road trip with overnight stops has many travel days. Manual designation gives accurate control and avoids false assumptions.
- Follow-up: Build travel day designation into the trip setup and itinerary flows.

### 2026-04-15 - Use Better Auth for authentication and Resend for email

- Status: accepted
- Context: Auth provider and email service were previously undecided.
- Decision: Use Better Auth for authentication and Resend for transactional email (password reset, invites, etc.).
- Why: Both are modern, developer-friendly, and cost-efficient for an early-stage product.
- Follow-up: Document setup approach and environment variable strategy when backend work begins.

### 2026-04-15 - Build web-first, then iOS second (not Android first)

- Status: accepted
- Context: The earlier decision was to build web-first before mobile. The specific mobile target is now confirmed as iOS.
- Decision: After the web product is stable, the first mobile packaging will target iOS. Android may follow later.
- Why: iOS-first is a common strategy for early consumer apps due to user quality and willingness to pay. It keeps mobile scope tight for the first release.
- Follow-up: Ensure the web design uses touch-friendly targets and layout patterns from the beginning to minimize iOS adaptation work.

### 2026-04-11 - Charge the organizer rather than every participant

- Status: accepted
- Context: The product is centered around one person acting as the trip organizer and paying user, while other travelers join through invites.
- Decision: Premium access should be purchased by the organizer and apply to the trip workspace they own.
- Why: This matches the product mental model, keeps billing simple, and lowers friction for participant adoption.
- Follow-up: Revisit only if later collaboration complexity or team-style use cases justify a different model.
