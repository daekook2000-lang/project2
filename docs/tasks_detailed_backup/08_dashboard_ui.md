# Task 08: 식단 기록 대시보드 UI

## 📋 개요
사용자의 식단 기록을 날짜별, 끼니별로 조회할 수 있는 대시보드 UI를 구현합니다.

## 🎯 목표
- 날짜별 식단 기록 조회 인터페이스
- 끼니별 자동 분류 표시 (아침/점심/저녁/간식)
- 영양성분 요약 정보 표시
- 모바일 친화적인 반응형 디자인

## ✅ 체크리스트

### 메인 대시보드 페이지
- [ ] `src/app/dashboard/page.tsx` 생성
```typescript
import { requireAuth } from '@/lib/auth/server'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const user = await requireAuth()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <DashboardContent userId={user.id} />
      </div>
    </div>
  )
}
```

### 대시보드 컴포넌트들

#### 1. 날짜 선택 컴포넌트
- [ ] `src/components/dashboard/DateSelector.tsx` 생성
```typescript
'use client'

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(prevDay.getDate() - 1)
    onDateChange(prevDay)
  }

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    onDateChange(nextDay)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
      <button
        onClick={goToPreviousDay}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {selectedDate.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
          })}
        </h2>
        {isToday(selectedDate) && (
          <span className="text-sm text-blue-600">오늘</span>
        )}
      </div>

      <button
        onClick={goToNextDay}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        disabled={isToday(selectedDate)}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
```

#### 2. 끼니별 식단 카드
- [ ] `src/components/dashboard/MealCard.tsx` 생성
```typescript
'use client'

interface MealCardProps {
  mealType: '아침' | '점심' | '저녁' | '간식'
  foodLogs: FoodLog[]
  totalCalories: number
}

export function MealCard({ mealType, foodLogs, totalCalories }: MealCardProps) {
  const getMealIcon = (type: string) => {
    switch (type) {
      case '아침': return '🌅'
      case '점심': return '☀️'
      case '저녁': return '🌙'
      case '간식': return '🍪'
      default: return '🍽️'
    }
  }

  const getMealTime = (type: string) => {
    switch (type) {
      case '아침': return '04:00 - 10:59'
      case '점심': return '11:00 - 16:59'
      case '저녁': return '17:00 - 21:59'
      case '간식': return '22:00 - 03:59'
      default: return ''
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getMealIcon(mealType)}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{mealType}</h3>
              <p className="text-xs text-gray-500">{getMealTime(mealType)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{totalCalories}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {foodLogs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            기록된 식단이 없습니다
          </p>
        ) : (
          <div className="space-y-3">
            {foodLogs.map((log) => (
              <FoodLogItem key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

#### 3. 개별 식단 기록 아이템
- [ ] `src/components/dashboard/FoodLogItem.tsx` 생성
```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FoodLogItemProps {
  log: FoodLog
}

