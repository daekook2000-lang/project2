'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { signIn } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/utils/auth-errors'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.')
      setLoading(false)
      return
    }

    const { error } = await signIn(formData.email, formData.password)

    if (error) {
      setError(getAuthErrorMessage(error))
    } else {
      // 로그인 성공 시, onAuthStateChange가 감지하여 처리하므로
      // 수동으로 리디렉션하기보다 상태가 업데이트되기를 기다리는 것이 좋습니다.
      // 하지만 즉각적인 피드백을 위해 리디렉션을 사용할 수 있습니다.
      // Supabase 리스너가 상태를 업데이트할 시간을 주기 위해 약간의 지연을 둘 수도 있습니다.
      router.push('/dashboard')
      router.refresh(); // 서버 컴포넌트 데이터를 다시 가져오기 위해 추가
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
          <p className="mt-2 text-gray-600">
            AI 식단 관리 서비스에 로그인하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Input
            label="이메일"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="example@email.com"
            required
          />

          <Input
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="비밀번호를 입력하세요"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            로그인
          </Button>
        </form>

        <div className="text-sm text-center text-gray-600">
          <p>
            계정이 없으신가요?{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
