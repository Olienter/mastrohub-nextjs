-- Enable RLS on articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Anyone can read published articles" ON articles
  FOR SELECT USING (status = 'published');

-- Policy: Authors can read their own articles
CREATE POLICY "Authors can read own articles" ON articles
  FOR SELECT USING (auth.uid() = author_id);

-- Policy: Contributors can create articles
CREATE POLICY "Contributors can create articles" ON articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('contributor', 'moderator', 'admin')
    )
  );

-- Policy: Authors can update their own articles
CREATE POLICY "Authors can update own articles" ON articles
  FOR UPDATE USING (auth.uid() = author_id);

-- Policy: Moderators can update any article
CREATE POLICY "Moderators can update any article" ON articles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('moderator', 'admin')
    )
  );

-- Policy: Authors can delete their own articles
CREATE POLICY "Authors can delete own articles" ON articles
  FOR DELETE USING (auth.uid() = author_id);

-- Policy: Admins can delete any article
CREATE POLICY "Admins can delete any article" ON articles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  ); 