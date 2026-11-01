import React from 'react';
import { Home, Sparkles, Users, Wallet, User } from 'lucide-react';

export type NavTab = 'home' | 'tasks' | 'referrals' | 'wallet' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'tasks' as const, label: 'Tasks', icon: Sparkles, badge: 'HOT' },
    { id: 'referrals' as const, label: 'Referrals', icon: Users, badge: '10%' },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d12]/95 backdrop-blur-lg border-t border-amber-500/25 px-2 py-1.5 shadow-2xl max-w-[480px] mx-auto">
      <nav className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 group active:scale-95"
            >
              {/* Badge if present */}
              {tab.badge && (
                <span className={`absolute -top-1 right-1 text-[8px] font-black px-1 py-0.2 rounded-full uppercase tracking-tighter ${
                  tab.id === 'tasks' ? 'bg-red-500 text-white' : 'bg-amber-400 text-black'
                }`}>
                  {tab.badge}
                </span>
              )}

              {/* Material 3 active pill backdrop */}
              <div
                className={`flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/30'
                    : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : ''
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'text-amber-400 font-bold' : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
