export function BenefitsSection() {
  const benefits = [
    {
      title: "시간 절약",
      description: "기존 3-5분 → 3초로 단축",
      value: "100배",
      unit: "빨라짐",
      icon: "⚡",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50"
    },
    {
      title: "정확성 보장", 
      description: "AI 기반 정밀 분석",
      value: "95%",
      unit: "정확도",
      icon: "🎯",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      title: "습관 형성",
      description: "귀찮음 없는 꾸준한 기록",
      value: "90%",
      unit: "지속률",
      icon: "📈",
      color: "from-blue-500 to-cyan-500", 
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      title: "스트레스 제로",
      description: "복잡한 입력 과정 완전 제거",
      value: "0개",
      unit: "사용자 입력",
      icon: "😌",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    }
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            당신이 얻게 될 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              놀라운 변화
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            마찰 없는 식단 기록으로 건강한 습관을 만들어보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="group relative">
              <div className={`bg-gradient-to-br ${benefit.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 border-2 border-transparent hover:border-white`}>
                <div className="text-center">
                  <div className="text-5xl mb-6">{benefit.icon}</div>
                  
                  <div className="mb-6">
                    <div className={`text-4xl font-black bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent mb-2`}>
                      {benefit.value}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      {benefit.unit}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>

                {/* 호버 시 글로우 효과 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* 사용자 후기 섹션 */}
        <div className="bg-white rounded-3xl p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              실제 사용자들의 이야기
            </h3>
            <p className="text-lg text-gray-600">
              복잡한 기록 과정 때문에 포기했던 분들이 이제는 꾸준히 기록하고 있어요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "김민수",
                role: "직장인",
                comment: "매일 점심 메뉴를 일일이 입력하는 게 너무 귀찮았는데, 이제는 사진만 찍으면 끝이라 정말 편해요!",
                rating: 5,
                avatar: "👨‍💼"
              },
              {
                name: "박지영", 
                role: "대학생",
                comment: "다이어트할 때 칼로리 계산이 제일 스트레스였는데, AI가 자동으로 해주니까 부담 없이 계속 기록하게 되네요.",
                rating: 5,
                avatar: "👩‍🎓"
              },
              {
                name: "이준호",
                role: "헬스 트레이너", 
                comment: "고객들에게 추천했는데 다들 만족해해요. 특히 기존 앱들 때문에 포기했던 분들이 다시 시작하더라고요.",
                rating: 5,
                avatar: "💪"
              }
            ].map((review, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{review.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.role}</div>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {Array.from({length: review.rating}).map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                
                <p className="text-gray-700 italic">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 비교 차트 */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-gray-900 to-purple-900 text-white rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-center mb-12">
              기존 앱 vs AI 식단 기록
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  metric: "평균 기록 시간",
                  existing: "3-5분",
                  ours: "3초",
                  improvement: "100배 빠름"
                },
                {
                  metric: "사용자 입력 수",
                  existing: "5-7개",
                  ours: "0개", 
                  improvement: "완전 자동화"
                },
                {
                  metric: "3개월 지속률",
                  existing: "15%",
                  ours: "90%",
                  improvement: "6배 높음"
                }
              ].map((comparison, index) => (
                <div key={index} className="text-center">
                  <h4 className="text-lg font-semibold mb-6 text-gray-300">
                    {comparison.metric}
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
                      <div className="text-red-300 text-sm mb-1">기존 앱</div>
                      <div className="text-2xl font-bold text-red-400">
                        {comparison.existing}
                      </div>
                    </div>
                    
                    <div className="text-yellow-400 font-bold">VS</div>
                    
                    <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
                      <div className="text-green-300 text-sm mb-1">우리 앱</div>
                      <div className="text-2xl font-bold text-green-400">
                        {comparison.ours}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-yellow-400 font-semibold text-sm">
                    {comparison.improvement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
