# Task 12: 끼니 자동 분류 표시

## 📋 개요
n8n에서 시간 기반으로 자동 분류된 끼니 정보를 사용자에게 직관적으로 표시하는 기능을 구현합니다.

## 🎯 목표
- 시간대별 끼니 분류 규칙의 시각적 표현
- 자동 분류 결과의 명확한 표시
- 사용자가 분류 로직을 이해할 수 있는 인터페이스
- 분류 정확도 향상을 위한 피드백 시스템

## ✅ 체크리스트

### 끼니 분류 표시 컴포넌트
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

### 시간대별 분류 가이드
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

### 분류 정확도 피드백
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

### 분류 통계 대시보드
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

## 📝 완료 조건
- [ ] 끼니 자동 분류가 시각적으로 명확하게 표시됨
- [ ] 사용자가 분류 기준을 쉽게 이해할 수 있음
- [ ] 분류 정확도 피드백 시스템이 작동함
- [ ] 끼니별 통계가 정확하게 계산되어 표시됨

## 📊 예상 소요 시간
**2-3시간**

---
*상태: ⏳ 대기 중*
