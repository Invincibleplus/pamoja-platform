"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { useRealtimePlatformData } from '../../lib/realtimeStore';
import { getCourseFormatBadge } from '../../lib/seedCourses';
import {
  parseCurriculumDocumentToModules,
  parseRawCurriculumIntoModules
} from '../../lib/curriculumParser';
import StandardizedVideoPlayer from '../../components/StandardizedVideoPlayer';

import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  MessageCircle,
  PlusCircle,
  Sparkles,
  Brain,
  Activity,
  Award,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Save,
  X,
  Shield,
  Upload,
  Send,
  ExternalLink,
  Lock,
  PlayCircle,
  Building,
  Stethoscope,
  Layers,
  Check,
  Zap,
  Video,
  HardDrive,
  Globe,
  HelpCircle,
  FolderPlus,
  Link2
} from 'lucide-react';

export default function EducatorStudio() {
  const { user, profile, loginWithGoogle } = useAuth();
  const {
    courses,
    upsertCourse,
    removeCourse,
    labs,
    upsertLab,
    removeLab,
    questions,
    upsertQuestion,
    escrowLearners,
    transactions
  } = useRealtimePlatformData();

  // Navigation Tabs: 'dashboard', 'courses', 'pathways', 'labs', 'students', 'qa'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Authoring & Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [activeEditorModuleIdx, setActiveEditorModuleIdx] = useState(0);
  const [previewVideoModuleIdx, setPreviewVideoModuleIdx] = useState(null);
  const [generatingQuizModuleIdx, setGeneratingQuizModuleIdx] = useState(null);
  const [saveBannerMessage, setSaveBannerMessage] = useState('');

  const createDefaultModule = (modNum) => ({
    title: `Module ${modNum}: Clinical Assessment & Evidence-Based Protocol`,
    mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    topics: [
      {
        title: `Topic ${modNum}.1: Pathophysiology & Quantitative Diagnostic Triggers`,
        seatTimeMinutes: 45,
        competencyTag: `COMP-0${modNum}A`,
        videoUrl: '',
        videoStartTime: 0,
        videoEndTime: 300,
        content:
          'Comprehensive clinical lecture synthesis. Detail the underlying physiological mechanisms, early bedside warning signs, and evidence-based diagnostic thresholds required before initiating intervention.',
        goldProtocol:
          'Tertiary Hospital Protocol: Continuous electronic physiological monitoring, calibrated volumetric collection, immediate laboratory panel, and multidisciplinary specialist activation.',
        ruralProtocol:
          'HC III / IV Resource-Adapted Protocol: Bedside Shock Index (HR / SBP) calculation every 15 minutes, gravimetric pad weighing (1g = 1mL), first-line heat-stable pharmacology, and early SBAR referral preparation.',
        resources: [
          {
            title: `Module ${modNum} Wall Algorithm & Dosage Chart (PDF)`,
            type: 'PDF Pocket Chart',
            url: 'https://www.who.int/publications/i/item/9789240085299'
          }
        ]
      }
    ],
    quiz: [
      {
        question: `In Module ${modNum}, what is the primary clinical advantage of objective bedside trigger thresholds over subjective visual impression?`,
        options: [
          'Visual impression consistently overestimates severity and wastes medications.',
          'Objective triggers detect occult physiological decompensation 30-50% earlier, enabling timely bundle activation.',
          'Objective triggers are only needed for administrative insurance billing.',
          'Objective triggers replace the need for physical examination.'
        ],
        correctIndex: 1,
        optionFeedback: [
          'Incorrect. Subjective visual impression typically underestimates rather than overestimates clinical deterioration.',
          'Correct! Clinical evidence confirms objective triggers identify compensated shock and threshold events significantly earlier.',
          'Incorrect. Bedside triggers are life-saving clinical decision tools, not billing formalities.',
          'Incorrect. Physical examination remains mandatory alongside quantitative monitoring.'
        ],
        explanation:
          'Objective quantitative triggers eliminate observer bias and initiate life-saving resuscitation within the golden therapeutic window.'
      }
    ],
    simulation: null
  });

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Maternal Health',
    instructor: profile?.name || 'Prof. Clinical Faculty',
    institution: profile?.facility || 'University Teaching Hospital',
    accreditationCode: 'UMDPC / MoH-CPD-2026',
    cpd: 15,
    duration: 40,
    pricingModel: 'freemium',
    freePreviewModules: 1,
    price: 49,
    status: 'Published',
    videoHostingMode: 'external', // 'external' ($0 fee) | 'managed_drive' ($0 upfront, 2.5% on paid sales)
    sharedDriveFolderUrl: 'https://drive.google.com/drive/folders/1PamojaFacultySharedVault',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
    requiresLab: true,
    modules: [createDefaultModule(1)]
  });

  // AI Compiler Modals
  const [isCompilerOpen, setIsCompilerOpen] = useState(false);
  const [compilerTitleInput, setCompilerTitleInput] = useState('');
  const [compilerCategoryInput, setCompilerCategoryInput] = useState('Maternal Health');
  const [compilerInput, setCompilerInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // No-Code Simulation Generator Modals
  const [isSimGenOpen, setIsSimGenOpen] = useState(false);
  const [simGenTargetModule, setSimGenTargetModule] = useState(0);
  const [simGenEngine, setSimGenEngine] = useState('engineA');
  const [simGenTopicContext, setSimGenTopicContext] = useState('');
  const [isGeneratingSim, setIsGeneratingSim] = useState(false);
  const [generatedSimData, setGeneratedSimData] = useState(null);

  // Cross-Course AI Precision Pathway Architect State
  const [pathwayGoal, setPathwayGoal] = useState(
    'Managing HIV-Positive Pregnant Adolescents with High PPH Risk and Culturally Sensitive Family Counseling'
  );
  const [isSynthesizingPathway, setIsSynthesizingPathway] = useState(false);
  const [customPathway, setCustomPathway] = useState(null);

  // Student Q&A Reply State
  const [replyInput, setReplyInput] = useState('');
  const [activeReplyingId, setActiveReplyingId] = useState(null);

  // Check role: creator, reviewer, convener, or superuser
  const isAuthorized =
    profile?.role === 'creator' ||
    profile?.role === 'superuser' ||
    profile?.role === 'convener' ||
    profile?.role === 'reviewer';

  if (!isAuthorized) {
    return (
      <div className="min-h-[85vh] pamoja-shell flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 sm:p-10 text-center shadow-2xl text-slate-900 dark:text-white relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-6">
            <Brain size={32} />
          </div>

          <span className="text-[11px] font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800">
            Faculty &amp; Educator Portal
          </span>

          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white mt-4 mb-3">
            Pamoja Educator Studio
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
            This portal is restricted to accredited University Professors, Curriculum Creators (`creator`), Clinical Reviewers (`reviewer`), and Platform Superusers (`superuser`).
          </p>

          <div className="space-y-3">
            {!user ? (
              <button
                onClick={loginWithGoogle}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Sign In with Accredited Faculty Account
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                Signed in as <strong className="text-slate-900 dark:text-white">{user.email}</strong> (Role:{' '}
                <span className="text-cyan-600 dark:text-cyan-400 uppercase font-bold">{profile?.role}</span>). Request faculty elevation from the Root Governance Console (`/admin`) or return to the main catalog.
              </div>
            )}

            <Link
              href="/"
              className="block w-full py-2.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all border border-slate-200 dark:border-slate-700 text-center"
            >
              &larr; Return to Course Catalog
            </Link>
          </div>

          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Multi-File Upload Helper (PDF, DOCX, TXT, MD, MP4, MP3)
  // -------------------------------------------------------------
  const handleSlideFileUpload = async (e) => {
    const fileList = Array.from(e.target.files || []);
    if (!fileList.length) return;
    setUploadedFileName(fileList.map((f) => f.name).join(', '));
    if (!compilerTitleInput && fileList[0]) {
      setCompilerTitleInput(
        fileList[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      );
    }

    const newFiles = [];
    for (const file of fileList) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const category = ['mp4', 'webm', 'mov'].includes(ext)
        ? 'Video'
        : ['mp3', 'wav', 'm4a'].includes(ext)
        ? 'Audio'
        : ext === 'pdf'
        ? 'PDF'
        : 'Document';

      newFiles.push({
        id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        sizeKB: Math.max(1, Math.round(file.size / 1024)),
        category,
        url: typeof URL !== 'undefined' ? URL.createObjectURL(file) : '#'
      });

      if (['txt', 'md', 'csv', 'json', 'html'].includes(ext)) {
        try {
          const text = await file.text();
          const cleaned = text.replace(/\0/g, ' ').slice(0, 12000);
          setCompilerInput((prev) =>
            prev ? `${prev}\n\n---Uploaded File: ${file.name}---\n${cleaned}` : cleaned
          );
        } catch (err) {
          console.warn('File read notice:', err);
        }
      }
    }

    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  // -------------------------------------------------------------
  // AI Compiler: Exact 1-to-1 Module Alignment + Pamoja-MedLM Engine
  // -------------------------------------------------------------
  const handleRunCompiler = async () => {
    if (!compilerInput.trim() && !compilerTitleInput.trim() && attachedFiles.length === 0) return;
    setIsCompiling(true);
    try {
      // 1. Parse explicit Module headings + multi-file attachments first for exact 1-to-1 alignment
      const deterministicModules = parseCurriculumDocumentToModules(
        compilerInput,
        attachedFiles
      );
      const hasExplicitModules = /(?:^|\n)\s*(?:#+\s*)?(?:MODULE|UNIT|WEEK|SECTION)\s+\d+/i.test(
        compilerInput || ''
      );

      if (hasExplicitModules && deterministicModules.length > 0) {
        const modCount = deterministicModules.length;
        const autoCpd = modCount <= 3 ? 4 : modCount <= 7 ? 10 : 15;
        setCourseForm((prev) => ({
          ...prev,
          title:
            compilerTitleInput ||
            prev.title ||
            'Compiled Clinical Protocol Curriculum',
          description:
            prev.description ||
            `Compiled ${modCount}-Module curriculum with exact 1-to-1 module alignment, rural HC III/IV adaptations, and option-specific assessments.`,
          category: compilerCategoryInput || prev.category,
          cpd: profile?.role === 'superuser' ? prev.cpd || autoCpd : autoCpd,
          duration: modCount * 3,
          modules: deterministicModules
        }));
        setActiveEditorModuleIdx(0);
        setIsEditing(true);
        setActiveTab('courses');
        setSaveBannerMessage(
          `Compiled ${modCount} Module${modCount > 1 ? 's' : ''} with exact 1-to-1 alignment (${attachedFiles.length} attached media/files linked)!`
        );
        return;
      }

      // 2. Otherwise query Gemini /api/ai and enrich with attached files
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'compile_curriculum',
          rawText: compilerInput,
          courseTitle:
            compilerTitleInput ||
            courseForm.title ||
            'Advanced Clinical Management Protocol',
          category: compilerCategoryInput || courseForm.category || 'Maternal Health'
        })
      });
      const data = await response.json();
      if (data.compiled && Array.isArray(data.compiled.modules) && data.compiled.modules.length > 0) {
        const normalizedModules = data.compiled.modules.map((m, idx) => ({
          title: m.title || `Module ${idx + 1}`,
          mainVideoUrl:
            m.mainVideoUrl ||
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          topics: Array.isArray(m.topics)
            ? m.topics.map((t, tIdx) => ({
                title: t.title || `Topic ${idx + 1}.${tIdx + 1}`,
                seatTimeMinutes: t.seatTimeMinutes || 45,
                competencyTag: t.competencyTag || `COMP-0${idx + 1}`,
                videoUrl: t.videoUrl || '',
                videoStartTime: t.videoStartTime || 0,
                videoEndTime: t.videoEndTime || 300,
                content: t.content || '',
                goldProtocol:
                  t.goldProtocol ||
                  'Tertiary Gold-Standard Protocol: Full diagnostic workup and specialist monitoring.',
                ruralProtocol:
                  t.ruralProtocol ||
                  'HC III/IV Resource-Adapted Protocol: Point-of-care clinical stabilization and timely SBAR referral.',
                resources:
                  idx === 0 && tIdx === 0 && attachedFiles.length > 0
                    ? [
                        ...(Array.isArray(t.resources) ? t.resources : []),
                        ...attachedFiles.map((f) => ({
                          title: `${f.category}: ${f.name}`,
                          type: f.category,
                          url: f.url || '#'
                        }))
                      ]
                    : Array.isArray(t.resources)
                    ? t.resources
                    : []
              }))
            : [createDefaultModule(idx + 1).topics[0]],
          quiz: Array.isArray(m.quiz) ? m.quiz : createDefaultModule(idx + 1).quiz,
          simulation: m.simulation || null
        }));

        // Replace starter module list completely (never append after a blank Module 1)
        setCourseForm((prev) => ({
          ...prev,
          title:
            data.compiled.title ||
            compilerTitleInput ||
            prev.title ||
            'Compiled Clinical Curriculum',
          description:
            data.compiled.description ||
            prev.description ||
            'Competency-based curriculum compiled with Pamoja-MedLM sovereign clinical intelligence.',
          category: compilerCategoryInput || prev.category,
          modules: normalizedModules
        }));
        setActiveEditorModuleIdx(0);
        setIsEditing(true);
        setActiveTab('courses');
      } else if (deterministicModules.length > 0) {
        setCourseForm((prev) => ({
          ...prev,
          title: compilerTitleInput || prev.title || 'Compiled Clinical Curriculum',
          category: compilerCategoryInput || prev.category,
          modules: deterministicModules
        }));
        setActiveEditorModuleIdx(0);
        setIsEditing(true);
        setActiveTab('courses');
      }
    } catch (err) {
      console.error('Compiler error:', err);
    } finally {
      setIsCompiling(false);
      setIsCompilerOpen(false);
    }
  };

  // -------------------------------------------------------------
  // AI Single-Module Quiz Generator
  // -------------------------------------------------------------
  const handleAutoGenerateQuizQuestion = async (mIdx) => {
    const targetMod = courseForm.modules[mIdx];
    if (!targetMod) return;
    setGeneratingQuizModuleIdx(mIdx);
    try {
      const combinedContent = (targetMod.topics || [])
        .map((t) => `${t.title}: ${t.content}\nGold: ${t.goldProtocol || ''}\nRural: ${t.ruralProtocol || ''}`)
        .join('\n\n');

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_quiz',
          moduleTitle: targetMod.title,
          topics: targetMod.topics || [],
          topicContent: combinedContent
        })
      });
      const data = await res.json();
      if (data.quizItem && Array.isArray(data.quizItem.options)) {
        const updatedModules = [...courseForm.modules];
        updatedModules[mIdx] = {
          ...updatedModules[mIdx],
          quiz: [...(updatedModules[mIdx].quiz || []), data.quizItem]
        };
        setCourseForm({ ...courseForm, modules: updatedModules });
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setGeneratingQuizModuleIdx(null);
    }
  };

  // -------------------------------------------------------------
  // No-Code Clinical Simulation Generator (Real API)
  // -------------------------------------------------------------
  const handleGenerateSimulation = async () => {
    setIsGeneratingSim(true);
    try {
      const targetMod = courseForm.modules[simGenTargetModule] || courseForm.modules[0];
      const contextText =
        simGenTopicContext.trim() ||
        targetMod?.title ||
        courseForm.title ||
        'Obstetric Hemorrhage & Shock Resuscitation';

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_simulation',
          engine: simGenEngine,
          moduleTitle: contextText,
          moduleContext: contextText,
          clinicalTopic: contextText
        })
      });
      const data = await res.json();
      if (data.simulation) {
        setGeneratedSimData(data.simulation);
      }
    } catch (err) {
      console.error('Sim generation error:', err);
    } finally {
      setIsGeneratingSim(false);
    }
  };

  const handleAttachSimToModule = () => {
    if (!generatedSimData) return;
    const updated = [...courseForm.modules];
    if (updated[simGenTargetModule]) {
      updated[simGenTargetModule] = {
        ...updated[simGenTargetModule],
        simulation: generatedSimData
      };
      setCourseForm({ ...courseForm, modules: updated });
    }
    setIsSimGenOpen(false);
    setGeneratedSimData(null);
  };

  // -------------------------------------------------------------
  // Section 6: Cross-Course AI Precision Pathway Synthesis Engine
  // -------------------------------------------------------------
  const handleSynthesizePathway = async () => {
    setIsSynthesizingPathway(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'synthesize_pathway',
          goal: pathwayGoal
        })
      });
      const data = await res.json();
      if (data.pathway) {
        setCustomPathway(data.pathway);
      }
    } catch (err) {
      console.error('Pathway synthesis error:', err);
    } finally {
      setIsSynthesizingPathway(false);
    }
  };

  // -------------------------------------------------------------
  // Module / Sub-Topic / Quiz Mutation Helpers
  // -------------------------------------------------------------
  const updateModuleField = (mIdx, field, value) => {
    const updated = [...courseForm.modules];
    updated[mIdx] = { ...updated[mIdx], [field]: value };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const addTopicToModule = (mIdx) => {
    const updated = [...courseForm.modules];
    const nextTopicIdx = (updated[mIdx].topics?.length || 0) + 1;
    updated[mIdx] = {
      ...updated[mIdx],
      topics: [
        ...(updated[mIdx].topics || []),
        {
          title: `Topic ${mIdx + 1}.${nextTopicIdx}: Clinical Protocol & Bedside Execution`,
          seatTimeMinutes: 45,
          competencyTag: `COMP-${mIdx + 1}${nextTopicIdx}`,
          videoUrl: '',
          videoStartTime: 0,
          videoEndTime: 300,
          content:
            'Enter detailed clinical teaching content, pathophysiology, diagnostic criteria, and step-by-step execution guidelines.',
          goldProtocol:
            'Tertiary Hospital Protocol: Specify gold-standard equipment, lab diagnostics, and specialist escalation steps.',
          ruralProtocol:
            'HC III/IV Resource-Adapted Protocol: Specify heat-stable alternatives, improvised stabilization, and referral triggers.',
          resources: []
        }
      ]
    };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const removeTopicFromModule = (mIdx, tIdx) => {
    const updated = [...courseForm.modules];
    updated[mIdx] = {
      ...updated[mIdx],
      topics: updated[mIdx].topics.filter((_, idx) => idx !== tIdx)
    };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const updateTopicField = (mIdx, tIdx, field, value) => {
    const updated = [...courseForm.modules];
    const updatedTopics = [...(updated[mIdx].topics || [])];
    updatedTopics[tIdx] = { ...updatedTopics[tIdx], [field]: value };
    updated[mIdx] = { ...updated[mIdx], topics: updatedTopics };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const addResourceToTopic = (mIdx, tIdx) => {
    const updated = [...courseForm.modules];
    const updatedTopics = [...(updated[mIdx].topics || [])];
    const currentResources = updatedTopics[tIdx].resources || [];
    updatedTopics[tIdx] = {
      ...updatedTopics[tIdx],
      resources: [
        ...currentResources,
        {
          title: 'Clinical Pocket Checklist / Slide Deck',
          type: 'PDF Pocket Chart',
          url: 'https://drive.google.com/drive/folders/1PamojaFacultySharedVault'
        }
      ]
    };
    updated[mIdx] = { ...updated[mIdx], topics: updatedTopics };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const updateTopicResource = (mIdx, tIdx, rIdx, field, value) => {
    const updated = [...courseForm.modules];
    const updatedTopics = [...(updated[mIdx].topics || [])];
    const updatedResources = [...(updatedTopics[tIdx].resources || [])];
    updatedResources[rIdx] = { ...updatedResources[rIdx], [field]: value };
    updatedTopics[tIdx] = { ...updatedTopics[tIdx], resources: updatedResources };
    updated[mIdx] = { ...updated[mIdx], topics: updatedTopics };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const removeTopicResource = (mIdx, tIdx, rIdx) => {
    const updated = [...courseForm.modules];
    const updatedTopics = [...(updated[mIdx].topics || [])];
    updatedTopics[tIdx] = {
      ...updatedTopics[tIdx],
      resources: (updatedTopics[tIdx].resources || []).filter((_, idx) => idx !== rIdx)
    };
    updated[mIdx] = { ...updated[mIdx], topics: updatedTopics };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const addManualQuizQuestion = (mIdx) => {
    const updated = [...courseForm.modules];
    updated[mIdx] = {
      ...updated[mIdx],
      quiz: [
        ...(updated[mIdx].quiz || []),
        {
          question: 'Enter clinical scenario question stem...',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: 0,
          optionFeedback: [
            'Correct! Explain why Option A is clinically indicated.',
            'Incorrect. Explain the clinical risk or error of Option B.',
            'Incorrect. Explain why Option C is contraindicated or secondary.',
            'Incorrect. Explain why Option D delays definitive care.'
          ],
          explanation: 'Summary clinical pearl grounded in MoH / WHO guidelines.'
        }
      ]
    };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const updateQuizField = (mIdx, qIdx, field, value) => {
    const updated = [...courseForm.modules];
    const updatedQuiz = [...(updated[mIdx].quiz || [])];
    updatedQuiz[qIdx] = { ...updatedQuiz[qIdx], [field]: value };
    updated[mIdx] = { ...updated[mIdx], quiz: updatedQuiz };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const updateQuizOption = (mIdx, qIdx, optIdx, value) => {
    const updated = [...courseForm.modules];
    const updatedQuiz = [...(updated[mIdx].quiz || [])];
    const opts = [...(updatedQuiz[qIdx].options || ['', '', '', ''])];
    opts[optIdx] = value;
    updatedQuiz[qIdx] = { ...updatedQuiz[qIdx], options: opts };
    updated[mIdx] = { ...updated[mIdx], quiz: updatedQuiz };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const updateQuizOptionFeedback = (mIdx, qIdx, optIdx, value) => {
    const updated = [...courseForm.modules];
    const updatedQuiz = [...(updated[mIdx].quiz || [])];
    const fb = [...(updatedQuiz[qIdx].optionFeedback || ['', '', '', ''])];
    fb[optIdx] = value;
    updatedQuiz[qIdx] = { ...updatedQuiz[qIdx], optionFeedback: fb };
    updated[mIdx] = { ...updated[mIdx], quiz: updatedQuiz };
    setCourseForm({ ...courseForm, modules: updated });
  };

  const removeQuizQuestion = (mIdx, qIdx) => {
    const updated = [...courseForm.modules];
    updated[mIdx] = {
      ...updated[mIdx],
      quiz: (updated[mIdx].quiz || []).filter((_, idx) => idx !== qIdx)
    };
    setCourseForm({ ...courseForm, modules: updated });
  };

  // Save & Publish Course to Real-Time Database
  const handleSaveCourse = async () => {
    if (!courseForm.title.trim()) {
      alert('Please enter a Course Title before publishing.');
      return;
    }
    const courseId = editingCourseId || `course-${Date.now()}`;
    const finalCourse = {
      ...courseForm,
      id: courseId,
      instructor: courseForm.instructor || profile?.name || 'Prof. Clinical Faculty',
      status: 'Published',
      updatedAt: new Date().toISOString()
    };

    await upsertCourse(finalCourse);
    setSaveBannerMessage(`"${finalCourse.title}" saved & published in real time across the platform!`);
    setTimeout(() => setSaveBannerMessage(''), 5000);
    setIsEditing(false);
    setEditingCourseId(null);
  };

  // Reply to Student Q&A in Real Time
  const handleSendReply = async (qObj) => {
    if (!replyInput.trim()) return;
    await upsertQuestion({
      ...qObj,
      reply: replyInput.trim(),
      repliedBy: profile?.name || 'Professor',
      isResolved: true
    });
    setReplyInput('');
    setActiveReplyingId(null);
  };

  // Calculate dynamic revenue metrics
  const totalGrossRevenue = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 42850);
  const professorWalletShare = Math.round(totalGrossRevenue * 0.7);

  return (
    <div className="min-h-screen pamoja-shell font-['Inter'] pb-24">
      {/* Studio Header Bar */}
      <div className="pamoja-card border-b pamoja-divider sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            >
              &larr; Back to Platform
            </Link>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 dark:text-white font-['Outfit'] uppercase tracking-wider">
                Educator Studio &amp; Real-World Curriculum Canvas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Faculty:</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-bold">{profile?.name || 'Professor'}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold uppercase text-[10px] tracking-wider">
                {profile?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Confirmation Banner */}
      {saveBannerMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <CheckCircle size={18} className="text-emerald-400" />
              {saveBannerMessage}
            </div>
            <button onClick={() => setSaveBannerMessage('')} className="text-emerald-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Hero Studio Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-[11px] font-black uppercase tracking-widest mb-3">
                <Brain size={14} className="text-cyan-600 dark:text-cyan-400" /> Pamoja Sovereign Clinical Authoring Studio
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight leading-tight">
                Real-World Curriculum Canvas, Multi-Source Video &amp; AI Superintelligence
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-2 font-normal leading-relaxed">
                Author dynamic 1-to-20+ module courses (Rapid Refreshers, Clinical Certificates, and Mastery Curricula) with Sub-Topic lectures, Resource-Stratified Protocols (Tertiary vs. Rural HC III/IV), 4-Option Conditional Feedback Quizzes, and Zero-Upfront Video Hosting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setEditingCourseId(null);
                  setCourseForm({
                    title: '',
                    description: '',
                    category: 'Maternal Health',
                    instructor: profile?.name || 'Prof. Clinical Faculty',
                    institution: profile?.facility || 'University Teaching Hospital',
                    accreditationCode: 'UMDPC / MoH-CPD-2026',
                    cpd: 15,
                    duration: 40,
                    pricingModel: 'freemium',
                    freePreviewModules: 1,
                    price: 49,
                    status: 'Published',
                    videoHostingMode: 'external',
                    sharedDriveFolderUrl: 'https://drive.google.com/drive/folders/1PamojaFacultySharedVault',
                    image:
                      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
                    requiresLab: true,
                    modules: [createDefaultModule(1)]
                  });
                  setActiveEditorModuleIdx(0);
                  setIsEditing(true);
                  setActiveTab('courses');
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <PlusCircle size={16} /> Open Course Creation Canvas
              </button>

              <button
                onClick={() => setIsCompilerOpen(true)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-200 dark:border-cyan-800 shadow-sm"
              >
                <Sparkles size={16} /> Convert Slides / Guidelines with AI
              </button>
            </div>
          </div>

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 rounded-2xl p-1.5 overflow-x-auto gap-1">
          {[
            { id: 'dashboard', label: 'Analytics & Royalty Ledger', icon: LayoutDashboard },
            { id: 'courses', label: 'Course Creation Canvas & Library', icon: BookOpen },
            { id: 'pathways', label: 'AI Precision Pathway Architect', icon: Layers },
            { id: 'labs', label: 'Schedule Sim Labs', icon: Calendar },
            { id: 'students', label: 'Student Progress (LMS)', icon: Users },
            { id: 'qa', label: `Student Q&A Desk (${questions.filter((q) => !q.isResolved).length})`, icon: MessageCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* TAB 1: ANALYTICS & FRACTIONAL ROYALTY LEDGER              */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Users size={26} />
                </div>
                <div>
                  <div className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                    {1480 + escrowLearners.length}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Enrolled Clinicians</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={26} />
                </div>
                <div>
                  <div className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">{courses.length}</div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Live Accredited Curricula</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <DollarSign size={26} />
                </div>
                <div>
                  <div className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                    ${totalGrossRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Gross Tuition Volume</div>
                </div>
              </div>

              <div className="bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-700/60 rounded-[2rem] p-6 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex items-center justify-center flex-shrink-0 font-black shadow-md">
                  <Award size={26} />
                </div>
                <div>
                  <div className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                    ${professorWalletShare.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-cyan-700 dark:text-cyan-200">70% Faculty Royalty Pool</div>
                </div>
              </div>
            </div>

            {/* FRACTIONAL PROFESSOR ROYALTY SPLIT LEDGER */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-[11px] font-black uppercase tracking-wider mb-2">
                    <TrendingUp size={13} className="text-cyan-600 dark:text-cyan-400" /> Fractional Royalty Engine
                  </div>
                  <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
                    Multi-Professor Cross-Course Royalty &amp; Video Bandwidth Ledger
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Formula: <span className="text-cyan-700 dark:text-cyan-300 font-mono font-bold">P_i = R_net &times; 0.70 &times; (M_i / M_total)</span>. Shared Drive managed video storage is $0 upfront and only deducts 2.5% when a paid student purchases the course.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    &bull; Real-Time Settlement Active
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider text-[11px]">
                      <th className="pb-3">Contributing Professor</th>
                      <th className="pb-3">Parent Course &amp; Atomic Unit (ALU)</th>
                      <th className="pb-3 text-center">Seat-Time</th>
                      <th className="pb-3 text-center">Share</th>
                      <th className="pb-3 text-center">Video Hosting Mode</th>
                      <th className="pb-3 text-right">Fractional Payout</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-slate-900 dark:text-white">Prof. N. K. Okello</div>
                        <div className="text-[10px] text-slate-500">Makerere University</div>
                      </td>
                      <td className="py-4">
                        <div className="text-slate-700 dark:text-slate-300">Topic 3.3: Family-Focused PMTCT &amp; Option B+</div>
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400">HIV &amp; PMTCT Comprehensive Care</div>
                      </td>
                      <td className="py-4 text-center text-slate-800 dark:text-slate-300 font-bold">90 mins</td>
                      <td className="py-4 text-center">
                        <span className="px-2.5 py-1 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-200 dark:border-cyan-800">
                          25%
                        </span>
                      </td>
                      <td className="py-4 text-center text-slate-500 dark:text-slate-400">External Stream ($0 Fee)</td>
                      <td className="py-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">$6.63</td>
                      <td className="py-4 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                          Disbursed
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-slate-900 dark:text-white">Prof. S. R. Mukasa</div>
                        <div className="text-[10px] text-slate-500">Wits Medical School</div>
                      </td>
                      <td className="py-4">
                        <div className="text-slate-700 dark:text-slate-300">Topic 2.2: Centering Circle Facilitation &amp; Self-Care</div>
                        <div className="text-[10px] text-purple-600 dark:text-purple-400">Group Antenatal Care (GC_1000)</div>
                      </td>
                      <td className="py-4 text-center text-slate-800 dark:text-slate-300 font-bold">90 mins</td>
                      <td className="py-4 text-center">
                        <span className="px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                          25%
                        </span>
                      </td>
                      <td className="py-4 text-center text-amber-700 dark:text-amber-300">Pamoja Shared Drive (2.5% on Sale)</td>
                      <td className="py-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">$6.46</td>
                      <td className="py-4 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                          Disbursed
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-slate-900 dark:text-white">Prof. E. M. Achieng</div>
                        <div className="text-[10px] text-slate-500">Nairobi Obstetric Center</div>
                      </td>
                      <td className="py-4">
                        <div className="text-slate-700 dark:text-slate-300">Topic 3.1: Active Management &amp; EMOTIVE Bundle</div>
                        <div className="text-[10px] text-amber-600 dark:text-amber-400">National EMOTIVE PPH Refresher</div>
                      </td>
                      <td className="py-4 text-center text-slate-300 font-bold">180 mins</td>
                      <td className="py-4 text-center">
                        <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                          50%
                        </span>
                      </td>
                      <td className="py-4 text-center text-slate-400">External Stream ($0 Fee)</td>
                      <td className="py-4 text-right font-black text-emerald-400 text-sm">$13.25</td>
                      <td className="py-4 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                          Disbursed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: REAL-WORLD COURSE CREATION CANVAS & LIBRARY        */}
        {/* ========================================================= */}
        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                  {isEditing ? 'Real-World Clinical Course Creation Canvas' : 'Accredited Curriculum Library'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isEditing
                    ? 'Build complete modules with Sub-Topics, Tertiary vs. Rural HC III/IV protocols, multi-source videos, and 4-option conditional quizzes.'
                    : 'Select any curriculum below to edit its full module tree or launch a new course.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsCompilerOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-200 dark:border-cyan-800 shadow-xs"
                >
                  <Sparkles size={15} /> AI Slide/Guideline Compiler
                </button>
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingCourseId(null);
                      setCourseForm({
                        title: '',
                        description: '',
                        category: 'Maternal Health',
                        instructor: profile?.name || 'Prof. Clinical Faculty',
                        institution: profile?.facility || 'University Teaching Hospital',
                        accreditationCode: 'UMDPC / MoH-CPD-2026',
                        cpd: 15,
                        duration: 40,
                        pricingModel: 'freemium',
                        freePreviewModules: 1,
                        price: 49,
                        status: 'Published',
                        videoHostingMode: 'external',
                        sharedDriveFolderUrl: 'https://drive.google.com/drive/folders/1PamojaFacultySharedVault',
                        image:
                          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
                        requiresLab: true,
                        modules: [createDefaultModule(1)]
                      });
                      setActiveEditorModuleIdx(0);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
                  >
                    <PlusCircle size={15} /> Author New Course
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
                  >
                    <X size={15} /> Exit Canvas
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-8">
                {/* STEP 1: COURSE METADATA, PRICING & ACCREDITATION */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center">
                        1
                      </span>
                      <div>
                        <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
                          Course Metadata, Accreditation &amp; Tuition Structure
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Configure regulatory CPD credits, lead faculty attribution, Freemium preview depth, and OSCE Simulation Lab requirements.
                        </p>
                      </div>
                    </div>

                    {(() => {
                      const fmtBadge = getCourseFormatBadge(courseForm.modules?.length || 1);
                      return (
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${fmtBadge.color}`}
                        >
                          {fmtBadge.label}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Full Accredited Course Title *
                      </label>
                      <input
                        type="text"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        placeholder="e.g., National EMOTIVE & Helping Mothers Survive PPH Refresher"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Clinical Specialty Category
                      </label>
                      <select
                        value={courseForm.category}
                        onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Maternal Health">Maternal Health</option>
                        <option value="Emergency Care">Emergency Care</option>
                        <option value="Neonatology">Neonatology</option>
                        <option value="Infectious Disease">Infectious Disease</option>
                        <option value="Neonatal & Pediatric Care">Neonatal &amp; Pediatric Care</option>
                        <option value="Primary Care & NCDs">Primary Care &amp; NCDs</option>
                        <option value="Surgical & Anesthesia Safety">Surgical &amp; Anesthesia Safety</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Lead Authoring Professor
                      </label>
                      <input
                        type="text"
                        value={courseForm.instructor || ''}
                        onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                        placeholder="Prof. E. M. Achieng"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Accrediting Body / Reference Code
                      </label>
                      <input
                        type="text"
                        value={courseForm.accreditationCode || ''}
                        onChange={(e) => setCourseForm({ ...courseForm, accreditationCode: e.target.value })}
                        placeholder="UMDPC / HPCSA / MoH-CPD-2026"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                          CPD Credits{' '}
                          {profile?.role !== 'superuser' && (
                            <span className="text-[9px] text-amber-400">(Council Preset)</span>
                          )}
                        </label>
                        {profile?.role === 'superuser' ? (
                          <input
                            type="number"
                            value={courseForm.cpd}
                            onChange={(e) => setCourseForm({ ...courseForm, cpd: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        ) : (
                          <select
                            value={courseForm.cpd}
                            onChange={(e) => setCourseForm({ ...courseForm, cpd: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                          >
                            <option value={4}>4 CPD (Rapid Refresher)</option>
                            <option value={10}>10 CPD (Clinical Certificate)</option>
                            <option value={15}>15 CPD (Mastery Curriculum)</option>
                          </select>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Duration (Hrs)
                        </label>
                        <input
                          type="number"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({ ...courseForm, duration: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Access &amp; Tuition Model
                      </label>
                      <select
                        value={courseForm.pricingModel || 'freemium'}
                        onChange={(e) => setCourseForm({ ...courseForm, pricingModel: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="freemium">Freemium (Initial Module Free, Full Unlock via Voucher/Tuition)</option>
                        <option value="free">100% Open-Access MoH Public Good ($0)</option>
                        <option value="paid">Premium Accredited Fellowship</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Tuition Fee (USD)
                        </label>
                        <input
                          type="number"
                          value={courseForm.price}
                          onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                          Free Preview Modules
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={courseForm.modules?.length || 20}
                          value={courseForm.pricingModel === 'free' ? courseForm.modules?.length || 1 : courseForm.freePreviewModules ?? 1}
                          disabled={courseForm.pricingModel === 'free'}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              freePreviewModules: Math.max(0, Number(e.target.value))
                            })
                          }
                          className="w-full bg-slate-950 border border-cyan-800/80 rounded-xl px-3 py-2.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col justify-end">
                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={courseForm.requiresLab !== false}
                          onChange={(e) => setCourseForm({ ...courseForm, requiresLab: e.target.checked })}
                          className="w-4 h-4 accent-cyan-500 rounded"
                        />
                        <span className="text-xs font-bold text-slate-200">
                          Requires In-Person OSCE Lab (Escrow CPD)
                        </span>
                      </label>
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Clinical Executive Summary &amp; Target Competencies
                      </label>
                      <textarea
                        rows={2}
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        placeholder="Describe clinical learning outcomes, target cadres (Doctors, Midwives, Clinical Officers), and national guidelines covered..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 2: VIDEO HOSTING & ZERO-UPFRONT STORAGE ECONOMICS */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center">
                        2
                      </span>
                      <div>
                        <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
                          Video Delivery &amp; Zero-Upfront Cloud Storage Strategy
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          All video sources are automatically wrapped in Pamoja&apos;s Standardized Clinical Video Player (speed controls, chapter jump, and 64kbps Rural Audio-Only mode).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setCourseForm({ ...courseForm, videoHostingMode: 'external' })}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        courseForm.videoHostingMode !== 'managed_drive'
                          ? 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-500 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                          <Globe size={15} /> Option A: External Link / Own Drive ($0 Cost)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                          0% Storage Fee
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Paste any <strong>YouTube (Unlisted/Public)</strong>, <strong>Vimeo</strong>, <strong>Google Drive share link</strong>, or <strong>Direct MP4 URL</strong> inside each module below. Costs $0 to Pamoja and $0 to the Professor.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCourseForm({ ...courseForm, videoHostingMode: 'managed_drive' })}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        courseForm.videoHostingMode === 'managed_drive'
                          ? 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-500 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          <HardDrive size={15} /> Option B: Pamoja Managed Shared Drive Vault
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                          $0 Upfront &bull; 2.5% Only on Paid Sales
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Upload raw lecture videos directly to Pamoja&apos;s Google Shared Drive Vault. <strong>Zero upfront storage charges</strong>; a 2.5% bandwidth &amp; storage recovery fee is deducted <em>only</em> when a paid learner purchases your course.
                      </p>
                    </button>
                  </div>

                  {courseForm.videoHostingMode === 'managed_drive' && (
                    <div className="bg-amber-50/60 dark:bg-slate-950 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <FolderPlus size={15} /> Pamoja Faculty Google Shared Drive Dropzone
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          1. Upload your `.mp4` lecture recordings to the Pamoja Shared Drive folder or select a local video file inside any module below. 2. Paste the Google Drive share link (`https://drive.google.com/file/d/.../view`) into the Module Video field.
                        </p>
                      </div>
                      <a
                        href={courseForm.sharedDriveFolderUrl || 'https://drive.google.com'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shadow-md"
                      >
                        <ExternalLink size={14} /> Open Pamoja Shared Drive
                      </a>
                    </div>
                  )}
                </div>

                {/* STEP 3: DEEP MODULE, SUB-TOPIC, PROTOCOL & QUIZ CANVAS */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center">
                        3
                      </span>
                      <div>
                        <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
                          Interactive Module, Sub-Topic &amp; Assessment Canvas ({courseForm.modules.length} Modules)
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Click any module tab below to edit its Lecture Video, Sub-Topics, Resource-Stratified Protocols (Gold vs. Rural HC III/IV), 4-Option Conditional Quizzes, and Simulations.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { count: 3, label: '3-Module Rapid Refresher', cpd: 4, duration: 6 },
                        { count: 6, label: '6-Module Certificate', cpd: 10, duration: 18 },
                        { count: 10, label: '10-Module Mastery', cpd: 15, duration: 40 }
                      ].map((preset) => (
                        <button
                          key={preset.count}
                          type="button"
                          onClick={() => {
                            const current = [...courseForm.modules];
                            if (current.length < preset.count) {
                              for (let i = current.length + 1; i <= preset.count; i++) {
                                current.push(createDefaultModule(i));
                              }
                            } else if (current.length > preset.count) {
                              current.length = preset.count;
                            }
                            setCourseForm({
                              ...courseForm,
                              cpd: preset.cpd,
                              duration: preset.duration,
                              modules: current
                            });
                            setActiveEditorModuleIdx(0);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-cyan-800/80 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Layers size={13} /> {preset.label}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const newIdx = courseForm.modules.length + 1;
                          const updated = [...courseForm.modules, createDefaultModule(newIdx)];
                          setCourseForm({ ...courseForm, modules: updated });
                          setActiveEditorModuleIdx(updated.length - 1);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <PlusCircle size={14} /> Add Module
                      </button>
                    </div>
                  </div>

                  {/* Module Selector Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {courseForm.modules.map((mod, mIdx) => {
                      const isSelected = activeEditorModuleIdx === mIdx;
                      return (
                        <button
                          key={mIdx}
                          type="button"
                          onClick={() => setActiveEditorModuleIdx(mIdx)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg font-black'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <span>Module {mIdx + 1}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20">
                            {mod.topics?.length || 0}T &bull; {mod.quiz?.length || 0}Q
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* ACTIVE MODULE DEEP CANVAS */}
                  {courseForm.modules[activeEditorModuleIdx] && (() => {
                    const mIdx = activeEditorModuleIdx;
                    const mod = courseForm.modules[mIdx];
                    return (
                      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-8">
                        {/* Module Title & Master Video Stream */}
                        <div className="space-y-4 pb-6 border-b border-slate-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                              Editing Module {mIdx + 1} of {courseForm.modules.length}
                            </span>
                            {courseForm.modules.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = courseForm.modules.filter((_, idx) => idx !== mIdx);
                                  setCourseForm({ ...courseForm, modules: filtered });
                                  setActiveEditorModuleIdx(Math.max(0, mIdx - 1));
                                }}
                                className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                              >
                                <Trash2 size={14} /> Delete Module {mIdx + 1}
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                Module {mIdx + 1} Title
                              </label>
                              <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => updateModuleField(mIdx, 'title', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                <span>Module Lecture Video URL (YouTube / Vimeo / Google Shared Drive / MP4)</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewVideoModuleIdx(previewVideoModuleIdx === mIdx ? null : mIdx)
                                  }
                                  className="text-cyan-400 hover:underline text-[10px] flex items-center gap-1"
                                >
                                  <PlayCircle size={12} />
                                  {previewVideoModuleIdx === mIdx ? 'Hide Player Preview' : 'Test in Standardized Player'}
                                </button>
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={mod.mainVideoUrl || ''}
                                  onChange={(e) => updateModuleField(mIdx, 'mainVideoUrl', e.target.value)}
                                  placeholder="https://www.youtube.com/watch?v=... or https://drive.google.com/file/d/.../view"
                                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                                />
                                <label className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-400 cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                                  <Upload size={14} /> Local MP4
                                  <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const blobUrl = URL.createObjectURL(file);
                                        updateModuleField(mIdx, 'mainVideoUrl', blobUrl);
                                        setPreviewVideoModuleIdx(mIdx);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Live Standardized Video Player Preview inside Canvas */}
                          {previewVideoModuleIdx === mIdx && mod.mainVideoUrl && (
                            <div className="pt-3">
                              <StandardizedVideoPlayer
                                videoUrl={mod.mainVideoUrl}
                                title={mod.title}
                                subtitle={`Standardized Player Preview • ${
                                  courseForm.videoHostingMode === 'managed_drive'
                                    ? 'Pamoja Shared Drive Vault (2.5% on Sale)'
                                    : 'External Stream ($0 Storage)'
                                }`}
                              />
                            </div>
                          )}
                        </div>

                        {/* SUB-TOPICS (ATOMIC LEARNING UNITS) BUILDER */}
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                                <BookOpen size={16} className="text-cyan-400" />
                                Sub-Topics &amp; Resource-Stratified Clinical Protocols ({mod.topics?.length || 0})
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                Each Sub-Topic is indexed as an Atomic Learning Unit (ALU) with Tertiary Gold-Standard vs. Rural HC III/IV protocols.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addTopicToModule(mIdx)}
                              className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-bold flex items-center gap-1.5"
                            >
                              <PlusCircle size={14} /> Add Sub-Topic to Module {mIdx + 1}
                            </button>
                          </div>

                          <div className="space-y-5">
                            {(mod.topics || []).map((topic, tIdx) => (
                              <div
                                key={tIdx}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                                    Sub-Topic {mIdx + 1}.{tIdx + 1} (Atomic Learning Unit)
                                  </span>
                                  {(mod.topics?.length || 0) > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeTopicFromModule(mIdx, tIdx)}
                                      className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
                                    >
                                      <Trash2 size={13} /> Remove Sub-Topic
                                    </button>
                                  )}
                                </div>

                                {/* Sub-Topic Title, Seat-Time, Competency Tag & Chapter Timestamps */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                  <div className="md:col-span-6 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                                      Sub-Topic Title
                                    </label>
                                    <input
                                      type="text"
                                      value={topic.title}
                                      onChange={(e) => updateTopicField(mIdx, tIdx, 'title', e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                                    />
                                  </div>

                                  <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                                      Seat-Time (Mins)
                                    </label>
                                    <input
                                      type="number"
                                      value={topic.seatTimeMinutes || 45}
                                      onChange={(e) =>
                                        updateTopicField(mIdx, tIdx, 'seatTimeMinutes', Number(e.target.value))
                                      }
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                                    />
                                  </div>

                                  <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                                      Competency Code
                                    </label>
                                    <input
                                      type="text"
                                      value={topic.competencyTag || `ALU-${mIdx + 1}.${tIdx + 1}`}
                                      onChange={(e) =>
                                        updateTopicField(mIdx, tIdx, 'competencyTag', e.target.value)
                                      }
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                                    />
                                  </div>

                                  <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                                      Video Start (Sec)
                                    </label>
                                    <input
                                      type="number"
                                      value={topic.videoStartTime || 0}
                                      onChange={(e) =>
                                        updateTopicField(mIdx, tIdx, 'videoStartTime', Number(e.target.value))
                                      }
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                                    />
                                  </div>
                                </div>

                                {/* Core Clinical Lecture Notes */}
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                    Core Clinical Lecture Synthesis &amp; Evidence Grounding
                                  </label>
                                  <textarea
                                    rows={4}
                                    value={topic.content}
                                    onChange={(e) => updateTopicField(mIdx, tIdx, 'content', e.target.value)}
                                    placeholder="Write or paste the comprehensive clinical teaching text for this sub-topic..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                                  />
                                </div>

                                {/* Dual Resource-Stratified Practical Application Deep-Dive */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5 bg-cyan-950/20 border border-cyan-900/50 rounded-xl p-3.5">
                                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                      <Building size={13} /> Tertiary Hospital Gold-Standard Protocol
                                    </label>
                                    <textarea
                                      rows={3}
                                      value={topic.goldProtocol || ''}
                                      onChange={(e) =>
                                        updateTopicField(mIdx, tIdx, 'goldProtocol', e.target.value)
                                      }
                                      placeholder="Specify tertiary hospital equipment, continuous monitoring, and specialist interventions..."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                                    />
                                  </div>

                                  <div className="space-y-1.5 bg-amber-950/20 border border-amber-900/50 rounded-xl p-3.5">
                                    <label className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                      <Stethoscope size={13} /> Rural HC III / IV Resource-Adapted Protocol
                                    </label>
                                    <textarea
                                      rows={3}
                                      value={topic.ruralProtocol || ''}
                                      onChange={(e) =>
                                        updateTopicField(mIdx, tIdx, 'ruralProtocol', e.target.value)
                                      }
                                      placeholder="Specify stock-out adaptations (e.g. condom-catheter UBT, gravimetric weighing, heat-stable drugs)..."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                                    />
                                  </div>
                                </div>

                                {/* Sub-Topic Supplementary Resources Drawer */}
                                <div className="space-y-2 pt-2 border-t border-slate-800/70">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                      Attached Clinical Pocket Charts, Slides &amp; Shared Drive Links (
                                      {topic.resources?.length || 0})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => addResourceToTopic(mIdx, tIdx)}
                                      className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                    >
                                      <PlusCircle size={12} /> Attach Resource Link
                                    </button>
                                  </div>

                                  {(topic.resources || []).map((resItem, rIdx) => (
                                    <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                      <select
                                        value={resItem.type || 'PDF Pocket Chart'}
                                        onChange={(e) =>
                                          updateTopicResource(mIdx, tIdx, rIdx, 'type', e.target.value)
                                        }
                                        className="sm:col-span-3 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-cyan-300"
                                      >
                                        <option value="PDF Pocket Chart">PDF Pocket Chart</option>
                                        <option value="Google Shared Drive Video">Google Shared Drive Video</option>
                                        <option value="Slide Deck (.pptx)">Slide Deck (.pptx)</option>
                                        <option value="Audio Protocol">Audio Protocol</option>
                                      </select>
                                      <input
                                        type="text"
                                        value={resItem.title || ''}
                                        onChange={(e) =>
                                          updateTopicResource(mIdx, tIdx, rIdx, 'title', e.target.value)
                                        }
                                        placeholder="Resource Title"
                                        className="sm:col-span-4 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                                      />
                                      <input
                                        type="text"
                                        value={resItem.url || ''}
                                        onChange={(e) =>
                                          updateTopicResource(mIdx, tIdx, rIdx, 'url', e.target.value)
                                        }
                                        placeholder="https://drive.google.com/..."
                                        className="sm:col-span-4 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeTopicResource(mIdx, tIdx, rIdx)}
                                        className="sm:col-span-1 text-slate-500 hover:text-rose-400 flex justify-center"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4-OPTION CONDITIONAL FEEDBACK QUIZ BUILDER */}
                        <div className="space-y-4 pt-6 border-t border-slate-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                                <HelpCircle size={16} className="text-emerald-400" />
                                Module {mIdx + 1} Option-Specific Conditional Quiz ({mod.quiz?.length || 0} Questions)
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                Every option (A, B, C, D) includes tailored clinical rationale shown immediately when clicked by the learner.
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleAutoGenerateQuizQuestion(mIdx)}
                                disabled={generatingQuizModuleIdx === mIdx}
                                className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                              >
                                <Sparkles size={14} />
                                {generatingQuizModuleIdx === mIdx
                                  ? 'Generating with Pamoja AI...'
                                  : 'Auto-Generate Question with AI'}
                              </button>

                              <button
                                type="button"
                                onClick={() => addManualQuizQuestion(mIdx)}
                                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
                              >
                                <PlusCircle size={14} /> Add Blank Question
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {(mod.quiz || []).map((qItem, qIdx) => (
                              <div
                                key={qIdx}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                                    Question {qIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeQuizQuestion(mIdx, qIdx)}
                                    className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
                                  >
                                    <Trash2 size={13} /> Remove Question
                                  </button>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                                    Clinical Scenario Question Stem
                                  </label>
                                  <input
                                    type="text"
                                    value={qItem.question}
                                    onChange={(e) => updateQuizField(mIdx, qIdx, 'question', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {[0, 1, 2, 3].map((optIdx) => {
                                    const letter = ['A', 'B', 'C', 'D'][optIdx];
                                    const isCorrect = Number(qItem.correctIndex) === optIdx;
                                    return (
                                      <div
                                        key={optIdx}
                                        className={`p-3.5 rounded-xl border space-y-2 ${
                                          isCorrect
                                            ? 'bg-emerald-950/30 border-emerald-600/70'
                                            : 'bg-slate-950 border-slate-800'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11px] font-black text-white">
                                            Option {letter}
                                          </span>
                                          <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer text-emerald-400">
                                            <input
                                              type="radio"
                                              name={`correct-${mIdx}-${qIdx}`}
                                              checked={isCorrect}
                                              onChange={() =>
                                                updateQuizField(mIdx, qIdx, 'correctIndex', optIdx)
                                              }
                                              className="accent-emerald-500"
                                            />
                                            {isCorrect ? 'Correct Answer' : 'Mark as Correct'}
                                          </label>
                                        </div>

                                        <input
                                          type="text"
                                          value={qItem.options?.[optIdx] || ''}
                                          onChange={(e) =>
                                            updateQuizOption(mIdx, qIdx, optIdx, e.target.value)
                                          }
                                          placeholder={`Option ${letter} text...`}
                                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                                        />

                                        <input
                                          type="text"
                                          value={qItem.optionFeedback?.[optIdx] || ''}
                                          onChange={(e) =>
                                            updateQuizOptionFeedback(mIdx, qIdx, optIdx, e.target.value)
                                          }
                                          placeholder={`Conditional feedback when learner clicks Option ${letter}...`}
                                          className="w-full bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 text-[11px] text-cyan-200"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* MODULE SIMULATION CONFIGURATOR */}
                        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-wider text-purple-300 flex items-center gap-2">
                              <Zap size={16} className="text-purple-400" />
                              Interactive Clinical Simulation Station (Module {mIdx + 1})
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              {mod.simulation
                                ? `Attached: ${mod.simulation.engine}`
                                : 'Attach an interactive 90-second physiological sequencer, Voice SBAR grader, or 3D WebAR station.'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSimGenTargetModule(mIdx);
                              setSimGenTopicContext(mod.title);
                              setIsSimGenOpen(true);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 text-xs font-bold flex items-center gap-2 self-start"
                          >
                            <Zap size={14} className="text-purple-400" />
                            {mod.simulation ? 'Reconfigure Module Simulation' : 'Configure / AI-Generate Simulation'}
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Bottom Save & Publish Action Bar */}
                  <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                      Total Modules: <strong className="text-white">{courseForm.modules.length}</strong> &bull; Total Sub-Topics (ALUs):{' '}
                      <strong className="text-cyan-400">
                        {courseForm.modules.reduce((acc, m) => acc + (m.topics?.length || 0), 0)}
                      </strong>{' '}
                      &bull; Total Quiz Items:{' '}
                      <strong className="text-emerald-400">
                        {courseForm.modules.reduce((acc, m) => acc + (m.quiz?.length || 0), 0)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveCourse}
                        className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-xl flex items-center gap-2"
                      >
                        <Save size={16} /> Save &amp; Publish Curriculum in Real Time
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Course Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const fmtBadge = getCourseFormatBadge(course.modules?.length || 1);
                  return (
                    <div
                      key={course.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/60 transition-all group"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                            {course.category}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${fmtBadge.color}`}
                          >
                            {fmtBadge.label}
                          </span>
                        </div>

                        <h3 className="text-lg font-black font-['Outfit'] text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                          {course.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
                          <span>
                            {course.cpd} CPD pts &bull; {course.duration || 12} hrs
                          </span>
                          <span className="text-slate-900 dark:text-white">
                            {course.pricingModel === 'free' || course.price === 0
                              ? '100% Free'
                              : course.pricingModel === 'freemium'
                              ? `Module 1 Free • $${course.price}`
                              : `$${course.price}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/courses/${course.id}`}
                            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-400 font-bold text-xs text-center border border-slate-200 dark:border-slate-800 transition-colors"
                          >
                            Launch Player
                          </Link>
                          <button
                            onClick={() => {
                              setCourseForm({
                                ...course,
                                freePreviewModules: course.freePreviewModules ?? 1,
                                videoHostingMode: course.videoHostingMode || 'external',
                                modules:
                                  Array.isArray(course.modules) && course.modules.length > 0
                                    ? course.modules
                                    : [createDefaultModule(1)]
                              });
                              setEditingCourseId(course.id);
                              setActiveEditorModuleIdx(0);
                              setIsEditing(true);
                            }}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                          >
                            <Edit3 size={14} /> Edit Canvas
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CROSS-COURSE AI PRECISION PATHWAY ARCHITECT         */}
        {/* ========================================================= */}
        {activeTab === 'pathways' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-[11px] font-black uppercase tracking-widest mb-3">
                <Layers size={14} className="text-cyan-600 dark:text-cyan-400" /> Cross-Course AI Dynamic Pathways
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                Cross-Course AI Precision Pathway Architect
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Index sub-topics as <strong>Atomic Learning Units (ALUs)</strong> across multiple professors&apos; curricula. Pamoja-MedLM weaves a precision pathway for any clinical goal and calculates fractional royalties per seat-time minute.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={pathwayGoal}
                  onChange={(e) => setPathwayGoal(e.target.value)}
                  placeholder="Enter custom clinical goal or target patient profile..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  onClick={handleSynthesizePathway}
                  disabled={isSynthesizingPathway}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSynthesizingPathway ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Weaving ALUs...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Synthesize Precision Pathway
                    </>
                  )}
                </button>
              </div>
            </div>

            {customPathway ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-8 animate-fade-in">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 block mb-1">
                      Synthesized Micro-Curriculum
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                      {customPathway.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Stitched from {customPathway.alus.length} Atomic Learning Units across accredited curricula.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-lg font-black text-cyan-700 dark:text-cyan-400">{customPathway.targetDurationHours} hrs</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Seat-Time</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-lg font-black text-amber-700 dark:text-amber-400">{customPathway.totalCPD} pts</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Stackable CPD</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">${customPathway.priceUSD}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dynamic Price</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Layers size={14} className="text-cyan-600 dark:text-cyan-400" /> Stitched Atomic Learning Units (ALUs)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customPathway.alus.map((alu, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">
                              Step {idx + 1} &bull; {alu.competencyTag}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                              <Clock size={12} /> {alu.seatTimeMinutes} mins
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-white">{alu.subTopicTitle}</h5>
                          <div className="text-xs text-slate-400">
                            Curriculum: <span className="text-slate-300 font-semibold">{alu.courseTitle}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Authored by: <span className="text-cyan-300">{alu.professor}</span> ({alu.institution})
                          </div>
                        </div>
                        <div className="pt-3">
                          <Link
                            href={`/courses/${alu.courseId}`}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300"
                          >
                            Open Sub-Topic in Course Player &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <TrendingUp size={14} className="text-emerald-400" /> Real-Time Fractional Creator Royalty Distribution
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Total Net Revenue: <strong className="text-white">${customPathway.rNet}</strong> &bull; Creator Pool (70%): <strong className="text-emerald-400">${customPathway.creatorPoolShare}</strong>
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="p-3.5">Contributing Professor</th>
                          <th className="p-3.5 text-center">Seat-Time</th>
                          <th className="p-3.5 text-center">Share %</th>
                          <th className="p-3.5 text-right">Atomic Royalty Payout</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {customPathway.royaltyBreakdown.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-900/40">
                            <td className="p-3.5">
                              <div className="font-bold text-white">{r.professor}</div>
                              <div className="text-[10px] text-slate-500">{r.institution}</div>
                            </td>
                            <td className="p-3.5 text-center text-slate-300 font-bold">{r.allocatedMinutes} mins</td>
                            <td className="p-3.5 text-center">
                              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                                {r.seatTimeSharePercent}%
                              </span>
                            </td>
                            <td className="p-3.5 text-right font-black text-emerald-400 text-sm">
                              ${r.fractionalPayoutUSD}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-[2rem] p-12 text-center text-slate-400 space-y-3">
                <Sparkles size={36} className="text-cyan-400 mx-auto animate-pulse" />
                <h4 className="text-base font-bold text-white">Ready to Synthesize Cross-Course Pathway</h4>
                <p className="text-xs max-w-md mx-auto leading-relaxed">
                  Enter any clinical competency objective above and click &quot;Synthesize Precision Pathway&quot; to weave an accredited micro-curriculum across multiple professors&apos; courses.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SCHEDULE SIMULATION LABS (REAL-TIME)               */}
        {/* ========================================================= */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl space-y-4">
              <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-cyan-600 dark:text-cyan-400" /> Schedule Regional Sim Lab
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create in-person simulation cohorts for OSCE evaluation. Sessions sync immediately to the `/labs` portal.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const newLab = {
                    id: `lab-${Date.now()}`,
                    courseTitle: form.courseTitle.value,
                    locationName: form.locationName.value,
                    city: form.city.value,
                    country: form.country.value,
                    date: form.date.value,
                    time: form.time.value,
                    capacity: parseInt(form.capacity.value, 10),
                    booked: 0,
                    equipmentReady: true
                  };
                  await upsertLab(newLab);
                  form.reset();
                }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Course Curriculum
                  </label>
                  <select
                    name="courseTitle"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Simulation Facility Name
                  </label>
                  <input
                    name="locationName"
                    required
                    type="text"
                    placeholder="e.g. Mulago Hospital Clinical Skills Center"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">City</label>
                    <input
                      name="city"
                      required
                      type="text"
                      placeholder="Kampala"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Country</label>
                    <input
                      name="country"
                      required
                      type="text"
                      placeholder="Uganda"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Date</label>
                    <input
                      name="date"
                      required
                      type="date"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Time</label>
                    <input
                      name="time"
                      required
                      type="time"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Max Capacity
                  </label>
                  <input
                    name="capacity"
                    required
                    type="number"
                    defaultValue="20"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  Schedule Lab Session in Real Time
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-bold font-['Outfit'] text-white">
                Scheduled Regional Simulation Sessions ({labs.length})
              </h3>

              <div className="space-y-4">
                {labs.map((lab) => (
                  <div
                    key={lab.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-cyan-400">{lab.courseTitle}</div>
                      <div className="text-base font-bold text-white">{lab.locationName}</div>
                      <div className="text-xs text-slate-400">
                        {lab.city}, {lab.country} &bull; {lab.date} at {lab.time}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-400">
                        {lab.booked || 0} of {lab.capacity} seats booked
                      </div>
                    </div>

                    <button
                      onClick={() => removeLab(lab.id)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: STUDENT PROGRESS TRACKER LMS (REAL-TIME ESCROW)    */}
        {/* ========================================================= */}
        {activeTab === 'students' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
                  Student Progress &amp; Zero-Trust Escrow Tracking (LMS)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Real-time roster of enrolled practitioners, theory completion status, and OSCE Simulation Lab sign-offs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-3 py-1.5 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  {escrowLearners.length} Tracked Practitioners
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider text-[11px]">
                    <th className="pb-3">Learner &amp; License</th>
                    <th className="pb-3">Enrolled Course</th>
                    <th className="pb-3 text-center">Pre / Post Score</th>
                    <th className="pb-3 text-center">CPD Credits</th>
                    <th className="pb-3 text-right">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {escrowLearners.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                      <td className="py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400">
                          {std.authorityId} &bull; {std.facility}
                        </div>
                      </td>
                      <td className="py-4 text-slate-700 dark:text-slate-300">{std.courseTitle}</td>
                      <td className="py-4 text-center">
                        <span className="text-slate-500 dark:text-slate-400">{std.preTestScore}%</span> &rarr;{' '}
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{std.postTestScore}%</span>
                      </td>
                      <td className="py-4 text-center font-black text-amber-700 dark:text-amber-400">
                        {std.pendingPoints} pts
                      </td>
                      <td className="py-4 text-right">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            std.status === 'OSCE_PASSED_RELEASED'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {std.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: STUDENT Q&A DESK (REAL-TIME)                       */}
        {/* ========================================================= */}
        {activeTab === 'qa' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
                  Student Clinical Q&amp;A Desk
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Questions submitted by learners inside the Course Player appear here in real time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
                  {questions.filter((q) => !q.isResolved).length} Pending Questions
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-cyan-400">{q.courseTitle}</span>
                      <div className="text-xs text-slate-400">
                        Asked by <strong className="text-slate-200">{q.studentName}</strong> &bull; {q.timestamp}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.isResolved
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {q.isResolved ? 'Resolved' : 'Needs Response'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    &ldquo;{q.question}&rdquo;
                  </p>

                  {q.reply ? (
                    <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800 text-xs text-cyan-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-cyan-300">
                        <CheckCircle size={14} /> Professor Verified Response:
                      </div>
                      <p className="leading-relaxed opacity-95">{q.reply}</p>
                    </div>
                  ) : activeReplyingId === q.id ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        rows={3}
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder="Type verified clinical explanation grounded in curriculum..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveReplyingId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(q)}
                          className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider"
                        >
                          Send Response
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReplyingId(q.id);
                        setReplyInput('');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center gap-1.5"
                    >
                      <MessageCircle size={14} /> Reply to Practitioner
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: AI DOCUMENT / SLIDES-TO-CURRICULUM COMPILER      */}
      {/* ========================================================= */}
      {isCompilerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 block mb-1">
                  Pamoja-MedLM Sovereign Clinical Ingestion Pipeline
                </span>
                <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
                  AI Slide &amp; Guideline-to-Curriculum Compiler
                </h3>
              </div>
              <button
                onClick={() => setIsCompilerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Upload your lecture notes, slide deck text, or Ministry of Health clinical guidelines. Pamoja-MedLM compiles them into structured modules with Sub-Topics, Tertiary vs. Rural HC III/IV protocols, and 4-option conditional quizzes, then opens the full Course Creation Canvas so you can refine every detail.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Target Course Title</label>
                <input
                  type="text"
                  value={compilerTitleInput}
                  onChange={(e) => setCompilerTitleInput(e.target.value)}
                  placeholder="e.g. Integrated Management of Neonatal Sepsis"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Clinical Specialty</label>
                <select
                  value={compilerCategoryInput}
                  onChange={(e) => setCompilerCategoryInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Maternal Health">Maternal Health</option>
                  <option value="Emergency Care">Emergency Care</option>
                  <option value="Infectious Disease">Infectious Disease</option>
                  <option value="Neonatal & Pediatric Care">Neonatal &amp; Pediatric Care</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-700 rounded-2xl p-5 text-center hover:border-cyan-500 transition-colors bg-slate-950/60 block cursor-pointer">
                <Upload size={28} className="text-cyan-400 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-white">
                  {attachedFiles.length > 0
                    ? `${attachedFiles.length} File(s) Attached (${uploadedFileName})`
                    : 'Upload PDFs, Word Docs, Slide Text, Video Lectures, or Audio Briefings'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Supports .pdf, .docx, .txt, .md, .mp4, .webm, .mp3, .wav (Multiple files allowed)
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md,.csv,.json,.html,.mp4,.webm,.mp3,.wav"
                  onChange={handleSlideFileUpload}
                  className="hidden"
                />
              </label>

              {attachedFiles.length > 0 && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 max-h-36 overflow-y-auto">
                  <div className="text-[10px] font-black text-cyan-400 uppercase">
                    Attached Curriculum Files ({attachedFiles.length})
                  </div>
                  {attachedFiles.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
                    >
                      <span className="truncate">
                        <strong className="text-cyan-300">[{f.category}]</strong> {f.name} ({f.sizeKB}{' '}
                        KB)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setAttachedFiles((prev) => prev.filter((item) => item.id !== f.id))
                        }
                        className="text-rose-400 hover:text-rose-300 text-[11px] font-bold ml-3 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Or Paste Multi-Module Lecture Slides / MoH Clinical Guideline Text
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCompilerTitleInput(
                        'Helping Babies Breathe: Golden Minute Neonatal Resuscitation'
                      );
                      setCompilerCategoryInput('Neonatal & Pediatric Care');
                      setCompilerInput(
                        `Module 1: Preparation for Birth & Equipment Readiness\nCheck self-inflating bag-and-mask (240 mL), penguin suction bulb, warm dry towels, and cord clamps before every delivery.\nRural HC III Adaptation: Warm towels over a clean heat source and verify room-air resuscitation readiness.\n\nModule 2: The Golden Minute — Drying, Stimulation & Airway Clearing\nDry thoroughly, remove wet cloth, stimulate the back, and position the head in the sniffing position within 60 seconds.\nRural HC III Adaptation: Avoid routine deep suctioning unless meconium is obstructing the airway.\n\nModule 3: Positive Pressure Ventilation (PPV) & Heart Rate Assessment\nInitiate bag-and-mask ventilation at 40 breaths per minute if apneic or gasping; verify chest rise and auscultate heart rate (>100 bpm).\nRural HC III Adaptation: Prepare immediate SBAR kangaroo-position referral if baby requires prolonged ventilation.`
                      );
                    }}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    Load Sample 3-Module Document
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={compilerInput}
                  onChange={(e) => setCompilerInput(e.target.value)}
                  placeholder="Paste clinical protocols with Module 1:, Module 2:, Module 3: headings for exact 1-to-1 module alignment..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setIsCompilerOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRunCompiler}
                disabled={isCompiling}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isCompiling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Synthesizing with Pamoja-MedLM...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Compile &amp; Open in Authoring Canvas
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: NO-CODE CLINICAL SIMULATION GENERATOR            */}
      {/* ========================================================= */}
      {isSimGenOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
                  Standardized Simulation Engines
                </span>
                <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
                  No-Code Clinical Simulation Generator (Module {simGenTargetModule + 1})
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsSimGenOpen(false);
                  setGeneratedSimData(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Clinical Emergency Scenario / Focus Topic
              </label>
              <input
                type="text"
                value={simGenTopicContext}
                onChange={(e) => setSimGenTopicContext(e.target.value)}
                placeholder="e.g. Refractory Atonic Postpartum Hemorrhage with Shock Index 1.4"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'engineA', label: 'Engine A', title: '90s Action Sequencer', desc: 'Physiological vitals clock' },
                { id: 'engineB', label: 'Engine B', title: 'Voice SBAR Grader', desc: 'Communication rubrics' },
                { id: 'engineD', label: 'Engine D', title: '3D WebAR Manikin', desc: 'Calibrated drape & vectors' }
              ].map((eng) => (
                <button
                  key={eng.id}
                  onClick={() => setSimGenEngine(eng.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    simGenEngine === eng.id
                      ? 'bg-purple-950 border-purple-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase text-purple-400">{eng.label}</div>
                  <div className="text-xs font-bold text-white mt-1">{eng.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{eng.desc}</div>
                </button>
              ))}
            </div>

            {generatedSimData && (
              <div className="bg-slate-950 border border-purple-800/60 rounded-2xl p-5 space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-purple-300">{generatedSimData.engine}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                    Compiled by Pamoja-MedLM
                  </span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-48">
                  {JSON.stringify(generatedSimData, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsSimGenOpen(false);
                  setGeneratedSimData(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Close
              </button>
              {generatedSimData ? (
                <button
                  onClick={handleAttachSimToModule}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5"
                >
                  <Check size={16} /> Attach Simulation to Module {simGenTargetModule + 1}
                </button>
              ) : (
                <button
                  onClick={handleGenerateSimulation}
                  disabled={isGeneratingSim}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
                >
                  {isGeneratingSim ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Synthesizing Simulation...
                    </>
                  ) : (
                    <>
                      <Zap size={15} /> Generate Simulation with Pamoja AI
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
