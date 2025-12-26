'use client';
import styled from '@emotion/styled';

const AddButtonWrapper = styled.button`
  background-color: #fff;
  border: 1px solid gray;
  border-radius: 12px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: ${props => props.$themeSize ? '1.2rem' : '0.9rem'};
  font-weight: 500;
  color: black;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: ${props => props.$themeSize ? '40px' : 'auto'};

  &:hover {
    background-color: #f0f0f0;
  }
`;

function AddButton({ onClick, children, $themeSize }) {

  return (
    <AddButtonWrapper type="button" onClick={onClick} $themeSize={$themeSize}>
      {children}
    </AddButtonWrapper>
  );
}

export default AddButton;