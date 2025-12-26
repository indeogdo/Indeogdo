'use client';

import { useState, useEffect, use } from 'react';
import BoardContainer from '@/container/BoardContainer';
import * as S from '@/styles/Sites/board.style';

export default function SitePage({ params }) {
  const { id } = use(params);
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchSiteData();
    }
  }, [id]);

  const fetchSiteData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sites/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch site data');
      }
      const result = await response.json();

      if (result.success && result.data) {
        setSiteData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch site data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching site data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <S.BoardLoading></S.BoardLoading>
    );
  }

  if (error) {
    return (
      <S.BoardLoading>{error.message}</S.BoardLoading>
    );
  }


  return (
    <BoardContainer siteData={siteData} />
  );
}