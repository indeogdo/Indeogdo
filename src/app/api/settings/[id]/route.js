import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const TABLE_NAME = 'setting';

// 특정 Setting 조회
export async function GET(request, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Setting not found' },
          { status: 404 }
        );
      }
      console.error('Setting fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch setting', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Setting GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Setting 수정
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { display, title } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (display !== undefined) updateData.display = display;
    if (title !== undefined) updateData.title = title === '' ? null : title;

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Setting update error:', error);
      return NextResponse.json(
        { error: 'Failed to update setting', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Setting updated successfully'
    });
  } catch (error) {
    console.error('Setting PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Setting 삭제
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Setting delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete setting', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Setting DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

