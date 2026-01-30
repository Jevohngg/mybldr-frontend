# Button Design System

> Source of truth for button implementation in myBLDR.
> Last updated: January 2026

## Overview

The `Button` component (`src/components/ui/Button.tsx`) is the unified button system for myBLDR. All clickable actions that appear as buttons should use this component to ensure consistent styling, accessibility, and behavior across the platform.

**Key files:**
- Component: `src/components/ui/Button.tsx`
- Styles: `src/design-system/buttons.css`

---

## Variants

### Primary
```tsx
<Button variant="primary">Save Changes</Button>
```
- **Use for:** Main call-to-action, form submissions, primary actions
- **Appearance:** Brand blue background (`#1D6BCD`), white text
- **Hover:** Darker blue (`--color-brand-2`)

### Secondary (Default)
```tsx
<Button variant="secondary">Cancel</Button>
<Button>Cancel</Button> {/* secondary is default */}
```
- **Use for:** Secondary actions, cancel buttons, alternative options
- **Appearance:** White background, gray border (`#D1D5DB`), dark text
- **Hover:** Light gray background (`#F3F4F6`)

### Ghost
```tsx
<Button variant="ghost">More Options</Button>
```
- **Use for:** Tertiary actions, icon buttons in toolbars, close/dismiss buttons
- **Appearance:** Transparent background, no border, muted icon color (`#9CA3AF`)
- **Hover:** Subtle gray background (`#F3F4F6`), darker icon color (`#0B0C0D`)

### Link
```tsx
<Button variant="link">Enter manually</Button>
```
- **Use for:** Text-style actions, inline actions, navigation-like buttons
- **Appearance:** No background, no border, same typography as secondary (14px, primary text color)
- **Hover:** Underline text decoration
- **Note:** No transform animation on click

### Danger
```tsx
<Button variant="danger">Delete</Button>
```
- **Use for:** Destructive actions (delete, remove, clear permanently)
- **Appearance:** Red background (`#DC2626`), white text
- **Hover:** Darker red (`#B91C1C`)
- **Focus ring:** Red outline instead of blue

---

## Sizes

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| `default` | 40px | 8px 16px | 16px (1rem) | Standard buttons |
| `small` | auto | 8px 12px | 12px (0.75rem) | Compact spaces, tables |
| `sm` | 28px | 4px 8px | 12px (0.75rem) | Small icon buttons, clear buttons |
| `xs` | 16px | 0 | 10px (0.625rem) | Tag remove buttons, kebab menus |

### Icon Button Sizes

When using `iconOnly`, the button becomes square:

| Size | Dimensions | Use Case |
|------|------------|----------|
| `default` + `iconOnly` | 40x40px | Standard icon buttons |
| `sm` + `iconOnly` | 28x28px | Small close buttons, clear search |
| `xs` + `iconOnly` | 16x16px | Tag remove, kebab menus |

---

## Props Reference

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'danger'
  size?: 'default' | 'small' | 'sm' | 'xs'
  iconOnly?: boolean
  loading?: boolean
  fixedWidth?: number
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'secondary'` | Visual style variant |
| `size` | string | `'default'` | Size variant |
| `iconOnly` | boolean | `false` | Square button for icons only |
| `loading` | boolean | `false` | Shows spinner, disables button |
| `fixedWidth` | number | - | Fixed width in pixels |
| `disabled` | boolean | `false` | Standard HTML disabled state |
| `className` | string | - | Additional CSS classes |

---

## Usage Examples

### Basic Actions
```tsx
// Primary action
<Button variant="primary" onClick={handleSave}>Save</Button>

// Secondary/cancel action
<Button onClick={handleCancel}>Cancel</Button>

// Destructive action
<Button variant="danger" onClick={handleDelete}>Delete</Button>
```

### With Icons
```tsx
// Icon + text
<Button variant="primary">
  <img src="/assets/icons/plus.svg" alt="" width="16" height="16" />
  Add Community
</Button>

// Icon only
<Button variant="ghost" iconOnly aria-label="Close">
  <CloseIcon />
</Button>
```

### Sizes
```tsx
// Small button in table
<Button variant="secondary" size="small">Update</Button>

// Small icon button (28px)
<Button variant="ghost" size="sm" iconOnly aria-label="Clear search">
  <XIcon />
</Button>

// Extra small (16px) for tags
<Button variant="ghost" size="xs" iconOnly aria-label="Remove tag">
  ✕
</Button>
```

### Loading State
```tsx
<Button variant="primary" loading>
  Saving...
</Button>
```

### Link Style
```tsx
<Button variant="link" onClick={handleManualEntry}>
  Enter details manually
</Button>
```

### Fixed Width
```tsx
<Button variant="primary" fixedWidth={200}>
  Submit
