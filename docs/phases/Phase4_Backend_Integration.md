# Phase 4: 백엔드 연동 (Backend Integration)

## 📋 개요
n8n 자동화 워크플로우와의 연동을 통해 이미지 업로드부터 AI 분석, 데이터 저장까지의 전체 백엔드 프로세스를 구현합니다.

## 🎯 목표
- n8n 웹훅과의 안정적인 통신 구현
- 시간 기반 끼니 자동 분류 로직 구현
- API 요청/응답 처리 및 에러 핸들링
- 실시간 데이터 동기화 시스템

## ⏱️ 예상 소요 시간
**2-3일 (12-18시간)**

---

## 🔗 Task 1: n8n 웹훅 연동 로직

### ✅ 체크리스트

#### n8n API 클라이언트 구현
- [ ] `src/lib/api/n8n-client.ts` 생성
```typescript
interface N8nUploadRequest {
  image: File
  userId: string
}

interface N8nUploadResponse {
  success: boolean
  data?: {
    items: FoodItem[]
    summary: NutritionSummary
    mealType?: string
    imageUrl?: string
    logId?: string
  }
  error?: {
    code: string
    message: string
  }
}

export class N8nApiClient {
  private readonly webhookUrl: string
  private readonly timeout: number = 60000 // 60초

  constructor() {
    this.webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!
    if (!this.webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL environment variable is required')
    }
  }

  async uploadFoodImage(request: N8nUploadRequest): Promise<N8nUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('image', request.image)
      formData.append('userId', request.userId)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: N8nUploadResponse = await response.json()
      return result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.')
        }
        throw new Error(`업로드 실패: ${error.message}`)
      }
      throw new Error('알 수 없는 오류가 발생했습니다.')
    }
  }
}
```

#### API 응답 타입 정의
- [ ] `src/lib/types/n8n-api.types.ts` 생성
```typescript
export interface N8nWebhookResponse {
  success: boolean
  data?: N8nAnalysisResult
  error?: N8nError
}

export interface N8nAnalysisResult {
  items: N8nFoodItem[]
  summary: N8nNutritionSummary
  mealType?: string
  imageUrl?: string
  logId?: string
}

export interface N8nFoodItem {
  foodName: string
  confidence: number
  quantity: string
  calories: number
  nutrients: N8nNutrients
}

export interface N8nNutrients {
  carbohydrates: { value: number; unit: string }
  protein: { value: number; unit: string }
  fat: { value: number; unit: string }
  sugars: { value: number; unit: string }
  sodium: { value: number; unit: string }
}

export interface N8nNutritionSummary {
  totalCalories: number
  totalCarbohydrates: { value: number; unit: string }
  totalProtein: { value: number; unit: string }
  totalFat: { value: number; unit: string }
}

export interface N8nError {
  code: string
  message: string
}

export enum N8nErrorCode {
  NO_FOOD_DETECTED = 'NO_FOOD_DETECTED',
  IMAGE_PROCESSING_FAILED = 'IMAGE_PROCESSING_FAILED',
  AI_ANALYSIS_FAILED = 'AI_ANALYSIS_FAILED',
  STORAGE_UPLOAD_FAILED = 'STORAGE_UPLOAD_FAILED',
  DATABASE_INSERT_FAILED = 'DATABASE_INSERT_FAILED',
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  WEBHOOK_TIMEOUT = 'WEBHOOK_TIMEOUT',
}
```

#### 시간 기반 끼니 분류 로직
- [ ] `src/lib/utils/meal-classification.ts` 생성
```typescript
export type MealType = '아침' | '점심' | '저녁' | '간식'

export interface MealTimeRule {
  type: MealType
  startHour: number
  endHour: number
}

// PRD에 정의된 시간 기준
export const DEFAULT_MEAL_RULES: MealTimeRule[] = [
  { type: '아침', startHour: 4, endHour: 10 },
  { type: '점심', startHour: 11, endHour: 16 },
  { type: '저녁', startHour: 17, endHour: 21 },
  { type: '간식', startHour: 22, endHour: 3 }, // 다음날 3시까지
]

export function classifyMealByTime(date: Date = new Date()): MealType {
  const hour = date.getHours()

  for (const rule of DEFAULT_MEAL_RULES) {
    if (rule.type === '간식') {
      if (hour >= rule.startHour || hour <= rule.endHour) {
        return rule.type
      }
    } else {
      if (hour >= rule.startHour && hour <= rule.endHour) {
        return rule.type
      }
    }
  }

  return '간식' // 기본값
}

export function getMealTimeRange(mealType: MealType): string {
  const rule = DEFAULT_MEAL_RULES.find(r => r.type === mealType)
  if (!rule) return ''

  if (mealType === '간식') {
    return '22:00 ~ 03:59'
  }

  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`
  return `${formatHour(rule.startHour)} ~ ${formatHour(rule.endHour)}:59`
}
```

#### n8n 에러 핸들러
- [ ] `src/lib/utils/n8n-error-handler.ts` 생성
```typescript
import { N8nError, N8nErrorCode } from '@/lib/types/n8n-api.types'

