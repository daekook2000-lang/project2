export function SolutionSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="text-6xl mb-8">💡</div>
        <h2 className="text-5xl font-bold mb-8">
          그래서 우리는 
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            모든 것을 없앴습니다
          </span>
        </h2>
        <p className="text-2xl text-gray-300 mb-16">
          사용자가 해야 할 일은 단 하나. 사진을 찍는 것뿐입니다.
        </p>

        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-3xl p-12 border border-yellow-400/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="text-center">
              <div className="text-4xl mb-4">😵‍💫</div>
              <h3 className="text-2xl font-bold text-red-300 mb-4">기존 방식</h3>
              <p className="text-gray-300">5단계 복잡한 과정</p>
              <p className="text-red-300 font-bold">3-5분 소요</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-green-300 mb-4">우리 방식</h3>
              <p className="text-gray-300">사진 찍기 단 1단계</p>
              <p className="text-green-300 font-bold">3초 완료</p>
            </div>
          </div>
          
          <h3 className="text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              마찰 없는 기록
            </span>
          </h3>
          <p className="text-xl text-gray-300">
            AI가 모든 복잡한 과정을 자동으로 처리합니다
          </p>
        </div>
      </div>
    </section>
  )
}
