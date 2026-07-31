# Project context — The Enchanted Cottage (Banjoe-Realty-Website repo)

This file summarizes decisions and context from a prior planning conversation on claude.ai,
so Claude Code has the background without needing that chat history directly.

## What this project is
A direct-booking vacation rental site for The Enchanted Cottage, a lakefront cottage at
178 Mark Twain Dr., Lake Lure, NC 28746. Owned by Bruce (Banjoe Realty LLC). Bookings run
through OwnerRez. This is the first of two planned property sites (a second, for a downtown
Asheville condo currently under different management, may follow later — that one routes
booking inquiries to an external property manager rather than OwnerRez directly).

## Current file structure
```
index.html
css/style.css
js/carousel.js
js/parallax.js
assets/images/
  hero-pontoon-mountains.jpg   — hero photo
  porch-view-mountains.jpg     — carousel photo #2
```

## Design system (established, please keep consistent with any new work)
- **Palette:** deep lake-at-dusk navy (`--dusk: #16232E`), lake teal (`--lake: #2F6E71`),
  sunset amber accent (`--amber: #E8934A`), warm cream body background (`--parchment: #F7F1E6`)
- **Fonts:** Fraunces (display/headlines), Work Sans (body), IBM Plex Mono (small
  labels/data — quick-facts numbers, eyebrows)
- **Signature design concept:** the whole page is built around the property's own signature
  moment — watching the sunset over the lake from the pontoon boat, mentioned explicitly in
  the property's description text

## Property facts (for any content work)
- 10 guests · 4 bedrooms · 6 beds · 3 baths
- Bedrooms: 2 queen (main level), 2 queen (lower level), plus 2 twin beds in the lower-level
  living room (not a 5th bedroom — this was a real discrepancy on the original Airbnb listing
  that we corrected)
- Amenities: full list already in index.html, pulled from the real Airbnb listing
- Host bio, review category scores, house rules, safety info: all real data, already in the page

## Current status / what's done
- Hero section with real photo (not a placeholder), scroll parallax effect (`js/parallax.js`)
- Photo carousel (`js/carousel.js`) — fully functional (arrows, dots, swipe) but only 2 of 6
  slides have real photos; the rest are still placeholder icons with labels describing what
  photo should go there (exterior, kitchen, bedroom 1, etc.)
- Full amenities grid, bedroom breakdown table, house rules, safety section — all built with
  real content

## What's still pending
1. **OwnerRez Book Now widget** — there's a clearly-labeled placeholder block in the
   `.booking-band` section (`#book`) waiting for the real embed code. Bruce needs to generate
   this in OwnerRez (Settings → Widgets → Create Widget) and the embed snippet just needs to
   replace the placeholder div.
2. **Remaining carousel photos** — 4 of 6 slides still need real photos swapped in for the
   placeholder icons.
3. Any further hero/photo tuning — object-position and the hero-media aspect-ratio have a
   known interaction (see note below) worth understanding before adjusting further.

## Important technical gotcha, learned the hard way
`.hero-media`'s aspect-ratio and `.hero-media img`'s `height`/`top`/`object-position` values
are interdependent. If the container's aspect ratio exactly matches the photo's native aspect
ratio, there's zero vertical "slack," and increasing `height` above 100% silently starts
cropping the left/right edges instead of doing anything vertically — `object-position`'s
vertical value stops having any visible effect in that state. Keep the container noticeably
wider than the photo's native ratio if you want `object-position`/parallax adjustments to
keep working. The `maxOffsetPercent` value in `js/parallax.js` must stay within whatever
vertical slack the CSS buffer (`top`/`height`) actually provides, or the parallax could
theoretically reveal an edge at scroll extremes.

## Working style Bruce prefers
- Wants to review and understand changes, not just receive a finished result — appreciates
  explanations of *why* something works, not just the fix
- Prefers incremental, one-thing-at-a-time changes over large batch rewrites
- Photos should be compressed/optimized for web (resized, JPEG quality ~75-80) before being
  added to the repo — has cared about page load performance throughout this project
