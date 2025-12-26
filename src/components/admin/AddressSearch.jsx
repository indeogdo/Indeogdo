import { useState, useEffect } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import * as S from '@/styles/Sites/board.style';

export default function AddressSearch({ register, setValue, namePrefix, error, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  const addressField = namePrefix ? `${namePrefix}.address` : 'address';
  const latitudeField = namePrefix ? `${namePrefix}.latitude` : 'latitude';
  const longitudeField = namePrefix ? `${namePrefix}.longitude` : 'longitude';
  const idField = namePrefix ? `${namePrefix}.addressId` : 'addressId';

  // Kakao Maps SDK 로딩과 초기화를 별도의 useEffect에서 처리
  useEffect(() => {
    const loadKakaoMaps = async () => {
      try {
        // 서버에서 카카오 API 설정 확인
        const response = await fetch('/api/kakao/config');
        const config = await response.json();

        if (!config.success || !config.config.hasKakaoKey) {
          console.warn('Kakao API 키가 설정되지 않았습니다.');
          return;
        }

        console.log('카카오 API 설정 확인됨');
        setKakaoLoaded(true); // 서버사이드 지오코딩을 사용하므로 true로 설정
      } catch (error) {
        console.error('카카오 API 설정 로드 실패:', error);
      }
    };

    loadKakaoMaps();
  }, []);

  const convertAddressToCoords = async (address) => {
    try {
      // 서버사이드 지오코딩 API 사용
      const response = await fetch('/api/kakao/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '주소 검색 중 오류가 발생했습니다.');
      }

      const result = await response.json();

      if (result.success) {
        return {
          latitude: result.data.latitude,
          longitude: result.data.longitude,
        };
      } else {
        console.warn('주소 검색 실패:', result.error);
        return { latitude: null, longitude: null };
      }
    } catch (error) {
      console.error('지오코딩 오류:', error);
      return { latitude: null, longitude: null };
    }
  };

  const handleComplete = async (data) => {
    // SDK가 로드되지 않았다면 주소만 설정하고 좌표는 null로 설정
    if (!kakaoLoaded) {
      console.warn('Kakao Maps SDK가 로드되지 않아 좌표를 가져올 수 없습니다.');

      let fullAddress = data.address;
      let extraAddress = '';

      if (data.addressType === 'R') {
        if (data.bname) extraAddress += data.bname;
        if (data.buildingName) {
          extraAddress += extraAddress
            ? `, ${data.buildingName}`
            : data.buildingName;
        }
        if (extraAddress) fullAddress += ` (${extraAddress})`;
      }

      setValue(addressField, fullAddress, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setValue(latitudeField, null, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setValue(longitudeField, null, { shouldDirty: true, shouldTouch: true, shouldValidate: true });

      setIsOpen(false);
      return;
    }

    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName) {
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName;
      }
      if (extraAddress) fullAddress += ` (${extraAddress})`;
    }

    const coords = await convertAddressToCoords(fullAddress);

    setValue(addressField, fullAddress, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setValue(latitudeField, coords.latitude, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setValue(longitudeField, coords.longitude, { shouldDirty: true, shouldTouch: true, shouldValidate: true });

    setIsOpen(false);
  };

  return (
    <>
      <S.BoardTextInput
        placeholder="주소를 검색해주세요."
        {...register(addressField)}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        readOnly
        disabled={disabled}
      />
      <input type="hidden" {...register(latitudeField)} />
      <input type="hidden" {...register(longitudeField)} />
      <input type="hidden" {...register(idField)} />
      {error && <S.BoardInputError>{error}</S.BoardInputError>}
      {isOpen && !disabled && <DaumPostcodeEmbed onComplete={handleComplete} style={{ border: '1px solid black', borderRadius: '8px', marginTop: '6px', padding: '2px 3px', width: '100%' }} />}
    </>
  );
}