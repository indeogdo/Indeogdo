import { useCallback, useEffect, useRef } from 'react';

/**
 * 구글 지도에 Polyline(다중선)을 추가/관리하는 커스텀 훅
 *
 * @param {Object} params
 * @param {google.maps.Map} params.mapInstance - Google Maps 인스턴스
 * @param {Array} params.coordinates - 선 좌표 배열 [{ lat, lng }, ...] 혹은 [[lat, lng], ...]
 * @param {string} params.strokeColor - 선 색상 (예: "#FF0000")
 * @param {number} params.strokeOpacity - 선 투명도 (0 ~ 1)
 * @param {number} params.strokeWeight - 선 두께 (px)
 * @param {boolean} params.geodesic - 지오데식 곡선 여부
 * @param {number|null} params.minZoom - 최소 표시 줌 레벨
 * @param {number|null} params.zoomLevel - 현재 줌 레벨
 * @param {Object} params.options - 기타 PolylineOptions
 *
 * @returns {{
 *  polyline: google.maps.Polyline | null,
 *  createPolyline: () => google.maps.Polyline | null,
 *  updatePolyline: (updates?: Object) => google.maps.Polyline | null,
 *  removePolyline: () => void
 * }}
 */
const useMapPolyline = ({
  mapInstance,
  coordinates = [],
  strokeColor = '#FF0000',
  strokeOpacity = 1,
  strokeWeight = 2,
  geodesic = false,
  minZoom = null,
  zoomLevel = null,
  options = {}
}) => {
  const polylineRef = useRef(null);

  const normalizeCoordinates = useCallback((coords) => {
    if (!coords || !Array.isArray(coords)) {
      return [];
    }

    return coords.map(coord => {
      if (coord && typeof coord === 'object' && 'lat' in coord && 'lng' in coord) {
        return coord;
      }

      if (Array.isArray(coord) && coord.length >= 2) {
        return { lat: coord[0], lng: coord[1] };
      }

      return coord;
    });
  }, []);

  const removePolyline = useCallback(() => {
    if (polylineRef.current && polylineRef.current.setMap) {
      polylineRef.current.setMap(null);
    }
    polylineRef.current = null;
  }, []);

  const createPolyline = useCallback(() => {
    if (!mapInstance || coordinates.length < 2) {
      return null;
    }

    if (!window.google?.maps) {
      console.warn('Google Maps API not loaded');
      return null;
    }

    if (minZoom !== null && zoomLevel !== null && zoomLevel < minZoom) {
      removePolyline();
      return null;
    }

    const normalizedPath = normalizeCoordinates(coordinates);

    const polylineOptions = {
      path: normalizedPath,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      geodesic,
      ...options
    };

    if (options.icons && Array.isArray(options.icons)) {
      polylineOptions.icons = options.icons;
    }

    const polyline = new window.google.maps.Polyline(polylineOptions);
    polyline.setMap(mapInstance);

    polylineRef.current = polyline;
    return polyline;
  }, [
    mapInstance,
    coordinates,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    geodesic,
    options,
    zoomLevel,
    minZoom,
    normalizeCoordinates,
    removePolyline
  ]);

  const updatePolyline = useCallback((updates = {}) => {
    if (!polylineRef.current) {
      return createPolyline();
    }

    const {
      coordinates: newCoords,
      strokeColor: newStrokeColor,
      strokeOpacity: newStrokeOpacity,
      strokeWeight: newStrokeWeight,
      geodesic: newGeodesic,
      options: newOptions
    } = updates;

    if (newCoords) {
      const normalizedPath = normalizeCoordinates(newCoords);
      polylineRef.current.setPath(normalizedPath);
    }

    const setOptions = {};

    if (newStrokeColor !== undefined) setOptions.strokeColor = newStrokeColor;
    if (newStrokeOpacity !== undefined) setOptions.strokeOpacity = newStrokeOpacity;
    if (newStrokeWeight !== undefined) setOptions.strokeWeight = newStrokeWeight;
    if (newGeodesic !== undefined) setOptions.geodesic = newGeodesic;
    if (newOptions && typeof newOptions === 'object') {
      Object.assign(setOptions, newOptions);
    }

    if (Object.keys(setOptions).length > 0) {
      polylineRef.current.setOptions(setOptions);
    }

    return polylineRef.current;
  }, [createPolyline, normalizeCoordinates]);

  const updatePolylineVisibility = useCallback(() => {
    if (!polylineRef.current || minZoom === null || zoomLevel === null) {
      return;
    }

    if (zoomLevel < minZoom) {
      polylineRef.current.setMap(null);
    } else if (polylineRef.current.getMap() !== mapInstance) {
      polylineRef.current.setMap(mapInstance);
    }
  }, [minZoom, zoomLevel, mapInstance]);

  useEffect(() => {
    if (!mapInstance) {
      return undefined;
    }

    createPolyline();

    return () => {
      removePolyline();
    };
  }, [
    mapInstance,
    coordinates,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    geodesic,
    options,
    minZoom,
    zoomLevel,
    createPolyline,
    removePolyline
  ]);

  useEffect(() => {
    updatePolylineVisibility();
  }, [zoomLevel, minZoom, updatePolylineVisibility]);

  return {
    polyline: polylineRef.current,
    createPolyline,
    updatePolyline,
    removePolyline
  };
};

export default useMapPolyline;




