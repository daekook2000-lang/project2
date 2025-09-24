# Task 11: 데이터 동기화 로직

## 📋 개요
n8n에서 처리된 데이터와 Supabase 데이터베이스 간의 동기화를 구현하여 일관된 데이터 상태를 유지합니다.

## 🎯 목표
- n8n 처리 결과와 로컬 데이터베이스 동기화
- 실시간 데이터 업데이트 구현
- 데이터 불일치 해결 메커니즘
- 효율적인 데이터 캐싱 전략

## ✅ 체크리스트

### 데이터 동기화 서비스 구현
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

  // n8n 결과를 Supabase에 동기화
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

  // 특정 식단 기록 동기화
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

  // 사용자의 특정 날짜 데이터 새로고침
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

  // 분석 상태 업데이트
  async updateAnalysisStatus(logId: string, status: 'pending' | 'completed' | 'failed'): Promise<SyncResult> {
    try {
      const { data, error } = await this.supabase
        .from('food_logs')
        .update({ analysis_status: status })
        .eq('id', logId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Analysis status update error:', error)
      return {
        success: false,
        error: '분석 상태 업데이트 중 오류가 발생했습니다.'
      }
    }
  }

  // 데이터 불일치 검사 및 수정
  async validateAndFixData(userId: string): Promise<SyncResult> {
    try {
      // 1. 고아 food_items 찾기 (food_log 없는 항목)
      const { data: orphanItems, error: orphanError } = await this.supabase
        .from('food_items')
        .select('id')
        .not('food_log_id', 'in', `(
          SELECT id FROM food_logs WHERE user_id = '${userId}'
        )`)

      if (orphanError) throw orphanError

      // 2. 고아 항목 삭제
      if (orphanItems && orphanItems.length > 0) {
        const orphanIds = orphanItems.map(item => item.id)
        await this.supabase
          .from('food_items')
          .delete()
          .in('id', orphanIds)
      }

      // 3. total_calories 재계산
      const { data: foodLogs, error: logsError } = await this.supabase
        .from('food_logs')
        .select(`
          id,
          food_items (calories)
        `)
        .eq('user_id', userId)

      if (logsError) throw logsError

      // 4. 칼로리 합계 업데이트
      for (const log of foodLogs || []) {
        const totalCalories = log.food_items?.reduce((sum, item) => sum + (item.calories || 0), 0) || 0
        
        await this.supabase
          .from('food_logs')
          .update({ total_calories: totalCalories })
          .eq('id', log.id)
      }

      return { 
        success: true, 
        data: { 
          cleanedOrphanItems: orphanItems?.length || 0,
          updatedLogs: foodLogs?.length || 0
        }
      }
    } catch (error) {
      console.error('Data validation error:', error)
      return {
        success: false,
        error: '데이터 검증 중 오류가 발생했습니다.'
      }
    }
  }
}
```

### 실시간 데이터 구독 훅
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
      // 실시간 구독 설정
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
            // 새 기록 추가
            return [newRecord, ...currentData]
          
          case 'UPDATE':
            // 기존 기록 업데이트
            return currentData.map(item => 
              item.id === newRecord.id ? { ...item, ...newRecord } : item
            )
          
          case 'DELETE':
            // 기록 삭제
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

### 데이터 캐싱 시스템
- [ ] `src/lib/utils/data-cache.ts` 생성
```typescript
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

export class DataCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5분

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now()
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) return false
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // 만료된 항목들 정리
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  // 캐시 통계
  getStats() {
    const now = Date.now()
    let validEntries = 0
    let expiredEntries = 0
    
    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expiredEntries++
      } else {
        validEntries++
      }
    }
    
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries
    }
  }
}

// 싱글톤 인스턴스
export const dataCache = new DataCache()

// 주기적 정리 (5분마다)
if (typeof window !== 'undefined') {
  setInterval(() => {
    dataCache.cleanup()
  }, 5 * 60 * 1000)
}
```

### 캐시된 데이터 훅
- [ ] `src/hooks/useCachedData.ts` 생성
```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { dataCache } from '@/lib/utils/data-cache'
import { DataSyncService } from '@/lib/services/data-sync.service'

export function useCachedData<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5분
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true)
    setError(null)

    try {
      // 캐시에서 먼저 확인
      if (!forceRefresh) {
        const cachedData = dataCache.get<T>(cacheKey)
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          return cachedData
        }
      }

      // 캐시에 없으면 새로 가져오기
      const freshData = await fetcher()
      
      // 캐시에 저장
      dataCache.set(cacheKey, freshData, ttl)
      setData(freshData)
      
      return freshData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터를 가져오는 중 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('Cached data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [cacheKey, fetcher, ttl])

  const refresh = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  const invalidate = useCallback(() => {
    dataCache.delete(cacheKey)
  }, [cacheKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refresh,
    invalidate
  }
}
```

### 동기화 상태 표시 컴포넌트
- [ ] `src/components/ui/SyncStatus.tsx` 생성
```typescript
'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

interface SyncStatusProps {
  lastSyncTime?: Date
  isLoading?: boolean
  error?: string
  onRefresh?: () => void
}

export function SyncStatus({ lastSyncTime, isLoading, error, onRefresh }: SyncStatusProps) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    if (!lastSyncTime) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diffMs = now.getTime() - lastSyncTime.getTime()
      const diffMinutes = Math.floor(diffMs / 60000)

      if (diffMinutes < 1) {
        setTimeAgo('방금 전')
      } else if (diffMinutes < 60) {
        setTimeAgo(`${diffMinutes}분 전`)
      } else {
        const diffHours = Math.floor(diffMinutes / 60)
        setTimeAgo(`${diffHours}시간 전`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000) // 1분마다 업데이트

    return () => clearInterval(interval)
  }, [lastSyncTime])

  if (!lastSyncTime && !isLoading && !error) return null

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
      <div className="flex items-center space-x-2">
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="text-gray-600">동기화 중...</span>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-600">동기화 오류</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">마지막 동기화: {timeAgo}</span>
          </>
        )}
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
        >
          새로고침
        </button>
      )}
    </div>
  )
}
```

## 📝 완료 조건
- [ ] n8n 결과와 Supabase 데이터베이스가 정확히 동기화됨
- [ ] 실시간 데이터 업데이트가 정상 작동함
- [ ] 데이터 불일치 감지 및 수정 메커니즘이 작동함
- [ ] 효율적인 캐싱으로 성능이 개선됨
- [ ] 동기화 상태가 사용자에게 명확히 표시됨
- [ ] 오프라인/온라인 전환 시 적절한 동기화가 수행됨

## ⚠️ 주의사항
- 대용량 데이터 동기화 시 성능 고려
- 동시성 문제 방지 (낙관적 잠금 등)
- 네트워크 오류 시 데이터 손실 방지
- 캐시 무효화 전략 신중히 설계

## 🔗 의존성
- **선행 작업**: [10_api_integration.md](./10_api_integration.md)
- **후속 작업**: [08_dashboard_ui.md](./08_dashboard_ui.md)

## 📊 예상 소요 시간
**3-4시간**

---
*상태: ⏳ 대기 중*
