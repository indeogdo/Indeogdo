import { NextResponse } from 'next/server';

/**
 * GET /api/kakao/config
 * 카카오 API 설정 정보를 반환합니다 (API 키는 숨김)
 */
export async function GET() {
  try {
    const kakaoJsKey = process.env.KAKAO_JS_KEY;

    if (!kakaoJsKey) {
      return NextResponse.json(
        { error: 'Kakao API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // API 키는 숨기고 필요한 설정 정보만 반환
    return NextResponse.json({
      success: true,
      config: {
        hasKakaoKey: true,
        // 실제 API 키는 서버에서만 사용하고 클라이언트에는 노출하지 않음
      }
    });
  } catch (error) {
    console.error('Kakao config API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