</Button>
```

---

## When to Use Each Variant

| Scenario | Variant | Size |
|----------|---------|------|
| Form submit, main CTA | `primary` | `default` |
| Cancel, close dialog | `secondary` | `default` |
| Table row actions | `secondary` | `small` |
| Modal close button | `ghost` | `sm` + `iconOnly` |
| Kebab/overflow menu | `ghost` | `xs` + `iconOnly` |
| Tag remove button | `ghost` | `xs` + `iconOnly` |
| Clear search field | `ghost` | `sm` + `iconOnly` |
| Text-style action | `link` | `default` |
| Delete confirmation | `danger` | `default` |
| Pagination arrows | `secondary` | `default` + `iconOnly` |

---

## Accessibility

### Built-in Features
- **Focus visible:** 2px outline with `--color-focus-ring` (blue)
- **Disabled state:** 50% opacity, `cursor: not-allowed`, no hover effects
- **Loading state:** Automatically disables button

### Required Practices
- **Always provide `aria-label`** for icon-only buttons
- **Use semantic button types:** `type="button"` for non-submit buttons
- **Don't disable without explanation:** Consider showing why action is unavailable

```tsx
// Good: icon button with aria-label
<Button variant="ghost" iconOnly aria-label="Close modal">✕</Button>

// Good: non-submit button type
<Button type="button" onClick={handleCancel}>Cancel</Button>
```

---

## CSS Class Reference

The Button component generates these CSS classes:

| Class | Applied When |
|-------|--------------|
| `.btn` | Always (base styles) |
| `.btnPrimary` | `variant="primary"` |
| `.btnSecondary` | `variant="secondary"` (default) |
| `.btnGhost` | `variant="ghost"` |
| `.btnLink` | `variant="link"` |
| `.btnDanger` | `variant="danger"` |
| `.btnSmall` | `size="small"` |
| `.btnSm` | `size="sm"` |
| `.btnXs` | `size="xs"` |
| `.btnIcon` | `iconOnly={true}` |
| `.btnSpinner` | Loading spinner element |

---

## Elements NOT Using Button Component

Some UI elements intentionally do not use the Button component:

### Filter Chips (TopNav)
**Location:** `src/navigation/TopNav/TopNav.module.css`

Filter chips have unique toggle state behavior with active/inactive visual treatments. They use brand blue when selected and have pill-style appearance that differs from standard buttons.

```tsx
// Current implementation
<button className={`${styles.filterChip} ${active ? styles.filterChipActive : ''}`}>
  {filter}
</button>
```

**Rationale:** Toggle state with distinct active styling, pill appearance, used only in search context.

### Navigation Tabs
**Locations:** `PlanDetailSideNav`, `ReservedLotSideNav`

Navigation tabs have specific active state styling with underlines/borders and are semantically different from action buttons.

**Rationale:** Tab semantics, active state indicators, consistent nav patterns.

### Toolbar Buttons
**Locations:** Various Specifications pages

Toolbar icon buttons (bold, italic, etc.) in rich text editors have specialized styling and grouping.

**Rationale:** May need grouped/segmented button variants in future.

---

## Design Tokens Used

```css
/* Colors */
--Colors-Background-bg-brand-solid: #1D6BCD  /* Primary blue */
--color-brand-2: [hover blue]                /* Primary hover */
--color-danger: #DC2626                      /* Danger red */
--color-danger-hover: #B91C1C                /* Danger hover */
--color-border: #D1D5DB                      /* Secondary border */
--color-surface-2: #F3F4F6                   /* Hover background */
--color-text-primary: #0B0C0D                /* Primary text */
--color-text-secondary: #3E4041              /* Secondary text */
--color-focus-ring: rgba(29, 107, 205, 0.5)  /* Focus outline */

/* Spacing */
--radius-4: 4px                              /* Border radius */
--text-md: 14px                              /* Medium font size */
--weight-medium: 500                         /* Medium font weight */
```

---

## Migration Status

### Completed Migrations
- [x] PlanDetailModal - All buttons migrated
- [x] TopNav - Hamburger, clear button migrated
- [x] BaseModal - Close button migrated
- [x] CommunityCard - Kebab menu migrated
- [x] AddCommunityModal - Manual link buttons migrated
- [x] ReservedLotDetailPage - Close button, remove attachment button migrated
- [x] PaletteSelector - Close button migrated
- [x] AIPreviewOverlay - Close button migrated
- [x] CustomPaletteEditor - Close button, remove file button migrated
- [x] LotDetailPopup - Close button migrated
- [x] ReservedLotPopup - Close button migrated
- [x] TitleBlockInfo - Tag remove buttons migrated

### Future Migration Candidates
- [ ] Pagination buttons (consider dedicated Pagination component)
- [ ] Toolbar buttons (may need grouped/segmented variant)
- [ ] AI Preview share/control buttons (non-close buttons)

---

## Changelog

### January 2026
- Initial unified Button component created
- Added variants: `primary`, `secondary`, `ghost`, `link`, `danger`
- Added sizes: `default`, `small`, `sm`, `xs`
- Added `iconOnly`, `loading`, `fixedWidth` props
- Added disabled states and focus-visible styles
- Migrated buttons from: PlanDetailModal, TopNav, BaseModal, CommunityCard, AddCommunityModal
