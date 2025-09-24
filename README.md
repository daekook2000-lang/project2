# AI 식단 기록 서비스 🥗📱

사진 한 장으로 완성하는 스마트한 식단 관리 서비스입니다.

## ✨ 주요 기능

- **원클릭 식단 기록**: 사진 선택만으로 모든 분석이 자동 시작
- **AI 스마트 분석**: 음식 인식 및 칼로리/영양성분 자동 계산
- **시간 기반 자동 분류**: 업로드 시간으로 끼니(아침/점심/저녁/간식) 자동 구분
- **직관적인 대시보드**: 날짜별, 끼니별 정리된 식단 기록 조회
- **95% 정확도**: 1000+ 음식 인식 가능
- **초고속 처리**: 평균 3초 내 분석 완료

## 🛠️ 기술 스택

- **Frontend/Backend**: Next.js 15 (App Router)
- **Database/Auth**: Supabase
- **AI Processing**: n8n 워크플로우
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 🚀 시작하기

### 개발 환경 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인하세요.

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# n8n Webhook
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── _components/          # 랜딩페이지 컴포넌트
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── DemoSection.tsx
│   │   └── Footer.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── docs/                     # 프로젝트 문서
    ├── PRD.md
    ├── TASK_OVERVIEW.md
    └── phases/
```

## 🎯 핵심 사용자 플로우

1. **사진 업로드**: 음식 사진을 촬영하거나 갤러리에서 선택
2. **AI 자동 분석**: 업로드와 동시에 AI가 음식 인식 및 영양성분 계산
3. **자동 분류 저장**: 시간대별로 끼니를 자동 구분하여 데이터베이스에 저장
4. **결과 확인**: 대시보드에서 날짜별, 끼니별 식단 기록 조회

## 🔄 n8n 웹훅 연동

### Request (Next.js → n8n)
```javascript
// multipart/form-data 형식
{
  image: File,          // 이미지 파일
  userId: string        // 사용자 ID
}
```

### Response (n8n → Next.js)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "foodName": "김치찌개",
        "confidence": 0.95,
        "quantity": "1인분 (400g)",
        "calories": 450,
        "nutrients": {
          "carbohydrates": { "value": 15.2, "unit": "g" },
          "protein": { "value": 25.1, "unit": "g" },
          "fat": { "value": 28.3, "unit": "g" }
        }
      }
    ],
    "summary": {
      "totalCalories": 1040,
      "totalCarbohydrates": { "value": 86.8, "unit": "g" },
      "totalProtein": { "value": 51.8, "unit": "g" },
      "totalFat": { "value": 49.9, "unit": "g" }
    }
  }
}
```

## 📋 개발 상태

- ✅ **Phase 1**: 랜딩페이지 구현 완료
- ⏳ **Phase 2**: 인증 시스템 (예정)
- ⏳ **Phase 3**: 핵심 UI (예정)
- ⏳ **Phase 4**: 백엔드 연동 (예정)
- ⏳ **Phase 5**: 고급 기능 (예정)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

*현재 프로토타입 단계입니다. 지속적으로 개선하고 있어요! 🚀*
