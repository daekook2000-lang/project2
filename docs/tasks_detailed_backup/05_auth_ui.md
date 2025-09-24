# Task 05: 로그인/회원가입 UI 구현

## 📋 개요
사용자 인증을 위한 로그인 및 회원가입 UI 컴포넌트를 구현합니다.

## 🎯 목표
- 모바일 친화적인 로그인/회원가입 폼 구현
- 사용자 경험을 고려한 인터페이스 설계
- 폼 검증 및 에러 처리 구현
- 반응형 디자인 적용

## ✅ 체크리스트

### 기본 레이아웃 및 라우트 설정
- [ ] 인증 라우트 그룹 생성 (`src/app/(auth)/`)
- [ ] 공통 인증 레이아웃 구현 (`src/app/(auth)/layout.tsx`)
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
```

### 공통 UI 컴포넌트 구현

#### 1. 입력 필드 컴포넌트
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

#### 2. 버튼 컴포넌트
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

### 로그인 페이지 구현
- [ ] `src/app/(auth)/login/page.tsx` 생성
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { signIn } from '@/lib/auth/client'
import { getAuthErrorMessage } from '@/lib/utils/auth-errors'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // 기본 검증
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = '이메일을 입력해주세요.'
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const { error } = await signIn(formData.email, formData.password)

    if (error) {
      setErrors({ general: getAuthErrorMessage(error) })
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
        <p className="text-gray-600 mt-2">AI 식단 관리 서비스에 로그인하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <Input
          label="이메일"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="example@email.com"
        />

        <Input
          label="비밀번호"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          placeholder="비밀번호를 입력하세요"
        />

        <Button type="submit" loading={loading}>
          로그인
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <Link href="/register" className="text-blue-600 hover:underline">
          아직 계정이 없으신가요? 회원가입
        </Link>
        <br />
        <Link href="/forgot-password" className="text-gray-500 hover:underline text-sm">
          비밀번호를 잊으셨나요?
        </Link>
      </div>
    </div>
  )
}
```

### 회원가입 페이지 구현
- [ ] `src/app/(auth)/register/page.tsx` 생성
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { signUp } from '@/lib/auth/client'
import { getAuthErrorMessage } from '@/lib/utils/auth-errors'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.'
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = '이름을 입력해주세요.'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    const { error } = await signUp(
      formData.email, 
      formData.password, 
      formData.fullName
    )

    if (error) {
      setErrors({ general: getAuthErrorMessage(error) })
    } else {
      // 회원가입 성공 시 대시보드로 이동
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        <p className="text-gray-600 mt-2">AI 식단 관리 서비스에 가입하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <Input
          label="이름"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          error={errors.fullName}
          placeholder="홍길동"
        />

        <Input
          label="이메일"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="example@email.com"
        />

        <Input
          label="비밀번호"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          placeholder="최소 6자 이상"
        />

        <Input
          label="비밀번호 확인"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          placeholder="비밀번호를 다시 입력하세요"
        />

        <Button type="submit" loading={loading}>
          회원가입
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-blue-600 hover:underline">
          이미 계정이 있으신가요? 로그인
        </Link>
      </div>
    </div>
  )
}
```

### 비밀번호 재설정 페이지 구현
- [ ] `src/app/(auth)/forgot-password/page.tsx` 생성
```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { resetPassword } from '@/lib/auth/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    if (!email) {
      setError('이메일을 입력해주세요.')
      setLoading(false)
      return
    }

    const { error: resetError } = await resetPassword(email)

    if (resetError) {
      setError('비밀번호 재설정 요청 중 오류가 발생했습니다.')
    } else {
      setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.')
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">비밀번호 재설정</h1>
        <p className="text-gray-600 mt-2">
          가입 시 사용한 이메일 주소를 입력해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />

        <Button type="submit" loading={loading}>
          재설정 링크 보내기
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-blue-600 hover:underline">
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
```

### 모바일 최적화 및 반응형 디자인
- [ ] 터치 친화적인 버튼 크기 적용 (최소 44px)
- [ ] 모바일에서 입력 필드 확대 방지 (`font-size: 16px` 이상)
- [ ] 키보드 올라올 때 레이아웃 조정
- [ ] 가로/세로 모드 대응

### 접근성 개선
- [ ] 폼 라벨과 입력 필드 연결
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 지원 (aria-label, role 속성)
- [ ] 에러 메시지 접근성 개선

### 사용자 경험 개선
- [ ] 로딩 상태 시각화
- [ ] 성공/실패 피드백
- [ ] 폼 검증 실시간 피드백 (선택사항)
- [ ] 자동 포커스 설정

## 📝 완료 조건
- [ ] 로그인 페이지가 정상 작동함
- [ ] 회원가입 페이지가 정상 작동함
- [ ] 비밀번호 재설정 기능이 작동함
- [ ] 폼 검증이 올바르게 동작함
- [ ] 에러 처리가 사용자 친화적으로 구현됨
- [ ] 모바일에서 정상 작동함
- [ ] 접근성 기준을 충족함

## ⚠️ 주의사항
- 비밀번호는 최소 6자 이상으로 설정
- 이메일 형식 검증 구현
- 에러 메시지는 한국어로 표시
- 로딩 상태 동안 중복 제출 방지
- HTTPS 환경에서만 인증 기능 사용 권장

## 🔗 의존성
- **선행 작업**: [04_auth_setup.md](./04_auth_setup.md)
- **후속 작업**: [06_layout_design.md](./06_layout_design.md)

## 📊 예상 소요 시간
**3-4시간**

---
*상태: ⏳ 대기 중*
