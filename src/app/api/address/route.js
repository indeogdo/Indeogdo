import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Address 테이블 전체 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';
    const siteId = searchParams.get('site_id');

    let query = supabaseAdmin
      .from('address')
      .select(
        `
        *,
        site:site_id (
          id,
          title
        )
      `
      )
      .order('created_at', { ascending: false })
      .range(parseInt(offset, 10), parseInt(offset, 10) + parseInt(limit, 10) - 1);

    if (siteId) {
      query = query.eq('site_id', siteId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Address fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch address', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length ?? 0,
    });
  } catch (error) {
    console.error('Address GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Address 생성
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, latitude, longitude, site_id } = body;

    if (!site_id) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    const { data: siteExists, error: siteError } = await supabaseAdmin
      .from('sites')
      .select('id')
      .eq('id', site_id)
      .single();

    if (siteError || !siteExists) {
      return NextResponse.json(
        { error: 'Invalid site ID' },
        { status: 400 }
      );
    }

    const insertData = {
      site_id,
      name: name ?? null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from('address')
      .insert([insertData])
      .select(
        `
        *,
        site:site_id (
          id,
          title
        )
      `
      );

    if (error) {
      console.error('Address create error:', error);
      return NextResponse.json(
        { error: 'Failed to create address', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Address created successfully',
    });
  } catch (error) {
    console.error('Address POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


