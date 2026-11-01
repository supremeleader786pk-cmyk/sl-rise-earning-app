import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  PlayCircle, 
  HelpCircle, 
  UserCheck, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Send, 
  Star,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { WatchAdModal } from './WatchAdModal';
import { DailyQuizModal } from './DailyQuizModal';

interface TasksScreenProps {
  onNavigateTab: (tab: 'home' | 'tasks' | 'referrals' | 'wallet' | 'profile') => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({ onNavigateTab }) => {
  const { profile, taskLogs, rewardUser } = useAuth();
  const [showWatchAd, setShowWatchAd] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [profileClaimed, setProfileClaimed] = useState(false);
  const [telegramClaimed, setTelegramClaimed] = useState(false);
  const [ratingClaimed, setRatingClaimed] = useState(false);

  // Profile completion calculation
  const hasName = Boolean(profile?.name && profile.name.length > 2);
  const hasPhone = Boolean(profile?.phone && profile.phone.length > 6);
  const hasPayment = Boolean(profile?.paymentAccounts && profile.paymentAccounts.length > 0);
  const profileStepsDone = [hasName, hasPhone, hasPayment].filter(Boolean).length;
  const isProfileComplete = profileStepsDone === 3;

  const handleClaimProfileReward = () => {
    if (!isProfileComplete || profileClaimed) return;
    rewardUser('profile', 50, 'Completed Profile & Added Verified Withdrawal Account');
    setProfileClaimed(true);
  };

  const handleTelegramTask = () => {
    window.open('https://t.me/SupremeLeaderRISE', '_blank');
    if (!telegramClaimed) {
      setTimeout(() => {
        rewardUser('partner', 20, 'Joined Supreme Leader RISE Telegram Official Broadcast');
        setTelegramClaimed(true);
      }, 1500);
    }
  };

  const handleRatingTask = () => {
    if (!ratingClaimed) {
      rewardUser('partner', 30, 'Rated 5-Stars for Supreme Leader RISE Android App');
      setRatingClaimed(true);
    }
  };

  return (
    <div className="min-h-full pb-24 text-white select-none px-4 pt-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            <span>Earning Tasks</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
              100% Halal
            </span>
          </h2>
          <p className="text-xs text-zinc-400">Complete tasks daily to earn genuine wages</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 block">Available Rewards</span>
          <span className="text-xs font-bold text-emerald-400">Rs. 350+ Daily</span>
        </div>
      </div>

      {/* Profile Completion Card (MANDATORY REQUIREMENT) */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#181822] to-[#121217] border border-amber-500/40 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Complete Profile Checklist</h4>
              <p className="text-[10px] text-zinc-400">{profileStepsDone}/3 steps completed</p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
            +Rs. 50
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-zinc-800 rounded-full my-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
            style={{ width: `${(profileStepsDone / 3) * 100}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-1.5 my-3 text-xs">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasName ? 'text-emerald-400' : 'text-zinc-600'}`} />
              Valid Full Name
            </span>
            <span className="text-[11px] text-zinc-500">{hasName ? 'Verified' : 'Pending'}</span>
          </div>

          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasPhone ? 'text-emerald-400' : 'text-zinc-600'}`} />
              Pakistani Phone Number
            </span>
            <span className="text-[11px] text-zinc-500">{hasPhone ? 'Verified' : 'Pending'}</span>
          </div>

          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasPayment ? 'text-emerald-400' : 'text-zinc-600'}`} />
              Easypaisa / JazzCash / Bank Added
            </span>
            <span className="text-[11px] text-zinc-500">{hasPayment ? 'Verified' : 'Pending'}</span>
          </div>
        </div>

        {/* Action Button */}
        {isProfileComplete ? (
          <button
            onClick={handleClaimProfileReward}
            disabled={profileClaimed}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
              profileClaimed
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'gold-gradient text-black shadow-md shadow-amber-500/20 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{profileClaimed ? 'Rs. 50 Profile Reward Claimed' : 'Claim Rs. 50 Completion Reward'}</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigateTab('profile')}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Finish Profile in Settings</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Tasks List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Daily Service Tasks</span>
        </h3>

        {/* 1. Watch Video Ad */}
        <div
          onClick={() => setShowWatchAd(true)}
          className="p-4 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Watch Verified Video Ads</h4>
                <span className="text-[9px] bg-red-500/20 text-red-400 px-1 rounded uppercase font-bold">
                  Instant Pay
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">Watch 15s sponsor video to completion</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 15s</span>
                <span>•</span>
                <span>Anti-cheat verified</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-amber-400 block">+Rs. 25</span>
            <button className="mt-1 px-2.5 py-1 rounded-lg gold-gradient text-black font-extrabold text-[10px] shadow-sm">
              Watch
            </button>
          </div>
        </div>

        {/* 2. Daily Quiz */}
        <div
          onClick={() => setShowQuiz(true)}
          className="p-4 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Islamic Finance & Ethics Quiz</h4>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded uppercase font-bold">
                  Daily
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">Answer 5 Shariah knowledge questions</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Halal Knowledge</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-amber-400 block">+Rs. 50</span>
            <button className="mt-1 px-2.5 py-1 rounded-lg gold-gradient text-black font-extrabold text-[10px] shadow-sm">
              Start
            </button>
          </div>
        </div>

        {/* 3. Refer & Earn */}
        <div
          onClick={() => onNavigateTab('referrals')}
          className="p-4 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Invite Friends (10% Lifetime)</h4>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded uppercase font-bold">
                  Passive
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">Get 10% lifetime commission on every task they complete</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                <span>Direct Easypaisa & JazzCash payout</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-emerald-400 block">10% Life</span>
            <button className="mt-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 font-bold text-[10px]">
              Invite
            </button>
          </div>
        </div>

        {/* 4. Telegram Community Join */}
        <div
          onClick={handleTelegramTask}
          className="p-4 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Join Official Telegram Channel</h4>
                <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1 rounded uppercase font-bold">
                  Social
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">Get daily bonus codes & payment proofs</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-amber-400 block">+Rs. 20</span>
            <button className="mt-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 font-bold text-[10px]">
              {telegramClaimed ? 'Joined' : 'Join'}
            </button>
          </div>
        </div>

        {/* 5. 5-Star Android Review */}
        <div
          onClick={handleRatingTask}
          className="p-4 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Rate 5-Stars on Play Store</h4>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded uppercase font-bold">
                  App Task
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">Support Pakistan's Halal Earning network</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-amber-400 block">+Rs. 30</span>
            <button className="mt-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 font-bold text-[10px]">
              {ratingClaimed ? 'Rated' : 'Rate'}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Completed Tasks History */}
      <div className="pt-2">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
          Recent Completed Tasks
        </h3>
        {taskLogs.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-500 bg-[#141419] rounded-2xl border border-zinc-800">
            No completed tasks yet. Watch an ad or take a quiz to start earning!
          </div>
        ) : (
          <div className="space-y-2">
            {taskLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#141419] border border-zinc-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-zinc-200">{log.description}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {new Date(log.createdAt).toLocaleDateString('en-PK', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="font-black text-emerald-400">
                  +Rs. {log.reward}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
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
    </div>
  );
};
