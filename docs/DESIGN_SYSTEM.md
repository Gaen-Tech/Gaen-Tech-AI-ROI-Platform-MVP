# Gaen Tech - Design System & Brand Guidelines

This document serves as the official design guide for the Gaen Tech AI ROI Platform. It provides all the necessary visual and technical specifications to ensure brand consistency and accelerate development.

## 1. Logo & Visual Identity

Our logo represents innovation, intelligence, and clarity. It consists of an icon and a logotype.

### Primary Logo

The primary logo combines the "auto_awesome" icon with the "Gaen Tech" logotype.

- **Icon**: Material Symbols 'auto_awesome'
- **Logotype**: "Gaen Tech"
- **Font**: Poppins, Bold

### Usage Guidelines

- **Clearance Space**: Maintain a minimum space around the logo equal to the height of the "G" in "Gaen".
- **Minimum Size**: The logo should not be rendered smaller than 24px in height to ensure legibility.
- **Incorrect Usage**: Do not stretch, rotate, alter the colors, add drop shadows, or place the logo on a visually busy background that compromises its clarity.

---

## 2. Color Palette

Our color palette is designed to be modern, vibrant, and accessible, with full support for both light and dark themes.

### Primary Color

The primary color is a vibrant violet, used for key actions, highlights, and branding accents.

