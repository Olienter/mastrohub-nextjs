# Contributing to MastroHub

Thank you for your interest in contributing to MastroHub! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/mastrohub-nextjs.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see `.env.example`)
5. Start development server: `npm run dev`

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### Component Structure
```typescript
// components/feature/ComponentName.tsx
import React from 'react';

interface ComponentNameProps {
  // Define props
}

export default function ComponentName({ prop }: ComponentNameProps) {
  return (
    // JSX
  );
}
```

### File Naming
- Components: PascalCase (e.g., `BlogCard.tsx`)
- Pages: kebab-case (e.g., `blog/[slug]/page.tsx`)
- Utilities: camelCase (e.g., `supabase.ts`)

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots if applicable

## 💡 Feature Requests

For feature requests:
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Check existing issues first

## 🔧 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format
```
type(scope): description

Examples:
feat(blog): add article search functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📚 Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Include usage examples
- Update API documentation

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Accessibility improvements
- Security enhancements
- Bug fixes

### Medium Priority
- New features
- UI/UX improvements
- Documentation updates
- Test coverage

### Low Priority
- Code refactoring
- Dependency updates
- Minor UI tweaks

## 🤝 Community

- Be respectful and inclusive
- Help other contributors
- Share knowledge and best practices
- Report issues promptly

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MastroHub! 🍽️ 