# Design System Document: The Botanical Atelier

## 1. Overview & Creative North Star: "The Curated Sanctuary"
The design system for this brand is not merely a digital interface; it is a digital translation of a sensory experience—the smell of freshly ground espresso, the velvet touch of a rose petal, and the weight of a linen-bound book. 

**Creative North Star: The Curated Sanctuary.**
We move away from the rigid, "boxed-in" nature of standard web layouts. Instead, we embrace **Editorial Asymmetry**. This system uses expansive white space (using the `surface` token), overlapping imagery, and a high-contrast typographic scale to mimic the layout of a luxury lifestyle magazine. Elements should feel like they are resting on a tabletop, not locked into a grid. We replace harsh lines with tonal transitions, creating a flow that is organic, romantic, and intentional.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
This palette is designed to feel "lived-in" and warm. We utilize Material-inspired tokens to ensure semantic consistency while maintaining a bespoke, Parisian aesthetic.

*   **Primary (Dusty Rose):** `primary` (#78555D) / `primary_container` (#F2C4CE). Use for moments of brand warmth and romance.
*   **Secondary (Sage Green):** `secondary` (#4B6546) / `secondary_container` (#CDEBC4). Represents the botanical element; use for growth-oriented actions or herbal cues.
*   **Tertiary (Muted Terracotta):** `tertiary` (#8F4D27). Use for highlights, earthiness, and artisanal calls to action.
*   **Neutral (Espresso & Cream):** `on_surface` (#1C1C18) and `surface` (#FDF9F3).

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or containment. 
*   **Boundaries through Tone:** Define sections solely through background shifts. For example, a `surface_container_low` section should sit directly against a `surface` background to create a soft, imperceptible edge.
*   **Surface Hierarchy:** Treat the UI as stacked sheets of fine deckle-edge paper. Use `surface_container_lowest` for the most prominent foreground cards and `surface_dim` for background context.

### The "Glass & Gradient" Rule
To escape the "flat" look, employ **Glassmorphism** for floating navigation bars or overlay modals. 
*   **Specs:** Apply `surface_container_lowest` at 80% opacity with a `24px` backdrop-blur. 
*   **Signature Textures:** Use subtle linear gradients for CTAs, transitioning from `primary` to `surface_tint`. This adds "soul" and a shimmer reminiscent of a silk ribbon.

---

## 3. Typography: The Editorial Voice
We pair the high-fashion elegance of Noto Serif (as our Playfair surrogate) with the modern clarity of Plus Jakarta Sans (as our Lato surrogate) to balance romance with readability.

*   **Display (Large/Medium):** `notoSerif`. Use for hero titles. Tighten letter spacing slightly (-2%) to create a sophisticated, "ink-on-paper" look.
*   **Headlines:** `notoSerif`. Used for section headers. Always in `on_surface`.
*   **Body Text:** `plusJakartaSans`. Set in `on_surface_variant` for a softer, Espresso-tinted legibility.
*   **Labels:** `plusJakartaSans` (Bold). Use for small caps or utility text to provide a structured contrast to the flowing serif headers.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "tech." We use **Ambient Light** and **Tonal Layering** to create a high-end feel.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_highest` element (like a featured book snippet) should sit on a `surface_container` background.
*   **Ambient Shadows:** If a floating element (like a "Book Now" FAB) is required, use a shadow with a `32px` blur, `0%` spread, and `6%` opacity. The shadow color must be a tinted `on_surface` (#1C1C18), never pure black.
*   **The Ghost Border:** If accessibility requires a border, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.
*   **Soft Roundness:** Apply `xl` (1.5rem) or `full` (9999px) corner radius to buttons and image containers to mimic the soft edges of flower petals and café furniture.

---

## 5. Components: Soft & Romantic

### Buttons (The "Ribbon" Style)
*   **Primary:** Background `primary`, text `on_primary`. Corner radius: `full`. No border.
*   **Secondary:** Background `secondary_container`, text `on_secondary_container`. Use for secondary actions like "View Menu."
*   **Tertiary (The "Linen" Button):** No background. Underline using a 2px `primary_fixed_dim` stroke with 4px offset.

### Cards & Lists (The "Unbound" Style)
*   **Rule:** Forbid divider lines.
*   **Implementation:** Separate list items using `1.5rem` (xl) vertical padding. Distinguish featured cards using a subtle background shift to `surface_container_low`. 
*   **Images:** All images should have a `md` (0.75rem) corner radius and a subtle "fade-in" transition to mimic an emerging memory.

### Input Fields
*   **Styling:** Fill with `surface_container_lowest`. Use only a bottom-border (2px) in `outline_variant` that transitions to `primary` on focus. No full bounding boxes.

### Signature Component: The "Pressed Flower" Chip
*   Used for categories (e.g., "Dark Roast," "Fiction," "Peonies"). 
*   **Style:** `surface_bright` background, `secondary` text, with a `sm` (0.25rem) soft-rounded corner.

---

## 6. Do’s and Don'ts

### Do:
*   **Embrace Negative Space:** Allow text to breathe. If it feels "too empty," you are doing it correctly.
*   **Use Intentional Asymmetry:** Offset an image to the left and a heading to the right to create an editorial flow.
*   **Layer Surfaces:** Use the `surface_container` tiers to guide the eye toward primary content.

### Don’t:
*   **No "Heavy" Shadows:** Never use shadows with high opacity or small blur radii. It breaks the "light and airy" Parisian feel.
*   **No Solid Dividers:** Never use a solid line to separate sections. Use a `32px` margin and a background color change.
*   **No Pure Black:** Never use #000000. Use `on_surface` (Deep Espresso) to maintain the warmth of the brand.
*   **No Sharp Corners:** Avoid the `none` or `sm` roundness scales for major UI elements. The brand is organic, not industrial.