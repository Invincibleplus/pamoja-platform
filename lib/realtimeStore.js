"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { SEED_COURSES, INITIAL_LABS as SEED_LABS, SEED_PROMOS } from './seedCourses';
import {
  CREDENTIAL_TIERS,
  buildCanonicalPayload,
  computeDeterministicHexHash
} from './certificateCrypto';

const STORAGE_KEYS = {
  courses: 'pamoja_rt_courses_v4',
  labs: 'pamoja_rt_labs_v4',
  users: 'pamoja_rt_users_v4',
  questions: 'pamoja_rt_questions_v4',
  certificates: 'pamoja_rt_certificates_v4',
  escrowQueue: 'pamoja_rt_escrow_v4',
  vouchers: 'pamoja_rt_vouchers_v4',
  transactions: 'pamoja_rt_transactions_v4',
  pathways: 'pamoja_rt_pathways_v4'
};

export const INITIAL_LABS_ENRICHED = [
  {
    id: 'lab-uct-sim',
    name: 'Groote Schuur & UCT Clinical Skills Simulation Centre',
    locationName: 'Groote Schuur & UCT Clinical Skills Simulation Centre',
    city: 'Cape Town',
    country: 'South Africa',
    region: 'Southern Africa',
    facilityTier: 'National Referral / Teaching Hospital',
    specialties: [
      'Maternal & Perinatal Health',
      'Neonatology & Child Health',
      'Emergency & Critical Care'
    ],
    scheduleType: 'Weekly Recurring (52-Week Annual Calendar)',
    nextDates: ['2026-11-06', '2026-11-13', '2026-11-20', '2026-11-27'],
    date: '2026-11-06',
    time: '09:00',
    capacity: 16,
    booked: 6,
    spotsLeft: 10,
    convener: 'Prof. Thabo Mbeki-Nkosi',
    convenerName: 'Prof. Thabo Mbeki-Nkosi',
    facilityContactPhone: '+27 21 404 9111',
    venueStatus: 'Venue & Examiner Confirmed',
    courseId: 'course-emotive-pph',
    courseTitle: 'National EMOTIVE & Helping Mothers Survive PPH Refresher',
    roster: [
      {
        userId: 'usr-akello',
        name: 'Dr. Grace Akello',
        courseId: 'course-emotive-pph',
        date: '2026-11-06',
        bookingCode: 'PMJ-LAB-8402',
        checkedIn: true
      }
    ]
  },
  {
    id: 'lab-mulago-sim',
    name: 'Mulago Specialized Women & Neonatal Simulation Center',
    locationName: 'Mulago Specialized Women & Neonatal Simulation Center',
    city: 'Kampala',
    country: 'Uganda',
    region: 'East Africa',
    facilityTier: 'National Referral / Teaching Hospital',
    specialties: [
      'Emergency & Critical Care',
      'Maternal & Perinatal Health',
      'Neonatology & Child Health'
    ],
    scheduleType: 'Weekly Recurring (52-Week Annual Calendar)',
    nextDates: ['2026-11-05', '2026-11-12', '2026-11-19', '2026-11-26'],
    date: '2026-11-05',
    time: '09:00',
    capacity: 20,
    booked: 12,
    spotsLeft: 8,
    convener: 'Dr. Kenneth Mugabe',
    convenerName: 'Dr. Kenneth Mugabe',
    facilityContactPhone: '+256 414 554 001',
    venueStatus: 'Venue & Examiner Confirmed',
    courseId: 'course-emotive-pph',
    courseTitle: 'National EMOTIVE & Helping Mothers Survive PPH Refresher',
    roster: [
      {
        userId: 'usr-akello',
        name: 'Dr. Grace Akello',
        courseId: 'course-emotive-pph',
        date: '2026-11-05',
        bookingCode: 'PMJ-LAB-9012',
        checkedIn: true
      },
      {
        userId: 'usr-immaculate',
        name: 'Midwife Ndyamuhakyi Immaculate',
        courseId: 'course-gc1000-maternal',
        date: '2026-11-05',
        bookingCode: 'PMJ-LAB-9045',
        checkedIn: true
      }
    ]
  },
  {
    id: 'lab-jinja-rrh',
    name: 'Jinja Regional Referral Maternal Skills Lab',
    locationName: 'Jinja Regional Referral Maternal Skills Lab',
    city: 'Jinja',
    country: 'Uganda',
    region: 'East Africa',
    facilityTier: 'Regional Referral Hospital',
    specialties: ['Maternal & Perinatal Health', 'Emergency & Critical Care'],
    scheduleType: 'Monthly Recurring (12-Month Calendar)',
    nextDates: ['2026-11-06', '2026-12-04', '2027-01-08'],
    date: '2026-11-06',
    time: '08:30',
    capacity: 18,
    booked: 9,
    spotsLeft: 9,
    convener: 'Midwife Ndyamuhakyi Immaculate',
    convenerName: 'Midwife Ndyamuhakyi Immaculate',
    facilityContactPhone: '+256 434 122 000',
    venueStatus: 'Awaiting 72h Host Confirmation',
    courseId: 'course-golden-minute-nrp',
    courseTitle: 'Helping Babies Breathe: The Golden Minute Neonatal Resuscitation',
    roster: []
  },
  ...(SEED_LABS || []).map((l) => ({
    ...l,
    locationName: l.locationName || l.name || 'Regional Clinical Simulation Center',
    city: l.city || 'Kampala',
    country: l.country || 'Uganda',
    facilityTier: l.facilityTier || 'Regional Referral Hospital',
    specialties: l.specialties || ['Maternal & Perinatal Health', 'Emergency & Critical Care'],
    scheduleType: l.scheduleType || 'Weekly Recurring (52-Week Annual Calendar)',
    nextDates: l.nextDates || ['2026-11-10', '2026-11-17', '2026-11-24'],
    time: l.time || '09:00',
    capacity: l.capacity || 20,
    booked: l.booked || 8,
    convenerName: l.convenerName || l.convener || 'Dr. Kenneth Mugabe',
    facilityContactPhone: l.facilityContactPhone || '+256 414 554 001',
    venueStatus: l.venueStatus || 'Venue & Examiner Confirmed',
    roster: l.roster || []
  }))
];

