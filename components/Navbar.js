"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Stethoscope,
  BookOpen,
  Calendar,
  Globe,
  Presentation,
  ShieldCheck,
  Award,
  LogOut,
  ClipboardCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth, useTheme, ROLE_LABELS } from './AuthProvider';

export default function Navbar() {
  const {
    user,
    profile,
    setAuthModalOpen,
    logout,
    isSuperuser,
    isConvener,
    isCreator,
    isNonStudentRole,
    isGuest
  } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const displayName = !isGuest && profile
    ? `${profile.title ? profile.title + ' ' : ''}${profile.name?.split(' ')[0] || 'User'}`
    : '';

  const totalConfirmedCpd = (profile?.cpdPoints || 0) + (profile?.externalCpdPoints || 0);

  return (
    <nav className="sticky top-0 z-40 pamoja-nav backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
              <Stethoscope size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight pamoja-text-main font-['Outfit']">
              Pamoja<span className="text-cyan-500">.</span>
            </span>
          </Link>

          {/* Standard Navigation Pills — Clean 2-Item Pill (Courses & Sim Labs) */}
          <div className="hidden md:flex gap-1 pamoja-subcard p-1.5 rounded-2xl border pamoja-divider">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/') && !pathname?.startsWith('/courses/')
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                  : 'pamoja-text-muted hover:text-cyan-500'
              }`}
            >
              <BookOpen size={15} strokeWidth={2.5} /> Courses
            </Link>

            <Link
              href="/labs"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive('/labs')
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                  : 'pamoja-text-muted hover:text-cyan-500'
              }`}
            >
              <Calendar size={15} strokeWidth={2.5} /> Sim Labs
            </Link>
          </div>
        </div>

        {/* Right Section: Theme Switcher, RBAC Elevated Portals & User Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Persistent Light / Dark Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={
              theme === 'light'
                ? 'Switch to Obsidian Dark Slate'
                : 'Switch to Crisp Light Clinical'
            }
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-amber-400" />}
          </button>

          {/* Educator Studio Button (creator, superuser) */}
          {(isCreator || isSuperuser) && !isGuest && (
            <Link
              href="/studio"
              id="nav-educator-studio-btn"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                isActive('/studio')
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent shadow-md shadow-cyan-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100/60 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Presentation size={15} className={isActive('/studio') ? 'text-white' : 'text-cyan-600 dark:text-cyan-400'} />
              <span className="hidden lg:inline">Educator Studio</span>
              <span className="inline lg:hidden">Studio</span>
            </Link>
          )}

          {/* Convener Portal Button (convener, superuser) */}
          {(isConvener || isSuperuser) && !isGuest && (
            <Link
              href="/labs?tab=convener"
              id="nav-convener-portal-btn"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                pathname === '/labs' && typeof window !== 'undefined' && window.location.search.includes('tab=convener')
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md shadow-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100/60 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <ClipboardCheck size={15} className={pathname === '/labs' && typeof window !== 'undefined' && window.location.search.includes('tab=convener') ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'} />
              <span className="hidden lg:inline">Convener Portal</span>
              <span className="inline lg:hidden">Convener</span>
            </Link>
          )}

          {/* Super Admin Command Center Button (superuser only) */}
          {isSuperuser && !isGuest && (
            <Link
              href="/admin"
              id="nav-super-admin-btn"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                isActive('/admin')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100/60 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <ShieldCheck
                size={15}
                className={isActive('/admin') ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}
              />
              <span className="hidden lg:inline">Super Admin</span>
              <span className="inline lg:hidden">Admin</span>
            </Link>
          )}

          {/* User Profile / Auth State */}
          {!isGuest && user ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="h-6 w-px border-l border-slate-200 dark:border-slate-800 hidden sm:block"></div>

              {/* Role-Aware Profile Pill */}
              <Link
                href="/profile"
                className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 transition-all group"
              >
                <div
                  className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform text-xs ${
                    isNonStudentRole
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600'
                      : 'bg-gradient-to-br from-cyan-600 to-blue-600'
                  }`}
                >
                  {profile?.name?.charAt(0) || 'P'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{displayName}</div>
                  {isNonStudentRole ? (
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                      <ShieldCheck size={10} /> {ROLE_LABELS[profile?.role] || 'Administrator'}
                    </div>
                  ) : (
                    <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                      <Award size={10} /> {totalConfirmedCpd} CPD
                    </div>
                  )}
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2.5 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Sign Out"
                id="navbar-logout-btn"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              id="navbar-signin-btn"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs uppercase tracking-wider shadow-md shadow-cyan-500/25 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
