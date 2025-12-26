import styled from '@emotion/styled';
import { theme } from '@/styles/Theme';

export const MapSearchContainer = styled.div`
  position: fixed;
  top: 16px;
  left: 320px;
  right: 20px;
  z-index: 10;

  ${theme.media.mobile} {
    left: 0px;
    right: unset;
    top: unset;
    width: calc(100dvw - 70px);
    margin: 12px 8px;
  }
`
export const MapSearchForm = styled.form`
  width: 300px;
  height: 40px;
  border: 1.6px solid black;
  border-radius: 20px;
  padding: 12px 15px 12px 20px;
  font-size: 1.2rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  color: black;
  justify-content: space-between;
  gap: 10px;

  &:focus-within {
    outline: 1px solid #74b7ff;
  }

  &:hover {
    outline: 1px solid #74b7ff;
  }

  ${theme.media.mobile} {
    width: 100%;
  }
`

export const MapSearchInput = styled.input`
  width: 100%;
  height: 200%;
  border: none;
  outline: none;
  font-size: 1.2rem;
  background-color: transparent;
  color: black;
  
  /* iOS Safari에서 인풋 포커스 시 확대 방지 */
  font-size: 16px;
  -webkit-appearance: none;
  -webkit-border-radius: 0;
  border-radius: 0;
  
  /* iOS에서 줌 방지 */
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    font-size: 16px !important;
  }
  
  ${theme.media.mobile} {
    font-size: 16px;
  }
`

export const MapSearchButton = styled.button`
  background-color: transparent;
  cursor: pointer;
`

export const MapSearchResultsList = styled.ul`
  margin-top: 8px;
  margin-left: 5px;
  width: 292px;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  position: relative;
  z-index: 10;

  ${theme.media.mobile} {
    width: calc(100dvw - 78px);
    margin-left: 5px;
  }
`

export const MapSearchResultItem = styled.li`
  padding: 12px 14px 12px 18px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:first-of-type {
    padding-top: 14px;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`

export const MapSearchResultItemName = styled.div`
  font-weight: 600;
  margin-bottom: 7px;
  color: #333;
  font-size: 1.1rem;
`

export const MapSearchResultItemAddress = styled.div`
  color: #666;
  font-size: 0.8rem;
  line-height: 1.2;
`