export const INITIAL_USERS = [
  {
    id: 'usr-akello',
    title: 'Dr.',
    name: 'Grace Akello',
    email: 'grace.akello@mulago.go.ug',
    phone: '+256 772 410 892',
    gender: 'Female',
    cadre: 'Medical Doctor (MBChB / MD)',
    specialty: 'Maternal & Perinatal Health',
    country: 'Uganda',
    facilityTier: 'National Referral / Teaching Hospital',
    location: 'Mulago Specialized Hospital, Kampala',
    facility: 'Mulago Specialized Hospital, Kampala',
    authorityId: 'UMDPC-18402',
    role: 'learner',
    isVerified: true,
    isPublic: true,
    cpdPoints: 20,
    pendingPoints: 15,
    boardPendingPoints: 0,
    labPendingPoints: 15,
    externalCpdPoints: 5,
    preTestScore: 72,
    postTestScore: 92,
    certifiedPracticalCourses: [],
    bookedLabs: [
      {
        labId: 'lab-mulago-sim',
        locationName: 'Mulago Specialized Women & Neonatal Simulation Center',
        city: 'Kampala',
        date: '2026-11-05',
        time: '09:00',
        convenerName: 'Dr. Kenneth Mugabe',
        facilityContactPhone: '+256 414 554 001',
        bookingCode: 'PMJ-LAB-9012',
        status: 'Venue & Examiner Confirmed'
      }
    ],
    externalRecords: [
      {
        id: 'ext-1',
        title: 'East African Perinatal Congress 2026',
        points: 5,
        provider: 'UMDPC',
        date: '2026-06-14',
        verified: true
      }
    ]
  },
  {
    id: 'usr-immaculate',
    title: 'Midwife',
    name: 'Ndyamuhakyi Immaculate',
    email: 'immaculate@jinja.go.ug',
    phone: '+256 782 553 901',
    gender: 'Female',
    cadre: 'Registered Midwife',
    specialty: 'Maternal & Perinatal Health',
    country: 'Uganda',
    facilityTier: 'Regional Referral Hospital',
    location: 'Jinja Regional Referral Hospital',
    facility: 'Jinja Regional Referral Hospital',
    authorityId: 'UNMC-44210',
    role: 'learner',
    isVerified: true,
    isPublic: true,
    cpdPoints: 35,
    pendingPoints: 15,
    boardPendingPoints: 0,
    labPendingPoints: 15,
    externalCpdPoints: 0,
    preTestScore: 75,
    postTestScore: 94,
    certifiedPracticalCourses: [],
    bookedLabs: [],
    externalRecords: []
  },
  {
    id: 'usr-kigozi',
    title: 'Dr.',
    name: 'Samuel Kigozi',
    email: 's.kigozi@jinja.go.ug',
    phone: '+256 774 221 109',
    gender: 'Male',
    cadre: 'Medical Doctor (MBChB / MD)',
    specialty: 'Emergency & Critical Care',
    country: 'Uganda',
    facilityTier: 'Regional Referral Hospital',
    location: 'Jinja Regional Referral Hospital',
    facility: 'Jinja Regional Referral Hospital',
    authorityId: 'UMDPC-14920',
    role: 'learner',
    isVerified: true,
    isPublic: true,
    cpdPoints: 18,
    pendingPoints: 4,
    boardPendingPoints: 0,
    labPendingPoints: 4,
    externalCpdPoints: 0,
    preTestScore: 70,
    postTestScore: 90,
    certifiedPracticalCourses: [],
    bookedLabs: [],
    externalRecords: []
  },
  {
    id: 'usr-mugabe',
    title: 'Dr.',
    name: 'Kenneth Mugabe',
    email: 'k.mugabe@mbale.go.ug',
    phone: '+256 701 992 114',
    gender: 'Male',
    cadre: 'Specialist Physician / Consultant',
    specialty: 'Emergency & Critical Care',
    country: 'Uganda',
    facilityTier: 'Regional Referral Hospital',
    location: 'Mbale Regional Referral Hospital',
    facility: 'Mbale Regional Referral Hospital',
    authorityId: 'UMDPC-09942',
    role: 'convener',
    isVerified: true,
    isPublic: true,
    cpdPoints: 32,
    pendingPoints: 0,
    boardPendingPoints: 0,
    labPendingPoints: 0,
    externalCpdPoints: 0,
    certifiedPracticalCourses: [],
    bookedLabs: [],
    externalRecords: []
  },
  {
    id: 'usr-nkosi',
    title: 'Prof.',
    name: 'Thabo Mbeki-Nkosi',
    email: 't.nkosi@uct.ac.za',
    phone: '+27 82 441 9022',
    gender: 'Male',
    cadre: 'Specialist Physician / Consultant',
    specialty: 'Neonatology & Child Health',
    country: 'South Africa',
    facilityTier: 'National Referral / Teaching Hospital',
    location: 'Groote Schuur Hospital, Cape Town',
    facility: 'Groote Schuur Hospital, Cape Town',
    authorityId: 'HPCSA-MP08831',
    role: 'creator',
    isVerified: true,
    isPublic: true,
    cpdPoints: 45,
    pendingPoints: 0,
    boardPendingPoints: 0,
    labPendingPoints: 0,
    externalCpdPoints: 10,
    certifiedPracticalCourses: [],
    bookedLabs: [],
    externalRecords: []
  }
];

