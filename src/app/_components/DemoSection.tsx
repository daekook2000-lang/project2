'use client'

import { useState, useEffect } from 'react'

export function DemoSection() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const demoSteps = [
    {
      title: "사진 촬영",
      description: "음식 사진을 찍거나 선택합니다",
      content: (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-3">사진을 촬영하세요</h4>
            <p className="text-gray-600">카메라 버튼을 터치하면 바로 시작!</p>
          </div>
        </div>
      )
    },
    {
      title: "AI 분석 중",
      description: "AI가 음식을 인식하고 분석합니다",
      content: (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-32 h-24 bg-gradient-to-r from-orange-300 to-red-300 rounded-2xl mx-auto relative overflow-hidden">
                <div className="absolute inset-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl"></div>
                <div className="absolute bottom-2 left-2 right-2 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-spin">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-3">AI 분석 중...</h4>
            <p className="text-gray-600 mb-4">음식 인식 및 영양성분 계산</p>
            <div className="w-48 bg-gray-200 rounded-full h-3 mx-auto">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "완료!",
      description: "자동으로 분류되어 저장됩니다",
      content: (
        <div className="h-full bg-gradient-to-br from-green-50 to-blue-50 p-6 overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800">분석 완료!</h4>
            <p className="text-sm text-gray-600 mb-4">점심 · 방금 전 · 자동 분류됨</p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">🍛 김치찌개</span>
                <span className="text-green-600 font-bold">450kcal</span>
              </div>
              <p className="text-xs text-gray-500">1인분 (400g) · 95% 정확도</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">🍚 현미밥</span>
                <span className="text-green-600 font-bold">310kcal</span>
              </div>
              <p className="text-xs text-gray-500">1공기 (210g) · 98% 정확도</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">🥚 계란말이</span>
                <span className="text-green-600 font-bold">280kcal</span>
              </div>
              <p className="text-xs text-gray-500">1접시 (150g) · 92% 정확도</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center font-bold">
              <span className="text-gray-800">총 칼로리</span>
              <span className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">1,040kcal</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            실제로 어떻게 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              작동하는지
            </span> 보세요
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            3단계 자동 프로세스를 실시간으로 체험해보세요
          </p>
          
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                isPlaying 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isPlaying ? '일시정지' : '재생'}
            </button>
            <div className="text-sm text-gray-500">
              자동 재생 데모
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            {/* 실제 폰 프레임 */}
            <div className="bg-gradient-to-b from-gray-800 to-black rounded-[3rem] p-3 shadow-2xl">
              <div className="bg-black rounded-[2.5rem] p-1">
                <div className="bg-white rounded-[2rem] w-80 h-[600px] relative overflow-hidden">
                  {/* 상태바 */}
                  <div className="h-12 bg-white flex items-center justify-between px-6 pt-6 text-sm text-gray-800 relative z-10">
                    <span className="font-medium">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                      </div>
                      <div className="w-6 h-3 border-2 border-gray-800 rounded-sm relative ml-2">
                        <div className="w-full h-full bg-green-500 rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* 앱 헤더 */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
                    <h3 className="text-lg font-bold text-center">AI 식단 기록</h3>
                  </div>

                  {/* 데모 콘텐츠 */}
                  <div className="h-[480px]">
                    {demoSteps[currentStep].content}
                  </div>

                  {/* 하단 홈 인디케이터 */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* 플로팅 정보 */}
            <div className="absolute -left-8 top-1/3 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
              단계 {currentStep + 1}/3
            </div>
            <div className="absolute -right-8 bottom-1/3 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
              자동 처리
            </div>
          </div>
        </div>

        {/* 단계 설명 */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {demoSteps[currentStep].title}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {demoSteps[currentStep].description}
            </p>
            
            {/* 진행률 표시 */}
            <div className="flex justify-center space-x-2">
              {demoSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 핵심 메시지 */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-purple-900 text-white rounded-3xl p-12">
            <h3 className="text-3xl font-bold mb-6">
              이 모든 과정이 <span className="text-yellow-400">3초</span> 안에 끝납니다
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              사진 선택부터 데이터베이스 저장까지, 
              <br />
              모든 복잡한 과정을 AI가 자동으로 처리합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}