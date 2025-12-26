import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Buffer } from 'node:buffer';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const bucket = formData.get('bucket') || 'gallery';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const originalName = file.name || `upload_${Date.now()}`;
    const fileExt = originalName.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = fileName;

    // Try upload using Blob directly (Node supports Blob), fallback to Buffer
    let uploadError;
    try {
      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        });
      uploadError = error;
    } catch (e) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const { error } = await supabaseAdmin.storage
          .from(bucket)
          .upload(filePath, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: false,
          });
        uploadError = error;
      } catch (e2) {
        uploadError = e2;
      }
    }

    if (uploadError) {
      console.error('Upload error:', uploadError);
      const message = uploadError?.message || uploadError?.error || String(uploadError);
      return NextResponse.json({ error: 'Failed to upload image', details: message }, { status: 500 });
    }

    const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = publicData?.publicUrl;

    return NextResponse.json({ success: true, data: { url: publicUrl, name: originalName, path: filePath } });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}


