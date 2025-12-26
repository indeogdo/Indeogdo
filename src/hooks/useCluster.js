import { useState, useEffect, useCallback } from 'react';

// Cluster 데이터 타입 정의
const useCluster = () => {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 클러스터 조회
  const fetchClusters = useCallback(async (limit = 100, offset = 0, themeId = null) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      if (themeId) {
        params.append('theme_id', themeId);
      }

      const response = await fetch(`/api/cluster?${params}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch clusters');
      }

      setClusters(result.data);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch clusters error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 특정 클러스터 조회
  const fetchCluster = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cluster/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch cluster');
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch cluster error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 클러스터 생성
  const createCluster = useCallback(async (title, themeId, intro = false, toggle = false, address = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cluster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          theme_id: themeId,
          intro: Boolean(intro),
          toggle: Boolean(toggle),
          address: Boolean(address),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create cluster');
      }

      // 로컬 상태 업데이트
      setClusters(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Create cluster error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 클러스터 수정
  const updateCluster = useCallback(async (id, title, themeId = null, order, intro, toggle, address) => {
    setLoading(true);
    setError(null);

    try {
      const updateData = { title };
      if (themeId) {
        updateData.theme_id = themeId;
      }
      if (order !== undefined) {
        updateData.order = order;
      }
      if (intro !== undefined) {
        updateData.intro = Boolean(intro);
      }
      if (toggle !== undefined) {
        updateData.toggle = Boolean(toggle);
      }
      if (address !== undefined) {
        updateData.address = Boolean(address);
      }

      const response = await fetch(`/api/cluster/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update cluster');
      }

      // 로컬 상태 업데이트
      setClusters(prev =>
        prev.map(cluster =>
          cluster.id === id ? result.data : cluster
        )
      );
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Update cluster error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 클러스터 삭제
  const deleteCluster = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cluster/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || 'Failed to delete cluster';
        const error = new Error(errorMessage);
        error.details = result.details || '';
        error.originalResult = result;
        throw error;
      }

      // 성공 시 에러 상태 초기화 및 로컬 상태 업데이트
      setError(null);
      setClusters(prev => prev.filter(cluster => cluster.id !== id));
      return result.data;
    } catch (err) {
      // 에러를 throw하여 호출하는 쪽에서 처리할 수 있도록
      console.error('Delete cluster error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 특정 테마의 클러스터만 조회
  const fetchClustersByTheme = useCallback(async (themeId) => {
    return await fetchClusters(100, 0, themeId);
  }, [fetchClusters]);

  // 컴포넌트 마운트 시 클러스터 목록 로드
  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  return {
    // 상태
    clusters,
    loading,
    error,

    // 액션
    fetchClusters,
    fetchCluster,
    createCluster,
    updateCluster,
    deleteCluster,
    fetchClustersByTheme,

    // 유틸리티
    clearError: () => setError(null),
  };
};

export default useCluster;



