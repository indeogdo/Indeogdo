'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로그인 함수
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Supabase 인증을 통한 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // 에러 메시지를 한국어로 변환
        let errorMessage = '로그인에 실패했습니다.';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = '이메일 인증이 완료되지 않았습니다.';
        } else {
          errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        });
        return { success: true };
      }

      return { success: false, error: '로그인에 실패했습니다.' };
    } catch (error) {
      return { success: false, error: error.message || '로그인 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 발생해도 로컬 상태는 초기화
      setUser(null);
    }
  };

  // 회원가입 함수
  const register = async (email, password, name) => {
    try {
      setLoading(true);

      // Supabase 회원가입
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        let errorMessage = '회원가입에 실패했습니다.';
        if (error.message.includes('User already registered')) {
          errorMessage = '이미 등록된 이메일입니다.';
        } else if (error.message.includes('Password')) {
          errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
        } else {
          errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || email.split('@')[0],
        });
        return { success: true };
      }

      return { success: false, error: '회원가입에 실패했습니다.' };
    } catch (error) {
      return { success: false, error: error.message || '회원가입 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩 시 세션 확인 및 인증 상태 변경 감지
  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // 정리 함수
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
