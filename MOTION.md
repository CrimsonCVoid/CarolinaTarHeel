# Tar Heel Web Co. — UI/UX Motion & Feel Specification

> Third doc in the trilogy alongside `BUILD.md` (engineering constraints) and a future `DESIGN.md` (visual identity). This document governs how the product *feels* in time — animation, transitions, micro-interactions, the rhythm of using it. The spec was written with a different working name ("Carolina Site Co" / "Longleaf") and a Pine/Sand/Stone palette. Implementation maps onto our existing **brand** palette and **Tar Heel Web Co.** name without changing the philosophy.

---

## 0. THE GOVERNING PRINCIPLE

Every motion decision answers one question: **does this make the product feel more capable, or just more decorated?**

Decoration is what Wix/Duda/Squarespace ship — generic Lottie loops, scroll-triggered reveal cascades, parallax tilts that exist for their own sake. We do the opposite: motion that's almost invisible until you notice it, and once you notice it, you can't ignore how much better the product feels than its competitors.

Three rules govern everything below:

1. **Motion has a job.** It either communicates state change, reveals hierarchy, gives feedback, or signals capability. Decoration is forbidden.
2. **Motion respects the system.** Same easing curves, same durations, same physics across the entire product.
3. **Motion respects the user.** `prefers-reduced-motion` disables every non-essential animation. Performance never sacrificed for polish — if a motion costs frame budget, it gets simpler or it dies.

---

## 1. THE MOTION SPLIT

| Surface | Budget | Allowed | Forbidden |
|---|---|---|---|
| **Hub marketing pages** | High | Scroll-driven canvas effects, choreographed reveals, interactive demos, motion graphics | Auto-playing video w/ audio, anything >100ms to first paint |
| **Hub portal/editor** | Medium | Page transitions, optimistic UI, drag physics, drawer/modal motion, micro-feedback | Decorative scroll effects, ambient loops, anything that delays interaction |
| **Client public sites** | Low | One-shot reveals on viewport entry, hover transitions ≤200ms, accordion expansion, image lazy-fade | Animation libraries, scroll-jacking, parallax, infinite loops |

The hub flexes. The clients stay disciplined. Same brand, different jobs.

---

## 2. THE MOTION VOCABULARY

### 2.1 Easing curves

```css
--ease-out-quint:    cubic-bezier(0.22, 1, 0.36, 1);     /* 90% of motion */
--ease-out-back:     cubic-bezier(0.34, 1.4, 0.64, 1);   /* celebrations only */
--ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);     /* page transitions */
--ease-out-expo:     cubic-bezier(0.16, 1, 0.3, 1);      /* hero entrances */
```

No ease-in-only curves. Linear easing only on indeterminate progress.

### 2.2 Duration scale

```css
--dur-instant:    80ms;    /* color, opacity */
--dur-fast:      160ms;   /* hover, focus, toggles */
--dur-base:      240ms;   /* default */
--dur-medium:    400ms;   /* drawer, modal, section reveal */
--dur-slow:      640ms;   /* hero entrance */
--dur-deliberate: 1000ms; /* once-per-session moments */
```

Mobile clamps to 80%. Anything over `deliberate` is wrong.

### 2.3 Stagger

```css
--stagger-tight: 40ms;    /* dense lists */
--stagger-base:  60ms;    /* card grids */
--stagger-loose: 100ms;   /* sectioned reveals */
```

Cap total stagger at 600ms.

### 2.4 Transform vocabulary

```css
--motion-rise:        translateY(12px);   /* default entrance */
--motion-rise-large:  translateY(24px);   /* hero entrance */
--motion-scale-press: scale(0.97);        /* button press */
--motion-scale-hover: scale(1.02);        /* card hover lift */
```

No translateX entrances. No rotation on entrance. Never animate from off-screen distances >40px.

---

## 3. HUB MARKETING — choreography highlights

**Hero — "the 8-second proof."** Word-by-word headline reveal (40ms stagger, ease-out-expo). Subhead at +200ms. CTAs at +400ms. Right side shows a browser-chrome mockup self-rendering. Background canvas starts immediately on a separate render path. Worth 15-20 hrs to nail. *Deferred until the marketing site is the focus.*

**Background canvas.** Either: (A) generative grain field via single fragment shader (~50 lines GLSL, half-res, blur(1px) upscale, ~12 KB) or (B) topographic line field via Canvas2D. Pick A by default. *Deferred.*

**Side-by-side performance comparison** — the moment that justifies the price point. Shows a typical SMB site loading in 8s with skeleton boxes and FOUT, vs. ours loading in 0.8s. ~3 KB JS controller. *Deferred.*

