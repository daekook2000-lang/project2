'use client'

import { FoodLogItem } from './FoodLogItem'
import { Database } from '@/lib/types/database.types'

type FoodLog = Database['public']['Tables']['food_logs']['Row'] & {
  food_items?: Array<Database['public']['Tables']['food_items']['Row'] & {
    nutrients?: Database['public']['Tables']['nutrients']['Row'][]
  }>
}

interface MealSectionProps {
  mealType: '아침' | '점심' | '저녁' | '간식'
  foodLogs: FoodLog[]
}

const mealConfig = {
  '아침': {
    emoji: '🌅',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  '점심': {
    emoji: '☀️',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  '저녁': {
    emoji: '🌆',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200'
  },
  '간식': {
    emoji: '🌙',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-200'
  }
}

export function MealSection({ mealType, foodLogs }: MealSectionProps) {
  const config = mealConfig[mealType]
  const totalCalories = foodLogs.reduce((sum, log) => sum + (log.total_calories || 0), 0)

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${config.borderColor}`}>
      {/* Header */}
      <div className={`${config.bgColor} px-6 py-4 rounded-t-2xl border-b ${config.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{config.emoji}</span>
            <div>
              <h3 className={`text-lg font-bold ${config.textColor}`}>
                {mealType}
              </h3>
              <p className="text-sm text-gray-600">
                {foodLogs.length}개 기록
              </p>
            </div>
          </div>
          
          {totalCalories > 0 && (
            <div className="text-right">
              <div className={`text-2xl font-bold ${config.textColor}`}>
                {totalCalories.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">칼로리</div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {foodLogs.length > 0 ? (
          <div className="space-y-4">
            {foodLogs.map((foodLog) => (
              <FoodLogItem key={foodLog.id} foodLog={foodLog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">{config.emoji}</div>
            <p className="text-gray-500 mb-4">
              {mealType} 기록이 없습니다
            </p>
            <button 
              onClick={() => window.location.href = '/upload'}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
            >
              지금 기록하기 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
