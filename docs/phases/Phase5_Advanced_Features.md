# Phase 5: 고급 기능 (Advanced Features)

## 📋 개요
사용자 경험을 향상시키는 고급 기능들을 구현합니다. 끼니 분류 표시, 영양성분 시각화, 로딩 상태 처리 등을 포함합니다.

## 🎯 목표
- 끼니 자동 분류 결과의 직관적 표시
- 영양성분 정보의 시각적 표현
- 포괄적인 로딩 상태 및 에러 처리
- 사용자 피드백 시스템 구현

## ⏱️ 예상 소요 시간
**2-3일 (12-18시간)**

---

## 🍽️ Task 1: 끼니 자동 분류 표시

### ✅ 체크리스트

#### 끼니 분류 표시 컴포넌트
- [ ] `src/components/meal/MealTypeIndicator.tsx` 생성
```typescript
'use client'

import { getMealTimeRange } from '@/lib/utils/meal-classification'

interface MealTypeIndicatorProps {
  mealType: '아침' | '점심' | '저녁' | '간식'
  loggedAt: string
  showTimeRange?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function MealTypeIndicator({ 
  mealType, 
  loggedAt, 
  showTimeRange = false,
  size = 'md'
}: MealTypeIndicatorProps) {
  const getMealConfig = (type: string) => {
    const configs = {
      '아침': {
        icon: '🌅',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        darkColor: 'bg-orange-500',
      },
      '점심': {
        icon: '☀️',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        darkColor: 'bg-yellow-500',
      },
      '저녁': {
        icon: '🌙',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        darkColor: 'bg-blue-500',
      },
      '간식': {
        icon: '🍪',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        darkColor: 'bg-purple-500',
      },
    }
    return configs[type as keyof typeof configs]
  }

  const config = getMealConfig(mealType)
  const timeRange = getMealTimeRange(mealType)
  const loggedTime = new Date(loggedAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`
        inline-flex items-center space-x-1 rounded-full border font-medium
        ${config.color} ${sizeClasses[size]}
      `}>
        <span>{config.icon}</span>
        <span>{mealType}</span>
      </div>
      
      <div className="text-xs text-gray-500">
        {loggedTime}
        {showTimeRange && (
          <div className="text-xs text-gray-400 mt-1">
            ({timeRange})
          </div>
        )}
      </div>
    </div>
  )
}
```

#### 시간대별 분류 가이드
- [ ] `src/components/meal/MealTimeGuide.tsx` 생성
```typescript
'use client'

import { DEFAULT_MEAL_RULES } from '@/lib/utils/meal-classification'
import { Clock } from 'lucide-react'

export function MealTimeGuide() {
  const formatTime = (hour: number) => `${hour.toString().padStart(2, '0')}:00`

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Clock size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">자동 분류 기준</h3>
      </div>
      
      <div className="space-y-3">
        {DEFAULT_MEAL_RULES.map((rule) => {
          const config = {
            '아침': { icon: '🌅', color: 'text-orange-600' },
            '점심': { icon: '☀️', color: 'text-yellow-600' },
            '저녁': { icon: '🌙', color: 'text-blue-600' },
            '간식': { icon: '🍪', color: 'text-purple-600' },
          }[rule.type]

          const timeRange = rule.type === '간식' 
            ? '22:00 - 03:59' 
            : `${formatTime(rule.startHour)} - ${formatTime(rule.endHour)}:59`

          return (
            <div key={rule.type} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{config?.icon}</span>
                <span className={`font-medium ${config?.color}`}>{rule.type}</span>
              </div>
              <span className="text-sm text-gray-600 font-mono">
                {timeRange}
              </span>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>자동 분류:</strong> 사진을 업로드한 시각을 기준으로 끼니가 자동으로 분류됩니다.
        </p>
      </div>
    </div>
  )
}
```

