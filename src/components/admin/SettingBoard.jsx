'use client';

import * as S from '@/styles/admin/settingBoard.style';
import useUndergroundSetting from '@/hooks/useUndergroundSetting';

function SettingBoard() {
  const {
    setting: undergroundSetting,
    display: isActive,
    loading,
    saving,
    toggleDisplay,
  } = useUndergroundSetting();

  return (
    <S.SettingBoardWrapper>
      <S.SettingHeader>
        <S.SettingTitle>환경설정</S.SettingTitle>
      </S.SettingHeader>

      <S.SettingList>
        <S.SettingItem>
          <S.SettingItemTitle>지하철</S.SettingItemTitle>

          <S.ToggleWrapper>
            {/* <S.ToggleLabel>{isActive ? 'ON' : 'OFF'}</S.ToggleLabel> */}
            <S.ToggleSwitch
              type="button"
              onClick={toggleDisplay}
              $active={isActive}
              disabled={loading || saving || !undergroundSetting}
            >
              <S.ToggleThumb $active={isActive} />
            </S.ToggleSwitch>
            <S.StatusText>
              {loading && !undergroundSetting
                ? '설정을 불러오는 중...'
                : saving
                  ? '변경 내용을 저장하는 중...'
                  : '지하철 레이어 표시 여부를 제어합니다.'}
            </S.StatusText>
          </S.ToggleWrapper>

        </S.SettingItem>
      </S.SettingList>
    </S.SettingBoardWrapper>
  );
}

export default SettingBoard;