import { useCallback, useRef, useState, useEffect } from 'react';

// POI 생성을 위한 커스텀 훅
const usePOI = (mapInstance, zoomLevel) => {
  const [poiMarkers, setPoiMarkers] = useState([]);
  const poiMarkersRef = useRef([]);

  // 모든 POI 마커 제거
  const clearPOIs = useCallback(() => {
    poiMarkersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    poiMarkersRef.current = [];
    setPoiMarkers([]);
  }, []);

  // 텍스트 레이블이 있는 커스텀 마커 생성 헬퍼 함수
  const createTextLabel = useCallback((name, fontSize = 14) => {
    // 텍스트 레이블을 위한 Canvas 아이콘 생성
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // 폰트 설정 (폰트 크기는 파라미터로 받음)
    context.font = `${fontSize}px Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    // 여러 줄 텍스트 처리 (\n으로 분리)
    const lines = name.split('\n').filter(line => line.trim() !== '');

    // 빈 텍스트 체크
    if (lines.length === 0) {
      lines.push('');
    }

    // 각 줄의 너비 측정
    const lineWidths = lines.map(line => context.measureText(line).width);
    const maxWidth = Math.max(...lineWidths);

    // 텍스트 높이 계산 (줄 간격 포함)
    const lineHeight = fontSize * 1.2; // 줄 간격
    const totalTextHeight = lines.length * lineHeight - (lineHeight - fontSize);

    const padding = 4; // 테두리를 위한 패딩
    const totalWidth = maxWidth + padding * 2;
    const totalHeight = totalTextHeight + padding * 2;

    // 캔버스 크기 설정
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // 다시 폰트 설정 (캔버스 크기 변경 후 초기화됨)
    context.font = `${fontSize}px Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    // 각 줄을 그리기
    const x = totalWidth / 2;
    const startY = padding;

    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);

      // 흰색 테두리
      context.strokeStyle = '#ffffff';
      context.lineWidth = 2; // 폰트 크기에 비례한 테두리 두께
      context.lineJoin = 'round';
      context.miterLimit = 2;
      context.strokeText(line, x, y);

      // 검정색 텍스트
      context.fillStyle = '#000000';
      context.fillText(line, x, y);
    });

    // anchor 정보를 반환하기 위해 객체 반환
    return {
      url: canvas.toDataURL(),
      size: new window.google.maps.Size(totalWidth, totalHeight),
      anchor: new window.google.maps.Point(totalWidth / 2, totalHeight / 2)
    };
  }, []);

  // 줌 레벨에 따라 마커 표시/숨김 처리
  const updateMarkersVisibility = useCallback((currentZoom) => {
    poiMarkersRef.current.forEach(marker => {
      const minZoom = marker._minZoom || 17; // 기본 최소 줌 레벨
      if (currentZoom < minZoom) {
        marker.setMap(null); // 숨김
      } else {
        marker.setMap(mapInstance); // 표시
      }
    });
  }, [mapInstance]);

  // 줌 레벨 변경 감지
  useEffect(() => {
    if (!mapInstance || !zoomLevel) return;

    // 초기 표시/숨김 처리
    updateMarkersVisibility(zoomLevel);

    // 줌 변경 이벤트 리스너 추가
    const zoomListener = mapInstance.addListener('zoom_changed', () => {
      const currentZoom = mapInstance.getZoom();
      updateMarkersVisibility(currentZoom);
    });

    return () => {
      if (zoomListener) {
        window.google.maps.event.removeListener(zoomListener);
      }
    };
  }, [mapInstance, zoomLevel, updateMarkersVisibility]);

  // 단일 POI 마커 생성
  const createPOI = useCallback((latitude, longitude, name, fontSize = 14, minZoom = 17) => {
    if (!mapInstance) {
      console.warn('지도 인스턴스가 없습니다.');
      return null;
    }

    if (!window.google || !window.google.maps) {
      console.warn('Google Maps API가 로드되지 않았습니다.');
      return null;
    }

    if (!latitude || !longitude || !name) {
      console.warn('위도, 경도, 이름이 모두 필요합니다.');
      return null;
    }

    try {
      // 텍스트 레이블 아이콘 생성 (폰트 크기 전달)
      const labelIconData = createTextLabel(name, fontSize);

      // POI 마커 생성 (텍스트 레이블만 표시)
      const marker = new window.google.maps.Marker({
        position: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude)
        },
        map: mapInstance,
        title: name,
        icon: {
          url: labelIconData.url,
          size: labelIconData.size,
          anchor: labelIconData.anchor
        }
      });

      // 마커에 식별자 및 최소 줌 레벨 추가
      marker._isPOIMarker = true;
      marker._minZoom = minZoom;

      // 현재 줌 레벨 확인하여 표시 여부 결정
      const currentZoom = mapInstance.getZoom();
      if (currentZoom < minZoom) {
        marker.setMap(null); // 줌 레벨이 낮으면 숨김
      }

      // 마커 저장
      poiMarkersRef.current.push(marker);
      setPoiMarkers([...poiMarkersRef.current]);

      return marker;
    } catch (error) {
      console.error('POI 마커 생성 중 오류:', error);
      return null;
    }
  }, [mapInstance, createTextLabel, updateMarkersVisibility]);

  // 여러 POI 마커 생성 (데이터 배열로)
  const createPOIs = useCallback((poiDataList) => {
    if (!mapInstance) {
      console.warn('지도 인스턴스가 없습니다.');
      return;
    }

    if (!window.google || !window.google.maps) {
      console.warn('Google Maps API가 로드되지 않았습니다.');
      return;
    }

    if (!Array.isArray(poiDataList) || poiDataList.length === 0) {
      return;
    }

    // 기존 POI 마커들 제거
    clearPOIs();

    // 모든 POI 마커 생성
    poiDataList.forEach((poiData, index) => {
      if (!poiData.latitude || !poiData.longitude || !poiData.name) {
        console.warn(`POI 데이터 ${index}번째 항목에 필요한 정보가 없습니다.`);
        return;
      }

      try {
        // 폰트 크기 가져오기 (기본값 14)
        const fontSize = poiData.fontSize || 14;
        // 최소 줌 레벨 가져오기 (기본값 15)
        const minZoom = poiData.minZoom || 15;

        // 텍스트 레이블 아이콘 생성 (폰트 크기 전달)
        const labelIconData = createTextLabel(poiData.name, fontSize);

        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(poiData.latitude),
            lng: parseFloat(poiData.longitude)
          },
          map: mapInstance,
          title: poiData.name,
          icon: {
            url: labelIconData.url,
            size: labelIconData.size,
            anchor: labelIconData.anchor
          }
        });

        // 마커에 식별자 및 최소 줌 레벨 추가
        marker._isPOIMarker = true;
        marker._minZoom = minZoom;

        // 현재 줌 레벨 확인하여 표시 여부 결정
        const currentZoom = mapInstance.getZoom();
        if (currentZoom < minZoom) {
          marker.setMap(null); // 줌 레벨이 낮으면 숨김
        }

        poiMarkersRef.current.push(marker);
      } catch (error) {
        console.error(`POI 마커 ${index} 생성 중 오류:`, error);
      }
    });

    setPoiMarkers([...poiMarkersRef.current]);

    // 첫 번째 POI 위치로 지도 중심 이동 제거 (초기 로드 시 지도 위치 변경 방지)
    // if (poiDataList.length > 0 && poiDataList[0].latitude && poiDataList[0].longitude) {
    //   mapInstance.setCenter({
    //     lat: parseFloat(poiDataList[0].latitude),
    //     lng: parseFloat(poiDataList[0].longitude)
    //   });
    // }
  }, [mapInstance, clearPOIs, createTextLabel, updateMarkersVisibility]);

  // 단일 POI 마커 제거 (하위 호환성)
  const clearPOI = clearPOIs;

  return {
    poiMarkers,
    createPOI,
    createPOIs,
    clearPOI,
    clearPOIs
  };
};

export default usePOI;
