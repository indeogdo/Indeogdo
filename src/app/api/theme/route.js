import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Theme 테이블 전체 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';

    const { data, error } = await supabaseAdmin
      .from('theme')
      .select('*')
      .order('order', { ascending: true, nullsLast: true })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error('Theme fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch themes', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Theme GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Theme 생성
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, order } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const insertData = { title };
    if (order !== undefined && order !== null) {
      insertData.order = order;
    }

    const { data, error } = await supabaseAdmin
      .from('theme')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Theme create error:', error);
      return NextResponse.json(
        { error: 'Failed to create theme', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Theme created successfully'
    });

  } catch (error) {
    console.error('Theme POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
