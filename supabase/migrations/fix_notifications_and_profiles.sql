-- Fix notifications and profiles tables
-- Run this migration if you're getting errors

-- Add missing column to notifications table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'is_read'
  ) THEN
    ALTER TABLE notifications ADD COLUMN is_read BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add missing columns to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'study_goal'
  ) THEN
    ALTER TABLE profiles ADD COLUMN study_goal TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN notification_preferences JSONB DEFAULT '{"deadline_reminders": true,"revision_reminders": true,"achievement_notifications": true,"study_reminders": true}'::jsonb;
  END IF;
END $$;

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Update existing profiles to have default notification preferences
UPDATE profiles 
SET notification_preferences = '{"deadline_reminders": true,"revision_reminders": true,"achievement_notifications": true,"study_reminders": true}'::jsonb
WHERE notification_preferences IS NULL;
