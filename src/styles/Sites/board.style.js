'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { theme } from '@/styles/Theme';

export const BoardWrapper = styled.div`
  position: fixed;
  font-family: 'Sweet';
  color: black;
  top: 70px;
  right:  ${props => {
    // 마운트 전에는 화면 밖에 위치
    if (!props.$isMounted) {
      switch (props.$widthMode) {
        case 'wide': return '-100%';
        case 'normal': return '-40dvw';
        case 'narrow': return '-100%';
        default: return '-40dvw';
      }
    }
    // 마운트 후에는 widthMode에 따라 위치 결정
    switch (props.$widthMode) {
      case 'narrow': return 'calc( -40dvw + 60px)';
      default: return '0';
    }
  }};
  width: ${props => {
    switch (props.$widthMode) {
      case 'wide': return 'calc(100dvw - 390px)';
      case 'normal': return '40dvw';
      // case 'narrow': return '60px';
      default: return '40dvw';
    }
  }};
  height: calc(100dvh - 70px);
  background-color: white;
  border-radius: 12px 0 0 0;
  box-shadow: 0 4px 20px rgba(9, 36, 50, 0.39);
  overflow: hidden;
  z-index: 10;
  display: flex;
  border: 2px solid black;
  border-right: none;
  border-bottom: none;
  transition: width 0.8s ease-in-out, right 0.7s ease-out, box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 4px 30px rgba(6, 109, 160, 0.8);
  }

  /* 모바일에서의 스타일 */
  ${theme.media.mobile} {
    width: calc(100dvw - 20px);
    margin: 0 10px;
    top: unset;
    bottom: 10px;
    right: unset;
    border-radius: 12px;
    border: 1px solid black;
    height: 80dvh;
    flex-direction: column;
    z-index: 5;
    display: ${props => props.$isVisible === false ? 'none' : 'flex'};


    &:hover {
      box-shadow: 0 0px 20px rgba(12, 73, 104, 0.56);
    }

    &:article{
      transition: opacity 0.5s ease-in-out;
      display: ${props => props.$isVisible ? 'block' : 'none'};
      opacity:  ${props => props.$isVisible ? '1' : '0'};
    }
  }
`;

export const BoardButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  min-width: 50px;
  margin-right: 15px;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  position: relative;
  z-index: 2;
  

  ${theme.media.mobile} {
    padding-top: 5px;
    padding-right:0px;
  }
`;

export const BoardButtonMobile = styled.button`
  display: none;
  ${theme.media.mobile} {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    border-radius: 50%;
    margin-left: auto;
    font-family: 'Sweet';
    position: relative;
    width: 30px;
    height: 30px;
    margin-top: 3px;
    margin-right: -5px;
    transition: opacity 0.2s ease-in-out;

    span {
      position: absolute;
      width: 24px;
      height: 3px;
      background-color: black;
      border-radius: 4px;

      &:first-of-type {
        transform: rotate(45deg);
      }

      &:last-of-type {
        transform: rotate(-45deg);
      }
    }
  }
`;

export const BoardButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-size: 2rem;
  font-weight: 100;
  color: ${props => props.$disabled ? '#ccc' : 'black'};
  opacity: 0.7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
  padding: 8px 13px;
  padding: ${props => {
    switch (props.$widthMode) {
      case 'wide': return '8px 14px 8px 12px';
      case 'normal': return '8px 13px';
      case 'narrow': return '8px 10px 8px 15px';
      default: return '8px 13px';
    }
  }};

  &:hover {
    background-color: ${props => props.$disabled ? 'transparent' : '#f0f0f0'};
    opacity: ${props => props.$disabled ? 0.3 : 1};
  }

  ${theme.media.mobile} {
    display: none;
  }
`;

// Board 상세 내용 로딩 시 fade-in 애니메이션
export const BoardLoadingOpacity = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const BoardDetailWrapper = styled.article`
  padding: 0px 0px 30px 0px;
  overflow-y: auto;
  width: 100%;
  max-width: 800px;
  position: relative;
  // height: 100%;
  animation: ${BoardLoadingOpacity} 0.8s ease-in-out;
    
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  ${theme.media.mobile} {
    // padding: 30px 20px;
    padding-bottom: 30px;
    margin-top: -35px;
    // padding-top: 18px;
    max-width: unset;
  }
`;

export const ScrollToTopButton = styled.button`
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid white;
  border-radius: 50%;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  ${theme.media.mobile} {
    bottom: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
    font-size: 1.4rem;
  }
`;

export const BoardHeader = styled.header`
  // background-color: white;
  background-image: linear-gradient(to bottom,rgba(255, 255, 255, 0.95) 70%, #ffffff00 100%);
  padding-top: 30px;
  padding-bottom: 40px;
  position: sticky;
  top: 0px;
  z-index: 1;

  ${theme.media.mobile} {
    padding: 10px 20px 30px 15px;
    // margin-top: -18px;
    top: -50px;
    padding-bottom: 40px;
  }
`

export const BoardClusterWrapper = styled.div`
  display: flex;
  gap: 7px;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  z-index: 10;


  ${theme.media.mobile} {
    margin-bottom: 25px;
    gap: 7px;
    margin-left: 0px;
    position: static;
  }
`;

