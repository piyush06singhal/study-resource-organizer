-- Advanced Features Migration: Flashcards, Search, and Export/Import
-- Run this migration in your Supabase SQL Editor to add the new features
-- After running this migration, restart your dev server

-- Flashcards System Tables

-- Flashcard Decks
CREATE TABLE flashcard_decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  hint TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcard Reviews (Spaced Repetition)
CREATE TABLE flashcard_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
  ease_factor DECIMAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review_date DATE NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search History
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}'::jsonb,
  result_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Searches
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Export History
CREATE TABLE export_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('pdf', 'csv', 'json', 'backup')),
  file_name TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared Decks
CREATE TABLE shared_decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  share_code TEXT UNIQUE NOT NULL,
  access_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_flashcard_decks_user_id ON flashcard_decks(user_id);
CREATE INDEX idx_flashcard_decks_topic_id ON flashcard_decks(topic_id);
CREATE INDEX idx_flashcards_deck_id ON flashcards(deck_id);
CREATE INDEX idx_flashcard_reviews_flashcard_id ON flashcard_reviews(flashcard_id);
CREATE INDEX idx_flashcard_reviews_next_review ON flashcard_reviews(user_id, next_review_date);
CREATE INDEX idx_search_history_user_id ON search_history(user_id, created_at DESC);
CREATE INDEX idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX idx_export_history_user_id ON export_history(user_id, created_at DESC);
CREATE INDEX idx_shared_decks_code ON shared_decks(share_code);

-- Full-text search indexes
CREATE INDEX idx_resources_search ON resources USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '')));
CREATE INDEX idx_topics_search ON topics USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_subjects_search ON subjects USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- RLS Policies
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_decks ENABLE ROW LEVEL SECURITY;

-- Flashcard Decks Policies
CREATE POLICY "Users can view own and public decks" ON flashcard_decks FOR SELECT 
  USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can create own decks" ON flashcard_decks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own decks" ON flashcard_decks FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own decks" ON flashcard_decks FOR DELETE 
  USING (auth.uid() = user_id);

-- Flashcards Policies
CREATE POLICY "Users can view flashcards from accessible decks" ON flashcards FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM flashcard_decks WHERE flashcard_decks.id = flashcards.deck_id AND flashcard_decks.is_public = true
  ));
CREATE POLICY "Users can create own flashcards" ON flashcards FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcards" ON flashcards FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own flashcards" ON flashcards FOR DELETE 
  USING (auth.uid() = user_id);

-- Flashcard Reviews Policies
CREATE POLICY "Users can view own reviews" ON flashcard_reviews FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create own reviews" ON flashcard_reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON flashcard_reviews FOR UPDATE 
  USING (auth.uid() = user_id);

-- Search History Policies
CREATE POLICY "Users can view own search history" ON search_history FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create own search history" ON search_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own search history" ON search_history FOR DELETE 
  USING (auth.uid() = user_id);

-- Saved Searches Policies
CREATE POLICY "Users can view own saved searches" ON saved_searches FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create own saved searches" ON saved_searches FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved searches" ON saved_searches FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved searches" ON saved_searches FOR DELETE 
  USING (auth.uid() = user_id);

-- Export History Policies
CREATE POLICY "Users can view own export history" ON export_history FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create own export history" ON export_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Shared Decks Policies
CREATE POLICY "Anyone can view shared decks" ON shared_decks FOR SELECT 
  USING (true);
CREATE POLICY "Users can create own shared decks" ON shared_decks FOR INSERT 
  WITH CHECK (auth.uid() = shared_by);
CREATE POLICY "Users can delete own shared decks" ON shared_decks FOR DELETE 
  USING (auth.uid() = shared_by);

-- Triggers
CREATE TRIGGER update_flashcard_decks_updated_at BEFORE UPDATE ON flashcard_decks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate share code
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
BEGIN
  RETURN substring(md5(random()::text || clock_timestamp()::text) from 1 for 8);
END;
$$ LANGUAGE plpgsql;

-- Function for full-text search
CREATE OR REPLACE FUNCTION search_all_content(
  search_query TEXT,
  user_id_param UUID
)
RETURNS TABLE (
  id UUID,
  type TEXT,
  title TEXT,
  content TEXT,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    'resource'::TEXT as type,
    r.title,
    COALESCE(r.content, '')::TEXT,
    ts_rank(to_tsvector('english', r.title || ' ' || COALESCE(r.content, '')), plainto_tsquery('english', search_query)) as relevance
  FROM resources r
  WHERE r.user_id = user_id_param
    AND to_tsvector('english', r.title || ' ' || COALESCE(r.content, '')) @@ plainto_tsquery('english', search_query)
  
  UNION ALL
  
  SELECT 
    t.id,
    'topic'::TEXT,
    t.name,
    COALESCE(t.description, '')::TEXT,
    ts_rank(to_tsvector('english', t.name || ' ' || COALESCE(t.description, '')), plainto_tsquery('english', search_query))
  FROM topics t
  WHERE t.user_id = user_id_param
    AND to_tsvector('english', t.name || ' ' || COALESCE(t.description, '')) @@ plainto_tsquery('english', search_query)
  
  UNION ALL
  
  SELECT 
    s.id,
    'subject'::TEXT,
    s.name,
    COALESCE(s.description, '')::TEXT,
    ts_rank(to_tsvector('english', s.name || ' ' || COALESCE(s.description, '')), plainto_tsquery('english', search_query))
  FROM subjects s
  WHERE s.user_id = user_id_param
    AND to_tsvector('english', s.name || ' ' || COALESCE(s.description, '')) @@ plainto_tsquery('english', search_query)
  
  ORDER BY relevance DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
