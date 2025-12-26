import { useState, useEffect, useCallback } from 'react';

// Icon 데이터 타입 정의
const useIcon = () => {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 아이콘 조회
  const fetchIcons = useCallback(async (limit = 100, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/icon?limit=${limit}&offset=${offset}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch icons');
      }

      setIcons(result.data);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch icons error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 특정 아이콘 조회
  const fetchIcon = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/icon/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch icon');
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch icon error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 아이콘 생성
  const createIcon = useCallback(async (img, img_active = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/icon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ img, img_active }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create icon');
      }

      // 로컬 상태 업데이트
      setIcons(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Create icon error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 아이콘 수정
  const updateIcon = useCallback(async (id, img) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/icon/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ img }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update icon');
      }

      // 로컬 상태 업데이트
      setIcons(prev =>
        prev.map(icon =>
          icon.id === id ? result.data : icon
        )
      );
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Update icon error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 아이콘 삭제
  const deleteIcon = useCallback(async (id, force = false) => {
    setLoading(true);
    setError(null);

    try {
      const url = `/api/icon/${id}${force ? '?force=true' : ''}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        // 강제 삭제 가능 여부를 포함한 에러 객체 반환
        // error 필드를 우선 사용하고, details는 별도로 전달
        const errorMessage = result.error || 'Failed to delete icon';
        const error = new Error(errorMessage);
        error.canForceDelete = result.canForceDelete || false;
        error.originalResult = result;
        // details는 별도로 저장 (error 메시지와 중복 방지)
        error.details = result.details || '';
        // 강제 삭제 가능한 에러는 UI에 표시하지 않음 (사용자 확인으로 처리됨)
        if (!error.canForceDelete) {
          setError(errorMessage);
        }
        throw error;
      }

      // 성공 시 에러 상태 초기화 및 로컬 상태 업데이트
      setError(null);
      setIcons(prev => prev.filter(icon => icon.id !== id));
      return result;
    } catch (err) {
      // canForceDelete가 true인 경우에는 setError를 호출하지 않음
      // (이미 위에서 처리됨 또는 사용자 확인 대화상자로 처리됨)
      if (!err.canForceDelete) {
        setError(err.message);
      }
      console.error('Delete icon error:', err);
      throw err; // 에러를 다시 throw하여 호출하는 쪽에서 처리할 수 있도록
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 아이콘 목록 로드
  useEffect(() => {
    fetchIcons();
  }, [fetchIcons]);

  return {
    // 상태
    icons,
    loading,
    error,

    // 액션
    fetchIcons,
    fetchIcon,
    createIcon,
    updateIcon,
    deleteIcon,

    // 유틸리티
    clearError: () => setError(null),
  };
};

export default useIcon;



