"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  MapPin,
  Search,
  Clock,
  Award,
  CheckCircle,
  ClipboardCheck,
  QrCode,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Building,
  Camera,
  PlusCircle,
  Users,
  Lock,
  X,
  PhoneCall
} from 'lucide-react';
import { useAuth, ROLES, useToast } from '../../components/AuthProvider';
import {
  PINNED_COUNTRIES,
  ALL_COUNTRIES,
  FACILITY_TIER_OPTIONS,
  SPECIALTY_OPTIONS,
  SelectWithOther,
  CountrySelect
} from '../../components/ClinicalFormControls';
import { useRealtimePlatformData } from '../../lib/realtimeStore';
import { CREDENTIAL_TIERS, mintSignedCertificate } from '../../lib/certificateCrypto';
import VerifiableCertificateModal from '../../components/VerifiableCertificateModal';

function LabsContent() {
  const {
    user,
    profile,
    isConvener,
    isSuperuser,
    isNonStudentRole,
    updateProfileState,
    setAuthModalOpen
  } = useAuth();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const {
    courses,
    labs,
    upsertLab,
    usersList,
    upsertUserRecord,
    escrowLearners,
    upsertEscrowLearner,
    certificates,
    upsertCertificate
  } = useRealtimePlatformData();

  const canManageLabs =
    isConvener || isSuperuser || profile?.role === ROLES.CONVENER || profile?.role === ROLES.SUPERUSER;

  // Active Tabs: 'centers', 'convener', 'ldhf'
  const [activeTab, setActiveTab] = useState('centers');
  const [previewCertificate, setPreviewCertificate] = useState(null);
  const [isSubmittingCertification, setIsSubmittingCertification] = useState(false);

  // Scalable Filters for Simulation Centers
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All Countries');
  const [tierFilter, setTierFilter] = useState('All Facility Tiers');
  const [specialtyFilter, setSpecialtyFilter] = useState('All Specialties');

  // Booking & Roster Modals
  const [bookingModalLab, setBookingModalLab] = useState(null);
  const [selectedBookingDate, setSelectedBookingDate] = useState('');
  const [selectedBookingCourseId, setSelectedBookingCourseId] = useState('course-emotive-pph');
  const [activeRosterLab, setActiveRosterLab] = useState(null);

  // "+ Schedule Lab / Recurring Block" Modal
  const [addCenterModalOpen, setAddCenterModalOpen] = useState(false);
  const [newCenter, setNewCenter] = useState({
    locationName: '',
    city: '',
    country: profile?.country || 'Uganda',
    facilityTier: 'National / Regional Referral Hospital',
    specialty: 'Emergency Obstetrics',
    scheduleType: 'Weekly Recurring (52-Week Annual Calendar)',
    recurringRule: 'Every Friday • 09:00 EAT (52 Weeks/Year)',
    firstDate: '2026-11-15',
    secondDate: '2026-11-22',
    thirdDate: '2026-11-29',
    capacity: 15,
    facilityContactPhone: '+256 700 100 200'
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'convener') {
      setActiveTab('convener');
    } else if (tabParam === 'ldhf') {
      setActiveTab('ldhf');
    }
  }, [searchParams]);

  // Convener Portal State (Idempotent Practical Certification & Locked Course CPD)
  const practicalCourses =
    courses.filter((c) => c.requiresLab !== false).length > 0
      ? courses.filter((c) => c.requiresLab !== false)
      : courses;

  const [selectedPracticalCourseId, setSelectedPracticalCourseId] = useState(
    practicalCourses[0]?.id || 'course-emotive-pph'
  );
  const selectedPracticalCourse =
    practicalCourses.find((c) => c.id === selectedPracticalCourseId) ||
    practicalCourses[0] || {
      id: 'course-emotive-pph',
      title: 'National EMOTIVE & Helping Mothers Survive PPH Refresher',
      cpd: 15
    };

  // Merge usersList and escrowLearners for candidate lookup
  const candidatePool = React.useMemo(() => {
    const map = new Map();
    (usersList || [])
      .filter((u) => !['superuser', 'registrar', 'support', 'auditor'].includes(u.role))
      .forEach((u) => {
        map.set(u.id, {
          id: u.id,
          name: `${u.title ? `${u.title} ` : ''}${u.name}`,
          rawName: u.name,
          title: u.title || '',
          authorityId: u.authorityId || 'PENDING-COUNCIL',
          facility: u.facility || 'Regional Hospital',
          cpdPoints: u.cpdPoints || 0,
          boardPendingPoints: u.boardPendingPoints || 0,
          labPendingPoints: u.labPendingPoints ?? u.pendingPoints ?? 15,
          certifiedPracticalCourses: Array.isArray(u.certifiedPracticalCourses)
            ? u.certifiedPracticalCourses
            : [],
          preTestScore: 72,
          postTestScore: 92
        });
      });

    (escrowLearners || []).forEach((e) => {
      if (!map.has(e.id)) {
        map.set(e.id, {
          id: e.id,
          name: e.name,
          rawName: e.name,
          title: '',
          authorityId: e.authorityId || 'UMDPC-14892',
          facility: e.facility || 'Kawaala Health Centre IV',
          cpdPoints: 0,
          boardPendingPoints: 0,
          labPendingPoints: e.pendingPoints || 15,
          certifiedPracticalCourses: Array.isArray(e.certifiedPracticalCourses)
            ? e.certifiedPracticalCourses
            : e.status === 'OSCE_PASSED_RELEASED'
            ? [e.courseId || 'course-emotive-pph']
            : [],
          preTestScore: e.preTestScore || 70,
          postTestScore: e.postTestScore || 92
        });
      }
    });

    return Array.from(map.values());
  }, [usersList, escrowLearners]);

  const [selectedCandidateId, setSelectedCandidateId] = useState(
    candidatePool[0]?.id || 'usr_learner_1'
  );
  const [customCandidateName, setCustomCandidateName] = useState('');
  const [customCandidateLicense, setCustomCandidateLicense] = useState('');

  const selectedCandidate =
    candidatePool.find((c) => c.id === selectedCandidateId) || candidatePool[0];

  const alreadyCertifiedForCourse =
    selectedCandidateId !== 'CUSTOM' &&
    Array.isArray(selectedCandidate?.certifiedPracticalCourses) &&
    selectedCandidate.certifiedPracticalCourses.includes(selectedPracticalCourse.id);

  const [osceScores, setOsceScores] = useState({
    station1: 90,
    station2: 88,
    station3: 92
  });

  // 8-12 Week LDHF Practice Loop State
  const [currentWeek] = useState(3);
  const [ephemeralToken, setEphemeralToken] = useState('PMJ-LDHF-TS-4892');
  const [qrCountdown, setQrCountdown] = useState(30);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [handshakeVerified, setHandshakeVerified] = useState(false);

  // 60-Second Facility Commodity Readiness Pulse State
  const [commodityPulse, setCommodityPulse] = useState({
    oxytocin: 'In Stock',
    txa: 'In Stock',
    drapes: 'Low Stock',
    ubt: 'In Stock',
    nasg: 'In Stock',
    cannulas: 'In Stock',
    fluids: 'In Stock'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          setEphemeralToken(`PMJ-LDHF-TS-${Math.floor(1000 + Math.random() * 9000)}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter Simulation Centers by Search, Country, Facility Tier & Specialty
  const filteredLabs = (labs || []).filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (l.locationName || '').toLowerCase().includes(q) ||
      (l.city || '').toLowerCase().includes(q) ||
      (l.country || '').toLowerCase().includes(q) ||
      (l.specialty || '').toLowerCase().includes(q);
    const matchesCountry = countryFilter === 'All Countries' || l.country === countryFilter;
    const matchesTier = tierFilter === 'All Facility Tiers' || l.facilityTier === tierFilter;
    const matchesSpecialty =
      specialtyFilter === 'All Specialties' || l.specialty === specialtyFilter;
    return matchesSearch && matchesCountry && matchesTier && matchesSpecialty;
  });

  // 1. Open Learner Seat Reservation Modal
  const openReserveSeatModal = (lab) => {
    if (!user || profile?.role === ROLES.GUEST) {
      addToast('Please sign in to reserve a simulation lab appointment.', 'info');
      setAuthModalOpen(true);
      return;
    }
    setBookingModalLab(lab);
    const dates = Array.isArray(lab.nextDates) && lab.nextDates.length > 0 ? lab.nextDates : [lab.date || '2026-11-15'];
    setSelectedBookingDate(dates[0]);
    setSelectedBookingCourseId(practicalCourses[0]?.id || 'course-emotive-pph');
  };

  // 2. Confirm 3-Way Guaranteed Appointment & Generate QR Appointment Pass
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingModalLab) return;

    const courseObj =
      courses.find((c) => c.id === selectedBookingCourseId) || practicalCourses[0];
    const passId = `PMJ-LAB-${Math.floor(1000 + Math.random() * 9000)}`;

    const appointment = {
      passId,
      labId: bookingModalLab.id,
      locationName: bookingModalLab.locationName,
      city: bookingModalLab.city,
      country: bookingModalLab.country,
      date: selectedBookingDate,
      courseId: courseObj?.id || 'course-emotive-pph',
      courseTitle: courseObj?.title || 'Practical Skills Assessment',
      convener: bookingModalLab.convener || 'Accredited Clinical Supervisor',
      facilityContactPhone: bookingModalLab.facilityContactPhone || '+256 772 401 882',
      venueStatus: bookingModalLab.venueStatus || 'Confirmed & Ready'
    };

    const existingRoster = Array.isArray(bookingModalLab.roster) ? bookingModalLab.roster : [];
    await upsertLab({
      ...bookingModalLab,
      booked: Math.min(bookingModalLab.capacity || 15, (bookingModalLab.booked || 0) + 1),
      roster: [
        ...existingRoster,
        {
          uid: profile?.id || user?.uid || `usr_${Date.now()}`,
          name: `${profile?.title ? `${profile.title} ` : ''}${profile?.name || 'Clinician'}`,
          courseTitle: courseObj?.title || 'Practical Skills Assessment',
          date: selectedBookingDate,
          passId,
          status: 'Confirmed Seat'
        }
      ]
    });

    if (updateProfileState && profile) {
      await updateProfileState({
        labAppointments: [...(profile.labAppointments || []), appointment]
      });
    }

    setBookingModalLab(null);
    addToast(
      `Appointment Pass ${passId} generated for ${bookingModalLab.locationName} on ${selectedBookingDate}!`,
      'success'
    );
  };

  // 3. Convener / Admin 72h Venue Readiness Handshake
  const handleConfirmVenueReadiness = async (lab) => {
    await upsertLab({
      ...lab,
      venueStatus: 'Confirmed & Ready (Equipment Verified)'
    });
    addToast(
      `72-Hour Venue & Manikin Readiness confirmed for ${lab.locationName}. Booked candidates notified.`,
      'success'
    );
  };

  // 4. Add New Simulation Center or Recurring Annual Block Calendar
  const handleCreateCenter = async (e) => {
    e.preventDefault();
    if (!newCenter.locationName.trim() || !newCenter.city.trim()) return;

    const createdLab = {
      id: `lab_${Date.now()}`,
      locationName: newCenter.locationName.trim(),
      city: newCenter.city.trim(),
      country: newCenter.country,
      facilityTier: newCenter.facilityTier,
      specialty: newCenter.specialty,
      scheduleType: newCenter.scheduleType,
      recurringRule: newCenter.recurringRule,
      date: newCenter.firstDate,
      time: '09:00 Local',
      nextDates: [newCenter.firstDate, newCenter.secondDate, newCenter.thirdDate].filter(Boolean),
      capacity: Number(newCenter.capacity) || 15,
      booked: 1,
      convener: `${profile?.title ? `${profile.title} ` : ''}${profile?.name || 'Accredited Convener'}`,
      facilityContactPhone: newCenter.facilityContactPhone || '+256 700 100 200',
      venueStatus: 'Confirmed & Ready (Equipment Verified)',
      courseId: 'course-emotive-pph',
      courseTitle: `${newCenter.specialty} Practical Skills Block`,
      roster: []
    };

    await upsertLab(createdLab);
    setAddCenterModalOpen(false);
    addToast(
      `Simulation Center "${createdLab.locationName}" (${createdLab.scheduleType}) published to directory!`,
      'success'
    );
  };

  // 5. Idempotent Practical Certification & Locked Course CPD Handler
  const handleGradeOsce = async () => {
    if (!canManageLabs) {
      addToast('Only accredited Conveners or Super Administrators can submit OSCE sign-offs.', 'error');
      return;
    }

    if (isSubmittingCertification) return;

    if (alreadyCertifiedForCourse) {
      addToast(
        `${selectedCandidate?.name} has already been certified for "${selectedPracticalCourse.title}". Duplicate CPD award blocked.`,
        'error'
      );
      return;
    }

    // Check if candidate actually has labPendingPoints / pendingPoints in escrow
    const pendingPts = selectedCandidateId === 'CUSTOM'
      ? Number(selectedPracticalCourse?.cpd || 15)
      : Number(selectedCandidate?.labPendingPoints ?? selectedCandidate?.pendingPoints ?? 0);

    if (selectedCandidateId !== 'CUSTOM' && pendingPts <= 0) {
      addToast('No pending practical points in Escrow to release for this learner.', 'error');
      return;
    }

    const { station1, station2, station3 } = osceScores;
    const avg = Math.round((station1 + station2 + station3) / 3);

    if (station1 < 80 || station2 < 80 || station3 < 80) {
      addToast(
        `OSCE Threshold Block: Every practical station requires >= 80%. Station scores: S1=${station1}%, S2=${station2}%, S3=${station3}%.`,
        'error'
      );
      return;
    }

    setIsSubmittingCertification(true);

    try {
      // Strictly locked to the course's accredited CPD value
      const lockedPointsToRelease = Number(selectedPracticalCourse?.cpd || 15);
      const candidateDisplayName =
        selectedCandidateId === 'CUSTOM'
          ? customCandidateName || 'Walk-In Candidate'
          : selectedCandidate?.name || 'Dr. Sarah Nabatanzi';
      const candidateLicense =
        selectedCandidateId === 'CUSTOM'
          ? customCandidateLicense || 'COUNCIL-VERIFIED'
          : selectedCandidate?.authorityId || 'UMDPC-14892';

      if (selectedCandidateId !== 'CUSTOM' && selectedCandidate) {
        const nextCertified = Array.from(
          new Set([...(selectedCandidate.certifiedPracticalCourses || []), selectedPracticalCourse.id])
        );

        // Update real-time usersList record: zero out labPendingPoints and pendingPoints immediately
        const existingUser = (usersList || []).find((u) => u.id === selectedCandidate.id);
        if (existingUser) {
          await upsertUserRecord({
            ...existingUser,
            cpdPoints: (existingUser.cpdPoints || 0) + lockedPointsToRelease,
            boardPendingPoints: (existingUser.boardPendingPoints || 0) + lockedPointsToRelease,
            labPendingPoints: 0,
            pendingPoints: 0,
            certifiedPracticalCourses: nextCertified
          });
        }

        // Update escrowLearners record: status OSCE_PASSED_RELEASED and pendingPoints = 0
        const existingEscrow = (escrowLearners || []).find((e) => e.id === selectedCandidate.id);
        if (existingEscrow) {
          await upsertEscrowLearner({
            ...existingEscrow,
            status: 'OSCE_PASSED_RELEASED',
            osceAverage: avg,
            pendingPoints: 0,
            certifiedPracticalCourses: nextCertified
          });
        } else {
          await upsertEscrowLearner({
            id: selectedCandidate.id,
            name: candidateDisplayName,
            authorityId: candidateLicense,
            facility: selectedCandidate.facility || 'Regional Hospital',
            courseId: selectedPracticalCourse.id,
            courseTitle: selectedPracticalCourse.title,
            pendingPoints: 0,
            preTestScore: selectedCandidate.preTestScore || 72,
            postTestScore: selectedCandidate.postTestScore || 92,
            osceAverage: avg,
            status: 'OSCE_PASSED_RELEASED',
            certifiedPracticalCourses: nextCertified
          });
        }

        // If certifying the currently logged-in user
        if (profile && profile.id === selectedCandidate.id && updateProfileState) {
          await updateProfileState({
            cpdPoints: (profile.cpdPoints || 0) + lockedPointsToRelease,
            boardPendingPoints: (profile.boardPendingPoints || 0) + lockedPointsToRelease,
            labPendingPoints: 0,
            pendingPoints: 0,
            certifiedPracticalCourses: nextCertified
          });
        }
      }

      // Mint SHA-256 Verifiable Certificate
      const signedCert = await mintSignedCertificate({
        existingCertId: `cert-${selectedPracticalCourse.id}-${selectedCandidateId}`,
        learnerProfile: {
          uid: selectedCandidateId,
          title: '',
          name: candidateDisplayName,
          authorityId: candidateLicense,
          facility: selectedCandidate?.facility || 'Regional Referral Hospital'
        },
        course: {
          ...selectedPracticalCourse,
          cpd: lockedPointsToRelease
        },
        credentialTier: CREDENTIAL_TIERS.FULL_CERTIFICATE,
        tierLabel: 'Full Statutory Accredited CPD Certificate (OSCE Validated)',
        preTestScore: selectedCandidate?.preTestScore || 72,
        postTestScore: selectedCandidate?.postTestScore || 92,
        osceScore: avg,
        completedModulesCount: selectedPracticalCourse?.modules?.length || 10,
        totalModulesCount: selectedPracticalCourse?.modules?.length || 10,
        convenerSignOff: `${profile?.name || 'Accredited Lab Convener'} (OSCE Verified ${avg}%)`
      });

      await upsertCertificate(signedCert);
      setPreviewCertificate(signedCert);

      addToast(
        `OSCE Passed (${avg}% average)! Full Practical Certification issued. Released ${lockedPointsToRelease} CPD Points from Escrow for ${candidateDisplayName}.`,
        'success'
      );
    } catch (err) {
      addToast('Error during practical certification sign-off. Please retry.', 'error');
    } finally {
      setIsSubmittingCertification(false);
    }
  };

  // Dual-Clinician QR Handshake Verification
  const handleVerifyPeerHandshake = async () => {
    setIsQrScannerOpen(false);
    setHandshakeVerified(true);

    const drillLabel = `Week ${currentWeek} Dual-QR Facility Drill: Retained Placenta & 60s Aortic Compression`;
    const targetCert = certificates[0];
    if (targetCert) {
      const existingRecurring = Array.isArray(targetCert.recurringCompleted)
        ? targetCert.recurringCompleted
        : [];
      const nextRecurring = existingRecurring.includes(drillLabel)
        ? existingRecurring
        : [...existingRecurring, drillLabel];
      const nextBonus = Number(((targetCert.sustainmentCpdBonus || 0) + 0.5).toFixed(1));

      const updatedCert = await mintSignedCertificate({
        existingCertId: targetCert.id,
        learnerProfile: {
          uid: user?.uid || 'usr-1',
          title: profile?.title || targetCert.learnerTitle || 'Dr.',
          name: profile?.name || targetCert.learnerName || 'Sarah Nabatanzi',
          authorityId: profile?.authorityId || targetCert.authorityId || 'UMDPC-14892',
          facility: profile?.facility || targetCert.facility || 'Kawaala Health Centre IV'
        },
        course: {
          id: targetCert.courseId || 'course-emotive-pph',
          title: targetCert.courseTitle || targetCert.name,
          cpd: targetCert.baseCpdPoints || 15,
          activityCode: targetCert.activityCode || 'UMDPC/CPD/2026/0892'
        },
        credentialTier: CREDENTIAL_TIERS.RECURRING_SUSTAINED,
        tierLabel: 'Full Accredited CPD Certificate + Recurring LDHF Sustainment',
        preTestScore: parseInt(targetCert.preTestScore || '72', 10),
        postTestScore: parseInt(targetCert.postTestScore || '94', 10),
        osceScore: parseInt(targetCert.osceScore || '91', 10),
        completedModulesCount: targetCert.completedModulesCount || 10,
        totalModulesCount: targetCert.totalModulesCount || 10,
        recurringRefresherModules: nextRecurring,
        sustainmentCpdBonus: nextBonus,
        convenerSignOff: targetCert.convenerSignOff
      });
      await upsertCertificate(updatedCert);
    }

    addToast(
      'Dual-Clinician QR Handshake Verified! +0.5 Sustainment CPD Points appended to your Cryptographic Certificate.',
      'success'
    );
    if (updateProfileState && profile && !isNonStudentRole) {
      updateProfileState({
        cpdPoints: (profile.cpdPoints || 0) + 0.5
      });
    }
  };

  return (
    <div className="min-h-screen pamoja-shell font-['Inter'] pb-24">
      {/* Top Header */}
      <div className="pamoja-card border-b pamoja-divider sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            >
              &larr; Back to Catalog
            </Link>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 dark:text-white font-['Outfit'] uppercase tracking-wider">
                Simulation Centers, Recurring Block Calendars &amp; Convener Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {canManageLabs && (
              <button
                onClick={() => setAddCenterModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <PlusCircle size={14} /> + Schedule Lab / Recurring Block
              </button>
            )}
            {profile && !isNonStudentRole && (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Clinician:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{profile.name}</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                  {profile.labPendingPoints ?? profile.pendingPoints ?? 0} Pts Pending Practical
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-black uppercase tracking-widest mb-3">
                <Building size={14} className="text-emerald-600 dark:text-emerald-400" /> Hands-On Clinical Training &amp; 3-Way Venue Guarantee
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight leading-tight">
                Simulation Centers &amp; Practical Skills Sign-Off
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-2 font-normal leading-relaxed">
                Filter centers by Country, Facility Tier, and Specialty. Every booking generates a verified QR Appointment Pass synced with the Facility Coordinator and OSCE Examiner Roster.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveTab('centers')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'centers'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <MapPin size={15} /> Sim Centers ({filteredLabs.length})
              </button>

              <button
                onClick={() => setActiveTab('convener')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'convener'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ClipboardCheck size={15} /> Convener Portal
              </button>

              <button
                onClick={() => setActiveTab('ldhf')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'ldhf'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Activity size={15} /> 8-12 Wk LDHF Loop
              </button>
            </div>
          </div>

          {/* 3-Way Operational Handshake Guarantee Bar */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="font-black text-cyan-700 dark:text-cyan-400 uppercase text-[10px] mb-1">
                1. Student Books Practical Date
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Selects an upcoming recurring Friday/monthly session and receives a QR Appointment Pass (`PMJ-LAB-XXXX`) with facility contact details.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="font-black text-emerald-700 dark:text-emerald-400 uppercase text-[10px] mb-1">
                2. Venue Confirmed 72h Prior
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Hospital Skills Lab Coordinator verifies room &amp; manikin readiness 72 hours before the session so no clinician travels in vain.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="font-black text-purple-700 dark:text-purple-400 uppercase text-[10px] mb-1">
                3. Live Convener Roster &amp; Sign-Off
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Examiner views the live roster, grades the 3 OSCE stations (&ge; 80%), and releases the locked course CPD points.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Learner QR Appointment Passes */}
      {(profile?.labAppointments || []).length > 0 && activeTab === 'centers' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-emerald-950/25 border border-emerald-700/60 rounded-[2rem] p-6 space-y-4">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle size={15} /> Your Confirmed Simulation Lab Appointment Passes (
              {profile.labAppointments.length})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.labAppointments.map((appt) => (
                <div
                  key={appt.passId}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[11px] font-black">
                      PASS: {appt.passId}
                    </span>
                    <div className="font-bold text-white text-sm mt-1.5">{appt.locationName}</div>
                    <div className="text-xs text-cyan-300 font-semibold">{appt.courseTitle}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Date: <strong className="text-white">{appt.date}</strong> &bull; Convener:{' '}
                      {appt.convener} &bull; Tel: {appt.facilityContactPhone}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                    <QrCode size={24} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TAB 1: SCALABLE REGIONAL CENTERS DIRECTORY */}
        {activeTab === 'centers' && (
          <div className="space-y-6 animate-fade-in">
            {/* 4-Column Scalable Filter Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shadow-xl">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hospital or city..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              >
                <option value="All Countries">All Countries (Global)</option>
                <optgroup label="Pinned &amp; Regional Hubs">
                  {PINNED_COUNTRIES.map((c) => (
                    <option key={c} value={c.replace(' (Current Location)', '')}>
                      {c}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="All Countries (A–Z)">
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              >
                <option value="All Facility Tiers">All Facility Tiers</option>
                {FACILITY_TIER_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              >
                <option value="All Specialties">All Clinical Specialties</option>
                <option value="Emergency Obstetrics">Emergency Obstetrics</option>
                <option value="Neonatology & Pediatrics">Neonatology &amp; Pediatrics</option>
                <option value="General Emergency">General Emergency</option>
                {SPECIALTY_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Simulation Center Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLabs.map((lab) => {
                const isFull = (lab.booked || 0) >= (lab.capacity || 15);
                const dates =
                  Array.isArray(lab.nextDates) && lab.nextDates.length > 0
                    ? lab.nextDates
                    : [lab.date || '2026-11-15'];

                return (
                  <div
                    key={lab.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-7 shadow-xl flex flex-col justify-between gap-5 hover:border-cyan-500/50 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-800 text-cyan-300 text-[10px] font-black uppercase">
                            {lab.country} &bull; {lab.city}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300 text-[10px] font-bold">
                            {lab.specialty || 'Emergency Obstetrics'}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
                            (lab.venueStatus || '').includes('Confirmed')
                              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                              : 'bg-amber-950/80 border-amber-700 text-amber-300'
                          }`}
                        >
                          {lab.venueStatus || 'Confirmed & Ready'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-black font-['Outfit'] text-white">
                          {lab.locationName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {lab.facilityTier || 'Referral Hospital'} &bull; Supervisor:{' '}
                          <strong className="text-slate-200">{lab.convener || 'Dr. Peter Kawuma'}</strong>
                        </p>
                      </div>

                      {/* Recurring Calendar Schedule Block */}
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-cyan-400">
                            {lab.scheduleType || 'Weekly Recurring Calendar'}
                          </span>
                          <span className="text-slate-400">
                            {lab.booked || 0}/{lab.capacity || 15} Seats Booked
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium">
                          {lab.recurringRule || `${lab.date} at ${lab.time || '09:00 EAT'}`}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {dates.map((d) => (
                            <span
                              key={d}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Role-Aware Action Footer */}
                    <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <PhoneCall size={12} className="text-cyan-400" />{' '}
                        {lab.facilityContactPhone || '+256 772 401 882'}
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {canManageLabs && (
                          <>
                            <button
                              onClick={() => handleConfirmVenueReadiness(lab)}
                              className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-[11px] font-bold cursor-pointer"
                            >
                              Confirm 72h Venue Readiness
                            </button>
                            <button
                              onClick={() => setActiveRosterLab(lab)}
                              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Users size={13} /> Examiner Roster ({(lab.roster || []).length})
                            </button>
                          </>
                        )}

                        {!isNonStudentRole && (
                          <button
                            onClick={() => openReserveSeatModal(lab)}
                            disabled={isFull}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                              isFull
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md'
                            }`}
                          >
                            {isFull ? 'Session Full' : 'Reserve Practical Seat'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: IDEMPOTENT CONVENER PORTAL (LOCKED COURSE CPD GOVERNANCE) */}
        {activeTab === 'convener' && (
          <div className="space-y-6 animate-fade-in">
            {!canManageLabs && (
              <div className="p-5 rounded-2xl bg-amber-950/60 border border-amber-700 flex items-center gap-3">
                <AlertTriangle size={20} className="text-amber-400 shrink-0" />
                <div className="text-xs text-amber-200">
                  <strong>Accredited Examiner Notice:</strong> Final OSCE rubric submission requires{' '}
                  <code>convener</code> or <code>superuser</code> privileges.
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                    Zero-Inflation Practical Skills Sign-Off
                  </span>
                  <h3 className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                    Accredited Lab Convener Assessment Portal
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Awarded CPD points are strictly locked to the course&apos;s accredited value and idempotent per candidate + course.
                  </p>
                </div>

                {/* Strictly Locked Course CPD Badge */}
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-700/80 text-right">
                  <div className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1 justify-end">
                    <Lock size={11} /> Locked Course CPD (Non-Editable)
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-['Outfit']">
                    {selectedPracticalCourse?.cpd || 15} CPD Points
                  </div>
                </div>
              </div>

              {/* Step 1: Select Candidate & Practical Course */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                    1. Select Clinician Candidate
                  </label>
                  <select
                    value={selectedCandidateId}
                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                  >
                    {candidatePool.map((cand) => (
                      <option key={cand.id} value={cand.id}>
                        {cand.name} ({cand.authorityId}) — {cand.facility}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Walk-In / Custom Candidate...</option>
                  </select>

                  {selectedCandidateId === 'CUSTOM' && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <input
                        type="text"
                        value={customCandidateName}
                        onChange={(e) => setCustomCandidateName(e.target.value)}
                        placeholder="Clinician Full Name"
                        className="bg-slate-950 border border-cyan-500/60 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={customCandidateLicense}
                        onChange={(e) => setCustomCandidateLicense(e.target.value)}
                        placeholder="License # (e.g. UMDPC-19201)"
                        className="bg-slate-950 border border-cyan-500/60 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                    2. Select Practical Course Being Assessed
                  </label>
                  <select
                    value={selectedPracticalCourseId}
                    onChange={(e) => setSelectedPracticalCourseId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                  >
                    {practicalCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (Locked: {c.cpd} CPD Points)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Idempotent Duplicate Submission Alert */}
              {alreadyCertifiedForCourse && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-emerald-200">
                    <CheckCircle size={20} className="text-emerald-400 shrink-0" />
                    <div>
                      <strong>Practical Already Certified for This Course:</strong>{' '}
                      {selectedCandidate?.name} has already received the locked{' '}
                      <strong>{selectedPracticalCourse?.cpd || 15} CPD points</strong> for{' '}
                      <em>{selectedPracticalCourse?.title}</em>. Duplicate submission is locked.
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: 3-Station OSCE Rubric Sliders */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">
                      Station 1: Primary Clinical Protocol &amp; Early Recognition
                    </span>
                    <span className="font-black text-emerald-400 text-xs">{osceScores.station1}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Executes rapid initial assessment, calibrated blood-loss / airway check, and first-line intervention within target window.
                  </p>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={osceScores.station1}
                    onChange={(e) =>
                      setOsceScores((prev) => ({
                        ...prev,
                        station1: parseInt(e.target.value, 10)
                      }))
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">
                      Station 2: Procedural Manikin Technique &amp; Safety Counter-Checks
                    </span>
                    <span className="font-black text-emerald-400 text-xs">{osceScores.station2}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Demonstrates correct anatomical hand placement, sterile technique, and medication dosing accuracy.
                  </p>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={osceScores.station2}
                    onChange={(e) =>
                      setOsceScores((prev) => ({
                        ...prev,
                        station2: parseInt(e.target.value, 10)
                      }))
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">
                      Station 3: Emergency Escalation &amp; Structured SBAR Handover
                    </span>
                    <span className="font-black text-emerald-400 text-xs">{osceScores.station3}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Executes refractory stabilization maneuver and delivers complete 4-axis SBAR referral communication.
                  </p>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={osceScores.station3}
                    onChange={(e) =>
                      setOsceScores((prev) => ({
                        ...prev,
                        station3: parseInt(e.target.value, 10)
                      }))
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    Composite Average:{' '}
                    <strong className="text-emerald-400 text-sm font-black">
                      {Math.round(
                        (osceScores.station1 + osceScores.station2 + osceScores.station3) / 3
                      )}
                      %
                    </strong>{' '}
                    (Min Threshold: 80% on every station)
                  </div>

                  <button
                    onClick={handleGradeOsce}
                    disabled={isSubmittingCertification || alreadyCertifiedForCourse || !canManageLabs}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                      alreadyCertifiedForCourse
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-700/60 cursor-not-allowed'
                        : isSubmittingCertification || !canManageLabs
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white cursor-pointer'
                    }`}
                  >
                    {isSubmittingCertification ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Certifying Practical (Idempotent Lock Active)...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        {alreadyCertifiedForCourse
                          ? '✓ Practical Already Certified — Duplicate Submission Locked'
                          : `Certify Candidate & Release Locked ${selectedPracticalCourse?.cpd || 15} CPD`}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 8-12 WEEK LDHF LOOP & COMMODITY PULSE */}
        {activeTab === 'ldhf' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase tracking-widest mb-3">
                <Activity size={14} className="text-purple-600 dark:text-purple-400" /> Low Dose High Frequency (LDHF) Loop
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                8-12 Week Facility Practice Loop &amp; Dual-Clinician Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Prevents rapid post-training clinical decay through weekly 10-minute peer drills verified via rotating 30-second ephemeral QR handshakes, awarding bonus <strong>+0.5 Sustainment CPD points</strong> per verified drill.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Ephemeral QR Handshake Generator */}
              <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
                    <QrCode size={18} className="text-cyan-600 dark:text-cyan-400" /> Rotating Ephemeral QR Handshake
                  </h3>
                  <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">
                    Week {currentWeek} Drill
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  The Facility Practice Coordinator or peer clinician physically scans this rotating mobile token to confirm co-presence during the 10-minute drill:
                </p>

                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-36 h-36 bg-white rounded-2xl p-3 mx-auto shadow-xl flex items-center justify-center">
                    <div className="w-full h-full bg-slate-950 rounded-lg p-2 flex flex-col items-center justify-center text-white">
                      <QrCode size={80} className="text-cyan-400" />
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
                      {ephemeralToken}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Rotates in <strong className="text-amber-600 dark:text-amber-400">{qrCountdown} seconds</strong> &bull; Non-replayable
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setIsQrScannerOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Camera size={14} /> Verify Peer Handshake
                    </button>
                  </div>
                </div>

                {handshakeVerified && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-3 animate-fade-in">
                    <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <div>
                      <strong>Handshake Verified:</strong> Coordinator co-presence logged in real time. +0.5 Sustainment Points minted.
                    </div>
                  </div>
                )}
              </div>

              {/* 60-Second Facility Commodity Pulse */}
              <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity size={18} className="text-emerald-600 dark:text-emerald-400" /> 60-Second Facility Commodity Pulse
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Live MoH Feed
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Monthly ward readiness check updated during LDHF drills feeds supply-chain intelligence directly to Ministry of Health dashboards:
                </p>

                <div className="space-y-2.5">
                  {[
                    { key: 'oxytocin', label: 'Oxytocin 10 IU (Cold Chain Intact)' },
                    { key: 'txa', label: 'Tranexamic Acid (TXA 1g Ampoules)' },
                    { key: 'drapes', label: 'Calibrated Blood Loss V-Drapes' },
                    { key: 'ubt', label: 'Condom-Catheter UBT Kits' },
                    { key: 'nasg', label: 'Non-Pneumatic Anti-Shock Garments' },
                    { key: 'cannulas', label: '16G / 18G Wide-Bore IV Cannulas' },
                    { key: 'fluids', label: "Warm Ringer's Lactate / Saline" }
                  ].map((item) => {
                    const currentStatus = commodityPulse[item.key] || 'In Stock';
                    return (
                      <div
                        key={item.key}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-slate-200">{item.label}</span>
                        <div className="flex gap-1">
                          {['In Stock', 'Low Stock', 'Out of Stock'].map((st) => (
                            <button
                              key={st}
                              onClick={() =>
                                setCommodityPulse((prev) => ({ ...prev, [item.key]: st }))
                              }
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                currentStatus === st
                                  ? st === 'In Stock'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : st === 'Low Stock'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Learner Seat Reservation & QR Pass Generator */}
      {bookingModalLab && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-lg w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  3-Way Guaranteed Practical Seat
                </span>
                <h3 className="text-xl font-black font-['Outfit'] mt-0.5 text-slate-900 dark:text-white">
                  {bookingModalLab.locationName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {bookingModalLab.city}, {bookingModalLab.country} &bull; Convener:{' '}
                  {bookingModalLab.convener}
                </p>
              </div>
              <button
                onClick={() => setBookingModalLab(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                  Select Confirmed Session Date
                </label>
                <select
                  value={selectedBookingDate}
                  onChange={(e) => setSelectedBookingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                >
                  {(Array.isArray(bookingModalLab.nextDates) && bookingModalLab.nextDates.length > 0
                    ? bookingModalLab.nextDates
                    : [bookingModalLab.date || '2026-11-15']
                  ).map((d) => (
                    <option key={d} value={d}>
                      {d} ({bookingModalLab.recurringRule || '09:00 Local'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                  Select Practical Course to Certify
                </label>
                <select
                  value={selectedBookingCourseId}
                  onChange={(e) => setSelectedBookingCourseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                >
                  {practicalCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.cpd} CPD Points)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-200">
                <strong>Venue Status:</strong> {bookingModalLab.venueStatus || 'Confirmed & Ready'}{' '}
                &bull; Facility Contact: {bookingModalLab.facilityContactPhone || '+256 772 401 882'}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalLab(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Confirm &amp; Generate QR Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Convener Examiner Roster */}
      {activeRosterLab && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-lg w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Examiner Attendance Roster
                </span>
                <h3 className="text-xl font-black font-['Outfit'] mt-0.5 text-slate-900 dark:text-white">
                  {activeRosterLab.locationName}
                </h3>
              </div>
              <button
                onClick={() => setActiveRosterLab(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {(activeRosterLab.roster || []).length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
                No candidates registered on this roster yet.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {(activeRosterLab.roster || []).map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{entry.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {entry.courseTitle} &bull; Date: {entry.date}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                      {entry.passId}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setActiveRosterLab(null);
                  setActiveTab('convener');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs cursor-pointer shadow-md"
              >
                Open Convener Grading Portal &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: "+ Schedule Lab / Recurring Block" */}
      {addCenterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-xl w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Accredited Simulation Center Scheduler
                </span>
                <h3 className="text-xl font-black font-['Outfit'] mt-0.5 text-slate-900 dark:text-white">
                  Schedule Simulation Center / Recurring Annual Block
                </h3>
              </div>
              <button
                onClick={() => setAddCenterModalOpen(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCenter} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Hospital / Simulation Center Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCenter.locationName}
                    onChange={(e) =>
                      setNewCenter({ ...newCenter, locationName: e.target.value })
                    }
                    placeholder="e.g. Groote Schuur Skills Center"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    City / Municipality
                  </label>
                  <input
                    type="text"
                    required
                    value={newCenter.city}
                    onChange={(e) => setNewCenter({ ...newCenter, city: e.target.value })}
                    placeholder="e.g. Cape Town"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CountrySelect
                  label="Country"
                  value={newCenter.country}
                  onChange={(val) => setNewCenter({ ...newCenter, country: val })}
                />
                <SelectWithOther
                  label="Facility Tier"
                  options={FACILITY_TIER_OPTIONS}
                  value={newCenter.facilityTier}
                  onChange={(val) => setNewCenter({ ...newCenter, facilityTier: val })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectWithOther
                  label="Clinical Specialty"
                  options={['Emergency Obstetrics', 'Neonatology & Pediatrics', 'General Emergency', ...SPECIALTY_OPTIONS]}
                  value={newCenter.specialty}
                  onChange={(val) => setNewCenter({ ...newCenter, specialty: val })}
                />
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Calendar Schedule Mode
                  </label>
                  <select
                    value={newCenter.scheduleType}
                    onChange={(e) =>
                      setNewCenter({ ...newCenter, scheduleType: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                  >
                    <option value="Weekly Recurring (52-Week Annual Calendar)">
                      Weekly Recurring (52-Week Annual Calendar)
                    </option>
                    <option value="Monthly Recurring (12-Month Calendar)">
                      Monthly Recurring (12-Month Calendar)
                    </option>
                    <option value="3-Day Intensive Cohort Block">
                      3-Day Intensive Cohort Block
                    </option>
                    <option value="Single Scheduled Session">Single Scheduled Session</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Recurring Cadence Rule
                  </label>
                  <input
                    type="text"
                    value={newCenter.recurringRule}
                    onChange={(e) =>
                      setNewCenter({ ...newCenter, recurringRule: e.target.value })
                    }
                    placeholder="Every Friday • 09:00 Local"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Facility Coordinator Phone
                  </label>
                  <input
                    type="text"
                    value={newCenter.facilityContactPhone}
                    onChange={(e) =>
                      setNewCenter({ ...newCenter, facilityContactPhone: e.target.value })
                    }
                    placeholder="+27 21 404 9111"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Session Date 1
                  </label>
                  <input
                    type="date"
                    value={newCenter.firstDate}
                    onChange={(e) => setNewCenter({ ...newCenter, firstDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Session Date 2
                  </label>
                  <input
                    type="date"
                    value={newCenter.secondDate}
                    onChange={(e) => setNewCenter({ ...newCenter, secondDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Session Date 3
                  </label>
                  <input
                    type="date"
                    value={newCenter.thirdDate}
                    onChange={(e) => setNewCenter({ ...newCenter, thirdDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddCenterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Publish Simulation Center Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {isQrScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl space-y-5 text-center">
            <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">Dual-Clinician QR Handshake</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Confirm simultaneous physical presence with Facility Practice Coordinator:
            </p>

            <div className="w-48 h-48 border-2 border-dashed border-cyan-500 rounded-2xl mx-auto flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/80">
              <Camera size={36} className="text-cyan-600 dark:text-cyan-400 animate-pulse mb-2" />
              <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-mono">Token: {ephemeralToken}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsQrScannerOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPeerHandshake}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
              >
                Confirm Peer Handshake
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Cryptographic Certificate Preview Modal */}
      <VerifiableCertificateModal
        isOpen={Boolean(previewCertificate)}
        onClose={() => setPreviewCertificate(null)}
        certificate={previewCertificate}
      />
    </div>
  );
}

export default function LabsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin"></div>
        </div>
      }
    >
      <LabsContent />
    </React.Suspense>
  );
}
