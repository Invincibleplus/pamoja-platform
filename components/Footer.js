"use client";

import Link from 'next/link';
import {
  Stethoscope,
  Globe,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pamoja-card border-t pamoja-divider pamoja-text-muted font-['Inter'] mt-auto pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b pamoja-divider">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl text-white shadow-md shadow-cyan-500/20">
                <Stethoscope size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-black pamoja-text-main font-['Outfit'] tracking-tight">
                Pamoja<span className="text-cyan-600">.</span>
              </span>
            </Link>

            <p className="text-xs pamoja-text-muted leading-relaxed font-normal">
              Accredited Medical Continuing Professional Development (CPD), Practical Skills Training, and Clinical Learning Platform for healthcare professionals across Africa.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck size={14} /> Accredited &amp; Verifiable CPD
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest pamoja-text-main font-['Outfit']">
              Clinical Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-cyan-600 transition-colors flex items-center gap-1.5">
                  Accredited Course Catalog
                </Link>
              </li>
              <li>
                <Link href="/labs" className="hover:text-cyan-600 transition-colors flex items-center gap-1.5">
                  Practical Skills &amp; Simulation Centers
                </Link>
              </li>
              <li>
                <Link href="/practitioners" className="hover:text-cyan-600 transition-colors flex items-center gap-1.5 font-bold pamoja-text-main">
                  Practitioner Directory
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-cyan-600 transition-colors flex items-center gap-1.5">
                  Educator Course Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Medical Boards & Statutory Reporting */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest pamoja-text-main font-['Outfit']">
              Medical Board Councils
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="flex items-center justify-between pamoja-text-muted">
                <span>UMDPC (Uganda)</span>
                <span className="text-[10px] text-cyan-600 font-mono font-bold">2026/0892</span>
              </li>
              <li className="flex items-center justify-between pamoja-text-muted">
                <span>HPCSA (South Africa)</span>
                <span className="text-[10px] text-cyan-600 font-mono font-bold">MDB015/042</span>
              </li>
              <li className="flex items-center justify-between pamoja-text-muted">
                <span>KMPDC (Kenya)</span>
                <span className="text-[10px] text-cyan-600 font-mono font-bold">CPD/2026</span>
              </li>
              <li className="flex items-center justify-between pamoja-text-muted">
                <span>WHO AFRO Guidelines</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Standard</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & FinTech Rails */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest pamoja-text-main font-['Outfit']">
              Scholarships &amp; Payments
            </h4>
            <p className="text-xs pamoja-text-muted leading-relaxed font-normal">
              Supporting M-Pesa, MTN MoMo, Airtel Money, Card Payments, and Institutional Scholarship Vouchers for health workers.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded pamoja-subcard border pamoja-divider pamoja-text-main font-semibold">M-Pesa</span>
              <span className="text-[10px] px-2 py-0.5 rounded pamoja-subcard border pamoja-divider pamoja-text-main font-semibold">MTN MoMo</span>
              <span className="text-[10px] px-2 py-0.5 rounded pamoja-subcard border pamoja-divider pamoja-text-main font-semibold">Card</span>
              <span className="text-[10px] px-2 py-0.5 rounded pamoja-subcard border pamoja-divider pamoja-text-main font-semibold">Grant Vouchers</span>
            </div>
          </div>
        </div>

        {/* Sub-Footer Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium pamoja-text-muted">
          <div>
            &copy; {new Date().getFullYear()} Pamoja Clinical Platform. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/practitioners" className="hover:text-cyan-600 font-semibold flex items-center gap-1.5">
              <Globe size={14} className="text-cyan-600" /> Practitioner Directory
            </Link>
            <Link href="/verify" className="hover:text-emerald-600 font-semibold flex items-center gap-1.5">
              <Lock size={14} className="text-emerald-600" /> Verify Certificate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
