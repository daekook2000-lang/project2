# Task 01: 프로젝트 초기 설정

## 📋 개요
Next.js App Router 기반의 AI 식단 관리 서비스 프로젝트 초기 설정을 완료합니다.

## 🎯 목표
- Next.js 14+ App Router 프로젝트 구조 설정
- TypeScript 및 필수 개발 도구 설정
- 코드 품질 도구 (ESLint, Prettier) 설정
- 기본 폴더 구조 생성

## ✅ 체크리스트

### 프로젝트 기본 설정
- [ ] Next.js 프로젝트 초기화 확인 (`npx create-next-app@latest`)
- [ ] TypeScript 설정 확인 (`tsconfig.json` 검토)
- [ ] App Router 구조 확인 (`src/app/` 디렉토리)
- [ ] 필수 의존성 설치 확인

### 개발 도구 설정
- [ ] ESLint 설정 확인 및 커스터마이징
- [ ] Prettier 설정 파일 생성 (`.prettierrc`)
- [ ] `.gitignore` 파일 검토 및 보완
- [ ] VS Code 설정 파일 생성 (`.vscode/settings.json`)

### 폴더 구조 생성
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── utils/
│   └── types/
└── hooks/
```

- [ ] 인증 관련 라우트 그룹 생성 (`(auth)`)
- [ ] 대시보드 라우트 생성 (`dashboard`)
- [ ] 공통 컴포넌트 폴더 생성 (`components/`)
- [ ] 유틸리티 및 라이브러리 폴더 생성 (`lib/`)
- [ ] 커스텀 훅 폴더 생성 (`hooks/`)

### 패키지 관리
- [ ] `package.json` scripts 설정 확인
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "lint:fix": "next lint --fix",
      "type-check": "tsc --noEmit"
    }
  }
  ```
- [ ] 필수 개발 의존성 설치
  - `@types/node`
  - `@types/react`
  - `@types/react-dom`
  - `eslint-config-next`

### 환경 설정
- [ ] `.env.local` 템플릿 파일 생성
  ```env
  # Supabase
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  
  # n8n Webhook
  N8N_WEBHOOK_URL=
  
  # App Configuration
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
- [ ] `.env.example` 파일 생성 (공개용 템플릿)

### 기본 설정 파일들
- [ ] `next.config.ts` 설정 확인
- [ ] `tailwind.config.js` 설정 (UI 라이브러리 사용 시)
- [ ] `postcss.config.js` 설정 확인

## 🔧 기술 스택 확인
- [ ] Next.js 14+ (App Router)
- [ ] TypeScript 5+
- [ ] React 18+
- [ ] Tailwind CSS (스타일링)
- [ ] ESLint + Prettier (코드 품질)

## 📝 완료 조건
- [ ] `pnpm dev` 명령어로 개발 서버가 정상 실행됨
- [ ] `pnpm build` 명령어로 빌드가 성공함
- [ ] `pnpm lint` 명령어로 린트 검사가 통과함
- [ ] TypeScript 컴파일 에러가 없음

## ⚠️ 주의사항
- App Router 구조를 준수하여 `src/app/` 디렉토리 내에 페이지 구성
- TypeScript strict 모드 활성화 확인
- 모든 설정 파일은 프로젝트 루트에 위치

## 🔗 의존성
- **선행 작업**: 없음
- **후속 작업**: [02_supabase_setup.md](./02_supabase_setup.md)

## 📊 예상 소요 시간
**2-4시간**

---
*상태: ⏳ 대기 중*
