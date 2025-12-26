import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 특정 Theme 조회
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Theme ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('theme')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Theme not found' },
          { status: 404 }
        );
      }
      console.error('Theme fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch theme', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Theme GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Theme 수정
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Theme ID is required' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const updateData = { title };
    if (order !== undefined && order !== null) {
      updateData.order = order;
    }

    const { data, error } = await supabaseAdmin
      .from('theme')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Theme update error:', error);
      return NextResponse.json(
        { error: 'Failed to update theme', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Theme updated successfully'
    });

  } catch (error) {
    console.error('Theme PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Theme 삭제
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Theme ID is required' },
        { status: 400 }
      );
    }

    // 삭제 전에 이 theme를 사용하는 clusters가 있는지 확인
    const { data: clustersUsingTheme, error: checkError } = await supabaseAdmin
      .from('cluster')
      .select('id, title')
      .eq('theme_id', id)
      .limit(10); // 최대 10개만 확인

    if (!checkError && clustersUsingTheme && clustersUsingTheme.length > 0) {
      const clusterNames = clustersUsingTheme.map(c => `'${c.title}'`).join(', ');
      const moreCount = clustersUsingTheme.length === 10 ? ' 이상' : '';
      return NextResponse.json(
        {
          error: '이 테마 아래에 포함된 주제가 존재하여 삭제할 수 없습니다',
          details: `포함된 주제${moreCount}: ${clusterNames}\n\n아래의 아이템을 옮기고 다시 시도해주세요.`
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('theme')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Theme delete error:', error);
      // 외래 키 제약조건 에러 체크
      const errorMessage = error.message || '';
      const errorCode = error.code || '';

      if (
        errorCode === '23503' ||
        errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('violates foreign key constraint') ||
        errorMessage.includes('cluster_theme_id_fkey')
      ) {
        return NextResponse.json(
          {
            error: '이 테마 아래에 포함된 주제가 존재하여 삭제할 수 없습니다',
            details: '주제에서 이 테마를 사용 중입니다. 주제의 테마를 변경해주세요. 아래의 아이템을 옮기고 다시 시도해주세요.'
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to delete theme', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Theme not found', details: '해당 테마를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Theme deleted successfully'
    });

  } catch (error) {
    console.error('Theme DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
