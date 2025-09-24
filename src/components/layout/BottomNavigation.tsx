'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Camera, User, BarChart3 } from 'lucide-react'
import { useAuth } from '@/components/providers/Providers'

export function BottomNavigation() {
  const { user } = useAuth()
  const pathname = usePathname()

  // 로그인하지 않은 사용자나 특정 페이지에서는 하단 네비게이션을 숨김
  if (!user || pathname?.startsWith('/auth')) return null

  const navItems = [
    { 
      href: '/dashboard', 
      icon: Home, 
      label: '홈',
      isActive: pathname === '/dashboard'
    },
    { 
      href: '/upload', 
      icon: Camera, 
      label: '기록',
      isActive: pathname === '/upload',
      isMain: true
    },
    { 
      href: '/stats', 
      icon: BarChart3, 
      label: '통계',
      isActive: pathname === '/stats'
    },
    { 
      href: '/profile', 
      icon: User, 
      label: '프로필',
      isActive: pathname === '/profile'
    },
  ]

  return (
    <>
      {/* Spacer for bottom navigation */}
      <div className="h-20 md:hidden" />
      
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="flex justify-around items-center px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            
            if (item.isMain) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center p-3 bg-blue-600 text-white rounded-full shadow-lg transform transition-transform hover:scale-105"
                >
                  <Icon size={24} strokeWidth={2} />
                </Link>
              )
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 px-4 transition-colors ${
                  item.isActive
                    ? 'text-blue-600 bg-blue-50 rounded-lg'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={20} strokeWidth={item.isActive ? 2.5 : 1.5} />
                <span className={`text-xs mt-1 font-medium ${
                  item.isActive ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
