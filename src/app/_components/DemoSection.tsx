'use client'

import { useState } from 'react'

export function DemoSection() {
  const [activeDemo, setActiveDemo] = useState(0)
  
  const demoSteps = [
    {
      title: "사진 업로드",
      description: "음식 사진을 선택하거나 촬영합니다",
      image: "upload",
      content: (
        <div className="bg-gray-100 rounded-2xl p-6 h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">사진을 선택해주세요</h4>
            <p className="text-gray-600 text-sm">카메라로 촬영하거나 갤러리에서 선택</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button className="px-4 py-2 bg-white rounded-lg shadow text-sm font-medium text-gray-700 hover:bg-gray-50">
                📷 촬영하기
              </button>
              <button className="px-4 py-2 bg-white rounded-lg shadow text-sm font-medium text-gray-700 hover:bg-gray-50">
                🖼️ 갤러리
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "AI 분석 중",
      description: "AI가 음식을 인식하고 분석하고 있습니다",
      image: "analyzing",
      content: (
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-32 h-24 bg-orange-200 rounded-lg mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-2 bg-orange-300 rounded"></div>
                <div className="absolute bottom-2 left-2 right-2 h-2 bg-orange-400 rounded"></div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">AI 분석 중...</h4>
            <p className="text-gray-600 text-sm mb-4">음식을 인식하고 영양성분을 계산하고 있어요</p>
            <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "분석 완료!",
      description: "결과를 확인하고 대시보드에 자동 저장됩니다",
      image: "result",
      content: (
        <div className="bg-white rounded-2xl p-6 h-80 overflow-y-auto">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">분석 완료!</h4>
            <p className="text-sm text-gray-600 mb-4">점심 · 방금 전</p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">김치찌개</span>
                <span className="text-sm text-gray-600">450kcal</span>
              </div>
              <p className="text-xs text-gray-500">1인분 (400g) · 95% 신뢰도</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">현미밥</span>
                <span className="text-sm text-gray-600">310kcal</span>
              </div>
              <p className="text-xs text-gray-500">1공기 (210g) · 98% 신뢰도</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">계란말이</span>
                <span className="text-sm text-gray-600">280kcal</span>
              </div>
              <p className="text-xs text-gray-500">1접시 (150g) · 92% 신뢰도</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center font-bold">
              <span className="text-gray-800">총 칼로리</span>
              <span className="text-green-600 text-lg">1,040kcal</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 to-white w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* 섹션 헤더 */}
        <div className="text-center mb-20 w-full flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            라이브 데모
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            실제 사용 모습을 
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"> 미리보기</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto font-light">
            복잡한 설명보다는 직접 보는 것이 더 확실하죠. 
            <br className="hidden sm:block" />
            실제 앱 화면을 체험해보세요!
          </p>
        </div>

        {/* 데모 인터페이스 */}
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex justify-center">
            {/* 모바일 프레임 */}
            <div className="relative">
              {/* 폰 외곽 프레임 */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                {/* 화면 영역 */}
                <div className="bg-black rounded-[2.5rem] p-1">
                  <div className="bg-white rounded-[2rem] overflow-hidden w-80 h-[600px] relative">
                    {/* 노치 */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
                    
                    {/* 상태바 */}
                    <div className="h-12 bg-white flex items-center justify-between px-6 pt-6 text-sm text-gray-800 font-medium relative z-10">
                      <span>9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                        </div>
                        <div className="w-6 h-3 border-2 border-gray-800 rounded-sm relative ml-2">
                          <div className="absolute right-[-2px] top-1/2 transform -translate-y-1/2 w-1 h-1 bg-gray-800 rounded-full"></div>
                          <div className="w-full h-full bg-green-500 rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* 앱 헤더 */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4">
                      <h3 className="text-lg font-bold text-center">AI 식단 기록</h3>
                    </div>

                    {/* 데모 콘텐츠 */}
                    <div className="p-6 h-[480px] overflow-hidden">
                      {demoSteps[activeDemo].content}
                    </div>

                    {/* 하단 홈 인디케이터 */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 단계 네비게이션 */}
          <div className="mt-12 text-center">
            <div className="flex justify-center space-x-3 mb-6">
              {demoSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDemo(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === activeDemo 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {demoSteps[activeDemo].title}
              </h4>
              <p className="text-gray-600">
                {demoSteps[activeDemo].description}
              </p>
            </div>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setActiveDemo(Math.max(0, activeDemo - 1))}
              disabled={activeDemo === 0}
              className="group px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                이전
              </span>
            </button>
            <button
              onClick={() => setActiveDemo((activeDemo + 1) % demoSteps.length)}
              className="group px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center">
                다음
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">평균 3초</h3>
            <p className="text-gray-600 text-lg group-hover:text-gray-700">업로드부터 결과 확인까지 걸리는 시간</p>
          </div>
          
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">95% 정확도</h3>
            <p className="text-gray-600 text-lg group-hover:text-gray-700">AI 음식 인식 및 칼로리 계산 정확도</p>
          </div>
          
          <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">24시간</h3>
            <p className="text-gray-600 text-lg group-hover:text-gray-700">언제든지 식단을 기록할 수 있어요</p>
          </div>
        </div>

        {/* 최종 CTA */}
        <div className="mt-24 text-center">
          <div className="relative bg-gradient-to-br from-green-50 via-blue-50/50 to-purple-50/30 rounded-[3rem] p-12 lg:p-16 overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                이제 복잡한 식단 기록은 안녕! 
                <span className="inline-block animate-bounce">👋</span>
              </h3>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto font-light">
                사진 한 장으로 시작하는 스마트한 식단 관리. 
                <br className="hidden sm:block" />
                지금 바로 시작해서 더 건강한 습관을 만들어보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group relative bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2">
                  <span className="relative z-10 flex items-center">
                    무료로 시작하기
                    <span className="ml-2 text-2xl group-hover:animate-pulse">🚀</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <p className="text-sm text-gray-500 font-medium">
                  ⭐ 이미 500+명이 사용 중
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
