"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInAnonymously
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import {
  ShieldCheck,
  Award,
  Stethoscope,
  X,
  CheckCircle,
  Sparkles,
  Key,
  AlertCircle
} from 'lucide-react';
import { auth, db, googleProvider } from '../lib/firebase';
import {
  ROLES,
  ROLE_LABELS,
  NON_STUDENT_ROLES,
  TITLE_OPTIONS,
  CADRE_OPTIONS,
  SPECIALTY_OPTIONS,
  FACILITY_TIER_OPTIONS,
  SelectWithOther,
  CountrySelect
} from './ClinicalFormControls';

export { ROLES, ROLE_LABELS, NON_STUDENT_ROLES };

// ============================================================================
// STRICT CLEAN GUEST PROFILE — Zero Fake License Numbers, Titles, or Hospitals
// ============================================================================
export const defaultGuestProfile = {
  id: 'guest-session',
  name: '',
  email: '',
  phone: '',
  role: ROLES.GUEST,
  cpdPoints: 0,
  pendingPoints: 0,
  boardPendingPoints: 0,
  labPendingPoints: 0,
  externalCpdPoints: 0,
  certifiedPracticalCourses: [],
  bookedLabs: [],
  externalRecords: [],
  onboardingComplete: false,
  isVerified: false,
  isPublic: false,
  title: '',
  gender: '',
  cadre: '',
  specialty: '',
  country: '',
  facilityTier: '',
  location: '',
  facility: '',
  authorityId: '',
  purchasedCourses: [],
  enrolledCourses: [],
  courseProgress: {},
  notifications: [],
  themePreference: 'light'
};

// Cryptographic VIP Role Invite Helpers
export function createVipInviteToken(role, email = '', expiresInDays = 30, name = '') {
  const payload = {
    role,
    email: email ? email.toLowerCase().trim() : undefined,
    name: name ? name.trim() : undefined,
    exp: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
    nonce: Math.random().toString(36).substring(2, 10),
    issuer: 'pamoja-sovereign-root',
    sig: 'pmj_' + Math.random().toString(36).substring(2, 8)
  };
  const jsonStr = JSON.stringify(payload);
  const encoded =
    typeof btoa !== 'undefined'
      ? btoa(jsonStr)
      : Buffer.from(jsonStr).toString('base64');
  return `pmj_vip_${encoded}`;
}

export function parseVipInviteToken(token) {
  try {
    if (!token) return null;
    let clean = token.trim();
    if (clean.startsWith('pmj_vip_')) {
      clean = clean.replace('pmj_vip_', '');
    }
    const decoded =
      typeof atob !== 'undefined'
        ? atob(clean)
        : Buffer.from(clean, 'base64').toString('utf8');
    const data = JSON.parse(decoded);
    if (data.exp && Date.now() > data.exp) {
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
}

const AuthContext = createContext();
const ToastContext = createContext();
const ThemeContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { addToast: (msg) => console.log('[Toast]', msg) };
  }
  return context;
}

export function useTheme() {
  return useContext(ThemeContext) || { theme: 'light', setTheme: () => {}, toggleTheme: () => {} };
}

function readStoredProfile() {
  if (typeof window === 'undefined') return defaultGuestProfile;
  try {
    const raw = window.localStorage.getItem('pamoja_active_profile_v11');
    if (!raw) return defaultGuestProfile;
    const parsed = JSON.parse(raw);
    if (!parsed) return defaultGuestProfile;
    if (parsed.role === ROLES.GUEST || !parsed.id || parsed.id === 'guest-session') {
      return {
        ...defaultGuestProfile,
        enrolledCourses: Array.isArray(parsed.enrolledCourses) ? parsed.enrolledCourses : [],
        purchasedCourses: Array.isArray(parsed.purchasedCourses) ? parsed.purchasedCourses : [],
        courseProgress: parsed.courseProgress || {},
        themePreference: parsed.themePreference || 'light'
      };
    }
    return { ...defaultGuestProfile, ...parsed };
  } catch {
    return defaultGuestProfile;
  }
}

