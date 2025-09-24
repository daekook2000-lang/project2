export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Upload API Response Types
export interface UploadApiResponse {
  success: boolean
  data?: AnalysisResult
  error?: {
    message: string
    code?: string
  }
}

export interface AnalysisResult {
  items: FoodAnalysisItem[]
  summary: NutritionSummary
  imageUrl?: string
  timestamp?: string
}

export interface FoodAnalysisItem {
  foodName: string
  confidence: number
  quantity: string
  calories: number
  nutrients: NutrientData
}

export interface NutrientData {
  carbohydrates: { value: number; unit: string }
  protein: { value: number; unit: string }
  fat: { value: number; unit: string }
  sugars: { value: number; unit: string }
  sodium: { value: number; unit: string }
}

export interface NutritionSummary {
  totalCalories: number
  totalCarbohydrates: { value: number; unit: string }
  totalProtein: { value: number; unit: string }
  totalFat: { value: number; unit: string }
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      food_logs: {
        Row: {
          id: string
          user_id: string
          image_url: string
          meal_type: '아침' | '점심' | '저녁' | '간식'
          logged_at: string
          analysis_status: 'pending' | 'completed' | 'failed'
          total_calories: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          meal_type: '아침' | '점심' | '저녁' | '간식'
          logged_at?: string
          analysis_status?: 'pending' | 'completed' | 'failed'
          total_calories?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          meal_type?: '아침' | '점심' | '저녁' | '간식'
          logged_at?: string
          analysis_status?: 'pending' | 'completed' | 'failed'
          total_calories?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      food_items: {
        Row: {
          id: string
          food_log_id: string
          food_name: string
          confidence: number | null
          quantity: string | null
          calories: number
          created_at: string
        }
        Insert: {
          id?: string
          food_log_id: string
          food_name: string
          confidence?: number | null
          quantity?: string | null
          calories: number
          created_at?: string
        }
        Update: {
          id?: string
          food_log_id?: string
          food_name?: string
          confidence?: number | null
          quantity?: string | null
          calories?: number
          created_at?: string
        }
      }
      nutrients: {
        Row: {
          id: string
          food_item_id: string
          nutrient_type: string
          value: number
          unit: string
          created_at: string
        }
        Insert: {
          id?: string
          food_item_id: string
          nutrient_type: string
          value: number
          unit: string
          created_at?: string
        }
        Update: {
          id?: string
          food_item_id?: string
          nutrient_type?: string
          value?: number
          unit?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
