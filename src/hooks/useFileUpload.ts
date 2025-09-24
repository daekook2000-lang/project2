'use client'

import { useState } from 'react'
import { AnalysisResult, UploadApiResponse } from '@/lib/types/database.types'
import {
  WebhookResponse,
  AnalysisData,
  DetailedWebhookResponse,
  DetailedAnalysisData
} from '@/lib/types/ai-analysis.types'

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

      // Use Next.js API endpoint to proxy the request to n8n webhook
      // Development: use test endpoint, Production: use real n8n webhook
      const proxyUrl = process.env.NODE_ENV === 'development'
        ? '/api/test-webhook'
        : '/api/upload-analysis'

      console.log("Sending image to analysis API:", proxyUrl)

      // API call to our Next.js endpoint (which will proxy to n8n)
      setUploadState(prev => ({ ...prev, progress: 50 }))

      // Set up timeout for API request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        console.error('API request timeout after 60 seconds')
      }, 60000) // 60 seconds timeout

      const response = await fetch(proxyUrl, {
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
        console.error('API error details:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: proxyUrl
        })
        throw new Error(`API 오류 (${response.status}): ${response.statusText} - ${errorText}`)
      }

      // API 응답을 JSON으로 파싱
      const apiResult = await response.json()
      console.log('API response:', {
        success: apiResult.success,
        message: apiResult.message,
        hasData: !!apiResult.data
      })

      if (!apiResult.success) {
        throw new Error(apiResult.error || '분석에 실패했습니다.')
      }

      // API가 반환한 웹훅 데이터를 사용
      const responseText = JSON.stringify(apiResult.data)
      
      let webhookResult: WebhookResponse[] | WebhookResponse | any
      try {
        webhookResult = JSON.parse(responseText)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        throw new Error('웹훅 응답을 파싱할 수 없습니다.')
      }

      // webhook 응답 처리 - 상세 분석과 기본 분석 모두 지원
      let result: AnalysisData | DetailedAnalysisData

      if (Array.isArray(webhookResult)) {
        // 배열 형태의 webhook 응답 처리
        const firstResponse = webhookResult[0]
        if (!firstResponse?.output?.success) {
          throw new Error('AI 분석에 실패했습니다.')
        }

        // 상세 분석인지 기본 분석인지 확인
        if (firstResponse.output.data.overall_description) {
          // 상세 분석 데이터
          result = firstResponse.output.data as DetailedAnalysisData
        } else {
          // 기본 분석 데이터
          result = firstResponse.output.data as AnalysisData
        }
      } else if (webhookResult?.output?.success) {
        // 단일 객체 형태의 webhook 응답 처리
        if (webhookResult.output.data.overall_description) {
          // 상세 분석 데이터
          result = webhookResult.output.data as DetailedAnalysisData
        } else {
          // 기본 분석 데이터
          result = webhookResult.output.data as AnalysisData
        }
      } else {
        // 예상과 다른 형태의 응답인 경우
        throw new Error('웹훅 응답 형식이 올바르지 않습니다.')
      }

      // 상세 분석 데이터인 경우 기본 형식으로 변환
      if (result && 'overall_description' in result) {
        const detailedResult = result as DetailedAnalysisData
        // 상세 분석을 기본 형식으로 변환 (UI 호환성을 위해)
        result = {
          items: [{
            foodName: detailedResult.food_type_and_characteristics.food_name,
            confidence: 0.95, // 기본값
            quantity: "1 인분",
            calories: parseInt(detailedResult.calorie_estimation.total_estimated_calories.split(' ')[0]),
            nutrients: {
              carbohydrates: { value: 0, unit: "g" }, // 기본값
              protein: { value: 0, unit: "g" }, // 기본값
              fat: { value: 0, unit: "g" }, // 기본값
              sugars: { value: 0, unit: "g" }, // 기본값
              sodium: { value: 0, unit: "mg" } // 기본값
            }
          }],
          summary: {
            totalCalories: parseInt(detailedResult.calorie_estimation.total_estimated_calories.split(' ')[0]),
            totalCarbohydrates: { value: 0, unit: "g" }, // 기본값
            totalProtein: { value: 0, unit: "g" }, // 기본값
            totalFat: { value: 0, unit: "g" } // 기본값
          }
        }
      }

      // 결과 유효성 검사
      if ('items' in result && result.items) {
        if (!result.items || !Array.isArray(result.items) || result.items.length === 0) {
          throw new Error('분석된 음식 정보를 찾을 수 없습니다.')
        }
        if (!result.summary) {
          throw new Error('영양 정보 요약을 찾을 수 없습니다.')
        }
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
