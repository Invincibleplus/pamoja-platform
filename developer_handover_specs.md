# Pamoja Premium Platform — Master System Architecture, Clinical Superintelligence, FinTech Engine, Baseline Codebase Snapshot & Antigravity IDE Blueprint (v6.0 Complete Handover)

---

## 1. Executive Vision & Systemic Insights from On-Ground African Clinical Realities

Pamoja Premium is a **Continental Medical Continuous Professional Development (CPD), Clinical Superintelligence & Competency Ecosystem**. To engineer a system that genuinely transforms healthcare delivery and saves lives across Africa, our architecture is grounded in empirical operational realities extracted from real-world clinical deployments—most notably the *National EMOTIVE Training of Trainers (ToT) Refresher Report (June 2026)*.

Rather than treating that report merely as course content, we extract **six systemic healthcare training failures** exposed by the report and solve them structurally inside Pamoja’s software architecture for **every course on the platform**:

| On-Ground Clinical Reality (From Empirical Data) | Why Conventional E-Learning & Physical Workshops Fail | Pamoja’s Architectural & Superintelligent Solution |
| :--- | :--- | :--- |
| **1. Severe Regional & Rural Inequity**<br>*(e.g., Kampala & Metro accounted for $37.2\%$ [$16/43$] of trainees, while rural sub-regions like West Nile, Teso, and Greater Mubende had only $1$ participant [$2.3\%$]).* | Urban practitioners monopolize training slots and scholarships because they have faster internet, proximity to National Referral Hospitals, and early access to announcements. | **Cryptographic Geo-Fenced Quota & Voucher Engine:** Donor scholarships and physical Simulation Lab seats are geo-fenced and quota-locked by region and facility tier (e.g., reserving $60\%$ of seats for rural HC III / HC IV and District Hospitals). |
| **2. Wide Baseline Variance & Post-Test Theory Regression**<br>*(Pre-test scores ranged from $50.0\%$ to $90.0\%$; $7$ out of $43$ clinicians actually scored **lower** on their post-test than their pre-test, e.g., dropping by $-21.2$ percentage points).* | In a 3-day workshop, tests are graded in batches after participants leave. Clinicians who misunderstand a core concept or rush through an exam return to their wards with uncorrected clinical misconceptions. | **Real-Time Item-Level Regression Guardrail & Professor-Grounded AI Remediation:** Pamoja compares Pre-Test ($S_{\text{pre}}$) vs. Post-Test ($S_{\text{post}}$) at the *individual learning-objective level*. If $\Delta S < 0$ or $S_{\text{post}} < 80\%$, point disbursement locks and Pamoja AI synthesizes a **15-Minute Remedial Coaching Walkthrough** strictly grounded in the Professor's exact verified text and video timestamps. |
| **3. High Cognitive Load in Multi-Step Emergencies**<br>*(Clinicians scored $88.8\%$ on single skills like AMTSL, but struggled most with multi-step bundle execution [$84.4\%$] requiring simultaneous action sequencing, drugs, IV fluids, SBAR communication, and escalation).* | Multiple-choice questions test *recall*, not *clinical sequencing under pressure*. Watching a video does not train a clinician’s internal clock or team communication reflex. | **Time-Critical Action Sequencer, Voice-SBAR AI & WebAR Pocket Manikin:** Learners order clinical interventions under a live physiological clock, speak a real-time **Voice SBAR Handover** graded by Gemini Multimodal AI, and practice 3D spatial maneuvers via **Smartphone WebAR**. |
| **4. Facility Commodity & Equipment Mismatch**<br>*(Clinicians from rural Health Centre IIIs are trained on interventions like UBT, NASG, or surgical escalation that their facility may or may not have in stock).* | Western curricula and generic AI models assume uniform hospital infrastructure, frustrating rural clinicians when their facility lacks a specific commodity or ICU backup. | **Resource-Stratified Clinical Superintelligence (`Pamoja-MedLM`):** Learners register their exact Facility Level (*HC III, HC IV, District Hospital, RRH, NRH*) and live commodity stock. Case studies and clinical decision support dynamically display both the **Gold-Standard Protocol** and the **Evidence-Based Resource-Adapted Stabilization & Referral Protocol**. |
| **5. Rapid Post-Training Skill Decay**<br>*(A one-off course or 3-day refresher decays within $60$ days without weekly Low Dose High Frequency [LDHF] practice at the facility).* | LMS platforms treat course completion ($100\%$) as the finish line, awarding all points and disengaging from the learner. | **Matured 8–12 Week LDHF Facility Practice Loop:** After course completion, Pamoja triggers weekly 10-minute facility peer drills verified via a **Dual-Clinician QR Handshake** by the local **Practice Coordinator / Maternity In-Charge**, awarding bonus **Sustainment CPD Points**. |
| **6. Broken Training Cascade (ToT Tracking)**<br>*(Master Trainers are trained nationally, but Ministries of Health struggle to track whether they actually cascade training to staff at their home facilities).* | Paper attendance registers get lost and never link back to the Master Trainer's profile or donor impact dashboards. | **Cascade Mentorship Ledger:** Certified Trainers log facility-level mentorship sessions via cryptographic QR check-in, linking their trainees' skill gains directly to Ministry/Donor impact dashboards. |

---

## 2. Real-World Medical Board CPD Accreditation & Regulatory Engine

In real-world healthcare regulation across Africa—such as the **Health Professions Council of South Africa (HPCSA)**, **South African Nursing Council (SANC)**, **Uganda Medical and Dental Practitioners Council (UMDPC)**, **Uganda Nurses and Midwives Council (UNMC)**, **Kenya Medical Practitioners and Dentists Council (KMPDC)**, **Medical and Dental Council of Nigeria (MDCN)**, and regional **WCEA / ECSA-HC** frameworks—**a software platform cannot simply invent CPD points and push them to a doctor’s license.**

To be legally recognized, Pamoja implements a **3-Layer Regulatory Compliance & Reconciliation Architecture**:

### 2.1 Layer 1: Institutional Accreditor Umbrella
Pamoja operates under a dual-accreditation model:
1. **Direct Accredited Service Provider Status:** Pamoja registers directly with national councils (e.g., as an HPCSA Accredited CPD Service Provider or KMPDC Accredited E-Learning Provider).
2. **University / Professional Association Co-Sponsorship Umbrella:** Where national laws restrict accreditation to local statutory bodies or medical schools (e.g., Makerere University College of Health Sciences, University of Cape Town, or national Medical Associations), Pamoja links courses to a **Sponsoring Accredited Institution (`accreditingBodyId`)**.

### 2.2 Layer 2: Activity-Level Course Accreditation Lifecycle (Before Publication)
A course cannot award *Validated CPD Points* until the **Course Activity** itself is accredited. Pamoja automates this inside the **Super Admin & Registrar Portal**:
1. **Automated Accreditation Dossier Compiler:** When a Professor submits a course, Pamoja automatically compiles a downloadable **Regulatory Accreditation Dossier PDF** containing:
   * Course Syllabus, Module Breakdown & Word Count / Instructional Seat-Time Calculation ($\text{Seat Time Hours} \rightarrow \text{CEU/CPD Point Ratio}$, typically $1\text{ hour} = 1\text{ CPD Point}$, plus Ethics/Human Rights point classification).
   * Author & Peer Reviewer CVs, Medical Registration Numbers, and **Conflict of Interest (COI) Declarations** (ensuring zero pharmaceutical sponsorship bias).
   * Pre-Test, Sub-Topic Quiz, and Post-Test Psychometric Rubrics ($\ge 80\%$ pass threshold).
   * OSCE Practical Station Checklists (if `requiresLab: true`).
2. **Accreditation Activity Number Binding:** Once the national board approves the dossier, the Pamoja **Accreditation Registrar** enters the official **Board Activity Reference Code** into the course metadata:
   * `accreditationGrants`:
     ```json
     [
       {
         "board": "UMDPC",
         "country": "UG",
         "activityCode": "UMDPC/CPD/2026/0892",
         "approvedPoints": 15,
         "pointCategory": "Clinical / Category 1",
         "validFrom": "2026-01-01",
         "validUntil": "2027-12-31",
         "sponsoringInstitution": "Mulago Specialized Women & Neonatal Hospital"
       },
       {
         "board": "HPCSA",
         "country": "ZA",
         "activityCode": "MDB015/042/09/2026",
         "approvedPoints": 15,
         "pointCategory": "Level 2 (Outcome-Based)",
         "validFrom": "2026-01-01",
         "validUntil": "2027-12-31"
       }
     ]
     ```
3. **Expiration Guardrail:** If `currentDate > validUntil`, the platform automatically flags the course for **Biennial Clinical Re-Accreditation** and pauses new point issuance until renewed.

### 2.3 Layer 3: Multi-Modal Board Reporting & Practitioner Point Sync
Because African medical boards operate at different stages of digital maturity, Pamoja supports **three simultaneous disbursement protocols** once a learner reaches **Stage 3 (`OSCE_VALIDATED` or `THEORY_VALIDATED`)**:

