'use server'

import { createClient } from '@/lib/supabase/server'

export async function exportToCSV(type: 'subjects' | 'topics' | 'resources' | 'deadlines' | 'sessions') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  let csvData = ''
  let fileName = ''

  switch (type) {
    case 'subjects': {
      const { data } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
      
      if (data) {
        csvData = [
          'Name,Code,Color,Description,Created At',
          ...data.map((s: any) => 
            `"${s.name}","${s.code || ''}","${s.color}","${s.description || ''}","${s.created_at}"`
          )
        ].join('\n')
        fileName = 'subjects.csv'
      }
      break
    }

    case 'topics': {
      const { data } = await supabase
        .from('topics')
        .select('*, subjects(name)')
        .eq('user_id', user.id)
      
      if (data) {
        csvData = [
          'Name,Subject,Status,Priority,Description,Created At',
          ...data.map((t: any) => 
            `"${t.name}","${t.subjects?.name || ''}","${t.status}","${t.priority}","${t.description || ''}","${t.created_at}"`
          )
        ].join('\n')
        fileName = 'topics.csv'
      }
      break
    }

    case 'resources': {
      const { data } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', user.id)
      
      if (data) {
        csvData = [
          'Title,Type,URL,Tags,Created At',
          ...data.map((r: any) => 
            `"${r.title}","${r.type}","${r.url || ''}","${r.tags.join('; ')}","${r.created_at}"`
          )
        ].join('\n')
        fileName = 'resources.csv'
      }
      break
    }

    case 'deadlines': {
      const { data } = await supabase
        .from('deadlines')
        .select('*, subjects(name)')
        .eq('user_id', user.id)
      
      if (data) {
        csvData = [
          'Title,Subject,Type,Due Date,Priority,Status,Description',
          ...data.map((d: any) => 
            `"${d.title}","${d.subjects?.name || ''}","${d.type}","${d.due_date}","${d.priority}","${d.status}","${d.description || ''}"`
          )
        ].join('\n')
        fileName = 'deadlines.csv'
      }
      break
    }

    case 'sessions': {
      const { data } = await supabase
        .from('study_sessions')
        .select('*, subjects(name), topics(name)')
        .eq('user_id', user.id)
      
      if (data) {
        csvData = [
          'Subject,Topic,Start Time,End Time,Duration (min),Notes',
          ...data.map((s: any) => 
            `"${s.subjects?.name || ''}","${s.topics?.name || ''}","${s.start_time}","${s.end_time || ''}","${s.duration_minutes || ''}","${s.notes || ''}"`
          )
        ].join('\n')
        fileName = 'study_sessions.csv'
      }
      break
    }
  }

  await supabase
    .from('export_history' as any)
    .insert({
      user_id: user.id,
      export_type: 'csv',
      file_name: fileName,
      status: 'completed',
      metadata: { type }
    } as any)

  return { data: csvData, fileName }
}

export async function exportToJSON(includeAll = false) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const exportData: any = {}

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  exportData.profile = profile

  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user.id)
  exportData.subjects = subjects

  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .eq('user_id', user.id)
  exportData.topics = topics

  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', user.id)
  exportData.resources = resources

  const { data: deadlines } = await supabase
    .from('deadlines')
    .select('*')
    .eq('user_id', user.id)
  exportData.deadlines = deadlines

  const { data: studyPlans } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', user.id)
  exportData.studyPlans = studyPlans

  if (includeAll) {
    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
    exportData.studySessions = sessions

    const { data: revisions } = await supabase
      .from('revisions')
      .select('*')
      .eq('user_id', user.id)
    exportData.revisions = revisions

    const { data: decks } = await supabase
      .from('flashcard_decks')
      .select('*, flashcards(*)')
      .eq('user_id', user.id)
    exportData.flashcardDecks = decks
  }

  exportData.exportedAt = new Date().toISOString()
  exportData.version = '1.0'

  await supabase
    .from('export_history' as any)
    .insert({
      user_id: user.id,
      export_type: 'json',
      file_name: 'study_data_backup.json',
      status: 'completed',
      metadata: { includeAll }
    } as any)

  return JSON.stringify(exportData, null, 2)
}

export async function importFromJSON(jsonData: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const importData = JSON.parse(jsonData)
  const results: any = { success: [], failed: [] }

  if (importData.subjects) {
    for (const subject of importData.subjects) {
      const { id, user_id, created_at, updated_at, ...subjectData } = subject
      const { error } = await supabase
        .from('subjects')
        .insert({ ...subjectData, user_id: user.id })
      
      if (error) {
        results.failed.push({ type: 'subject', data: subject, error: error.message })
      } else {
        results.success.push({ type: 'subject', name: subject.name })
      }
    }
  }

  if (importData.topics) {
    for (const topic of importData.topics) {
      const { id, user_id, created_at, updated_at, ...topicData } = topic
      const { error } = await supabase
        .from('topics')
        .insert({ ...topicData, user_id: user.id })
      
      if (error) {
        results.failed.push({ type: 'topic', data: topic, error: error.message })
      } else {
        results.success.push({ type: 'topic', name: topic.name })
      }
    }
  }

  if (importData.resources) {
    for (const resource of importData.resources) {
      const { id, user_id, created_at, updated_at, ...resourceData } = resource
      const { error } = await supabase
        .from('resources' as any)
        .insert({ ...resourceData, user_id: user.id } as any)
      
      if (error) {
        results.failed.push({ type: 'resource', data: resource, error: error.message })
      } else {
        results.success.push({ type: 'resource', name: resource.title })
      }
    }
  }

  return results
}

export async function importFromNotion(notionData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const results: any = { success: [], failed: [] }

  if (notionData.pages) {
    for (const page of notionData.pages) {
      const title = page.properties?.title?.title?.[0]?.plain_text || 'Untitled'
      const content = page.properties?.content?.rich_text?.[0]?.plain_text || ''
      
      const { error } = await supabase
        .from('resources' as any)
        .insert({
          user_id: user.id,
          title,
          type: 'note',
          content,
          tags: page.properties?.tags?.multi_select?.map((t: any) => t.name) || []
        } as any)
      
      if (error) {
        results.failed.push({ title, error: error.message })
      } else {
        results.success.push({ title })
      }
    }
  }

  return results
}

export async function createBackup() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const backupData = await exportToJSON(true)
  
  const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`
  
  await supabase
    .from('export_history' as any)
    .insert({
      user_id: user.id,
      export_type: 'backup',
      file_name: fileName,
      status: 'completed',
      metadata: { timestamp: new Date().toISOString() }
    } as any)

  return { data: backupData, fileName }
}

export async function restoreBackup(backupData: string) {
  return await importFromJSON(backupData)
}

export async function getExportHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('export_history' as any)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}
