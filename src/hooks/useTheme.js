import { useState, useEffect, useCallback } from 'react';

// Theme 데이터 타입 정의
const useTheme = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 테마 조회
  const fetchThemes = useCallback(async (limit = 100, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/theme?limit=${limit}&offset=${offset}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch themes');
      }

      setThemes(result.data);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch themes error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 특정 테마 조회
  const fetchTheme = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/theme/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch theme');
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch theme error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 테마 생성
  const createTheme = useCallback(async (title) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create theme');
      }

      // 로컬 상태 업데이트
      setThemes(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Create theme error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 테마 수정
  const updateTheme = useCallback(async (id, title, order) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/theme/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          ...(order !== undefined ? { order } : {}),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update theme');
      }

      // 로컬 상태 업데이트
      setThemes(prev =>
        prev.map(theme => (theme.id === id ? result.data : theme))
      );
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Update theme error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 테마 삭제
  const deleteTheme = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/theme/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || 'Failed to delete theme';
        const error = new Error(errorMessage);
        error.details = result.details || '';
        error.originalResult = result;
        throw error;
      }

      // 성공 시 에러 상태 초기화 및 로컬 상태 업데이트
      setError(null);
      setThemes(prev => prev.filter(theme => theme.id !== id));
      return result.data;
    } catch (err) {
      // 에러를 throw하여 호출하는 쪽에서 처리할 수 있도록
      console.error('Delete theme error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 테마 목록 로드
  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  return {
    // 상태
    themes,
    loading,
    error,

    // 액션
    fetchThemes,
    fetchTheme,
    createTheme,
    updateTheme,
    deleteTheme,

    // 유틸리티
    clearError: () => setError(null),
  };
};

export default useTheme;
