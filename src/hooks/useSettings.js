import { useState, useEffect, useCallback } from 'react';

const useSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 전체 Setting 조회
  const fetchSettings = useCallback(async (limit = 50, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/settings?limit=${limit}&offset=${offset}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch settings');
      }

      setSettings(result.data);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch settings error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 단일 Setting 조회
  const fetchSetting = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/settings/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch setting');
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch setting error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Setting 생성
  const createSetting = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create setting');
      }

      setSettings(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Create setting error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Setting 수정
  const updateSetting = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/settings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update setting');
      }

      setSettings(prev =>
        prev.map(setting =>
          setting.id === id ? result.data : setting
        )
      );
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Update setting error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Setting 삭제
  const deleteSetting = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/settings/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete setting');
      }

      setSettings(prev => prev.filter(setting => setting.id !== id));
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Delete setting error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    fetchSetting,
    createSetting,
    updateSetting,
    deleteSetting,
    clearError: () => setError(null),
  };
};

export default useSettings;

