-- Create articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL,
  author TEXT NOT NULL,
  author_title TEXT,
  author_avatar TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'pending', 'published')),
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  fact_checked BOOLEAN DEFAULT false,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'reader' CHECK (role IN ('reader', 'contributor', 'moderator', 'admin')),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  subscription_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT N 