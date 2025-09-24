# Phase 6: 최적화 및 배포 (Optimization & Deployment)

## 📋 개요
애플리케이션의 성능을 최적화하고 프로덕션 환경에 배포하여 실제 사용자들이 이용할 수 있도록 준비합니다.

## 🎯 목표
- 모바일 환경 최적화 및 PWA 구현
- 성능 최적화 및 Core Web Vitals 개선
- 종합적인 테스트 시스템 구축
- 프로덕션 배포 및 모니터링 설정

## ⏱️ 예상 소요 시간
**2-3일 (12-18시간)**

---

## 📱 Task 1: 모바일 최적화

### ✅ 체크리스트

#### PWA 설정
- [ ] `public/manifest.json` 생성
```json
{
  "name": "AI 식단 관리",
  "short_name": "AI 식단",
  "description": "원클릭으로 간편하게 기록하는 AI 식단 관리 서비스",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] `src/app/layout.tsx`에 PWA 메타데이터 추가
```typescript
export const metadata: Metadata = {
  title: 'AI 식단 관리',
  description: '원클릭으로 간편하게 기록하는 AI 식단 관리 서비스',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#3B82F6',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI 식단 관리',
  },
}
```

#### 서비스 워커 구현
- [ ] `public/sw.js` 생성
```javascript
const CACHE_NAME = 'ai-diet-tracker-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/upload',
  '/offline',
  // 정적 자산들
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/offline')
        }
      })
  )
})
```

- [ ] 서비스 워커 등록 컴포넌트 생성
```typescript
'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])

  return null
}
```

#### 터치 최적화
- [ ] 터치 타겟 크기 검증 및 수정 (최소 44px)
```css
/* globals.css 추가 */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* 터치 피드백 */
.touch-feedback:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}
```

- [ ] 스와이프 제스처 구현
```typescript
// src/hooks/useSwipe.ts
'use client'

import { useRef, useEffect } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipe(handlers: SwipeHandlers, threshold = 50) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            handlers.onSwipeRight?.()
          } else {
            handlers.onSwipeLeft?.()
          }
        }
      } else {
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            handlers.onSwipeDown?.()
          } else {
            handlers.onSwipeUp?.()
          }
        }
      }

      touchStartRef.current = null
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handlers, threshold])
}
```

#### 햅틱 피드백 (지원 디바이스)
- [ ] `src/lib/utils/haptics.ts` 생성
```typescript
export function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 50,
      heavy: 100
    }
    navigator.vibrate(patterns[type])
  }
}

export function triggerSuccessHaptic() {
  triggerHapticFeedback('medium')
}

export function triggerErrorHaptic() {
  triggerHapticFeedback('heavy')
}
```

#### 오프라인 페이지
- [ ] `src/app/offline/page.tsx` 생성
```typescript
import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          오프라인 상태입니다
        </h1>
        <p className="text-gray-600 mb-6">
          인터넷 연결을 확인하고 다시 시도해주세요.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
```

---

## ⚡ Task 2: 성능 최적화

### ✅ 체크리스트

#### 이미지 최적화
- [ ] Next.js Image 컴포넌트 전면 적용
```typescript
// 기존 img 태그를 모두 Next.js Image로 교체
import Image from 'next/image'

// 예시: 음식 사진 표시
<Image
  src={foodLog.image_url}
  alt="음식 사진"
  width={200}
  height={200}
  className="rounded-lg object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  priority={index < 2} // 상위 2개 이미지는 우선 로딩
/>
```

- [ ] `next.config.ts` 이미지 설정 최적화
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 성능 최적화 설정
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

#### 번들 최적화
- [ ] 번들 분석기 설치 및 분석
```bash
pnpm add -D @next/bundle-analyzer
```

```typescript
// next.config.ts 수정
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

- [ ] 동적 임포트 적용
```typescript
// 무거운 컴포넌트들을 동적 임포트로 변경
import dynamic from 'next/dynamic'

const NutritionChart = dynamic(() => import('@/components/nutrition/NutritionChart'), {
  loading: () => <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-lg" />,
  ssr: false
})

const MealStats = dynamic(() => import('@/components/meal/MealStats'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
})
```

#### React 최적화
- [ ] 컴포넌트 메모이제이션 적용
```typescript
// 자주 리렌더링되는 컴포넌트들에 React.memo 적용
import { memo } from 'react'

export const MealCard = memo(function MealCard({ mealType, foodLogs, totalCalories }) {
  // 컴포넌트 로직
})

export const FoodLogItem = memo(function FoodLogItem({ log }) {
  // 컴포넌트 로직
})
```

