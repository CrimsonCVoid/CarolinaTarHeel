# restaurant_v2 — Brewery / Multi-Location Restaurant Template

Flagship build for **Southern Peak Brewery** (Apex, NC). This is product unit #1 of the Restaurant template family. Every NC brewery, restaurant group, or multi-location food concept that signs after Southern Peak should ship on this template by configuring content, not by writing code.

## What v2 adds over restaurant_v1

| Capability | v1 | v2 |
|---|---|---|
| Locations | 1 (in site_settings) | 1–N (in page content) |
| Menu shape | name + description + price + tags | name + small/large prices + dietary tags + ingredients + beer pairing |
| Beer / tap list | — | full schema with style/ABV/IBU, served-at, flagship/on-tap flags |
| Events | — | upcoming + recurring + food-truck schedule |
| Pages | Home / Menu / About / Contact | Home / 2× Locations / Beer / Food / Events / About / Private Events / Careers / Contact |
| JSON-LD schema | none | Restaurant, LocalBusiness, Menu, MenuItem, Event, Organization, BreadcrumbList |

v1 stays untouched. Sites lock to a `template_id` per `BUILD.md` — switching v1 → v2 is a manual content migration script, not an in-place edit.

## Architecture rules (per BUILD.md, do not violate)

- Server components by default. No client JS unless absolutely required (filter UIs are the only legitimate exception in v2).
- < 150 KB JS gzipped per page. No new npm deps without justification — reuse `@tarheel/ui`, `lucide-react`, existing Tailwind preset.
- Lighthouse mobile gates: Perf ≥ 95, A11y = 100, BP ≥ 95, SEO ≥ 95.
- All images `next/image` with explicit `width`/`height` or `fill` + `sizes`.
- No CSS-in-JS, no animation libraries, no carousels.
- Self-hosted fonts via `next/font` only.

## Stack & conventions

- Tailwind v4 beta with the shared preset at `packages/config/tailwind-preset.ts` — brand colors are `brand-50`..`brand-950`, fonts are `font-display` (serif) and `font-sans`.
- `@tarheel/ui` provides `Container`, `Button`, `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `Badge`, `Input`, `Textarea`, `Label`, plus `cn`.
- `@tarheel/db` provides `Address`, `WeeklyHours`, `DayHours`, `SiteSettings`, `Brand`, `Contact`, `Social`, `SeoDefaults`.
- `optionalUrl()` and `optionalString()` from `../zod-helpers` — empty strings normalize to `undefined` so cleared editor fields don't fail validation.
- Page components are PascalCase exports in `pages/`. Each takes `{ content, settings }: PageRenderProps<TContent>`.
- Components fall back gracefully on missing data — partial drafts hit the editor preview path that bypasses validation.

## Source of truth: schema.ts

Every schema, every type, every editor field, every default-content seed, every page component, every shared component reads its types from `restaurant-v2/schema.ts`. **Never re-declare a type that's exported from there.** When in doubt, import.

## Southern Peak verified facts (use as defaults)

**Brand:** Southern Peak Brewery. Logo `SPB-Logo_GreenBox_500pi.png` is a green-on-white wordmark; primary brand color is its green — use `#3a7a3a` as a placeholder for now and tighten via the editor (`settings.brand.primary`). Fonts: pair Manrope (sans) + a serif display.

**Founders / team:**
- Ken Michalski — co-founder
- Nathan Poissant — co-founder
- Anthony Masino — chef-partner running the pizzeria kitchen at Sweetwater

**Location 1 — Sweetwater Taproom & Pizzeria** (`key: "sweetwater"`)
- 1451 Richardson Road, Suite 130, Apex, NC 27523
- Sweetwater Town Center
- Phone: 919-629-4015
- Hours: Mon–Thu 11:00–22:00, Fri 11:00–23:00, Sat 11:00–23:00, Sun 12:00–21:00
- hoursNote: "Food orders end one hour before close."
- features: kitchen, kid-friendly, patio, dog-friendly, parking, private-events
- toastOrderUrl: https://order.toasttab.com/online/southern-peak-brewery-2-1451-richardson-road-ste-130
- toastEgiftUrl: https://order.toasttab.com/egiftcards/southern-peak-brewery-2-1451-richardson-road-ste-130
- IG: https://www.instagram.com/southernpeaksweetwater/