```
                                   +----------------------------------------------------+
                                   |   LEARNER COMPLETES COURSE + OSCE (STAGE 3 PASS)   |
                                   +-------------------------+--------------------------+
                                                             |
                        +------------------------------------+------------------------------------+
                        |                                    |                                    |
                        v                                    v                                    v
+-----------------------------------------------+  +----------------------------------+  +----------------------------------+
| PROTOCOL A: CRYPTOGRAPHIC VERIFIABLE CERT     |  | PROTOCOL B: STATUTORY BATCH SYNC |  | PROTOCOL C: DIRECT API / WEBHOOK |
| (Universal / Self-Upload Councils)            |  | (HPCSA / UMDPC / KMPDC Portals)  |  | (Modern OpenHIE / WCEA Councils) |
| • Auto-generates PDF via Code.js              |  | • Code.js formats monthly council|  | • Signed SHA-256 JSON webhook    |
| • Includes Board Activity Code, Practitioner  |  |   CSV/Excel Attendance & Pass    |  |   pushed to Council REST API     |
|   License #, Date, and Sponsor Signature      |  |   Registers with License IDs     |  | • Stores Council Receipt Hash in |
| • Public Verification QR:                     |  | • Auto-dispatched to Council     |  |   Firestore & Immutable Sheet    |
|   pamoja.health/verify/[certHash]             |  |   Registrar on the 1st of month  |  |                                  |
+-----------------------------------------------+  +----------------------------------+  +----------------------------------+
```

### 2.4 Practitioner License Verification Logic (How `isVerified` Actually Works)
When a clinician enters their `authorityId` (e.g., `HPCSA-MP088392` or `UMDPC-14920`):
1. **Format & Checksum Validation:** Instant regex validation against the selected national board's numbering format.
2. **Evidence Upload / Registry Lookup:** The practitioner uploads their annual Practicing License / Retention Certificate PDF/Photo (or Pamoja queries the public online register of the medical council).
3. **Registrar Sign-Off:** The Pamoja **Accreditation Registrar (`registrar`)** verifies that the name, specialty, and active retention year match, switching `verificationStatus` from `PENDING_REVIEW` to `VERIFIED`.
4. **Delink & Re-Link Safety:** If a user unlinks their `authorityId`, their Pamoja-earned transcript remains immutable, but external statutory reporting pauses until a valid license is re-linked.

---

## 3. Comprehensive 10-Tier Enterprise RBAC & Unified Authentication Architecture

To run at national scale without overloading the Superuser or risking clinical/security breaches, Pamoja enforces **Separation of Duties (SoD)** across **10 distinct roles**, while keeping the login experience **100% unified and frictionless**.

### 3.1 How the Login & Registration Experience Works Across Roles (Single Gateway, Context-Aware Elevation)
**Rule #1: Never fragment the platform into confusing separate login URLs.** Every user—from a rural midwife to a Medical University Professor to the Super Admin—signs in through the **same sleek Pamoja Authentication Gateway**, using **Google OAuth**, **Passwordless Magic Link**, or **Institutional Email**.

How are elevated roles provisioned and experienced seamlessly?

1. **Pathway 1: Standard Self-Registration (Default $\rightarrow$ `learner`)**
   * Any clinician signing in for the first time lands in the **2-Step Clinical Onboarding Modal** (Title, strict `Male`/`Female` Gender, Specialty, Country, Facility Name/Level/Ownership, and optional Medical Board `authorityId`).
2. **Pathway 2: Cryptographic VIP Invite Links (For Professors, Conveners, Coordinators & Auditors)**
   * A Professor or Master Trainer does *not* want to register as a student and beg an admin for an upgrade.
   * Inside the Admin/Registrar Command Center, an admin generates a **Role-Bound Cryptographic Invite Link** (e.g., `https://pamoja.health/join?invite=eyJhbGci...&role=creator`).
   * When the Professor clicks the link and authenticates with one click via Google/Email, the system automatically claims the invite token, assigns `role: 'creator'`, skips student onboarding, and opens the **Faculty Credentialing Welcome Modal** (collecting Academic Title, Institution, Bio, OrcID, Payout Bank/Mobile Money details, and COI declaration), dropping them straight into the **Educator Studio**!
3. **Pathway 3: In-App "Apply for Faculty / Convener Status" Elevation**
   * An existing verified practitioner who completes a Training of Trainers (ToT) course (or a lecturer who discovers Pamoja organically) clicks **"Apply for Educator / Lab Convener Access"** inside their Profile.
   * They upload their CV or ToT Certificate. Once approved in the **Admin Verification Queue**, their top navigation bar dynamically unlocks the **Educator Studio** or **OSCE Convener Portal** in real time—no re-login required!

### 3.2 The 10-Tier Role-Based Access Control (RBAC) Matrix

| Role Tier | System Identifier | Target Persona | Core Authorizations (What They CAN Do) | Strict Guardrails (What They CANNOT Do) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Guest** | `guest` | Unauthenticated / Anonymous Visitor | • Browse Marketing Landing Page, public Course Previews, Verified Practitioner Directory, and Public Certificate Verification URLs (`/verify/[hash]`). | • Cannot view module content, take quizzes, chat with Dr. Pam, or book labs. |
| **2. Learner** | `learner` | Doctor, Nurse, Midwife, Clinical Officer, Peer Educator, Promotora | • Enroll in courses or AI Dynamic Pathways, complete sub-topic gamified quizzes, run interactive/WebAR simulations, and earn `pendingPoints`.<br>• Book regional Simulation Labs.<br>• Ask instructor questions & join Office Hours.<br>• Log weekly LDHF drills & manage Profile/Authority ID. | • **Cannot** mutate `cpdPoints` or `verificationStatus` from client.<br>• **Cannot** skip sub-topic quizzes or bypass Pre/Post-Test regression locks.<br>• **Cannot** claim lab-dependent points without Convener OSCE sign-off. |
| **3. Facility Practice Coordinator** | `coordinator` | Maternity In-Charge / Ward Supervisor at an HC III, HC IV, or Hospital | • All `learner` capabilities.<br>• Co-sign weekly **Low Dose High Frequency (LDHF)** peer drills at their assigned facility via Dual-QR Handshake.<br>• Submit monthly **Facility Commodity Readiness** logs.<br>• View training progress of staff at their specific facility. | • **Cannot** view or modify staff from other facilities.<br>• **Cannot** grade formal regional OSCE certification labs or edit global courses. |
| **4. Lab Convener / OSCE Examiner** | `convener` | Accredited Master Trainer / Simulation Center Assessor | • Access **Sim Lab & OSCE Examiner Portal**.<br>• Schedule regional Simulation Labs.<br>• Scan learner QR codes for physical attendance.<br>• Grade learners on digital **OSCE Station Rubrics** ($\ge 80\%$ threshold) to release Escrow CPD points.<br>• Flag learners for remedial mentorship. | • **Cannot** grade a learner who hasn't completed $100\%$ of online theory.<br>• **Cannot** grade themselves (strict conflict-of-interest block).<br>• **Cannot** edit global course text or platform roles. |
| **5. Content Creator / Professor** | `creator` | University Professor, Specialist Lecturer, NGO Curriculum Lead | • Access **Educator Studio**.<br>• Author courses manually or via the **AI Pedagogical Ingestion Pipeline** (uploading PDFs/PPTs/Word docs).<br>• Opt-in sub-topics to the **Cross-Course AI Pathway Pool** to earn fractional royalties.<br>• Build simulations using the **No-Code Scenario Builder**.<br>• Respond to learner Q&A, host Office Hours, and track royalty payouts. | • **Cannot** publish a course directly to `Published` (must submit to `Pending Review`).<br>• **Cannot** delete a `Published` course with enrolled students.<br>• **Cannot** manually grant CPD points to students. |
| **6. Clinical Peer Reviewer** | `reviewer` | Academic Editorial Board Member / Senior Specialist | • Access **Clinical & Pedagogical QA Queue**.<br>• Review courses in `Pending Review` against Pamoja’s Pedagogical & Clinical Safety Rubric.<br>• Approve AI-generated remedial and simulation blocks.<br>• Add inline review comments, request revisions from the Professor, or mark a course `Clinically Approved`. | • **Cannot** approve their own authored courses (requires independent reviewer).<br>• **Cannot** alter user roles, promo codes, or financial settings. |
| **7. Accreditation Registrar** | `registrar` | Medical Board Liaison / Compliance Officer | • Access **Verification & Accreditation Desk**.<br>• Verify practitioner `authorityId` licenses against national medical board registries.<br>• Attach official Medical Board `activityCode` and CPD point values to `Clinically Approved` courses to make them `Published`.<br>• Export monthly statutory board returns. | • **Cannot** alter clinical course content or OSCE scores.<br>• **Cannot** modify system infrastructure or Superuser accounts. |
| **8. Tech Support / Helpdesk** | `support` | Tier-1 / Tier-2 Customer & Technical Support Engineer | • Access **Support Diagnostics Console**.<br>• View user session logs, offline sync status, and payment/voucher redemptions.<br>• Reset stuck quiz timers, reschedule missed lab bookings, and resolve technical tickets. | • **Cannot** award/edit `cpdPoints`, verify medical licenses, approve courses, or elevate user roles. |
| **9. MoH / Donor Auditor** | `auditor` | Ministry of Health, UNFPA, Gates Foundation, or Medical Council Inspector | • Read-only access to **National, Regional & Donor Voucher Impact Dashboards**.<br>• Inspect regional training equity, Pre/Post-Test gains, OSCE pass rates, LDHF sustainment, and cryptographic certificate logs. | • **Strictly Read-Only:** Cannot mutate any user, course, financial, or lab record. |
| **10. Superuser** | `superuser` | Root System Administrator (`admin@pamoja.com`) | • Full access to **Super Admin Command Center**.<br>• Provision roles & generate VIP Role Invite Links.<br>• Mint B2B Cryptographic Vouchers, manage payment gateways, and configure system feature flags.<br>• Emergency override with mandatory reason logging. | • Cannot bypass the immutable `audit_logs` ledger; every Superuser mutation is cryptographically logged. |

