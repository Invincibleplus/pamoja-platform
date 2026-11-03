"use client";

import React, { useState } from 'react';
import {
  Box,
  RotateCw,
  Smartphone,
  CheckCircle,
  CheckSquare,
  RefreshCw,
  AlertTriangle,
  Activity
} from 'lucide-react';

export default function WebArPocketManikin({ onComplete }) {
  const [activeModel, setActiveModel] = useState('drape'); // 'drape', 'bimanual', 'aorta'
  const [drapeVolume, setDrapeVolume] = useState(650);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isArActive, setIsArActive] = useState(false);
  const [inspected, setInspected] = useState({ drape: true, bimanual: false, aorta: false });
  const [bundleActions, setBundleActions] = useState({
    massage: false,
    oxytocin: false,
    txa: false,
    fluids: false,
    ubt: false,
    nasg: false
  });

  const handleInspectModel = (model) => {
    setActiveModel(model);
    const updated = { ...inspected, [model]: true };
    setInspected(updated);
    if (updated.drape && updated.bimanual && updated.aorta && onComplete) {
      onComplete(100);
    }
  };

  const toggleBundleAction = (key) => {
    setBundleActions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const completedCount = Object.values(next).filter(Boolean).length;
      if (completedCount >= 4 && onComplete) {
        onComplete(100);
      }
      return next;
    });
  };

  const resetCase = () => {
    setDrapeVolume(650);
    setBundleActions({
      massage: false,
      oxytocin: false,
      txa: false,
      fluids: false,
      ubt: false,
      nasg: false
    });
  };

  // Real-time physiological response model based on drape volume & applied EMOTIVE bundle actions
  const completedActionsCount = Object.values(bundleActions).filter(Boolean).length;
  const effectiveLoss = Math.max(200, drapeVolume - completedActionsCount * 95);
  const simulatedHR = Math.round(76 + (effectiveLoss - 200) * 0.068);
  const simulatedSBP = Math.round(Math.max(68, 122 - (effectiveLoss - 200) * 0.052));
  const simulatedDBP = Math.round(Math.max(42, 78 - (effectiveLoss - 200) * 0.032));
  const shockIndex = (simulatedHR / simulatedSBP).toFixed(2);
  const isStabilized = completedActionsCount >= 4 || Number(shockIndex) < 0.9;

  const EMOTIVE_INTERVENTIONS = [
    { key: 'massage', label: '1. Uterine Massage', sub: 'Continuous fundal rub', effect: '-80 mL' },
    { key: 'oxytocin', label: '2. Oxytocin 10 IU + Infusion', sub: 'First-line uterotonic', effect: '-150 mL' },
    { key: 'txa', label: '3. Tranexamic Acid 1g IV', sub: 'Slow IV over 10 min', effect: '-120 mL' },
    { key: 'fluids', label: '4. IV Crystalloid Bolus', sub: 'Ringer’s Lactate / NS', effect: '-90 mL' },
    { key: 'ubt', label: '5. Condom-Catheter UBT (Rural)', sub: '300-500 mL saline fill', effect: '-160 mL' },
    { key: 'nasg', label: '6. Apply NASG Garment', sub: 'Segments 1 to 5 sequentially', effect: '-110 mL' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase tracking-widest mb-2">
            <Box size={13} className="text-purple-600 dark:text-purple-400" /> Calibrated V-Drape &amp; 15-Minute EMOTIVE Bundle Simulator
          </div>
          <h3 className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
            Interactive Maternal Hemorrhage &amp; Spatial Station
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Adjust calibrated V-Drape blood loss, execute simultaneous EMOTIVE bundle interventions, and inspect 3D anatomical landmarks.
          </p>
        </div>

        {/* Model Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'drape', label: '1. Calibrated Drape & EMOTIVE' },
            { id: 'bimanual', label: '2. Bimanual Compression' },
            { id: 'aorta', label: '3. Aortic Compression' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleInspectModel(m.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeModel === m.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {m.label} {inspected[m.id] && '✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Live Maternal Vitals Monitor */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Calibrated V-Drape</div>
          <div className={`text-xl font-black mt-0.5 ${drapeVolume >= 500 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {drapeVolume} mL
          </div>
          <div className="text-[10px] text-slate-400">
            {drapeVolume >= 500 ? 'EMOTIVE Trigger (>=500mL)' : 'Sub-Threshold'}
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Maternal Heart Rate</div>
          <div className={`text-xl font-black mt-0.5 ${simulatedHR >= 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {simulatedHR} bpm
          </div>
          <div className="text-[10px] text-slate-400">Live Pulse</div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</div>
          <div className="text-xl font-black text-cyan-400 mt-0.5">
            {simulatedSBP}/{simulatedDBP}
          </div>
          <div className="text-[10px] text-slate-400">mmHg</div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Shock Index (HR/SBP)</div>
          <div className={`text-xl font-black mt-0.5 ${Number(shockIndex) >= 0.9 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {shockIndex}
          </div>
          <div className="text-[10px] text-slate-400">
            {Number(shockIndex) >= 0.9 ? 'Emergency Alert (>=0.9)' : 'Hemodynamically Stable'}
          </div>
        </div>
      </div>

      {/* Main 3D / AR Viewport Simulation */}
      <div className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* AR Simulated Overlay Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, cyan 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* 3D Model 1: Calibrated V-Drape */}
        {activeModel === 'drape' && (
          <div className="relative flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
            <div
              className="relative w-48 h-52 border-2 border-cyan-400/80 rounded-b-full bg-slate-950/70 p-4 flex flex-col justify-end overflow-hidden shadow-2xl transition-transform"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              {/* Liquid Level Indicator */}
              <div
                className="w-full bg-gradient-to-t from-rose-700 via-rose-600 to-rose-500 rounded-b-full transition-all duration-500 relative flex items-center justify-center"
                style={{ height: `${Math.min(100, (drapeVolume / 1200) * 100)}%` }}
              >
                <span className="text-white text-xs font-mono font-black drop-shadow-md">
                  {drapeVolume} mL
                </span>
              </div>

              {/* Meniscus Tick Marks */}
              <div className="absolute top-6 right-2 text-[9px] font-mono text-rose-300">1000 mL - Critical</div>
              <div className="absolute top-20 right-2 text-[9px] font-mono text-amber-300">500 mL - Trigger</div>
              <div className="absolute top-36 right-2 text-[9px] font-mono text-slate-400">300 mL - Normal</div>
            </div>

            <div className="mt-3 text-xs font-bold text-slate-300">
              Meniscus Level:{' '}
              <span className={drapeVolume >= 500 ? 'text-rose-400 font-black' : 'text-emerald-400 font-black'}>
                {drapeVolume} mL
              </span>{' '}
              &bull; Effective Residual Bleeding:{' '}
              <span className="text-cyan-400 font-mono font-black">{effectiveLoss} mL</span>
            </div>
          </div>
        )}

        {/* 3D Model 2: Bimanual Uterine Compression */}
        {activeModel === 'bimanual' && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div
              className="w-52 h-52 rounded-full bg-slate-950 border-2 border-indigo-500/60 p-6 flex items-center justify-center relative shadow-2xl transition-transform"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-600 to-pink-800 text-white flex items-center justify-center font-black text-xs p-3 shadow-inner text-center">
                Uterine Fundus (Compressed)
              </div>
              <div className="absolute top-2 text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded-md">
                External Hand (Posterior Wall)
              </div>
              <div className="absolute bottom-2 text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-md">
                Internal Fist (Anterior Fornix)
              </div>
            </div>
            <div className="mt-4 text-xs font-bold text-indigo-300">
              Hand Vector: Sandwich anterior &amp; posterior walls tightly to occlude bleeding spiral arteries.
            </div>
          </div>
        )}

        {/* 3D Model 3: Aortic Compression */}
        {activeModel === 'aorta' && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div
              className="w-52 h-52 rounded-2xl bg-slate-950 border-2 border-emerald-500/60 p-6 flex flex-col items-center justify-center relative shadow-2xl transition-transform"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              <div className="w-4 h-36 bg-gradient-to-b from-rose-600 via-rose-500 to-rose-700 rounded-full shadow-lg relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  Fist
                </div>
              </div>
              <div className="absolute top-3 text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-md">
                2 cm Above Umbilicus, Left of Midline
              </div>
              <div className="absolute bottom-3 text-[10px] font-bold text-slate-400">
                Lumbar Spine Backstop
              </div>
            </div>
            <div className="mt-4 text-xs font-bold text-emerald-300">
              Compression Target: Occlude aorta until femoral pulse is impalpable.
            </div>
          </div>
        )}

        {/* Viewport Floating Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRotationAngle((prev) => (prev + 45) % 360)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
            title="Rotate 3D View"
          >
            <RotateCw size={16} />
          </button>

          <button
            type="button"
            onClick={() => setIsArActive(!isArActive)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all shadow-md cursor-pointer ${
              isArActive
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800/80 hover:bg-slate-700 text-cyan-300'
            }`}
          >
            <Smartphone size={16} /> {isArActive ? 'AR Active' : 'Launch WebAR'}
          </button>
        </div>
      </div>

      {/* Drape Blood Loss Slider + Simultaneous EMOTIVE Interventions */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5">
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="text-slate-200">
              1. Adjust Calibrated V-Drape Blood Loss Volume (mL):
            </span>
            <span className="text-cyan-400 font-mono text-sm font-black">{drapeVolume} mL</span>
          </div>
          <input
            type="range"
            min="200"
            max="1200"
            step="50"
            value={drapeVolume}
            onChange={(e) => setDrapeVolume(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>200 mL (Normal)</span>
            <span className="text-amber-400 font-bold">500 mL (EMOTIVE Trigger)</span>
            <span className="text-rose-400 font-bold">1000+ mL (Severe Shock)</span>
          </div>
        </div>

        {/* Simultaneous 15-Minute EMOTIVE Bundle Interventions */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-200">
              2. Execute Simultaneous 15-Minute EMOTIVE Bundle Interventions:
            </span>
            <span className="text-xs font-bold text-cyan-400">
              {completedActionsCount}/6 Applied
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {EMOTIVE_INTERVENTIONS.map((item) => {
              const active = bundleActions[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleBundleAction(item.key)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    active
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 hover:border-cyan-500/50 text-slate-200'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <CheckSquare
                        size={14}
                        className={active ? 'text-emerald-400' : 'text-slate-500'}
                      />
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 shrink-0">
                    {item.effect}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-Time Stabilization Status Bar */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isStabilized
              ? 'bg-emerald-500/10 border-emerald-500/40'
              : 'bg-rose-500/10 border-rose-500/40'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isStabilized ? (
              <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div
                className={`text-xs font-black uppercase ${
                  isStabilized ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isStabilized
                  ? 'Patient Stabilized — Hemorrhage Controlled'
                  : 'Active PPH — Execute Simultaneous EMOTIVE Interventions'}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isStabilized
                  ? `Hemodynamic parameters stabilizing (HR ${simulatedHR} bpm, BP ${simulatedSBP}/${simulatedDBP} mmHg, Shock Index ${shockIndex}). Ready for SBAR handover.`
                  : 'Click at least 4 simultaneous EMOTIVE bundle interventions above to control uterine atony and restore maternal perfusion.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetCase}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold hover:text-cyan-400 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
          >
            <RefreshCw size={12} /> Reset Case
          </button>
        </div>
      </div>

      {/* Spatial Inspection Progress Checklist */}
      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
          <Activity size={14} className="text-cyan-400" />
          Spatial Inspection Station:{' '}
          <span className="text-cyan-400">
            {Object.values(inspected).filter(Boolean).length}/3 Models Reviewed
          </span>
        </div>

        {(Object.values(inspected).every(Boolean) || isStabilized) && (
          <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800">
            <CheckCircle size={14} /> EMOTIVE &amp; Spatial Competency Verified
          </div>
        )}
      </div>
    </div>
  );
}
