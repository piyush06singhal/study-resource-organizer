'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Spaced Repetition Algorithm (SM-2)
function calculateNextReview(quality: number, easeFactor: number, interval: number, repetitions: number) {
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEaseFactor < 1.3) newEaseFactor = 1.3

  let newInterval: number
  let newRepetitions: number

  if (quality < 3) {
    newInterval = 1
    newRepetitions = 0
  } else {
    if (repetitions === 0) {
      newInterval = 1
    } else if (repetitions === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * newEaseFactor)
    }
    newRepetitions = repetitions + 1
  }

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
}

export async function createDeck(data: {
  name: string
  description?: string
  topicId?: string
  subjectId?: string
  tags?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: deck, error } = await supabase
    .from('flashcard_decks')
    .insert({
      user_id: user.id,
      name: data.name,
      description: data.description,
      topic_id: data.topicId,
      subject_id: data.subjectId,
      tags: data.tags || []
    } as any)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/flashcards')
  return deck
}

export async function getDecks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('flashcard_decks')
    .select(`
      *,
      subjects(name, color),
      topics(name)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getDeck(deckId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('flashcard_decks')
    .select(`
      *,
      subjects(name, color),
      topics(name),
      flashcards(*)
    `)
    .eq('id', deckId)
    .single()

  if (error) throw error
  return data
}

export async function updateDeck(deckId: string, updates: {
  name?: string
  description?: string
  isPublic?: boolean
  tags?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: any = {
    name: updates.name,
    description: updates.description,
    is_public: updates.isPublic,
    tags: updates.tags
  }

  const { data, error } = await (supabase
    .from('flashcard_decks') as any)
    .update(updateData)
    .eq('id', deckId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/flashcards')
  return data
}

export async function deleteDeck(deckId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('flashcard_decks')
    .delete()
    .eq('id', deckId)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/flashcards')
}

export async function createFlashcard(data: {
  deckId: string
  front: string
  back: string
  hint?: string
  imageUrl?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: flashcard, error } = await supabase
    .from('flashcards')
    .insert({
      deck_id: data.deckId,
      user_id: user.id,
      front: data.front,
      back: data.back,
      hint: data.hint,
      image_url: data.imageUrl
    } as any)
    .select()
    .single()

  if (error) throw error
  revalidatePath(`/flashcards/${data.deckId}`)
  return flashcard
}

export async function updateFlashcard(flashcardId: string, updates: {
  front?: string
  back?: string
  hint?: string
  imageUrl?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: any = {
    front: updates.front,
    back: updates.back,
    hint: updates.hint,
    image_url: updates.imageUrl
  }

  const { data, error } = await (supabase
    .from('flashcards') as any)
    .update(updateData)
    .eq('id', flashcardId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/flashcards')
  return data
}

export async function deleteFlashcard(flashcardId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', flashcardId)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/flashcards')
}

export async function reviewFlashcard(flashcardId: string, quality: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: lastReview } = await supabase
    .from('flashcard_reviews')
    .select('*')
    .eq('flashcard_id', flashcardId)
    .eq('user_id', user.id)
    .order('reviewed_at', { ascending: false })
    .limit(1)
    .single()

  const currentEase = (lastReview as any)?.ease_factor || 2.5
  const currentInterval = (lastReview as any)?.interval_days || 1
  const currentReps = (lastReview as any)?.repetitions || 0

  const nextReview = calculateNextReview(quality, currentEase, currentInterval, currentReps)

  const { data, error } = await supabase
    .from('flashcard_reviews')
    .insert({
      flashcard_id: flashcardId,
      user_id: user.id,
      quality,
      ease_factor: nextReview.easeFactor,
      interval_days: nextReview.interval,
      repetitions: nextReview.repetitions,
      next_review_date: nextReview.nextReviewDate
    } as any)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getDueFlashcards(deckId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const today = new Date().toISOString().split('T')[0]

  let query = supabase
    .from('flashcard_reviews')
    .select(`
      *,
      flashcards(*, flashcard_decks(name))
    `)
    .eq('user_id', user.id)
    .lte('next_review_date', today)

  if (deckId) {
    query = query.eq('flashcards.deck_id', deckId)
  }

  const { data, error } = await query.order('next_review_date', { ascending: true })

  if (error) throw error
  return data
}

export async function shareDeck(deckId: string, expiresInDays?: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const shareCode = Math.random().toString(36).substring(2, 10)
  const expiresAt = expiresInDays 
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null

  const { data, error } = await supabase
    .from('shared_decks')
    .insert({
      deck_id: deckId,
      shared_by: user.id,
      share_code: shareCode,
      expires_at: expiresAt
    } as any)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function importSharedDeck(shareCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: sharedDeck, error: shareError } = await supabase
    .from('shared_decks')
    .select('*, flashcard_decks(*, flashcards(*))')
    .eq('share_code', shareCode)
    .single()

  if (shareError) throw new Error('Invalid share code')

  const originalDeck = (sharedDeck as any).flashcard_decks as any
  
  const { data: newDeck, error: deckError } = await supabase
    .from('flashcard_decks')
    .insert({
      user_id: user.id,
      name: `${originalDeck.name} (Imported)`,
      description: originalDeck.description,
      tags: originalDeck.tags
    } as any)
    .select()
    .single()

  if (deckError) throw deckError

  if (originalDeck.flashcards?.length > 0) {
    const flashcardsToInsert = originalDeck.flashcards.map((card: any) => ({
      deck_id: (newDeck as any).id,
      user_id: user.id,
      front: card.front,
      back: card.back,
      hint: card.hint,
      image_url: card.image_url,
      order_index: card.order_index
    }))

    const { error: cardsError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert as any)

    if (cardsError) throw cardsError
  }

  const updateData: any = { access_count: (sharedDeck as any).access_count + 1 }
  await (supabase
    .from('shared_decks') as any)
    .update(updateData)
    .eq('id', (sharedDeck as any).id)

  revalidatePath('/flashcards')
  return newDeck
}

export async function exportDeck(deckId: string, format: 'json' | 'csv') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const deck = await getDeck(deckId)
  
  if (format === 'json') {
    return JSON.stringify(deck, null, 2)
  } else {
    const flashcards = (deck as any).flashcards as any[]
    const csv = [
      'Front,Back,Hint',
      ...flashcards.map(card => 
        `"${card.front}","${card.back}","${card.hint || ''}"`
      )
    ].join('\n')
    return csv
  }
}

export async function importDeck(deckId: string, data: string, format: 'json' | 'csv') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  let flashcards: any[] = []

  if (format === 'json') {
    const parsed = JSON.parse(data)
    flashcards = parsed.flashcards || []
  } else {
    const lines = data.split('\n').slice(1)
    flashcards = lines.map(line => {
      const [front, back, hint] = line.split(',').map(s => s.replace(/^"|"$/g, ''))
      return { front, back, hint }
    })
  }

  const flashcardsToInsert = flashcards.map(card => ({
    deck_id: deckId,
    user_id: user.id,
    front: card.front,
    back: card.back,
    hint: card.hint
  }))

  const { error } = await supabase
    .from('flashcards')
    .insert(flashcardsToInsert as any)

  if (error) throw error
  revalidatePath(`/flashcards/${deckId}`)
}
