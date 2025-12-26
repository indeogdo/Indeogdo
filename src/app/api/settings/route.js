import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const TABLE_NAME = 'setting';

// Settings 전체 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const query = supabaseAdmin
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (!Number.isNaN(limit) && !Number.isNaN(offset)) {
      query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Settings fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Settings GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Setting 생성
export async function POST(request) {
  try {
    const body = await request.json();
    const { display = null, title = null } = body;

    const insertData = {
      display,
      title
    };

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .insert([insertData])
      .select();

    if (error) {
      console.error('Setting create error:', error);
      return NextResponse.json(
        { error: 'Failed to create setting', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Setting created successfully'
    });
  } catch (error) {
    console.error('Settings POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

