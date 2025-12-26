import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  env: {
    // 클라이언트 사이드에서도 접근 가능하도록 환경 변수 공개
    // 기존 SUPABASE_URL, SUPABASE_ANON_KEY를 NEXT_PUBLIC_ 접두사 없이도 사용 가능하게 설정
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