export function FoodLogItem({ log }: FoodLogItemProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center space-x-3">
          {log.image_url && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={log.image_url}
                alt="음식 사진"
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {log.food_items?.map(item => item.food_name).join(', ') || '분석 중...'}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {log.total_calories || 0} kcal
              </p>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(log.logged_at).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform ${
              showDetails ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {showDetails && (
        <div className="px-3 pb-3 border-t border-gray-100">
          {log.food_items?.map((item, index) => (
            <div key={index} className="py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{item.food_name}</p>
                  <p className="text-xs text-gray-500">{item.quantity}</p>
                  <p className="text-xs text-gray-400">
                    신뢰도: {(item.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <p className="text-sm font-semibold">{item.calories} kcal</p>
              </div>
              
              {item.nutrients && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>탄수화물: {item.nutrients.carbohydrates.value}g</div>
                  <div>단백질: {item.nutrients.protein.value}g</div>
                  <div>지방: {item.nutrients.fat.value}g</div>
                  <div>나트륨: {item.nutrients.sodium.value}mg</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

#### 4. 일일 영양 요약 컴포넌트
- [ ] `src/components/dashboard/DailyNutritionSummary.tsx` 생성
```typescript
interface DailyNutritionSummaryProps {
  totalCalories: number
  totalCarbs: number
  totalProtein: number
  totalFat: number
  targetCalories?: number
}

export function DailyNutritionSummary({
  totalCalories,
  totalCarbs,
  totalProtein,
  totalFat,
  targetCalories = 2000
}: DailyNutritionSummaryProps) {
  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100)

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-4">오늘의 영양 요약</h3>
      
      {/* 칼로리 진행률 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">총 칼로리</span>
          <span className="text-lg font-bold text-gray-900">
            {totalCalories} / {targetCalories} kcal
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calorieProgress}%` }}
          />
        </div>
      </div>

      {/* 영양소 분포 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">{totalCarbs.toFixed(0)}g</div>
          <div className="text-xs text-gray-500">탄수화물</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{totalProtein.toFixed(0)}g</div>
          <div className="text-xs text-gray-500">단백질</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">{totalFat.toFixed(0)}g</div>
          <div className="text-xs text-gray-500">지방</div>
        </div>
      </div>
    </div>
  )
}
```

### 데이터 페칭 및 상태 관리

#### 1. 대시보드 데이터 훅
- [ ] `src/hooks/useDashboardData.ts` 생성
```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useDashboardData(userId: string, selectedDate: Date) {
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchFoodLogs = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)
        
        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        const { data, error } = await supabase
          .from('food_logs')
          .select(`
            *,
            food_items (
              *,
              nutrients (*)
            )
          `)
          .eq('user_id', userId)
          .gte('logged_at', startOfDay.toISOString())
          .lte('logged_at', endOfDay.toISOString())
          .order('logged_at', { ascending: false })

        if (error) throw error

        setFoodLogs(data || [])
      } catch (err) {
        console.error('Dashboard data fetch error:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchFoodLogs()
  }, [userId, selectedDate])

  // 끼니별로 그룹화
  const groupedByMeal = foodLogs.reduce((acc, log) => {
    const mealType = log.meal_type as '아침' | '점심' | '저녁' | '간식'
    if (!acc[mealType]) {
      acc[mealType] = []
    }
    acc[mealType].push(log)
    return acc
  }, {} as Record<string, FoodLog[]>)

  // 총 영양성분 계산
  const totalNutrition = foodLogs.reduce((total, log) => {
    log.food_items?.forEach(item => {
      total.calories += item.calories || 0
      item.nutrients?.forEach(nutrient => {
        switch (nutrient.nutrient_type) {
          case 'carbohydrates':
            total.carbs += nutrient.value || 0
            break
          case 'protein':
            total.protein += nutrient.value || 0
            break
          case 'fat':
            total.fat += nutrient.value || 0
            break
        }
      })
    })
    return total
  }, { calories: 0, carbs: 0, protein: 0, fat: 0 })

  return {
    foodLogs,
    groupedByMeal,
    totalNutrition,
    loading,
    error,
    refetch: () => fetchFoodLogs()
  }
}
```

## 📝 완료 조건
- [ ] 날짜별 식단 기록이 정상 표시됨
- [ ] 끼니별 자동 분류가 올바르게 표시됨
- [ ] 영양성분 요약이 정확히 계산됨
- [ ] 모바일에서 사용하기 편리함
- [ ] 로딩 및 에러 상태가 적절히 처리됨
- [ ] 데이터 새로고침이 정상 작동함

## ⚠️ 주의사항
- 대용량 데이터 처리 시 페이지네이션 고려
- 이미지 로딩 최적화 (lazy loading)
- 네트워크 오류 시 재시도 기능
- 접근성을 고려한 키보드 네비게이션

## 🔗 의존성
- **선행 작업**: [06_layout_design.md](./06_layout_design.md), [11_data_sync.md](./11_data_sync.md)
- **후속 작업**: [12_meal_categorization.md](./12_meal_categorization.md)

## 📊 예상 소요 시간
**4-5시간**

---
*상태: ⏳ 대기 중*