- [ ] 훅 최적화
```typescript
// useMemo, useCallback 적용
const memoizedData = useMemo(() => {
  return expensiveCalculation(data)
}, [data])

const handleClick = useCallback((id: string) => {
  // 핸들러 로직
}, [dependency])
```

#### 캐싱 전략
- [ ] API 응답 캐싱 개선
```typescript
// src/lib/utils/cache.ts
const cache = new Map()

export function getCachedData<T>(key: string): T | null {
  const item = cache.get(key)
  if (!item) return null
  
  if (Date.now() > item.expiry) {
    cache.delete(key)
    return null
  }
  
  return item.data
}

export function setCachedData<T>(key: string, data: T, ttl = 5 * 60 * 1000) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl
  })
}
```

- [ ] 브라우저 캐싱 헤더 설정
```typescript
// src/app/api/*/route.ts 예시
export async function GET() {
  const data = await fetchData()
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
```

#### 코드 스플리팅
- [ ] 라우트별 코드 분할 확인
- [ ] 조건부 로딩 구현
```typescript
// 기능별 조건부 로딩
const AdvancedFeatures = dynamic(() => import('@/components/AdvancedFeatures'), {
  loading: () => <div>고급 기능 로딩 중...</div>
})

function Dashboard({ user, isPremium }) {
  return (
    <div>
      <BasicDashboard />
      {isPremium && <AdvancedFeatures />}
    </div>
  )
}
```

---

## 🧪 Task 3: 테스트 구현

### ✅ 체크리스트

#### 테스트 환경 설정
- [ ] Jest 및 Testing Library 설치
```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

- [ ] `jest.config.js` 생성
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

- [ ] `jest.setup.js` 생성
```javascript
import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

#### 단위 테스트
- [ ] 유틸리티 함수 테스트
```typescript
// __tests__/utils/meal-classification.test.ts
import { classifyMealByTime, getMealTimeRange } from '@/lib/utils/meal-classification'

describe('meal-classification', () => {
  test('classifyMealByTime should return correct meal type', () => {
    const morningTime = new Date('2024-01-01 08:00:00')
    expect(classifyMealByTime(morningTime)).toBe('아침')
    
    const lunchTime = new Date('2024-01-01 13:00:00')
    expect(classifyMealByTime(lunchTime)).toBe('점심')
    
    const dinnerTime = new Date('2024-01-01 19:00:00')
    expect(classifyMealByTime(dinnerTime)).toBe('저녁')
    
    const snackTime = new Date('2024-01-01 23:00:00')
    expect(classifyMealByTime(snackTime)).toBe('간식')
  })

  test('getMealTimeRange should return correct time range', () => {
    expect(getMealTimeRange('아침')).toBe('04:00 ~ 10:59')
    expect(getMealTimeRange('점심')).toBe('11:00 ~ 16:59')
    expect(getMealTimeRange('저녁')).toBe('17:00 ~ 21:59')
    expect(getMealTimeRange('간식')).toBe('22:00 ~ 03:59')
  })
})
```

- [ ] 컴포넌트 테스트
```typescript
// __tests__/components/MealTypeIndicator.test.tsx
import { render, screen } from '@testing-library/react'
import { MealTypeIndicator } from '@/components/meal/MealTypeIndicator'

describe('MealTypeIndicator', () => {
  test('renders meal type and time correctly', () => {
    const loggedAt = '2024-01-01T08:30:00Z'
    
    render(
      <MealTypeIndicator 
        mealType="아침" 
        loggedAt={loggedAt}
        showTimeRange={true}
      />
    )
    
    expect(screen.getByText('아침')).toBeInTheDocument()
    expect(screen.getByText('08:30')).toBeInTheDocument()
    expect(screen.getByText('(04:00 ~ 10:59)')).toBeInTheDocument()
  })
})
```

- [ ] 훅 테스트
```typescript
// __tests__/hooks/useAuth.test.tsx
import { renderHook } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

// Mock Supabase
jest.mock('@/lib/auth/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
    },
  },
}))

describe('useAuth', () => {
  test('should return user and loading state', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current).toHaveProperty('user')
    expect(result.current).toHaveProperty('loading')
    expect(result.current).toHaveProperty('signOut')
  })
})
```

