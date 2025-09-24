'use client'

import { useRef } from 'react'
import { Camera, Image as ImageIcon, Upload } from 'lucide-react'

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
    // Reset input value to allow selecting the same file again
    event.target.value = ''
  }

  return (
    <div className="text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Main Upload Area */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <Upload size={48} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          음식 사진을 선택해주세요
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          사진을 선택하시면 즉시 AI 분석이 시작되어<br />
          자동으로 음식 정보와 칼로리가 계산됩니다
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 max-w-sm mx-auto">
        {/* Camera Button */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-6 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
        >
          <Camera size={24} />
          <span>카메라로 촬영</span>
        </button>

        {/* Gallery Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl transition-all duration-300 font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
        >
          <ImageIcon size={24} />
          <span>갤러리에서 선택</span>
        </button>
      </div>

      {/* File Format Info */}
      <div className="mt-8 text-sm text-gray-500">
        <p>지원 형식: JPEG, PNG, WebP (최대 10MB)</p>
      </div>
    </div>
  )
}
