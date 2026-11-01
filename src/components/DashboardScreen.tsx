import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Crown, 
  Sparkles, 
  Wallet, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  PlayCircle, 
  UserCheck, 
  HelpCircle, 
  ArrowUpRight, 
  CalendarCheck, 
  Gift, 
  Info,
  ChevronRight,
  Code
} from 'lucide-react';
import { HalalInfoModal } from './HalalInfoModal';
import { WatchAdModal } from './WatchAdModal';
import { DailyQuizModal } from './DailyQuizModal';
import { KotlinNativeSourceModal } from './KotlinNativeSourceModal';

interface DashboardScreenProps {
  onNavigateTab: (tab: 'home' | 'tasks' | 'referrals' | 'wallet' | 'profile') => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateTab }) => {
  const { profile, claimDailyBonus, rewardUser } = useAuth();
  
  // Modals
  const [showHalalModal, setShowHalalModal] = useState(false);
  const [showWatchAd, setShowWatchAd] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showKotlinModal, setShowKotlinModal] = useState(false);
  
  // Feedback
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);
  const [claimingBonus, setClaimingBonus] = useState(false);

  const handleClaimBonus = async () => {
    setClaimingBonus(true);
    setBonusMessage(null);
    try {
      const res = await claimDailyBonus();
      setBonusMessage(res.message);
      setTimeout(() => setBonusMessage(null), 4000);
    } catch {
      // handled
    } finally {
      setClaimingBonus(false);
    }
  };

  const streakDays = [
    { day: 1, reward: 15 },
    { day: 2, reward: 20 },
    { day: 3, reward: 25 },
    { day: 4, reward: 30 },
    { day: 5, reward: 35 },
    { day: 6, reward: 40 },
    { day: 7, reward: 50 },
  ];

  const currentStreak = profile?.checkInStreak || 1;
  const todayStr = new Date().toISOString().slice(0, 10);
  const isAlreadyClaimedToday = profile?.lastCheckInDate === todayStr;

  return (
    <div className="min-h-full pb-24 text-white select-none">
      {/* Top Header Bar */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1.5px] shadow-md shadow-amber-500/20">
            <div className="w-full h-full bg-[#121217] rounded-[14px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-zinc-100">
                {profile?.name || 'Supreme Earner'}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/30">
                VIP GOLD
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Supreme Leader RISE Network</p>
          </div>
        </div>

        {/* Kotlin Native Source badge button */}
        <button
          onClick={() => setShowKotlinModal(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-zinc-800 transition"
        >
          <Code className="w-3.5 h-3.5" />
          <span>Kotlin Code</span>
        </button>
      </div>

      <div className="px-4 space-y-4 mt-1">
        {/* TOP CARD: Switch Board Wallet Summary */}
        <div className="relative rounded-3xl p-5 bg-gradient-to-b from-[#181822] to-[#111116] border border-amber-500/40 shadow-xl overflow-hidden">
          {/* Subtle gold glow corner */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              Total Wallet Balance
            </span>
            <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active • Shariah Compliant
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-3xl font-black tracking-tight text-white font-sans">
              Rs. {profile?.balance?.toLocaleString() || '0'}
            </span>
            <span className="text-xs font-bold text-amber-400">PKR</span>
          </div>

          {/* Quick Action buttons */}
          <div className="flex gap-2 my-3">
            <button
              onClick={() => onNavigateTab('wallet')}
              className="flex-1 py-2.5 px-3 rounded-xl gold-gradient text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw Cash</span>
            </button>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 text-zinc-100 font-bold text-xs flex items-center justify-center gap-1.5 border border-zinc-700 active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Do Tasks & Earn</span>
            </button>
          </div>

          {/* Today Earning & Total Referrals Stats Row */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/80">
            <div className="bg-[#14141a] p-2.5 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Today Earning</span>
              </div>
              <div className="text-base font-extrabold text-emerald-400">
                +Rs. {profile?.todayEarnings?.toLocaleString() || '0'}
              </div>
            </div>

            <div 
              onClick={() => onNavigateTab('referrals')}
              className="bg-[#14141a] p-2.5 rounded-xl border border-zinc-800 cursor-pointer hover:border-amber-500/40 transition"
            >
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Total Referrals</span>
                </div>
                <ChevronRight className="w-3 h-3 text-zinc-500" />
              </div>
              <div className="text-base font-extrabold text-amber-300">
                {profile?.referralCount || 0} Members
              </div>
            </div>
          </div>
        </div>

        {/* HALAL EARNING BANNER (MANDATORY REQUIREMENT) */}
        <div 
          onClick={() => setShowHalalModal(true)}
          className="relative rounded-2xl p-3.5 bg-gradient-to-r from-emerald-950/60 to-zinc-950 border border-emerald-500/40 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-300 flex items-center gap-1">
                <span>100% Halal Verified</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded font-bold">
                  Shariah Certified
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-medium leading-tight mt-0.5">
                "No Gambling, No Interest, Only Tasks & Referral"
              </p>
            </div>
          </div>
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>

        {/* DAILY CHECK-IN BONUS BUTTON & STREAK */}
        <div className="rounded-2xl p-4 bg-[#141419] border border-amber-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100">Daily Check-In Reward</h4>
                <p className="text-[10px] text-amber-400">Streak: Day {currentStreak}/7</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-amber-300">
              Up to Rs. 50 / Day
            </span>
          </div>

          {/* Streak Indicator Dots */}
          <div className="grid grid-cols-7 gap-1.5 mb-3">
            {streakDays.map((item) => {
              const isPast = item.day < currentStreak;
              const isCurrent = item.day === currentStreak;
              return (
                <div
                  key={item.day}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-xl border text-[10px] transition ${
                    isCurrent
                      ? 'bg-amber-500 text-black font-extrabold border-amber-400 shadow-sm'
                      : isPast
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 font-bold'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  <span className="text-[9px]">D{item.day}</span>
                  <span className="font-bold">+{item.reward}</span>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <button
            onClick={handleClaimBonus}
            disabled={claimingBonus || isAlreadyClaimedToday}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-[0.98] ${
              isAlreadyClaimedToday
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : 'gold-gradient text-black shadow-md shadow-amber-500/20 animate-pulse'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>
              {isAlreadyClaimedToday
                ? 'Claimed Today (Resets at 12:00 AM)'
                : claimingBonus
                ? 'Claiming Bonus...'
                : `Claim Day ${currentStreak} Bonus (+Rs. ${streakDays[currentStreak - 1]?.reward || 20})`}
            </span>
          </button>

          {bonusMessage && (
            <div className="mt-2 text-center text-xs text-amber-400 font-semibold animate-in fade-in">
              {bonusMessage}
            </div>
          )}
        </div>

        {/* TASKS LIST SWITCH BOARD (MANDATORY REQUIREMENT) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Earning Tasks</span>
            </h3>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-[11px] text-amber-400 hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          {/* 1. Watch Ads */}
          <div
            onClick={() => setShowWatchAd(true)}
            className="p-3.5 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Watch Sponsor Video Ads</span>
                  <span className="text-[9px] bg-red-500/20 text-red-400 px-1 rounded uppercase font-extrabold">
                    HOT
                  </span>
                </h4>
                <p className="text-[11px] text-zinc-400">Watch 15s verified video and get instant cash</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-amber-400 block">+Rs. 25</span>
              <span className="text-[10px] text-zinc-500">10 Left</span>
            </div>
          </div>

          {/* 2. Refer & Earn */}
          <div
            onClick={() => onNavigateTab('referrals')}
            className="p-3.5 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Refer & Earn 10% Lifetime</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold">
                    UNLIMITED
                  </span>
                </h4>
                <p className="text-[11px] text-zinc-400">Earn 10% commission on every referral's task</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-emerald-400 block">10% Life</span>
              <span className="text-[10px] text-zinc-500">+Rs. 150/Join</span>
            </div>
          </div>

          {/* 3. Complete Profile */}
          <div
            onClick={() => onNavigateTab('profile')}
            className="p-3.5 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  <span>Complete Profile & KYC</span>
                </h4>
                <p className="text-[11px] text-zinc-400">Add Easypaisa/JazzCash account & verify phone</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-amber-400 block">+Rs. 50</span>
              <span className="text-[10px] text-zinc-500">One-Time</span>
            </div>
          </div>

          {/* 4. Daily Quiz */}
          <div
            onClick={() => setShowQuiz(true)}
            className="p-3.5 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  <span>Daily Islamic & Finance Quiz</span>
                </h4>
                <p className="text-[11px] text-zinc-400">5 simple questions on Halal earning & ethics</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-amber-400 block">+Rs. 50</span>
              <span className="text-[10px] text-zinc-500">Daily Task</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <HalalInfoModal isOpen={showHalalModal} onClose={() => setShowHalalModal(false)} />
      <WatchAdModal
        isOpen={showWatchAd}
        onClose={() => setShowWatchAd(false)}
        onReward={(amount, desc) => rewardUser('ad', amount, desc)}
      />
      <DailyQuizModal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        onReward={(amount, desc) => rewardUser('quiz', amount, desc)}
      />
      <KotlinNativeSourceModal isOpen={showKotlinModal} onClose={() => setShowKotlinModal(false)} />
    </div>
  );
};
