-- Enable RLS on comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read non-deleted comments
CREATE POLICY "Anyone can read non-deleted comments" ON comments
  FOR SELECT USING (is_deleted = FALSE);

-- Policy: Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Policy: Authors can update their own comments
CREATE POLICY "Authors can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

-- Policy: Authors can delete their own comments
CREATE POLICY "Authors can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- Policy: Moderators can delete any comment
CREATE POLICY "Moderators can delete any comment" ON comments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('moderator', 'admin')
    )
  );

-- Enable RLS on reactions table
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reactions
CREATE POLICY "Anyone can read reactions" ON reactions
  FOR SELECT USING (true);

-- Policy: Authenticated users can create reactions
CREATE POLICY "Authenticated users can create reactions" ON reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reactions
CREATE POLICY "Users can update own reactions" ON reactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own reactions
CREATE POLICY "Users can delete own reactions" ON reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on bookmarks table
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own bookmarks
CREATE POLICY "Users can read own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Authenticated users can create bookmarks
CREATE POLICY "Authenticated users can create bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id); 