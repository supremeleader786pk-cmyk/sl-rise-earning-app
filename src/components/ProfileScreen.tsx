import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  CreditCard, 
  MessageSquare, 
  Send, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Check, 
  X,
  Code2,
  Sparkles,
  Building2,
  PhoneCall
} from 'lucide-react';
import { HalalInfoModal } from './HalalInfoModal';
import { KotlinNativeSourceModal } from './KotlinNativeSourceModal';
import type { SavedPaymentAccount } from '../types';

export const ProfileScreen: React.FC = () => {
  const { 
    profile, 
    updateProfileDetails, 
    changePassword, 
    addPaymentAccount, 
    logout 
  } = useAuth();

  // Modals & Dialogs
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showHalalModal, setShowHalalModal] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showKotlinModal, setShowKotlinModal] = useState(false);

  // Edit Profile form state
  const [editName, setEditName] = useState(profile?.name || '');
  const [editPhone, setEditPhone] = useState(profile?.phone || '');
  const [editSaving, setEditSaving] = useState(false);

  // Change Password form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passSaving, setPassSaving] = useState(false);

  // Add Payment Method state
  const [methodType, setMethodType] = useState<'Easypaisa' | 'JazzCash' | 'Bank'>('Easypaisa');
  const [methodTitle, setMethodTitle] = useState(profile?.name || '');
  const [methodNumber, setMethodNumber] = useState('');
  const [methodBank, setMethodBank] = useState('Meezan Bank (Islamic)');
  const [methodSaving, setMethodSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim()) return;
    setEditSaving(true);
    try {
      await updateProfileDetails(editName.trim(), editPhone.trim());
      setShowEditProfile(false);
    } catch {
      // handled
    } finally {
      setEditSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    setPassSaving(true);
    try {
      await changePassword(newPassword);
      setPassSuccess('Password updated successfully!');
      setTimeout(() => {
        setShowChangePass(false);
        setNewPassword('');
        setConfirmPassword('');
        setPassSuccess(null);
      }, 1500);
    } catch (err: any) {
      setPassError(err?.message || 'Failed to update password.');
    } finally {
      setPassSaving(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!methodTitle.trim() || !methodNumber.trim()) return;
    setMethodSaving(true);
    try {
      await addPaymentAccount({
        method: methodType,
        accountTitle: methodTitle.trim(),
        accountNumber: methodNumber.trim(),
        bankName: methodType === 'Bank' ? methodBank : undefined,
        isDefault: (profile?.paymentAccounts?.length || 0) === 0
      });
      setShowAddMethod(false);
      setMethodNumber('');
    } catch {
      // handled
    } finally {
      setMethodSaving(false);
    }
  };

  return (
    <div className="min-h-full pb-24 text-white select-none px-4 pt-4 space-y-4">
      {/* Profile Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#181822] to-[#121216] border border-amber-500/40 shadow-xl flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[2px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#111116] rounded-[14px] flex items-center justify-center">
              <User className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {profile?.name || 'Supreme Earner'}
              </h2>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/40">
                PRO
              </span>
            </div>
            <p className="text-xs text-zinc-400">{profile?.email || 'user@slrise.com'}</p>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{profile?.phone || '+92 300 0000000'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditName(profile?.name || '');
            setEditPhone(profile?.phone || '');
            setShowEditProfile(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-300 border border-zinc-700 transition"
        >
          Edit
        </button>
      </div>

      {/* Account Settings List */}
      <div className="p-4 rounded-3xl bg-[#141419] border border-zinc-800 space-y-1">
        <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-2">
          Security & Credentials
        </h3>

        {/* Change Password */}
        <button
          onClick={() => setShowChangePass(true)}
          className="w-full p-3 rounded-2xl hover:bg-zinc-900/80 flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-3 text-zinc-200">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Change Password</div>
              <div className="text-[10px] text-zinc-500">Update your account login security</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        {/* Android Native Kotlin Engine */}
        <button
          onClick={() => setShowKotlinModal(true)}
          className="w-full p-3 rounded-2xl hover:bg-zinc-900/80 flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-3 text-zinc-200">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-amber-300">Android Native Kotlin Codebase</div>
              <div className="text-[10px] text-zinc-500">View or download Jetpack Compose APK source</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Withdrawal Methods Manager (MANDATORY REQUIREMENT) */}
      <div className="p-4 rounded-3xl bg-[#141419] border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white">Saved Withdrawal Accounts</h3>
          </div>
          <button
            onClick={() => setShowAddMethod(true)}
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Account</span>
          </button>
        </div>

        {profile?.paymentAccounts && profile.paymentAccounts.length > 0 ? (
          <div className="space-y-2">
            {profile.paymentAccounts.map((acc) => (
              <div
                key={acc.id}
                className="p-3 rounded-2xl bg-[#0e0e12] border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-amber-400 text-xs">
                    {acc.method === 'Easypaisa' ? 'EP' : acc.method === 'JazzCash' ? 'JC' : 'BK'}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-200">{acc.method}</div>
                    <div className="text-[11px] text-zinc-400">{acc.accountTitle} • {acc.accountNumber}</div>
                    {acc.bankName && <div className="text-[10px] text-zinc-500">{acc.bankName}</div>}
                  </div>
                </div>
                {acc.isDefault && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center text-xs text-zinc-500">
            No withdrawal account saved yet. Add Easypaisa, JazzCash, or Bank to get fast cashouts!
          </div>
        )}
      </div>

      {/* Support & Contact Us (MANDATORY: WhatsApp, Email, Telegram) */}
      <div className="p-4 rounded-3xl bg-[#141419] border border-zinc-800 space-y-2">
        <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-1">
          Support & Official Helpdesk
        </h3>

        {/* WhatsApp */}
        <a
          href="https://wa.me/923000000000?text=Assalam-o-Alaikum%20Supreme%20Leader%20RISE%20Support!%20I%20need%20help%20with%20my%20account."
          target="_blank"
          rel="noreferrer"
          className="w-full p-3 rounded-2xl hover:bg-zinc-900/80 flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-3 text-zinc-200">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold">WhatsApp 24/7 Helpline</div>
              <div className="text-[10px] text-zinc-500">+92 300 0000000 (Instant Chat)</div>
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">Chat</span>
        </a>

        {/* Email */}
        <a
          href="mailto:supremeleader786pk@gmail.com?subject=Supreme%20Leader%20RISE%20Support%20Inquiry"
          className="w-full p-3 rounded-2xl hover:bg-zinc-900/80 flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-3 text-zinc-200">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Email Support</div>
              <div className="text-[10px] text-zinc-500">supremeleader786pk@gmail.com</div>
            </div>
          </div>
          <span className="text-[11px] text-amber-400 font-bold">Send Mail</span>
        </a>

        {/* Telegram */}
        <a
          href="https://t.me/SupremeLeaderRISE"
          target="_blank"
          rel="noreferrer"
          className="w-full p-3 rounded-2xl hover:bg-zinc-900/80 flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-3 text-zinc-200">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Send className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Official Telegram Channel</div>
              <div className="text-[10px] text-zinc-500">@SupremeLeaderRISE (News & Codes)</div>
            </div>
          </div>
          <span className="text-[11px] text-sky-400 font-bold">Join</span>
        </a>
      </div>

      {/* Legal & Shariah Policies */}
      <div className="p-4 rounded-3xl bg-[#141419] border border-zinc-800 space-y-1">
        <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-2">
          Legal & Compliance
        </h3>

        {/* Shariah Halal Details */}
        <button
          onClick={() => setShowHalalModal(true)}
          className="w-full p-3 rounded-2xl hover:bg-zinc-900/80 flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-3 text-zinc-200">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-emerald-300">Halal Earning Constitution</div>
              <div className="text-[10px] text-zinc-500">100% Shariah compliant terms (No gambling/interest)</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        {/* Privacy Policy */}
        <button
          onClick={() => setShowPrivacyPolicy(true)}
          className="w-full p-3 rounded-2xl hover:bg-zinc-900/80 flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-3 text-zinc-200">
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-400">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Privacy Policy & Terms of Service</div>
              <div className="text-[10px] text-zinc-500">Data protection & user agreement</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Logout Button (MANDATORY REQUIREMENT) */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of Supreme Leader RISE</span>
      </button>

      {/* MODAL 1: Edit Profile */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#121217] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white">
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold mb-4">Edit Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#181820] border border-zinc-800 rounded-xl py-2.5 px-3 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#181820] border border-zinc-800 rounded-xl py-2.5 px-3 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 text-zinc-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={editSaving}
                className="w-full mt-4 py-3 rounded-xl gold-gradient text-black font-bold text-xs"
              >
                {editSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Change Password */}
      {showChangePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#121217] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white">
            <button
              onClick={() => setShowChangePass(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold mb-4">Change Password</h3>

            {passError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-3">
                {passError}
              </div>
            )}

            {passSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mb-3">
                {passSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#181820] border border-zinc-800 rounded-xl py-2.5 px-3 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#181820] border border-zinc-800 rounded-xl py-2.5 px-3 text-white outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={passSaving}
                className="w-full mt-4 py-3 rounded-xl gold-gradient text-black font-bold text-xs"
              >
                {passSaving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Withdrawal Method */}
      {showAddMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#121217] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white">
            <button
              onClick={() => setShowAddMethod(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold mb-4">Add Withdrawal Account</h3>

            <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
              {/* Method choice */}
              <div>
                <label className="block text-zinc-400 mb-1">Select Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easypaisa', 'JazzCash', 'Bank'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethodType(m)}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${
                        methodType === m
                          ? 'gold-gradient text-black font-extrabold border-amber-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {methodType === 'Bank' && (
                <div>
                  <label className="block text-zinc-400 mb-1">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={methodBank}
                    onChange={(e) => setMethodBank(e.target.value)}
                    placeholder="e.g. Meezan Bank, HBL"
                    className="w-full bg-[#181820] border border-zinc-800 rounded-xl py-2.5 px-3 text-white outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-zinc-400 mb-1">Account Title (Your Name)</label>
                <input
                  type="text"
                  required
                  value={methodTitle}
                  onChange={(e) => setMethodTitle(e.target.value)}
                  placeholder="e.g. Muhammad Hamza"
                  className="w-full bg-[#181820] border border-zinc-800 rounded-xl py-2.5 px-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">
                  {methodType === 'Bank' ? 'IBAN / Account Number' : 'Mobile Account Number'}
                </label>
                <input
                  type="text"
                  required
                  value={methodNumber}
                  onChange={(e) => setMethodNumber(e.target.value)}
                  placeholder={methodType === 'Bank' ? 'PK00MEZN000000...' : '0300 1234567'}
                  className="w-full bg-[#181820] border border-zinc-800 rounded-xl py-2.5 px-3 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={methodSaving}
                className="w-full mt-4 py-3 rounded-xl gold-gradient text-black font-bold text-xs"
              >
                {methodSaving ? 'Saving Account...' : 'Save Withdrawal Method'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Privacy Policy & Terms */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#121217] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Privacy Policy & Terms of Service</span>
            </h3>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="font-bold text-amber-400 mb-1">1. Halal Operating Agreement</h4>
                <p>Supreme Leader RISE connects users with legitimate sponsor promotions, digital surveys, and knowledge assessments. No user funds are ever pooled into lotteries, betting, or speculative interest-bearing assets.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="font-bold text-amber-400 mb-1">2. Payout Protocol</h4>
                <p>Withdrawals are disbursed directly to Easypaisa, JazzCash, or verified Pakistani bank accounts. Minimum withdrawal is fixed at Rs. 500 PKR to ensure efficient batch clearing.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="font-bold text-amber-400 mb-1">3. Privacy & Zero Selling of Data</h4>
                <p>Your phone number and withdrawal details are strictly used to dispatch payouts. We never sell or distribute your private credentials.</p>
              </div>
            </div>

            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="w-full mt-4 py-2.5 rounded-xl gold-gradient text-black font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: Logout Confirmation (MANDATORY REQUIREMENT) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xs bg-[#121217] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">Confirm Log Out</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Are you sure you want to sign out of Supreme Leader RISE?
            </p>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  await logout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-md shadow-red-900/30"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <HalalInfoModal isOpen={showHalalModal} onClose={() => setShowHalalModal(false)} />
      <KotlinNativeSourceModal isOpen={showKotlinModal} onClose={() => setShowKotlinModal(false)} />
    </div>
  );
};
