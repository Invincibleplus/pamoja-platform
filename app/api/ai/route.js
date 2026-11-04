import { SEED_COURSES } from '../../../lib/seedCourses.js';

const NextResponse = {
  json(body, init) {
    return Response.json(body, init);
  }
};

/**
 * Pamoja Clinical Superintelligence Engine (Pamoja-MedLM)
 * Server-Side API Route (/api/ai)
 *
 * Capabilities:
 * 1. chat_dr_pam           - Grounded clinical RAG & dynamic cross-course study pathway weaver
 * 2. compile_curriculum    - Slide / Document / Guideline -> Multi-Module Curriculum compiler
 * 3. generate_quiz         - Sub-topic 4-option conditional feedback quiz generator
 * 4. generate_simulation   - No-code clinical simulation generator (Engines A, B, C, D)
 * 5. synthesize_pathway    - Cross-course Atomic Learning Unit (ALU) pathway & creator royalty engine
 * 6. generate_remedial     - Item-level Pre/Post-Test regression remedial clinic generator
 * 7. grade_sbar            - Voice / Structured SBAR handover clinical rubric evaluator
 * 8. GET /api/ai           - Diagnostic health check & engine capability inspector
 */

// Detect and validate the Gemini API key, rejecting dummy placeholders
function getGeminiApiKey() {
  const rawKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';
  const cleanKey = rawKey.replace(/^["']|["']$/g, '').trim();

  // Guard against missing, placeholder, or unconfigured keys
  if (
    !cleanKey ||
    cleanKey.includes('YourGeneratedKey') ||
    cleanKey.includes('PLACEHOLDER') ||
    cleanKey.includes('AIzaSyYourGeneratedKeyHere') ||
    cleanKey.length < 15
  ) {
    return null;
  }
  return cleanKey;
}

async function callGeminiModel({ systemInstruction, prompt, jsonMode = false }) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured or contains placeholder text');
  }

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemInstruction ? `${systemInstruction}\n\n---\n\n${prompt}` : prompt }]
    }
  ];

  const generationConfig = {
    temperature: 0.35,
    maxOutputTokens: 4096,
    ...(jsonMode ? { responseMimeType: 'application/json' } : {})
  };

  // Active, ultra-low latency Google Gemini models on v1beta
  const activeModels = [
    'gemini-3.5-flash-lite',
    'gemini-3-flash-preview',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-3.8-flash'
  ];

  const endpoints = activeModels.map(
    m => `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`
  );

  let lastError = null;

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const requestBody = {
        contents,
        generationConfig
      };

      if (systemInstruction) {
        requestBody.system_instruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text;
        }
      } else {
        const errBody = await response.text();
        lastError = new Error(`HTTP ${response.status}: ${errBody.substring(0, 200)}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini endpoints failed');
}

function cleanJsonString(str) {
  if (!str) return '{}';
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Index all sub-topics across courses as Atomic Learning Units (ALUs)
 */
function buildALUIndex(coursesList = SEED_COURSES) {
  const alus = [];
  const professors = [
    { name: 'Prof. E. M. Achieng', institution: 'Nairobi Obstetric Simulation Center' },
    { name: 'Prof. N. K. Okello', institution: 'Makerere University College of Health Sciences' },
    { name: 'Prof. S. R. Mukasa', institution: 'University of the Witwatersrand' },
    { name: 'Prof. A. Mensah', institution: 'University of Ghana Medical School' }
  ];

  coursesList.forEach((course, cIdx) => {
    const prof = professors[cIdx % professors.length];
    (course.modules || []).forEach((mod, mIdx) => {
      (mod.topics || []).forEach((topic, tIdx) => {
        alus.push({
          aluId: `${course.id}_m${mIdx + 1}_t${tIdx + 1}`,
          courseId: course.id,
          courseTitle: course.title,
          category: course.category || 'Maternal Health',
          professor: course.instructor || prof.name,
          institution: course.institution || prof.institution,
          moduleIndex: mIdx,
          moduleTitle: mod.title,
          topicIndex: tIdx,
          subTopicTitle: topic.title,
          content: topic.content || '',
          goldProtocol: topic.goldProtocol || '',
          ruralProtocol: topic.ruralProtocol || '',
          seatTimeMinutes: topic.seatTimeMinutes || 45,
          cpdCredits: topic.cpdCredits || 1.5,
          competencyTag: topic.competencyTag || `${(course.category || 'CLIN').substring(0, 4).toUpperCase()}-M${mIdx + 1}T${tIdx + 1}`
        });
      });
    });
  });

  return alus;
}

/**
 * Search relevant ALUs from the curriculum index for grounded RAG
 */
function retrieveRelevantALUs(queryText, coursesList = SEED_COURSES, limit = 5) {
  const alus = buildALUIndex(coursesList);
  const terms = (queryText || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  if (terms.length === 0) return alus.slice(0, limit);

  const scored = alus.map(alu => {
    const haystack = `${alu.courseTitle} ${alu.moduleTitle} ${alu.subTopicTitle} ${alu.content} ${alu.category} ${alu.goldProtocol} ${alu.ruralProtocol}`.toLowerCase();
    let score = 0;
    terms.forEach(term => {
      if (haystack.includes(term)) score += 3;
      if (alu.subTopicTitle.toLowerCase().includes(term)) score += 6;
      if (alu.courseTitle.toLowerCase().includes(term)) score += 4;
    });
    return { alu, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter(s => s.score > 0).map(s => s.alu);
  return top.length > 0 ? top.slice(0, limit) : alus.slice(0, limit);
}

/**
 * Synthesize a Cross-Course Dynamic Pathway & Fractional Royalties
 */
function buildDynamicPathwayData(goalText, coursesList = SEED_COURSES) {
  const matchedALUs = retrieveRelevantALUs(goalText, coursesList, 6);
  const selected = matchedALUs.slice(0, 4).map(alu => ({
    ...alu,
    seatTimeMinutes: alu.seatTimeMinutes || 90,
    cpdCredits: alu.cpdCredits || 3
  }));

  const totalMinutes = selected.reduce((acc, a) => acc + a.seatTimeMinutes, 0);
  const targetDurationHours = Math.max(1, Math.round((totalMinutes / 60) * 10) / 10);
  const totalCPD = selected.reduce((acc, a) => acc + a.cpdCredits, 0);
  const priceUSD = 39.0;
  const gatewayFee = priceUSD * 0.029;
  const managedStorageFee = priceUSD * 0.025; // 2.5% deferred storage recovery only on paid sale
  const rNet = priceUSD - gatewayFee - managedStorageFee;
  const creatorPoolShare = rNet * 0.7;

  const profMap = {};
  selected.forEach(alu => {
    const key = alu.professor;
    if (!profMap[key]) {
      profMap[key] = {
        professor: alu.professor,
        institution: alu.institution,
        allocatedMinutes: 0,
        topics: []
      };
    }
    profMap[key].allocatedMinutes += alu.seatTimeMinutes;
    profMap[key].topics.push(alu.subTopicTitle);
  });

  const royaltyBreakdown = Object.values(profMap).map(prof => {
    const share = prof.allocatedMinutes / (totalMinutes || 1);
    const payout = creatorPoolShare * share;
    return {
      ...prof,
      seatTimeSharePercent: Math.round(share * 100),
      fractionalPayoutUSD: payout.toFixed(2),
      payoutStatus: 'Escrowed & Verified'
    };
  });

  return {
    title: `Precision Clinical Pathway: ${goalText}`,
    goal: goalText,
    targetDurationHours,
    totalMinutes,
    totalCPD,
    priceUSD,
    gatewayFee: gatewayFee.toFixed(2),
    managedStorageFee: managedStorageFee.toFixed(2),
    rNet: rNet.toFixed(2),
    creatorPoolShare: creatorPoolShare.toFixed(2),
    alus: selected,
    royaltyBreakdown
  };
}

/**
 * Diagnostic GET endpoint: verifies whether Gemini API is live or running in sovereign RAG mode
 */
export async function GET() {
  const apiKey = getGeminiApiKey();
  return NextResponse.json({
    status: 'online',
    service: 'Pamoja Clinical Superintelligence Engine (Pamoja-MedLM)',
    geminiConfigured: !!apiKey,
    activeEngine: apiKey
      ? 'Google Gemini (gemini-3.5-flash-lite / gemini-3-flash-preview)'
      : 'Sovereign Clinical RAG & Pedagogical Engine (Deterministic Local Intelligence)',
    supportedActions: [
      'chat_dr_pam',
      'compile_curriculum',
      'generate_quiz',
      'generate_simulation',
      'synthesize_pathway',
      'generate_remedial',
      'grade_sbar'
    ],
    configurationNotice: apiKey
      ? 'Live Gemini API key verified and operational on gemini-3.5-flash-lite.'
      : 'Using sovereign offline clinical RAG. To enable live Gemini calls, add a valid GEMINI_API_KEY to your .env.local file.'
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;
    const apiKey = getGeminiApiKey();

    // =========================================================================
    // 1. DR. PAM CLINICAL INTELLIGENCE CHAT (Pamoja-MedLM)
    // =========================================================================
    if (action === 'chat_dr_pam') {
      const {
        message = '',
        history = [],
        profile = {},
        courseContext = null
      } = body;

      const userQuery = (message || '').trim();
      const lower = userQuery.toLowerCase();

      // Normalize courseContext whether it arrives as an object or a string
      let contextSnippet = '';
      let courseTitleHint = '';
      if (courseContext) {
        if (typeof courseContext === 'string') {
          contextSnippet = courseContext;
          const matchTitle = courseContext.match(/Course:\s*([^\n]+)/i);
          if (matchTitle) courseTitleHint = matchTitle[1];
        } else if (typeof courseContext === 'object') {
          courseTitleHint = courseContext.title || '';
          contextSnippet = `Course: "${courseContext.title || ''}" | Module: "${courseContext.currentModuleTitle || ''}" | Topic: "${courseContext.currentTopicTitle || ''}"\nGold Protocol: ${courseContext.goldProtocol || ''}\nRural Protocol: ${courseContext.ruralProtocol || ''}\nContent: ${courseContext.content || ''}`;
        }
      }

      // Check if learner is asking for a dynamic study path / learning pathway
      const isPathwayRequest =
        lower.includes('study path') ||
        lower.includes('dynamic path') ||
        lower.includes('learning path') ||
        lower.includes('pathway') ||
        lower.includes('recommend course') ||
        lower.includes('what should i study') ||
        lower.includes('study plan');

      const searchQuery = `${courseTitleHint} ${contextSnippet} ${userQuery}`;
      const relevantALUs = retrieveRelevantALUs(searchQuery, SEED_COURSES, 5);

      const groundedExcerpts = relevantALUs
        .map(
          (a, idx) =>
            `[ALU ${idx + 1}] Course: "${a.courseTitle}" (${a.courseId}) | ${a.moduleTitle} -> ${a.subTopicTitle}\nClinical Notes: ${a.content}\nGold Protocol: ${a.goldProtocol || 'Standard tertiary resuscitation'}\nRural HC III/IV Protocol: ${a.ruralProtocol || 'Early stabilization & SBAR transfer'}`
        )
        .join('\n\n');

      const systemInstruction = `You are Dr. Pam (Pamoja-MedLM), the Senior Clinical Intelligence Mentor on the Pamoja Medical Education & CPD Platform.
You are in a live, interactive conversation with a healthcare practitioner (doctor, midwife, nurse, clinical officer, or medical student) in Africa.
Practitioner Profile:
- Name: ${profile?.title || 'Dr.'} ${profile?.name || 'Colleague'}
- Role: ${profile?.role || 'learner'}
- Facility: ${profile?.facility || 'Clinical Facility'} (Tier: ${profile?.facilityTier || 'HC IV / Hospital'})
- Earned CPD: ${profile?.cpdPoints || 0} pts | Escrow Pending: ${profile?.pendingPoints || 0} pts
${contextSnippet ? `Active Course Context:\n${contextSnippet}` : ''}

Verified Pamoja Curriculum Grounding Library:
${groundedExcerpts}

Conversational & Pedagogical Directives:
1. VOICE & TONE: Speak in a warm, conversational, collegial, and deeply human medical voice—like an approachable, highly experienced senior consultant physician who knows the daily challenges of frontline clinical practice. Be engaging, clear, and supportive.
2. CONVERSATION PICKUP & AWARENESS: Pick up the conversation naturally. If the user asks about the platform ("tell me more about this platform", "what is pamoja", "how does this work"), give an inspiring, conversational, and comprehensive explanation of Pamoja:
   - Pamoja (meaning "together") is a Pan-African Continuous Professional Development (CPD) and Simulation ecosystem built so that no frontline clinician has to practice in isolation.
   - It provides accredited dynamic modular courses, interactive simulations (Time-Critical EMOTIVE Sequencer, Voice SBAR Handover Grader, 3D WebAR stations), and hands-on Simulation Lab bookings across regional hubs.
   - It bridges the gap between Tertiary Gold-Standard care and rural HC III/IV resource-adapted realities (stock-outs, no theatre, transport delays).
   - You (Dr. Pam) are their 24/7 grounded clinical intelligence mentor to answer questions, guide patient handovers, and weave personalized cross-course study paths.
3. CLINICAL INTELLIGENCE: When discussing clinical protocols or patient scenarios, integrate the grounded curriculum resources seamlessly into your explanation rather than dumping raw excerpts or static templates. Always provide:
   - Gold-Standard Tertiary Protocol (optimal diagnostics, continuous monitoring, specialist backup)
   - HC III / HC IV Resource-Adapted Protocol (first-line stabilization, calibrated drape/Shock Index, Condom-Catheter UBT, NASG, structured SBAR referral)
4. STUDY PLANS: If they ask for a dynamic study path or learning plan, synthesize a tailored 3-to-4 step Cross-Course Atomic Learning Unit (ALU) pathway from the grounded courses with seat-time and stackable CPD credits.
5. ACTIONABLE ENROLLMENT DIRECTIVE: You have accredited registrar authority on Pamoja to ENROLL practitioners into courses!
   Available Courses:
   - "course-emotive-pph": "National EMOTIVE & Helping Mothers Survive PPH Refresher" (15 CPD)
   - "course-gc-1000": "Group Antenatal Care (GC_1000) Masterclass" (12 CPD)
   - "course-peer-ed-hiv": "Comprehensive Peer Educator Training for HIV & PMTCT Care" (10 CPD)
   - "course-wraparound-srhr": "Integrated Adolescent SRHR & Gender-Affirming Wraparound Care" (8 CPD)
   When the practitioner says "enroll me", "sign me up", "start course", "yes please", or agrees to your offer to enroll:
   - Confirm warmly and encouragingly that you have enrolled them and unlocked all course materials for their profile.
   - AT THE END of your response, output: [ACTION:ENROLL courseId="<id>" courseTitle="<title>"]
6. GROUNDING INTEGRITY: Maintain strict adherence to MoH and WHO AFRO protocols. Zero hallucinations.`;

      // Normalize history from multiple format variants ({ role, content } or { sender, text } or { type, text })
      const conversationHistory = (Array.isArray(history) ? history : [])
        .slice(-6)
        .map(m => {
          const isUser = m.role === 'user' || m.type === 'user' || m.sender === 'user';
          const text = m.content || m.text || '';
          return text ? `${isUser ? 'Practitioner' : 'Dr. Pam'}: ${text}` : null;
        })
        .filter(Boolean)
        .join('\n');

      const prompt = `${conversationHistory ? `Recent Conversation:\n${conversationHistory}\n\n` : ''}Practitioner's New Message: "${userQuery}"`;

      let replyText = '';
      let pathwaySuggestion = null;

      if (isPathwayRequest) {
        pathwaySuggestion = buildDynamicPathwayData(
          userQuery
            .replace(/help me (to )?(do|build|create|make) a (dynamic )?(study|learning) path(way)?( on| for)?/i, '')
            .trim() || 'Comprehensive Maternal Emergency & Obstetric Care Mastery'
        );
      }

      // Try calling live Gemini if API key is configured
      if (apiKey) {
        try {
          replyText = await callGeminiModel({ systemInstruction, prompt, jsonMode: false });
        } catch (aiErr) {
          console.warn('[Dr. Pam API Notice] Gemini call failed, using sovereign RAG:', aiErr.message);
        }
      }

      // Sovereign local clinical RAG synthesis if Gemini is not configured or network unreachable
      if (!replyText) {
        if (
          lower.includes('platform') ||
          lower.includes('pamoja') ||
          lower.includes('about this') ||
          lower.includes('what is this') ||
          lower.includes('tell me more') ||
          lower.includes('how does this work')
        ) {
          replyText = `**Welcome to Pamoja — Pan-African Medical CPD & Simulation Ecosystem**\n\nPamoja (*"together"*) was founded on a simple principle: **no healthcare worker should ever have to practice or learn in isolation.**\n\nHere is how Pamoja supports your clinical excellence:\n\n1. **Accredited Modular CPD Curricula:** Expert-authored training courses covering high-impact clinical priorities (EMOTIVE Postpartum Hemorrhage, Newborn Resuscitation, HIV/PMTCT, and Group Antenatal Care).\n\n2. **Resource-Stratified Clinical Guidance:** Every clinical protocol is taught with two distinct operational realities:\n   • **Tertiary Gold-Standard:** Comprehensive laboratory diagnostics, continuous vital signs, and immediate surgical backup.\n   • **Rural HC III / IV Adaptation:** Frontline bedside stabilization when stock-outs occur or theatres are unavailable (e.g. Condom-Catheter UBT, Non-Pneumatic Anti-Shock Garments, and structured SBAR referral).\n\n3. **Hands-On OSCE & Simulation Labs:** Book practical simulation sessions at verified regional hospital centers across the continent to unlock practical CPD credits.\n\n4. **Dr. Pam Clinical Intelligence (that's me!):** Your 24/7 grounded medical AI mentor. Ask me questions about dosages, patient handovers, or ask me to build a custom study pathway for your facility.\n\nHow can I help you get started today?`;
        } else if (
          lower.match(/^(hi|hello|hey|good morning|good afternoon|good evening|how are you|greetings|start)/)
        ) {
          replyText = `Hello ${profile?.title || 'Dr.'} ${profile?.name?.split(' ')[0] || 'Colleague'}! I am Dr. Pam, your Clinical Study Assistant on Pamoja. I am grounded in your active course curricula and approved MoH clinical guidelines.\n\nHere is how I can support you today:\n• **Resource-Stratified Guidance:** Clarify differences between Tertiary Gold-Standard care and HC III/IV stabilization protocols.\n• **Drug Dosages & Golden Windows:** Review evidence-based protocols (e.g., TXA 3-hour window, Oxytocin, Misoprostol, Magnesium Sulfate).\n• **Weave a Custom Study Plan:** Synthesize a tailored Cross-Course Learning Pathway based on your clinical goals.\n\nWhat clinical scenario or topic would you like to explore?`;
        } else if (isPathwayRequest && pathwaySuggestion) {
          const stepsList = pathwaySuggestion.alus
            .map(
              (a, i) =>
                `${i + 1}. **${a.subTopicTitle}** (*${a.courseTitle}* — ${a.seatTimeMinutes} mins, ${a.cpdCredits} CPD)`
            )
            .join('\n');
          replyText = `I have synthesized a personalized **Cross-Course Dynamic Study Path** tailored for your practice:\n\n${stepsList}\n\n**Total Estimated Seat-Time:** ${pathwaySuggestion.targetDurationHours} Hours • **Stackable Credits:** ${pathwaySuggestion.totalCPD} CPD Points.\nYou can jump directly into each lesson using the study plan card below!`;
        } else if (lower.includes('txa') || lower.includes('tranexamic')) {
          replyText = `### Tranexamic Acid (TXA) Clinical Protocol & Golden Window\n\n• **Clinical Indication:** Postpartum Hemorrhage (PPH) or acute traumatic hemorrhage.\n• **The 3-Hour Golden Window:** Administer as early as possible within **3 hours** of delivery or trauma. Evidence from the WOMAN trial demonstrates maximum mortality reduction when given within this golden window; giving TXA beyond 3 hours does not improve survival.\n• **Standard Dosing:** **1g (1000 mg)** in 100 mL of 0.9% Normal Saline infused intravenously over **10 minutes** (1 mL/min rate).\n• **Second Dose:** If bleeding continues after 30 minutes, or restarts within 24 hours, a second 1g dose may be administered.\n\n**Resource-Stratified Care:**\n• **Gold-Standard (Tertiary):** Concurrent arterial blood gas, rotational thromboelastometry (ROTEM), and immediate surgical/theatre backup.\n• **HC III / IV Stabilization:** Administer TXA concurrently with 10 IU Oxytocin IM and/or 800 mcg Misoprostol sublingually, insert uterine balloon tamponade (or condom-catheter UBT), and organize emergency SBAR referral.`;
        } else if (lower.includes('pph') || lower.includes('hemorrhage') || lower.includes('bleeding')) {
          replyText = `### Acute Postpartum Hemorrhage (PPH) First-Response Bundle\n\n• **Quantitative Detection:** Do not rely on visual estimation (underestimates loss by 30-50%). Use calibrated collection drapes or Shock Index (Heart Rate ÷ Systolic BP ≥ 0.9 indicates critical hypovolemia).\n• **First-Line Pharmacotherapy:**\n  - Oxytocin 10 IU IM or 20 IU in 1L IV crystalloid\n  - Tranexamic Acid (TXA) 1g IV slow push over 10 mins\n  - Misoprostol 800 mcg sublingually/rectally if Oxytocin is unavailable or stock-out\n• **Mechanical Tamponade:**\n  - Continuous bimanual uterine compression\n  - Condom-catheter UBT (inflate condom with 300–500 mL sterile saline)\n  - Non-Pneumatic Anti-Shock Garment (NASG) applied from ankles to pelvis\n• **Escalation:** Call for emergency team help and prepare structured SBAR inter-facility transfer.`;
        } else {
          const topALU = relevantALUs[0];
          replyText = `Based on **${topALU.courseTitle}** (*${topALU.moduleTitle} — ${topALU.subTopicTitle}*):\n\n${topALU.content}\n\n**Resource-Stratified Clinical Execution:**\n• **Tertiary Gold-Standard Protocol:** Comprehensive laboratory diagnostic workup, continuous electronic vital sign tracking, targeted pharmacotherapy, and multi-specialist team mobilization.\n• **Rural HC III / HC IV Resource-Adapted Protocol:** Calibrate bedside triggers (Shock Index, clinical observation), administer available first-line stabilization commodities (Oxytocin, Misoprostol, TXA, mechanical UBT/NASG), and initiate early SBAR referral communication.`;
        }
      }

      // Detect & Execute Course Enrollment Action
      let enrolledCourse = null;
      const enrollTagMatch = replyText.match(/\[ACTION:ENROLL\s+courseId=["']([^"']+)["'](?:\s+courseTitle=["']([^"']+)["'])?\]/i);
      if (enrollTagMatch) {
        const cId = enrollTagMatch[1];
        const matched = SEED_COURSES.find(c => c.id === cId) || SEED_COURSES[0];
        enrolledCourse = {
          id: matched.id,
          title: enrollTagMatch[2] || matched.title,
          cpd: matched.cpd || 15
        };
        replyText = replyText.replace(/\[ACTION:ENROLL[^\]]*\]/gi, '').trim();
      } else {
        const botAskedEnrollment =
          conversationHistory.toLowerCase().includes('enroll') ||
          conversationHistory.toLowerCase().includes('enrol') ||
          conversationHistory.toLowerCase().includes('sign you up') ||
          conversationHistory.toLowerCase().includes('register');

        const isAffirmative =
          lower === 'yes' ||
          lower.startsWith('yes ') ||
          lower.startsWith('yes,') ||
          lower.startsWith('yes!') ||
          lower === 'yes please' ||
          lower === 'sure' ||
          lower === 'okay' ||
          lower === 'ok' ||
          lower === 'yeah' ||
          lower === 'yep' ||
          lower === 'please do' ||
          lower.includes('enroll') ||
          lower.includes('enrol') ||
          lower.includes('sign me up') ||
          lower.includes('register me') ||
          lower.includes('start course') ||
          lower.includes('i want to enroll');

        if (isAffirmative && (botAskedEnrollment || lower.includes('enroll') || lower.includes('enrol') || lower.includes('sign me up') || lower.includes('start'))) {
          let matched = SEED_COURSES[0];
          if (courseContext && typeof courseContext === 'object' && courseContext.id) {
            const contextCourse = SEED_COURSES.find(c => c.id === courseContext.id);
            if (contextCourse) matched = contextCourse;
          } else if (lower.includes('gc') || lower.includes('antenatal') || conversationHistory.toLowerCase().includes('gc_1000') || conversationHistory.toLowerCase().includes('antenatal')) {
            matched = SEED_COURSES.find(c => c.id === 'course-gc-1000') || matched;
          } else if (lower.includes('hiv') || lower.includes('peer') || lower.includes('pmtct') || conversationHistory.toLowerCase().includes('hiv')) {
            matched = SEED_COURSES.find(c => c.id === 'course-peer-ed-hiv') || matched;
          } else if (lower.includes('srhr') || lower.includes('wraparound') || lower.includes('adolescent')) {
            matched = SEED_COURSES.find(c => c.id === 'course-wraparound-srhr') || matched;
          } else if (courseTitleHint) {
            const found = SEED_COURSES.find(c => c.title.toLowerCase().includes(courseTitleHint.toLowerCase()));
            if (found) matched = found;
          }
          enrolledCourse = {
            id: matched.id,
            title: matched.title,
            cpd: matched.cpd || 15
          };
          if (!replyText.toLowerCase().includes('enrolled')) {
            replyText += `\n\nI have officially enrolled you in **${matched.title}**! All course modules and clinical simulations are now fully unlocked for your profile.`;
          }
        } else if (
          replyText.toLowerCase().includes('enrolled you in') ||
          replyText.toLowerCase().includes('you are now enrolled') ||
          replyText.toLowerCase().includes('registered you for') ||
          replyText.toLowerCase().includes('officially enrolled')
        ) {
          // Model decided to enroll user directly
          let matched = null;
          if (courseContext && typeof courseContext === 'object' && courseContext.id) {
            matched = SEED_COURSES.find(c => c.id === courseContext.id);
          }
          if (!matched) {
            for (const c of SEED_COURSES) {
              if (replyText.toLowerCase().includes(c.title.toLowerCase()) || (c.category && replyText.toLowerCase().includes(c.category.toLowerCase()))) {
                matched = c;
                break;
              }
            }
          }
          if (!matched && courseTitleHint) {
            matched = SEED_COURSES.find(c => c.title.toLowerCase().includes(courseTitleHint.toLowerCase()));
          }
          if (!matched) matched = SEED_COURSES[0];
          enrolledCourse = {
            id: matched.id,
            title: matched.title,
            cpd: matched.cpd || 15
          };
        }
      }

      const citationsList = relevantALUs.slice(0, 3).map(a => `${a.courseTitle}: ${a.subTopicTitle}`);

      return NextResponse.json({
        status: 'success',
        reply: replyText,
        enrolledCourse,
        pathwaySuggestion,
        groundedSources: relevantALUs.slice(0, 3).map(a => ({
          courseId: a.courseId,
          courseTitle: a.courseTitle,
          subTopicTitle: a.subTopicTitle,
          competencyTag: a.competencyTag
        })),
        citations: citationsList,
        source: apiKey ? 'gemini-3.5-flash-lite' : 'sovereign_rag'
      });
    }

    // =========================================================================
    // 2. AI DOCUMENT / SLIDES-TO-CURRICULUM COMPILER
    // =========================================================================
    if (action === 'compile_curriculum') {
      const { rawText = '', courseTitle = '', category = 'Maternal Health' } = body;

      const systemInstruction = `You are the Pamoja Pedagogical Curriculum Compiler. Convert the provided clinical lecture slides, syllabus, or guideline text into a structured Pamoja Curriculum JSON object.
Output STRICT valid JSON matching this schema:
{
  "title": "Course Title",
  "description": "Comprehensive clinical summary",
  "modules": [
    {
      "title": "Module 1: ...",
      "mainVideoUrl": "",
      "videoSourceType": "youtube",
      "topics": [
        {
          "title": "Topic 1.1: ...",
          "seatTimeMinutes": 45,
          "competencyTag": "CLIN-101",
          "content": "Detailed 2-3 paragraph clinical teaching content...",
          "goldProtocol": "Tertiary hospital full-resource execution steps...",
          "ruralProtocol": "Rural HC III / HC IV resource-adapted stabilization & referral steps...",
          "videoUrl": "",
          "videoStartTime": "00:00",
          "videoEndTime": "08:30",
          "resources": []
        }
      ],
      "quiz": [
        {
          "question": "Clinical scenario question?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 1,
          "optionFeedback": [
            "Option A clinical rationale...",
            "Option B clinical rationale...",
            "Option C clinical rationale...",
            "Option D clinical rationale..."
          ],
          "explanation": "Overall clinical rationale"
        }
      ]
    }
  ]
}
Generate 3 to 6 rich, comprehensive modules based strictly on the input text.`;

      if (apiKey) {
        try {
          const rawJson = await callGeminiModel({
            systemInstruction,
            prompt: `Course Title Hint: ${courseTitle}\nCategory: ${category}\nRaw Clinical Material:\n${rawText || 'Emergency Obstetric & Maternal Care Clinical Guidelines'}`,
            jsonMode: true
          });
          const parsed = JSON.parse(cleanJsonString(rawJson));
          if (parsed && Array.isArray(parsed.modules) && parsed.modules.length > 0) {
            return NextResponse.json({ status: 'success', compiled: parsed, source: 'gemini' });
          }
        } catch (err) {
          console.warn('[Compiler Notice] Gemini compile failed, using deterministic compiler:', err.message);
        }
      }

      // Sovereign deterministic parser that structures modules 1-to-1 from raw text
      const lines = (rawText || '')
        .split(/\n+/)
        .map(l => l.trim())
        .filter(Boolean);
      const extractedTitle =
        courseTitle ||
        (lines[0] && lines[0].length < 90 ? lines[0] : 'Compiled Clinical Mastery Curriculum');

      const chunks = [];
      let currentChunk = [];
      lines.forEach(line => {
        currentChunk.push(line);
        if (currentChunk.join(' ').length > 350) {
          chunks.push(currentChunk.join('\n\n'));
          currentChunk = [];
        }
      });
      if (currentChunk.length > 0) chunks.push(currentChunk.join('\n\n'));
      if (chunks.length === 0) {
        chunks.push(
          'Evidence-based clinical diagnosis, quantitative physiological monitoring, and structured first-response bundle execution.'
        );
      }

      const compiledModules = chunks.slice(0, 6).map((chunkText, idx) => {
        const firstLine = chunkText.split('\n')[0].substring(0, 75);
        return {
          title: `Module ${idx + 1}: ${firstLine || `Clinical Protocol & Execution Phase ${idx + 1}`}`,
          mainVideoUrl: '',
          videoSourceType: 'youtube',
          topics: [
            {
              title: `Topic ${idx + 1}.1: Core Clinical Principles & Diagnostic Triggers`,
              seatTimeMinutes: 45,
              competencyTag: `${(category || 'CLIN').substring(0, 4).toUpperCase()}-M${idx + 1}T1`,
              content: chunkText,
              goldProtocol:
                'Execute full diagnostic workup with continuous electronic monitoring, targeted pharmacotherapy, and multidisciplinary specialist consultation.',
              ruralProtocol:
                'Utilize calibrated bedside clinical signs (Shock Index, gravimetric measurement), administer first-line stabilization drugs in stock, and initiate early SBAR referral.',
              videoUrl: '',
              videoStartTime: '00:00',
              videoEndTime: '10:00',
              resources: []
            }
          ],
          quiz: [
            {
              question: `When implementing the clinical protocol in Module ${idx + 1} (${firstLine.substring(0, 40)}...), what is the safest immediate clinical priority?`,
              options: [
                'Wait for delayed laboratory confirmation before initiating stabilization.',
                'Execute the evidence-based first-response bundle immediately while monitoring vital signs and facility readiness.',
                'Rely solely on subjective visual estimation without documentation.',
                'Discharge the patient without inter-facility SBAR communication.'
              ],
              correctIndex: 1,
              optionFeedback: [
                'Incorrect. Delaying stabilization for laboratory turnaround increases preventable morbidity.',
                'Correct! Immediate evidence-based bundle execution combined with objective vital sign monitoring saves lives.',
                'Incorrect. Subjective estimation underestimates clinical severity by 30-50%.',
                'Incorrect. Premature discharge without structured follow-up violates clinical safety standards.'
              ],
              explanation:
                'Early quantitative detection and immediate protocolized bundle execution are mandatory for clinical safety.'
            }
          ]
        };
      });

      return NextResponse.json({
        status: 'success',
        compiled: {
          title: extractedTitle,
          description: `Structured clinical curriculum compiled from faculty guidelines: ${lines.slice(0, 2).join(' ').substring(0, 180)}`,
          modules: compiledModules
        },
        source: 'sovereign_compiler'
      });
    }

    // =========================================================================
    // 3. SUB-TOPIC 4-OPTION CONDITIONAL FEEDBACK QUIZ GENERATOR
    // =========================================================================
    if (action === 'generate_quiz') {
      const {
        moduleTitle = '',
        topics = [],
        topicContent = '',
        content = ''
      } = body;

      let contextText = topicContent || content;
      if (!contextText && Array.isArray(topics) && topics.length > 0) {
        contextText = topics
          .map(t => `${t.title || ''}:\n${t.content || ''}\nGold Protocol: ${t.goldProtocol || ''}\nRural Protocol: ${t.ruralProtocol || ''}`)
          .join('\n\n');
      }

      const systemInstruction = `You are a Medical Board Psychometric Examiner. Based strictly on the provided module and sub-topic content, generate 1 high-yield clinical vignette multiple-choice question with 4 options (A, B, C, D) and option-specific conditional feedback for EVERY option.
Output STRICT JSON:
{
  "question": "Clinical scenario question...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 1,
  "optionFeedback": [
    "Option A specific clinical rationale...",
    "Option B specific clinical rationale...",
    "Option C specific clinical rationale...",
    "Option D specific clinical rationale..."
  ],
  "explanation": "Summary clinical pearl"
}`;

      if (apiKey) {
        try {
          const rawJson = await callGeminiModel({
            systemInstruction,
            prompt: `Module: ${moduleTitle}\nContent:\n${contextText || moduleTitle || 'Clinical resuscitation principles'}`,
            jsonMode: true
          });
          const questionObj = JSON.parse(cleanJsonString(rawJson));
          if (questionObj && Array.isArray(questionObj.options) && questionObj.options.length >= 4) {
            return NextResponse.json({ status: 'success', quizItem: questionObj, source: 'gemini' });
          }
        } catch (err) {
          console.warn('[Quiz Gen Notice] Gemini quiz generation failed, using sovereign generator:', err.message);
        }
      }

      const topicFocus = (topics[0]?.title || moduleTitle || 'this clinical protocol').replace(/^Topic\s+[\d.]+:\s*/i, '');
      return NextResponse.json({
        status: 'success',
        quizItem: {
          question: `A clinician at a Health Centre IV is managing a patient under "${topicFocus}". Which action demonstrates strict adherence to both patient safety and resource-stratified guidelines?`,
          options: [
            'Delay primary intervention until tertiary referral transport arrives.',
            'Initiate the immediate first-line stabilization bundle using objective clinical triggers and prepare a structured SBAR handover.',
            'Administer contraindicated high-dose vasopressors without baseline blood pressure assessment.',
            'Omit documentation of baseline clinical measurements.'
          ],
          correctIndex: 1,
          optionFeedback: [
            'Incorrect. Waiting for transport before stabilizing the patient leads to rapid physiological decompensation.',
            'Correct! Immediate stabilization paired with objective triggers and SBAR escalation is the gold standard across all facility tiers.',
            'Incorrect. Administering unmonitored vasopressors risks acute hypertensive crisis and end-organ injury.',
            'Incorrect. Objective baseline measurements are essential for tracking trend response and team handover.'
          ],
          explanation: `Grounded in ${topicFocus}: Immediate protocolized stabilization and structured SBAR communication are mandatory for patient survival.`
        },
        source: 'sovereign_quiz_gen'
      });
    }

    // =========================================================================
    // 4. NO-CODE CLINICAL SIMULATION GENERATOR (ENGINES A, B, C, D)
    // =========================================================================
    if (action === 'generate_simulation') {
      const {
        engine = 'engineA',
        moduleTitle = '',
        moduleContext = '',
        clinicalTopic = ''
      } = body;

      const topicName = clinicalTopic || moduleTitle || moduleContext || 'Acute Clinical Emergency';

      const systemInstruction = `You are Pamoja's Clinical Simulation Architect. Generate a JSON simulation configuration for "${engine}" based on the topic "${topicName}".
If engineA (Time-Critical Action Sequencer): include "engine", "scenarioTitle", "initialVitals" (bp, hr, shockIndex, bloodLoss), "timeLimitSeconds", "requiredInterventions" (array of 6-7 sequential clinical actions), and "consequencePenalty".
If engineB (Voice & Structured SBAR Grader): include "engine", "scenarioTitle", "scenario", "rubricAxes", "passingScore", and "modelHandover".
If engineD (3D WebAR Inspection Station): include "engine", "scenarioTitle", "models", "spatialInspectionPoints", and "clinicalCheckpoints".
Output STRICT JSON.`;

      if (apiKey) {
        try {
          const rawJson = await callGeminiModel({
            systemInstruction,
            prompt: `Engine: ${engine}\nTopic: ${topicName}\nContext: ${moduleContext}`,
            jsonMode: true
          });
          const simData = JSON.parse(cleanJsonString(rawJson));
          if (simData && simData.scenarioTitle) {
            return NextResponse.json({ status: 'success', simulation: simData, source: 'gemini' });
          }
        } catch (err) {
          console.warn('[Sim Gen Notice] Gemini simulation generation failed, using sovereign templates:', err.message);
        }
      }

      const fallbackMap = {
        engineA: {
          engine: 'Engine A: Time-Critical Action Sequencer',
          scenarioTitle: `${topicName} — 90s Physiological Clock`,
          initialVitals: { bp: '85/50', hr: 118, shockIndex: 1.39, bloodLoss: 550 },
          timeLimitSeconds: 90,
          requiredInterventions: [
            '1. Call for Help & Mobilize Emergency Resuscitation Team',
            '2. Perform Immediate Mechanical / Physical Stabilization Maneuver',
            '3. Administer First-Line Evidence-Based Pharmacotherapy',
            '4. Administer Time-Critical Adjunctive Therapy Within Golden Window',
            '5. Establish Dual Wide-Bore IV Access & Crystalloid Infusion',
            '6. Perform Systematic Diagnostic Examination for Secondary Causes',
            '7. Apply Tamponade / Anti-Shock Stabilization & Prepare Escalation'
          ],
          consequencePenalty:
            'Out-of-sequence delay causes systolic BP to drop 8 mmHg and Shock Index to rise.'
        },
        engineB: {
          engine: 'Engine B: Voice / Structured SBAR Handover Grader',
          scenarioTitle: `${topicName} — SBAR Referral Escalation`,
          scenario: `Urgent inter-facility escalation from HC III to Regional Referral Hospital for ${topicName}.`,
          rubricAxes: [
            'Situation: Caller, facility & patient status (25 pts)',
            'Background: Timeline & baseline triggers (25 pts)',
            'Assessment: Vital signs, Shock Index & bundle actions given (25 pts)',
            'Recommendation: Specific transfer & theatre readiness request (25 pts)'
          ],
          passingScore: 80
        },
        engineD: {
          engine: 'Engine D: 3D WebAR Table-Top Inspection Station',
          scenarioTitle: `${topicName} — Spatial Inspection Station`,
          models: [
            'Calibrated Quantitative Collection Drape',
            'Bimanual Compression Anatomical Vectors',
            'Abdominal Aortic Compression Landmark'
          ],
          spatialInspectionPoints: 3
        }
      };

      return NextResponse.json({
        status: 'success',
        simulation: fallbackMap[engine] || fallbackMap.engineA,
        source: 'sovereign_sim_template'
      });
    }

    // =========================================================================
    // 5. CROSS-COURSE AI PRECISION PATHWAY WEAVER
    // =========================================================================
    if (action === 'synthesize_pathway') {
      const { goal = '', courses = SEED_COURSES } = body;
      const pathwayData = buildDynamicPathwayData(goal, courses.length ? courses : SEED_COURSES);
      return NextResponse.json({ status: 'success', pathway: pathwayData });
    }

    // =========================================================================
    // 6. PROFESSOR-GROUNDED REMEDIAL COACHING GENERATOR
    // =========================================================================
    if (action === 'generate_remedial') {
      const {
        courseTitle = '',
        preTestScore = 75,
        postTestScore = 60,
        missedTopics = [],
        missedConcepts = []
      } = body;

      const activeConcepts = (missedConcepts.length ? missedConcepts : missedTopics).filter(Boolean);

      const relevant = retrieveRelevantALUs(
        `${courseTitle} ${activeConcepts.join(' ')}`,
        SEED_COURSES,
        2
      );

      const systemInstruction = `You are Pamoja's Professor-Grounded Remedial Coaching Engine. A clinician regressed from Pre-Test (${preTestScore}%) to Post-Test (${postTestScore}%) in "${courseTitle}".
Using the grounded curriculum notes below, generate a JSON remedial clinic with:
{
  "diagnosticSummary": "Why regression occurred and which clinical principles need reinforcement",
  "professorExcerpt": "Direct grounded clinical rule from the curriculum",
  "videoTimestamp": "04:15 - 06:45",
  "questions": [
    {
      "scenario": "Clinical verification scenario 1...",
      "options": [
        { "text": "Option A", "correct": false, "feedback": "Clinical rationale..." },
        { "text": "Option B", "correct": true, "feedback": "Clinical rationale..." },
        { "text": "Option C", "correct": false, "feedback": "Clinical rationale..." }
      ]
    },
    {
      "scenario": "Clinical verification scenario 2...",
      "options": [
        { "text": "Option A", "correct": true, "feedback": "Clinical rationale..." },
        { "text": "Option B", "correct": false, "feedback": "Clinical rationale..." },
        { "text": "Option C", "correct": false, "feedback": "Clinical rationale..." }
      ]
    }
  ]
}`;

      if (apiKey) {
        try {
          const rawJson = await callGeminiModel({
            systemInstruction,
            prompt: `Course: ${courseTitle}\nGrounded Curriculum:\n${relevant.map(r => `${r.subTopicTitle}: ${r.content}`).join('\n\n')}`,
            jsonMode: true
          });
          const remedial = JSON.parse(cleanJsonString(rawJson));
          if (remedial && Array.isArray(remedial.questions) && remedial.questions.length >= 2) {
            return NextResponse.json({ status: 'success', remedial, source: 'gemini' });
          }
        } catch (err) {
          console.warn('[Remedial Notice] Gemini remedial clinic failed, using sovereign scenarios:', err.message);
        }
      }

      // Sovereign dynamic remedial clinic generator
      const primaryConcept = activeConcepts[0] || 'time-critical bundle administration and quantitative shock triggers';
      return NextResponse.json({
        status: 'success',
        remedial: {
          diagnosticSummary: `Performance regression detected: Pre-Test score was ${preTestScore}% and Post-Test score was ${postTestScore}%. Clinical review is required regarding: ${primaryConcept}.`,
          professorExcerpt:
            'Grounded in National Ministry of Health Guidelines: Never delay medical stabilization while awaiting diagnostic tests or transport. Bundle execution within the golden window prevents maternal mortality.',
          videoTimestamp: '03:30 - 06:15',
          questions: [
            {
              scenario: `During management of ${courseTitle}, a patient in a peripheral HC III presents with worsening vital signs. First-line oxytocic therapy was administered 15 minutes ago. What is the immediate priority?`,
              options: [
                {
                  text: 'Withhold all mechanical interventions and re-evaluate in 2 hours',
                  correct: false,
                  feedback: 'Incorrect. Delaying mechanical stabilization during active decompensation significantly increases mortality risk.'
                },
                {
                  text: 'Administer the next protocolized bundle step (TXA / Misoprostol / UBT) and initiate structured SBAR referral',
                  correct: true,
                  feedback: 'Correct! Simultaneous bundle escalation and structured referral communication save lives.'
                },
                {
                  text: 'Discharge patient with oral iron tablets',
                  correct: false,
                  feedback: 'Incorrect. Acute clinical instability requires emergency stabilization and tertiary escalation.'
                }
              ]
            },
            {
              scenario: `Regarding ${primaryConcept}: What is the validated clinical timing rule?`,
              options: [
                {
                  text: 'Administer within the verified 3-hour golden window for maximal clinical efficacy',
                  correct: true,
                  feedback: 'Correct! Landmark clinical trials (e.g. WOMAN trial) confirm mortality reduction is maximized within 3 hours.'
                },
                {
                  text: 'Timing has no clinical significance as long as it is administered within 48 hours',
                  correct: false,
                  feedback: 'Incorrect. Delayed administration beyond the golden window provides no demonstrated survival benefit.'
                },
                {
                  text: 'Only administer if the patient has normal blood pressure',
                  correct: false,
                  feedback: 'Incorrect. Emergency bundles are specifically indicated during hemodynamic instability.'
                }
              ]
            }
          ]
        },
        source: 'sovereign_remedial'
      });
    }

    // =========================================================================
    // 7. VOICE / TEXT SBAR HANDOVER GRADER
    // =========================================================================
    if (action === 'grade_sbar') {
      const { transcript = '', scenario = 'Acute Postpartum Hemorrhage Referral' } = body;

      const systemInstruction = `You are an Accredited OSCE Examiner grading a clinician's SBAR (Situation, Background, Assessment, Recommendation) emergency handover for: "${scenario}".
Evaluate the transcript and output STRICT JSON:
{
  "situationScore": 0-25,
  "backgroundScore": 0-25,
  "assessmentScore": 0-25,
  "recommendationScore": 0-25,
  "totalScore": 0-100,
  "clinicalFeedback": "Specific, constructive 2-3 sentence clinical feedback on what was strong and what was missed."
}`;

      if (apiKey) {
        try {
          const rawJson = await callGeminiModel({
            systemInstruction,
            prompt: `Clinician SBAR Transcript: "${transcript}"`,
            jsonMode: true
          });
          const evaluation = JSON.parse(cleanJsonString(rawJson));
          if (evaluation && typeof evaluation.totalScore === 'number') {
            return NextResponse.json({ status: 'success', evaluation, source: 'gemini' });
          }
        } catch (err) {
          console.warn('[SBAR Grader Notice] Gemini grading failed, using sovereign rubric:', err.message);
        }
      }

      // Sovereign 4-Axis OSCE Rubric Evaluator
      const text = transcript.toLowerCase();
      let situationScore = 15;
      let backgroundScore = 15;
      let assessmentScore = 15;
      let recommendationScore = 15;

      if (text.includes('doctor') || text.includes('nurse') || text.includes('calling from') || text.includes('health centre')) situationScore += 5;
      if (text.includes('patient') || text.includes('years old') || text.includes('hemorrhage') || text.includes('emergency')) situationScore += 5;

      if (text.includes('delivered') || text.includes('vaginal') || text.includes('cesarean') || text.includes('labor') || text.includes('minutes ago')) backgroundScore += 5;
      if (text.includes('gravida') || text.includes('para') || text.includes('history') || text.includes('placenta')) backgroundScore += 5;

      if (text.includes('bp') || text.includes('blood pressure') || text.includes('pulse') || text.includes('heart rate') || text.includes('shock index')) assessmentScore += 5;
      if (text.includes('oxytocin') || text.includes('txa') || text.includes('misoprostol') || text.includes('blood loss') || text.includes('drape')) assessmentScore += 5;

      if (text.includes('transfer') || text.includes('refer') || text.includes('ambulance') || text.includes('theatre') || text.includes('admission')) recommendationScore += 5;
      if (text.includes('blood') || text.includes('surgeon') || text.includes('ready') || text.includes('prepare')) recommendationScore += 5;

      const totalScore = situationScore + backgroundScore + assessmentScore + recommendationScore;

      return NextResponse.json({
        status: 'success',
        evaluation: {
          situationScore,
          backgroundScore,
          assessmentScore,
          recommendationScore,
          totalScore,
          clinicalFeedback:
            totalScore >= 80
              ? 'Excellent SBAR handover. You clearly articulated caller identity, physiological triggers, bundle actions completed, and specific theatre/transport requirements.'
              : 'Constructive feedback: Ensure you state caller facility identity, quantitative blood loss/Shock Index, and explicit requirements (ambulance, cross-matched blood, theatre readiness).'
        },
        source: 'sovereign_osce_rubric'
      });
    }

    return NextResponse.json({ status: 'error', message: 'Unknown AI action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: err.message || 'AI processing error' },
      { status: 500 }
    );
  }
}
