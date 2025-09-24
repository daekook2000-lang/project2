'use client'

import { CheckCircle, Camera, BarChart3, Clock, Flame, Droplets, Wheat, Beef, Apple } from 'lucide-react'
import Link from 'next/link'
import { AnalysisResult } from '@/lib/types/database.types'
import { DetailedAnalysisData } from '@/lib/types/ai-analysis.types'

interface UploadResultProps {
  result: AnalysisResult | DetailedAnalysisData
  onNewUpload: () => void
}

export function UploadResult({ result, onNewUpload }: UploadResultProps) {
  // 상세 분석 데이터인지 확인
  const isDetailedAnalysis = 'overall_description' in result

  if (!result) {
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

  // 상세 분석 데이터인 경우
  if (isDetailedAnalysis) {
    const detailedResult = result as DetailedAnalysisData
    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            상세 분석 완료! 🎉
          </h2>

          <p className="text-gray-600 mb-4">
            {detailedResult.food_type_and_characteristics.food_name}
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
            <Clock size={16} />
            <span>{new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Calorie Info */}
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Flame size={20} className="text-orange-500 mr-2" />
              <span className="text-sm text-orange-700">예상 칼로리</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {detailedResult.calorie_estimation.total_estimated_calories}
            </div>
            <div className="text-sm text-orange-600">
              {detailedResult.calorie_estimation.notes}
            </div>
          </div>
        </div>

        {/* Overall Description */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">📝</span>
            전체 설명
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {detailedResult.overall_description}
          </p>
        </div>

        {/* Food Characteristics */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🍜</span>
            음식 특징
          </h3>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🍲 국물</h4>
              <p className="text-blue-800 text-sm">
                {detailedResult.food_type_and_characteristics.characteristics.soup}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">🍜 면</h4>
              <p className="text-yellow-800 text-sm">
                {detailedResult.food_type_and_characteristics.characteristics.noodle}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">🥚 토핑</h4>
              <div className="space-y-2">
                <p className="text-green-800 text-sm">
                  <strong>계란 노른자:</strong> {detailedResult.food_type_and_characteristics.characteristics.toppings.egg_yolk}
                </p>
                <p className="text-green-800 text-sm">
                  <strong>파:</strong> {detailedResult.food_type_and_characteristics.characteristics.toppings.green_onion}
                </p>
                <p className="text-green-800 text-sm">
                  <strong>건더기:</strong> {detailedResult.food_type_and_characteristics.characteristics.toppings.dried_flakes}
                </p>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">🥬 반찬</h4>
              <p className="text-red-800 text-sm">
                {detailedResult.food_type_and_characteristics.characteristics.side_dish}
              </p>
            </div>
          </div>
        </div>

        {/* Nutrient Analysis */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🥗</span>
            영양소 분석
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                <Droplets size={16} className="mr-2" />
                나트륨
              </h4>
              <p className="text-red-800 text-sm">
                {detailedResult.nutrient_analysis.sodium}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Beef size={16} className="mr-2" />
                단백질
              </h4>
              <p className="text-blue-800 text-sm">
                {detailedResult.nutrient_analysis.proteins}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <Wheat size={16} className="mr-2" />
                탄수화물
              </h4>
              <p className="text-yellow-800 text-sm">
                {detailedResult.nutrient_analysis.carbohydrates}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                <Apple size={16} className="mr-2" />
                지방
              </h4>
              <p className="text-purple-800 text-sm">
                {detailedResult.nutrient_analysis.fats}
              </p>
            </div>
          </div>

          {/* Vitamins and Minerals */}
          <div className="mt-4 bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">💊 비타민 & 미네랄</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(detailedResult.nutrient_analysis.vitamins_minerals).map(([key, value]) => (
                <div key={key} className="text-green-800 text-sm">
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ingredients Analysis */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🔍</span>
            재료 분석
          </h3>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold text-gray-900 mb-1">🥬 반찬 재료</h4>
              <p className="text-gray-700 text-sm">
                {detailedResult.main_ingredients_analysis.side_dish_ingredients}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold text-gray-900 mb-1">🥚 추가 토핑</h4>
              <p className="text-gray-700 text-sm">
                계란 노른자: {detailedResult.main_ingredients_analysis.additional_toppings_ingredients.egg_yolk}
              </p>
              <p className="text-gray-700 text-sm">
                파: {detailedResult.main_ingredients_analysis.additional_toppings_ingredients.green_onion}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold text-gray-900 mb-1">🍜 국물 재료</h4>
              <p className="text-gray-700 text-sm">
                {detailedResult.main_ingredients_analysis.soup_ingredients}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold text-gray-900 mb-1">🍜 면 재료</h4>
              <p className="text-gray-700 text-sm">
                {detailedResult.main_ingredients_analysis.noodle_ingredients}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold text-gray-900 mb-1">🧅 건더기 재료</h4>
              <p className="text-gray-700 text-sm">
                {detailedResult.main_ingredients_analysis.dried_flakes_ingredients}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Analysis */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">📊</span>
            전체 분석
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {detailedResult.overall_analysis}
          </p>
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
  // 기본 분석 데이터인 경우
  const basicResult = result as AnalysisResult
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
              {basicResult.summary.totalCalories}
            </div>
            <div className="text-sm text-blue-700">칼로리</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-900">
              {basicResult.summary.totalProtein.value.toFixed(1)}g
            </div>
            <div className="text-sm text-green-700">단백질</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-orange-900">
              {basicResult.summary.totalCarbohydrates.value.toFixed(1)}g
            </div>
            <div className="text-sm text-orange-700">탄수화물</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-900">
              {basicResult.summary.totalFat.value.toFixed(1)}g
            </div>
            <div className="text-sm text-purple-700">지방</div>
          </div>
        </div>
      </div>

      {/* Detected Foods */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-2xl mr-3">🍽️</span>
          인식된 음식 ({basicResult.items.length}개)
        </h3>

        <div className="space-y-4">
          {basicResult.items.map((item, index) => (
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
