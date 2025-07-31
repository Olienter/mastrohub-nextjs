# 🍽️ MastroHub - Restaurant Management Blog

A modern, full-featured blog platform built with Next.js 15, Supabase, and Tailwind CSS. Designed specifically for restaurant owners and managers to share insights, strategies, and industry knowledge.

## ✨ Features

- **📝 Blog System** - MDX-powered content with rich formatting
- **🔐 Authentication** - Supabase Auth with user profiles
- **🎨 Theme System** - Light, dark, and system themes
- **🏆 Badge Engine** - Gamification system for user engagement
- **💬 Community Features** - Comments, reactions, and bookmarks
- **📊 Dashboard** - User management and analytics
- **📱 Responsive Design** - Mobile-first approach
- **⚡ Performance** - Optimized for speed and SEO

## 🚀 Tech Stack

- **Framework**: Next.js 15.4.4 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mastrohub-nextjs.git
   cd mastrohub-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MastroHub Blog

# Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🗄️ Database Setup

1. **Create Supabase project** at [supabase.com](https://supabase.com)
2. **Run SQL migrations** in Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  category TEXT,
  read_time INTEGER,
  author TEXT,
  author_title TEXT,
  author_avatar TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  fact_checked BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft'
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Articles are viewable by everyone" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert articles" ON articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own articles" ON articles
  FOR UPDATE USING (auth.uid()::text = author);
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── dashboard/         # Admin dashboard
│   ├── login/             # Authentication pages
│   └── register/
├── components/            # Reusable components
│   ├── blog/             # Blog-specific components
│   ├── calculators/      # Calculator components
│   └── ui/               # UI components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
└── types/                # TypeScript types
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://framer.com/motion/) - Animation library

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact us at support@mastrohub.com.

---

**Built with ❤️ for the restaurant community**
