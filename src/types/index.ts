export interface SavedPaymentAccount {
  id: string;
  method: 'Easypaisa' | 'JazzCash' | 'Bank';
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  todayEarnings: number;
  totalEarnings: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  referralEarnings: number;
  lastCheckInDate?: string;
  checkInStreak: number;
  isProfileComplete: boolean;
  role: 'user' | 'admin';
  paymentAccounts: SavedPaymentAccount[];
  createdAt: string;
  updatedAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'Easypaisa' | 'JazzCash' | 'Bank';
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
}

export interface TaskLog {
  id: string;
  userId: string;
  taskType: 'ad' | 'quiz' | 'profile' | 'checkin' | 'referral' | 'partner';
  reward: number;
  description: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredName: string;
  commissionEarned: number;
  joinedAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
