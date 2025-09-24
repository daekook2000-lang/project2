'use client'

import { useState } from 'react'

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16 w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  AI 식단 기록
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 임시 로그인 모달 */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인</h2>
              <p className="text-gray-600 mb-6">
                현재 개발 중인 프로토타입입니다.
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200">
                  로그인 (임시)
                </button>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="mt-4 text-gray-500 hover:text-gray-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
