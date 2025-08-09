# MastroHub - Restaurant Management Platform

## 🍽️ Project Overview

MastroHub is a comprehensive restaurant management platform built with Next.js 15, featuring AI-powered tools, analytics, and enterprise-grade features for modern gastronomy businesses.

## 🚀 Current Status

**Server Status**: ✅ Running on http://localhost:3000  
**Framework**: Next.js 15.4.4  
**Database**: Supabase  
**Authentication**: Custom Auth System  
**Styling**: Tailwind CSS 4.0  

## ⚠️ Known Issues (For GPT-5 Analysis)

### 1. **Metadata Warnings**
```
⚠ Unsupported metadata viewport is configured in metadata export in /. Please move it to viewport export instead.
⚠ Unsupported metadata themeColor is configured in metadata export in /. Please move it to viewport export instead.
```
**Files affected**: `src/app/layout.tsx`, `src/app/not-found.tsx`

### 2. **Missing API Endpoints**
```
GET /api/menu 401 in 2044ms
GET /api/categories 404 in 1529ms
GET /api/user 404 in 1454ms
GET /api/workspaces 401 in 894ms
```
**Missing files**: API routes need implementation

### 3. **Missing Assets**
```
GET /fonts/inter-var.woff2 404 in 38ms
GET /icons/icon-144x144.png 404 in 356ms
GET /icons/icon-192x192.png 404 in 75ms
```
**Missing files**: Fonts and PWA icons

### 4. **Webpack Configuration**
```
Warning: Reverting webpack devtool to 'false'.
```
**File**: `next.config.js` needs optimization

## 🏗️ Architecture

### Core Features
- **AI Assistant**: Menu optimization, pricing analysis
- **Analytics Dashboard**: Real-time restaurant metrics
- **Menu Engineering**: Profit margin optimization
- **QR Code Generation**: Digital menu system
- **Enterprise Tools**: Multi-location management
- **PWA Support**: Offline functionality

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS 4.0, Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom RBAC system
- **AI Integration**: OpenAI API (planned)
- **Deployment**: Vercel, Docker support

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── menu-maker/        # Menu creation tool
│   ├── analytics-insights/ # Analytics dashboard
│   └── enterprise/        # Enterprise features
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   └── menu-maker/       # Menu-specific components
├── lib/                  # Utility functions
├── contexts/             # React contexts
└── hooks/                # Custom hooks
```

## 🎯 Key Features

### 1. **Menu Maker**
- AI-powered menu optimization
- Price analysis and recommendations
- QR code generation for digital menus
- Ingredient analysis and cost tracking

### 2. **Analytics Dashboard**
- Real-time sales metrics
- Customer behavior analysis
- Performance monitoring
- Predictive analytics

### 3. **Enterprise Tools**
- Multi-location management
- Supply chain tracking
- Quality assurance system
- Security compliance

### 4. **AI Assistant**
- Menu engineering suggestions
- Pricing optimization
- Marketing recommendations
- Operational insights

## 🔧 Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Environment Variables

Create `.env.local` based on `env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

## 🐳 Docker Support

```bash
# Build and run with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📊 Database Schema

### Core Tables
- `profiles` - User profiles and preferences
- `workspaces` - Restaurant/location data
- `menus` - Menu items and categories
- `analytics` - Performance metrics
- `badges` - Achievement system

## 🎨 UI/UX Guidelines

### Design Principles
- **Professional**: LinkedIn/Facebook-inspired design
- **Gastronomic Theme**: Michelin-level aesthetics
- **Responsive**: Mobile-first approach
- **Accessible**: WCAG 2.1 compliance

### Color Scheme
- Primary: Professional blues and grays
- Accent: Gastronomic golds and earth tones
- Background: Clean whites and subtle gradients

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t mastrohub .
docker run -p 3000:3000 mastrohub
```

## 🔍 Performance Issues

### Current Problems
1. **Slow compilation**: 8.5s initial compile
2. **Missing assets**: 404 errors for fonts/icons
3. **API errors**: 401/404 responses
4. **Metadata warnings**: Next.js 15 compatibility

### Optimization Targets
- Reduce bundle size
- Implement proper caching
- Fix API endpoints
- Add missing assets

## 🤖 AI Integration Status

### Planned Features
- [ ] OpenAI API integration
- [ ] Menu optimization AI
- [ ] Pricing analysis
- [ ] Customer insights
- [ ] Predictive analytics

### Current Implementation
- Basic AI assistant interface
- Placeholder API routes
- Mock data for testing

## 📈 Analytics & Monitoring

### Implemented
- Performance monitoring
- Error tracking
- User analytics
- Real-time metrics

### Planned
- Advanced analytics dashboard
- Custom reporting
- Data export capabilities
- Integration with external tools

## 🔐 Security Features

### Implemented
- Role-based access control (RBAC)
- Authentication guards
- API route protection
- Input validation

### Planned
- Advanced security monitoring
- Compliance reporting
- Data encryption
- Audit logging

## 🌍 Internationalization

### Current Support
- Slovak (primary)
- English (secondary)
- Language switching
- RTL support (planned)

## 📱 PWA Features

### Implemented
- Service worker
- Offline support
- Install prompts
- App manifest

### Missing
- PWA icons
- Splash screens
- Offline data sync

## 🧪 Testing Strategy

### Current
- Basic component testing
- API route testing
- E2E test setup

### Planned
- Comprehensive test suite
- Performance testing
- Security testing
- Accessibility testing

## 📚 Documentation

### Available
- API documentation
- Component library
- Setup guides
- Deployment instructions

### Needed
- User guides
- Admin documentation
- Troubleshooting guides
- Video tutorials

## 🎯 Next Steps for GPT-5

### Priority Fixes
1. **Fix metadata warnings** - Update layout.tsx and not-found.tsx
2. **Implement missing APIs** - Create proper API routes
3. **Add missing assets** - Fonts and PWA icons
4. **Optimize webpack** - Fix next.config.js

### Architecture Improvements
1. **Performance optimization** - Reduce bundle size
2. **Error handling** - Implement proper error boundaries
3. **Type safety** - Improve TypeScript coverage
4. **Testing** - Add comprehensive tests

### Feature Enhancements
1. **AI integration** - Connect to OpenAI API
2. **Real-time features** - WebSocket implementation
3. **Advanced analytics** - Custom dashboards
4. **Mobile optimization** - PWA improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create GitHub issues
- Check documentation
- Review troubleshooting guides

---

**Last Updated**: December 2024  
**Version**: 0.1.0  
**Status**: Development  
**Target**: Production Ready
