import { useEffect, useRef, useState, useCallback } from 'react';
import useMobile from '@/hooks/useMobile';

const MAPS_SCRIPT_SELECTOR = 'script[src*="maps.googleapis.com/maps/api/js"]';
const MAPS_READY_TIMEOUT_MS = 15000;

function isGoogleMapsReady() {
  const maps = window.google?.maps;
  if (!maps) {
    return false;
  }
  return (
    typeof maps.Map === 'function' ||
    typeof maps.importLibrary === 'function'
  );
}

function waitForGoogleMapsReady() {
  if (isGoogleMapsReady()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const tick = () => {
      if (isGoogleMapsReady()) {
        resolve();
        return;
      }
      if (Date.now() - startedAt > MAPS_READY_TIMEOUT_MS) {
        reject(new Error('Google Maps API failed to initialize'));
        return;
      }
      setTimeout(tick, 50);
    };
    tick();
  });
}

function loadGoogleMapsScript(apiKey) {
  if (isGoogleMapsReady()) {
    return Promise.resolve();
  }

  const existingScript = document.querySelector(MAPS_SCRIPT_SELECTOR);
  if (existingScript) {
    return waitForGoogleMapsReady();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&region=KR&language=ko&libraries=places,marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      waitForGoogleMapsReady().then(resolve).catch(reject);
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
}

async function createGoogleMap(mapElement, options) {
  const maps = window.google.maps;

  if (typeof maps.importLibrary === 'function') {
    const { Map } = await maps.importLibrary('maps');
    await Promise.all([
      maps.importLibrary('places'),
      maps.importLibrary('marker'),
    ]);
    return new Map(mapElement, options);
  }

  if (typeof maps.Map !== 'function') {
    throw new Error('Google Maps Map constructor is not available');
  }

  return new maps.Map(mapElement, options);
}

// 지도 초기화를 위한 커스텀 훅
const useMapInitialization = () => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(17);
  const [initialPosition, setInitialPosition] = useState(null);
  const isMobile = useMobile();

  // 지도 스타일 함수
  const getMapStyles = useCallback(() => {
    return [
      {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#add5ff"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "weight": "1.07"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "weight": "0.01"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "weight": "2.94"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "weight": "1.14"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "off"
          },
          {
            "color": "#040404"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      // {
      //   "featureType": "poi.park",
      //   "elementType": "geometry.fill",
      //   "stylers": [
      //     // {
      //     //   "color": "#AADAE0"
      //     // }
      //     {
      //       "color": "#A8DCD7"
      //     }
      //   ]
      // },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.icon",
        "stylers": [
          {
            "color": "#d1ff0b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#fffbfb"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "weight": "1.56"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "weight": "1.44"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "weight": "0"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "weight": "10"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "weight": "1.2"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "weight": "0"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "weight": "4.40"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "weight": "1.33"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "weight": "10.00"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "weight": "1.11"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#fbfbfb"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#000000"
          },
          {
            "weight": "2.21"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "weight": "0.01"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ff0000"
          },
          {
            "weight": "3.74"
          }
        ]
      }
    ];
  }, []);

  // 구글 지도 초기화 (한 번만 실행)
  useEffect(() => {
    // 이미 초기화된 경우 재초기화하지 않음
    if (mapInitialized) {
      return;
    }

    const initMap = async () => {
      // DOM 요소가 준비될 때까지 대기
      const waitForElement = () => {
        if (!mapRef.current) {
          setTimeout(waitForElement, 100);
          return;
        }
        startMapInitialization();
      };

      const startMapInitialization = async () => {
        try {
          setLoading(true);
          setError(null);

          const lat = 37.400409;
          const lng = 126.974294;
          // 모바일에서는 줌 레벨을 낮춰서 더 넓은 범위 표시
          const zoom = isMobile ? Math.max(zoomLevel - 1, 15) : zoomLevel;

          // 서버에서 API 키 가져오기
          const response = await fetch('/api/maps/script');
          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error || 'Failed to get API key');
          }

          await loadGoogleMapsScript(data.apiKey);

          const map = await createGoogleMap(mapRef.current, {
            center: { lat, lng },
            zoom,
            mapTypeId: 'roadmap',
            disableDefaultUI: true,
            styles: getMapStyles(),
          });

          setMapInstance(map);
          setLoading(false);
          setMapInitialized(true);
          setInitialPosition({ lat, lng, zoom });

        } catch (error) {
          console.error('Map initialization error:', error);
          setError(error.message);
          setLoading(false);
        }
      };

      waitForElement();
    };

    // DOM이 완전히 마운트된 후 실행
    const timer = setTimeout(() => {
      initMap();
    }, 200);

    return () => clearTimeout(timer);
  }, [getMapStyles, mapInitialized, zoomLevel, isMobile]); // zoomLevel, isMobile 추가하여 초기화 시에도 반영

  // zoomLevel 변경 시 기존 지도의 zoom만 업데이트
  useEffect(() => {
    if (mapInstance && mapInitialized) {
      // 모바일에서는 줌 레벨을 낮춰서 더 넓은 범위 표시
      const currentZoom = isMobile ? Math.max(zoomLevel - 1, 15) : zoomLevel;
      mapInstance.setZoom(currentZoom);
    }
  }, [zoomLevel, mapInstance, mapInitialized, isMobile]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      try {
        // 지도 인스턴스 정리
        if (window.mapInstance) {
          window.mapInstance = null;
        }

        // 전역 함수 정리
        if (window.initMap) {
          delete window.initMap;
        }
        if (window.onMapReady) {
          delete window.onMapReady;
        }
      } catch (error) {
        console.warn('Error during component cleanup:', error);
      }
    };
  }, []);

  return {
    mapRef,
    loading,
    error,
    mapInitialized,
    mapInstance,
    zoomLevel,
    initialPosition,
    setZoomLevel
  };
};

export default useMapInitialization;
