'use client'

import { useState } from 'react'
import { AnalysisResult, UploadApiResponse } from '@/lib/types/database.types'
import { WebhookResponse, AnalysisData } from '@/lib/types/ai-analysis.types'

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  success: boolean
}

interface UploadResult {
  success: boolean
  data?: AnalysisResult
  error?: string
}

// 현재 시간을 기준으로 식사 유형 결정
const getCurrentMealType = (): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 11) return 'breakfast'
  if (hour >= 11 && hour < 17) return 'lunch'
  if (hour >= 17 && hour < 22) return 'dinner'
  return 'snack'
}

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  })

  const uploadFile = async (file: File, userId: string): Promise<UploadResult> => {
    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      success: false,
    })

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('userId', userId)
      
      // Add additional debugging info
      console.log('FormData contents:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId: userId
      })

      // Simulate progress
      setUploadState(prev => ({ ...prev, progress: 25 }))

      // Check if webhook URL is configured
      const webhookUrl = 'https://daekook2000.app.n8n.cloud/webhook-test/62461ec8-1135-4c58-a9d0-0cfacd006298'
      
      // For testing purposes, let's try the webhook first
      console.log("Attempting to call webhook:", webhookUrl)

      // Real API call to n8n webhook
      setUploadState(prev => ({ ...prev, progress: 50 }))

      // Set up timeout for webhook request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        console.error('Webhook request timeout after 60 seconds')
      }, 60000) // 60 seconds timeout

      console.log('Sending image to AI analysis webhook:', webhookUrl)
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Remove Content-Type header to let browser set it automatically for FormData
        // This ensures proper boundary is set for multipart/form-data
        headers: {
          'Accept': 'application/json',
        }
      })

      clearTimeout(timeoutId)

      setUploadState(prev => ({ ...prev, progress: 75 }))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Webhook error details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText,
          url: webhookUrl
        })
        throw new Error(`Webhook 오류 (${response.status}): ${response.statusText} - ${errorText}`)
      }

      const responseText = await response.text()
      console.log('Webhook response details:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
        url: webhookUrl
      })
      
      let webhookResult: WebhookResponse[] | WebhookResponse | any
      try {
        webhookResult = JSON.parse(responseText)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        throw new Error('웹훅 응답을 파싱할 수 없습니다.')
      }

      // webhook 응답 처리 - 배열 또는 단일 객체일 수 있음
      let result: AnalysisData
      
      if (Array.isArray(webhookResult)) {
        // 배열 형태의 webhook 응답 처리
        const firstResponse = webhookResult[0]
        if (!firstResponse?.output?.success) {
          throw new Error('AI 분석에 실패했습니다.')
        }
        result = firstResponse.output.data
      } else if (webhookResult?.output?.success) {
        // 단일 객체 형태의 webhook 응답 처리
        result = webhookResult.output.data
      } else {
        // 예상과 다른 형태의 응답인 경우
        throw new Error('웹훅 응답 형식이 올바르지 않습니다.')
      }

      // 결과 유효성 검사
      if (!result?.items || !Array.isArray(result.items) || result.items.length === 0) {
        throw new Error('분석된 음식 정보를 찾을 수 없습니다.')
      }

      if (!result?.summary) {
        throw new Error('영양 정보 요약을 찾을 수 없습니다.')
      }

      // 분석 완료 - 바로 결과 반환

      setUploadState({
        uploading: false,
        progress: 100,
        error: null,
        success: true,
      })

      return { success: true, data: result }
    } catch (error) {
      console.error('Upload error:', error)
      
      let errorMessage = '업로드 중 오류가 발생했습니다.'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Webhook 요청이 시간 초과되었습니다. 네트워크 연결을 확인해주세요.'
        } else {
          errorMessage = error.message
        }
      }

      setUploadState({
        uploading: false,
        progress: 0,
        error: errorMessage,
        success: false,
      })

      return { success: false, error: errorMessage }
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
