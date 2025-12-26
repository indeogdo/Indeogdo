import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 특정 Credit 조회
export async function GET(request, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Credit ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('credits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Credit not found' },
          { status: 404 }
        );
      }
      console.error('Credit fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch credit', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Credit GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Credit 수정
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { role, people, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Credit ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (role !== undefined) updateData.role = role === '' ? null : role;
    if (people !== undefined) updateData.people = people === '' ? null : people;
    if (order !== undefined && order !== null) updateData.order = order;

    const { data, error } = await supabaseAdmin
      .from('credits')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Credit update error:', error);
      return NextResponse.json(
        { error: 'Failed to update credit', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Credit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Credit updated successfully'
    });

  } catch (error) {
    console.error('Credit PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Credit 삭제
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Credit ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('credits')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Credit delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete credit', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Credit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Credit deleted successfully'
    });

  } catch (error) {
    console.error('Credit DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
