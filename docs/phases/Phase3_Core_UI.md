# Phase 3: 핵심 UI 구현 (Core UI)

## 📋 개요
PRD의 핵심 기능인 "원클릭 식단 기록"을 위한 사용자 인터페이스를 구현합니다. 기본 레이아웃, 사진 업로드, 대시보드를 포함합니다.

## 🎯 목표
- 모바일 우선 반응형 레이아웃 구현
- 직관적인 사진 업로드 인터페이스
- 식단 기록 조회를 위한 대시보드
- 일관된 사용자 경험 제공

## ⏱️ 예상 소요 시간
**2-3일 (12-18시간)**

---

## 🎨 Task 1: 기본 레이아웃 및 네비게이션

### ✅ 체크리스트

#### 루트 레이아웃 개선
- [ ] `src/app/layout.tsx` 업데이트
```typescript
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI 식단 관리',
  description: '원클릭으로 간편하게 기록하는 AI 식단 관리 서비스',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

#### 전역 Providers 설정
- [ ] `src/components/providers/Providers.tsx` 생성
```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'
import { supabase } from '@/lib/auth/client'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a Providers')
  }
  return context
}
```

#### 메인 네비게이션 헤더
- [ ] `src/components/layout/Header.tsx` 생성
- [ ] 로고 및 브랜딩
- [ ] 인증 상태에 따른 조건부 네비게이션
- [ ] 모바일 햄버거 메뉴
- [ ] 사용자 프로필 드롭다운

#### 하단 네비게이션 (모바일)
- [ ] `src/components/layout/BottomNavigation.tsx` 생성
```typescript
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Camera, User } from 'lucide-react'
import { useAuth } from '@/components/providers/Providers'

