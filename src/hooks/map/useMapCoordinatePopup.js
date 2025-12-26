import { useState, useEffect, useCallback } from 'react';

/**
 * 임시로 지도에서 우클릭 시 좌표/주소를 확인하기 위한 훅
 * MapContainer에서 쉽게 제거할 수 있도록 별도 훅으로 분리
 */
const useMapCoordinatePopup = (mapInstance) => {
  const [coordinateInfo, setCoordinateInfo] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (!mapInstance || !window.google?.maps) {
      return undefined;
    }

    const geocoder = new window.google.maps.Geocoder();

    const handleRightClick = (event) => {
      event?.domEvent?.preventDefault?.();

      const lat = Number(event?.latLng?.lat?.() ?? null);
      const lng = Number(event?.latLng?.lng?.() ?? null);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return;
      }

      setCoordinateInfo({
        lat,
        lng,
        address: '주소를 불러오는 중...',
      });
      setIsGeocoding(true);

      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && Array.isArray(results) && results[0]) {
          setCoordinateInfo({
            lat,
            lng,
            address: results[0].formatted_address,
          });
        } else {
          setCoordinateInfo({
            lat,
            lng,
            address: '주소를 찾을 수 없습니다.',
          });
        }
        setIsGeocoding(false);
      });
    };

    const listener = mapInstance.addListener('rightclick', handleRightClick);

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [mapInstance]);

  const clearCoordinateInfo = useCallback(() => {
    setCoordinateInfo(null);
    setIsGeocoding(false);
  }, []);

  return {
    coordinateInfo,
    isGeocoding,
    clearCoordinateInfo,
  };
};

export default useMapCoordinatePopup;

