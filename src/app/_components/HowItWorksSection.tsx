export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "사진 촬영 또는 선택",
      description: "음식 사진을 촬영하거나 갤러리에서 선택하세요. 어떤 각도든 상관없어요!",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-green-500 to-emerald-600"
    },
    {
      number: "02",
      title: "AI 자동 분석",
      description: "업로드와 동시에 AI가 음식을 인식하고 칼로리, 영양성분을 계산합니다. 평균 3초 소요!",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-600"
    },
    {
      number: "03",
      title: "완료! 결과 확인",
      description: "자동으로 끼니가 분류되고 대시보드에 저장됩니다. 추가 입력은 필요 없어요!",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-purple-500 to-pink-600"
    }
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* 섹션 헤더 */}
        <div className="text-center mb-20 w-full flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            사용법
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">3단계</span>로 끝나는 간단한 식단 기록
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            복잡한 과정은 모두 AI가 처리합니다. 
            <br className="hidden sm:block" />
            사용자는 사진만 찍으면 끝!
          </p>
        </div>

        {/* 스텝 카드들 */}
        <div className="relative max-w-6xl mx-auto">
          {/* 연결선 */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="group text-center">
                {/* 카드 */}
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 group-hover:scale-105">
                  {/* 스텝 번호 */}
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white flex items-center justify-center text-xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      {step.number}
                    </div>
                  </div>

                  {/* 아이콘 */}
                  <div className="flex justify-center mb-6 text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                    {step.icon}
                  </div>

                  {/* 콘텐츠 */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-200">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 자동 분류 설명 */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                스마트 자동 분류 시스템
              </h3>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">업로드 시간</span>을 기준으로 끼니를 자동 판별합니다
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                <div className="text-2xl mb-2">🌅</div>
                <div className="font-semibold text-orange-700 mb-1">아침</div>
                <div className="text-sm text-orange-600">04-10시</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="text-2xl mb-2">☀️</div>
                <div className="font-semibold text-blue-700 mb-1">점심</div>
                <div className="text-sm text-blue-600">11-16시</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                <div className="text-2xl mb-2">🌙</div>
                <div className="font-semibold text-purple-700 mb-1">저녁</div>
                <div className="text-sm text-purple-600">17-21시</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <div className="text-2xl mb-2">🍪</div>
                <div className="font-semibold text-gray-700 mb-1">간식</div>
                <div className="text-sm text-gray-600">22-03시</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
