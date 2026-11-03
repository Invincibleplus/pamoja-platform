"use client";

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Brain,
  CheckCircle,
  ArrowRight,
  X,
  AlertTriangle,
  PlayCircle,
  Sparkles
} from 'lucide-react';

export default function RemedialCoachingModal({
  isOpen,
  onClose,
  preTestScore = 70,
  postTestScore = 65,
  courseTitle = 'National EMOTIVE & Helping Mothers Survive PPH Refresher',
  onUnlockPass
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [verificationFeedback, setVerificationFeedback] = useState(null);
  const [remedialData, setRemedialData] = useState(null);
  const [loadingRemedial, setLoadingRemedial] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setActiveStep(0);
    setSelectedAnswers({});
    setVerificationFeedback(null);

    async function fetchDynamicRemedial() {
      setLoadingRemedial(true);
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_remedial',
            courseTitle,
            preTestScore,
            postTestScore,
            missedTopics: [
              'Tranexamic Acid (TXA) 3-hour golden window & WOMAN trial protocol',
              'Resource-adapted mechanical uterine balloon tamponade & NASG sequence'
            ],
            missedConcepts: [
              'Tranexamic Acid (TXA) 3-hour golden window & WOMAN trial protocol',
              'Resource-adapted mechanical uterine balloon tamponade & NASG sequence'
            ]
          })
        });
        const data = await res.json();
        if (data.remedial) {
          setRemedialData(data.remedial);
        }
      } catch (e) {
        console.warn('Remedial fetch notice:', e);
      } finally {
        setLoadingRemedial(false);
      }
    }

    fetchDynamicRemedial();
  }, [isOpen, courseTitle, preTestScore, postTestScore]);

  if (!isOpen) return null;

  const questions =
    remedialData?.questions && remedialData.questions.length >= 2
      ? remedialData.questions
      : [
          {
            scenario:
              'A 24-year-old Primigravida in a Rural HC IV delivers and loses 650 mL of blood within 20 minutes. The delivery occurred 2 hours and 45 minutes ago. Oxytocin has been administered. What is the immediate evidence-based action regarding Tranexamic Acid (TXA)?',
            options: [
              {
                text: 'Withhold TXA because the mother is still hemodynamically stable.',
                correct: false,
                feedback:
                  'Incorrect. Waiting for shock to develop defeats the preventative mechanism of TXA.'
              },
              {
                text: 'Immediately administer Tranexamic Acid 1g IV over 10 minutes before the 3-hour golden window closes.',
                correct: true,
                feedback:
                  'Correct! Every 15 minutes of delay reduces TXA efficacy by 10%. After 3 hours, efficacy is lost.'
              },
              {
                text: 'Administer TXA 2g rapid IV push immediately.',
                correct: false,
                feedback:
                  'Incorrect. The standard dose is 1g IV infused slowly over 10 minutes to prevent hypotension.'
              }
            ]
          },
          {
            scenario:
              'Following delivery, a mother with severe pre-eclampsia (BP 165/105 mmHg) develops atonic PPH. Which uterotonic is STRICTLY CONTRAINDICATED?',
            options: [
              {
                text: 'Ergometrine / Methylergonovine',
                correct: true,
                feedback:
                  'Correct! Ergometrine causes potent systemic vasoconstriction and can precipitate intracranial hemorrhage or eclampsia.'
              },
              {
                text: 'Oxytocin 10 IU IM / IV Infusion',
                correct: false,
                feedback:
                  'Incorrect. Oxytocin is the first-line uterotonic and is safe in hypertensive disorders.'
              },
              {
                text: 'Misoprostol 800 mcg Sublingually',
                correct: false,
                feedback:
                  'Incorrect. Misoprostol is safe when Ergometrine is contraindicated.'
              }
            ]
          }
        ];

  const handleSelectAnswer = (qKey, optIdx, isCorrect, feedbackText) => {
    setSelectedAnswers((prev) => ({ ...prev, [qKey]: optIdx }));
    setVerificationFeedback(feedbackText);

    if (isCorrect) {
      setTimeout(() => {
        setVerificationFeedback(null);
        if (qKey === 'q1') {
          setActiveStep(2);
        } else if (qKey === 'q2') {
          setActiveStep(3);
          if (onUnlockPass) onUnlockPass();
        }
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-['Inter']">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldAlert size={28} />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] font-black uppercase tracking-wider mb-2">
              <AlertTriangle size={12} /> Item-Level Theory Regression Guardrail Active
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
              Professor-Grounded AI Remedial Coaching Clinic
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Pre-Test: <strong className="text-slate-900 dark:text-white">{preTestScore}%</strong> &rarr; Post-Test:{' '}
              <strong className="text-rose-600 dark:text-rose-400">{postTestScore}%</strong> &bull; {courseTitle}
            </p>
          </div>
        </div>

        {/* STEP 0: Diagnostic Analysis & Professor Grounding */}
        {activeStep === 0 && (
          <div className="flex flex-col gap-6">
            <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs leading-relaxed">
              <span className="font-extrabold block text-sm mb-1 text-rose-300">
                Why are your CPD Points held in Theory Escrow?
              </span>
              {remedialData?.diagnosticSummary ||
                'Under Pamoja’s Zero-Trust regulatory mandate, clinicians whose post-test score regresses or falls below 80% complete a targeted Professor-Grounded AI Remedial Micro-Module before CPD escrow points are unlocked.'}
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800">
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain size={14} /> Professor&apos;s Verified Curriculum Synthesis (Pamoja-MedLM)
                </span>
                {loadingRemedial && (
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Sparkles size={12} className="animate-spin" /> Synthesizing...
                  </span>
                )}
              </div>
              <blockquote className="text-xs italic text-slate-300 leading-relaxed border-l-2 border-cyan-500 pl-4 mb-4">
                &ldquo;
                {remedialData?.professorQuote ||
                  'Tranexamic Acid reduces death due to bleeding by over 30% ONLY when administered within 3 hours of birth. Every 15-minute delay reduces survival benefit by 10%. Furthermore, Ergometrine is strictly contraindicated in hypertension (BP >= 140/90) due to acute risk of cerebral hemorrhage.'}
                &rdquo;
              </blockquote>
              <div className="text-[11px] font-bold text-cyan-300 flex items-center gap-2">
                <PlayCircle size={15} /> Grounded in Curriculum Lecture &amp; WHO AFRO / MoH Protocol
              </div>
            </div>

            <button
              onClick={() => setActiveStep(1)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Begin 2-Question Verification Clinic <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 1: Verification Question 1 */}
        {activeStep === 1 && (
          <div className="flex flex-col gap-6">
            <div className="text-xs font-black uppercase tracking-widest text-cyan-400">
              Verification Scenario 1 of 2
            </div>
            <h4 className="text-base sm:text-lg font-black text-white font-['Outfit'] leading-snug">
              {questions[0].scenario}
            </h4>

            <div className="flex flex-col gap-3">
              {questions[0].options.map((opt, idx) => {
                const isSelected = selectedAnswers.q1 === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer('q1', idx, opt.correct, opt.feedback)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                      isSelected && opt.correct
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200'
                        : isSelected && !opt.correct
                        ? 'border-rose-500 bg-rose-950/60 text-rose-200'
                        : 'border-slate-800 bg-slate-950 hover:border-cyan-500 text-slate-300 hover:text-white'
                    }`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {verificationFeedback && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium leading-relaxed">
                {verificationFeedback}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Verification Question 2 */}
        {activeStep === 2 && (
          <div className="flex flex-col gap-6">
            <div className="text-xs font-black uppercase tracking-widest text-cyan-400">
              Verification Scenario 2 of 2
            </div>
            <h4 className="text-base sm:text-lg font-black text-white font-['Outfit'] leading-snug">
              {questions[1].scenario}
            </h4>

            <div className="flex flex-col gap-3">
              {questions[1].options.map((opt, idx) => {
                const isSelected = selectedAnswers.q2 === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer('q2', idx, opt.correct, opt.feedback)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                      isSelected && opt.correct
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200'
                        : isSelected && !opt.correct
                        ? 'border-rose-500 bg-rose-950/60 text-rose-200'
                        : 'border-slate-800 bg-slate-950 hover:border-cyan-500 text-slate-300 hover:text-white'
                    }`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {verificationFeedback && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium leading-relaxed">
                {verificationFeedback}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Regression Lock Lifted! */}
        {activeStep === 3 && (
          <div className="text-center py-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <CheckCircle size={36} />
            </div>

            <h4 className="text-2xl font-black text-white font-['Outfit']">
              Remedial Verification Passed (100%)
            </h4>

            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              You have rectified the clinical regression points. The Theory Escrow lock has been lifted and your post-test certification is synced!
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all mt-2 active:scale-95"
            >
              Finalize Post-Test &amp; Close Clinic
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
