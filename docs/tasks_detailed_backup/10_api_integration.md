# Task 10: API 요청/응답 처리

## 📋 개요
프론트엔드와 백엔드(n8n) 간의 API 통신을 안정적으로 처리하고, 사용자 경험을 개선하는 통합 시스템을 구현합니다.

## 🎯 목표
- n8n 웹훅과의 안정적인 통신 구현
- 실시간 업로드 진행 상황 추적
- 네트워크 오류 및 재시도 로직 구현
- 사용자 친화적인 피드백 시스템

## ✅ 체크리스트

### 통합 API 서비스 구현
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

  // 식단 업로드 및 동기화
  async uploadAndSync(file: File, userId: string) {
    try {
      // 1. n8n으로 파일 업로드
      const uploadResult = await this.foodUpload.uploadFoodImage(file, userId)
      
      if (!uploadResult.success) {
        return uploadResult
      }

      // 2. 로컬 데이터베이스와 동기화
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

  // 데이터 새로고침
  async refreshDashboardData(userId: string, date: Date) {
    return await this.dataSync.refreshUserData(userId, date)
  }
}

// 싱글톤 인스턴스
export const apiService = new ApiService()
```

### 업로드 진행 상황 추적
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

### 네트워크 상태 감지
- [ ] `src/hooks/useNetworkStatus.ts` 생성
```typescript
'use client'

import { useState, useEffect } from 'react'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>('unknown')

  useEffect(() => {
    // 초기 상태 설정
    setIsOnline(navigator.onLine)

    // 연결 정보 가져오기 (지원되는 브라우저에서만)
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

    // 이벤트 리스너 등록
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

### 오프라인 큐 시스템
- [ ] `src/lib/services/offline-queue.service.ts` 생성
```typescript
interface QueueItem {
  id: string
  type: 'upload' | 'sync'
  data: any
  timestamp: number
  retryCount: number
}

export class OfflineQueueService {
  private queue: QueueItem[] = []
  private isProcessing = false
  private readonly STORAGE_KEY = 'offline_queue'
  private readonly MAX_RETRIES = 3

  constructor() {
    this.loadQueue()
  }

  // 큐에 아이템 추가
  addToQueue(type: 'upload' | 'sync', data: any): string {
    const item: QueueItem = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    }

    this.queue.push(item)
    this.saveQueue()
    
    // 온라인 상태면 즉시 처리 시도
    if (navigator.onLine) {
      this.processQueue()
    }

    return item.id
  }

  // 큐 처리
  async processQueue() {
    if (this.isProcessing || !navigator.onLine || this.queue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.queue.length > 0) {
      const item = this.queue[0]

      try {
        await this.processItem(item)
        this.queue.shift() // 성공 시 제거
      } catch (error) {
        console.error('Queue item processing failed:', error)
        
        item.retryCount++
        if (item.retryCount >= this.MAX_RETRIES) {
          this.queue.shift() // 최대 재시도 횟수 초과 시 제거
        } else {
          // 재시도를 위해 큐 끝으로 이동
          this.queue.shift()
          this.queue.push(item)
        }
      }

      this.saveQueue()
    }

    this.isProcessing = false
  }

  private async processItem(item: QueueItem) {
    switch (item.type) {
      case 'upload':
        // 업로드 처리 로직
        const { apiService } = await import('./api.service')
        return await apiService.uploadAndSync(item.data.file, item.data.userId)
      
      case 'sync':
        // 동기화 처리 로직
        const { DataSyncService } = await import('./data-sync.service')
        const syncService = new DataSyncService()
        return await syncService.syncFoodLog(item.data.logId)
      
      default:
        throw new Error(`Unknown queue item type: ${item.type}`)
    }
  }

  private loadQueue() {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.queue = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error)
      this.queue = []
    }
  }

  private saveQueue() {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue))
    } catch (error) {
      console.error('Failed to save offline queue:', error)
    }
  }

  // 큐 상태 조회
  getQueueStatus() {
    return {
      totalItems: this.queue.length,
      isProcessing: this.isProcessing,
      items: this.queue.map(item => ({
        id: item.id,
        type: item.type,
        timestamp: item.timestamp,
        retryCount: item.retryCount
      }))
    }
  }

  // 특정 아이템 제거
  removeItem(id: string) {
    this.queue = this.queue.filter(item => item.id !== id)
    this.saveQueue()
  }

  // 큐 초기화
  clearQueue() {
    this.queue = []
    this.saveQueue()
  }
}

export const offlineQueue = new OfflineQueueService()
```

### 통합 업로드 훅
- [ ] `src/hooks/useFileUploadIntegrated.ts` 업데이트
```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/Providers'
import { useUploadProgress } from './useUploadProgress'
import { useNetworkStatus } from './useNetworkStatus'
import { apiService } from '@/lib/services/api.service'
import { offlineQueue } from '@/lib/services/offline-queue.service'

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
        // 오프라인 상태면 큐에 추가
        const queueId = offlineQueue.addToQueue('upload', { file, userId: user.id })
        updateStage('completed')
        setResult({
          success: true,
          queued: true,
          queueId,
          message: '오프라인 상태입니다. 연결되면 자동으로 업로드됩니다.'
        })
        return
      }

      // 느린 연결에서는 더 긴 시뮬레이션
      const duration = isSlowConnection ? 4000 : 2000

      // 업로드 진행 시뮬레이션
      simulateProgress('uploading', 'analyzing', duration)

      // 실제 업로드 수행
      const uploadResult = await apiService.uploadAndSync(file, user.id)

      if (uploadResult.success) {
        updateStage('saving')
        await new Promise(resolve => setTimeout(resolve, 1000)) // 저장 시뮬레이션
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

### 네트워크 상태 표시 컴포넌트
- [ ] `src/components/ui/NetworkStatus.tsx` 생성
```typescript
'use client'

import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { offlineQueue } from '@/lib/services/offline-queue.service'
import { Wifi, WifiOff, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

export function NetworkStatus() {
  const { isOnline, isSlowConnection } = useNetworkStatus()
  const [queueStatus, setQueueStatus] = useState(offlineQueue.getQueueStatus())

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueStatus(offlineQueue.getQueueStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isOnline && queueStatus.totalItems > 0) {
      offlineQueue.processQueue()
    }
  }, [isOnline, queueStatus.totalItems])

  if (isOnline && queueStatus.totalItems === 0) {
    return null // 정상 상태일 때는 표시하지 않음
  }

  return (
    <div className={`fixed top-16 left-4 right-4 z-50 p-3 rounded-lg shadow-lg ${
      isOnline ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <>
            {isSlowConnection ? (
              <Wifi className="w-5 h-5 text-yellow-600" />
            ) : (
              <Clock className="w-5 h-5 text-yellow-600" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                {queueStatus.totalItems > 0 && `${queueStatus.totalItems}개 항목 처리 중...`}
                {isSlowConnection && '느린 연결이 감지되었습니다.'}
              </p>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">오프라인 상태</p>
              {queueStatus.totalItems > 0 && (
                <p className="text-xs text-red-600">
                  {queueStatus.totalItems}개 항목이 대기 중입니다.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

## 📝 완료 조건
- [ ] n8n API와의 안정적인 통신이 구현됨
- [ ] 실시간 업로드 진행 상황이 표시됨
- [ ] 네트워크 오류 시 적절한 재시도 로직이 작동함
- [ ] 오프라인 상태에서 큐잉 시스템이 작동함
- [ ] 사용자 친화적인 피드백이 제공됨
- [ ] 느린 연결에서도 좋은 사용자 경험을 제공함

## ⚠️ 주의사항
- 파일 업로드 시 메모리 사용량 최적화
- 긴 시간이 걸리는 작업에 대한 타임아웃 설정
- 네트워크 상태 변경에 대한 적절한 대응
- 민감한 데이터의 로컬 저장 시 보안 고려

## 🔗 의존성
- **선행 작업**: [09_n8n_webhook.md](./09_n8n_webhook.md)
- **후속 작업**: [11_data_sync.md](./11_data_sync.md)

## 📊 예상 소요 시간
**4-5시간**

---
*상태: ⏳ 대기 중*
