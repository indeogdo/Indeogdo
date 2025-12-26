import { NextResponse } from 'next/server';

/**
 * POST /api/kakao/geocode
 * 주소를 좌표로 변환합니다 (카카오 지오코딩 API 사용)
 */
export async function POST(request) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== 'string' || !address.trim()) {
      return NextResponse.json(
        { error: '주소가 필요합니다.' },
        { status: 400 }
      );
    }

    const kakaoRestKey = process.env.KAKAO_REST_API_KEY;

    if (!kakaoRestKey) {
      return NextResponse.json(
        { error: 'Kakao REST API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 카카오 지오코딩 API 호출
    const url = new URL('https://dapi.kakao.com/v2/local/search/address.json');
    url.searchParams.set('query', address.trim());

    const geocodeResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${kakaoRestKey}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!geocodeResponse.ok) {
      let errorMessage = '주소 검색에 실패했습니다.';
      let errorData = null;

      try {
        errorData = await geocodeResponse.json();
      } catch (parseError) {
        console.error('Kakao API response parse error:', parseError);
      }

      if (errorData?.error || errorData?.msg) {
        errorMessage = errorData.error || errorData.msg;
      }

      if (geocodeResponse.status === 401 || geocodeResponse.status === 403) {
        errorMessage = '카카오 API 인증에 실패했습니다. REST API 키를 확인해주세요.';
      }

      console.error('Kakao API error:', {
        status: geocodeResponse.status,
        data: errorData,
      });

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorData,
        },
        { status: geocodeResponse.status }
      );
    }

    const data = await geocodeResponse.json();

    if (data.documents && data.documents.length > 0) {
      const result = data.documents[0];
      return NextResponse.json({
        success: true,
        data: {
          latitude: parseFloat(result.y),
          longitude: parseFloat(result.x),
          address: result.address_name,
          roadAddress: result.road_address?.address_name || null,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: '주소를 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error('Geocode API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
