'use client';

import { useEffect } from 'react';
import useMapPolygon from '@/hooks/map/useMapPolygon';
import useUndergroundSetting from '@/hooks/useUndergroundSetting';
import { undergroundPolygonData } from '@/lib/undergroundPolygonData';

function MapUndergroundLayer({ mapInstance, mapInitialized, zoomLevel }) {
  const {
    setting,
    display,
    loading,
    loadSetting,
  } = useUndergroundSetting({ autoFetch: false });

  useEffect(() => {
    if (!mapInitialized) return;
    loadSetting();
  }, [mapInitialized, loadSetting]);

  const coordinates = display ? undergroundPolygonData.coordinates : [];

  useMapPolygon({
    mapInstance,
    coordinates,
    fillColor: undergroundPolygonData.fillColor,
    strokeColor: undergroundPolygonData.strokeColor,
    strokeWidth: undergroundPolygonData.strokeWidth,
    fillOpacity: undergroundPolygonData.fillOpacity,
    strokeOpacity: undergroundPolygonData.strokeOpacity,
    zoomLevel,
    options: {
      zIndex: undergroundPolygonData.zIndex,
    }
  });

  // no DOM
  return null;
}

export default MapUndergroundLayer;

