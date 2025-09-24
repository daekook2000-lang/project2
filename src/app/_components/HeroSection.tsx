import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center w-full flex flex-col items-center">
          {/* 상단 배지 */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full text-sm text-green-700 font-medium mb-8 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            AI 기반 자동 식단 분석 시스템
          </div>
          
          {/* 메인 헤드라인 */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 text-center w-full leading-tight">
            사진 한 장으로
            <br />
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              완벽한 식단 기록
            </span>
          </h1>
          
          {/* 서브 헤드라인 */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed text-center font-light">
            복잡한 입력 없이 AI가 자동으로 음식을 분석하고 
            <br className="hidden sm:block" />
            칼로리를 계산해드립니다.
          </p>

          {/* CTA 버튼 그룹 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="group relative bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              <span className="relative z-10">무료로 시작하기</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="group px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                데모 보기
              </span>
            </button>
          </div>

          {/* 시각적 프로세스 플로우 */}
          <div className="relative max-w-4xl mx-auto w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100/50">
              {/* 프로세스 스텝 */}
              <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">사진 촬영</span>
                </div>
                
                <div className="flex-1 h-px bg-gradient-to-r from-green-300 to-blue-300 mx-4 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">AI 분석</span>
                </div>
                
                <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-purple-300 mx-4 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">완료!</span>
                </div>
              </div>
              
              {/* 설명 텍스트 */}
              <p className="text-center text-gray-600 text-sm">
                평균 <span className="font-semibold text-blue-600">3초</span> 만에 완성되는 자동 식단 기록
              </p>
            </div>
          </div>

          {/* 주요 지표 */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-200">95%</div>
              <div className="text-sm text-gray-600 font-medium">정확도</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-200">3초</div>
              <div className="text-sm text-gray-600 font-medium">분석시간</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-200">1000+</div>
              <div className="text-sm text-gray-600 font-medium">음식인식</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
