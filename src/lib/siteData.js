// 사이트 데이터 가져오기 유틸리티 함수
// generateMetadata와 API 라우트 모두에서 재사용 가능

import { supabaseAdmin } from '@/lib/supabase';

/**
 * 사이트 데이터를 가져오는 공통 함수
 * @param {string} id - 사이트 ID
 * @returns {Promise<{data: object | null, error: Error | null}>}
 */
export async function getSiteData(id) {
  try {
    if (!id) {
      return { data: null, error: new Error('Site ID is required') };
    }

    const { data, error } = await supabaseAdmin
      .from('sites')
      .select(`
        *,
        cluster:cluster_id (
          id,
          title,
          address,
          theme:theme_id (
            id,
            title
          )
        ),
        icon:icon_id (
          id,
          img
        ),
        addresses:address (
          id,
          name,
          latitude,
          longitude
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

