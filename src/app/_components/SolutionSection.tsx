export function SolutionSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="text-6xl mb-8">💡</div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            그래서 우리는 
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              모든 것을 없앴습니다
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            사용자가 해야 할 일은 단 하나. 사진을 찍는 것뿐입니다.
          </p>
        </div>

        {/* Before vs After */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto mb-20">
          {/* Before */}
          <div className="bg-red-900/30 rounded-3xl p-8 border-2 border-red-500/30">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">😵‍💫</div>
              <h3 className="text-2xl font-bold text-red-300 mb-4">기존 방식</h3>
            </div>
            
            <div className="space-y-4">
              {[
                "1. 음식 이름 검색하기",
                "2. 정확한 양 입력하기", 
                "3. 끼니 시간 선택하기",
                "4. 칼로리 계산 확인하기",
                "5. 저장 버튼 누르기"
              ].map((step, index) => (
                <div key={index} className="flex items-center p-3 bg-red-800/20 rounded-xl">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    {index + 1}
                  </div>
                  <span className="text-red-200">{step}</span>
                  <div className="ml-auto text-red-400">😤</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-red-500/20 rounded-full">
                <span className="text-red-300 font-bold">총 소요시간: 3-5분</span>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="bg-green-900/30 rounded-3xl p-8 border-2 border-green-500/30 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              NEW!
            </div>
            
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-green-300 mb-4">우리의 방식</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-6 bg-green-800/20 rounded-xl border-2 border-green-400/30">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
                  1
                </div>
                <div className="flex-1">
                  <span className="text-green-200 text-lg font-semibold">사진 찍기</span>
                  <div className="text-green-400 text-sm mt-1">그게 다입니다! 🎉</div>
                </div>
                <div className="text-2xl">😊</div>
              </div>
              
              {/* AI가 자동으로 처리하는 것들 */}
              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                <div className="text-blue-300 font-semibold mb-3 text-center">
                  <span className="text-blue-400">AI가 자동으로 처리</span> ⚡
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {[
                    "음식 인식 및 이름 추출",
                    "양과 칼로리 자동 계산", 
                    "시간 기반 끼니 자동 분류",
                    "영양성분 분석 및 저장"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center text-blue-200">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-500/20 rounded-full">
                <span className="text-green-300 font-bold">총 소요시간: 3초</span>
              </div>
            </div>
          </div>
        </div>

        {/* 핵심 가치 */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-3xl p-12 border border-yellow-400/20">
            <h3 className="text-3xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                마찰 없는 기록(Frictionless Logging)
              </span>
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              사용자의 행동을 최소화하고, AI가 모든 복잡한 과정을 대신 처리합니다. 
              <br />
              이것이 우리가 추구하는 식단 기록의 미래입니다.
            </p>
            
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">100배</div>
                <div className="text-gray-400 text-sm">더 빠른 기록</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">0개</div>
                <div className="text-gray-400 text-sm">사용자 입력</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">95%</div>
                <div className="text-gray-400 text-sm">정확도</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
