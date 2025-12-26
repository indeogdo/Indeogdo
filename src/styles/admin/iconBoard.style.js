'use client';

import styled from '@emotion/styled';

export const IconBoardWrapper = styled.div`
  width: 310px;
  max-height: 92dvh;
  background-color: white;
  border-radius: 8px;
  border: 1.6px solid black;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 18px;
  // padding-bottom: 0px;
  position: fixed;
  top: 15px;
  left: 530px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const IconHeader = styled.div`
  display: flex;
  gap: 15px;
`;

export const IconTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: black;
`;

export const IconToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: black;
`;

export const IconList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  display: ${props => props.$isExpanded ? 'flex' : 'none'};
  transition: height 0.3s ease-in-out;
  // padding-top: 0px;
  margin-top: 5px;
  overflow-y: auto;
  padding-bottom: 20px;
  padding-top: 20px;

    /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

export const IconItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 8px;
  padding: 10px;
  position: relative;
  display: flex;
  // flex-direction: column;
  gap: 13px;
`;

export const IconThumb = styled.img`
  width: 42px;
  height: 42px;
  object-fit: cover;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;  
  right: -9px;
  top: -8px;
  padding: 4px 6px;
  // width: 20px;
  // height: 20px;
  border-radius: 50%;
  background-color: rgb(158, 158, 158);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;

  &:hover {
    background-color: red;
  }

  &:active {
    transform: scale(0.95);
  }
`;



export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 25px;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

export const FileInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
`;

export const ImagePreview = styled.img`
  width: 100%;
  max-width: 70px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: -3px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

export const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #5a6268;
  }
`;