| Swatch      | Name        | Hex       | Usage                                      |
|-------------|-------------|-----------|--------------------------------------------|
| ![#7C3AED](https://via.placeholder.com/20/7C3AED/000000?text=+) | **Primary** | `#7C3AED` | Buttons, active links, focus rings, highlights |
| ![#F5F3FF](https://via.placeholder.com/20/F5F3FF/000000?text=+) | Primary-50  | `#F5F3FF` | Subtle backgrounds, hover states (light)   |
| ![#EDE9FE](https://via.placeholder.com/20/EDE9FE/000000?text=+) | Primary-100 | `#EDE9FE` | Subtle backgrounds, card accents (light)   |
| ![#5B21B6](https://via.placeholder.com/20/5B21B6/000000?text=+) | Primary-800 | `#5B21B6` | Darker shades for depth                    |
| ![#4C1D95](https://via.placeholder.com/20/4C1D95/000000?text=+) | Primary-900 | `#4C1D95` | Card accents (dark)                        |

### System Palette (Light & Dark Theme)

These colors define the core UI surfaces and text for both themes.

| Element         | Light Theme Name   | Light Hex | Dark Theme Name    | Dark Hex  | Usage                                     |
|-----------------|--------------------|-----------|--------------------|-----------|-------------------------------------------|
| **Background**  | `background-light` | `#F9FAFB` | `background-dark`  | `#030712` | Main page background color                |
| **Card/Surface**| `card-light`       | `#FFFFFF` | `card-dark`        | `#111827` | Card backgrounds, modals, dropdowns       |
| **Text**        | `text-light`       | `#1F2937` | `text-dark`        | `#E5E7EB` | Primary text, headings, body copy         |
| **Muted Text**  | `muted-light`      | `#6B7280` | `muted-dark`       | `#9CA3AF` | Secondary text, placeholders, descriptions|

### Accent Colors

Accent colors are used for data visualization, status indicators, and to draw attention to specific elements within stat cards.

| Swatch      | Name     | Hex       | Usage                                            |
|-------------|----------|-----------|--------------------------------------------------|
| ![#06B6D4](https://via.placeholder.com/20/06B6D4/000000?text=+) | Cyan     | `#06B6D4` | Page titles, icons, progress indicators          |
| ![#EC4899](https://via.placeholder.com/20/EC4899/000000?text=+) | Pink     | `#EC4899` | Page titles, icons, decorative elements          |
| ![#22C55E](https://via.placeholder.com/20/22C55E/000000?text=+) | Green    | `#22C55E` | Success states, positive ROI, 'Qualified' status |
| ![#3B82F6](https://via.placeholder.com/20/3B82F6/000000?text=+) | Blue     | `#3B82F6` | Informational icons, 'Prospected' status       |
| ![#F97316](https://via.placeholder.com/20/F97316/000000?text=+) | Orange   | `#F97316` | Warnings, high priority indicators             |
| ![#FBBF24](https://via.placeholder.com/20/FBBF24/000000?text=+) | Yellow   | `#FBBF24` | Icons for scoring and metrics                  |

---

## 3. Typography

Our typography is clean, modern, and highly readable, based on the Poppins font family.

- **Font Family**: `Poppins`, sans-serif

### Headings

| Element           | Font Weight | Size (`text-`) | Notes                                  |
|-------------------|-------------|----------------|----------------------------------------|
| **Display (`h1`)**| Bold        | `4xl` to `6xl` | Page titles, hero section headlines    |
| **Heading (`h2`)**| Bold        | `3xl` to `5xl` | Section titles (Discovery, Leads)      |
| **Sub-heading (`h3`)**| Semi-Bold | `xl` to `2xl`  | Card titles, modal titles              |
| **Title (`h4`)**  | Semi-Bold   | `lg`           | Smaller titles, info card headings     |

### Body Text

| Element       | Font Weight | Size (`text-`) | Notes                                    |
|---------------|-------------|----------------|------------------------------------------|
| **Body**      | Regular     | `base`         | Standard paragraph text                  |
| **Small/Muted**| Regular     | `sm`           | Descriptions, labels, metadata           |
| **Extra Small**| Regular     | `xs`           | Tooltips, minor details, persona descriptions |

---

## 4. UI Components

Core UI components should adhere to these styles for consistency.

### Buttons

- **Primary**: `bg-primary`, white text, `font-semibold`, `rounded-lg`. Has a `shadow-lg` and `shadow-primary/50`. Transforms `scale-105` on hover.
- **Secondary**: `bg-gray-200 dark:bg-slate-700/50`, muted text, `font-semibold`, `rounded-lg`.
- **Gradient**: `bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600`, white text, `font-bold`, `rounded-xl`.

### Cards

- **Standard Card**: `bg-card-light/80 dark:bg-card-dark/50` or `bg-slate-800/50` for nested cards.
- **Border**: `border border-white/10` or `border-gray-200 dark:border-slate-700/50`.
- **Effects**: `backdrop-blur-xl`, `rounded-xl` or `rounded-2xl`.
- **Shadow**: `shadow-md` or `shadow-lg`.

### Form Elements

- **Input Fields**: `bg-background-light dark:bg-gray-800` or `dark:bg-slate-900/80`.
- **Border**: `border border-gray-300 dark:border-gray-700` or `dark:border-slate-600`.
- **Focus State**: `focus:ring-2 focus:ring-primary`, `focus:border-transparent`.
- **Corners**: `rounded-lg` or `rounded-xl`.

---

## 5. Iconography

We use Google's Material Icons and Material Symbols for a consistent and professional look.

- **Library**: [Material Icons](https://fonts.google.com/icons) & [Material Symbols (Outlined)](https://fonts.google.com/symbols)
- **Usage**: Icons should be used to provide visual cues, reinforce actions, and improve usability. They should not be used purely for decoration.
- **Sizing**: Common sizes are `16px` (`w-4 h-4`), `20px` (`w-5 h-5`), and `24px` (`w-6 h-6`).

---

## 6. Layout & Spacing

- **Layout**: The application uses a container-based layout (`container mx-auto`) with padding.
- **Spacing**: Follows Tailwind's default spacing scale for margins, padding, and gaps to ensure consistent rhythm throughout the UI.
- **Gradients**:
  - **Dark Mode**: `radial-gradient(circle at top, #1e293b, #030712 70%)`
  - **Light Mode**: `radial-gradient(circle at top, #F5F3FF, #F9FAFB 80%)`