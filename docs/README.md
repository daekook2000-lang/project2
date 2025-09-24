# AI 식단 관리 서비스 개발 문서

## 📁 문서 구조

### 핵심 문서
- **[PRD.md](./PRD.md)** - 제품 요구사항 정의서
- **[TASK_OVERVIEW.md](./TASK_OVERVIEW.md)** - 전체 Task 개요 및 진행 상황

### Phase 문서 (총 6개)
`phases/` 폴더에 있는 개발 Phase들:

#### Phase 1: 프로젝트 기반 설정 (Foundation)
- [Phase1_Foundation.md](./phases/Phase1_Foundation.md) - 프로젝트 초기 설정, Supabase 연동, DB 스키마

#### Phase 2: 인증 시스템 (Authentication)
- [Phase2_Authentication.md](./phases/Phase2_Authentication.md) - Supabase Auth 설정 및 인증 UI

#### Phase 3: 핵심 UI 구현 (Core UI)
- [Phase3_Core_UI.md](./phases/Phase3_Core_UI.md) - 레이아웃, 사진 업로드, 대시보드 UI

#### Phase 4: 백엔드 연동 (Backend Integration)
- [Phase4_Backend_Integration.md](./phases/Phase4_Backend_Integration.md) - n8n 웹훅, API 통합, 데이터 동기화

#### Phase 5: 고급 기능 (Advanced Features)
- [Phase5_Advanced_Features.md](./phases/Phase5_Advanced_Features.md) - 끼니 분류, 영양성분, 로딩/에러 처리

#### Phase 6: 최적화 및 배포 (Optimization & Deployment)
- [Phase6_Optimization_Deployment.md](./phases/Phase6_Optimization_Deployment.md) - 모바일 최적화, 성능, 테스트, 배포

## 🎯 MVP 핵심 기능

### 필수 (Must Have) - 4개 Phase
1. **Phase 1**: 프로젝트 기반 설정 (Foundation)
2. **Phase 2**: 사용자 인증 시스템 (Authentication)
3. **Phase 3**: 핵심 UI (사진 업로드, 기본 대시보드)
4. **Phase 4**: n8n 웹훅 연동 및 백엔드 통합

### 중요 (Should Have) - 1개 Phase
5. **Phase 5**: 고급 기능 (끼니 분류, 로딩 상태 처리)

### 선택 (Could Have) - 1개 Phase
6. **Phase 6**: 최적화 및 배포 (모바일 최적화, 성능, 테스트, 배포)

## 📋 사용 방법

1. **시작하기**: [TASK_OVERVIEW.md](./TASK_OVERVIEW.md)에서 전체 구조 파악
2. **개발 순서**: 의존성에 따라 Phase 1부터 순차 진행
3. **진행 추적**: 각 Task 문서 내 체크리스트로 진행 상황 관리
4. **완료 표시**: Task 완료 시 TASK_OVERVIEW.md의 체크박스 업데이트

## ⏱️ 예상 개발 기간

- **MVP (필수 기능)**: 7-10일
- **완전한 서비스**: 10-16일
- **개발자 1명 기준**

## 🔧 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **자동화**: n8n (AI 분석 워크플로우)
- **배포**: Vercel

## 📞 지원

각 Task 문서에는 상세한 구현 가이드와 체크리스트가 포함되어 있습니다.
문제가 발생하면 해당 Task 문서의 "주의사항" 섹션을 참고하세요.

---
*AI 식단 관리 서비스 MVP 개발 가이드*
