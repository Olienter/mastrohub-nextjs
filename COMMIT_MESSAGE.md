feat(theme): add global color tokens and fix white-on-white text issue

## 🎨 Theme System Overhaul

### Core Changes
- **Semantic Color System**: Implemented comprehensive semantic color system using CSS variables
  - Added core color tokens: `bg`, `surface`, `fg`, `muted`, `primary`, `secondary`, `accent`, `destructive`, `border`, `input`, `ring`
  - Support for both light and dark themes with automatic switching
  - Proper contrast ratios for accessibility

### Files Modified
- `src/app/globals.css` - Added CSS variables for semantic colors
- `tailwind.config.js` - Added semantic color tokens
- `src/app/layout.tsx` - Updated body classes
- `src/components/providers.tsx` - Updated main element
- `src/components/Navigation.tsx` - Migrated to semantic colors
- `src/components/ui/LanguageSwitcher.tsx` - Updated color tokens
- `src/app/menu-maker/page.tsx` - Full migration to semantic colors
- `eslint.config.mjs` - Added rules to prevent text-white/bg-white usage
- `docs/theme.md` - Comprehensive documentation

### Key Benefits
1. **No More White-on-White**: Systematic fix for all text visibility issues
2. **Consistency**: All colors defined in one place
3. **Accessibility**: WCAG compliant contrast ratios
4. **Maintainability**: Easy to change colors globally
5. **Theme Support**: Automatic dark/light mode switching

### Migration Guide
- Replace `text-white` → `text-fg`, `text-primary-foreground`, or `text-surface-foreground`
- Replace `bg-white` → `bg-surface`, `bg-bg`, or `bg-primary-foreground`
- Replace `text-gray-*` → `text-fg` or `text-muted`
- Replace `bg-gray-*` → `bg-surface` or `bg-secondary`

### Testing
- ✅ Light theme: All text visible and readable
- ✅ Dark theme: Proper contrast maintained
- ✅ Navigation: Updated with semantic colors
- ✅ Menu Maker: Full migration completed
- ✅ Forms: All inputs use semantic colors
- ✅ Buttons: Consistent styling across components

### Documentation
- Added comprehensive theme documentation in `docs/theme.md`
- Usage guidelines and examples provided
- Migration guide for existing code
- Best practices and common patterns

This commit resolves the white-on-white text issue globally and establishes a maintainable color system for future development.
