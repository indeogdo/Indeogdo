import { useCallback, useRef, useState } from 'react';

const buildMarkerIcon = (url) => {
  if (!url || typeof window === 'undefined' || !window.google?.maps) {
    return null;
  }

  return {
    url,
    scaledSize: new window.google.maps.Size(32, 32),
    anchor: new window.google.maps.Point(16, 16)
  };
};
// POI 마커 관리를 위한 커스텀 훅
const useSiteMarkers = (mapInstance) => {
  const [siteMarkers, setSiteMarkers] = useState([]);
  const siteMarkersRef = useRef([]);
  const activeMarkerRef = useRef(null);
  const activeSiteIdRef = useRef(null);

  const fitMapToSiteMarkers = useCallback((options = {}) => {
    if (
      !mapInstance ||
      typeof window === 'undefined' ||
      !window.google?.maps?.LatLngBounds
    ) {
      return;
    }

    const markers = (options.markers || siteMarkersRef.current || []).filter(Boolean);

    if (!markers.length) {
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach(marker => {
      const position = marker.getPosition?.();
      if (position) {
        bounds.extend(position);
      }
    });

    if (bounds.isEmpty()) {
      return;
    }

    if (markers.length === 1) {
      const center = bounds.getCenter();
      mapInstance.panTo(center);
      if (options.singleMarkerZoom) {
        mapInstance.setZoom(options.singleMarkerZoom);
      }
      return;
    }

    const padding = options.padding ?? (window.innerWidth < 768 ? 32 : 64);
    mapInstance.fitBounds(bounds, padding);
  }, [mapInstance]);

  const stopActiveMarkerAnimation = useCallback(() => {
    if (activeMarkerRef.current) {
      activeMarkerRef.current.setAnimation(null);
      activeMarkerRef.current = null;
    }
  }, []);

  const applyActiveMarkerAnimation = useCallback(() => {
    if (!activeSiteIdRef.current) {
      stopActiveMarkerAnimation();
      return;
    }

    const targetMarker = siteMarkersRef.current.find(
      marker => marker._siteId === activeSiteIdRef.current
    );

    if (typeof window === 'undefined' || !window.google?.maps?.Animation) {
      return;
    }

    if (activeMarkerRef.current && activeMarkerRef.current !== targetMarker) {
      stopActiveMarkerAnimation();
    }

    if (targetMarker) {
      targetMarker.setAnimation(window.google.maps.Animation.BOUNCE);
      activeMarkerRef.current = targetMarker;
    }
  }, [stopActiveMarkerAnimation]);

  const setActiveSiteMarker = useCallback((siteId) => {
    activeSiteIdRef.current = siteId || null;
    applyActiveMarkerAnimation();
  }, [applyActiveMarkerAnimation]);

  // 기존 site 마커들 제거
  const clearSiteMarkers = useCallback(() => {
    stopActiveMarkerAnimation();
    siteMarkersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    siteMarkersRef.current = [];
    setSiteMarkers([]);
  }, [stopActiveMarkerAnimation]);

  // 선택된 sites 데이터를 받아서 POI 마커 생성 (최적화된 버전)
  const createSiteMarkers = useCallback((sites) => {
    if (!mapInstance) {
      return;
    }

    // 현재 활성화된 site ID들
    const currentSiteIds = new Set(sites?.map(site => site.id) || []);

    // 현재 활성화된 모든 address ID들 (site의 모든 address)
    const currentAddressIds = new Set();
    sites?.forEach(site => {
      if (site.addresses && site.addresses.length > 0) {
        site.addresses.forEach(addr => {
          if (addr.id) {
            currentAddressIds.add(addr.id);
          }
        });
      }
    });

    // 기존 마커들 중 제거해야 할 것들 찾기 (site가 비활성화되었거나 address가 제거된 경우)
    const markersToRemove = siteMarkersRef.current.filter(marker => {
      // site가 비활성화된 경우
      if (!currentSiteIds.has(marker._siteId)) {
        return true;
      }
      // address가 제거된 경우 (addressId가 있고 현재 활성화된 address 목록에 없는 경우)
      if (marker._addressId && !currentAddressIds.has(marker._addressId)) {
        return true;
      }
      return false;
    });

    // 기존 마커들의 address ID 추적
    const existingAddressIds = new Set(
      siteMarkersRef.current
        .map(marker => marker._addressId)
        .filter(id => id != null)
    );

    // 제거할 마커들 제거
    markersToRemove.forEach(marker => {
      marker.setMap(null);
    });
    if (activeMarkerRef.current && markersToRemove.includes(activeMarkerRef.current)) {
      stopActiveMarkerAnimation();
    }

    // 새로 추가할 마커들 생성
    const newMarkers = [];

    sites?.forEach((site) => {
      // site의 모든 address에 대해 마커 생성
      if (site.addresses && site.addresses.length > 0) {
        site.addresses.forEach((address) => {
          // 이미 마커가 있는 address는 스킵
          if (address.id && existingAddressIds.has(address.id)) {
            return;
          }

          // 위도, 경도가 있는 address만 마커 생성
          if (address.latitude && address.longitude) {
            const isAreaSite = Boolean(site.area);
            const defaultIcon = isAreaSite
              ? undefined
              : buildMarkerIcon(site.icon?.img) ||
              buildMarkerIcon('/icon/marker.png');

            const marker = new window.google.maps.Marker({
              position: {
                lat: parseFloat(address.latitude),
                lng: parseFloat(address.longitude)
              },
              map: mapInstance,
              title: site.title,
              icon: defaultIcon,
              visible: !isAreaSite,
              animation: window.google.maps.Animation.DROP
            });

            setTimeout(() => {
              marker.setAnimation(null);
            }, 1000);

            // 마커 클릭 시 라우팅
            marker.addListener('click', () => {
              // POI 상세 페이지로 라우팅
              if (window.onPOIClick) {
                window.onPOIClick(site);
              }
            });

            // 마커에 식별자 추가
            marker._isSiteMarker = true;
            marker._siteId = site.id;
            marker._addressId = address.id || null;

            newMarkers.push(marker);
          }
        });
      }
    });

    // 기존 마커들 중 유지할 것들과 새로 추가할 마커들 합치기
    // (제거 목록에 없는 마커들만 유지)
    const markersToKeep = siteMarkersRef.current.filter(marker => {
      const shouldRemove = markersToRemove.includes(marker);
      return !shouldRemove;
    });

    const allMarkers = [...markersToKeep, ...newMarkers];
    siteMarkersRef.current = allMarkers;
    setSiteMarkers(allMarkers);
    applyActiveMarkerAnimation();
    fitMapToSiteMarkers();
  }, [mapInstance, applyActiveMarkerAnimation, stopActiveMarkerAnimation, fitMapToSiteMarkers]);

  return {
    siteMarkers,
    createSiteMarkers,
    clearSiteMarkers,
    setActiveSiteMarker,
    fitMapToSiteMarkers
  };
};

export default useSiteMarkers;
