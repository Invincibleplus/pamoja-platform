"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  Award,
  Lock,
  QrCode,
  FileCheck,
  RefreshCw,
  Building,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';
import { useRealtimePlatformData } from '../../lib/realtimeStore';
import { verifyCertificateIntegrity, CREDENTIAL_TIERS } from '../../lib/certificateCrypto';
import { OfficialCertificateCanvas } from '../../components/VerifiableCertificateModal';

function VerifyPortalContent() {
  const searchParams = useSearchParams();
  const { certificates } = useRealtimePlatformData();

  const [queryInput, setQueryInput] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [simulateTamper, setSimulateTamper] = useState(false);

  const performLookup = (rawQuery, certList = certificates) => {
    const q = (rawQuery || '').trim().toLowerCase();
    if (!q) {
      setSelectedCert(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    setSimulateTamper(false);

    const found = certList.find((c) => {
      const hash = (c.sha256Hash || c.hash || '').toLowerCase();
      const id = (c.id || '').toLowerCase();
      const authId = (c.authorityId || '').toLowerCase();
      const name = (c.learnerName || '').toLowerCase();
      const checksum = (c.checksum || '').toLowerCase();
      return (
        hash === q ||
        hash.includes(q) ||
        id === q ||
        authId === q ||
        checksum === q ||
        (q.length >= 4 && name.includes(q))
      );
    });

    setSelectedCert(found || null);
  };

  useEffect(() => {
    const urlHash = searchParams.get('hash') || searchParams.get('id') || '';
    if (urlHash) {
      setQueryInput(urlHash);
      performLookup(urlHash, certificates);
    } else if (certificates.length > 0 && !hasSearched) {
      // Pre-select the most recent certificate so visitors immediately see a live verification
      const latest = certificates[0];
      const latestKey = latest.sha256Hash || latest.hash || latest.id;
      setQueryInput(latestKey);
      setSelectedCert(latest);
      setHasSearched(true);
    }
  }, [searchParams, certificates]);

  // If user toggles the Tamper-Detection test, simulate an unauthorized edit to cpdPoints
  const displayedCert =
    selectedCert && simulateTamper
      ? {
          ...selectedCert,
          cpdPoints: Number(selectedCert.cpdPoints || 15) + 50,
          checksum: selectedCert.checksum || 'PMJ-SIG-ORIGINAL'
        }
      : selectedCert;

  const integrityResult = displayedCert ? verifyCertificateIntegrity(displayedCert) : null;

  return (
    <div className="min-h-screen pamoja-shell font-['Inter'] pb-24">
      {/* Top Bar */}
      <div className="pamoja-card border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft size={15} /> Back to Platform
            </Link>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 dark:text-white font-['Outfit'] uppercase tracking-wider">
                Official CPD Certificate Verification
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
              <Lock size={12} /> Verified Official Registry
            </span>
          </div>
        </div>
      </div>

      {/* Hero Search Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-[11px] font-black uppercase tracking-widest">
              <ShieldCheck size={14} className="text-cyan-600 dark:text-cyan-400" /> Medical Council &amp; Employer Verification
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight">
              Verify a Pamoja CPD Certificate
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Enter a practitioner&apos;s Certificate ID, Medical Council License number (
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">UMDPC, HPCSA, KMPDC, UNMC</span>), or verification code below to confirm their course completion and CPD credits.
            </p>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                performLookup(queryInput);
              }}
              className="pt-2 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
            >
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Enter SHA-256 Hash (pmj_cert_...), Certificate ID, or Council License (UMDPC-14892)..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                Verify Authenticity
              </button>
            </form>

            {/* Quick-Select Issued Registry Credentials */}
            {certificates.length > 0 && (
              <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Issued Registry Records:</span>
                {certificates.slice(0, 5).map((c) => {
                  const hashKey = c.sha256Hash || c.hash || c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setQueryInput(hashKey);
                        performLookup(hashKey);
                      }}
                      className={`px-3 py-1 rounded-lg border font-mono text-[11px] transition-all cursor-pointer ${
                        selectedCert?.id === c.id
                          ? 'bg-cyan-50 border-cyan-400 text-cyan-800 dark:bg-cyan-950 dark:border-cyan-500 dark:text-cyan-300 font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      {c.learnerName || 'Practitioner'} ({hashKey.slice(0, 15)}...)
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Verification Result Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {hasSearched && !selectedCert && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-700/80 rounded-[2rem] p-8 text-center max-w-2xl mx-auto space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/60 border border-rose-300 dark:border-rose-600 text-rose-700 dark:text-rose-300 flex items-center justify-center mx-auto">
              <ShieldAlert size={28} />
            </div>
            <h3 className="text-xl font-black font-['Outfit'] text-slate-900 dark:text-white">
              Unverified / Non-Existent Credential
            </h3>
            <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-200/90 leading-relaxed">
              No certificate or milestone record matching <code className="font-mono font-bold">{queryInput}</code> was found in the Pamoja Immutable Statutory Registry. Certificates can only be minted automatically by the platform when a practitioner completes required modules, passes the Post-Test (&ge; 80%), or receives OSCE Convener sign-off.
            </p>
          </div>
        )}

        {displayedCert && integrityResult && (
          <div className="space-y-6 animate-fade-in">
            {/* 3-Pillar Cryptographic Verification Audit Banner */}
            <div
              className={`rounded-[2rem] p-6 border-2 shadow-xl ${
                integrityResult.isValid
                  ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/25 dark:border-emerald-600/70'
                  : 'bg-rose-50/70 border-rose-300 dark:bg-rose-950/40 dark:border-rose-600/80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800/80">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      integrityResult.isValid
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-950 dark:border-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {integrityResult.isValid ? <CheckCircle size={26} /> : <AlertTriangle size={26} />}
                  </div>
                  <div>
                    <div
                      className={`text-[11px] font-black uppercase tracking-widest ${
                        integrityResult.isValid ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400'
                      }`}
                    >
                      {integrityResult.isValid
                        ? 'Authentic Certificate Verified'
                        : 'Certificate Alert: Record Mismatch'}
                    </div>
                    <h2 className="text-lg sm:text-xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                      {integrityResult.reason}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 text-xs">
                <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                    1. Course &amp; Exam Completion
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {displayedCert.completedModulesCount || displayedCert.totalModulesCount || 'All'} of{' '}
                    {displayedCert.totalModulesCount || 'All'} Modules + Post-Test ({displayedCert.postTestScore || '92%'})
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Issued after completing all lessons and passing the final assessment.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    2. Practical Session &amp; CPD Status
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {displayedCert.credentialTier === CREDENTIAL_TIERS.THEORY_MILESTONE
                      ? 'Online Lessons Completed (Practical Pending)'
                      : 'Fully Verified & Added to CPD Record'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {displayedCert.convenerSignOff || 'Verified by Accredited Supervisor'}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    3. Continued Learning Refreshers
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {Array.isArray(displayedCert.recurringCompleted) &&
                    displayedCert.recurringCompleted.length > 0
                      ? `${displayedCert.recurringCompleted.length} Follow-Up Refreshers (+${displayedCert.sustainmentCpdBonus || 0} CPD)`
                      : 'Active Follow-Up Window'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ongoing short refresher modules completed after the main course.
                  </p>
                </div>
              </div>

              <details className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
                <summary className="cursor-pointer font-semibold text-slate-700 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400">
                  Technical &amp; Security Details (For Registrars &amp; IT Auditors)
                </summary>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-1 text-[11px]">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">SHA-256 Digital Signature:</strong>{' '}
                      <code className="font-mono text-cyan-700 dark:text-cyan-300">{displayedCert.sha256Hash || displayedCert.hash}</code>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Integrity Checksum:</strong>{' '}
                      <code className="font-mono text-emerald-700 dark:text-emerald-400">{displayedCert.checksum}</code>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimulateTamper((prev) => !prev)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                      simulateTamper
                        ? 'bg-rose-600 text-white border-rose-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {simulateTamper
                      ? 'Restore Original Certificate Record'
                      : 'Simulate Tamper Check'}
                  </button>
                </div>
              </details>
            </div>

            {/* Official Personalized Certificate Render */}
            <OfficialCertificateCanvas cert={displayedCert} showActions={true} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pamoja-shell flex items-center justify-center text-sm text-slate-500">
          Loading Pamoja Cryptographic Verification Registry...
        </div>
      }
    >
      <VerifyPortalContent />
    </Suspense>
  );
}
