"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Award, 
  Heart, 
  Droplet, 
  ChevronRight, 
  Zap,
  Play,
  XCircle
} from 'lucide-react';

const INITIAL_VITALS = {
  bpSystolic: 85,
  bpDiastolic: 50,
  heartRate: 118,
  bloodLoss: 550,
  shockIndex: 1.39,
  state: 'Decompensated Shock'
};

const MASTER_SEQUENCE = [
  { id: 'act-1', text: '1. Call for Help & Activate Emergency Obstetric Team', rationales: 'Mobilizes parallel resuscitation team within 60 seconds.' },
  { id: 'act-2', text: '2. Vigorous Fundal Uterine Massage & Expel Clots', rationales: 'Immediately clears mechanical obstruction of spiral artery constriction.' },
  { id: 'act-3', text: '3. Administer Therapeutic Oxytocin (10 IU IM or IV Infusion)', rationales: 'First-line uterotonic restoring tonic myometrial contraction.' },
  { id: 'act-4', text: '4. Administer Tranexamic Acid (TXA) 1g IV over 10 min', rationales: 'Stops enzymatic fibrinolysis within the 3-hour golden survival window.' },
  { id: 'act-5', text: '5. Wide-Bore IV Line (16G) & Warm Crystalloid Resuscitation', rationales: 'Restores intravascular circulating volume before microvascular collapse.' },
  { id: 'act-6', text: '6. Systematic Speculum Exam & 4 Ts Trauma Check', rationales: 'Visualizes cervix and vagina to identify hidden lacerations.' },
  { id: 'act-7', text: '7. Insert Condom-Catheter UBT or Apply NASG Garment', rationales: 'Hydrostatic tamponade against open placental sinusoids.' }
];

