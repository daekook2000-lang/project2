export function BenefitsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-16">
          당신이 얻게 될 
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            놀라운 변화
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="text-5xl mb-4">⚡</div>
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
              100배
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">시간 절약</h3>
            <p className="text-gray-600">기존 3-5분 → 3초로 단축</p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="text-5xl mb-4">🎯</div>
            <div className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
              95%
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">정확성 보장</h3>
            <p className="text-gray-600">AI 기반 정밀 분석</p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="text-5xl mb-4">📈</div>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              90%
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">습관 형성</h3>
            <p className="text-gray-600">귀찮음 없는 꾸준한 기록</p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="text-5xl mb-4">😌</div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              0개
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">스트레스 제로</h3>
            <p className="text-gray-600">복잡한 입력 과정 완전 제거</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            실제 사용자들의 이야기
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl mb-3">👨‍💼</div>
              <div className="flex mb-3">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-gray-700 italic mb-3">
                "매일 점심 메뉴를 일일이 입력하는 게 너무 귀찮았는데, 이제는 사진만 찍으면 끝이라 정말 편해요!"
              </p>
              <div className="font-bold text-gray-900">김민수</div>
              <div className="text-sm text-gray-600">직장인</div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl mb-3">👩‍🎓</div>
              <div className="flex mb-3">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-gray-700 italic mb-3">
                "다이어트할 때 칼로리 계산이 제일 스트레스였는데, AI가 자동으로 해주니까 부담 없이 계속 기록하게 되네요."
              </p>
              <div className="font-bold text-gray-900">박지영</div>
              <div className="text-sm text-gray-600">대학생</div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl mb-3">💪</div>
              <div className="flex mb-3">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-gray-700 italic mb-3">
                "고객들에게 추천했는데 다들 만족해해요. 특히 기존 앱들 때문에 포기했던 분들이 다시 시작하더라고요."
              </p>
              <div className="font-bold text-gray-900">이준호</div>
              <div className="text-sm text-gray-600">헬스 트레이너</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}