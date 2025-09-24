# Task 18: 배포 설정

## 📋 개요
AI 식단 관리 서비스를 프로덕션 환경에 배포하고 운영할 수 있도록 설정합니다.

## 🎯 목표
- Vercel을 통한 Next.js 앱 배포
- 환경 변수 및 보안 설정
- 도메인 연결 및 SSL 인증서 설정
- 모니터링 및 로깅 시스템 구축

## ✅ 체크리스트

### Vercel 배포 설정
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

### 환경 변수 설정
- [ ] 프로덕션 환경 변수 설정
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_N8N_WEBHOOK_URL`
  - `NEXT_PUBLIC_APP_URL`

### 빌드 최적화
- [ ] `next.config.ts` 프로덕션 최적화
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

### 성능 모니터링
- [ ] Vercel Analytics 설정
- [ ] Web Vitals 모니터링 구현
- [ ] 에러 추적 시스템 설정 (Sentry 등)

### SEO 및 메타데이터
- [ ] robots.txt 생성
- [ ] sitemap.xml 생성
- [ ] Open Graph 이미지 설정
- [ ] 파비콘 및 앱 아이콘 설정

## 📝 완료 조건
- [ ] 앱이 프로덕션 환경에서 정상 작동함
- [ ] 모든 기능이 배포된 환경에서 테스트됨
- [ ] 성능 지표가 만족스러운 수준임
- [ ] 보안 설정이 적절히 구성됨

## 📊 예상 소요 시간
**2-3시간**

---
*상태: ⏳ 대기 중*
