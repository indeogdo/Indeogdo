'use client';

import styled from '@emotion/styled';
import { theme } from '@/styles/Theme';

export const NavigationWrapper = styled.div`
  position: fixed;
  top: 15px;
  left: 0;
  width: ${props => props.isAdmin ? '500px' : '300px'};
  max-height: ${props => props.isAdmin ? '92dvh' : '80dvh'};
  background-color: white;
  border-radius: 0 8px 8px 0;
  border: 1.6px solid black;
  border-left: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: ${props => props.isAdmin ? '0px 16px 16px 16px' : '16px'};
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 10;
  color: black;

    /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  ${theme.media.mobile} {
    top: ${props => props.$isOpen ? '58px' : '62px'};
    left: unset;
    right: 7px;
    border-radius: ${props => props.$isOpen ? '10px 10px 10px 10px' : '50%'};
    border: 1.5px solid black;
    transition: all 0.8s ease-in-out;
    width: ${props => props.$isOpen ? '250px' : '43px'};
    min-height: 41px;
    max-height: ${props => props.$isOpen ? '30dvh' : '41px'};
    padding: ${props => props.$isOpen ? '0px 12px 20px 5px' : '0'};
  }
`;

export const MobileToggleButton = styled.button`
  display: none;
  ${theme.media.mobile} {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    position: fixed;
    right: 6.6px;
    top: ${props => props.$isOpen ? '64px' : '60px'};
    z-index: 20;
    min-height: 40px;
    min-width: 40px;
  }
`;

export const HamburgerIcon = styled.div`
  display: none;
  width: 24px;
  height: 12px;
  position: relative;
  cursor: pointer;
  
  ${theme.media.mobile} {
    display: block;
  }
`;

export const HamburgerIconSpan = styled.span`
  display: block;
  width: 90%;
  height: 2px;
  border-radius: 2px;
  background-color: black;
  position: absolute;
  transition: all 0.5s ease;
  outline: 2px solid white;
  
  &:nth-of-type(1) {
    top: ${props => props.$isOpen ? '2px' : '0px'};
    transform: ${props => props.$isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
  }
  
  &:nth-of-type(2) {
    top: 7px;
    opacity: ${props => props.$isOpen ? '0' : '1'};
    transform: ${props => props.$isOpen ? 'translateX(20px)' : 'translateX(0px)'};
  }
  
  &:nth-of-type(3) {
    top: ${props => props.$isOpen ? '2px' : '14px'};
    transform: ${props => props.$isOpen ? 'rotate(-45deg)' : 'rotate(0deg)'};
  }
`;

export const ThemeList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  padding: 0;
  transition: all 0.5s ease;

  ${theme.media.mobile} {
    height: ${props => props.$isOpen ? '100%' : '0'};
    padding-top: 2px;
    margin-left: -2px;
    gap: 0;
    opacity: ${props => props.$isOpen ? '1' : '0'};
  }
`;

export const ThemeItem = styled.div`
  margin-bottom: 0px;
  font-family: 'Sweet';
