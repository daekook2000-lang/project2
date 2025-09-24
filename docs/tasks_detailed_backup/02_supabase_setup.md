# Task 02: Supabase 프로젝트 설정

## 📋 개요
Supabase 프로젝트를 생성하고 Next.js 애플리케이션과 연동하기 위한 기본 설정을 완료합니다.

## 🎯 목표
- Supabase 프로젝트 생성 및 설정
- Next.js와 Supabase 클라이언트 연동
- 환경 변수 설정
- 기본 연결 테스트

## ✅ 체크리스트

### Supabase 프로젝트 생성
- [ ] [Supabase 대시보드](https://supabase.com/dashboard)에서 새 프로젝트 생성
- [ ] 프로젝트 이름: `ai-diet-tracker` (또는 유사한 이름)
- [ ] 데이터베이스 비밀번호 설정 및 안전한 곳에 보관
- [ ] 리전 선택 (한국의 경우 ap-northeast-1 권장)

### 프로젝트 설정 정보 수집
- [ ] Project URL 복사 (`https://[project-ref].supabase.co`)
- [ ] API Keys 수집:
  - [ ] `anon` (public) key 복사
  - [ ] `service_role` key 복사 (보안 주의)
- [ ] Database URL 확인 (필요시)

### Next.js 프로젝트에 Supabase 설치
- [ ] Supabase JavaScript 클라이언트 설치
  ```bash
  pnpm add @supabase/supabase-js
  ```
- [ ] Supabase Auth Helpers for Next.js 설치
  ```bash
  pnpm add @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
  ```

### 환경 변수 설정
- [ ] `.env.local` 파일에 Supabase 설정 추가
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
  SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
  ```
- [ ] `.env.example` 파일 업데이트

### Supabase 클라이언트 설정
- [ ] `src/lib/supabase/client.ts` 파일 생성
  ```typescript
  import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
  
  export const createClient = () => createClientComponentClient()
  ```
- [ ] `src/lib/supabase/server.ts` 파일 생성 (Server Components용)
  ```typescript
  import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
  import { cookies } from 'next/headers'
  
  export const createClient = () => createServerComponentClient({ cookies })
  ```
- [ ] `src/lib/supabase/middleware.ts` 파일 생성 (미들웨어용)

### 타입 정의 설정
- [ ] `src/lib/types/database.types.ts` 파일 생성 준비
- [ ] Supabase CLI 설치 (타입 생성용)
  ```bash
  pnpm add -D supabase
  ```
- [ ] `package.json`에 타입 생성 스크립트 추가
  ```json
  {
    "scripts": {
      "types:generate": "supabase gen types typescript --project-id [project-ref] --schema public > src/lib/types/database.types.ts"
    }
  }
  ```

### 기본 연결 테스트
- [ ] 테스트 페이지 생성 (`src/app/test-connection/page.tsx`)
  ```typescript
  import { createClient } from '@/lib/supabase/server'
  
  export default async function TestConnection() {
    const supabase = createClient()
    const { data, error } = await supabase.from('_test').select('*').limit(1)
    
    return (
      <div>
        <h1>Supabase Connection Test</h1>
        <p>Status: {error ? 'Error' : 'Connected'}</p>
        {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      </div>
    )
  }
  ```
- [ ] 개발 서버에서 연결 테스트 확인

### Supabase 대시보드 기본 설정
- [ ] SQL Editor에서 기본 연결 테스트
  ```sql
  SELECT version();
  ```
- [ ] Authentication 설정 확인
  - [ ] Email provider 활성화 확인
  - [ ] Site URL 설정: `http://localhost:3000`
  - [ ] Redirect URLs 설정: `http://localhost:3000/auth/callback`

### 보안 설정
- [ ] Row Level Security (RLS) 기본 개념 확인
- [ ] API Keys 보안 주의사항 확인
  - [ ] `service_role` key는 서버 사이드에서만 사용
  - [ ] `anon` key는 클라이언트 사이드에서 사용 가능
- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인

## 🔧 설정 파일 구조
```
src/lib/supabase/
├── client.ts          # 클라이언트 컴포넌트용
├── server.ts          # 서버 컴포넌트용
├── middleware.ts      # 미들웨어용
└── types/
    └── database.types.ts  # 자동 생성된 타입 정의
```

## 📝 완료 조건
- [ ] Supabase 프로젝트가 성공적으로 생성됨
- [ ] Next.js 앱에서 Supabase 연결이 정상 작동함
- [ ] 환경 변수가 올바르게 설정됨
- [ ] 테스트 페이지에서 연결 상태 확인 가능
- [ ] 타입 정의 파일 생성 준비 완료

## ⚠️ 주의사항
- `service_role` key는 절대 클라이언트 사이드에 노출하지 않음
- 프로덕션 환경에서는 반드시 환경 변수를 안전하게 관리
- Supabase 프로젝트의 데이터베이스 비밀번호를 안전한 곳에 보관

## 🔗 의존성
- **선행 작업**: [01_project_setup.md](./01_project_setup.md)
- **후속 작업**: [03_database_schema.md](./03_database_schema.md)

## 📊 예상 소요 시간
**1-2시간**

---
*상태: ⏳ 대기 중*
