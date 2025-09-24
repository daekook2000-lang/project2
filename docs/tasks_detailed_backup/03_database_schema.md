# Task 03: 데이터베이스 스키마 설계

## 📋 개요
AI 식단 관리 서비스에 필요한 데이터베이스 스키마를 설계하고 Supabase에서 구현합니다.

## 🎯 목표
- 사용자 프로필 및 식단 기록을 위한 테이블 설계
- 적절한 관계형 데이터베이스 구조 구현
- Row Level Security (RLS) 정책 설정
- 필요한 인덱스 및 제약 조건 설정

## ✅ 체크리스트

### 스키마 설계 계획
- [ ] ERD (Entity Relationship Diagram) 작성
- [ ] 테이블 간 관계 정의
- [ ] 데이터 타입 및 제약 조건 정의
- [ ] 보안 정책 계획 수립

### 핵심 테이블 생성

#### 1. 사용자 프로필 테이블 (profiles)
- [ ] `profiles` 테이블 생성
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
- [ ] 프로필 업데이트 트리거 생성
- [ ] RLS 정책 설정 (사용자는 자신의 프로필만 접근 가능)

#### 2. 식단 기록 테이블 (food_logs)
- [ ] `food_logs` 테이블 생성
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
- [ ] 인덱스 생성 (user_id, logged_at, meal_type)
- [ ] RLS 정책 설정

#### 3. 음식 항목 테이블 (food_items)
- [ ] `food_items` 테이블 생성
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
- [ ] 인덱스 생성 (food_log_id)
- [ ] RLS 정책 설정

#### 4. 영양성분 테이블 (nutrients)
- [ ] `nutrients` 테이블 생성
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
- [ ] 인덱스 생성 (food_item_id, nutrient_type)
- [ ] RLS 정책 설정

### 보안 정책 (RLS) 설정
- [ ] 모든 테이블에 RLS 활성화
  ```sql
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
  ALTER TABLE nutrients ENABLE ROW LEVEL SECURITY;
  ```

- [ ] profiles 테이블 정책
  ```sql
  CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  ```

- [ ] food_logs 테이블 정책
  ```sql
  CREATE POLICY "Users can view own food logs" ON food_logs FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can insert own food logs" ON food_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Users can update own food logs" ON food_logs FOR UPDATE USING (auth.uid() = user_id);
  ```

- [ ] food_items 테이블 정책 (food_logs를 통한 간접 접근)
- [ ] nutrients 테이블 정책 (food_items를 통한 간접 접근)

### 스토리지 버킷 설정
- [ ] 음식 이미지용 Storage 버킷 생성 (`food-images`)
- [ ] 버킷 정책 설정 (사용자별 폴더 구조)
  ```sql
  CREATE POLICY "Users can upload own images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'food-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
  
  CREATE POLICY "Users can view own images" ON storage.objects FOR SELECT USING (
    bucket_id = 'food-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
  ```

### 유틸리티 함수 및 트리거
- [ ] 프로필 자동 생성 트리거 (사용자 가입 시)
  ```sql
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
    RETURN new;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  ```

- [ ] 업데이트 시간 자동 갱신 함수
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```

- [ ] 각 테이블에 updated_at 트리거 적용

### 인덱스 최적화
- [ ] 자주 조회되는 컬럼에 인덱스 생성
  ```sql
  CREATE INDEX idx_food_logs_user_logged_at ON food_logs(user_id, logged_at DESC);
  CREATE INDEX idx_food_logs_meal_type ON food_logs(meal_type);
  CREATE INDEX idx_food_items_food_log_id ON food_items(food_log_id);
  CREATE INDEX idx_nutrients_food_item_id ON nutrients(food_item_id);
  ```

### 데이터 검증 및 제약 조건
- [ ] 칼로리 값 유효성 검사 (0 이상)
- [ ] confidence 값 범위 검사 (0.0 ~ 1.0)
- [ ] meal_type enum 값 검증
- [ ] 필수 필드 NOT NULL 제약 조건 확인

### 타입 정의 생성
- [ ] Supabase CLI로 TypeScript 타입 생성
  ```bash
  pnpm run types:generate
  ```
- [ ] 생성된 타입 파일 검토 및 확인
- [ ] 커스텀 타입 정의 추가 (필요시)

## 📝 데이터베이스 구조 요약

```
profiles (사용자 프로필)
├── id (UUID, PK)
├── email (VARCHAR)
├── full_name (VARCHAR)
└── avatar_url (TEXT)

food_logs (식단 기록)
├── id (UUID, PK)
├── user_id (UUID, FK → profiles.id)
├── image_url (TEXT)
├── meal_type (VARCHAR)
├── logged_at (TIMESTAMP)
├── analysis_status (VARCHAR)
└── total_calories (INTEGER)

food_items (음식 항목)
├── id (UUID, PK)
├── food_log_id (UUID, FK → food_logs.id)
├── food_name (VARCHAR)
├── confidence (DECIMAL)
├── quantity (VARCHAR)
└── calories (INTEGER)

nutrients (영양성분)
├── id (UUID, PK)
├── food_item_id (UUID, FK → food_items.id)
├── nutrient_type (VARCHAR)
├── value (DECIMAL)
└── unit (VARCHAR)
```

## 📝 완료 조건
- [ ] 모든 테이블이 성공적으로 생성됨
- [ ] RLS 정책이 올바르게 설정됨
- [ ] Storage 버킷이 생성되고 정책이 설정됨
- [ ] 트리거와 함수가 정상 작동함
- [ ] TypeScript 타입 정의가 생성됨
- [ ] 기본 데이터 검증이 작동함

## ⚠️ 주의사항
- RLS 정책을 반드시 설정하여 데이터 보안 확보
- 외래키 제약 조건으로 데이터 무결성 보장
- 적절한 인덱스 설정으로 쿼리 성능 최적화
- Storage 버킷 정책으로 이미지 접근 권한 관리

## 🔗 의존성
- **선행 작업**: [02_supabase_setup.md](./02_supabase_setup.md)
- **후속 작업**: [04_auth_setup.md](./04_auth_setup.md)

## 📊 예상 소요 시간
**3-4시간**

---
*상태: ⏳ 대기 중*
