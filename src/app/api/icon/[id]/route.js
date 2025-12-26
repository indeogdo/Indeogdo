import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 특정 Icon 조회
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Icon ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('icon')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Icon not found' },
          { status: 404 }
        );
      }
      console.error('Icon fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch icon', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Icon GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Icon 수정
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { img } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Icon ID is required' },
        { status: 400 }
      );
    }

    if (!img) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('icon')
      .update({ img })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Icon update error:', error);
      return NextResponse.json(
        { error: 'Failed to update icon', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Icon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Icon updated successfully'
    });

  } catch (error) {
    console.error('Icon PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Icon 삭제
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true'; // 강제 삭제 옵션

    if (!id) {
      return NextResponse.json(
        { error: 'Icon ID is required' },
        { status: 400 }
      );
    }

    // 삭제 전에 이 아이콘을 사용하는 sites가 있는지 확인
    const { data: sitesUsingIcon, error: checkError } = await supabaseAdmin
      .from('sites')
      .select('id, title')
      .eq('icon_id', id)
      .limit(5); // 최대 5개만 확인

    if (!checkError && sitesUsingIcon && sitesUsingIcon.length > 0) {
      // force 옵션이 없으면 에러 반환
      if (!force) {
        const siteNames = sitesUsingIcon.map(s => `${"'" + s.title + "'"}`).join(', ');
        const moreCount = sitesUsingIcon.length === 5 ? ' 이상' : '';
        return NextResponse.json(
          {
            error: '이 아이콘은 다른 곳에서 사용 중이어서 삭제할 수 없습니다.',
            details: `사용 중인 장소 컨텐츠 ${moreCount}: ${siteNames}`,
            canForceDelete: true // 강제 삭제 가능 여부 플래그
          },
          { status: 400 }
        );
      }

      // force=true인 경우, sites의 icon_id를 null로 업데이트
      const { error: updateError } = await supabaseAdmin
        .from('sites')
        .update({ icon_id: null })
        .eq('icon_id', id);

      if (updateError) {
        console.error('Sites update error:', updateError);
        return NextResponse.json(
          {
            error: '사이트 아이콘 업데이트에 실패했습니다',
            details: updateError.message
          },
          { status: 500 }
        );
      }
    }

    // 아이콘 삭제
    const { data, error } = await supabaseAdmin
      .from('icon')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Icon delete error:', error);
      // 외래 키 제약조건 에러 체크 (PostgreSQL 에러 코드 23503 또는 메시지에 포함된 경우)
      const errorMessage = error.message || '';
      const errorCode = error.code || '';

      if (
        errorCode === '23503' ||
        errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('violates foreign key constraint') ||
        errorMessage.includes('sites_icon_id_fkey')
      ) {
        return NextResponse.json(
          {
            error: '이 아이콘은 다른 곳에서 사용 중이어서 삭제할 수 없습니다',
            details: '장소 컨텐츠에서 이 아이콘을 사용 중입니다. 먼저 장소 컨텐츠의 아이콘을 변경해주세요.',
            canForceDelete: true // 강제 삭제 가능 여부 플래그
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to delete icon', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Icon not found', details: '해당 아이콘을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: force ? '아이콘이 삭제되었고, 관련 장소 컨텐츠의 아이콘이 제거되었습니다.' : 'Icon deleted successfully'
    });

  } catch (error) {
    console.error('Icon DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}



