"use client";

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { SEED_COURSES, getCourseFormatBadge } from '../../../lib/seedCourses';
import { useRealtimePlatformData } from '../../../lib/realtimeStore';
import {
  CREDENTIAL_TIERS,
  evaluateCourseMilestoneEligibility,
  mintSignedCertificate
} from '../../../lib/certificateCrypto';
import StandardizedVideoPlayer from '../../../components/StandardizedVideoPlayer';
import CheckoutModal from '../../../components/CheckoutModal';
import VerifiableCertificateModal from '../../../components/VerifiableCertificateModal';
import ActionSequencer from '../../../components/simulations/ActionSequencer';
import SbarHandover from '../../../components/simulations/SbarHandover';
import WebArPocketManikin from '../../../components/simulations/WebArPocketManikin';
import RemedialCoachingModal from '../../../components/simulations/RemedialCoachingModal';

import {
  PlayCircle,
  CheckCircle,
  Award,
  FileText,
  ArrowLeft,
  Shield,
  AlertTriangle,
  Activity,
  Sparkles,
  Layers,
  Mic,
  Box,
  Brain,
  Sliders,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Building,
  Send,
  MessageCircle,
  Ticket,
  Lock,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

// Clean medical formatting helper (parses **bold**, headings, and bullets without raw syntax)
function renderFormattedContent(content) {
  if (!content) return null;
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lIdx} className="h-1" />;

        if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <div key={lIdx} className="font-bold text-slate-900 dark:text-white pt-1 text-xs sm:text-sm font-['Outfit']">
              {headerText}
            </div>
          );
        }

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : trimmed;

        const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);
        const formattedParts = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-1 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
              <span className="text-cyan-600 dark:text-cyan-400 font-black shrink-0">&bull;</span>
              <span>{formattedParts}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const numParts = numMatch[2].split(/(\*\*[^*]+\*\*)/g).map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-1 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-cyan-700 dark:text-cyan-400 shrink-0">{numMatch[1]}.</span>
              <span>{numParts}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
            {formattedParts}
          </p>
        );
      })}
    </div>
  );
}

