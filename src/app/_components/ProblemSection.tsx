export function ProblemSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-8">
          식단 기록, 왜 이렇게 
          <span className="text-red-600">귀찮을까요?</span>
        </h2>
        
        <div className="bg-white rounded-3xl p-12 shadow-xl">
          <div className="text-6xl mb-6">🤯</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            복잡한 과정 때문에 결국 포기하게 됩니다
          </h3>
          <div className="text-xl text-gray-600 space-y-3">
            <p>🔍 매번 음식명 검색하기</p>
            <p>⚖️ 복잡한 양 계산하기</p>
            <p>⏰ 끼니 시간 선택하기</p>
            <p>❌ 결국 포기하기</p>
          </div>
        </div>
      </div>
    </section>
  )
}
