'use client'

import { X, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'

interface UploadProgressProps {
  file: File | null
  uploading: boolean
  error: string | null
  onReset: () => void
  onRetry: () => void
}

export function UploadProgress({ file, uploading, error, onReset, onRetry }: UploadProgressProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {uploading ? '분석 중...' : error ? '분석 실패' : '업로드 완료'}
        </h2>
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* File Preview */}
      {file && (
        <div className="mb-6">
          <div className="w-full max-w-md mx-auto bg-gray-100 rounded-2xl overflow-hidden">
            {file.type.startsWith('image/') && (
              <Image
                src={URL.createObjectURL(file)}
                alt="업로드된 음식 사진"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
            )}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              파일명: {file.name}
            </p>
            <p className="text-sm text-gray-600">
              크기: {(file.size / 1024 / 1024).toFixed(2)}MB
            </p>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="text-center">
        {uploading && (
          <div className="mb-6">
            {/* Loading Animation */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI가 음식을 분석하고 있어요
            </h3>
            <p className="text-gray-600 mb-4">
              평균 3-5초 정도 소요됩니다
            </p>
            
            {/* Progress Steps */}
            <div className="max-w-sm mx-auto">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>업로드</span>
                <span>분석</span>
                <span>저장</span>
              </div>
              <div className="flex space-x-1">
                <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle size={40} className="text-red-500" />
            </div>
            
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              분석에 실패했습니다
            </h3>
            <p className="text-red-700 mb-6 bg-red-50 p-4 rounded-lg">
              {error}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onRetry}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <RotateCcw size={16} />
                <span>다시 시도</span>
              </button>
              <button
                onClick={onReset}
                className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <span>다른 사진 선택</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tips during upload */}
      {uploading && (
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            💡 <strong>분석 중에는</strong> 페이지를 벗어나지 마세요. 
            분석이 완료되면 자동으로 결과가 표시됩니다.
          </p>
        </div>
      )}
    </div>
  )
}
