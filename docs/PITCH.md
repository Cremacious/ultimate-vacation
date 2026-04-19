# Pitch -- TripWave in Layman's Terms

This doc explains TripWave the way you'd describe it to a friend at a bar. No product jargon, no marketing-speak. Just real talk about what it is, why it exists, and why anyone should care.

**Rule**: this doc is kept in sync with every other doc. Whenever a meaningful decision is made elsewhere (DECISIONS.md, UX_SPEC.md, MONETIZATION.md, DESIGN_SYSTEM.md), this pitch is updated too. If the pitch falls out of date, the product has drifted from what we meant to build.

---

## "So what kind of app ya buildin'?"

It's called TripWave. Basically, if you've ever tried to plan a trip with friends or family, you know how fast it turns into chaos -- seventeen group chats, four different spreadsheets, three people who never check Google Docs, one person asking "wait, what time are we leaving?" at 2am the night before. TripWave is one calm place where everyone in the group can see the plan, chip in, and stop being disorganized.

One line version: **"Plan the trip. Not the group chat."**

Slightly longer: you make a trip, you invite your people, and then all of you build out the itinerary, the packing list, the expenses, the reservations -- together, in one place. Every trip gets a little ball icon that fills up like a progress bar as you plan. It's cute. It matters more than you'd think.

---

## "Why does the world need another trip app?"

Fair question. Most trip apps are either super pretty and useless (Instagram for travel), or super functional and boring (business-travel spreadsheet tools). There isn't a good one for **group trips** -- the kind where everyone's chiming in, someone's paying for stuff on behalf of the group, and nobody knows when the flight lands.

Existing apps don't really solve the "everyone in the group needs the same info" problem. TripWave does. That's the whole pitch.

---

## "What do you actually do with it?"

Here's a rough walkthrough of what a user does with TripWave:

1. **Sign up** (free). Name, email, password. No credit card, no phone number.
2. **Create a trip**. Give it a name. Optionally add dates. Pick a color for your "trip ball" -- that little progress orb is the app's mascot and signature visual.
3. **Invite your people**. Share a link, code, or QR code. When they join, they're part of the trip.
4. **Preplan together**. There's a wizard that walks you through the basics: who's coming, how you're getting there, where you're staying, what's the budget, what's the vibe. You can skip stuff or come back to it -- there's no order forced on you.
5. **Build the itinerary**. Day by day. Activities, meals, reservations, flights. Anyone in the group can add stuff (the organizer can control who can do what).
6. **Log expenses as you go**. Who paid, how to split it. The app shows who owes who. You settle up outside the app (Venmo, cash, whatever).
7. **Use "Travel Day" mode**. On the actual day you're flying / driving, the app switches into a focus mode -- big checkboxes, calm layout, one task at a time. Pre-departure → airport → on the plane → arrival.
8. **Use "Vacation Day" mode while you're there**. Morning briefing card, today's schedule, quick expense logging, group activity feed.
9. **Wrap up with the "Memory" page**. When the trip ends, TripWave auto-generates a recap -- stats, highlights, photos (text-based for now), unresolved expenses to settle. Shareable.

There's also a **Dream Mode** -- for trips you want to imagine but aren't actually planning yet. Share them publicly, friends can react and comment, very "omg wouldn't this be fun?" energy.

---

## "What makes it different?"

A few things:

- **The trip ball**. It's a little animated orb that fills up as your planning progresses. Every trip gets one. You pick its color. It glows, ripples, nods when you do things right. It sounds silly, but making the trip have a *character* -- something cute that you're taking care of -- is weirdly motivating.
- **Group-first**. Most trip apps are solo-first with sharing bolted on. TripWave assumes you're planning with others from minute one.
- **Travel Day mode is a real feature**. Most apps let you plan the trip but bail on you during the actual travel day. TripWave's focus mode is designed for the stressed, sleep-deprived moments at the airport.
- **Dream Mode**. Lets you make aspirational fantasy trips you can share publicly. Pinterest meets travel planner. Great for sending to your best friend with "we should DO this."
- **The vibe**. Dark backgrounds with neon rainbow accents. Wet-paint glossy. Fluid water-like motion throughout. Ocean-ripple logo. The whole thing feels like a calm wave, not a busy spreadsheet. The name is literal -- TripWave is supposed to move like a wave.
- **Honest solo-dev pricing**. Free forever with ads. Want ads off and a few bonus features? $7.99 one-time purchase, no subscriptions, no renewals. Built by one person. There's a little ♥ in the app to acknowledge that.

---

## "How does it make money?"

Three ways, in descending order of importance:

1. **Affiliate commissions** when users book flights, hotels, or tours through the app's search tools (Booking.com, Skyscanner, etc.). No extra cost to the user. This is the biggest revenue stream at scale.
2. **Premium purchases** -- $7.99 one-time unlocks no ads, offline mode, receipt scanning, currency converter, unlimited dream trips, and a few other bonuses. Framed as a thank-you for supporting the solo dev, not as unlocking features you can't live without.
3. **Ads** -- banner at the bottom of some pages for free users, plus occasional native card ads in long lists. They disappear for premium supporters. Ads suppressed during stressful moments (travel day focus mode, expense entry, the creation flow).

The 5-year target is 50,000 premium sales. That plus affiliate income and ads should net around $730k-$900k lifetime, which is a real solo-dev business.

---

## "What's the plan to get users?"

No marketing budget. The plan is:

- **Viral invite loop**. Every user who invites others is bringing new potential users in. Free users earn bonus trip slots when their invitees start their own trips.
- **Dream Mode sharing**. Public dream trips shared on text / Instagram / TikTok are little marketing assets. "Omg wouldn't this be fun?" is the whole acquisition strategy.
- **Build in public**. Post honest progress updates on one social platform (likely TikTok or Threads) for 6 months before launch.
- **Waitlist**. Classic landing page with email capture, shared on Reddit and Product Hunt.
- **One niche community**. Deep genuine participation in one travel subreddit or Discord for 6+ months before mentioning the app.
- **App Store optimization**. Story-arc screenshots, "Get everyone on the same wave" as the subtitle, the slogan doing the talking.

Total pre-launch marketing effort: about 6-7 hours per week of the dev's time. Zero money.

---

## "What's the vibe of the app?"

- Dark backgrounds (near-black with a cool tint), pure white text, neon rainbow accents
- Motion is slow, liquid, organic -- like oil or water moving
- Everything ripples when you tap it
- The trip ball is always somewhere on screen, breathing slowly
- Copy is warm, slightly sassy, honest, never corporate
- Solo-dev ♥ moments appear in three specific places (premium purchase sheet, affiliate disclosure, account About section) -- never tacky, never guilt-trippy

---

## "What does it NOT do?"

TripWave deliberately avoids:

- Being a social network or travel content platform
- Hosting user photos (text-first product; photos come later if at all)
- Sending marketing emails or newsletters
- Asking for a phone number
- Subscriptions of any kind
- Corporate pricing language or upgrade funnels
- Pushing notifications about app news / features / upsells
- Being a travel booking platform (we link out to partners instead)

---

## "When's it shipping?"

Web app first. Private beta with 50-150 users 6 months before public launch. Founder's pricing ($4.99 one-time) for the first 1,000 public buyers, then standard $7.99 forever.

Native iOS and Android apps come after the web version proves the model works.

---

## "Okay, but what's the vibe in one sentence?"

TripWave is the calm, slightly sassy, neon-on-dark trip planner that moves like a wave and makes group vacation planning feel less like a chore and more like a group project you actually want to do.
