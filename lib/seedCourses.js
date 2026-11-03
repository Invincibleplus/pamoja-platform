// lib/seedCourses.js - Auto-generated and Synchronized with Curriculum Sources & Specs
// Dynamic Content-Driven Modular Curricula (1-to-3 Module Rapid Refreshers, 4-to-8 Module Certificates, and 9+ Module Mastery Curricula)

export function getCourseFormatBadge(moduleCount = 1) {
  const count = Number(moduleCount) || 1;
  const modWord = count === 1 ? 'Module' : 'Modules';
  if (count <= 3) {
    return {
      tier: 'Rapid Refresher',
      label: `Rapid Refresher (${count} ${modWord})`,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60'
    };
  }
  if (count <= 8) {
    return {
      tier: 'Clinical Certificate',
      label: `Clinical Certificate (${count} ${modWord})`,
      color: 'text-amber-400 bg-amber-950/80 border-amber-800/60'
    };
  }
  return {
    tier: 'Mastery Curriculum',
    label: `Mastery Curriculum (${count} ${modWord})`,
    color: 'text-cyan-400 bg-cyan-950/80 border-cyan-800/60'
  };
}

export const SEED_COURSES = [
  {
    "id": "course-peer-ed-hiv",
    "title": "Comprehensive Peer Educator Training for HIV & PMTCT Care",
    "category": "Maternal Health",
    "cpd": 15,
    "duration": 40,
    "pricingModel": "free",
    "freePreviewModules": 10,
    "price": 0,
    "requiresLab": true,
    "status": "Published",
    "activityCode": "HPCSA/MDB015/042/2026",
    "creatorId": "system-seed",
    "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80",
    "description": "Accredited 10-module mastery curriculum preparing peer educators and clinicians to operate within multidisciplinary HIV and PMTCT care teams, provide adherence counseling, and conduct active TB screening.",
    "modules": [
      {
        "title": "Module 1: Course Overview & Introduction",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 1.1: Welcome and Ground Rules",
            "content": "Establishing a secure, respectful, and open educational environment is the vital first step of peer educator training. Peer education training often brings together individuals who live with HIV and may have experienced significant social stigma or trauma.\n\nCore Ground Rules:\n1. Punctuality: Arriving on time to respect the learning of others.\n2. Active Listening: Giving full attention to whoever is speaking without interruption.\n3. Mutual Respect: Valuing diverse viewpoints and experiences, as there are no \"wrong\" feelings.\n4. Absolute Confidentiality: Agreeing that personal stories, medical statuses, or disclosures shared within the classroom remain strictly confidential.\n\nLMS Deep-Dive & Practical Application Guide:\nBy establishing boundaries early, trainees learn that personal disclosures must be met with non-judgmental acceptance. This models the clinical \"shared confidentiality\" standard practiced across multidisciplinary facility teams.",
            "resources": [
              {
                "title": "Participant Manual: Module 1 Ground Rules (PDF)",
                "type": "pdf",
                "url": "https://www.who.int"
              }
            ]
          },
          {
            "title": "Topic 1.2: Training Objectives and Expectations",
            "content": "The ultimate objective of this training course is to prepare peer educators to operate as highly skilled, integrated members of facility multidisciplinary care teams at PMTCT and HIV care and treatment clinics.\n\nKey Competencies:\n• Provide supportive, non-didactic one-on-one counseling and waiting-room group health talks.\n• Prioritize vulnerable populations, such as pregnant and breastfeeding women, for immediate HIV care and treatment.\n• Act as clinical navigation guides across TB screening, family planning, laboratory, and nutrition services.\n• Encourage positive disclosure, family-focused care, and early infant diagnosis (EID) at 6 weeks.",
            "resources": []
          },
          {
            "title": "Topic 1.3: Learning Needs Assessment",
            "content": "Before starting the curriculum, facilitators conduct a formal learning needs assessment to map participants' existing knowledge, biases, and communication skills.\n\nThis diagnostic baseline evaluates:\n• Basic HIV and AIDS pathology (transmission, prevention, CD4 counts, viral load).\n• Attitudes toward sexual health, reproductive rights, and stigma reduction.\n• Prior counseling experience.\n\nLMS Deep-Dive & Practical Application Guide:\nThe assessment is strictly formative—its goal is not to exclude learners, but to customize pacing and translate complex clinical terms into clear, culturally congruent language.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "Why is it vital to co-create \"ground rules\" on the very first day of Peer Educator training?",
            "options": [
              "To establish an authoritative classroom hierarchy where the trainer has absolute disciplinary power.",
              "To establish a safe, respectful environment that models clinical confidentiality and reduces stigma.",
              "To satisfy a formal administrative requirement mandated by the ministry of health.",
              "To grade participants on their ability to write complex code-of-conduct policies."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. Ground rules are co-created to build a collaborative and egalitarian space, not a rigid hierarchy.",
              "Excellent! Co-creating ground rules establishes psychological safety and models the clinical confidentiality practiced in the field.",
              "Incorrect. Ground rules are an educational and ethical necessity for safe learning, not a mere formality.",
              "Incorrect. Ground rules are formative agreements on group behavior, not graded exams."
            ],
            "explanation": "Because trainees share deeply personal experiences, co-creating ground rules establishes a safe space and models clinical confidentiality."
          },
          {
            "question": "What is a primary objective of the Peer Educator training program regarding clinical care teams?",
            "options": [
              "To train educators to replace clinical nurses and prescribe first-line antiretrovirals.",
              "To prepare educators to work as integrated members of multidisciplinary care teams, bridging clinic-community gaps.",
              "To train educators to work exclusively as independent community activists without clinical connection.",
              "To prepare peer educators to take over clinic financial management and budgeting."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. Peer educators do not prescribe medications or replace licensed clinical staff.",
              "Excellent! The primary goal is integrating peer educators into facility multidisciplinary teams to improve counseling and retention.",
              "Incorrect. The program integrates peer educators within facility teams to bridge the clinic-community gap.",
              "Incorrect. Peer educators focus on counseling, education, and navigation, not financial administration."
            ],
            "explanation": "Integrating peer educators into facility multidisciplinary teams bridges the gap between clinical staff and clients."
          }
        ]
      },
      {
        "title": "Module 2: Peer Education Roles & Multidisciplinary Teams",
        "topics": [
          {
            "title": "Topic 2.1: Goals and Advantages of Peer Education (GIPA Principle)",
            "content": "Peer education is grounded in the GIPA (Greater Involvement of People Living with HIV) principle. By engaging individuals living openly and positively with HIV, clinics deliver empathetic, credible, and culturally responsive support.\n\nCore Advantages:\n1. Empowerment of Individuals: Builds client self-efficacy in adherence.\n2. Improved Service Quality: Direct feedback loop from waiting rooms to clinic managers.\n3. Task Shifting: Frees doctors and nurses to focus on complex clinical diagnostics while peer educators lead routine adherence and health education.\n4. Stigma Reduction: Visibly challenges community stereotypes."
          },
          {
            "title": "Topic 2.2: Daily Responsibilities & Integrating into Multidisciplinary Teams",
            "content": "Peer educators split their shifts between clinic waiting areas, private counseling rooms, and community tracing.\n\nDaily Clinical Workflow:\n• Conducting interactive waiting-room education on PMTCT, TB, and hygiene.\n• Facilitating one-on-one adherence preparation for newly diagnosed clients.\n• Navigating clients across laboratory, pharmacy, and MCH departments.\n• Reviewing daily appointment registers to trace missed appointments sensitively."
          }
        ],
        "quiz": [
          {
            "question": "Which of the following is a primary advantage of \"task shifting\" within a multidisciplinary HIV care team?",
            "options": [
              "Shifting complex diagnostic decisions to unlicensed peer volunteers.",
              "Freeing up clinical nurses and doctors to focus on complex cases by shifting basic counseling to peer educators.",
              "Reducing the overall operational hours of the health clinic to cut budget costs.",
              "Shifting the responsibility of pharmaceutical ordering to community health workers."
            ],
            "correctIndex": 1,
            "explanation": "Peer educators take over routine education and adherence support, allowing nurses and doctors to focus on complex medical care."
          }
        ]
      },
      {
        "title": "Module 3: HIV and Reproductive Health Basics",
        "topics": [
          {
            "title": "Topic 3.1: Defining HIV, AIDS, and CD4 Immunology",
            "content": "HIV (Human Immunodeficiency Virus) targets CD4 T-helper lymphocytes. Normal adult CD4 counts range from 500 to 1,500 cells/mm³. AIDS (Acquired Immunodeficiency Syndrome) is the advanced clinical stage diagnosed when the CD4 count drops below 200 cells/mm³ or when severe opportunistic infections (such as TB or cryptococcal meningitis) occur."
          },
          {
            "title": "Topic 3.2: Transmission, Biomedical Prevention & Family-Focused Care",
            "content": "HIV is transmitted only via blood, semen, vaginal fluids, and breast milk through unprotected sex, vertical MTCT (pregnancy, delivery, breastfeeding), unscreened blood, or contaminated sharps.\n\nBiomedical Prevention & Family-Focused Care:\n• Voluntary Medical Male Circumcision (VMMC) reduces female-to-male transmission risk by ~60% but must always be paired with condoms.\n• U=U (Undetectable = Untransmittable) through lifelong ART adherence, alongside PrEP and PEP.\n• Family-Focused Care treats the mother, partner, and exposed children as a collective unit."
          }
        ],
        "quiz": [
          {
            "question": "What is the critical biological distinction between HIV and AIDS?",
            "options": [
              "HIV is a bacterial infection of the lungs, while AIDS is a viral blood disease.",
              "HIV is the virus that weakens CD4 immune cells, while AIDS is the advanced clinical stage marked by severe immune damage.",
              "AIDS is the early stage, while HIV is the dormant late stage.",
              "HIV only affects women, whereas AIDS exclusively affects men."
            ],
            "correctIndex": 1,
            "explanation": "HIV is the causative virus targeting CD4 cells; AIDS is the late clinical stage when CD4 falls below 200 cells/mm³ or OIs emerge."
          }
        ]
      },
      {
        "title": "Module 4: Communication & Counseling Skills",
        "topics": [
          {
            "title": "Topic 4.1: Shared Confidentiality & The Seven Key Counseling Skills",
            "content": "Shared confidentiality means a client's medical information is shared strictly among the multidisciplinary clinical team directly involved in their care, and never with outsiders without explicit consent.\n\nThe Seven Key Counseling Skills:\n1. Use helpful non-verbal communication.\n2. Ask open-ended questions.\n3. Actively listen and show interest.\n4. Reflect back (paraphrase) what the client says.\n5. Show empathy, not sympathy.\n6. Avoid judging words (\"good\", \"bad\", \"wrong\").\n7. Help the client set realistic goals and summarize."
          }
        ],
        "quiz": [
          {
            "question": "What does the ethical principle of \"shared confidentiality\" mean in a clinic setting?",
            "options": [
              "Sharing the client status with community leaders to build support.",
              "Sharing medical information strictly among the multidisciplinary clinic team directly involved in the client's care.",
              "Posting treatment progress on the clinic bulletin board.",
              "Sharing medical files with other patients in the waiting room."
            ],
            "correctIndex": 1,
            "explanation": "Shared confidentiality permits care coordination within the direct clinical team while strictly protecting client privacy from the public."
          }
        ]
      },
      {
        "title": "Module 5: Comprehensive HIV Care & Active TB Screening",
        "topics": [
          {
            "title": "Topic 5.1: Opportunistic Infections & The 4-Question Active TB Checklist",
            "content": "Tuberculosis (TB) is the leading cause of death among people living with HIV. Peer educators must administer the 4-question active TB screening checklist at every encounter:\n1. Current cough of any duration?\n2. Fever?\n3. Unexplained weight loss?\n4. Night sweats?\n\nAny \"Yes\" response triggers an immediate clinical referral for sputum Xpert MTB/RIF testing and chest evaluation, alongside Cotrimoxazole preventive therapy (CPT)."
          }
        ],
        "quiz": [
          {
            "question": "What is the correct action for a Peer Educator if a client screens positive on the active TB checklist?",
            "options": [
              "Tell the client to go home and drink hot fluids for two weeks.",
              "Immediately refer the client to a clinician for sputum collection and diagnostic evaluation.",
              "Prescribe high-dose antibiotics independently.",
              "Isolate the client permanently from all family members."
            ],
            "correctIndex": 1,
            "explanation": "Any positive symptom on the 4-question TB checklist requires immediate clinical referral for diagnostic testing."
          }
        ]
      },
      {
        "title": "Module 6: Antiretroviral Therapy (ART) Foundations",
        "topics": [
          {
            "title": "Topic 6.1: Combination Therapy (TLD), Treatment for Life & >=95% Adherence",
            "content": "First-line regimens such as TLD (Tenofovir + Lamivudine + Dolutegravir) suppress viral replication so CD4 cells can recover. Clients must maintain >=95% adherence for life to prevent viral rebound and drug resistance. Minor initial side effects (mild nausea, headache) are self-limiting, whereas severe jaundice or rash requires immediate clinical review."
          }
        ],
        "quiz": [
          {
            "question": "Why is it vital for clients to maintain at least 95% adherence to Antiretroviral Therapy (ART)?",
            "options": [
              "To ensure the clinic receives annual donor funding.",
              "To prevent the virus from replicating, mutating, and developing drug resistance.",
              "To allow the patient to stop taking medicines after six months.",
              "To cure HIV permanently within one year."
            ],
            "correctIndex": 1,
            "explanation": "High adherence (>=95%) keeps viral load undetectable and prevents drug-resistant mutations."
          }
        ]
      },
      {
        "title": "Module 7: PMTCT & Pediatric HIV Care",
        "topics": [
          {
            "title": "Topic 7.1: MTCT Pathways, Option B+, Exclusive Breastfeeding & EID at 6 Weeks",
            "content": "Mother-to-Child Transmission occurs in utero, intrapartum, or postpartum via breastfeeding. Under Option B+, all pregnant/breastfeeding women living with HIV initiate lifelong ART immediately.\n\nSafe Infant Feeding & EID:\n• Exclusive Breastfeeding (EBF) for the first 6 months; strictly avoid mixed feeding, which damages the infant's gut mucosa and increases viral entry.\n• Infants receive daily Nevirapine prophylaxis at birth and undergo DNA PCR Early Infant Diagnosis (EID) testing at 6 weeks of age."
          }
        ],
        "quiz": [
          {
            "question": "Why is \"mixed feeding\" dangerous for an HIV-exposed infant under six months of age?",
            "options": [
              "It causes severe pediatric hypertension.",
              "It irritates and damages the baby's delicate gut lining, allowing HIV in breast milk to enter the bloodstream.",
              "It prevents the mother from producing breast milk in the future.",
              "It makes the infant resistant to childhood immunizations."
            ],
            "correctIndex": 1,
            "explanation": "Mixed feeding before 6 months damages the infant intestinal mucosa, increasing vertical HIV transmission risk."
          }
        ]
      },
      {
        "title": "Module 8: Positive Living & Psychosocial Support",
        "topics": [
          {
            "title": "Topic 8.1: Recipe for Positive Living, Mental Health Red Flags & Safer Sex",
            "content": "Positive living integrates a Healthy Mind, Healthy Body, and Healthy Soul. Peer educators screen for depression and refer any client expressing self-harm or suicidal ideation immediately to a clinician. Dual protection and consistent condom use prevent STI transmission and superinfection with drug-resistant HIV strains."
          }
        ],
        "quiz": [
          {
            "question": "Why is consistent condom use essential for couples who are both living with HIV?",
            "options": [
              "To prevent transmission of different, drug-resistant strains of HIV (superinfection) and STIs between partners.",
              "To cure the infection through barrier restriction.",
              "To satisfy a legal marital mandate.",
              "To increase CD4 counts without taking ART."
            ],
            "correctIndex": 0,
            "explanation": "Condoms prevent superinfection with drug-resistant viral strains and protect against sexually transmitted infections."
          }
        ]
      },
      {
        "title": "Module 9: Community Outreach & Linkages",
        "topics": [
          {
            "title": "Topic 9.1: Community Resource Inventories & Ethical Home Visits",
            "content": "Peer educators maintain an updated Community Resource Inventory (nutrition, legal aid, PLHIV support groups, livelihood programs) to support bidirectional referrals. Home visits require explicit prior client consent and strict protection of household privacy so neighbors do not deduce the client's status."
          }
        ],
        "quiz": [
          {
            "question": "Which of the following is a critical ethical rule for conducting a client home visit?",
            "options": [
              "Arriving unannounced to verify pill counts.",
              "Obtaining explicit prior consent from the client and protecting their privacy in the neighborhood.",
              "Disclosing the client's status to neighbors to build community support.",
              "Collecting the client's financial documents."
            ],
            "correctIndex": 1,
            "explanation": "Explicit prior consent and discretion in the community are mandatory to protect client confidentiality."
          }
        ]
      },
      {
        "title": "Module 10: Record-Keeping & Program Evaluation",
        "topics": [
          {
            "title": "Topic 10.1: Daily Registers, Monthly Activity Reports & Supervised Practicum",
            "content": "Accurate completion of Daily Registers, Sessional Waiting-Room Logs, and Monthly Activity Reports ensures no patient falls through the cracks. Trainees complete a supervised clinical practicum evaluated across the 7 counseling skills, TB screening, PMTCT support, and register accuracy."
          }
        ],
        "quiz": [
          {
            "question": "What is the primary purpose of compiling \"Monthly Activity Reports\" in the Peer Educator program?",
            "options": [
              "To rank peer educators publicly for financial bonuses.",
              "To aggregate daily metrics, monitor clinic retention trends, and evaluate overall program impact.",
              "To satisfy clinic tax compliance.",
              "To replace official patient medical charts."
            ],
            "correctIndex": 1,
            "explanation": "Monthly activity reports aggregate daily counseling and tracing metrics to guide clinical quality improvement."
          }
        ]
      }
    ]
  },
  {
    "id": "course-raices-wraparound",
    "title": "Culturally Competent Family Support & The Wraparound Process",
    "category": "Mental Health",
    "cpd": 12,
    "duration": 32,
    "pricingModel": "freemium",
    "freePreviewModules": 1,
    "price": 39,
    "requiresLab": false,
    "status": "Published",
    "activityCode": "KMPDC/CPD/2026/410",
    "creatorId": "system-seed",
    "image": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=80",
    "description": "Comprehensive 10-module mastery curriculum based on the RAICES/Promotoras and FASST Systems of Care model, covering cultural competence, the 10-step Wraparound process, ESE/IEP advocacy, and home visiting.",
    "modules": [
      {
        "title": "Module 1: Introduction to FASST and Systems of Care",
        "topics": [
          {
            "title": "Topic 1.1: Bilingual Promotoras & Systems of Care Core Values",
            "content": "The Family and School Support Team (FASST) integrates bilingual community outreach workers (promotoras) into school and clinical support teams.\n\nThree Core System of Care (SOC) Values:\n1. Child-Centered and Family-Focused: Services fit the family rather than forcing families into rigid slots.\n2. Community-Based: Maximizes natural and informal community support networks.\n3. Culturally Competent: Respects and utilizes the family's cultural beliefs, values, and native language."
          }
        ],
        "quiz": [
          {
            "question": "Which of the following represents the three core values of the System of Care (SOC) philosophy?",
            "options": [
              "Standardized templates, institutional care, and uniform language policies.",
              "Child-centered/family-focused, community-based, and culturally competent services.",
              "Hospital-centered, clinician-dictated, and acute-only interventions.",
              "School-disciplined, administrative-led, and standardized testing."
            ],
            "correctIndex": 1,
            "explanation": "The SOC philosophy is anchored in child-centered/family-focused, community-based, and culturally competent care."
          }
        ]
      },
      {
        "title": "Module 2: Wraparound Values, Ethics & Group Norms",
        "topics": [
          {
            "title": "Topic 2.1: Wraparound Philosophy & The FASST Confidential Agreement",
            "content": "Wraparound is an individualized, strength-based care planning process driven by family voice and choice. Every FASST team member signs a binding Ethical and Confidential Agreement protecting family privacy before engaging households."
          }
        ],
        "quiz": [
          {
            "question": "What is the primary focus of the Wraparound Process in family support?",
            "options": [
              "Standardizing clinical interventions identically across all families.",
              "Convening a family's natural and formal support networks to build a customized, strength-based support plan.",
              "Requiring families to relocate to residential treatment centers.",
              "Shifting all care decisions to a single external psychologist."
            ],
            "correctIndex": 1,
            "explanation": "Wraparound brings together natural and formal supports to co-create an individualized, strength-based family plan."
          }
        ]
      },
      {
        "title": "Module 3: Culture & Cultural Competence Foundations",
        "topics": [
          {
            "title": "Topic 3.1: Cultural Knowledge, Awareness, Sensitivity & Competence",
            "content": "While Cultural Knowledge is cognitive familiarization and Cultural Awareness involves internal attitude shifts, Cultural Competence is a set of congruent behaviors, attitudes, and policies that enable professionals and agencies to work effectively in cross-cultural situations."
          }
        ],
        "quiz": [
          {
            "question": "How is \"Cultural Competence\" distinguished from \"Cultural Knowledge\"?",
            "options": [
              "Cultural competence is purely academic, while knowledge is legal.",
              "Competence emphasizes the active capacity and congruent behaviors to operate effectively across cultural contexts.",
              "Cultural competence requires abandoning one's own heritage.",
              "There is no distinction between the two terms."
            ],
            "correctIndex": 1,
            "explanation": "Cultural competence translates awareness and knowledge into effective operational behaviors and institutional policies."
          }
        ]
      },
      {
        "title": "Module 4: Achieving Culturally Competent Practice",
        "topics": [
          {
            "title": "Topic 4.1: The 6-Stage Continuum & 5 Organizational Elements",
            "content": "The Cultural Competence Continuum progresses through: 1) Cultural Destructiveness, 2) Cultural Incapacity, 3) Cultural Blindness, 4) Cultural Pre-Competence, 5) Basic Cultural Competence, and 6) Advanced Cultural Competence."
          }
        ],
        "quiz": [
          {
            "question": "Which level of the Cultural Competence Continuum assumes that \"all people are exactly the same,\" ignoring cultural strengths?",
            "options": [
              "Cultural Destructiveness",
              "Cultural Blindness",
              "Cultural Incapacity",
              "Basic Cultural Competence"
            ],
            "correctIndex": 1,
            "explanation": "Cultural Blindness treats everyone as identical, which ignores cultural strengths and reinforces dominant-group norms."
          }
        ]
      },
      {
        "title": "Module 5: Understanding School Administration & Personnel",
        "topics": [
          {
            "title": "Topic 5.1: Classroom Dynamics, Personnel Roles & Referral Pathways",
            "content": "Classroom teachers are often the first to observe behavioral or emotional distress, while School Social Workers bridge home, school, and community agencies. Promotoras facilitate warm, native-language referrals with written parental consent."
          }
        ],
        "quiz": [
          {
            "question": "What is a primary responsibility of a School Social Worker in the FASST framework?",
            "options": [
              "Prescribing psychiatric medications independently.",
              "Acting as a link between the school, the student's home, and community agencies to coordinate care.",
              "Managing school facility maintenance.",
              "Writing daily classroom lesson plans."
            ],
            "correctIndex": 1,
            "explanation": "School social workers connect home, school, and external community services to support student well-being."
          }
        ]
      },
      {
        "title": "Module 6: Exceptional Student Education (ESE) and ESOL",
        "topics": [
          {
            "title": "Topic 6.1: IEPs, ESOL Accommodations & Ethical Conference Translation",
            "content": "An Individual Educational Plan (IEP) is a legally binding document outlining goals and accommodations for students with special needs. During parent-teacher and IEP conferences, translators must translate completely, accurately, and impartially without omitting details or injecting personal opinions."
          }
        ],
        "quiz": [
          {
            "question": "What is an ethical rule for a Promotora translating during an ESE IEP meeting?",
            "options": [
              "Summarizing long statements to finish faster.",
              "Translating everything said completely and accurately, remaining impartial without adding personal opinions.",
              "Advising parents on which medical decisions to make.",
              "Only translating statements made by the school principal."
            ],
            "correctIndex": 1,
            "explanation": "Ethical interpretation requires completeness, accuracy, and impartiality so parents participate as equal partners."
          }
        ]
      },
      {
        "title": "Module 7: Child Mental Health & Developmental Domains",
        "topics": [
          {
            "title": "Topic 7.1: Middle Childhood Milestones & Nurturing Environments",
            "content": "Middle childhood (ages 6–12) is marked by logical cognitive growth, peer relationship formation, and emotional regulation. Consistent daily routines and positive, non-violent discipline act as protective factors that reduce child anxiety and improve classroom focus."
          }
        ],
        "quiz": [
          {
            "question": "How do structured daily routines at home support a child's mental health?",
            "options": [
              "By making home life unpredictable.",
              "By reducing child anxiety, providing a sense of safety, and improving classroom focus.",
              "By replacing academic classroom instruction.",
              "By eliminating all household rules."
            ],
            "correctIndex": 1,
            "explanation": "Predictable routines for homework, meals, and sleep lower anxiety and strengthen executive functioning."
          }
        ]
      },
      {
        "title": "Module 8: Implementing the 10-Step Wraparound Process",
        "topics": [
          {
            "title": "Topic 8.1: The 10 Sequential Steps & Strength-Based Family Plans",
            "content": "The 10 steps begin with Establishing Effective Linkages and Initial Safety Checks, followed by Discovering Strengths, Convening the Family Team (including informal natural supports), reviewing Life Domains, and documenting a needs-driven, strength-based Family Plan."
          }
        ],
        "quiz": [
          {
            "question": "Why must a Wraparound Family Team actively include \"informal supports\" like extended family and neighbors?",
            "options": [
              "To reduce case manager salaries.",
              "Because they meet families where they are and remain as sustainable support networks after formal services end.",
              "To report household rules to the school principal.",
              "To replace licensed clinical therapists."
            ],
            "correctIndex": 1,
            "explanation": "Informal natural supports provide enduring, culturally grounded community backing long after formal agency care concludes."
          }
        ]
      },
      {
        "title": "Module 9: Strength-Based Case Management",
        "topics": [
          {
            "title": "Topic 9.1: Advocate, Broker & Educator Roles in Inter-Agency Care",
            "content": "Strength-based case managers act as Advocates, Resource Brokers, and Educators—coordinating across fragmented systems to prevent duplicate testing and conflicting instructions while involving families in progress evaluation."
          }
        ],
        "quiz": [
          {
            "question": "Why is inter-agency service coordination critical for families with complex needs?",
            "options": [
              "To force all families to use a single clinic.",
              "To prevent conflicting instructions and duplicate testing across fragmented social, educational, and clinical systems.",
              "To reduce communication between parents and schools.",
              "To transfer parental custody to state agencies."
            ],
            "correctIndex": 1,
            "explanation": "Service coordination aligns school, clinical, and community providers into a unified support network."
          }
        ]
      },
      {
        "title": "Module 10: Conducting Effective Home Visits",
        "topics": [
          {
            "title": "Topic 10.1: Preparation, Boundaries & The Three Stages of Home Visiting",
            "content": "Professional home visits prepare native-language materials in advance and follow three structured stages: 1) Engagement Stage (rapport and check-in), 2) Main Activity Stage (reviewing goals and family plan actions), and 3) Transition/Closing Stage (summarizing accomplishments, setting \"baby steps\", and scheduling the next visit)."
          }
        ],
        "quiz": [
          {
            "question": "What are the key components of the \"Transition/Closing Stage\" of a professional home visit?",
            "options": [
              "Leaving unannounced while the parent is in another room.",
              "Summarizing accomplishments, defining concrete \"baby steps\" for the week, and scheduling the next visit.",
              "Demanding immediate payment for travel expenses.",
              "Delivering a didactic lecture on academic failure."
            ],
            "correctIndex": 1,
            "explanation": "The closing stage celebrates progress, defines achievable next steps, and confirms the next scheduled visit."
          }
        ]
      }
    ]
  },
  {
    "id": "course-gc1000-maternal",
    "title": "Group Antenatal and Postnatal Care: The GC_1000 Implementation Framework",
    "category": "Maternal Health",
    "cpd": 15,
    "duration": 45,
    "pricingModel": "free",
    "freePreviewModules": 10,
    "price": 0,
    "requiresLab": true,
    "status": "Published",
    "activityCode": "WHO-AFRO/GC1000/2026",
    "creatorId": "system-seed",
    "image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80",
    "description": "Master the Centering-based Group Care model (GC_1000 Toolkit) across the first 1,000 days, integrating self-care stations, semi-private 3–5 minute clinical assessments, interactive circle facilitation, and WHO ExpandNet scale-up.",
    "modules": [
      {
        "title": "Module 1: Introduction to the GC_1000 Framework",
        "topics": [
          {
            "title": "Topic 1.1: Centering-Based Group Care & The First 1,000 Days",
            "content": "Developed by nurse-midwife Sharon Rising in 1992–93, Centering-Based Group Care replaces brief, isolated individual prenatal visits with 90–120 minute interactive sessions for stable cohorts of 8–12 women across the critical First 1,000 Days (from conception through age 2)."
          }
        ],
        "quiz": [
          {
            "question": "What is the critical developmental timeline targeted by the \"First 1,000 Days\" framework?",
            "options": [
              "From school entry (age 5) to the end of elementary school.",
              "From conception through the first two years of the child's life.",
              "The first three years of preschool education.",
              "From birth to the first 100 days of infancy."
            ],
            "correctIndex": 1,
            "explanation": "The First 1,000 Days spans from conception through the child's second birthday—the most critical window for maternal and neonatal outcomes."
          }
        ]
      },
      {
        "title": "Module 2: Core Components of Group Care",
        "topics": [
          {
            "title": "Topic 2.1: Health Care Assessment, Interactive Learning & Community Building",
            "content": "Group Care integrates three non-negotiable components:\n1. Health Care Assessment: Participants measure their own blood pressure and weight at Self-Care Stations, followed by a brief (3–5 minute) physical check by the midwife in a semi-private clinical corner of the group room.\n2. Interactive Learning: Facilitated, non-didactic discussions in an open circle of chairs with no central tables.\n3. Community Building: Persistent peer cohorts of 8–12 participants who bond and support one another."
          }
        ],
        "quiz": [
          {
            "question": "How are individual clinical health assessments managed during a Group Care session?",
            "options": [
              "They are omitted entirely to focus strictly on open group discussions.",
              "They take place in a completely separate clinical building far away from the group room.",
              "They are kept brief (3-5 minutes) and are conducted in a semi-private clinical corner of the group room.",
              "They are conducted out in the open in front of the entire group circle."
            ],
            "correctIndex": 2,
            "explanation": "Clinical assessments are kept brief (3–5 minutes) and take place in a semi-private corner of the group space (or directly adjoining room) to preserve privacy and cohort flow."
          }
        ]
      },
      {
        "title": "Module 3: Evidence-Based Benefits of Group Care",
        "topics": [
          {
            "title": "Topic 3.1: Maternal, Neonatal & Provider Outcomes",
            "content": "Randomized studies demonstrate that Group Care significantly reduces preterm births (<37 weeks), lowers NICU admissions, reduces Caesarean rates, decreases maternal isolation, and reduces midwife burnout by replacing repetitive assembly-line visits with meaningful facilitation."
          }
        ],
        "quiz": [
          {
            "question": "Which clinical outcome has been repeatedly documented as a key benefit of Group Care?",
            "options": [
              "A massive increase in surgical Caesarean section deliveries.",
              "A significant reduction in preterm births and lower rates of newborn NICU admissions.",
              "Complete elimination of all childhood illnesses.",
              "Excessive gestational weight gain."
            ],
            "correctIndex": 1,
            "explanation": "Group Care is clinically proven to reduce preterm births and neonatal intensive care admissions, especially among vulnerable populations."
          }
        ]
      },
      {
        "title": "Module 4: Assessing Contextual Site Readiness",
        "topics": [
          {
            "title": "Topic 4.1: Outer/Inner Contexts, Site Readiness Assessment (SRA) & Gestational Cohorts",
            "content": "Using the Site Readiness Assessment (SRA), facilities verify administrative support, clinical champions, patient volume (>=30 registrants/month to form gestational cohorts within a 2–4 week due-date window), and a private room (approx. 20ft x 20ft) for a circle of 12–20 chairs."
          }
        ],
        "quiz": [
          {
            "question": "How is a standard \"Gestational Cohort\" formed in Group Care?",
            "options": [
              "By grouping patients randomly regardless of their due dates.",
              "By grouping 8-12 pregnant women whose estimated due dates fall within the same 2-to-4-week window.",
              "By grouping patients based strictly on maternal weight.",
              "By grouping parents based on household income."
            ],
            "correctIndex": 1,
            "explanation": "Grouping 8–12 women with due dates in the same 2–4 week window ensures gestational topics are relevant to everyone in the circle."
          }
        ]
      },
      {
        "title": "Module 5: Governing and Engaging Participants",
        "topics": [
          {
            "title": "Topic 5.1: Multidisciplinary Steering Committees & Engaging Vulnerable Populations",
            "content": "A multidisciplinary Steering Committee (clinical champion, clinic manager, registration lead, pediatric link, and community advocate) oversees start-up equipment (scales, automatic BP cuffs, chairs) and adapts visual pictorial materials for varying literacy levels."
          }
        ],
        "quiz": [
          {
            "question": "How should the Steering Committee accommodate varying literacy levels among group participants?",
            "options": [
              "By requiring a reading comprehension test before joining.",
              "By utilizing highly visual materials, pictorial cards, and interactive hands-on activities.",
              "By reading PowerPoint slide decks aloud for 90 minutes.",
              "By excluding non-literate participants from cohorts."
            ],
            "correctIndex": 1,
            "explanation": "Visual aids, pictorial cards, and hands-on activities make interactive learning inclusive regardless of literacy level."
          }
        ]
      },
      {
        "title": "Module 6: Managing Anticipated Challenges & FRAME Adaptations",
        "topics": [
          {
            "title": "Topic 6.1: Surface vs. Deep Structure Challenges & The FRAME Model",
            "content": "Surface structure challenges involve logistics (snacks, translated posters), whereas deep structure challenges involve systemic workflows (scheduling 120-minute blocks in national registers). The scientific FRAME model documents adaptations while preserving core model fidelity."
          }
        ],
        "quiz": [
          {
            "question": "What is the primary purpose of utilizing the scientific \"FRAME\" model in Group Care?",
            "options": [
              "To prohibit any clinic from making local adaptations.",
              "To systematically document, report, and track adaptations while ensuring core model fidelity is preserved.",
              "To calculate hospital pharmaceutical waste.",
              "To grade midwives on clinical exam speed."
            ],
            "correctIndex": 1,
            "explanation": "FRAME tracks when, why, and how adaptations occur so local modifications never compromise the three core components."
          }
        ]
      },
      {
        "title": "Module 7: Training & Capacity Building of Facilitators",
        "topics": [
          {
            "title": "Topic 7.1: Experiential Facilitation Training & The Co-Facilitation Model",
            "content": "Every Group Care session pairs a qualified clinician (midwife/doctor) with a co-facilitator (community health worker/nurse). While the clinician performs brief 3–5 minute physical checks in the private corner, the co-facilitator keeps the circle's interactive activities flowing."
          }
        ],
        "quiz": [
          {
            "question": "What is a primary clinical advantage of utilizing the co-facilitation model?",
            "options": [
              "It allows the clinic to double patient fees.",
              "It ensures group stability; while the clinician conducts brief private exams, the co-facilitator keeps the circle discussion flowing.",
              "It allows the clinician to leave the room for half the session.",
              "It eliminates the need for Facilitator Guides."
            ],
            "correctIndex": 1,
            "explanation": "Co-facilitation maintains continuous circle engagement during the first 15–30 minutes while private clinical checks are completed."
          }
        ]
      },
      {
        "title": "Module 8: Conducting Group Sessions",
        "topics": [
          {
            "title": "Topic 8.1: Open Circle Setup, Session Flow & Managing Group Dynamics",
            "content": "Chairs are arranged in an open circle with no central tables. Facilitators sit as equals in the circle, gently redirecting dominant speakers back to the wider group and inviting quieter participants with warm, open-ended questions."
          }
        ],
        "quiz": [
          {
            "question": "Why is it a strict model requirement to have \"no central tables\" inside the chair circle?",
            "options": [
              "To save clinic budget on furniture.",
              "To eliminate physical barriers, encourage open interaction, and build equality among everyone in the room.",
              "To allow midwives to stand in the middle and lecture.",
              "To perform physical exams in the center of the circle."
            ],
            "correctIndex": 1,
            "explanation": "An open circle without central tables removes barriers and fosters eye contact, equality, and peer dialogue."
          }
        ]
      },
      {
        "title": "Module 9: Scaling-Up Group Care Services (WHO ExpandNet)",
        "topics": [
          {
            "title": "Topic 9.1: Vertical Institutionalization vs. Horizontal Replication",
            "content": "Using the WHO ExpandNet model, Vertical Scaling-Up institutionalizes Group Care into national health policies, budgets, and insurance codes, while Horizontal Scaling-Up replicates the model across new geographic clinics and populations."
          }
        ],
        "quiz": [
          {
            "question": "What does \"Vertical Scaling-Up\" (Institutionalisation) mean in public health planning?",
            "options": [
              "Building taller hospital buildings.",
              "Securing political, budgetary, regulatory, and policy changes to embed Group Care permanently into national health systems.",
              "Expanding services to neighboring countries only.",
              "Purchasing identical scales for one clinic."
            ],
            "correctIndex": 1,
            "explanation": "Vertical scale-up institutionalizes the innovation within national health policies, guidelines, and public budgets."
          }
        ]
      },
      {
        "title": "Module 10: Sustainment and the Community of Practice",
        "topics": [
          {
            "title": "Topic 10.1: Active Sustainment, Sustainability Worksheets & Global CoP",
            "content": "Sustainment is the ongoing day-to-day enactment of Group Care routines with fidelity, whereas Sustainability is the long-term continuation of maternal/neonatal benefits after pilot funding ends. Clinics join the global Group Care Community of Practice (GC CoP) for continuous peer learning."
          }
        ],
        "quiz": [
          {
            "question": "How is \"Sustainment\" defined in the GC_1000 framework?",
            "options": [
              "The termination of a pilot program when grant funding ends.",
              "The ongoing, day-to-day implementation and active use of Group Care routines and processes in the clinic.",
              "The total dollar value of initial donor grants.",
              "Reverting patient care back to individual appointments."
            ],
            "correctIndex": 1,
            "explanation": "Sustainment refers to the active, daily continuation of Group Care workflows and fidelity inside the facility."
          }
        ]
      }
    ]
  },
  {
    "id": "course-emotive-pph",
    "title": "National EMOTIVE & Helping Mothers Survive (BABC 3.0) PPH Refresher",
    "category": "Emergency Care",
    "cpd": 15,
    "duration": 24,
    "pricingModel": "freemium",
    "freePreviewModules": 1,
    "price": 49,
    "requiresLab": true,
    "status": "Published",
    "activityCode": "UMDPC/CPD/2026/0892",
    "creatorId": "system-seed",
    "image": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80",
    "description": "Accredited simulation-first mastery curriculum based on the National EMOTIVE ToT Refresher and WHO BABC 3.0 guidelines. Features the EMOTIVE clinical bundle sequencer, Voice SBAR handover grader, WebAR pocket manikin, and digital OSCE stations.",
    "modules": [
      {
        "title": "Module 1: Early PPH Detection & Calibrated Blood Collection Drapes (Free Preview)",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 1.1: Quantitative vs. Visual Blood Loss Estimation",
            "content": "Postpartum hemorrhage (PPH) remains the leading cause of maternal mortality across Sub-Saharan Africa. The National EMOTIVE ToT Refresher data revealed that visual estimation underestimates actual blood loss by 30% to 50%, delaying life-saving bundle activation until catastrophic hypovolemic shock occurs.\n\nVisual estimation relies on subjective impressions of soaked gauze, floor puddles, and bed linen, which are notoriously inaccurate. The EMOTIVE protocol mandates objective quantitative measurement using a calibrated conical collection drape immediately following birth.\n\nLMS Deep-Dive & Practical Application Guide:\n• Gold-Standard Protocol: Place a calibrated V-shaped blood collection drape under the mother immediately after delivery of the baby. Read the fluid meniscus at eye level. Activate the EMOTIVE bundle immediately upon reaching 500 mL or earlier if vital sign instability is detected.\n• HC III / Resource-Adapted Protocol: If standard pre-packaged calibrated drapes are out of stock, construct an emergency calibrated drape using a clean plastic sheet tied into a funnel feeding into a measured 500 mL plastic receiver, or monitor gravimetric gauze weight (1 gram = 1 mL blood). Never rely on visual guesswork.",
            "resources": [
              {
                "title": "EMOTIVE Calibrated Drape Standard Operating Procedure (PDF)",
                "type": "pdf",
                "url": "https://who.int"
              }
            ]
          },
          {
            "title": "Topic 1.2: Drape Placement and Meniscus Calibration",
            "content": "Correct timing and positioning of the calibrated drape are critical to avoid false positives from amniotic fluid contamination. The drape must be placed under the mother's buttocks only after the delivery of the infant and following rapid perineal suctioning or drying.\n\nKey Operational Rules:\n1. Timing: Position the drape after infant birth, prior to placental expulsion.\n2. Amniotic Exclusion: Ensure initial amniotic fluid has drained before sliding the calibrated pouch into place.\n3. Continuous Monitoring: Appoint a dedicated team member to call out volume marks (300 mL, 500 mL, 750 mL, 1000 mL).\n\nLMS Deep-Dive & Practical Application Guide:\nIn low-resource labor suites, keep folded calibrated drapes in an easily reachable \"PPH First-Response Tray\" next to the delivery bed. Clinicians should train during weekly LDHF drills to unfurl and slide the drape in under 15 seconds without compromising aseptic technique.",
            "resources": []
          },
          {
            "title": "Topic 1.3: The Shock Index Trigger & Early Warning Vitals",
            "content": "In young, previously healthy women, compensatory adrenergic mechanisms maintain normal systolic blood pressure even after losing 20% to 30% of blood volume. Relying on hypotension (SBP < 90 mmHg) is a late and often fatal indicator of PPH.\n\nThe Shock Index (SI) is calculated as: Heart Rate / Systolic Blood Pressure.\n• Normal SI: 0.5 to 0.7\n• Critical Threshold SI >= 0.9: Indicates occult hypovolemia, high risk of blood transfusion, and warrants immediate resuscitation.\n• Critical Threshold SI >= 1.4: Severe decompensated shock requiring immediate escalation to tertiary surgical care.\n\nLMS Deep-Dive & Practical Application Guide:\nEvery vital sign check during the third and fourth stages of labor must calculate the Shock Index. A mother with HR 115 bpm and BP 100/65 mmHg has an SI of 1.15—she is in compensated shock despite a seemingly reassuring SBP. Immediate bundle triggers apply regardless of visual blood loss.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "Why does the EMOTIVE protocol replace visual estimation of blood loss with calibrated collection drapes?",
            "options": [
              "Visual estimation consistently overestimates blood loss, leading to excessive oxytocin use.",
              "Visual estimation underestimates blood loss by 30-50%, delaying critical intervention until decompensated shock develops.",
              "Calibrated drapes are strictly required by hospital insurance policies.",
              "Calibrated drapes eliminate the need for uterine massage."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. Visual estimation almost universally underestimates, not overestimates, blood volume.",
              "Correct! Empirical trials prove visual estimation fails to detect hemorrhage in 30-50% of cases, delaying life-saving bundle activation.",
              "Incorrect. Calibrated drapes are an evidence-based clinical safety standard, not an insurance formality.",
              "Incorrect. Uterine massage remains an essential component of the EMOTIVE bundle regardless of drape use."
            ],
            "explanation": "Calibrated drapes provide objective, early detection of blood loss >= 500 mL, preventing lethal delays in bundle initiation."
          },
          {
            "question": "A mother 15 minutes postpartum has a heart rate of 120 bpm and BP of 95/60 mmHg. What is her Shock Index and clinical status?",
            "options": [
              "Shock Index 0.79; reassuring normal postpartum physiological adaptation.",
              "Shock Index 1.26; significant occult shock requiring immediate resuscitation and EMOTIVE bundle activation.",
              "Shock Index 0.50; bradycardic response to placental separation.",
              "Shock Index 2.0; irreversible circulatory collapse where medication is futile."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. 120 / 95 = 1.26, which is well above the 0.9 alert threshold.",
              "Correct! HR 120 / SBP 95 = 1.26. An SI >= 0.9 demonstrates compensated hypovolemic shock requiring rapid bundle deployment.",
              "Incorrect. The heart rate is tachycardic at 120 bpm, not bradycardic.",
              "Incorrect. 1.26 indicates serious shock, but prompt bundle execution can reverse it completely."
            ],
            "explanation": "Shock Index (HR/SBP) >= 0.9 detects hemodynamic compromise long before classic hypotension manifests."
          }
        ]
      },
      {
        "title": "Module 2: Active Management of the Third Stage of Labour (AMTSL) & Physiological Cord Clamping",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 2.1: The Three Pillars of AMTSL",
            "content": "AMTSL is the primary prevention cornerstone of obstetric practice, reducing PPH incidence by more than 60%. High-fidelity adherence to all three components is required for every vaginal delivery:\n1. Administration of a prophylactic uterotonic drug within 1 minute of birth.\n2. Delayed umbilical cord clamping (1-3 minutes after birth) while initiating simultaneous neonatal care.\n3. Controlled cord traction (CCT) with counter-traction to deliver the placenta only after signs of separation, followed by immediate uterine palpation and massage.\n\nLMS Deep-Dive & Practical Application Guide:\n• Gold-Standard: Administer Oxytocin 10 IU IM immediately after ruling out additional babies. In facilities with cold-chain integrity, oxytocin is stored at 2-8°C. If an IV infusion is already in place, 10 IU slow IV bolus over 1-2 minutes is acceptable.\n• HC III / Rural Adaptations: Where electricity and cold-chain refrigerators are unreliable, Heat-Stable Carbetocin (100 mcg IM) or Misoprostol (400-600 mcg sublingually/orally) serves as the approved alternative uterotonic under WHO/MoH guidelines.",
            "resources": []
          },
          {
            "title": "Topic 2.2: Controlled Cord Traction vs. Uterine Inversion Hazards",
            "content": "Controlled Cord Traction must only be performed by a skilled attendant when the uterus is well-contracted. Traction must never be applied to a flaccid uterus or without adequate counter-traction above the pubic bone (Brandt-Andrews maneuver).\n\nCounter-traction prevents uterine inversion—a rare but catastrophic emergency characterized by neurogenic shock, intense pain, and massive hemorrhage. If resistance is met, traction must stop immediately and the attendant must reassess for true placental separation.\n\nSigns of Placental Separation:\n• Sudden gush of dark blood from the introitus.\n• Lengthening of the umbilical cord without recoil on suprapubic pressure.\n• Uterus becomes firm, globular, and rises toward the umbilicus.",
            "resources": []
          },
          {
            "title": "Topic 2.3: Delayed Cord Clamping & Neonatal Transition",
            "content": "Delayed cord clamping (DCC) provides approximately 80-100 mL of additional placental blood transfusion to the newborn, increasing iron stores by 40-50 mg/kg and preventing infantile anemia throughout the first 6 months of life.\n\nDCC does not increase the risk of maternal postpartum hemorrhage when paired with prophylactic oxytocin. The attendant clamps and cuts the cord between 1 and 3 minutes postpartum while performing routine newborn drying, warmth, and skin-to-skin contact on the mother's abdomen.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "What is the recommended first-line uterotonic and timing for AMTSL in a facility with reliable cold chain?",
            "options": [
              "Ergometrine 0.5 mg IV before fetal head crowning.",
              "Oxytocin 10 IU IM within 1 minute after fetal delivery (after ruling out additional twins).",
              "Misoprostol 800 mcg rectally before placental separation.",
              "Oxytocin 40 IU rapid IV push immediately as the shoulders deliver."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. Ergometrine carries severe hypertensive risks and is not the first-line prophylactic uterotonic.",
              "Correct! WHO and MoH guidelines establish Oxytocin 10 IU IM within 1 minute of birth as the gold standard.",
              "Incorrect. Rectal misoprostol is reserved for resource-limited treatment, not standard first-line prophylaxis.",
              "Incorrect. Rapid IV push of high-dose oxytocin can cause severe hypotension, coronary ischemia, and cardiac arrest."
            ],
            "explanation": "Oxytocin 10 IU IM within 1 minute of birth is the safest and most effective prophylactic agent against atonic PPH."
          }
        ]
      },
      {
        "title": "Module 3: The First-Response EMOTIVE Bundle Architecture & Activation Triggers",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 3.1: The EMOTIVE Acronym & Bundled Philosophy",
            "content": "The National EMOTIVE trial proved that delivering postpartum hemorrhage interventions as a synchronized \"bundle\"—rather than sequentially with long diagnostic delays—decreases severe hemorrhage and death by over 60%.\n\nThe EMOTIVE components:\n• E: Early detection using calibrated drape and vital sign Shock Index.\n• M: Massage of the uterus continuously until contracted.\n• O: Oxytocic drugs (therapeutic repeat dosing).\n• T: Tranexamic Acid (TXA) given within 3 hours.\n• I: IV fluids for hemodynamic stabilization.\n• V: Visual examination of the genital tract, cervix, and placenta.\n• E: Escalation to advanced mechanical or surgical interventions.\n\nAll bundle elements (M, O, T, I, V) should be initiated within 15 minutes of detecting >= 500 mL blood loss.",
            "resources": []
          },
          {
            "title": "Topic 3.2: Parallel Team Execution Under Emergency Conditions",
            "content": "In an obstetric emergency, single-operator sequential care fails. The EMOTIVE protocol assigns specific roles to the healthcare team members in the delivery room:\n• Team Leader (Midwife / Doctor): Performs bimanual examination and genital tract inspection; commands bundle timing.\n• Resuscitation Midwife / Nurse: Sets up wide-bore IV access (16G or 18G), starts crystalloids, draws blood for cross-match and hemoglobin.\n• Medication Administer: Administers therapeutic oxytocics and begins Tranexamic Acid infusion over 10 minutes.\n• SBAR Communicator: Records times on the clinical tracker, calls for senior assistance, alerts the lab or blood bank.",
            "resources": []
          },
          {
            "title": "Topic 3.3: First-Response Trolley Configuration",
            "content": "Every labor room must maintain an accessible, sealed \"EMOTIVE Emergency Tackle Box\" or tray. The box contains:\n• 2 ampoules of Oxytocin (10 IU each)\n• 1 ampoule of Tranexamic Acid (1 g in 10 mL)\n• 2 wide-bore IV cannulas (16G and 18G) + rapid infusion IV giving sets\n• 1 liter Ringer's Lactate / Normal Saline\n• Sterile gloves, speculum, sponge-holding forceps, and urinary Foley catheter with bag\n• Calibrated collection drape replacement and Condom UBT kit.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "What distinguishes the EMOTIVE bundle approach from traditional sequential PPH management?",
            "options": [
              "Bundle components (massage, oxytocics, TXA, IV fluids, examination) are delivered simultaneously in parallel within 15 minutes.",
              "Each drug is administered and observed for 30 minutes before initiating the next step.",
              "It skips physical examination to prioritize surgical theater transfer.",
              "It replaces all uterotonic medications with tranexamic acid."
            ],
            "correctIndex": 0,
            "optionFeedback": [
              "Correct! Synchronized, parallel delivery of the entire bundle prevents the progressive coagulopathy that kills mothers during sequential delays.",
              "Incorrect. Sequential waiting of 30 minutes between drugs is the classic management mistake that leads to maternal death.",
              "Incorrect. Genital tract examination (V) is a mandatory core element of the EMOTIVE bundle.",
              "Incorrect. TXA works synergistically with uterotonics; it never replaces them."
            ],
            "explanation": "Synchronized bundle implementation attacks uterine atony, coagulopathy, and hypovolemia simultaneously."
          }
        ]
      },
      {
        "title": "Module 4: Immediate Uterine Massage & Bimanual Compression Maneuvers",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 4.1: Transabdominal Uterine Massage Technique",
            "content": "Uterine atony accounts for 70% to 80% of all PPH cases. Transabdominal massage is the immediate physical reflex upon diagnosing excessive bleeding.\n\nTechnique:\n1. Place the cupped hand on the fundus of the uterus through the anterior abdominal wall.\n2. Perform firm circular and repetitive kneading motions until the myometrium contracts into a rock-hard globular mass.\n3. Express accumulated intra-uterine clots: once contracted, apply firm downward and backward pressure on the fundus to expel trapped hematoma that prevents complete myometrial constriction of the spiral arterioles.",
            "resources": []
          },
          {
            "title": "Topic 4.2: Internal Bimanual Uterine Compression",
            "content": "When transabdominal massage fails to maintain sustained myometrial tone, proceed immediately to Internal Bimanual Uterine Compression.\n\nProcedure:\n1. Don sterile elbow-length gloves.\n2. Form a tight fist with the gloved dominant hand and insert it through the vagina into the anterior fornix, resting against the anterior uterine wall.\n3. Place the other hand across the mother's abdomen over the posterior wall of the uterine fundus.\n4. Compress the uterus firmly between the internal fist and external hand, pressing the anterior and posterior walls together against each other.\n5. Maintain continuous, unwavering compression for at least 5 to 10 minutes until bleeding halts and firm uterine tone is sustained.",
            "resources": []
          },
          {
            "title": "Topic 4.3: External Aortic Compression as a Hemostatic Bridge",
            "content": "External Aortic Compression is an emergency life-saving maneuver that can be performed instantly without equipment while transferring a patient or awaiting whole blood.\n\nTechnique:\n• Place a closed fist slightly above and to the left of the umbilicus.\n• Apply downward pressure against the lumbar spine until the femoral pulse in either groin becomes impalpable.\n• This occludes distal aortic flow, immediately halting uterine hemorrhage and diverting blood flow to the brain and heart during profound shock.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "How is internal bimanual uterine compression correctly performed?",
            "options": [
              "Two operators compress the abdomen simultaneously using transabdominal pressure only.",
              "One gloved fist is inserted into the vagina/anterior fornix while the other hand compresses the posterior uterine wall abdominally.",
              "A uterine clamp is placed transvaginally without abdominal stabilization.",
              "The attendant pushes the uterus upward toward the diaphragm with open fingers."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. Bimanual compression requires one internal hand and one external abdominal hand.",
              "Correct! The uterus is compressed between the internal fist in the anterior fornix and the external hand on the posterior fundus.",
              "Incorrect. Clamps should never be blindly inserted into the uterine cavity.",
              "Incorrect. Pushing upward does not compress the bleeding placental bed."
            ],
            "explanation": "Bimanual compression sandwiches the uterine vascular bed between an internal fist and external abdominal hand."
          }
        ]
      },
      {
        "title": "Module 5: Uterotonic Administration Protocols (Oxytocin, Ergometrine, Misoprostol)",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 5.1: Therapeutic Oxytocin Infusion Regimens",
            "content": "Upon activating the EMOTIVE bundle for confirmed PPH, administer therapeutic oxytocin in addition to the initial AMTSL prophylactic dose.\n\nRecommended Regimen:\n• 20 to 40 IU of Oxytocin in 1000 mL of normal saline or Ringer's Lactate infused at 60 drops/min (approximately 250 mL/hour).\n• Maintain therapeutic infusion for 4 to 8 hours until steady myometrial contraction is guaranteed.\n• Caution: Never administer high-dose oxytocin as an un-diluted rapid IV bolus due to the risk of severe hypotension and myocardial ischemia.",
            "resources": []
          },
          {
            "title": "Topic 5.2: Second-Line Uterotonics: Ergometrine and Prostaglandins",
            "content": "If uterine atony persists after oxytocin infusion, second-line uterotonics must be administered rapidly:\n1. Ergometrine / Methylergometrine (0.2 mg IM):\n   • Induces sustained, tetanic uterine contraction within 2-5 minutes.\n   • STRICT CONTRAINDICATION: Pre-eclampsia, eclampsia, chronic hypertension, and heart disease due to the danger of lethal hypertensive encephalopathy or intracranial hemorrhage.\n2. Misoprostol (800 mcg sublingually):\n   • Heat-stable prostaglandin E1 analogue. Rapid sublingual absorption produces peak plasma concentrations in 20-30 minutes. Expected side effects include transient pyrexia and shivering.",
            "resources": []
          },
          {
            "title": "Topic 5.3: Cold-Chain Integrity and Drug Potency in District Facilities",
            "content": "Field testing across district hospitals in tropical climates has demonstrated that oxytocin stored at ambient temperatures (> 30°C) loses up to 50% of active potency within 30 days. Midwives must inspect the temperature log of the ward refrigerator daily. In settings without reliable electrical power, prioritize heat-stable uterotonics (Misoprostol or Heat-Stable Carbetocin) or replace room-temperature oxytocin stocks every 14 days.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "A mother with severe PPH has a blood pressure of 165/105 mmHg. Which uterotonic is strictly contraindicated?",
            "options": [
              "Oxytocin infusion",
              "Tranexamic acid",
              "Ergometrine (Methergine)",
              "Sublingual Misoprostol"
            ],
            "correctIndex": 2,
            "optionFeedback": [
              "Incorrect. Oxytocin is safe and remains indicated in hypertensive mothers.",
              "Incorrect. TXA is an antifibrinolytic and is indicated in all causes of PPH regardless of BP.",
              "Correct! Ergometrine causes potent generalized vasoconstriction and can trigger hypertensive crisis, stroke, or eclampsia.",
              "Incorrect. Misoprostol does not cause severe arterial vasoconstriction and is safe in hypertension."
            ],
            "explanation": "Ergometrine is strictly contraindicated in hypertensive disorders of pregnancy due to life-threatening vasoconstrictive risks."
          }
        ]
      },
      {
        "title": "Module 6: Tranexamic Acid (TXA) Timing, Dosing, and Safety Windows",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 6.1: The Critical 3-Hour Golden Window (The WOMAN Trial)",
            "content": "The landmark WOMAN trial (World Maternal Antifibrinolytic Trial, 20,000+ women) established that Tranexamic Acid (TXA) reduces death due to bleeding by more than 30% when administered within 3 hours of birth.\n\nCrucial Rule of Timing:\n• Every 15-minute delay in giving TXA reduces its survival benefit by 10%.\n• After 3 hours from birth, TXA provides NO survival benefit and may actually increase thrombotic and microvascular injury complications.\n• Therefore, TXA must be administered immediately upon PPH diagnosis as part of the initial EMOTIVE bundle, not as a desperate last resort.",
            "resources": []
          },
          {
            "title": "Topic 6.2: Administration Dosage, Infusion Rate, and Repeat Protocol",
            "content": "Standard TXA Protocol for Postpartum Hemorrhage:\n• Dose: 1 gram (1000 mg) intravenously.\n• Dilution: Administer in 10 mL neat or mixed with 100 mL of 0.9% Normal Saline.\n• Infusion Rate: Slow IV push over 10 minutes (1 mL/minute). Rapid IV push can cause transient nausea, dizziness, and mild hypotension.\n• Repeat Dose: If bleeding continues after 30 minutes, or if bleeding restarts within 24 hours of the first dose, a second 1 gram IV dose should be given over 10 minutes. Do not exceed 2 grams total.",
            "resources": []
          },
          {
            "title": "Topic 6.3: Mechanism of Action & Thromboembolic Safety Profile",
            "content": "TXA is a synthetic lysine analogue that competitively blocks the lysine binding sites on plasminogen molecules, preventing its conversion to plasmin. This stops the enzymatic breakdown of the fibrin meshwork in the placental bed clots.\n\nThe WOMAN trial conclusively proved that 1-2 grams of IV TXA in acute PPH does NOT increase the incidence of deep vein thrombosis (DVT), pulmonary embolism (PE), or acute stroke.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "According to WHO guidelines and the WOMAN trial, what is the maximum window of efficacy for Tranexamic Acid in PPH?",
            "options": [
              "Within 3 hours of childbirth.",
              "Within 24 hours of hospital admission.",
              "Only after all uterotonic drugs have failed for at least 4 hours.",
              "Within 12 hours provided whole blood is also transfused."
            ],
            "correctIndex": 0,
            "optionFeedback": [
              "Correct! The survival benefit of TXA diminishes rapidly and is only demonstrated when administered within 3 hours of delivery.",
              "Incorrect. Beyond 3 hours, TXA lacks evidence of efficacy and may cause harm.",
              "Incorrect. Waiting 4 hours for other drugs to fail will miss the 3-hour window entirely.",
              "Incorrect. 12 hours is well past the proven therapeutic window."
            ],
            "explanation": "TXA must be given within 3 hours of birth; every 15 minutes of delay significantly decreases maternal survival."
          }
        ]
      },
      {
        "title": "Module 7: IV Crystalloid Resuscitation & Shock Index Monitoring",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 7.1: Fluid Resuscitation Principles & Preventing Dilutional Coagulopathy",
            "content": "Aggressive fluid resuscitation is necessary to restore circulating intravascular volume, but overzealous cold crystalloid infusion can cause dilutional coagulopathy, hypothermia, and pulmonary edema.\n\nRecommended Fluid Strategy:\n• Establish 2 wide-bore IV lines (16G or 18G cannula).\n• Infuse warm crystalloids (Ringer's Lactate or 0.9% Normal Saline): give up to 1000 mL rapidly over 15-20 minutes.\n• Reassess vitals, radial pulse, and blood loss after every 500-1000 mL.\n• Avoid giving more than 2000-3000 mL of crystalloids without initiating whole blood or packed red blood cell transfusion.",
            "resources": []
          },
          {
            "title": "Topic 7.2: Bedside Shock Index Re-evaluation",
            "content": "Tracking response to volume resuscitation using the Shock Index (HR / SBP):\n• Responsive: HR decreases to < 100 bpm, SBP rises to > 100 mmHg, SI drops < 0.9. Capillary refill returns to < 2 seconds, urine output >= 30 mL/hr.\n• Transient / Non-Responsive: SI remains >= 1.0 despite 1500 mL of crystalloids. This indicates ongoing, brisk internal bleeding requiring immediate blood transfusion, mechanical tamponade, and surgical theater escalation.",
            "resources": []
          },
          {
            "title": "Topic 7.3: Foley Catheter Insertion & Fluid Balance Monitoring",
            "content": "Place a Foley urinary catheter attached to a drainage bag immediately during fluid resuscitation. This serves two vital purposes:\n1. Decompresses the bladder: A distended urinary bladder mechanically displaces the uterus upward and laterally, directly preventing effective myometrial contraction.\n2. Monitors end-organ renal perfusion: Maintaining urine output >= 30 mL/hour confirms adequate cardiac output and microvascular flow during shock recovery.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "Why is urinary bladder catheterization an essential early step during PPH resuscitation?",
            "options": [
              "To collect sterile urine for drug toxicology testing.",
              "A full bladder mechanically prevents uterine contraction and monitoring urine output assesses vital organ perfusion.",
              "To administer intravesical oxytocic drugs.",
              "To replace the need for intravenous fluid therapy."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. Bladder catheterization is done for physical decompression and hemodynamics, not drug screening.",
              "Correct! A distended bladder mechanically impedes fundal contraction, while urine output provides real-time proof of kidney perfusion.",
              "Incorrect. Uterotonics are never administered into the bladder.",
              "Incorrect. Catheterization is an adjunct to, not a replacement for, IV fluid therapy."
            ],
            "explanation": "Emptying the bladder removes a major mechanical obstruction to uterine retraction and provides continuous monitoring of renal perfusion."
          }
        ]
      },
      {
        "title": "Module 8: Systematic Genital Tract Examination & Tissue Extraction (The 4 Ts)",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 8.1: The 4 Ts Etiological Framework",
            "content": "If bleeding continues despite a well-contracted fundus, the provider must methodically investigate the 4 Ts of PPH etiology:\n• Tone (70-80%): Uterine atony.\n• Trauma (15-20%): Cervical lacerations, vaginal vault tears, ruptured episiotomy, or pelvic hematoma.\n• Tissue (5-10%): Retained cotyledons, succenturiate placental lobes, or adherent tissue (placenta accreta spectrum).\n• Thrombin (< 1%): Inherited or acquired coagulopathy (DIC secondary to abruption, amniotic fluid embolism, or severe sepsis).",
            "resources": []
          },
          {
            "title": "Topic 8.2: Visual Speculum Examination of Cervix and Vagina",
            "content": "Perform a systematic visual inspection under good operating light using a right-angle or Sims speculum with two sponge-holding forceps:\n1. Grasp the anterior cervical lip at 12 o'clock, then walk the sponge forceps clockwise (at 2, 4, 6, 8, 10 o'clock) around the rim of the cervix to inspect for lacerations.\n2. Inspect the lateral vaginal sulci for deep arterial tears extending toward the fornices.\n3. Examine the perineum for high rectovaginal tears.\n4. Repair tears promptly using continuous or figure-of-eight absorbable sutures (2-0 Vicryl/Chromic) under adequate regional or local anesthesia.",
            "resources": []
          },
          {
            "title": "Topic 8.3: Manual Placental Examination and Gentle Cavity Sweep",
            "content": "Always inspect the delivered placenta: check the maternal surface to ensure all cotyledons fit together without gaps, and inspect the fetal membranes for torn vessels extending into the periphery (suggesting a retained succenturiate lobe).\n\nIf cotyledons are missing and bleeding persists, perform gentle manual extraction under aseptic technique and analgesia, or use a large blunt gauze sweep to remove trapped membrane fragments.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "A mother continues to bleed briskly with bright red blood despite a rock-hard, firmly contracted uterine fundus. What is the most likely etiology?",
            "options": [
              "Uterine atony (Tone failure)",
              "Trauma (Cervical or vaginal laceration)",
              "Dilutional hypothermia",
              "Sepsis-induced uterine inertia"
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. If the fundus is rock-hard, atony has been resolved; bleeding must originate elsewhere.",
              "Correct! Brisk bright-red bleeding from a well-contracted uterus strongly indicates lower genital tract trauma (cervical or vaginal tear).",
              "Incorrect. Hypothermia causes oozing from multiple puncture sites, not localized bright arterial bleeding.",
              "Incorrect. Uterine inertia produces a soft, boggy fundus, which is not present here."
            ],
            "explanation": "When the uterus is firmly contracted, persistent brisk bleeding is almost always due to genital tract lacerations requiring speculum visualization."
          }
        ]
      },
      {
        "title": "Module 9: Non-Pneumatic Anti-Shock Garment (NASG) & Uterine Balloon Tamponade (UBT) Escalation",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 9.1: Low-Cost Condom-Catheter Uterine Balloon Tamponade (UBT)",
            "content": "When atonic PPH fails to resolve with medical management and bimanual compression, UBT provides hydrostatic tamponade against the bleeding spiral arteries of the placental bed.\n\nAssembly of an Emergency Condom-Catheter UBT:\n1. Tie a clean condom over the tip of a size 16-18 French Foley catheter using sterile 0-silk or braided suture, ensuring the eyelets are covered and the knot is leak-proof.\n2. Guide the assembly through the cervix into the uterine cavity until the condom rests in the fundus.\n3. Connect the catheter lumen to an IV giving set attached to a 500 mL bag of sterile normal saline.\n4. Inflate the balloon with 300 to 500 mL of warm sterile saline until resistance is felt and bleeding ceases.\n5. Gently pack the vagina with sterile gauze to prevent balloon extrusion. Leave in place for 12-24 hours while arranging definitive care or ambulance transfer.",
            "resources": []
          },
          {
            "title": "Topic 9.2: The Non-Pneumatic Anti-Shock Garment (NASG)",
            "content": "The NASG is a lightweight neoprene first-aid compression garment designed for low-resource settings. It applies circumferential counter-pressure to the legs, pelvis, and abdomen, reducing vascular volume in the lower body and shunting 200-300 mL of oxygenated blood directly to the heart, brain, and lungs.\n\nApplication Steps:\n• Place under the patient with segments 1, 2, 3 wrapped tightly around ankles, calves, and thighs.\n• Segment 4 is wrapped across the pelvis.\n• Segment 5 and 6 contain a foam ball positioned over the umbilicus to compress the lower abdominal aorta.\n• The NASG can remain in place for up to 48 hours during rural ambulance transfer. Remove only when hemodynamic stability is established, strictly releasing segments one at a time starting from the ankles with 15 minutes between segments.",
            "resources": []
          },
          {
            "title": "Topic 9.3: Referral Criteria and Surgical Escalation Protocols",
            "content": "At an HC III or rural clinic lacking an operating theatre and blood bank, activate the emergency transfer chain when:\n• Blood loss reaches >= 750 mL despite the EMOTIVE bundle.\n• Shock Index remains >= 1.0.\n• Tamponade balloon or NASG is applied.\n\nNever send an unstable patient in an ambulance without an accompanying clinician, two secure IV lines running fluids, and a pre-alerted SBAR call to the receiving District or Regional Referral Hospital.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "What is the correct inflation volume and fluid type for an emergency condom-catheter UBT?",
            "options": [
              "1000 mL of cold tap water infused under pneumatic pressure.",
              "300 to 500 mL of sterile normal saline or Ringer's lactate infused until resistance is felt.",
              "50 mL of air injected via a bulb syringe.",
              "200 mL of pure concentrated dextrose solution."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. Non-sterile cold water and excessive 1000 mL volume risk uterine rupture and infection.",
              "Correct! 300-500 mL of sterile saline provides physiological tamponade against the placental bed without causing tissue necrosis.",
              "Incorrect. Air must never be used to inflate a balloon tamponade due to the risk of lethal air embolism if the balloon bursts.",
              "Incorrect. Dextrose provides no advantage and promotes bacterial colonization."
            ],
            "explanation": "300-500 mL of sterile saline safely fills the uterine cavity, providing sufficient hydrostatic pressure to occlude open sinusoids."
          }
        ]
      },
      {
        "title": "Module 10: Multi-Professional Team SBAR Communication, Referral Logistics, and Debriefing",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 10.1: Structured Emergency SBAR Escalation",
            "content": "The National EMOTIVE ToT Refresher highlighted communication breakdowns as a primary contributor to maternal mortality. In rapid-onset hemorrhage, unstructured telephone calls lead to omitted details and delayed ambulance arrival.\n\nMandatory SBAR Format:\n• S (Situation): \"I am Midwife Sarah calling from Wakiso HC III. I have an acute refractory PPH in a 24-year-old mother who delivered 40 minutes ago.\"\n• B (Background): \"G2P2, uneventful delivery. AMTSL completed with 10 IU Oxytocin. Blood loss reached 850 mL on calibrated drape.\"\n• A (Assessment): \"EMOTIVE bundle completed: therapeutic oxytocin running, 1g TXA given, UBT inserted with 350 mL saline. Vitals: HR 122 bpm, BP 88/50 mmHg, Shock Index 1.38. Bleeding is slowed but persistent.\"\n• R (Recommendation): \"I request an immediate emergency ambulance transfer with packed cells ready in your theater upon our arrival in 35 minutes.\"",
            "resources": []
          },
          {
            "title": "Topic 10.2: Dual-Clinician Verification and Cold-Handover in Transit",
            "content": "During patient handovers between the primary facility and the ambulance or receiving theater team, both clinicians must execute a Dual-Clinician Check:\n• Verify IV line patency and fluid volume infused.\n• Inspect the UBT catheter clamp and drainage.\n• Re-check radial pulse and blood pressure, recording the exact Shock Index on the referral envelope.\n• Sign the clinical handover sheet before the ambulance departs.",
            "resources": []
          },
          {
            "title": "Topic 10.3: Multidisciplinary Psychological Debriefing and Near-Miss Audits",
            "content": "Severe PPH events cause significant emotional distress and secondary traumatic stress for labor ward staff. Within 48 hours of any severe PPH case, the ward in-charge must convene a non-punitive, supportive clinical debriefing.\n\nThe debriefing reviews:\n1. Timeline of bundle execution (Was TXA given within 15 minutes of trigger?).\n2. Equipment and commodity stock status (Were drapes and uterotonics ready?).\n3. Team communication dynamics and emotional wellness of the attendants.\n4. Documentation in the maternity register and reporting of maternal near-miss metrics to the District Health Officer.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "What is the primary clinical objective of using structured SBAR communication during obstetric emergencies?",
            "options": [
              "To replace formal medical chart documentation.",
              "To ensure rapid, standardized transmission of critical clinical data without ambiguity, reducing delays in referral and surgical readiness.",
              "To assign administrative blame to the clinician who called for assistance.",
              "To satisfy an academic requirement for nursing students."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. SBAR is verbal escalation and handover communication; written documentation is still required.",
              "Correct! SBAR eliminates ambiguous rambling and ensures essential vitals, bundle status, and urgent recommendations are transmitted concisely.",
              "Incorrect. SBAR is specifically designed to promote egalitarian, psychological-safety communication free of blame.",
              "Incorrect. SBAR is an international patient safety standard practiced by multidisciplinary teams worldwide."
            ],
            "explanation": "SBAR (Situation, Background, Assessment, Recommendation) provides a concise, standardized handover framework that prevents omitted information."
          }
        ]
      }
    ]
  },
  {
    "id": "course-golden-minute-nrp",
    "title": "Helping Babies Breathe: The Golden Minute Neonatal Resuscitation",
    "category": "Neonatology",
    "cpd": 4,
    "duration": 6,
    "pricingModel": "freemium",
    "freePreviewModules": 1,
    "price": 19,
    "requiresLab": true,
    "status": "Published",
    "activityCode": "UMDPC/CPD/2026/1104",
    "creatorId": "system-seed",
    "image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1000&q=80",
    "description": "High-impact 3-module rapid clinical refresher on immediate newborn thermal care, clearing the airway, and initiating bag-and-mask ventilation within the critical first 60 seconds of life.",
    "modules": [
      {
        "title": "Module 1: Preparation for Birth & Routine Thermal Care (Free Preview)",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 1.1: Equipment Readiness & The Warm Chain",
            "content": "Every birth attendant must prepare the neonatal resuscitation area before delivery begins. Check that the self-inflating bag (240–500 mL), size 0 (preterm) and size 1 (term) masks, penguin suction device, cord ties, and two clean, pre-warmed dry cloths are within reach.\n\nImmediately upon birth:\n1. Dry the baby thoroughly on the mother's abdomen.\n2. Remove the wet cloth and wrap in the second warm, dry cloth.\n3. Assess crying and breathing simultaneously.\n\nLMS Deep-Dive & Practical Application Guide:\n• Gold-Standard Protocol: Pre-warm the radiant warmer table to 36.5°C, verify oxygen blender set to 21% room air for term infants, and test the pop-off pressure valve on the self-inflating resuscitator bag.\n• HC III / Resource-Adapted Protocol: Where electric radiant warmers are unavailable, eliminate drafts in the delivery room, pre-warm dry cotton cloths near a safe heat source, and initiate immediate skin-to-skin Kangaroo Care on the mother's chest once breathing is established.",
            "hc3Adaptation": "Rural HC III Adaptation: Where electric radiant warmers are unavailable, pre-warm dry cotton cloths near a safe heat source and initiate immediate skin-to-skin Kangaroo Care on the mother's chest once breathing is established.",
            "resources": [
              {
                "title": "Helping Babies Breathe Action Plan Wall Chart (PDF)",
                "type": "pdf",
                "url": "https://www.who.int"
              }
            ]
          },
          {
            "title": "Topic 1.2: Selective Airway Clearing vs. Routine Suctioning Hazards",
            "content": "Routine suctioning of a vigorous, crying newborn is contraindicated because vigorous pharyngeal suctioning can induce vagal bradycardia, laryngospasm, and delayed spontaneous breathing.\n\nSelective Airway Protocol:\n• Clear the airway ONLY if the baby is not breathing AND secretions or meconium are visibly obstructing the mouth or nose.\n• Always suction the Mouth before the Nose ('M before N') so the infant does not aspirate nasal secretions if they gasp.",
            "hc3Adaptation": "Rural HC III Adaptation: Use a clean, boilable single-piece silicone Penguin suction device rather than single-use mucus extractors that cannot be safely disinfected inside between patients.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "Within what maximum timeframe after birth must bag-and-mask ventilation begin if a newborn is not breathing despite thorough drying and stimulation?",
            "options": [
              "Within 5 minutes of birth.",
              "Within 60 seconds (\"The Golden Minute\") of birth.",
              "Only after waiting 10 minutes for a pediatrician.",
              "After completing a full 10-point Apgar score at 5 minutes."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. Waiting 5 minutes causes severe hypoxic-ischemic brain injury and neonatal mortality.",
              "Excellent! If a newborn does not breathe after drying and gentle stimulation, positive-pressure ventilation must begin within 60 seconds—The Golden Minute.",
              "Incorrect. Every birth attendant must initiate ventilation within 60 seconds without waiting for specialist arrival.",
              "Incorrect. Resuscitation never waits for the 1-minute or 5-minute Apgar score."
            ],
            "explanation": "If a newborn does not breathe after drying and gentle stimulation, positive-pressure ventilation must begin within 60 seconds—The Golden Minute."
          }
        ]
      },
      {
        "title": "Module 2: The Golden Minute — Airway & Bag-and-Mask Ventilation",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 2.1: Positioning the Head, Mask Seal & 40 Breaths/Minute",
            "content": "Position the newborn's head in a neutral 'sniffing' position—neither hyperextended nor flexed—to keep the trachea open. Place the cushioned rim of the mask over the tip of the chin, the mouth, and the nose to form an airtight seal without pressing on the eyes.\n\nVentilation Cadence:\n• Squeeze the bag to deliver 40 breaths per minute (range 30–50 breaths/minute) using the rhythm 'Breathe — two — three'.\n• Observe visible chest rise with every squeeze as confirmation of alveolar inflation.\n\nLMS Deep-Dive & Practical Application Guide:\n• Gold-Standard Protocol: Attach pulse oximetry to the right wrist (pre-ductal SpO2) while ventilating at 40 breaths/min with 21% room air for term newborns.\n• HC III / Resource-Adapted Protocol: Use room air (21% oxygen) via self-inflating bag for initial resuscitation when blended oxygen cylinders are unavailable; room air is clinically proven to be as effective and safer than 100% oxygen for term neonatal resuscitation.",
            "hc3Adaptation": "Rural HC III Adaptation: Use room air (21% oxygen) for initial resuscitation when blended oxygen cylinders are unavailable; evaluate heart rate by palpating the umbilical cord stump base or auscultating the precordium.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "What is the target ventilation rate when performing neonatal bag-and-mask resuscitation?",
            "options": [
              "12–16 breaths per minute",
              "40 breaths per minute (range 30–50 breaths/min)",
              "100 breaths per minute",
              "5 breaths per minute"
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. 12–16 breaths/min is the adult ventilation rate and is dangerously slow for a newborn.",
              "Correct! Standard neonatal resuscitation requires 40 breaths per minute (30–50 breaths/min), checking for visible chest movement with each breath.",
              "Incorrect. 100 breaths/min causes hyperventilation, air trapping, and pneumothorax.",
              "Incorrect. 5 breaths/min is insufficient to reverse neonatal asphyxia."
            ],
            "explanation": "Standard neonatal resuscitation requires 40 breaths per minute, checking for visible chest movement with each breath."
          }
        ]
      },
      {
        "title": "Module 3: Improving Ventilation (MR. SOPA) & Post-Resuscitation Care",
        "mainVideoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "topics": [
          {
            "title": "Topic 3.1: Corrective Steps (MR. SOPA) & Continuous Monitoring",
            "content": "If the chest is not rising during bag-and-mask ventilation, immediately execute corrective ventilation steps before considering chest compressions:\n• M — Mask adjustment: Reapply the mask over chin, mouth, and nose using the C-E clamp technique.\n• R — Reposition airway: Place the head in the neutral sniffing position.\n• S — Suction mouth then nose if secretions block airflow.\n• O — Open the mouth slightly while maintaining the mask seal.\n• P — Pressure increase: Squeeze the bag harder until the chest rises gently.\n• A — Alternative airway if trained and available.\n\nLMS Deep-Dive & Practical Application Guide:\n• Once the heart rate exceeds 100 bpm and spontaneous breathing is regular (> 30 breaths/min without severe chest indrawing), transition to post-resuscitation monitoring, check blood glucose, and maintain thermal stability.",
            "hc3Adaptation": "Rural HC III Adaptation: If the newborn requires prolonged ventilation (> 10 minutes) or shows persistent grunting and chest indrawing after stabilization, initiate continuous skin-to-skin warmth, administer first-dose parenteral ampicillin + gentamicin if sepsis is suspected, and arrange accompanied SBAR referral to the District NICU.",
            "resources": []
          }
        ],
        "quiz": [
          {
            "question": "What is the very first corrective action if the newborn chest does not rise during bag-and-mask ventilation?",
            "options": [
              "Immediately intubate the newborn.",
              "Reapply the mask to ensure a tight seal over chin, mouth, and nose, and reposition the head in neutral alignment.",
              "Stop ventilation for 3 minutes.",
              "Administer intravenous epinephrine immediately."
            ],
            "correctIndex": 1,
            "optionFeedback": [
              "Incorrect. Mask leak and neck flexion must be corrected first; >95% of newborns respond to effective mask ventilation.",
              "Excellent! Poor mask seal and airway malalignment are the most common causes of failed chest rise; reapply the mask and reposition the head first.",
              "Incorrect. Stopping ventilation during apnea worsens hypoxia and bradycardia.",
              "Incorrect. Epinephrine is never a substitute for effective lung inflation."
            ],
            "explanation": "Poor mask seal and airway malalignment are the most common causes of failed chest rise; reapply the mask and reposition the head first."
          }
        ]
      }
    ]
  }
];