`;

export const ThemeHeader = styled.div`
  padding: 12px;
  border-radius: 6px;
  font-weight: ${props => props.$isExpanded ? '800' : '800'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  font-family: 'Sweet';
  font-size: 1.7rem;

  ${theme.media.mobile} {
    font-size: 1.5rem;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 0;
    margin-left: -3px;
    padding-bottom: 6px;
  }
`;

export const ExpandIcon = styled.div`
  font-size: 1rem;
  color: #666;
  transition: transform 0.2s ease;
  margin-left: auto;
  padding-left: 5px;
  margin-top: -5px;

  ${theme.media.mobile} {
    margin-top: -1px;
    margin-left: 2px;
    margin-right: 10px;
  }
`;

export const ThemeTitle = styled.div`
  color: black;
  padding-right: 15px;
  font-family: 'Sweet';
  ${theme.media.mobile} {
    flex: unset;
    font-size: 1.4rem;
  }
`;

export const EmptyText = styled.div`
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
  font-family: 'Sweet';
`;

// Cluster 관련 스타일

export const ClusterList = styled.div`
  margin-top: 8px;
  margin-left: 14px;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  flex-direction: column;
  height: ${props => props.$isVisible ? 'auto' : '0'};
  // overflow-y: hidden;
  transition: height 0.3s ease;
  margin-bottom: 40px;
  margin-right: 9px;
  line-height: 1.5;

  ${theme.media.mobile} {
    margin-bottom: 30px;
  }
`;

export const ClusterItem = styled.li`
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-family: 'Sweet';
  font-size: 1.3rem;
  list-style: none;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  color: ${props => props.$isActive ? 'black' : '#333'};
  margin-right: 9px;

  &:hover {
    // color:rgb(50, 149, 255);
    font-weight: 800;
  }

  ${theme.media.mobile} {
    font-size: 1.3rem;

  }
`;

export const ClusterTitle = styled.div`
  flex: 1;
  color: black;
  font-family: 'Sweet';
  font-weight: ${props => props.$isActive ? '700' : '500'};
`;

export const ToggleSwitch = styled.button`
  position: relative;
  width: 35px;
  height: 16px;
  background-color: ${props => props.$isActive ? 'black' : '#ccc'};
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
  margin-top: 4px;

  &:hover {
    background-color: ${props => props.$isActive ? 'black' : '#bbb'};
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
  }

  ${theme.media.mobile} {
    margin-top: 5px;
  }
`;

export const ToggleSlider = styled.div`
  position: absolute;
  top: 0px;
  left: ${props => props.$isActive ? '22px' : '0px'};
  width: 15px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: left 0.3s ease;
  box-shadow: 0 2px 6px rgba(25, 37, 103, 0.42);
`;

// 인라인 편집 관련 스타일
export const ClusterTitleInput = styled.input`
  flex: 1;
  padding: 8px 8px;
  border: 1px solid #192567;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 800;
  background-color: white;
  outline: none;
  
  &:focus {
    border-color: #4A90E2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

export const EditActionButtons = styled.div`
  display: flex;
  gap: 5px;
  font-weight: 800;
  font-family: 'Sweet';
  font-size: 0.9rem;
`;

export const SaveButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;


  &:hover {
    background-color: #45a049;
  }
`;

export const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #da190b;
  }
`;

export const OrderButton = styled.button`
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  color: black;
  transition: background-color 0.2s ease;
  background-color: ${props => props.$disabled ? '#f0f0f0' : '#fff'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    background-color: #e9ecef;
  }
`;



// 관리자 Site 목록 관련 스타일
export const ClusterContainer = styled.div`
  margin-bottom: 5px;

  ${theme.media.mobile} {
    margin-bottom: 6px;
  }
`;

export const SiteList = styled.ul`
  margin-left: 30px;
  padding-top: 2px;
  padding-left: 14px;
  border-left: 2px solid #e0e0e0;
  margin-bottom: ${props => props.$isActive ? '10px' : '0'};
  list-style: none;
  height: ${props => props.$isActive ? '100%' : '0px'};
  opacity: ${props => props.$isActive ? '1' : '0'};
  transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out;
`;

export const SiteItem = styled.li`
  padding: 3px 8px;
  // margin-bottom: 0.5px;
  // background-color: #f8f9fa;
  border-radius: 4px;
  // border: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  align-items: flex-start;


  &:hover {
    background-color: #e9ecef;
  }
`;

export const SiteIcon = styled.img`
  width: 14px;
  height: 14px;
  object-fit: cover;
  margin-top: 2.6px;
`;

export const SiteTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: black;
  margin-right: auto;
  word-break: break-all;
`;

export const AdminSiteList = styled.div`
  margin-left: 30px;
  margin-top: 12px;
  padding-left: 20px;
  border-left: 2px solid #e0e0e0;
  margin-bottom: 10px;
`;

export const AdminSiteItem = styled.div`
  padding: 6px 8px;
  margin-bottom: 4px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #e9ecef;
  }
`;

export const AdminSiteTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: black;
  // margin-bottom: 2px;
  margin-right: auto;
`;

export const AdminSiteIcon = styled.img`
  width: 15px;
  height: 15px;
  object-fit: cover;
`;

export const CreditButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #444;
  text-align: center;
  margin-top: 10px;
  font-family: 'Sweet';
  font-weight: 500;
  margin-bottom:10px;
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-color: black;
  text-decoration-thickness: 1.2px;
  text-decoration-style: solid;

  ${theme.media.mobile} {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    margin-top: 40px;
  }
`;

export const CreditList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CreditItem = styled.li`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: black;
  font-family: 'Sweet';
  font-weight: 400;
  font-size: 1.1rem;
  line-height: 1.5;
  word-break: keep-all;

    & span:first-of-type {
    font-weight: 700;
    flex-shrink: 0;
    width: 80px;
    display: inline-block;
    text-align: right;
  }
`;

export const CreditItemContent = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: black;
  font-family: 'Sweet';
  font-weight: 400;
  font-size: 1.1rem;
  line-height: 1.5;
  word-break: keep-all;
`;

export const CopyRight = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-top: 10px;
  font-family: 'Sweet';

  ${theme.media.mobile} {
    margin-left: 40px;
    margin-right: 40px;
    line-height: 1.3;
    display: ${props => props.$isOpen ? 'block' : 'none'};
  }
`;

export const ClusterSettingWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  margin-left: 30px;
  margin-right: 8px;
  margin-bottom: -12px;
  padding-bottom: 14px;
  justify-content: flex-end;
  border-left: 2px solid #e0e0e0;
  color: black;
  font-family: 'Sweet';
  font-weight: 500;
  font-size: 0.9rem;
`;

export const ClusterSettingList = styled.ul`
  display: flex;
  gap: 15px;
  align-items: center;
`;

export const ClusterSettingItem = styled.li`
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const ClusterSettingButton = styled.input`
  width: 16px;
  height: 16px;
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
`;