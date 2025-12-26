'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useMapPolygon from '@/hooks/map/useMapPolygon';
import { polygonsData } from '@/lib/polygonsData';
import { areaPolygonData } from '@/lib/areaPolygonData';

/**
 * 지도에 여러 다각형을 표시하는 컴포넌트
 * polygonsData에서 데이터를 가져와서 모든 다각형을 렌더링합니다.
 * selectedSites 중 area가 true인 site가 있으면 areaPolygonData도 표시합니다.
 */
function MapPolygons({ mapInstance, mapInitialized, zoomLevel, selectedSites = [] }) {
  // 지도가 초기화되지 않았거나 mapInstance가 없으면 렌더링하지 않음
  if (!mapInitialized || !mapInstance) {
    return null;
  }

  // area가 true인 site가 있는지 확인
  const hasAreaSite = selectedSites.some(site => site.area === true);
  // area가 true인 site들 중 가장 최신 것 선택 (배열의 마지막 요소)
  const areaSite = useMemo(() => {
    const areaSites = selectedSites.filter(site => site.area === true);
    // 배열의 마지막 요소가 가장 최신
    return areaSites.length > 0 ? areaSites[areaSites.length - 1] : null;
  }, [selectedSites]);
  const router = useRouter();
  const areaTextMarkerRef = useRef(null);

  // polygon의 중심점 계산
  const calculateCentroid = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return null;

    let sumLat = 0;
    let sumLng = 0;

    coordinates.forEach(coord => {
      sumLat += coord[0];
      sumLng += coord[1];
    });

    return {
      lat: sumLat / coordinates.length,
      lng: sumLng / coordinates.length
    };
  };


  // 각 다각형을 렌더링 (시각적 요소는 없지만 훅 실행을 위해 컴포넌트로 처리)
  // areaPolygon을 마지막에 렌더링하여 다른 polygon들 위에 표시되도록 함
  return (
    <>
      {/* 일반 polygon들 */}
      {polygonsData.map((polygonData) => (
        <PolygonItem
          key={polygonData.id}
          mapInstance={mapInstance}
          polygonData={polygonData}
          zoomLevel={zoomLevel}
          siteId={polygonData.siteId}
          selectedSites={selectedSites}
          router={router}
        />
      ))}
      {/* area가 true인 site가 있으면 area polygon 표시 */}
      {hasAreaSite && (
        <PolygonItem
          key={areaPolygonData.id}
          mapInstance={mapInstance}
          polygonData={areaPolygonData}
          zoomLevel={zoomLevel}
          siteId={areaSite?.id}
          selectedSites={selectedSites}
          router={router}
        />
      )}
    </>
  );
}

/**
 * 개별 다각형을 관리하는 내부 컴포넌트
 */
function PolygonItem({ mapInstance, polygonData, zoomLevel, siteId, selectedSites, router }) {
  const handlePolygonNavigate = useCallback(() => {
    if (!siteId) return;

    const targetSite = selectedSites?.find(site => site.id === siteId);

    if (typeof window !== 'undefined') {
      if (targetSite && typeof window.onPOIClick === 'function') {
        window.onPOIClick(targetSite);
        return;
      }

      window.dispatchEvent(new CustomEvent('poiClicked', { detail: { siteId } }));
    }

    if (router) {
      router.push(`/sites/${siteId}`);
    }
  }, [siteId, selectedSites, router]);

  const {
    createPolygon,
    removePolygon
  } = useMapPolygon({
    mapInstance,
    coordinates: polygonData.coordinates,
    fillColor: polygonData.fillColor,
    strokeColor: polygonData.strokeColor,
    strokeWidth: polygonData.strokeWidth,
    fillOpacity: polygonData.fillOpacity !== undefined ? polygonData.fillOpacity : 1.0,
    strokeOpacity: polygonData.strokeOpacity !== undefined ? polygonData.strokeOpacity : 1.0,
    minZoom: polygonData.minZoom !== undefined ? polygonData.minZoom : null,
    zoomLevel: zoomLevel,
    options: {
      ...(polygonData.options || {}),
      ...(polygonData.zIndex !== undefined ? { zIndex: polygonData.zIndex } : {})
    },
    eventHandlers: siteId ? { click: handlePolygonNavigate } : undefined
  });

  // visible prop과 coordinates에 따라 다각형 표시/숨김
  // siteId가 변경되면 polygon을 다시 생성하여 새로운 이벤트 핸들러 적용
  useEffect(() => {
    if (!mapInstance) return;

    const isVisible = polygonData.visible !== undefined ? polygonData.visible : true;

    if (isVisible && polygonData.coordinates.length >= 3) {
      createPolygon();
    } else {
      removePolygon();
    }

    return () => {
      removePolygon();
    };
  }, [
    mapInstance,
    polygonData.visible,
    polygonData.coordinates,
    siteId,
    handlePolygonNavigate,
    createPolygon,
    removePolygon
  ]);

  // 시각적 요소는 렌더링하지 않음
  return null;
}

export default MapPolygons;
