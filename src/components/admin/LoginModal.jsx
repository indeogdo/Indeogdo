'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/common/Modal';
import { useAuth } from '@/contexts/AuthContext';
import styled from '@emotion/styled';

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Sweet';
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 0.9rem;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Sweet';
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoginButton = styled(Button)`
  background-color: #007bff;
  color: white;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background-color: #545b62;
  }
`;

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // 로그인 성공 시 모달만 닫기 (admin layout에서 isAuthenticated 변경을 감지하여 처리)
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        const errorMessage = result.error || '로그인에 실패했습니다.';
        setError(errorMessage);
        // 로그인 실패 시 알림 표시
        alert(errorMessage);
      }
    } catch (err) {
      const errorMessage = '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      // 예외 발생 시 알림 표시
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // 취소 시 메인 페이지로 리다이렉트
    router.push('/');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="관리자 로그인">
      <LoginForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
            disabled={isLoading}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
            disabled={isLoading}
          />
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonGroup>
          <CancelButton type="button" onClick={handleCancel} disabled={isLoading}>
            취소
          </CancelButton>
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </LoginButton>
        </ButtonGroup>
      </LoginForm>
    </Modal>
  );
}

