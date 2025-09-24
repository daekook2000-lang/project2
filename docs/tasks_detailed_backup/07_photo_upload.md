# Task 07: 사진 업로드 인터페이스

## 📋 개요
PRD의 핵심인 "원클릭 식단 기록" 기능을 구현하기 위한 사진 업로드 인터페이스를 개발합니다.

## 🎯 목표
- 직관적이고 간단한 사진 업로드 UI 구현
- 카메라와 갤러리 선택 옵션 제공
- 업로드 진행 상황 및 결과 피드백
- 모바일 최적화된 사용자 경험

## ✅ 체크리스트

### 기본 업로드 컴포넌트 구현

#### 1. 파일 업로드 훅 구현
- [ ] `src/hooks/useFileUpload.ts` 생성
```typescript
'use client'

import { useState } from 'react'

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  success: boolean
}

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  })

  const uploadFile = async (file: File) => {
    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      success: false,
    })

    try {
      // FormData 생성
      const formData = new FormData()
      formData.append('image', file)
      
      // 사용자 ID 추가 (인증된 사용자에서 가져오기)
      const userId = await getCurrentUserId() // 구현 필요
      formData.append('userId', userId)

      // n8n 웹훅으로 전송
      const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('업로드 실패')
      }

      const result = await response.json()

      setUploadState({
        uploading: false,
        progress: 100,
        error: null,
        success: true,
      })

      return { success: true, data: result }
    } catch (error) {
      setUploadState({
        uploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.',
        success: false,
      })

      return { success: false, error }
    }
  }

  const resetUpload = () => {
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
    })
  }

  return {
    ...uploadState,
    uploadFile,
    resetUpload,
  }
}

async function getCurrentUserId(): Promise<string> {
  // Supabase에서 현재 사용자 ID 가져오기
  // 구현 필요
  return 'user-id'
}
```

#### 2. 파일 선택 컴포넌트
- [ ] `src/components/upload/FileSelector.tsx` 생성
```typescript
'use client'

import { useRef } from 'react'
import { Camera, Image as ImageIcon } from 'lucide-react'

interface FileSelectorProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function FileSelector({ onFileSelect, disabled }: FileSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const openGallery = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const openCamera = () => {
    if (!disabled) {
      cameraInputRef.current?.click()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 숨겨진 파일 입력 요소들 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 메인 업로드 버튼 */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={openCamera}
          disabled={disabled}
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 px-6 rounded-xl transition-colors font-medium text-lg"
        >
          <Camera size={24} />
          <span>사진 촬영하기</span>
        </button>

        <button
          onClick={openGallery}
          disabled={disabled}
          className="w-full flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white py-4 px-6 rounded-xl transition-colors font-medium text-lg"
        >
          <ImageIcon size={24} />
          <span>갤러리에서 선택</span>
        </button>
      </div>

      <p className="text-gray-500 text-sm text-center">
        음식 사진을 선택하면 자동으로 분석이 시작됩니다
      </p>
    </div>
  )
}
```

#### 3. 업로드 진행 상황 컴포넌트
- [ ] `src/components/upload/UploadProgress.tsx` 생성
```typescript
'use client'

interface UploadProgressProps {
  progress: number
  uploading: boolean
  error: string | null
  success: boolean
  onRetry?: () => void
  onReset?: () => void
}

export function UploadProgress({ 
  progress, 
  uploading, 
  error, 
  success, 
  onRetry, 
  onReset 
}: UploadProgressProps) {
  if (!uploading && !error && !success) {
    return null
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {uploading && (
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <div>
            <p className="text-lg font-medium text-gray-900">분석 중...</p>
            <p className="text-sm text-gray-600">
              AI가 음식을 분석하고 있습니다
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {success && (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">분석 완료!</p>
            <p className="text-sm text-gray-600">
              식단이 성공적으로 기록되었습니다
            </p>
          </div>
          <button
            onClick={onReset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            새로운 식단 기록하기
          </button>
        </div>
      )}

      {error && (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">분석 실패</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={onReset}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg transition-colors"
            >
              새 사진 선택
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

#### 4. 메인 업로드 페이지 컴포넌트
- [ ] `src/components/upload/PhotoUpload.tsx` 생성
```typescript
'use client'

