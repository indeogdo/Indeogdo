import { useEffect, useRef, useCallback } from 'react';

/**
 * 구글 지도에 다각형을 추가하는 커스텀 훅
 * 
 * @param {Object} mapInstance - Google Maps 인스턴스 (Map3DElement 또는 일반 Map)
 * @param {Array} coordinates - 다각형 좌표 배열 [{ lat, lng, altitude? }, ...]
 * @param {string} fillColor - 배경색 (예: "#0000FF80")
 * @param {string} strokeColor - 선색깔 (예: "#EA433580")
 * @param {number} strokeWidth - 선 두께 (예: 4)
 * @param {number} fillOpacity - 배경 투명도 (0.0 ~ 1.0, 기본값: 1.0)
 * @param {number} strokeOpacity - 선 투명도 (0.0 ~ 1.0, 기본값: 1.0)
 * @param {number} minZoom - 최소 줌 레벨 (이 줌 레벨 이상에서만 표시, 기본값: null)
 * @param {number} zoomLevel - 현재 줌 레벨
 * @param {Object} options - 추가 옵션
 * @param {string} options.altitudeMode - 고도 모드 ("ABSOLUTE" | "RELATIVE_TO_GROUND" | "CLAMP_TO_GROUND")
 * @param {number} options.altitude - 기본 고도 (coordinate에 altitude가 없을 경우)
 * @param {boolean} options.extruded - 3D 압출 여부
 * @param {boolean} options.drawsOccludedSegments - 가려진 세그먼트 그리기 여부
 * 
 * @returns {Object} { polygon, createPolygon, updatePolygon, removePolygon }
 */
