-- Enable RLS on user_badges table
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own badges
CREATE POLICY "Users can read own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can create their own badges (when awarded by system)
CREATE POLICY "Users can create own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own badges (progress tracking)
CREATE POLICY "Users can update own badges" ON user_badges
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own badges
CREATE POLICY "Users can delete own badges" ON user_badges
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: Admins can manage all badges
CREATE POLICY "Admins can manage all badges" ON user_badges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Enable RLS on user_progress table
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own progress
CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can create their own progress
CREATE POLICY "Users can create own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own progress
CREATE POLICY "Users can delete own progress" ON user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: Admins can manage all progress
CREATE POLICY "Admins can manage all progress" ON user_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can create their own notifications
CREATE POLICY "Users can create own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: System can create notifications for users
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Policy: Admins can manage all notifications
CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  ); 