**Location 2 — Original Brewery (Windy Road)** (`key: "windy-road"`)
- 950 Windy Road, Suite 100, Apex, NC 27502
- Phone: 919-629-4015 (verify in discovery — may be the same line)
- Hours: Mon–Thu 15:00–22:00, Fri 12:00–22:00, Sat 12:00–22:00, Sun 12:00–20:00
- features: food-trucks, patio, dog-friendly, parking
- No kitchen — food trucks rotate
- IG: https://www.instagram.com/southernpeakbrewery/

**Email:** info@southernpeakbrewery.com (both locations)
**Facebook:** https://www.facebook.com/Southern-Peak-Brewery-787473081321842

**Beer brands referenced in pizza menu (the brand voice is beer-pun-heavy):**
- Allora Italian Pilsner
- Boxcar Belle Amber Lager
- Midnight Conductor Baltic Porter
- One Mile Wheat Ale
- Tropiköl IPA

The on-tap list isn't published on the live site (it lives on Untappd or behind the bar) — for v2 default content, seed 6 plausible beers using these brand names; owner edits the real list at launch.

**Pizzeria menu (verbatim from live site, do not paraphrase prices):**

Peak Snacks: Allora Meatballs $12, Brewchos $11, Knotty by Nature $8, Peak Pizza Pretzel $10.50.

Peak Pockets: Cheesy Does It $12, Get Figgy With It $14, Stingeroni $13, Pesto My Heart $14.

Craft Peak Pies (small / large): Cheesy Quartet $13/$18, Porky Belle $16/$24, Playful Pig & Fig $16/$24, Pep In Your Step $15/$22, Tropiköl Firebird $16/$24, Garden of Eatin' $15/$22, Shroom & Bloom $15/$22, Spicy Soprano $16/$24, Smokey & The Basil $16/$24, Ultimate Carnivore $16/$24.

Build Your Own: Small (personal) $12, Large (feeds 2/3) $17. GF crust available SM only (+$3.50). Toppings $1.50 SM / $3 LG.

Toppings: pepperoni, italian sausage, bacon, meatball, prosciutto, caramelized onion, calabrian chili pepper, kalamata olive, mushroom, ricotta, roasted red pepper, pesto swirl, fig jam, arugula, gorgonzola, shaved parmesan.

Pizza descriptions are in the live HTML — see `Downloads/SouthernPeakBreweryLive/taproomandpizzeria.html` for verbatim copy. Use those exact words.

## Live-site bugs to NOT replicate

- Events button on current site links to a Facebook **admin** dashboard URL — broken for visitors. Replace with `/events`.
- Footer mixes the two locations' hours/addresses without labeling. Multi-location footer must label each.
- Two `<h1>`s on the same page ("Taproom" + "...and Pizzeria"). v2 uses one `<h1>` per page; visual stylization is via spans/decorations.
- Mojibake (`�` characters) from non-breaking-space encoding errors — write clean copy.
- No `Restaurant` / `Menu` / `LocalBusiness` schema — v2 must inject all three.

## Page → Component → Shared dependency map

| Page schema | Page component | New shared deps |
|---|---|---|
| `homeContent` | `RestaurantV2Home` | `LocationCardGrid`, `BeerCard` (or strip), `RichMenuItem` (preview card), `EventCard`, `JsonLd` (Organization+WebSite+breadcrumb) |
| `locationDetailContent` | `RestaurantV2LocationDetail` | `NAPBlock`, `BeerCard`, `RichMenuItem`, `OrderCTA`, `JsonLd` (Restaurant), existing `Hours`, existing `MapEmbed` |
| `beerPageContent` | `RestaurantV2Beer` | `BeerCard`, `JsonLd` (BreadcrumbList) |
| `foodPageContent` | `RestaurantV2Food` | `RichMenuItem`, `OrderCTA`, `StickyOrderBar` (mobile), `JsonLd` (Menu+MenuItem) |
| `eventsPageContent` | `RestaurantV2Events` | `EventCard`, `JsonLd` (Event[]) |
| `aboutPageContent` | `RestaurantV2About` | (existing only) |
| `privateEventsContent` | `RestaurantV2PrivateEvents` | (existing form) |
| `careersPageContent` | `RestaurantV2Careers` | (existing form) |
| `contactPageContent` | `RestaurantV2Contact` | `MultiLocationFooter` is rendered by the page wrapper, not here; this page has the form + per-location NAP |

Existing shared (do not modify): `Nav`, `Footer`, `Hours`, `MapEmbed`, `HeroCentered`, `HeroSplit`, `CTA`, `forms/contact-form`, `faq`, `social-links`.

