import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-[#050507] text-white flex flex-col items-center justify-start relative">
      {/* Top Floating Viewport Switcher for Desktop Reviewers */}
      <div className="hidden md:flex items-center gap-2 fixed top-3 right-4 z-50 bg-[#121217]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-xs shadow-lg">
        <span className="text-zinc-400">Display View:</span>
        <button
          onClick={() => setDeviceFrameMode(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
            deviceFrameMode ? 'gold-gradient text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android Mobile Frame</span>
        </button>
        <button
          onClick={() => setDeviceFrameMode(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
            !deviceFrameMode ? 'gold-gradient text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Fluid Full View</span>
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full min-h-[100dvh] bg-[#09090b] flex flex-col relative transition-all duration-300 ${
          deviceFrameMode
            ? 'max-w-[440px] md:my-5 md:min-h-[880px] md:max-h-[92vh] md:rounded-[44px] md:border-[10px] md:border-[#1a1a22] md:shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.15)] md:overflow-hidden'
            : 'max-w-2xl'
        }`}
      >
        {/* Android Native Status Bar */}
        <div className="sticky top-0 left-0 right-0 z-40 bg-[#09090b]/90 backdrop-blur-md px-6 py-2 flex items-center justify-between text-xs text-zinc-300 select-none">
          {/* Time */}
          <span className="font-semibold text-[11px] tracking-tight text-zinc-200">
            {currentTime || '12:00'}
          </span>

          {/* Android Punch Hole Camera Notch simulation */}
          <div className="w-4 h-4 rounded-full bg-black border border-zinc-800 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Signal className="w-3 h-3 text-zinc-300" />
            <span className="text-[10px] font-bold text-amber-400">5G</span>
            <Wifi className="w-3 h-3 text-zinc-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold text-zinc-300">98%</span>
              <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Scrollable App Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="hidden md:flex justify-center items-center py-1.5 bg-[#09090b] pointer-events-none select-none">
          <div className="w-32 h-1 bg-zinc-600/70 rounded-full" />
        </div>
      </div>
    </div>
  );
};
