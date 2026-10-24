import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProgress } from '../types';
import {
  getUserProfile,
  updateUserProfile,
  UserProfileData,
  convertBanglaDigitsToEnglish,
  validateBangladeshiPhone,
} from '../firebase/authService';
import { syncUserToLeaderboard, setSavedNickname } from '../services/leaderboardService';
import { computeCompletedLevelsCount } from '../data/tiers';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Zap,
  ShieldCheck,
  Flame,
  Trophy,
  Lock,
  Edit3,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface ProfileViewProps {
  progress: UserProgress;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToDashboard: () => void;
  onResetProgress?: () => void;
  onRequestLogout: () => void;
  onProfileUpdated?: (updated: UserProfileData) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  progress,
  onUpdateProgress,
  onBackToDashboard,
  onResetProgress,
  onRequestLogout,
  onProfileUpdated,
}) => {
  const { currentUser } = useAuth();

  // 1. Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);

  // 2. Learning statistics from Firestore progress
  const completedSentencesCount = Object.keys(progress.correctIds || {}).length;
  const levelCompleted = computeCompletedLevelsCount(progress.correctIds, progress.earnedBadges);

  // Load user profile from Firestore /users/{uid}
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await getUserProfile(currentUser.uid);
        if (isMounted) {
          if (data) {
            const initialName =
              data.name ||
              data.displayName ||
              data.fullName ||
              progress.nickname ||
              currentUser.displayName ||
              '';
            setName(initialName);
            setPhone(data.phone || '');
          } else {
            setName(progress.nickname || currentUser.displayName || '');
          }
        }
      } catch (err) {
        console.error('Failed to load profile from Firestore:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Provider label from Firebase Auth
  const getProviderLabel = () => {
    if (!currentUser) return 'গেস্ট অ্যাকাউন্ট';
    const providerId = currentUser.providerData?.[0]?.providerId;
    if (providerId === 'google.com') return 'গুগল (Google)';
    if (providerId === 'password') return 'ইমেইল ও পাসওয়ার্ড';
    if (providerId === 'github.com') return 'গিটহাব (GitHub)';
    if (currentUser.isAnonymous) return 'বেনামী / গেস্ট';
    return providerId || 'গুগল অ্যাকাউন্ট';
  };

  const handlePhoneChange = (val: string) => {
    const converted = convertBanglaDigitsToEnglish(val);
    setPhone(converted);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  // Validation rules
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const trimmedName = name.trim();

    // 1. Name: 2 to 30 characters
    if (!trimmedName) {
      newErrors.name = 'নাম বা ডাকনাম আবশ্যক (কমপক্ষে ২ অক্ষর)';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'নাম বা ডাকনাম কমপক্ষে ২ অক্ষরের হতে হবে';
    } else if (trimmedName.length > 30) {
      newErrors.name = 'নাম বা ডাকনাম সর্বোচ্চ ৩০ অক্ষরের মধ্যে রাখুন';
    }

    // 2. Phone: Optional. If present, must be Bangladeshi 11 digits starting with 01
    if (phone.trim()) {
      const normalized = convertBanglaDigitsToEnglish(phone).replace(/[\s\-+]/g, '');
      const cleanPhone = normalized.startsWith('88') ? normalized.slice(2) : normalized;
      if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
        newErrors.phone = 'সঠিক বাংলাদেশি ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save handler: updates users/{uid} and leaderboard/{uid}
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!validate()) return;

    setIsSaving(true);
    const cleanName = name.trim();

    try {
      const cleanPhone = phone.trim()
        ? convertBanglaDigitsToEnglish(phone).replace(/[\s\-+]/g, '')
        : '';
      const finalPhone = cleanPhone.startsWith('88') ? cleanPhone.slice(2) : cleanPhone;

      // 1. Update Firestore /users/{uid} (includes phone)
      const userUpdates: Partial<UserProfileData> = {
        name: cleanName,
        displayName: cleanName,
        fullName: cleanName,
        phone: finalPhone,
        profileCompleted: true,
      };
      await updateUserProfile(currentUser.uid, userUpdates);

      // 2. Update Firestore /leaderboard/{uid} (NEVER includes phone)
      await syncUserToLeaderboard(
        currentUser.uid,
        cleanName,
        progress.xp,
        levelCompleted
      );

      // 3. Update local progress state and nickname storage
      setSavedNickname(cleanName);
      if (onUpdateProgress) {
        onUpdateProgress((prev) => ({
          ...prev,
          nickname: cleanName,
          studentName: cleanName,
        }));
      }

      // 4. Notify parent state
      const completeProfile: UserProfileData = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        name: cleanName,
        displayName: cleanName,
        fullName: cleanName,
        phone: finalPhone,
        profileCompleted: true,
        photoURL: currentUser.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onProfileUpdated?.(completeProfile);

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrors((prev) => ({
        ...prev,
        form: 'প্রোফাইল সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      }));
    } finally {
      setIsSaving(false);
    }
  };

  // Reset Progress Handler with specific confirmation dialog
  const handleResetClick = () => {
    if (window.confirm('আপনার সব XP ও অগ্রগতি মুছে যাবে, নিশ্চিত?')) {
      if (onResetProgress) {
        onResetProgress();
      }
    }
  };

  const userDisplayName =
    currentUser?.displayName || name.trim() || progress.nickname || 'শিক্ষার্থী';
  const userInitials = (userDisplayName.charAt(0) || 'U').toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 px-3 sm:px-0 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200/90 bg-white/80 backdrop-blur-xs font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-98 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>ড্যাশবোর্ডে ফিরুন</span>
        </button>

        <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          শিক্ষার্থী প্রোফাইল (Profile)
        </h1>
      </div>

      {/* SECTION 1: প্রোফাইল ছবি, নাম ও ইমেইল (Firebase Auth থেকে, ইমেইল শুধু দেখা যাবে) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar (Firebase Auth photo or initial) */}
          <div className="relative shrink-0">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={userDisplayName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-blue-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md ring-2 ring-blue-200">
                {userInitials}
              </div>
            )}
          </div>

          {/* User info */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {userDisplayName}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {getProviderLabel()}
              </span>
            </div>

            {/* Read-only email from Firebase Auth */}
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold break-all">
                {currentUser?.email || 'ইমেইল সংযুক্ত নেই'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium ml-1 flex items-center gap-0.5">
                <Lock className="w-3 h-3 text-slate-400" />
                (শুধু প্রদর্শনযোগ্য)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 & 3: নাম/ডাকনাম Edit ও Save (২ থেকে ৩০ অক্ষর) এবং ঐচ্ছিক ফোন নম্বর */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              প্রোফাইল তথ্য সম্পাদন
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            users ও leaderboard সিঙ্ক
          </span>
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">তথ্য লোড হচ্ছে...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {errors.form && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* SECTION 2: নাম/ডাকনাম (২ থেকে ৩০ অক্ষর) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="profile-name-input"
                  className="block text-xs font-bold text-slate-700"
                >
                  নাম / ডাকনাম <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {name.length}/৩০ অক্ষর
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="profile-name-input"
                  type="text"
                  value={name}
                  maxLength={30}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="যেমন: Tanvir_99 অথবা নিবিড়_পড়ুয়া"
                  className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.name ? (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  নাম বা ডাকনাম ২ থেকে ৩০ অক্ষরের হতে হবে। এটি লিডারবোর্ডেও প্রদর্শিত হবে।
                </p>
              )}
            </div>

            {/* SECTION 3: ঐচ্ছিক ফোন নম্বর (বাংলাদেশি ফরম্যাট, ০১ দিয়ে শুরু, ১১ ডিজিট) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <label
                  htmlFor="profile-phone-input"
                  className="block text-xs font-bold text-slate-700"
                >
                  ফোন নম্বর <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
                </label>
                <span className="text-[11px] text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                  এই নম্বর শুধু আপনি দেখতে পাবেন।
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="profile-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="01XXXXXXXXX (যেমন: 01712345678)"
                  className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.phone ? (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  ০১ দিয়ে শুরু ১১ ডিজিটের নম্বর। শুধু users/{currentUser?.uid}-এর phone ফিল্ডে সেভ হবে, leaderboard-এ কখনো নয়।
                </p>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full min-h-[44px] px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>সংরক্ষণ করুন (Save)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 4: পরিসংখ্যান: মোট XP, সম্পন্ন লেভেল, সম্পন্ন বাক্য, streak */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
          শেখার অগ্রগতি ও পরিসংখ্যান (Statistics)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Stat 1: মোট XP */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 text-center sm:text-left space-y-1 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto sm:mx-0">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-2">
              {progress.xp} XP
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              মোট XP
            </div>
          </div>

          {/* Stat 2: সম্পন্ন লেভেল */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 text-center sm:text-left space-y-1 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto sm:mx-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-2">
              {levelCompleted}/৫
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              সম্পন্ন লেভেল
            </div>
          </div>

          {/* Stat 3: সম্পন্ন বাক্য */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 text-center sm:text-left space-y-1 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-2">
              {completedSentencesCount}টি
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              সম্পন্ন বাক্য
            </div>
          </div>

          {/* Stat 4: Streak */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 text-center sm:text-left space-y-1 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto sm:mx-0">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-2">
              {progress.streakCount} দিন
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              Streak
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: 'অগ্রগতি ও স্কোর রিসেট' বাটন পেজের একদম নিচে আলাদা 'বিপজ্জনক অংশে' */}
      <div className="bg-rose-50/50 rounded-3xl border-2 border-rose-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <h3 className="font-black text-sm sm:text-base text-rose-900">
            বিপজ্জনক অংশ (Danger Zone)
          </h3>
        </div>
        <p className="text-xs text-rose-700/90 leading-relaxed">
          আপনার সমস্ত অনুবাদ, পয়েন্ট (XP), এবং শেখার অগ্রগতি শূন্যে রিসেট করতে পারবেন। এই কাজটি সম্পন্ন হলে পূর্বের অগ্রগতি পুনরুদ্ধার করা যাবে না।
        </p>

        <button
          type="button"
          onClick={handleResetClick}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-rose-300 hover:border-rose-400 bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
        >
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <span>অগ্রগতি ও স্কোর রিসেট করুন</span>
        </button>
      </div>

      {/* SECTION 6: লগআউট বাটন */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onRequestLogout}
          className="w-full min-h-[46px] px-4 py-3 rounded-2xl border border-slate-300 hover:border-rose-300 bg-white hover:bg-rose-50/50 text-rose-600 font-extrabold text-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>লগআউট করুন</span>
        </button>
      </div>
    </div>
  );
};
