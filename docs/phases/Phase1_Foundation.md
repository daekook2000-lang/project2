# Phase 1: 프로젝트 기반 설정 (Foundation)

## 📋 개요
Next.js 기반 AI 식단 관리 서비스의 기본 인프라를 구축하고 Supabase와 연동하여 개발 환경을 완성합니다.

## 🎯 목표
- Next.js App Router 프로젝트 초기 설정
- Supabase 프로젝트 생성 및 연동
- 데이터베이스 스키마 설계 및 구현
- 개발 환경 구성 완료

## ⏱️ 예상 소요 시간
**1-2일 (8-16시간)**

---

## 🔧 Task 1: 프로젝트 초기 설정

### ✅ 체크리스트

#### Next.js 프로젝트 설정
- [ ] Next.js 14+ 프로젝트 생성 확인
```bash
npx create-next-app@latest ai-diet-tracker --typescript --tailwind --eslint --app
```
- [ ] TypeScript 설정 확인 (`tsconfig.json`)
- [ ] App Router 구조 확인 (`src/app/` 디렉토리)

#### 개발 도구 설정
- [ ] ESLint 설정 확인 및 커스터마이징
- [ ] Prettier 설정 파일 생성
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```
- [ ] VS Code 설정 파일 생성 (`.vscode/settings.json`)

#### 폴더 구조 생성
```
src/
├── app/
│   ├── (auth)/          # 인증 라우트 그룹
│   ├── dashboard/       # 대시보드
│   ├── upload/          # 업로드 페이지
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # 기본 UI 컴포넌트
│   ├── auth/            # 인증 관련 컴포넌트
│   ├── upload/          # 업로드 관련 컴포넌트
│   └── dashboard/       # 대시보드 컴포넌트
├── lib/
│   ├── supabase/        # Supabase 클라이언트
│   ├── utils/           # 유틸리티 함수
│   └── types/           # 타입 정의
└── hooks/               # 커스텀 훅
```

#### 환경 설정
- [ ] `.env.local` 템플릿 파일 생성
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# n8n Webhook
NEXT_PUBLIC_N8N_WEBHOOK_URL=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
- [ ] `.env.example` 파일 생성 (공개용 템플릿)

---

## 🗄️ Task 2: Supabase 설정

### ✅ 체크리스트

#### Supabase 프로젝트 생성
- [ ] [Supabase 대시보드](https://supabase.com/dashboard)에서 새 프로젝트 생성
- [ ] 프로젝트 이름: `ai-diet-tracker`
- [ ] 데이터베이스 비밀번호 설정 및 보관
- [ ] 리전 선택 (ap-northeast-1 권장)

#### 프로젝트 설정 정보 수집
- [ ] Project URL 복사 (`https://[project-ref].supabase.co`)
- [ ] API Keys 수집:
  - [ ] `anon` (public) key
  - [ ] `service_role` key
- [ ] Database URL 확인

#### Next.js 프로젝트에 Supabase 설치
- [ ] 필수 패키지 설치
```bash
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
```

#### Supabase 클라이언트 설정
- [ ] `src/lib/supabase/client.ts` 생성
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => createClientComponentClient()
```

- [ ] `src/lib/supabase/server.ts` 생성
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => createServerComponentClient({ cookies })
```

#### 기본 연결 테스트
- [ ] 테스트 페이지 생성 및 연결 확인
- [ ] 환경 변수 설정 완료
- [ ] 개발 서버에서 Supabase 연결 확인

---

## 🏗️ Task 3: 데이터베이스 스키마 설계

### ✅ 체크리스트

#### 핵심 테이블 생성

##### 1. 사용자 프로필 테이블 (profiles)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);
```
- [ ] `profiles` 테이블 생성
- [ ] RLS 정책 설정 (사용자는 자신의 프로필만 접근)

##### 2. 식단 기록 테이블 (food_logs)
```sql
CREATE TABLE food_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('아침', '점심', '저녁', '간식')),
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  analysis_status VARCHAR(20) DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'completed', 'failed')),
  total_calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```
- [ ] `food_logs` 테이블 생성
- [ ] 인덱스 생성 (user_id, logged_at, meal_type)

##### 3. 음식 항목 테이블 (food_items)
```sql
CREATE TABLE food_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  food_log_id UUID REFERENCES food_logs(id) ON DELETE CASCADE NOT NULL,
  food_name VARCHAR(255) NOT NULL,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  quantity VARCHAR(100),
  calories INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```
- [ ] `food_items` 테이블 생성

##### 4. 영양성분 테이블 (nutrients)
```sql
CREATE TABLE nutrients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE NOT NULL,
  nutrient_type VARCHAR(50) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```
- [ ] `nutrients` 테이블 생성

#### 보안 정책 (RLS) 설정
- [ ] 모든 테이블에 RLS 활성화
- [ ] 사용자별 데이터 접근 정책 설정
- [ ] 테이블 간 관계 정책 설정

#### 스토리지 버킷 설정
- [ ] 음식 이미지용 Storage 버킷 생성 (`food-images`)
- [ ] 버킷 정책 설정 (사용자별 폴더 구조)

#### 유틸리티 함수 및 트리거
- [ ] 프로필 자동 생성 트리거 (사용자 가입 시)
- [ ] 업데이트 시간 자동 갱신 함수
- [ ] 각 테이블에 updated_at 트리거 적용

#### 타입 정의 생성
- [ ] Supabase CLI 설치
```bash
pnpm add -D supabase
```
- [ ] TypeScript 타입 생성
```bash
supabase gen types typescript --project-id [project-ref] --schema public > src/lib/types/database.types.ts
```

---

## 📝 완료 조건

### Phase 1 완료 체크리스트
- [ ] `pnpm dev` 명령어로 개발 서버가 정상 실행됨
- [ ] `pnpm build` 명령어로 빌드가 성공함
- [ ] Supabase 프로젝트가 성공적으로 생성됨
- [ ] Next.js 앱에서 Supabase 연결이 정상 작동함
- [ ] 모든 데이터베이스 테이블이 성공적으로 생성됨
- [ ] RLS 정책이 올바르게 설정됨
- [ ] Storage 버킷이 생성되고 정책이 설정됨
- [ ] TypeScript 타입 정의가 생성됨

---

## ⚠️ 주의사항

- **보안**: `service_role` key는 절대 클라이언트 사이드에 노출하지 않음
- **환경변수**: `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- **데이터베이스**: RLS 정책을 반드시 설정하여 데이터 보안 확보
- **타입 안전성**: TypeScript strict 모드 활성화 확인

---

## 🔗 다음 단계
Phase 1 완료 후 → **Phase 2: 인증 시스템** 진행

---
*Phase 1 상태: ⏳ 준비됨*
