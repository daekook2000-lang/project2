export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          AI 식단 기록
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          사진 한 장으로 완성하는 혁신적인 식단 관리. 
          복잡한 입력 없이 AI가 모든 것을 자동으로 처리합니다.
        </p>
        
        <div className="flex justify-center items-center space-x-2 mb-6">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-sm">서비스 정상 운영 중</span>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="text-gray-400 text-sm">
            © 2024 AI 식단 기록. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}