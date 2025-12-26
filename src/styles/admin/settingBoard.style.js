import styled from '@emotion/styled';

export const SettingBoardWrapper = styled.div`
  width: 180px;
  height: auto;
  background-color: white;
  border-radius: 8px;
  border: 1.6px solid black;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 18px;
  position: fixed;
  top: 15px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SettingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const SettingTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  color: #111;
  flex: 1;
  word-break: keep-all;
`;

export const SettingList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SettingItem = styled.li`
  display: flex;
  justify-content: space-between;
  // align-items: center;
  gap: 15px;
`;

export const SettingItemTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
  flex-grow: 1;
  flex-shrink: 0;
`;

export const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

export const ToggleLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#1f9d55' : '#a1a1aa')};
`;

export const ToggleSwitch = styled.button`
  width: 37px;
  height: 18px;
  border-radius: 999px;
  border: none;
  padding: 2px;
  display: flex;
  align-items: center;
  background-color: ${({ $active }) => ($active ? '#000' : '#d4d4d8')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background-color 0.2s ease;
`;

export const ToggleThumb = styled.span`
  width: 17px;
  height: 17px;
  background: #fff;
  border-radius: 50%;
  transform: ${({ $active }) => ($active ? 'translateX(17px)' : 'translateX(0)')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
`;

export const StatusText = styled.p`
  font-size: 0.85rem;
  color: #555;
  line-height: 1.4;
  margin-left: 3px;
  margin-top: 5px;
`;