---

## 4. The Educator Studio & AI Pedagogical Compiler (How Professors Create & Upgrade Courses)

A critical question for any medical education platform is: **How do we let busy professors, lecturers, and NGO leads contribute courses when they only have traditional PowerPoint slides, Word documents, PDFs, or raw lecture videos—and how do we guarantee their courses conform to Pamoja’s interactive, simulation-driven pedagogy without AI hallucination?**

Pamoja solves this with the **3-Stage AI Pedagogical Compiler & Professor Sign-Off Studio**:

### 4.1 Stage 1: Multi-Format Ingestion ("Bring Your Own Content" Pipeline)
Inside the **Educator Studio**, a Professor can create a course in two ways:
1. **Manual Structured Authoring:** Using our clean visual Module $\rightarrow$ Sub-Topic $\rightarrow$ Resource $\rightarrow$ Quiz builder.
2. **AI Document-to-Curriculum Compiler ("One-Click Pedagogical Transformation"):**
   * The Professor uploads their existing materials: **PDF manuals (`.pdf`), PowerPoint decks (`.pptx`), Word syllabi (`.docx`), or clinical guideline documents**.
   * **Gemini 3 Pro Document Parser** reads the raw academic material and structures it into Pamoja’s pedagogical standard—**strictly preserving the Professor’s clinical facts and citations**:
     * **10 Structured Modules** (or a custom module count based on credit hours).
     * **Granular Sub-Topics** ($300\text{–}600$ words each) tagged with **Clinical Competency Metadata (`competencyTags[]`, `icd11Codes[]`, `facilityTierApplicability[]`)** so mobile learners never face an overwhelming wall of text.
     * **Mandatory "Practical Application & Resource-Stratified Deep-Dive Guide"** appended to every sub-topic, translating theory into both Tertiary Hospital and Rural Clinic (HC III/IV) ward execution.
     * **Sub-Topic Micro-Quizzes (1–3 questions per sub-topic)** with **instant conditional feedback explanations for EVERY option (A, B, C, and D)**—explaining *why* a distractor is clinically dangerous or incorrect, not just marking it red!
     * **End-of-Module Mastery Check** + **Baseline Pre-Test / Post-Test Item Bank** mapped to specific sub-topic IDs.

### 4.2 Stage 2: How We Handle Professors Who Don't Have Simulations (The No-Code Clinical Simulation Generator)
Most university professors do not know how to code a clinical simulation. Pamoja solves this with **Standardized Interactive Simulation Templates** powered by Gemini AI and signed off by the Professor:
* When a Professor uploads a clinical module (e.g., *Managing Eclampsia*, *Neonatal Resuscitation*, *PMTCT Counseling*, or *PPH First-Response*), they click **"Generate Interactive Clinical Simulation with AI"** inside the Module Builder.
* Gemini analyzes the module's clinical algorithm and populates one of Pamoja’s **4 Built-In Simulation Engines** (stored as clean, editable JSON):
  1. **Engine A: The "Time-Critical Action Sequencer & Physiological Clock" (For Emergency & Clinical Protocols):**
     * Displays a live virtual patient monitor (e.g., *"24yo G2P2 Mother, BP $85/50\text{ mmHg}$, HR $118\text{ bpm}$, Shock Index $1.38$, Calibrated Drape Blood Loss: $550\text{ mL}$"*).
     * Presents $6\text{–}8$ clinical actions in randomized order. The learner must trigger them in the exact physiological sequence within $90\text{ seconds}$ (e.g., *Call for Help $\rightarrow$ Uterine Massage $\rightarrow$ Oxytocin $10\text{ IU IM/IV}$ $\rightarrow$ Tranexamic Acid $1\text{g IV}$ over $10\text{ min}$ $\rightarrow$ IV Crystalloid Resuscitation $\rightarrow$ Examine Genital Tract*).
     * **Dynamic Consequence Engine:** If the learner delays or chooses the wrong sequence, the patient’s blood pressure drops, heart rate spikes, blood loss increases on the virtual drape, and the simulator explains the exact pathophysiology of the mistake!
  2. **Engine B: The "Voice & Structured SBAR Handover Simulator" (For Team Communication & Escalation):**
     * In the *National EMOTIVE ToT Report*, clinicians struggled to combine clinical action with structured **SBAR (Situation, Background, Assessment, Recommendation)** escalation.
     * At the climax of an emergency scenario, the learner must either speak into their microphone (via Web Speech / Gemini Multimodal Audio) or assemble a structured SBAR call to the Senior Obstetrician / Referral Ambulance Team.
     * The AI grades the handover across 4 mandatory clinical axes: **S**ituation clarity, **B**ackground timeline, **A**ssessment vitals/blood loss, and **R**ecommendation/action requested.
  3. **Engine C: The "Branching Patient Consultation & Counseling Simulator" (For HIV, Mental Health, Wraparound & Group Care):**
     * Simulates a multi-turn patient or family conversation where the learner chooses or speaks their response at 3 critical decision nodes (testing empathy, non-judgmental phrasing, shared confidentiality, or cultural competence).
  4. **Engine D: The "Visual Diagnostic & 3D WebAR Inspection Station" (For Clinical Inspection & Spatial Skills):**
     * Displays high-resolution clinical visuals or interactive 3D/WebAR anatomical models (e.g., calibrated blood drapes, partographs, uterine compression vectors, opportunistic infection lesions, or Group Care room layouts) and asks the learner to classify the finding and execute the immediate clinical action.
* **Mandatory Professor Sign-Off:** The AI never publishes a simulation autonomously. The Professor sees a simple form editor where they review, tweak vitals, or adjust step sequences, and click **"Clinically Certify Simulation"**.

### 4.3 Stage 3: Video & Multimedia Ingestion Pipeline (Formats, Persistence & Bandwidth Optimization)
1. **Flexible Video Hierarchy (Supporting Persistent & Topic-Specific Videos):**
   * **Course Intro Trailer (`course.videoUrl`):** Optional 2-minute overview on the course landing card.
   * **Module-Level Persistent Video (`module.mainVideoUrl` + `videoPersistence: true`):** A single lecture or demonstration video that stays pinned at the top of the player across all sub-topics in that module, with **Timestamp Chapter Jumps** (`topic.videoStartTime`, `topic.videoEndTime`).
   * **Sub-Topic Dedicated Video (`topic.videoUrl`):** Overrides the module video when a specific sub-topic has its own dedicated procedural demonstration.
   * **Supplementary Resource Drawer (`topic.resources[]`):** Unlimited secondary resources attached below the lesson text and under the *Practical Labs* sidebar card (`video`, `pdf`, `audio` podcast summary, `image` flowchart, `webar_3d` model).
2. **Automated Upload & Adaptive HLS Transcoding Pipeline:**
   * Files upload directly from the browser via a **Signed Upload URL** to **Cloudflare R2 / Firebase Cloud Storage**.
   * A background worker automatically converts uploaded videos into **Adaptive HLS (`.m3u8`)** streams (`720p` HD, `480p` Standard, and `360p` Rural Data-Saver mode at $< 2.5\text{ MB/minute}$) plus a `64kbps` `.m4a` audio-only stream and auto-generated captions with exact word-level timestamps.

---

## 5. The Pamoja Clinical Superintelligence Architecture (`Pamoja-MedLM` & Professor-Grounded RAG)

To make Pamoja a true **Clinical Superintelligence Platform**—and a high-valuation asset for global health funders, Ministries of Health, and venture investors—we must go far beyond generic wrapper chatbots.

### 5.1 Why Generic Western AI Fails in African Clinical Settings—And Why We Build Our Own Domain Intelligence
Standard foundation models (like off-the-shelf GPT-4 or generic Gemini) are trained predominantly on Western tertiary hospital textbooks. If a rural midwife at a Ugandan **Health Centre III** or an Eastern Cape clinic asks how to manage refractory Postpartum Hemorrhage, a generic AI might suggest *"Immediate interventional radiology uterine artery embolization or massive transfusion protocol (1:1:1 PRBC/FFP/Platelets)"*—interventions that **do not exist** at an HC III!

Pamoja solves this by building **Pamoja Clinical Superintelligence (`Pamoja-MedLM`)**, a 3-Tier AI Architecture built on **Google Vertex AI**:

```
+----------------------------------------------------------------------------------------------------+
|                      PAMOJA CLINICAL SUPERINTELLIGENCE ENGINE (VERTEX AI)                          |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  TIER 1: PROFESSOR-GROUNDED VERIFIED RAG (Zero-Hallucination Pedagogical Layer)                    |
|  • Every paragraph, slide, quiz explanation, and video transcript authored by Pamoja Professors    |
|    is chunked and embedded into Vertex AI Vector Search / Firestore Vector Index.                  |
|  • STRICT GUARDRAIL: When generating Remedial Micro-Modules or answering course questions, the AI  |
|    is mathematically constrained to cite ONLY the Professor's approved curriculum & MoH guidelines.|
|                                                                                                    |
|  TIER 2: RESOURCE-STRATIFIED AFRICAN CLINICAL GRAPH ("The Context Engine")                         |
|  • Maps every clinical protocol across 3 resource tiers:                                           |
|    - Tier A: Primary Care / Rural Clinic (HC II / HC III — Basic emergency stabilization & referral|
|    - Tier B: District Hospital / HC IV (Theatre available, whole blood, NASG, UBT, C-section)      |
|    - Tier C: Regional / National Referral Hospital (ICU, sub-specialist, component blood therapy)  |
|  • Dynamically adapts case studies and Dr. Pam clinical guidance to the learner's exact facility   |
|    level AND their facility's live Commodity Readiness Log!                                        |
|                                                                                                    |
|  TIER 3: PROPRIETARY FINE-TUNED MODEL (`Pamoja-MedLM-Africa v1` via MedLM / Gemma 2 27B LoRA)      |
|  • Fine-tuned on anonymized Pamoja clinical simulation logs, African MoH Standard Treatment        |
|    Guidelines (STGs), WHO AFRO protocols, and multi-accent African clinical English/Swahili/French |
|    speech-to-text medical terminology (for Voice SBAR grading).                                    |
+----------------------------------------------------------------------------------------------------+
```

### 5.2 How "Real-Time Item-Level Regression & Professor-Grounded AI Remediation" Actually Works
Here is the exact, zero-hallucination engineering workflow:
1. **Item-to-SubTopic Tagging:** Every question in the Pre-Test and Post-Test is linked to a specific `subTopicId` and `learningObjectiveId` written by the Professor (e.g., `Q4` $\rightarrow$ `Mod2_Top2: Tranexamic Acid Administration Window & Contraindications`).
2. **Regression Detection:** Suppose a clinician scores $75\%$ on the Pre-Test, rushes through the Post-Test scoring $62\%$ ($\Delta S = -13\%$), and misses `Q4` and `Q7`.
3. **Professor-Grounded Synthesis (Not Open-Internet Generation):**
   * The system fetches the **exact source text, clinical pearls, diagram URLs, and video transcript timestamps** from the Professor's `Mod2_Top2` and `Mod5_Top1`.
   * Gemini 3 Flash receives a strict system prompt:
     > *"You are synthesizing a 15-minute remedial coaching clinic for a [Midwife] working at a [Health Centre III]. Using ONLY the attached verified curriculum authored by [Prof. Name], explain why their selected answer ['Administer TXA after 6 hours'] is clinically dangerous, highlight the exact rule from the Professor's notes ('Within 3 hours of birth, 1g IV over 10 minutes'), jump their video player to timestamp [04:15 - 06:30], and present 2 new verification scenarios testing this exact rule."*
4. **Unlocking the Hold:** Once the learner completes the 15-minute remedial walk-through and passes the $2$ verification scenarios ($100\%$), the regression lock lifts and their Post-Test can be finalized!

### 5.3 How Resource-Stratified Clinical Adaptation Works in Practice
When a clinician studies a clinical case on Pamoja (or consults **Dr. Pam** on the ward), Pamoja checks their profile (`facilityLevel: 'HC III'`, `facilityCommodities: { oxytocin: true, txa: false, ubt: true, theatre: false }`) and renders a **Dual-Column Clinical Protocol Card**:
* **Column 1: Gold-Standard Full-Resource Protocol** (What they must know for national board exams and tertiary hospital practice).
* **Column 2: Your Facility’s Life-Saving Action Plan (HC III Resource-Adapted Protocol):**
  * *"If Tranexamic Acid or Operating Theatre is unavailable at your HC III: Immediately administer Oxytocin $10\text{ IU IM}$, initiate vigorous Bimanual Uterine Compression or insert a Condom-Catheter Uterine Balloon Tamponade (UBT), apply Non-Pneumatic Anti-Shock Garment (NASG) if available, maintain Manual Aortic Compression during ambulance transfer, and trigger SBAR Red-Alert to the nearest HC IV / District Hospital."*

---

## 6. Cross-Course AI Dynamic Learning Pathways & Multi-Professor Fractional Royalty Engine

### 6.1 Beyond Rigid Courses: AI-Curated Cross-Course "Precision Clinical Pathways"
Conventional LMS platforms force a learner to buy and take an entire 40-hour course even if they only need to master a specific cross-cutting clinical challenge right now. Worse, conventional "Learning Paths" simply bundle Course A + Course B + Course C, causing massive repetition.

Pamoja introduces **AI Cross-Course Precision Pathways ("Micro-Curriculum Weaving")**:
1. **Granular Sub-Topic Vector Indexing:** Every sub-topic across every published course on Pamoja is indexed as an independent **Atomic Learning Unit (ALU)** with vector embeddings, credit-minute weights (`seatTimeMinutes`), and clinical tags.
2. **Dynamic Pathway Synthesis:**
   * A clinician (or a Hospital Medical Director training their staff) types a goal into the **Pamoja Pathway Architect**:
     > *"Build me a 6-hour accredited mastery path on: Managing HIV-Positive Pregnant Adolescents with High PPH Risk and Culturally Sensitive Family Counseling."*
   * Pamoja’s AI searches across the entire catalog and weaves a seamless, non-repetitive **Custom Precision Pathway** combining sub-topics from multiple professors:
     * **Step 1:** *Course 1 (Prof. A) — Module 3.3 & Module 7.1:* Family-Focused HIV Care & Option B+ PMTCT Protocols ($90\text{ mins}$)
     * **Step 2:** *Course 2 (Prof. B) — Module 4.2 & Module 10.3:* Culturally Competent Adolescent Counseling & Home Visit Stages ($90\text{ mins}$)
     * **Step 3:** *Course 3 (Prof. C) — Module 2.2 & Module 5.3:* Group Antenatal Self-Care Stations for Vulnerable Youth ($90\text{ mins}$)
     * **Step 4:** *Course 4 (Prof. D) — Module 1.3 & Module 3.1:* Active Management of Third Stage of Labour (AMTSL) & EMOTIVE Bundle Activation ($90\text{ mins}$)
3. **Unified Assessment & Stackable Micro-Credential:** The learner progresses smoothly from Course A's sub-topic directly into Course B's sub-topic inside a single unified player, earning **Stackable Micro-CPD Credits** and saving partial progress toward the full parent courses if they ever choose to complete them later!

### 6.2 How We Monetize Cross-Course Pathways & Pay Multiple Professors Fairly (The Fractional Royalty Ledger)
We implement a **Spotify-Meets-Coursera Fractional Smart-Royalty Engine**:

1. **Dynamic Pathway Pricing Formula:**
   * Each parent course has a per-minute instructional value: $v_c = \frac{\text{Course Price}}{\text{Total Course Seat-Time Minutes}}$.
   * When a Custom Pathway stitches together sub-topics $t_1, t_2, \dots, t_k$ from different courses, the pathway price $P_{\text{path}}$ is automatically calculated (with an optional $15\%$ bundle efficiency discount) or covered by an **All-Access Institutional / Practitioner Subscription Pass**.
2. **Exact Fractional Revenue Split Formula:**
   * Let $R_{\text{net}}$ be the net revenue collected from the learner (or voucher redemption) after payment gateway fees ($~2.9\%$).
   * Let $\alpha_{\text{platform}} = 30\%$ be Pamoja’s platform infrastructure share, and $\alpha_{\text{creators}} = 70\%$ be the Creator Royalty Pool.
   * For each contributing Professor $i$, let $M_i$ be the total validated instructional seat-time minutes (plus simulation weight) of their sub-topics included in the pathway, and $M_{\text{total}} = \sum_{j=1}^{n} M_j$.
   * Professor $i$'s exact royalty payout $P_i$ is computed atomically upon enrollment/completion:
     $$P_i = R_{\text{net}} \times \alpha_{\text{creators}} \times \left(\frac{M_i}{M_{\text{total}}}\right)$$
3. **Real-Time Creator Royalty Ledger:**
   * Inside the **Educator Studio $\rightarrow$ Analytics & Royalties Dashboard**, every Professor sees two live revenue streams:
     * **Direct Course Enrollments** ($100\%$ of the creator pool goes to them).
     * **Cross-Course AI Pathway Royalties** (showing exact sub-topic hits, seat-time share $\frac{M_i}{M_{\text{total}}}$, and fractional USD/local currency earnings credited to their payout wallet!).

---

## 7. Accessible Spatial Computing: WebAR "Pocket Manikin", $\$5$ Mobile VR & Voice-SBAR Engine

Pamoja architects a **3-Tier Zero-App Spatial Clinical Engine (Built on WebXR + Three.js)** that runs directly inside the mobile browser with zero app-store downloads required:

| Spatial Tier | Hardware Required | Clinical Experience & How It Works |
| :--- | :--- | :--- |
| **Tier 1: Smartphone WebAR "Pocket Manikin"** *(Universal Accessibility)* | Any standard Android or iOS smartphone camera (Chrome / Safari) | • The learner taps **"Launch 3D WebAR Table-Top Manikin"** inside a module.<br>• Using **WebXR Augmented Reality (`<model-viewer ar>`)**, they point their phone camera at their real desk or clinic bed.<br>• A life-sized, interactive **3D Maternal Pelvis / Uterus**, **Calibrated Blood-Loss Drape**, or **Group Care Room Circle** anchors onto their real table.<br>• **Interactive Spatial Drills:** The learner walks around the 3D model with their phone, taps anatomical landmarks to practice **Bimanual Uterine Compression hand placement**, **Aortic Compression point location**, or **Visual Blood Loss Estimation** ($350\text{ mL}$ vs. $800\text{ mL}$ pools), and toggles x-ray anatomical layers! |
| **Tier 2: $\$5$ Smartphone Stereoscopic VR ("Cardboard Ward Mode")** | Any smartphone + a $\$5$ clip-on VR lens / Google Cardboard viewer | • The learner taps **"Enter 360° VR Emergency Ward"** and slips their phone into a $\$5$ portable VR viewer.<br>• The screen splits into stereoscopic 3D. Looking around ($360^\circ$ gyroscope head tracking), they stand inside a virtual delivery suite.<br>• Using **Gaze-Reticle Selection + Voice Commands**, they look at the patient monitor, look at the IV tray to select Oxytocin/TXA, and speak their SBAR handover aloud! |
| **Tier 3: Full Room-Scale WebXR Headset Mode** *(For Regional Sim Centers)* | Meta Quest 2/3 or Pico headset at RRH / University Sim Labs | • Because it uses standard WebXR APIs, regional simulation centers can open `pamoja.health` inside the Quest headset browser for full hand-tracked virtual OSCE practice before learners touch physical manikins. |

---

## 8. Matured 8–12 Week LDHF (Low Dose High Frequency) Facility Practice Loop

To make LDHF a rigorous, tamper-proof clinical reality (and prevent people from just clicking a button to fake a drill), Pamoja implements the **4-Step Verified LDHF Sustainment Loop**:

1. **Automated Weekly Micro-Drill Push (WhatsApp / PWA Notification):**
   * Every Monday morning for $8\text{–}12$ weeks after a clinician completes a course, Pamoja sends a **10-Minute Weekly Facility Drill Prompt** (e.g., *Week 3 Drill: Retained Placenta & 60-Second Aortic Compression Drill*).
2. **Dual-Clinician QR Handshake (Co-Presence Proof):**
   * An LDHF drill cannot be done alone in bed—it must be practiced at the facility with a peer or supervised by the **Facility Practice Coordinator (`coordinator`)**.
   * The learner opens the drill on their phone, which displays a **Time-Stamped Ephemeral QR Code** (rotating every $30\text{ seconds}$).
   * The **Facility Practice Coordinator** (or a verified colleague at the same facility) scans the QR code on their device to co-sign that both clinicians are physically present at the facility station.
3. **10-Minute Timed Practical Checklist & Voice Debrief:**
   * The Coordinator's screen displays a **5-Item Rapid Observation Checklist** with a 10-minute timer (e.g., *1. Checked uterotonic stock; 2. Demonstrated bimanual compression on MamaNatalie/tabletop; 3. Stated TXA dose; 4. Completed 30-sec SBAR*).
4. **Sustainment CPD Point Minting & Facility Readiness Tie-In:**
   * Every verified weekly drill awards **$0.5\text{ Sustainment CPD Points}$** (up to $6\text{ bonus points}$ over $12\text{ weeks}$).
   * Once per month during the LDHF check-in, the Coordinator updates the **60-Second Facility Commodity Pulse** (marking whether Oxytocin, TXA, IV Fluids, BP Machine, and UBT/NASG are `In Stock`, `Low`, or `Out of Stock`), feeding live supply-chain intelligence to the Ministry of Health Auditor Dashboard!

---

## 9. Enterprise FinTech Payment Architecture & Cryptographic Smart-Voucher Engine

### 9.1 Multi-Rail Pan-African & Global Payment Gateway Architecture
Pamoja integrates a **Dual-Gateway Orchestration Layer** via Next.js Server Route Handlers (`/api/payments/*`):

1. **African Local Mobile Money & Bank Rails (Paystack + Flutterwave):**
   * **East Africa (Kenya, Uganda, Tanzania, Rwanda):** Native **M-Pesa (STK Push)**, **MTN Mobile Money (MoMo)**, and **Airtel Money**—the clinician enters their phone number, gets an instant PIN prompt on their phone, and the course unlocks in $3\text{ seconds}$!
   * **Southern Africa (South Africa, Zambia, Zimbabwe):** **Instant EFT (Ozow)**, **SnapScan**, **Capitec Pay**, and local Visa/Mastercard.
   * **West Africa (Nigeria, Ghana, Francophone Africa):** **Bank Transfer / USSD**, **Mobile Money (MTN/Telecel/Orange)**, and local cards.
2. **Global & Institutional Rails (Stripe):**
   * Handles USD/EUR/GBP credit cards, Apple Pay, Google Pay, and automated B2B wire/invoice links for international universities and diaspora clinicians.
3. **Zero-Trust Webhook Verification & Idempotency Ledger:**
   * **Never trust the browser to unlock a paid course.**
   * When a payment succeeds, Paystack/Flutterwave/Stripe sends an **HMAC-SHA512 Cryptographically Signed Webhook** to `/api/webhooks/payment`.
   * The server verifies the cryptographic signature, checks `transactions/{txRef}` for **idempotency** (preventing double-crediting), unlocks `users/{uid}.purchasedCourses`, and executes the **Fractional Professor Royalty Split** atomically inside a Firestore Transaction!

### 9.2 The Cryptographic Smart-Voucher & Scholarship Escrow Engine
Pamoja replaces simple, leaky promo codes (like `SUMMER24` which anyone can share on WhatsApp) with **Cryptographic Smart Vouchers**:

```
+---------------------------------------------------------------------------------------------------+
|                        CRYPTOGRAPHIC SMART-VOUCHER ARCHITECTURE                                   |
+---------------------------------------------------------------------------------------------------+
|  1. SPONSOR / DONOR MINTING (Super Admin / B2B Portal)                                            |
|     • Sponsor: "UNFPA Uganda Maternal Survival Grant ($25,000 -> 500 Seats)"                      |
|     • Eligibility Constraints Embedded in Voucher Batch:                                          |
|       - `allowedCountries`: ["UG"]                                                                |
|       - `allowedRegions`: ["West Nile", "Teso", "Karamoja", "Acholi", "Bunyoro"] (Rural Equity!)  |
|       - `allowedFacilityTiers`: ["HC III", "HC IV", "District Hospital"]                          |
|       - `allowedCadres`: ["Midwife", "Nurse", "Clinical Officer"]                                 |
|       - `targetScope`: Course ID OR Custom AI Precision Pathway ID                                |
|       - `maxRedemptions`: 500 | `singleUsePerCode`: true | `expiresAt`: "2027-06-30"              |
|                                                                                                   |
|  2. CRYPTOGRAPHIC CODE GENERATION                                                                 |
|     • Generates 500 unique, unguessable HMAC-signed tokens (e.g., `PMJ-UG-WNL-9K4X-77B2`)         |
|     • Optional 1-to-1 Binding: Can be pre-bound to a specific clinician's Phone Number or         |
|       Medical Council License ID (`authorityId`) and dispatched via SMS/WhatsApp!                 |
|                                                                                                   |
|  3. ZERO-TRUST REDEMPTION & OUTCOME-BASED ESCROW                                                  |
|     • When a learner enters `PMJ-UG-WNL-9K4X-77B2`, the server verifies:                          |
|       1) Signature valid & unused  2) User's Region/Facility/Cadre matches geo-fence constraints. |
|     • If an urban practitioner in Kampala tries to use a rural West Nile voucher, the system      |
|       blocks it: "This scholarship voucher is reserved for rural HC III/IV practitioners."        |
+---------------------------------------------------------------------------------------------------+
```

---

## 10. High-Velocity System Architecture, Speed Engineering & Scale-Up Roadmap

### 10.1 The CQRS Hybrid Pattern for $< 80\text{ms}$ Speed at Near-Zero Cost
To prevent Google Apps Script (`Code.js`—which has a $30$-concurrent-execution limit) or large Firestore documents from slowing down the app, we enforce **Command Query Responsibility Segregation (CQRS)** and **Payload Sharding**:

```
+---------------------------------------------------------------------------------------------------+
|                           1. GLOBAL EDGE & OFFLINE CLIENT LAYER (0ms - 50ms)                      |
|  • Next.js 15 App Router + Edge CDN Cache (Course Catalog & Static Module JSONs cached at Edge)   |
|  • Workbox Service Worker (sw.js) + IndexedDB (Instant 0ms local reads for active courses)        |
+-------------------------+-----------------------------------------------+-------------------------+
                          | (Hot Interactive Path: <80ms)                 | (Async Background Queue)
                          v                                               v
+---------------------------------------------------+   +-------------------------------------------+
|      2. HOT OPERATIONAL ENGINE (Firebase)         |   |  3. COLD LEDGER & AUTOMATION (Code.js)    |
|  • Firestore Sharded Collections:                 |   |  • Triggered ONLY asynchronously for:     |
|    - `courses_summary` (1KB cards for fast home)  |   |    1. Atomic Physical Lab Seat Locking    |
|    - `courses_modules` (Fetched 1 module at a time|   |    2. Auto-Generating PDF Certificates    |
|    - `subtopics_index` (Vector ALUs for AI Paths) |   |    3. Appending Verified CPD & Royalty    |
|    - `users/{uid}/progress` (Granular quiz state) |   |       Rows to MoH / Board Google Sheets   |
+---------------------------------------------------+   +-------------------------------------------+
```

### 10.2 The 3-Phase Infrastructure Scale-Up Roadmap