const useMapPolygon = ({
  mapInstance,
  coordinates = [],
  fillColor,
  strokeColor = "#EA433580",
  strokeWidth = 4,
  fillOpacity = 1.0,
  strokeOpacity = 1.0,
  minZoom = null,
  zoomLevel = null,
  options = {},
  eventHandlers = undefined
}) => {
  const polygonRef = useRef(null);
  const is3DMapRef = useRef(false);
  const eventListenersRef = useRef([]);

  // 좌표 형식 변환: 배열 [lat, lng] 또는 [lat, lng, altitude]를 객체 { lat, lng, altitude? }로 변환
  const normalizeCoordinates = useCallback((coords) => {
    if (!coords || !Array.isArray(coords)) {
      return [];
    }

    return coords.map(coord => {
      // 이미 객체 형식인 경우 그대로 반환
      if (coord && typeof coord === 'object' && 'lat' in coord && 'lng' in coord) {
        return coord;
      }

      // 배열 형식인 경우 변환: [lat, lng] 또는 [lat, lng, altitude]
      if (Array.isArray(coord) && coord.length >= 2) {
        return {
          lat: coord[0],
          lng: coord[1],
          ...(coord[2] !== undefined && { altitude: coord[2] })
        };
      }

      return coord;
    });
  }, []);

  // 3D 지도인지 확인
  const checkIf3DMap = useCallback((map) => {
    if (!map) return false;
    // Map3DElement는 특정 속성을 가지고 있음
    return map instanceof HTMLElement && map.tagName === 'GMP-MAP-3D';
  }, []);

  // 3D 라이브러리 로드
  const loadMaps3DLibrary = useCallback(async () => {
    try {
      if (window.google && window.google.maps && window.google.maps.importLibrary) {
        const { Polygon3DElement } = await window.google.maps.importLibrary("maps3d");
        return Polygon3DElement;
      }
      return null;
    } catch (error) {
      console.error('Failed to load maps3d library:', error);
      return null;
    }
  }, []);

  // hex 색상에 투명도 추가하는 헬퍼 함수
  const addOpacityToColor = useCallback((color, opacity) => {
    if (!color) return color;

    // 이미 alpha 값이 있는 hex 색상인 경우 (예: #RRGGBBAA)
    if (color.length === 9) {
      const rgb = color.substring(0, 7);
      const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
      return rgb + alpha;
    }

    // 일반 hex 색상인 경우 (예: #RRGGBB)
    if (color.length === 7) {
      const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
      return color + alpha;
    }

    return color;
  }, []);

  // 3D Polygon 생성
  const create3DPolygon = useCallback(async (map, coords, fill, stroke, width, fillOpac, strokeOpac, opts) => {
    try {
      const Polygon3DElement = await loadMaps3DLibrary();
      if (!Polygon3DElement) {
        throw new Error('Failed to load Polygon3DElement');
      }

      const polygonOptions = {
        strokeColor: addOpacityToColor(stroke, strokeOpac),
        strokeWidth: width,
        fillColor: addOpacityToColor(fill, fillOpac),
        altitudeMode: opts.altitudeMode || "ABSOLUTE",
        extruded: opts.extruded !== undefined ? opts.extruded : true,
        drawsOccludedSegments: opts.drawsOccludedSegments !== undefined ? opts.drawsOccludedSegments : true,
      };

      const polygon = new Polygon3DElement(polygonOptions);

      // 좌표 설정 (altitude 포함)
      const formattedCoords = coords.map(coord => ({
        lat: coord.lat,
        lng: coord.lng,
        altitude: coord.altitude !== undefined ? coord.altitude : (opts.altitude || 0)
      }));

      polygon.outerCoordinates = formattedCoords;

      // 지도에 추가
      if (map && map.appendChild) {
        map.appendChild(polygon);
      } else if (map && map.append) {
        map.append(polygon);
      } else {
        throw new Error('Invalid map instance for 3D polygon');
      }

      return polygon;
    } catch (error) {
      console.error('Failed to create 3D polygon:', error);
      throw error;
    }
  }, [loadMaps3DLibrary, addOpacityToColor]);

  // 2D Polygon 생성 (일반 Google Maps)
  const create2DPolygon = useCallback((map, coords, fill, stroke, width, fillOpac, strokeOpac) => {
    try {
      if (!map || !window.google || !window.google.maps) {
        throw new Error('Google Maps API not loaded');
      }

      const polygonOptions = {
        paths: coords.map(coord => ({
          lat: coord.lat,
          lng: coord.lng
        })),
        strokeColor: addOpacityToColor(stroke, strokeOpac),
        strokeOpacity: strokeOpac,
        strokeWeight: width,
        fillColor: addOpacityToColor(fill, fillOpac),
        fillOpacity: fillOpac,
      };

      // zIndex 옵션이 있으면 추가
      if (options.zIndex !== undefined) {
        polygonOptions.zIndex = options.zIndex;
      }

      const polygon = new window.google.maps.Polygon(polygonOptions);

      polygon.setMap(map);

      return polygon;
    } catch (error) {
      console.error('Failed to create 2D polygon:', error);
      throw error;
    }
  }, [addOpacityToColor]);

  const clearEventListeners = useCallback(() => {
    if (!eventListenersRef.current.length) {
      return;
    }

    eventListenersRef.current.forEach((listener) => {
      if (!listener) return;

      if (listener.type === 'gmaps' && listener.listener) {
        try {
          if (typeof listener.listener.remove === 'function') {
            listener.listener.remove();
          } else if (typeof window !== 'undefined' && window.google?.maps?.event?.removeListener) {
            window.google.maps.event.removeListener(listener.listener);
          }
        } catch (error) {
          console.warn('Failed to remove google maps listener:', error);
        }
      } else if (listener.type === 'dom' && listener.target && listener.eventName && listener.handler) {
        try {
          listener.target.removeEventListener(listener.eventName, listener.handler);
        } catch (error) {
          console.warn('Failed to remove DOM listener:', error);
        }
      }
    });

    eventListenersRef.current = [];
  }, []);

  const attachEventHandlers = useCallback((polygon) => {
    if (!polygon || !eventHandlers) {
      return;
    }

    const handlerEntries = Object.entries(eventHandlers).filter(([, handler]) => typeof handler === 'function');
    if (!handlerEntries.length) {
      return;
    }

    handlerEntries.forEach(([eventName, handler]) => {
      if (is3DMapRef.current && polygon?.addEventListener) {
        polygon.addEventListener(eventName, handler);
        eventListenersRef.current.push({
          type: 'dom',
          target: polygon,
          eventName,
          handler
        });
      } else if (!is3DMapRef.current && typeof polygon?.addListener === 'function') {
        const listener = polygon.addListener(eventName, handler);
        if (listener) {
          eventListenersRef.current.push({
            type: 'gmaps',
            listener
          });
        }
      }
    });
  }, [eventHandlers]);

  // 다각형 제거
  const removePolygon = useCallback(() => {
    if (!polygonRef.current) {
      return;
    }

    try {
      clearEventListeners();
      if (is3DMapRef.current) {
        // 3D Polygon 제거
        const polygon = polygonRef.current;
        if (polygon && polygon.parentNode) {
          polygon.parentNode.removeChild(polygon);
        } else if (polygon && polygon.remove) {
          polygon.remove();
        }
      } else {
        // 2D Polygon 제거
        const polygon = polygonRef.current;
        if (polygon && polygon.setMap) {
          polygon.setMap(null);
        }
      }
      polygonRef.current = null;
    } catch (error) {
      console.error('Failed to remove polygon:', error);
    }
  }, [clearEventListeners]);

  // 다각형 생성
  const createPolygon = useCallback(async () => {
    if (!mapInstance || !coordinates || coordinates.length < 3) {
      console.warn('Map instance or insufficient coordinates provided');
      return null;
    }

    try {
      // 기존 다각형이 있으면 제거
      if (polygonRef.current) {
        removePolygon();
      }

      // 좌표 형식 정규화 (배열을 객체로 변환)
      const normalizedCoords = normalizeCoordinates(coordinates);

      const is3D = checkIf3DMap(mapInstance);
      is3DMapRef.current = is3D;

      // 줌 레벨 체크
      if (minZoom !== null && zoomLevel !== null && zoomLevel < minZoom) {
        // 줌 레벨이 낮으면 다각형을 생성하지 않음
        return null;
      }

      let polygon;
      if (is3D) {
        polygon = await create3DPolygon(
          mapInstance,
          normalizedCoords,
          fillColor,
          strokeColor,
          strokeWidth,
          fillOpacity,
          strokeOpacity,
          options
        );
      } else {
        polygon = create2DPolygon(
          mapInstance,
          normalizedCoords,
          fillColor,
          strokeColor,
          strokeWidth,
          fillOpacity,
          strokeOpacity
        );
      }

      polygonRef.current = polygon;
      attachEventHandlers(polygon);
      return polygon;
    } catch (error) {
      console.error('Failed to create polygon:', error);
      return null;
    }
  }, [mapInstance, coordinates, fillColor, strokeColor, strokeWidth, fillOpacity, strokeOpacity, minZoom, zoomLevel, options, checkIf3DMap, create3DPolygon, create2DPolygon, normalizeCoordinates, removePolygon, attachEventHandlers]);

  // 다각형 업데이트
  const updatePolygon = useCallback(async (newCoordinates, newFillColor, newStrokeColor, newStrokeWidth, newOptions) => {
    if (!polygonRef.current) {
      return createPolygon();
    }

    try {
      if (is3DMapRef.current) {
        // 3D Polygon 업데이트
        const coords = newCoordinates || coordinates;
        const normalizedCoords = normalizeCoordinates(coords);
        const fill = newFillColor !== undefined ? newFillColor : fillColor;
        const stroke = newStrokeColor !== undefined ? newStrokeColor : strokeColor;
        const width = newStrokeWidth !== undefined ? newStrokeWidth : strokeWidth;
        const opts = newOptions || options;

        // 기존 다각형 제거 후 재생성
        removePolygon();
        const fillOpac = newOptions?.fillOpacity !== undefined ? newOptions.fillOpacity : fillOpacity;
        const strokeOpac = newOptions?.strokeOpacity !== undefined ? newOptions.strokeOpacity : strokeOpacity;
        const polygon = await create3DPolygon(
          mapInstance,
          normalizedCoords,
          fill,
          stroke,
          width,
          fillOpac,
          strokeOpac,
          opts
        );
        polygonRef.current = polygon;
        attachEventHandlers(polygon);
        return polygon;
      } else {
        // 2D Polygon 업데이트
        const polygon = polygonRef.current;
        if (newCoordinates) {
          const normalizedCoords = normalizeCoordinates(newCoordinates);
          const paths = normalizedCoords.map(coord => ({
            lat: coord.lat,
            lng: coord.lng
          }));
          polygon.setPaths(paths);
        }
        const updateOptions = {};
        if (newFillColor !== undefined) {
          const fillOpac = newOptions?.fillOpacity !== undefined ? newOptions.fillOpacity : fillOpacity;
          updateOptions.fillColor = addOpacityToColor(newFillColor, fillOpac);
        }
        if (newStrokeColor !== undefined) {
          const strokeOpac = newOptions?.strokeOpacity !== undefined ? newOptions.strokeOpacity : strokeOpacity;
          updateOptions.strokeColor = addOpacityToColor(newStrokeColor, strokeOpac);
        }
        if (newStrokeWidth !== undefined) {
          updateOptions.strokeWeight = newStrokeWidth;
        }
        if (newOptions?.fillOpacity !== undefined) {
          const fill = newFillColor !== undefined ? newFillColor : fillColor;
          updateOptions.fillColor = addOpacityToColor(fill, newOptions.fillOpacity);
          updateOptions.fillOpacity = newOptions.fillOpacity;
        }
        if (newOptions?.strokeOpacity !== undefined) {
          const stroke = newStrokeColor !== undefined ? newStrokeColor : strokeColor;
          updateOptions.strokeColor = addOpacityToColor(stroke, newOptions.strokeOpacity);
          updateOptions.strokeOpacity = newOptions.strokeOpacity;
        }
        if (Object.keys(updateOptions).length > 0) {
          polygon.setOptions(updateOptions);
        }
        clearEventListeners();
        attachEventHandlers(polygon);
        return polygon;
      }
    } catch (error) {
      console.error('Failed to update polygon:', error);
      return null;
    }
  }, [mapInstance, coordinates, fillColor, strokeColor, strokeWidth, fillOpacity, strokeOpacity, options, createPolygon, create3DPolygon, normalizeCoordinates, removePolygon, addOpacityToColor, attachEventHandlers, clearEventListeners]);

  // 줌 레벨에 따라 다각형 표시/숨김 처리
  const updatePolygonVisibility = useCallback(() => {
    if (!polygonRef.current || minZoom === null || zoomLevel === null) {
      return;
    }

    if (zoomLevel < minZoom) {
      // 줌 레벨이 낮으면 다각형 숨김
      if (is3DMapRef.current) {
        const polygon = polygonRef.current;
        if (polygon && polygon.parentNode) {
          polygon.style.display = 'none';
        }
      } else {
        const polygon = polygonRef.current;
        if (polygon && polygon.setMap) {
          polygon.setMap(null);
        }
      }
    } else {
      // 줌 레벨이 충분하면 다각형 표시
      if (is3DMapRef.current) {
        const polygon = polygonRef.current;
        if (polygon && polygon.parentNode) {
          polygon.style.display = '';
        }
      } else {
        const polygon = polygonRef.current;
        if (polygon && polygon.setMap && mapInstance) {
          polygon.setMap(mapInstance);
        }
      }
    }
  }, [minZoom, zoomLevel, mapInstance]);

  // 줌 레벨 변경 감지
  useEffect(() => {
    if (!mapInstance || minZoom === null) return;

    // 초기 표시/숨김 처리
    updatePolygonVisibility();

    // 줌 변경 이벤트 리스너 추가
    const zoomListener = mapInstance.addListener('zoom_changed', () => {
      const currentZoom = mapInstance.getZoom();
      if (currentZoom < minZoom) {
        // 다각형 숨김
        if (polygonRef.current) {
          if (is3DMapRef.current) {
            if (polygonRef.current.parentNode) {
              polygonRef.current.style.display = 'none';
            }
          } else {
            if (polygonRef.current.setMap) {
              polygonRef.current.setMap(null);
            }
          }
        }
      } else {
        // 다각형 표시
        if (polygonRef.current) {
          if (is3DMapRef.current) {
            if (polygonRef.current.parentNode) {
              polygonRef.current.style.display = '';
            }
          } else {
            if (polygonRef.current.setMap && mapInstance) {
              polygonRef.current.setMap(mapInstance);
            }
          }
        }
      }
    });

    return () => {
      if (zoomListener) {
        window.google.maps.event.removeListener(zoomListener);
      }
    };
  }, [mapInstance, minZoom, updatePolygonVisibility]);

  // 좌표나 스타일이 변경될 때 다각형 재생성
  useEffect(() => {
    if (mapInstance && coordinates && coordinates.length >= 3) {
      createPolygon();
    }

    return () => {
      removePolygon();
    };
  }, [mapInstance, coordinates, fillColor, strokeColor, strokeWidth, fillOpacity, strokeOpacity, minZoom, zoomLevel, createPolygon, removePolygon]);

  // 이벤트 핸들러가 변경되면 다시 연결
  useEffect(() => {
    if (!polygonRef.current) return;
    clearEventListeners();
    attachEventHandlers(polygonRef.current);
  }, [eventHandlers, attachEventHandlers, clearEventListeners]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      removePolygon();
    };
  }, [removePolygon]);

  // opacity 애니메이션 함수
  const animateOpacity = useCallback((targetFillOpacity, targetStrokeOpacity, duration = 500) => {
    if (!polygonRef.current) {
      console.warn('animateOpacity: polygonRef.current is null');
      return;
    }

    const startTime = Date.now();
    const is3D = is3DMapRef.current;
    const currentFillColor = fillColor;
    const currentStrokeColor = strokeColor;

    // polygon의 현재 opacity 값을 가져오기
    // polygon이 생성될 때 설정된 초기 opacity 사용 (shouldAnimate일 때는 0)
    let startFillOpacity = fillOpacity;
    let startStrokeOpacity = strokeOpacity;

    if (!is3D) {
      // 2D Polygon의 경우 현재 opacity 가져오기 시도
      const polygon = polygonRef.current;
      if (polygon) {
        // Google Maps Polygon은 직접 속성 접근이 어려우므로
        // 초기값을 사용하거나, polygon 객체에서 가져오기 시도
        try {
          // polygon의 내부 속성에서 opacity 가져오기 시도
          if (polygon.fillOpacity !== undefined) {
            startFillOpacity = polygon.fillOpacity;
          }
          if (polygon.strokeOpacity !== undefined) {
            startStrokeOpacity = polygon.strokeOpacity;
          }
        } catch (e) {
          // 접근 실패 시 초기값 사용
          console.log('Could not get current opacity, using initial values');
        }
      }
    }

    console.log('animateOpacity - start:', { startFillOpacity, startStrokeOpacity, targetFillOpacity, targetStrokeOpacity, is3D });

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easing function (ease-in-out)
      const easeInOut = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentFillOpacity = startFillOpacity + (targetFillOpacity - startFillOpacity) * easeInOut;
      const currentStrokeOpacity = startStrokeOpacity + (targetStrokeOpacity - startStrokeOpacity) * easeInOut;

      if (is3D) {
        // 3D Polygon의 경우 opacity를 직접 변경할 수 없으므로 색상에 alpha를 적용
        if (polygonRef.current) {
          const fillColorWithOpacity = addOpacityToColor(currentFillColor, currentFillOpacity);
          const strokeColorWithOpacity = addOpacityToColor(currentStrokeColor, currentStrokeOpacity);

          if (polygonRef.current.fillColor !== undefined) {
            polygonRef.current.fillColor = fillColorWithOpacity;
          }
          if (polygonRef.current.strokeColor !== undefined) {
            polygonRef.current.strokeColor = strokeColorWithOpacity;
          }
        }
      } else {
        // 2D Polygon 업데이트
        const polygon = polygonRef.current;
        if (polygon && polygon.setOptions) {
          const updateOptions = {
            fillOpacity: currentFillOpacity,
            strokeOpacity: currentStrokeOpacity
          };
          polygon.setOptions(updateOptions);
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        console.log('animateOpacity - completed:', { currentFillOpacity, currentStrokeOpacity });
      }
    };

    requestAnimationFrame(animate);
  }, [fillOpacity, strokeOpacity, fillColor, strokeColor, addOpacityToColor]);

  return {
    polygon: polygonRef.current,
    createPolygon,
    updatePolygon,
    removePolygon,
    animateOpacity,
    is3D: is3DMapRef.current
  };
};

export default useMapPolygon;