**Section entrance pattern.** Intersection Observer, one-shot, disconnects after first trigger:
- t=0: section opacity 0, children opacity 0, translateY(24px)
- t=0–200ms: section opacity → 1
- t=80ms+: children stagger in, 60ms each, --motion-rise, 600ms ease-out-expo

**No parallax. Anywhere.**

**Pricing tier hover.** Resting: flat, 1px Stone 200 border. Hover: border → brand, lift 4px, price scales 1.02 with 80ms delay. **Standard tier "ring breath"** — border opacity oscillates 100 ↔ 70% on a 4-second cycle. Stops on hover. The only continuous animation on the marketing site.

**Portfolio case study transitions.** View Transitions API, shared element, 480ms. Firefox falls back to fade.

**Nav scrolled state.** Background fades transparent → bg-white with backdrop-blur(12px) at scroll>40px. No "logo shrink."

---

## 4. PORTAL & EDITOR — micro-interactions

### 4.1 Page transitions

View Transitions for portal nav. Sidebar persists. Main content fades + --motion-rise.

### 4.2 Autosave indicator (the most important micro-interaction)

| State | Visual |
|---|---|
| Editing | brand 6px dot, opacity pulses 0.4 → 1.0 → 0.4 over 2s |
| Saving | dot transitions to brand-700, ring grows around it. Text: "Saving…" |
| Saved | dot transitions to emerald, checkmark draws via stroke-dasharray (200ms). Text: "Saved · just now" → "30s ago" → "1m ago" |
| Error | dot → red, gentle horizontal shake 240ms. Text: "Couldn't save · Retry" |

State transitions are 200ms cross-fades. Even the error shake is gentle.

### 4.3 Form fields

- **Text:** focus ring grows 0 → 2px brand over 160ms, 2px offset. Background warms white → bg-50 over 160ms.
- **Validation error:** ring → red over 200ms; helper text fades + 4px rise at +80ms.
- **Image drop zone:** dashed border → solid brand, fill brand-100, scale 1.02. All 160ms.

### 4.4 Drag-and-drop in array fields

Pickup: lift 4px, soft shadow, scale 1.02 (160ms ease-out-back). Drag: spring physics (~stiffness 400, damping 30). Hover drop: other items shift via FLIP. Drop: ease-spring snap with overshoot, 320ms.

This is the one place Framer Motion is allowed in the portal. *Deferred: current array editing uses up/down chevron buttons; drag is a future polish.*

### 4.5 Publish flow

1. Button press → confirm modal with diff summary
2. Modal → progress card: ✓ Saving · ⟳ Updating live · ⟳ Verifying
3. Each spinner becomes a checkmark
4. Success: modal collapses to bottom-right toast, 12-dot confetti burst (brand + emerald + amber, drift up 80px, fade out, 800ms total)

Confetti only fires for **publish**, never save/draft. Reserved as a celebratory moment.

### 4.6 Empty states

Quietly delightful. SVG line-drawing illustrations in brand-700 that draw in via stroke-dasharray on first viewport entry. Permanent state after. No loops except the mailbox flag (raises every 8s for 200ms) on the empty form-submissions state.

### 4.7 Loading

- **Page-level:** 2px brand top progress bar, indeterminate growth pattern (30% in 200ms, 80% in 1200ms ease-out-quint, 100% on resolve, fade out 200ms).
- **Skeleton:** linear gradient sweep in slate-100 → slate-200 → slate-100 over 1.5s.
- **Button:** opacity 50%, spinner appears beside text, no text change. Success: spinner → checkmark morph (200ms).

---

## 5. CLIENT TEMPLATES — restraint

### Allowed
- One-shot fade + 8–12px rise on viewport entry
- Image blur-to-sharp lazy fade (400ms)
- Hover ≥1024px only: button bg shift, link underline grow, card border-color shift OR 2px lift (pick one)
- Form field focus ring (160ms)
- FAQ accordion height transition (280ms ease-in-out-cubic)
- Mobile menu slide-in (300ms)

### Forbidden
- Framer Motion / GSAP / Lenis / AOS / Lottie — any animation library
- Continuous loops of any kind (no pulsing CTAs, no hero carousels)
- Parallax, even subtle
- Scroll-triggered cascades (single per-section reveal only)
- View Transitions between pages (breaks back-button)

### Single Premium-tier exception
For Premium ($2,750 / $129/mo) clients only, ONE additional motion element per template approved per-client (slow ken-burns hero, subtle steam over food photo, drifting light-leak gradient). Pure CSS, ~3 KB max, disabled by `prefers-reduced-motion`.

