import styled from '@emotion/styled';
import { theme } from '@/styles/Theme';

export const EditButtonWrapper = styled.div`
  display: flex;
  gap: 5px;
  font-family: 'Sweet';
  font-size: 1rem;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-shrink: 0;
`;

export const EditButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;

  font-weight: 500;
  color: black;
  transition: all 0.2s ease-in-out;
  font-family: 'Sweet';

  &:hover {
    font-weight: 800;
  }
`;