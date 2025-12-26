import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Credits 테이블 전체 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';

    const { data, error } = await supabaseAdmin
      .from('credits')
      .select('*')
      .order('order', { ascending: true, nullsLast: true })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error('Credits fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch credits', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Credits GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Credit 생성
export async function POST(request) {
  try {
    const body = await request.json();
    const { role, people } = body;

    const insertData = {};
    if (role !== undefined) insertData.role = role;
    if (people !== undefined) insertData.people = people;

    const { data, error } = await supabaseAdmin
      .from('credits')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Credit create error:', error);
      return NextResponse.json(
        { error: 'Failed to create credit', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Credit created successfully'
    });

  } catch (error) {
    console.error('Credits POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
