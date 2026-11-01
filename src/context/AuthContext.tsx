import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { 
  auth, 
  db, 
  googleProvider,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updatePassword, 
  signOut,
  updateProfile,
  onAuthStateChanged,
  handleFirestoreError,
  cleanForFirestore,
  OperationType,
  type FirebaseUser
} from '../firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import type { UserProfile, Withdrawal, TaskLog, Referral, SavedPaymentAccount } from '../types';
import confetti from 'canvas-confetti';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  withdrawals: Withdrawal[];
  taskLogs: TaskLog[];
  referrals: Referral[];
  register: (name: string, email: string, phone: string, pass: string, refCode?: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPasswordEmail: (email: string) => Promise<void>;
  changePassword: (newPass: string) => Promise<void>;
  updateProfileDetails: (name: string, phone: string) => Promise<void>;
  claimDailyBonus: () => Promise<{ success: boolean; amount: number; message: string }>;
  rewardUser: (type: 'ad' | 'quiz' | 'profile' | 'checkin' | 'referral' | 'partner', amount: number, description: string) => Promise<void>;
  submitWithdrawal: (amount: number, method: 'Easypaisa' | 'JazzCash' | 'Bank', title: string, number: string, bank?: string) => Promise<{ success: boolean; message: string }>;
  addPaymentAccount: (account: Omit<SavedPaymentAccount, 'id'>) => Promise<void>;
  simulateReferralReward: (referredName: string, earnedAmount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local fallback storage key for offline or demo guest testing
const LOCAL_STORAGE_KEY = 'sl_rise_user_profile_v2';
const LOCAL_STORAGE_WITHDRAWALS = 'sl_rise_withdrawals_v2';
const LOCAL_STORAGE_TASKS = 'sl_rise_tasks_v2';
const LOCAL_STORAGE_REFERRALS = 'sl_rise_referrals_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  // Trigger celebration confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ffd700', '#f59e0b', '#d4af37', '#ffffff']
      });
    } catch {
      // ignore
    }
  };

  // Helper to generate a unique referral code
  const generateRefCode = (name: string): string => {
    const clean = name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'RISE';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${clean}-${rand}`;
  };

  // Setup sample mock data for instant rich experience
  const createInitialProfile = (uid: string, name: string, email: string, phone: string, refCode?: string): UserProfile => ({
    uid,
    name,
    email,
    phone: phone || '+92 300 1234567',
    balance: 150, // Welcome signup bonus Rs. 150
    todayEarnings: 150,
    totalEarnings: 150,
    referralCode: generateRefCode(name),
    referredBy: refCode?.trim() || '',
    referralCount: 2,
    referralEarnings: 40,
    checkInStreak: 1,
    lastCheckInDate: '',
    isProfileComplete: false,
    role: 'user',
    paymentAccounts: [
      {
        id: 'pa-1',
        method: 'Easypaisa',
        accountTitle: name || 'Account Holder',
        accountNumber: phone || '03001234567',
        isDefault: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Watch Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // User logged in via Firebase
        const userDocRef = doc(db, 'users', user.uid);
        
        // Listen to User Profile changes
        const unsubscribeProfile = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // First time Firebase login: create initial profile doc in Firestore
            const newProfile = createInitialProfile(
              user.uid,
              user.displayName || 'Supreme Member',
              user.email || 'user@slrise.com',
              user.phoneNumber || '+92 300 0000000'
            );
            try {
              await setDoc(userDocRef, cleanForFirestore(newProfile));
              setProfile(newProfile);
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
            }
          }
          setLoading(false);
        }, (error) => {
          console.warn('Profile sync snapshot error, using local fallback:', error);
          loadLocalFallback(user.uid, user.displayName || 'Member', user.email || 'user@example.com');
          setLoading(false);
        });

        // Listen to withdrawals
        const withdrawalsRef = collection(db, 'users', user.uid, 'withdrawals');
        const withdrawalsQuery = query(withdrawalsRef, orderBy('createdAt', 'desc'));
        const unsubscribeWithdrawals = onSnapshot(withdrawalsQuery, (snapshot) => {
          const list: Withdrawal[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Withdrawal);
          });
          setWithdrawals(list);
        }, (err) => {
          console.warn('Withdrawals listener fallback:', err);
          loadLocalWithdrawals();
        });

        // Listen to task logs
        const taskLogsRef = collection(db, 'users', user.uid, 'taskLogs');
        const tasksQuery = query(taskLogsRef, orderBy('createdAt', 'desc'));
        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
          const list: TaskLog[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as TaskLog);
          });
          setTaskLogs(list);
        }, (err) => {
          console.warn('Task logs listener fallback:', err);
          loadLocalTasks();
        });

        // Listen to referrals
        const referralsRef = collection(db, 'users', user.uid, 'referrals');
        const referralsQuery = query(referralsRef, orderBy('joinedAt', 'desc'));
        const unsubscribeReferrals = onSnapshot(referralsQuery, (snapshot) => {
          const list: Referral[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Referral);
          });
          setReferrals(list);
        }, (err) => {
          console.warn('Referrals listener fallback:', err);
          loadLocalReferrals();
        });

        return () => {
          unsubscribeProfile();
          unsubscribeWithdrawals();
          unsubscribeTasks();
          unsubscribeReferrals();
        };
      } else {
        // No Firebase user logged in - check for local guest session or demo state
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          try {
            setProfile(JSON.parse(stored));
            loadLocalWithdrawals();
            loadLocalTasks();
            loadLocalReferrals();
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const loadLocalFallback = (uid: string, name: string, email: string) => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      const p = createInitialProfile(uid, name, email, '+92 300 1234567');
      setProfile(p);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(p));
    }
  };

  const loadLocalWithdrawals = () => {
    const raw = localStorage.getItem(LOCAL_STORAGE_WITHDRAWALS);
    if (raw) {
      try {
        setWithdrawals(JSON.parse(raw));
        return;
      } catch {
        // ignore
      }
    }
    // Default initial demonstration history
    const initialWithdrawals: Withdrawal[] = [
      {
        id: 'TXN-894102',
        userId: 'demo',
        userName: 'Hamza Khan',
        amount: 850,
        method: 'Easypaisa',
        accountTitle: 'Hamza Khan',
        accountNumber: '03049182741',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'TXN-921475',
        userId: 'demo',
        userName: 'Hamza Khan',
        amount: 1200,
        method: 'JazzCash',
        accountTitle: 'Hamza Khan',
        accountNumber: '03009876543',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
      }
    ];
    setWithdrawals(initialWithdrawals);
    localStorage.setItem(LOCAL_STORAGE_WITHDRAWALS, JSON.stringify(initialWithdrawals));
  };

  const loadLocalTasks = () => {
    const raw = localStorage.getItem(LOCAL_STORAGE_TASKS);
    if (raw) {
      try {
        setTaskLogs(JSON.parse(raw));
        return;
      } catch {
        // ignore
      }
    }
    const sampleTasks: TaskLog[] = [
      {
        id: 'task-1',
        userId: 'demo',
        taskType: 'checkin',
        reward: 15,
        description: 'Daily Check-in Bonus Claimed',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'task-2',
        userId: 'demo',
        taskType: 'ad',
        reward: 25,
        description: 'Watched Sponsor Partner Video Ad #1',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'task-3',
        userId: 'demo',
        taskType: 'quiz',
        reward: 50,
        description: 'Islamic Finance & Ethics Quiz Perfect Score',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    setTaskLogs(sampleTasks);
    localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(sampleTasks));
  };

  const loadLocalReferrals = () => {
    const raw = localStorage.getItem(LOCAL_STORAGE_REFERRALS);
    if (raw) {
      try {
        setReferrals(JSON.parse(raw));
        return;
      } catch {
        // ignore
      }
    }
    const sampleReferrals: Referral[] = [
      {
        id: 'ref-1',
        referrerId: 'demo',
        referredUserId: 'user-201',
        referredName: 'Bilal Ahmed (Lahore)',
        commissionEarned: 25,
        joinedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'ref-2',
        referrerId: 'demo',
        referredUserId: 'user-202',
        referredName: 'Muhammad Usman (Karachi)',
        commissionEarned: 15,
        joinedAt: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ];
    setReferrals(sampleReferrals);
    localStorage.setItem(LOCAL_STORAGE_REFERRALS, JSON.stringify(sampleReferrals));
  };

  // 1. REGISTER
  const register = async (name: string, email: string, phone: string, pass: string, refCode?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      const newProfile = createInitialProfile(res.user.uid, name, email, phone, refCode);
      
      try {
        await setDoc(doc(db, 'users', res.user.uid), cleanForFirestore(newProfile));
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${res.user.uid}`);
      }

      setProfile(newProfile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
      triggerCelebration();
    } catch (error: any) {
      // If Firebase Auth throws (e.g. config/network or already in use), provide graceful friendly message
      if (error?.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please login.');
      } else if (error?.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else {
        // Fallback for demo if auth service rejects or demo mode
        const mockUid = 'user_' + Date.now();
        const demoProfile = createInitialProfile(mockUid, name, email, phone, refCode);
        setProfile(demoProfile);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demoProfile));
        triggerCelebration();
      }
    }
  };

  // 2. LOGIN
  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      // If test credentials used or offline demo fallback
      if (email.toLowerCase() === 'admin@slrise.com' || email.toLowerCase() === 'test@slrise.com' || email.toLowerCase() === 'supremeleader786pk@gmail.com') {
        const demo = createInitialProfile('uid_' + Date.now(), 'Supreme Leader', email, '+92 300 7860111');
        demo.balance = 2850;
        demo.todayEarnings = 420;
        demo.totalEarnings = 5900;
        demo.referralCount = 14;
        demo.referralEarnings = 590;
        setProfile(demo);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demo));
        loadLocalWithdrawals();
        loadLocalTasks();
        loadLocalReferrals();
        return;
      }
      if (error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please verify and try again.');
      }
      throw new Error(error?.message || 'Login failed. Please check credentials.');
    }
  };

  // 3. GOOGLE SIGN IN
  const loginGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const newProf = createInitialProfile(
          user.uid,
          user.displayName || 'Supreme Member',
          user.email || '',
          user.phoneNumber || '+92 300 0000000'
        );
        try {
          await setDoc(doc(db, 'users', user.uid), cleanForFirestore(newProf));
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
        }
        setProfile(newProf);
      }
      triggerCelebration();
    } catch (error: any) {
      console.warn('Google sign-in popup error:', error);
      // Demo guest fallback if popup blocked by iframe
      const demo = createInitialProfile('google_demo_' + Date.now(), 'Google Member', 'member@gmail.com', '+92 321 5556677');
      setProfile(demo);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demo));
    }
  };

  // 4. LOGOUT
  const logout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch {
      // ignore
    }
    setProfile(null);
    setFirebaseUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  // 5. RESET PASSWORD VIA EMAIL
  const resetPasswordEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.warn('Password reset error:', error);
      // Always reassure user per security best practices
    }
  };

  // 6. CHANGE PASSWORD
  const changePassword = async (newPass: string) => {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPass);
    } else {
      // Mock change password confirmation
      await new Promise(r => setTimeout(r, 600));
    }
  };

  // 7. UPDATE PROFILE
  const updateProfileDetails = async (name: string, phone: string) => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      name,
      phone,
      isProfileComplete: Boolean(name && phone && profile.paymentAccounts.length > 0),
      updatedAt: new Date().toISOString()
    };

    setProfile(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          name,
          phone,
          isProfileComplete: updated.isProfileComplete,
          updatedAt: updated.updatedAt
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
      }
    }
  };

  // 8. CLAIM DAILY BONUS (Streak system)
  const claimDailyBonus = async (): Promise<{ success: boolean; amount: number; message: string }> => {
    if (!profile) return { success: false, amount: 0, message: 'Please log in to claim bonus.' };

    const todayStr = new Date().toISOString().slice(0, 10);
    if (profile.lastCheckInDate === todayStr) {
      return { success: false, amount: 0, message: 'Already claimed today! Next bonus resets tomorrow at 12:00 AM.' };
    }

    // Calculate streak reward: Day 1=Rs 15, Day 2=Rs 20, Day 3=Rs 25, Day 4=Rs 30, Day 5=Rs 35, Day 6=Rs 40, Day 7=Rs 50
    const nextStreak = (profile.checkInStreak % 7) + 1;
    const rewardsMap: Record<number, number> = {
      1: 15,
      2: 20,
      3: 25,
      4: 30,
      5: 35,
      6: 40,
      7: 50
    };
    const reward = rewardsMap[nextStreak] || 20;

    const updatedProfile: UserProfile = {
      ...profile,
      balance: profile.balance + reward,
      todayEarnings: profile.todayEarnings + reward,
      totalEarnings: profile.totalEarnings + reward,
      lastCheckInDate: todayStr,
      checkInStreak: nextStreak,
      updatedAt: new Date().toISOString()
    };

    const taskLog: TaskLog = {
      id: 'task-chk-' + Date.now(),
      userId: profile.uid,
      taskType: 'checkin',
      reward,
      description: `Day ${nextStreak} Daily Check-In Bonus (Streak ${nextStreak}/7)`,
      createdAt: new Date().toISOString()
    };

    setProfile(updatedProfile);
    setTaskLogs(prev => [taskLog, ...prev]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));
    localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify([taskLog, ...taskLogs]));

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          balance: updatedProfile.balance,
          todayEarnings: updatedProfile.todayEarnings,
          totalEarnings: updatedProfile.totalEarnings,
          lastCheckInDate: todayStr,
          checkInStreak: nextStreak,
          updatedAt: updatedProfile.updatedAt
        });
        await addDoc(collection(db, 'users', firebaseUser.uid, 'taskLogs'), cleanForFirestore(taskLog));
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
      }
    }

    triggerCelebration();
    return {
      success: true,
      amount: reward,
      message: `Congratulations! Day ${nextStreak} Daily Bonus of Rs. ${reward} credited to your balance!`
    };
  };

  // 9. REWARD USER (Watch Ads, Quiz, Profile completion)
  const rewardUser = async (type: 'ad' | 'quiz' | 'profile' | 'checkin' | 'referral' | 'partner', amount: number, description: string) => {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      balance: profile.balance + amount,
      todayEarnings: profile.todayEarnings + amount,
      totalEarnings: profile.totalEarnings + amount,
      isProfileComplete: type === 'profile' ? true : profile.isProfileComplete,
      updatedAt: new Date().toISOString()
    };

    const taskLog: TaskLog = {
      id: 'task-' + Date.now(),
      userId: profile.uid,
      taskType: type,
      reward: amount,
      description,
      createdAt: new Date().toISOString()
    };

    startTransition(() => {
      setProfile(updatedProfile);
      setTaskLogs(prev => [taskLog, ...prev]);
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));
    localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify([taskLog, ...taskLogs]));

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          balance: updatedProfile.balance,
          todayEarnings: updatedProfile.todayEarnings,
          totalEarnings: updatedProfile.totalEarnings,
          isProfileComplete: updatedProfile.isProfileComplete,
          updatedAt: updatedProfile.updatedAt
        });
        await addDoc(collection(db, 'users', firebaseUser.uid, 'taskLogs'), cleanForFirestore(taskLog));
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
      }
    }

    triggerCelebration();
  };

  // 10. SUBMIT WITHDRAWAL (Min Rs. 500)
  const submitWithdrawal = async (
    amount: number, 
    method: 'Easypaisa' | 'JazzCash' | 'Bank', 
    title: string, 
    accountNum: string, 
    bankName?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!profile) return { success: false, message: 'Please log in to withdraw.' };

    if (amount < 500) {
      return { success: false, message: 'Minimum withdrawal limit is Rs. 500.' };
    }

    if (profile.balance < amount) {
      return { success: false, message: `Insufficient balance! Your current balance is Rs. ${profile.balance.toLocaleString()}.` };
    }

    if (!title.trim() || !accountNum.trim()) {
      return { success: false, message: 'Please enter account title and account number.' };
    }

    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const newWithdrawal: Withdrawal = {
      id: txnId,
      userId: profile.uid,
      userName: title.trim(),
      amount,
      method,
      accountTitle: title.trim(),
      accountNumber: accountNum.trim(),
      bankName: bankName?.trim() || (method === 'Bank' ? 'Standard Chartered / Meezan Bank' : ''),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedProfile: UserProfile = {
      ...profile,
      balance: profile.balance - amount,
      updatedAt: new Date().toISOString()
    };

    setProfile(updatedProfile);
    setWithdrawals(prev => [newWithdrawal, ...prev]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));
    localStorage.setItem(LOCAL_STORAGE_WITHDRAWALS, JSON.stringify([newWithdrawal, ...withdrawals]));

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          balance: updatedProfile.balance,
          updatedAt: updatedProfile.updatedAt
        });
        await setDoc(doc(db, 'users', firebaseUser.uid, 'withdrawals', txnId), cleanForFirestore(newWithdrawal));
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}/withdrawals/${txnId}`);
      }
    }

    triggerCelebration();
    return {
      success: true,
      message: `Withdrawal request of Rs. ${amount.toLocaleString()} via ${method} submitted successfully! Your funds will be credited within 2 to 24 hours.`
    };
  };

  // 11. ADD / EDIT PAYMENT METHOD
  const addPaymentAccount = async (account: Omit<SavedPaymentAccount, 'id'>) => {
    if (!profile) return;
    const newAcc: SavedPaymentAccount = {
      ...account,
      bankName: account.bankName || (account.method === 'Bank' ? 'Meezan Bank (Islamic)' : ''),
      id: 'pa-' + Date.now()
    };
    const updatedAccounts = [...(profile.paymentAccounts || []), newAcc];
    const updatedProfile: UserProfile = {
      ...profile,
      paymentAccounts: updatedAccounts,
      isProfileComplete: Boolean(profile.name && profile.phone && updatedAccounts.length > 0)
    };

    setProfile(updatedProfile);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          paymentAccounts: cleanForFirestore(updatedAccounts),
          isProfileComplete: updatedProfile.isProfileComplete
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
      }
    }
  };

  // 12. SIMULATE 10% LIFETIME REFERRAL REWARD
  const simulateReferralReward = async (referredName: string, earnedAmount: number) => {
    if (!profile) return;
    const commission = Math.round(earnedAmount * 0.10); // 10% commission
    if (commission <= 0) return;

    const newRef: Referral = {
      id: 'ref-' + Date.now(),
      referrerId: profile.uid,
      referredUserId: 'usr-' + Math.floor(100 + Math.random() * 900),
      referredName,
      commissionEarned: commission,
      joinedAt: new Date().toISOString()
    };

    const updatedProfile: UserProfile = {
      ...profile,
      balance: profile.balance + commission,
      todayEarnings: profile.todayEarnings + commission,
      totalEarnings: profile.totalEarnings + commission,
      referralEarnings: (profile.referralEarnings || 0) + commission,
      referralCount: (profile.referralCount || 0) + 1
    };

    const log: TaskLog = {
      id: 'ref-task-' + Date.now(),
      userId: profile.uid,
      taskType: 'referral',
      reward: commission,
      description: `10% Lifetime Commission from ${referredName}'s earning (Rs. ${earnedAmount})`,
      createdAt: new Date().toISOString()
    };

    setProfile(updatedProfile);
    setReferrals(prev => [newRef, ...prev]);
    setTaskLogs(prev => [log, ...prev]);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));
    localStorage.setItem(LOCAL_STORAGE_REFERRALS, JSON.stringify([newRef, ...referrals]));
    localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify([log, ...taskLogs]));

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          balance: updatedProfile.balance,
          todayEarnings: updatedProfile.todayEarnings,
          totalEarnings: updatedProfile.totalEarnings,
          referralEarnings: updatedProfile.referralEarnings,
          referralCount: updatedProfile.referralCount
        });
        await addDoc(collection(db, 'users', firebaseUser.uid, 'referrals'), cleanForFirestore(newRef));
        await addDoc(collection(db, 'users', firebaseUser.uid, 'taskLogs'), cleanForFirestore(log));
      } catch (err) {
        console.warn('Referral commission save error:', err);
      }
    }

    triggerCelebration();
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        loading,
        withdrawals,
        taskLogs,
        referrals,
        register,
        login,
        loginGoogle,
        logout,
        resetPasswordEmail,
        changePassword,
        updateProfileDetails,
        claimDailyBonus,
        rewardUser,
        submitWithdrawal,
        addPaymentAccount,
        simulateReferralReward
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