| Scale Phase | Active Clinicians | Monthly Infra Cost | Architecture & Resource Configuration |
| :--- | :--- | :--- | :--- |
| **Phase 1: National Launch & Pilot** | $100 \rightarrow 10,000$ users | **$\$0 - \$25/\text{mo}$** | • **Frontend:** Vercel / Firebase App Hosting.<br>• **Database:** Firebase Firestore Spark/Blaze Free Tier ($50\text{k}$ reads/day free + Edge caching).<br>• **Ledger & Certs:** Google Apps Script (`Code.js`) + Google Sheets.<br>• **AI:** Gemini 3 Flash API (strictly grounded on Professor JSONs).<br>• **Payments:** Paystack / Flutterwave ($0$ monthly fee; pay only per transaction). |
| **Phase 2: Multi-Country Scale-Up** | $10,000 \rightarrow 100,000$ users | **$\$80 - \$250/\text{mo}$** | • **Video & 3D WebAR Hosting:** Cloudflare Stream / R2 (zero egress fees, adaptive HLS + `.glb` 3D models).<br>• **Ledger Upgrade:** Firebase Cloud Functions (2nd Gen) batch-writing to Google Sheets every $10\text{ mins}$ so `Code.js` never hits rate limits.<br>• **Vector Search:** Firestore Native Vector Search (`findNearest`) for Cross-Course AI Pathways. |
| **Phase 3: Continental Sovereign Cloud** | $100,000 \rightarrow 1,000,000+$ users | **$\$500 - \$1,500/\text{mo}$** | • **AI Model:** Fine-tuned `Pamoja-MedLM-Africa v1` hosted on Vertex AI Endpoints.<br>• **Analytics Upgrade:** Firestore-to-BigQuery Mirroring for national Ministry of Health Looker Studio dashboards. |

---

## 11. Locked UI/UX Design System & Functional Continuity Specification

When handing this project to **Google Antigravity IDE**, the autonomous agents must **preserve and elevate our established Pamoja visual identity and functional flows**—never replacing them with generic templates.

### 11.1 Visual Design Tokens (Mandatory for All Agents)
* **Typography:**
  * Headings & Display Metrics: `'Outfit', sans-serif` (`font-black` / `900` and `font-bold` / `700`, tight tracking).
  * Body Copy, Clinical Content & UI Controls: `'Inter', sans-serif` (`400, 500, 600, 700`).
* **Color Architecture:**
  * **Canvas Background:** `#f8fafc` (`bg-slate-50/50`) with crisp `#ffffff` (`bg-white`) elevated surfaces and subtle `border-slate-100` borders.
  * **Primary Brand Accent:** Gradient `from-cyan-500 to-blue-600` (`#06b6d4` $\rightarrow$ `#2563eb`) with glowing shadows (`shadow-lg shadow-cyan-500/25`).
  * **Dark Signature Cards (Continue Learning & Course Library Cards):** Deep Slate `#0f172a` (`bg-slate-900`) with `border-slate-800`, `text-white`, and high-contrast `bg-amber-500/90` category badges and `bg-cyan-900/40 text-cyan-400` progress pills.
  * **Simulation Labs, Spatial WebAR & Super Admin Accent:** Gradient `from-indigo-500 to-purple-600` (`#6366f1` $\rightarrow$ `#9333ea`).
  * **Clinical Status Semantic Colors:**
    * *Validated / Correct / Verified:* Emerald (`bg-emerald-50 text-emerald-700 border-emerald-500`).
    * *Pending Escrow / Warning / Knowledge Check:* Amber (`bg-amber-50 text-amber-700 border-amber-500`).
    * *Incorrect / Locked / Remedial Hold:* Rose (`bg-rose-50 text-rose-700 border-rose-500`).
* **Geometry & Elevation:**
  * Primary containers and modals use generous `rounded-[2rem]` corners; buttons and inputs use `rounded-2xl`; micro-badges use `rounded-lg` or `rounded-full`.

---

## 12. Google Antigravity IDE Execution Blueprint (`.agents/rules/pamoja-architecture.md`)

To build and maintain this platform inside **Google Antigravity IDE**, place the following governance file at `.agents/rules/pamoja-architecture.md` (and sync with `AGENTS.md`):

```markdown
# PAMOJA PREMIUM — ANTIGRAVITY AGENT GOVERNANCE RULES (.agents/rules/pamoja-architecture.md)

1. VISUAL CONTINUITY MANDATE:
   - Never replace the Pamoja design language. Always use 'Outfit' for headings, 'Inter' for body, Slate-900 dark cards for Course Catalog & Continue Learning banners, Cyan-to-Blue gradients (`from-cyan-500 to-blue-600`) for primary actions, and `rounded-[2rem]` card geometry.
   - Anonymous sessions MUST default to `role: 'guest'` and render `<MarketingLanding />` until explicit authentication.

2. PEDAGOGICAL, SIMULATION & AI GROUNDING MANDATE:
   - Courses MUST follow the 10-Module structure with rich Sub-Topics, Resource-Stratified Practical Application Deep-Dives (Gold-Standard vs. HC III/IV Resource-Adapted Protocol), and Option-Specific Conditional Feedback (each option A, B, C, D has its own tailored clinical feedback).
   - Never allow manual "Mark as Complete" bypassing when a quiz or clinical simulation is present.
   - Sub-topic quizzes must evaluate answers immediately on click, show option-specific feedback, and trigger a 3-second auto-advance countdown once all questions in the sub-topic are answered correctly.
   - All AI Remedial Micro-Modules and Dr. Pam clinical responses MUST be strictly grounded in the Professor's authored curriculum and approved MoH guidelines (Zero-Hallucination RAG).
   - Support Cross-Course AI Dynamic Pathways by indexing sub-topics as Atomic Learning Units (ALUs) and calculating fractional royalties for contributing professors based on seat-time share.

3. ZERO-TRUST CPD ESCROW, LDHF & RBAC MANDATE:
   - Enforce the 10-Tier RBAC system (`guest`, `learner`, `coordinator`, `convener`, `creator`, `reviewer`, `registrar`, `support`, `auditor`, `superuser`).
   - For `requiresLab: true` courses, completing 100% of modules places points in `pendingPoints` (`THEORY_ESCROW`). Only an accredited `convener` or `superuser` submitting a passed OSCE Rubric (>= 80% on all stations) releases `pendingPoints` into `cpdPoints`.
   - Enforce Pre-Test vs. Post-Test regression checks: if `postTestScore < preTestScore` or `< 80%`, trigger a Professor-Grounded AI Remedial Micro-Module.
   - Support the 8-12 Week LDHF Facility Practice Loop verified via Dual-Clinician QR Handshake by the Facility Practice Coordinator (`coordinator`).

4. FINTECH & CRYPTOGRAPHIC SMART-VOUCHER MANDATE:
   - Support Mobile Money (M-Pesa, MTN MoMo, Airtel Money via Paystack/Flutterwave), Card payments, and Cryptographic Geo-Fenced Smart Vouchers (`allowedRegions`, `allowedFacilityTiers`, `allowedCadres`).
   - Never unlock paid courses from client-side state alone in production; verify via signed webhooks or cryptographic voucher validation.
```

---

## 13. Complete Baseline Codebase State & Component Inventory (Pre-Upgrade Snapshot for Antigravity IDE)

This section provides **Google Antigravity IDE** with the exact, line-for-line state of the Pamoja codebase across all layers so that autonomous agents understand what has already been built and tested, and can evolve it cleanly without regressions.

### 13.1 Repository Directory Tree (`pamoja-web` + `gas-backend`)
```text
pamoja/
├── Pamoja_Platform_Developer_Specs.md   <-- THIS MASTER ARCHITECTURE BLUEPRINT
├── .agents/
│   └── rules/
│       └── pamoja-architecture.md       <-- Antigravity Agent Governance Rules
├── gas-backend/
│   └── Code.js                          <-- Google Apps Script Atomic Lab & Sheet Ledger
└── pamoja-web/
    ├── .env.local                       <-- Firebase & Gemini API Keys
    ├── AGENTS.md                        <-- Agent Context Sync File
    ├── CLAUDE.md                        <-- Secondary Agent Context File
    ├── next.config.mjs                  <-- Next.js + PWA Configuration
    ├── package.json                     <-- Dependencies (Next, React, Firebase, Lucide)
    ├── public/
    │   ├── manifest.json                <-- Offline-First PWA Manifest
    │   ├── sw.js                        <-- Workbox Service Worker
    │   └── workbox-4754cb34.js
    ├── lib/
    │   └── firebase.js                  <-- Firebase Client SDK Initialization
    ├── components/
    │   ├── AuthProvider.js              <-- Auth Context & Role State
    │   ├── Navbar.js                    <-- Top Navigation Bar
    │   ├── AIAssistant.js               <-- Dr. Pam Clinical AI Floating Widget
    │   └── Footer.js
    └── app/
        ├── globals.css
        ├── layout.js
        ├── page.js                      <-- Marketing Landing + Learner Dashboard
        ├── courses/
        │   └── [id]/
        │       └── page.js              <-- Interactive Course Player & Quizzes
        ├── labs/
        │   └── page.js                  <-- Regional Simulation Lab Booking
        ├── practitioners/
        │   └── page.js                  <-- Verified Practitioner Directory
        ├── profile/
        │   └── page.js                  <-- Clinical Profile, CPD Sync & Authority ID
        └── studio/
            └── page.js                  <-- Educator Studio & Course Builder
```