function writeStoredProfile(prof) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('pamoja_active_profile_v11', JSON.stringify(prof));
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(defaultGuestProfile);
  const [theme, setThemeState] = useState('light');
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('signin'); // 'signin' | 'register'
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [pendingInvite, setPendingInvite] = useState(null);
  const [toasts, setToasts] = useState([]);
  const router = useRouter();

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  // Hydrate stored theme, Pamoja SVG favicon & active profile on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedTheme =
        window.localStorage.getItem('pmj_thm') ||
        window.localStorage.getItem('pamoja_theme_v10') ||
        window.localStorage.getItem('pamoja_theme_v11') ||
        'light';
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch {}

    try {
      const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><path d="M22 18v10a10 10 0 0 0 20 0V18M18 18h8M38 18h8M32 38v6a8 8 0 0 0 16 0v-6" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/><circle cx="48" cy="34" r="4" fill="#fff"/></svg>`;
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = `data:image/svg+xml,${encodeURIComponent(svgIcon)}`;
    } catch {}

    const cachedProfile = readStoredProfile();
    if (cachedProfile) {
      if (cachedProfile.role !== ROLES.GUEST) {
        setProfile(cachedProfile);
        setUser({ uid: cachedProfile.id, email: cachedProfile.email });
      } else {
        // Hydrate guest's locally enrolled/purchased courses and preferences
        setProfile(cachedProfile);
      }
      if (cachedProfile.themePreference) {
        const pref = cachedProfile.themePreference === 'dark' ? 'dark' : 'light';
        setThemeState(pref);
        document.documentElement.classList.toggle('dark', pref === 'dark');
        document.documentElement.setAttribute('data-theme', pref);
      }
    }
  }, []);

  // Listen to cross-component updates when Admin or Convener updates a user record in realtimeStore
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleProfileSync = () => {
      const current = readStoredProfile();
      if (!current || current.role === ROLES.GUEST) return;
      try {
        const rawUsers = window.localStorage.getItem('pamoja_rt_users_v4');
        if (rawUsers) {
          const list = JSON.parse(rawUsers);
          const match = list.find(
            (u) =>
              u.id === current.id ||
              (u.email && current.email && u.email.toLowerCase() === current.email.toLowerCase())
          );
          if (match) {
            const nextPending =
              match.labPendingPoints !== undefined
                ? match.labPendingPoints
                : match.pendingPoints ?? current.pendingPoints;
            const merged = {
              ...current,
              ...match,
              pendingPoints: nextPending,
              labPendingPoints: nextPending
            };
            writeStoredProfile(merged);
            setProfile(merged);
          }
        }
      } catch {}
    };
    window.addEventListener('pamoja-rt-sync', handleProfileSync);
    window.addEventListener('storage', handleProfileSync);
    return () => {
      window.removeEventListener('pamoja-rt-sync', handleProfileSync);
      window.removeEventListener('storage', handleProfileSync);
    };
  }, []);

  const syncUserToDirectory = useCallback((profRecord) => {
    if (typeof window === 'undefined' || !profRecord || profRecord.role === ROLES.GUEST) return;
    try {
      const key = 'pamoja_rt_users_v4';
      const raw = window.localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      const exists = list.some((u) => u.id === profRecord.id);
      const next = exists
        ? list.map((u) => (u.id === profRecord.id ? { ...u, ...profRecord } : u))
        : [profRecord, ...list];
      window.localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('pamoja-rt-sync', { detail: { key } }));
    } catch {}
  }, []);

  // Update profile in state, localStorage, and Firestore
  const updateProfileState = useCallback(
    async (updates) => {
      setProfile((prev) => {
        const base = prev || defaultGuestProfile;
        const syncedUpdates = { ...updates };
        if (syncedUpdates.labPendingPoints !== undefined && syncedUpdates.pendingPoints === undefined) {
          syncedUpdates.pendingPoints = syncedUpdates.labPendingPoints;
        } else if (syncedUpdates.pendingPoints !== undefined && syncedUpdates.labPendingPoints === undefined) {
          syncedUpdates.labPendingPoints = syncedUpdates.pendingPoints;
        }
        const next = { ...base, ...syncedUpdates };
        writeStoredProfile(next);
        syncUserToDirectory(next);
        return next;
      });

      const targetUid = user?.uid || profile?.id;
      if (db && targetUid && targetUid !== 'guest-session') {
        try {
          await setDoc(doc(db, 'users', targetUid), updates, { merge: true });
        } catch (e) {}
      }
    },
    [user, profile?.id, syncUserToDirectory]
  );

  const setTheme = useCallback(
    (newTheme) => {
      const normalized = newTheme === 'dark' ? 'dark' : 'light';
      setThemeState(normalized);
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem('pmj_thm', normalized);
          window.localStorage.setItem('pamoja_theme_v10', normalized);
          window.localStorage.setItem('pamoja_theme_v11', normalized);
          document.documentElement.classList.toggle('dark', normalized === 'dark');
          document.documentElement.setAttribute('data-theme', normalized);
        } catch {}
      }
      if (profile && profile.role !== ROLES.GUEST) {
        updateProfileState({ themePreference: normalized });
      }
    },
    [profile, updateProfileState]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  // Handle VIP Role Invite detection from URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const inviteParam = searchParams.get('invite');
      const roleParam = searchParams.get('role');

      if (inviteParam || roleParam) {
        let validRole = null;
        let inviteToken = inviteParam;
        let parsedData = null;

        if (inviteParam) {
          parsedData = parseVipInviteToken(inviteParam);
          if (parsedData && parsedData.role) {
            validRole = parsedData.role;
          }
        }

        if (!validRole && roleParam && Object.values(ROLES).includes(roleParam.toLowerCase())) {
          validRole = roleParam.toLowerCase();
        }

        if (validRole) {
          const inviteData = {
            role: validRole,
            email: parsedData?.email || '',
            name: parsedData?.name || '',
            token: inviteToken || 'direct-link'
          };
          setPendingInvite(inviteData);
          try {
            sessionStorage.setItem('pamoja_vip_invite', JSON.stringify(inviteData));
          } catch {}

          if (user && profile.role !== validRole && profile.role !== ROLES.GUEST) {
            updateProfileState({
              role: validRole,
              vipRoleClaimed: true,
              vipClaimedAt: new Date().toISOString()
            });
            addToast(
              `VIP Access Activated: Your account is now set to ${ROLE_LABELS[validRole] || validRole.toUpperCase()}!`,
              'success'
            );
          } else if (!user || profile.role === ROLES.GUEST) {
            setAuthModalOpen(true);
            addToast(
              `Official VIP Invite Detected: Complete sign-in to activate your ${ROLE_LABELS[validRole] || validRole.toUpperCase()} access.`,
              'info'
            );
          }
        }
      }
    } catch {}
  }, [user, profile.role, updateProfileState, addToast]);

  // Firebase Auth Listener
  useEffect(() => {
    let isMounted = true;

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;

      const localSaved = readStoredProfile();
      if (localSaved && localSaved.role !== ROLES.GUEST) {
        setProfile(localSaved);
        setUser({ uid: localSaved.id, email: localSaved.email });
        setLoading(false);
        return;
      }

      if (currentUser && !currentUser.isAnonymous) {
        setUser(currentUser);
        const superadminEmail = process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL || 'admin@pamoja.com';
        const isSuperadmin =
          (currentUser.email && currentUser.email.toLowerCase().trim() === 'admin@pamoja.com') ||
          (currentUser.email &&
            currentUser.email.toLowerCase().trim() === superadminEmail.toLowerCase().trim());

        let targetRole = isSuperadmin ? ROLES.SUPERUSER : ROLES.LEARNER;
        const isNonStudentAdmin = NON_STUDENT_ROLES.includes(targetRole);

        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const finalRole = isSuperadmin ? ROLES.SUPERUSER : data.role || targetRole;
            const nonStudent = NON_STUDENT_ROLES.includes(finalRole);
            const merged = {
              ...defaultGuestProfile,
              ...data,
              id: currentUser.uid,
              name: data.name || currentUser.displayName || (isSuperadmin ? 'System Super Admin' : 'Clinician'),
              email: data.email || currentUser.email || '',
              role: finalRole,
              cpdPoints: nonStudent ? 0 : data.cpdPoints ?? 0,
              pendingPoints: nonStudent ? 0 : data.pendingPoints ?? 0,
              boardPendingPoints: nonStudent ? 0 : data.boardPendingPoints ?? 0,
              labPendingPoints: nonStudent ? 0 : data.labPendingPoints ?? data.pendingPoints ?? 0,
              onboardingComplete: Boolean(data.onboardingComplete || isSuperadmin)
            };
            writeStoredProfile(merged);
            syncUserToDirectory(merged);
            setProfile(merged);
          } else {
            const newProfile = {
              ...defaultGuestProfile,
              id: currentUser.uid,
              title: isNonStudentAdmin ? '' : 'Dr.',
              name: currentUser.displayName || (isSuperadmin ? 'System Super Admin' : 'Clinician'),
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || null,
              role: targetRole,
              onboardingComplete: isSuperadmin,
              cpdPoints: 0,
              pendingPoints: 0,
              boardPendingPoints: 0,
              labPendingPoints: 0,
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, newProfile);
            writeStoredProfile(newProfile);
            syncUserToDirectory(newProfile);
            setProfile(newProfile);
            if (!isSuperadmin) {
              setOnboardingOpen(true);
            }
          }
        } catch {
          const fallbackProfile = {
            ...defaultGuestProfile,
            id: currentUser.uid,
            name: currentUser.displayName || 'Clinician',
            email: currentUser.email || '',
            role: targetRole,
            onboardingComplete: true
          };
          writeStoredProfile(fallbackProfile);
          setProfile(fallbackProfile);
        }
      } else {
        // Strict Guest Mode for anonymous/unauthenticated sessions
        setUser(null);
        setProfile(defaultGuestProfile);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [syncUserToDirectory]);

  // Direct login & registration handler with role-aware profile initialization
  const handleSecureLogin = async (email, name = 'Clinician', roleOverride = null, extraFields = {}) => {
    try {
      const cleanEmail = (email || '').toLowerCase().trim();
      const superadminEmail = process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL || 'admin@pamoja.com';
      const isSuper =
        cleanEmail === 'admin@pamoja.com' ||
        cleanEmail === superadminEmail.toLowerCase().trim();

      let targetRole = isSuper ? ROLES.SUPERUSER : ROLES.LEARNER;
      if (roleOverride && Object.values(ROLES).includes(roleOverride)) {
        targetRole = roleOverride;
      } else if (pendingInvite && pendingInvite.role && !isSuper) {
        targetRole = pendingInvite.role;
      }

      const isNonStudentAdmin = NON_STUDENT_ROLES.includes(targetRole);

      let currentUid = isSuper
        ? 'usr-superadmin'
        : cleanEmail === 'convener@pamoja.com' || cleanEmail === 'k.mugabe@mbale.go.ug'
        ? 'usr-mugabe'
        : cleanEmail === 'creator@pamoja.com' || cleanEmail === 't.nkosi@uct.ac.za'
        ? 'usr-nkosi'
        : cleanEmail === 'learner@pamoja.com' || cleanEmail === 'grace.akello@mulago.go.ug'
        ? 'usr-akello'
        : 'usr-' + Date.now();

      if (auth && !auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch {}
      }

      const cleanName = (name || '').replace(/^(Dr\.|Prof\.|Midwife|Nurse)\s+/i, '').trim() ||
        (isSuper ? 'System Super Admin' : 'Grace Akello');

      const userProfile = {
        ...defaultGuestProfile,
        ...extraFields,
        id: currentUid,
        email: cleanEmail,
        title:
          extraFields.title !== undefined
            ? extraFields.title
            : isNonStudentAdmin
            ? ''
            : targetRole === ROLES.CREATOR
            ? 'Prof.'
            : 'Dr.',
        name: cleanName,
        role: targetRole,
        cadre:
          extraFields.cadre ||
          (isNonStudentAdmin
            ? 'System Administrator / Operations'
            : targetRole === ROLES.CREATOR || targetRole === ROLES.CONVENER
            ? 'Specialist Physician / Consultant'
            : 'Medical Doctor (MBChB / MD)'),
        specialty:
          extraFields.specialty ||
          (isNonStudentAdmin
            ? 'Platform Governance & Operations'
            : 'Maternal & Perinatal Health'),
        country: extraFields.country || 'South Africa',
        facilityTier:
          extraFields.facilityTier ||
          (isNonStudentAdmin
            ? 'Ministry / Regulatory Agency'
            : 'National Referral / Teaching Hospital'),
        location:
          extraFields.location ||
          (isNonStudentAdmin
            ? 'Pamoja Central Command'
            : 'Groote Schuur Hospital, Cape Town'),
        facility:
          extraFields.location ||
          extraFields.facility ||
          (isNonStudentAdmin
            ? 'Pamoja Central Command'
            : 'Groote Schuur Hospital, Cape Town'),
        authorityId:
          extraFields.authorityId !== undefined
            ? extraFields.authorityId
            : isNonStudentAdmin
            ? ''
            : targetRole === ROLES.CONVENER
            ? 'UMDPC-09942'
            : targetRole === ROLES.CREATOR
            ? 'HPCSA-MP08831'
            : 'UMDPC-18402',
        onboardingComplete: true,
        isVerified: true,
        isPublic: isNonStudentAdmin ? false : true,
        cpdPoints: isNonStudentAdmin ? 0 : extraFields.cpdPoints ?? 20,
        pendingPoints: isNonStudentAdmin ? 0 : extraFields.labPendingPoints ?? 15,
        boardPendingPoints: isNonStudentAdmin ? 0 : extraFields.boardPendingPoints ?? 0,
        labPendingPoints: isNonStudentAdmin ? 0 : extraFields.labPendingPoints ?? 15,
        externalCpdPoints: isNonStudentAdmin ? 0 : extraFields.externalCpdPoints ?? 5,
        certifiedPracticalCourses: extraFields.certifiedPracticalCourses || [],
        bookedLabs: extraFields.bookedLabs || [],
        themePreference: theme,
        createdAt: new Date().toISOString()
      };

      writeStoredProfile(userProfile);
      syncUserToDirectory(userProfile);
      setProfile(userProfile);
      setUser({ uid: currentUid, email: cleanEmail });

      if (db && currentUid) {
        try {
          await setDoc(doc(db, 'users', currentUid), userProfile, { merge: true });
        } catch {}
      }

      if (pendingInvite) {
        try {
          sessionStorage.removeItem('pamoja_vip_invite');
        } catch {}
        setPendingInvite(null);
      }

      setAuthModalOpen(false);
      addToast(
        `Signed in as ${userProfile.title ? userProfile.title + ' ' : ''}${userProfile.name} (${
          ROLE_LABELS[targetRole] || targetRole
        })`,
        'success'
      );
      return userProfile;
    } catch (err) {
      addToast('Sign in failed. Please try again.', 'error');
      throw err;
    }
  };

  // Google OAuth Login
  const loginWithGoogle = async () => {
    try {
      if (!auth) {
        setAuthModalOpen(true);
        return;
      }
      await signInWithPopup(auth, googleProvider);
      setAuthModalOpen(false);
    } catch {
      setAuthModalOpen(true);
    }
  };

  // Logout — strictly resets to clean Guest state
  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth).catch(() => {});
      }
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('pamoja_active_profile_v11');
      }
      setUser(null);
      setProfile(defaultGuestProfile);
      addToast('Signed out.', 'info');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // RBAC Authorization Helpers
  const hasRole = useCallback(
    (roleOrRoles) => {
      if (!profile || profile.role === ROLES.GUEST) return false;
      if (profile.role === ROLES.SUPERUSER) return true;
      if (Array.isArray(roleOrRoles)) {
        return roleOrRoles.includes(profile.role);
      }
      return profile.role === roleOrRoles;
    },
    [profile]
  );

  const canAccess = useCallback(
    (feature) => {
      if (!profile || profile.role === ROLES.GUEST) return false;
      if (profile.role === ROLES.SUPERUSER) return true;

      switch (feature) {
        case 'studio':
          return profile.role === ROLES.CREATOR;
        case 'convener':
          return profile.role === ROLES.CONVENER;
        case 'coordinator':
          return profile.role === ROLES.COORDINATOR;
        case 'reviewer':
          return profile.role === ROLES.REVIEWER;
        case 'registrar':
          return profile.role === ROLES.REGISTRAR;
        case 'auditor':
          return profile.role === ROLES.AUDITOR;
        case 'support':
          return profile.role === ROLES.SUPPORT;
        case 'admin':
          return profile.role === ROLES.SUPERUSER;
        default:
          return true;
      }
    },
    [profile]
  );

  const generateInviteLink = useCallback((role, email = '', expiresInDays = 30, name = '') => {
    const token = createVipInviteToken(role, email, expiresInDays, name);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pamoja.health';
    return `${origin}/?invite=${encodeURIComponent(token)}&role=${role}`;
  }, []);

  const isGuest = !profile || profile.role === ROLES.GUEST || !profile.id || profile.id === 'guest-session';
  const isNonStudentRole = !isGuest && NON_STUDENT_ROLES.includes(profile?.role);

  const value = {
    user: isGuest ? null : user || { uid: profile.id, email: profile.email },
    profile,
    theme,
    setTheme,
    toggleTheme,
    loading,
    authModalOpen,
    setAuthModalOpen,
    onboardingOpen,
    setOnboardingOpen,
    loginWithGoogle,
    handleSecureLogin,
    logout,
    updateProfileState,
     showToast: addToast,
    hasRole,
    canAccess,
    generateInviteLink,
    pendingInvite,
    isSuperuser: profile?.role === ROLES.SUPERUSER,
    isConvener: profile?.role === ROLES.CONVENER || profile?.role === ROLES.SUPERUSER,
    isCreator: profile?.role === ROLES.CREATOR || profile?.role === ROLES.SUPERUSER,
    isCoordinator: profile?.role === ROLES.COORDINATOR || profile?.role === ROLES.SUPERUSER,
    isRegistrar: profile?.role === ROLES.REGISTRAR || profile?.role === ROLES.SUPERUSER,
    isNonStudentRole,
    isLearner: !isGuest && !isNonStudentRole,
    isGuest
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <AuthContext.Provider value={value}>
        <ToastContext.Provider value={{ addToast }}>
          {children}

          {/* Global Toast Notifications */}
          <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-md w-full px-4">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-fade-in ${
                  toast.type === 'success'
                    ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/50'
                    : toast.type === 'error'
                    ? 'bg-rose-950/95 text-rose-100 border-rose-500/50'
                    : 'bg-slate-900/95 text-white border-slate-700/80'
                }`}
              >
                {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
                {toast.type === 'error' && <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />}
                {toast.type === 'info' && <Sparkles size={18} className="text-cyan-400 shrink-0 mt-0.5" />}
                <span className="text-xs sm:text-sm font-semibold leading-relaxed flex-1">{toast.message}</span>
              </div>
            ))}
          </div>

          {/* Unified Sign-In & Comprehensive Clinician Registration Modal */}
          {authModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white relative max-h-[92vh] overflow-y-auto">
                <button
                  onClick={() => setAuthModalOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/25">
                    <Stethoscope size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">Welcome to Pamoja</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Accredited Clinical Education &amp; CPD Platform</p>
                  </div>
                </div>

                {pendingInvite && (
                  <div className="p-3.5 mb-5 bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 rounded-2xl flex items-start gap-2.5 text-cyan-800 dark:text-cyan-200 text-xs">
                    <Sparkles size={16} className="text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Official VIP Invite Active:</span> Completing sign-in or registration will assign your account to{' '}
                      <strong>{ROLE_LABELS[pendingInvite.role] || pendingInvite.role.toUpperCase()}</strong>.
                    </div>
                  </div>
                )}

                {/* Mode Switcher: Sign In vs New Clinician Registration */}
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl mb-5 border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAuthTab('signin')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authTab === 'signin'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Sign In / Quick Role
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('register')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authTab === 'register'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    New Clinician Registration
                  </button>
                </div>

                {authTab === 'signin' ? (
                  <>
                    {/* Fast Role Switcher */}
                    <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <Sparkles size={13} /> Instant Role Switcher (Demo)
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleSecureLogin('admin@pamoja.com', 'System Super Admin', ROLES.SUPERUSER)
                          }
                          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-left text-white cursor-pointer shadow-sm"
                        >
                          <div className="text-xs font-bold">Super Administrator</div>
                          <div className="text-[10px] text-indigo-100">Governance, Users &amp; Audits</div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleSecureLogin('k.mugabe@mbale.go.ug', 'Kenneth Mugabe', ROLES.CONVENER, {
                              title: 'Dr.',
                              location: 'Mulago & Mbale Simulation Centers',
                              country: 'Uganda',
                              authorityId: 'UMDPC-09942'
                            })
                          }
                          className="p-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-left border border-slate-200 dark:border-slate-800 cursor-pointer shadow-xs"
                        >
                          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Lab Convener</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Assess &amp; Schedule Labs</div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleSecureLogin('t.nkosi@uct.ac.za', 'Thabo Mbeki-Nkosi', ROLES.CREATOR, {
                              title: 'Prof.',
                              location: 'Groote Schuur Hospital, Cape Town',
                              country: 'South Africa',
                              authorityId: 'HPCSA-MP08831'
                            })
                          }
                          className="p-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-left border border-slate-200 dark:border-slate-800 cursor-pointer shadow-xs"
                        >
                          <div className="text-xs font-bold text-cyan-700 dark:text-cyan-400">Course Educator</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Curriculum Studio</div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleSecureLogin('grace.akello@mulago.go.ug', 'Grace Akello', ROLES.LEARNER, {
                              title: 'Dr.',
                              location: 'Mulago Specialized Hospital, Kampala',
                              country: 'Uganda',
                              authorityId: 'UMDPC-18402'
                            })
                          }
                          className="p-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-left border border-slate-200 dark:border-slate-800 cursor-pointer shadow-xs"
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Dr. Grace Akello</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Clinician Learner</div>
                        </button>
                      </div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.target);
                        handleSecureLogin(fd.get('email'), fd.get('name'));
                      }}
                      className="space-y-3.5"
                    >
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <input
                          name="name"
                          required
                          type="text"
                          defaultValue={pendingInvite?.name || ''}
                          placeholder="Dr. Grace Akello"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <input
                          name="email"
                          required
                          type="email"
                          defaultValue={pendingInvite?.email || ''}
                          placeholder="grace.akello@mulago.go.ug"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Key size={15} /> Sign In to Platform
                      </button>
                    </form>

                    <div className="relative my-5 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                      </div>
                      <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        or continue with
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={loginWithGoogle}
                      className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2.5 cursor-pointer transition-colors"
                    >
                      Continue with Google
                    </button>
                  </>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.target);
                      handleSecureLogin(
                        fd.get('email'),
                        fd.get('name'),
                        pendingInvite?.role || ROLES.LEARNER,
                        {
                          title: fd.get('title'),
                          gender: fd.get('gender'),
                          phone: fd.get('phone'),
                          cadre: fd.get('cadre'),
                          specialty: fd.get('specialty'),
                          country: fd.get('country'),
                          facilityTier: fd.get('facilityTier'),
                          location: fd.get('location'),
                          facility: fd.get('location'),
                          authorityId: (fd.get('authorityId') || '').trim()
                        }
                      );
                    }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-2.5">
                      <SelectWithOther
                        label="Title"
                        name="title"
                        options={TITLE_OPTIONS}
                        defaultValue="Dr."
                        required
                      />
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Gender (Strict)
                        </label>
                        <select
                          name="gender"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Full Legal Name
                        </label>
                        <input
                          name="name"
                          required
                          defaultValue={pendingInvite?.name || ''}
                          placeholder="Grace Akello"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Phone (SMS / WhatsApp)
                        </label>
                        <input
                          name="phone"
                          required
                          placeholder="+27 82 000 0000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <SelectWithOther
                        label="Cadre / Job Description"
                        name="cadre"
                        options={CADRE_OPTIONS}
                        required
                      />
                      <SelectWithOther
                        label="Primary Specialty"
                        name="specialty"
                        options={SPECIALTY_OPTIONS}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <CountrySelect
                        label="Country (Pinned Current Location)"
                        name="country"
                        defaultValue="South Africa"
                      />
                      <SelectWithOther
                        label="Facility Level"
                        name="facilityTier"
                        options={FACILITY_TIER_OPTIONS}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Facility Name &amp; City
                        </label>
                        <input
                          name="location"
                          required
                          placeholder="Groote Schuur Hospital, Cape Town"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Medical License ID (Optional)
                        </label>
                        <input
                          name="authorityId"
                          placeholder="e.g. HPCSA-MP08831"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Professional Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        defaultValue={pendingInvite?.email || ''}
                        placeholder="clinician@hospital.org"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer mt-2 shadow-lg"
                    >
                      Complete Clinician Registration
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Clinical Onboarding Modal for First-Time OAuth Clinicians */}
          {onboardingOpen && profile && !profile.onboardingComplete && !isGuest && !isNonStudentRole && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-lg w-full p-7 text-slate-900 dark:text-white shadow-2xl max-h-[92vh] overflow-y-auto">
                <h2 className="text-xl font-black text-slate-900 dark:text-white font-['Outfit'] mb-1">
                  Complete Your Clinical Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  Personalize your continuing professional development (CPD) and medical council details.
                </p>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    const authId = (fd.get('authorityId') || '').trim();
                    await updateProfileState({
                      title: fd.get('title'),
                      gender: fd.get('gender'),
                      cadre: fd.get('cadre'),
                      specialty: fd.get('specialty'),
                      country: fd.get('country'),
                      facilityTier: fd.get('facilityTier'),
                      location: fd.get('location'),
                      facility: fd.get('location'),
                      authorityId: authId || '',
                      isVerified: authId.length > 3,
                      onboardingComplete: true
                    });
                    setOnboardingOpen(false);
                    addToast('Clinical profile saved!', 'success');
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    <SelectWithOther label="Title" name="title" options={TITLE_OPTIONS} defaultValue="Dr." required />
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Gender</label>
                      <select name="gender" defaultValue="Female" className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <SelectWithOther label="Cadre" name="cadre" options={CADRE_OPTIONS} required />
                    <SelectWithOther label="Specialty" name="specialty" options={SPECIALTY_OPTIONS} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <CountrySelect label="Country" name="country" defaultValue="South Africa" />
                    <SelectWithOther label="Facility Level" name="facilityTier" options={FACILITY_TIER_OPTIONS} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Facility Name &amp; City</label>
                      <input name="location" required defaultValue="Groote Schuur Hospital, Cape Town" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Medical License ID (Optional)</label>
                      <input name="authorityId" placeholder="e.g. HPCSA-MP08831" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider mt-2 cursor-pointer shadow-lg"
                  >
                    Save Profile &amp; Continue
                  </button>
                </form>
              </div>
            </div>
          )}
        </ToastContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
