'use client';

import { useState, useEffect } from 'react';
import useSites from '@/hooks/useSites';
import * as S from '@/styles/Navigation/navigation.style';
import { useRouter } from 'next/navigation';

function SiteItem({ clusterId, isActive }) {
  const { fetchSitesByCluster } = useSites();
  const [sites, setSites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadSites = async () => {
      const fetchedSites = await fetchSitesByCluster(clusterId);
      if (fetchedSites) {
        setSites(fetchedSites);
      }
    };
    loadSites();
  }, [clusterId]);

  return (
    <S.SiteList hidden={!isActive} $isActive={isActive}>
      {sites.map((site) => (
        <S.SiteItem key={site.id} onClick={() => router.push(`/sites/${site.id}`)}>
          <S.SiteIcon src={site.icon?.img || undefined} alt={site.title} />
          <S.SiteTitle>{site.title}</S.SiteTitle>
        </S.SiteItem>
      ))}
    </S.SiteList>
  );
}

export default SiteItem;