"use client";

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CreditCard,
  Ticket,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  Globe
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useRealtimePlatformData } from '../lib/realtimeStore';

export default function CheckoutModal({
  isOpen,
  onClose,
  item = {
    id: 'course-emotive-pph',
    title: 'National EMOTIVE & Helping Mothers Survive PPH Refresher',
    priceUSD: 49.0,
    cpdPoints: 15,
    type: 'Course Enrollment'
  },
  defaultRail = 'voucher',
  onSuccess
}) {
  const { user, profile, updateProfileState, showToast } = useAuth();
  const { vouchers, upsertTransaction } = useRealtimePlatformData();

  // Payment Options: 'voucher', 'momo', 'card'
  const [selectedRail, setSelectedRail] = useState(defaultRail || 'voucher');

  // Mobile Money State
  const [momoProvider, setMomoProvider] = useState('mtn');
  const [momoPhone, setMomoPhone] = useState('+256 772 123 456');
  const [momoStep, setMomoStep] = useState('input');

  // Card State
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    exp: '12/28',
    cvc: '123',
    name: profile?.name || 'Dr. Practitioner'
  });
  const [isProcessingCard, setIsProcessingCard] = useState(false);

  // Scholarship & Voucher State
  const [voucherCode, setVoucherCode] = useState('PAMOJA2026');
  const [voucherValidation, setVoucherValidation] = useState(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [facilityRegion, setFacilityRegion] = useState(profile?.region || 'East Africa');
  const [facilityTier, setFacilityTier] = useState(profile?.facilityTier || 'HC III / IV');

  if (!isOpen) return null;

  const recordEnrollmentAndTransaction = async (railInfo) => {
    await upsertTransaction({
      id: `tx-${Date.now()}`,
      userEmail: user?.email || 'practitioner@pamoja.com',
      userName: profile?.name || 'Enrolled Clinician',
      itemTitle: item.title,
      courseId: item.id,
      amount: railInfo.amountPaid ?? item.priceUSD,
      rail: railInfo.rail,
      timestamp: new Date().toISOString()
    });

    if (updateProfileState && profile) {
      const currentEnrolled = Array.isArray(profile.enrolledCourses)
        ? profile.enrolledCourses
        : [];
      const currentPurchased = Array.isArray(profile.purchasedCourses)
        ? profile.purchasedCourses
        : [];
      const itemKey = item.id || item.title;
      const nextCourses = Array.from(new Set([...currentEnrolled, ...currentPurchased, itemKey]));
      await updateProfileState({
        enrolledCourses: nextCourses,
        purchasedCourses: nextCourses
      });
    }
    if (showToast) {
      showToast(`Full access unlocked for "${item.title}"!`, 'success');
    }
  };

  // -------------------------------------------------------------
  // Mobile Money Payment
  // -------------------------------------------------------------
  const handleTriggerMomo = () => {
    setMomoStep('stk_push');
    setTimeout(async () => {
      setMomoStep('success');
      await recordEnrollmentAndTransaction({
        rail: `momo_${momoProvider}`,
        amountPaid: item.priceUSD
      });
      setTimeout(() => {
        if (onSuccess) onSuccess({ rail: 'momo', provider: momoProvider, phone: momoPhone });
        onClose();
      }, 1100);
    }, 1800);
  };

  // -------------------------------------------------------------
  // Card Payment
  // -------------------------------------------------------------
  const handleProcessCard = () => {
    setIsProcessingCard(true);
    setTimeout(async () => {
      setIsProcessingCard(false);
      await recordEnrollmentAndTransaction({
        rail: 'card',
        amountPaid: item.priceUSD
      });
      if (onSuccess) onSuccess({ rail: 'card', last4: '4242' });
      onClose();
    }, 1200);
  };

  // -------------------------------------------------------------
  // Scholarship & Voucher Verification
  // -------------------------------------------------------------
  const handleValidateVoucher = (overrideCode = null) => {
    const code = (typeof overrideCode === 'string' ? overrideCode : voucherCode).trim().toUpperCase();
    if (typeof overrideCode === 'string') setVoucherCode(code);
    setIsValidatingVoucher(true);
    setVoucherValidation(null);

    setTimeout(() => {
      const matchedDbVoucher = vouchers.find((v) => v.code?.toUpperCase() === code);

      if (matchedDbVoucher && (matchedDbVoucher.status === 'Revoked' || matchedDbVoucher.active === false)) {
        setVoucherValidation({
          status: 'rejected',
          message: `Voucher ${code} has been revoked by an administrator and can no longer be used.`
        });
        setIsValidatingVoucher(false);
        return;
      }

      if (
        matchedDbVoucher ||
        code.startsWith('PMJ-') ||
        code === 'PAMOJA2026' ||
        code === 'FREE100' ||
        code.startsWith('MOH-') ||
        code.startsWith('UNFPA-')
      ) {
        const discount = matchedDbVoucher?.discountPercent || 100;
        const sponsor =
          matchedDbVoucher?.grantName ||
          matchedDbVoucher?.sponsor ||
          (code.startsWith('PMJ-UG-WNL')
            ? 'UNFPA & MoH Rural Maternal Survival Grant'
            : code === 'PAMOJA2026' || code === 'FREE100'
            ? 'Pamoja Early Adopter & Faculty Launch Scholarship'
            : 'WHO AFRO & Pamoja Continental Clinical Fellowship');

        setVoucherValidation({
          status: 'valid',
          grantName: sponsor,
          discountPercent: discount,
          remainingQuota: matchedDbVoucher
            ? (matchedDbVoucher.maxUses || 1000) - (matchedDbVoucher.usedCount || 0)
            : 950,
          message: `Approved (${discount}% Tuition Covered): Verified for ${facilityTier} practitioner in ${facilityRegion}. Full access to all modules and study materials is ready immediately.`
        });
      } else {
        setVoucherValidation({
          status: 'rejected',
          message:
            'We could not find that voucher code. Try PAMOJA2026, FREE100, PMJ-GLOBAL-100, or PMJ-UG-WNL-9K4X-77B2.'
        });
      }
      setIsValidatingVoucher(false);
    }, 350);
  };

  const handleApplyVoucher = async () => {
    if (voucherValidation?.status === 'valid') {
      await recordEnrollmentAndTransaction({
        rail: 'smart_voucher',
        amountPaid: 0
      });
      if (onSuccess) {
        onSuccess({
          rail: 'smart_voucher',
          code: voucherCode,
          grant: voucherValidation.grantName
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-xl w-full p-6 sm:p-8 text-slate-800 dark:text-white shadow-2xl space-y-6 relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-[10px] font-black uppercase tracking-wider mb-2">
              <ShieldCheck size={13} className="text-cyan-600 dark:text-cyan-400" /> Course Enrollment &amp; Scholarship Voucher
            </div>
            <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
              Complete Your Course Enrollment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-sm">
              {item.title} &bull; <strong className="text-cyan-700 dark:text-cyan-400">{item.cpdPoints} CPD Points</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Pricing Summary Card */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Course Fee</div>
            <div className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
              {voucherValidation?.status === 'valid' ? (
                <span className="flex items-center gap-2">
                  <span className="line-through text-slate-400 dark:text-slate-500 text-base font-normal">
                    ${item.priceUSD}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">$0.00</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    100% Sponsored
                  </span>
                </span>
              ) : (
                `$${Number(item.priceUSD || 49).toFixed(2)} USD`
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Course Access
            </span>
            <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">Instant Full Course Access</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'voucher', label: 'Redeem Voucher', icon: Ticket, subtitle: 'Scholarship / Grant' },
            { id: 'momo', label: 'Mobile Money', icon: Smartphone, subtitle: 'M-Pesa / MoMo' },
            { id: 'card', label: 'Card Payment', icon: CreditCard, subtitle: 'Visa / Mastercard' }
          ].map((rail) => {
            const Icon = rail.icon;
            const isSelected = selectedRail === rail.id;
            return (
              <button
                key={rail.id}
                onClick={() => setSelectedRail(rail.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-50 dark:bg-slate-950 border-cyan-500 text-cyan-950 dark:text-white shadow-xs dark:shadow-lg'
                    : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={18} className={isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'} />
                <div className="text-xs font-bold mt-2">{rail.label}</div>
                <div className="text-[10px] text-slate-500">{rail.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* OPTION 1: MOBILE MONEY */}
        {selectedRail === 'momo' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-2">
              {[
                { id: 'mtn', label: 'MTN MoMo', country: 'UG / RW / GH' },
                { id: 'mpesa', label: 'M-Pesa', country: 'KE / TZ' },
                { id: 'airtel', label: 'Airtel Money', country: 'Pan-Africa' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setMomoProvider(p.id)}
                  className={`flex-1 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    momoProvider === p.id
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs">{p.label}</div>
                  <div className="text-[9px] text-slate-500">{p.country}</div>
                </button>
              ))}
            </div>

            {momoStep === 'input' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Mobile Money Phone Number
                  </label>
                  <input
                    type="tel"
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    placeholder="+256 772 000 000"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 font-mono"
                  />
                </div>
                <button
                  onClick={handleTriggerMomo}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall size={16} /> Send Payment Prompt to Phone
                </button>
              </div>
            )}

            {momoStep === 'stk_push' && (
              <div className="bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-6 text-center space-y-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Smartphone size={24} className="animate-bounce" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Prompt Sent to {momoPhone}!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Approve the Mobile Money prompt on your phone to finish enrolling.
                </p>
              </div>
            )}

            {momoStep === 'success' && (
              <div className="bg-emerald-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-6 text-center space-y-2 animate-fade-in">
                <CheckCircle size={36} className="text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mobile Money Payment Confirmed!</h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Your enrollment is complete and all course modules are now unlocked.
                </p>
              </div>
            )}
          </div>
        )}

        {/* OPTION 2: CARD PAYMENT */}
        {selectedRail === 'card' && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Card Number
              </label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Expiry
                </label>
                <input
                  type="text"
                  value={cardDetails.exp}
                  onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  CVC
                </label>
                <input
                  type="text"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleProcessCard}
              disabled={isProcessingCard}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessingCard ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Confirming Card...
                </>
              ) : (
                <>
                  <CreditCard size={16} /> Pay ${Number(item.priceUSD || 49).toFixed(2)} via Card
                </>
              )}
            </button>
          </div>
        )}

        {/* OPTION 3: SCHOLARSHIP & VOUCHER REDEMPTION */}
        {selectedRail === 'voucher' && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Scholarship or Partner Voucher Code</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">Instant Unlock</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="PMJ-GLOBAL-100 or PAMOJA2026"
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 font-mono uppercase"
                />
                <button
                  onClick={() => handleValidateVoucher()}
                  disabled={isValidatingVoucher}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  {isValidatingVoucher ? 'Checking...' : 'Apply Code'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['PAMOJA2026', 'FREE100', 'PMJ-GLOBAL-100', 'PMJ-UG-WNL-9K4X-77B2'].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => handleValidateVoucher(sample)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 hover:border-cyan-400 dark:hover:border-cyan-700 cursor-pointer"
                  >
                    Use Code: {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Globe size={11} className="text-cyan-600 dark:text-cyan-400" /> Your Health Facility Details (Optional — Helps Sponsor Reporting):
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[9px] text-slate-500 block">Region / Area</span>
                  <input
                    type="text"
                    value={facilityRegion}
                    onChange={(e) => setFacilityRegion(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded p-1.5 text-[11px] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Facility Type</span>
                  <select
                    value={facilityTier}
                    onChange={(e) => setFacilityTier(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded p-1.5 text-[11px] text-slate-900 dark:text-white"
                  >
                    <option value="HC III / IV">Health Centre III / IV</option>
                    <option value="District / Regional Hospital">District / Regional Hospital</option>
                    <option value="National Referral / University">National Referral / University</option>
                    <option value="Private / NGO Clinic">Private / NGO Clinic</option>
                  </select>
                </div>
              </div>
            </div>

            {voucherValidation && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                  voucherValidation.status === 'valid'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {voucherValidation.status === 'valid' ? (
                    <>
                      <CheckCircle size={15} className="text-emerald-600 dark:text-emerald-400" />
                      {voucherValidation.grantName}
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={15} className="text-rose-600 dark:text-rose-400" />
                      Voucher Code Notice
                    </>
                  )}
                </div>
                <p className="opacity-95">{voucherValidation.message}</p>
              </div>
            )}

            {voucherValidation?.status === 'valid' && (
              <button
                onClick={handleApplyVoucher}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle size={16} /> Start Learning with Scholarship Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