export const INITIAL_LABS = [
  {
    id: 'lab-mulago-emotive',
    courseId: 'course-emotive-pph',
    courseTitle: 'National EMOTIVE & Helping Mothers Survive (BABC 3.0) PPH Refresher',
    locationName: 'Mulago Specialized Women & Neonatal Hospital Sim Center',
    city: 'Kampala',
    country: 'Uganda',
    date: '2026-11-15',
    time: '09:00',
    capacity: 20,
    booked: 14,
    creatorId: 'system-seed'
  },
  {
    id: 'lab-kawempe-nrp',
    courseId: 'course-golden-minute-nrp',
    courseTitle: 'Helping Babies Breathe: The Golden Minute Neonatal Resuscitation',
    locationName: 'Kawempe National Referral Hospital Neonatal Skills Lab',
    city: 'Kampala',
    country: 'Uganda',
    date: '2026-11-18',
    time: '09:00',
    capacity: 18,
    booked: 7,
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
  },
  {
    id: 'lab-mbarara-emotive',
    courseId: 'course-emotive-pph',
    courseTitle: 'National EMOTIVE & Helping Mothers Survive (BABC 3.0) PPH Refresher',
    locationName: 'Mbarara University of Science & Technology (MUST) Sim Lab',
    city: 'Mbarara',
    country: 'Uganda',
    date: '2026-12-10',
    time: '09:30',
    capacity: 16,
    booked: 5,
    creatorId: 'system-seed'
  }
];

