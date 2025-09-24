'use client'

import { useState } from 'react'
import { FileSelector } from './FileSelector'
import { UploadProgress } from './UploadProgress'
import { UploadResult } from './UploadResult'
import { useFileUpload } from '@/hooks/useFileUpload'
import { validateImageFile, validateImageDimensions } from '@/lib/utils/file-validation'
import { AnalysisResult } from '@/lib/types/database.types'

interface PhotoUploadProps {
  userId: string
}

export function PhotoUpload({ userId }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<AnalysisResult | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const { uploading, uploadFile, resetUpload, error, success } = useFileUpload()

  const handleFileSelect = async (file: File) => {
    setValidationError(null)
    
    // 기본 파일 검증
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setValidationError(validation.error || '파일 검증에 실패했습니다.')
      return
    }

    // 이미지 크기 검증
    try {
      const dimensionValidation = await validateImageDimensions(file)
      if (!dimensionValidation.valid) {
        setValidationError(dimensionValidation.error || '이미지 크기 검증에 실패했습니다.')
        return
      }
    } catch (err) {
      console.error('Dimension validation error:', err)
      setValidationError('이미지 파일을 처리할 수 없습니다.')
      return
    }

    setSelectedFile(file)
    setUploadResult(null)

    // 자동으로 업로드 시작
    try {
      const result = await uploadFile(file, userId)
      if (result.success && result.data) {
        setUploadResult(result.data)
      }
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setUploadResult(null)
    setValidationError(null)
    resetUpload()
  }

  const handleNewUpload = () => {
    handleReset()
  }

  // 업로드 성공 시 결과 표시
  if (success && uploadResult) {
    return (
      <UploadResult 
        result={uploadResult}
        onNewUpload={handleNewUpload}
      />
    )
  }

  // 업로드 중이거나 파일이 선택된 상태
  if (uploading || selectedFile) {
    return (
      <UploadProgress 
        file={selectedFile}
        uploading={uploading}
        error={error}
        onReset={handleReset}
        onRetry={() => selectedFile && handleFileSelect(selectedFile)}
      />
    )
  }

  // 초기 상태 - 파일 선택
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
      <FileSelector 
        onFileSelect={handleFileSelect}
        disabled={uploading}
      />
      
      {/* Validation Error */}
      {validationError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-2">⚠️</span>
            <span className="text-red-700 font-medium">{validationError}</span>
          </div>
        </div>
      )}
      
      {/* Tips */}
      <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          더 정확한 분석을 위한 팁
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            음식이 잘 보이도록 위에서 촬영해주세요
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            조명이 밝은 곳에서 촬영하면 더 정확해요
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            여러 음식이 있다면 모두 포함해서 찍어주세요
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            그릇이나 접시도 함께 찍으면 양을 더 정확히 추정해요
          </li>
        </ul>
      </div>
    </div>
  )
}