export const BoardClusterIcon = styled.img`
  width: 25px;
  height: 25px;
  object-fit: cover;

  ${theme.media.mobile} {
    width: 22px;
    height: 22px;
  }
`;

export const BoardClusterTitle = styled.h2`
  font-size: 1.7rem;
  font-weight: 800;
  color: black;
  white-space: nowrap;

  ${theme.media.mobile} {
    font-size: 1.4rem;
    font-weight: 800;
    padding-bottom: 1px;
  }
`;

export const SameLocationNav = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 3px;
  margin-right: 20px;
  // margin-top: -2px;

  ${theme.media.mobile} {
    position: fixed;
    bottom: 23px;
    left: 25px;
    z-index: 3;
    margin-right: unset;
  }
`;

export const SameLocationButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid black;
  background-color: white;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  color: black;

  &:hover {
    background-color: #f4f4f4;
  }

  &:active {
    transform: translateY(1px);
  }

  ${theme.media.mobile} {
    width: 30px;
    height: 30px;
    font-size: 0.95rem;
  }
`;

export const SameLocationIndicator = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: black;

  ${theme.media.mobile} {
    font-size: 0.85rem;
  }
`;

export const BoardTitle = styled.h1`
  font-size: 2.3rem;
  font-weight: 800;
  margin-bottom: 7px;
  color: black;
  line-height: 1.2;
  word-break: keep-all;

  ${theme.media.mobile} {
      position: sticky;
      top: -7px;
      font-size: 2rem;
      z-index: 10;
      width: calc(100% - 30px);
  }
`;

export const BoardAddress = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: black;
  line-height: 1.4;

  ${theme.media.mobile} {
    margin-left: 3px;
  }
`


// --------------------------------------------  boardedit 스타일

export const BoardEditWrapper = styled.div`
  padding: 40px 30px 10px 0px;
  width: 100%;
  overflow-y: auto;

    /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`

export const BoardEditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`

export const BoardHeaderWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  position: relative;
`

export const BoardInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
  width: 100%;
`

export const BoardInputLabel = styled.label`
  font-size: 1.2rem;
  font-weight: 700;
  color: black;
`

export const BoardInputError = styled.span`
  display: block;
  margin-top: 6px;
  margin-left: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #d64545;
`

export const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const AddressItem = styled.div`
  display: flex;
  gap: 6px;
  // align-items: center;
`

export const AddressInputWrapper = styled.div`
  flex: 1;
`

export const AddressActions = styled.div`
  display: flex;
  align-items: center;
`

export const AddressAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 11px 12px;
  margin-right: 0px;
  font-size: 0.95rem;
  font-weight: 600;
  color: black;
  background-color: #fff;
  border: 1px dashed black;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const CoordinatesInputWrapper = styled.div`
  flex: 1;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`

export const CoordinatesInputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const AddressRemoveButton = styled.button`
  padding: 6px 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #d64545;
  background: transparent;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  min-width: 30px;
  flex-shrink: 0;
  padding-top: 14px;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #999;
  }
`

export const BoardTextInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  font-weight: 600;
  color: black;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 8px;
  outline: none;

  &::placeholder {
    color: #999;
    font-weight: 500;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }

  ${theme.media.mobile} {
    border-width: 1px;
  }
`

export const BoardSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  font-weight: 600;
  color: black;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 8px;
  outline: none;

  ${theme.media.mobile} {
    border-width: 1px;
  }
`

export const IconPreview = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
  border: 1px solid black;
  border-radius: 4px;
`

// Custom dropdown for icons
export const IconSelectWrapper = styled.div`
  // position: relative;
`

export const IconSelectButton = styled.button`
  width: 49px;
  height: 47px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${props => props.$iconOpen ? '#fff' : '#ccc'};
  color: black;
  font-weight: 600;
  border: 1px solid black;
  border-radius: 8px;
  cursor: pointer;
`

export const IconSelectList = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #fff;
  border: 1px solid black;
  border-radius: 8px;
  max-height: 260px;
  overflow-y: auto;
  z-index: 30;
  box-shadow: 0 4px 20px rgba(9, 36, 50, 0.32);
  list-style: none;
  margin: 0;
  padding: 6px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`

export const IconSelectItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background:rgb(230, 230, 230);
  }
`

export const IconThumb = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
`

export const BoardClusterSelectWrapper = styled.div`
  flex-grow: 1;
`

export const BoardClusterSelect = styled.select`
  width: 100%;
  padding: 10.3px 12px;
  font-size: 1.3rem;
  font-weight: 600;
  color: black;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 8px;
  outline: none;
`
export const AddressWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 4px;
  align-items: center;
  justify-content: space-between;
`

export const AreaSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  // margin-bottom: 10px;
  margin-right: 5px;
`

export const AreaSwitchLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
`

export const AreaToggleSwitch = styled.button`
  position: relative;
  width: 40px;
  height: 20px;
  background-color: ${props => props.$isActive ? 'black' : '#ccc'};
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
  flex-shrink: 0;

  &:hover {
    background-color: ${props => props.$isActive ? '#333' : '#bbb'};
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
  }
`

export const AreaToggleSlider = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.$isActive ? '22px' : '2px'};
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: left 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
`


export const BoardLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`