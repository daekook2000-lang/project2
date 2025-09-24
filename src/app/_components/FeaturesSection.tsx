export function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "원클릭 식단 기록",
      description: "사진 한 장으로 모든 분석이 자동으로 시작됩니다. 복잡한 입력은 필요 없어요!"
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI 스마트 분석",
      description: "95% 정확도로 음식을 인식하고 칼로리와 영양성분을 자동 계산합니다."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "자동 분류 & 저장",
      description: "시간대별로 끼니를 자동 분류하고 깔끔한 대시보드에 저장됩니다."
    }
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50 w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* 섹션 헤더 */}
        <div className="text-center mb-20 w-full flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            핵심 기능
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            왜 <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">AI 식단 기록</span>일까요?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            복잡한 식단 관리를 단순화한 3가지 핵심 기능으로 
            <br className="hidden sm:block" />
            누구나 쉽게 건강한 식단을 관리할 수 있습니다
          </p>
        </div>

        {/* 기능 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
            >
              {/* 배경 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* 콘텐츠 */}
              <div className="relative z-10 text-center">
                {/* 아이콘 */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 text-white mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                
                {/* 제목 */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-200">
                  {feature.title}
                </h3>
                
                {/* 설명 */}
                <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-200">
                  {feature.description}
                </p>
              </div>
              
              {/* 장식 요소 */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* 통계 및 CTA */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">10,000+</div>
                <div className="text-gray-600">기록된 식단</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-gray-600">활성 사용자</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">4.8★</div>
                <div className="text-gray-600">사용자 만족도</div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-8">
              <p className="text-lg text-gray-600 mb-6">
                이미 많은 사용자들이 AI 식단 기록으로 건강한 습관을 만들고 있어요
              </p>
              <button className="group relative bg-gradient-to-r from-green-600 to-blue-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <span className="relative z-10">무료로 시작하기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
