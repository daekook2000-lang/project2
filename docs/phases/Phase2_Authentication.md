# Phase 2: 인증 시스템 (Authentication)

## 📋 개요
Supabase Authentication을 활용하여 사용자 인증 시스템의 백엔드 로직과 사용자 친화적인 인증 UI를 구현합니다.

## 🎯 목표
- Supabase Auth 백엔드 로직 구현
- 모바일 친화적인 로그인/회원가입 UI
- 미들웨어를 통한 라우트 보호
- 사용자 경험을 고려한 에러 처리

## ⏱️ 예상 소요 시간
**1-2일 (6-12시간)**

---

## 🔐 Task 1: Supabase Auth 백엔드 설정

### ✅ 체크리스트

#### Supabase Auth 기본 설정
- [ ] Supabase 대시보드에서 Authentication 설정
  - [ ] Email provider 활성화
  - [ ] Email confirmation 설정 (개발 중에는 비활성화 가능)
  - [ ] Site URL: `http://localhost:3000`
  - [ ] Redirect URLs: `http://localhost:3000/auth/callback`

#### 서버 사이드 인증 유틸리티
- [ ] `src/lib/auth/server.ts` 생성
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) return null
  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

export async function getProfile(userId: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
    
  if (error) {
    console.error('Profile fetch error:', error)
    return null
  }
  
  return profile
}
```

#### 클라이언트 사이드 인증 유틸리티
- [ ] `src/lib/auth/client.ts` 생성
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  return { data, error }
}
```

#### 미들웨어 설정
- [ ] `middleware.ts` 파일 생성 (프로젝트 루트)
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  const protectedPaths = ['/dashboard', '/upload']
  const authPaths = ['/login', '/register']
  
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  const isAuthPath = authPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

#### 인증 콜백 라우트 핸들러
- [ ] `src/app/auth/callback/route.ts` 생성
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

#### 인증 상태 관리 훅
- [ ] `src/hooks/useAuth.ts` 생성
```typescript
'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'
import { supabase } from '@/lib/auth/client'

export function useAuth() {
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

  return {
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
  }
}
```

#### 에러 처리 유틸리티
- [ ] `src/lib/utils/auth-errors.ts` 생성
```typescript
export function getAuthErrorMessage(error: any): string {
  if (!error) return '알 수 없는 오류가 발생했습니다.'

  switch (error.message) {
    case 'Invalid login credentials':
      return '이메일 또는 비밀번호가 올바르지 않습니다.'
    case 'User already registered':
      return '이미 가입된 이메일 주소입니다.'
    case 'Password should be at least 6 characters':
      return '비밀번호는 최소 6자 이상이어야 합니다.'
    case 'Invalid email':
      return '유효하지 않은 이메일 주소입니다.'
    default:
      return error.message || '인증 중 오류가 발생했습니다.'
  }
}
```

---

## 🎨 Task 2: 인증 UI 구현

### ✅ 체크리스트

#### 기본 UI 컴포넌트

##### 1. 입력 필드 컴포넌트
- [ ] `src/components/ui/Input.tsx` 생성
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
```

##### 2. 버튼 컴포넌트
- [ ] `src/components/ui/Button.tsx` 생성
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  loading, 
  children, 
  className,
  ...props 
}: ButtonProps) {
  const baseClasses = "w-full px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500"
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          처리 중...
        </div>
      ) : (
        children
      )}
    </button>
  )
}
```

#### 인증 라우트 그룹 설정
- [ ] 인증 라우트 그룹 생성 (`src/app/(auth)/`)
- [ ] 공통 인증 레이아웃 구현 (`src/app/(auth)/layout.tsx`)

#### 로그인 페이지
- [ ] `src/app/(auth)/login/page.tsx` 생성
- [ ] 이메일/비밀번호 입력 폼
- [ ] 폼 검증 로직
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 회원가입 링크

#### 회원가입 페이지
- [ ] `src/app/(auth)/register/page.tsx` 생성
- [ ] 이름, 이메일, 비밀번호 입력 폼
- [ ] 비밀번호 확인 검증
- [ ] 이메일 형식 검증
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 로그인 링크

#### 비밀번호 재설정 페이지
- [ ] `src/app/(auth)/forgot-password/page.tsx` 생성
- [ ] 이메일 입력 폼
- [ ] 재설정 링크 전송 기능
- [ ] 성공/실패 피드백

#### 모바일 최적화
- [ ] 터치 친화적인 버튼 크기 (최소 44px)
- [ ] 모바일에서 입력 필드 확대 방지 (`font-size: 16px` 이상)
- [ ] 키보드 올라올 때 레이아웃 조정
- [ ] 가로/세로 모드 대응

#### 접근성 개선
- [ ] 폼 라벨과 입력 필드 연결
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 지원 (aria-label, role 속성)
- [ ] 에러 메시지 접근성 개선

---

## 📝 완료 조건

### Phase 2 완료 체크리스트
- [ ] Supabase Auth 설정이 완료됨
- [ ] 로그인 페이지가 정상 작동함
- [ ] 회원가입 페이지가 정상 작동함
- [ ] 비밀번호 재설정 기능이 작동함
- [ ] 미들웨어를 통한 라우트 보호가 작동함
- [ ] 인증 상태 관리 훅이 정상 작동함
- [ ] 폼 검증이 올바르게 동작함
- [ ] 에러 처리가 사용자 친화적으로 구현됨
- [ ] 모바일에서 정상 작동함
- [ ] 접근성 기준을 충족함

---

## ⚠️ 주의사항

- **보안**: 클라이언트와 서버 사이드 인증 로직 분리
- **UX**: 에러 메시지는 한국어로 사용자 친화적으로 표시
- **성능**: 로딩 상태 동안 중복 제출 방지
- **접근성**: 키보드 네비게이션과 스크린 리더 지원
- **모바일**: 터치 인터페이스 최적화

---

## 🔗 다음 단계
Phase 2 완료 후 → **Phase 3: 핵심 UI 구현** 진행

---
*Phase 2 상태: ⏳ 준비됨*
