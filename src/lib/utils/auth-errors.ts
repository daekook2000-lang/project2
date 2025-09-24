import { AuthError } from '@supabase/supabase-js'

export function getAuthErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return '이메일 또는 비밀번호가 올바르지 않습니다.'
    case 'User not found':
      return '존재하지 않는 사용자입니다.'
    case 'Email not confirmed':
      return '이메일 인증이 필요합니다. 받은 편지함을 확인해주세요.'
    case 'User already registered':
      return '이미 가입된 이메일입니다.'
    case 'Password should be at least 6 characters.':
        return '비밀번호는 6자 이상이어야 합니다.'
    // 추가적인 Supabase 에러 메시지 케이스를 여기에 추가할 수 있습니다.
    default:
      console.error('Unhandled Auth Error:', error)
      return '인증 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
}
