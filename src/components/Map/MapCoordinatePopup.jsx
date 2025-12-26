import PropTypes from 'prop-types';

/**
 * 지도 우클릭 시 좌표/주소를 보여주는 임시 팝업
 * 다른 컴포넌트와 분리하여 손쉽게 제거 가능
 */
function MapCoordinatePopup({ coordinateInfo, isGeocoding, onClose }) {
  if (!coordinateInfo) {
    return null;
  }

  const { lat, lng, address } = coordinateInfo;

  const formattedLat = lat?.toFixed ? lat.toFixed(6) : lat;
  const formattedLng = lng?.toFixed ? lng.toFixed(6) : lng;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        color: '#fff',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.35)',
        zIndex: 9999,
        minWidth: '280px',
        maxWidth: '360px',
        fontSize: '14px',
        lineHeight: 1.5,
        userSelect: 'text',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <strong style={{ fontSize: '15px' }}>우클릭 좌표</strong>
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px',
          }}
          aria-label="좌표 팝업 닫기"
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '8px', wordBreak: 'keep-all', color: '#cbd5f5', userSelect: 'text' }}>
        {isGeocoding ? '주소를 불러오는 중...' : address}
      </div>

      <div style={{ fontFamily: 'monospace', backgroundColor: 'rgba(148, 163, 184, 0.12)', borderRadius: '8px', padding: '8px 10px', userSelect: 'text' }}>
        <div>{formattedLat}, {formattedLng}</div>
      </div>
    </div>
  );
}

MapCoordinatePopup.propTypes = {
  coordinateInfo: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    address: PropTypes.string,
  }),
  isGeocoding: PropTypes.bool,
  onClose: PropTypes.func,
};

MapCoordinatePopup.defaultProps = {
  coordinateInfo: null,
  isGeocoding: false,
  onClose: () => { },
};

export default MapCoordinatePopup;