export const ROLE_DEFINITIONS = [
  { tier: 1, role: 'guest', title: 'Anonymous / Guest', description: 'Browse Marketing Landing & Course Previews' },
  { tier: 2, role: 'learner', title: 'Clinician / Learner', description: 'Take courses, quizzes, simulations, and book labs' },
  { tier: 3, role: 'coordinator', title: 'Facility Practice Coordinator', description: 'Co-sign LDHF weekly drills and log facility commodity readiness' },
  { tier: 4, role: 'convener', title: 'Lab Convener / OSCE Examiner', description: 'Schedule Sim Labs, evaluate OSCE rubrics, and release Escrow CPD points' },
  { tier: 5, role: 'creator', title: 'Content Creator / Professor', description: 'Access Educator Studio, author curricula, view royalties' },
  { tier: 6, role: 'reviewer', title: 'Clinical Peer Reviewer', description: 'Review courses in Pending Review against safety rubric' },
  { tier: 7, role: 'registrar', title: 'Accreditation Registrar', description: 'Verify practitioner licenses and attach board activity codes' },
  { tier: 8, role: 'support', title: 'Tech Support / Helpdesk', description: 'Diagnose user sessions, reset timers, and resolve tickets' },
  { tier: 9, role: 'auditor', title: 'MoH / Donor Auditor', description: 'Read-only access to national and donor equity impact dashboards' },
  { tier: 10, role: 'superuser', title: 'Super Admin', description: 'Full access to Super Admin Command Center, role provisioning, and audit logs' }
];

export const SEED_PROMOS = [
  { id: 'promo-1', code: 'PAMOJA2026', active: true, discountPercent: 100, grantName: 'Pamoja Early Adopter & Faculty Launch Scholarship' },
  { id: 'promo-2', code: 'FREE100', active: true, discountPercent: 100, grantName: 'Pamoja Universal Launch Pass' },
  { id: 'promo-3', code: 'PMJ-GLOBAL-100', active: true, discountPercent: 100, grantName: 'Pan-African Medical Equity Scholarship' },
  { id: 'promo-4', code: 'PMJ-UG-WNL-9K4X-77B2', active: true, discountPercent: 100, grantName: 'UNFPA Uganda Maternal Survival Grant' },
  { id: 'promo-5', code: 'MOH-UGANDA-SCHOLAR', active: true, discountPercent: 100, grantName: 'Ministry of Health Uganda CPD Sponsorship' },
  { id: 'promo-6', code: 'UNFPA-MATERNAL-EQUITY', active: true, discountPercent: 100, grantName: 'UNFPA Maternal & Perinatal Equity Grant' }
];

export const INITIAL_COURSES = SEED_COURSES;
export default SEED_COURSES;
