// Database Types - Generated from Supabase Schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          institution: string | null
          course: string | null
          semester: string | null
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          institution?: string | null
          course?: string | null
          semester?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          institution?: string | null
          course?: string | null
          semester?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      semesters: {
        Row: {
          id: string
          user_id: string
          name: string
          start_date: string | null
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          user_id: string
          semester_id: string | null
          name: string
          code: string | null
          color: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          semester_id?: string | null
          name: string
          code?: string | null
          color?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          semester_id?: string | null
          name?: string
          code?: string | null
          color?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          name: string
          description: string | null
          status: 'not_started' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          name: string
          description?: string | null
          status?: 'not_started' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          name?: string
          description?: string | null
          status?: 'not_started' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          user_id: string
          title: string
          type: 'pdf' | 'image' | 'link' | 'note' | 'video'
          content: string | null
          url: string | null
          file_path: string | null
          file_size: number | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: 'pdf' | 'image' | 'link' | 'note' | 'video'
          content?: string | null
          url?: string | null
          file_path?: string | null
          file_size?: number | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: 'pdf' | 'image' | 'link' | 'note' | 'video'
          content?: string | null
          url?: string | null
          file_path?: string | null
          file_size?: number | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      resource_topics: {
        Row: {
          id: string
          resource_id: string
          topic_id: string
          created_at: string
        }
        Insert: {
          id?: string
          resource_id: string
          topic_id: string
          created_at?: string
        }
        Update: {
          id?: string
          resource_id?: string
          topic_id?: string
          created_at?: string
        }
      }
      study_plans: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          topic_id: string | null
          title: string
          description: string | null
          planned_date: string
          start_time: string | null
          end_time: string | null
          estimated_minutes: number | null
          status: 'planned' | 'in_progress' | 'completed' | 'skipped'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          topic_id?: string | null
          title: string
          description?: string | null
          planned_date: string
          start_time?: string | null
          end_time?: string | null
          estimated_minutes?: number | null
          status?: 'planned' | 'in_progress' | 'completed' | 'skipped'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          topic_id?: string | null
          title?: string
          description?: string | null
          planned_date?: string
          start_time?: string | null
          end_time?: string | null
          estimated_minutes?: number | null
          status?: 'planned' | 'in_progress' | 'completed' | 'skipped'
          created_at?: string
          updated_at?: string
        }
      }
      deadlines: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          title: string
          description: string | null
          type: 'assignment' | 'exam' | 'project' | 'other'
          due_date: string
          priority: 'low' | 'medium' | 'high'
          status: 'pending' | 'completed' | 'overdue'
          reminder_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          title: string
          description?: string | null
          type: 'assignment' | 'exam' | 'project' | 'other'
          due_date: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed' | 'overdue'
          reminder_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          title?: string
          description?: string | null
          type?: 'assignment' | 'exam' | 'project' | 'other'
          due_date?: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed' | 'overdue'
          reminder_sent?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          topic_id: string | null
          start_time: string
          end_time: string | null
          duration_minutes: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          topic_id?: string | null
          start_time: string
          end_time?: string | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          topic_id?: string | null
          start_time?: string
          end_time?: string | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      revisions: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          revision_number: number
          revision_date: string
          notes: string | null
          confidence_level: number | null
          next_revision_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          revision_number?: number
          revision_date?: string
          notes?: string | null
          confidence_level?: number | null
          next_revision_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          revision_number?: number
          revision_date?: string
          notes?: string | null
          confidence_level?: number | null
          next_revision_date?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'deadline' | 'revision' | 'study_plan' | 'general'
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'deadline' | 'revision' | 'study_plan' | 'general'
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'deadline' | 'revision' | 'study_plan' | 'general'
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
