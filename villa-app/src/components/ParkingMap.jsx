import React from 'react';

const ParkingMap = ({ selectedSpot, onSpotSelect }) => {
  // 색상을 클래스가 아닌 '직접 값'으로 지정해서 에러 방지
  const getSpotStyle = (id) => ({
    fill: selectedSpot === id ? '#3b82f6' : '#f3f4f6', // 파랑 : 회색
    stroke: selectedSpot === id ? '#1d4ed8' : '#9ca3af', // 진한파랑 : 진한회색
    strokeWidth: '2px',
    transition: 'all 0.2s'
  });

  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-gray-200 mb-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-400 mb-4 text-center">주차 위치를 선택해주세요</h3>
      
      <svg viewBox="0 0 300 240" className="w-full h-auto" style={{ maxHeight: '300px' }}>
        {/* 가이드 텍스트 */}
        <text x="125" y="230" fill="#94a3b8" fontSize="12" fontWeight="bold">빌라 입구 ↑</text>

        {/* 좌측 2칸 */}
        {['L1', 'L2'].map((id, i) => (
          <g key={id} onClick={() => onSpotSelect(id)} style={{ cursor: 'pointer' }}>
            <rect x={20 + (i * 60)} y="20" width="50" height="90" rx="8" style={getSpotStyle(id)} />
            <text x={35 + (i * 60)} y="70" fill={selectedSpot === id ? 'white' : '#64748b'} fontSize="14" fontWeight="bold" pointerEvents="none">좌{i+1}</text>
          </g>
        ))}

        {/* 우측 2칸 (반지하) */}
        {['R1', 'R2'].map((id, i) => (
          <g key={id} onClick={() => onSpotSelect(id)} style={{ cursor: 'pointer' }}>
            <rect x={170 + (i * 60)} y="20" width="50" height="90" rx="8" style={getSpotStyle(id)} />
            <text x={185 + (i * 60)} y="70" fill={selectedSpot === id ? 'white' : '#64748b'} fontSize="14" fontWeight="bold" pointerEvents="none">우{i+1}</text>
          </g>
        ))}

        {/* 이중주차 2칸 (우측 칸 앞) */}
        {['D1', 'D2'].map((id, i) => (
          <g key={id} onClick={() => onSpotSelect(id)} style={{ cursor: 'pointer' }}>
            <rect 
              x={170 + (i * 60)} y="125" width="50" height="90" rx="8" 
              style={{
                ...getSpotStyle(id),
                strokeDasharray: selectedSpot === id ? '0' : '4' // 선택 안 됐을 때만 점선
              }} 
            />
            <text x={178 + (i * 60)} y="175" fill={selectedSpot === id ? 'white' : '#ef4444'} fontSize="11" fontWeight="extrabold" pointerEvents="none">이중{i+1}</text>
          </g>
        ))}
      </svg>
      
      <div className="flex justify-center gap-4 mt-4 text-[11px] font-medium text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm"></span> 일반</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 border border-red-400 border-dashed rounded-sm"></span> 이중주차</span>
      </div>
    </div>
  );
};

export default ParkingMap;