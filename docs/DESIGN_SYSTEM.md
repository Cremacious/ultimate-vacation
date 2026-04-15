# Design System Direction

This is not a final visual spec. It is the set of early design rules that keep the product coherent while we build.

## Design Goals

- retro-pop and electric without being a costume
- fun and functional in equal measure
- airy white base with bold color confidence
- circles and rounded forms as a recurring design language
- sassy in copy everywhere -- not just headlines

## Brand Slogan

**"Get everyone on the same wave."**

This is the official tagline. It lives near the logo, in marketing materials, and in onboarding. It speaks to the group coordination core of the product and ties directly to the TripWave name and ocean wave personality.

The primary marketing headline (used in the hero section) is separate from the slogan:

**"Plan the trip. Not the group chat."**

These two lines serve different purposes. The headline creates instant recognition of the pain. The slogan anchors the brand identity.

## Visual Thesis

Trip planning should feel like a vacation postcard from 1983 that got updated with a modern layout. Bold color, round shapes, white space, and an attitude that makes planning feel exciting instead of overwhelming. Inspired by the Go-Gos song Vacation -- upbeat, confident, a little cheeky, and ready to go.

## Aesthetic Rules

- white or very near-white is the base -- the color pops because of the white, not despite it
- circles are the primary decorative motif: decorative splashes, background dots, pill shapes, round avatars, circular indicators
- color is applied boldly and with intent -- not as background wash but as foreground energy
- layered surfaces add depth without clutter
- let big typography and strong color do the work -- do not over-detail

## Color Direction

### Primary palette

