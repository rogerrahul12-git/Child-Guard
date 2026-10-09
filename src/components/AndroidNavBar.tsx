import React from 'react';
import { playAndroidSound, triggerHaptic } from '../utils/androidAudio';

interface AndroidNavBarProps {
  onBack: () => void;
  onHome: () => void;
  onRecents: () => void;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  onBack,
  onHome,
  onRecents,
}) => {
  const handleTap = (action: () => void) => {
    playAndroidSound('tap');
    triggerHaptic(20);
    action();
  };

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 py-2.5 px-8 flex items-center justify-around select-none">
      {/* Android Back Button (Triangle) */}
      <button
        onClick={() => handleTap(onBack)}
        className="p-2 text-slate-400 hover:text-white active:scale-90 transition rounded-lg hover:bg-slate-800"
        aria-label="Android Back"
        title="Android Back"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>

      {/* Android Home Button (Circle) */}
      <button
        onClick={() => handleTap(onHome)}
        className="p-2 text-slate-400 hover:text-white active:scale-90 transition rounded-lg hover:bg-slate-800"
        aria-label="Android Home"
        title="Android Home"
      >
        <div className="w-4.5 h-4.5 rounded-full border-2 border-current" />
      </button>

      {/* Android Recents / Overview Button (Square) */}
      <button
        onClick={() => handleTap(onRecents)}
        className="p-2 text-slate-400 hover:text-white active:scale-90 transition rounded-lg hover:bg-slate-800"
        aria-label="Android Recents"
        title="Android Recents"
      >
        <div className="w-4 h-4 rounded-[3px] border-2 border-current" />
      </button>
    </div>
  );
};
