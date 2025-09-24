import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center w-full flex flex-col items-center">
          {/* 메인 헤드라인 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-center w-full">
            사진 한 장으로
            <br />
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              완벽한 식단 기록
            </span>
          </h1>
          
          {/* 서브 헤드라인 */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed text-center">
            복잡한 입력은 그만! AI가 자동으로 음식을 분석하고, 
            칼로리와 영양성분까지 계산해드립니다.
          </p>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full">
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              지금 시작하기
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
              데모 보기
            </button>
          </div>

          {/* 히어로 이미지/일러스트레이션 */}
          <div className="relative max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* 모바일 폰 목업 */}
                <div className="w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl mx-auto">
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                    {/* 상태바 */}
                    <div className="h-6 bg-gray-50 flex items-center justify-between px-4 text-xs text-gray-600">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                        <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
                        <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* 앱 콘텐츠 */}
                    <div className="p-4 h-full bg-gradient-to-b from-green-50 to-blue-50">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">AI 식단 기록</h3>
                        <p className="text-sm text-gray-600">사진 한 장으로 완성!</p>
                      </div>
                      
                      {/* 카메라 버튼 */}
                      <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* 최근 기록 미리보기 */}
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-200 rounded-lg"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">점심 · 방금 전</p>
                              <p className="text-xs text-gray-500">김치찌개, 밥 · 650kcal</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm opacity-75">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-200 rounded-lg"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">아침 · 3시간 전</p>
                              <p className="text-xs text-gray-500">토스트, 커피 · 320kcal</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 플로팅 요소들 */}
                <div className="absolute top-4 left-4 bg-white rounded-xl p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">AI 분석 중...</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-white rounded-xl p-3 shadow-lg">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">1,240</p>
                    <p className="text-xs text-gray-500">오늘 칼로리</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 신뢰도 지표 */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500 w-full">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">95% 정확도</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">3초 내 분석</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">1000+ 음식 인식</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