---

### 13.2 Baseline File 1: Google Apps Script Backend (`gas-backend/Code.js`)
This is the current Google Apps Script ledger (`Code.js`) that provides `LockService` atomic slot booking for physical Simulation Labs and Google Sheets synchronization:

```javascript
/**
 * Pamoja Platform - Google Apps Script Backend (API)
 * This script turns a Google Sheet into a REST API & Atomic Ledger for the Next.js frontend.
 * 
 * Required Sheets:
 * 1. Users (id, name, email, role, created_at)
 * 2. Courses (id, title, description, cover_url, price)
 * 3. Labs (id, location, date, time, total_slots, booked_slots)
 * 4. Bookings (id, user_id, lab_id, status, created_at)
 */

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // Replace with production Google Sheet ID

function getSheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

function sheetToJSON(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

function doGet(e) {
  const action = e.parameter.action;
  let response = { success: false, message: "Unknown action" };

  try {
    if (action === "getCourses") {
      const sheet = getSheet("Courses");
      response = { success: true, data: sheetToJSON(sheet) };
    } 
    else if (action === "getLabs") {
      const sheet = getSheet("Labs");
      response = { success: true, data: sheetToJSON(sheet) };
    }
    else if (action === "getUserBookings") {
      const userId = e.parameter.userId;
      const sheet = getSheet("Bookings");
      const bookings = sheetToJSON(sheet).filter(b => b.user_id == userId);
      response = { success: true, data: bookings };
    }
    else {
      response = { success: false, message: "No valid action provided for GET" };
    }
  } catch (err) {
    response = { success: false, error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let response = { success: false, message: "Unknown action" };
  
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === "bookLab") {
      response = handleLabBooking(postData.userId, postData.labId);
    } 
    else if (action === "registerUser") {
      const sheet = getSheet("Users");
      const newId = Utilities.getUuid();
      sheet.appendRow([newId, postData.name, postData.email, "learner", new Date().toISOString()]);
      response = { success: true, data: { id: newId } };
    }
  } catch (err) {
    response = { success: false, error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle Atomic Lab Booking to prevent overbooking
 */
function handleLabBooking(userId, labId) {
  const lock = LockService.getScriptLock();
  
  if (!lock.tryLock(5000)) {
    return { success: false, message: "System is busy, please try again." };
  }

  try {
    const labsSheet = getSheet("Labs");
    const labsData = labsSheet.getDataRange().getValues();
    
    let labRowIndex = -1;
    let lab = null;
    
    for (let i = 1; i < labsData.length; i++) {
      if (labsData[i][0] == labId) {
        labRowIndex = i + 1;
        lab = {
          totalSlots: parseInt(labsData[i][4]),
          bookedSlots: parseInt(labsData[i][5])
        };
        break;
      }
    }

    if (!lab) return { success: false, message: "Lab not found" };
    if (lab.bookedSlots >= lab.totalSlots) return { success: false, message: "Lab is fully booked" };

    labsSheet.getRange(labRowIndex, 6).setValue(lab.bookedSlots + 1);

    const bookingsSheet = getSheet("Bookings");
    const bookingId = Utilities.getUuid();
    bookingsSheet.appendRow([bookingId, userId, labId, "CONFIRMED", new Date().toISOString()]);

    return { success: true, message: "Booking confirmed", bookingId: bookingId };
  } catch (err) {
    return { success: false, error: err.toString() };
  } finally {
    lock.releaseLock();
  }
}
```

---

### 13.3 Baseline File 2: Complete Interactive Application (`App.jsx` Unified Prototype)
Below is the complete, working code of our unified React + Tailwind + Firebase Firestore + Gemini 3 Flash application (`App.jsx`). Antigravity IDE can use this file either as a single-file reference or decompose its components directly into the `pamoja-web/app/` and `pamoja-web/components/` Next.js App Router structure:

```jsx
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { 
  Stethoscope, Calendar, User, BookOpen, LogOut, Award, Presentation, Bell,
  PlayCircle, Clock, ArrowRight, Shield, Target, Image as ImageIcon,
  CheckCircle, PlusCircle, Video, FileText, Settings, Edit3, Trash2, Save, X, Users, GripVertical,
  MapPin, Search, Globe, ShieldCheck, Activity, Sparkles, Bot, ChevronRight, Zap,
  Check, AlertTriangle, MessageSquare, CreditCard, Lock,
  Play, DollarSign, Tag, Info, RefreshCw, Pin, Unlock, Book, FileAudio, LayoutDashboard, Link2Off,
  ShieldAlert, Upload, Mail, BarChart, MessageCircle, TrendingUp, CheckSquare
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, onSnapshot, deleteDoc, updateDoc, addDoc, getDocs } from 'firebase/firestore';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'pamoja-v8';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Strict Firestore Paths for Security
const getCoursesRef = () => collection(db, 'artifacts', appId, 'courses');
const getUsersRef = () => collection(db, 'artifacts', appId, 'users');
const getLabsRef = () => collection(db, 'artifacts', appId, 'labs');
const getPromosRef = () => collection(db, 'artifacts', appId, 'promos');
const getMessagesRef = () => collection(db, 'artifacts', appId, 'messages');
const getProgressRef = (uid) => collection(db, 'artifacts', appId, 'users', uid, 'progress');

const AuthContext = createContext();
const ToastContext = createContext();
const DataContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-md px-4">
        {toasts.map(t => (
          <div key={t.id} className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl text-white font-semibold text-sm flex items-center gap-3 transition-all animate-in slide-in-from-bottom-5
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`bg-white rounded-[2rem] shadow-2xl w-full ${maxWidth} overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[90vh]`}>
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

// --- DATA PROVIDER ---
const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [labs, setLabs] = useState([]);
  const [promos, setPromos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    let unsubs = [];
    setLoadingData(true);

    const loadData = async () => {
      try {
        unsubs.push(onSnapshot(getCoursesRef(), (snap) => {
          const docs = []; snap.forEach(d => docs.push({ id: d.id, ...d.data() }));
          setCourses(docs);
        }, (err) => console.warn(err)));

        unsubs.push(onSnapshot(getLabsRef(), (snap) => {
          const docs = []; snap.forEach(d => docs.push({ id: d.id, ...d.data() }));
          setLabs(docs);
        }, (err) => console.warn(err)));

        unsubs.push(onSnapshot(getPromosRef(), (snap) => {
          const docs = []; snap.forEach(d => docs.push({ id: d.id, ...d.data() }));
          setPromos(docs);
        }, (err) => console.warn(err)));

        unsubs.push(onSnapshot(getMessagesRef(), (snap) => {
          const docs = []; snap.forEach(d => docs.push({ id: d.id, ...d.data() }));
          setMessages(docs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }, (err) => console.warn(err)));

        unsubs.push(onSnapshot(getUsersRef(), (snap) => {
          const docs = []; snap.forEach(d => docs.push({ id: d.id, ...d.data() }));
          setUsersList(docs);
        }, (err) => console.warn(err)));

        setTimeout(() => setLoadingData(false), 800);
      } catch(err) {
        setLoadingData(false);
      }
    };
    
    loadData(); 
    return () => unsubs.forEach(u => u());
  }, [user]);

  return (
    <DataContext.Provider value={{ courses, labs, promos, messages, usersList, loadingData }}>
      {children}
    </DataContext.Provider>
  );
};
const useData = () => useContext(DataContext);

// --- AUTH PROVIDER ---
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (initialAuthToken) await signInWithCustomToken(auth, initialAuthToken);
        else await signInAnonymously(auth);
      } catch (e) {
        setLoading(false);
      }
    };
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        onSnapshot(doc(db, 'artifacts', appId, 'users', currentUser.uid), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setProfile(data);
            if (!data.onboardingComplete && data.role !== 'guest') setOnboardingOpen(true);
          } else {
            setProfile({ role: 'guest', onboardingComplete: false, cpdPoints: 0, pendingPoints: 0, isPublic: false, purchasedCourses: [], isVerified: false, courseProgress: {} });
          }
          setLoading(false);
        }, (err) => {
           setProfile({ role: 'guest', onboardingComplete: false, cpdPoints: 0, pendingPoints: 0, isPublic: false, purchasedCourses: [], isVerified: false, courseProgress: {} });
           setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    if (!auth.currentUser) initAuth();
    return unsubscribe;
  }, []);

  const handleSecureLogin = async (email, name) => {
    try {
      let currentUid = user?.uid;
      if (!currentUid) {
        const cred = await signInAnonymously(auth);
        currentUid = cred.user.uid;
      }

      const isSuper = email.toLowerCase() === 'admin@pamoja.com';
      const userRole = isSuper ? 'superuser' : 'learner';

      const userProfile = {
        id: currentUid,
        email,
        name,
        role: userRole,
        onboardingComplete: false,
        cpdPoints: 0,
        pendingPoints: 0,
        courseProgress: {},
        purchasedCourses: [],
        isPublic: false,
        isVerified: false,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'artifacts', appId, 'users', currentUid), userProfile, { merge: true });
      
      setAuthModalOpen(false);
      setOnboardingOpen(true);
      addToast(isSuper ? "Welcome, Super Admin!" : "Securely signed in!", "success");
    } catch (err) {
      addToast("Sign in failed. Please try again.", "error");
    }
  };

  const handleLogout = async () => {
    try {
       await setDoc(doc(db, 'artifacts', appId, 'users', user.uid), { role: 'guest', onboardingComplete: false }, { merge: true });
       setProfile({...profile, role: 'guest', onboardingComplete: false});
       addToast("Logged out successfully");
    } catch(e) {}
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, setAuthModalOpen, logout: handleLogout }}>
      {children}
      {/* Onboarding & Login Modals omitted for brevity in snippet; see App.jsx for full JSX */}
    </AuthContext.Provider>
  );
};
```
*(Note: The full $990$-line `App.jsx` file is preserved in the repository root and includes `<Navbar />`, `<MarketingLanding />`, `<HomeView />`, `<CourseView />`, `<LabsView />`, `<StudioView />`, `<AdminView />`, `<DirectoryView />`, `<ProfileView />`, and `<AIMentor />`.)*

