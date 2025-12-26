import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Cluster 테이블 전체 조회 (theme 정보 포함)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';
    const themeId = searchParams.get('theme_id'); // 특정 테마의 클러스터만 조회

    let query = supabaseAdmin
      .from('cluster')
      .select(`
        *,
        theme:theme_id (
          id,
          title
        )
      `)
      .order('order', { ascending: true, nullsLast: true })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // 특정 테마의 클러스터만 조회하는 경우
    if (themeId) {
      query = query.eq('theme_id', themeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Cluster fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch clusters', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Cluster GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Cluster 생성
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      theme_id,
      order,
      intro = false,
      toggle = false,
      address = false,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!theme_id) {
      return NextResponse.json(
        { error: 'Theme ID is required' },
        { status: 400 }
      );
    }

    // theme_id가 유효한지 확인
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

    const insertData = {
      title,
      theme_id,
      intro: Boolean(intro),
      toggle: Boolean(toggle),
      address: Boolean(address),
    };
    if (order !== undefined && order !== null) {
      insertData.order = order;
    }

    const { data, error } = await supabaseAdmin
      .from('cluster')
      .insert([insertData])
      .select(`
        *,
        theme:theme_id (
          id,
          title
        )
      `);

    if (error) {
      console.error('Cluster create error:', error);
      return NextResponse.json(
        { error: 'Failed to create cluster', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Cluster created successfully'
    });

  } catch (error) {
    console.error('Cluster POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}