export function getN8nErrorMessage(error: N8nError): string {
  switch (error.code) {
    case N8nErrorCode.NO_FOOD_DETECTED:
      return '이미지에서 음식을 찾을 수 없습니다. 음식이 명확히 보이는 다른 사진으로 시도해주세요.'
    
    case N8nErrorCode.IMAGE_PROCESSING_FAILED:
      return '이미지 처리 중 오류가 발생했습니다. 다른 사진으로 시도해주세요.'
    
    case N8nErrorCode.AI_ANALYSIS_FAILED:
      return 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    
    case N8nErrorCode.STORAGE_UPLOAD_FAILED:
      return '이미지 저장 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.'
    
    case N8nErrorCode.DATABASE_INSERT_FAILED:
      return '데이터 저장 중 오류가 발생했습니다. 다시 시도해주세요.'
    
    case N8nErrorCode.INVALID_IMAGE_FORMAT:
      return '지원하지 않는 이미지 형식입니다. JPEG, PNG, WebP 파일을 사용해주세요.'
    
    case N8nErrorCode.IMAGE_TOO_LARGE:
      return '이미지 파일이 너무 큽니다. 10MB 이하의 파일을 사용해주세요.'
    
    case N8nErrorCode.USER_NOT_FOUND:
      return '사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.'
    
    case N8nErrorCode.WEBHOOK_TIMEOUT:
      return '처리 시간이 초과되었습니다. 다시 시도해주세요.'
    
    default:
      return error.message || '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.'
  }
}

export function isRetryableError(errorCode: string): boolean {
  const retryableErrors = [
    N8nErrorCode.AI_ANALYSIS_FAILED,
    N8nErrorCode.STORAGE_UPLOAD_FAILED,
    N8nErrorCode.DATABASE_INSERT_FAILED,
    N8nErrorCode.WEBHOOK_TIMEOUT,
  ]
  
  return retryableErrors.includes(errorCode as N8nErrorCode)
}
```

#### Mock n8n 서버 (개발용)
- [ ] `src/lib/mocks/n8n-mock.ts` 생성
```typescript
import { N8nWebhookResponse } from '@/lib/types/n8n-api.types'
import { classifyMealByTime } from '@/lib/utils/meal-classification'

