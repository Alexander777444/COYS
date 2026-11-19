# Design system (single source for UI styling)

Source: "LaunchDarkly" style from styles.refero.design (raw copy in `design-reference.md`; read it only
if this file lacks a detail). It is a **style reference, not a component library**: we implement it with
plain CSS + CSS Modules and the tokens in `client/src/styles/tokens.css`. No UI kit dependency.

Mood: a dark "control room" — charcoal canvas, white type, one violet-blue accent, pill-soft shapes,
glow instead of shadows.

## Two surfaces, one system

| Interface | Surface | Why |
|---|---|---|
| **Public site** (`/`) | Dark marketing skin: canvas `#0e0e0e`, panels `#191919`, white text | The brand's marketing look |
| **Admin console** (`/admin`) | Dark shell + nav pill, content inside **bright white workspace panels** (`--surface-workspace`) | The style's own rule: the "real product UI" is always bright on the dark page. Tables and forms are also easier to read on white |

## Corrections to the provided files (do not copy the originals blindly)

| Problem in the originals | Decision |
|---|---|
| `--surface-midnight-canvas: #0e0e0` (invalid, 5 digits) | `#0e0e0e` (`--surface-canvas`) |
| `--section-gap: 80-120px`, `--card-padding`, `--element-gap` (invalid CSS ranges) | `clamp(...)` values |
| Fonts named `bodyFont`, `monoFont`, `headingFont1`, `Sohne` (placeholders / licensed font) | Inter (variable) + JetBrains Mono, self-hosted with `@fontsource` — both are the substitutes the reference itself lists |
| Primary button: Voltage Blue in the components section, `#191919` in the prompt guide | **Voltage Blue `#405bff` with white text** (5.05:1). `#191919` is only for neutral buttons |
| "No extra accent colors (no red)" vs. our need to show errors and destructive actions | One documented exception: `--color-danger` (dark) / `--color-danger-strong` (white panels). Status is never conveyed by color alone |
| Type sizes up to 100px are fixed | Fluid with `clamp()` so they fit 375 px |
| Drop shadows are discouraged but `--shadow-lg` exists | Shadow only on the nav pill; everything else glows (`--glow-blue`, `--glow-violet`) |

## Contrast (computed, WCAG 2.x; need ≥ 4.5:1 for text under 24 px, ≥ 3:1 for large text / UI edges)

| Text on surface | Ratio | Use |
|---|---|---|
| paper on midnight / carbon | 19.30 / 17.58 | primary text ✅ |
| ash on carbon | 11.70 | secondary text ✅ |
| fog on carbon | 7.46 | muted text, placeholders ✅ |
| signal-violet on carbon / midnight | 5.39 / 5.91 | accent text, links ✅ |
| paper on voltage-blue | 5.05 | primary button label ✅ |
| danger `#ff6b6b` on carbon | 6.34 | errors on dark ✅ |
| **slate on carbon** | **3.45** | ❌ not for text; borders/disabled icons only |
| **steel on carbon** | **2.51** | ❌ never for text or placeholders; **borders only** |
| ink on white | 19.30 | text in workspace panels ✅ |
| graphite / steel / slate on white | 10.31 / 7.01 / 5.10 | secondary text on white ✅ |
| voltage-blue on white | 5.05 | links, active states on white ✅ |
| danger-strong `#c92a2a` on white | 5.46 | errors on white ✅ (`#ff6b6b` on white is 2.78 ❌) |

The reference suggests `#58595b` (steel) for placeholders — that fails contrast; use **fog** instead.

## Rules (from the reference, adapted)

**Do:** 30px radius for buttons, tags, cards · 60px for the nav pill · 10px for inputs ·
Voltage Blue for the primary CTA · violet (`--color-signal-violet`) for the second line of hero headlines,
links and ghost buttons · gradient `--gradient-signal-violet` for glows/washes (decor, never behind text) ·
body text 16px weight 400, never below 14px · mono font for code, IDs, slugs and technical labels ·
left-align body copy (only headlines/hero center) · weight 500 for headings, tight line-height (1.0–1.09) on display.

**Don't:** small radii (4–8px) on user-facing components · drop shadows for elevation · extra accent hues
(except danger) · white/gray primary buttons · centered paragraphs · dark screenshots inside the page.

## Components → where we use them

| Component (reference) | Spec | Used for |
|---|---|---|
| **Floating nav pill** | fixed top-center, 60px radius, carbon fill, 1px `--border-subtle`, shadow `--shadow-lg`, padding 8 8 8 24, links ash 14px | header of both interfaces |
| **Primary button** | voltage-blue fill, white text, 30px radius, 16×24 padding, no border | main actions (Sign in, New project, Save) |
| **Ghost button** | transparent, 1px signal-violet border + text, 30px radius | secondary actions (Cancel, Edit) |
| **Danger button** | transparent, 1px danger border + text (strong variant on white), 30px radius | Delete |
| **Input** | 10px radius, carbon fill + 1px `--color-steel` border on dark; white fill + `--color-ash` border on white; focus = `--focus-ring`; labels always visible | forms, login |
| **Segmented tab control** | 30px radius pill, carbon fill, 1px border, active tab = blue dot + brighter text | status filter (All/Draft/Published/Archived) |
| **Tag / chip** | 30px radius, 1px outline | technologies, status badges (with text) |
| **Card** | carbon fill, 1px `--border-subtle`, 30px radius, padding `--card-padding`, hover = `--glow-violet` | project cards on the public site |
| **Workspace panel** | white fill, 20px radius, ink text, `--glow-blue` halo | admin tables, forms, detail |
| **Code snippet block** | carbon, 12–16px radius, mono 14px, copy button | public Home: "content delivered by API" JSON sample (optional) |
| **Hero headline** | 2 lines, display size, weight 500; line 1 white, line 2 signal-violet | public Home |

Status badge look (no extra hues): `PUBLISHED` = filled violet-outline + text; `DRAFT` = ash outline;
`ARCHIVED` = slate-on-dark outline / steel-on-white outline with strike-free text. The word is always shown.

## Layout and motion

Page max width `--page-max-width` (1200px), section gaps `--section-gap`. Public: hero → featured grid →
(optional code block) → footer. Mobile-first; nav pill collapses to logo + menu button under 640px.
Motion: only 150–200ms opacity/glow transitions; honor `prefers-reduced-motion`.

## Accessibility baseline

Visible focus ring on every interactive element · labelled inputs · `aria-live="polite"` for async
messages · modals trap focus and close on Esc · touch targets ≥ 44px · works at 375px and 1280px.
