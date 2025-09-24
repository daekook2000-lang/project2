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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16 w-full flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">3단계</span>로 끝나는 
            <br />간단한 식단 기록
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            복잡한 과정은 모두 AI가 처리합니다. 사용자는 단 하나의 액션만 하면 돼요!
          </p>
        </div>

        {/* 스텝 카드들 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 w-full max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* 연결선 (데스크탑에서만) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform -translate-y-1/2 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* 스텝 카드 */}
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative z-10 group hover:-translate-y-2">
                {/* 스텝 번호 */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.number}
                  </div>
                </div>

                {/* 아이콘 */}
                <div className={`flex justify-center mb-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-300`}>
                  {step.icon}
                </div>

                {/* 콘텐츠 */}
                <div className="text-center">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* 장식적 배경 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* 시간 타임라인 */}
        <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
          <h3 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8">
            시간대별 자동 분류 시스템
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { time: "04:00 - 10:59", meal: "아침", icon: "🌅", color: "from-yellow-400 to-orange-500" },
              { time: "11:00 - 16:59", meal: "점심", icon: "☀️", color: "from-orange-400 to-red-500" },
              { time: "17:00 - 21:59", meal: "저녁", icon: "🌆", color: "from-purple-400 to-pink-500" },
              { time: "22:00 - 03:59", meal: "간식", icon: "🌙", color: "from-blue-400 to-indigo-500" }
            ].map((period, index) => (
              <div key={index} className="text-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${period.color} flex items-center justify-center text-2xl`}>
                  {period.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{period.meal}</h4>
                <p className="text-sm text-gray-600">{period.time}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">업로드 시간</span>을 기준으로 끼니를 자동 판별합니다. 
              별도의 선택이나 입력은 필요하지 않아요!
            </p>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            정말 이렇게 간단할까요? 직접 체험해보세요!
          </h3>
          <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            지금 바로 시작하기
          </button>
        </div>
      </div>
    </section>
  )
}
