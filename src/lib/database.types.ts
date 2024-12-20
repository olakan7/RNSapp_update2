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
      appointments: {
        Row: {
          id: string
          user_id: string
          exam_type: 'mri' | 'ct' | 'ultrasound' | 'xray'
          appointment_date: string
          imaging_center: string
          location: string
          notes: string | null
          email: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          exam_type: 'mri' | 'ct' | 'ultrasound' | 'xray'
          appointment_date: string
          imaging_center: string
          location: string
          notes?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exam_type?: 'mri' | 'ct' | 'ultrasound' | 'xray'
          appointment_date?: string
          imaging_center?: string
          location?: string
          notes?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          email_enabled: boolean
          sms_enabled: boolean
          browser_enabled: boolean
          reminder_times: number[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          email_enabled?: boolean
          sms_enabled?: boolean
          browser_enabled?: boolean
          reminder_times?: number[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_enabled?: boolean
          sms_enabled?: boolean
          browser_enabled?: boolean
          reminder_times?: number[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}