---

## 6. MOTION GRAPHICS — where they live

- Hub homepage hero canvas (§3) — generative shader background. *Deferred.*
- Side-by-side performance comparison (§3) — the showpiece. *Deferred.*
- Portfolio case study covers — pre-recorded 2s WebP loops (~200KB) on hover only.
- "How it works" — five-step SVG line drawings, stroke-dasharray reveal staggered, permanent after. *Deferred until commissioned art exists.*

**Never appear in:** the editor, client sites, emails, dashboard above-the-fold.

---

## 7. FEEDBACK — the invisible layer

**Click feedback (every clickable element):**
- Buttons: scale(0.97) for 80ms, return ease-out-back over 240ms
- Links: underline thickens 80ms
- Cards: 1px border shift 80ms
- Toggles: state change ease-out-back 240ms

**Haptics (mobile):**
- Publish success: 12ms tap
- Validation error: 20ms tap
- Destructive confirm: 8ms × 2 with 60ms gap

`navigator.vibrate()` only. `prefers-reduced-motion` disables.

**Audio:** none. Web audio is a mistake.

**Scroll progress bar.** 1px brand bar at bottom of nav fills as you scroll. Resets at section boundaries on the homepage. ~12 lines.

---

## 8. PERFORMANCE BUDGETS

### Hub
| Metric | Target | Hard limit |
|---|---|---|
| Animation JS | 30 KB | 50 KB |
| FCP | <1.0s | 1.5s |
| LCP | <1.5s | 2.0s |
| CLS | 0 | 0.05 |
| TBT | <50ms | 100ms |
| INP | <100ms | 200ms |

### Client sites
| Metric | Target | Hard limit |
|---|---|---|
| Animation JS | 0 KB | 5 KB |
| FCP | <0.6s | 1.0s |
| LCP | <1.0s | 1.5s |
| CLS | 0 | 0.02 |
| TBT | <30ms | 80ms |
| INP | <50ms | 150ms |

### Frame budget
60fps on a Moto G4 / 4G. Max 8ms per frame on main thread. transform + opacity only — never top/left/width/height. `will-change` declared sparingly, removed after.

---

## 9. ACCESSIBILITY

- Reduced motion test on every animation before ship.
- Vestibular review on big motions before ship (real human, not a checklist).
- Slow device test (4-year-old Android).
- 6× CPU throttle in DevTools.

Hub footer carries a "Reduce motion on this site" toggle that persists in localStorage — courtesy, not legal requirement.

No animation flashes >3×/sec. No animation blocks input. Focus states appear instantly, fade out 160ms on blur.

---

## 10. THE SIGNATURE

**Trait 1: "Almost too subtle."** A 240ms fade, 8px rise, 1px border shift. Users think "high quality," not "that animated nicely."

**Trait 2: "Earned moments."** Big motion is rare. Publish confetti once per session. Hero canvas the only ambient effect. Restraint creates anticipation.

**Trait 3: "Confident timing."** `--ease-out-quint` is the workhorse. Things accelerate gently and finish gently. Nothing snaps.

The cumulative effect: a product that feels *considered*. Like furniture from a small shop versus IKEA.

---

## 11. STACK

### Hub
- `framer-motion` ^11 (lazy-loaded only on routes needing drag)
- `tailwindcss-animate` ^1
- **Forbidden:** GSAP, Lottie, @motionone/react, react-spring

### Client templates
Nothing. CSS transitions, CSS keyframes, ~500-byte IntersectionObserver utility. Anything more is forbidden.

### Custom utilities

`packages/ui/src/motion/`
- `tokens.css` — CSS variables for durations / easings / transforms
- `reduced-motion.css` — global reset
- `useReveal.ts` — IntersectionObserver hook (one-shot)
- `useViewTransition.ts` — wrapper around View Transitions API

`apps/hub/components/motion/`
- `HeroCanvas.tsx` — *deferred*
- `PerformanceComparison.tsx` — *deferred*
- `RevealSection.tsx` — section entrance
- `PublishCelebration.tsx` — confetti + toast
- `AutosaveIndicator.tsx` — editor's autosave dot

---

## 12. THE FIVE-QUESTION TEST

Before adding any animation:

1. What state change does this communicate? If none → kill.
2. Does it use the standard durations + easings? New curve = wrong.
3. Does it cost frame budget? Can't hold 60fps on a Moto G4 → simplify or kill.
4. Does it work with `prefers-reduced-motion`?
5. Would the absence make the product feel broken? If no → decoration. Kill.

Most fail. The ones that survive are the ones worth shipping.
