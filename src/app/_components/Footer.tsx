export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 섹션 */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
              AI 식단 기록
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              사진 한 장으로 완성하는 스마트한 식단 관리. 
              복잡한 입력 없이 AI가 모든 것을 자동으로 처리합니다.
            </p>
            <div className="flex space-x-4">
              <button className="group relative bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="relative z-10">지금 시작하기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* 제품 정보 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">제품</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#features" className="hover:text-white transition-colors">주요 기능</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">사용법</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">데모</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">가격 정책</a></li>
            </ul>
          </div>

          {/* 지원 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">지원</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#help" className="hover:text-white transition-colors">도움말</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">문의하기</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">자주 묻는 질문</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 AI 식단 기록. All rights reserved.
            </div>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#terms" className="hover:text-white transition-colors">이용약관</a>
              <a href="#privacy" className="hover:text-white transition-colors">개인정보처리방침</a>
              <a href="#cookies" className="hover:text-white transition-colors">쿠키 정책</a>
            </div>
          </div>
        </div>

        {/* 기술 스택 정보 */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">
              <span className="font-medium text-gray-300">Powered by:</span> Next.js · Supabase · AI Technology
            </p>
            <p>
              현재 프로토타입 버전입니다. 지속적으로 개선하고 있어요! 🚀
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
