"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, useTheme, ROLES } from '../../components/AuthProvider';
import {
  ROLE_LABELS,
  TITLE_OPTIONS,
  CADRE_OPTIONS,
  SPECIALTY_OPTIONS,
  SelectWithOther,
  CountrySelect
} from '../../components/ClinicalFormControls';
import {
  Award,
  ShieldCheck,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Globe,
  Building,
  Sparkles,
  Sun,
  Moon,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useRealtimePlatformData } from '../../lib/realtimeStore';
import VerifiableCertificateModal from '../../components/VerifiableCertificateModal';

const mockPoints = [
  { id: 1, source: 'Neonatal Resuscitation & Helping Babies Breathe', points: 1.5, expires: '2027-01-15' },
  { id: 2, source: 'Hospital-Acquired Infection Prevention & WASH Protocols', points: 1.0, expires: '2028-08-01' }
];

export default function ProfilePage() {
  const {
    user,
    profile,
    isGuest,
    isNonStudentRole,
    setAuthModalOpen,
    updateProfileState,
    showToast
  } = useAuth();
  const { theme, setTheme } = useTheme();
  const { certificates } = useRealtimePlatformData();

  const [isPublic, setIsPublic] = useState(false);
  const [copiedHash, setCopiedHash] = useState(null);
  const [activeCertificateModal, setActiveCertificateModal] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    name: '',
    cadre: '',
    specialty: '',
    country: 'Uganda',
    facility: '',
    authorityId: ''
  });

  useEffect(() => {
    if (profile?.isPublic !== undefined) {
      setIsPublic(profile.isPublic);
    }
    if (profile) {
      setEditForm({
        title: profile.title || '',
        name: profile.name || '',
        cadre: profile.cadre || 'Medical Officer / Doctor',
        specialty: profile.specialty || 'Obstetrics & Gynecology',
        country: profile.country || 'Uganda',
        facility: profile.facility || '',
        authorityId: profile.authorityId || ''
      });
    }
  }, [profile]);

  const handleTogglePublic = async () => {
    const newValue = !isPublic;
    setIsPublic(newValue);
    if (user && db) {
      try {
        await setDoc(doc(db, 'users', user.uid), { isPublic: newValue }, { merge: true });
      } catch (err) {
        console.warn('Could not save public preference to Firestore:', err);
      }
    }
  };

  const handleSaveProfileEdits = async (e) => {
    e.preventDefault();
    await updateProfileState(editForm);
    setIsEditingProfile(false);
    if (showToast) {
      showToast('Clinical profile and dropdown preferences saved!', 'success');
    }
  };

  const copyHash = (hash, id) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (!user || isGuest || !profile || profile.role === ROLES.GUEST) {
    return (
      <div className="min-h-[80vh] pamoja-shell flex items-center justify-center p-4">
        <div className="max-w-md w-full pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white mb-2">
            Practitioner Portfolio &amp; Theme Settings
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-normal leading-relaxed">
            Please sign in to view your validated CPD credits, verified council licensing status, cryptographic certificates, and theme preferences.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const expiringSoon = mockPoints.filter(
    (p) => new Date(p.expires) < new Date(new Date().setMonth(new Date().getMonth() + 2))
  );

  return (
    <div className="min-h-screen pamoja-shell font-['Inter'] pb-24">
      {/* Top Profile Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 animate-fade-in">
        <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={
                    profile.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile.name || 'Practitioner'
                    )}&background=00b4d8&color=fff&bold=true`
                  }
                  alt={profile.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-md">
                  <CheckCircle size={16} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[11px] font-black uppercase tracking-wider mb-1">
                  <Sparkles size={12} className="text-cyan-400" />{' '}
                  {ROLE_LABELS[profile.role] || 'Pan-African Medical Register'}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] text-white tracking-tight">
                  {profile.title ? `${profile.title} ` : ''}
                  {profile.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="text-slate-300">{profile.email}</span>
                  {profile.authorityId && (
                    <>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck size={14} /> Credential ID: {profile.authorityId}
                      </span>
                    </>
                  )}
                  {profile.facility && (
                    <>
                      <span>&bull;</span>
                      <span className="text-slate-300">
                        {profile.facility} ({profile.country || 'Pan-African Hub'})
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Controls: Edit Profile, Role Badge & Public Portfolio Toggle */}
            <div className="flex flex-wrap md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingProfile((prev) => !prev)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={13} /> {isEditingProfile ? 'Close Editor' : 'Edit Profile'}
                </button>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold flex items-center gap-2">
                  <span className="text-slate-400 uppercase text-[10px] tracking-wider">Role:</span>
                  <span className="text-cyan-400 font-mono font-bold uppercase">
                    {profile.role || 'Learner'}
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-slate-300 hover:text-white transition-colors bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800">
                <span className="font-semibold">Public Portfolio:</span>
                <div
                  onClick={handleTogglePublic}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                    isPublic ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      isPublic ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Inline Clinical Profile Editor with <SelectWithOther /> and <CountrySelect /> */}
          {isEditingProfile && (
            <form
              onSubmit={handleSaveProfileEdits}
              className="relative z-10 mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in"
            >
              <SelectWithOther
                label="Professional Title"
                options={TITLE_OPTIONS}
                value={editForm.title}
                onChange={(val) => setEditForm({ ...editForm, title: val })}
              />
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <SelectWithOther
                label="Cadre / Job Description"
                options={CADRE_OPTIONS}
                value={editForm.cadre}
                onChange={(val) => setEditForm({ ...editForm, cadre: val })}
              />
              <SelectWithOther
                label="Primary Clinical Specialty"
                options={SPECIALTY_OPTIONS}
                value={editForm.specialty}
                onChange={(val) => setEditForm({ ...editForm, specialty: val })}
              />
              <CountrySelect
                label="Country of Practice"
                value={editForm.country}
                onChange={(val) => setEditForm({ ...editForm, country: val })}
              />
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Hospital / Facility Name
                </label>
                <input
                  type="text"
                  value={editForm.facility}
                  onChange={(e) => setEditForm({ ...editForm, facility: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} /> Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Persistent Appearance & Theme Preference Card (Light vs. Dark Mode) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-7 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-2 mb-1">
              {theme === 'light' ? <Sun size={15} /> : <Moon size={15} />} Appearance &amp; Theme Preference
            </div>
            <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
              Choose Your Clinical Workspace Theme
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Switch between <strong>Crisp Light Clinical</strong> (daytime ward rounds) and{' '}
              <strong>Obsidian Dark Slate</strong> (low-glare night shift reading). Saved automatically to your profile.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                updateProfileState({ themePreference: 'light' });
              }}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-600 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600'
              }`}
            >
              <Sun size={15} /> Crisp Light Clinical
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                updateProfileState({ themePreference: 'dark' });
              }}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-600 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600'
              }`}
            >
              <Moon size={15} /> Obsidian Dark Slate
            </button>
          </div>
        </div>
      </div>

      {/* Role-Specific 3-Column Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {isNonStudentRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl">
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                Administrative Clearance
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white mt-2">
                {ROLE_LABELS[profile.role] || profile.role}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Full executive governance, voucher revocation, and CPD audit authority enabled.
              </p>
            </div>
            <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Account Type
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-emerald-700 dark:text-emerald-400 mt-2">
                Non-Student Executive
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Student CPD counters and lab escrow queues are excluded from administrative accounts.
              </p>
            </div>
            <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl flex flex-col justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                Executive Console
              </span>
              <Link
                href="/admin"
                className="mt-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-black uppercase tracking-wider text-center shadow-md"
              >
                Open Governance &amp; CPD Audit &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Confirmed CPD Points
                </span>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Award size={20} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                {profile.cpdPoints || 0}{' '}
                <span className="text-base font-semibold text-cyan-700 dark:text-cyan-400">Points</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Ready for annual licensure renewal submission (Awaiting Board:{' '}
                {profile.boardPendingPoints || 0} pts).
              </p>
            </div>

            <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Pending Practical Sign-Off
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock size={20} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black font-['Outfit'] text-amber-700 dark:text-amber-400">
                {profile.labPendingPoints ?? profile.pendingPoints ?? 0}{' '}
                <span className="text-base font-semibold text-slate-500 dark:text-slate-400">Pending</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Attend a hands-on practical session to add these points to your certificate.
              </p>
            </div>

            <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Medical Council Status
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black font-['Outfit'] text-emerald-700 dark:text-emerald-400 mt-1">
                Active &amp; Up to Date
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Ready for your annual medical or nursing council license renewal.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Compliance Expiration Alert (for Student/Practitioner roles only) */}
      {!isNonStudentRole && expiringSoon.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 animate-fade-in">
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-[2rem] p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-900/60 border border-rose-700 flex items-center justify-center shrink-0 text-rose-400">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-['Outfit'] text-rose-200">
                  Action Required: Compliance Expirations Pending
                </h3>
                <p className="text-xs text-rose-300/90 mt-1 max-w-2xl leading-relaxed">
                  National board compliance requires you to maintain active credits. Some modules are nearing expiry:
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  {expiringSoon.map((p) => (
                    <span
                      key={p.id}
                      className="text-xs bg-rose-950 px-3 py-1 rounded-lg border border-rose-800 text-rose-300 font-medium"
                    >
                      {p.source} &bull; <strong className="text-rose-200">Expires: {p.expires}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/labs"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-md"
            >
              Book Refresher Lab
            </Link>
          </div>
        </div>
      )}

      {/* Main Content: 2-Column Responsive Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: Verifiable Certificates */}
          <div className="lg:col-span-7 space-y-6">
            <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={20} className="text-cyan-600 dark:text-cyan-400" /> Verifiable CPD Certificates
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Digitally signed certificates with immutable SHA-256 validation hashes.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                  {certificates.length} Issued
                </span>
              </div>

              <div className="space-y-5">
                {certificates.map((cert) => {
                  const certTitle =
                    cert.courseTitle || cert.name || 'Accredited Clinical Mastery Certificate';
                  const certHash =
                    cert.sha256Hash || cert.hash || '8f9a21b8e731c0d94321ab09e412c81a';
                  const certDate = cert.issuedDate || cert.date || '2026-10-28';
                  const certIssuer =
                    cert.convenerSignOff || cert.issuer || 'WHO AFRO & MoH Accredited';
                  return (
                    <div
                      key={cert.id}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all duration-200 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md mb-2">
                            <CheckCircle size={11} />{' '}
                            {cert.authorityId || cert.verifiedCouncil || 'Council Accredited'}
                          </div>
                          <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white">
                            {certTitle}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            {certIssuer} &bull; {certDate}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0">
                          <span className="text-sm font-black text-amber-700 dark:text-amber-400">
                            {cert.cpdPoints} CPD Points
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ID: {cert.id}
                          </span>
                        </div>
                      </div>

                      {/* SHA-256 Hash Display */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
                        <span className="truncate">
                          <strong className="text-slate-800 dark:text-slate-300">SHA-256:</strong> {certHash}
                        </span>
                        <button
                          onClick={() => copyHash(certHash, cert.id)}
                          className="text-[11px] text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-bold shrink-0 uppercase tracking-wider cursor-pointer"
                        >
                          {copiedHash === cert.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          onClick={() =>
                            setActiveCertificateModal({
                              ...cert,
                              learnerName: cert.learnerName || profile.name,
                              authorityId: cert.authorityId || profile.authorityId || 'COUNCIL-VERIFIED',
                              facility: cert.facility || profile.facility || 'Regional Hospital'
                            })
                          }
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Award size={14} /> View &amp; Print Official Signed Certificate
                        </button>

                        <Link
                          href={`/verify?hash=${encodeURIComponent(certHash)}`}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all border border-emerald-300 dark:border-emerald-800/70 flex items-center gap-1.5"
                        >
                          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" /> Verify in Public Registry
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Achievement Badges & Statutory Councils */}
          <div className="lg:col-span-5 space-y-6">
            <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
                <Award size={20} className="text-amber-600 dark:text-amber-400" /> Clinical Mastery Badges
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center group hover:border-amber-500/50 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Award size={28} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 font-['Outfit']">
                    PPH First Responder
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">EMOTIVE Bundle Master</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center group hover:border-cyan-500/50 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <ShieldCheck size={28} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 font-['Outfit']">
                    Neonatal Saver
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">BABC 3.0 Certified</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center group hover:border-purple-500/50 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Building size={28} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 font-['Outfit']">
                    OSCE Validated
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Regional Sim Center</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center opacity-60">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3">
                    <Sparkles size={28} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 font-['Outfit']">
                    LDHF Champion
                  </h4>
                  <p className="text-[11px] text-slate-500">3/8 Weeks Completed</p>
                </div>
              </div>
            </div>

            <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Outfit'] flex items-center gap-2">
                <Globe size={18} className="text-cyan-600 dark:text-cyan-400" /> National Statutory Boards
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">UMDPC (Uganda)</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle size={13} /> Synchronized
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">HPCSA (South Africa)</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle size={13} /> Synchronized
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">KMPDC (Kenya)</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle size={13} /> Synchronized
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Cryptographic Certificate Modal */}
      <VerifiableCertificateModal
        isOpen={Boolean(activeCertificateModal)}
        onClose={() => setActiveCertificateModal(null)}
        certificate={activeCertificateModal}
      />
    </div>
  );
}
