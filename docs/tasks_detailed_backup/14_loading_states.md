# Task 14: 로딩 상태 및 에러 처리

## 📋 개요
사용자 경험 향상을 위한 포괄적인 로딩 상태 표시 및 에러 처리 시스템을 구현합니다.

## 🎯 목표
- 직관적이고 일관된 로딩 상태 표시
- 사용자 친화적인 에러 메시지 및 복구 옵션
- 네트워크 상태에 따른 적응적 UI
- 접근성을 고려한 상태 표시

## ✅ 체크리스트

### 로딩 컴포넌트들
- [ ] `src/components/ui/LoadingSpinner.tsx` 생성
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'gray' | 'white'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white'
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        border-2 ${colorClasses[color]} border-t-transparent 
        rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="로딩 중"
    />
  )
}
```

### 스켈레톤 로더
- [ ] `src/components/ui/Skeleton.tsx` 생성
```typescript
interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className = '', children }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      role="status"
      aria-label="콘텐츠 로딩 중"
    >
      {children}
    </div>
  )
}

// 프리셋 스켈레톤들
export function FoodLogSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <Skeleton key={j} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 에러 경계 컴포넌트
- [ ] `src/components/ui/ErrorBoundary.tsx` 생성
```typescript
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // 에러 리포팅 서비스에 전송 (예: Sentry)
    if (typeof window !== 'undefined') {
      // window.reportError?.(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              문제가 발생했습니다
            </h3>
            <p className="text-gray-600 mb-4">
              예상치 못한 오류가 발생했습니다. 다시 시도해주세요.
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>다시 시도</span>
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  에러 상세 정보
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 에러 표시 컴포넌트
- [ ] `src/components/ui/ErrorMessage.tsx` 생성
```typescript
'use client'

import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorMessageProps {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void
  showHomeLink?: boolean
  className?: string
}

export function ErrorMessage({
  title = '오류가 발생했습니다',
  message,
  type = 'error',
  onRetry,
  showHomeLink = false,
  className = ''
}: ErrorMessageProps) {
  const typeStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      title: 'text-red-800',
      text: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200', 
      icon: 'text-yellow-500',
      title: 'text-yellow-800',
      text: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500', 
      title: 'text-blue-800',
      text: 'text-blue-700'
    }
  }

  const styles = typeStyles[type]

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${styles.title}`}>
            {title}
          </h3>
          <p className={`text-sm ${styles.text} mt-1`}>
            {message}
          </p>
          
          {(onRetry || showHomeLink) && (
            <div className="flex items-center space-x-3 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`
                    inline-flex items-center space-x-1 text-sm font-medium
                    ${styles.title} hover:underline
                  `}
                >
                  <RefreshCw size={14} />
                  <span>다시 시도</span>
                </button>
              )}
              
              {showHomeLink && (
                <Link
                  href="/"
                  className={`
                    inline-flex items-center space-x-1 text-sm font-medium
                    ${styles.title} hover:underline
                  `}
                >
                  <Home size={14} />
                  <span>홈으로 가기</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 네트워크 상태 처리
- [ ] `src/components/ui/NetworkError.tsx` 생성
```typescript
'use client'

import { WifiOff, RefreshCw } from 'lucide-react'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

interface NetworkErrorProps {
  onRetry?: () => void
  message?: string
}

export function NetworkError({ 
  onRetry, 
  message = '네트워크 연결을 확인해주세요' 
}: NetworkErrorProps) {
  const { isOnline } = useNetworkStatus()

  if (isOnline) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <WifiOff className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            연결 오류
          </h3>
          <p className="text-sm text-red-700 mt-1">
            {message}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-1 text-sm font-medium text-red-800 hover:underline"
          >
            <RefreshCw size={14} />
            <span>재시도</span>
          </button>
        )}
      </div>
    </div>
  )
}
```

### 빈 상태 컴포넌트
- [ ] `src/components/ui/EmptyState.tsx` 생성
```typescript
'use client'

import { ReactNode } from 'react'
import { Camera } from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon = <Camera className="w-12 h-12 text-gray-400" />,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
}

// 프리셋 빈 상태들
export function EmptyFoodLogs() {
  return (
    <EmptyState
      title="기록된 식단이 없습니다"
      description="첫 번째 식단을 기록해보세요!"
      action={
        <Link 
          href="/upload"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          식단 기록하기
        </Link>
      }
    />
  )
}
```

### 로딩 상태 통합 훅
- [ ] `src/hooks/useAsyncOperation.ts` 생성
```typescript
'use client'

import { useState, useCallback } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useAsyncOperation<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null })
    
    try {
      const result = await operation()
      setState({ data: result, loading: false, error: null })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  const retry = useCallback(async (operation: () => Promise<T>) => {
    return execute(operation)
  }, [execute])

  return {
    ...state,
    execute,
    reset,
    retry
  }
}
```

## 📝 완료 조건
- [ ] 일관된 로딩 상태가 모든 비동기 작업에서 표시됨
- [ ] 에러 상황에서 사용자 친화적인 메시지가 표시됨
- [ ] 네트워크 오류 시 적절한 안내가 제공됨
- [ ] 빈 상태에서 명확한 가이드가 제공됨
- [ ] 접근성 기준을 충족함 (스크린 리더 지원)

## 📊 예상 소요 시간
**3-4시간**

---
*상태: ⏳ 대기 중*
