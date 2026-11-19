# Srixon Mega Menu Redesign — Build Spec for Claude Code

Source: Figma "Dunlop Sports America" → Page 12 → section **"Navigation – Mega Menu Redesign [D]"**
Measured from the Figma file (view-only, Properties panel). All values are at **1440px desktop** artboard width.

> **Note for Claude Code:** the screenshots attached alongside this file are visual reference only (a flat image has no
> layer data). Treat **this file as the source of truth** for every number, color, font and text string. If the
> screenshot and this file disagree, follow this file and flag the difference.

---

## 0. Test context (fill in before handing to Claude Code)

- Site / platform: srixon.com — ______ (Convert / VWO / AB Tasty / …)
- Code style: Vanilla JS + CSS, injected client-side; no framework
- What to replace: the existing desktop mega-menu dropdown panels under the main nav (BALLS, CLUBS, GEAR, LIMITED EDITION, FITTING, TOUR, SALE)
- Trigger: ______ (hover on nav item, like current site? click?)
- Breakpoint: design is desktop only (1440). Apply at ≥ ______px; leave mobile nav untouched unless told otherwise
- Link URLs: ______ (not in the design — supply a URL map, or reuse the hrefs from the live menu by matching link text)

---

## 1. Design tokens

### Colors
| Token | Hex | Used for |
|---|---|---|
| `--mm-text` | `#111111` | Column headers, series links, card title |
| `--mm-text-muted` | `#5A5A5A` | Tool links, explore links, card body |
| `--mm-label-grey` | `#8A8A8A` | Group label default (e.g. "WOMEN'S") |
| `--mm-red` | `#D7261E` | Accent bar, "Shop All …" links, "Learn More →" |
| `--mm-red-label` | `#E4002B` | "TOOLS & FITTINGS" group label |
| `--mm-divider` | `#E3E3E3` | Column divider, trade-in card border |
| `--mm-bg` | `#FFFFFF` | Dropdown background, trade-in card bg |
| `--mm-panel-bg` | `#F5F5F5` | Explore panel (right column) |

