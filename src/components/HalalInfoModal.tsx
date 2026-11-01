import React from 'react';
import { ShieldCheck, X, CheckCircle, Scale, Coins, FileCheck } from 'lucide-react';

interface HalalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HalalInfoModal: React.FC<HalalInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121217] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">100% Halal Certification</h3>
            <p className="text-xs text-amber-400/90 font-medium">Shariah Principles & Financial Ethics</p>
          </div>
        </div>

        {/* Arabic Bismillah */}
        <div className="text-center py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-serif mb-4">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>

        {/* Main Principles */}
        <div className="space-y-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#18181f] border border-zinc-800/80">
            <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              1. Zero Gambling & Betting (No Maysir / Qimar)
            </div>
            <p className="text-zinc-300 leading-relaxed">
              We never host lottery draws, paid spins, or luck-based gambling games. You never risk any personal capital. Every rupee earned is tied to real tasks.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#18181f] border border-zinc-800/80">
            <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
              <Scale className="w-4 h-4 text-emerald-400" />
              2. Zero Interest / Usury (No Riba)
            </div>
            <p className="text-zinc-300 leading-relaxed">
              We do not lend money, charge interest, or offer interest-bearing savings accounts. Your account balance represents purely earned compensation.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#18181f] border border-zinc-800/80">
            <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
              <Coins className="w-4 h-4 text-emerald-400" />
              3. Islamic Contract of Service (Ju'ala / Ujrah)
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Under Islamic Jurisprudence (Fiqh), earning wages by completing specified tasks (watching verified sponsor promotions, answering educational quizzes, completing profile information) is classified as a legitimate <strong>Ujrah (service fee)</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#18181f] border border-zinc-800/80">
            <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              4. 10% Referral Marketing (Ju'ala / Simsarah)
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Our 10% referral commission acts as legitimate brokerage/marketing compensation (Simsarah). Crucially, <strong>nothing is deducted from your referred friend’s payout</strong>—the 10% is paid directly out of the platform’s advertising revenue.
            </p>
          </div>
        </div>

        {/* Verification Note */}
        <div className="mt-5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
          <p className="font-semibold text-zinc-300 mb-0.5">Approved under Islamic Digital Commerce Guidelines:</p>
          <p>Transparent rules, zero investment risk, ethical advertisers, and instant withdrawal through Pakistan State Bank authorized channels (Easypaisa, JazzCash, 1Link Banks).</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-xl gold-gradient text-black font-bold text-xs uppercase tracking-wider active:scale-95 transition"
        >
          Understood & Verified
        </button>
      </div>
    </div>
  );
};
