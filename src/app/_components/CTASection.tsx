'use client'

import { useState } from 'react'

export function CTASection() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 실제 이메일 수집 로직
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="mb-16">
          <div className="text-6xl mb-8">🚀</div>
          <h2 className="text-5xl sm:text-6xl font-bold mb-8 leading-tight">
            복잡한 식단 기록은
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              이제 그만!
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            사진 한 장으로 시작하는 혁신적인 식단 관리를 
            <br className="hidden sm:block" />
            지금 바로 경험해보세요
          </p>
        </div>

        {/* 주요 혜택 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-bold mb-2">3초 완료</h3>
            <p className="text-gray-300">기존 3-5분 → 3초로 단축</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-bold mb-2">95% 정확도</h3>
            <p className="text-gray-300">AI 기반 정밀 분석</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-3">😌</div>
            <h3 className="text-xl font-bold mb-2">스트레스 제로</h3>
            <p className="text-gray-300">복잡한 입력 과정 완전 제거</p>
          </div>
        </div>

        {/* 메인 CTA */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 mb-16">
          <h3 className="text-3xl font-bold mb-8">
            베타 테스터 모집 중! 
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              무료 체험
            </span>
          </h3>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-1"
                >
                  <span className="relative z-10">무료 체험 신청</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
              
              <p className="text-sm text-gray-400">
                * 베타 기간 중 완전 무료로 모든 기능을 사용할 수 있습니다
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 mb-6">
                <div className="text-4xl mb-3">✅</div>
                <h4 className="text-xl font-bold text-green-300 mb-2">
                  신청 완료!
                </h4>
                <p className="text-green-200">
                  베타 출시 소식을 가장 먼저 받아보실 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 추가 CTA 옵션 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button className="group flex items-center text-white font-semibold text-lg hover:text-gray-300 transition-colors duration-300">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            2분 데모 영상 보기
          </button>

          <button className="group flex items-center text-white font-semibold text-lg hover:text-gray-300 transition-colors duration-300">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            자주 묻는 질문
          </button>
        </div>

        {/* 사회적 증명 */}
        <div className="border-t border-white/20 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
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

        {/* 마지막 메시지 */}
        <div className="mt-16">
          <p className="text-xl text-gray-300 mb-4">
            건강한 식습관, 더 이상 미루지 마세요
          </p>
          <p className="text-lg text-gray-400">
            복잡함 없는 식단 기록으로 새로운 시작을 해보세요 ✨
          </p>
        </div>
      </div>
    </section>
  )
}