v2-specific shared (new — this build creates them):
- `shared/v2/location-card.tsx` — `<LocationCard location={...} />` for the home grid + locations index
- `shared/v2/nap-block.tsx` — `<NAPBlock location variant="full|compact" />` (one source of truth for address/phone/hours, semantic `<address>`)
- `shared/v2/beer-card.tsx` — `<BeerCard beer />`
- `shared/v2/event-card.tsx` — `<EventCard event location? />`
- `shared/v2/menu-item-rich.tsx` — `<RichMenuItem item />` (handles small/large pricing, dietary tags, image)
- `shared/v2/order-cta.tsx` — `<OrderCTA toastUrl variant="primary|inline|hero" />` — link-out to Toast (Toast ToS bans iframe)
- `shared/v2/sticky-order-bar.tsx` — mobile sticky bar on `/food`; client component, minimal JS
- `shared/v2/multi-location-footer.tsx` — replaces v1 Footer when locations.length > 1
- `shared/v2/jsonld.tsx` — server component renders `<script type="application/ld+json">` for Restaurant, LocalBusiness, Menu, MenuItem, Event, Organization, BreadcrumbList

All v2-specific shared components live under `shared/v2/` to avoid naming collisions with v1's siblings and to make extraction into a future package trivial.

## Routing

`apps/site/app/[[...slug]]/page.tsx` already routes any slug into `renderTemplate(template_id, slug, content, settings)` via `template_page_key`. v2's `pages[]` array exposes:

| `slug` | `title` | `template_page_key` (= slug) |
|---|---|---|
| `/` | Home | `/` |
| `/locations/sweetwater` | Sweetwater | `/locations/sweetwater` |
| `/locations/windy-road` | Windy Road | `/locations/windy-road` |
| `/beer` | Beer | `/beer` |
| `/food` | Food | `/food` |
| `/events` | Events | `/events` |
| `/about` | About | `/about` |
| `/private-events` | Private Events | `/private-events` |
| `/careers` | Careers | `/careers` |
| `/contact` | Contact | `/contact` |

The two location pages share the `RestaurantV2LocationDetail` Component but are registered as separate `PageDefinition` entries with different `slug` and `defaultContent`. Sanity-check: editor stores them as two `pages` rows under the Southern Peak `site`, each editable independently.

## Toast integration rule

`<OrderCTA>` always renders `<a href={toastUrl} target="_blank" rel="noopener noreferrer">`. **No iframe, no modal, no popup that loads the page** — Toast's ToS prohibits embedding. Microcopy under primary buttons: "Continues on Toast in a new tab."

## Schema.org JSON-LD inventory

Server-rendered into the initial HTML, never client-side:
- Layout-level (every page): `Organization` + `WebSite` (with `SearchAction` pointing at site root, optional)
- `/`: + `Restaurant` (primary location) + `BreadcrumbList`
- `/locations/{key}`: `Restaurant` (with full location data, `servesCuisine`, `priceRange`, `acceptsReservations`, `hasMenu`, `openingHoursSpecification`)
- `/beer`: `BreadcrumbList`. Optionally `Product` for each beer if Phase 2 adds individual beer pages.
- `/food`: `Menu` containing `MenuSection` containing `MenuItem` for every dish. Prices as `MonetaryAmount` ranges where small/large.
- `/events`: `Event[]` for upcoming, `EventSeries` for recurring (e.g., Trivia Tuesday).
- `/about`, `/private-events`, `/careers`, `/contact`: `BreadcrumbList` only.

Validate with Google Rich Results Test before marking the page deliverable.

## Editor-meta rules

Every field in every Zod schema must have a corresponding entry in editor-meta with: `label`, `kind`, optional `help`, `placeholder`, `maxLength`, `required`, and for arrays a static `itemLabel` referring to a sibling field name. The hub editor reads this metadata across the RSC → client boundary, so `itemLabel` must be a string literal — not a function.

For beer/menu items, prefer `itemLabel: "name"`. For events, `itemLabel: "title"`. For team members, `itemLabel: "name"`. For locations array, `itemLabel: "shortName"`.

## What gets registered in `registry.ts`

Final integration step (done outside parallel agents):
- Import `restaurantV2` from `./restaurant-v2/index`
- Add `[restaurantV2.id]: restaurantV2` to the registry record
- Re-export from `./index`
- `restaurantV2.id === 'restaurant_v2'`
