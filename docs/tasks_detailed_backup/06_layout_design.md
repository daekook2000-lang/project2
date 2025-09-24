# Task 06: 기본 레이아웃 및 네비게이션

## 📋 개요
앱 전체의 기본 레이아웃과 네비게이션 시스템을 구현하여 일관된 사용자 경험을 제공합니다.

## 🎯 목표
- 모바일 우선 반응형 레이아웃 구현
- 직관적인 네비게이션 구조 설계
- 인증 상태에 따른 조건부 렌더링
- 접근성을 고려한 UI 컴포넌트

## ✅ 체크리스트

### 루트 레이아웃 개선
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

### 전역 Providers 설정
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

### 메인 네비게이션 헤더
- [ ] `src/components/layout/Header.tsx` 생성
```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/Providers'
import { signOut } from '@/lib/auth/client'
import { Menu, X, User, LogOut } from 'lucide-react'

export function Header() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="animate-pulse flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-gray-900">식단관리</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  대시보드
                </Link>
                <Link href="/upload" className="text-gray-600 hover:text-gray-900">
                  식단 기록
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                    <User size={20} />
                    <span>{user.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  로그인
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  회원가입
                </Link>
              </>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="py-4 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    대시보드
                  </Link>
                  <Link
                    href="/upload"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    식단 기록
                  </Link>
                  <div className="border-t pt-2">
                    <div className="px-4 py-2 text-sm text-gray-500">
                      {user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-blue-600 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
```

### 하단 네비게이션 (모바일)
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
    {
      href: '/dashboard',
      icon: Home,
      label: '홈',
    },
    {
      href: '/upload',
      icon: Camera,
      label: '기록',
    },
    {
      href: '/profile',
      icon: User,
      label: '프로필',
    },
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

### 메인 레이아웃 래퍼
- [ ] `src/components/layout/MainLayout.tsx` 생성
```typescript
import { Header } from './Header'
import { BottomNavigation } from './BottomNavigation'

interface MainLayoutProps {
  children: React.ReactNode
  showBottomNav?: boolean
}

export function MainLayout({ children, showBottomNav = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className={`${showBottomNav ? 'pb-16 md:pb-0' : ''}`}>
        {children}
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  )
}
```

### 홈페이지 (랜딩 페이지)
- [ ] `src/app/page.tsx` 업데이트
```typescript
import Link from 'next/link'
import { getUser } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import { Camera, Zap, Clock, BarChart3 } from 'lucide-react'

export default async function HomePage() {
  const user = await getUser()
  
  // 로그인한 사용자는 대시보드로 리다이렉트
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 히어로 섹션 */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            원클릭으로 시작하는
            <span className="text-blue-600"> AI 식단 관리</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            사진 한 장으로 끝나는 식단 기록. AI가 자동으로 분석하고 분류합니다.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/register"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              지금 시작하기
            </Link>
            <Link
              href="/login"
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">원클릭 기록</h3>
            <p className="text-gray-600">사진 선택만으로 모든 기록이 자동 완료</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI 자동 분석</h3>
            <p className="text-gray-600">음식 종류와 영양성분을 정확하게 분석</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">시간별 자동 분류</h3>
            <p className="text-gray-600">아침, 점심, 저녁, 간식으로 자동 분류</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">영양성분 추적</h3>
            <p className="text-gray-600">칼로리와 주요 영양성분을 한눈에 확인</p>
          </div>
        </div>
      </section>
    </div>
  )
}
```

### 업로드 전용 페이지
- [ ] `src/app/upload/page.tsx` 생성
```typescript
import { requireAuth } from '@/lib/auth/server'
import { PhotoUpload } from '@/components/upload/PhotoUpload'
import { MainLayout } from '@/components/layout/MainLayout'

export default async function UploadPage() {
  await requireAuth()

  return (
    <MainLayout>
      <PhotoUpload />
    </MainLayout>
  )
}
```

## 📝 완료 조건
- [ ] 반응형 레이아웃이 모든 기기에서 정상 작동함
- [ ] 인증 상태에 따른 네비게이션이 올바르게 표시됨
- [ ] 모바일 하단 네비게이션이 정상 작동함
- [ ] 접근성 기준을 충족함 (키보드 네비게이션, 스크린 리더 지원)
- [ ] 로딩 상태가 적절히 처리됨

## ⚠️ 주의사항
- 모바일에서 하단 네비게이션과 콘텐츠 간격 확보
- 스티키 헤더로 인한 콘텐츠 겹침 방지
- 다크 모드 지원 고려 (선택사항)
- 성능 최적화를 위한 컴포넌트 지연 로딩

## 🔗 의존성
- **선행 작업**: [05_auth_ui.md](./05_auth_ui.md)
- **후속 작업**: [07_photo_upload.md](./07_photo_upload.md)

## 📊 예상 소요 시간
**3-4시간**

---
*상태: ⏳ 대기 중*
