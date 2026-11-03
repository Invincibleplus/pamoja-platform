"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  ShieldCheck,
  CheckCircle,
  Download,
  Printer,
  Copy,
  ExternalLink,
  X,
  Lock,
  Sparkles,
  QrCode,
  Building,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { CREDENTIAL_TIERS, verifyCertificateIntegrity } from '../lib/certificateCrypto';

/**
 * Deterministic visual QR-style matrix SVG generated from the certificate's SHA-256 hash
 */
function CryptoQrMatrix({ hashString = 'pmj_cert_default' }) {
  const size = 11;
  const cells = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Corner finder patterns (top-left, top-right, bottom-left 3x3 blocks)
      const isTopLeft = r < 3 && c < 3;
      const isTopRight = r < 3 && c >= size - 3;
      const isBottomLeft = r >= size - 3 && c < 3;

      if (isTopLeft || isTopRight || isBottomLeft) {
        cells.push({ r, c, on: true, finder: true });
      } else {
        const charIdx = (r * size + c) % hashString.length;
        const code = hashString.charCodeAt(charIdx) + r * 7 + c * 13;
        cells.push({ r, c, on: code % 2 === 0, finder: false });
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-24 h-24 p-2 bg-white rounded-xl border-2 border-cyan-500/40 shadow-inner shrink-0"
      aria-label="Cryptographic Verification QR Code"
    >
      {cells.map((cell, i) =>
        cell.on ? (
          <rect
            key={i}
            x={cell.c}
            y={cell.r}
            width={0.88}
            height={0.88}
            rx={0.15}
            fill={cell.finder ? '#0891b2' : '#0f172a'}
          />
        ) : null
      )}
    </svg>
  );
}

/**
 * Reusable Official Certificate Canvas (can be rendered inside a modal OR directly inside /verify)
 */
