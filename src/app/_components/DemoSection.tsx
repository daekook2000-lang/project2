export function DemoSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-16">
          실제로 어떻게 
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            작동하는지
          </span> 보세요
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8">
            <div className="text-5xl mb-4">📷</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">1. 사진 촬영</h3>
            <p className="text-gray-600">음식 사진을 찍거나 선택합니다</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">2. AI 분석</h3>
            <p className="text-gray-600">AI가 자동으로 음식을 인식합니다</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">3. 완료!</h3>
            <p className="text-gray-600">자동으로 분류되어 저장됩니다</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-purple-900 text-white rounded-3xl p-12">
          <h3 className="text-3xl font-bold mb-6">
            이 모든 과정이 <span className="text-yellow-400">3초</span> 안에 끝납니다
          </h3>
          <p className="text-xl text-gray-300">
            사진 선택부터 데이터베이스 저장까지, 모든 복잡한 과정을 AI가 자동으로 처리합니다.
          </p>
        </div>
      </div>
    </section>
  )
}