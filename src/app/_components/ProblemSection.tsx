export function ProblemSection() {
  const problems = [
    {
      title: "매번 음식명 검색하기",
      description: "메뉴 이름을 일일이 찾아서 입력하는 번거로움",
      icon: "🔍",
      pain: "😤"
    },
    {
      title: "복잡한 양 계산하기", 
      description: "그램 단위로 정확히 측정하고 입력해야 하는 스트레스",
      icon: "⚖️",
      pain: "😰"
    },
    {
      title: "끼니 시간 선택하기",
      description: "아침, 점심, 저녁, 간식 중 매번 선택해야 하는 귀찮음",
      icon: "⏰", 
      pain: "😑"
    },
    {
      title: "결국 포기하기",
      description: "며칠 못 가서 귀찮아서 그만두는 악순환",
      icon: "❌",
      pain: "😞"
    }
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            식단 기록, 왜 이렇게 
            <span className="text-red-600">귀찮을까요?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            건강한 식습관을 원하지만, 복잡한 기록 과정 때문에 포기했던 경험이 있으신가요?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div key={index} className="group relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-red-200">
                <div className="text-center">
                  {/* 아이콘과 감정 */}
                  <div className="relative mb-6">
                    <div className="text-5xl mb-2">{problem.icon}</div>
                    <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                      {problem.pain}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                {/* 호버 시 나타나는 강조 효과 */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          ))}
        </div>

        {/* 결론 */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-12 max-w-4xl mx-auto border-2 border-red-100">
            <div className="text-6xl mb-6">🤯</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              결국 며칠 못 가서 포기하게 됩니다
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              복잡한 과정 때문에 건강한 습관을 만들기도 전에 지쳐버리죠.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg">
              <span className="text-red-600 font-bold mr-2">문제:</span>
              <span className="text-gray-800">입력해야 할 것이 너무 많다</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
