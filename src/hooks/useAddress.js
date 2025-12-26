import { useState, useEffect, useCallback } from 'react';

// Address 데이터 타입 정의
const useAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 주소 조회
  const fetchAddresses = useCallback(async (limit = 100, offset = 0, siteId = null) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (siteId) {
        params.append('site_id', siteId);
      }

      const response = await fetch(`/api/address?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch address');
      }

      setAddresses(result.data);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch addresses error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 특정 주소 조회
  const fetchAddress = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/address/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch address');
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch address error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 주소 생성
  const createAddress = useCallback(async (addressData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create address');
      }

      setAddresses((prev) => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Create address error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 주소 수정
  const updateAddress = useCallback(async (id, addressData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/address/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update address');
      }

      setAddresses((prev) =>
        prev.map((address) => (address.id === id ? result.data : address))
      );
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Update address error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 주소 삭제
  const deleteAddress = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/address/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete address');
      }

      setAddresses((prev) => prev.filter((address) => address.id !== id));
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Delete address error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAddressesBySite = useCallback(async (siteId) => {
    return fetchAddresses(100, 0, siteId);
  }, [fetchAddresses]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    fetchAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    fetchAddressesBySite,
    clearError: () => setError(null),
  };
};

export default useAddress;


