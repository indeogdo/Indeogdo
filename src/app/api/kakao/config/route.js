import { NextResponse } from 'next/server';

/**
 * GET /api/kakao/config
 * 카카오 API 설정 정보를 반환합니다 (API 키는 숨김)
 */
export async function GET() {
  try {
    const kakaoRestKey = process.env.KAKAO_REST_API_KEY;

    if (!kakaoRestKey) {
      return NextResponse.json(
        { error: 'Kakao REST API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      config: {
        hasKakaoKey: true,
        hasGeocodeKey: true,
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