- **white / near-white** -- dominant background surface on all screens
- **cyan-blue** -- primary action color, the most used brand color (#00AADD range, vivid and clean)
- **hot yellow** -- energy accent, highlights, playful moments (#FFD600 range)
- **electric pink** -- secondary accent, celebration moments, fun details (#FF2D8B range)
- **deep charcoal / near-black** -- primary text and anchors
- **green** -- exclusive to financial and expense contexts (#00C96B range, clean and confident)
- **orange** -- allowed accent only, not a primary color

### Color use rules

- blue is the go-to for primary buttons, links, and key UI actions
- yellow is for highlights, badges, fun callouts, and celebratory moments
- pink is for secondary accents, invitation moments, and personality touches
- green is reserved entirely for money, expenses, and financial contexts -- nowhere else
- never use all accent colors in the same visual zone -- let one dominate per area
- the white base is intentional -- it makes the color feel like paint splatter, not noise

### Avoid

- default purple SaaS palettes
- sandy, tropical, or beachy styling
- flat monochrome surfaces with no color personality
- going so neon it becomes chaotic

## Action Circle Color Language

When users take meaningful actions, small colored circles animate into the trip ball. This is the action circle system -- it ties every user action back to the trip character and makes the ball feel like a living record of everything that happened.

### Color assignments

- **Green circles** -- expense logged or updated (financial actions)
- **Cyan-blue circles** -- itinerary item added or confirmed
- **Yellow circles** -- packing item checked off
- **Pink circles** -- participant joined the trip
- **Orange circles** -- travel day task completed

### Animation behavior

1. User takes an action (e.g., logs an expense)
2. A small circle of the corresponding color appears near the point of action
3. The circle travels to the trip ball and enters it with a satisfying merge
4. The trip ball responds with a brief ocean-wave pulse
5. The ball returns to its idle state, slightly more full or alive

This system makes the ball feel earned and turns every action into a small moment of delight.

### End-of-trip circle breakdown

At trip wrap-up and in the memory vault, the ball "opens" and all the accumulated circles expand outward in a visual breakdown. Each category of circles forms its own cluster:

- green cluster shows total expenses and financial summary
- blue cluster shows itinerary coverage
- yellow cluster shows packing completion
- pink cluster shows who was part of the trip
- orange cluster shows travel day execution

This is the most shareable visual the app produces. Design it to be screenshot-worthy.

## Typography Direction

### Fonts

- **Fredoka** -- display and headline font (Google Fonts, variable weight 300--700)
- **Nunito** -- UI and body font (Google Fonts, variable weight 200--900)

### Fredoka usage rules

- **Weight 600 (SemiBold)** -- app title, hero headlines, large display moments, trip names
- **Weight 400 (Regular)** -- smaller section headings, subheadings, phase labels
- Never use Fredoka below heading level -- Nunito owns all body and UI copy

### Nunito usage rules

- **Weight 700 (Bold)** -- UI labels, button text, emphasis
- **Weight 600 (SemiBold)** -- card titles, secondary labels
- **Weight 400 (Regular)** -- body copy, descriptions, paragraph text
- **Weight 300 (Light)** -- captions, helper text, timestamps

### General type rules

- let Fredoka do the personality work at large sizes
- keep Nunito clean and readable at small sizes
- compact uppercase labels are fine in Nunito for utility moments
- no decorative or script typefaces anywhere in the product

## Shape and Form Language

- circles and pill shapes are the primary recurring forms
- buttons are pill-shaped
- avatars and member indicators are always circular
- background decorative elements use circles and dots in various sizes and opacities
- sharp right angles should be rare -- almost everything should have rounding
- this is not a grid-of-squares app

## Icon System

### Library

Use **Phosphor Icons** (`@phosphor-icons/react`) -- it has a fill variant for every icon, consistent geometry, and works well at all sizes.

### Style rules

- use the **fill** weight for navigation icons, phase indicators, and primary UI icons
- use the **regular** (stroke) weight for inline content icons and secondary UI moments
- icons should always be bold and readable -- no fine-detail icons

### Icon containers

Icons live inside **solid colored circles** in the brand palette. This is the primary icon treatment across the app:

- each trip phase gets its own assigned circle color (to be defined per phase)
- navigation items use icon-in-circle treatment
- badges, status indicators, and member avatars are all circular
- the circle container size scales with context -- small in nav, larger in feature cards

### Phase color assignments (working, not final)

- Setup -- cyan-blue circle
- Preplanning -- cyan-blue circle
- Itinerary -- cyan-blue circle
- Packing -- yellow circle
- Travel Day -- pink circle
- Vacation Day -- cyan-blue circle
- Expenses -- green circle
- Polls -- yellow circle
- Wrap-Up -- pink circle

These are starting points. Finalize when building the nav.

## Background Circle System

Circles appear as passive background decoration across the app UI. They are never interactive -- they exist purely to reinforce the design language and add warmth to white surfaces.

### Three tiers of background circles

**Tier 1 -- Large atmospheric circles**
- Very large (300px--600px diameter or larger)
- Very low opacity (4%--10%)
- Positioned behind page sections, bleeding off screen edges
- Typical placement: top-right corner, bottom-left corner of a surface
- Colors: brand cyan, yellow, or pink depending on the page context

**Tier 2 -- Medium accent circles**
- Medium size (80px--200px diameter)
- Medium opacity (40%--70%)
- Partially cut off by screen edges -- never fully centered on screen
- Used in hero sections, onboarding screens, and empty states
- Add visual energy without competing with content

**Tier 3 -- Small dot patterns**
- Tiny dots (4px--8px)
- Arranged in scattered clusters or subtle grids
- Used in card backgrounds, section dividers, and quiet zones
- Low opacity (15%--30%)
- Provide texture without noise

### Circle placement rules

- circles sit behind all content -- never in front of readable text or interactive elements
- the white base must remain visually dominant -- circles add atmosphere, not chaos
- use a maximum of two or three circles per surface zone
- circles can overlap each other but not overlap primary content areas
- on app (non-marketing) surfaces, keep circles subtle -- tier 1 only, or light tier 2

## Surface Strategy

- hero and marketing surfaces can lean into the full color energy
- app surfaces are calmer but still carry the color palette clearly
- glass effects should be subtle and only used where they genuinely help
- shadows suggest depth without being heavy
- key panels feel stacked and tactile, not perfectly flat

## 3D Material Rules

- use bottom-edge ledges on important cards, panels, pills, and buttons
- 3D treatment feels like a crisp physical layer, not skeuomorphic plastic
- primary buttons have a visible darker bottom lip in the button own color
- important cards can use a shallow ledge plus shadow for dimensionality
- inputs stay cleaner than buttons with softer depth cues
- reserve the strongest 3D effect for primary actions and key surfaces

## Motion Direction

- soft entrance motion
- small hover lift on interactive surfaces
- phase transitions should feel smooth and directional
- action circles travel to the ball with a fluid arc -- not a straight line
- ball pulse is ocean wave rhythm -- slow, organic, never mechanical
- motion should help orientation, not distract from tasks

## Social Layer Visual Rules

The app has a lightweight social layer throughout: comments, likes, and favorites on most content items.

### Reactions and likes

- a simple heart or thumbs-up reaction is shown inline on items that support it
- reaction count is always visible
- tapping your own reaction toggles it off
- reactions animate with a brief pop -- small, satisfying, not overdone

### Comments

- comments appear below the item they belong to
- newest comments shown first in global views, oldest first in item detail view
- commenting supports plain text only -- no formatting in comments
- comment author, timestamp, and a like on the comment itself are shown
- long comment threads collapse with a "show more" control

### Favorites

- a bookmark or star icon appears on items that support favoriting
- favorites are personal -- not shared with the group
- a favorites list is accessible from the user account area and from within the trip
- favorited items are visually marked with the icon filled in
- good candidates for favoriting: itinerary events, wishlist items, notes posts

## Notification System Visual Rules

### In-app notifications

- a bell icon lives in the top nav on all versions (web and native app)
- unread count shown as a badge on the bell
- tapping opens a notification list panel or page
- notifications are grouped by trip when the user has multiple trips

### Notification list item anatomy

- trip name (if multi-trip context)
- actor name and action ("Sam commented on Museum Day")
- timestamp
- a tap navigates to the relevant item
- unread notifications have a subtle highlight; read ones are plain

### Push notifications (native app only)

- push notifications use the same triggers as in-app notifications
- web version has no push or email notifications for social actions
- Resend handles transactional email only: password reset and invite delivery

## Copy Direction

### Brand tone

- fun first
- sassy but never mean
- cheeky and confident
- capable and reassuring underneath the attitude
- a little bossy in a way that makes you laugh and then do the thing

### Copy rules

- sassy copy lives everywhere -- not just headlines but labels, tooltips, button text, empty states, and confirmation messages
- headlines can have big attitude
- product instructions must stay genuinely clear -- wit never beats clarity
- empty states should feel helpful and lightly witty, not just clever
- avoid trying too hard to sound funny -- the best lines feel effortless
- copy can gently roast disorganization, never the user
- the product should sound like the friend who already has the itinerary memorized and is still somehow fun to travel with
- example empty state energy: "Nothing packed yet. Your future self is disappointed but still rooting for you."
- example button energy: "Let's go." not "Submit"

### Hard grammar rules

- **Never use an em dash (--) anywhere in the app.** Not in UI copy, tooltips, notifications, error messages, empty states, button text, marketing copy, or documentation. Use a comma, a period, or rewrite the sentence. This rule has no exceptions.
- Use plain conversational language -- no corporate jargon
- Contractions are encouraged -- they feel human
- Sentence case for everything except brand proper nouns

## UX Rules

- show what matters now
- keep primary actions obvious
- reduce decision fatigue
- expose advanced features progressively
- make collaboration feel guided, not overwhelming
- keep organizer-owned controls visually separate from collaborative areas
- keep the join code highly visible in the trip shell
- the trip ball is always visible in the authenticated trip workspace
- action circle animations should never block the user from continuing their task
- notification badge should update in real time without a full page refresh

## Accessibility Principles

- maintain strong contrast even with translucent surfaces
- avoid using glass effects as a replacement for structure
- touch targets must be generous
- motion should remain subtle and tolerable -- provide a reduced motion option
- important checklist states should never depend on color alone
- action circle colors must be distinguishable without relying on color alone (use shape or label as backup)

## Mobile Considerations

The app will be built web-first and packaged for native app second. The native app UI layout is a direct copy of the web layout -- no separate design system for mobile.

- touch targets must be generously sized from day one -- do not design for mouse-only
- round shapes and pill buttons are naturally touch-friendly
- bottom-of-screen navigation should be considered for mobile even in web layouts
- the circle and pill motif works well on mobile without adaptation
- avoid hover-only states for critical information -- everything must work on touch

## Marketing Visual Rules

The marketing surfaces (landing page, pricing page) can lean into the full energy of the brand. The product surfaces are calmer but clearly the same system.

### Landing page structure

1. Hero -- trip ball animating, filling. Short punchy headline. One CTA.
2. The problem -- group trip chaos. Relatable. Short.
3. The journey -- full trip lifecycle shown as a visual arc with the ball rolling through it.
4. Feature highlights -- travel day mode, expense tracking, wishlist, countdown. Each with a short visual.
5. The memory vault moment -- emotional close. "Every trip tells a story."
6. Pricing -- simple. Free gets you going. Five dollars and you are set for life.
7. Final CTA.

### Marketing copy principles

- lead with the pain, not the features
- show the ball early -- it is the hook
- every feature headline should make someone say "yes, that is exactly my problem"
- the memory vault is the emotional anchor -- use it near the end to close
- the share link (read-only itinerary) is a free acquisition tool -- design the public view to carry TripWave branding clearly

## Design Decisions To Lock Soon

- premium lock visual language
- trip phase iconography (finalize color per phase)
- circle decoration density rules per surface type
- notification panel layout (inline panel vs full page)
- favorites list placement in the UI

## Approved Reference Direction

The current reference style is:

- white base with bold paint-pop color energy
- 1980s Go-Gos Vacation aesthetic -- upbeat, electric, a little cheeky
- circles and pill forms as the dominant shape language
- cyan-blue primary CTA, hot yellow highlights, electric pink accents, green for finance
- sassy copy everywhere in the product
- ledged 3D buttons and card bottoms
- calmer product UI than the marketing energy but still clearly the same brand
- **Fredoka 600** for large display, **Fredoka 400** for section headings
- **Nunito** across all UI, labels, and body copy
- Phosphor Icons (fill) in colored circle containers
- action circles animated into the trip ball on meaningful user actions
- slogan: "Get everyone on the same wave."
