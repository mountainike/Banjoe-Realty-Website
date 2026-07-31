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
3. Hero mobile layout was reworked (see gotcha note below, now resolved) but hasn't been
   visually confirmed on an actual phone yet — check that the pontoon boat/mountains still
   read well in the mobile `4/5` crop; that ratio was picked without being able to see the
   rendered result.

## Important technical gotcha, learned the hard way (resolved 2026-07-31)
`.hero-media`'s aspect-ratio and `.hero-media img`'s `height`/`top`/`object-position` values
are interdependent. If the container's aspect ratio exactly matches the photo's native aspect
ratio, there's zero vertical "slack," and increasing `height` above 100% silently starts
cropping the left/right edges instead of doing anything vertically — `object-position`'s
vertical value stops having any visible effect in that state. This is exactly what was
happening: `hero-pontoon-mountains.jpg` is 2400×1800px (exactly 4:3), and `.hero-media` was
set to `aspect-ratio: 16/12` (also 4:3) — a perfect match, zero slack.

**Fix applied:** widened the desktop container to `aspect-ratio: 16/9`, which restores real
vertical slack (~16.7%) purely from the ratio mismatch — no `top`/`height` buffer hack needed
anymore, so that fragile magic-number pairing was removed entirely. `js/parallax.js`'s
`maxOffsetPercent` was set to 12 (comfortably under the 16.7% available) and the parallax
effect is now skipped entirely below 700px width. Mobile gets its own, taller `4/5` ratio via
a `@media (max-width: 700px)` rule (short `16/9` crops on phone-width screens left almost no
room for the hero text), paired with a smaller `.hero-content` overlap (`-70px` vs desktop's
`-140px`).

General rule to keep in mind for any future hero-photo swap: keep the container's
`aspect-ratio` noticeably wider (i.e., a larger width/height ratio) than the photo's actual
native ratio if you want vertical `object-position`/parallax panning to keep working. If a
future photo isn't 4:3, recheck this math — the "noticeably wider" margin is what creates
the pan room, not any specific pixel buffer.

## Working style Bruce prefers
- Wants to review and understand changes, not just receive a finished result — appreciates
  explanations of *why* something works, not just the fix
- Prefers incremental, one-thing-at-a-time changes over large batch rewrites
- Photos should be compressed/optimized for web (resized, JPEG quality ~75-80) before being
  added to the repo — has cared about page load performance throughout this project
