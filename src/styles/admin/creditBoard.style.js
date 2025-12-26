import styled from '@emotion/styled';

export const CreditBoardWrapper = styled.div`
  width: 400px;
  height: auto;
  background-color: white;
  border-radius: 8px;
  border: 1.6px solid black;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 18px;
  position: fixed;
  top: 15px;
  left: 870px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CreditHeader = styled.div`
  display: flex;
  gap: 15px;
`;

export const CreditTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: black;
`;

export const CreditToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: black;
`;

export const CreditList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  display: ${props => props.$isExpanded ? 'flex' : 'none'};
  transition: height 0.3s ease-in-out;
  margin-left: 5px;
  flex-direction: column;
`;

export const CreditItem = styled.li`
  display: flex;
  gap: 16px;
  flex-grow: 1;
  align-items: center;
`;

export const CreditItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 8px;
  padding: 10px;
  position: relative;
  display: flex;
  // flex-direction: column;
  align-items: flex-start;
  gap: 13px;
  line-height: 1.5;
  word-break: keep-all;

  & span:first-of-type {
    font-weight: 800;
    flex-shrink: 0;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;  
  right: -11px;
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

export const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
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

export const CreditEditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid black;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
`;

export const EditInputGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

export const EditButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const SaveButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const CancelEditButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #5a6268;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const OrderButton = styled.button`
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${props => props.disabled ? '#f0f0f0' : '#fff'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.9rem;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }
`;

export const OrderSaveButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover:not(:disabled) {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const OrderCancelButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover:not(:disabled) {
    background-color: #da190b;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;