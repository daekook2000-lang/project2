# Task 09: n8n 웹훅 연동 로직

## 📋 개요
n8n 자동화 워크플로우와 연동하여 이미지 업로드부터 AI 분석, 데이터 저장까지의 전체 프로세스를 구현합니다.

## 🎯 목표
- n8n 웹훅 엔드포인트와의 안정적인 통신 구현
- 시간 기반 끼니 자동 분류 로직 검증
- AI 분석 결과 처리 및 에러 핸들링
- 데이터 동기화 메커니즘 구현

## ✅ 체크리스트

### n8n 웹훅 API 클라이언트 구현

#### 1. API 클라이언트 기본 구조
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
  }
  error?: {
    code: string
    message: string
  }
}

interface FoodItem {
  foodName: string
  confidence: number
  quantity: string
  calories: number
  nutrients: {
    carbohydrates: { value: number; unit: string }
    protein: { value: number; unit: string }
    fat: { value: number; unit: string }
    sugars: { value: number; unit: string }
    sodium: { value: number; unit: string }
  }
}

interface NutritionSummary {
  totalCalories: number
  totalCarbohydrates: { value: number; unit: string }
  totalProtein: { value: number; unit: string }
  totalFat: { value: number; unit: string }
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
        headers: {
          // multipart/form-data는 브라우저가 자동으로 설정
        },
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

#### 2. API 응답 타입 정의
- [ ] `src/lib/types/n8n-api.types.ts` 생성
```typescript
export interface N8nWebhookRequest {
  image: File
  userId: string
}

export interface N8nWebhookResponse {
  success: boolean
  data?: N8nAnalysisResult
  error?: N8nError
}

export interface N8nAnalysisResult {
  items: N8nFoodItem[]
  summary: N8nNutritionSummary
  mealType?: string // n8n에서 자동 분류한 끼니 타입
  imageUrl?: string // Supabase Storage에 저장된 이미지 URL
  logId?: string // 생성된 food_log ID
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

// n8n 에러 코드 정의
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

### 시간 기반 끼니 분류 검증

#### 1. 끼니 분류 로직 구현
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
      // 간식은 22시부터 다음날 3시까지
      if (hour >= rule.startHour || hour <= rule.endHour) {
        return rule.type
      }
    } else {
      // 일반적인 시간 범위
      if (hour >= rule.startHour && hour <= rule.endHour) {
        return rule.type
      }
    }
  }

  // 기본값 (일반적으로 발생하지 않음)
  return '간식'
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

// 현재 시간 기준으로 다음 끼니 예측
export function getNextMealType(currentDate: Date = new Date()): MealType {
  const currentHour = currentDate.getHours()
  
  if (currentHour >= 22 || currentHour <= 3) return '아침'
  if (currentHour >= 4 && currentHour <= 10) return '점심'
  if (currentHour >= 11 && currentHour <= 16) return '저녁'
  if (currentHour >= 17 && currentHour <= 21) return '간식'
  
  return '아침'
}
```

### 에러 처리 및 사용자 피드백

#### 1. n8n 에러 핸들러
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

### 재시도 로직 구현

#### 1. 지수 백오프 재시도
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
      
      // 재시도 가능한 에러인지 확인
      if (shouldRetry && !shouldRetry(error)) {
        throw error
      }
      
      // 마지막 시도인 경우 에러 던지기
      if (attempt === options.maxAttempts) {
        throw error
      }
      
      // 지수 백오프 딜레이 계산
      const delay = Math.min(
        options.baseDelay * Math.pow(options.backoffMultiplier, attempt - 1),
        options.maxDelay
      )
      
      // 지터 추가 (±25%)
      const jitter = delay * 0.25 * (Math.random() * 2 - 1)
      const actualDelay = delay + jitter
      
      await new Promise(resolve => setTimeout(resolve, actualDelay))
    }
  }
  
  throw lastError
}
```

### 업로드 서비스 통합

#### 1. 통합 업로드 서비스
- [ ] `src/lib/services/food-upload.service.ts` 생성
```typescript
import { N8nApiClient } from '@/lib/api/n8n-client'
import { getN8nErrorMessage, isRetryableError } from '@/lib/utils/n8n-error-handler'
import { withRetry } from '@/lib/utils/retry-logic'
import { validateImageFile } from '@/lib/utils/file-validation'
import { compressImage } from '@/lib/utils/image-compression'

export interface UploadResult {
  success: boolean
  data?: any
  error?: string
}

export class FoodUploadService {
  private n8nClient: N8nApiClient

  constructor() {
    this.n8nClient = new N8nApiClient()
  }

  async uploadFoodImage(file: File, userId: string): Promise<UploadResult> {
    try {
      // 1. 파일 검증
      const validation = validateImageFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // 2. 이미지 압축 (필요시)
      let processedFile = file
      if (file.size > 2 * 1024 * 1024) { // 2MB 이상인 경우 압축
        processedFile = await compressImage(file)
      }

      // 3. n8n 웹훅으로 업로드 (재시도 로직 포함)
      const result = await withRetry(
        () => this.n8nClient.uploadFoodImage({
          image: processedFile,
          userId,
        }),
        undefined,
        (error) => {
          // n8n 에러인 경우 재시도 가능 여부 확인
          if (error.message && typeof error.message === 'string') {
            try {
              const errorData = JSON.parse(error.message)
              return isRetryableError(errorData.error?.code)
            } catch {
              return true // JSON 파싱 실패 시 재시도
            }
          }
          return true
        }
      )

      if (!result.success) {
        const errorMessage = result.error 
          ? getN8nErrorMessage(result.error)
          : '업로드 중 오류가 발생했습니다.'
        
        return { success: false, error: errorMessage }
      }

      return { success: true, data: result.data }
    } catch (error) {
      console.error('Food upload error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.'
      }
    }
  }
}
```

### 개발/테스트 환경 설정

#### 1. Mock n8n 서버 (개발용)
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

## 📝 완료 조건
- [ ] n8n 웹훅과의 통신이 안정적으로 작동함
- [ ] 시간 기반 끼니 분류 로직이 정확히 구현됨
- [ ] 에러 처리가 사용자 친화적으로 구현됨
- [ ] 재시도 로직이 적절히 작동함
- [ ] 파일 검증 및 압축이 정상 동작함
- [ ] 개발 환경에서 Mock 서버로 테스트 가능함

## ⚠️ 주의사항
- n8n 웹훅 URL을 환경변수로 안전하게 관리
- 파일 업로드 시 타임아웃 설정 (60초 권장)
- 네트워크 오류 시 적절한 재시도 로직 구현
- 사용자에게 명확한 진행 상황 및 에러 메시지 제공

## 🔗 의존성
- **선행 작업**: [07_photo_upload.md](./07_photo_upload.md)
- **후속 작업**: [10_api_integration.md](./10_api_integration.md)

## 📊 예상 소요 시간
**4-5시간**

---
*상태: ⏳ 대기 중*