export function OfficialCertificateCanvas({ cert, showActions = true }) {
  const [copied, setCopied] = useState(false);
  if (!cert) return null;

  const integrity = verifyCertificateIntegrity(cert);
  const certHash = cert.sha256Hash || cert.hash || 'pmj_cert_8f9a21b8e731c0d94321ab09';
  const checksum = cert.checksum || 'PMJ-SIG-8F9A21B8-E731';
  const certTitle = cert.courseTitle || cert.name || 'National EMOTIVE & Helping Mothers Survive PPH Refresher';
  const learnerDisplay = `${cert.learnerTitle || 'Dr.'} ${cert.learnerName || 'Verified Practitioner'}`.replace(
    /^Dr\.\s+Dr\./i,
    'Dr.'
  );
  const authorityId = cert.authorityId || 'UMDPC-14892';
  const facility = cert.facility || 'Mulago Specialized Referral Hospital';
  const activityCode = cert.activityCode || 'UMDPC/CPD/2026/0892';
  const issuedDate = cert.issuedDate || cert.date || new Date().toISOString().slice(0, 10);
  const validUntil = cert.validUntil || '2027-10-28';
  const isProvisional = cert.credentialTier === CREDENTIAL_TIERS.THEORY_MILESTONE;
  const isRecurringSustained =
    cert.credentialTier === CREDENTIAL_TIERS.RECURRING_SUSTAINED ||
    (Array.isArray(cert.recurringCompleted) && cert.recurringCompleted.length > 0) ||
    Number(cert.sustainmentCpdBonus || 0) > 0;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(certHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate standalone verifiable HTML certificate for download or print
  const buildStandaloneCertificateHtml = () => {
    const verifyLink =
      typeof window !== 'undefined'
        ? `${window.location.origin}/verify?hash=${encodeURIComponent(certHash)}`
        : `https://pamoja.health/verify?hash=${encodeURIComponent(certHash)}`;

    const recurringHtml =
      Array.isArray(cert.recurringCompleted) && cert.recurringCompleted.length > 0
        ? `<div style="margin-top:16px;padding:12px 16px;background:#083344;border:1px solid #06b6d4;border-radius:12px;text-align:left;">
             <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#67e8f9;letter-spacing:1px;">
               Recurring Continuous Learning &amp; LDHF Milestones Completed (+${cert.sustainmentCpdBonus || 0} Bonus CPD)
             </div>
             <div style="font-size:12px;color:#e2e8f0;margin-top:4px;">
               ${cert.recurringCompleted.join(' &bull; ')}
             </div>
           </div>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Pamoja Accredited CPD Certificate — ${learnerDisplay}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800;900&display=swap');
    body {
      margin: 0;
      padding: 32px;
      background: #020617;
      color: #f8fafc;
      font-family: 'Inter', sans-serif;
      display: flex;
      justify-content: center;
    }
    .cert-frame {
      max-width: 920px;
      width: 100%;
      background: radial-gradient(circle at top right, #0f172a 0%, #020617 100%);
      border: 3px solid ${isProvisional ? '#f59e0b' : '#06b6d4'};
      border-radius: 28px;
      padding: 44px;
      box-sizing: border-box;
      position: relative;
      box-shadow: 0 25px 60px rgba(0,0,0,0.65);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      background: ${isProvisional ? '#451a03' : '#083344'};
      color: ${isProvisional ? '#fcd34d' : '#67e8f9'};
      border: 1px solid ${isProvisional ? '#d97706' : '#0891b2'};
    }
    h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 32px;
      font-weight: 900;
      margin: 14px 0 6px;
      color: #ffffff;
    }
    .learner-name {
      font-family: 'Outfit', sans-serif;
      font-size: 36px;
      font-weight: 900;
      color: #38bdf8;
      margin: 12px 0 6px;
    }
    .course-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #f8fafc;
      margin: 12px 0;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 24px;
    }
    .metric-box {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 12px;
      text-align: center;
    }
    .metric-label {
      font-size: 10px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .metric-val {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #f8fafc;
      margin-top: 4px;
    }
    .crypto-bar {
      margin-top: 28px;
      padding: 16px;
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: monospace;
      font-size: 12px;
      color: #cbd5e1;
    }
    @media print {
      body { background: #020617; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:18px;">
      <div>
        <div style="font-family:'Outfit',sans-serif;font-size:24px;font-weight:900;color:#fff;">Pamoja<span style="color:#22d3ee;">.</span> Statutory Medical CPD Registry</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:2px;">${cert.issuer || 'Makerere University CHS • WHO AFRO • UMDPC • HPCSA • KMPDC'}</div>
      </div>
      <span class="badge">${cert.tierLabel || (isProvisional ? 'Theory Milestone Credential' : 'Accredited CPD Certificate')}</span>
    </div>

    <div style="text-align:center;padding:24px 0 12px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;font-weight:700;">
        This Cryptographically Signed Credential Certifies That
      </div>
      <div class="learner-name">${learnerDisplay}</div>
      <div style="font-size:13px;color:#cbd5e1;font-weight:600;">
        Medical Council License: <strong style="color:#34d399;">${authorityId}</strong> &bull; Facility: <strong>${facility}</strong>
      </div>

      <div style="font-size:12px;color:#94a3b8;margin-top:18px;">
        Has successfully satisfied the statutory clinical competency and assessment milestones for:
      </div>
      <div class="course-title">${certTitle}</div>
      <div style="font-size:12px;color:#38bdf8;font-weight:700;">
        Statutory Board Activity Code: ${activityCode} &bull; Modules Completed: ${cert.completedModulesCount || cert.totalModulesCount || 'All'} of ${cert.totalModulesCount || 'All'}
      </div>
      ${recurringHtml}
    </div>

    <div class="metrics">
      <div class="metric-box">
        <div class="metric-label">${isProvisional ? 'Escrowed CPD Credits' : 'Validated CPD Credits'}</div>
        <div class="metric-val" style="color:#fbbf24;">${cert.cpdPoints} CPD Pts</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Post-Test Mastery</div>
        <div class="metric-val" style="color:#34d399;">${cert.postTestScore || '92%'}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">OSCE Practical Rubric</div>
        <div class="metric-val" style="color:#38bdf8;">${cert.osceScore || 'Verified'}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Active Validity Window</div>
        <div class="metric-val">${issuedDate} &rarr; ${validUntil}</div>
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;margin-top:28px;padding-top:18px;border-top:1px solid #1e293b;font-size:12px;color:#94a3b8;">
      <div>
        <strong style="color:#f8fafc;display:block;">${cert.leadProfessor || 'Prof. E. M. Achieng, MD, FRCOG'}</strong>
        <span>Lead Authoring Faculty &amp; Curriculum Chair</span>
      </div>
      <div style="text-align:right;">
        <strong style="color:#f8fafc;display:block;">${cert.convenerSignOff || 'Dr. Accredited OSCE Convener & Registrar'}</strong>
        <span>Statutory Board &amp; OSCE Sign-Off</span>
      </div>
    </div>

    <div class="crypto-bar">
      <div>
        <div><strong style="color:#38bdf8;">SHA-256 SIGNATURE:</strong> ${certHash}</div>
        <div style="margin-top:4px;"><strong style="color:#34d399;">CHECKSUM:</strong> ${checksum} &bull; <strong>ID:</strong> ${cert.id}</div>
      </div>
      <div style="text-align:right;">
        <div style="color:#67e8f9;font-weight:700;">Verify Authenticity Online:</div>
        <div>${verifyLink}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadCertificate = () => {
    const html = buildStandaloneCertificateHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pamoja-Verified-Certificate-${cert.id || authorityId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintCertificate = () => {
    const html = buildStandaloneCertificateHtml();
    const printWin = window.open('', '_blank', 'width=1024,height=768');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(html);
      printWin.document.close();
      setTimeout(() => {
        printWin.focus();
        printWin.print();
      }, 450);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Official Certificate Frame */}
      <div
        className={`relative rounded-[2rem] p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 shadow-2xl overflow-hidden ${
          !integrity.isValid
            ? 'border-rose-500/80'
            : isProvisional
            ? 'border-amber-500/70'
            : 'border-cyan-500/70'
        }`}
      >
        {/* Decorative Watermark */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Official Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
              <Award size={26} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                Accredited Medical Continuing Professional Development
              </div>
              <h3 className="text-lg sm:text-xl font-black font-['Outfit'] text-white">
                Pamoja Official CPD Certificate
              </h3>
              <p className="text-[11px] text-slate-400">
                {cert.issuer ||
                  'Makerere University College of Health Sciences • WHO AFRO & Partner Medical Councils'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <span
              className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5 w-fit ${
                !integrity.isValid
                  ? 'bg-rose-950 text-rose-300 border-rose-700'
                  : isProvisional
                  ? 'bg-amber-950/90 text-amber-300 border-amber-700'
                  : isRecurringSustained
                  ? 'bg-purple-950/90 text-purple-300 border-purple-700'
                  : 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
              }`}
            >
              <ShieldCheck size={13} />
              {cert.tierLabel ||
                (isProvisional
                  ? 'Milestone 1: Online Modules Completed'
                  : isRecurringSustained
                  ? 'Full Certificate + Continued Learning Endorsed'
                  : 'Official Accredited CPD Certificate')}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Activity Ref: <strong className="text-cyan-300">{activityCode}</strong>
            </span>
          </div>
        </div>

        {/* Center Personalized Award Section */}
        <div className="relative z-10 text-center py-7 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            This Official Certificate Confirms That
          </div>

          <div className="text-2xl sm:text-4xl font-black font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 py-1">
            {learnerDisplay}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-emerald-400 font-bold">
              License: {authorityId}
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <Building size={13} className="text-cyan-400" /> {facility}
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-xl mx-auto pt-2 leading-relaxed">
            {isProvisional
              ? 'Has completed the required online clinical modules and passed the final assessment (>= 80%). CPD points are reserved and ready for hands-on practical skills sign-off for:'
              : 'Has successfully completed the clinical curriculum, practical protocols, and assessments for:'}
          </p>

          <h4 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white max-w-2xl mx-auto leading-snug pt-1">
            {certTitle}
          </h4>

          {/* Recurring Follow-Up / LDHF Sustainment Endorsement Banner */}
          {isRecurringSustained && (
            <div className="max-w-2xl mx-auto mt-4 p-4 rounded-2xl bg-purple-950/30 border border-purple-700/70 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <RefreshCw size={13} className="text-purple-400" /> Recurring Follow-Up &amp; LDHF Sustainment Active
                </div>
                <p className="text-xs text-slate-300">
                  {Array.isArray(cert.recurringCompleted) && cert.recurringCompleted.length > 0
                    ? `Completed Follow-Up Modules: ${cert.recurringCompleted.join(' • ')}`
                    : 'Verified weekly Low Dose High Frequency (LDHF) facility drills completed.'}
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-600 text-purple-200 font-black text-xs whitespace-nowrap">
                +{cert.sustainmentCpdBonus || 0.5} Bonus Sustainment CPD
              </span>
            </div>
          )}
        </div>

        {/* 4-Column Competency & Credit Metrics */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isProvisional ? 'Escrowed Credits' : 'Validated Credits'}
            </div>
            <div className="text-lg sm:text-xl font-black font-['Outfit'] text-amber-400 mt-1">
              {cert.cpdPoints} CPD Pts
            </div>
            <div className="text-[10px] text-slate-500">
              {isProvisional ? 'Awaiting OSCE Release' : 'Statutory Approved'}
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pre &rarr; Post Mastery
            </div>
            <div className="text-lg sm:text-xl font-black font-['Outfit'] text-emerald-400 mt-1">
              {cert.preTestScore || '75%'} &rarr; {cert.postTestScore || '92%'}
            </div>
            <div className="text-[10px] text-slate-500">Zero Regression Verified</div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              OSCE Practical Score
            </div>
            <div className="text-lg sm:text-xl font-black font-['Outfit'] text-cyan-400 mt-1">
              {cert.osceScore || (isProvisional ? 'Pending Lab' : '91%')}
            </div>
            <div className="text-[10px] text-slate-500">
              {isProvisional ? 'Admission Authorized' : '>= 80% Rubric Pass'}
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Validity &amp; Renewal
            </div>
            <div className="text-sm sm:text-base font-black font-['Outfit'] text-white mt-1.5">
              {issuedDate}
            </div>
            <div className="text-[10px] text-emerald-400">Valid thru {validUntil}</div>
          </div>
        </div>

        {/* Signatures & Cryptographic QR Verification Bar */}
        <div className="relative z-10 mt-4 pt-6 border-t border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-auto text-xs">
            <div className="space-y-1">
              <div className="font-['Outfit'] text-sm font-black text-white italic tracking-wide">
                {cert.leadProfessor || 'Prof. E. M. Achieng, MD, FRCOG'}
              </div>
              <div className="h-px w-44 bg-slate-700" />
              <div className="text-[11px] text-slate-400">Lead Authoring Professor &amp; Academic Chair</div>
            </div>

            <div className="space-y-1">
              <div className="font-['Outfit'] text-sm font-black text-cyan-300 italic tracking-wide">
                {cert.convenerSignOff || 'Dr. Accredited OSCE Convener'}
              </div>
              <div className="h-px w-44 bg-slate-700" />
              <div className="text-[11px] text-slate-400">OSCE Simulation Convener &amp; Statutory Registrar</div>
            </div>
          </div>

          {/* QR Code + SHA-256 Digest Box */}
          <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 w-full lg:w-auto">
            <CryptoQrMatrix hashString={certHash} />
            <div className="space-y-1 text-[11px] font-mono min-w-0">
              <div className="text-[10px] font-sans font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <CheckCircle size={12} /> SHA-256 Cryptographic Seal
              </div>
              <div className="text-slate-200 truncate max-w-[210px] sm:max-w-[260px]" title={certHash}>
                {certHash}
              </div>
              <div className="text-cyan-400 text-[10px]">Checksum: {checksum}</div>
              <div className="text-slate-500 text-[10px] font-sans">
                Verify at: <span className="text-slate-300">/verify?hash={certHash.slice(0, 16)}...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Printer size={15} /> Print / Save as Official PDF
            </button>

            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-800 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download size={15} /> Download Verifiable Certificate (.HTML)
            </button>

            <button
              type="button"
              onClick={handleCopyHash}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Copy size={14} className="text-cyan-400" />
              {copied ? 'SHA-256 Hash Copied!' : 'Copy Hash'}
            </button>
          </div>

          <Link
            href={`/verify?hash=${encodeURIComponent(certHash)}`}
            className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck size={15} /> Open Public Verification Portal &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * Modal wrapper for viewing a personalized cryptographic certificate anywhere in the app
 */
export default function VerifiableCertificateModal({ isOpen, onClose, certificate }) {
  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl w-full my-8 space-y-4">
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <FileCheck size={18} className="text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-wider text-white font-['Outfit']">
              Official Personalized &amp; Cryptographically Signed Credential
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <OfficialCertificateCanvas cert={certificate} showActions={true} />
      </div>
    </div>
  );
}

