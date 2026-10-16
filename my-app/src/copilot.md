Project Guidelines & Copilot Instructions

Tech Stack & Core Rules

Framework: React

Styling: Tailwind CSS

Design Priority: Absolute consistency across all pages (layout, spacing, typography, and colors).

1. Design System & Style Consistency

Color Palette

Strict consistency across all pages.

Use primary, secondary, and neutral colors predictably (e.g., bg-slate-900, text-slate-800, bg-indigo-600 for main CTAs).

Backgrounds, borders, and text colors must match existing pages.

Typography

Font Family: Keep uniform across all components and pages.

Headings (Page Title): text-2xl or text-3xl with font-bold.

Subheadings: text-lg or text-xl with font-semibold.

Body Text: text-sm or text-base with text-slate-600 / text-slate-300 (depending on light/dark mode).

Do NOT introduce arbitrary text sizes outside the established design hierarchy.

Spacing (Padding & Margin)

Page Container Padding: Maintain consistent main layout margins/padding (e.g., p-6 or px-8 py-6).

Card/Section Padding: Use p-4 or p-6 consistently for inner content boxes.

Component Gaps: Use standard flex/grid gaps (gap-4, gap-6, or space-y-4). Avoid custom pixel margins unless necessary.

2. Layout Structure (Navbar & Sidebar)

Shared Layout Structure

All pages must follow a unified layout wrapped around the persistent Navbar and Sidebar.

// Standard Page Wrapper Hierarchy



### Sidebar Rules
- Fixed width (e.g., `w-64`).
- Active link states must use the same highlight style across all routes (`bg-indigo-50 text-indigo-600 font-medium`).
- Hover states must be uniform (`hover:bg-slate-100`).

### Navbar Rules
- Fixed height (e.g., `h-16`).
- Maintain consistent inner alignment with `flex items-center justify-between px-6`.
- Keep sticky or fixed positioning consistent on every page view.


3. Code Generation Guidelines for Copilot

Always reuse existing layout wrappers and utility classes when building new pages.

When generating new pages or components, check neighboring components to mirror exact class names for padding, margins, fonts, and colors.

Write clean, functional React components with standard prop types or TypeScript interfaces.