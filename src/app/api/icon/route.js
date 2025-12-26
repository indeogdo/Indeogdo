import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Icon 테이블 전체 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';

    const { data, error } = await supabaseAdmin
      .from('icon')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error('Icon fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch icons', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Icon GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Icon 생성
export async function POST(request) {
  try {
    const body = await request.json();
    const { img, img_active } = body;

    if (!img) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('icon')
      .insert([{ img, img_active }])
      .select();

    if (error) {
      console.error('Icon create error:', error);
      return NextResponse.json(
        { error: 'Failed to create icon', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Icon created successfully'
    });

  } catch (error) {
    console.error('Icon POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
