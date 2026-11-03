"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  PhoneCall,
  Activity
} from 'lucide-react';

const SBAR_SCENARIOS = {
  pph: {
    id: 'pph',
    label: 'Scenario 1: Refractory Postpartum Hemorrhage (HC III → Regional Referral)',
    promptNote:
      'Include: (S) Patient name/age + acute PPH blood loss mL, (B) Parity/delivery time + AMTSL given, (A) Vitals (HR, BP, Shock Index) + EMOTIVE/TXA/UBT status, (R) Immediate surgical transfer + crossmatched blood.',
    modelExample:
      'SITUATION: This is Midwife Sarah calling from Wakiso Health Centre III. I am referring a 26-year-old mother, Mary Kato, with refractory postpartum hemorrhage and 950 mL measured blood loss on the calibrated V-drape.\nBACKGROUND: She is G3P3 following spontaneous vaginal delivery 35 minutes ago; active management of third stage (Oxytocin 10 IU IM) was given within 1 minute.\nASSESSMENT: Vitals show HR 124 bpm, BP 86/52 mmHg (Shock Index 1.44). Uterine massage, Oxytocin 20 IU infusion, IV Tranexamic Acid 1g over 10 minutes, and condom-catheter UBT (400 mL saline) are in place.\nRECOMMENDATION: Requesting urgent ambulance reception, Obstetrician on standby, and 2 units of O-negative blood ready on arrival in 20 minutes.'
  },
  neonatal: {
    id: 'neonatal',
    label: 'Scenario 2: Neonatal Resuscitation — Persistent Apnea After Golden Minute',
    promptNote:
      'Include: (S) Term/preterm newborn with persistent apnea/bradycardia, (B) Delivery context + meconium/labor history, (A) Heart rate bpm + bag-and-mask PPV chest rise status, (R) NICU CPAP/intubation reception.',
    modelExample:
      'SITUATION: This is Clinical Officer David at Kawaala HC IV referring a term male newborn (3.1 kg) requiring continuous positive pressure ventilation at 10 minutes of life.\nBACKGROUND: Born via prolonged second-stage labor with thick meconium; dried, stimulated, and airway cleared within the Golden Minute.\nASSESSMENT: Heart rate is 110 bpm with bag-and-mask ventilation at 40 breaths/min and good chest rise, but spontaneous breathing remains inadequate (SpO2 88% on room air).\nRECOMMENDATION: Transferring via warm Kangaroo transport with ongoing ventilation; requesting immediate NICU reception and Bubble CPAP setup on arrival.'
  }
};

