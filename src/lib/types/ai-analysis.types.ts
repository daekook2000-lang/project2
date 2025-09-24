// AI 이미지 분석 webhook 응답 타입 정의

// 기존 타입들 (호환성을 위해 유지)
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

// 새로운 상세 분석 타입들
export interface VitaminMineralInfo {
  [key: string]: string;
}

export interface CalorieBreakdown {
  instant_ramen_per_serving: string;
  egg_yolk_per_item: string;
  total_estimated_calories: string;
  notes: string;
}

export interface MainIngredientsAnalysis {
  side_dish_ingredients: string;
  additional_toppings_ingredients: {
    egg_yolk: string;
    green_onion: string;
  };
  soup_ingredients: string;
  noodle_ingredients: string;
  dried_flakes_ingredients: string;
}

export interface NutrientAnalysis {
  sodium: string;
  proteins: string;
  carbohydrates: string;
  vitamins_minerals: VitaminMineralInfo;
  fats: string;
}

export interface FoodCharacteristics {
  soup: string;
  noodle: string;
  toppings: {
    egg_yolk: string;
    green_onion: string;
    dried_flakes: string;
  };
  side_dish: string;
}

export interface FoodTypeCharacteristics {
  characteristics: FoodCharacteristics;
  food_name: string;
}

export interface DetailedAnalysisData {
  overall_description: string;
  main_ingredients_analysis: MainIngredientsAnalysis;
  nutrient_analysis: NutrientAnalysis;
  overall_analysis: string;
  food_type_and_characteristics: FoodTypeCharacteristics;
  calorie_estimation: CalorieBreakdown;
}

export interface DetailedAIAnalysisOutput {
  success: boolean;
  data: DetailedAnalysisData;
}

export interface DetailedWebhookResponse {
  output: DetailedAIAnalysisOutput;
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
