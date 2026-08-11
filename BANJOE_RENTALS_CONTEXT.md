# Project context — Banjoe Rentals / The Enchanted Cottage

Summary of a long prior conversation on claude.ai, for continuity in a new chat or with
Claude Code. Covers structure, design decisions, what's built, what's still open, and
how Bruce likes to work.

## The big picture
- **Domain:** banjoerentals.com (registered via GoDaddy)
- **GitHub repo:** mountainike/Banjoe-Realty-Website (public)
- **Hosting:** GitHub Pages
- **This is the first of what may become multiple vacation rental properties.** A second
  property (downtown Asheville condo, currently under different management) may be added
  later — this is why the site is structured as a subfolder per property rather than a
  single flat site.

## Repo folder structure
```
Banjoe-Realty-Website/
├── index.html                  ← redirect page at the domain root, sends visitors
│                                   straight to /EnchantedCottage/index.html (both via
│                                   JS redirect and meta refresh, plus a visible fallback
│                                   link). Will eventually become a real multi-property
│                                   landing page if a second property is added.
└── EnchantedCottage/
    ├── index.html               ← main property page
    ├── photos.html              ← full photo gallery page (grid + lightbox)
    ├── house-manual.html        ← guest-only house manual (see below)
    ├── css/style.css            ← shared stylesheet for all pages
    ├── js/parallax.js           ← hero image scroll parallax
    ├── js/lightbox.js           ← builds photo grid/strip + lightbox from manifest.json
    └── assets/images/
        ├── manifest.json         ← single source of truth for the photo gallery
        ├── thumbs/                ← ~420px-wide compressed thumbnails, one per manifest entry
        └── (full-size photos, ~1400-2000px wide, filenames matching thumbs/)
```

## Design system
- **Colors:** deep lake-at-dusk navy `--dusk: #16232E`, lake teal `--lake: #2F6E71`,
  sunset amber accent `--amber: #E8934A`, warm cream body background `--parchment: #F7F1E6`
- **Fonts:** Fraunces (display/headlines), Work Sans (body text AND small labels/eyebrows
  — originally used IBM Plex Mono for labels, but Bruce didn't like the "typewriter" look,
  so `--font-mono` variable now just aliases to Work Sans; two-font system, not three)
- **Signature design concept:** built around the property's own described "signature
  moment" — watching the sunset over the lake from the pontoon boat

## The photo gallery system (manifest-driven, important to understand)
- **`manifest.json`** is a flat array of `{"file": "...", "caption": "..."}` objects
- Adding a photo = drop `filename.jpg` into `assets/images/`, drop a matching (same
  filename) compressed thumbnail into `assets/images/thumbs/`, add one manifest line
- `js/lightbox.js` fetches the manifest at page load and builds either a photo strip
  (homepage) or a full grid (photos.html) from it — same script handles both, detecting
  which container is present
