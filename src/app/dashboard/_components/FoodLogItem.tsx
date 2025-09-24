'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Clock, Zap } from 'lucide-react'
import { Database } from '@/lib/types/database.types'

type FoodLog = Database['public']['Tables']['food_logs']['Row'] & {
  food_items?: Array<Database['public']['Tables']['food_items']['Row'] & {
    nutrients?: Database['public']['Tables']['nutrients']['Row'][]
  }>
}

interface FoodLogItemProps {
  foodLog: FoodLog
}

export function FoodLogItem({ foodLog }: FoodLogItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            ✅ 완료
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            ⏳ 분석 중
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            ❌ 실패
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      {/* Main Info */}
      <div className="flex items-start space-x-4">
        {/* Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            {foodLog.image_url ? (
              <Image
                src={foodLog.image_url}
                alt="음식 사진"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                🍽️
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Clock size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {formatTime(foodLog.logged_at)}
                </span>
                {getStatusBadge(foodLog.analysis_status)}
              </div>
              
              {foodLog.total_calories && (
                <div className="flex items-center space-x-2">
                  <Zap size={16} className="text-orange-500" />
                  <span className="font-semibold text-gray-900">
                    {foodLog.total_calories.toLocaleString()} kcal
                  </span>
                </div>
              )}
            </div>

            {foodLog.food_items && foodLog.food_items.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </button>
            )}
          </div>

          {/* Food Items Preview */}
          {foodLog.food_items && foodLog.food_items.length > 0 && (
            <div className="text-sm text-gray-600">
              {foodLog.food_items.slice(0, 2).map((item, index) => (
                <span key={item.id}>
                  {item.food_name}
                  {index < Math.min(foodLog.food_items!.length, 2) - 1 && ', '}
                </span>
              ))}
              {foodLog.food_items.length > 2 && (
                <span> 외 {foodLog.food_items.length - 2}개</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && foodLog.food_items && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            {foodLog.food_items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.food_name}</h4>
                    {item.quantity && (
                      <p className="text-sm text-gray-600">{item.quantity}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {item.calories.toLocaleString()} kcal
                    </div>
                    {item.confidence && (
                      <div className="text-xs text-gray-500">
                        신뢰도: {(item.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Nutrients */}
                {item.nutrients && item.nutrients.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {item.nutrients.map((nutrient) => (
                        <div key={nutrient.id} className="flex justify-between">
                          <span className="text-gray-600">{nutrient.nutrient_type}:</span>
                          <span className="font-medium">
                            {nutrient.value}{nutrient.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
