import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 특정 Cluster 조회
export async function GET(request, context) {
  try {
    const resolvedParams = await context?.params;
    const { id } = resolvedParams || {};

    if (!id) {
      return NextResponse.json(
        { error: 'Cluster ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cluster')
      .select(`
        *,
        theme:theme_id (
          id,
          title
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Cluster not found' },
          { status: 404 }
        );
      }
      console.error('Cluster fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cluster', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Cluster GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Cluster 수정
export async function PUT(request, context) {
  try {
    const resolvedParams = await context?.params;
    const { id } = resolvedParams || {};
    const body = await request.json();
    const {
      title,
      theme_id,
      order,
      intro,
      toggle,
      address,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Cluster ID is required' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // theme_id가 변경되는 경우 유효성 검사
    if (theme_id) {
      const { data: themeExists, error: themeError } = await supabaseAdmin
        .from('theme')
        .select('id')
        .eq('id', theme_id)
        .single();

      if (themeError || !themeExists) {
        return NextResponse.json(
          { error: 'Invalid theme ID' },
          { status: 400 }
        );
      }
    }

    const updateData = { title };
    if (theme_id) {
      updateData.theme_id = theme_id;
    }
    if (order !== undefined && order !== null) {
      updateData.order = order;
    }
    if (intro !== undefined) {
      updateData.intro = Boolean(intro);
    }
    if (toggle !== undefined) {
      updateData.toggle = Boolean(toggle);
    }
    if (address !== undefined) {
      updateData.address = Boolean(address);
    }

    const { data, error } = await supabaseAdmin
      .from('cluster')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        theme:theme_id (
          id,
          title
        )
      `);

    if (error) {
      console.error('Cluster update error:', error);
      return NextResponse.json(
        { error: 'Failed to update cluster', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Cluster not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Cluster updated successfully'
    });

  } catch (error) {
    console.error('Cluster PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Cluster 삭제
export async function DELETE(request, context) {
  try {
    const resolvedParams = await context?.params;
    const { id } = resolvedParams || {};

    if (!id) {
      return NextResponse.json(
        { error: 'Cluster ID is required' },
        { status: 400 }
      );
    }

    // 삭제 전에 이 cluster를 사용하는 sites가 있는지 확인
    const { data: sitesUsingCluster, error: checkError } = await supabaseAdmin
      .from('sites')
      .select('id, title')
      .eq('cluster_id', id)
      .limit(10); // 최대 10개만 확인

    if (!checkError && sitesUsingCluster && sitesUsingCluster.length > 0) {
      const siteNames = sitesUsingCluster.map(s => `'${s.title}'`).join(', ');
      const moreCount = sitesUsingCluster.length === 10 ? ' 이상' : '';
      return NextResponse.json(
        {
          error: '이 주제 아래에 포함된 아이템이 존재하여 삭제할 수 없습니다',
          details: `포함된 장소 컨텐츠${moreCount}: ${siteNames}\n\n아래의 아이템을 옮기고 다시 시도해주세요.`
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cluster')
      .delete()
      .eq('id', id)
      .select(`
        *,
        theme:theme_id (
          id,
          title
        )
      `);

    if (error) {
      console.error('Cluster delete error:', error);
      // 외래 키 제약조건 에러 체크
      const errorMessage = error.message || '';
      const errorCode = error.code || '';

      if (
        errorCode === '23503' ||
        errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('violates foreign key constraint') ||
        errorMessage.includes('sites_cluster_id_fkey')
      ) {
        return NextResponse.json(
          {
            error: '이 주제 아래에 포함된 장소 컨텐츠가 존재하여 삭제할 수 없습니다',
            details: '장소 컨텐츠에서 이 주제를 사용 중입니다. 장소 컨텐츠의 주제를 변경해주세요. 아래의 아이템을 옮기고 다시 시도해주세요.'
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to delete cluster', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Cluster not found', details: '해당 주제를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Cluster deleted successfully'
    });

  } catch (error) {
    console.error('Cluster DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}