### Typography
Font in design: **Citrine Variable** (the site's brand font; use the font-family already loaded on the live site; do not load a new font).
All line-heights are **100%** (`line-height: 1`).

| Component | Size | Weight | Letter-spacing | Transform | Color |
|---|---|---|---|---|---|
| Category Header (IRONS, EXPLORE…) | 15px | 700 | 8% (0.08em) | uppercase | `#111111` |
| Shop All Link ("Shop All Irons →") | 12.5px | 700 | 0 | — | `#D7261E` |
| Series Link (ZXi5 Irons…) | 14px | 400 | 0 | none (text as written) | `#111111` |
| Group Label ("TOOLS & FITTINGS") | 10.5px | 700 | 14% (0.14em) | uppercase | `#E4002B` (component default `#8A8A8A`) |
| Tool Link ("Iron Selector ›") | 13px | 400 | 0 | — | `#5A5A5A` |
| Explore Link ("ZXi RKT Lineup ›") | 13px | **500** | 0 | — | `#5A5A5A` |
| Trade-in title | 12px | 700 | 8% | uppercase | `#111111` |
| Trade-in body | 12px | 400 | 0 | — | `#5A5A5A` |
| Trade-in link ("Learn More →") | 12px | 700 | 0 | — | `#D7261E` |

Arrows: Shop All / Learn More use `→` after the text. Tool and Explore links use `›` after the text, with a 6px gap.

Component sheet also contains a **Series Link alt state: 15px / 600 / `#111111`**, likely the hover/active state. Confirm with the designer; if no answer, use it as `:hover`.

---

## 2. Dropdown container (shared)

- Full width of header: **1438px** inside a 1440 frame (1px border each side on the artboard; on the site = 100% width)
- Background `#FFFFFF`
- Positioned directly below the main nav bar (top edge of dropdown = bottom of header)
- Layout: **horizontal flex** → `[Category Columns][Explore Panel]`
- Left padding: **120px** (exception: Fitting = 526px, see §5.3)
- Height: hug content; Explore panel stretches to full dropdown height
- Active top-nav item shows red (`#D7261E`) text + underline (as in the current site)

### 2.1 Category Columns (wrapper)
- `display:flex; flex-direction:row;`
- Padding: **28px top, 44px right, 32px bottom**, 0 left
- Gap between columns: **44px**
- Width: hug content (except Gears: fixed 1318px, content centered)

### 2.2 Column
`display:flex; flex-direction:column; gap:0;` (width = widest child; Clubs/Irons = 172px)

Stack, top to bottom:

1. **Header Block** — column, **gap 8px**, **padding-bottom 14px**
   - Category Header row (text; row gap 6px if an icon is present)
   - **Accent bar**: 28px × 3px, `#D7261E`
   - Shop All Link
2. **Divider** — 1px high, full column width, `#E3E3E3`
3. **Series** — column, **padding-top 16px**, gap **18px** between groups
   - **Group / Series** — column, **gap 11px** between links (Series Link ×n)
4. **Tools** (optional) — column, **padding-top 20px**, **gap 9px**
   - Group Label (e.g. TOOLS & FITTINGS)
   - Tool Link ×n

### 2.3 Explore Panel (right side)
- `display:flex; flex-direction:column;` bg `#F5F5F5`
- Padding: **28px top, 40px right, 32px bottom, 32px left**
- Gap: **12px**
- `flex:1` (fills remaining width; Clubs = 379px wide, Ball/Fitting = 724px)
- Height: fills dropdown height
- Contents: Category Header + Accent bar (28×3) → Explore Links → (Clubs only) 10px spacer → Trade-In Card

### 2.4 Trade-In Card (Clubs only)
- Column, bg `#FFFFFF`, border **1px `#E3E3E3`**, radius **4px**
- Padding **14px 16px**, gap **6px**
- Width: fills panel (307px at design size), height hug (84px)
- Content: TRADE-IN PROGRAM / Get credit toward new clubs / Learn More →

---

## 3. Variant: CLUBS (most complex; build this first)

Columns (left → right):

**IRONS** — Shop All Irons →
- ZXi5 Irons
- ZXi7 Irons
- ZXi5+ Irons
- ZXi4 Irons
- ZXiR Irons
- ZXiR HL Irons
- ZXiU Utility Irons
- Z-Forged II Irons
- Women's ZXiR HL Irons
- Women's ZXi4 Irons
- ZXi5 + ZXi7 Combo Set
- *TOOLS & FITTINGS:* Iron Selector › · Iron Combo Set Builder › · Iron Personalization ›

**DRIVERS** — Shop All Drivers →
- ZXi RKT Driver
- ZXi RKT LS Driver
- ZXi RKT MAX Driver
- Women's ZXi RKT MAX Driver
- *TOOLS & FITTING:* Driver Selector ›

**FAIRWAY WOODS** — Shop All Fairways →
- ZXi RKT Fairway
- Women's ZXi RKT Fairway

**HYBRIDS** — Shop All Hybrids →
- ZXi RKT Hybrid
- ZXi RKT Hybrid + ZXiR
- ZXi RKT Hybrid + ZXiR HL
- Women's ZXi RKT Hybrid

**EXPLORE panel**
- ZXi RKT Lineup ›
- ZXi Iron Lineup ›
- ZXiR Irons Series ›
- Trade-In card: **TRADE-IN PROGRAM** / Get credit toward new clubs / **Learn More →**

Measured: dropdown 1438 × 548; Category Columns 939 × 548; Explore 379 × 548.

---

## 4. Variant: BALLS

Columns:

**Z-STAR SERIES** — Shop All Z-STAR →
- Z-STAR
- Z-STAR DIAMOND
- Z-STAR XV
- Z-STAR DIVIDE
- Z-STAR XV DIVIDE

**Q-STAR SERIES** — Shop All Q-STAR →
- Q-STAR TOUR
- Q-STAR TOUR DIVIDE
- Q-STAR ULTSPEED

**SOFT-FEEL** — Shop All SOFT FEEL →
- SOFT FEEL
- SOFT FEEL BRITE
- SOFT FEEL LADY

**EXPLORE panel:** Ball Selector › · Personalized Balls › (no trade-in card)

Series links are typed in UPPERCASE in the design but use the same Series Link style (14px/400, no letter-spacing).
Measured: Category Columns 594 × 272; Explore 724 × 272; left padding 120.

---

## 5. Variant: FITTING

**SELECTORS** (header + accent + divider; no Shop All link)
- Irons Selector
- Ball Selector
- Driver Selector

**EXPLORE panel** — header **EVENT**: Event Days ›

Layout exception: dropdown **left padding 526px** (column pushed right). Category Columns 188 × 207; Explore 724 wide.

---

## 6. Variant: GEAR

No Explore panel. Category Columns **fixed 1318px wide, columns centered**, same 28/44/32 padding, 44 gap. Height 300.

**BAGS** — Shop All Bags →
- Golf Bags
- Travel Gear

**APPAREL** — Shop All Apparel →
- Gloves
- Headwear

**ACCESSORIES** — Shop All Accessories →
- Headcovers
- Towels
- Umbrella
- Components

**LIMITED EDITIONS** — Shop All Limited Editions →
- Spring Collection
- Tour Ink Collection
- Headwear
- Golf Bags
- Headcovers
- Towels

---

## 7. Variant: LIMITED EDITION

No Explore panel, columns centered. Each column = Header Block only (header + accent + link; no divider or series):

| Header | Link |
|---|---|
| ALL-AMERICAN | Shop Collection → |
| SPRING | Shop Collection → |
| BLACKOUT | Shop Collection → |
| TOUR INK | Shop Collection → |
| HAWAII FLORAL | Shop Collection → |
| SUMMER MAJOR | Shop Collection → |

## 8. Variant: TOUR

No Explore panel, columns centered, Header Block only:

| Header | Link |
|---|---|
| TOUR PROS | Learn More → |
| AMBASSADORS | Learn More → |
| VIDEO | View Gallery → |
| PURE PRECISION | Learn More → |
| TEAM SRIXON CELEBRATION | Learn More → |

## 9. Variant: SALE

No Explore panel, single centered column, Header Block only:
- **GOLF BALL**: Shop Golf Ball →

Header-only dropdowns ≈ 126px tall (28 top + 66 header block + 32 bottom).

---

## 10. Behaviour (not in Figma: confirm or decide)

- Open on hover of top-nav item (match live behaviour); close on mouse-leave of nav + dropdown, and on Esc
- Only one dropdown open at a time; active nav item red + underline
- Link hover: suggested `text-decoration: underline` or Series Link alt state (15px/600). Confirm
- Keyboard: nav items focusable; dropdown links reachable by Tab; `aria-expanded` on the trigger
- No animation specified (optional 150ms fade)
- Reuse live-site hrefs where link text matches; list any links with no live equivalent

---

## 11. Screenshots to attach (for visual reference)

Take each at **100% zoom or higher** so text is legible:
1. Each of the 7 variants, cropped to the dropdown area only (Clubs, Balls, Gear, Limited Edition, Fitting, Tour, Sale)
2. Clubs Explore panel + Trade-In card close-up
3. One Clubs column close-up (IRONS) showing header → accent → divider → list → tools
4. "Nav Menu Components" frame (component states sheet)

Name files to match the sections above (e.g. `03-clubs.png`, `04-balls.png`) so Claude Code can map them.

## 12. Suggested prompt for Claude Code

> Build a client-side A/B test variation (Vanilla JS + CSS, no dependencies) that replaces the desktop mega-menu
> dropdowns on srixon.com with the redesign described in `srixon-mega-menu-spec.md`. Use the attached screenshots as
> visual reference only; all measurements, colors, type and copy come from the spec. Build reusable components
> (Column, Header Block, Series group, Tools group, Explore panel, Trade-in card) and render each variant from a data
> object. Scope all CSS under a unique prefix (e.g. `.mm-v1`). Ask me for any missing URLs or behaviour before guessing.
