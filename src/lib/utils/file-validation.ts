export interface FileValidationResult {
  valid: boolean
  error?: string
}

export function validateImageFile(file: File): FileValidationResult {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '이미지 파일만 업로드할 수 있습니다.' }
  }

  // Check supported formats
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'JPEG, PNG, WebP 형식의 이미지만 지원됩니다.' }
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기는 10MB 이하여야 합니다.' }
  }

  // Basic validation passes
  return { valid: true }
}

export async function validateImageDimensions(file: File): Promise<FileValidationResult> {
  return new Promise<FileValidationResult>((resolve) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src) // Clean up
      if (img.width < 100 || img.height < 100) {
        resolve({ valid: false, error: '이미지 크기가 너무 작습니다. (최소 100x100px)' })
      } else {
        resolve({ valid: true })
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src) // Clean up
      resolve({ valid: false, error: '올바른 이미지 파일이 아닙니다.' })
    }
    img.src = URL.createObjectURL(file)
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