---

### 13.4 Baseline Seed Data Schema (The 3 Grounded 10-Module Courses)
When seeding Firestore (`courses` collection) or generating the static curriculum JSONs (`pamoja-web/lib/seedCourses.js`), Antigravity agents must use the **3 Source-Grounded Courses** already compiled in our workspace (`elearning-courses-curriculum-v3.md`):
1. **Course 1:** *Comprehensive Peer Educator Training for HIV & PMTCT Care* (10 Modules, 30 Sub-Topics, 30 Multi-Option Conditional Feedback Quizzes, `requiresLab: true`, `cpd: 15`).
2. **Course 2:** *Culturally Competent Family Support & The Wraparound Process (RAICES / Promotoras Model)* (10 Modules, 30 Sub-Topics, 30 Conditional Quizzes, `requiresLab: false`, `cpd: 12`).
3. **Course 3:** *Group Antenatal and Postnatal Care: The GC_1000 Implementation Framework* (10 Modules, 30 Sub-Topics, 30 Conditional Quizzes, `requiresLab: true`, `cpd: 15`).
4. **Course 4 (Simulation Showcase):** *National EMOTIVE & Helping Mothers Survive (BABC 3.0) PPH Refresher* (Includes the interactive **EMOTIVE Bundle Sequencer**, **Voice SBAR Handover Simulator**, **3D WebAR Calibrated Drape & Bimanual Compression Station**, and **3 Digital OSCE Station Rubrics**).

---

## 14. How to Continue Directly from Here into Google Antigravity IDE (Step-by-Step Bridge Protocol)

Yes! You can transition **directly** from our work here into **Google Antigravity IDE** (`antigravity.google`) so that its autonomous multi-agents pick up at the exact line of code we reached and build out the v6.0 enterprise capabilities.

### Step 1: Prepare Your Local Project Folder (2 Minutes)
1. Unzip your `pamoja - Copy_2.zip` folder onto your computer (e.g., `C:\Projects\pamoja` or `~/Projects/pamoja`).
2. Export/download the two artifacts from this workspace into that root folder:
   * Save **this document** as `Pamoja_Platform_Developer_Specs.md` in the root of `pamoja-web/`.
   * Save our **`App.jsx`** artifact as `pamoja-web/components/PamojaUnifiedPrototype.jsx` (so Antigravity has every single UI component, quiz countdown timer, Gemini API call, and Studio/Admin dashboard we built right at its fingertips).
   * Save `elearning-courses-curriculum-v3.md` into `pamoja-web/lib/curriculum-source.md`.
3. Create the folder `pamoja-web/.agents/rules/` and copy the rules block from **Section 12** above into `pamoja-web/.agents/rules/pamoja-architecture.md` (and also paste it into `pamoja-web/AGENTS.md`).

---

### Step 2: Open in Google Antigravity IDE & Configure MCP Connections
1. Launch **Google Antigravity IDE** and click **Open Workspace** $\rightarrow$ select `pamoja-web`.
2. In the Antigravity sidebar, open **MCP Servers** and enable:
   * **Firebase MCP** (links Antigravity directly to your Firestore collections, Auth, and Security Rules).
   * **Google Workspace / Apps Script MCP** (optional, to deploy `gas-backend/Code.js` updates directly).
3. Switch Antigravity from *Editor View* to **Agent Manager View (Mission Control)**.

---

### Step 3: Copy-Paste These 4 Sequential (or Parallel) Prompts into Antigravity Manager View

In **Antigravity Manager View**, you can spawn parallel agents. Copy and paste these exact prompts to have Antigravity upgrade your Next.js app using everything we designed:

#### Prompt for Agent 1 (Core UI Continuity, 10-Tier RBAC & Seed Curriculum)
```text
@Pamoja_Platform_Developer_Specs.md @components/PamojaUnifiedPrototype.jsx @lib/curriculum-source.md

Task: Synchronize our Next.js App Router (`app/`) with our unified prototype (`components/PamojaUnifiedPrototype.jsx`) and Section 3 & Section 11 of `Pamoja_Platform_Developer_Specs.md`:
1. Preserve the exact Outfit/Inter typography, Slate-900 dark course cards, Cyan-to-Blue gradients, and `rounded-[2rem]` geometry.
2. Implement the 10-Tier RBAC system (`guest`, `learner`, `coordinator`, `convener`, `creator`, `reviewer`, `registrar`, `support`, `auditor`, `superuser`) and Cryptographic VIP Role Invite link handling in `AuthProvider.js`.
3. Create `lib/seedCourses.js` containing the complete 10-module curricula and option-specific conditional feedback quizzes from `lib/curriculum-source.md` plus the EMOTIVE PPH simulation course.
4. Use the Browser Agent to verify that unauthenticated users see `<MarketingLanding />` and that logging in as `admin@pamoja.com` unlocks the Educator Studio, Convener Portal, and Super Admin Command Center.
```

#### Prompt for Agent 2 (Interactive Course Player, Resource-Stratified AI, Simulations & WebAR)
```text
@Pamoja_Platform_Developer_Specs.md @app/courses/[id]/page.js @components/PamojaUnifiedPrototype.jsx

Task: Upgrade the Course Player (`app/courses/[id]/page.js`) according to Sections 4, 5, and 7 of `Pamoja_Platform_Developer_Specs.md`:
1. Implement Sub-Topic Gamified Quizzes with option-specific conditional feedback (each option A, B, C, D shows its specific clinical rationale) and the 3-second auto-advance countdown timer.
2. Add the "Resource-Stratified Clinical Protocol Toggle" in each sub-topic so learners can switch between the "Gold-Standard Tertiary Protocol" and the "Rural HC III / HC IV Resource-Adapted Stabilization Protocol".
3. Build the interactive Clinical Simulation block supporting Engine A (Time-Critical Action Sequencer with live BP/HR/Blood Loss clock), Engine B (Voice/Structured SBAR Handover Grader via Gemini API), and Engine D (3D WebAR Pocket Manikin viewer).
4. Implement the Pre-Test vs. Post-Test Regression Guardrail: if `postTestScore < preTestScore` or `< 80%`, lock CPD disbursement and trigger a Professor-Grounded Gemini Remedial Coaching modal.
```

#### Prompt for Agent 3 (Educator Studio, AI Document Compiler & Cross-Course Pathway Royalties)
```text
@Pamoja_Platform_Developer_Specs.md @app/studio/page.js @components/PamojaUnifiedPrototype.jsx

Task: Upgrade the Educator Studio (`app/studio/page.js`) and build the Cross-Course AI Pathway Weaver according to Sections 4 and 6 of `Pamoja_Platform_Developer_Specs.md`:
1. Port all Educator Studio tabs from `PamojaUnifiedPrototype.jsx` (Analytics Dashboard, Curriculum Authoring, Sim Lab Scheduler, Student Progress LMS Tracker, and Q&A Desk).
2. Add the "AI Document-to-Curriculum Compiler" and "No-Code Clinical Simulation Generator" buttons powered by Gemini structured JSON output.
3. Build the "Cross-Course AI Precision Pathway Architect" where learners/directors can weave sub-topics across multiple courses, and implement the Fractional Professor Royalty split ledger ($P_i = R_{net} \times 0.70 \times (M_i / M_{total})$) in the Studio Analytics tab.
```

#### Prompt for Agent 4 (OSCE Convener Portal, 8–12 Week LDHF Loop & FinTech Smart-Vouchers)
```text
@Pamoja_Platform_Developer_Specs.md @app/labs/page.js @gas-backend/Code.js

Task: Implement the Zero-Trust CPD Escrow, LDHF Loop, and FinTech Smart-Voucher Engine according to Sections 2, 8, and 9 of `Pamoja_Platform_Developer_Specs.md`:
1. In `app/labs/page.js`, add the "OSCE Examiner / Convener Portal" with digital station rubrics (AMTSL, Retained Placenta, EMOTIVE Bundle) and the 8-12 Week LDHF Weekly Facility Drill tracker with Dual-Clinician Ephemeral QR Handshake and Facility Commodity Readiness pulse.
2. Build the Multi-Rail Checkout Modal supporting Mobile Money (M-Pesa, MTN MoMo, Airtel Money via Paystack/Flutterwave), Card (Stripe), and Cryptographic Geo-Fenced Smart Vouchers (`PMJ-UG-WNL-...` locked by `allowedRegions`, `allowedFacilityTiers`, and `allowedCadres`).
3. Update `gas-backend/Code.js` to append verified CPD certificates and monthly Medical Board statutory batch returns (`UMDPC`, `HPCSA`, `KMPDC`).
```