'use client'

import { Database } from '@/lib/types/database.types'

type FoodLog = Database['public']['Tables']['food_logs']['Row'] & {
  food_items?: Array<Database['public']['Tables']['food_items']['Row'] & {
    nutrients?: Database['public']['Tables']['nutrients']['Row'][]
  }>
}

interface DailyNutritionSummaryProps {
  foodLogs: FoodLog[]
}

export function DailyNutritionSummary({ foodLogs }: DailyNutritionSummaryProps) {
  // Calculate totals
  const totalCalories = foodLogs.reduce((sum, log) => sum + (log.total_calories || 0), 0)
  
  // Calculate nutrients from food items
  const nutrients = {
    carbohydrates: 0,
    protein: 0,
    fat: 0,
    sugars: 0,
    sodium: 0
  }

  foodLogs.forEach(log => {
    log.food_items?.forEach(item => {
      item.nutrients?.forEach(nutrient => {
        const type = nutrient.nutrient_type.toLowerCase()
        if (type.includes('탄수화물') || type.includes('carb')) {
          nutrients.carbohydrates += nutrient.value
        } else if (type.includes('단백질') || type.includes('protein')) {
          nutrients.protein += nutrient.value
        } else if (type.includes('지방') || type.includes('fat')) {
          nutrients.fat += nutrient.value
        } else if (type.includes('당') || type.includes('sugar')) {
          nutrients.sugars += nutrient.value
        } else if (type.includes('나트륨') || type.includes('sodium')) {
          nutrients.sodium += nutrient.value
        }
      })
    })
  })

  // Daily targets (example values)
  const dailyTargets = {
    calories: 2000,
    carbohydrates: 250,
    protein: 150,
    fat: 65
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return 'bg-red-500'
    if (percentage < 70) return 'bg-yellow-500'
    if (percentage < 100) return 'bg-green-500'
    return 'bg-blue-500'
  }

  if (totalCalories === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            영양 정보
          </h3>
          <p className="text-gray-600">
            식단을 기록하면 영양 정보가 표시됩니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">오늘의 영양 요약</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {totalCalories.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            / {dailyTargets.calories.toLocaleString()} kcal
          </div>
        </div>
      </div>

      {/* Calories Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">칼로리</span>
          <span className="text-sm text-gray-600">
            {getProgressPercentage(totalCalories, dailyTargets.calories).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              getProgressColor(getProgressPercentage(totalCalories, dailyTargets.calories))
            }`}
            style={{ 
              width: `${getProgressPercentage(totalCalories, dailyTargets.calories)}%` 
            }}
          />
        </div>
      </div>

      {/* Macronutrients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Carbohydrates */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">탄수화물</span>
            <span className="text-xs text-blue-600">
              {getProgressPercentage(nutrients.carbohydrates, dailyTargets.carbohydrates).toFixed(0)}%
            </span>
          </div>
          <div className="text-lg font-bold text-blue-900 mb-1">
            {nutrients.carbohydrates.toFixed(1)}g
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${getProgressPercentage(nutrients.carbohydrates, dailyTargets.carbohydrates)}%` 
              }}
            />
          </div>
          <div className="text-xs text-blue-600 mt-1">
            목표: {dailyTargets.carbohydrates}g
          </div>
        </div>

        {/* Protein */}
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">단백질</span>
            <span className="text-xs text-green-600">
              {getProgressPercentage(nutrients.protein, dailyTargets.protein).toFixed(0)}%
            </span>
          </div>
          <div className="text-lg font-bold text-green-900 mb-1">
            {nutrients.protein.toFixed(1)}g
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${getProgressPercentage(nutrients.protein, dailyTargets.protein)}%` 
              }}
            />
          </div>
          <div className="text-xs text-green-600 mt-1">
            목표: {dailyTargets.protein}g
          </div>
        </div>

        {/* Fat */}
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-800">지방</span>
            <span className="text-xs text-orange-600">
              {getProgressPercentage(nutrients.fat, dailyTargets.fat).toFixed(0)}%
            </span>
          </div>
          <div className="text-lg font-bold text-orange-900 mb-1">
            {nutrients.fat.toFixed(1)}g
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${getProgressPercentage(nutrients.fat, dailyTargets.fat)}%` 
              }}
            />
          </div>
          <div className="text-xs text-orange-600 mt-1">
            목표: {dailyTargets.fat}g
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {(nutrients.sugars > 0 || nutrients.sodium > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {nutrients.sugars > 0 && (
              <div>
                <span className="text-gray-600">당류: </span>
                <span className="font-medium">{nutrients.sugars.toFixed(1)}g</span>
              </div>
            )}
            {nutrients.sodium > 0 && (
              <div>
                <span className="text-gray-600">나트륨: </span>
                <span className="font-medium">{nutrients.sodium.toFixed(1)}mg</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