const INITIAL_QUESTIONS = [
  {
    id: 'qa-emotive-1',
    courseId: 'course-emotive-pph',
    courseTitle: 'National EMOTIVE & Helping Mothers Survive PPH Refresher',
    studentName: 'Midwife Joy Akello',
    facility: 'Arua Regional Referral Hospital',
    timestamp: '2 hours ago',
    question:
      'In a rural HC III where Tranexamic Acid is out of stock, should we inflate the Condom-Catheter UBT before or after administering sublingual Misoprostol 800 mcg?',
    reply:
      'Professor Verified Guidance: Administer sublingual Misoprostol 800 mcg immediately while simultaneously assembling and inserting the Condom-Catheter UBT filled with 300–500 mL sterile saline to establish immediate hydrostatic tamponade.',
    isResolved: true
  },
  {
    id: 'qa-hiv-2',
    courseId: 'course-peer-ed-hiv',
    courseTitle: 'Comprehensive Peer Educator Training for HIV & PMTCT Care',
    studentName: 'Clinician David Mugisha',
    facility: 'Kawaala Health Centre IV',
    timestamp: '4 hours ago',
    question:
      'When an adolescent mother is hesitant to disclose her HIV status to her partner due to safety concerns, what is the recommended shared-confidentiality protocol?',
    reply: '',
    isResolved: false
  }
];

