import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  FileText,
  X,
  ExternalLink
} from 'lucide-react';
import type { Withdrawal } from '../types';

const PAKISTAN_BANKS = [
  'Meezan Bank (Islamic)',
  'Faysal Bank (Islamic)',
  'Bank Alfalah Islamic',
  'Habib Bank Limited (HBL)',
  'United Bank Limited (UBL)',
  'MCB Bank',
  'Allied Bank Limited (ABL)',
  'Standard Chartered Bank',
  'National Bank of Pakistan (NBP)'
];

export const WalletScreen: React.FC = () => {
  const { profile, withdrawals, submitWithdrawal } = useAuth();
  
  // Withdrawal Form States
  const [method, setMethod] = useState<'Easypaisa' | 'JazzCash' | 'Bank'>('Easypaisa');
  const [amount, setAmount] = useState<string>('500');
  const [accountTitle, setAccountTitle] = useState<string>(profile?.name || '');
  const [accountNumber, setAccountNumber] = useState<string>(profile?.phone || '');
  const [bankName, setBankName] = useState<string>(PAKISTAN_BANKS[0]);
  
  // Feedback & Receipt
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Withdrawal | null>(null);

  const balance = profile?.balance || 0;
  const minWithdraw = 500;
  const progressToMin = Math.min(100, (balance / minWithdraw) * 100);

  // Preset chips
  const quickAmounts = [500, 1000, 2000, 5000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount)) {
      setError('Please enter a valid numeric amount.');
      return;
    }

    if (numAmount < 500) {
      setError('Minimum withdrawal limit is Rs. 500 PKR.');
      return;
    }

    if (numAmount > balance) {
      setError(`Insufficient balance. You currently have Rs. ${balance.toLocaleString()} PKR.`);
      return;
    }

    if (!accountTitle.trim()) {
      setError('Please enter the Account Holder Title.');
      return;
    }

    if (!accountNumber.trim()) {
      setError('Please enter the Account / Mobile Number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitWithdrawal(
        numAmount,
        method,
        accountTitle.trim(),
        accountNumber.trim(),
        method === 'Bank' ? bankName : undefined
      );

      if (res.success) {
        setSuccessMessage(res.message);
        setAmount('500');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Withdrawal failed. Please check your network.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full pb-24 text-white select-none px-4 pt-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            <span>Withdrawal Wallet</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
              Min Rs. 500
            </span>
          </h2>
          <p className="text-xs text-zinc-400">Cashout your earned balance to Pakistani accounts</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Wallet className="w-5 h-5" />
        </div>
      </div>

      {/* Available Balance Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#1b1b24] to-[#111116] border border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Available for Instant Cashout
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
            0% Service Fee
          </span>
        </div>

        <div className="flex items-baseline gap-2 my-2">
          <span className="text-3xl font-black text-white font-sans">
            Rs. {balance.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-amber-400">PKR</span>
        </div>

        {/* Progress Bar to Min Rs. 500 */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
            <span>Minimum Cashout Progress: Rs. {minWithdraw}</span>
            <span className={balance >= minWithdraw ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {balance >= minWithdraw ? 'Ready to Withdraw!' : `Need Rs. ${Math.max(0, minWithdraw - balance)} more`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                balance >= minWithdraw ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${progressToMin}%` }}
            />
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="p-4 rounded-3xl bg-[#141419] border border-zinc-800 space-y-4">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span>Select Payment Method</span>
        </h3>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {/* Easypaisa */}
          <button
            type="button"
            onClick={() => setMethod('Easypaisa')}
            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
              method === 'Easypaisa'
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/50'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs">
              EP
            </div>
            <span className="text-xs font-bold">Easypaisa</span>
            <span className="text-[9px] text-zinc-500">Instant</span>
          </button>

          {/* JazzCash */}
          <button
            type="button"
            onClick={() => setMethod('JazzCash')}
            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
              method === 'JazzCash'
                ? 'bg-orange-950/40 border-orange-500 text-orange-300 shadow-md shadow-orange-950/50'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-black text-xs">
              JC
            </div>
            <span className="text-xs font-bold">JazzCash</span>
            <span className="text-[9px] text-zinc-500">Instant</span>
          </button>

          {/* Bank Transfer */}
          <button
            type="button"
            onClick={() => setMethod('Bank')}
            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
              method === 'Bank'
                ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-md shadow-amber-950/50'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xs">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold">Bank Transfer</span>
            <span className="text-[9px] text-zinc-500">1Link IBAN</span>
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Amount input & Quick Chips */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Withdrawal Amount (PKR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">
                Rs.
              </span>
              <input
                type="number"
                min="500"
                step="50"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full bg-[#101014] border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 pl-12 pr-4 text-sm font-bold text-white outline-none"
              />
            </div>

            {/* Quick chips */}
            <div className="flex gap-2 mt-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold border transition ${
                    amount === String(q)
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Rs. {q}
                </button>
              ))}
            </div>
          </div>

          {/* Bank Selector (if Bank chosen) */}
          {method === 'Bank' && (
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Select Islamic / Commercial Bank
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-[#101014] border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
              >
                {PAKISTAN_BANKS.map((b) => (
                  <option key={b} value={b} className="bg-zinc-900">
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Account Title */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Account Title (Name on Account)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Muhammad Hamza"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              className="w-full bg-[#101014] border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 px-3 text-xs text-white placeholder-zinc-600 outline-none"
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              {method === 'Bank' ? 'IBAN / Bank Account Number' : `${method} Mobile Number`}
            </label>
            <div className="relative">
              <PhoneCall className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder={method === 'Bank' ? 'PK00MEZN0000001234567890' : '0300 1234567'}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-[#101014] border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-600 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || balance < minWithdraw}
            className="w-full py-3.5 rounded-xl gold-gradient text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition mt-2 disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Submitting Withdrawal Request...
              </span>
            ) : balance < minWithdraw ? (
              `Min Rs. ${minWithdraw} Required (Current: Rs. ${balance})`
            ) : (
              `Submit Rs. ${amount} Withdrawal Request`
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Processed within 2 to 24 business hours • Shariah compliant</span>
        </div>
      </div>

      {/* WITHDRAWALS HISTORY (MANDATORY REQUIREMENT) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Withdrawal History ({withdrawals.length})</span>
          </span>
          <span className="text-[10px] text-zinc-500">Tap for Receipt</span>
        </h3>

        {withdrawals.length === 0 ? (
          <div className="p-5 text-center text-xs text-zinc-500 bg-[#141419] rounded-2xl border border-zinc-800">
            No withdrawal history found yet. Reach Rs. 500 to make your first cashout!
          </div>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((w) => {
              const isCompleted = w.status === 'completed' || w.status === 'approved';
              const isPending = w.status === 'pending';

              return (
                <div
                  key={w.id}
                  onClick={() => setSelectedReceipt(w)}
                  className="p-3.5 rounded-2xl bg-[#141419] border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer flex items-center justify-between text-xs transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                      {w.method === 'Easypaisa' ? 'EP' : w.method === 'JazzCash' ? 'JC' : 'BK'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-zinc-200">
                        <span>{w.method}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">({w.id})</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {w.accountTitle} • {w.accountNumber.slice(-4) ? `•••${w.accountNumber.slice(-4)}` : w.accountNumber}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {new Date(w.createdAt).toLocaleDateString('en-PK', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-white">
                      Rs. {w.amount.toLocaleString()}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 uppercase ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#121217] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 pb-4 border-b border-zinc-800">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold">Official E-Cash Receipt</h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Txn ID: {selectedReceipt.id}</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Amount Paid:</span>
                <span className="font-extrabold text-white text-sm">Rs. {selectedReceipt.amount.toLocaleString()} PKR</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Channel:</span>
                <span className="font-bold text-amber-400">{selectedReceipt.method}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Account Title:</span>
                <span className="font-semibold text-zinc-200">{selectedReceipt.accountTitle}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Account Number:</span>
                <span className="font-mono text-zinc-200">{selectedReceipt.accountNumber}</span>
              </div>
              {selectedReceipt.bankName && (
                <div className="flex justify-between text-zinc-400">
                  <span>Bank Name:</span>
                  <span className="text-zinc-200">{selectedReceipt.bankName}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Processing Status:</span>
                <span className="font-bold uppercase text-emerald-400">{selectedReceipt.status}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Submission Date:</span>
                <span className="text-zinc-300">{new Date(selectedReceipt.createdAt).toLocaleString('en-PK')}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 text-center">
              Verified by Supreme Leader RISE Finance Node • Shariah Monitored
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full mt-4 py-2.5 rounded-xl gold-gradient text-black font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
