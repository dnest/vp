import React, { useState, useEffect } from 'react';
import ParkingMap from './components/ParkingMap';
import TimePicker from './components/TimePicker';

function App() {
  const [role, setRole] = useState('owner');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [is12HourMode, setIs12HourMode] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 1. 초기 데이터 로드 및 역할 확인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'neighbor') setRole('neighbor');
    
    const savedData = localStorage.getItem('my_parking_info');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setSelectedSpot(parsed.spot);
      setHour(parsed.hour !== null ? Number(parsed.hour) : null);
      setMinute(parsed.minute !== null ? parsed.minute : null);
      if (parsed.date) setSelectedDate(new Date(parsed.date));
      if (params.get('role') !== 'neighbor') setIsRegistered(true);
    }
  }, []);

  // 2. [추가] '분' 선택 시 하단 등록 버튼으로 자동 스크롤
  useEffect(() => {
    if (minute !== null && role === 'owner') {
      // 하단 바가 렌더링되고 애니메이션이 시작될 때쯤 스크롤 실행
      const timer = setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 150); 
      return () => clearTimeout(timer);
    }
  }, [minute, role]);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleRegister = () => {
    localStorage.setItem('my_parking_info', JSON.stringify({
      spot: selectedSpot, 
      hour, 
      minute, 
      date: selectedDate.toISOString(),
      timestamp: new Date().getTime()
    }));
    setIsRegistered(true);
    alert("출차 정보가 등록되었습니다!");
  };

  const handleReset = () => {
    if (window.confirm("모든 정보를 초기화할까요?")) {
      localStorage.removeItem('my_parking_info');
      setSelectedSpot(null);
      setHour(null);
      setMinute(null);
      setSelectedDate(new Date());
      setIsRegistered(false);
    }
  };

  const getFinalMessage = () => {
    if (!selectedSpot || hour === null || minute === null) return null;
    
    const month = selectedDate.getMonth() + 1;
    const date = selectedDate.getDate();
    const day = ['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()];

    let timeString = "";
    if (is12HourMode) {
      const ampm = hour < 12 ? "오전" : "오후";
      const displayHour = hour >= 12 ? (hour === 12 ? 12 : hour - 12) : hour;
      timeString = `${ampm} ${displayHour}시 ${minute}분`;
    } else {
      const displayHour24 = String(hour).padStart(2, '0');
      timeString = `${displayHour24}시 ${minute}분`;
    }

    return (
      <div className="flex flex-col items-center gap-1 mb-5 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Final Schedule</span>
           <button onClick={handleReset} className="text-[10px] text-slate-400 underline decoration-slate-200">초기화</button>
        </div>
        <p className="text-lg font-black text-slate-800 text-center">
          <span className="text-blue-600">{month}월 {date}일({day})</span> {timeString}
        </p>
        <p className="text-sm text-slate-500 font-medium text-center">
          <span className="font-bold text-slate-900">{selectedSpot}구역</span>에서 출차 예정
        </p>
      </div>
    );
  };

  // --- [이웃 모드 화면] ---
  if (role === 'neighbor') {
    const month = selectedDate.getMonth() + 1;
    const date = selectedDate.getDate();
    const day = ['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()];
    
    let displayTime = "--:--";
    let ampmLabel = "";
    
    if (hour !== null && minute !== null) {
      if (is12HourMode) {
        const ampm = hour < 12 ? "AM" : "PM";
        const h12 = hour >= 12 ? (hour === 12 ? 12 : hour - 12) : hour;
        displayTime = `${String(h12).padStart(2, '0')}:${minute}`;
        ampmLabel = ampm;
      } else {
        displayTime = `${String(hour).padStart(2, '0')}:${minute}`;
        ampmLabel = "24H";
      }
    }

    return (
      <div className="min-h-screen bg-slate-950 flex justify-center p-6 text-white font-sans transition-all">
        <div className="w-full max-w-md mt-10 space-y-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase italic">Parking Notification</span>
            <button 
              onClick={() => setIs12HourMode(!is12HourMode)}
              className="text-[10px] font-bold px-3 py-1.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700 active:scale-95 transition-all"
            >
              {is12HourMode ? "24시간제로 보기" : "12시간제로 보기"}
            </button>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="space-y-1 relative text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">주차 위치</p>
              <p className="text-3xl font-black text-white underline decoration-blue-500 decoration-4 underline-offset-8">
                {selectedSpot || "미등록"} 구역
              </p>
            </div>

            <div className="space-y-2 relative text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">출차 예정 시각</p>
              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-300">{month}월 {date}일({day})</p>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-6xl font-black text-blue-500 tracking-tighter">{displayTime}</p>
                  <span className="text-xl font-black text-blue-800 self-end mb-1 bg-blue-900/30 px-2 py-0.5 rounded">{ampmLabel}</span>
                </div>
              </div>
            </div>

            <a href="tel:010-0000-0000" className="block w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-bold text-xl transition-all shadow-lg active:scale-95 text-center">
              차주에게 전화하기
            </a>
          </div>
          <p className="text-slate-600 text-xs font-medium px-10 leading-relaxed text-center">
            공유된 정보는 실시간으로 업데이트됩니다.<br/>이웃을 배려해주셔서 감사합니다.
          </p>
        </div>
      </div>
    );
  }

  // --- [차주 모드 화면] ---
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center p-4 pb-64 font-sans">
      <div className="w-full max-w-md">
        <header className="py-8 px-2 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">주차 소통 <span className="text-blue-600 italic">Pro</span></h1>
            <p className="text-slate-400 text-sm font-medium italic">Smart Parking Assistant</p>
          </div>
          {isRegistered && (
             <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-black border border-green-100">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               LIVE
             </span>
          )}
        </header>

        <main className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-bold text-slate-800 px-2 text-sm uppercase flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">01</span> 위치 선택
            </h2>
            <ParkingMap selectedSpot={selectedSpot} onSpotSelect={setSelectedSpot} />
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase">
                <span className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">02</span> 시간 선택
              </h2>
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                <button onClick={() => changeDate(-1)} className="text-slate-400 hover:text-blue-600 font-bold px-1 transition-colors">◀</button>
                <span className="text-xs font-black text-slate-700 min-w-[60px] text-center">
                  {selectedDate.getMonth() + 1}/{selectedDate.getDate()} ({['일','월','화','수','목','금','토'][selectedDate.getDay()]})
                </span>
                <button onClick={() => changeDate(1)} className="text-slate-400 hover:text-blue-600 font-bold px-1 transition-colors">▶</button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
              <TimePicker 
                selectedHour={hour} 
                selectedMinute={minute} 
                onTimeSelect={({hour: h, minute: m}) => {setHour(h); setMinute(m);}}
                is12HourMode={is12HourMode}
                setIs12HourMode={setIs12HourMode}
              />
            </div>
          </section>
        </main>

        {(selectedSpot && hour !== null && minute !== null) && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 animate-in fade-in slide-in-from-bottom-10 duration-300">
            <div className="max-w-md mx-auto">
              {getFinalMessage()}
              <button onClick={handleRegister} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-200 active:scale-[0.98] transition-all">
                정보 업데이트 및 공유하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;