#### E2E 테스트 (Playwright)
- [ ] Playwright 설치 및 설정
```bash
pnpm add -D @playwright/test
npx playwright install
```

- [ ] `playwright.config.ts` 생성
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] E2E 테스트 작성
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should allow user to login', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid=email-input]', 'test@example.com')
    await page.fill('[data-testid=password-input]', 'password123')
    await page.click('[data-testid=login-button]')
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('대시보드')
  })
})

// e2e/food-upload.spec.ts
test.describe('Food Upload', () => {
  test('should upload food image successfully', async ({ page }) => {
    // 로그인 후
    await page.goto('/upload')
    
    // 파일 업로드 시뮬레이션
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.click('[data-testid=camera-button]')
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles('test-fixtures/food-image.jpg')
    
    // 업로드 완료 확인
    await expect(page.locator('[data-testid=upload-success]')).toBeVisible()
  })
})
```

#### 테스트 스크립트 설정
- [ ] `package.json`에 테스트 스크립트 추가
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## 🚀 Task 4: 배포 설정

### ✅ 체크리스트

#### Vercel 배포 설정
- [ ] Vercel 계정 생성 및 프로젝트 연결
- [ ] `vercel.json` 설정 파일 생성
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  },
  "regions": ["icn1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://your-domain.vercel.app"
  }
}
```

#### 환경 변수 설정
- [ ] Vercel 대시보드에서 환경 변수 설정
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_N8N_WEBHOOK_URL`
  - `NEXT_PUBLIC_APP_URL`

#### 도메인 및 SSL 설정
- [ ] 커스텀 도메인 연결 (선택사항)
- [ ] SSL 인증서 자동 설정 확인
- [ ] HTTPS 리다이렉트 설정

#### SEO 및 메타데이터
- [ ] `robots.txt` 생성
```txt
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

- [ ] `sitemap.xml` 생성
```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://your-domain.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://your-domain.com/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://your-domain.com/register',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

- [ ] Open Graph 이미지 설정
```typescript
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AI 식단 관리'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom right, #3B82F6, #1D4ED8)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        🍽️ AI 식단 관리
      </div>
    ),
    { ...size }
  )
}
```

#### 모니터링 설정
- [ ] Vercel Analytics 활성화
```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] Web Vitals 모니터링
```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

#### CI/CD 파이프라인
- [ ] GitHub Actions 설정 (선택사항)
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'pnpm'
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Run tests
      run: pnpm test
    
    - name: Run build
      run: pnpm build
    
    - name: Run E2E tests
      run: pnpm test:e2e
```

#### 성능 측정
- [ ] Lighthouse CI 설정
```json
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'pnpm start',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.9}],
        'categories:seo': ['warn', {minScore: 0.9}],
      },
    },
  },
}
```

---

## 📝 완료 조건

### Phase 6 완료 체크리스트
- [ ] PWA로 설치 가능함 (Add to Home Screen)
- [ ] 오프라인에서도 기본 기능 작동함
- [ ] 모든 터치 인터페이스가 44px 이상임
- [ ] 스와이프 제스처가 구현됨
- [ ] Lighthouse 점수 90점 이상
- [ ] First Contentful Paint < 1.5초
- [ ] Largest Contentful Paint < 2.5초
- [ ] Cumulative Layout Shift < 0.1
- [ ] 주요 기능에 대한 테스트가 구현됨
- [ ] 테스트 커버리지가 80% 이상임
- [ ] E2E 테스트가 통과함
- [ ] 앱이 프로덕션 환경에서 정상 작동함
- [ ] 모든 기능이 배포된 환경에서 테스트됨
- [ ] 성능 지표가 만족스러운 수준임
- [ ] 모니터링 시스템이 구축됨

---

## ⚠️ 주의사항

- **성능**: 이미지 최적화와 코드 스플리팅으로 로딩 시간 단축
- **PWA**: 오프라인 기능과 앱 설치 기능 테스트
- **테스트**: 실제 사용 시나리오를 반영한 테스트 케이스 작성
- **모니터링**: 실사용자 데이터를 기반으로 지속적인 성능 개선
- **보안**: 프로덕션 환경에서 민감한 정보 보호

---

## 🎉 프로젝트 완료!

Phase 6 완료 후 → **AI 식단 관리 서비스 MVP 런칭** 🚀

---
*Phase 6 상태: ⏳ 준비됨*
