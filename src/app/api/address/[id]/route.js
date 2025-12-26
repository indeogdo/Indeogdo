import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 특정 Address 조회
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
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
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Address not found' },
          { status: 404 }
        );
      }
      console.error('Address fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch address', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Address GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Address 수정
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, latitude, longitude, site_id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;

    if (site_id !== undefined) {
      if (!site_id) {
        updateData.site_id = null;
      } else {
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

        updateData.site_id = site_id;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('address')
      .update(updateData)
      .eq('id', id)
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
      console.error('Address update error:', error);
      return NextResponse.json(
        { error: 'Failed to update address', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Address updated successfully',
    });
  } catch (error) {
    console.error('Address PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Address 삭제
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('address')
      .delete()
      .eq('id', id)
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
      console.error('Address delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete address', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Address DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


