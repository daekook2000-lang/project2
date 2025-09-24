export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="text-6xl mb-8">🚀</div>
        <h2 className="text-6xl font-bold mb-8 leading-tight">
          복잡한 식단 기록은
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            이제 그만!
          </span>
        </h2>
        <p className="text-2xl text-gray-300 mb-16 leading-relaxed">
          사진 한 장으로 시작하는 혁신적인 식단 관리를 지금 바로 경험해보세요
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 mb-16">
          <h3 className="text-3xl font-bold mb-8">
            베타 테스터 모집 중! 
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              무료 체험
            </span>
          </h3>
          
          <button className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-2 mb-6">
            <span className="relative z-10">무료 체험 신청</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <p className="text-sm text-gray-400">
            * 베타 기간 중 완전 무료로 모든 기능을 사용할 수 있습니다
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
            <div className="text-gray-400">베타 테스터</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">10,000+</div>
            <div className="text-gray-400">분석된 식단</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
            <div className="text-gray-400">사용자 만족도</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">4.8★</div>
            <div className="text-gray-400">평균 평점</div>
          </div>
        </div>
      </div>
    </section>
  )
}