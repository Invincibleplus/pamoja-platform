"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  PlayCircle,
  Clock,
  Award,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Ticket,
  Sparkles,
  CheckCircle,
  Users,
  Building
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { INITIAL_COURSES } from '../lib/seedCourses';
import { useRealtimePlatformData } from '../lib/realtimeStore';
import CheckoutModal from '../components/CheckoutModal';

export default function HomePage() {
  const { user, profile, setAuthModalOpen, updateProfileState, showToast, isSuperuser, isNonStudentRole, isGuest } = useAuth();
  const { courses: rtCourses, vouchers, upsertTransaction } = useRealtimePlatformData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [checkoutCourse, setCheckoutCourse] = useState(null);
  const [quickVoucherCode, setQuickVoucherCode] = useState('');
  const [voucherTargetCourseId, setVoucherTargetCourseId] = useState('ALL');
  const [voucherBannerMsg, setVoucherBannerMsg] = useState(null);

  const courses = rtCourses?.length ? rtCourses : INITIAL_COURSES || [];
  const categories = ['All', 'Emergency Care', 'Neonatology', 'Maternal Health', 'Mental Health'];

  const filteredCourses =
    selectedCategory === 'All'
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  const applyVoucherUnlock = async (rawCode, targetCourseId = 'ALL') => {
    const clean = (rawCode || '').trim().toUpperCase();
    if (!clean) return false;

    const matchingVoucher = (vouchers || []).find((v) => v.code?.toUpperCase() === clean);
    if (matchingVoucher && (matchingVoucher.status === 'Revoked' || matchingVoucher.active === false)) {
      const revokedMsg = `Voucher ${clean} has been revoked by an administrator and can no longer be redeemed.`;
      setVoucherBannerMsg({ type: 'error', text: revokedMsg });
      if (showToast) showToast(revokedMsg, 'error');
      return false;
    }

    const isRecognized =
      (matchingVoucher && matchingVoucher.status !== 'Revoked' && matchingVoucher.active !== false) ||
      clean === 'PAMOJA2026' ||
      clean === 'FREE100' ||
      clean.startsWith('PMJ-') ||
      clean.startsWith('MOH-') ||
      clean.startsWith('UNFPA-');

    if (!isRecognized) {
      const msg = 'Unrecognized voucher code. Try PAMOJA2026, FREE100, or PMJ-UG-WNL-9K4X-77B2.';
      setVoucherBannerMsg({ type: 'error', text: msg });
      if (showToast) showToast(msg, 'error');
      return false;
    }

    const unlockedIds =
      targetCourseId === 'ALL' ? courses.map((c) => c.id) : [targetCourseId];

    const nextPurchased = Array.from(
      new Set([...(profile?.purchasedCourses || []), ...(profile?.enrolledCourses || []), ...unlockedIds])
    );

    if (updateProfileState) {
      await updateProfileState({
        purchasedCourses: nextPurchased,
        enrolledCourses: nextPurchased
      });
    }

    if (upsertTransaction) {
      await upsertTransaction({
        id: `tx_voucher_${Date.now()}`,
        userUid: profile?.id || 'learner',
        userName: profile?.name || 'Clinician',
        courseId: targetCourseId,
        courseTitle:
          targetCourseId === 'ALL'
            ? 'All Freemium & Sponsored Courses (Bundle Pass)'
            : courses.find((c) => c.id === targetCourseId)?.title || targetCourseId,
        amount: 0,
        currency: 'USD',
        rail: 'smart_voucher',
        voucherCode: clean,
        status: 'COMPLETED',
        timestamp: new Date().toISOString()
      });
    }

    const targetLabel =
      targetCourseId === 'ALL'
        ? 'all Freemium & Sponsored courses'
        : courses.find((c) => c.id === targetCourseId)?.title || 'selected course';

    const successText = `Voucher ${clean} redeemed! Full access unlocked for ${targetLabel}.`;
    setVoucherBannerMsg({ type: 'success', text: successText });
    if (showToast) showToast(successText, 'success');
    return true;
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !courses?.length || !user || isGuest) return;
    const params = new URLSearchParams(window.location.search);
    const urlVoucher = params.get('voucher');
    const urlCourse = params.get('course') || 'ALL';
    if (urlVoucher) {
      applyVoucherUnlock(urlVoucher, urlCourse);
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [courses?.length, user, isGuest]);

  const handleQuickDashboardRedeem = async (e) => {
    e.preventDefault();
    if (!quickVoucherCode.trim()) return;
    const ok = await applyVoucherUnlock(quickVoucherCode, voucherTargetCourseId);
    if (ok) {
      setQuickVoucherCode('');
    }
  };

  // 1. LOGGED-OUT MARKETING LANDING (CRISP WHITE & SLATE-50 LIGHT THEME)
  if (!user || isGuest) {
    return (
      <div className="pamoja-shell min-h-screen">
        {/* Clean Light Clinical Hero */}
        <section className="pamoja-card border-b pamoja-divider py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-bold text-xs uppercase tracking-wider mb-6">
              <Sparkles size={14} /> Accredited Medical Courses &amp; Practical Skills Training
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-['Outfit'] pamoja-text-main tracking-tight leading-tight mb-6">
              Continuous Medical Education <br className="hidden sm:block" />
              Built for <span className="text-cyan-600">Everyday Clinical Practice</span>
            </h1>

            <p className="text-base sm:text-lg pamoja-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Learn at your own pace with accredited courses—from short 3-module clinical refreshers to comprehensive mastery programs—complete with free preview lessons, scholarship vouchers, and local hands-on practical sessions.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-14">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-8 py-4 rounded-full font-bold text-sm bg-cyan-600 hover:bg-cyan-700 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                Start Learning Free <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-8 py-4 rounded-full font-bold text-sm pamoja-subcard border pamoja-divider pamoja-text-main hover:border-cyan-600 cursor-pointer transition-all"
              >
                Sign In / Redeem Voucher
              </button>
            </div>

            {/* 4 Clean White Feature Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t pamoja-divider">
              <div className="pamoja-subcard p-5 rounded-2xl border pamoja-divider text-center">
                <div className="text-2xl font-extrabold font-['Outfit'] pamoja-text-main">1 to 20+</div>
                <div className="text-xs font-bold text-cyan-600 uppercase mt-1">Flexible Modules</div>
              </div>
              <div className="pamoja-subcard p-5 rounded-2xl border pamoja-divider text-center">
                <div className="text-2xl font-extrabold font-['Outfit'] text-cyan-600">Free Preview</div>
                <div className="text-xs font-bold pamoja-text-muted uppercase mt-1">&amp; Scholarship Vouchers</div>
              </div>
              <div className="pamoja-subcard p-5 rounded-2xl border pamoja-divider text-center">
                <div className="text-2xl font-extrabold font-['Outfit'] text-indigo-600">Hands-On Labs</div>
                <div className="text-xs font-bold pamoja-text-muted uppercase mt-1">Practical Skills Sign-Off</div>
              </div>
              <div className="pamoja-subcard p-5 rounded-2xl border pamoja-divider text-center">
                <div className="text-2xl font-extrabold font-['Outfit'] text-emerald-600">Verified CPD</div>
                <div className="text-xs font-bold pamoja-text-muted uppercase mt-1">Council Recognized</div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Catalog */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold font-['Outfit'] pamoja-text-main">Clinical Courses</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'pamoja-card border pamoja-divider pamoja-text-muted hover:text-cyan-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredCourses.map((course) => (
              <Link
                href={`/courses/${course.id}`}
                key={course.id}
                className="pamoja-card rounded-3xl overflow-hidden border pamoja-divider hover:border-cyan-600 shadow-xs hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-white border border-slate-200/90 dark:border-slate-700/80 text-[11px] font-bold px-3 py-1 rounded-full shadow-md z-10 pointer-events-none backdrop-blur-md">
                    {course.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs font-bold pamoja-text-muted mb-2">
                    <span>{course.modules?.length || 1} Modules</span>
                    <span>&bull;</span>
                    <span>{course.duration} hrs</span>
                    <span>&bull;</span>
                    <span className="text-emerald-600">{course.cpd} CPD</span>
                  </div>
                  <h3 className="text-lg font-bold font-['Outfit'] pamoja-text-main mb-2 group-hover:text-cyan-600">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm pamoja-text-muted line-clamp-2 flex-1 mb-4">
                    {course.description}
                  </p>
                  <div className="pt-4 border-t pamoja-divider flex justify-between items-center text-xs font-bold text-cyan-600">
                    <span>Module 1 Free Preview</span>
                    <span className="flex items-center gap-1">
                      Open Course <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // 2. LOGGED-IN CLINICIAN OR SUPERADMIN DASHBOARD (CRISP LIGHT-FIRST)
  const labPending = profile?.labPendingPoints ?? profile?.pendingPoints ?? 0;

  return (
    <div className="pamoja-shell min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {isSuperuser || isNonStudentRole ? (
          <header className="pamoja-card rounded-3xl p-7 border pamoja-divider shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold mb-2">
                <ShieldCheck size={14} /> Super Administrator Mode
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-['Outfit'] pamoja-text-main">
                System Overview &amp; Governance
              </h1>
              <p className="text-sm pamoja-text-muted">
                Manage courses, simulation centers, VIP invitations, and statutory CPD approvals.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin" className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">
                Open Admin Command Center
              </Link>
              <Link href="/studio" className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs">
                Open Curriculum Canvas
              </Link>
            </div>
          </header>
        ) : (
          <header className="pamoja-card rounded-3xl p-7 border pamoja-divider shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-['Outfit'] pamoja-text-main mb-1">
                Welcome, {profile?.title || 'Dr.'} {profile?.name}
              </h1>
              <p className="text-sm pamoja-text-muted">
                {profile?.specialty || 'Clinical Practice'} &bull; {profile?.location || 'Medical Network'}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-3 text-center">
                <div className="text-xl font-extrabold text-emerald-600 font-['Outfit']">{profile?.cpdPoints || 0}</div>
                <div className="text-[11px] font-bold text-emerald-600">Confirmed CPD</div>
              </div>
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl px-4 py-3 text-center">
                <div className="text-xl font-extrabold text-sky-600 font-['Outfit']">{profile?.boardPendingPoints || 0}</div>
                <div className="text-[11px] font-bold text-sky-600">Awaiting Board</div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 text-center">
                <div className="text-xl font-extrabold text-amber-600 font-['Outfit']">{labPending}</div>
                <div className="text-[11px] font-bold text-amber-600">Pending Lab</div>
              </div>
            </div>
          </header>
        )}

        {/* Instant Student Voucher & Scholarship Redemption Bar */}
        {!isSuperuser && !isNonStudentRole && (
          <section className="pamoja-card rounded-3xl p-6 border pamoja-divider shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold text-cyan-600 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <Ticket size={15} /> Have a Course Voucher or Institutional Scholarship Code?
                </div>
                <p className="text-xs pamoja-text-muted">
                  Redeem your code here (try{' '}
                  <button
                    type="button"
                    onClick={() => setQuickVoucherCode('PAMOJA2026')}
                    className="text-emerald-600 font-mono font-bold underline cursor-pointer"
                  >
                    PAMOJA2026
                  </button>{' '}
                  or{' '}
                  <button
                    type="button"
                    onClick={() => setQuickVoucherCode('PMJ-UG-WNL-9K4X-77B2')}
                    className="text-cyan-600 font-mono font-bold underline cursor-pointer"
                  >
                    PMJ-UG-WNL-9K4X-77B2
                  </button>
                  ) to unlock Freemium &amp; Sponsored courses immediately.
                </p>
              </div>

              <form
                onSubmit={handleQuickDashboardRedeem}
                className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto"
              >
                <select
                  value={voucherTargetCourseId}
                  onChange={(e) => setVoucherTargetCourseId(e.target.value)}
                  className="pamoja-input rounded-xl px-3 py-2.5 text-xs font-bold"
                >
                  <option value="ALL">All Freemium Courses (Bundle Pass)</option>
                  {courses
                    .filter((c) => c.pricingModel !== 'free')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title.length > 42 ? `${c.title.slice(0, 42)}...` : c.title}
                      </option>
                    ))}
                </select>

                <input
                  type="text"
                  value={quickVoucherCode}
                  onChange={(e) => setQuickVoucherCode(e.target.value)}
                  placeholder="Enter Voucher (e.g. PAMOJA2026)"
                  className="flex-1 sm:w-52 pamoja-input rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase"
                />

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shrink-0 shadow-xs"
                >
                  Redeem Voucher
                </button>
              </form>
            </div>

            {voucherBannerMsg && (
              <div
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  voucherBannerMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300'
                }`}
              >
                <span>{voucherBannerMsg.text}</span>
                <button
                  type="button"
                  onClick={() => setVoucherBannerMsg(null)}
                  className="text-[11px] underline ml-4 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </section>
        )}

        {/* Course Catalog */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold font-['Outfit'] pamoja-text-main">
              Clinical Courses ({filteredCourses.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'pamoja-card border pamoja-divider pamoja-text-muted hover:text-cyan-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredCourses.map((course) => {
              const isUnlocked =
                isSuperuser ||
                isNonStudentRole ||
                course.pricingModel === 'free' ||
                (profile?.purchasedCourses || []).includes(course.id) ||
                (profile?.enrolledCourses || []).includes(course.id);

              return (
                <div
                  key={course.id}
                  className="pamoja-card rounded-3xl overflow-hidden border pamoja-divider hover:border-cyan-600 shadow-xs hover:shadow-xl transition-all flex flex-col group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-white border border-slate-200/90 dark:border-slate-700/80 text-[11px] font-bold px-3 py-1 rounded-full shadow-md z-10 pointer-events-none backdrop-blur-md">
                      {course.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs font-bold pamoja-text-muted mb-2">
                      <span>{course.modules?.length || 1} Modules</span>
                      <span>&bull;</span>
                      <span>{course.duration} hrs</span>
                      <span>&bull;</span>
                      <span className="text-emerald-600">{course.cpd} CPD</span>
                    </div>
                    <h3 className="text-lg font-bold font-['Outfit'] pamoja-text-main mb-2 group-hover:text-cyan-600">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm pamoja-text-muted line-clamp-2 flex-1 mb-4">
                      {course.description}
                    </p>
                    <div className="pt-4 border-t pamoja-divider flex justify-between items-center text-xs font-bold">
                      {isUnlocked ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle size={14} /> Full Access Unlocked
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setCheckoutCourse({
                              id: course.id,
                              title: course.title,
                              priceUSD: course.price || 49,
                              cpdPoints: course.cpd || 15
                            })
                          }
                          className="text-cyan-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Ticket size={14} /> Module 1 Free &bull; Voucher
                        </button>
                      )}
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-cyan-600 flex items-center gap-1 hover:underline"
                      >
                        Open Course <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <CheckoutModal
        isOpen={!!checkoutCourse}
        onClose={() => setCheckoutCourse(null)}
        item={checkoutCourse || undefined}
        defaultRail="voucher"
      />
    </div>
  );
}
