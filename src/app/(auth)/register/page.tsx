'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { signUp } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/utils/auth-errors'
import { AuthError } from '@supabase/supabase-js'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('모든 필드를 입력해주세요.')
      setLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    const { error } = await signUp(formData.email, formData.password, formData.fullName)

    if (error) {
      // TODO: getAuthErrorMessage 에러 메시지 케이스 추가
      setError(getAuthErrorMessage(error as AuthError))
    } else {
      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 text-center bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900">회원가입 완료</h1>
          <p className="text-gray-600">
            인증 이메일을 발송했습니다. 이메일의 링크를 클릭하여 가입을 완료해주세요.
          </p>
          <Link href="/login">
            <Button>로그인 페이지로 이동</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-2 text-gray-600">
            AI 식단 관리 서비스를 시작해보세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Input
            label="이름"
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            placeholder="홍길동"
            required
          />

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
            placeholder="6자 이상 입력해주세요"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            회원가입
          </Button>
        </form>

        <div className="text-sm text-center text-gray-600">
          <p>
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