export default function ActionSequencer({ onComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [vitals, setVitals] = useState(INITIAL_VITALS);
  const [executedSteps, setExecutedSteps] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const timerRef = useRef(null);

  // Initialize and shuffle actions
  const initSimulation = () => {
    setIsRunning(true);
    setTimeLeft(90);
    setVitals(INITIAL_VITALS);
    setExecutedSteps([]);
    setFeedback(null);
    setIsSuccess(false);
    setIsFailed(false);
    
    // Shuffle available actions
    const shuffled = [...MASTER_SEQUENCE].sort(() => Math.random() - 0.5);
    setAvailableActions(shuffled);
  };

  useEffect(() => {
    initSimulation();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || isSuccess || isFailed) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsFailed(true);
          setFeedback({
            type: 'error',
            message: 'Time expired! In an emergency PPH scenario, delayed bundle execution leads to lethal coagulopathy.'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isSuccess, isFailed]);

  const handleActionClick = (action) => {
    if (!isRunning || isSuccess || isFailed) return;

    const currentStepIndex = executedSteps.length;
    const expectedStep = MASTER_SEQUENCE[currentStepIndex];

    if (action.id === expectedStep.id) {
      // Correct step executed
      const nextExecuted = [...executedSteps, action];
      setExecutedSteps(nextExecuted);
      setAvailableActions(prev => prev.filter(a => a.id !== action.id));

      // Calculate improved vitals dynamically
      const stepNum = nextExecuted.length;
      const newSys = Math.min(115, 85 + stepNum * 5);
      const newDia = Math.min(75, 50 + stepNum * 4);
      const newHr = Math.max(82, 118 - stepNum * 6);
      const newSi = parseFloat((newHr / newSys).toFixed(2));
      const newLoss = vitals.bloodLoss + 10;

      const stateLabel = newSi < 0.9 ? 'Hemodynamically Stabilized' : newSi < 1.1 ? 'Compensated Shock' : 'Severe Shock';

      setVitals({
        bpSystolic: newSys,
        bpDiastolic: newDia,
        heartRate: newHr,
        bloodLoss: newLoss,
        shockIndex: newSi,
        state: stateLabel
      });

      setFeedback({
        type: 'success',
        message: `Correct! ${action.rationales}`
      });

      // Check if all 7 steps completed
      if (nextExecuted.length === MASTER_SEQUENCE.length) {
        setIsSuccess(true);
        setIsRunning(false);
        if (onComplete) onComplete(100);
      }
    } else {
      // Out-of-sequence action
      const penaltySys = Math.max(70, vitals.bpSystolic - 4);
      const penaltyHr = Math.min(130, vitals.heartRate + 5);
      const penaltyLoss = vitals.bloodLoss + 60;
      const penaltySi = parseFloat((penaltyHr / penaltySys).toFixed(2));

      setVitals({
        ...vitals,
        bpSystolic: penaltySys,
        heartRate: penaltyHr,
        bloodLoss: penaltyLoss,
        shockIndex: penaltySi,
        state: 'Critical Decompensation'
      });

      setFeedback({
        type: 'error',
        message: `Sequence Error! Choosing "${action.text.substring(3)}" now delays the primary physiological intervention. Prioritize ${expectedStep.text.substring(3)}.`
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl relative overflow-hidden">
      
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-[11px] font-black uppercase tracking-widest mb-2">
            <Zap size={13} className="text-cyan-600 dark:text-cyan-400" /> Engine A: Time-Critical Action Sequencer
          </div>
          <h3 className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
            Acute Postpartum Hemorrhage Physiological Clock
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Patient: 24yo G2P2 Mother, 15 min postpartum. Calibrated Drape Alert: 550 mL.
          </p>
        </div>

        {/* Live Clock & Reset Button */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono font-black text-lg border ${
            timeLeft < 25 
              ? 'bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse' 
              : 'bg-slate-800 text-cyan-400 border-slate-700'
          }`}>
            <Clock size={18} /> {timeLeft}s
          </div>

          <button
            onClick={initSimulation}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Simulation"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Live Virtual Patient Monitor (HUD) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Blood Pressure */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Blood Pressure</span>
            <Activity size={13} className="text-indigo-400" />
          </div>
          <div className={`text-2xl font-black font-mono ${
            vitals.bpSystolic < 90 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {vitals.bpSystolic}/{vitals.bpDiastolic}
            <span className="text-xs font-normal text-slate-400 ml-1">mmHg</span>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Heart Rate</span>
            <Heart size={13} className="text-rose-400" />
          </div>
          <div className={`text-2xl font-black font-mono ${
            vitals.heartRate > 100 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {vitals.heartRate}
            <span className="text-xs font-normal text-slate-400 ml-1">bpm</span>
          </div>
        </div>

        {/* Shock Index */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Shock Index (HR/SBP)</span>
            <AlertTriangle size={13} className="text-amber-400" />
          </div>
          <div className={`text-2xl font-black font-mono ${
            vitals.shockIndex >= 1.0 ? 'text-rose-400' : vitals.shockIndex >= 0.9 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {vitals.shockIndex}
            <span className="text-xs font-bold ml-1 text-slate-400">{vitals.shockIndex < 0.9 ? '(Normal)' : '(Alert)'}</span>
          </div>
        </div>

        {/* Drape Blood Loss */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Calibrated Drape</span>
            <Droplet size={13} className="text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">
            {vitals.bloodLoss}
            <span className="text-xs font-normal text-slate-400 ml-1">mL</span>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-start gap-3 border ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/50' 
            : 'bg-rose-950/80 text-rose-200 border-rose-500/50'
        }`}>
          {feedback.type === 'success' ? <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Success Modal / State */}
      {isSuccess && (
        <div className="p-6 bg-gradient-to-r from-emerald-950 to-teal-950 rounded-2xl border border-emerald-500/50 text-center mb-6 animate-in zoom-in-95">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award size={32} />
          </div>
          <h4 className="text-2xl font-black font-['Outfit'] text-white mb-2">Emergency Sequencing Certified!</h4>
          <p className="text-xs text-emerald-200 max-w-md mx-auto mb-4">
            Patient stabilized in {90 - timeLeft} seconds. Blood pressure restored to {vitals.bpSystolic}/{vitals.bpDiastolic} mmHg with Shock Index {vitals.shockIndex}.
          </p>
          <div className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-900/50 px-4 py-2 rounded-xl inline-block">
            Score: 100% • Clinical Reflex Validated
          </div>
        </div>
      )}

      {/* Available Actions to Click */}
      {!isSuccess && !isFailed && (
        <div className="flex flex-col gap-3">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
            Available Emergency Interventions (Trigger in Exact Physiological Sequence):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/50 text-left text-xs font-bold text-slate-200 transition-all flex items-center justify-between group cursor-pointer active:scale-98"
              >
                <span>{action.text}</span>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completed Interventions Progress */}
      {executedSteps.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
            <CheckCircle size={14} /> Completed Interventions ({executedSteps.length} of {MASTER_SEQUENCE.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {executedSteps.map((step, idx) => (
              <span key={step.id} className="text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <CheckCircle size={12} className="text-emerald-400" /> {step.text}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