const INITIAL_ESCROW_QUEUE = [
  {
    id: 'esc-1',
    uid: 'usr-akello',
    name: 'Dr. Grace Akello',
    title: 'Dr.',
    cadre: 'Medical Doctor (MBChB / MD)',
    facility: 'Mulago Specialized Hospital, Kampala',
    courseId: 'course-emotive-pph',
    course: 'National EMOTIVE & Helping Mothers Survive PPH Refresher',
    pendingPoints: 15,
    preTestScore: 72,
    postTestScore: 92,
    theoryScore: 92,
    status: 'Awaiting Practical Station Assessment',
    authorityId: 'UMDPC-18402',
    certifiedPracticalCourses: []
  },
  {
    id: 'esc-2',
    uid: 'usr-immaculate',
    name: 'Midwife Ndyamuhakyi Immaculate',
    title: 'Midwife',
    cadre: 'Registered Midwife',
    facility: 'Jinja Regional Referral Hospital',
    courseId: 'course-gc1000-maternal',
    course: 'Group Antenatal and Postnatal Care (GC_1000 Framework)',
    pendingPoints: 15,
    preTestScore: 75,
    postTestScore: 94,
    theoryScore: 94,
    status: 'Awaiting Practical Station Assessment',
    authorityId: 'UNMC-44210',
    certifiedPracticalCourses: []
  },
  {
    id: 'esc-3',
    uid: 'usr-kigozi',
    name: 'Dr. Samuel Kigozi',
    title: 'Dr.',
    cadre: 'Medical Doctor (MBChB / MD)',
    facility: 'Jinja Regional Referral Hospital',
    courseId: 'course-golden-minute-nrp',
    course: 'Helping Babies Breathe: The Golden Minute Neonatal Resuscitation',
    pendingPoints: 4,
    preTestScore: 70,
    postTestScore: 90,
    theoryScore: 90,
    status: 'Awaiting Practical Station Assessment',
    authorityId: 'UMDPC-14920',
    certifiedPracticalCourses: []
  }
];

const INITIAL_VOUCHERS_ENRICHED = [
  {
    id: 'v-pamoja2026',
    code: 'PAMOJA2026',
    grantName: 'Universal Early Adopter Launch Pass',
    sponsor: 'Pamoja Faculty & Launch Scholarship',
    discountPercent: 100,
    region: 'All Regions',
    facilityTier: 'All Tiers',
    maxUses: 1000,
    usedCount: 42,
    status: 'Active',
    active: true
  },
  {
    id: 'v-free100',
    code: 'FREE100',
    grantName: 'University Faculty & Clinical Review Voucher',
    sponsor: 'Makerere University & UCT Clinical Review',
    discountPercent: 100,
    region: 'All Regions',
    facilityTier: 'All Tiers',
    maxUses: 500,
    usedCount: 14,
    status: 'Active',
    active: true
  },
  ...(SEED_PROMOS || []).map((v, idx) => ({
    ...v,
    id: v.id || `v-seed-${idx}`,
    status: v.status || (v.active === false ? 'Revoked' : 'Active'),
    active: v.active !== false && v.status !== 'Revoked'
  }))
];

function signSeedCert(certObj) {
  const canonical = buildCanonicalPayload(certObj);
  const det = computeDeterministicHexHash(canonical);
  const checksum = `PMJ-SIG-${det.slice(0, 8).toUpperCase()}-${det.slice(8, 12).toUpperCase()}`;
  const sha256Hash = certObj.sha256Hash || certObj.hash || `pmj_cert_${det.slice(0, 28)}`;
  return {
    ...certObj,
    sha256Hash,
    hash: sha256Hash,
    checksum
  };
}

