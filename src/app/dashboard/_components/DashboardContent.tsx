'use client'

import { useState } from 'react'
import { DateSelector } from './DateSelector'
import { MealSection } from './MealSection'
import { DailyNutritionSummary } from './DailyNutritionSummary'
import { useDashboardData } from '@/app/dashboard/_hooks/useDashboardData';
import { Database } from '@/lib/types/database.types';
import Link from 'next/link';

type FoodLog = Database['public']['Tables']['food_logs']['Row'] & {
  food_items: (Database['public']['Tables']['food_items']['Row'] & {
    nutrients: Database['public']['Tables']['nutrients']['Row'] | null;
  })[];
};
interface DashboardContentProps {
  userId: string;
  initialFoodLogs: FoodLog[];
}

export function DashboardContent({
  userId,
  initialFoodLogs,
}: DashboardContentProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { foodLogs, groupedByMeal, loading, error } = useDashboardData(
    userId,
    selectedDate,
    initialFoodLogs,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  const mealTypes: Array<'아침' | '점심' | '저녁' | '간식'> = ['아침', '점심', '저녁', '간식']

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          식단 대시보드
        </h1>
        <p className="text-gray-600">
          날짜별 식단 기록과 영양 정보를 확인하세요
        </p>
      </div>

      {/* Date Selector */}
      <DateSelector 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      {/* Daily Nutrition Summary */}
      <DailyNutritionSummary foodLogs={foodLogs} />

      {/* Meal Sections */}
      <div className="space-y-6">
        {mealTypes.map((mealType) => (
          <MealSection
            key={mealType}
            mealType={mealType}
            foodLogs={groupedByMeal[mealType] || []}
          />
        ))}
      </div>

      {/* Empty State */}
      {foodLogs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            이 날짜에는 기록된 식단이 없어요
          </h2>
          <p className="text-gray-600 mb-6">
            첫 번째 식단을 기록해보세요!
          </p>
          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            식단 기록하기
          </Link>
        </div>
      )}

      {/* Floating Action Button */}
      <Link
        href="/upload"
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
        aria-label="식단 기록하기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </Link>
    </div>
  )
}
