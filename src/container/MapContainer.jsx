'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import MapSearch from '@/components/Map/MapSearch';
import MapReset from '@/components/Map/MapReset';
import MapPolygons from '@/components/Map/MapPolygons';
import MapPolylines from '@/components/Map/MapPolylines';
import MapUndergroundLayer from '@/components/Map/MapUndergroundLayer';
import MapCoordinatePopup from '@/components/Map/MapCoordinatePopup';
import useMapInitialization from '@/hooks/map/useMapInitialization';
import useSiteMarkers from '@/hooks/map/useSiteMarkers';
import useMapSearch from '@/hooks/map/useMapSearch';
import usePOI from '@/hooks/map/usePOI';
import useMapCoordinatePopup from '@/hooks/map/useMapCoordinatePopup';

function MapContainer() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [pathname]);
  // 지도 초기화 훅
  const {
    mapRef,
    loading,
    error,
    mapInitialized,
    mapInstance,
    zoomLevel,
    initialPosition,
    setZoomLevel
  } = useMapInitialization();

  // POI 마커 관리 훅
  const {
    siteMarkers,
    createSiteMarkers,
    clearSiteMarkers,
    setActiveSiteMarker,
    fitMapToSiteMarkers
  } = useSiteMarkers(mapInstance);

  // 장소 검색 훅
  const {
    searchResults,
    searchPlaces,
    handleResultClick,
    clearSearchResults
  } = useMapSearch(mapInstance, zoomLevel);

  // POI 생성 훅
  const {
    poiMarkers,
    createPOI,
    createPOIs,
    clearPOI
  } = usePOI(mapInstance, zoomLevel);

  const {
    coordinateInfo,
    isGeocoding,
    clearCoordinateInfo
  } = useMapCoordinatePopup(mapInstance);

  const [selectedSites, setSelectedSites] = useState([]);

  // Navigation에서 선택된 sites 데이터를 받는 전역 함수 설정
  const handleSitesSelected = useCallback((sites) => {
    setSelectedSites(sites);
    if (mapInstance) {
      createSiteMarkers(sites);
      fitMapToSiteMarkers();
    }
  }, [mapInstance, createSiteMarkers, fitMapToSiteMarkers]);

  // POI 클릭 시 라우팅 처리
  const handlePOIClick = useCallback((site) => {
    if (setActiveSiteMarker) {
      setActiveSiteMarker(site.id);
    }
    // POI 클릭 시 보드를 펼치기 위한 이벤트 발생 (같은 POI 재클릭 포함)
    window.dispatchEvent(new CustomEvent('poiClicked', { detail: { siteId: site.id } }));
    router.push(`/sites/${site.id}`);
  }, [router, setActiveSiteMarker]);

  // POI 생성 핸들러 (단일)
  const handleCreatePOI = useCallback((latitude, longitude, name, fontSize) => {
    if (mapInstance && createPOI) {
      createPOI(latitude, longitude, name, fontSize);
    }
  }, [mapInstance, createPOI]);

  // POI 배열 생성 핸들러 (여러 개)
  const handleCreatePOIs = useCallback((poiDataList) => {
    if (mapInstance && createPOIs) {
      createPOIs(poiDataList);
    }
  }, [mapInstance, createPOIs]);

  // 초기 POI 데이터로 POI 생성 (지도 초기화 후)
  useEffect(() => {
    if (mapInitialized && mapInstance) {
      // 예시: 초기 POI 데이터가 있다면 여기서 생성
      // handleCreatePOIs([
      //   { latitude: 37.5665, longitude: 126.9780, name: '서울시청' },
      //   { latitude: 37.4979, longitude: 127.0276, name: '강남역' }
      // ]);

      // 또는 전역 함수로 받은 데이터로 생성
      if (window.poiData && Array.isArray(window.poiData)) {
        handleCreatePOIs(window.poiData);
      }
    }
  }, [mapInitialized, mapInstance, handleCreatePOIs]);

  // Navigation에서 선택된 sites 데이터를 받는 전역 함수 설정
  useEffect(() => {
    window.onSitesSelected = handleSitesSelected;
    window.onPOIClick = handlePOIClick;
    window.onCreatePOI = handleCreatePOI;
    window.onCreatePOIs = handleCreatePOIs;

    return () => {
      if (window.onSitesSelected) {
        delete window.onSitesSelected;
      }
      if (window.onPOIClick) {
        delete window.onPOIClick;
      }
      if (window.onCreatePOI) {
        delete window.onCreatePOI;
      }
      if (window.onCreatePOIs) {
        delete window.onCreatePOIs;
      }
    };
  }, [handleSitesSelected, handlePOIClick, handleCreatePOI, handleCreatePOIs]);

  useEffect(() => {
    if (!setActiveSiteMarker) {
      return;
    }
    const siteMatch = pathname.match(/^\/sites\/([^/]+)/);
    if (siteMatch && siteMatch[1]) {
      setActiveSiteMarker(siteMatch[1]);
    } else {
      setActiveSiteMarker(null);
    }
  }, [pathname, setActiveSiteMarker]);


  // 지도 리셋 함수
  const handleMapReset = useCallback(() => {
    if (!mapInstance || !initialPosition) {
      return;
    }

    try {
      // 초기 위치로 이동
      mapInstance.setCenter({
        lat: initialPosition.lat,
        lng: initialPosition.lng
      });
      mapInstance.setZoom(initialPosition.zoom);

      // 검색 마커만 제거 (POI 마커는 유지)
      const searchMarkers = document.querySelectorAll('[data-marker]');
      searchMarkers.forEach(marker => marker.remove());

      // 검색 결과만 리셋 (POI는 유지)
      clearSearchResults();

      // POI 마커는 유지 (제거하려면 clearPOI() 호출)

      // selectedSites는 유지하여 POI 마커가 계속 표시되도록 함
    } catch (error) {
      console.error('지도 리셋 중 오류:', error);
    }
  }, [mapInstance, initialPosition, clearSearchResults]);



  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100dvw', height: '100dvh' }}>
      {/* 검색 컴포넌트 - 지도가 초기화된 후에만 표시 */}
      {mapInitialized && !isAdmin && (
        <MapSearch
          onSearch={searchPlaces}
          searchResults={searchResults}
          onResultClick={handleResultClick}
          onFocusOut={clearSearchResults}
          placeholder="장소를 검색하세요..."
        />
      )}

      {/* 지도 컨테이너 */}
      <div
        id="map"
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
        }}
      />

      {loading && (
        <>loading...</>
      )}

      {error && (
        <>error...</>
      )}

      {/* 리셋 버튼 - 지도가 초기화된 후에만 표시 */}
      {mapInitialized && (
        <MapReset onReset={handleMapReset} />
      )}

      {/* <MapCoordinatePopup
        coordinateInfo={coordinateInfo}
        isGeocoding={isGeocoding}
        onClose={clearCoordinateInfo}
      /> */}

      {/* 다각형들 렌더링 */}
      <MapPolygons
        mapInstance={mapInstance}
        mapInitialized={mapInitialized}
        zoomLevel={zoomLevel}
        selectedSites={selectedSites}
      />
      <MapUndergroundLayer
        mapInstance={mapInstance}
        mapInitialized={mapInitialized}
        zoomLevel={zoomLevel}
      />
      <MapPolylines
        mapInstance={mapInstance}
        mapInitialized={mapInitialized}
        zoomLevel={zoomLevel}
      />
    </div>
  );
};

export default MapContainer;