export class MockN8nClient {
  async uploadFoodImage(request: { image: File; userId: string }): Promise<N8nWebhookResponse> {
    // 개발 환경에서 사용할 모의 응답
    await new Promise(resolve => setTimeout(resolve, 2000)) // 2초 딜레이

    // 랜덤하게 성공/실패 결정 (개발 테스트용)
    if (Math.random() < 0.1) { // 10% 확률로 실패
      return {
        success: false,
        error: {
          code: 'NO_FOOD_DETECTED',
          message: '이미지에서 음식을 찾을 수 없습니다.'
        }
      }
    }

    return {
      success: true,
      data: {
        items: [
          {
            foodName: '현미밥',
            confidence: 0.98,
            quantity: '1 공기 (210g)',
            calories: 310,
            nutrients: {
              carbohydrates: { value: 68.5, unit: 'g' },
              protein: { value: 6.2, unit: 'g' },
              fat: { value: 1.5, unit: 'g' },
              sugars: { value: 0.5, unit: 'g' },
              sodium: { value: 8.0, unit: 'mg' }
            }
          }
        ],
        summary: {
          totalCalories: 310,
          totalCarbohydrates: { value: 68.5, unit: 'g' },
          totalProtein: { value: 6.2, unit: 'g' },
          totalFat: { value: 1.5, unit: 'g' }
        },
        mealType: classifyMealByTime(),
        imageUrl: 'https://example.com/mock-image.jpg',
        logId: 'mock-log-id'
      }
    }
  }
}
```

---

## 🔄 Task 2: API 요청/응답 처리

### ✅ 체크리스트

#### 재시도 로직 구현
- [ ] `src/lib/utils/retry-logic.ts` 생성
```typescript
export interface RetryOptions {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelay: 1000, // 1초
  maxDelay: 10000, // 10초
  backoffMultiplier: 2,
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = DEFAULT_RETRY_OPTIONS,
  shouldRetry?: (error: any) => boolean
): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (shouldRetry && !shouldRetry(error)) {
        throw error
      }
      
      if (attempt === options.maxAttempts) {
        throw error
      }
      
      const delay = Math.min(
        options.baseDelay * Math.pow(options.backoffMultiplier, attempt - 1),
        options.maxDelay
      )
      
      const jitter = delay * 0.25 * (Math.random() * 2 - 1)
      const actualDelay = delay + jitter
      
      await new Promise(resolve => setTimeout(resolve, actualDelay))
    }
  }
  
  throw lastError
}
```

#### 업로드 진행 상황 추적
- [ ] `src/hooks/useUploadProgress.ts` 생성
```typescript
'use client'

import { useState, useCallback, useRef } from 'react'

export interface UploadProgress {
  stage: 'idle' | 'uploading' | 'analyzing' | 'saving' | 'completed' | 'error'
  progress: number
  message: string
  error?: string
}

const STAGE_MESSAGES = {
  idle: '대기 중',
  uploading: '이미지 업로드 중...',
  analyzing: 'AI가 음식을 분석 중...',
  saving: '데이터 저장 중...',
  completed: '완료!',
  error: '오류 발생'
}

const STAGE_PROGRESS = {
  idle: 0,
  uploading: 25,
  analyzing: 60,
  saving: 85,
  completed: 100,
  error: 0
}

export function useUploadProgress() {
  const [progress, setProgress] = useState<UploadProgress>({
    stage: 'idle',
    progress: 0,
    message: STAGE_MESSAGES.idle
  })

  const timeoutRef = useRef<NodeJS.Timeout>()

  const updateStage = useCallback((stage: UploadProgress['stage'], error?: string) => {
    setProgress({
      stage,
      progress: STAGE_PROGRESS[stage],
      message: STAGE_MESSAGES[stage],
      error
    })
  }, [])

  const simulateProgress = useCallback((fromStage: UploadProgress['stage'], toStage: UploadProgress['stage'], duration: number = 2000) => {
    const startProgress = STAGE_PROGRESS[fromStage]
    const endProgress = STAGE_PROGRESS[toStage]
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progressRatio = Math.min(elapsed / duration, 1)
      const currentProgress = startProgress + (endProgress - startProgress) * progressRatio

      setProgress(prev => ({
        ...prev,
        progress: currentProgress
      }))

      if (progressRatio < 1) {
        timeoutRef.current = setTimeout(animate, 50)
      } else {
        updateStage(toStage)
      }
    }

    animate()
  }, [updateStage])

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    updateStage('idle')
  }, [updateStage])

  return {
    progress,
    updateStage,
    simulateProgress,
    reset
  }
}
```

#### 네트워크 상태 감지
- [ ] `src/hooks/useNetworkStatus.ts` 생성
```typescript
'use client'

