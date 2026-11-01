import React, { useState, useEffect } from 'react';
import { X, Play, Award, ShieldAlert, CheckCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface WatchAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (amount: number, description: string) => void;
}

const SPONSOR_ADS = [
  {
    title: 'Meezan Islamic Banking - Roshan Digital Account',
    brand: 'Meezan Bank Pakistan',
    tagline: 'Riba-Free Shariah Compliant Digital Solutions',
    color: 'from-emerald-900 to-zinc-950',
    reward: 25,
    duration: 15
  },
  {
    title: 'Easypaisa Super App - Daily Cashback & Discounts',
    brand: 'Telenor Microfinance Bank',
    tagline: 'Instant QR Payments & Mobile Load Nationwide',
    color: 'from-green-950 to-zinc-950',
    reward: 20,
    duration: 15
  },
  {
    title: 'Daraz Mega Shopping Festival',
    brand: 'Daraz PK',
    tagline: 'Free Delivery Across Pakistan on 5 Million+ Items',
    color: 'from-orange-950 to-zinc-950',
    reward: 20,
    duration: 15
  }
];

export const WatchAdModal: React.FC<WatchAdModalProps> = ({ isOpen, onClose, onReward }) => {
  const [adIndex, setAdIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const currentAd = SPONSOR_ADS[adIndex];

  useEffect(() => {
    if (isOpen) {
      // Pick random ad
      const rand = Math.floor(Math.random() * SPONSOR_ADS.length);
      setAdIndex(rand);
      setTimeLeft(SPONSOR_ADS[rand].duration);
      setIsPlaying(true);
      setIsCompleted(false);
    } else {
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsCompleted(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, timeLeft]);

  if (!isOpen) return null;

  const handleClaim = () => {
    onReward(currentAd.reward, `Watched Sponsor Video: ${currentAd.title}`);
    onClose();
  };

  const progressPercent = ((currentAd.duration - timeLeft) / currentAd.duration) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#111116] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Header / Security Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#181820] border-b border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Sponsor Video Partner</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            {isCompleted ? (
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                {timeLeft}s
              </div>
            )}
          </div>
        </div>

        {/* Video Simulation Screen */}
        <div className={`relative h-64 bg-gradient-to-b ${currentAd.color} flex flex-col justify-between p-5 overflow-hidden`}>
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />

          {/* Ad Badge */}
          <div className="flex justify-between items-start z-10">
            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-bold text-amber-300 uppercase tracking-widest border border-amber-500/30">
              Verified Ad
            </span>
            <div className="flex items-center gap-1 bg-amber-500/90 text-black px-2 py-0.5 rounded-full text-xs font-black shadow-md">
              <Award className="w-3 h-3" />
              +Rs. {currentAd.reward}
            </div>
          </div>

          {/* Main Ad Content */}
          <div className="text-center z-10 my-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 shadow-inner">
              <Play className="w-7 h-7 text-amber-300 fill-amber-300/60" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-wide leading-tight">
              {currentAd.brand}
            </h4>
            <p className="text-xs text-zinc-300 font-medium mt-1">
              {currentAd.title}
            </p>
            <p className="text-[11px] text-amber-300/80 italic mt-2">
              "{currentAd.tagline}"
            </p>
          </div>

          {/* Progress Timer */}
          <div className="w-full z-10 space-y-1.5">
            <div className="flex justify-between text-[10px] text-zinc-300 font-medium">
              <span>{isCompleted ? 'Video Completed!' : 'Watching sponsor ad...'}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-4 bg-[#111116] space-y-3">
          {!isCompleted ? (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Please watch the full 15 seconds to receive your Rs. {currentAd.reward} reward.</span>
            </div>
          ) : (
            <button
              onClick={handleClaim}
              className="w-full py-3.5 rounded-xl gold-gradient text-black font-extrabold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Claim Rs. {currentAd.reward} Cash Reward</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
            <span>Daily Ad Limit: 10/10 Available</span>
            <span>Halal Service Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
};
