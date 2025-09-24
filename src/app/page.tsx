export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
          사진 한 장으로
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            모든 것이 끝
          </span>
        </h1>
        
        <p className="text-2xl text-gray-300 mb-16 leading-relaxed">
          복잡한 입력 없이 AI가 자동으로 모든 것을 처리합니다
        </p>

        <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-16 py-6 rounded-3xl font-bold text-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2">
          <span className="relative z-10">무료로 시작하기</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  )
}