export default function SbarHandover({ onComplete }) {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState('pph');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [rubricScore, setRubricScore] = useState(null);
  const recognitionRef = useRef(null);

  const activeScenario = SBAR_SCENARIOS[selectedScenarioKey] || SBAR_SCENARIOS.pph;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript((prev) => (prev ? prev + ' ' : '') + currentText);
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition notice:', e);
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use the text input or Load Model SBAR button.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Speech start error:', err);
      }
    }
  };

  const handleFillStandardPrompt = () => {
    setTranscript(activeScenario.modelExample);
  };

  const evaluateFourAxisDiagnostic = (text) => {
    const t = (text || '').toLowerCase();
    const hasS = /calling|referring|pph|hemorrhage|bleeding|newborn|apnea|ml|hc/.test(t);
    const hasB = /delivered|delivery|g\d|parity|oxytocin|amtsl|labor|minute|golden/.test(t);
    const hasA = /hr|bp|bpm|mmhg|shock|txa|tranexamic|ubt|massage|ventilation|chest/.test(t);
    const hasR = /request|transfer|ambulance|blood|theater|nicu|cpap|arrival|standby/.test(t);

    const sScore = hasS ? 25 : 12;
    const bScore = hasB ? 25 : 12;
    const aScore = hasA ? 25 : 10;
    const rScore = hasR ? 25 : 12;
    const total = sScore + bScore + aScore + rScore;

    return {
      situationScore: sScore,
      backgroundScore: bScore,
      assessmentScore: aScore,
      recommendationScore: rScore,
      totalScore: total,
      feedback:
        total >= 80
          ? 'Excellent 4-Axis SBAR Handover! Quantitative blood loss/vitals, completed bundle interventions, and explicit receiving hospital preparedness were clearly communicated.'
          : 'Incomplete SBAR structure. Ensure you state quantitative vitals (HR, BP, Shock Index or SpO2), interventions already administered (TXA/Oxytocin/PPV), and specific receiving team requests.'
    };
  };

  const gradeHandover = async () => {
    if (!transcript.trim()) return;
    setIsGrading(true);

    const localBaseline = evaluateFourAxisDiagnostic(transcript);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'grade_sbar',
          transcript: transcript.trim(),
          scenario: activeScenario.label
        })
      });

      const data = await response.json();
      const evaluation = data.evaluation;

      const result = evaluation
        ? {
            situationScore: evaluation.situationScore ?? localBaseline.situationScore,
            backgroundScore: evaluation.backgroundScore ?? localBaseline.backgroundScore,
            assessmentScore: evaluation.assessmentScore ?? localBaseline.assessmentScore,
            recommendationScore: evaluation.recommendationScore ?? localBaseline.recommendationScore,
            totalScore: evaluation.totalScore ?? localBaseline.totalScore,
            feedback: evaluation.clinicalFeedback || localBaseline.feedback
          }
        : localBaseline;

      setRubricScore(result);
      if (onComplete) {
        onComplete({ totalScore: result.totalScore, passed: result.totalScore >= 80 });
      }
    } catch {
      setRubricScore(localBaseline);
      if (onComplete) {
        onComplete({ totalScore: localBaseline.totalScore, passed: localBaseline.totalScore >= 80 });
      }
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl space-y-6">
      {/* Header & Scenario Switcher */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-black uppercase tracking-widest mb-2">
            <PhoneCall size={13} className="text-indigo-600 dark:text-indigo-400" /> Engine B: Voice &amp; 4-Axis SBAR Handover Grader
          </div>
          <h3 className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
            Emergency SBAR Referral Communication Station
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{activeScenario.promptNote}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedScenarioKey}
            onChange={(e) => {
              setSelectedScenarioKey(e.target.value);
              setRubricScore(null);
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
          >
            <option value="pph">Scenario 1: Refractory PPH (850mL+)</option>
            <option value="neonatal">Scenario 2: Neonatal Resuscitation</option>
          </select>

          <button
            type="button"
            onClick={handleFillStandardPrompt}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            Load Model SBAR Example
          </button>
        </div>
      </div>

      {/* Voice Recording / Input Control */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity size={14} className="text-indigo-400" /> Speak Aloud or Edit SBAR Handover Transcript:
          </label>

          <button
            type="button"
            onClick={toggleRecording}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
            {isRecording ? 'Stop Dictation' : 'Voice Dictation'}
          </button>
        </div>

        <textarea
          rows={5}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Speak into your microphone or type your structured SBAR handover (Situation, Background, Assessment, Recommendation)..."
          className="w-full p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 focus:border-indigo-500 outline-none font-medium text-slate-200 text-sm leading-relaxed"
        />

        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={gradeHandover}
            disabled={isGrading || !transcript.trim()}
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGrading ? <Sparkles size={16} className="animate-spin" /> : <Send size={16} />}
            {isGrading ? 'Grading 4-Axis SBAR Rubric...' : 'Grade SBAR Handover (/100)'}
          </button>
        </div>
      </div>

      {/* Evaluation Rubric Results */}
      {rubricScore && (
        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 animate-fade-in">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-1">
                4-Axis Clinical Communication Assessment
              </div>
              <h4 className="text-xl font-black font-['Outfit'] text-white">
                Composite SBAR Score:{' '}
                <span className={rubricScore.totalScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                  {rubricScore.totalScore}/100
                </span>
              </h4>
            </div>

            <div
              className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                rubricScore.totalScore >= 80
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {rubricScore.totalScore >= 80 ? '✓ SBAR Handover Certified' : 'Requires Revision (< 80%)'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Situation</div>
              <div className="text-lg font-black font-mono text-cyan-400">
                {rubricScore.situationScore}/25
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Background</div>
              <div className="text-lg font-black font-mono text-blue-400">
                {rubricScore.backgroundScore}/25
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Assessment</div>
              <div className="text-lg font-black font-mono text-purple-400">
                {rubricScore.assessmentScore}/25
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Recommendation</div>
              <div className="text-lg font-black font-mono text-emerald-400">
                {rubricScore.recommendationScore}/25
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-900/60 text-xs font-medium text-indigo-200 leading-relaxed">
            <span className="font-bold text-white mr-1.5">Clinical Supervisor Feedback:</span>
            {rubricScore.feedback}
          </div>
        </div>
      )}
    </div>
  );
}
