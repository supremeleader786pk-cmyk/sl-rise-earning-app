import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  UserPlus, 
  TrendingUp, 
  Coins, 
  HelpCircle,
  MessageCircle
} from 'lucide-react';

export const ReferralScreen: React.FC = () => {
  const { profile, referrals, simulateReferralReward } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [friendsCount, setFriendsCount] = useState(10);
  const [avgDailyEarnings, setAvgDailyEarnings] = useState(300);
  const [simulating, setSimulating] = useState(false);

  const refCode = profile?.referralCode || 'RISE-7860';
  const refLink = `https://slrise.app/ref/${refCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(refCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum! 🌟 Join Supreme Leader RISE, Pakistan's 100% Halal earning platform. Use my referral code: *${refCode}* to get Rs. 150 welcome bonus! Start earning daily with video tasks, quizzes & instant Easypaisa/JazzCash withdrawals.\n\nDownload & Join: ${refLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Supreme Leader RISE - Halal Earning',
          text: `Use my referral code ${refCode} to get Rs. 150 welcome bonus on Supreme Leader RISE!`,
          url: refLink
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleShareWhatsApp();
    }
  };

  // 10% commission calculation
  const totalDailyTeamVolume = friendsCount * avgDailyEarnings;
  const myDailyCommission = Math.round(totalDailyTeamVolume * 0.10); // 10%
  const myMonthlyCommission = myDailyCommission * 30;

  const handleSimulateCommission = async () => {
    setSimulating(true);
    const sampleNames = [
      'Zubair Tariq (Rawalpindi)',
      'Ali Raza (Multan)',
      'Hamza Tariq (Faisalabad)',
      'Sohail Ahmed (Islamabad)',
      'Farhan Akhtar (Peshawar)'
    ];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomTaskEarnings = 200; // Rs. 200 task completed -> Rs. 20 commission (10%)
    await simulateReferralReward(randomName, randomTaskEarnings);
    setSimulating(false);
  };

  return (
    <div className="min-h-full pb-24 text-white select-none px-4 pt-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            <span>Referral Network</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              10% Lifetime
            </span>
          </h2>
          <p className="text-xs text-zinc-400">Invite friends & build perpetual Halal commission</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* Referral Code & Share Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#1c1c28] to-[#121218] border border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Your Exclusive Referral Code
          </span>
          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 border border-zinc-700">
            Life Valid
          </span>
        </div>

        {/* Big Code Display */}
        <div className="p-3.5 rounded-2xl bg-[#0e0e13] border border-amber-500/30 flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block tracking-wider font-mono">
              Referral Code
            </span>
            <span className="text-2xl font-black tracking-widest text-white font-mono">
              {refCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 rounded-xl gold-gradient text-black font-extrabold text-xs flex items-center gap-1.5 active:scale-95 transition shadow-sm"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Share buttons row */}
        <div className="flex gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition shadow-md shadow-emerald-900/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Invite</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs flex items-center justify-center gap-1.5 border border-zinc-700 active:scale-95 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Link</span>
          </button>
        </div>

        {/* Referral Link Copy Bar */}
        <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-[#0e0e13] border border-zinc-800 text-xs">
          <span className="font-mono text-zinc-400 truncate text-[11px] mr-2">{refLink}</span>
          <button
            onClick={handleCopyLink}
            className="text-amber-400 hover:text-amber-300 text-[11px] font-bold shrink-0"
          >
            {copiedLink ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Referral Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-[#141419] border border-zinc-800 text-center">
          <div className="text-[10px] text-zinc-400 mb-1">Total Joined</div>
          <div className="text-lg font-black text-white">{profile?.referralCount || 0}</div>
          <div className="text-[9px] text-zinc-500">Friends</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#141419] border border-zinc-800 text-center">
          <div className="text-[10px] text-zinc-400 mb-1">Commission</div>
          <div className="text-lg font-black text-amber-400">10%</div>
          <div className="text-[9px] text-zinc-500">Lifetime</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#141419] border border-zinc-800 text-center">
          <div className="text-[10px] text-zinc-400 mb-1">Earned</div>
          <div className="text-lg font-black text-emerald-400">
            Rs. {profile?.referralEarnings?.toLocaleString() || '0'}
          </div>
          <div className="text-[9px] text-zinc-500">PKR</div>
        </div>
      </div>

      {/* 10% LIFETIME COMMISSION CALCULATOR */}
      <div className="p-4 rounded-3xl bg-[#141419] border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">10% Lifetime Commission Calculator</h4>
          </div>
          <span className="text-[10px] text-zinc-500">Interactive</span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Friends in your team:</span>
              <span className="font-bold text-amber-400">{friendsCount} active earners</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={friendsCount}
              onChange={(e) => setFriendsCount(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Average daily tasks per friend:</span>
              <span className="font-bold text-amber-400">Rs. {avgDailyEarnings} PKR / day</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={avgDailyEarnings}
              onChange={(e) => setAvgDailyEarnings(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Results Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-zinc-900 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 block">Your Estimated Monthly Passive Earning:</span>
            <span className="text-xl font-black text-emerald-400">
              Rs. {myMonthlyCommission.toLocaleString()} PKR
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 block">Daily Payout</span>
            <span className="text-xs font-bold text-amber-300">+Rs. {myDailyCommission}/day</span>
          </div>
        </div>

        {/* Shariah Compliance Note */}
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Halal Simsarah Guarantee: The 10% commission is paid exclusively by Supreme Leader RISE company funds. Your friends receive 100% of their earnings with zero deductions.
          </p>
        </div>
      </div>

      {/* Interactive Simulation Tester Tool */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-amber-300">Test Referral System</h4>
          <p className="text-[10px] text-zinc-400">Simulate a referred user doing tasks and getting 10% bonus</p>
        </div>
        <button
          onClick={handleSimulateCommission}
          disabled={simulating}
          className="px-3 py-1.5 rounded-xl gold-gradient text-black font-extrabold text-xs active:scale-95 transition shadow-sm"
        >
          {simulating ? 'Simulating...' : '+Simulate 10%'}
        </button>
      </div>

      {/* Referrals Team List */}
      <div>
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <UserPlus className="w-3.5 h-3.5 text-amber-400" />
          <span>My Referral Team ({referrals.length})</span>
        </h3>

        {referrals.length === 0 ? (
          <div className="p-5 text-center text-xs text-zinc-500 bg-[#141419] rounded-2xl border border-zinc-800">
            You haven't invited anyone yet. Share your code to earn 10% on every task your friends complete!
          </div>
        ) : (
          <div className="space-y-2">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="p-3 rounded-2xl bg-[#141419] border border-zinc-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-bold text-[11px]">
                    {ref.referredName[0] || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-200">{ref.referredName}</div>
                    <div className="text-[10px] text-zinc-500">
                      Joined: {new Date(ref.joinedAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-400 block">+Rs. {ref.commissionEarned}</span>
                  <span className="text-[10px] text-zinc-500">10% Commission</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
