# Task 13: 영양성분 표시 기능

## 📋 개요
AI 분석 결과로 얻은 영양성분 정보를 사용자가 쉽게 이해할 수 있도록 시각적으로 표시하는 기능을 구현합니다.

## 🎯 목표
- 개별 음식 및 전체 식단의 영양성분 표시
- 시각적 차트를 통한 영양소 비율 표현
- 일일 권장량 대비 섭취량 비교
- 영양 균형 분석 및 권장사항 제공

## ✅ 체크리스트

### 영양성분 카드 컴포넌트
- [ ] `src/components/nutrition/NutritionCard.tsx` 생성
```typescript
'use client'

interface NutritionData {
  calories: number
  carbohydrates: number
  protein: number
  fat: number
  sugars?: number
  sodium?: number
  fiber?: number
}

interface NutritionCardProps {
  data: NutritionData
  title?: string
  showPercentages?: boolean
  dailyTargets?: NutritionData
}

export function NutritionCard({ 
  data, 
  title = "영양성분", 
  showPercentages = false,
  dailyTargets 
}: NutritionCardProps) {
  const nutritionItems = [
    {
      label: '칼로리',
      value: data.calories,
      unit: 'kcal',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      target: dailyTargets?.calories
    },
    {
      label: '탄수화물',
      value: data.carbohydrates,
      unit: 'g',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      target: dailyTargets?.carbohydrates
    },
    {
      label: '단백질',
      value: data.protein,
      unit: 'g',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      target: dailyTargets?.protein
    },
    {
      label: '지방',
      value: data.fat,
      unit: 'g',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      target: dailyTargets?.fat
    }
  ]

  const calculatePercentage = (value: number, target?: number) => {
    if (!target) return 0
    return Math.min((value / target) * 100, 100)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {nutritionItems.map((item) => (
          <div key={item.label} className={`${item.bgColor} rounded-lg p-3`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              {showPercentages && item.target && (
                <span className="text-xs text-gray-500">
                  {calculatePercentage(item.value, item.target).toFixed(0)}%
                </span>
              )}
            </div>
            
            <div className={`text-lg font-bold ${item.color}`}>
              {item.value.toLocaleString()}{item.unit}
            </div>
            
            {showPercentages && item.target && (
              <div className="mt-2">
                <div className="w-full bg-white rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${item.color.replace('text', 'bg')}`}
                    style={{ width: `${calculatePercentage(item.value, item.target)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  목표: {item.target.toLocaleString()}{item.unit}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 추가 영양성분 */}
      {(data.sugars || data.sodium || data.fiber) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">기타 영양성분</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {data.sugars && (
              <div className="text-center">
                <div className="font-medium text-gray-900">{data.sugars}g</div>
                <div className="text-gray-500">당류</div>
              </div>
            )}
            {data.sodium && (
              <div className="text-center">
                <div className="font-medium text-gray-900">{data.sodium}mg</div>
                <div className="text-gray-500">나트륨</div>
              </div>
            )}
            {data.fiber && (
              <div className="text-center">
                <div className="font-medium text-gray-900">{data.fiber}g</div>
                <div className="text-gray-500">식이섬유</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 영양소 비율 차트
- [ ] `src/components/nutrition/NutritionChart.tsx` 생성
```typescript
'use client'

import { useMemo } from 'react'

interface NutritionChartProps {
  carbs: number
  protein: number
  fat: number
  size?: number
  showLegend?: boolean
}

export function NutritionChart({ 
  carbs, 
  protein, 
  fat, 
  size = 120,
  showLegend = true 
}: NutritionChartProps) {
  const data = useMemo(() => {
    const total = carbs + protein + fat
    if (total === 0) return []

    const carbsCalories = carbs * 4
    const proteinCalories = protein * 4
    const fatCalories = fat * 9
    const totalCalories = carbsCalories + proteinCalories + fatCalories

    return [
      {
        label: '탄수화물',
        value: carbs,
        calories: carbsCalories,
        percentage: (carbsCalories / totalCalories) * 100,
        color: '#FB923C', // orange-400
      },
      {
        label: '단백질',
        value: protein,
        calories: proteinCalories,
        percentage: (proteinCalories / totalCalories) * 100,
        color: '#60A5FA', // blue-400
      },
      {
        label: '지방',
        value: fat,
        calories: fatCalories,
        percentage: (fatCalories / totalCalories) * 100,
        color: '#FBBF24', // yellow-400
      },
    ]
  }, [carbs, protein, fat])

  const createPath = (percentage: number, startAngle: number) => {
    const angle = (percentage / 100) * 360
    const endAngle = startAngle + angle
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const radius = size / 2 - 10
    const centerX = size / 2
    const centerY = size / 2
    
    const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180)
    const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180)
    const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180)
    const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180)
    
    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
  }

  let currentAngle = 0

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const path = createPath(item.percentage, currentAngle)
            currentAngle += (item.percentage / 100) * 360
            
            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                className="hover:opacity-80 transition-opacity"
              />
            )
          })}
        </svg>
        
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">영양비율</div>
          </div>
        </div>
      </div>

      {showLegend && (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-gray-500 ml-1">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 일일 영양 목표 설정
- [ ] `src/lib/utils/nutrition-targets.ts` 생성
```typescript
export interface NutritionTargets {
  calories: number
  carbohydrates: number
  protein: number
  fat: number
  sugars: number
  sodium: number
  fiber: number
}

export interface UserProfile {
  age: number
  gender: 'male' | 'female'
  weight: number // kg
  height: number // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
}

export function calculateNutritionTargets(profile: UserProfile): NutritionTargets {
  // BMR 계산 (Harris-Benedict 공식)
  let bmr: number
  if (profile.gender === 'male') {
    bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
  } else {
    bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age)
  }

  // 활동 수준에 따른 칼로리 조정
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  }

  const dailyCalories = Math.round(bmr * activityMultipliers[profile.activityLevel])

  // 영양소 비율 (한국인 영양섭취기준 참고)
  const carbsCalories = dailyCalories * 0.55 // 55-65%
  const proteinCalories = dailyCalories * 0.15 // 7-20%
  const fatCalories = dailyCalories * 0.30 // 15-30%

  return {
    calories: dailyCalories,
    carbohydrates: Math.round(carbsCalories / 4), // 1g = 4kcal
    protein: Math.round(proteinCalories / 4), // 1g = 4kcal
    fat: Math.round(fatCalories / 9), // 1g = 9kcal
    sugars: Math.round(dailyCalories * 0.1 / 4), // 10% 이하
    sodium: 2000, // mg (WHO 권장)
    fiber: profile.gender === 'male' ? 25 : 20 // g
  }
}

// 기본 목표값 (성인 기준)
export const DEFAULT_NUTRITION_TARGETS: NutritionTargets = {
  calories: 2000,
  carbohydrates: 275, // 55%
  protein: 75, // 15%
  fat: 67, // 30%
  sugars: 50,
  sodium: 2000,
  fiber: 25
}
```

### 영양 분석 리포트
- [ ] `src/components/nutrition/NutritionReport.tsx` 생성
```typescript
'use client'

import { NutritionTargets } from '@/lib/utils/nutrition-targets'

interface NutritionReportProps {
  dailyIntake: {
    calories: number
    carbohydrates: number
    protein: number
    fat: number
    sodium: number
  }
  targets: NutritionTargets
}

export function NutritionReport({ dailyIntake, targets }: NutritionReportProps) {
  const getStatus = (intake: number, target: number, nutrient: string) => {
    const percentage = (intake / target) * 100
    
    if (nutrient === 'sodium') {
      // 나트륨은 적을수록 좋음
      if (percentage > 100) return { status: 'high', message: '권장량을 초과했습니다', color: 'text-red-600' }
      if (percentage > 80) return { status: 'moderate', message: '적정 수준입니다', color: 'text-yellow-600' }
      return { status: 'good', message: '양호합니다', color: 'text-green-600' }
    }
    
    // 일반 영양소
    if (percentage < 80) return { status: 'low', message: '부족합니다', color: 'text-orange-600' }
    if (percentage > 120) return { status: 'high', message: '과다합니다', color: 'text-red-600' }
    return { status: 'good', message: '적정 수준입니다', color: 'text-green-600' }
  }

  const analyses = [
    {
      label: '칼로리',
      intake: dailyIntake.calories,
      target: targets.calories,
      unit: 'kcal'
    },
    {
      label: '탄수화물',
      intake: dailyIntake.carbohydrates,
      target: targets.carbohydrates,
      unit: 'g'
    },
    {
      label: '단백질',
      intake: dailyIntake.protein,
      target: targets.protein,
      unit: 'g'
    },
    {
      label: '지방',
      intake: dailyIntake.fat,
      target: targets.fat,
      unit: 'g'
    },
    {
      label: '나트륨',
      intake: dailyIntake.sodium,
      target: targets.sodium,
      unit: 'mg'
    }
  ]

  const getRecommendations = () => {
    const recommendations: string[] = []
    
    analyses.forEach(analysis => {
      const status = getStatus(analysis.intake, analysis.target, analysis.label.toLowerCase())
      
      switch (status.status) {
        case 'low':
          recommendations.push(`${analysis.label} 섭취를 늘려보세요`)
          break
        case 'high':
          if (analysis.label === '나트륨') {
            recommendations.push('나트륨 섭취를 줄여보세요')
          } else {
            recommendations.push(`${analysis.label} 섭취를 줄여보세요`)
          }
          break
      }
    })
    
    return recommendations
  }

  const recommendations = getRecommendations()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="font-semibold text-gray-900 mb-4">영양 분석 리포트</h3>
      
      <div className="space-y-3">
        {analyses.map((analysis) => {
          const status = getStatus(analysis.intake, analysis.target, analysis.label.toLowerCase())
          const percentage = (analysis.intake / analysis.target) * 100
          
          return (
            <div key={analysis.label} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{analysis.label}</span>
                  <span className={`text-xs font-medium ${status.color}`}>
                    {status.message}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span>
                    {analysis.intake.toLocaleString()}{analysis.unit} / {analysis.target.toLocaleString()}{analysis.unit}
                  </span>
                  <span>({percentage.toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">권장사항</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

## 📝 완료 조건
- [ ] 영양성분이 시각적으로 명확하게 표시됨
- [ ] 영양소 비율 차트가 정확하게 렌더링됨
- [ ] 일일 권장량 대비 섭취량이 표시됨
- [ ] 영양 분석 리포트가 유용한 정보를 제공함
- [ ] 모바일에서도 차트가 정상 표시됨

## 📊 예상 소요 시간
**3-4시간**

---
*상태: ⏳ 대기 중*