import { useState } from 'react'
import { FileSelector } from './FileSelector'
import { UploadProgress } from './UploadProgress'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useAuth } from '@/hooks/useAuth'

export function PhotoUpload() {
  const { user } = useAuth()
  const { uploading, progress, error, success, uploadFile, resetUpload } = useFileUpload()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = async (file: File) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    // 파일 크기 검증 (예: 10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.')
      return
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    setSelectedFile(file)
    await uploadFile(file)
  }

  const handleRetry = () => {
    if (selectedFile) {
      uploadFile(selectedFile)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    resetUpload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              식단 기록하기
            </h1>
            <p className="text-gray-600">
              음식 사진을 촬영하거나 선택해주세요
            </p>
          </div>

          {/* 업로드 인터페이스 */}
          {!uploading && !success && !error ? (
            <FileSelector 
              onFileSelect={handleFileSelect} 
              disabled={!user}
            />
          ) : (
            <UploadProgress
              progress={progress}
              uploading={uploading}
              error={error}
              success={success}
              onRetry={handleRetry}
              onReset={handleReset}
            />
          )}

          {/* 로그인 필요 메시지 */}
          {!user && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm text-center">
                식단 기록을 위해서는 로그인이 필요합니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 파일 검증 및 최적화

#### 1. 이미지 압축 유틸리티
- [ ] `src/lib/utils/image-compression.ts` 생성
```typescript
export function compressImage(file: File, maxWidth = 1024, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      // 비율 유지하면서 크기 조정
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Blob으로 변환
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        } else {
          resolve(file)
        }
      }, 'image/jpeg', quality)
    }

    img.src = URL.createObjectURL(file)
  })
}
```

#### 2. 파일 검증 유틸리티
- [ ] `src/lib/utils/file-validation.ts` 생성
```typescript
export interface FileValidationResult {
  valid: boolean
  error?: string
}

export function validateImageFile(file: File): FileValidationResult {
  // 파일 타입 검증
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '이미지 파일만 업로드할 수 있습니다.' }
  }

  // 지원하는 이미지 형식 검증
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'JPEG, PNG, WebP 형식의 이미지만 지원됩니다.' }
  }

  // 파일 크기 검증 (10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기는 10MB 이하여야 합니다.' }
  }

  // 최소 크기 검증 (너무 작은 이미지 방지)
  const minSize = 1024 // 1KB
  if (file.size < minSize) {
    return { valid: false, error: '파일이 너무 작습니다.' }
  }

  return { valid: true }
}
```

### 사용자 경험 개선

#### 1. 드래그 앤 드롭 지원 (데스크톱)
- [ ] 드래그 앤 드롭 이벤트 핸들링
- [ ] 드래그 오버 시 시각적 피드백
- [ ] 드롭 영역 하이라이트

#### 2. 이미지 미리보기
- [ ] 선택한 이미지 미리보기 표시
- [ ] 이미지 회전/크롭 기능 (선택사항)
- [ ] 업로드 전 확인 단계

#### 3. 오프라인 지원
- [ ] 네트워크 상태 감지
- [ ] 오프라인 시 큐잉 기능
- [ ] 연결 복구 시 자동 업로드

## 📝 완료 조건
- [ ] 카메라와 갤러리에서 이미지 선택 가능
- [ ] 파일 검증이 올바르게 작동함
- [ ] 업로드 진행 상황이 시각적으로 표시됨
- [ ] 성공/실패 피드백이 적절히 제공됨
- [ ] 모바일에서 정상 작동함
- [ ] 에러 처리가 사용자 친화적으로 구현됨

## ⚠️ 주의사항
- 모바일 브라우저의 파일 접근 권한 확인
- 이미지 압축으로 업로드 속도 최적화
- 네트워크 오류 시 재시도 로직 구현
- 사용자가 업로드 중 페이지를 벗어나지 않도록 경고

## 🔗 의존성
- **선행 작업**: [06_layout_design.md](./06_layout_design.md)
- **후속 작업**: [10_api_integration.md](./10_api_integration.md)

## 📊 예상 소요 시간
**4-5시간**

---
*상태: ⏳ 대기 중*
