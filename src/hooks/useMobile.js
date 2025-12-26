'use client';

import { useState, useEffect } from 'react';

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 초기 체크
    checkIsMobile();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', checkIsMobile);

    // 클린업
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useMobile;
