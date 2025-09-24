# Task 04: Supabase Auth 설정

## 📋 개요
Supabase Authentication을 활용한 사용자 인증 시스템의 백엔드 로직을 구현합니다.

## 🎯 목표
- Supabase Auth 설정 완료
- 인증 관련 유틸리티 함수 구현
- 미들웨어를 통한 라우트 보호 설정
- 인증 상태 관리 로직 구현

## ✅ 체크리스트

### Supabase Auth 기본 설정
- [ ] Supabase 대시보드에서 Authentication 설정 확인
  - [ ] Email provider 활성화
  - [ ] Email confirmation 설정 (개발 중에는 비활성화 가능)
  - [ ] Site URL 설정: `http://localhost:3000`
  - [ ] Redirect URLs 추가: `http://localhost:3000/auth/callback`

### 인증 관련 유틸리티 함수 구현

#### 1. 서버 사이드 인증 유틸리티
- [ ] `src/lib/auth/server.ts` 파일 생성
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
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

#### 2. 클라이언트 사이드 인증 유틸리티
- [ ] `src/lib/auth/client.ts` 파일 생성
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
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

### 미들웨어 설정
- [ ] `middleware.ts` 파일 생성 (프로젝트 루트)
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 인증 상태 갱신
  const { data: { session } } = await supabase.auth.getSession()

  // 보호된 라우트 정의
  const protectedPaths = ['/dashboard']
  const authPaths = ['/login', '/register']
  
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  const isAuthPath = authPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // 인증이 필요한 페이지에 비로그인 사용자가 접근하는 경우
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 로그인한 사용자가 인증 페이지에 접근하는 경우
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

### 인증 콜백 라우트 핸들러
- [ ] `src/app/auth/callback/route.ts` 파일 생성
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

  // 성공적으로 로그인한 후 대시보드로 리다이렉트
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

### 인증 상태 관리 훅
- [ ] `src/hooks/useAuth.ts` 파일 생성
```typescript
'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'
import { supabase } from '@/lib/auth/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 현재 세션 가져오기
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // 인증 상태 변화 감지
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

### 프로필 관리 훅
- [ ] `src/hooks/useProfile.ts` 파일 생성
```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/auth/client'
import { useAuth } from './useAuth'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Profile fetch error:', error)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user') }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }

    return { data, error }
  }

  return {
    profile,
    loading,
    updateProfile,
  }
}
```

### 타입 정의
- [ ] `src/lib/types/auth.types.ts` 파일 생성
```typescript
export interface AuthError {
  message: string
  status?: number
}

export interface SignUpData {
  email: string
  password: string
  fullName?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
```

### 에러 처리 유틸리티
- [ ] `src/lib/utils/auth-errors.ts` 파일 생성
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

## 📝 완료 조건
- [ ] Supabase Auth 설정이 완료됨
- [ ] 인증 관련 유틸리티 함수들이 구현됨
- [ ] 미들웨어를 통한 라우트 보호가 작동함
- [ ] 인증 상태 관리 훅이 정상 작동함
- [ ] 에러 처리가 적절히 구현됨
- [ ] 타입 정의가 완료됨

## ⚠️ 주의사항
- 미들웨어에서 무한 리다이렉트 방지 확인
- 클라이언트와 서버 사이드 인증 로직 분리
- 에러 메시지의 사용자 친화적 처리
- 세션 만료 시 적절한 처리

## 🔗 의존성
- **선행 작업**: [03_database_schema.md](./03_database_schema.md)
- **후속 작업**: [05_auth_ui.md](./05_auth_ui.md)

## 📊 예상 소요 시간
**2-3시간**

---
*상태: ⏳ 대기 중*