import { useState, useEffect } from 'react'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>('unknown')

  useEffect(() => {
    setIsOnline(navigator.onLine)

    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      setConnectionType(connection?.effectiveType || 'unknown')
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    const handleConnectionChange = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setConnectionType(connection?.effectiveType || 'unknown')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', handleConnectionChange)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  const isSlowConnection = connectionType === 'slow-2g' || connectionType === '2g'

  return {
    isOnline,
    connectionType,
    isSlowConnection
  }
}
```

#### 통합 API 서비스
- [ ] `src/lib/services/api.service.ts` 생성
```typescript
import { FoodUploadService } from './food-upload.service'
import { DataSyncService } from './data-sync.service'

export class ApiService {
  private foodUpload: FoodUploadService
  private dataSync: DataSyncService

  constructor() {
    this.foodUpload = new FoodUploadService()
    this.dataSync = new DataSyncService()
  }

  async uploadAndSync(file: File, userId: string) {
    try {
      const uploadResult = await this.foodUpload.uploadFoodImage(file, userId)
      
      if (!uploadResult.success) {
        return uploadResult
      }

      if (uploadResult.data?.logId) {
        await this.dataSync.syncFoodLog(uploadResult.data.logId)
      }

      return uploadResult
    } catch (error) {
      console.error('Upload and sync error:', error)
      return {
        success: false,
        error: '업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
      }
    }
  }

  async refreshDashboardData(userId: string, date: Date) {
    return await this.dataSync.refreshUserData(userId, date)
  }
}

export const apiService = new ApiService()
```

#### 네트워크 상태 표시 컴포넌트
- [ ] `src/components/ui/NetworkStatus.tsx` 생성
```typescript
'use client'

import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { Wifi, WifiOff, Clock } from 'lucide-react'

export function NetworkStatus() {
  const { isOnline, isSlowConnection } = useNetworkStatus()

  if (isOnline && !isSlowConnection) {
    return null
  }

  return (
    <div className={`fixed top-16 left-4 right-4 z-50 p-3 rounded-lg shadow-lg ${
      isOnline ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <>
            <Clock className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                느린 연결이 감지되었습니다.
              </p>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">오프라인 상태</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

---

## 📊 Task 3: 데이터 동기화 로직

### ✅ 체크리스트

#### 데이터 동기화 서비스
- [ ] `src/lib/services/data-sync.service.ts` 생성
```typescript
import { createClient } from '@/lib/supabase/client'
import { N8nAnalysisResult } from '@/lib/types/n8n-api.types'

export interface SyncResult {
  success: boolean
  data?: any
  error?: string
}

export class DataSyncService {
  private supabase = createClient()

  async syncAnalysisResult(result: N8nAnalysisResult, userId: string): Promise<SyncResult> {
    try {
      // 1. food_logs 테이블에 기본 정보 저장/업데이트
      const { data: foodLog, error: logError } = await this.supabase
        .from('food_logs')
        .upsert({
          id: result.logId,
          user_id: userId,
          image_url: result.imageUrl,
          meal_type: result.mealType,
          logged_at: new Date().toISOString(),
          analysis_status: 'completed',
          total_calories: result.summary.totalCalories,
        })
        .select()
        .single()

      if (logError) throw logError

      // 2. 기존 food_items 및 nutrients 삭제 (재분석 시)
      await this.supabase
        .from('food_items')
        .delete()
        .eq('food_log_id', result.logId!)

      // 3. food_items 저장
      const foodItems = result.items.map(item => ({
        food_log_id: result.logId!,
        food_name: item.foodName,
        confidence: item.confidence,
        quantity: item.quantity,
        calories: item.calories,
      }))

      const { data: insertedItems, error: itemsError } = await this.supabase
        .from('food_items')
        .insert(foodItems)
        .select()

      if (itemsError) throw itemsError

      // 4. nutrients 저장
      const nutrients: any[] = []
      insertedItems.forEach((item, index) => {
        const originalItem = result.items[index]
        Object.entries(originalItem.nutrients).forEach(([type, nutrient]) => {
          nutrients.push({
            food_item_id: item.id,
            nutrient_type: type,
            value: nutrient.value,
            unit: nutrient.unit,
          })
        })
      })

      const { error: nutrientsError } = await this.supabase
        .from('nutrients')
        .insert(nutrients)

      if (nutrientsError) throw nutrientsError

      return { success: true, data: foodLog }
    } catch (error) {
      console.error('Data sync error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '데이터 동기화 중 오류가 발생했습니다.'
      }
    }
  }

  async syncFoodLog(logId: string): Promise<SyncResult> {
    try {
      const { data, error } = await this.supabase
        .from('food_logs')
        .select(`
          *,
          food_items (
            *,
            nutrients (*)
          )
        `)
        .eq('id', logId)
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Food log sync error:', error)
      return {
        success: false,
        error: '식단 기록 동기화 중 오류가 발생했습니다.'
      }
    }
  }

  async refreshUserData(userId: string, date: Date): Promise<SyncResult> {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const { data, error } = await this.supabase
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

      return { success: true, data }
    } catch (error) {
      console.error('User data refresh error:', error)
      return {
        success: false,
        error: '데이터 새로고침 중 오류가 발생했습니다.'
      }
    }
  }
}
```

#### 실시간 데이터 구독 훅
- [ ] `src/hooks/useRealtimeData.ts` 생성
```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function useRealtimeData(userId: string, selectedDate: Date) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    let subscription: any

    const setupRealtimeSubscription = () => {
      subscription = supabase
        .channel('food_logs_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'food_logs',
            filter: `user_id=eq.${userId}`,
          },
          (payload: RealtimePostgresChangesPayload<any>) => {
            handleRealtimeChange(payload)
          }
        )
        .subscribe()
    }

    const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<any>) => {
      const { eventType, new: newRecord, old: oldRecord } = payload

      setData(currentData => {
        switch (eventType) {
          case 'INSERT':
            return [newRecord, ...currentData]
          
          case 'UPDATE':
            return currentData.map(item => 
              item.id === newRecord.id ? { ...item, ...newRecord } : item
            )
          
          case 'DELETE':
            return currentData.filter(item => item.id !== oldRecord.id)
          
          default:
            return currentData
        }
      })
    }

    const fetchInitialData = async () => {
      setLoading(true)
      
      try {
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)
        
        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        const { data: initialData, error } = await supabase
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

        setData(initialData || [])
        setupRealtimeSubscription()
      } catch (error) {
        console.error('Initial data fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [userId, selectedDate])

  return { data, loading, setData }
}
```

#### 통합 업로드 훅
- [ ] `src/hooks/useFileUploadIntegrated.ts` 업데이트
```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/Providers'
import { useUploadProgress } from './useUploadProgress'
import { useNetworkStatus } from './useNetworkStatus'
import { apiService } from '@/lib/services/api.service'

export function useFileUploadIntegrated() {
  const { user } = useAuth()
  const { progress, updateStage, simulateProgress, reset } = useUploadProgress()
  const { isOnline, isSlowConnection } = useNetworkStatus()
  const [result, setResult] = useState<any>(null)

  const uploadFile = async (file: File) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    setResult(null)
    updateStage('uploading')

    try {
      if (!isOnline) {
        throw new Error('네트워크 연결을 확인해주세요.')
      }

      const duration = isSlowConnection ? 4000 : 2000
      simulateProgress('uploading', 'analyzing', duration)

      const uploadResult = await apiService.uploadAndSync(file, user.id)

      if (uploadResult.success) {
        updateStage('saving')
        await new Promise(resolve => setTimeout(resolve, 1000))
        updateStage('completed')
        
        setResult({
          success: true,
          data: uploadResult.data,
          message: '식단이 성공적으로 기록되었습니다!'
        })
      } else {
        updateStage('error', uploadResult.error)
        setResult({
          success: false,
          error: uploadResult.error
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      updateStage('error', '업로드 중 오류가 발생했습니다.')
      setResult({
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      })
    }
  }

  const resetUpload = () => {
    reset()
    setResult(null)
  }

  return {
    ...progress,
    result,
    isOnline,
    isSlowConnection,
    uploadFile,
    resetUpload
  }
}
```

---

## 📝 완료 조건

### Phase 4 완료 체크리스트
- [ ] n8n 웹훅과의 통신이 안정적으로 작동함
- [ ] 시간 기반 끼니 분류 로직이 정확히 구현됨
- [ ] 실시간 업로드 진행 상황이 표시됨
- [ ] 네트워크 오류 시 적절한 재시도 로직이 작동함
- [ ] 사용자 친화적인 피드백이 제공됨
- [ ] 데이터 동기화가 정상 작동함
- [ ] 실시간 데이터 업데이트가 구현됨
- [ ] 개발 환경에서 Mock 서버로 테스트 가능함

---

## ⚠️ 주의사항

- **타임아웃**: n8n 웹훅 URL을 환경변수로 안전하게 관리
- **재시도**: 네트워크 오류 시 적절한 재시도 로직 구현
- **피드백**: 사용자에게 명확한 진행 상황 및 에러 메시지 제공
- **실시간성**: Supabase Realtime을 활용한 데이터 동기화
- **성능**: 이미지 압축으로 업로드 속도 최적화

---

## 🔗 다음 단계
Phase 4 완료 후 → **Phase 5: 고급 기능** 진행

---
*Phase 4 상태: ⏳ 준비됨*
