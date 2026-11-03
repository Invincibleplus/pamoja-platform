"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import {
  Bot,
  X,
  Sparkles,
  Target,
  Zap,
  ChevronRight,
  Award,
  Send,
  Layers,
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

export default function AIAssistant() {
  const { user, profile, updateProfileState, showToast } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I am Dr. Pam, your Clinical Study Assistant. Ask me any clinical protocol question, request guidance for Health Centre III/IV settings, or ask me to create a personalized study plan for you.'
    }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking, challengeAccepted]);

  const sendQueryToDrPam = async (queryText) => {
    const trimmed = (queryText || '').trim();
    if (!trimmed || isThinking) return;

    setInput('');
    const nextHistory = [...messages, { type: 'user', text: trimmed }];
    setMessages(nextHistory);
    setIsThinking(true);

    try {
      const activeProfile = profile || {
        name: user?.displayName || 'Clinical Colleague',
        title: 'Dr.',
        role: 'guest',
        facility: 'Clinical Facility',
        facilityTier: 'HC III / IV',
        cpdPoints: 0,
        pendingPoints: 0
      };

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat_dr_pam',
          message: trimmed,
          history: nextHistory.slice(-6),
          profile: {
            name: activeProfile.name,
            title: activeProfile.title,
            role: activeProfile.role,
            facility: activeProfile.facility,
            facilityTier: activeProfile.facilityTier,
            cpdPoints: activeProfile.cpdPoints,
            pendingPoints: activeProfile.pendingPoints
          }
        })
      });

      const data = await res.json();
      if (data.status === 'success' && data.reply) {
        // Execute real enrollment if Dr. Pam initiated enrollment
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

          // Force dispatch cross-tab and cross-component sync
          if (typeof window !== 'undefined') {
            try {
              const currentRaw = window.localStorage.getItem('pamoja_active_profile_v11');
              const parsed = currentRaw ? JSON.parse(currentRaw) : {};
              const merged = { ...parsed, enrolledCourses: nextEnrolled, purchasedCourses: nextPurchased };
              window.localStorage.setItem('pamoja_active_profile_v11', JSON.stringify(merged));
              window.dispatchEvent(new CustomEvent('pamoja-rt-sync', { detail: { key: 'profile' } }));
              window.dispatchEvent(new Event('storage'));
            } catch (e) {}
          }

          if (showToast) {
            showToast(`Dr. Pam officially enrolled you in "${data.enrolledCourse.title}"! All modules unlocked.`, 'success');
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: data.reply,
            enrolledCourse: data.enrolledCourse || null,
            pathwaySuggestion: data.pathwaySuggestion || null,
            groundedSources: data.groundedSources || []
          }
        ]);
      } else {
        throw new Error(data.message || 'AI response error');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'I am ready to help with your clinical question or custom study pathway. Could you share the specific patient scenario, clinical topic, or facility tier you are working in?'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = () => {
    sendQueryToDrPam(input);
  };

  const handleAcceptChallenge = async () => {
    if (!user) {
      if (showToast) {
        showToast('Create your free account or sign in to save your CPD points!', 'info');
      }
      setChallengeAccepted(true);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Great effort on completing the Frontline Clinical Challenge! Sign in or register to record your +0.5 CPD Bonus Credits to your verified portfolio.'
        }
      ]);
      return;
    }

    setChallengeAccepted(true);

    const newPoints = (profile?.cpdPoints || 0) + 0.5;
    const newNotif = {
      id: Date.now().toString(),
      text: "Earned +0.5 CPD Points from Dr. Pam's Daily Clinical Challenge",
      time: 'Just now',
      read: false
    };
    const currentNotifs = profile?.notifications || [];

    if (updateProfileState) {
      await updateProfileState({
        cpdPoints: newPoints,
        notifications: [...currentNotifs, newNotif]
      });
    } else if (user && profile && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(
          userRef,
          { cpdPoints: newPoints, notifications: [...currentNotifs, newNotif] },
          { merge: true }
        );
      } catch (e) {}
    }

    setMessages((prev) => [
      ...prev,
      {
        type: 'bot',
        text: 'Challenge accepted! +0.5 CPD Bonus Credits have been added to your verified medical portfolio. Keep up the frontline clinical excellence!'
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-['Inter']">
      {/* Mentor Floating Tooltip */}
      {showTooltip && !isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-800 text-slate-800 dark:text-white rounded-2xl p-4 shadow-xl max-w-xs animate-fade-in relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-1.5 text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider font-['Outfit']">
            <Sparkles size={14} className="text-cyan-600 dark:text-cyan-400" /> Dr. Pam — Study Assistant
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Ask me for a <strong className="text-slate-900 dark:text-white">Personalized Study Plan</strong> or clinical protocol guidance for your facility.
          </p>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[410px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-6rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-fade-in text-slate-800 dark:text-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm font-['Outfit'] leading-tight text-white">
                  Dr. Pam — Clinical Study Assistant
                </h3>
                <p className="text-[11px] text-cyan-100 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />{' '}
                  Answers from your course &amp; MoH guidelines
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/80 dark:bg-slate-950/70 text-xs sm:text-sm">
            {/* Quick Action Prompts */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
              <h4 className="text-[10px] font-black text-cyan-700 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target size={12} className="text-cyan-600 dark:text-cyan-400" /> Quick Clinical Questions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Help me build a personalized study plan',
                  'HC III PPH stabilization without theatre',
                  'TXA golden window & dosage',
                  'How do I complete my practical session?'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendQueryToDrPam(q)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-50 dark:bg-slate-950 dark:hover:bg-cyan-950/60 border border-slate-200 hover:border-cyan-300 dark:border-slate-800 dark:hover:border-cyan-700 text-[11px] font-semibold text-slate-700 hover:text-cyan-800 dark:text-slate-300 dark:hover:text-cyan-300 transition-all text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Challenge Card */}
            {!challengeAccepted && (
              <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                  <Zap size={14} className="text-amber-600 dark:text-amber-400" /> Frontline Daily Challenge
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  Complete the quantitative drape &amp; Shock Index check today to earn{' '}
                  <strong className="text-amber-900 dark:text-amber-300">+0.5 CPD Bonus Credits</strong>.
                </p>
                <button
                  onClick={handleAcceptChallenge}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Award size={14} /> Accept Challenge (+0.5 CPD)
                </button>
              </div>
            )}

            {/* Messages Log */}
            {messages.map((msg, i) => (
              <div key={i} className="space-y-2">
                <div
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {msg.type === 'bot' && (
                    <div className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={13} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none whitespace-pre-line'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.type === 'bot' ? renderFormattedContent(msg.text) : msg.text}
                  </div>
                </div>

                {/* If Dr. Pam performed Real Course Enrollment */}
                {msg.enrolledCourse && (
                  <div className="ml-8 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/80 rounded-2xl p-3.5 space-y-2.5 shadow-md animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-emerald-600 dark:text-emerald-400" /> Officially Enrolled
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                        +{msg.enrolledCourse.cpd || 15} CPD Points
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {msg.enrolledCourse.title}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      All modules, clinical simulations, and OSCE assessments are now fully unlocked for your profile.
                    </p>
                    <Link
                      href={`/courses/${msg.enrolledCourse.id}`}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-sm transition-all cursor-pointer"
                    >
                      <PlayCircle size={14} /> Start Module 1 Now &rarr;
                    </Link>
                  </div>
                )}

                {/* If Dr. Pam synthesized a Dynamic Study Pathway Card */}
                {msg.pathwaySuggestion && (
                  <div className="ml-8 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-800/80 rounded-2xl p-3.5 space-y-2.5 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                        <Layers size={12} /> Recommended Study Plan
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                        {msg.pathwaySuggestion.totalCPD} CPD &bull;{' '}
                        {msg.pathwaySuggestion.targetDurationHours} hrs
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {msg.pathwaySuggestion.alus.map((alu, aIdx) => (
                        <Link
                          key={aIdx}
                          href={`/courses/${alu.courseId}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-cyan-50 dark:bg-slate-950 dark:hover:bg-cyan-950/40 border border-slate-200 hover:border-cyan-300 dark:border-slate-800 dark:hover:border-cyan-700 transition-all group"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-[11px] font-bold text-slate-800 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 truncate">
                              {aIdx + 1}. {alu.subTopicTitle}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {alu.courseTitle} &bull; {alu.seatTimeMinutes}m
                            </div>
                          </div>
                          <ChevronRight
                            size={14}
                            className="text-slate-400 group-hover:text-cyan-600 dark:text-slate-500 dark:group-hover:text-cyan-400 shrink-0"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grounded Curriculum Citations */}
                {msg.groundedSources && msg.groundedSources.length > 0 && !msg.pathwaySuggestion && (
                  <div className="ml-8 flex flex-wrap gap-1.5">
                    {msg.groundedSources.slice(0, 2).map((src, sIdx) => (
                      <Link
                        key={sIdx}
                        href={`/courses/${src.courseId}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-cyan-50 dark:bg-slate-900 border border-slate-200 hover:border-cyan-300 dark:border-slate-800 dark:hover:border-cyan-700 text-[10px] text-cyan-700 dark:text-cyan-400 transition-colors"
                      >
                        <BookOpen size={10} /> {src.competencyTag}: {src.subTopicTitle.substring(0, 28)}...
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={13} />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-3 text-xs text-cyan-700 dark:text-cyan-300 flex items-center gap-2 shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-ping" />
                  Synthesizing from verified clinical curriculum...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Dr. Pam about protocols, dosages, or study paths..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isThinking || !input.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Send Message"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        id="ai-assistant-launcher-btn"
        className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title="Dr. Pam Clinical Intelligence"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
    </div>
  );
}