const INITIAL_CERTIFICATES = [
  signSeedCert({
    id: 'cert_88291a',
    courseId: 'course-emotive-pph',
    courseTitle: 'National EMOTIVE & Helping Mothers Survive PPH Refresher',
    name: 'National EMOTIVE & Helping Mothers Survive PPH Refresher',
    learnerTitle: 'Dr.',
    learnerName: 'Sarah Nabatanzi',
    authorityId: 'UMDPC-14892',
    facility: 'Kawaala Health Centre IV',
    activityCode: 'UMDPC/CPD/2026/0892',
    credentialTier: CREDENTIAL_TIERS.RECURRING_SUSTAINED,
    tierLabel: 'Official Accredited CPD Certificate + Continued Learning Endorsed',
    issuer: 'Makerere University College of Health Sciences & WHO AFRO',
    leadProfessor: 'Prof. E. M. Achieng, MD, FRCOG',
    convenerSignOff: 'Dr. Thabo Sithole (Accredited OSCE Convener)',
    issuedDate: '2026-09-18',
    date: '2026-09-18',
    validUntil: '2027-09-18',
    cpdPoints: 16.5,
    baseCpdPoints: 15,
    sustainmentCpdBonus: 1.5,
    preTestScore: '72%',
    postTestScore: '94%',
    osceScore: '91%',
    completedModulesCount: 10,
    totalModulesCount: 10,
    recurringCompleted: [
      'Week 1 LDHF Drill: Calibrated Drape & Early Trigger (< 15 min)',
      'Week 2 LDHF Drill: Condom-Catheter UBT Assembly',
      '30-Day Follow-Up Refresher: Refractory PPH & SBAR Handover'
    ],
    hash: 'pmj_cert_e3b0c44298fc1c149afbf4c8',
    verifiedCouncil: 'UMDPC • HPCSA • KMPDC Accredited'
  }),
  signSeedCert({
    id: 'cert_nrp_302b',
    courseId: 'course-golden-minute-nrp',
    courseTitle: 'Helping Babies Breathe: The Golden Minute Neonatal Resuscitation',
    name: 'Helping Babies Breathe: The Golden Minute Neonatal Resuscitation',
    learnerTitle: 'Midwife',
    learnerName: 'Grace Akello',
    authorityId: 'UNMC-88391',
    facility: 'Arua Regional Referral Hospital',
    activityCode: 'UNMC/CPD/2026/NRP-04',
    credentialTier: CREDENTIAL_TIERS.FULL_CERTIFICATE,
    tierLabel: 'Official Accredited CPD Certificate',
    issuer: 'Makerere University CHS & American Academy of Pediatrics (HBB)',
    leadProfessor: 'Prof. N. K. Okello, MD, MMed (Paediatrics)',
    convenerSignOff: 'Kawempe National Sim Center Convener',
    issuedDate: '2026-10-12',
    date: '2026-10-12',
    validUntil: '2027-10-12',
    cpdPoints: 4,
    baseCpdPoints: 4,
    sustainmentCpdBonus: 0,
    preTestScore: '68%',
    postTestScore: '92%',
    osceScore: '89%',
    completedModulesCount: 3,
    totalModulesCount: 3,
    recurringCompleted: [],
    verifiedCouncil: 'UNMC & UMDPC Accredited'
  })
];

function readLocalCache(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;
    if (Array.isArray(fallback) && fallback.length > 0 && fallback[0]?.id) {
      const existingIds = new Set(parsed.map((item) => item?.id));
      const missingFallback = fallback.filter((item) => item?.id && !existingIds.has(item.id));
      return missingFallback.length > 0 ? [...parsed, ...missingFallback] : parsed;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function writeLocalCache(key, data) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('pamoja-rt-sync', { detail: { key } }));
  } catch {}
}

