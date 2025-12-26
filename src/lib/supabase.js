import { createClient } from '@supabase/supabase-js'

// 클라이언트 사이드용 Supabase 클라이언트 (공개 키 사용)
// 클라이언트 사이드에서는 NEXT_PUBLIC_ 접두사 필요, 서버 사이드에서는 일반 process.env 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버 사이드용 Supabase 클라이언트 (서비스 롤 키 사용)
// 클라이언트 사이드에서는 undefined 반환 (서버 사이드에서만 사용)
export const supabaseAdmin = typeof window === 'undefined'
  ? createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  : null
