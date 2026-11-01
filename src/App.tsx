/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNav, type NavTab } from './components/BottomNav';
import { DashboardScreen } from './components/DashboardScreen';
import { TasksScreen } from './components/TasksScreen';
import { ReferralScreen } from './components/ReferralScreen';
import { WalletScreen } from './components/WalletScreen';
import { ProfileScreen } from './components/ProfileScreen';

const MainAppContent: React.FC = () => {
  const { profile, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  if (loading) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#08080a] text-white">
        <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-amber-300 font-semibold tracking-wide">Connecting to Supreme Leader RISE...</p>
      </div>
    );
  }

  // 1. Initial Splash Screen
  if (showSplash) {
    return <SplashScreen onContinue={() => setShowSplash(false)} />;
  }

  // 2. Auth Screen if not logged in
  if (!profile) {
    return <AuthScreen />;
  }

  // 3. Authenticated App in Android Material 3 Frame
  return (
    <AndroidFrame>
      <div className="flex-1 w-full relative">
        {activeTab === 'home' && <DashboardScreen onNavigateTab={setActiveTab} />}
        {activeTab === 'tasks' && <TasksScreen onNavigateTab={setActiveTab} />}
        {activeTab === 'referrals' && <ReferralScreen />}
        {activeTab === 'wallet' && <WalletScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* Material 3 Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </AndroidFrame>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
