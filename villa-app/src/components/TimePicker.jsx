import React from 'react';

const TimePicker = ({ selectedHour, selectedMinute, onTimeSelect, is12HourMode, setIs12HourMode }) => {
  const hours0to23 = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['00', '10', '20', '30', '40', '50'];

  const getHourLabel = (h) => {
    if (!is12HourMode) {
      // 24시간제: 00시 ~ 23시
      return `${String(h).padStart(2, '0')}시`;
    }
    // 12시간제: 0시 ~ 11시 (오전/오후 문구 없이 숫자만)
    const h12 = h >= 12 ? h - 12 : h;
    return `${h12}시`;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 시간 선택 */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-gray-400">시 (Hour)</h3>
            {is12HourMode && (
              <span className="text-[9px] text-blue-500 font-bold bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                AM / PM
              </span>
            )}
          </div>
          <button 
            onClick={() => setIs12HourMode(!is12HourMode)}
            className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
          >
            {is12HourMode ? "24H제로 보기" : "12H제로 보기"}
          </button>
        </div>
        
        <div className="grid grid-cols-6 gap-1.5">
          {hours0to23.map((h) => (
            <button
              key={h}
              onClick={() => onTimeSelect({ hour: h, minute: selectedMinute })}
              className={`py-4 rounded-xl border text-[11px] sm:text-xs font-black transition-all ${
                selectedHour === h 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105 z-10' 
                : h < 12 && is12HourMode
                  ? 'bg-white text-slate-700 border-slate-100 hover:border-blue-200' 
                  : is12HourMode 
                    ? 'bg-slate-50 text-slate-400 border-slate-100 hover:border-blue-200' 
                    : 'bg-white text-slate-700 border-slate-100 hover:border-blue-200'
              }`}
            >
              {getHourLabel(h)}
            </button>
          ))}
        </div>
      </section>

      {/* 분 선택 */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 mb-4 px-1">분 (Minute)</h3>
        <div className="grid grid-cols-6 gap-1.5">
          {minutes.map((m) => (
            <button
              key={m}
              onClick={() => onTimeSelect({ hour: selectedHour, minute: m })}
              className={`py-4 rounded-xl border text-[11px] sm:text-xs font-black transition-all ${
                selectedMinute === m 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105 z-10' 
                : 'bg-white text-slate-700 border-slate-100 hover:border-blue-200'
              }`}
            >
              {m}분
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TimePicker;