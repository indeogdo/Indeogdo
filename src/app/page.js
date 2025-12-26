'use client';

import { useEffect } from 'react';


export default function Home() {

  useEffect(() => {
    // 버말로 POI 데이터 설정
    window.poiData = [
      // {
      //   latitude: 37.40290728423603,
      //   longitude: 126.97292833814231,
      //   name: '벌말로',
      //   fontSize: 14,
      //   minZoom: 17
      // },
      {
        latitude: 37.402860408746776,
        longitude: 126.97339772471992,
        name: '비그라운드\n아키텍츠',
        fontSize: 12,
        minZoom: 19
      },
      {
        latitude: 37.40440150071914,
        longitude: 126.97294095933603,
        name: '관악대로',
        fontSize: 14,
        minZoom: 17
      },
      {
        latitude: 37.39989469326408,
        longitude: 126.97684265610809,
        name: '흥안대로',
        fontSize: 14,
        minZoom: 17
      },
      {
        latitude: 37.40375422258425,
        longitude: 126.97783989395577,
        name: '과천대로',
        fontSize: 14,
        minZoom: 17
      }
    ];

    return () => {
      if (window.poiData) {
        delete window.poiData;
      }
    };
  }, []);

  return <></>;
}
