<div style="display: flex; gap: 10px; word-break: keep-all; flex-wrap: wrap;">

<div style="word-break: keep-all; max-width: 600px; margin: 0 auto; padding: 0 10px; text-align: center; flex: 1; min-width: 300px;">
<h2 style="margin: 0; margin-bottom: 0.1rem;"> 인덕도仁德圖</h2>
<h3 style="margin-top: 0; font-size: 1rem; margin-bottom: 3rem;">- 인덕원 디지털맵 -</h3>

'인덕도'에 인덕원의 역사와 현재의 이야기 그리고 미래의 일들이 한눈에 보이게 기록하고 공유해 우리가 알고 있는 지역의 다채로운 모습을 알려 인덕원만의 정체성을 만들고 싶다.

인덕원의 역사, 오래된 가옥, 골목 풍경, 동네 사람들, 개성 있는 작은 가게와 공방, 그리고 텃밭 등을 기록하고 공유하여 유흥가로서의 인덕원이 아닌 사람 사는 냄새가 물씬 나는 마을의 풍경을 소개한다. 또한, 물리적인 환경뿐만 아니라 지역 문화공간 ‘도시공상가’를 중심으로 창작자와 지역 주민이 함께하는 다양한 오프라인 커뮤니티 활동과 마을 사람들의 이야기를 ‘인덕도’에 차곡차곡 기록한다. 그 안에서 자연스럽게 새로운 관계와 추억들이 쌓이게 될 것이다.

결과적으로, 디지털맵 ‘인덕도’는 일상과 추억을 공유하는 저장소가 된다.

(출처: [인덕도란?](https://indeogdo.bground-archi.com])) 
</div>

<div style="margin: auto 22px 12px 0; border-left: 0.5px black solid; padding-left: 15px; flex: 0 0 auto; min-width: 200px;">
<b>진행기간:</b> 2025.10.10 ~ 2025.11.20 <br />
<b>기획:</b> 문화예술단체 골목길 <br />
<b>웹 개발:</b> 곽도희 <br />
<b>웹 디자인:</b> 김보경 (보인다스튜디오) <br />
<b>사진:</b> 이해규 (원시림스튜디오) <br />
<b>기록:</b> 윤경숙, 차주협, 양진현, 지준화
</div>

</div>

---

## 주요 기능

#### 인터랙티브 디지털맵
- Google Maps API 기반 지도 플랫폼
- 폴리곤(Polygon) 및 폴리라인(Polyline)을 통한 영역 및 경로 표시
- 마커 표시 및 마커 클러스터링
- 클러스터별 마커 표시/숨김 토글
- 활성화된 마커에 따른 자동 줌 조정 (fitBounds)
- 초기 위치로 지도 리셋
- 지도 내 장소 검색


#### 콘텐츠 관리
- 테마(Theme) > 클러스터(Cluster) > 사이트(Site) 계층 구조
- 사이트별 상세 정보 및 이미지 관리
- 주소 정보 및 좌표(위도/경도) 관리
- Editor.js 기반 블록 스타일 에디터로 콘텐츠 작성
- 동일 좌표의 다중 사이트 그룹 관리

#### UI/UX 기능
- 보드 너비 모드 전환 (Wide / Normal / Narrow)
- 동일 좌표 사이트 간 이전/다음 버튼으로 콘텐츠 전환
- 마커 클릭 시 보드 자동 확장
- 지도 클릭 시 보드 자동 축소

#### 관리자 기능
- 테마, 클러스터, 사이트 데이터 CRUD 
- 아이콘 관리
- 클러스터별 마커/주소 표시 여부 설정
- 정렬 순서 관리
- 이미지 업로드 및 관리 (Supabase Storage)
- 크레딧 정보 관리

---

## 기술 스택

#### Frontend
<img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff&style=for-the-badge" alt="Next.js" />
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
" alt="React" />
<img src="https://img.shields.io/badge/Emotion-11.14.0-D36AC2?style=for-the-badge&logo=emotion&logoColor=white" alt="Emotion" />
<img src="https://img.shields.io/badge/Zustand-5.0.8-443B48?style=for-the-badge" alt="Zustand" />
<img src="https://img.shields.io/badge/React%20Hook%20Form-7.65.0-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form" />

#### Backend
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />

#### 지도 & 외부 API
<img src="https://img.shields.io/badge/Google%20Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white" alt="Google Maps" />
<img src="https://img.shields.io/badge/Kakao%20API-FFCD00?style=for-the-badge&logo=kakao&logoColor=black" alt="Kakao API" />
<img src="https://img.shields.io/badge/Daum%20Postcode-FF6B6B?style=for-the-badge" alt="Daum Postcode" />

