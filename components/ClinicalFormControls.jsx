"use client";

import React, { useState, useEffect } from 'react';

export const ROLES = {
  GUEST: 'guest',
  LEARNER: 'learner',
  COORDINATOR: 'coordinator',
  CONVENER: 'convener',
  CREATOR: 'creator',
  REVIEWER: 'reviewer',
  REGISTRAR: 'registrar',
  SUPPORT: 'support',
  AUDITOR: 'auditor',
  SUPERUSER: 'superuser'
};

export const ROLE_LABELS = {
  guest: 'Visitor',
  learner: 'Clinician Learner',
  coordinator: 'Facility Coordinator',
  convener: 'Lab Convener',
  creator: 'Course Educator / Professor',
  reviewer: 'Clinical Peer Reviewer',
  registrar: 'Board Registrar',
  support: 'Tech Support',
  auditor: 'Compliance Auditor',
  superuser: 'Super Administrator'
};

// Non-clinical administrative roles that do NOT carry personal student CPD buckets
export const NON_STUDENT_ROLES = [
  ROLES.SUPERUSER,
  ROLES.REGISTRAR,
  ROLES.SUPPORT,
  ROLES.AUDITOR
];

export const PINNED_COUNTRIES = [
  'South Africa (Current Location)',
  'Uganda',
  'Kenya',
  'Tanzania',
  'Rwanda',
  'Nigeria',
  'Ghana',
  'Zambia',
  'Zimbabwe',
  'Malawi',
  'Ethiopia'
];

export const ALL_COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde',
  'Central African Republic', 'Chad', 'Comoros', 'Congo (DRC)', 'Congo (Republic)', "Cote d'Ivoire",
  'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia',
  'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi',
  'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda',
  'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa',
  'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'United Kingdom', 'United States',
  'Zambia', 'Zimbabwe', 'Other'
];

export const TITLE_OPTIONS = [
  'Dr.',
  'Prof.',
  'Midwife',
  'Nurse',
  'Clinical Officer',
  'Mr.',
  'Ms.',
  'Other'
];

export const CADRE_OPTIONS = [
  'Medical Doctor (MBChB / MD)',
  'Specialist Physician / Consultant',
  'Registered Midwife',
  'Registered Nurse',
  'Clinical Officer',
  'Community Health / Peer Educator',
  'Pharmacist',
  'Laboratory Technologist',
  'Public Health Officer',
  'System Administrator / Operations',
  'Other'
];

export const SPECIALTY_OPTIONS = [
  'Maternal & Perinatal Health',
  'Neonatology & Child Health',
  'Emergency & Critical Care',
  'Infectious Diseases (HIV / TB)',
  'Mental Health & Family Support',
  'General Practice / Family Medicine',
  'Obstetrics & Gynaecology',
  'Pediatrics',
  'Surgery & Anaesthesia',
  'Platform Governance & Operations',
  'Other'
];

export const FACILITY_TIER_OPTIONS = [
  'Health Centre III (Rural Primary)',
  'Health Centre IV (Sub-District)',
  'District / General Hospital',
  'Regional Referral Hospital',
  'National Referral / Teaching Hospital',
  'Private / Faith-Based Hospital',
  'University Simulation Center',
  'Ministry / Regulatory Agency',
  'Other'
];

export function SelectWithOther({
  label,
  name,
  options = [],
  defaultValue = '',
  value,
  onChange,
  required = false,
  className = ''
}) {
  const initialVal = value !== undefined ? value : defaultValue;
  const isInitialOther = Boolean(initialVal && !options.includes(initialVal));
  const [selected, setSelected] = useState(
    isInitialOther ? 'Other' : initialVal || options[0] || ''
  );
  const [customVal, setCustomVal] = useState(isInitialOther ? initialVal : '');

  useEffect(() => {
    if (value !== undefined) {
      if (value && !options.includes(value)) {
        setSelected('Other');
        setCustomVal(value);
      } else if (value) {
        setSelected(value);
      }
    }
  }, [value, options]);

  const finalValue = selected === 'Other' ? customVal.trim() || 'Other' : selected;

  const handleSelectChange = (e) => {
    const nextSel = e.target.value;
    setSelected(nextSel);
    if (onChange) {
      onChange(nextSel === 'Other' ? customVal.trim() || 'Other' : nextSel);
    }
  };

  const handleCustomChange = (e) => {
    const nextCustom = e.target.value;
    setCustomVal(nextCustom);
    if (onChange) {
      onChange(nextCustom.trim() || 'Other');
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={finalValue} />}
      <select
        value={selected}
        onChange={handleSelectChange}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            {opt === 'Other' ? 'Other (Specify)...' : opt}
          </option>
        ))}
      </select>
      {selected === 'Other' && (
        <input
          type="text"
          value={customVal}
          onChange={handleCustomChange}
          placeholder={`Specify ${label || name || 'value'}...`}
          required={required}
          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-cyan-500/60 dark:border-cyan-500 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 mt-1"
        />
      )}
    </div>
  );
}

export function CountrySelect({
  label = 'Country',
  name = 'country',
  defaultValue = 'South Africa',
  value,
  onChange,
  includeAllOption = false,
  allOptionLabel = 'All Countries (Pinned & Global)',
  className = ''
}) {
  const initialRaw = value !== undefined ? value : defaultValue;
  const cleanPinList = PINNED_COUNTRIES.map((c) => c.replace(' (Current Location)', ''));
  const isKnown =
    initialRaw === 'All' ||
    cleanPinList.includes(initialRaw) ||
    ALL_COUNTRIES.includes(initialRaw);

  const [internalVal, setInternalVal] = useState(
    !isKnown && initialRaw ? 'Other' : initialRaw || 'South Africa'
  );
  const [customCountry, setCustomCountry] = useState(!isKnown && initialRaw ? initialRaw : '');

  const activeVal = value !== undefined ? value : internalVal;

  const handleSelectChange = (e) => {
    const v = e.target.value;
    setInternalVal(v);
    if (onChange) {
      onChange(v === 'Other' ? customCountry.trim() || 'Other' : v);
    }
  };

  const handleCustomChange = (e) => {
    const v = e.target.value;
    setCustomCountry(v);
    if (onChange) {
      onChange(v.trim() || 'Other');
    }
  };

  const finalSubmittedCountry =
    activeVal === 'Other'
      ? customCountry.trim() || 'Other'
      : String(activeVal || 'South Africa').replace(' (Current Location)', '');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={finalSubmittedCountry} />}
      <select
        value={activeVal}
        onChange={handleSelectChange}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
      >
        {includeAllOption && <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{allOptionLabel}</option>}
        <optgroup label="📍 Pinned & Regional Hubs" className="font-bold text-slate-500 dark:text-slate-400">
          {PINNED_COUNTRIES.map((c) => {
            const clean = c.replace(' (Current Location)', '');
            return (
              <option key={'pin-' + c} value={clean} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {c}
              </option>
            );
          })}
        </optgroup>
        <optgroup label="🌍 All Countries (A–Z)" className="font-bold text-slate-500 dark:text-slate-400">
          {ALL_COUNTRIES.map((c) => (
            <option key={'all-' + c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {c === 'Other' ? 'Other Country (Specify)...' : c}
            </option>
          ))}
        </optgroup>
      </select>
      {activeVal === 'Other' && (
        <input
          type="text"
          value={customCountry}
          onChange={handleCustomChange}
          placeholder="Enter country name..."
          required
          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-cyan-500/60 dark:border-cyan-500 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 mt-1"
        />
      )}
    </div>
  );
}

