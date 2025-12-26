import { useCallback, useEffect, useMemo, useState } from 'react';
import useSettings from '@/hooks/useSettings';

const UNDERGROUND_SETTING_ID = 'c81b155c-0b0b-4f14-bead-43be3f851b00';
const UNDERGROUND_EVENT = 'underground-setting-updated';

const useUndergroundSetting = ({ autoFetch = true } = {}) => {
  const { fetchSetting, updateSetting } = useSettings();
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const broadcast = useCallback((payload) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(UNDERGROUND_EVENT, { detail: payload }));
  }, []);

  const loadSetting = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await fetchSetting(UNDERGROUND_SETTING_ID);
    if (data) {
      setSetting(data);
      broadcast(data);
    } else {
      setError('지하철 설정을 불러오지 못했습니다.');
    }
    setLoading(false);
    return data;
  }, [fetchSetting]);

  const setDisplay = useCallback(async (nextValue) => {
    if (nextValue === undefined || setting === null) {
      return null;
    }

    const previousValue = setting.display;
    setSaving(true);
    setSetting(prev => (prev ? { ...prev, display: nextValue } : prev));
    const updated = await updateSetting(UNDERGROUND_SETTING_ID, { display: nextValue });

    if (updated) {
      setSetting(updated);
      broadcast(updated);
    } else {
      setSetting(prev => (prev ? { ...prev, display: previousValue } : prev));
      setError('지하철 설정을 저장하지 못했습니다.');
    }
    setSaving(false);
    return updated;
  }, [setting, updateSetting]);

  const toggleDisplay = useCallback(() => {
    if (!setting) return null;
    return setDisplay(!setting.display);
  }, [setting, setDisplay]);

  useEffect(() => {
    if (!autoFetch) return;
    loadSetting();
  }, [autoFetch, loadSetting]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleUpdate = (event) => {
      if (event?.detail) {
        setSetting(event.detail);
      }
    };

    window.addEventListener(UNDERGROUND_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(UNDERGROUND_EVENT, handleUpdate);
    };
  }, []);

  return {
    setting,
    display: useMemo(() => Boolean(setting?.display), [setting]),
    loading,
    saving,
    error,
    loadSetting,
    setDisplay,
    toggleDisplay,
  };
};

export default useUndergroundSetting;

