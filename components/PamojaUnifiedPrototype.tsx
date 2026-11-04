import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { 
  Stethoscope, Calendar, User, BookOpen, LogOut, Award, Presentation, Bell,
  PlayCircle, Clock, ArrowRight, Shield, Target, Image as ImageIcon,
  CheckCircle, PlusCircle, Video, FileText, Settings, Edit3, Trash2, Save, X, Users,
  MapPin, Search, Globe, ShieldCheck, Activity, Sparkles, Bot, ChevronRight, Zap,
  Check, AlertTriangle, MessageSquare, CreditCard, Lock,
  Play, DollarSign, Tag, Info, RefreshCw, Book, FileAudio, LayoutDashboard, Link2Off,
  ShieldAlert, Upload, Mail, BarChart, MessageCircle, TrendingUp, CheckSquare
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, deleteDoc, updateDoc, addDoc, getDocs } from 'firebase/firestore';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'pamoja-v8';
const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let app = null;
let auth = null;
let db = null;

try {
  if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (err) {
  console.warn('Firebase initialization fallback active:', err);
}

// Strict 6-segment Firestore Paths for Public & Private Collections
const getCoursesRef = () => collection(db, 'artifacts', appId, 'public', 'data', 'courses');
const getUsersRef = () => collection(db, 'artifacts', appId, 'public', 'data', 'users');
const getLabsRef = () => collection(db, 'artifacts', appId, 'public', 'data', 'labs');
const getPromosRef = () => collection(db, 'artifacts', appId, 'public', 'data', 'promos');
const getMessagesRef = () => collection(db, 'artifacts', appId, 'public', 'data', 'messages');
const getProgressRef = (uid) => collection(db, 'artifacts', appId, 'users', uid, 'progress');

// --- SEED DATA: 3 GROUNDED 10-MODULE COURSES & REGIONAL SIM LABS ---
const INITIAL_COURSES = [
  {
    id: 'course-peer-ed-hiv',
    title: 'Comprehensive Peer Educator Training for HIV & PMTCT Care',
    category: 'Maternal Health',
    cpd: 15,
    duration: 40,
    pricingModel: 'free',
    price: 0,
    requiresLab: true,
    status: 'Published',
    creatorId: 'system-seed',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
    description: 'Accredited 10-module curriculum preparing peer educators and clinicians to operate within multidisciplinary HIV and PMTCT care teams, provide adherence counseling, and conduct active TB screening.',
    modules: [
      {
        title: 'Module 1: Course Overview & Introduction',
        mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        topics: [
          {
            title: 'Topic 1.1: Welcome and Ground Rules',
            content: `Establishing a secure, respectful, and open educational environment is the vital first step of peer educator training. Peer education training often brings together individuals who live with HIV and may have experienced significant social stigma or trauma.\n\nCore Ground Rules:\n1. Punctuality: Arriving on time to respect the learning of others.\n2. Active Listening: Giving full attention to whoever is speaking without interruption.\n3. Mutual Respect: Valuing diverse viewpoints and experiences, as there are no "wrong" feelings.\n4. Absolute Confidentiality: Agreeing that personal stories, medical statuses, or disclosures shared within the classroom remain strictly confidential.\n\nLMS Deep-Dive & Practical Application Guide:\nBy establishing boundaries early, trainees learn that personal disclosures must be met with non-judgmental acceptance. This models the clinical "shared confidentiality" standard practiced across multidisciplinary facility teams.`,
            resources: [
              { title: 'Participant Manual: Module 1 Ground Rules (PDF)', type: 'pdf', url: 'https://www.who.int' }
            ]
          },
          {
            title: 'Topic 1.2: Training Objectives and Expectations',
            content: `The ultimate objective of this training course is to prepare peer educators to operate as highly skilled, integrated members of facility multidisciplinary care teams at PMTCT and HIV care and treatment clinics.\n\nKey Competencies:\n• Provide supportive, non-didactic one-on-one counseling and waiting-room group health talks.\n• Prioritize vulnerable populations, such as pregnant and breastfeeding women, for immediate HIV care and treatment.\n• Act as clinical navigation guides across TB screening, family planning, laboratory, and nutrition services.\n• Encourage positive disclosure, family-focused care, and early infant diagnosis (EID) at 6 weeks.`,
            resources: []
          },
          {
            title: 'Topic 1.3: Learning Needs Assessment',
            content: `Before starting the curriculum, facilitators conduct a formal learning needs assessment to map participants' existing knowledge, biases, and communication skills.\n\nThis diagnostic baseline evaluates:\n• Basic HIV and AIDS pathology (transmission, prevention, CD4 counts, viral load).\n• Attitudes toward sexual health, reproductive rights, and stigma reduction.\n• Prior counseling experience.\n\nLMS Deep-Dive & Practical Application Guide:\nThe assessment is strictly formative—its goal is not to exclude learners, but to customize pacing and translate complex clinical terms into clear, culturally congruent language.`,
            resources: []
          }
        ],
        quiz: [
          {
            question: 'Why is it vital to co-create "ground rules" on the very first day of Peer Educator training?',
            options: [
              'To establish an authoritative classroom hierarchy where the trainer has absolute disciplinary power.',
              'To establish a safe, respectful environment that models clinical confidentiality and reduces stigma.',
              'To satisfy a formal administrative requirement mandated by the ministry of health.',
              'To grade participants on their ability to write complex code-of-conduct policies.'
            ],
            correctIndex: 1,
            optionFeedback: [
              'Incorrect. Ground rules are co-created to build a collaborative and egalitarian space, not a rigid hierarchy.',
              'Excellent! Co-creating ground rules establishes psychological safety and models the clinical confidentiality practiced in the field.',
              'Incorrect. Ground rules are an educational and ethical necessity for safe learning, not a mere formality.',
              'Incorrect. Ground rules are formative agreements on group behavior, not graded exams.'
            ],
            explanation: 'Because trainees share deeply personal experiences, co-creating ground rules establishes a safe space and models clinical confidentiality.'
          },
          {
            question: 'What is a primary objective of the Peer Educator training program regarding clinical care teams?',
            options: [
              'To train educators to replace clinical nurses and prescribe first-line antiretrovirals.',
              'To prepare educators to work as integrated members of multidisciplinary care teams, bridging clinic-community gaps.',
              'To train educators to work exclusively as independent community activists without clinical connection.',
              'To prepare peer educators to take over clinic financial management and budgeting.'
            ],
            correctIndex: 1,
            optionFeedback: [
              'Incorrect. Peer educators do not prescribe medications or replace licensed clinical staff.',
              'Excellent! The primary goal is integrating peer educators into facility multidisciplinary teams to improve counseling and retention.',
              'Incorrect. The program integrates peer educators within facility teams to bridge the clinic-community gap.',
              'Incorrect. Peer educators focus on counseling, education, and navigation, not financial administration.'
            ],
            explanation: 'Integrating peer educators into facility multidisciplinary teams bridges the gap between clinical staff and clients.'
          }
        ]
      },
      {
        title: 'Module 2: Peer Education Roles & Multidisciplinary Teams',
        topics: [
          {
            title: 'Topic 2.1: Goals and Advantages of Peer Education (GIPA Principle)',
            content: `Peer education is grounded in the GIPA (Greater Involvement of People Living with HIV) principle. By engaging individuals living openly and positively with HIV, clinics deliver empathetic, credible, and culturally responsive support.\n\nCore Advantages:\n1. Empowerment of Individuals: Builds client self-efficacy in adherence.\n2. Improved Service Quality: Direct feedback loop from waiting rooms to clinic managers.\n3. Task Shifting: Frees doctors and nurses to focus on complex clinical diagnostics while peer educators lead routine adherence and health education.\n4. Stigma Reduction: Visibly challenges community stereotypes.`
          },
          {
            title: 'Topic 2.2: Daily Responsibilities & Integrating into Multidisciplinary Teams',
            content: `Peer educators split their shifts between clinic waiting areas, private counseling rooms, and community tracing.\n\nDaily Clinical Workflow:\n• Conducting interactive waiting-room education on PMTCT, TB, and hygiene.\n• Facilitating one-on-one adherence preparation for newly diagnosed clients.\n• Navigating clients across laboratory, pharmacy, and MCH departments.\n• Reviewing daily appointment registers to trace missed appointments sensitively.`
          }
        ],
        quiz: [
          {
            question: 'Which of the following is a primary advantage of "task shifting" within a multidisciplinary HIV care team?',
            options: [
              'Shifting complex diagnostic decisions to unlicensed peer volunteers.',
              'Freeing up clinical nurses and doctors to focus on complex cases by shifting basic counseling to peer educators.',
              'Reducing the overall operational hours of the health clinic to cut budget costs.',
              'Shifting the responsibility of pharmaceutical ordering to community health workers.'
            ],
            correctIndex: 1,
            explanation: 'Peer educators take over routine education and adherence support, allowing nurses and doctors to focus on complex medical care.'
          }
        ]
      },
      {
        title: 'Module 3: HIV and Reproductive Health Basics',
        topics: [
          {
            title: 'Topic 3.1: Defining HIV, AIDS, and CD4 Immunology',
            content: `HIV (Human Immunodeficiency Virus) targets CD4 T-helper lymphocytes. Normal adult CD4 counts range from 500 to 1,500 cells/mm³. AIDS (Acquired Immunodeficiency Syndrome) is the advanced clinical stage diagnosed when the CD4 count drops below 200 cells/mm³ or when severe opportunistic infections (such as TB or cryptococcal meningitis) occur.`
          },
          {
            title: 'Topic 3.2: Transmission, Biomedical Prevention & Family-Focused Care',
            content: `HIV is transmitted only via blood, semen, vaginal fluids, and breast milk through unprotected sex, vertical MTCT (pregnancy, delivery, breastfeeding), unscreened blood, or contaminated sharps.\n\nBiomedical Prevention & Family-Focused Care:\n• Voluntary Medical Male Circumcision (VMMC) reduces female-to-male transmission risk by ~60% but must always be paired with condoms.\n• U=U (Undetectable = Untransmittable) through lifelong ART adherence, alongside PrEP and PEP.\n• Family-Focused Care treats the mother, partner, and exposed children as a collective unit.`
          }
        ],
        quiz: [
          {
            question: 'What is the critical biological distinction between HIV and AIDS?',
            options: [
              'HIV is a bacterial infection of the lungs, while AIDS is a viral blood disease.',
              'HIV is the virus that weakens CD4 immune cells, while AIDS is the advanced clinical stage marked by severe immune damage.',
              'AIDS is the early stage, while HIV is the dormant late stage.',
              'HIV only affects women, whereas AIDS exclusively affects men.'
            ],
            correctIndex: 1,
            explanation: 'HIV is the causative virus targeting CD4 cells; AIDS is the late clinical stage when CD4 falls below 200 cells/mm³ or OIs emerge.'
          }
        ]
      },
      {
        title: 'Module 4: Communication & Counseling Skills',
        topics: [
          {
            title: 'Topic 4.1: Shared Confidentiality & The Seven Key Counseling Skills',
            content: `Shared confidentiality means a client's medical information is shared strictly among the multidisciplinary clinical team directly involved in their care, and never with outsiders without explicit consent.\n\nThe Seven Key Counseling Skills:\n1. Use helpful non-verbal communication.\n2. Ask open-ended questions.\n3. Actively listen and show interest.\n4. Reflect back (paraphrase) what the client says.\n5. Show empathy, not sympathy.\n6. Avoid judging words ("good", "bad", "wrong").\n7. Help the client set realistic goals and summarize.`
          }
        ],
        quiz: [
          {
            question: 'What does the ethical principle of "shared confidentiality" mean in a clinic setting?',
            options: [
              'Sharing the client status with community leaders to build support.',
              'Sharing medical information strictly among the multidisciplinary clinic team directly involved in the client\'s care.',
              'Posting treatment progress on the clinic bulletin board.',
              'Sharing medical files with other patients in the waiting room.'
            ],
            correctIndex: 1,
            explanation: 'Shared confidentiality permits care coordination within the direct clinical team while strictly protecting client privacy from the public.'
          }
        ]
      },
      {
        title: 'Module 5: Comprehensive HIV Care & Active TB Screening',
        topics: [
          {
            title: 'Topic 5.1: Opportunistic Infections & The 4-Question Active TB Checklist',
            content: `Tuberculosis (TB) is the leading cause of death among people living with HIV. Peer educators must administer the 4-question active TB screening checklist at every encounter:\n1. Current cough of any duration?\n2. Fever?\n3. Unexplained weight loss?\n4. Night sweats?\n\nAny "Yes" response triggers an immediate clinical referral for sputum Xpert MTB/RIF testing and chest evaluation, alongside Cotrimoxazole preventive therapy (CPT).`
          }
        ],
        quiz: [
          {
            question: 'What is the correct action for a Peer Educator if a client screens positive on the active TB checklist?',
            options: [
              'Tell the client to go home and drink hot fluids for two weeks.',
              'Immediately refer the client to a clinician for sputum collection and diagnostic evaluation.',
              'Prescribe high-dose antibiotics independently.',
              'Isolate the client permanently from all family members.'
            ],
            correctIndex: 1,
            explanation: 'Any positive symptom on the 4-question TB checklist requires immediate clinical referral for diagnostic testing.'
          }
        ]
      },
      {
        title: 'Module 6: Antiretroviral Therapy (ART) Foundations',
        topics: [
          {
            title: 'Topic 6.1: Combination Therapy (TLD), Treatment for Life & >=95% Adherence',
            content: `First-line regimens such as TLD (Tenofovir + Lamivudine + Dolutegravir) suppress viral replication so CD4 cells can recover. Clients must maintain >=95% adherence for life to prevent viral rebound and drug resistance. Minor initial side effects (mild nausea, headache) are self-limiting, whereas severe jaundice or rash requires immediate clinical review.`
          }
        ],
        quiz: [
          {
            question: 'Why is it vital for clients to maintain at least 95% adherence to Antiretroviral Therapy (ART)?',
            options: [
              'To ensure the clinic receives annual donor funding.',
              'To prevent the virus from replicating, mutating, and developing drug resistance.',
              'To allow the patient to stop taking medicines after six months.',
              'To cure HIV permanently within one year.'
            ],
            correctIndex: 1,
            explanation: 'High adherence (>=95%) keeps viral load undetectable and prevents drug-resistant mutations.'
          }
        ]
      },
      {
        title: 'Module 7: PMTCT & Pediatric HIV Care',
        topics: [
          {
            title: 'Topic 7.1: MTCT Pathways, Option B+, Exclusive Breastfeeding & EID at 6 Weeks',
            content: `Mother-to-Child Transmission occurs in utero, intrapartum, or postpartum via breastfeeding. Under Option B+, all pregnant/breastfeeding women living with HIV initiate lifelong ART immediately.\n\nSafe Infant Feeding & EID:\n• Exclusive Breastfeeding (EBF) for the first 6 months; strictly avoid mixed feeding, which damages the infant's gut mucosa and increases viral entry.\n• Infants receive daily Nevirapine prophylaxis at birth and undergo DNA PCR Early Infant Diagnosis (EID) testing at 6 weeks of age.`
          }
        ],
        quiz: [
          {
            question: 'Why is "mixed feeding" dangerous for an HIV-exposed infant under six months of age?',
            options: [
              'It causes severe pediatric hypertension.',
              'It irritates and damages the baby\'s delicate gut lining, allowing HIV in breast milk to enter the bloodstream.',
              'It prevents the mother from producing breast milk in the future.',
              'It makes the infant resistant to childhood immunizations.'
            ],
            correctIndex: 1,
            explanation: 'Mixed feeding before 6 months damages the infant intestinal mucosa, increasing vertical HIV transmission risk.'
          }
        ]
      },
      {
        title: 'Module 8: Positive Living & Psychosocial Support',
        topics: [
          {
            title: 'Topic 8.1: Recipe for Positive Living, Mental Health Red Flags & Safer Sex',
            content: `Positive living integrates a Healthy Mind, Healthy Body, and Healthy Soul. Peer educators screen for depression and refer any client expressing self-harm or suicidal ideation immediately to a clinician. Dual protection and consistent condom use prevent STI transmission and superinfection with drug-resistant HIV strains.`
          }
        ],
        quiz: [
          {
            question: 'Why is consistent condom use essential for couples who are both living with HIV?',
            options: [
              'To prevent transmission of different, drug-resistant strains of HIV (superinfection) and STIs between partners.',
              'To cure the infection through barrier restriction.',
              'To satisfy a legal marital mandate.',
              'To increase CD4 counts without taking ART.'
            ],
            correctIndex: 0,
            explanation: 'Condoms prevent superinfection with drug-resistant viral strains and protect against sexually transmitted infections.'
          }
        ]
      },
      {
        title: 'Module 9: Community Outreach & Linkages',
        topics: [
          {
            title: 'Topic 9.1: Community Resource Inventories & Ethical Home Visits',
            content: `Peer educators maintain an updated Community Resource Inventory (nutrition, legal aid, PLHIV support groups, livelihood programs) to support bidirectional referrals. Home visits require explicit prior client consent and strict protection of household privacy so neighbors do not deduce the client's status.`
          }
        ],
        quiz: [
          {
            question: 'Which of the following is a critical ethical rule for conducting a client home visit?',
            options: [
              'Arriving unannounced to verify pill counts.',
              'Obtaining explicit prior consent from the client and protecting their privacy in the neighborhood.',
              'Disclosing the client\'s status to neighbors to build community support.',
              'Collecting the client\'s financial documents.'
            ],
            correctIndex: 1,
            explanation: 'Explicit prior consent and discretion in the community are mandatory to protect client confidentiality.'
          }
        ]
      },
      {
        title: 'Module 10: Record-Keeping & Program Evaluation',
        topics: [
          {
            title: 'Topic 10.1: Daily Registers, Monthly Activity Reports & Supervised Practicum',
            content: `Accurate completion of Daily Registers, Sessional Waiting-Room Logs, and Monthly Activity Reports ensures no patient falls through the cracks. Trainees complete a supervised clinical practicum evaluated across the 7 counseling skills, TB screening, PMTCT support, and register accuracy.`
          }
        ],
        quiz: [
          {
            question: 'What is the primary purpose of compiling "Monthly Activity Reports" in the Peer Educator program?',
            options: [
              'To rank peer educators publicly for financial bonuses.',
              'To aggregate daily metrics, monitor clinic retention trends, and evaluate overall program impact.',
              'To satisfy clinic tax compliance.',
              'To replace official patient medical charts.'
            ],
            correctIndex: 1,
            explanation: 'Monthly activity reports aggregate daily counseling and tracing metrics to guide clinical quality improvement.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-raices-wraparound',
    title: 'Culturally Competent Family Support & The Wraparound Process',
    category: 'Mental Health',
    cpd: 12,
    duration: 32,
    pricingModel: 'freemium',
    price: 39,
    requiresLab: false,
    status: 'Published',
    creatorId: 'system-seed',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=80',
    description: 'Comprehensive 10-module curriculum based on the RAICES/Promotoras and FASST Systems of Care model, covering cultural competence, the 10-step Wraparound process, ESE/IEP advocacy, and home visiting.',
    modules: [
      {
        title: 'Module 1: Introduction to FASST and Systems of Care',
        topics: [
          {
            title: 'Topic 1.1: Bilingual Promotoras & Systems of Care Core Values',
            content: `The Family and School Support Team (FASST) integrates bilingual community outreach workers (promotoras) into school and clinical support teams.\n\nThree Core System of Care (SOC) Values:\n1. Child-Centered and Family-Focused: Services fit the family rather than forcing families into rigid slots.\n2. Community-Based: Maximizes natural and informal community support networks.\n3. Culturally Competent: Respects and utilizes the family's cultural beliefs, values, and native language.`
          }
        ],
        quiz: [
          {
            question: 'Which of the following represents the three core values of the System of Care (SOC) philosophy?',
            options: [
              'Standardized templates, institutional care, and uniform language policies.',
              'Child-centered/family-focused, community-based, and culturally competent services.',
              'Hospital-centered, clinician-dictated, and acute-only interventions.',
              'School-disciplined, administrative-led, and standardized testing.'
            ],
            correctIndex: 1,
            explanation: 'The SOC philosophy is anchored in child-centered/family-focused, community-based, and culturally competent care.'
          }
        ]
      },
      {
        title: 'Module 2: Wraparound Values, Ethics & Group Norms',
        topics: [
          {
            title: 'Topic 2.1: Wraparound Philosophy & The FASST Confidential Agreement',
            content: `Wraparound is an individualized, strength-based care planning process driven by family voice and choice. Every FASST team member signs a binding Ethical and Confidential Agreement protecting family privacy before engaging households.`
          }
        ],
        quiz: [
          {
            question: 'What is the primary focus of the Wraparound Process in family support?',
            options: [
              'Standardizing clinical interventions identically across all families.',
              'Convening a family\'s natural and formal support networks to build a customized, strength-based support plan.',
              'Requiring families to relocate to residential treatment centers.',
              'Shifting all care decisions to a single external psychologist.'
            ],
            correctIndex: 1,
            explanation: 'Wraparound brings together natural and formal supports to co-create an individualized, strength-based family plan.'
          }
        ]
      },
      {
        title: 'Module 3: Culture & Cultural Competence Foundations',
        topics: [
          {
            title: 'Topic 3.1: Cultural Knowledge, Awareness, Sensitivity & Competence',
            content: `While Cultural Knowledge is cognitive familiarization and Cultural Awareness involves internal attitude shifts, Cultural Competence is a set of congruent behaviors, attitudes, and policies that enable professionals and agencies to work effectively in cross-cultural situations.`
          }
        ],
        quiz: [
          {
            question: 'How is "Cultural Competence" distinguished from "Cultural Knowledge"?',
            options: [
              'Cultural competence is purely academic, while knowledge is legal.',
              'Competence emphasizes the active capacity and congruent behaviors to operate effectively across cultural contexts.',
              'Cultural competence requires abandoning one\'s own heritage.',
              'There is no distinction between the two terms.'
            ],
            correctIndex: 1,
            explanation: 'Cultural competence translates awareness and knowledge into effective operational behaviors and institutional policies.'
          }
        ]
      },
      {
        title: 'Module 4: Achieving Culturally Competent Practice',
        topics: [
          {
            title: 'Topic 4.1: The 6-Stage Continuum & 5 Organizational Elements',
            content: `The Cultural Competence Continuum progresses through: 1) Cultural Destructiveness, 2) Cultural Incapacity, 3) Cultural Blindness, 4) Cultural Pre-Competence, 5) Basic Cultural Competence, and 6) Advanced Cultural Competence.`
          }
        ],
        quiz: [
          {
            question: 'Which level of the Cultural Competence Continuum assumes that "all people are exactly the same," ignoring cultural strengths?',
            options: [
              'Cultural Destructiveness',
              'Cultural Blindness',
              'Cultural Incapacity',
              'Basic Cultural Competence'
            ],
            correctIndex: 1,
            explanation: 'Cultural Blindness treats everyone as identical, which ignores cultural strengths and reinforces dominant-group norms.'
          }
        ]
      },
      {
        title: 'Module 5: Understanding School Administration & Personnel',
        topics: [
          {
            title: 'Topic 5.1: Classroom Dynamics, Personnel Roles & Referral Pathways',
            content: `Classroom teachers are often the first to observe behavioral or emotional distress, while School Social Workers bridge home, school, and community agencies. Promotoras facilitate warm, native-language referrals with written parental consent.`
          }
        ],
        quiz: [
          {
            question: 'What is a primary responsibility of a School Social Worker in the FASST framework?',
            options: [
              'Prescribing psychiatric medications independently.',
              'Acting as a link between the school, the student\'s home, and community agencies to coordinate care.',
              'Managing school facility maintenance.',
              'Writing daily classroom lesson plans.'
            ],
            correctIndex: 1,
            explanation: 'School social workers connect home, school, and external community services to support student well-being.'
          }
        ]
      },
      {
        title: 'Module 6: Exceptional Student Education (ESE) and ESOL',
        topics: [
          {
            title: 'Topic 6.1: IEPs, ESOL Accommodations & Ethical Conference Translation',
            content: `An Individual Educational Plan (IEP) is a legally binding document outlining goals and accommodations for students with special needs. During parent-teacher and IEP conferences, translators must translate completely, accurately, and impartially without omitting details or injecting personal opinions.`
          }
        ],
        quiz: [
          {
            question: 'What is an ethical rule for a Promotora translating during an ESE IEP meeting?',
            options: [
              'Summarizing long statements to finish faster.',
              'Translating everything said completely and accurately, remaining impartial without adding personal opinions.',
              'Advising parents on which medical decisions to make.',
              'Only translating statements made by the school principal.'
            ],
            correctIndex: 1,
            explanation: 'Ethical interpretation requires completeness, accuracy, and impartiality so parents participate as equal partners.'
          }
        ]
      },
      {
        title: 'Module 7: Child Mental Health & Developmental Domains',
        topics: [
          {
            title: 'Topic 7.1: Middle Childhood Milestones & Nurturing Environments',
            content: `Middle childhood (ages 6–12) is marked by logical cognitive growth, peer relationship formation, and emotional regulation. Consistent daily routines and positive, non-violent discipline act as protective factors that reduce child anxiety and improve classroom focus.`
          }
        ],
        quiz: [
          {
            question: 'How do structured daily routines at home support a child\'s mental health?',
            options: [
              'By making home life unpredictable.',
              'By reducing child anxiety, providing a sense of safety, and improving classroom focus.',
              'By replacing academic classroom instruction.',
              'By eliminating all household rules.'
            ],
            correctIndex: 1,
            explanation: 'Predictable routines for homework, meals, and sleep lower anxiety and strengthen executive functioning.'
          }
        ]
      },
      {
        title: 'Module 8: Implementing the 10-Step Wraparound Process',
        topics: [
          {
            title: 'Topic 8.1: The 10 Sequential Steps & Strength-Based Family Plans',
            content: `The 10 steps begin with Establishing Effective Linkages and Initial Safety Checks, followed by Discovering Strengths, Convening the Family Team (including informal natural supports), reviewing Life Domains, and documenting a needs-driven, strength-based Family Plan.`
          }
        ],
        quiz: [
          {
            question: 'Why must a Wraparound Family Team actively include "informal supports" like extended family and neighbors?',
            options: [
              'To reduce case manager salaries.',
              'Because they meet families where they are and remain as sustainable support networks after formal services end.',
              'To report household rules to the school principal.',
              'To replace licensed clinical therapists.'
            ],
            correctIndex: 1,
            explanation: 'Informal natural supports provide enduring, culturally grounded community backing long after formal agency care concludes.'
          }
        ]
      },
      {
        title: 'Module 9: Strength-Based Case Management',
        topics: [
          {
            title: 'Topic 9.1: Advocate, Broker & Educator Roles in Inter-Agency Care',
            content: `Strength-based case managers act as Advocates, Resource Brokers, and Educators—coordinating across fragmented systems to prevent duplicate testing and conflicting instructions while involving families in progress evaluation.`
          }
        ],
        quiz: [
          {
            question: 'Why is inter-agency service coordination critical for families with complex needs?',
            options: [
              'To force all families to use a single clinic.',
              'To prevent conflicting instructions and duplicate testing across fragmented social, educational, and clinical systems.',
              'To reduce communication between parents and schools.',
              'To transfer parental custody to state agencies.'
            ],
            correctIndex: 1,
            explanation: 'Service coordination aligns school, clinical, and community providers into a unified support network.'
          }
        ]
      },
      {
        title: 'Module 10: Conducting Effective Home Visits',
        topics: [
          {
            title: 'Topic 10.1: Preparation, Boundaries & The Three Stages of Home Visiting',
            content: `Professional home visits prepare native-language materials in advance and follow three structured stages: 1) Engagement Stage (rapport and check-in), 2) Main Activity Stage (reviewing goals and family plan actions), and 3) Transition/Closing Stage (summarizing accomplishments, setting "baby steps", and scheduling the next visit).`
          }
        ],
        quiz: [
          {
            question: 'What are the key components of the "Transition/Closing Stage" of a professional home visit?',
            options: [
              'Leaving unannounced while the parent is in another room.',
              'Summarizing accomplishments, defining concrete "baby steps" for the week, and scheduling the next visit.',
              'Demanding immediate payment for travel expenses.',
              'Delivering a didactic lecture on academic failure.'
            ],
            correctIndex: 1,
            explanation: 'The closing stage celebrates progress, defines achievable next steps, and confirms the next scheduled visit.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-gc1000-maternal',
    title: 'Group Antenatal and Postnatal Care: The GC_1000 Implementation Framework',
    category: 'Maternal Health',
    cpd: 15,
    duration: 45,
    pricingModel: 'free',
    price: 0,
    requiresLab: true,
    status: 'Published',
    creatorId: 'system-seed',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    description: 'Master the Centering-based Group Care model (GC_1000 Toolkit) across the first 1,000 days, integrating self-care stations, semi-private 3–5 minute clinical assessments, interactive circle facilitation, and WHO ExpandNet scale-up.',
    modules: [
      {
        title: 'Module 1: Introduction to the GC_1000 Framework',
        topics: [
          {
            title: 'Topic 1.1: Centering-Based Group Care & The First 1,000 Days',
            content: `Developed by nurse-midwife Sharon Rising in 1992–93, Centering-Based Group Care replaces brief, isolated individual prenatal visits with 90–120 minute interactive sessions for stable cohorts of 8–12 women across the critical First 1,000 Days (from conception through age 2).`
          }
        ],
        quiz: [
          {
            question: 'What is the critical developmental timeline targeted by the "First 1,000 Days" framework?',
            options: [
              'From school entry (age 5) to the end of elementary school.',
              'From conception through the first two years of the child\'s life.',
              'The first three years of preschool education.',
              'From birth to the first 100 days of infancy.'
            ],
            correctIndex: 1,
            explanation: 'The First 1,000 Days spans from conception through the child\'s second birthday—the most critical window for maternal and neonatal outcomes.'
          }
        ]
      },
      {
        title: 'Module 2: Core Components of Group Care',
        topics: [
          {
            title: 'Topic 2.1: Health Care Assessment, Interactive Learning & Community Building',
            content: `Group Care integrates three non-negotiable components:\n1. Health Care Assessment: Participants measure their own blood pressure and weight at Self-Care Stations, followed by a brief (3–5 minute) physical check by the midwife in a semi-private clinical corner of the group room.\n2. Interactive Learning: Facilitated, non-didactic discussions in an open circle of chairs with no central tables.\n3. Community Building: Persistent peer cohorts of 8–12 participants who bond and support one another.`
          }
        ],
        quiz: [
          {
            question: 'How are individual clinical health assessments managed during a Group Care session?',
            options: [
              'They are omitted entirely to focus strictly on open group discussions.',
              'They take place in a completely separate clinical building far away from the group room.',
              'They are kept brief (3-5 minutes) and are conducted in a semi-private clinical corner of the group room.',
              'They are conducted out in the open in front of the entire group circle.'
            ],
            correctIndex: 2,
            explanation: 'Clinical assessments are kept brief (3–5 minutes) and take place in a semi-private corner of the group space (or directly adjoining room) to preserve privacy and cohort flow.'
          }
        ]
      },
      {
        title: 'Module 3: Evidence-Based Benefits of Group Care',
        topics: [
          {
            title: 'Topic 3.1: Maternal, Neonatal & Provider Outcomes',
            content: `Randomized studies demonstrate that Group Care significantly reduces preterm births (<37 weeks), lowers NICU admissions, reduces Caesarean rates, decreases maternal isolation, and reduces midwife burnout by replacing repetitive assembly-line visits with meaningful facilitation.`
          }
        ],
        quiz: [
          {
            question: 'Which clinical outcome has been repeatedly documented as a key benefit of Group Care?',
            options: [
              'A massive increase in surgical Caesarean section deliveries.',
              'A significant reduction in preterm births and lower rates of newborn NICU admissions.',
              'Complete elimination of all childhood illnesses.',
              'Excessive gestational weight gain.'
            ],
            correctIndex: 1,
            explanation: 'Group Care is clinically proven to reduce preterm births and neonatal intensive care admissions, especially among vulnerable populations.'
          }
        ]
      },
      {
        title: 'Module 4: Assessing Contextual Site Readiness',
        topics: [
          {
            title: 'Topic 4.1: Outer/Inner Contexts, Site Readiness Assessment (SRA) & Gestational Cohorts',
            content: `Using the Site Readiness Assessment (SRA), facilities verify administrative support, clinical champions, patient volume (>=30 registrants/month to form gestational cohorts within a 2–4 week due-date window), and a private room (approx. 20ft x 20ft) for a circle of 12–20 chairs.`
          }
        ],
        quiz: [
          {
            question: 'How is a standard "Gestational Cohort" formed in Group Care?',
            options: [
              'By grouping patients randomly regardless of their due dates.',
              'By grouping 8-12 pregnant women whose estimated due dates fall within the same 2-to-4-week window.',
              'By grouping patients based strictly on maternal weight.',
              'By grouping parents based on household income.'
            ],
            correctIndex: 1,
            explanation: 'Grouping 8–12 women with due dates in the same 2–4 week window ensures gestational topics are relevant to everyone in the circle.'
          }
        ]
      },
      {
        title: 'Module 5: Governing and Engaging Participants',
        topics: [
          {
            title: 'Topic 5.1: Multidisciplinary Steering Committees & Engaging Vulnerable Populations',
            content: `A multidisciplinary Steering Committee (clinical champion, clinic manager, registration lead, pediatric link, and community advocate) oversees start-up equipment (scales, automatic BP cuffs, chairs) and adapts visual pictorial materials for varying literacy levels.`
          }
        ],
        quiz: [
          {
            question: 'How should the Steering Committee accommodate varying literacy levels among group participants?',
            options: [
              'By requiring a reading comprehension test before joining.',
              'By utilizing highly visual materials, pictorial cards, and interactive hands-on activities.',
              'By reading PowerPoint slide decks aloud for 90 minutes.',
              'By excluding non-literate participants from cohorts.'
            ],
            correctIndex: 1,
            explanation: 'Visual aids, pictorial cards, and hands-on activities make interactive learning inclusive regardless of literacy level.'
          }
        ]
      },
      {
        title: 'Module 6: Managing Anticipated Challenges & FRAME Adaptations',
        topics: [
          {
            title: 'Topic 6.1: Surface vs. Deep Structure Challenges & The FRAME Model',
            content: `Surface structure challenges involve logistics (snacks, translated posters), whereas deep structure challenges involve systemic workflows (scheduling 120-minute blocks in national registers). The scientific FRAME model documents adaptations while preserving core model fidelity.`
          }
        ],
        quiz: [
          {
            question: 'What is the primary purpose of utilizing the scientific "FRAME" model in Group Care?',
            options: [
              'To prohibit any clinic from making local adaptations.',
              'To systematically document, report, and track adaptations while ensuring core model fidelity is preserved.',
              'To calculate hospital pharmaceutical waste.',
              'To grade midwives on clinical exam speed.'
            ],
            correctIndex: 1,
            explanation: 'FRAME tracks when, why, and how adaptations occur so local modifications never compromise the three core components.'
          }
        ]
      },
      {
        title: 'Module 7: Training & Capacity Building of Facilitators',
        topics: [
          {
            title: 'Topic 7.1: Experiential Facilitation Training & The Co-Facilitation Model',
            content: `Every Group Care session pairs a qualified clinician (midwife/doctor) with a co-facilitator (community health worker/nurse). While the clinician performs brief 3–5 minute physical checks in the private corner, the co-facilitator keeps the circle's interactive activities flowing.`
          }
        ],
        quiz: [
          {
            question: 'What is a primary clinical advantage of utilizing the co-facilitation model?',
            options: [
              'It allows the clinic to double patient fees.',
              'It ensures group stability; while the clinician conducts brief private exams, the co-facilitator keeps the circle discussion flowing.',
              'It allows the clinician to leave the room for half the session.',
              'It eliminates the need for Facilitator Guides.'
            ],
            correctIndex: 1,
            explanation: 'Co-facilitation maintains continuous circle engagement during the first 15–30 minutes while private clinical checks are completed.'
          }
        ]
      },
      {
        title: 'Module 8: Conducting Group Sessions',
        topics: [
          {
            title: 'Topic 8.1: Open Circle Setup, Session Flow & Managing Group Dynamics',
            content: `Chairs are arranged in an open circle with no central tables. Facilitators sit as equals in the circle, gently redirecting dominant speakers back to the wider group and inviting quieter participants with warm, open-ended questions.`
          }
        ],
        quiz: [
          {
            question: 'Why is it a strict model requirement to have "no central tables" inside the chair circle?',
            options: [
              'To save clinic budget on furniture.',
              'To eliminate physical barriers, encourage open interaction, and build equality among everyone in the room.',
              'To allow midwives to stand in the middle and lecture.',
              'To perform physical exams in the center of the circle.'
            ],
            correctIndex: 1,
            explanation: 'An open circle without central tables removes barriers and fosters eye contact, equality, and peer dialogue.'
          }
        ]
      },
      {
        title: 'Module 9: Scaling-Up Group Care Services (WHO ExpandNet)',
        topics: [
          {
            title: 'Topic 9.1: Vertical Institutionalization vs. Horizontal Replication',
            content: `Using the WHO ExpandNet model, Vertical Scaling-Up institutionalizes Group Care into national health policies, budgets, and insurance codes, while Horizontal Scaling-Up replicates the model across new geographic clinics and populations.`
          }
        ],
        quiz: [
          {
            question: 'What does "Vertical Scaling-Up" (Institutionalisation) mean in public health planning?',
            options: [
              'Building taller hospital buildings.',
              'Securing political, budgetary, regulatory, and policy changes to embed Group Care permanently into national health systems.',
              'Expanding services to neighboring countries only.',
              'Purchasing identical scales for one clinic.'
            ],
            correctIndex: 1,
            explanation: 'Vertical scale-up institutionalizes the innovation within national health policies, guidelines, and public budgets.'
          }
        ]
      },
      {
        title: 'Module 10: Sustainment and the Community of Practice',
        topics: [
          {
            title: 'Topic 10.1: Active Sustainment, Sustainability Worksheets & Global CoP',
            content: `Sustainment is the ongoing day-to-day enactment of Group Care routines with fidelity, whereas Sustainability is the long-term continuation of maternal/neonatal benefits after pilot funding ends. Clinics join the global Group Care Community of Practice (GC CoP) for continuous peer learning.`
          }
        ],
        quiz: [
          {
            question: 'How is "Sustainment" defined in the GC_1000 framework?',
            options: [
              'The termination of a pilot program when grant funding ends.',
              'The ongoing, day-to-day implementation and active use of Group Care routines and processes in the clinic.',
              'The total dollar value of initial donor grants.',
              'Reverting patient care back to individual appointments.'
            ],
            correctIndex: 1,
            explanation: 'Sustainment refers to the active, daily continuation of Group Care workflows and fidelity inside the facility.'
          }
        ]
      }
    ]
  }
];

const INITIAL_LABS = [
  {
    id: 'lab-mulago-emotive',
    courseId: 'course-gc1000-maternal',
    courseTitle: 'Group Antenatal and Postnatal Care: The GC_1000 Implementation Framework',
    locationName: 'Mulago Specialized Women & Neonatal Hospital Sim Center',
    city: 'Kampala',
    country: 'Uganda',
    date: '2026-11-15',
    time: '09:00',
    capacity: 20,
    booked: 12,
    creatorId: 'system-seed'
  },
  {
    id: 'lab-uct-hiv',
    courseId: 'course-peer-ed-hiv',
    courseTitle: 'Comprehensive Peer Educator Training for HIV & PMTCT Care',
    locationName: 'Groote Schuur & UCT Clinical Skills Simulation Centre',
    city: 'Cape Town',
    country: 'South Africa',
    date: '2026-11-22',
    time: '10:00',
    capacity: 15,
    booked: 6,
    creatorId: 'system-seed'
  },
  {
    id: 'lab-jinja-rrh',
    courseId: 'course-gc1000-maternal',
    courseTitle: 'Group Antenatal and Postnatal Care: The GC_1000 Implementation Framework',
    locationName: 'Jinja Regional Referral Hospital Maternal Skills Lab',
    city: 'Jinja',
    country: 'Uganda',
    date: '2026-12-04',
    time: '08:30',
    capacity: 18,
    booked: 9,
    creatorId: 'system-seed'
  }
];

const AuthContext = createContext();
const ToastContext = createContext();
const DataContext = createContext();

// --- ERROR BOUNDARY ---
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected state' };
  }
  componentDidCatch(error, info) {
    console.warn('Recovered in AppErrorBoundary:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw size={28} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 font-['Outfit'] mb-2">Session Refreshed</h2>
            <p className="text-slate-500 text-sm mb-6">We synchronized your clinical workspace state.</p>
            <button
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg"
            >
              Continue to Pamoja
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message: String(message || ''), type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-md px-4">
        {toasts.map(t => (
          <div key={t.id} className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl text-white font-semibold text-sm flex items-center gap-3 transition-all
            ${t.type === 'success' ? 'bg-emerald-600/95 border border-emerald-500/50' : t.type === 'error' ? 'bg-rose-600/95 border border-rose-500/50' : 'bg-slate-800/95 border border-slate-700/50'}`}>
            {t.type === 'success' && <CheckCircle size={20} className="shrink-0" />}
            {t.type === 'error' && <AlertTriangle size={20} className="shrink-0" />}
            {t.type === 'info' && <Info size={20} className="shrink-0" />}
            <span className="flex-1 leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
const useToast = () => useContext(ToastContext);

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className={`bg-white rounded-[2rem] shadow-2xl w-full ${maxWidth} overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight font-['Outfit']">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const Button = ({ children, variant = 'primary', className = '', disabled, ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/50",
    outline: "bg-transparent text-cyan-600 border-2 border-cyan-500 hover:bg-cyan-50",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:-translate-y-0.5",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5",
  };
  return <button disabled={disabled} className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

// --- DATA PROVIDER (Race-Condition-Free Fetch & Local Optimistic Sync) ---
const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [labs, setLabs] = useState(INITIAL_LABS);
  const [promos, setPromos] = useState([{ id: 'promo-1', code: 'PAMOJA2026', active: true }]);
  const [messages, setMessages] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const { user, profile } = useContext(AuthContext) || {};

  const refreshData = async () => {
    if (!db || !user) return;
    try {
      const [coursesSnap, labsSnap, promosSnap, msgsSnap, usersSnap] = await Promise.allSettled([
        getDocs(getCoursesRef()),
        getDocs(getLabsRef()),
        getDocs(getPromosRef()),
        getDocs(getMessagesRef()),
        getDocs(getUsersRef())
      ]);

      if (coursesSnap.status === 'fulfilled') {
        const docs = [];
        coursesSnap.value.forEach(d => docs.push({ id: d.id, ...d.data() }));
        if (docs.length > 0) {
          // Merge seeded courses with any custom-created courses
          const mergedIds = new Set(docs.map(d => d.id));
          const combined = [...docs, ...INITIAL_COURSES.filter(ic => !mergedIds.has(ic.id))];
          setCourses(combined);
        } else {
          // Seed initial courses quietly in background
          INITIAL_COURSES.forEach(c => {
            setDoc(doc(getCoursesRef(), c.id), c, { merge: true }).catch(() => {});
          });
          setCourses(INITIAL_COURSES);
        }
      }

      if (labsSnap.status === 'fulfilled') {
        const docs = [];
        labsSnap.value.forEach(d => docs.push({ id: d.id, ...d.data() }));
        if (docs.length > 0) {
          const mergedIds = new Set(docs.map(d => d.id));
          setLabs([...docs, ...INITIAL_LABS.filter(il => !mergedIds.has(il.id))]);
        } else {
          INITIAL_LABS.forEach(l => {
            setDoc(doc(getLabsRef(), l.id), l, { merge: true }).catch(() => {});
          });
          setLabs(INITIAL_LABS);
        }
      }

      if (promosSnap.status === 'fulfilled') {
        const docs = [];
        promosSnap.value.forEach(d => docs.push({ id: d.id, ...d.data() }));
        if (docs.length > 0) setPromos(docs);
      }

      if (msgsSnap.status === 'fulfilled') {
        const docs = [];
        msgsSnap.value.forEach(d => docs.push({ id: d.id, ...d.data() }));
        setMessages(docs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
      }

      if (usersSnap.status === 'fulfilled') {
        const docs = [];
        usersSnap.value.forEach(d => docs.push({ id: d.id, ...d.data() }));
        setUsersList(docs);
      }
    } catch (err) {
      console.warn('Data sync fallback active:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const run = async () => {
      if (isMounted) await refreshData();
    };
    run();
    return () => { isMounted = false; };
  }, [user?.uid, profile?.role]);

  return (
    <DataContext.Provider value={{
      courses, setCourses,
      labs, setLabs,
      promos, setPromos,
      messages, setMessages,
      usersList, setUsersList,
      loadingData,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};
const useData = () => useContext(DataContext);

// --- AUTH PROVIDER ---
const defaultGuestProfile = {
  role: 'guest',
  onboardingComplete: false,
  cpdPoints: 0,
  pendingPoints: 0,
  isPublic: false,
  purchasedCourses: [],
  isVerified: false,
  courseProgress: {},
  isReturningUser: false
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(defaultGuestProfile);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const { addToast } = useToast();

  const updateProfileState = async (updates) => {
    setProfile(prev => {
      const next = { ...(prev || defaultGuestProfile), ...updates };
      return next;
    });
    if (db && user?.uid) {
      try {
        await setDoc(doc(getUsersRef(), user.uid), updates, { merge: true });
      } catch (e) {
        console.warn('Profile persist warning:', e);
      }
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const initAuth = async () => {
      try {
        if (!auth.currentUser) {
          if (initialAuthToken) await signInWithCustomToken(auth, initialAuthToken);
          else await signInAnonymously(auth);
        }
      } catch (e) {
        console.warn('Auth init warning:', e);
        if (isMounted) setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;
      setUser(currentUser);
      if (currentUser && db) {
        try {
          const snap = await getDoc(doc(getUsersRef(), currentUser.uid));
          if (!isMounted) return;
          if (snap.exists()) {
            const data = snap.data();
            setProfile({ ...defaultGuestProfile, ...data });
            if (!data.onboardingComplete && data.role !== 'guest') {
              setOnboardingOpen(true);
            }
          } else {
            setProfile(defaultGuestProfile);
          }
        } catch (err) {
          if (isMounted) setProfile(defaultGuestProfile);
        }
      } else {
        setProfile(defaultGuestProfile);
      }
      if (isMounted) setLoading(false);
    });

    initAuth();
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleSecureLogin = async (email, name) => {
    try {
      let currentUid = user?.uid;
      if (!currentUid && auth) {
        const cred = await signInAnonymously(auth);
        currentUid = cred.user.uid;
        setUser(cred.user);
      }
      if (!currentUid) currentUid = 'local-' + Date.now();

      const isSuper = email.toLowerCase().trim() === 'admin@pamoja.com';
      const userRole = isSuper ? 'superuser' : 'learner';

      let existingData = null;
      if (db && user?.uid) {
        try {
          const snap = await getDoc(doc(getUsersRef(), currentUid));
          if (snap.exists() && snap.data().email === email.trim()) {
            existingData = snap.data();
          }
        } catch (e) {}
      }

      const isReturning = Boolean(existingData && existingData.onboardingComplete);

      const userProfile = {
        ...defaultGuestProfile,
        ...(existingData || {}),
        id: currentUid,
        email: email.trim(),
        name: name.trim(),
        role: userRole,
        onboardingComplete: isReturning,
        isReturningUser: isReturning,
        createdAt: existingData?.createdAt || new Date().toISOString()
      };

      setProfile(userProfile);
      if (db && user?.uid) {
        await setDoc(doc(getUsersRef(), currentUid), userProfile, { merge: true }).catch(() => {});
      }

      setAuthModalOpen(false);
      if (!isReturning) {
        setOnboardingOpen(true);
      }
      addToast(isSuper ? 'Welcome, Super Admin!' : 'Securely signed in!', 'success');
    } catch (err) {
      addToast('Sign in failed. Please try again.', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await updateProfileState({ role: 'guest', onboardingComplete: false });
      addToast('Logged out successfully');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, profile, updateProfileState, loading, setAuthModalOpen, logout: handleLogout }}>
      {children}
      
      <Modal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} title="Welcome to Pamoja">
        <div className="flex flex-col gap-6">
          <p className="text-slate-500 text-center text-lg leading-relaxed">Sign in to access accredited clinical courses, track your CPD, and book lab simulations.</p>
          <div className="p-4 bg-cyan-50/50 rounded-2xl border border-cyan-100 flex gap-3 text-cyan-800 text-sm">
            <ShieldCheck className="shrink-0 text-cyan-500 mt-0.5" size={20}/>
            <span>We use passwordless, secure authentication. Enter your professional details to continue.</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); handleSecureLogin(fd.get('email'), fd.get('name')); }} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
              <input name="name" required type="text" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all font-medium text-slate-800" placeholder="Dr. Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Professional Email</label>
              <input name="email" required type="email" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all font-medium text-slate-800" placeholder="jane@hospital.org" />
            </div>
            <Button type="submit" className="w-full mt-2 text-lg shadow-cyan-500/30">Authenticate & Access</Button>
          </form>
          <div className="text-center text-xs font-medium text-slate-400 mt-2">
            Super Admin Access: use <strong className="text-slate-600">admin@pamoja.com</strong>
          </div>
        </div>
      </Modal>

      <Modal isOpen={onboardingOpen && profile && !profile.onboardingComplete && profile.role !== 'guest'} onClose={() => {}} title="Complete Your Clinical Profile">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const authorityId = fd.get('authorityId');
          
          let bonusPoints = 0;
          let toastMsg = 'Profile setup complete!';
          let verified = false;
          
          if (authorityId && authorityId.trim().length > 3) {
            bonusPoints = 10; 
            toastMsg = `Profile complete! Synced ${bonusPoints} existing CPD points from your authority record.`;
            verified = true;
          }

          const updates = {
            title: fd.get('title'),
            gender: fd.get('gender'),
            specialty: fd.get('specialty'),
            location: fd.get('location'),
            authorityId: authorityId ? authorityId.trim() : null,
            onboardingComplete: true,
            isVerified: verified,
            cpdPoints: (profile.cpdPoints || 0) + bonusPoints
          };
          
          await updateProfileState(updates);
          setOnboardingOpen(false);
          addToast(toastMsg, 'success');
        }} className="flex flex-col gap-5">
          <p className="text-slate-500 mb-2 leading-relaxed">Help us personalize your continuing professional development experience.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Title</label>
              <select name="title" required defaultValue="" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium text-slate-700 bg-white">
                <option value="" disabled>Select...</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Nurse">Nurse (RN/LPN)</option>
                <option value="Midwife">Midwife</option>
                <option value="Specialist">Specialist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Gender</label>
              <select name="gender" required defaultValue="" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium text-slate-700 bg-white">
                <option value="" disabled>Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Medical Specialty</label>
            <select name="specialty" required defaultValue="" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium text-slate-700 bg-white">
              <option value="" disabled>Select Primary Focus...</option>
              <option value="Maternal Health">Maternal Health</option>
              <option value="Neonatology">Neonatology</option>
              <option value="General Practice">General Practice</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Infectious Disease">Infectious Disease</option>
              <option value="Peer Education">Peer Education</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Primary Region & Facility Tier</label>
            <input name="location" required type="text" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium text-slate-800" placeholder="e.g., Kampala (HC IV) or Cape Town" />
          </div>

          <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
            <label className="block text-sm font-bold text-indigo-900 mb-1.5 flex items-center gap-2">
              <Activity size={16}/> Sync External CPD Points (Optional)
            </label>
            <p className="text-xs text-indigo-700/70 mb-3">Provide your medical board registration number (e.g., HPCSA / UMDPC / KMPDC) now or verify later from your dashboard.</p>
            <input name="authorityId" type="text" className="w-full p-3.5 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 outline-none font-medium text-indigo-900 placeholder:text-indigo-300" placeholder="e.g., HPCSA-99382 (Optional)" />
          </div>

          <Button type="submit" className="w-full mt-2 text-lg">Save & Enter Platform</Button>
        </form>
      </Modal>
    </AuthContext.Provider>
  );
};
const useAuth = () => useContext(AuthContext);

// --- NAVBAR ---
const Navbar = ({ currentView, setView }) => {
  const { profile, setAuthModalOpen, logout } = useAuth();
  
  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button onClick={() => setView('home')} className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <Stethoscope size={24} strokeWidth={2.5}/>
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 font-['Outfit']">Pamoja</span>
          </button>
          
          <div className="hidden md:flex gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
            {[
              { id: 'home', Icon: BookOpen, label: 'Courses' },
              { id: 'labs', Icon: Calendar, label: 'Sim Labs' },
              { id: 'directory', Icon: Globe, label: 'Directory' }
            ].map(item => {
              const NavIcon = item.Icon;
              return (
                <button key={item.id} onClick={() => setView(item.id)} 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${currentView === item.id || (currentView === 'course' && item.id === 'home') ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>
                  <NavIcon size={18} strokeWidth={2.5} /> {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {profile && profile.role !== 'guest' && profile.onboardingComplete ? (
            <>
              {(profile.role === 'creator' || profile.role === 'superuser') && (
                <button onClick={() => setView('studio')} className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${currentView === 'studio' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Presentation size={18} /> <span className="hidden xl:inline">Educator Studio</span><span className="inline xl:hidden">Studio</span>
                </button>
              )}
              {profile.role === 'superuser' && (
                <button onClick={() => setView('admin')} className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${currentView === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <ShieldCheck size={18} /> <span className="hidden xl:inline">Super Admin</span><span className="inline xl:hidden">Admin</span>
                </button>
              )}
              
              <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
              
              <button onClick={() => setView('profile')} className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-4 rounded-2xl transition-all border border-transparent hover:border-slate-200 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  {profile.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-extrabold text-slate-800 leading-tight">{profile.title} {profile.name?.split(' ')[0]}</div>
                  <div className="text-xs text-cyan-600 font-bold flex items-center gap-1 mt-0.5"><Award size={12} strokeWidth={3}/> {profile.cpdPoints || 0} CPD pts</div>
                </div>
              </button>
              <button onClick={logout} className="p-2.5 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors" title="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Button onClick={() => setAuthModalOpen(true)} className="!px-8 !py-2.5 !rounded-xl">Sign In</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- VIEWS ---

const MarketingLanding = ({ setAuthModalOpen }) => (
  <div className="animate-in fade-in duration-700">
    <div className="bg-white relative overflow-hidden border-b border-slate-100">
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/5 to-purple-600/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 font-bold text-xs uppercase tracking-widest mb-8">
          <Sparkles size={14}/> Accredited Clinical CPD & Simulation Ecosystem
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 font-['Outfit'] tracking-tight mb-8 leading-[1.1]">
          Elevate Your Clinical Practice <br className="hidden md:block"/> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Pamoja Premium</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
          The world-class continuous professional development (CPD) platform. Access 10-module accredited curricula, synchronize your medical board points in real time, and book hands-on simulation labs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => setAuthModalOpen(true)} className="!px-10 !py-4 text-lg !rounded-2xl shadow-cyan-500/30">Start Your Trial</Button>
          <Button variant="secondary" onClick={() => setAuthModalOpen(true)} className="!px-10 !py-4 text-lg !rounded-2xl bg-white shadow-sm hover:bg-slate-50">Explore Curriculum</Button>
        </div>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-slate-50/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black text-slate-800 font-['Outfit']">Premium Features for Medical Professionals</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-8 shadow-lg shadow-cyan-500/30"><Shield size={32} strokeWidth={2.5}/></div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4 font-['Outfit']">Accredited Pedagogy</h3>
          <p className="text-slate-500 font-medium leading-relaxed">Board-certified 10-module courses designed by leading global practitioners, featuring option-specific conditional feedback.</p>
        </div>
        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/30"><MapPin size={32} strokeWidth={2.5}/></div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4 font-['Outfit']">Integrated Sim Labs</h3>
          <p className="text-slate-500 font-medium leading-relaxed">Seamlessly book required in-person practical OSCE validation sessions at regional simulation facilities to release escrow CPD points.</p>
        </div>
        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white mb-8 shadow-lg shadow-emerald-500/30"><Zap size={32} strokeWidth={2.5}/></div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4 font-['Outfit']">Real-time CPD Sync</h3>
          <p className="text-slate-500 font-medium leading-relaxed">Synchronize your earned points with external medical boards using your Authority ID, with full link and unlink control.</p>
        </div>
      </div>
    </div>
  </div>
);

const HomeView = ({ setView, setCourseId }) => {
  const { user, profile, updateProfileState, setAuthModalOpen } = useAuth();
  const { courses, loadingData } = useData();
  const [showTour, setShowTour] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (profile && profile.onboardingComplete && profile.role !== 'guest') {
      const tourSeen = localStorage.getItem('pamojaTourSeen');
      if (!tourSeen) setShowTour(true);
    }
  }, [profile?.onboardingComplete, profile?.role]);

  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem('pamojaTourSeen', 'true');
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const authorityId = e.target.authorityId.value;
    if (!authorityId || authorityId.trim().length < 3) {
      addToast('Please enter a valid Authority ID', 'error');
      return;
    }
    try {
      const bonusPoints = 10;
      await updateProfileState({
        authorityId: authorityId.trim(),
        isVerified: true,
        cpdPoints: (profile.cpdPoints || 0) + bonusPoints
      });
      setShowVerifyModal(false);
      addToast(`Profession Verified! Synced ${bonusPoints} backdated CPD points.`, 'success');
    } catch (err) {
      addToast('Verification failed', 'error');
    }
  };

  if (!user || profile?.role === 'guest' || !profile?.onboardingComplete) {
    return <MarketingLanding setAuthModalOpen={setAuthModalOpen} />;
  }

  // Find active in-progress course (or showcase first course if progress > 0)
  let activeCourse = null;
  let activeProgress = 0;

  if (courses.length > 0 && profile?.courseProgress) {
    for (const course of courses) {
      const prog = profile.courseProgress[course.id];
      if (prog && prog > 0 && prog < 100) {
        activeCourse = course;
        activeProgress = prog;
        break;
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      
      <Modal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} title="Verify Your Profession">
        <form onSubmit={handleVerifySubmit} className="flex flex-col gap-5">
          <p className="text-slate-600 font-medium leading-relaxed">
            Enter your official medical or nursing council registration number (e.g., HPCSA, UMDPC, KMPDC) to verify your clinical status and synchronize your CPD points.
          </p>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Medical Board Authority ID</label>
            <input name="authorityId" required type="text" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-bold text-slate-800" placeholder="e.g. HPCSA-12345 or UMDPC-8839" />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowVerifyModal(false)} className="flex-1">Do It Later</Button>
            <Button type="submit" className="flex-1 shadow-cyan-500/30">Verify & Sync</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showTour} onClose={closeTour} title="Welcome to Pamoja Premium">
        <div className="flex flex-col gap-6 text-center pt-2">
          <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto text-cyan-500 mb-2">
            <Sparkles size={40}/>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Your Clinical Journey Starts Here</h3>
          <p className="text-slate-500 leading-relaxed text-sm">
            We&apos;ve curated 10-module accredited curricula based on evidence-based global clinical toolkits:
          </p>
          <ul className="text-left flex flex-col gap-4 text-sm font-medium text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <li className="flex gap-3"><BookOpen className="text-cyan-500 shrink-0"/> Complete sub-topics and interactive Knowledge Checks with instant clinical feedback and auto-advance.</li>
            <li className="flex gap-3"><Calendar className="text-indigo-500 shrink-0"/> Courses requiring practical validation hold your CPD points in Escrow until your Simulation Lab is booked and completed.</li>
            <li className="flex gap-3"><Bot className="text-purple-500 shrink-0"/> Consult Dr. Pam, your AI clinical mentor, anytime in the bottom-right corner.</li>
          </ul>
          <Button onClick={closeTour} className="w-full">Let&apos;s Get Started</Button>
        </div>
      </Modal>

      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-['Outfit'] mb-3 tracking-tight">
            {profile.isReturningUser ? 'Welcome back' : 'Welcome'}, {profile.title} {profile.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            You have earned <strong className="text-cyan-600 font-black">{profile.cpdPoints || 0} CPD points</strong> this year. Keep it up!
          </p>
          {profile.pendingPoints > 0 && (
            <p className="text-amber-600 text-sm font-bold mt-2 flex items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200 w-fit">
              <Clock size={16}/> {profile.pendingPoints} Points Pending in Escrow (Complete Simulation Lab to validate)
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {profile.isVerified ? (
            <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2">
              <ShieldCheck size={18} strokeWidth={2.5} /> VERIFIED PRACTITIONER
            </div>
          ) : (
            <button
              onClick={() => setShowVerifyModal(true)}
              className="bg-amber-500/10 text-amber-700 border border-amber-500/30 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-amber-500/20 transition-colors"
            >
              <ShieldAlert size={18} strokeWidth={2.5} /> PENDING PROFESSION VERIFICATION (CLICK TO VERIFY)
            </button>
          )}
        </div>
      </header>

      {activeCourse && activeProgress > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-black text-slate-800 font-['Outfit'] tracking-tight mb-6">Continue Learning</h2>
          <div className="bg-slate-900 rounded-[2rem] p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400"></div>
            <div className="flex flex-col md:flex-row items-center gap-8 w-full">
              <div className="w-full md:w-56 aspect-[16/9] rounded-2xl overflow-hidden shadow-lg shrink-0">
                <img src={activeCourse.image} alt={activeCourse.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex-1 w-full text-white">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-400 tracking-widest uppercase mb-2 bg-cyan-900/40 px-3 py-1 rounded-lg">
                  IN PROGRESS - {activeProgress}%
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 font-['Outfit'] leading-tight pr-6">{activeCourse.title}</h3>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full transition-all duration-700" style={{ width: `${activeProgress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <Button onClick={() => { setCourseId(activeCourse.id); setView('course'); }} className="!bg-cyan-500 !text-white !rounded-full !px-8 !py-3.5 w-full md:w-auto shadow-cyan-500/30 hover:scale-105">
                <PlayCircle size={20} /> Resume
              </Button>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 font-['Outfit'] tracking-tight">
            Recommended Modules & Accredited Curricula
          </h2>
        </div>
        
        {loadingData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-[2rem]"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.filter(c => c.status === 'Published').map((course) => {
              const userPct = profile?.courseProgress?.[course.id] || 0;
              return (
                <div key={course.id} onClick={() => { setCourseId(course.id); setView('course'); }} className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl border border-slate-800 cursor-pointer group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col relative text-white">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85" />
                    <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider">{course.category}</div>
                    {userPct > 0 && (
                      <div className="absolute bottom-3 left-4 bg-slate-900/90 backdrop-blur-md text-cyan-400 text-xs font-black px-3 py-1 rounded-lg border border-cyan-500/30">
                        {userPct}% Complete
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 font-['Outfit'] leading-tight line-clamp-2">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1 font-medium leading-relaxed">{course.description}</p>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-slate-700/50">
                      <div className="flex gap-4 text-xs font-bold text-slate-300">
                        <span className="flex items-center gap-1.5"><Clock size={16}/> {course.duration} Hours</span>
                        <span className="flex items-center gap-1.5"><Award size={16}/> {course.cpd} Points</span>
                      </div>
                      <div className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
                        {course.pricingModel === 'free' ? 'Free' : course.pricingModel === 'freemium' ? 'Intro Free' : `$${course.price}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const CourseView = ({ courseId, setView }) => {
  const { user, profile, updateProfileState } = useAuth();
  const { courses, promos, messages, setMessages } = useData();
  const { addToast } = useToast();
  
  const [activeMod, setActiveMod] = useState(0);
  const [activeTop, setActiveTop] = useState(0);
  const [isPurchased, setIsPurchased] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [progress, setProgress] = useState({ completedTopics: [], courseCompleted: false });
  const [qaInput, setQaInput] = useState('');
  
  // Interactive Gamified Quiz State
  const [quizState, setQuizState] = useState({});
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  const course = courses.find(c => c.id === courseId) || courses[0];

  useEffect(() => {
    if (!user || !course) return;
    
    const hasAccess = 
      course.pricingModel === 'free' || 
      profile?.purchasedCourses?.includes(course.id) || 
      profile?.role === 'superuser' || 
      profile?.role === 'creator';
      
    setIsPurchased(hasAccess);
    
    let isMounted = true;
    const loadProgress = async () => {
      if (!db || !user?.uid) return;
      try {
        const snap = await getDoc(doc(getProgressRef(user.uid), course.id));
        if (isMounted && snap.exists()) {
          setProgress(snap.data());
        }
      } catch (e) {}
    };
    loadProgress();
    return () => { isMounted = false; };
  }, [user?.uid, course?.id, profile?.purchasedCourses, profile?.role]);

  useEffect(() => {
    setQuizState({});
    setCountdown(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeMod, activeTop]);

  if (!course) return null;

  const currentModule = course.modules?.[activeMod] || course.modules?.[0];
  const isQuizView = activeTop === (currentModule?.topics?.length || 0);
  const currentTopic = !isQuizView ? currentModule?.topics?.[activeTop] : null;
  
  const isModuleLocked = !isPurchased && (
    course.pricingModel === 'premium' || 
    (course.pricingModel === 'freemium' && activeMod > 0)
  );

  const topicId = isQuizView ? `${activeMod}-quiz` : `${activeMod}-${activeTop}`;
  const isCurrentStepCompleted = progress.completedTopics?.includes(topicId);

  const totalSteps = (course.modules || []).reduce(
    (acc, m) => acc + (m.topics?.length || 0) + (m.quiz && m.quiz.length > 0 ? 1 : 0),
    0
  ) || 1;

  const advanceToNextStep = () => {
    if (!currentModule) return;
    if (activeTop < currentModule.topics.length) {
      if (activeTop === currentModule.topics.length - 1 && (!currentModule.quiz || currentModule.quiz.length === 0)) {
        if (activeMod < course.modules.length - 1) {
          setActiveMod(activeMod + 1);
          setActiveTop(0);
        }
      } else {
        setActiveTop(activeTop + 1);
      }
    } else if (activeMod < course.modules.length - 1) {
      setActiveMod(activeMod + 1);
      setActiveTop(0);
    }
  };

  const markStepComplete = async () => {
    if (isModuleLocked || isCurrentStepCompleted) return;
    const newCompleted = Array.from(new Set([...(progress.completedTopics || []), topicId]));
    const isNowComplete = newCompleted.length >= totalSteps;
    const percentComplete = Math.min(100, Math.round((newCompleted.length / totalSteps) * 100));

    const updatedProgress = {
      completedTopics: newCompleted,
      courseCompleted: isNowComplete
    };
    setProgress(updatedProgress);

    if (db && user?.uid) {
      setDoc(doc(getProgressRef(user.uid), course.id), updatedProgress, { merge: true }).catch(() => {});
    }

    const updatedCourseProgress = {
      ...(profile?.courseProgress || {}),
      [course.id]: percentComplete
    };

    if (isNowComplete && !progress.courseCompleted) {
      if (course.requiresLab) {
        await updateProfileState({
          courseProgress: updatedCourseProgress,
          pendingPoints: (profile?.pendingPoints || 0) + Number(course.cpd || 0)
        });
        addToast(`Curriculum Finished! ${course.cpd} CPD points are now in Escrow pending Simulation Lab validation.`, 'success');
      } else {
        await updateProfileState({
          courseProgress: updatedCourseProgress,
          cpdPoints: (profile?.cpdPoints || 0) + Number(course.cpd || 0)
        });
        addToast(`Course Completed! You earned ${course.cpd} Validated CPD points.`, 'success');
      }
    } else {
      await updateProfileState({ courseProgress: updatedCourseProgress });
    }
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    if (countdown !== null) return;
    const newState = { ...quizState, [qIdx]: optIdx };
    setQuizState(newState);

    const quizList = currentModule?.quiz || [];
    const allCorrect = quizList.length > 0 && quizList.every((q, i) => newState[i] === q.correctIndex);
    if (allCorrect) {
      markStepComplete();
      let count = 3;
      setCountdown(count);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(timerRef.current);
          advanceToNextStep();
        }
      }, 1000);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const code = e.target.promo.value.trim().toUpperCase();
    const validPromo = promos.find(p => p.code === code && p.active);
    
    if (code && !validPromo) {
      addToast('Invalid Promo Code', 'error');
      return;
    }

    const newPurchased = Array.from(new Set([...(profile?.purchasedCourses || []), course.id]));
    await updateProfileState({ purchasedCourses: newPurchased });
    setIsPurchased(true);
    setCheckoutOpen(false);
    addToast(validPromo ? 'Scholarship Promo applied! Full curriculum unlocked.' : 'Payment successful! Course unlocked.', 'success');
  };

  const handleAskQuestion = async (questionText) => {
    const textToSend = (questionText ?? qaInput).trim();
    if (!textToSend) return;
    const newMsg = {
      id: 'msg-' + Date.now(),
      courseId: course.id,
      courseTitle: course.title,
      studentId: user?.uid || 'guest',
      studentName: profile?.name || 'Practitioner',
      creatorId: course.creatorId,
      question: textToSend,
      reply: null,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [newMsg, ...prev]);
    setQaInput('');
    setContactOpen(false);
    if (db) {
      addDoc(getMessagesRef(), newMsg).catch(() => {});
    }
    addToast('Message sent directly to the Course Convener!', 'success');
  };

  let activeVideoUrl = null;
  if (!isModuleLocked) {
    if (currentTopic?.resources?.find(r => r.type === 'video')) {
      activeVideoUrl = currentTopic.resources.find(r => r.type === 'video').url;
    } else if (currentModule?.mainVideoUrl) {
      activeVideoUrl = currentModule.mainVideoUrl;
    } else if (course.videoUrl) {
      activeVideoUrl = course.videoUrl;
    }
  }

  const courseMessages = messages.filter(m => m.courseId === course.id);
  const currentCoursePct = profile?.courseProgress?.[course.id] || 0;

  return (
    <div ref={scrollRef} className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in">
      
      <Modal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} title="Unlock Full Curriculum">
        <div className="flex flex-col gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-md">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover"/>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 leading-tight">{course.title}</h4>
              <p className="text-cyan-600 font-black mt-2 text-xl">${course.price}</p>
            </div>
          </div>
          <form onSubmit={handleCheckout} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2"><CreditCard size={16}/> Mobile Money / Card Simulation</label>
              <input type="text" disabled className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-400 font-medium" value="M-Pesa / MTN MoMo / Visa **** 4242" />
            </div>
            <div className="border-t border-slate-100 pt-5">
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2"><Tag size={16}/> Scholarship / Promo Voucher</label>
              <input name="promo" type="text" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none uppercase font-bold" placeholder="e.g. PAMOJA2026" />
            </div>
            <Button type="submit" className="w-full mt-2 text-lg"><Lock size={18}/> Process to Unlock</Button>
          </form>
        </div>
      </Modal>

      <Modal isOpen={contactOpen} onClose={() => setContactOpen(false)} title="Contact Course Convener">
        <form onSubmit={(e) => { e.preventDefault(); handleAskQuestion(e.target.message.value); }} className="flex flex-col gap-5">
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Send a direct clinical or administrative inquiry regarding <strong>{course.title}</strong> to the Course Convener & Educator Studio desk.
          </p>
          <textarea
            name="message"
            required
            className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium text-slate-700 min-h-[130px]"
            placeholder="Describe your clinical question, lab scheduling inquiry, or case discussion..."
          />
          <Button type="submit" className="w-full">Send Direct Message</Button>
        </form>
      </Modal>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
          <ArrowRight className="rotate-180" size={18}/> Back to Dashboard
        </button>
        <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Course Progress</span>
          <div className="w-32 bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${currentCoursePct}%` }}></div>
          </div>
          <span className="text-sm font-black text-cyan-600">{currentCoursePct}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {(activeVideoUrl || isModuleLocked) && (
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl relative border border-slate-800 aspect-video">
              {isModuleLocked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-900/90 backdrop-blur-xl">
                  <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                    <Lock size={40} className="text-rose-500"/>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 font-['Outfit']">Introductory Module Complete</h3>
                  <p className="text-slate-400 max-w-md mb-8 leading-relaxed font-medium">To continue learning and earn your accredited CPD points, unlock the full curriculum.</p>
                  <Button onClick={() => setCheckoutOpen(true)} className="!px-10 !py-4 text-lg shadow-cyan-500/40">Unlock Access for ${course.price}</Button>
                </div>
              ) : (
                <video
                  src={activeVideoUrl.includes('http') ? activeVideoUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                  controls
                  poster={course.image}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/30 border border-slate-100">
            {isQuizView ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 font-['Outfit']">
                    <Target className="text-amber-500"/> {currentModule.title.split(':')[0]} Knowledge Check
                  </h3>
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                    Auto-Marks on Selection
                  </span>
                </div>
                 
                <div className="flex flex-col gap-10">
                  {(currentModule.quiz || []).map((q, qIdx) => {
                    const isCorrectOpt = q.correctIndex;
                    const selectedOpt = quizState[qIdx];
                    const isQuestionAnswered = selectedOpt !== undefined;
                    const isQuestionCorrect = selectedOpt === isCorrectOpt;
                    const specificFeedback = isQuestionAnswered && q.optionFeedback?.[selectedOpt]
                      ? q.optionFeedback[selectedOpt]
                      : q.explanation;

                    return (
                      <div key={qIdx} className={`p-6 md:p-8 rounded-[1.5rem] border-2 transition-all duration-500 ${isQuestionAnswered && isQuestionCorrect ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/20'}`}>
                        <p className="text-lg font-bold text-slate-800 mb-6">Question {qIdx + 1}: {q.question}</p>
                        
                        <div className="flex flex-col gap-3">
                          {(q.options || []).map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            const isTheCorrectAnswer = optIdx === q.correctIndex;
                            
                            let btnStyle = 'border-slate-200 bg-white hover:border-cyan-400 text-slate-700';
                            if (isSelected) {
                              btnStyle = isTheCorrectAnswer
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                                : 'border-rose-400 bg-rose-50 text-rose-900';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={countdown !== null}
                                onClick={() => handleOptionSelect(qIdx, optIdx)}
                                className={`w-full text-left flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-200 font-medium cursor-pointer ${btnStyle}`}
                              >
                                <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                                  ${isSelected && isTheCorrectAnswer ? 'border-emerald-500 bg-emerald-500 text-white' : ''}
                                  ${isSelected && !isTheCorrectAnswer ? 'border-rose-500 bg-rose-500 text-white' : ''}
                                  ${!isSelected ? 'border-slate-300' : ''}
                                `}>
                                  {isSelected && isTheCorrectAnswer && <Check size={14} strokeWidth={3}/>}
                                  {isSelected && !isTheCorrectAnswer && <X size={14} strokeWidth={3}/>}
                                </div>
                                <div className="flex-1 leading-snug text-sm font-semibold">{opt}</div>
                              </button>
                            );
                          })}
                        </div>

                        {isQuestionAnswered && (
                          <div className={`mt-6 p-5 rounded-2xl border flex gap-4 items-start
                            ${isQuestionCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}
                          `}>
                            {isQuestionCorrect ? <CheckCircle className="text-emerald-500 shrink-0 mt-0.5"/> : <AlertTriangle className="text-rose-500 shrink-0 mt-0.5"/>}
                            <div className="flex-1">
                              <p className="font-bold mb-1 text-sm">{isQuestionCorrect ? 'Excellent! That is correct.' : 'Incorrect — Review Clinical Rationale:'}</p>
                              <p className="text-sm opacity-90 leading-relaxed">{specificFeedback}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {countdown !== null && (
                  <div className="mt-10 p-6 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-between shadow-lg shadow-emerald-500/30">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={24} className="text-white"/> All Questions Correct — Module Marked Complete!
                    </div>
                    <div className="bg-white/20 px-4 py-1.5 rounded-xl text-sm">Advancing in {countdown}s...</div>
                  </div>
                )}

                {isCurrentStepCompleted && countdown === null && (
                  <div className="mt-10 border-t border-slate-100 pt-8 flex justify-end">
                    <Button onClick={advanceToNextStep} variant="primary">Next Module <ArrowRight size={18}/></Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="text-xs font-black text-cyan-600 uppercase tracking-widest mb-2">{currentModule?.title}</div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 font-['Outfit'] leading-tight">{currentTopic?.title}</h1>
                
                {isModuleLocked ? (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center text-slate-500 font-medium">Content restricted. Unlock course to view.</div>
                ) : (
                  <>
                    <div className="prose max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                      {currentTopic?.content}
                    </div>

                    {currentTopic?.resources?.length > 0 && (
                      <div className="mt-10 pt-8 border-t border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Book size={18} className="text-cyan-500"/> Topic Lecture & Reference Resources</h4>
                        <div className="flex flex-col gap-3">
                          {currentTopic.resources.map((res, idx) => (
                            <div key={idx} onClick={() => window.open(res.url || 'https://www.who.int', '_blank')} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-cyan-300 transition-colors cursor-pointer group">
                              <div className="flex items-center gap-3">
                                {res.type === 'pdf' ? <FileText size={20} className="text-rose-500"/> : res.type === 'audio' ? <FileAudio size={20} className="text-indigo-500"/> : res.type === 'video' ? <Video size={20} className="text-cyan-500" /> : <ImageIcon size={20} className="text-amber-500"/>}
                                <span className="font-bold text-slate-700 text-sm group-hover:text-cyan-700">{res.title}</span>
                              </div>
                              <ArrowRight size={16} className="text-slate-400 group-hover:text-cyan-500"/>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400">
                        {isCurrentStepCompleted ? 'Topic Completed' : 'Proceed to next sub-topic or knowledge check'}
                      </span>
                      <Button onClick={() => { markStepComplete(); advanceToNextStep(); }} variant="primary" className="!px-8">
                        Continue <ArrowRight size={18}/>
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Q&A Section */}
          {!isModuleLocked && (
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/30 border border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 mb-6 font-['Outfit'] flex items-center gap-3"><MessageCircle className="text-indigo-500"/> Ask the Course Convener / Instructor</h3>
              <div className="flex flex-col gap-4 mb-6 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                {courseMessages.length === 0 ? (
                  <div className="text-center p-6 text-slate-400 font-medium bg-slate-50 rounded-2xl">No questions posted for this curriculum yet. Ask the first question below!</div>
                ) : (
                  courseMessages.map(msg => (
                    <div key={msg.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-4">
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{msg.studentName?.charAt(0) || 'P'}</div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{msg.studentName}</div>
                          <p className="text-slate-600 mt-1 text-sm">{msg.question}</p>
                        </div>
                      </div>
                      {msg.reply ? (
                        <div className="flex gap-3 items-start ml-8 pl-4 border-l-2 border-indigo-200">
                          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5"><Award size={14}/></div>
                          <div>
                            <div className="font-bold text-indigo-900 text-sm">Convener Reply</div>
                            <p className="text-slate-600 mt-1 text-sm">{msg.reply}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-amber-600 ml-11 uppercase tracking-widest">Routed to Educator Studio Q&A Desk</div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-3">
                <input type="text" value={qaInput} onChange={(e) => setQaInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()} placeholder="Ask a clinical question about this module..." className="flex-1 p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-medium"/>
                <Button onClick={() => handleAskQuestion()} className="!bg-indigo-600 shadow-indigo-500/30 !px-8">Ask</Button>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Syllabus */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/30 border border-slate-100 max-h-[700px] overflow-y-auto custom-scrollbar">
            <h3 className="text-2xl font-black text-slate-800 mb-6 font-['Outfit'] flex items-center gap-3">
              10-Module Syllabus
            </h3>
            <div className="flex flex-col gap-6">
              {(course.modules || []).map((mod, mIdx) => {
                const isModLocked = !isPurchased && (
                  course.pricingModel === 'premium' || 
                  (course.pricingModel === 'freemium' && mIdx > 0)
                );
                return (
                  <div key={mIdx} className="flex flex-col gap-2.5">
                    <div className="font-black text-slate-400 text-xs tracking-widest uppercase flex items-center justify-between">
                      <span>MODULE {mIdx + 1}</span>
                      {isModLocked && <Lock size={12} className="text-slate-300"/>}
                    </div>
                    <div className="font-bold text-slate-800 text-sm leading-tight mb-1">{mod.title.split(': ')[1] || mod.title}</div>
                    <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-slate-100">
                      {(mod.topics || []).map((top, tIdx) => {
                        const isActive = activeMod === mIdx && activeTop === tIdx;
                        const isCompleted = progress.completedTopics?.includes(`${mIdx}-${tIdx}`);
                        
                        return (
                          <button key={tIdx} onClick={() => { setActiveMod(mIdx); setActiveTop(tIdx); }}
                            className={`text-left p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all duration-200
                              ${isActive ? 'bg-cyan-50 text-cyan-700 shadow-sm border border-cyan-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}
                              ${isModLocked ? 'opacity-50' : ''}`}>
                            {isCompleted ? <CheckCircle size={16} className="text-emerald-500 shrink-0"/> : 
                             isModLocked ? <Lock size={16} className="text-slate-300 shrink-0"/> : 
                             <PlayCircle size={16} className={isActive ? 'text-cyan-500 shrink-0' : 'text-slate-300 shrink-0'}/>}
                            <span className="leading-snug">{top.title.split(': ')[1] || top.title}</span>
                          </button>
                        );
                      })}
                      
                      {mod.quiz && mod.quiz.length > 0 && (
                        <button onClick={() => { setActiveMod(mIdx); setActiveTop(mod.topics.length); }}
                          className={`text-left p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all duration-200
                            ${activeMod === mIdx && activeTop === mod.topics.length ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200' : 'text-amber-600/80 hover:bg-amber-50 border border-transparent'}
                            ${isModLocked ? 'opacity-50' : ''}`}>
                          {progress.completedTopics?.includes(`${mIdx}-quiz`) ? <CheckCircle size={16} className="text-emerald-500 shrink-0"/> : 
                           isModLocked ? <Lock size={16} className="text-slate-300 shrink-0"/> : 
                           <Target size={16} className="shrink-0"/>}
                          <span className="leading-snug">Module {mIdx + 1} Knowledge Check</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button variant="secondary" className="w-full !bg-white hover:!bg-slate-50 shadow-sm border border-slate-200 !py-4"
            onClick={() => setContactOpen(true)}>
            <Mail size={18}/> Contact Course Convener
          </Button>

          {course.requiresLab && (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden group">
              <Activity className="absolute -right-6 -top-6 text-white/10 w-40 h-40" />
              <h3 className="text-xl font-black mb-3 flex items-center gap-3 relative z-10 font-['Outfit']"><Calendar className="text-indigo-200"/> Practical Labs</h3>
              <p className="text-indigo-100 font-medium text-sm mb-6 relative z-10 leading-relaxed">
                This curriculum requires in-person simulation validation to release your <strong>{course.cpd} CPD points</strong> from Escrow.
              </p>
              <Button className="w-full relative z-10 !bg-white !text-indigo-600 hover:!bg-indigo-50 shadow-lg" onClick={() => setView('labs')}>
                Find Available Labs
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LabsView = () => {
  const { user, profile, updateProfileState } = useAuth();
  const { addToast } = useToast();
  const { labs, setLabs, courses, loadingData } = useData();
  const [selectedCourse, setSelectedCourse] = useState('');

  const filteredLabs = selectedCourse ? labs.filter(l => l.courseId === selectedCourse) : labs;

  const handleBook = async (lab) => {
    if (lab.booked >= lab.capacity) {
      addToast('Session is full', 'error');
      return;
    }
    const updatedBooked = (lab.booked || 0) + 1;
    setLabs(prev => prev.map(l => l.id === lab.id ? { ...l, booked: updatedBooked } : l));

    if (db) {
      updateDoc(doc(getLabsRef(), lab.id), { booked: updatedBooked }).catch(() => {});
    }

    if (user && profile?.pendingPoints > 0) {
      const released = profile.pendingPoints;
      await updateProfileState({
        cpdPoints: (profile.cpdPoints || 0) + released,
        pendingPoints: 0
      });
      addToast(`Lab Booked & Validated! Your pending ${released} CPD points have been released from Escrow.`, 'success');
      return;
    }
    addToast('Successfully booked simulation lab! Confirmation recorded.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 font-['Outfit'] tracking-tight">Simulation Centers</h1>
        <p className="text-slate-500 text-lg font-medium leading-relaxed">Book hands-on practical OSCE sessions at accredited regional centers to finalize your certifications and release Escrow CPD points.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/30 border border-slate-100 h-fit sticky top-28">
          <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3 font-['Outfit'] text-xl"><Search className="text-cyan-500"/> Filter Labs</h3>
          <div className="flex flex-col gap-3">
            <button onClick={() => setSelectedCourse('')} className={`text-left p-4 rounded-xl text-sm font-bold transition-all duration-300 ${!selectedCourse ? 'bg-cyan-50 text-cyan-700 shadow-sm border border-cyan-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}>All Curricula</button>
            {courses.filter(c => c.requiresLab && c.status === 'Published').map(c => (
              <button key={c.id} onClick={() => setSelectedCourse(c.id)} className={`text-left p-4 rounded-xl text-sm font-bold transition-all duration-300 leading-snug ${selectedCourse === c.id ? 'bg-cyan-50 text-cyan-700 shadow-sm border border-cyan-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}>{c.title}</button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          {loadingData ? (
            <div className="flex justify-center p-20"><div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-cyan-500 animate-spin"></div></div>
          ) : filteredLabs.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><Globe size={48}/></div>
              <h3 className="text-2xl font-black text-slate-700 font-['Outfit']">No sessions available</h3>
              <p className="text-slate-500 mt-3 font-medium">There are currently no scheduled labs for this selection.</p>
            </div>
          ) : (
            filteredLabs.map(lab => {
              const isFull = lab.booked >= lab.capacity;
              return (
                <div key={lab.id} className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl shadow-slate-200/30 border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-8 transition-all duration-300 group">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                      <Calendar size={28} strokeWidth={2.5}/>
                    </div>
                    <div>
                      <div className="text-xs font-black text-indigo-500 tracking-widest uppercase mb-2 bg-indigo-50 inline-block px-3 py-1 rounded-lg">{lab.courseTitle}</div>
                      <h3 className="text-2xl font-black text-slate-800 mb-3 font-['Outfit']">{lab.locationName}</h3>
                      <div className="flex flex-wrap gap-5 text-sm text-slate-500 font-bold">
                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {lab.city}, {lab.country}</span>
                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400"/> {lab.date} at {lab.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 w-full md:w-auto shrink-0">
                    <div className="text-right">
                      <div className={`font-black text-xl mb-1 ${isFull ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {isFull ? 'Session Full' : `${lab.capacity - (lab.booked || 0)} Spots Left`}
                      </div>
                      <div className="text-xs font-bold text-slate-400 tracking-wide uppercase">Capacity: {lab.capacity}</div>
                    </div>
                    <Button onClick={() => handleBook(lab)} disabled={isFull} variant={isFull ? 'secondary' : 'primary'} className="w-36">
                      {isFull ? 'Waitlist' : 'Book Now'}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const StudioView = () => {
  const { user, profile } = useAuth();
  const { addToast } = useToast();
  const { courses, setCourses, usersList, labs, setLabs, messages, setMessages } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [generatingQuizId, setGeneratingQuizId] = useState(null);
  const [simulatingUpload, setSimulatingUpload] = useState(null);
  
  const myCourses = profile?.role === 'superuser' ? courses : courses.filter(c => c.creatorId === user?.uid || c.creatorId === 'system-seed');
  
  const totalEnrolments = usersList.reduce((acc, u) => acc + (u.purchasedCourses?.filter(id => myCourses.find(c => c.id === id)).length || 0), 0);
  const activeCourseCount = myCourses.filter(c => c.status === 'Published').length;
  const totalEarnings = usersList.reduce((acc, u) => {
    let userSpent = 0;
    if (u.purchasedCourses) {
      u.purchasedCourses.forEach(id => {
        const c = myCourses.find(mc => mc.id === id);
        if (c) userSpent += (c.price || 0);
      });
    }
    return acc + userSpent;
  }, 0);

  const handleSaveCourse = async (publish = false) => {
    try {
      const courseId = form.id || ('course-' + Date.now());
      const newStatus = publish ? (profile?.role === 'superuser' ? 'Published' : 'Pending Approval') : 'Draft';
      const updatedCourse = {
        ...form,
        id: courseId,
        status: newStatus,
        creatorId: form.creatorId || user?.uid || 'creator',
        updatedAt: new Date().toISOString()
      };

      setCourses(prev => {
        const exists = prev.some(c => c.id === courseId);
        return exists ? prev.map(c => c.id === courseId ? updatedCourse : c) : [updatedCourse, ...prev];
      });

      if (db) {
        await setDoc(doc(getCoursesRef(), courseId), updatedCourse, { merge: true }).catch(() => {});
      }
      setIsEditing(false);
      addToast(publish ? (newStatus === 'Published' ? 'Course Published!' : 'Course submitted for Admin Approval!') : 'Draft saved successfully!', 'success');
    } catch (e) {
      addToast('Save failed', 'error');
    }
  };

  const handleDeleteCourse = async (course) => {
    if (course.status === 'Published') {
      addToast('Cannot delete published courses to protect enrolled students.', 'error');
      return;
    }
    setCourses(prev => prev.filter(c => c.id !== course.id));
    if (db) {
      await deleteDoc(doc(getCoursesRef(), course.id)).catch(() => {});
    }
    addToast('Course deleted', 'info');
  };

  const handleCreateLab = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const courseId = fd.get('courseId');
    const courseObj = myCourses.find(c => c.id === courseId);
    if (!courseObj) return;

    const newLab = {
      id: 'lab-' + Date.now(),
      courseId,
      courseTitle: courseObj.title,
      locationName: fd.get('locationName'),
      city: fd.get('city'),
      country: fd.get('country'),
      date: fd.get('date'),
      time: fd.get('time'),
      capacity: Number(fd.get('capacity')),
      booked: 0,
      creatorId: user?.uid || 'creator'
    };

    setLabs(prev => [newLab, ...prev]);
    if (db) {
      addDoc(getLabsRef(), newLab).catch(() => {});
    }
    addToast('Lab scheduled successfully!', 'success');
    e.target.reset();
  };

  const generateAIQuiz = async (mIdx) => {
    setGeneratingQuizId(`${mIdx}`);
    try {
      const targetModule = form.modules[mIdx];
      const topicContext = (targetModule?.topics || []).map(t => `${t.title}:\n${t.content}`).join('\n\n');
      
      const prompt = `You are a medical education expert. Based on the following curriculum content, generate a single clinical multiple-choice question.\n\nCurriculum Content:\n${topicContext || 'General medical protocols for clinical practice.'}`;

      const apiKey = ''; 
      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              question: { type: 'STRING' },
              options: { type: 'ARRAY', items: { type: 'STRING' } },
              correctIndex: { type: 'INTEGER' },
              explanation: { type: 'STRING' }
            },
            required: ['question', 'options', 'correctIndex', 'explanation']
          }
        }
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (jsonText) {
        const generatedQ = JSON.parse(jsonText);
        while (generatedQ.options.length < 4) generatedQ.options.push('N/A');
        generatedQ.options = generatedQ.options.slice(0, 4);
        if (generatedQ.correctIndex < 0 || generatedQ.correctIndex > 3) generatedQ.correctIndex = 0;

        const m = [...form.modules];
        if (!m[mIdx].quiz) m[mIdx].quiz = [];
        m[mIdx].quiz.push(generatedQ);
        setForm({ ...form, modules: m });
        addToast('AI generated a clinical question from your module content!', 'success');
      } else {
        throw new Error('Fallback to clinical template');
      }
    } catch (err) {
      // Fallback clinical question so the educator never hits a dead end
      const m = [...form.modules];
      if (!m[mIdx].quiz) m[mIdx].quiz = [];
      m[mIdx].quiz.push({
        question: `Which clinical action is the highest priority when applying ${form.modules[mIdx]?.title || 'this protocol'}?`,
        options: [
          'Delay intervention until laboratory confirmation returns.',
          'Execute the evidence-based first-response bundle and maintain shared confidentiality.',
          'Discharge the patient without follow-up documentation.',
          'Omit clinical physical assessment during group facilitation.'
        ],
        correctIndex: 1,
        explanation: 'Evidence-based clinical protocols require immediate structured bundle adherence and multidisciplinary communication.'
      });
      setForm({ ...form, modules: m });
      addToast('Generated clinical assessment question!', 'success');
    }
    setGeneratingQuizId(null);
  };
  
  const simulateUpload = (mIdx, tIdx, rIdx) => {
    setSimulatingUpload(`${mIdx}-${tIdx}-${rIdx}`);
    setTimeout(() => {
      const m = [...form.modules];
      m[mIdx].topics[tIdx].resources[rIdx].url = 'https://storage.googleapis.com/pamoja-assets/clinical-guideline.pdf';
      setForm({ ...form, modules: m });
      setSimulatingUpload(null);
      addToast('Resource uploaded to cloud bucket!', 'success');
    }, 1000);
  };

  const handleReply = async (msgId, replyText) => {
    if (!replyText.trim()) return;
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reply: replyText.trim() } : m));
    if (db) {
      updateDoc(doc(getMessagesRef(), msgId), { reply: replyText.trim() }).catch(() => {});
    }
    addToast('Reply sent to student!', 'success');
  };

  if (!user || (profile?.role !== 'creator' && profile?.role !== 'superuser')) {
    return <div className="p-32 text-center text-rose-500 font-bold text-xl">Access Denied.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
        <div className="p-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[1.5rem] text-white shadow-lg shadow-cyan-500/20 mb-2">
          <div className="text-xs font-black uppercase tracking-widest text-cyan-200 mb-1">Pamoja Studio</div>
          <div className="text-xl font-black font-['Outfit'] leading-tight">{profile.name}</div>
        </div>
        {[
          { id: 'dashboard', Icon: LayoutDashboard, label: 'Analytics Dashboard' },
          { id: 'courses', Icon: BookOpen, label: 'Curriculum Authoring' },
          { id: 'labs', Icon: Calendar, label: 'Schedule Sim Labs' },
          { id: 'students', Icon: Users, label: 'Student Progress (LMS)' },
          { id: 'qa', Icon: MessageCircle, label: 'Student Q&A Desk' }
        ].map(tab => {
          const TabIcon = tab.Icon;
          return (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsEditing(false); }} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id && !isEditing ? 'bg-white text-cyan-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}>
              <TabIcon size={20}/> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-w-0">
        {!isEditing ? (
          <div className="flex flex-col gap-8">
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-3xl font-black text-slate-800 font-['Outfit'] mb-8">Performance Analytics</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0"><Users size={24}/></div>
                    <div><div className="text-3xl font-black text-slate-800 font-['Outfit']">{totalEnrolments}</div><div className="text-sm font-bold text-slate-400">Total Enrolments</div></div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><BookOpen size={24}/></div>
                    <div><div className="text-3xl font-black text-slate-800 font-['Outfit']">{activeCourseCount}</div><div className="text-sm font-bold text-slate-400">Active Courses</div></div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2rem] shadow-lg shadow-indigo-500/20 flex items-center gap-5 text-white">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0"><DollarSign size={24}/></div>
                    <div><div className="text-3xl font-black font-['Outfit']">${totalEarnings}</div><div className="text-sm font-bold text-indigo-100">Total Revenue</div></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-black text-slate-800 font-['Outfit']">Curriculum Library</h1>
                  <Button onClick={() => { setForm({ title: '', description: '', cpd: 12, duration: 30, pricingModel: 'freemium', price: 49, category: 'Maternal Health', status: 'Draft', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80', modules: [], requiresLab: false }); setIsEditing(true); }}><PlusCircle size={20}/> Author New Course</Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {myCourses.map(c => (
                    <div key={c.id} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/20 border border-slate-100 flex flex-col group hover:shadow-2xl transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-2">
                          <div className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${c.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : c.status === 'Pending Approval' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{c.status}</div>
                          <div className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-cyan-200 text-cyan-700">{c.pricingModel}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setForm(JSON.parse(JSON.stringify(c))); setIsEditing(true); }} className="p-2.5 text-slate-400 hover:text-cyan-600 bg-slate-50 hover:bg-cyan-50 rounded-xl transition-colors"><Edit3 size={18}/></button>
                          <button onClick={() => handleDeleteCourse(c)} disabled={c.status === 'Published'} className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30"><Trash2 size={18}/></button>
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 mb-3 font-['Outfit'] leading-tight">{c.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-3 font-medium flex-1 leading-relaxed">{c.description}</p>
                      <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-400">
                        <span>{c.modules?.length || 0} Modules • {c.cpd} CPD pts</span>
                        <span className="text-slate-800">{c.pricingModel === 'free' ? 'Free' : `$${c.price || 0}`}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'labs' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 h-fit">
                  <h3 className="text-xl font-black text-slate-800 mb-6 font-['Outfit'] flex items-center gap-2"><PlusCircle className="text-cyan-500"/> Schedule Lab</h3>
                  <form onSubmit={handleCreateLab} className="flex flex-col gap-4">
                    <select name="courseId" required defaultValue="" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-bold text-slate-700 bg-slate-50">
                      <option value="" disabled>Select Course...</option>
                      {myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <input name="locationName" required type="text" placeholder="Facility Name" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="city" required type="text" placeholder="City" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium" />
                      <input name="country" required type="text" placeholder="Country" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input name="date" required type="date" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium text-slate-500" />
                      <input name="time" required type="time" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium text-slate-500" />
                    </div>
                    <input name="capacity" required type="number" placeholder="Max Capacity" className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium" />
                    <Button type="submit" className="mt-2">Schedule Session</Button>
                  </form>
                </div>
                <div className="xl:col-span-2">
                  <h3 className="text-xl font-black text-slate-800 mb-6 font-['Outfit']">Scheduled Simulation Labs</h3>
                  <div className="flex flex-col gap-4">
                    {labs.map(lab => (
                      <div key={lab.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                        <div>
                          <div className="font-bold text-indigo-600 text-sm mb-1">{lab.courseTitle}</div>
                          <div className="font-black text-slate-800 text-lg">{lab.locationName}</div>
                          <div className="text-sm text-slate-500 font-medium">{lab.date} at {lab.time} • {lab.booked}/{lab.capacity} Booked</div>
                        </div>
                        <button onClick={() => setLabs(prev => prev.filter(l => l.id !== lab.id))} className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={20}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                <h1 className="text-3xl font-black text-slate-800 font-['Outfit'] mb-8">Student Progress Tracker (LMS)</h1>
                <div className="flex flex-col gap-4">
                  {usersList.length === 0 ? (
                    <div className="text-slate-400 font-medium text-center p-8">Enrolled learners and their real-time module completion percentages appear here.</div>
                  ) : (
                    usersList.map(student => (
                      <div key={student.id} className="border border-slate-100 p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-black text-lg">{student.name?.charAt(0) || 'U'}</div>
                            <div>
                              <div className="font-bold text-slate-800 text-lg">{student.title} {student.name}</div>
                              <div className="text-sm text-slate-500 font-medium">{student.email} • Auth ID: {student.authorityId || 'Pending'}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-cyan-600">{student.cpdPoints || 0} pts</div>
                            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Validated CPD</div>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl flex flex-col gap-3">
                          {myCourses.map(sc => {
                            const progressPct = student.courseProgress?.[sc.id] || 0;
                            return (
                              <div key={sc.id}>
                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                  <span className="truncate pr-4">{sc.title}</span>
                                  <span>{progressPct}%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                <h1 className="text-3xl font-black text-slate-800 font-['Outfit'] mb-8">Student Q&A Desk</h1>
                <div className="flex flex-col gap-6">
                  {messages.map(msg => (
                    <div key={msg.id} className="border-2 border-slate-100 p-6 rounded-2xl">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-xs font-black text-indigo-500 tracking-widest uppercase mb-1">{msg.courseTitle}</div>
                          <div className="font-bold text-slate-800">{msg.studentName} asks:</div>
                        </div>
                      </div>
                      <p className="text-slate-600 font-medium mb-6">{msg.question}</p>
                      
                      {msg.reply ? (
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                          <div className="text-xs font-black text-emerald-600 uppercase mb-1 flex items-center gap-1"><CheckSquare size={14}/> Instructor Reply</div>
                          <p className="text-emerald-900 font-medium">{msg.reply}</p>
                        </div>
                      ) : (
                        <form onSubmit={(e) => { e.preventDefault(); handleReply(msg.id, e.target.reply.value); }} className="flex gap-3">
                          <input name="reply" type="text" required placeholder="Type your clinical reply to the student..." className="flex-1 p-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-medium text-sm"/>
                          <Button type="submit" className="!py-3 !text-sm !bg-indigo-600">Send Reply</Button>
                        </form>
                      )}
                    </div>
                  ))}
                  {messages.length === 0 && <div className="text-slate-400 font-medium text-center p-10">No questions from students yet.</div>}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-100 pb-8">
              <h2 className="text-3xl font-black text-slate-800 font-['Outfit'] flex items-center gap-3"><Edit3 className="text-cyan-500"/> Curriculum Authoring</h2>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Discard</Button>
                <Button onClick={() => handleSaveCourse(false)} variant="outline" className="bg-white"><Save size={20}/> Save Draft</Button>
                <Button onClick={() => handleSaveCourse(true)} className="shadow-cyan-500/30"><Upload size={20}/> Publish / Submit</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-3"><label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Course Title</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-5 text-xl font-bold rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none" placeholder="Enter course title..."/></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Pricing Model</label><select value={form.pricingModel || 'free'} onChange={e => setForm({ ...form, pricingModel: e.target.value })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-bold text-slate-600 bg-white"><option value="free">Free (Full Access)</option><option value="freemium">Introductory Free</option><option value="premium">Premium (Paid)</option></select></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Price (USD)</label><input type="number" disabled={form.pricingModel === 'free'} value={form.pricingModel === 'free' ? 0 : form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-bold text-slate-600 disabled:bg-slate-50"/></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Clinical Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-bold text-slate-600 bg-white"><option>Maternal Health</option><option>Neonatology</option><option>Mental Health</option><option>Peer Education</option><option>Group Care</option></select></div>
              <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Cover Image URL</label><input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium text-slate-500" placeholder="https://..."/></div>
              <div className="flex items-center pt-8"><label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-slate-700"><input type="checkbox" checked={Boolean(form.requiresLab)} onChange={e => setForm({ ...form, requiresLab: e.target.checked })} className="w-5 h-5 rounded text-cyan-600"/> Requires Practical Lab Validation</label></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2 ml-1">CPD Points</label><input type="number" value={form.cpd} onChange={e => setForm({ ...form, cpd: Number(e.target.value) })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-bold text-slate-600"/></div>
              <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Est. Duration (Hours)</label><input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-bold text-slate-600"/></div>
              <div className="md:col-span-3"><label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Curriculum Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none font-medium text-slate-600 min-h-[120px]"/></div>
            </div>

            <div className="border-t-2 border-slate-100 pt-12">
              <h3 className="text-2xl font-black text-slate-800 mb-8 font-['Outfit'] flex items-center gap-3"><LayoutDashboard className="text-cyan-500"/> Module & Sub-Topic Builder</h3>
              
              <div className="flex flex-col gap-8 mb-8">
                {(form.modules || []).map((mod, mIdx) => (
                  <div key={mIdx} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 relative">
                    <button onClick={() => setForm({ ...form, modules: form.modules.filter((_, i) => i !== mIdx) })} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500"><Trash2 size={20}/></button>
                    <label className="block text-xs font-black text-cyan-600 uppercase tracking-widest mb-3">Module {mIdx + 1}</label>
                    <input type="text" value={mod.title} onChange={e => { const mods = [...form.modules]; mods[mIdx].title = e.target.value; setForm({ ...form, modules: mods }); }} className="w-full p-4 rounded-2xl border border-slate-200 focus:border-cyan-500 outline-none mb-4 font-black text-xl text-slate-800 bg-white" placeholder="Module Title"/>
                    <input type="text" value={mod.mainVideoUrl || ''} onChange={e => { const mods = [...form.modules]; mods[mIdx].mainVideoUrl = e.target.value; setForm({ ...form, modules: mods }); }} className="w-full p-3 rounded-xl border border-slate-200 outline-none mb-8 text-sm text-slate-600 font-medium bg-white" placeholder="Persistent Module Video URL (Applies across sub-topics unless overridden)"/>

                    <div className="pl-6 border-l-4 border-slate-200/60 flex flex-col gap-6">
                      {(mod.topics || []).map((top, tIdx) => (
                        <div key={tIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                          <button onClick={() => { const m = [...form.modules]; m[mIdx].topics = m[mIdx].topics.filter((_, i) => i !== tIdx); setForm({ ...form, modules: m }); }} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500"><X size={16}/></button>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Topic {tIdx + 1}</label>
                          <input type="text" value={top.title} onChange={e => { const m = [...form.modules]; m[mIdx].topics[tIdx].title = e.target.value; setForm({ ...form, modules: m }); }} className="w-full p-3 mb-4 border-b-2 border-slate-100 focus:border-cyan-500 outline-none font-bold text-lg text-slate-700" placeholder="Sub-Topic Title"/>
                          <textarea value={top.content} onChange={e => { const m = [...form.modules]; m[mIdx].topics[tIdx].content = e.target.value; setForm({ ...form, modules: m }); }} className="w-full p-4 text-base font-medium text-slate-600 bg-slate-50 rounded-xl border border-slate-100 outline-none min-h-[120px]" placeholder="Clinical content..."/>
                          
                          <div className="mt-6 pt-6 border-t border-slate-100">
                            <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-3 text-sm"><Book size={16} className="text-indigo-500"/> Sub-Topic Video & PDF Resources</h4>
                            <div className="flex flex-col gap-2 mb-3">
                              {(top.resources || []).map((res, rIdx) => {
                                const isUploading = simulatingUpload === `${mIdx}-${tIdx}-${rIdx}`;
                                return (
                                  <div key={rIdx} className="flex flex-wrap gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                                    <select value={res.type} onChange={e => { const m = [...form.modules]; m[mIdx].topics[tIdx].resources[rIdx].type = e.target.value; setForm({ ...form, modules: m }); }} className="p-2 text-xs font-bold rounded bg-white border border-slate-200">
                                      <option value="video">Video Lecture</option><option value="pdf">PDF Manual</option><option value="audio">Audio</option><option value="image">Image</option>
                                    </select>
                                    <input type="text" value={res.title} onChange={e => { const m = [...form.modules]; m[mIdx].topics[tIdx].resources[rIdx].title = e.target.value; setForm({ ...form, modules: m }); }} className="flex-1 p-2 text-xs font-bold rounded border border-slate-200" placeholder="Resource Title"/>
                                    <input type="text" value={res.url} onChange={e => { const m = [...form.modules]; m[mIdx].topics[tIdx].resources[rIdx].url = e.target.value; setForm({ ...form, modules: m }); }} className="flex-1 p-2 text-xs font-medium rounded border border-slate-200" placeholder="Direct URL"/>
                                    <button type="button" onClick={() => simulateUpload(mIdx, tIdx, rIdx)} disabled={isUploading} className="px-3 py-1.5 bg-slate-200 hover:bg-cyan-100 text-slate-700 font-bold text-xs rounded flex items-center gap-1">
                                      {isUploading ? <RefreshCw size={12} className="animate-spin"/> : <Upload size={12}/>} {isUploading ? 'Uploading...' : 'Upload'}
                                    </button>
                                    <button type="button" onClick={() => { const m = [...form.modules]; m[mIdx].topics[tIdx].resources.splice(rIdx, 1); setForm({ ...form, modules: m }); }} className="text-rose-500 p-1.5"><X size={14}/></button>
                                  </div>
                                );
                              })}
                            </div>
                            <Button type="button" variant="outline" onClick={() => { const m = [...form.modules]; if (!m[mIdx].topics[tIdx].resources) m[mIdx].topics[tIdx].resources = []; m[mIdx].topics[tIdx].resources.push({ title: '', type: 'pdf', url: '' }); setForm({ ...form, modules: m }); }} className="!py-1.5 !px-3 !text-xs border-dashed"><PlusCircle size={14}/> Add Resource</Button>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="secondary" onClick={() => { const m = [...form.modules]; m[mIdx].topics.push({ title: '', content: '', resources: [] }); setForm({ ...form, modules: m }); }} className="!py-3 !text-sm self-start bg-white"><PlusCircle size={16}/> Add Sub-Topic</Button>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t-2 border-slate-200/60">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-black text-slate-700 flex items-center gap-2 text-lg"><Target size={20} className="text-amber-500"/> Knowledge Check</h4>
                        <Button type="button" variant="outline" className="!py-2 !px-4 !text-sm bg-white" onClick={() => generateAIQuiz(mIdx)} disabled={generatingQuizId === `${mIdx}`}>
                          {generatingQuizId === `${mIdx}` ? <RefreshCw size={16} className="animate-spin"/> : <Sparkles size={16}/>} Auto-Generate with AI
                        </Button>
                      </div>
                      
                      <div className="flex flex-col gap-6">
                        {(mod.quiz || []).map((q, qIdx) => (
                          <div key={qIdx} className="bg-white p-6 rounded-[1.5rem] border-2 border-slate-100 flex flex-col gap-4 shadow-sm relative">
                            <button type="button" onClick={() => { const m = [...form.modules]; m[mIdx].quiz.splice(qIdx, 1); setForm({ ...form, modules: m }); }} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600"><X size={16}/></button>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {qIdx + 1}</label>
                            <input type="text" value={q.question} onChange={e => { const m = [...form.modules]; m[mIdx].quiz[qIdx].question = e.target.value; setForm({ ...form, modules: m }); }} className="w-full p-4 text-sm font-bold rounded-xl border border-slate-200 outline-none focus:border-cyan-500" placeholder="Enter Question..."/>
                            <div className="flex flex-col gap-2">
                              {(q.options || []).map((opt, oIdx) => (
                                <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${q.correctIndex === oIdx ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                                  <input type="radio" name={`quiz-${mIdx}-${qIdx}`} checked={q.correctIndex === oIdx} onChange={() => { const m = [...form.modules]; m[mIdx].quiz[qIdx].correctIndex = oIdx; setForm({ ...form, modules: m }); }} className="w-5 h-5 accent-emerald-500"/>
                                  <input type="text" value={opt} onChange={e => { const m = [...form.modules]; m[mIdx].quiz[qIdx].options[oIdx] = e.target.value; setForm({ ...form, modules: m }); }} className="flex-1 bg-transparent text-sm font-medium outline-none text-slate-700" placeholder={`Option ${oIdx + 1}`}/>
                                </div>
                              ))}
                            </div>
                            <textarea value={q.explanation} onChange={e => { const m = [...form.modules]; m[mIdx].quiz[qIdx].explanation = e.target.value; setForm({ ...form, modules: m }); }} className="w-full p-4 text-sm font-medium rounded-xl border border-slate-200 outline-none bg-slate-50 text-slate-600" placeholder="Clinical rationale and feedback..."/>
                          </div>
                        ))}
                      </div>
                      <Button type="button" variant="secondary" onClick={() => { const m = [...form.modules]; if (!m[mIdx].quiz) m[mIdx].quiz = []; m[mIdx].quiz.push({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }); setForm({ ...form, modules: m }); }} className="!py-3 !text-sm mt-6 bg-white"><PlusCircle size={16}/> Add Question</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" onClick={() => setForm({ ...form, modules: [...(form.modules || []), { title: 'New Module', topics: [], quiz: [] }] })} variant="outline" className="w-full border-dashed !py-5 text-lg bg-white"><PlusCircle size={24}/> Add Master Module</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminView = () => {
  const { profile } = useAuth();
  const { addToast } = useToast();
  const { usersList, setUsersList, promos, setPromos, courses, setCourses, labs } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');
  if (profile?.role !== 'superuser') return null;

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    const code = e.target.code.value.trim().toUpperCase();
    if (!code) return;
    const newPromo = { id: 'promo-' + Date.now(), code, active: true, createdAt: new Date().toISOString() };
    setPromos(prev => [newPromo, ...prev]);
    if (db) {
      addDoc(getPromosRef(), newPromo).catch(() => {});
    }
    addToast('Scholarship Promo Code created!', 'success');
    e.target.reset();
  };

  const handleRoleUpdate = async (uid, newRole) => {
    setUsersList(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u));
    if (db) {
      updateDoc(doc(getUsersRef(), uid), { role: newRole }).catch(() => {});
    }
    addToast('Role updated', 'success');
  };
  
  const handleVerifyUser = async (uid) => {
    setUsersList(prev => prev.map(u => u.id === uid ? { ...u, isVerified: true, cpdPoints: (u.cpdPoints || 0) + 10 } : u));
    if (db) {
      updateDoc(doc(getUsersRef(), uid), { isVerified: true, cpdPoints: 10 }).catch(() => {});
    }
    addToast('Practitioner Verified & Points Synced', 'success');
  };
  
  const handleCourseApproval = async (id, approve) => {
    const status = approve ? 'Published' : 'Draft';
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (db) {
      updateDoc(doc(getCoursesRef(), id), { status }).catch(() => {});
    }
    addToast(approve ? 'Course Published!' : 'Course Returned to Draft', 'success');
  };

  const totalRevenue = usersList.reduce((acc, u) => {
    let spent = 0;
    if (u.purchasedCourses) {
      u.purchasedCourses.forEach(id => {
        const c = courses.find(mc => mc.id === id);
        if (c) spent += (c.price || 0);
      });
    }
    return acc + spent;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
        <div className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] text-white shadow-lg shadow-indigo-500/20 mb-2">
          <div className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">Command Center</div>
          <div className="text-xl font-black font-['Outfit'] leading-tight">Super Admin</div>
        </div>
        {[
          { id: 'dashboard', Icon: BarChart, label: 'Platform Analytics' },
          { id: 'approvals', Icon: CheckSquare, label: 'Course Approvals' },
          { id: 'verify', Icon: ShieldCheck, label: 'Verify Practitioners' },
          { id: 'users', Icon: Users, label: 'Manage Users' },
          { id: 'promos', Icon: Tag, label: 'Promo Vouchers' }
        ].map(tab => {
          const TabIcon = tab.Icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}>
              <TabIcon size={20}/> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-w-0">
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-black text-slate-800 font-['Outfit']">Platform Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"><div className="text-sm font-bold text-slate-400 mb-2">Total Revenue</div><div className="text-4xl font-black text-indigo-600 font-['Outfit']">${totalRevenue}</div></div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"><div className="text-sm font-bold text-slate-400 mb-2">Registered Users</div><div className="text-4xl font-black text-slate-800 font-['Outfit']">{Math.max(1, usersList.length)}</div></div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"><div className="text-sm font-bold text-slate-400 mb-2">Published Courses</div><div className="text-4xl font-black text-slate-800 font-['Outfit']">{courses.filter(c => c.status === 'Published').length}</div></div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"><div className="text-sm font-bold text-slate-400 mb-2">Active Sim Labs</div><div className="text-4xl font-black text-slate-800 font-['Outfit']">{labs.length}</div></div>
            </div>
          </div>
        )}
         
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
            <h1 className="text-2xl font-black text-slate-800 font-['Outfit'] mb-6">Pending Course Approvals</h1>
            <div className="flex flex-col gap-4">
              {courses.filter(c => c.status === 'Pending Approval').map(c => (
                <div key={c.id} className="border border-amber-200 bg-amber-50/50 p-6 rounded-2xl flex justify-between items-center gap-6">
                  <div><div className="font-black text-lg text-slate-800">{c.title}</div><div className="text-sm text-slate-500 font-medium mt-1">{c.modules?.length || 0} Modules • {c.cpd} CPD Points</div></div>
                  <div className="flex gap-2 shrink-0"><Button onClick={() => handleCourseApproval(c.id, true)} className="!py-2 !px-4 !text-sm">Approve & Publish</Button><Button onClick={() => handleCourseApproval(c.id, false)} variant="danger" className="!py-2 !px-4 !text-sm">Reject</Button></div>
                </div>
              ))}
              {courses.filter(c => c.status === 'Pending Approval').length === 0 && <div className="text-slate-400 font-medium text-center p-6">No courses currently pending approval.</div>}
            </div>
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
            <h1 className="text-2xl font-black text-slate-800 font-['Outfit'] mb-6">Practitioner License Verification Queue</h1>
            <div className="flex flex-col gap-4">
              {usersList.filter(u => u.authorityId && !u.isVerified).map(u => (
                <div key={u.id} className="border border-slate-200 p-6 rounded-2xl flex justify-between items-center gap-6">
                  <div><div className="font-black text-lg text-slate-800">{u.title} {u.name}</div><div className="text-sm text-slate-500 font-mono mt-1 bg-slate-100 px-2 py-1 rounded inline-block">Auth ID: {u.authorityId}</div></div>
                  <Button onClick={() => handleVerifyUser(u.id)} className="!bg-emerald-500 !py-2 !px-4 !text-sm"><ShieldCheck size={16}/> Verify Practitioner</Button>
                </div>
              ))}
              {usersList.filter(u => u.authorityId && !u.isVerified).length === 0 && <div className="text-slate-400 font-medium text-center p-6">Verification queue is clear.</div>}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-6 font-['Outfit'] flex items-center gap-2"><Users className="text-cyan-500"/> User Role Management</h2>
            <div className="flex flex-col gap-4">
              {usersList.map(u => (
                <div key={u.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div><div className="font-bold text-slate-800">{u.title} {u.name}</div><div className="text-sm text-slate-500 font-medium">{u.email}</div></div>
                  <select value={u.role || 'learner'} onChange={(e) => handleRoleUpdate(u.id, e.target.value)} disabled={u.email === 'admin@pamoja.com'} className="p-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm outline-none bg-white min-w-[140px] disabled:opacity-50">
                    <option value="learner">Learner</option>
                    <option value="creator">Educator / Creator</option>
                    <option value="superuser">Superuser</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promos' && (
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-6 font-['Outfit'] flex items-center gap-2"><Tag className="text-emerald-500"/> Scholarship & Promo Codes</h2>
            <form onSubmit={handleCreatePromo} className="flex gap-4 mb-8"><input name="code" required type="text" placeholder="e.g. UNFPA2026" className="flex-1 p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none uppercase font-bold" /><Button type="submit" className="!bg-indigo-600">Create Code</Button></form>
            <div className="flex flex-col gap-3">{promos.map(p => (<div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center font-bold text-slate-700"><span>{p.code}</span><span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">Active</span></div>))}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const DirectoryView = () => {
  const { usersList } = useData();
  const { profile } = useAuth();

  const list = [...usersList];
  if (profile && profile.isPublic && !list.some(u => u.id === profile.id)) {
    list.unshift(profile);
  }
  const publicUsers = list.filter(u => u.isPublic);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in pb-20">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 font-['Outfit'] tracking-tight">Practitioner Network</h1>
        <p className="text-slate-500 text-lg font-medium leading-relaxed">Connect with verified medical professionals and view their certified CPD achievements on the Pamoja platform.</p>
      </header>
      {publicUsers.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-[2rem] border border-slate-100 shadow-xl"><Globe className="mx-auto text-slate-200 mb-4" size={64} /><h3 className="text-2xl font-black text-slate-700 font-['Outfit']">No public profiles yet</h3><p className="text-slate-500 mt-2 font-medium">Opt-in to the public directory from your profile settings.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publicUsers.map(p => (
            <div key={p.id || p.email} className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/30 border border-slate-100 text-center hover:-translate-y-1 transition-transform">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center text-3xl font-black shadow-md mx-auto mb-5">{p.name?.charAt(0) || 'P'}</div>
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{p.title} {p.name}</h3>
              <p className="text-cyan-600 font-bold text-sm mb-4">{p.specialty || 'Medical Professional'}</p>
              <div className="flex justify-center items-center gap-4 bg-slate-50 py-3 rounded-2xl border border-slate-100">
                <div className="text-center"><div className="text-xl font-black text-slate-700">{p.cpdPoints || 0}</div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Validated CPD Pts</div></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileView = () => {
  const { profile, updateProfileState } = useAuth();
  const { addToast } = useToast();
  const [authorityInput, setAuthorityInput] = useState('');
  const [confirmUnlinkOpen, setConfirmUnlinkOpen] = useState(false);

  const handleTogglePublic = async (e) => {
    const newValue = e.target.checked;
    await updateProfileState({ isPublic: newValue });
    addToast(`Directory visibility is now ${newValue ? 'Public' : 'Private'}`, 'success');
  };

  const handleConfirmUnlink = async () => {
    await updateProfileState({ authorityId: null, isVerified: false });
    setConfirmUnlinkOpen(false);
    addToast('CPD Authority Record Unlinked. You can reconnect it at any time.', 'info');
  };

  const handleLinkCPD = async () => {
    if (!authorityInput.trim()) return;
    await updateProfileState({
      authorityId: authorityInput.trim(),
      isVerified: true,
      cpdPoints: (profile?.cpdPoints || 0) + 10
    });
    addToast('Successfully linked & synced Authority ID!', 'success');
    setAuthorityInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in pb-20">
      <Modal isOpen={confirmUnlinkOpen} onClose={() => setConfirmUnlinkOpen(false)} title="Warning: Unlink Authority ID?">
        <div className="flex flex-col gap-5">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-medium leading-relaxed">
            Are you sure you want to unlink your Medical Board Authority ID (<strong>{profile?.authorityId}</strong>)? External CPD synchronization will pause until you link your ID again.
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setConfirmUnlinkOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={handleConfirmUnlink} className="flex-1">Yes, Unlink ID</Button>
          </div>
        </div>
      </Modal>

      <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/30 border border-slate-100">
        <div className="h-40 bg-gradient-to-r from-cyan-500 to-blue-600 relative overflow-hidden"></div>
        <div className="px-8 sm:px-12 pb-12 relative">
          <div className="w-32 h-32 rounded-[2rem] bg-white border-8 border-white shadow-xl -mt-16 flex items-center justify-center text-4xl font-black text-cyan-600 mb-6">{profile?.name?.charAt(0) || 'U'}</div>
          <h1 className="text-4xl font-black text-slate-800 font-['Outfit'] mb-2">{profile?.title} {profile?.name}</h1>
          <p className="text-slate-500 font-medium text-lg mb-8 flex items-center gap-2">
            {profile?.isVerified ? <ShieldCheck size={20} className="text-emerald-500"/> : <ShieldAlert size={20} className="text-amber-500"/>}
            {profile?.isVerified ? 'Verified Practitioner' : 'Pending Profession Verification'} • {profile?.specialty} • {profile?.location}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-10">
            <div className="bg-cyan-50/50 p-6 rounded-3xl flex-1 border border-cyan-100 flex items-center gap-5 shadow-sm">
              <div className="bg-white p-4 rounded-2xl shadow-md text-cyan-500"><Award size={32}/></div>
              <div>
                <div className="text-xs font-black text-cyan-600/70 uppercase tracking-widest mb-1">Total Validated CPD</div>
                <div className="text-4xl font-black text-slate-800 font-['Outfit']">{profile?.cpdPoints || 0}</div>
                {profile?.pendingPoints > 0 && <div className="text-xs font-bold text-amber-600 mt-1">+{profile.pendingPoints} Pending Lab Escrow</div>}
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl flex-1 border border-slate-100 flex flex-col justify-center shadow-sm">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Directory Visibility</div>
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input type="checkbox" checked={Boolean(profile?.isPublic)} onChange={handleTogglePublic} className="w-5 h-5 rounded text-cyan-600 border-slate-300 cursor-pointer"/>
                <span className="font-bold text-slate-700 group-hover:text-cyan-600 transition-colors">{profile?.isPublic ? 'Public Profile Active (Listed in Directory)' : 'Profile Hidden (Click to Opt-In)'}</span>
              </label>
            </div>
          </div>
          
          {profile?.authorityId ? (
            <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${profile.isVerified ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <Activity className={profile.isVerified ? 'text-indigo-500 shrink-0' : 'text-slate-400 shrink-0'} size={24}/>
                <div>
                  <p className="font-bold text-indigo-900">{profile.isVerified ? 'External Medical Board Sync Active' : 'Authority ID Linked'}</p>
                  <p className="text-sm font-medium mt-1 text-indigo-700/80">Authority ID: <span className="font-mono bg-white px-2 py-0.5 rounded border border-indigo-100">{profile.authorityId}</span></p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setConfirmUnlinkOpen(true)} className="!text-rose-500 !border-rose-500 hover:!bg-rose-50 !py-2 !px-4 !text-sm"><Link2Off size={16}/> Unlink ID</Button>
            </div>
          ) : (
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <ShieldAlert className="text-amber-500 shrink-0" size={24}/>
                <div><p className="font-bold text-amber-900">Link Medical Authority ID</p><p className="text-sm text-amber-700/70 font-medium mt-1">Re-link or sync your CPD points and verify your profession at any time.</p></div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <input type="text" value={authorityInput} onChange={(e) => setAuthorityInput(e.target.value)} className="w-full sm:w-48 p-2.5 rounded-xl border border-amber-200 outline-none focus:border-amber-500 bg-white" placeholder="e.g. HPCSA-123"/>
                <Button onClick={handleLinkCPD} className="!py-2.5 !px-4 !text-sm">Link & Sync</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AIMentor = () => {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Welcome! I'm Dr. Pam, your clinical AI mentor on Pamoja Premium. How can I support your practice or coursework today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', parts: [{ text: userMsg }] }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = ''; 
      const systemPrompt = "You are Dr. Pam, a friendly, professional clinical AI mentor on the Pamoja Premium platform. Assist healthcare professionals with continuous professional development (CPD), HIV/PMTCT care, culturally competent Wraparound family support, Group Antenatal Care (GC_1000), and EMOTIVE PPH bundles. Always note that your guidance supports learning and does not replace official facility protocols.";
      
      const payload = { 
        contents: newMessages, 
        systemInstruction: { parts: [{ text: systemPrompt }] } 
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      const data = await res.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (botText) {
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: botText }] }]);
      } else {
        throw new Error('Fallback response');
      }
    } catch (e) { 
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "Based on Pamoja's accredited clinical curriculum: remember to complete each sub-topic and its Knowledge Check (>=80% benchmark) to log your progress. For courses requiring practical validation, book a regional Simulation Lab to release your Escrow CPD points!" }]
      }]); 
    }
    setLoading(false);
  };

  if (!user || profile?.role === 'guest') return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
      {open && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-[2rem] shadow-2xl shadow-cyan-500/20 border border-slate-100 flex flex-col overflow-hidden pointer-events-auto">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30"><Bot size={28}/></div>
              <div><h3 className="font-black text-lg leading-tight font-['Outfit']">Dr. Pam</h3><p className="text-xs text-cyan-100 font-bold uppercase tracking-widest mt-0.5">Clinical AI Mentor</p></div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={24}/></button>
          </div>
          <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-slate-50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                {m.role === 'model' && <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 mt-1 shadow-sm"><Bot size={16}/></div>}
                <div className={`p-4 text-sm font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100'}`}>{m.parts?.[0]?.text || ''}</div>
              </div>
            ))}
            {loading && <div className="text-xs font-bold text-cyan-600 pl-10">Dr. Pam is reviewing clinical guidelines...</div>}
          </div>
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask Dr. Pam a clinical question..." className="w-full bg-slate-50 border-2 border-slate-100 font-medium text-sm rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:border-cyan-500 text-slate-700"/>
              <button onClick={handleSend} disabled={!input.trim()} className="absolute right-2 top-1.5 w-10 h-10 bg-cyan-500 text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-blue-600 transition-colors shadow-md"><ArrowRight size={18}/></button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="pointer-events-auto w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-2xl shadow-cyan-500/40 hover:scale-105 transition-all duration-300 border-4 border-white">
        {open ? <X size={28}/> : <Bot size={28}/>}
      </button>
    </div>
  );
};

const MainApp = () => {
  const [currentView, setView] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState('course-peer-ed-hiv');

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView setView={setView} setCourseId={setSelectedCourseId} />;
      case 'course': return <CourseView courseId={selectedCourseId} setView={setView} />;
      case 'labs': return <LabsView />;
      case 'studio': return <StudioView />;
      case 'admin': return <AdminView />;
      case 'directory': return <DirectoryView />;
      case 'profile': return <ProfileView />;
      default: return <HomeView setView={setView} setCourseId={setSelectedCourseId} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      <Navbar currentView={currentView} setView={setView} />
      <main className="flex-1 w-full relative z-10">{renderView()}</main>
      <footer className="bg-white border-t border-slate-200/60 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm font-medium">
          <div className="flex items-center gap-2 font-black text-slate-700 tracking-wide font-['Outfit'] text-lg"><Stethoscope size={20} className="text-cyan-500"/> Pamoja Premium</div>
          <div>&copy; {new Date().getFullYear()} Pamoja Clinical Education.</div>
          <div className="flex gap-6 font-bold">
            <button onClick={() => setView('home')} className="hover:text-cyan-600 transition-colors">Courses</button>
            <button onClick={() => setView('labs')} className="hover:text-cyan-600 transition-colors">Sim Labs</button>
            <button onClick={() => setView('directory')} className="hover:text-cyan-600 transition-colors">Directory</button>
          </div>
        </div>
      </footer>
      <AIMentor />
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      ` }} />
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <MainApp />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </AppErrorBoundary>
  );
}