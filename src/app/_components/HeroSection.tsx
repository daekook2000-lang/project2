import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center w-full flex flex-col items-center">
          {/* 메인 헤드라인 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-center w-full">
            사진 한 장으로
            <br />
            <span className="text-green-600">완벽한 식단 기록</span>
          </h1>
          
          {/* 서브 헤드라인 */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed text-center">
            복잡한 입력 없이 AI가 자동으로 음식을 분석하고 칼로리를 계산해드립니다.
          </p>

          {/* 단일 CTA 버튼 */}
          <button className="bg-green-600 text-white px-12 py-4 rounded-full font-semibold text-xl hover:bg-green-700 transition-colors duration-200 shadow-lg mb-16">
            무료로 시작하기
          </button>

          {/* 간단한 시각적 요소 */}
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center">
                {/* 카메라 아이콘 */}
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                {/* 간단한 프로세스 */}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <span className="bg-green-50 px-4 py-2 rounded-full">사진 촬영</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="bg-blue-50 px-4 py-2 rounded-full">AI 분석</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="bg-purple-50 px-4 py-2 rounded-full">완료!</span>
                </div>
              </div>
            </div>
          </div>

          {/* 간단한 통계 */}
          <div className="mt-12 flex justify-center items-center space-x-8 text-gray-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm">정확도</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3초</div>
              <div className="text-sm">분석시간</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1000+</div>
              <div className="text-sm">음식인식</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
