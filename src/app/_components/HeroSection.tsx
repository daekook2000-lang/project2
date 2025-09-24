'use client'

import { useState, useEffect } from 'react'

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)
  
  const foodImages = [
    { name: '김치찌개', calories: '450kcal', emoji: '🥘' },
    { name: '비빔밥', calories: '520kcal', emoji: '🍚' },
    { name: '삼겹살', calories: '680kcal', emoji: '🥓' },
    { name: '파스타', calories: '420kcal', emoji: '🍝' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % foodImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            마찰 없는 식단 기록의 혁신
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight">
            사진 한 장으로
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              모든 것이 끝
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            복잡한 입력, 번거로운 선택은 이제 그만. 
            <br className="hidden sm:block" />
            AI가 자동으로 음식을 인식하고, 끼니를 분류하고, 칼로리를 계산합니다.
          </p>
        </div>

        {/* 인터랙티브 데모 */}
        <div className="mb-16">
          <div className="relative max-w-md mx-auto">
            {/* 폰 프레임 */}
            <div className="bg-gray-900 rounded-[3rem] p-4 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="bg-black rounded-[2.5rem] p-1">
                <div className="bg-white rounded-[2rem] h-96 relative overflow-hidden">
                  {/* 앱 헤더 */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                    <h3 className="font-bold text-center">AI 식단 기록</h3>
                  </div>
                  
                  {/* 메인 콘텐츠 */}
                  <div className="p-6 flex flex-col items-center justify-center h-full">
                    <div className="text-6xl mb-4 animate-bounce">
                      {foodImages[currentImage].emoji}
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {foodImages[currentImage].name}
                    </h4>
                    <p className="text-purple-600 font-semibold mb-6">
                      {foodImages[currentImage].calories}
                    </p>
                    
                    {/* 진행률 바 */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{width: '85%'}}></div>
                    </div>
                    <p className="text-sm text-gray-600">AI 분석 완료!</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 플로팅 요소들 */}
            <div className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              3초 완료
            </div>
            <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              95% 정확도
            </div>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2">
            <span className="relative z-10 flex items-center">
              지금 바로 시작하기
              <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button className="group flex items-center text-white font-semibold text-lg hover:text-gray-300 transition-colors duration-300">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            2분 데모 보기
          </button>
        </div>

        {/* 통계 */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10,000+</div>
            <div className="text-gray-400">분석된 식단</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">3초</div>
            <div className="text-gray-400">평균 처리시간</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-gray-400">인식 정확도</div>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}