import { useState, useEffect, useCallback } from 'react';

// Credits 데이터 타입 정의
const useCredits = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 크레딧 조회
  const fetchCredits = useCallback(async (limit = 100, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/credits?limit=${limit}&offset=${offset}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch credits');
      }

      setCredits(result.data);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch credits error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 특정 크레딧 조회
  const fetchCredit = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/credits/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch credit');
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch credit error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 크레딧 생성
  const createCredit = useCallback(async (creditData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creditData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create credit');
      }

      // 로컬 상태 업데이트
      setCredits(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Create credit error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 크레딧 수정
  const updateCredit = useCallback(async (id, creditData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/credits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creditData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update credit');
      }

      // 로컬 상태 업데이트
      setCredits(prev =>
        prev.map(credit =>
          credit.id === id ? result.data : credit
        )
      );
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Update credit error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 크레딧 삭제
  const deleteCredit = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/credits/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete credit');
      }

      // 로컬 상태 업데이트
      setCredits(prev => prev.filter(credit => credit.id !== id));
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Delete credit error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 크레딧 목록 로드
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    // 상태
    credits,
    loading,
    error,

    // 액션
    fetchCredits,
    fetchCredit,
    createCredit,
    updateCredit,
    deleteCredit,

    // 유틸리티
    clearError: () => setError(null),
  };
};

export default useCredits;
