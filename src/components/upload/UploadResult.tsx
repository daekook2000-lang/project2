'use client'

import { CheckCircle, Camera, BarChart3, Clock } from 'lucide-react'
import Link from 'next/link'
import { AnalysisResult } from '@/lib/types/database.types'

interface UploadResultProps {
  result: AnalysisResult
  onNewUpload: () => void
}

export function UploadResult({ result, onNewUpload }: UploadResultProps) {
  if (!result || !result.items || result.items.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">❌</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          분석 결과를 불러올 수 없습니다
        </h2>
        <button
          onClick={onNewUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }
  const getCurrentMealType = () => {
    const hour = new Date().getHours()
    if (hour >= 4 && hour < 11) return '아침'
    if (hour >= 11 && hour < 17) return '점심'
    if (hour >= 17 && hour < 22) return '저녁'
    return '간식'
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          분석 완료! 🎉
        </h2>
        
        <p className="text-gray-600 mb-4">
          {getCurrentMealType()} 식단이 성공적으로 기록되었습니다
        </p>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
          <Clock size={16} />
          <span>{new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-900">
              {result.summary.totalCalories}
            </div>
            <div className="text-sm text-blue-700">칼로리</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-900">
              {result.summary.totalProtein.value.toFixed(1)}g
            </div>
            <div className="text-sm text-green-700">단백질</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-orange-900">
              {result.summary.totalCarbohydrates.value.toFixed(1)}g
            </div>
            <div className="text-sm text-orange-700">탄수화물</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-900">
              {result.summary.totalFat.value.toFixed(1)}g
            </div>
            <div className="text-sm text-purple-700">지방</div>
          </div>
        </div>
      </div>

      {/* Detected Foods */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-2xl mr-3">🍽️</span>
          인식된 음식 ({result.items.length}개)
        </h3>

        <div className="space-y-4">
          {result.items.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {item.foodName}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {item.quantity}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="text-xs text-gray-500">
                      신뢰도: {(item.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full"
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {item.calories}
                  </div>
                  <div className="text-sm text-gray-600">칼로리</div>
                </div>
              </div>

              {/* Nutrients */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">탄수화물:</span>
                  <span className="font-medium">{item.nutrients.carbohydrates.value.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">단백질:</span>
                  <span className="font-medium">{item.nutrients.protein.value.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">지방:</span>
                  <span className="font-medium">{item.nutrients.fat.value.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">당류:</span>
                  <span className="font-medium">{item.nutrients.sugars.value.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">나트륨:</span>
                  <span className="font-medium">{item.nutrients.sodium.value.toFixed(1)}mg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <BarChart3 size={20} />
            <span>대시보드에서 확인</span>
          </Link>
          
          <button
            onClick={onNewUpload}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Camera size={20} />
            <span>다른 음식 기록</span>
          </button>
        </div>
      </div>
    </div>
  )
}
