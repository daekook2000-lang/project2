'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PhotoUpload } from '@/components/upload/PhotoUpload'
import { User } from '@supabase/supabase-js'

export default function UploadPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          // Development mode: create a mock user for testing
          if (process.env.NODE_ENV === 'development') {
            const mockUser = {
              id: 'test-user-id',
              email: 'test@example.com',
              created_at: new Date().toISOString(),
              // Add other required User properties
            } as User
            setUser(mockUser)
            setLoading(false)
            return
          }
          router.push('/login')
          return
        }
        setUser(user)
      } catch (error) {
        console.error('Auth check error:', error)
        // Development mode fallback
        if (process.env.NODE_ENV === 'development') {
          const mockUser = {
            id: 'test-user-id',
            email: 'test@example.com',
            created_at: new Date().toISOString(),
          } as User
          setUser(mockUser)
          setLoading(false)
          return
        }
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              식단 기록하기 📸
            </h1>
            <p className="text-gray-600 text-lg">
              음식 사진을 업로드하면 AI가 자동으로 분석해드려요
            </p>
          </div>
          
          <PhotoUpload userId={user.id} />
        </div>
      </div>
    </div>
  )
}