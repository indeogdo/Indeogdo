'use client';

import { useEffect } from 'react';
import useMapPolyline from '@/hooks/map/useMapPolyline';
import { polylinesData } from '@/lib/polylinesData';

/**
 * 지도에 여러 개의 Polyline을 표시하는 컴포넌트
 */
function MapPolylines({ mapInstance, mapInitialized, zoomLevel }) {
  if (!mapInitialized || !mapInstance) {
    return null;
  }

  return (
    <>
      {polylinesData.map((polyline) => (
        <PolylineItem
          key={polyline.id}
          mapInstance={mapInstance}
          zoomLevel={zoomLevel}
          polylineData={polyline}
        />
      ))}
    </>
  );
}

function PolylineItem({ mapInstance, zoomLevel, polylineData }) {
  const { createPolyline, removePolyline } = useMapPolyline({
    mapInstance,
    coordinates: polylineData.coordinates,
    strokeColor: polylineData.strokeColor,
    strokeOpacity: polylineData.strokeOpacity ?? 1,
    strokeWeight: polylineData.strokeWeight ?? 2,
    geodesic: polylineData.geodesic ?? false,
    minZoom: polylineData.minZoom ?? null,
    zoomLevel,
    options: {
      ...(polylineData.dashArray
        ? {
          icons: [
            {
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 1
              },
              offset: '0',
              repeat: `${polylineData.dashArray[0]}px`
            }
          ]
        }
        : {}),
      ...(polylineData.zIndex !== undefined ? { zIndex: polylineData.zIndex } : {}),
      ...(polylineData.options || {})
    }
  });

  useEffect(() => {
    const shouldShow = polylineData.visible !== false && (polylineData.coordinates?.length ?? 0) >= 2;

    if (!mapInstance || !shouldShow) {
      removePolyline();
      return undefined;
    }

    createPolyline();

    return () => {
      removePolyline();
    };
  }, [
    mapInstance,
    polylineData.visible,
    polylineData.coordinates,
    createPolyline,
    removePolyline
  ]);

  return null;
}

export default MapPolylines;




