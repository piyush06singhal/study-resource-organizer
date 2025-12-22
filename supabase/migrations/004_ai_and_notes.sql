-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'markdown' CHECK (content_type IN ('markdown', 'rich_text')),
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Study Plans table
CREATE TABLE IF NOT EXISTS ai_study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goals TEXT[] DEFAULT '{}',
  generated_tasks JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topic Difficulty table
CREATE TABLE IF NOT EXISTS topic_difficulty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  difficulty_score INTEGER DEFAULT 50 CHECK (difficulty_score >= 0 AND difficulty_score <= 100),
  confidence_level INTEGER DEFAULT 50 CHECK (confidence_level >= 0 AND confidence_level <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  revision_count INTEGER DEFAULT 0,
  last_reviewed DATE,
  predicted_mastery_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Study Recommendations table
CREATE TABLE IF NOT EXISTS study_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('topic', 'time', 'revision', 'break')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority INTEGER DEFAULT 50,
  metadata JSONB DEFAULT '{}',
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject_id ON notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_topic_id ON notes(topic_id);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_study_plans_user_id ON ai_study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_study_plans_status ON ai_study_plans(status);

CREATE INDEX IF NOT EXISTS idx_topic_difficulty_user_id ON topic_difficulty(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_difficulty_topic_id ON topic_difficulty(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_difficulty_score ON topic_difficulty(difficulty_score DESC);

CREATE INDEX IF NOT EXISTS idx_study_recommendations_user_id ON study_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_study_recommendations_dismissed ON study_recommendations(is_dismissed);
CREATE INDEX IF NOT EXISTS idx_study_recommendations_priority ON study_recommendations(priority DESC);

-- RLS Policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_difficulty ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_recommendations ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Users can view their own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- AI Study Plans policies
CREATE POLICY "Users can view their own AI study plans" ON ai_study_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI study plans" ON ai_study_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI study plans" ON ai_study_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI study plans" ON ai_study_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Topic Difficulty policies
CREATE POLICY "Users can view their own topic difficulty" ON topic_difficulty
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own topic difficulty" ON topic_difficulty
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic difficulty" ON topic_difficulty
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topic difficulty" ON topic_difficulty
  FOR DELETE USING (auth.uid() = user_id);

-- Study Recommendations policies
CREATE POLICY "Users can view their own recommendations" ON study_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations" ON study_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" ON study_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations" ON study_recommendations
  FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_study_plans_updated_at BEFORE UPDATE ON ai_study_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_difficulty_updated_at BEFORE UPDATE ON topic_difficulty
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
