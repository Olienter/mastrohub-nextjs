# Theme System Documentation

## Overview

This document describes the semantic color system implemented in MastroHub to ensure consistent theming and prevent white-on-white text issues.

## Color Tokens

### Core Semantic Colors

The system uses CSS variables for all colors, which are defined in `src/app/globals.css`:

```css
:root {
  /* Light theme colors */
  --bg: #ffffff;
  --surface: #ffffff;
  --fg: #111827;
  --muted: #6b7280;
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --secondary: #f3f4f6;
  --secondary-foreground: #111827;
  --accent: #f1f5f9;
  --accent-foreground: #0f172a;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e5e7eb;
  --input: #ffffff;
  --ring: #3b82f6;
}
```

### Dark Theme Colors

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --surface: #1f2937;
    --fg: #f9fafb;
    --muted: #9ca3af;
    --primary: #3b82f6;
    --primary-foreground: #ffffff;
    --secondary: #374151;
    --secondary-foreground: #f9fafb;
    --accent: #374151;
    --accent-foreground: #f9fafb;
    --destructive: #ef4444;
    --destructive-foreground: #ffffff;
    --border: #374151;
    --input: #1f2937;
    --ring: #3b82f6;
  }
}
```

## Usage Guidelines

### Text Colors

- **`text-fg`** - Primary text color (dark in light mode, light in dark mode)
- **`text-muted`** - Secondary text color for less important content
- **`text-primary`** - Primary brand color for links and highlights
- **`text-primary-foreground`** - Text color on primary background
- **`text-secondary-foreground`** - Text color on secondary background
- **`text-destructive`** - Error text color

### Background Colors

- **`bg-bg`** - Main background color
- **`bg-surface`** - Surface background (cards, modals, dropdowns)
- **`bg-primary`** - Primary brand background
- **`bg-secondary`** - Secondary background
- **`bg-accent`** - Accent background for hover states
- **`bg-destructive`** - Error background

### Border Colors

- **`border-border`** - Default border color
- **`border-primary`** - Primary border color
- **`border-destructive`** - Error border color

## Migration Guide

### Before (Old System)

```tsx
// ❌ Don't use these anymore
<div className="bg-white text-white">
  <p className="text-gray-900">Content</p>
</div>
```

### After (New System)

```tsx
// ✅ Use semantic colors
<div className="bg-surface text-fg">
  <p className="text-fg">Content</p>
</div>
```

## Common Patterns

### Cards and Containers

```tsx
<div className="bg-surface border border-border rounded-lg p-6">
  <h3 className="text-fg font-semibold">Title</h3>
  <p className="text-muted">Description</p>
</div>
```

### Buttons

```tsx
// Primary button
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Primary Action
</button>

// Secondary button
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
  Secondary Action
</button>
```

### Forms

```tsx
<input 
  className="bg-surface border border-border text-fg placeholder-muted focus:ring-2 focus:ring-primary"
  placeholder="Enter text..."
/>
```

### Navigation

```tsx
<nav className="bg-surface/95 border-b border-border">
  <a className="text-fg hover:text-primary">Link</a>
</nav>
```

## ESLint Rules

The project includes ESLint rules that prevent the use of hardcoded colors:

- `text-white` → Use `text-fg`, `text-primary-foreground`, or `text-surface-foreground`
- `bg-white` → Use `bg-surface`, `bg-bg`, or `bg-primary-foreground`

## Benefits

1. **Consistency** - All colors are defined in one place
2. **Accessibility** - Proper contrast ratios are maintained
3. **Theme Support** - Automatic dark/light mode switching
4. **Maintainability** - Easy to change colors globally
5. **No More White-on-White** - Semantic colors prevent visibility issues

## Implementation

The color system is implemented through:

1. CSS variables in `src/app/globals.css`
2. Tailwind configuration in `tailwind.config.js`
3. ESLint rules in `eslint.config.mjs`
4. Component updates throughout the codebase

## Future Enhancements

- Custom theme support (user-defined themes)
- High contrast mode
- Color scheme preferences
- Brand color customization