export function BottomNavigation() {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const navItems = [
    { href: '/dashboard', icon: Home, label: '홈' },
    { href: '/upload', icon: Camera, label: '기록' },
    { href: '/profile', icon: User, label: '프로필' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

#### 메인 레이아웃 래퍼
- [ ] `src/components/layout/MainLayout.tsx` 생성
- [ ] 헤더, 메인 콘텐츠, 하단 네비게이션 통합
- [ ] 반응형 레이아웃 처리

#### 홈페이지 (랜딩 페이지)
- [ ] `src/app/page.tsx` 업데이트
- [ ] 히어로 섹션
- [ ] 주요 기능 소개
- [ ] CTA 버튼 (회원가입/로그인)
- [ ] 로그인한 사용자는 대시보드로 리다이렉트

---

## 📸 Task 2: 사진 업로드 인터페이스

### ✅ 체크리스트

#### 파일 업로드 훅 구현
- [ ] `src/hooks/useFileUpload.ts` 생성
```typescript
'use client'

import { useState } from 'react'

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  success: boolean
}

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  })

  const uploadFile = async (file: File) => {
    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      success: false,
    })

    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const userId = await getCurrentUserId()
      formData.append('userId', userId)

      // n8n 웹훅으로 전송 (Phase 4에서 구현)
      const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('업로드 실패')
      }

      const result = await response.json()

      setUploadState({
        uploading: false,
        progress: 100,
        error: null,
        success: true,
      })

      return { success: true, data: result }
    } catch (error) {
      setUploadState({
        uploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.',
        success: false,
      })

      return { success: false, error }
    }
  }

  const resetUpload = () => {
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
    })
  }

  return {
    ...uploadState,
    uploadFile,
    resetUpload,
  }
}
```

#### 파일 선택 컴포넌트
- [ ] `src/components/upload/FileSelector.tsx` 생성
```typescript
'use client'

import { useRef } from 'react'
import { Camera, Image as ImageIcon } from 'lucide-react'

interface FileSelectorProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function FileSelector({ onFileSelect, disabled }: FileSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 px-6 rounded-xl transition-colors font-medium text-lg"
        >
          <Camera size={24} />
          <span>사진 촬영하기</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white py-4 px-6 rounded-xl transition-colors font-medium text-lg"
        >
          <ImageIcon size={24} />
          <span>갤러리에서 선택</span>
        </button>
      </div>

      <p className="text-gray-500 text-sm text-center">
        음식 사진을 선택하면 자동으로 분석이 시작됩니다
      </p>
    </div>
  )
}
```

#### 업로드 진행 상황 컴포넌트
- [ ] `src/components/upload/UploadProgress.tsx` 생성
- [ ] 로딩 애니메이션
- [ ] 진행률 표시
- [ ] 성공/실패 피드백
- [ ] 재시도 버튼

#### 메인 업로드 페이지 컴포넌트
- [ ] `src/components/upload/PhotoUpload.tsx` 생성
- [ ] 파일 선택과 업로드 진행 상황 통합
- [ ] 파일 검증 (크기, 타입)
- [ ] 사용자 인증 확인

#### 파일 검증 및 최적화
- [ ] `src/lib/utils/file-validation.ts` 생성
```typescript
export interface FileValidationResult {
  valid: boolean
  error?: string
}

export function validateImageFile(file: File): FileValidationResult {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '이미지 파일만 업로드할 수 있습니다.' }
  }

  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'JPEG, PNG, WebP 형식의 이미지만 지원됩니다.' }
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기는 10MB 이하여야 합니다.' }
  }

  return { valid: true }
}
```

#### 이미지 압축 유틸리티
- [ ] `src/lib/utils/image-compression.ts` 생성
- [ ] Canvas API를 사용한 이미지 압축
- [ ] 최적 크기 및 품질 설정

#### 업로드 페이지 라우트
- [ ] `src/app/upload/page.tsx` 생성
- [ ] 인증 확인
- [ ] PhotoUpload 컴포넌트 렌더링
- [ ] 메인 레이아웃 적용

---

## 📊 Task 3: 식단 기록 대시보드

### ✅ 체크리스트

#### 대시보드 메인 페이지
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

#### 날짜 선택 컴포넌트
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
      <button onClick={goToPreviousDay} className="p-2 hover:bg-gray-100 rounded-full">
        ←
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
        disabled={isToday(selectedDate)}
        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
      >
        →
      </button>
    </div>
  )
}
```

#### 끼니별 식단 카드
- [ ] `src/components/dashboard/MealCard.tsx` 생성
- [ ] 끼니 타입별 아이콘 및 색상
- [ ] 총 칼로리 표시
- [ ] 식단 목록 표시
- [ ] 빈 상태 처리

#### 개별 식단 기록 아이템
- [ ] `src/components/dashboard/FoodLogItem.tsx` 생성
- [ ] 음식 사진 썸네일
- [ ] 음식 이름 및 칼로리
- [ ] 기록 시간 표시
- [ ] 상세 정보 토글

#### 일일 영양 요약 컴포넌트
- [ ] `src/components/dashboard/DailyNutritionSummary.tsx` 생성
- [ ] 총 칼로리 및 목표 대비 진행률
- [ ] 주요 영양소 (탄수화물, 단백질, 지방) 표시
- [ ] 시각적 진행률 바

#### 대시보드 데이터 훅
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

  return {
    foodLogs,
    groupedByMeal,
    loading,
    error,
  }
}
```

#### 빈 상태 컴포넌트
- [ ] `src/components/ui/EmptyState.tsx` 생성
- [ ] 빈 식단 기록 상태
- [ ] 첫 기록 유도 메시지
- [ ] 업로드 페이지 링크

---

## 📝 완료 조건

### Phase 3 완료 체크리스트
- [ ] 반응형 레이아웃이 모든 기기에서 정상 작동함
- [ ] 인증 상태에 따른 네비게이션이 올바르게 표시됨
- [ ] 모바일 하단 네비게이션이 정상 작동함
- [ ] 카메라와 갤러리에서 이미지 선택 가능함
- [ ] 파일 검증이 올바르게 작동함
- [ ] 업로드 진행 상황이 시각적으로 표시됨
- [ ] 날짜별 식단 기록이 정상 표시됨
- [ ] 끼니별 자동 분류가 올바르게 표시됨
- [ ] 빈 상태에서 명확한 가이드가 제공됨
- [ ] 접근성 기준을 충족함 (키보드 네비게이션, 스크린 리더 지원)

---

## ⚠️ 주의사항

- **모바일 우선**: 모든 UI는 모바일에서 먼저 테스트
- **터치 인터페이스**: 버튼 크기 최소 44px 확보
- **성능**: 이미지 지연 로딩 및 최적화 적용
- **접근성**: ARIA 라벨 및 키보드 네비게이션 지원
- **에러 처리**: 네트워크 오류 및 파일 업로드 실패 시나리오 고려

---

## 🔗 다음 단계
Phase 3 완료 후 → **Phase 4: 백엔드 연동** 진행

---
*Phase 3 상태: ⏳ 준비됨*
