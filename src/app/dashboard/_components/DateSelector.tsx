'use client'

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(prevDay.getDate() - 1)
    onDateChange(prevDay)
  }

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    onDateChange(nextDay)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isFutureDate = (date: Date) => {
    const today = new Date()
    return date > today
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <button 
          onClick={goToPreviousDay}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="이전 날"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <div className="text-center flex-1">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Calendar size={18} className="text-blue-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              {selectedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short'
              })}
            </h2>
          </div>
          
          {isToday(selectedDate) ? (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              오늘
            </span>
          ) : (
            <button
              onClick={goToToday}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              오늘로 이동
            </button>
          )}
        </div>

        <button 
          onClick={goToNextDay}
          disabled={isToday(selectedDate)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="다음 날"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  )
}
