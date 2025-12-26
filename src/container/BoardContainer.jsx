'use client';

import { useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as S from '@/styles/Sites/board.style';
import EditorBoardRender from '@/components/Sites/EditorBoardRender';
import useClusterSitesStore from '@/stores/clusterSitesStore';

const buildCoordinateKey = (latitude, longitude) => {
  if (latitude == null || longitude == null) {
    return null;
  }

  const latNum = Number(latitude);
  const lngNum = Number(longitude);

  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
    return null;
  }

  return `${latNum.toFixed(6)}:${lngNum.toFixed(6)}`;
};

function BoardContainer({ siteData }) {
  const router = useRouter();
  const boardDetailRef = useRef(null);
  const activeClustersSites = useClusterSitesStore((state) => state.activeClustersSites);
  const shouldShowAddresses = siteData?.cluster?.address


  const activeSites = useMemo(() => {
    if (!activeClustersSites) {
      return [];
    }
    const list = [];
    activeClustersSites.forEach((sites) => {
      if (Array.isArray(sites)) {
        list.push(...sites);
      }
    });
    return list;
  }, [activeClustersSites]);

  const currentSiteCoordinateKeys = useMemo(() => {
    if (!siteData?.addresses || siteData.addresses.length === 0) {
      return new Set();
    }

    const keys = new Set();
    siteData.addresses.forEach((address) => {
      const coordKey = buildCoordinateKey(address.latitude, address.longitude);
      if (coordKey) {
        keys.add(coordKey);
      }
    });

    return keys;
  }, [siteData?.addresses]);

  const sameLocationSites = useMemo(() => {
    if (!siteData) {
      return [];
    }

    if (!currentSiteCoordinateKeys.size) {
      return [siteData];
    }

    const overlappedSites = activeSites.filter((site) => {
      if (!site || site.id === siteData.id || !Array.isArray(site.addresses)) {
        return false;
      }

      return site.addresses.some((address) => {
        const coordKey = buildCoordinateKey(address?.latitude, address?.longitude);
        return coordKey ? currentSiteCoordinateKeys.has(coordKey) : false;
      });
    });

    const deduped = [];
    const seen = new Set();

    const addSite = (site) => {
      if (!site?.id || seen.has(site.id)) {
        return;
      }
      seen.add(site.id);
      deduped.push(site);
    };

    addSite(siteData);
    overlappedSites.forEach(addSite);

    return deduped;
  }, [activeSites, currentSiteCoordinateKeys, siteData]);

  const currentIndex = useMemo(() => {
    if (!siteData?.id) {
      return 0;
    }
    const index = sameLocationSites.findIndex((site) => site.id === siteData.id);
    return index === -1 ? 0 : index;
  }, [sameLocationSites, siteData?.id]);

  const hasSameLocationGroup = sameLocationSites.length > 1;

  const handleNavigateSameLocation = useCallback((direction) => {
    if (!hasSameLocationGroup) {
      return;
    }

    const offset = direction === 'next' ? 1 : -1;
    const nextIndex = (currentIndex + offset + sameLocationSites.length) % sameLocationSites.length;
    const targetSite = sameLocationSites[nextIndex];

    if (!targetSite || targetSite.id === siteData?.id) {
      return;
    }

    router.push(`/sites/${targetSite.id}`);
  }, [currentIndex, hasSameLocationGroup, router, sameLocationSites, siteData?.id]);

  const scrollToTop = () => {
    if (boardDetailRef.current) {
      boardDetailRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <S.BoardDetailWrapper ref={boardDetailRef}>
        <S.BoardHeader>
          <S.BoardClusterWrapper>
            <S.BoardClusterIcon src={siteData?.icon?.img} alt={siteData?.icon?.name} />
            <S.BoardClusterTitle>{siteData?.cluster?.title}</S.BoardClusterTitle>
            {hasSameLocationGroup && (
              <S.SameLocationNav>
                <S.SameLocationButton
                  type="button"
                  onClick={() => handleNavigateSameLocation('prev')}
                  title="이전 장소 보기"
                >
                  ←
                </S.SameLocationButton>
                <S.SameLocationIndicator>
                  {/* {currentIndex + 1}/{sameLocationSites.length} */}
                </S.SameLocationIndicator>
                <S.SameLocationButton
                  type="button"
                  onClick={() => handleNavigateSameLocation('next')}
                  title="다음 장소 보기"
                >
                  →
                </S.SameLocationButton>
              </S.SameLocationNav>
            )}
          </S.BoardClusterWrapper>
          <S.BoardTitle>{siteData?.title}</S.BoardTitle>
          {!shouldShowAddresses && siteData?.addresses && siteData.addresses.length > 0 && (
            <S.BoardAddress>
              {siteData.addresses.map((addr, index) => (
                <div key={addr.id || index}>{addr.name}</div>
              ))}
            </S.BoardAddress>
          )}
        </S.BoardHeader>
        <EditorBoardRender item={siteData?.contents} />
      </S.BoardDetailWrapper>
      <S.ScrollToTopButton onClick={scrollToTop} title="위로 가기">
        ↑
      </S.ScrollToTopButton>
    </>
  );
}

export default BoardContainer;