export function useRealtimeCollection(collectionName, storageKey, initialFallback = []) {
  const [items, setItems] = useState(initialFallback);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const hydrated = readLocalCache(storageKey, initialFallback);
    setItems(hydrated);

    const handleLocalSync = (e) => {
      if (!e.detail || e.detail.key === storageKey) {
        setItems(readLocalCache(storageKey, initialFallback));
      }
    };
    window.addEventListener('pamoja-rt-sync', handleLocalSync);
    window.addEventListener('storage', handleLocalSync);
    return () => {
      window.removeEventListener('pamoja-rt-sync', handleLocalSync);
      window.removeEventListener('storage', handleLocalSync);
    };
  }, [storageKey]);

  useEffect(() => {
    if (!db) return;
    let unsub = null;
    try {
      const colRef = collection(db, collectionName);
      unsub = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteDocs = [];
            snapshot.forEach((d) => remoteDocs.push({ id: d.id, ...d.data() }));
            const remoteIds = new Set(remoteDocs.map((r) => r.id));
            const localCurrent = readLocalCache(storageKey, initialFallback);
            const merged = [
              ...remoteDocs,
              ...localCurrent.filter((item) => !remoteIds.has(item.id))
            ];
            setItems(merged);
            writeLocalCache(storageKey, merged);
            setSynced(true);
          } else {
            const seedData = readLocalCache(storageKey, initialFallback);
            seedData.forEach((item) => {
              if (item.id) {
                setDoc(doc(db, collectionName, String(item.id)), item, { merge: true }).catch(
                  () => {}
                );
              }
            });
            setSynced(true);
          }
        },
        () => {
          setSynced(false);
        }
      );
    } catch {}
    return () => {
      if (unsub) unsub();
    };
  }, [collectionName, storageKey]);

  const upsertItem = useCallback(
    async (item) => {
      const id = item.id || `${collectionName}-${Date.now()}`;
      const record = { ...item, id, updatedAt: new Date().toISOString() };

      setItems((prev) => {
        const exists = prev.some((i) => i.id === id);
        const next = exists
          ? prev.map((i) => (i.id === id ? { ...i, ...record } : i))
          : [record, ...prev];
        writeLocalCache(storageKey, next);
        return next;
      });

      if (db) {
        try {
          await setDoc(doc(db, collectionName, String(id)), record, { merge: true });
        } catch {}
      }
      return record;
    },
    [collectionName, storageKey]
  );

  const removeItem = useCallback(
    async (id) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        writeLocalCache(storageKey, next);
        return next;
      });

      if (db) {
        try {
          await deleteDoc(doc(db, collectionName, String(id)));
        } catch {}
      }
    },
    [collectionName, storageKey]
  );

  return { items, setItems, upsertItem, removeItem, synced };
}

export function useRealtimePlatformData() {
  const coursesState = useRealtimeCollection('courses', STORAGE_KEYS.courses, SEED_COURSES);
  const labsState = useRealtimeCollection('labs', STORAGE_KEYS.labs, INITIAL_LABS_ENRICHED);
  const usersState = useRealtimeCollection('users', STORAGE_KEYS.users, INITIAL_USERS);
  const questionsState = useRealtimeCollection('questions', STORAGE_KEYS.questions, INITIAL_QUESTIONS);
  const certsState = useRealtimeCollection('certificates', STORAGE_KEYS.certificates, INITIAL_CERTIFICATES);
  const escrowState = useRealtimeCollection('osce_escrow', STORAGE_KEYS.escrowQueue, INITIAL_ESCROW_QUEUE);
  const vouchersState = useRealtimeCollection('vouchers', STORAGE_KEYS.vouchers, INITIAL_VOUCHERS_ENRICHED);
  const txState = useRealtimeCollection('transactions', STORAGE_KEYS.transactions, []);

  return {
    courses: coursesState.items,
    upsertCourse: coursesState.upsertItem,
    removeCourse: coursesState.removeItem,
    labs: labsState.items,
    upsertLab: labsState.upsertItem,
    removeLab: labsState.removeItem,
    usersList: usersState.items,
    upsertUserRecord: usersState.upsertItem,
    removeUserRecord: usersState.removeItem,
    questions: questionsState.items,
    upsertQuestion: questionsState.upsertItem,
    certificates: certsState.items,
    upsertCertificate: certsState.upsertItem,
    escrowLearners: escrowState.items,
    upsertEscrowLearner: escrowState.upsertItem,
    vouchers: vouchersState.items,
    upsertVoucher: vouchersState.upsertItem,
    transactions: txState.items,
    upsertTransaction: txState.upsertItem
  };
}
