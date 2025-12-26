'use client';

import { useState } from 'react';
import * as S from '@/styles/common/mapSearch.style';
import SearchIcon from '@/components/common/SearchIcon';

function MapSearch({
  onSearch,
  searchResults = [],
  onResultClick,
  onFocusOut,
  placeholder = "장소를 검색하세요..."
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleFocusOut = () => {
    // 약간의 지연을 추가하여 클릭 이벤트가 먼저 처리되도록 함
    setTimeout(() => {
      if (onFocusOut) {
        onFocusOut();
      }
    }, 150);
  };

  return (
    <S.MapSearchContainer>
      {/* 검색 입력 폼 */}
      <S.MapSearchForm onSubmit={handleSubmit} >
        <S.MapSearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={handleFocusOut}
          placeholder={placeholder}
          aria-label="검색 입력"
        />
        <S.MapSearchButton
          type="submit"
          aria-label="검색"
        >
          <SearchIcon />
        </S.MapSearchButton>
      </S.MapSearchForm>

      {/* 검색 결과 */}
      {searchResults.length > 0 && (
        <S.MapSearchResultsList>
          {searchResults.map((place, index) => (
            <S.MapSearchResultItem
              key={place.place_id}
              onMouseDown={(e) => {
                e.preventDefault(); // onBlur 이벤트가 발생하지 않도록 함
                onResultClick(place);
                setSearchQuery('');
              }}
            >
              <S.MapSearchResultItemName>
                {place.name}
              </S.MapSearchResultItemName>
              <S.MapSearchResultItemAddress>
                {place.formatted_address}
              </S.MapSearchResultItemAddress>
            </S.MapSearchResultItem>
          ))}
        </S.MapSearchResultsList>
      )}
    </S.MapSearchContainer>
  );
}

export default MapSearch;