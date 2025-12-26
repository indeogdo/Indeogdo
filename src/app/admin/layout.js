'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/admin/LoginModal';


export default function AdminLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료된 후에만 인증 상태 확인
    if (!loading) {
      if (!isAuthenticated) {
        // 인증되지 않은 경우 로그인 모달 표시
        setShowLoginModal(true);
      } else {
        // 인증된 경우 모달 닫기
        setShowLoginModal(false);
      }
    }
  }, [isAuthenticated, loading]);

  const handleModalClose = () => {
    // 모달이 닫히면 메인 페이지로 리다이렉트
    router.push('/');
  };

  const handleLoginSuccess = () => {
    // 로그인 성공 시 모달 닫기 (isAuthenticated 변경으로 자동 처리됨)
    setShowLoginModal(false);
  };

  // 로딩 중이거나 인증되지 않은 경우 로그인 모달만 표시
  if (loading) {
    return null; // 또는 로딩 스피너
  }

  if (!isAuthenticated) {
    return <LoginModal isOpen={showLoginModal} onClose={handleModalClose} onLoginSuccess={handleLoginSuccess} />;
  }

  // 인증된 경우에만 children 렌더링
  return (
    <>
      {children}
    </>
  );
} 