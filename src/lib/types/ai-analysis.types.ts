// AI 이미지 분석 webhook 응답 타입 정의

export interface NutrientValue {
  value: number;
  unit: string;
}

export interface FoodNutrients {
  carbohydrates: NutrientValue;
  protein: NutrientValue;
  fat: NutrientValue;
  sugars: NutrientValue;
  sodium: NutrientValue;
}

export interface AnalyzedFoodItem {
  foodName: string;
  confidence: number;
  quantity: string;
  calories: number;
  nutrients: FoodNutrients;
}

export interface NutritionSummary {
  totalCalories: number;
  totalCarbohydrates: NutrientValue;
  totalProtein: NutrientValue;
  totalFat: NutrientValue;
}

export interface AnalysisData {
  items: AnalyzedFoodItem[];
  summary: NutritionSummary;
}

export interface AIAnalysisOutput {
  success: boolean;
  data: AnalysisData;
}

export interface WebhookResponse {
  output: AIAnalysisOutput;
}

// 데이터베이스 저장용 타입 (현재 스키마에 맞춤)
export interface FoodLogEntry {
  id?: string;
  user_id: string;
  image_url: string;
  meal_type: '아침' | '점심' | '저녁' | '간식';
  logged_at: string;
  analysis_status: 'pending' | 'completed' | 'failed';
  total_calories?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface FoodItemEntry {
  id?: string;
  food_log_id: string;
  food_name: string;
  confidence?: number | null;
  quantity?: string | null;
  calories: number;
  created_at?: string;
}

export interface NutrientEntry {
  id?: string;
  food_item_id: string;
  nutrient_type: string;
  value: number;
  unit: string;
  created_at?: string;
}