#### 분류 정확도 피드백
- [ ] `src/components/meal/MealFeedback.tsx` 생성
```typescript
'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'

interface MealFeedbackProps {
  logId: string
  mealType: string
  onFeedback?: (logId: string, isCorrect: boolean, comment?: string) => void
}

export function MealFeedback({ logId, mealType, onFeedback }: MealFeedbackProps) {
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')

  const handleFeedback = (isCorrect: boolean) => {
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    if (!isCorrect) {
      setShowComment(true)
    } else {
      onFeedback?.(logId, isCorrect)
    }
  }

  const submitFeedback = () => {
    onFeedback?.(logId, false, comment)
    setShowComment(false)
  }

  if (feedback === 'correct') {
    return (
      <div className="text-xs text-green-600 flex items-center space-x-1">
        <ThumbsUp size={12} />
        <span>피드백 감사합니다!</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {!feedback && (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">분류가 정확한가요?</span>
          <button
            onClick={() => handleFeedback(true)}
            className="text-green-600 hover:text-green-700 p-1"
            title="정확함"
          >
            <ThumbsUp size={12} />
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className="text-red-600 hover:text-red-700 p-1"
            title="부정확함"
          >
            <ThumbsDown size={12} />
          </button>
        </div>
      )}

      {showComment && (
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MessageSquare size={12} className="text-gray-400 mt-1" />
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="어떤 끼니로 분류되어야 할까요?"
                className="w-full text-xs p-2 border border-gray-200 rounded resize-none"
                rows={2}
              />
              <div className="flex justify-end space-x-1 mt-1">
                <button
                  onClick={() => setShowComment(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                >
                  취소
                </button>
                <button
                  onClick={submitFeedback}
                  className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1"
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

#### 분류 통계 대시보드
- [ ] `src/components/meal/MealStats.tsx` 생성
```typescript
'use client'

interface MealStatsProps {
  data: Array<{
    mealType: string
    count: number
    totalCalories: number
  }>
}

export function MealStats({ data }: MealStatsProps) {
  const totalMeals = data.reduce((sum, item) => sum + item.count, 0)
  const totalCalories = data.reduce((sum, item) => sum + item.totalCalories, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="font-semibold text-gray-900 mb-4">끼니별 통계</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalMeals}</div>
          <div className="text-sm text-gray-500">총 기록</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalCalories.toLocaleString()}</div>
          <div className="text-sm text-gray-500">총 칼로리</div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const percentage = totalMeals > 0 ? (item.count / totalMeals) * 100 : 0
          const config = {
            '아침': { icon: '🌅', color: 'bg-orange-500' },
            '점심': { icon: '☀️', color: 'bg-yellow-500' },
            '저녁': { icon: '🌙', color: 'bg-blue-500' },
            '간식': { icon: '🍪', color: 'bg-purple-500' },
          }[item.mealType as keyof typeof config] || { icon: '🍽️', color: 'bg-gray-500' }

          return (
            <div key={item.mealType}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span>{config.icon}</span>
                  <span className="text-sm font-medium">{item.mealType}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.count}회</div>
                  <div className="text-xs text-gray-500">{item.totalCalories}kcal</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${config.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## 📊 Task 2: 영양성분 표시 기능

### ✅ 체크리스트

#### 영양성분 카드 컴포넌트
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

#### 영양소 비율 차트
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

#### 일일 영양 목표 설정
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

---

## ⏳ Task 3: 로딩 상태 및 에러 처리

### ✅ 체크리스트

#### 로딩 컴포넌트들
- [ ] `src/components/ui/LoadingSpinner.tsx` 생성
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'gray' | 'white'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white'
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        border-2 ${colorClasses[color]} border-t-transparent 
        rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="로딩 중"
    />
  )
}
```

#### 스켈레톤 로더
- [ ] `src/components/ui/Skeleton.tsx` 생성
```typescript
interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className = '', children }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      role="status"
      aria-label="콘텐츠 로딩 중"
    >
      {children}
    </div>
  )
}

// 프리셋 스켈레톤들
export function FoodLogSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <Skeleton key={j} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### 에러 경계 컴포넌트
- [ ] `src/components/ui/ErrorBoundary.tsx` 생성
```typescript
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              문제가 발생했습니다
            </h3>
            <p className="text-gray-600 mb-4">
              예상치 못한 오류가 발생했습니다. 다시 시도해주세요.
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>다시 시도</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

#### 에러 표시 컴포넌트
- [ ] `src/components/ui/ErrorMessage.tsx` 생성
```typescript
'use client'

