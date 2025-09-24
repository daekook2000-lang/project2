'use client'

import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI 식단 기록
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <a href="#problem" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">
                문제점
              </a>
              <a href="#solution" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">
                해결책
              </a>
              <a href="#demo" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">
                데모
              </a>
              <a href="#benefits" className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">
                혜택
              </a>
            </nav>
            
            <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="relative z-10">무료 체험</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-200">
            <a href="#problem" className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium">
              문제점
            </a>
            <a href="#solution" className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium">
              해결책
            </a>
            <a href="#demo" className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium">
              데모
            </a>
            <a href="#benefits" className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium">
              혜택
            </a>
            <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold">
              무료 체험
            </button>
          </div>
        </div>
      )}
    </header>
  )
}