- **Important:** this fetch-based approach does NOT work when testing via `file://`
  (opening the HTML file directly from disk) — browsers block that for security. Must
  test via a real local server (Bruce uses VS Code's "Live Server" extension) or the
  actual live site.
- Homepage shows a 2-row scrollable strip (arrow buttons + native swipe/scroll);
  photos.html shows the full grid. Both open the same lightbox on click, with
  keyboard/swipe navigation and image preloading for smooth prev/next.
- As of the last count, roughly 37 real photos in the gallery, still may be missing a
  couple of specific shots (e.g., pontoon boat & dock had been a gap, may be resolved —
  worth checking current manifest.json for any remaining placeholder-style gaps).

## OwnerRez integration
- Property ID: `3bce3f0622f9424a9de411a38b6d6bc5`
- Two widgets embedded on the homepage's booking section: a **Single Month Calendar**
  and a **Booking/Inquiry** form, calendar on top, form below
- **Important quirk:** OwnerRez's widget only renders real content on the registered
  production domain — on `localhost`/local testing it just shows an OwnerRez logo
  placeholder. Not a bug; expected.
- Each widget has its **own separate CSS customization field** in OwnerRez's own settings
  (Settings → Widgets → [widget] → Options → CSS) — a shared custom stylesheet was
  written to theme both to match the site's amber/navy palette. **Important lesson
  learned:** initially assumed the widget sat on a dark background and styled text
  light-on-dark; turned out via live inspection that the widget actually renders on a
  white card background, so text needed to be dark, not light. Exact selectors (like
  `.showingSummary`, `#navBar`, `.pager-or`) were found by inspecting the live widget's
  actual DOM directly, since guessing OwnerRez's internal class names repeatedly failed.

## The House Manual (`house-manual.html`)
- Deliberately **not linked from the main site nav**, and has `<meta name="robots"
  content="noindex, nofollow">` — kept out of search results and casual browsing;
  guests get the direct link after booking
- Sticky jump-to nav at top (Getting There, Check-in, Checkout, WiFi, Kitchen & Trash,
  Pontoon, Kayaks & Canoe, House Rules, Local Recommendations — Emergency/Contact was
  planned but removed since it never had real content)
- Two Vimeo videos embedded in "Getting There": a funicular ride-through, and a
  tram-controls/emergency-stop walkthrough
- Google Maps embed (key-free "Embed a map" version, not the API-key version) in the
  header showing the property address
- All sections have real, final content from Bruce (check-in/out procedures, WiFi
  credentials, detailed trash/recycling/bear-proofing instructions, pontoon boat
  reservation process with a boating safety course link, kayak/life-jacket details,
  house rules, and 10 local restaurant recommendations split into "by boat" vs "by car")

## Known technical gotchas worth remembering
1. **CSS padding shorthand bug pattern:** several sections had rules like
   `padding: 20px 0 64px;` combined with the element ALSO having a `.container` class
   that tries to set horizontal padding — the shorthand's `0` silently zeroed out the
   container's side padding due to equal specificity + later cascade order. Fixed
   site-wide by switching to explicit `padding-top`/`padding-bottom` only. Worth
   checking for this pattern again if new sections get added with similar shorthand.
2. **Hero image parallax/crop relationship:** `.hero-media`'s aspect-ratio and the
   image's `height`/`top`/`object-position` are interdependent. If the container's
   aspect ratio exactly matches the photo's native ratio, there's zero vertical "slack"
   and further `height` increases silently crop the sides instead of doing anything
   useful vertically. Current setup: `aspect-ratio: 16/11` (deliberately wider than the
   photo's ~4:3 native ratio) with `top: -5%` / `height: 110%` on the image, and the
   parallax JS's `maxOffsetPercent` set to `5` to match.
3. **File:// testing limitations** — both the manifest fetch (see above) and GitHub
   Pages' automatic folder→index.html behavior don't work when testing locally via
   `file://`. The site redirect page was changed to point at the explicit
   `EnchantedCottage/index.html` file rather than just the folder, specifically to
   avoid this.

## DNS / hosting notes
- GoDaddy DNS: 4 A records (GitHub Pages IPs) for the bare domain, 1 CNAME for `www`
- Had a real GoDaddy default "parked page" A/CNAME record conflict during setup — check
  for stray default records if DNS ever needs touching again
- Had a Chrome-specific "Secure DNS" (DNS-over-HTTPS) issue where Chrome kept resolving
  to a stale/wrong result even after normal DNS flushes — resolved by disabling Chrome's
  secure DNS setting temporarily

## How Bruce likes to work (carried over from the Acoustic Analytics project too)
- Wants to understand *why*, not just get a fixed result — appreciates explanations of
  root causes, especially for CSS/browser behavior
- Prefers incremental, verified changes over large batch rewrites
- Values direct acknowledgment when something goes wrong — respond well to "I made a
  mistake, here's what happened, here's the fix" rather than glossing over errors
- Tests via actual live site or a real local server, catches real bugs by inspecting
  live DOM/computed styles and screenshotting dev tools — comfortable doing this
  himself when asked
- Has Claude Code set up in VS Code as an alternative working method, plus GitHub
  Desktop for commits
- Photos should always be compressed/optimized for web (resized appropriately, JPEG
  quality ~70-80) before going in the repo — cares about page load performance
  throughout

## What might still be open (worth confirming at the start of the new chat)
- Any remaining photo gallery gaps (check current manifest.json)
- Whether the OwnerRez widget CSS theming is fully dialed in on the live site
- Whether a landing page at the domain root is needed yet (second property not live yet
  as of last discussion)
- General polish/content review now that most core pieces are built