import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorMessageProps {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void
  showHomeLink?: boolean
  className?: string
}

export function ErrorMessage({
  title = '오류가 발생했습니다',
  message,
  type = 'error',
  onRetry,
  showHomeLink = false,
  className = ''
}: ErrorMessageProps) {
  const typeStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      title: 'text-red-800',
      text: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200', 
      icon: 'text-yellow-500',
      title: 'text-yellow-800',
      text: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500', 
      title: 'text-blue-800',
      text: 'text-blue-700'
    }
  }

  const styles = typeStyles[type]

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${styles.title}`}>
            {title}
          </h3>
          <p className={`text-sm ${styles.text} mt-1`}>
            {message}
          </p>
          
          {(onRetry || showHomeLink) && (
            <div className="flex items-center space-x-3 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`
                    inline-flex items-center space-x-1 text-sm font-medium
                    ${styles.title} hover:underline
                  `}
                >
                  <RefreshCw size={14} />
                  <span>다시 시도</span>
                </button>
              )}
              
              {showHomeLink && (
                <Link
                  href="/"
                  className={`
                    inline-flex items-center space-x-1 text-sm font-medium
                    ${styles.title} hover:underline
                  `}
                >
                  <Home size={14} />
                  <span>홈으로 가기</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

#### 빈 상태 컴포넌트
- [ ] `src/components/ui/EmptyState.tsx` 생성
```typescript
'use client'

import { ReactNode } from 'react'
import { Camera } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon = <Camera className="w-12 h-12 text-gray-400" />,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
}

// 프리셋 빈 상태들
export function EmptyFoodLogs() {
  return (
    <EmptyState
      title="기록된 식단이 없습니다"
      description="첫 번째 식단을 기록해보세요!"
      action={
        <Link 
          href="/upload"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          식단 기록하기
        </Link>
      }
    />
  )
}
```

#### 로딩 상태 통합 훅
- [ ] `src/hooks/useAsyncOperation.ts` 생성
```typescript
'use client'

import { useState, useCallback } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useAsyncOperation<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null })
    
    try {
      const result = await operation()
      setState({ data: result, loading: false, error: null })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  const retry = useCallback(async (operation: () => Promise<T>) => {
    return execute(operation)
  }, [execute])

  return {
    ...state,
    execute,
    reset,
    retry
  }
}
```

---

## 📝 완료 조건

### Phase 5 완료 체크리스트
- [ ] 끼니 자동 분류가 시각적으로 명확하게 표시됨
- [ ] 사용자가 분류 기준을 쉽게 이해할 수 있음
- [ ] 분류 정확도 피드백 시스템이 작동함
- [ ] 끼니별 통계가 정확하게 계산되어 표시됨
- [ ] 영양성분이 시각적으로 명확하게 표시됨
- [ ] 영양소 비율 차트가 정확하게 렌더링됨
- [ ] 일일 권장량 대비 섭취량이 표시됨
- [ ] 일관된 로딩 상태가 모든 비동기 작업에서 표시됨
- [ ] 에러 상황에서 사용자 친화적인 메시지가 표시됨
- [ ] 빈 상태에서 명확한 가이드가 제공됨
- [ ] 접근성 기준을 충족함 (스크린 리더 지원)

---

## ⚠️ 주의사항

- **시각적 일관성**: 모든 컴포넌트에서 일관된 디자인 시스템 적용
- **성능**: 차트 렌더링 시 메모이제이션으로 최적화
- **접근성**: 색상뿐만 아니라 텍스트로도 정보 전달
- **모바일**: 터치 인터페이스에서 차트 및 버튼 크기 고려
- **에러 복구**: 사용자가 쉽게 문제를 해결할 수 있는 옵션 제공

---

## 🔗 다음 단계
Phase 5 완료 후 → **Phase 6: 최적화 및 배포** 진행

---
*Phase 5 상태: ⏳ 준비됨*
