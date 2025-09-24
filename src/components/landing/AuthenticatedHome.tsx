'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/Providers'
import { Camera, BarChart3, Clock, TrendingUp } from 'lucide-react'

export function AuthenticatedHome() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = currentTime.getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('좋은 아침이에요')
    } else if (hour >= 12 && hour < 18) {
      setGreeting('좋은 오후에요')
    } else if (hour >= 18 && hour < 22) {
      setGreeting('좋은 저녁이에요')
    } else {
      setGreeting('안녕하세요')
    }
  }, [currentTime])

  const getCurrentMealType = () => {
    const hour = currentTime.getHours()
    if (hour >= 4 && hour < 11) return { type: '아침', emoji: '🌅', color: 'from-yellow-400 to-orange-500' }
    if (hour >= 11 && hour < 17) return { type: '점심', emoji: '☀️', color: 'from-blue-400 to-blue-600' }
    if (hour >= 17 && hour < 22) return { type: '저녁', emoji: '🌆', color: 'from-purple-500 to-pink-500' }
    return { type: '간식', emoji: '🌙', color: 'from-indigo-500 to-purple-600' }
  }

  const currentMeal = getCurrentMealType()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Welcome Section */}
      <section className="pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {greeting}, {user?.email?.split('@')[0]}님! 👋
            </h1>
            <p className="text-gray-600">
              {currentTime.toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>

          {/* Quick Action Card */}
          <div className={`bg-gradient-to-r ${currentMeal.color} rounded-3xl p-8 text-white text-center shadow-xl mb-8`}>
            <div className="text-6xl mb-4">{currentMeal.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              지금은 {currentMeal.type} 시간이에요
            </h2>
            <p className="text-lg mb-6 opacity-90">
              사진 한 장으로 간편하게 기록해보세요
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              <Camera size={24} />
              <span>식단 기록하기</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today's Meals */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">0</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">오늘의 식사</h3>
              <p className="text-gray-600 text-sm">기록된 식단</p>
            </div>

            {/* Total Calories */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">0</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">총 칼로리</h3>
              <p className="text-gray-600 text-sm">오늘 섭취량</p>
            </div>

            {/* Weekly Average */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">0</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">주간 평균</h3>
              <p className="text-gray-600 text-sm">일일 칼로리</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">빠른 실행</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Card */}
            <Link 
              href="/upload"
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">식단 기록하기</h3>
                  <p className="text-gray-600">카메라로 촬영하거나 갤러리에서 선택</p>
                </div>
              </div>
            </Link>

            {/* Dashboard Card */}
            <Link 
              href="/dashboard"
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">대시보드 보기</h3>
                  <p className="text-gray-600">식단 기록과 영양 분석 확인</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Activity Placeholder */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">최근 활동</h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              아직 기록된 식단이 없어요
            </h3>
            <p className="text-gray-600 mb-6">
              첫 번째 식단을 기록하고 AI 분석을 경험해보세요!
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Camera size={20} />
              <span>첫 식단 기록하기</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
