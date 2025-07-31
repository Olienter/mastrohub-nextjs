# MastroHub Blog - Restaurant Management Software

## 🍽️ About

MastroHub is a comprehensive restaurant management platform that combines blog content with powerful restaurant management tools. Built with Next.js 15, Supabase, and modern web technologies.

## 🚀 Features

### Blog System
- **Modern Blog Interface** - Clean, responsive design
- **Admin Panel** - Easy content management
- **MDX Editor** - Rich text editing with markdown support
- **Categories & Tags** - Organized content structure
- **Search & Filter** - Advanced content discovery
- **Comments & Reactions** - Community engagement
- **Bookmarks** - Save favorite articles

### Restaurant Management Tools
- **Menu Engineering** - Data-driven menu optimization
- **Analytics Dashboard** - Performance insights
- **Forecast Planner** - Predictive analytics
- **Marketing Assistant** - Automated marketing tools
- **Restaurant Curator** - Content curation platform

### User System
- **Authentication** - Supabase Auth integration
- **User Profiles** - Customizable user profiles
- **Badge System** - Gamification and engagement
- **Progress Tracking** - User activity monitoring
- **Notifications** - Real-time updates

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS 4.0, Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Deployment:** Vercel
- **State Management:** Zustand
- **Content:** MDX, Markdown

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/oliebodnar/mastrohub-nextjs.git
cd mastrohub-nextjs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev
```

## 🔧 Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=your_ga_id
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── admin/             # Admin panel
│   └── dashboard/         # User dashboard
├── components/            # React components
│   ├── blog/             # Blog components
│   ├── auth/             # Authentication
│   ├── ui/               # UI components
│   └── features/         # Feature components
├── lib/                  # Utilities and configurations
├── contexts/             # React contexts
├── hooks/                # Custom hooks
└── data/                 # Static data and mock content
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Custom Domain
- Configure DNS records for your domain
- Add custom domain in Vercel dashboard
- SSL certificates are automatically provisioned

## 📊 Database Schema

### Core Tables
- `articles` - Blog posts and content
- `profiles` - User profiles and metadata
- `comments` - Article comments
- `reactions` - User reactions to content
- `bookmarks` - User bookmarks
- `user_badges` - Achievement system
- `user_progress` - User activity tracking
- `notifications` - User notifications

## 🎯 Key Features

### Zero-Cost Model
- Local storage fallback for content
- Hybrid data approach (Supabase + Local)
- No expensive dependencies

### Performance Optimized
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading

### SEO Ready
- Meta tags optimization
- Sitemap generation
- Robots.txt
- Structured data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@mastrohub.com or create an issue in this repository.

---

**Built with ❤️ by the MastroHub Team**