export default function CoursePage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const { user, profile, loginWithGoogle, updateProfileState, isSuperuser, isCreator, showToast } = useAuth();
  const {
    courses,
    questions,
    vouchers,
    certificates,
    upsertQuestion,
    upsertEscrowLearner,
    upsertTransaction,
    upsertCertificate
  } = useRealtimePlatformData();

  // Course & Navigation State
  const [selectedModIdx, setSelectedModIdx] = useState(0);
  const [selectedTopIdx, setSelectedTopIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum', 'simulation', 'quiz', 'drpam'
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [inlineVoucherInput, setInlineVoucherInput] = useState('PAMOJA2026');
  const [inlineVoucherNotice, setInlineVoucherNotice] = useState(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [mintedCourseCert, setMintedCourseCert] = useState(null);
  const [recurringCompletedList, setRecurringCompletedList] = useState([]);

  // Resource-Stratified Clinical Protocol Toggle ('gold' | 'rural')
  const [resourceTier, setResourceTier] = useState('gold');

  // Gamified Quizzes & Option-Specific Conditional Feedback
  const [quizState, setQuizState] = useState({});
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [isLocallyUnlocked, setIsLocallyUnlocked] = useState(false);

  // Interactive Simulation Block
  const [selectedEngine, setSelectedEngine] = useState('engineA');
  const [simScores, setSimScores] = useState({ engineA: null, engineB: null, engineD: null });

  // Pre-Test vs Post-Test Regression Guardrail
  const [preTestScore, setPreTestScore] = useState(null);
  const [postTestScore, setPostTestScore] = useState(null);
  const [isPreTestModalOpen, setIsPreTestModalOpen] = useState(false);
  const [isPostTestModalOpen, setIsPostTestModalOpen] = useState(false);
  const [isRemedialModalOpen, setIsRemedialModalOpen] = useState(false);
  const [isRegressed, setIsRegressed] = useState(false);
  const [preTestAnswers, setPreTestAnswers] = useState({});
  const [postTestAnswers, setPostTestAnswers] = useState({});
  const [theoryEscrowDisbursed, setTheoryEscrowDisbursed] = useState(false);

  // Dr. Pam Clinical Intelligence Q&A (Real Gemini + Curriculum RAG)
  const [drPamQuery, setDrPamQuery] = useState('');
  const [drPamMessages, setDrPamMessages] = useState([
    {
      sender: 'pam',
      text: 'Welcome! I am Dr. Pam Clinical Intelligence (Pamoja-MedLM), grounded strictly in this professor-authored curriculum and WHO AFRO / MoH clinical guidelines. Ask me any question about dosages, emergency steps, or rural HC III/IV adaptations.'
    }
  ]);
  const [isPamThinking, setIsPamThinking] = useState(false);

  // Direct Question to Course Professor (Real-Time Q&A Desk Sync)
  const [profQuestionInput, setProfQuestionInput] = useState('');
  const [profQuestionSubmitted, setProfQuestionSubmitted] = useState(false);

  // Resolve active course from real-time store or seed fallback
  const course =
    courses.find((c) => c.id === id) ||
    SEED_COURSES.find((c) => c.id === id) ||
    courses[0] ||
    SEED_COURSES[0];

  // Hydrate completed topics from profile if available
  useEffect(() => {
    const saved = profile?.courseProgress?.[id]?.completedTopics;
    if (Array.isArray(saved)) {
      setCompletedTopics(new Set(saved));
    }
  }, [id, profile?.courseProgress]);

  // Clean up auto-advance countdown on topic change
  useEffect(() => {
    if (autoAdvanceTimer) {
      clearInterval(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    setCountdownSeconds(3);
    setQuizState({});
  }, [selectedModIdx, selectedTopIdx]);

  useEffect(() => {
    if (typeof window === 'undefined' || !course?.id) return;
    try {
      const raw = window.localStorage.getItem('pamoja_active_profile_v11');
      if (raw) {
        const parsed = JSON.parse(raw);
        const enrolled = Array.isArray(parsed?.enrolledCourses) ? parsed.enrolledCourses : [];
        const purchased = Array.isArray(parsed?.purchasedCourses) ? parsed.purchasedCourses : [];
        if (enrolled.includes(course.id) || purchased.includes(course.id)) {
          setIsLocallyUnlocked(true);
        }
      }
    } catch { }
  }, [course?.id]);

  const unlockCourseWithVoucherOrPayment = useCallback(async (label = 'Voucher Redeemed', codeUsed = 'PAMOJA2026') => {
    if (!course) return;
    const count = course.modules?.length || 1;
    const nextCourses = Array.from(
      new Set([...(profile?.purchasedCourses || []), ...(profile?.enrolledCourses || []), course.id])
    );
    if (updateProfileState) {
      await updateProfileState({
        purchasedCourses: nextCourses,
        enrolledCourses: nextCourses
      });
    }
    await upsertTransaction({
      id: `tx_course_${Date.now()}`,
      userUid: profile?.id || user?.uid || 'learner',
      userName: profile?.name || 'Clinician',
      courseId: course.id,
      itemTitle: course.title,
      amount: 0,
      rail: 'smart_voucher',
      voucherCode: codeUsed,
      timestamp: new Date().toISOString()
    });
    const msg = `${label}! All ${count} ${count === 1 ? 'Module' : 'Modules'} of "${course.title}" are now unlocked.`;
    setInlineVoucherNotice({ type: 'success', text: msg });
    if (showToast) showToast(msg, 'success');
  }, [course, profile, updateProfileState, upsertTransaction, showToast]);

  // Path 3: URL Auto-Redeem (?voucher=CODE) on Course Page
  useEffect(() => {
    if (typeof window === 'undefined' || !course?.id) return;
    const params = new URLSearchParams(window.location.search);
    const urlVoucher = params.get('voucher');
    if (urlVoucher) {
      const clean = urlVoucher.trim().toUpperCase();
      const found = (vouchers || []).find((v) => v.code?.toUpperCase() === clean);
      if (found && (found.status === 'Revoked' || found.active === false)) {
        if (showToast) {
          showToast(`Voucher ${clean} has been revoked and cannot be redeemed.`, 'error');
        }
        return;
      }
      if (
        clean === 'PAMOJA2026' ||
        clean === 'FREE100' ||
        clean.startsWith('PMJ-') ||
        clean.startsWith('MOH-') ||
        clean.startsWith('UNFPA-')
      ) {
        unlockCourseWithVoucherOrPayment(`URL Scholarship Voucher (${clean}) Applied`, clean);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [course?.id, vouchers, unlockCourseWithVoucherOrPayment, showToast]);

  if (!course) {
    return (
      <div className="min-h-screen pamoja-shell flex flex-col items-center justify-center text-slate-800 dark:text-white p-6">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading clinical curriculum &amp; simulations...</p>
      </div>
    );
  }

  const currentModule = course.modules?.[selectedModIdx] || course.modules?.[0];
  const currentTopic = currentModule?.topics?.[selectedTopIdx] || currentModule?.topics?.[0];
  const currentQuiz = currentModule?.quiz || [];
  const modCount = course.modules?.length || 1;
  const formatBadge = getCourseFormatBadge(modCount);

  // Freemium & Student Voucher Unlock Logic
  const freeModLimit = Number(course.freePreviewModules || 1);
  const isCourseUnlocked =
    isLocallyUnlocked ||
    course.pricingModel === 'free' ||
    isSuperuser ||
    isCreator ||
    (profile?.purchasedCourses || []).includes(course.id) ||
    (profile?.enrolledCourses || []).includes(course.id);

  const isCurrentModuleLocked =
    !isCourseUnlocked &&
    (course.pricingModel === 'premium' ||
      (course.pricingModel === 'freemium' && selectedModIdx >= freeModLimit));

  const handleInlineVoucherSubmit = async (e) => {
    e.preventDefault();
    const code = (inlineVoucherInput || '').trim().toUpperCase();
    const foundVoucher = (vouchers || []).find((v) => v.code?.toUpperCase() === code);
    if (foundVoucher && (foundVoucher.status === 'Revoked' || foundVoucher.active === false)) {
      const revokedMsg = `Voucher ${code} has been revoked by an administrator and can no longer be redeemed.`;
      setInlineVoucherNotice({ type: 'error', text: revokedMsg });
      if (showToast) showToast(revokedMsg, 'error');
      return;
    }

    const matchedVoucher = Boolean(
      foundVoucher && foundVoucher.status !== 'Revoked' && foundVoucher.active !== false
    );
    if (
      code === 'PAMOJA2026' ||
      code === 'FREE100' ||
      code.startsWith('PMJ-') ||
      code.startsWith('MOH-') ||
      code.startsWith('UNFPA-') ||
      matchedVoucher
    ) {
      await unlockCourseWithVoucherOrPayment(`Scholarship Voucher (${code}) Applied`, code);
    } else {
      const errMsg = 'Invalid voucher code. Try PAMOJA2026, FREE100, or PMJ-UG-WNL-9K4X-77B2.';
      setInlineVoucherNotice({ type: 'error', text: errMsg });
      if (showToast) showToast(errMsg, 'error');
    }
  };

  // Calculate total sub-topics in course for real-time progress tracking
  const totalCourseTopics =
    course.modules?.reduce((acc, m) => acc + (m.topics?.length || 1), 0) || 1;

  const persistTopicCompletion = (newCompletedSet) => {
    const completedArr = Array.from(newCompletedSet);
    const percent = Math.min(100, Math.round((completedArr.length / totalCourseTopics) * 100));
    if (updateProfileState && profile) {
      const existingProgress = profile.courseProgress || {};
      updateProfileState({
        courseProgress: {
          ...existingProgress,
          [course.id]: {
            completedTopics: completedArr,
            percent,
            lastModuleIdx: selectedModIdx,
            lastTopicIdx: selectedTopIdx,
            updatedAt: new Date().toISOString()
          }
        }
      });
    }
  };

  // -------------------------------------------------------------
  // Requirement 1: Handle Sub-Topic Quiz Option Selection & Countdown
  // -------------------------------------------------------------
  const handleSelectQuizOption = (qIdx, optIdx) => {
    const updated = { ...quizState, [qIdx]: optIdx };
    setQuizState(updated);

    const allAnswered =
      currentQuiz.length > 0 &&
      currentQuiz.every((q, idx) => {
        const selected = updated[idx];
        return selected !== undefined && Number(selected) === Number(q.correctIndex);
      });

    if (allAnswered) {
      const topicKey = `${selectedModIdx}-${selectedTopIdx}`;
      const nextSet = new Set(completedTopics);
      nextSet.add(topicKey);
      setCompletedTopics(nextSet);
      persistTopicCompletion(nextSet);

      setCountdownSeconds(3);
      if (autoAdvanceTimer) clearInterval(autoAdvanceTimer);

      let timeLeft = 3;
      const interval = setInterval(() => {
        timeLeft -= 1;
        setCountdownSeconds(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(interval);
          setAutoAdvanceTimer(null);
          advanceToNextTopic();
        }
      }, 1000);

      setAutoAdvanceTimer(interval);
    }
  };

  const advanceToNextTopic = () => {
    if (autoAdvanceTimer) {
      clearInterval(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    if (!currentModule?.topics) return;

    if (selectedTopIdx < currentModule.topics.length - 1) {
      setSelectedTopIdx((prev) => prev + 1);
    } else if (selectedModIdx < (course.modules?.length || 0) - 1) {
      setSelectedModIdx((prev) => prev + 1);
      setSelectedTopIdx(0);
    }
  };

  // -------------------------------------------------------------
  // Requirement 4: Pre-Test & Post-Test Regression Guardrail Logic
  // -------------------------------------------------------------
  const handlePreTestSubmit = () => {
    let score = 0;
    if (preTestAnswers['q1'] === 1) score += 33.3;
    if (preTestAnswers['q2'] === 0) score += 33.3;
    if (preTestAnswers['q3'] === 1) score += 33.4;
    const finalPreScore = Math.round(score);
    setPreTestScore(finalPreScore);
    setIsPreTestModalOpen(false);
  };

  const milestoneEligibility = evaluateCourseMilestoneEligibility({
    course,
    completedTopicsSet: completedTopics,
    preTestScore,
    postTestScore,
    isRegressed,
    oscePassed: false,
    recurringCompletedCount: recurringCompletedList.length
  });

  // Find any existing certificate already issued for this course
  const existingCourseCertificate =
    mintedCourseCert ||
    certificates.find(
      (c) =>
        (c.courseId === course.id || c.courseTitle === course.title) &&
        (!profile?.name ||
          c.learnerName?.toLowerCase() === profile.name.toLowerCase() ||
          c.id === 'cert_88291a')
    );

  const registerTheoryEscrowPass = async (finalScore) => {
    setIsRegressed(false);
    setTheoryEscrowDisbursed(true);
    const cpdAward = Number(course.cpd || 15);

    if (updateProfileState && profile) {
      if (course.requiresLab) {
        updateProfileState({
          pendingPoints: (profile.pendingPoints || 0) + cpdAward
        });
      } else {
        updateProfileState({
          cpdPoints: (profile.cpdPoints || 0) + cpdAward
        });
      }
    }

    if (course.requiresLab) {
      await upsertEscrowLearner({
        id: `escrow-${user?.uid || 'learner'}-${course.id}`,
        name: profile?.name || user?.displayName || 'Enrolled Practitioner',
        authorityId: profile?.authorityId || profile?.licenseNumber || 'UMDPC-14892',
        facility: profile?.facility || 'Regional Health Facility',
        courseId: course.id,
        courseTitle: course.title,
        pendingPoints: cpdAward,
        preTestScore: preTestScore || 75,
        postTestScore: finalScore,
        status: 'THEORY_ESCROW'
      });
    }

    // Mint personalized cryptographic credential (Milestone 1 if requiresLab, or Full Certificate if theory-only)
    const tier =
      recurringCompletedList.length > 0
        ? CREDENTIAL_TIERS.RECURRING_SUSTAINED
        : course.requiresLab
          ? CREDENTIAL_TIERS.THEORY_MILESTONE
          : CREDENTIAL_TIERS.FULL_CERTIFICATE;

    const tierLabel =
      recurringCompletedList.length > 0
        ? 'Milestone + Recurring LDHF Sustained Credential'
        : course.requiresLab
          ? 'Milestone 1: Theory Mastery & OSCE Admission Credential'
          : 'Full Statutory Accredited CPD Certificate';

    const signedCert = await mintSignedCertificate({
      existingCertId: existingCourseCertificate?.id || `cert-${course.id}-${user?.uid || 'prac'}`,
      learnerProfile: {
        uid: user?.uid || 'usr-practitioner',
        title: profile?.title || 'Dr.',
        name: profile?.name || user?.displayName || 'Sarah Nabatanzi',
        authorityId: profile?.authorityId || profile?.licenseNumber || 'UMDPC-14892',
        facility: profile?.facility || 'Kawaala Health Centre IV'
      },
      course,
      credentialTier: tier,
      tierLabel,
      preTestScore: preTestScore || 75,
      postTestScore: finalScore,
      osceScore: course.requiresLab ? null : finalScore,
      completedModulesCount: Math.max(
        1,
        milestoneEligibility.completedModulesCount || course.modules?.length || 1
      ),
      totalModulesCount: course.modules?.length || 1,
      recurringRefresherModules: recurringCompletedList,
      sustainmentCpdBonus: Number((recurringCompletedList.length * 0.5).toFixed(1))
    });

    await upsertCertificate(signedCert);
    setMintedCourseCert(signedCert);
    if (showToast) {
      showToast(
        `Cryptographic ${tierLabel} minted (${signedCert.sha256Hash.slice(0, 16)}...)!`,
        'success'
      );
    }
  };

  // Complete a Recurring Post-Course Follow-Up Refresher Micro-Module (+0.5 Sustainment CPD)
  const handleCompleteRecurringFollowUp = async (followUpTitle) => {
    if (!milestoneEligibility.canMint && !existingCourseCertificate) {
      if (showToast) {
        showToast(
          'Complete the core curriculum milestone and Post-Test (>= 80%) first before logging post-course follow-up refreshers.',
          'error'
        );
      }
      return;
    }

    if (recurringCompletedList.includes(followUpTitle)) return;
    const updatedList = [...recurringCompletedList, followUpTitle];
    setRecurringCompletedList(updatedList);

    const bonusPts = Number((updatedList.length * 0.5).toFixed(1));
    if (updateProfileState && profile) {
      updateProfileState({
        cpdPoints: Number(((profile.cpdPoints || 0) + 0.5).toFixed(1))
      });
    }

    const baseCert = existingCourseCertificate || {};
    const updatedCert = await mintSignedCertificate({
      existingCertId: baseCert.id || `cert-${course.id}-${user?.uid || 'prac'}`,
      learnerProfile: {
        uid: user?.uid || 'usr-practitioner',
        title: profile?.title || 'Dr.',
        name: profile?.name || user?.displayName || baseCert.learnerName || 'Sarah Nabatanzi',
        authorityId:
          profile?.authorityId || profile?.licenseNumber || baseCert.authorityId || 'UMDPC-14892',
        facility: profile?.facility || baseCert.facility || 'Kawaala Health Centre IV'
      },
      course,
      credentialTier: CREDENTIAL_TIERS.RECURRING_SUSTAINED,
      tierLabel: 'Full Accredited CPD Certificate + Recurring LDHF Sustainment',
      preTestScore: preTestScore || 75,
      postTestScore: postTestScore || 92,
      osceScore: baseCert.osceScore ? parseInt(baseCert.osceScore, 10) : null,
      completedModulesCount: course.modules?.length || 1,
      totalModulesCount: course.modules?.length || 1,
      recurringRefresherModules: updatedList,
      sustainmentCpdBonus: bonusPts,
      convenerSignOff: baseCert.convenerSignOff
    });

    await upsertCertificate(updatedCert);
    setMintedCourseCert(updatedCert);
    if (showToast) {
      showToast(
        `Recurring Follow-Up Completed! +0.5 Sustainment CPD added & Certificate re-signed (${updatedCert.checksum}).`,
        'success'
      );
    }
  };

  const handlePostTestSubmit = async () => {
    let score = 0;
    if (postTestAnswers['q1'] === 1) score += 33.3;
    if (postTestAnswers['q2'] === 0) score += 33.3;
    if (postTestAnswers['q3'] === 1) score += 33.4;
    const finalPostScore = Math.round(score);
    setPostTestScore(finalPostScore);
    setIsPostTestModalOpen(false);

    const baseline = preTestScore !== null ? preTestScore : 75;
    if (finalPostScore < baseline || finalPostScore < 80) {
      setIsRegressed(true);
      setIsRemedialModalOpen(true);
      setTheoryEscrowDisbursed(false);
    } else {
      await registerTheoryEscrowPass(finalPostScore);
    }
  };

  const handleRemedialUnlockPass = async () => {
    setIsRemedialModalOpen(false);
    setPostTestScore(88);
    await registerTheoryEscrowPass(88);
  };

  // -------------------------------------------------------------
  // Real-Time Dr. Pam Clinical Intelligence (Pamoja-MedLM RAG)
  // -------------------------------------------------------------
  const handleDrPamSubmit = async (e) => {
    e.preventDefault();
    if (!drPamQuery.trim() || isPamThinking) return;

    const queryText = drPamQuery.trim();
    const updatedHistory = [...drPamMessages, { sender: 'user', text: queryText }];
    setDrPamMessages(updatedHistory);
    setDrPamQuery('');
    setIsPamThinking(true);

    try {
      const activeContext = {
        title: course.title,
        currentModuleTitle: currentModule?.title,
        currentTopicTitle: currentTopic?.title,
        content: currentTopic?.content || '',
        goldProtocol: currentTopic?.goldProtocol || '',
        ruralProtocol: currentTopic?.ruralProtocol || ''
      };

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat_dr_pam',
          message: queryText,
          courseContext: activeContext,
          history: updatedHistory.slice(-6).map((m) => ({
            sender: m.sender === 'user' ? 'user' : 'pam',
            text: m.text
          }))
        })
      });
      const data = await res.json();
      if (data.enrolledCourse) {
        const targetId = data.enrolledCourse.id;
        const currentEnrolled = Array.isArray(profile?.enrolledCourses) ? profile.enrolledCourses : [];
        const currentPurchased = Array.isArray(profile?.purchasedCourses) ? profile.purchasedCourses : [];
        const nextEnrolled = Array.from(new Set([...currentEnrolled, targetId]));
        const nextPurchased = Array.from(new Set([...currentPurchased, targetId]));
        if (updateProfileState) {
          await updateProfileState({
            enrolledCourses: nextEnrolled,
            purchasedCourses: nextPurchased
          });
        }
        setIsLocallyUnlocked(true);

        if (typeof window !== 'undefined') {
          try {
            const currentRaw = window.localStorage.getItem('pamoja_active_profile_v11');
            const parsed = currentRaw ? JSON.parse(currentRaw) : {};
            const merged = { ...parsed, enrolledCourses: nextEnrolled, purchasedCourses: nextPurchased };
            window.localStorage.setItem('pamoja_active_profile_v11', JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent('pamoja-rt-sync', { detail: { key: 'profile' } }));
            window.dispatchEvent(new Event('storage'));
          } catch (e) { }
        }

        if (showToast) {
          showToast(`Dr. Pam officially enrolled you in "${data.enrolledCourse.title}"! All modules unlocked.`, 'success');
        }
      }

      setDrPamMessages((prev) => [
        ...prev,
        {
          sender: 'pam',
          text:
            data.reply ||
            'Grounded in the active module protocol: verify quantitative diagnostic triggers first, initiate first-line therapy immediately, and adapt to HC III/IV stabilization protocols when tertiary resources are unavailable.',
          enrolledCourse: data.enrolledCourse || null,
          citations: data.citations || data.groundedSources || []
        }
      ]);
    } catch (err) {
      console.error('Dr. Pam error:', err);
      setDrPamMessages((prev) => [
        ...prev,
        {
          sender: 'pam',
          text: 'Please review the active sub-topic protocol above for immediate dosage and resource-stratified execution steps.'
        }
      ]);
    } finally {
      setIsPamThinking(false);
    }
  };

  // Submit Direct Question to Professor Q&A Desk
  const handleAskProfessorSubmit = async (e) => {
    e.preventDefault();
    if (!profQuestionInput.trim()) return;
    await upsertQuestion({
      id: `qa-${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      studentName: profile?.name || user?.displayName || 'Practitioner',
      timestamp: 'Just now',
      question: profQuestionInput.trim(),
      reply: '',
      isResolved: false
    });
    setProfQuestionInput('');
    setProfQuestionSubmitted(true);
    setTimeout(() => setProfQuestionSubmitted(false), 4000);
  };

  // Active video URL resolution (supports topic override, resource video, or module main video)
  const resolvedVideoUrl =
    currentTopic?.videoUrl ||
    currentTopic?.resources?.find(
      (r) => r.type === 'video' || r.type === 'Google Shared Drive Video'
    )?.url ||
    currentModule?.mainVideoUrl ||
    '';

  const courseQuestions = questions.filter(
    (q) => q.courseTitle === course.title || q.courseId === course.id
  );

  return (
    <div className="min-h-screen pamoja-shell font-['Inter'] pb-24">
      {/* Top Breadcrumb & Status Bar */}
      <div className="pamoja-card border-b pamoja-divider sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft size={16} /> Course Catalog
            </Link>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[240px] sm:max-w-md">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {profile && profile.role !== 'guest' ? (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{profile.name}</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-black">{profile.cpdPoints || 0} CPD</span>
                {profile.pendingPoints > 0 && (
                  <span className="text-amber-700 dark:text-amber-400 font-bold ml-1">
                    (+{profile.pendingPoints} Pending Practical)
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-3 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Sign In to Earn CPD
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setCheckoutOpen(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${isCourseUnlocked
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                    : 'bg-cyan-950/80 border-cyan-700 text-cyan-300 hover:bg-cyan-900'
                  }`}
              >
                <Ticket size={13} />
                {isCourseUnlocked ? 'Course Unlocked ✓' : 'Redeem Voucher / Unlock'}
              </button>
              <button
                onClick={() => setIsPreTestModalOpen(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${preTestScore !== null
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500'
                  }`}
              >
                Pre-Test: {preTestScore !== null ? `${preTestScore}%` : 'Take'}
              </button>
              <button
                onClick={() => setIsPostTestModalOpen(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${postTestScore !== null
                    ? isRegressed
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 animate-pulse'
                      : 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-700 text-cyan-800 dark:text-cyan-300'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500'
                  }`}
              >
                Post-Test: {postTestScore !== null ? `${postTestScore}%` : 'Take'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 text-[11px] font-black uppercase tracking-wider">
                  {course.category || 'Maternal Health'}
                </span>
                <span className={`px-3 py-1 rounded-full border text-[11px] font-black ${formatBadge.color}`}>
                  {formatBadge.label}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold flex items-center gap-1.5">
                  <Award size={13} className="text-amber-500" />
                  {course.cpd} Accredited CPD Points
                </span>
                {course.requiresLab && (
                  <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-bold flex items-center gap-1.5">
                    <Building size={13} className="text-purple-500 dark:text-purple-400" />
                    OSCE Lab Required
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {course.description}
              </p>
            </div>

            <div className="flex lg:flex-col items-center sm:items-end justify-between lg:justify-center gap-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 flex-shrink-0">
              <div className="text-left lg:text-right">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  Accreditation
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle size={13} /> {course.activityCode || course.accreditationCode || 'WHO AFRO & MoH Verified'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  Duration &amp; Depth
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {course.duration} Hours ({modCount} {modCount === 1 ? 'Module' : 'Modules'})
                </span>
              </div>
            </div>
          </div>

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Regression Alert Banner */}
      {isRegressed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 animate-fade-in">
          <div className="bg-rose-950/80 border-2 border-rose-500 rounded-[2rem] p-5 sm:p-6 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-900 border border-rose-600 flex items-center justify-center flex-shrink-0 text-rose-300">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h4 className="text-lg font-bold font-['Outfit'] text-rose-200">
                  Quick Review Needed Before Issuing Your Certificate
                </h4>
                <p className="text-xs sm:text-sm text-rose-300/90 mt-1 max-w-2xl leading-relaxed">
                  Your Post-Test score ({postTestScore}%) is below your Pre-Test score ({preTestScore}%) or below the 80% passing score. Complete a short guided review to unlock your CPD points.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRemedialModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 shadow-lg"
            >
              <Brain size={16} /> Open Remedial Coaching
            </button>
          </div>
        </div>
      )}

      {/* Main Learning Stage Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLS: Standardized Video Player, Interactive Protocols, Quizzes & Simulations */}
          <div className="lg:col-span-8 space-y-6">
            {isCurrentModuleLocked ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 sm:p-12 shadow-xl dark:shadow-2xl text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
                  <Ticket size={32} />
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                    Freemium Module {selectedModIdx + 1} of {modCount} &bull; Student Voucher Gate
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
                    You Completed the Free Introductory Module!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Redeem your institutional or launch scholarship voucher below to unlock all{' '}
                    <strong className="text-slate-900 dark:text-white">{modCount} {modCount === 1 ? 'Module' : 'Modules'}</strong> and earn{' '}
                    <strong className="text-slate-900 dark:text-white">{course.cpd} Accredited CPD Points</strong>, or use Mobile Money / Card.
                  </p>
                </div>

                <form
                  onSubmit={handleInlineVoucherSubmit}
                  className="max-w-md mx-auto bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <label className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider block text-left">
                    Instant Student Voucher Redemption
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inlineVoucherInput}
                      onChange={(e) => setInlineVoucherInput(e.target.value)}
                      placeholder="Enter Voucher (e.g. PAMOJA2026)"
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono uppercase outline-none focus:border-cyan-500 placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer shrink-0 shadow-md transition-all"
                    >
                      Redeem Now
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 text-left">
                    <span>1-Click Codes:</span>
                    <button
                      type="button"
                      onClick={() => setInlineVoucherInput('PAMOJA2026')}
                      className="text-emerald-400 font-mono font-bold underline cursor-pointer"
                    >
                      PAMOJA2026
                    </button>
                    <span>&bull;</span>
                    <button
                      type="button"
                      onClick={() => setInlineVoucherInput('PMJ-UG-WNL-9K4X-77B2')}
                      className="text-cyan-400 font-mono font-bold underline cursor-pointer"
                    >
                      PMJ-UG-WNL-9K4X-77B2
                    </button>
                  </div>

                  {inlineVoucherNotice && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-bold text-left ${inlineVoucherNotice.type === 'success'
                          ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-700 text-rose-200'
                        }`}
                    >
                      {inlineVoucherNotice.text}
                    </div>
                  )}
                </form>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedModIdx(0);
                      setSelectedTopIdx(0);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    &larr; Return to Module 1 Free Preview
                  </button>
                  <button
                    onClick={() => setCheckoutOpen(true)}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    Or open Multi-Rail Checkout (M-Pesa / MTN MoMo / Card / Grant Voucher) &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-xl dark:shadow-2xl">
                  <StandardizedVideoPlayer
                    videoUrl={resolvedVideoUrl}
                    title={currentTopic?.title || currentModule?.title}
                    subtitle={`Module ${selectedModIdx + 1}: ${currentModule?.title}`}
                    poster={course.image}
                    startTime={currentTopic?.videoStartTime || 0}
                    endTime={currentTopic?.videoEndTime || 0}
                  />

                  {/* Player Stage Navigation Tabs */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 px-4 pt-2 overflow-x-auto">
                    {[
                      { id: 'curriculum', label: 'Curriculum & Protocols', icon: FileText },
                      { id: 'simulation', label: 'Clinical Simulation Stations (A, B, D)', icon: Activity },
                      { id: 'quiz', label: 'Sub-Topic Gamified Quiz', icon: Award },
                      { id: 'drpam', label: 'Dr. Pam Clinical Intelligence & Faculty Q&A', icon: Sparkles }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${isActive
                              ? 'border-cyan-600 dark:border-cyan-400 text-cyan-700 dark:text-cyan-400 bg-cyan-50/80 dark:bg-cyan-950/30'
                              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                          <Icon size={15} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TAB 1: CURRICULUM & RESOURCE-STRATIFIED CLINICAL PROTOCOL */}
                {activeTab === 'curriculum' && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Resource-Stratified Clinical Protocol Switcher */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-[11px] font-black uppercase tracking-wider mb-1">
                            <Sliders size={13} className="text-cyan-600 dark:text-cyan-400" /> Resource-Stratified Clinical Protocol Switcher
                          </div>
                          <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
                            Standardized Care Adapted to Your Facility Tier
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Switch between Tertiary Gold-Standard care and Rural HC III/IV resource-adapted stabilization protocols.
                          </p>
                        </div>

                        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 flex-shrink-0">
                          <button
                            onClick={() => setResourceTier('gold')}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${resourceTier === 'gold'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                              }`}
                          >
                            <Building size={14} /> Gold-Standard Tertiary
                          </button>
                          <button
                            onClick={() => setResourceTier('rural')}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${resourceTier === 'rural'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                              }`}
                          >
                            <Stethoscope size={14} /> Rural HC III / HC IV
                          </button>
                        </div>
                      </div>

                      {resourceTier === 'gold' ? (
                        <div className="bg-gradient-to-br from-cyan-50/80 to-slate-50 dark:from-cyan-950/40 dark:to-slate-900 border border-cyan-200 dark:border-cyan-800/60 rounded-2xl p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                              <Building size={15} /> Tertiary Hospital Protocol (Full Resources)
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Blood Bank Ready
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Operating Theatre Active
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                TXA &amp; Oxytocin Stocked
                              </span>
                            </div>
                          </div>

                          {currentTopic?.goldProtocol ? (
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                              {currentTopic.goldProtocol}
                            </p>
                          ) : (
                            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              <p>
                                <strong className="text-slate-900 dark:text-white">1. Diagnostic Confirmation:</strong> Utilize calibrated V-shaped blood collection drape. Immediate quantitative confirmation of &ge; 500 mL triggers bundle activation within 60 seconds.
                              </p>
                              <p>
                                <strong className="text-slate-900 dark:text-white">2. Parallel First-Response Bundle:</strong> Initiate continuous bimanual fundal massage; administer Oxytocin 10 IU IM and simultaneously start Tranexamic Acid (TXA) 1g IV over 10 minutes (within 3-hour golden window).
                              </p>
                              <p>
                                <strong className="text-slate-900 dark:text-white">3. Aggressive Fluid &amp; Transfusion:</strong> Dual 16G IV cannulas with warm Ringer&apos;s Lactate. Initiate cross-match and emergency 1:1:1 component therapy (PRBC/FFP/Platelets) if Shock Index &ge; 0.9.
                              </p>
                              <p>
                                <strong className="text-slate-900 dark:text-white">4. Theater Escalation:</strong> Direct transfer to operating theatre for uterine artery embolization, B-Lynch brace suturing, or peripartum hysterectomy if bleeding persists past 20 minutes.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-amber-50/80 to-slate-50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                              <Stethoscope size={15} /> Rural Health Centre III/IV Stabilization Protocol
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                Emergency Condom UBT
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                                NASG Anti-Shock Garment
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                                Manual Aortic Compression
                              </span>
                            </div>
                          </div>

                          {currentTopic?.ruralProtocol || currentTopic?.hc3Adaptation ? (
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                              {currentTopic.ruralProtocol || currentTopic.hc3Adaptation}
                            </p>
                          ) : (
                            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                              <p>
                                <strong>1. Resource-Adapted Quantification:</strong> If pre-packaged calibrated drapes are out of stock, use a clean plastic receiver or gravimetric gauze weighing (1g = 1 mL blood). Never rely on visual guesswork.
                              </p>
                              <p>
                                <strong>2. Immediate First-Line Uterotonics:</strong> Oxytocin 10 IU IM. If cold-chain failure or oxytocin is absent, administer sublingual Misoprostol 800 mcg immediately.
                              </p>
                              <p>
                                <strong>3. Mechanical Tamponade (Condom UBT):</strong> Tie a sterile lubricated condom to a Foley catheter with silk suture; insert into the uterine cavity and inflate with 300–500 mL of sterile saline until bleeding stops.
                              </p>
                              <p>
                                <strong>4. NASG &amp; Transfer Handshake:</strong> Apply Non-Pneumatic Anti-Shock Garment (NASG) starting from ankle segments 1-3 up to abdominal ball segment 6. Maintain continuous External Aortic Compression during ambulance transit and execute SBAR phone escalation to the referral hospital.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Sub-Topic Content Body */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                          Module {selectedModIdx + 1} &bull; Topic {selectedTopIdx + 1}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 text-[10px] font-bold">
                          Competency: {currentTopic?.competencyTag || `ALU-${selectedModIdx + 1}.${selectedTopIdx + 1}`}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white mb-6">
                        {currentTopic?.title}
                      </h2>

                      <div className="prose prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                        {currentTopic?.content?.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx} className="whitespace-pre-line">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Attached Learning Resources */}
                      {currentTopic?.resources && currentTopic.resources.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FileText size={14} className="text-cyan-600 dark:text-cyan-400" /> Attached Clinical Resources &amp; Shared Drive Materials
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentTopic.resources.map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition-all text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                              >
                                <span className="truncate pr-2">{res.title}</span>
                                <ExternalLink size={14} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Banner to Quiz */}
                      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Completed reading this sub-topic? Verify clinical mastery with the option-specific conditional quiz.
                        </p>
                        <button
                          onClick={() => setActiveTab('quiz')}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
                        >
                          Start Sub-Topic Quiz <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CLINICAL SIMULATION STATIONS (Engines A, B, D) */}
                {activeTab === 'simulation' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-4 flex flex-wrap gap-2 shadow-sm">
                      {[
                        { id: 'engineA', label: 'Engine A: 90s Action Sequencer', icon: Activity, tag: 'Physiological Clock' },
                        { id: 'engineB', label: 'Engine B: Voice SBAR Handover Grader', icon: Mic, tag: 'Communication' },
                        { id: 'engineD', label: 'Engine D: 3D WebAR Pocket Manikin', icon: Box, tag: 'Spatial Computing' }
                      ].map((engine) => {
                        const Icon = engine.icon;
                        const isCurrent = selectedEngine === engine.id;
                        const score = simScores[engine.id];
                        return (
                          <button
                            key={engine.id}
                            onClick={() => setSelectedEngine(engine.id)}
                            className={`flex-1 min-w-[200px] flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${isCurrent
                                ? 'bg-slate-950 border-cyan-500 text-white shadow-lg'
                                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon size={18} className={isCurrent ? 'text-cyan-400' : 'text-slate-500'} />
                              <div>
                                <div className="text-xs font-bold">{engine.label}</div>
                                <div className="text-[10px] text-slate-500">{engine.tag}</div>
                              </div>
                            </div>
                            {score !== null && (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-black">
                                {score}%
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedEngine === 'engineA' && (
                      <ActionSequencer
                        onComplete={({ score }) => {
                          setSimScores((prev) => ({ ...prev, engineA: score }));
                        }}
                      />
                    )}

                    {selectedEngine === 'engineB' && (
                      <SbarHandover
                        onComplete={({ totalScore }) => {
                          setSimScores((prev) => ({ ...prev, engineB: totalScore }));
                        }}
                      />
                    )}

                    {selectedEngine === 'engineD' && (
                      <WebArPocketManikin
                        onComplete={(score) => {
                          setSimScores((prev) => ({ ...prev, engineD: score }));
                        }}
                      />
                    )}
                  </div>
                )}

                {/* TAB 3: SUB-TOPIC GAMIFIED QUIZZES WITH OPTION-SPECIFIC FEEDBACK & 3S AUTO-ADVANCE */}
                {activeTab === 'quiz' && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl animate-fade-in space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-[11px] font-black uppercase tracking-wider mb-1">
                          <Award size={13} className="text-cyan-600 dark:text-cyan-400" /> Sub-Topic Gamified Mastery Check
                        </div>
                        <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
                          Instant Feedback &amp; Option Rationale Engine
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Every option reveals its specific clinical rationale. Pass all questions to auto-advance in 3 seconds.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-amber-700 dark:text-amber-400 flex-shrink-0">
                        <Shield size={14} /> Manual Skip Blocked
                      </div>
                    </div>

                    {autoAdvanceTimer !== null && (
                      <div className="bg-gradient-to-r from-emerald-950 to-cyan-950 border-2 border-emerald-500 rounded-2xl p-4 text-white shadow-xl flex items-center justify-between gap-4 animate-bounce">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={24} className="text-emerald-400" />
                          <div>
                            <div className="text-sm font-bold font-['Outfit']">
                              All clinical answers verified!
                            </div>
                            <div className="text-xs text-emerald-300">
                              Auto-advancing to the next sub-topic in <strong>{countdownSeconds} seconds...</strong>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={advanceToNextTopic}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex-shrink-0 shadow-md cursor-pointer"
                        >
                          Advance Now &rarr;
                        </button>
                      </div>
                    )}

                    {currentQuiz.length > 0 ? (
                      currentQuiz.map((q, qIdx) => {
                        const selectedOpt = quizState[qIdx];
                        const isAnswered = selectedOpt !== undefined;
                        const isCorrect = Number(selectedOpt) === Number(q.correctIndex);

                        return (
                          <div
                            key={qIdx}
                            className={`p-5 sm:p-6 rounded-2xl border transition-all ${isAnswered
                                ? isCorrect
                                  ? 'bg-emerald-50/70 dark:bg-slate-950/70 border-emerald-300 dark:border-emerald-800'
                                  : 'bg-rose-50/70 dark:bg-slate-950/70 border-rose-300 dark:border-rose-800'
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                              }`}
                          >
                            <div className="flex items-start gap-3 mb-4">
                              <span className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                {qIdx + 1}
                              </span>
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                                {q.question}
                              </h4>
                            </div>

                            <div className="space-y-2.5">
                              {q.options.map((optionText, optIdx) => {
                                const isThisSelected = selectedOpt === optIdx;
                                const isThisCorrect = optIdx === Number(q.correctIndex);

                                let btnStyle =
                                  'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-cyan-500 dark:hover:border-slate-600';
                                if (isAnswered) {
                                  if (isThisSelected) {
                                    btnStyle = isThisCorrect
                                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs'
                                      : 'bg-rose-600 text-white border-rose-600 font-semibold shadow-xs';
                                  } else if (isThisCorrect) {
                                    btnStyle = 'bg-emerald-50 dark:bg-slate-900 border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold';
                                  } else {
                                    btnStyle =
                                      'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 text-slate-400 opacity-60';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                                  >
                                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="text-xs sm:text-sm leading-relaxed flex-1">
                                      {optionText}
                                    </span>
                                    {isAnswered &&
                                      isThisSelected &&
                                      (isThisCorrect ? (
                                        <CheckCircle
                                          size={16}
                                          className="text-white flex-shrink-0 mt-0.5"
                                        />
                                      ) : (
                                        <XCircle
                                          size={16}
                                          className="text-white flex-shrink-0 mt-0.5"
                                        />
                                      ))}
                                  </button>
                                );
                              })}
                            </div>

                            {isAnswered && (
                              <div
                                className={`mt-4 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed animate-fade-in ${isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200'
                                  }`}
                              >
                                <div className="font-bold flex items-center gap-1.5 mb-1">
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle size={15} className="text-emerald-400" />
                                      Clinical Rationale (Option {String.fromCharCode(65 + selectedOpt)}):
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle size={15} className="text-rose-400" />
                                      Why Option {String.fromCharCode(65 + selectedOpt)} is Clinically Incorrect:
                                    </>
                                  )}
                                </div>
                                <p className="opacity-95">
                                  {q.optionFeedback && q.optionFeedback[selectedOpt]
                                    ? q.optionFeedback[selectedOpt]
                                    : isCorrect
                                      ? q.explanation ||
                                      'Correct! This matches the national clinical treatment protocol.'
                                      : q.explanation
                                        ? `Incorrect. Clinical rationale: ${q.explanation}`
                                        : 'This choice does not follow standard clinical protocol.'}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-8">
                        No micro-quiz attached to this sub-topic. Continue to the next unit.
                      </p>
                    )}
                  </div>
                )}

                {/* TAB 4: DR. PAM CLINICAL INTELLIGENCE & DIRECT PROFESSOR Q&A */}
                {activeTab === 'drpam' && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Dr. Pam Clinical Intelligence Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                            <Sparkles size={20} />
                          </div>
                          <div>
                            <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white">
                              Dr. Pam — Clinical Study Assistant
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Answers based on {course.title} &amp; approved Ministry of Health guidelines
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          &bull; Online &amp; Ready
                        </span>
                      </div>

                      {/* Message Log */}
                      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                        {drPamMessages.map((msg, idx) => (
                          <div key={idx} className="space-y-2">
                            <div
                              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none whitespace-pre-line'
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                  }`}
                              >
                                {msg.sender === 'user' ? msg.text : renderFormattedContent(msg.text)}
                              </div>
                            </div>

                            {/* Interactive Course Enrollment Card */}
                            {msg.enrolledCourse && (
                              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/80 rounded-2xl p-4 space-y-2.5 shadow-md animate-fade-in max-w-[85%]">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                                    <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" /> Course Enrolled &amp; Unlocked
                                  </span>
                                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                                    +{msg.enrolledCourse.cpd || course.cpd || 15} CPD Points
                                  </span>
                                </div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                  {msg.enrolledCourse.title}
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                  All modules, clinical simulation stations, and OSCE assessments are now active and ready for your learning journey.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedModIdx(0);
                                    setSelectedTopIdx(0);
                                    setActiveTab('curriculum');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-sm transition-all cursor-pointer"
                                >
                                  <PlayCircle size={14} /> Start Module 1 Now &rarr;
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {isPamThinking && (
                          <div className="flex justify-start">
                            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                              Dr. Pam Clinical Intelligence is cross-referencing module protocols...
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input Form */}
                      <form onSubmit={handleDrPamSubmit} className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={drPamQuery}
                          onChange={(e) => setDrPamQuery(e.target.value)}
                          placeholder="Ask Dr. Pam about dosages, protocols, or rural HC III/IV adaptations..."
                          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={isPamThinking}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                          <Send size={14} /> Ask Dr. Pam
                        </button>
                      </form>
                    </div>

                    {/* Direct Question to Authoring Professor (Syncs to Educator Studio Q&A Desk) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <h4 className="text-sm font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
                            <MessageCircle size={16} className="text-cyan-600 dark:text-cyan-400" />
                            Ask Lead Authoring Professor ({course.instructor || 'Faculty Q&A Desk'})
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Questions submitted here route in real time to the Educator Studio Q&amp;A Desk.
                          </p>
                        </div>
                      </div>

                      {profQuestionSubmitted && (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                          Your clinical question has been sent to the Professor&apos;s Educator Studio Q&amp;A Desk!
                        </div>
                      )}

                      <form onSubmit={handleAskProfessorSubmit} className="flex gap-2">
                        <input
                          type="text"
                          value={profQuestionInput}
                          onChange={(e) => setProfQuestionInput(e.target.value)}
                          placeholder="Submit a clinical case question for direct faculty verification..."
                          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-cyan-800 font-bold text-xs whitespace-nowrap cursor-pointer transition-colors"
                        >
                          Send to Professor
                        </button>
                      </form>

                      {courseQuestions.length > 0 && (
                        <div className="space-y-3 pt-3">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Recent Faculty Q&amp;A Threads ({courseQuestions.length})
                          </div>
                          {courseQuestions.map((q) => (
                            <div
                              key={q.id}
                              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                            >
                              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{q.studentName}</span>
                                <span>{q.timestamp}</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300">&ldquo;{q.question}&rdquo;</p>
                              {q.reply && (
                                <div className="p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-200">
                                  <strong className="text-cyan-700 dark:text-cyan-400 block mb-0.5">
                                    Verified Faculty Response:
                                  </strong>
                                  {q.reply}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT 4 COLS: Course Syllabus & Escrow Requirements */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} className="text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white">
                  Your CPD Progress &amp; Certificate
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Baseline Pre-Test</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {preTestScore !== null ? `${preTestScore}% Recorded` : 'Not Taken'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Final Post-Test</span>
                  <span className={`font-bold ${isRegressed ? 'text-rose-600 dark:text-rose-400' : 'text-cyan-700 dark:text-cyan-400'}`}>
                    {postTestScore !== null
                      ? `${postTestScore}% (${isRegressed ? 'Needs Review' : 'Passed'})`
                      : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">CPD Points Value</span>
                  <span className="font-black text-amber-700 dark:text-amber-400">{course.cpd} Credits</span>
                </div>
              </div>

              {theoryEscrowDisbursed && (
                <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-900 dark:text-emerald-200 font-semibold">
                  {course.requiresLab
                    ? `Online Modules Completed! +${course.cpd} CPD Points reserved for your practical session & Milestone 1 Certificate ready.`
                    : `Course Completed! +${course.cpd} Certified CPD Points awarded & Official Certificate ready.`}
                </div>
              )}

              {/* OFFICIAL CERTIFICATE & MILESTONE SECTION */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Official Course Certificate
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${milestoneEligibility.canMint || existingCourseCertificate
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700'
                        : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-slate-950 dark:text-amber-400 dark:border-amber-800/70'
                      }`}
                  >
                    {milestoneEligibility.canMint || existingCourseCertificate
                      ? 'Ready to Download'
                      : 'In Progress'}
                  </span>
                </div>

                {milestoneEligibility.canMint || existingCourseCertificate ? (
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!existingCourseCertificate) {
                          await registerTheoryEscrowPass(postTestScore || 90);
                        }
                        setCertificateModalOpen(true);
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Award size={16} /> View &amp; Print Official Certificate
                    </button>
                    {existingCourseCertificate && (
                      <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="truncate font-mono">
                          ID: {existingCourseCertificate.id}
                        </span>
                        <Link
                          href={`/verify?hash=${encodeURIComponent(
                            existingCourseCertificate.sha256Hash || existingCourseCertificate.hash || existingCourseCertificate.id
                          )}`}
                          className="text-cyan-700 dark:text-cyan-400 hover:underline font-sans font-bold shrink-0 ml-2"
                        >
                          Verify Online &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                    <Lock size={14} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>{milestoneEligibility.blockReason}</span>
                  </div>
                )}
              </div>

              {/* RECURRING FOLLOW-UP REFRESHERS (CONTINUOUS LEARNING LOOP) */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <RefreshCw size={13} className="text-purple-600 dark:text-purple-400" /> Post-Course Follow-Up Refreshers
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400">
                    +0.5 CPD Each
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Keep your clinical skills sharp after completing the course with short follow-up refreshers that add bonus CPD credits to your certificate.
                </p>

                <div className="space-y-1.5">
                  {[
                    `30-Day Follow-Up: ${course.category || 'Clinical'} Rapid Protocol Drill`,
                    '60-Day Follow-Up: Rural HC III/IV Stock-Out Adaptation Check',
                    '90-Day Follow-Up: 60-Second Voice SBAR Escalation Refresher'
                  ].map((drillTitle, dIdx) => {
                    const isDone =
                      recurringCompletedList.includes(drillTitle) ||
                      existingCourseCertificate?.recurringCompleted?.includes(drillTitle);
                    const canRunFollowUp = milestoneEligibility.canMint || Boolean(existingCourseCertificate);

                    return (
                      <button
                        key={dIdx}
                        type="button"
                        disabled={!canRunFollowUp || isDone}
                        onClick={() => handleCompleteRecurringFollowUp(drillTitle)}
                        className={`w-full text-left p-2.5 rounded-xl border text-[11px] transition-all flex items-center justify-between gap-2 ${isDone
                            ? 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/40 dark:border-purple-700/70 dark:text-purple-200 font-bold'
                            : canRunFollowUp
                              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:border-slate-800 dark:text-slate-200 cursor-pointer'
                              : 'bg-slate-50/50 border-slate-200/60 text-slate-400 dark:bg-slate-950/50 dark:border-slate-800/60 dark:text-slate-500 opacity-60 cursor-not-allowed'
                          }`}
                      >
                        <span className="truncate">{drillTitle}</span>
                        {isDone ? (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-black shrink-0">+0.5 CPD ✓</span>
                        ) : (
                          <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold shrink-0">
                            {canRunFollowUp ? 'Start Refresher' : 'Finish Course First'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {course.requiresLab && (
                <div className="mt-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-950 dark:text-purple-200 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-purple-800 dark:text-purple-300">
                    <Building size={14} /> Hands-On Practical Session
                  </div>
                  <p className="text-[11px] leading-relaxed text-purple-900/80 dark:text-purple-300/80">
                    When you finish your online lessons, your CPD points are reserved for you. Attend a local practical session for hands-on skills sign-off (&ge; 80%) to add them to your final certificate.
                  </p>
                  <Link
                    href="/labs"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 pt-1"
                  >
                    Find a Practical Skills Center &rarr;
                  </Link>
                </div>
              )}

              <details className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                <summary className="cursor-pointer font-semibold text-slate-700 hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-400">
                  Learn more: Certificate security &amp; council verification
                </summary>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
                  Certificates are protected with a unique digital signature (SHA-256) and QR code so employers and medical councils can verify your credentials online at any time.
                </p>
              </details>
            </div>

            {/* Syllabus Navigator */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl">
              <div className="pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white">
                  Course Syllabus ({modCount} {modCount === 1 ? 'Module' : 'Modules'})
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-cyan-700 dark:text-cyan-400">
                  {isCourseUnlocked
                    ? 'Full Access'
                    : `Module 1${freeModLimit > 1 ? `-${freeModLimit}` : ''} Free`}
                </span>
              </div>

              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {course.modules &&
                  course.modules.map((mod, mIdx) => {
                    const modLocked =
                      !isCourseUnlocked &&
                      (course.pricingModel === 'premium' ||
                        (course.pricingModel === 'freemium' && mIdx >= freeModLimit));

                    return (
                      <div key={mIdx} className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-black text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                            Module {mIdx + 1}
                          </span>
                          {modLocked ? (
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                              <Lock size={11} /> Voucher / Unlock
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                              {course.pricingModel === 'freemium' && !isCourseUnlocked && mIdx < freeModLimit
                                ? 'Free Preview'
                                : 'Unlocked'}
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
                          {mod.title.replace(/^Module\s+\d+:\s*/i, '')}
                        </div>

                        <div className="space-y-1 pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2.5">
                          {mod.topics?.map((topic, tIdx) => {
                            const isActive = selectedModIdx === mIdx && selectedTopIdx === tIdx;
                            const topicKey = `${mIdx}-${tIdx}`;
                            const isDone = completedTopics.has(topicKey);

                            return (
                              <button
                                key={tIdx}
                                onClick={() => {
                                  setSelectedModIdx(mIdx);
                                  setSelectedTopIdx(tIdx);
                                }}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${isActive
                                    ? 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold border border-cyan-200 dark:border-cyan-800'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-950'
                                  }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {modLocked ? (
                                    <Lock size={12} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                  ) : isDone ? (
                                    <CheckCircle size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                  ) : (
                                    <PlayCircle
                                      size={13}
                                      className={isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-600'}
                                    />
                                  )}
                                  <span className="truncate">{topic.title}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Test Assessment Modal */}
      {isPreTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-xl w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400 block mb-1">
                  Diagnostic Baseline Assessment
                </span>
                <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">Pre-Test Assessment</h3>
              </div>
              <button
                onClick={() => setIsPreTestModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-5 text-xs sm:text-sm">
              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-2">
                  1. Visual estimation of postpartum blood loss typically:
                </p>
                <div className="space-y-1.5">
                  {[
                    'Overestimates blood loss by 50%',
                    'Underestimates blood loss by 30-50%',
                    'Is accurate within 5%'
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setPreTestAnswers((prev) => ({ ...prev, q1: i }))}
                      className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${preTestAnswers.q1 === i
                          ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-cyan-400'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-2">
                  2. What is the evidence-based golden window for Tranexamic Acid (TXA)?
                </p>
                <div className="space-y-1.5">
                  {[
                    'Within 3 hours of birth',
                    'Within 12 hours of birth',
                    'Only after 24 hours'
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setPreTestAnswers((prev) => ({ ...prev, q2: i }))}
                      className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${preTestAnswers.q2 === i
                          ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-cyan-400'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-2">
                  3. What Shock Index (HR / SBP) indicates critical decompensated hypovolemia?
                </p>
                <div className="space-y-1.5">
                  {['Shock Index >= 0.5', 'Shock Index >= 0.9', 'Shock Index < 0.3'].map(
                    (opt, i) => (
                      <button
                        key={i}
                        onClick={() => setPreTestAnswers((prev) => ({ ...prev, q3: i }))}
                        className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${preTestAnswers.q3 === i
                            ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-cyan-400'
                          }`}
                      >
                        {opt}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={handlePreTestSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Submit Baseline Pre-Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Test Assessment Modal */}
      {isPostTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-xl w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400 block mb-1">
                  Mastery Verification
                </span>
                <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">Post-Test Mastery Assessment</h3>
              </div>
              <button
                onClick={() => setIsPostTestModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-5 text-xs sm:text-sm">
              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-2">
                  1. In an HC III without an operating theatre, primary mechanical tamponade is achieved by:
                </p>
                <div className="space-y-1.5">
                  {[
                    'Immediate laparotomy',
                    'Condom-catheter UBT inflated with 300-500 mL sterile fluid',
                    'Cold water vaginal packing'
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setPostTestAnswers((prev) => ({ ...prev, q1: i }))}
                      className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${postTestAnswers.q1 === i
                          ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-cyan-400'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-2">
                  2. What is the intravenous infusion rate for 1g Tranexamic Acid?
                </p>
                <div className="space-y-1.5">
                  {[
                    'Slow push over 10 minutes (1 mL/min)',
                    'Rapid bolus over 10 seconds',
                    'Continuous drip over 24 hours'
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setPostTestAnswers((prev) => ({ ...prev, q2: i }))}
                      className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${postTestAnswers.q2 === i
                          ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-cyan-400'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-2">
                  3. Non-Pneumatic Anti-Shock Garment (NASG) pressure segments should be closed:
                </p>
                <div className="space-y-1.5">
                  {[
                    'Starting at the abdomen down to ankles',
                    'Starting at ankles (segments 1-3) moving up to abdomen (segment 6)',
                    'Only on the upper chest'
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setPostTestAnswers((prev) => ({ ...prev, q3: i }))}
                      className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${postTestAnswers.q3 === i
                          ? 'bg-cyan-600 border-cyan-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-cyan-400'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={handlePostTestSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Finalize Post-Test &amp; Check Escrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professor-Grounded Remedial Coaching Modal */}
      <RemedialCoachingModal
        isOpen={isRemedialModalOpen}
        onClose={() => setIsRemedialModalOpen(false)}
        preTestScore={preTestScore || 75}
        postTestScore={postTestScore || 65}
        courseTitle={course.title}
        onUnlockPass={handleRemedialUnlockPass}
      />

      {/* Voucher-First Multi-Rail Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        item={{
          id: course.id,
          title: course.title,
          priceUSD: course.price || 49,
          cpdPoints: course.cpd || 15
        }}
        defaultRail="voucher"
        onSuccess={(info) =>
          unlockCourseWithVoucherOrPayment(
            `Unlocked via ${(info?.rail || 'voucher').toUpperCase()}`,
            info?.code || 'PAMOJA2026'
          )
        }
      />

      {/* Personalized Cryptographic Certificate & Milestone Modal */}
      <VerifiableCertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        certificate={existingCourseCertificate}
      />
    </div>
  );
}
