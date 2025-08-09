# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2024-12-19

### 🎨 Added - Theme System Overhaul

- **Semantic Color System**: Implemented a comprehensive semantic color system using CSS variables
  - Added core color tokens: `bg`, `surface`, `fg`, `muted`, `primary`, `secondary`, `accent`, `destructive`, `border`, `input`, `ring`
  - Support for both light and dark themes
  - Automatic theme switching based on `prefers-color-scheme`

- **Global CSS Variables**: Added CSS variables in `src/app/globals.css`
  - Light theme colors with proper contrast ratios
  - Dark theme colors for better accessibility
  - Consistent color tokens across the entire application

- **Tailwind Configuration**: Updated `tailwind.config.js`
  - Added semantic color tokens that reference CSS variables
  - Maintained backward compatibility with existing custom colors
  - Integrated with existing design system

- **Component Updates**: Migrated all components to use semantic colors
  - Navigation component updated with new color tokens
  - Menu Maker page fully migrated
  - Language Switcher component updated
  - All forms, buttons, and interactive elements updated

- **ESLint Rules**: Added custom ESLint rules
  - Prevents usage of `text-white` and `bg-white`
  - Enforces semantic color usage
  - Provides helpful error messages with alternatives

- **Documentation**: Created comprehensive theme documentation
  - Usage guidelines and examples
  - Migration guide from old system
  - Common patterns and best practices

### 🐛 Fixed - White-on-White Text Issues

- **Global Fix**: Resolved all white text on white background issues
  - Systematic approach using semantic colors
  - Proper contrast ratios maintained
  - Accessibility improvements

- **Component-Specific Fixes**:
  - Fixed text visibility in search bars and inputs
  - Resolved dropdown text contrast issues
  - Fixed button text visibility
  - Corrected navigation text colors

### 🔧 Technical Improvements

- **Performance**: Optimized color system for better performance
- **Maintainability**: Centralized color management
- **Scalability**: Easy to extend with new themes
- **Accessibility**: WCAG compliant contrast ratios

### 📚 Documentation

- Added `docs/theme.md` with comprehensive theme system documentation
- Updated component usage examples
- Migration guide for existing code
- Best practices and common patterns

## [Unreleased]

### Added
- Initial project setup
- Next.js 15 with App Router
- Supabase integration
- Blog system with MDX support
- Authentication system
- Admin panel
- User dashboard
- Badge system
- Comment and reaction system
- Bookmark functionality
- Search and filtering
- Responsive design
- Dark/light theme support
- SEO optimization
- Performance monitoring

### Changed
- Updated to Next.js 15.4.4
- Migrated to Tailwind CSS 4.0
- Improved build performance
- Enhanced security headers

### Fixed
- TypeScript compilation errors
- ESLint configuration issues
- Build optimization
- Environment variable handling

## [0.1.0] - 2025-07-31

### Added
- Initial release
- Core blog functionality
- Restaurant management tools
- User authentication
- Content management system
- Zero-cost deployment model

---

## Version History

- **0.1.0** - Initial release with core functionality
- **Unreleased** - Development version with latest features

## Release Notes

### v0.1.0
- First public release
- Complete blog system
- Restaurant management tools
- User authentication and profiles
- Admin panel for content management
- Responsive design for all devices
- SEO optimization
- Performance monitoring
- Zero-cost deployment ready

---

For detailed information about each release, see the [GitHub releases page](https://github.com/oliebodnar/mastrohub-nextjs/releases). 