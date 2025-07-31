-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  max_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  articles_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  reactions_given INTEGER DEFAULT 0,
  reactions_received INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,
  days_active INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked_at ON user_badges(unlocked_at);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_total_points ON user_progress(total_points);
CREATE INDEX IF NOT EXISTS idx_user_progress_level ON user_progress(level);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create triggers for updated_at
CREATE TRIGGER update_user_badges_updated_at BEFORE UPDATE ON user_badges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user progress when articles are created/updated/deleted
CREATE OR REPLACE FUNCTION update_user_progress_on_article_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment articles count when article is created
    INSERT INTO user_progress (user_id, articles_count, total_points, level, last_activity)
    VALUES (NEW.author_id, 1, 10, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      articles_count = user_progress.articles_count + 1,
      total_points = user_progress.total_points + 10,
      level = FLOOR((user_progress.total_points + 10) / 100) + 1,
      last_activity = NOW(),
      updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement articles count when article is deleted
    UPDATE user_progress SET
      articles_count = GREATEST(articles_count - 1, 0),
      total_points = GREATEST(total_points - 10, 0),
      level = GREATEST(FLOOR((total_points - 10) / 100) + 1, 1),
      last_activity = NOW(),
      updated_at = NOW()
    WHERE user_id = OLD.author_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update user progress when comments are created/deleted
CREATE OR REPLACE FUNCTION update_user_progress_on_comment_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment comments count when comment is created
    INSERT INTO user_progress (user_id, comments_count, total_points, level, last_activity)
    VALUES (NEW.author_id, 1, 5, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      comments_count = user_progress.comments_count + 1,
      total_points = user_progress.total_points + 5,
      level = FLOOR((user_progress.total_points + 5) / 100) + 1,
      last_activity = NOW(),
      updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement comments count when comment is deleted
    UPDATE user_progress SET
      comments_count = GREATEST(comments_count - 1, 0),
      total_points = GREATEST(total_points - 5, 0),
      level = GREATEST(FLOOR((total_points - 5) / 100) + 1, 1),
      last_activity = NOW(),
      updated_at = NOW()
    WHERE user_id = OLD.author_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update user progress when reactions are created/deleted
CREATE OR REPLACE FUNCTION update_user_progress_on_reaction_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment reactions given count when reaction is created
    INSERT INTO user_progress (user_id, reactions_given, total_points, level, last_activity)
    VALUES (NEW.user_id, 1, 2, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      reactions_given = user_progress.reactions_given + 1,
      total_points = user_progress.total_points + 2,
      level = FLOOR((user_progress.total_points + 2) / 100) + 1,
      last_activity = NOW(),
      updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement reactions given count when reaction is deleted
    UPDATE user_progress SET
      reactions_given = GREATEST(reactions_given - 1, 0),
      total_points = GREATEST(total_points - 2, 0),
      level = GREATEST(FLOOR((total_points - 2) / 100) + 1, 1),
      last_activity = NOW(),
      updated_at = NOW()
    WHERE user_id = OLD.user_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update user progress when bookmarks are created/deleted
CREATE OR REPLACE FUNCTION update_user_progress_on_bookmark_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment bookmarks count when bookmark is created
    INSERT INTO user_progress (user_id, bookmarks_count, total_points, level, last_activity)
    VALUES (NEW.user_id, 1, 3, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      bookmarks_count = user_progress.bookmarks_count + 1,
      total_points = user_progress.total_points + 3,
      level = FLOOR((user_progress.total_points + 3) / 100) + 1,
      last_activity = NOW(),
      updated_at = NOW();
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement bookmarks count when bookmark is deleted
    UPDATE user_progress SET
      bookmarks_count = GREATEST(bookmarks_count - 1, 0),
      total_points = GREATEST(total_points - 3, 0),
      level = GREATEST(FLOOR((total_points - 3) / 100) + 1, 1),
      last_activity = NOW(),
      updated_at = NOW()
    WHERE user_id = OLD.user_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic progress updates
CREATE TRIGGER trigger_article_progress
  AFTER INSERT OR DELETE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_user_progress_on_article_change();

CREATE TRIGGER trigger_comment_progress
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_user_progress_on_comment_change();

CREATE TRIGGER trigger_reaction_progress
  AFTER INSERT OR DELETE ON reactions
  FOR EACH ROW EXECUTE FUNCTION update_user_progress_on_reaction_change();

CREATE TRIGGER trigger_bookmark_progress
  AFTER INSERT OR DELETE ON bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_user_progress_on_bookmark_change(); 