"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Tag,
  BarChart,
  Key,
  Sparkles,
  Copy,
  Check,
  Lock,
  ShieldAlert,
  PlusCircle,
  Award,
  RotateCw
} from 'lucide-react';
import { useAuth, ROLES, useToast } from '../../components/AuthProvider';
import { ROLE_LABELS, NON_STUDENT_ROLES } from '../../components/ClinicalFormControls';
import { ROLE_DEFINITIONS } from '../../lib/seedCourses';
import { useRealtimePlatformData } from '../../lib/realtimeStore';

export default function AdminPage() {
  const { user, profile, isSuperuser, generateInviteLink, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const {
    courses,
    labs,
    vouchers,
    upsertVoucher,
    usersList,
    upsertUserRecord,
    escrowLearners,
    upsertEscrowLearner
  } = useRealtimePlatformData();
  const [activeTab, setActiveTab] = useState('analytics');

  const canAccessAdmin =
    isSuperuser ||
    profile?.role === ROLES.SUPERUSER ||
    profile?.role === ROLES.REGISTRAR ||
    profile?.role === ROLES.AUDITOR;

  // VIP Invite Generator State
  const [targetRole, setTargetRole] = useState(ROLES.CREATOR);
  const [targetEmail, setTargetEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [mintedInvites, setMintedInvites] = useState([
    {
      role: 'creator',
      email: 'prof.kwame@ug.edu.gh',
      link: 'https://pamoja.health/?invite=pmj_vip_creator_demo&role=creator',
      createdAt: '2026-10-26'
    },
    {
      role: 'convener',
      email: 'dr.assessor@wits.ac.za',
      link: 'https://pamoja.health/?invite=pmj_vip_convener_demo&role=convener',
      createdAt: '2026-10-25'
    }
  ]);

  // New Voucher Mint State
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherSponsor, setNewVoucherSponsor] = useState('MoH & WHO AFRO Scholarship');

  if (!canAccessAdmin) {
    return (
      <div className="min-h-[85vh] pamoja-shell flex items-center justify-center p-4">
        <div className="max-w-xl w-full p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl text-center text-slate-900 dark:text-white relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-6 shadow-md">
            <Lock size={32} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] font-black uppercase tracking-wider mb-3">
            <ShieldAlert size={12} /> Root Security Protocol
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white mb-3">
            Super Admin Clearance Required
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed font-normal">
            The Command Center is strictly restricted to verified root administrators and council registrars.
          </p>

          {!user ? (
            <button
              onClick={loginWithGoogle}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign In with Authorized Root Account &rarr;
            </button>
          ) : (
            <Link
              href="/"
              className="block w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-200 dark:border-slate-700 text-center"
            >
              &larr; Return to Platform
            </Link>
          )}

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    );
  }

  const handleGenerateInvite = (e) => {
    e.preventDefault();
    const link = generateInviteLink(targetRole, targetEmail, 30);
    setGeneratedLink(link);
    setMintedInvites((prev) => [
      {
        role: targetRole,
        email: targetEmail || 'Open Recipient',
        link,
        createdAt: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
    addToast(`Cryptographic VIP Invite Link generated for ${targetRole.toUpperCase()}!`, 'success');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    addToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRoleChange = async (userObj, newRole) => {
    const isNextAdmin = NON_STUDENT_ROLES.includes(newRole);
    await upsertUserRecord({
      ...userObj,
      role: newRole,
      cpdPoints: isNextAdmin ? 0 : userObj.cpdPoints || 0,
      boardPendingPoints: isNextAdmin ? 0 : userObj.boardPendingPoints || 0,
      labPendingPoints: isNextAdmin ? 0 : userObj.labPendingPoints || 0
    });
    addToast(
      `${userObj.name} role updated to ${ROLE_LABELS[newRole] || newRole.toUpperCase()}!`,
      'success'
    );
  };

  // Super-Admin CPD Governance Actions
  const handleConfirmBoardQueue = async (u) => {
    const pending = Number(u.boardPendingPoints || 0);
    if (pending <= 0) return;
    await upsertUserRecord({
      ...u,
      cpdPoints: (u.cpdPoints || 0) + pending,
      boardPendingPoints: 0
    });
    addToast(`Confirmed ${pending} Board Queue CPD points for ${u.name}!`, 'success');
  };

  const handleAdjustCpdBalance = async (u, delta) => {
    if (!isSuperuser && profile?.role !== ROLES.SUPERUSER) {
      addToast('Only Super Administrators can manually adjust CPD point balances.', 'error');
      return;
    }
    const nextCpd = Math.max(0, (u.cpdPoints || 0) + delta);
    await upsertUserRecord({
      ...u,
      cpdPoints: nextCpd
    });
    addToast(
      `Adjusted ${u.name}'s Confirmed CPD balance by ${delta > 0 ? `+${delta}` : delta} (New: ${nextCpd} CPD).`,
      'success'
    );
  };

  const handleResetPracticalLock = async (u) => {
    if (!isSuperuser && profile?.role !== ROLES.SUPERUSER) {
      addToast('Only Super Administrators can reset practical certification locks.', 'error');
      return;
    }
    await upsertUserRecord({
      ...u,
      certifiedPracticalCourses: []
    });
    const escrowMatch = (escrowLearners || []).find((e) => e.id === u.id);
    if (escrowMatch) {
      await upsertEscrowLearner({
        ...escrowMatch,
        status: 'THEORY_ESCROW',
        certifiedPracticalCourses: []
      });
    }
    addToast(`Reset practical certification lock for ${u.name}.`, 'info');
  };

  // Mint & Revoke/Reactivate Vouchers
  const handleMintVoucher = async (e) => {
    e.preventDefault();
    if (!newVoucherCode.trim()) return;
    const code = newVoucherCode.trim().toUpperCase();
    await upsertVoucher({
      id: `vch-${Date.now()}`,
      code,
      sponsor: newVoucherSponsor || 'Pamoja Fellowship Grant',
      discountPercent: 100,
      usedCount: 0,
      maxUses: 500,
      status: 'Active',
      active: true
    });
    setNewVoucherCode('');
    addToast(`Smart Voucher ${code} minted in real time!`, 'success');
  };

  const handleToggleVoucherStatus = async (voucher) => {
    const isCurrentlyRevoked = voucher.status === 'Revoked' || voucher.active === false;
    const nextStatus = isCurrentlyRevoked ? 'Active' : 'Revoked';
    const nextActive = isCurrentlyRevoked;

    await upsertVoucher({
      ...voucher,
      status: nextStatus,
      active: nextActive
    });

    addToast(
      nextActive
        ? `Voucher ${voucher.code} reactivated!`
        : `Voucher ${voucher.code} revoked! Any future redemption attempts are now blocked.`,
      nextActive ? 'success' : 'info'
    );
  };

  const totalEscrowPoints = (escrowLearners || []).reduce(
    (acc, l) => acc + (Number(l.pendingPoints) || 0),
    0
  );

  return (
    <div className="min-h-screen pamoja-shell font-['Inter'] pb-24">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 lg:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-black uppercase tracking-wider mb-3">
              <ShieldCheck size={14} className="text-indigo-600 dark:text-indigo-400" /> Root System Administration
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white">
              Super Admin Governance, CPD Audit &amp; Voucher Control
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-normal mt-1 max-w-2xl leading-relaxed">
              10-Tier RBAC Matrix, Super-Admin CPD Adjustments &amp; Practical Lock Resets, and 1-Click Voucher Revocation.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3 shrink-0">
            <Link
              href="/studio"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-cyan-950 dark:hover:bg-cyan-900 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-cyan-800 font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              Educator Studio &rarr;
            </Link>
            <Link
              href="/labs?tab=convener"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800 font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              Convener Portal &rarr;
            </Link>
          </div>

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
            {[
              { id: 'analytics', Icon: BarChart, label: 'Platform Analytics' },
              { id: 'cpd_audit', Icon: Award, label: 'CPD Governance & Audit' },
              { id: 'rbac', Icon: Users, label: '10-Tier RBAC Matrix' },
              { id: 'vouchers', Icon: Tag, label: 'Smart Vouchers & Revoke' },
              { id: 'invites', Icon: Key, label: 'VIP Role Invites' }
            ].map((tab) => {
              const TabIcon = tab.Icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-left border cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-600/25'
                      : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 dark:border-slate-800'
                  }`}
                >
                  <TabIcon size={18} className={isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 w-full">
            {/* TAB 1: Platform Analytics */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Registered Users
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
                      {usersList?.length || 0}
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
                      &uarr; Live Synchronized
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Accredited Curricula
                    </div>
                    <div className="text-3xl font-black text-cyan-700 dark:text-cyan-400 font-['Outfit']">
                      {courses.length} Courses
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-2">
                      {courses.reduce((acc, c) => acc + (c.modules?.length || 1), 0)} Modules Total
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Simulation Centers
                    </div>
                    <div className="text-3xl font-black text-indigo-700 dark:text-indigo-400 font-['Outfit']">
                      {labs.length} Centers
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-2">OSCE Accredited</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      CPD Points In Lab Escrow
                    </div>
                    <div className="text-3xl font-black text-amber-700 dark:text-amber-400 font-['Outfit']">
                      {totalEscrowPoints} pts
                    </div>
                    <div className="text-xs text-amber-700/90 dark:text-amber-400/80 font-bold mt-2">
                      Awaiting OSCE Sign-Off
                    </div>
                  </div>
                </div>

                {/* Regional Equity Overview */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-['Outfit'] mb-2">
                    Continental Regional &amp; Rural Equity Index
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mb-6 leading-relaxed">
                    Monitoring rural sub-county and district tier access across Africa:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Rural Primary Clinics (HC III / HC IV)
                      </div>
                      <div className="text-2xl font-black text-cyan-700 dark:text-cyan-400 font-['Outfit']">58.4%</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full mt-3 overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                          style={{ width: '58.4%' }}
                        ></div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Regional Referral Hospitals (RRH)
                      </div>
                      <div className="text-2xl font-black text-indigo-700 dark:text-indigo-400 font-['Outfit']">28.2%</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full mt-3 overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                          style={{ width: '28.2%' }}
                        ></div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        National Referral &amp; Medical Schools
                      </div>
                      <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-['Outfit']">13.4%</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full mt-3 overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                          style={{ width: '13.4%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Super-Admin CPD Governance & Audit */}
            {activeTab === 'cpd_audit' && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl animate-fade-in space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                      Super-Admin Exclusive Authority
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                      Practitioner CPD Ledger, Board Queue &amp; Practical Lock Audit
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Confirm Board Queue points, perform audited CPD adjustments, or reset idempotent practical certification locks.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(usersList || [])
                    .filter((u) => !NON_STUDENT_ROLES.includes(u.role))
                    .map((u) => {
                      const certCourses = Array.isArray(u.certifiedPracticalCourses)
                        ? u.certifiedPracticalCourses
                        : [];
                      return (
                        <div
                          key={u.id}
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                              {u.title ? `${u.title} ` : ''}
                              {u.name}{' '}
                              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400">
                                ({u.authorityId || 'PENDING'})
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {u.facility} &bull; {u.country || 'Uganda'} &bull; Role:{' '}
                              <span className="uppercase font-bold text-slate-800 dark:text-slate-300">{u.role}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1.5 text-[11px] font-bold">
                              <span className="px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                                Confirmed CPD: {u.cpdPoints || 0}
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300">
                                Awaiting Board: {u.boardPendingPoints || 0}
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                                Pending Lab: {u.labPendingPoints ?? u.pendingPoints ?? 0}
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300">
                                Certified Practicals: {certCourses.length}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {(u.boardPendingPoints || 0) > 0 && (
                              <button
                                onClick={() => handleConfirmBoardQueue(u)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-xs"
                              >
                                Confirm Board ({u.boardPendingPoints} pts)
                              </button>
                            )}
                            <button
                              onClick={() => handleAdjustCpdBalance(u, 5)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer"
                            >
                              +5 CPD
                            </button>
                            <button
                              onClick={() => handleAdjustCpdBalance(u, -5)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-rose-700 dark:text-rose-300 text-xs font-bold cursor-pointer"
                            >
                              -5 CPD
                            </button>
                            {certCourses.length > 0 && (
                              <button
                                onClick={() => handleResetPracticalLock(u)}
                                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCw size={12} /> Reset Practical Lock
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* TAB 3: 10-Tier RBAC Management */}
            {activeTab === 'rbac' && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                      10-Tier Enterprise RBAC Matrix
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Manage user authorization and instant administrative role elevation
                    </p>
                  </div>
                  <div className="text-xs font-bold text-cyan-700 dark:text-cyan-400 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                    Total Users: {usersList?.length || 0}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <th className="py-3 px-4">Practitioner / Email</th>
                        <th className="py-3 px-4">Specialty &amp; Facility</th>
                        <th className="py-3 px-4">Role Tier</th>
                        <th className="py-3 px-4 text-right">Assign Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                      {(usersList || []).map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                            <div>
                              {u.title ? `${u.title} ` : ''}
                              {u.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">{u.email}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-medium text-xs">
                            <div>{u.specialty || u.cadre || 'Clinical Practice'}</div>
                            <div className="text-slate-500">
                              {u.facility || 'Regional Hospital'} ({u.country || 'Uganda'})
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                u.role === 'superuser'
                                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                  : u.role === 'creator'
                                  ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                                  : u.role === 'convener'
                                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : u.role === 'coordinator'
                                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u, e.target.value)}
                              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 focus:outline-none focus:border-indigo-500 cursor-pointer"
                            >
                              {ROLE_DEFINITIONS.map((r) => (
                                <option key={r.role} value={r.role}>
                                  {r.tier}. {r.title} ({r.role})
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Smart Vouchers (Real-Time Minting + 1-Click Revocation) */}
            {activeTab === 'vouchers' && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl animate-fade-in space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                    <Tag size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                      Scholarship &amp; Equity Smart Vouchers (Mint &amp; 1-Click Revoke)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Mint institutional scholarship codes or immediately revoke compromised vouchers across the platform.
                    </p>
                  </div>
                </div>

                {/* Mint New Voucher Form */}
                <form
                  onSubmit={handleMintVoucher}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"
                >
                  <input
                    type="text"
                    value={newVoucherCode}
                    onChange={(e) => setNewVoucherCode(e.target.value)}
                    placeholder="e.g. PMJ-MOH-2026"
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={newVoucherSponsor}
                    onChange={(e) => setNewVoucherSponsor(e.target.value)}
                    placeholder="Sponsor Name (e.g. UNFPA Maternal Grant)"
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <PlusCircle size={15} /> Mint Active Voucher
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vouchers.map((p) => {
                    const isRevoked = p.status === 'Revoked' || p.active === false;
                    return (
                      <div
                        key={p.id || p.code}
                        className={`p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border flex flex-col justify-between transition-colors ${
                          isRevoked
                            ? 'border-rose-300 dark:border-rose-800/70 opacity-85'
                            : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                              {p.sponsor || 'Scholarship Code'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                isRevoked
                                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              }`}
                            >
                              {isRevoked ? 'Revoked' : 'Active'}
                            </span>
                          </div>
                          <div
                            className={`text-xl font-black font-mono tracking-wider mb-2 ${
                              isRevoked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {p.code}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {p.discountPercent || 100}% Full Tuition Subsidy &bull; Redeemed:{' '}
                            {p.usedCount || 0}/{p.maxUses || 500}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs font-bold">
                          <button
                            onClick={() => copyToClipboard(p.code)}
                            className="text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-bold uppercase text-[11px] tracking-wider cursor-pointer"
                          >
                            Copy Code
                          </button>

                          <button
                            onClick={() => handleToggleVoucherStatus(p)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors ${
                              isRevoked
                                ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700'
                                : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700'
                            }`}
                          >
                            {isRevoked ? 'Reactivate Voucher' : 'Revoke Voucher'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: VIP Role Invites */}
            {activeTab === 'invites' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                <div className="pamoja-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] shadow-xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 shrink-0">
                      <Key size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                        Mint Cryptographic VIP Role Invite
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Issue role-bound cryptographic invite tokens for professors, conveners, coordinators, and auditors
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleGenerateInvite}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                  >
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Target Role Tier
                      </label>
                      <select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 focus:border-indigo-500 font-bold text-slate-900 dark:text-white text-xs bg-slate-50 dark:bg-slate-950"
                      >
                        <option value={ROLES.CREATOR}>Creator / Professor (Educator Studio)</option>
                        <option value={ROLES.CONVENER}>Convener / Examiner (Sim Labs &amp; OSCE)</option>
                        <option value={ROLES.COORDINATOR}>Facility Coordinator (LDHF Drills)</option>
                        <option value={ROLES.REVIEWER}>Clinical Reviewer (QA Desk)</option>
                        <option value={ROLES.REGISTRAR}>Accreditation Registrar</option>
                        <option value={ROLES.AUDITOR}>MoH / Donor Auditor</option>
                        <option value={ROLES.SUPPORT}>Tech Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Recipient Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={targetEmail}
                        onChange={(e) => setTargetEmail(e.target.value)}
                        placeholder="e.g. professor@university.ac.za"
                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-800 focus:border-indigo-500 font-medium text-slate-900 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 placeholder-slate-400"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                      >
                        <Sparkles size={16} /> Mint VIP Link
                      </button>
                    </div>
                  </form>

                  {generatedLink && (
                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                      <div className="w-full min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1">
                          Generated Cryptographic Invite URL
                        </div>
                        <div className="text-xs font-mono text-slate-900 dark:text-slate-200 truncate bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 select-all">
                          {generatedLink}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedLink)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Recent Minted Invites Table */}
                <div className="pamoja-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] shadow-xl">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white font-['Outfit'] mb-4">
                    Active VIP Invites Ledger
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          <th className="py-3 px-4">Role Target</th>
                          <th className="py-3 px-4">Recipient</th>
                          <th className="py-3 px-4">Minted Date</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                        {mintedInvites.map((inv, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                            <td className="py-3 px-4 font-bold text-indigo-700 dark:text-indigo-400 uppercase text-xs">
                              {inv.role}
                            </td>
                            <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium text-xs">
                              {inv.email}
                            </td>
                            <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">{inv.createdAt}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => copyToClipboard(inv.link)}
                                className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 px-3 py-1 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/50 cursor-pointer"
                              >
                                Copy URL
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
