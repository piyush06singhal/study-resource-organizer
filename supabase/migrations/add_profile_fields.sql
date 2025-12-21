-- Add additional profile fields for settings
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
