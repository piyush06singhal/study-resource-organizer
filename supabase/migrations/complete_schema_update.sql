-- Complete Schema Update for StudyFlow
-- This migration adds all missing fields and ensures proper email verification flow

-- Add missing fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS study_goal TEXT,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "deadlines": true,
  "revisions": true,
  "achievements": true,
  "reminders": true,
  "email": false
}'::jsonb;

-- Update existing profiles to have default notification preferences
UPDATE profiles 
SET notification_preferences = '{
  "deadlines": true,
  "revisions": true,
  "achievements": true,
  "reminders": true,
  "email": false
}'::jsonb
WHERE notification_preferences IS NULL;

-- Fix notifications table column names (should be 'read' not 'is_read')
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'is_read'
  ) THEN
    ALTER TABLE notifications RENAME COLUMN is_read TO read;
  END IF;
END $$;

-- Add 'read' column if it doesn't exist
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false;

-- Add 'link' column for notification navigation
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS link TEXT;

-- Update notification type check constraint to include all types
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('deadline', 'revision', 'achievement', 'reminder', 'general'));

-- Create index for notification read status
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

-- Update the handle_new_user function to include all fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    notification_preferences
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    '{
      "deadlines": true,
      "revisions": true,
      "achievements": true,
      "reminders": true,
      "email": false
    }'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to send welcome notification
CREATE OR REPLACE FUNCTION public.send_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    link
  )
  VALUES (
    NEW.id,
    'general',
    'Welcome to StudyFlow! 🎉',
    'Get started by creating your first subject and organizing your study materials.',
    '/dashboard'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for welcome notification
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.send_welcome_notification();

-- Create a function to check for upcoming deadlines
CREATE OR REPLACE FUNCTION public.check_upcoming_deadlines()
RETURNS void AS $$
DECLARE
  deadline_record RECORD;
BEGIN
  -- Find deadlines due in the next 24 hours that haven't sent reminders
  FOR deadline_record IN
    SELECT d.id, d.user_id, d.title, d.due_date, d.type
    FROM deadlines d
    WHERE d.status = 'pending'
      AND d.reminder_sent = false
      AND d.due_date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
  LOOP
    -- Create notification
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      link
    )
    VALUES (
      deadline_record.user_id,
      'deadline',
      'Deadline Reminder: ' || deadline_record.title,
      'Your ' || deadline_record.type || ' is due in less than 24 hours!',
      '/deadlines/' || deadline_record.id
    );
    
    -- Mark reminder as sent
    UPDATE deadlines
    SET reminder_sent = true
    WHERE id = deadline_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to check for due revisions
CREATE OR REPLACE FUNCTION public.check_due_revisions()
RETURNS void AS $$
DECLARE
  revision_record RECORD;
BEGIN
  -- Find revisions due today
  FOR revision_record IN
    SELECT r.id, r.user_id, t.name as topic_name, r.next_revision_date
    FROM revisions r
    JOIN topics t ON r.topic_id = t.id
    WHERE r.next_revision_date <= CURRENT_DATE
      AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.user_id = r.user_id
          AND n.type = 'revision'
          AND n.message LIKE '%' || t.name || '%'
          AND n.created_at::date = CURRENT_DATE
      )
  LOOP
    -- Create notification
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      link
    )
    VALUES (
      revision_record.user_id,
      'revision',
      'Time to Revise: ' || revision_record.topic_name,
      'This topic is due for revision today. Keep up the good work!',
      '/revisions'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to track study streaks
CREATE OR REPLACE FUNCTION public.calculate_study_streak(p_user_id UUID)
RETURNS TABLE(current_streak INTEGER, longest_streak INTEGER) AS $$
DECLARE
  v_current_streak INTEGER := 0;
  v_longest_streak INTEGER := 0;
  v_temp_streak INTEGER := 0;
  v_last_date DATE;
  session_date DATE;
BEGIN
  -- Calculate current streak
  FOR session_date IN
    SELECT DISTINCT DATE(start_time) as session_date
    FROM study_sessions
    WHERE user_id = p_user_id
      AND end_time IS NOT NULL
    ORDER BY session_date DESC
  LOOP
    IF v_last_date IS NULL THEN
      v_last_date := session_date;
      v_current_streak := 1;
    ELSIF v_last_date - session_date = 1 THEN
      v_current_streak := v_current_streak + 1;
      v_last_date := session_date;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  -- Calculate longest streak
  v_temp_streak := 0;
  v_last_date := NULL;
  
  FOR session_date IN
    SELECT DISTINCT DATE(start_time) as session_date
    FROM study_sessions
    WHERE user_id = p_user_id
      AND end_time IS NOT NULL
    ORDER BY session_date ASC
  LOOP
    IF v_last_date IS NULL THEN
      v_temp_streak := 1;
    ELSIF session_date - v_last_date = 1 THEN
      v_temp_streak := v_temp_streak + 1;
    ELSE
      IF v_temp_streak > v_longest_streak THEN
        v_longest_streak := v_temp_streak;
      END IF;
      v_temp_streak := 1;
    END IF;
    v_last_date := session_date;
  END LOOP;

  -- Check final streak
  IF v_temp_streak > v_longest_streak THEN
    v_longest_streak := v_temp_streak;
  END IF;

  RETURN QUERY SELECT v_current_streak, v_longest_streak;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create storage bucket for avatars (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage bucket for resources (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resources bucket
CREATE POLICY "Resource files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resources');

CREATE POLICY "Users can upload their own resources"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resources' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own resources"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resources' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own resources"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resources' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE subjects IS 'Academic subjects/courses';
COMMENT ON TABLE topics IS 'Topics within subjects';
COMMENT ON TABLE resources IS 'Study materials and resources';
COMMENT ON TABLE study_sessions IS 'Time tracking for study sessions';
COMMENT ON TABLE deadlines IS 'Assignment and exam deadlines';
COMMENT ON TABLE revisions IS 'Spaced repetition revision tracking';
COMMENT ON TABLE notifications IS 'User notifications and alerts';

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates profile when user signs up';
COMMENT ON FUNCTION send_welcome_notification() IS 'Sends welcome notification to new users';
COMMENT ON FUNCTION check_upcoming_deadlines() IS 'Checks for deadlines in next 24 hours and creates notifications';
COMMENT ON FUNCTION check_due_revisions() IS 'Checks for revisions due today and creates notifications';
COMMENT ON FUNCTION calculate_study_streak(UUID) IS 'Calculates current and longest study streaks for a user';
