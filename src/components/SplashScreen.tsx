import React from 'react';
import { Crown, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onContinue: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue }) => {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center bg-[#08080a] p-6 text-center select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <div className="pt-8 z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          100% Halal Verified Platform
        </div>
      </div>

      {/* Center Logo & Branding */}
      <div className="flex flex-col items-center my-auto z-10">
        {/* SL RISE Gold Emblem */}
        <div className="relative group cursor-pointer mb-6">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-[2px] shadow-2xl shadow-amber-500/20">
            <div className="w-full h-full bg-[#0d0d11] rounded-[22px] flex flex-col items-center justify-center p-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent" />
              <Crown className="w-12 h-12 text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] animate-pulse" />
              <div className="text-[11px] font-black tracking-widest text-amber-300 mt-1 uppercase">
                SL RISE
              </div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
            PRO
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
          Supreme Leader <span className="gold-gradient-text font-black">RISE</span>
        </h1>
        <p className="text-amber-200/80 text-sm mt-2 font-medium tracking-wide max-w-xs">
          Pakistan's Premier Halal Earning Ecosystem
        </p>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-3 mt-6 text-xs text-zinc-400">
          <span className="flex items-center gap-1 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
            <Sparkles className="w-3 h-3 text-amber-400" /> No Gambling
          </span>
          <span className="flex items-center gap-1 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
            <Sparkles className="w-3 h-3 text-amber-400" /> Zero Interest
          </span>
          <span className="flex items-center gap-1 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
            <Sparkles className="w-3 h-3 text-amber-400" /> 10% Referrals
          </span>
        </div>
      </div>

      {/* Bottom CTA & Version */}
      <div className="w-full max-w-xs pb-6 z-10 flex flex-col items-center gap-4">
        <button
          onClick={onContinue}
          className="w-full py-3.5 px-6 rounded-2xl gold-gradient text-zinc-950 font-bold text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span>Get Started & Rise</span>
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between w-full text-[11px] text-zinc-500 px-2">
          <span>Android v3.4.0 Native Edition</span>
          <span>Easypaisa • JazzCash</span>
        </div>
      </div>
    </div>
  );
};
