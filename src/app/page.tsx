export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center px-8 py-12 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto text-center space-y-12">
        {/* 메인 헤드라인 */}
        <div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            사진 한 장으로
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              모든 것이 끝
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            복잡한 입력 없이 AI가 자동으로 모든 것을 처리합니다
          </p>
        </div>

        {/* 핵심 기능 소개 */}
        <div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-5xl">📷</div>
              <div className="text-3xl text-white/70">→</div>
              <div className="text-5xl">🤖</div>
              <div className="text-3xl text-white/70">→</div>
              <div className="text-5xl">📊</div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                사진 한 장으로 칼로리 자동 계산
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                음식 사진을 찍으면 AI가 음식을 인식하고 칼로리를 자동으로 계산해드립니다
              </p>
            </div>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div>
          <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-16 py-6 rounded-3xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2">
            <span className="relative z-10">무료로 시작하기</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  )
}