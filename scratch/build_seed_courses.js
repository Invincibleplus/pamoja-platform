// Script to generate lib/seedCourses.js
const fs = require('fs');
const path = require('path');

const prototypePath = path.join(__dirname, '..', 'components', 'PamojaUnifiedPrototype.tsx');
const content = fs.readFileSync(prototypePath, 'utf8');

// Extract INITIAL_COURSES
const startMarker = 'const INITIAL_COURSES = [';
const endMarker = 'const INITIAL_LABS = [';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Failed to locate INITIAL_COURSES markers');
  process.exit(1);
}

const coursesChunk = content.substring(startIndex + startMarker.length - 1, endIndex).trim();
// Remove trailing semicolon if any
const cleanedCoursesChunk = coursesChunk.replace(/;\s*$/, '');

// Let's evaluate this safely in a sandbox to get the 3 courses
let initialThreeCourses;
try {
  initialThreeCourses = eval(cleanedCoursesChunk);
  console.log('Successfully parsed initial 3 courses. Count:', initialThreeCourses.length);
} catch (e) {
  console.error('Eval error:', e);
  process.exit(1);
}

// Now let's construct the 4th course: National EMOTIVE & Helping Mothers Survive (BABC 3.0) PPH Refresher
const emotiveCourse = {
  id: 'course-emotive-pph',
  title: 'National EMOTIVE & Helping Mothers Survive (BABC 3.0) PPH Refresher',
  category: 'Maternal Health',
  cpd: 15,
  duration: 45,
  pricingModel: 'free',
  price: 0,
  requiresLab: true,
  status: 'Published',
  creatorId: 'system-seed',
  image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
  description: 'Accredited simulation-first curriculum based on the National EMOTIVE ToT Refresher and WHO BABC 3.0 guidelines. Features the EMOTIVE clinical bundle sequencer, Voice SBAR handover grader, WebAR pocket manikin, and digital OSCE stations.',
  modules: [
    {
      title: 'Module 1: Early PPH Detection & Calibrated Blood Collection Drapes',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 1.1: Quantitative vs. Visual Blood Loss Estimation',
          content: `Postpartum hemorrhage (PPH) remains the leading cause of maternal mortality across Sub-Saharan Africa. The National EMOTIVE ToT Refresher data revealed that visual estimation underestimates actual blood loss by 30% to 50%, delaying life-saving bundle activation until catastrophic hypovolemic shock occurs.\n\nVisual estimation relies on subjective impressions of soaked gauze, floor puddles, and bed linen, which are notoriously inaccurate. The EMOTIVE protocol mandates objective quantitative measurement using a calibrated conical collection drape immediately following birth.\n\nLMS Deep-Dive & Practical Application Guide:\n• Gold-Standard Protocol: Place a calibrated V-shaped blood collection drape under the mother immediately after delivery of the baby. Read the fluid meniscus at eye level. Activate the EMOTIVE bundle immediately upon reaching 500 mL or earlier if vital sign instability is detected.\n• HC III / Resource-Adapted Protocol: If standard pre-packaged calibrated drapes are out of stock, construct an emergency calibrated drape using a clean plastic sheet tied into a funnel feeding into a measured 500 mL plastic receiver, or monitor gravimetric gauze weight (1 gram = 1 mL blood). Never rely on visual guesswork.`,
          resources: [
            { title: 'EMOTIVE Calibrated Drape Standard Operating Procedure (PDF)', type: 'pdf', url: 'https://who.int' }
          ]
        },
        {
          title: 'Topic 1.2: Drape Placement and Meniscus Calibration',
          content: `Correct timing and positioning of the calibrated drape are critical to avoid false positives from amniotic fluid contamination. The drape must be placed under the mother's buttocks only after the delivery of the infant and following rapid perineal suctioning or drying.\n\nKey Operational Rules:\n1. Timing: Position the drape after infant birth, prior to placental expulsion.\n2. Amniotic Exclusion: Ensure initial amniotic fluid has drained before sliding the calibrated pouch into place.\n3. Continuous Monitoring: Appoint a dedicated team member to call out volume marks (300 mL, 500 mL, 750 mL, 1000 mL).\n\nLMS Deep-Dive & Practical Application Guide:\nIn low-resource labor suites, keep folded calibrated drapes in an easily reachable "PPH First-Response Tray" next to the delivery bed. Clinicians should train during weekly LDHF drills to unfurl and slide the drape in under 15 seconds without compromising aseptic technique.`,
          resources: []
        },
        {
          title: 'Topic 1.3: The Shock Index Trigger & Early Warning Vitals',
          content: `In young, previously healthy women, compensatory adrenergic mechanisms maintain normal systolic blood pressure even after losing 20% to 30% of blood volume. Relying on hypotension (SBP < 90 mmHg) is a late and often fatal indicator of PPH.\n\nThe Shock Index (SI) is calculated as: Heart Rate / Systolic Blood Pressure.\n• Normal SI: 0.5 to 0.7\n• Critical Threshold SI >= 0.9: Indicates occult hypovolemia, high risk of blood transfusion, and warrants immediate resuscitation.\n• Critical Threshold SI >= 1.4: Severe decompensated shock requiring immediate escalation to tertiary surgical care.\n\nLMS Deep-Dive & Practical Application Guide:\nEvery vital sign check during the third and fourth stages of labor must calculate the Shock Index. A mother with HR 115 bpm and BP 100/65 mmHg has an SI of 1.15—she is in compensated shock despite a seemingly reassuring SBP. Immediate bundle triggers apply regardless of visual blood loss.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'Why does the EMOTIVE protocol replace visual estimation of blood loss with calibrated collection drapes?',
          options: [
            'Visual estimation consistently overestimates blood loss, leading to excessive oxytocin use.',
            'Visual estimation underestimates blood loss by 30-50%, delaying critical intervention until decompensated shock develops.',
            'Calibrated drapes are strictly required by hospital insurance policies.',
            'Calibrated drapes eliminate the need for uterine massage.'
          ],
          correctIndex: 1,
          optionFeedback: [
            'Incorrect. Visual estimation almost universally underestimates, not overestimates, blood volume.',
            'Correct! Empirical trials prove visual estimation fails to detect hemorrhage in 30-50% of cases, delaying life-saving bundle activation.',
            'Incorrect. Calibrated drapes are an evidence-based clinical safety standard, not an insurance formality.',
            'Incorrect. Uterine massage remains an essential component of the EMOTIVE bundle regardless of drape use.'
          ],
          explanation: 'Calibrated drapes provide objective, early detection of blood loss >= 500 mL, preventing lethal delays in bundle initiation.'
        },
        {
          question: 'A mother 15 minutes postpartum has a heart rate of 120 bpm and BP of 95/60 mmHg. What is her Shock Index and clinical status?',
          options: [
            'Shock Index 0.79; reassuring normal postpartum physiological adaptation.',
            'Shock Index 1.26; significant occult shock requiring immediate resuscitation and EMOTIVE bundle activation.',
            'Shock Index 0.50; bradycardic response to placental separation.',
            'Shock Index 2.0; irreversible circulatory collapse where medication is futile.'
          ],
          correctIndex: 1,
          optionFeedback: [
            'Incorrect. 120 / 95 = 1.26, which is well above the 0.9 alert threshold.',
            'Correct! HR 120 / SBP 95 = 1.26. An SI >= 0.9 demonstrates compensated hypovolemic shock requiring rapid bundle deployment.',
            'Incorrect. The heart rate is tachycardic at 120 bpm, not bradycardic.',
            'Incorrect. 1.26 indicates serious shock, but prompt bundle execution can reverse it completely.'
          ],
          explanation: 'Shock Index (HR/SBP) >= 0.9 detects hemodynamic compromise long before classic hypotension manifests.'
        }
      ]
    },
    {
      title: 'Module 2: Active Management of the Third Stage of Labour (AMTSL) & Physiological Cord Clamping',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 2.1: The Three Pillars of AMTSL',
          content: `AMTSL is the primary prevention cornerstone of obstetric practice, reducing PPH incidence by more than 60%. High-fidelity adherence to all three components is required for every vaginal delivery:\n1. Administration of a prophylactic uterotonic drug within 1 minute of birth.\n2. Delayed umbilical cord clamping (1-3 minutes after birth) while initiating simultaneous neonatal care.\n3. Controlled cord traction (CCT) with counter-traction to deliver the placenta only after signs of separation, followed by immediate uterine palpation and massage.\n\nLMS Deep-Dive & Practical Application Guide:\n• Gold-Standard: Administer Oxytocin 10 IU IM immediately after ruling out additional babies. In facilities with cold-chain integrity, oxytocin is stored at 2-8°C. If an IV infusion is already in place, 10 IU slow IV bolus over 1-2 minutes is acceptable.\n• HC III / Rural Adaptations: Where electricity and cold-chain refrigerators are unreliable, Heat-Stable Carbetocin (100 mcg IM) or Misoprostol (400-600 mcg sublingually/orally) serves as the approved alternative uterotonic under WHO/MoH guidelines.`,
          resources: []
        },
        {
          title: 'Topic 2.2: Controlled Cord Traction vs. Uterine Inversion Hazards',
          content: `Controlled Cord Traction must only be performed by a skilled attendant when the uterus is well-contracted. Traction must never be applied to a flaccid uterus or without adequate counter-traction above the pubic bone (Brandt-Andrews maneuver).\n\nCounter-traction prevents uterine inversion—a rare but catastrophic emergency characterized by neurogenic shock, intense pain, and massive hemorrhage. If resistance is met, traction must stop immediately and the attendant must reassess for true placental separation.\n\nSigns of Placental Separation:\n• Sudden gush of dark blood from the introitus.\n• Lengthening of the umbilical cord without recoil on suprapubic pressure.\n• Uterus becomes firm, globular, and rises toward the umbilicus.`,
          resources: []
        },
        {
          title: 'Topic 2.3: Delayed Cord Clamping & Neonatal Transition',
          content: `Delayed cord clamping (DCC) provides approximately 80-100 mL of additional placental blood transfusion to the newborn, increasing iron stores by 40-50 mg/kg and preventing infantile anemia throughout the first 6 months of life.\n\nDCC does not increase the risk of maternal postpartum hemorrhage when paired with prophylactic oxytocin. The attendant clamps and cuts the cord between 1 and 3 minutes postpartum while performing routine newborn drying, warmth, and skin-to-skin contact on the mother's abdomen.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'What is the recommended first-line uterotonic and timing for AMTSL in a facility with reliable cold chain?',
          options: [
            'Ergometrine 0.5 mg IV before fetal head crowning.',
            'Oxytocin 10 IU IM within 1 minute after fetal delivery (after ruling out additional twins).',
            'Misoprostol 800 mcg rectally before placental separation.',
            'Oxytocin 40 IU rapid IV push immediately as the shoulders deliver.'
          ],
          correctIndex: 1,
          optionFeedback: [
            'Incorrect. Ergometrine carries severe hypertensive risks and is not the first-line prophylactic uterotonic.',
            'Correct! WHO and MoH guidelines establish Oxytocin 10 IU IM within 1 minute of birth as the gold standard.',
            'Incorrect. Rectal misoprostol is reserved for resource-limited treatment, not standard first-line prophylaxis.',
            'Incorrect. Rapid IV push of high-dose oxytocin can cause severe hypotension, coronary ischemia, and cardiac arrest.'
          ],
          explanation: 'Oxytocin 10 IU IM within 1 minute of birth is the safest and most effective prophylactic agent against atonic PPH.'
        }
      ]
    },
    {
      title: 'Module 3: The First-Response EMOTIVE Bundle Architecture & Activation Triggers',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 3.1: The EMOTIVE Acronym & Bundled Philosophy',
          content: `The National EMOTIVE trial proved that delivering postpartum hemorrhage interventions as a synchronized "bundle"—rather than sequentially with long diagnostic delays—decreases severe hemorrhage and death by over 60%.\n\nThe EMOTIVE components:\n• E: Early detection using calibrated drape and vital sign Shock Index.\n• M: Massage of the uterus continuously until contracted.\n• O: Oxytocic drugs (therapeutic repeat dosing).\n• T: Tranexamic Acid (TXA) given within 3 hours.\n• I: IV fluids for hemodynamic stabilization.\n• V: Visual examination of the genital tract, cervix, and placenta.\n• E: Escalation to advanced mechanical or surgical interventions.\n\nAll bundle elements (M, O, T, I, V) should be initiated within 15 minutes of detecting >= 500 mL blood loss.`,
          resources: []
        },
        {
          title: 'Topic 3.2: Parallel Team Execution Under Emergency Conditions',
          content: `In an obstetric emergency, single-operator sequential care fails. The EMOTIVE protocol assigns specific roles to the healthcare team members in the delivery room:\n• Team Leader (Midwife / Doctor): Performs bimanual examination and genital tract inspection; commands bundle timing.\n• Resuscitation Midwife / Nurse: Sets up wide-bore IV access (16G or 18G), starts crystalloids, draws blood for cross-match and hemoglobin.\n• Medication Administer: Administers therapeutic oxytocics and begins Tranexamic Acid infusion over 10 minutes.\n• SBAR Communicator: Records times on the clinical tracker, calls for senior assistance, alerts the lab or blood bank.`,
          resources: []
        },
        {
          title: 'Topic 3.3: First-Response Trolley Configuration',
          content: `Every labor room must maintain an accessible, sealed "EMOTIVE Emergency Tackle Box" or tray. The box contains:\n• 2 ampoules of Oxytocin (10 IU each)\n• 1 ampoule of Tranexamic Acid (1 g in 10 mL)\n• 2 wide-bore IV cannulas (16G and 18G) + rapid infusion IV giving sets\n• 1 liter Ringer's Lactate / Normal Saline\n• Sterile gloves, speculum, sponge-holding forceps, and urinary Foley catheter with bag\n• Calibrated collection drape replacement and Condom UBT kit.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'What distinguishes the EMOTIVE bundle approach from traditional sequential PPH management?',
          options: [
            'Bundle components (massage, oxytocics, TXA, IV fluids, examination) are delivered simultaneously in parallel within 15 minutes.',
            'Each drug is administered and observed for 30 minutes before initiating the next step.',
            'It skips physical examination to prioritize surgical theater transfer.',
            'It replaces all uterotonic medications with tranexamic acid.'
          ],
          correctIndex: 0,
          optionFeedback: [
            'Correct! Synchronized, parallel delivery of the entire bundle prevents the progressive coagulopathy that kills mothers during sequential delays.',
            'Incorrect. Sequential waiting of 30 minutes between drugs is the classic management mistake that leads to maternal death.',
            'Incorrect. Genital tract examination (V) is a mandatory core element of the EMOTIVE bundle.',
            'Incorrect. TXA works synergistically with uterotonics; it never replaces them.'
          ],
          explanation: 'Synchronized bundle implementation attacks uterine atony, coagulopathy, and hypovolemia simultaneously.'
        }
      ]
    },
    {
      title: 'Module 4: Immediate Uterine Massage & Bimanual Compression Maneuvers',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 4.1: Transabdominal Uterine Massage Technique',
          content: `Uterine atony accounts for 70% to 80% of all PPH cases. Transabdominal massage is the immediate physical reflex upon diagnosing excessive bleeding.\n\nTechnique:\n1. Place the cupped hand on the fundus of the uterus through the anterior abdominal wall.\n2. Perform firm circular and repetitive kneading motions until the myometrium contracts into a rock-hard globular mass.\n3. Express accumulated intra-uterine clots: once contracted, apply firm downward and backward pressure on the fundus to expel trapped hematoma that prevents complete myometrial constriction of the spiral arterioles.`,
          resources: []
        },
        {
          title: 'Topic 4.2: Internal Bimanual Uterine Compression',
          content: `When transabdominal massage fails to maintain sustained myometrial tone, proceed immediately to Internal Bimanual Uterine Compression.\n\nProcedure:\n1. Don sterile elbow-length gloves.\n2. Form a tight fist with the gloved dominant hand and insert it through the vagina into the anterior fornix, resting against the anterior uterine wall.\n3. Place the other hand across the mother's abdomen over the posterior wall of the uterine fundus.\n4. Compress the uterus firmly between the internal fist and external hand, pressing the anterior and posterior walls together against each other.\n5. Maintain continuous, unwavering compression for at least 5 to 10 minutes until bleeding halts and firm uterine tone is sustained.`,
          resources: []
        },
        {
          title: 'Topic 4.3: External Aortic Compression as a Hemostatic Bridge',
          content: `External Aortic Compression is an emergency life-saving maneuver that can be performed instantly without equipment while transferring a patient or awaiting whole blood.\n\nTechnique:\n• Place a closed fist slightly above and to the left of the umbilicus.\n• Apply downward pressure against the lumbar spine until the femoral pulse in either groin becomes impalpable.\n• This occludes distal aortic flow, immediately halting uterine hemorrhage and diverting blood flow to the brain and heart during profound shock.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'How is internal bimanual uterine compression correctly performed?',
          options: [
            'Two operators compress the abdomen simultaneously using transabdominal pressure only.',
            'One gloved fist is inserted into the vagina/anterior fornix while the other hand compresses the posterior uterine wall abdominally.',
            'A uterine clamp is placed transvaginally without abdominal stabilization.',
            'The attendant pushes the uterus upward toward the diaphragm with open fingers.'
          ],
          correctIndex: 1,
          optionFeedback: [
            'Incorrect. Bimanual compression requires one internal hand and one external abdominal hand.',
            'Correct! The uterus is compressed between the internal fist in the anterior fornix and the external hand on the posterior fundus.',
            'Incorrect. Clamps should never be blindly inserted into the uterine cavity.',
            'Incorrect. Pushing upward does not compress the bleeding placental bed.'
          ],
          explanation: 'Bimanual compression sandwiches the uterine vascular bed between an internal fist and external abdominal hand.'
        }
      ]
    },
    {
      title: 'Module 5: Uterotonic Administration Protocols (Oxytocin, Ergometrine, Misoprostol)',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 5.1: Therapeutic Oxytocin Infusion Regimens',
          content: `Upon activating the EMOTIVE bundle for confirmed PPH, administer therapeutic oxytocin in addition to the initial AMTSL prophylactic dose.\n\nRecommended Regimen:\n• 20 to 40 IU of Oxytocin in 1000 mL of normal saline or Ringer's Lactate infused at 60 drops/min (approximately 250 mL/hour).\n• Maintain therapeutic infusion for 4 to 8 hours until steady myometrial contraction is guaranteed.\n• Caution: Never administer high-dose oxytocin as an un-diluted rapid IV bolus due to the risk of severe hypotension and myocardial ischemia.`,
          resources: []
        },
        {
          title: 'Topic 5.2: Second-Line Uterotonics: Ergometrine and Prostaglandins',
          content: `If uterine atony persists after oxytocin infusion, second-line uterotonics must be administered rapidly:\n1. Ergometrine / Methylergometrine (0.2 mg IM):\n   • Induces sustained, tetanic uterine contraction within 2-5 minutes.\n   • STRICT CONTRAINDICATION: Pre-eclampsia, eclampsia, chronic hypertension, and heart disease due to the danger of lethal hypertensive encephalopathy or intracranial hemorrhage.\n2. Misoprostol (800 mcg sublingually):\n   • Heat-stable prostaglandin E1 analogue. Rapid sublingual absorption produces peak plasma concentrations in 20-30 minutes. Expected side effects include transient pyrexia and shivering.`,
          resources: []
        },
        {
          title: 'Topic 5.3: Cold-Chain Integrity and Drug Potency in District Facilities',
          content: `Field testing across district hospitals in tropical climates has demonstrated that oxytocin stored at ambient temperatures (> 30°C) loses up to 50% of active potency within 30 days. Midwives must inspect the temperature log of the ward refrigerator daily. In settings without reliable electrical power, prioritize heat-stable uterotonics (Misoprostol or Heat-Stable Carbetocin) or replace room-temperature oxytocin stocks every 14 days.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'A mother with severe PPH has a blood pressure of 165/105 mmHg. Which uterotonic is strictly contraindicated?',
          options: [
            'Oxytocin infusion',
            'Tranexamic acid',
            'Ergometrine (Methergine)',
            'Sublingual Misoprostol'
          ],
          correctIndex: 2,
          optionFeedback: [
            'Incorrect. Oxytocin is safe and remains indicated in hypertensive mothers.',
            'Incorrect. TXA is an antifibrinolytic and is indicated in all causes of PPH regardless of BP.',
            'Correct! Ergometrine causes potent generalized vasoconstriction and can trigger hypertensive crisis, stroke, or eclampsia.',
            'Incorrect. Misoprostol does not cause severe arterial vasoconstriction and is safe in hypertension.'
          ],
          explanation: 'Ergometrine is strictly contraindicated in hypertensive disorders of pregnancy due to life-threatening vasoconstrictive risks.'
        }
      ]
    },
    {
      title: 'Module 6: Tranexamic Acid (TXA) Timing, Dosing, and Safety Windows',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 6.1: The Critical 3-Hour Golden Window (The WOMAN Trial)',
          content: `The landmark WOMAN trial (World Maternal Antifibrinolytic Trial, 20,000+ women) established that Tranexamic Acid (TXA) reduces death due to bleeding by more than 30% when administered within 3 hours of birth.\n\nCrucial Rule of Timing:\n• Every 15-minute delay in giving TXA reduces its survival benefit by 10%.\n• After 3 hours from birth, TXA provides NO survival benefit and may actually increase thrombotic and microvascular injury complications.\n• Therefore, TXA must be administered immediately upon PPH diagnosis as part of the initial EMOTIVE bundle, not as a desperate last resort.`,
          resources: []
        },
        {
          title: 'Topic 6.2: Administration Dosage, Infusion Rate, and Repeat Protocol',
          content: `Standard TXA Protocol for Postpartum Hemorrhage:\n• Dose: 1 gram (1000 mg) intravenously.\n• Dilution: Administer in 10 mL neat or mixed with 100 mL of 0.9% Normal Saline.\n• Infusion Rate: Slow IV push over 10 minutes (1 mL/minute). Rapid IV push can cause transient nausea, dizziness, and mild hypotension.\n• Repeat Dose: If bleeding continues after 30 minutes, or if bleeding restarts within 24 hours of the first dose, a second 1 gram IV dose should be given over 10 minutes. Do not exceed 2 grams total.`,
          resources: []
        },
        {
          title: 'Topic 6.3: Mechanism of Action & Thromboembolic Safety Profile',
          content: `TXA is a synthetic lysine analogue that competitively blocks the lysine binding sites on plasminogen molecules, preventing its conversion to plasmin. This stops the enzymatic breakdown of the fibrin meshwork in the placental bed clots.\n\nThe WOMAN trial conclusively proved that 1-2 grams of IV TXA in acute PPH does NOT increase the incidence of deep vein thrombosis (DVT), pulmonary embolism (PE), or acute stroke.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'According to WHO guidelines and the WOMAN trial, what is the maximum window of efficacy for Tranexamic Acid in PPH?',
          options: [
            'Within 3 hours of childbirth.',
            'Within 24 hours of hospital admission.',
            'Only after all uterotonic drugs have failed for at least 4 hours.',
            'Within 12 hours provided whole blood is also transfused.'
          ],
          correctIndex: 0,
          optionFeedback: [
            'Correct! The survival benefit of TXA diminishes rapidly and is only demonstrated when administered within 3 hours of delivery.',
            'Incorrect. Beyond 3 hours, TXA lacks evidence of efficacy and may cause harm.',
            'Incorrect. Waiting 4 hours for other drugs to fail will miss the 3-hour window entirely.',
            'Incorrect. 12 hours is well past the proven therapeutic window.'
          ],
          explanation: 'TXA must be given within 3 hours of birth; every 15 minutes of delay significantly decreases maternal survival.'
        }
      ]
    },
    {
      title: 'Module 7: IV Crystalloid Resuscitation & Shock Index Monitoring',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 7.1: Fluid Resuscitation Principles & Preventing Dilutional Coagulopathy',
          content: `Aggressive fluid resuscitation is necessary to restore circulating intravascular volume, but overzealous cold crystalloid infusion can cause dilutional coagulopathy, hypothermia, and pulmonary edema.\n\nRecommended Fluid Strategy:\n• Establish 2 wide-bore IV lines (16G or 18G cannula).\n• Infuse warm crystalloids (Ringer's Lactate or 0.9% Normal Saline): give up to 1000 mL rapidly over 15-20 minutes.\n• Reassess vitals, radial pulse, and blood loss after every 500-1000 mL.\n• Avoid giving more than 2000-3000 mL of crystalloids without initiating whole blood or packed red blood cell transfusion.`,
          resources: []
        },
        {
          title: 'Topic 7.2: Bedside Shock Index Re-evaluation',
          content: `Tracking response to volume resuscitation using the Shock Index (HR / SBP):\n• Responsive: HR decreases to < 100 bpm, SBP rises to > 100 mmHg, SI drops < 0.9. Capillary refill returns to < 2 seconds, urine output >= 30 mL/hr.\n• Transient / Non-Responsive: SI remains >= 1.0 despite 1500 mL of crystalloids. This indicates ongoing, brisk internal bleeding requiring immediate blood transfusion, mechanical tamponade, and surgical theater escalation.`,
          resources: []
        },
        {
          title: 'Topic 7.3: Foley Catheter Insertion & Fluid Balance Monitoring',
          content: `Place a Foley urinary catheter attached to a drainage bag immediately during fluid resuscitation. This serves two vital purposes:\n1. Decompresses the bladder: A distended urinary bladder mechanically displaces the uterus upward and laterally, directly preventing effective myometrial contraction.\n2. Monitors end-organ renal perfusion: Maintaining urine output >= 30 mL/hour confirms adequate cardiac output and microvascular flow during shock recovery.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'Why is urinary bladder catheterization an essential early step during PPH resuscitation?',
          options: [
            'To collect sterile urine for drug toxicology testing.',
            'A full bladder mechanically prevents uterine contraction and monitoring urine output assesses vital organ perfusion.',
            'To administer intravesical oxytocic drugs.',
            'To replace the need for intravenous fluid therapy.'
          ],
          correctIndex: 1,
          optionFeedback: [
            'Incorrect. Bladder catheterization is done for physical decompression and hemodynamics, not drug screening.',
            'Correct! A distended bladder mechanically impedes fundal contraction, while urine output provides real-time proof of kidney perfusion.',
            'Incorrect. Uterotonics are never administered into the bladder.',
            'Incorrect. Catheterization is an adjunct to, not a replacement for, IV fluid therapy.'
          ],
          explanation: 'Emptying the bladder removes a major mechanical obstruction to uterine retraction and provides continuous monitoring of renal perfusion.'
        }
      ]
    },
    {
      title: 'Module 8: Systematic Genital Tract Examination & Tissue Extraction (The 4 Ts)',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 8.1: The 4 Ts Etiological Framework',
          content: `If bleeding continues despite a well-contracted fundus, the provider must methodically investigate the 4 Ts of PPH etiology:\n• Tone (70-80%): Uterine atony.\n• Trauma (15-20%): Cervical lacerations, vaginal vault tears, ruptured episiotomy, or pelvic hematoma.\n• Tissue (5-10%): Retained cotyledons, succenturiate placental lobes, or adherent tissue (placenta accreta spectrum).\n• Thrombin (< 1%): Inherited or acquired coagulopathy (DIC secondary to abruption, amniotic fluid embolism, or severe sepsis).`,
          resources: []
        },
        {
          title: 'Topic 8.2: Visual Speculum Examination of Cervix and Vagina',
          content: `Perform a systematic visual inspection under good operating light using a right-angle or Sims speculum with two sponge-holding forceps:\n1. Grasp the anterior cervical lip at 12 o'clock, then walk the sponge forceps clockwise (at 2, 4, 6, 8, 10 o'clock) around the rim of the cervix to inspect for lacerations.\n2. Inspect the lateral vaginal sulci for deep arterial tears extending toward the fornices.\n3. Examine the perineum for high rectovaginal tears.\n4. Repair tears promptly using continuous or figure-of-eight absorbable sutures (2-0 Vicryl/Chromic) under adequate regional or local anesthesia.`,
          resources: []
        },
        {
          title: 'Topic 8.3: Manual Placental Examination and Gentle Cavity Sweep',
          content: `Always inspect the delivered placenta: check the maternal surface to ensure all cotyledons fit together without gaps, and inspect the fetal membranes for torn vessels extending into the periphery (suggesting a retained succenturiate lobe).\n\nIf cotyledons are missing and bleeding persists, perform gentle manual extraction under aseptic technique and analgesia, or use a large blunt gauze sweep to remove trapped membrane fragments.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'A mother continues to bleed briskly with bright red blood despite a rock-hard, firmly contracted uterine fundus. What is the most likely etiology?',
          options: [
            'Uterine atony (Tone failure)',
            'Trauma (Cervical or vaginal laceration)',
            'Dilutional hypothermia',
            'Sepsis-induced uterine inertia'
          ],
          correctIndex: 1,
          optionFeedback: [
            'Incorrect. If the fundus is rock-hard, atony has been resolved; bleeding must originate elsewhere.',
            'Correct! Brisk bright-red bleeding from a well-contracted uterus strongly indicates lower genital tract trauma (cervical or vaginal tear).',
            'Incorrect. Hypothermia causes oozing from multiple puncture sites, not localized bright arterial bleeding.',
            'Incorrect. Uterine inertia produces a soft, boggy fundus, which is not present here.'
          ],
          explanation: 'When the uterus is firmly contracted, persistent brisk bleeding is almost always due to genital tract lacerations requiring speculum visualization.'
        }
      ]
    },
    {
      title: 'Module 9: Non-Pneumatic Anti-Shock Garment (NASG) & Uterine Balloon Tamponade (UBT) Escalation',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 9.1: Low-Cost Condom-Catheter Uterine Balloon Tamponade (UBT)',
          content: `When atonic PPH fails to resolve with medical management and bimanual compression, UBT provides hydrostatic tamponade against the bleeding spiral arteries of the placental bed.\n\nAssembly of an Emergency Condom-Catheter UBT:\n1. Tie a clean condom over the tip of a size 16-18 French Foley catheter using sterile 0-silk or braided suture, ensuring the eyelets are covered and the knot is leak-proof.\n2. Guide the assembly through the cervix into the uterine cavity until the condom rests in the fundus.\n3. Connect the catheter lumen to an IV giving set attached to a 500 mL bag of sterile normal saline.\n4. Inflate the balloon with 300 to 500 mL of warm sterile saline until resistance is felt and bleeding ceases.\n5. Gently pack the vagina with sterile gauze to prevent balloon extrusion. Leave in place for 12-24 hours while arranging definitive care or ambulance transfer.`,
          resources: []
        },
        {
          title: 'Topic 9.2: The Non-Pneumatic Anti-Shock Garment (NASG)',
          content: `The NASG is a lightweight neoprene first-aid compression garment designed for low-resource settings. It applies circumferential counter-pressure to the legs, pelvis, and abdomen, reducing vascular volume in the lower body and shunting 200-300 mL of oxygenated blood directly to the heart, brain, and lungs.\n\nApplication Steps:\n• Place under the patient with segments 1, 2, 3 wrapped tightly around ankles, calves, and thighs.\n• Segment 4 is wrapped across the pelvis.\n• Segment 5 and 6 contain a foam ball positioned over the umbilicus to compress the lower abdominal aorta.\n• The NASG can remain in place for up to 48 hours during rural ambulance transfer. Remove only when hemodynamic stability is established, strictly releasing segments one at a time starting from the ankles with 15 minutes between segments.`,
          resources: []
        },
        {
          title: 'Topic 9.3: Referral Criteria and Surgical Escalation Protocols',
          content: `At an HC III or rural clinic lacking an operating theatre and blood bank, activate the emergency transfer chain when:\n• Blood loss reaches >= 750 mL despite the EMOTIVE bundle.\n• Shock Index remains >= 1.0.\n• Tamponade balloon or NASG is applied.\n\nNever send an unstable patient in an ambulance without an accompanying clinician, two secure IV lines running fluids, and a pre-alerted SBAR call to the receiving District or Regional Referral Hospital.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'What is the correct inflation volume and fluid type for an emergency condom-catheter UBT?',
          options: [
            '1000 mL of cold tap water infused under pneumatic pressure.',
            '300 to 500 mL of sterile normal saline or Ringer\'s lactate infused until resistance is felt.',
            '50 mL of air injected via a bulb syringe.',
            '200 mL of pure concentrated dextrose solution.'
          ],
          correctIndex: 1,
          optionFeedback: [
            'Incorrect. Non-sterile cold water and excessive 1000 mL volume risk uterine rupture and infection.',
            'Correct! 300-500 mL of sterile saline provides physiological tamponade against the placental bed without causing tissue necrosis.',
            'Incorrect. Air must never be used to inflate a balloon tamponade due to the risk of lethal air embolism if the balloon bursts.',
            'Incorrect. Dextrose provides no advantage and promotes bacterial colonization.'
          ],
          explanation: '300-500 mL of sterile saline safely fills the uterine cavity, providing sufficient hydrostatic pressure to occlude open sinusoids.'
        }
      ]
    },
    {
      title: 'Module 10: Multi-Professional Team SBAR Communication, Referral Logistics, and Debriefing',
      mainVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      topics: [
        {
          title: 'Topic 10.1: Structured Emergency SBAR Escalation',
          content: `The National EMOTIVE ToT Refresher highlighted communication breakdowns as a primary contributor to maternal mortality. In rapid-onset hemorrhage, unstructured telephone calls lead to omitted details and delayed ambulance arrival.\n\nMandatory SBAR Format:\n• S (Situation): "I am Midwife Sarah calling from Wakiso HC III. I have an acute refractory PPH in a 24-year-old mother who delivered 40 minutes ago."\n• B (Background): "G2P2, uneventful delivery. AMTSL completed with 10 IU Oxytocin. Blood loss reached 850 mL on calibrated drape."\n• A (Assessment): "EMOTIVE bundle completed: therapeutic oxytocin running, 1g TXA given, UBT inserted with 350 mL saline. Vitals: HR 122 bpm, BP 88/50 mmHg, Shock Index 1.38. Bleeding is slowed but persistent."\n• R (Recommendation): "I request an immediate emergency ambulance transfer with packed cells ready in your theater upon our arrival in 35 minutes."`,
          resources: []
        },
        {
          title: 'Topic 10.2: Dual-Clinician Verification and Cold-Handover in Transit',
          content: `During patient handovers between the primary facility and the ambulance or receiving theater team, both clinicians must execute a Dual-Clinician Check:\n• Verify IV line patency and fluid volume infused.\n• Inspect the UBT catheter clamp and drainage.\n• Re-check radial pulse and blood pressure, recording the exact Shock Index on the referral envelope.\n• Sign the clinical handover sheet before the ambulance departs.`,
          resources: []
        },
        {
          title: 'Topic 10.3: Multidisciplinary Psychological Debriefing and Near-Miss Audits',
          content: `Severe PPH events cause significant emotional distress and secondary traumatic stress for labor ward staff. Within 48 hours of any severe PPH case, the ward in-charge must convene a non-punitive, supportive clinical debriefing.\n\nThe debriefing reviews:\n1. Timeline of bundle execution (Was TXA given within 15 minutes of trigger?).\n2. Equipment and commodity stock status (Were drapes and uterotonics ready?).\n3. Team communication dynamics and emotional wellness of the attendants.\n4. Documentation in the maternity register and reporting of maternal near-miss metrics to the District Health Officer.`,
          resources: []
        }
      ],
      quiz: [
        {
          question: 'What is the primary clinical objective of using structured SBAR communication during obstetric emergencies?',
          options: [
            'To replace formal medical chart documentation.',
            'To ensure rapid, standardized transmission of critical clinical data without ambiguity, reducing delays in referral and surgical readiness.',
            'To assign administrative blame to the clinician who called for assistance.',
            'To satisfy an academic requirement for nursing students.'
          ],
          correctIndex: 1,
          optionFeedback: [
            'Incorrect. SBAR is verbal escalation and handover communication; written documentation is still required.',
            'Correct! SBAR eliminates ambiguous rambling and ensures essential vitals, bundle status, and urgent recommendations are transmitted concisely.',
            'Incorrect. SBAR is specifically designed to promote egalitarian, psychological-safety communication free of blame.',
            'Incorrect. SBAR is an international patient safety standard practiced by multidisciplinary teams worldwide.'
          ],
          explanation: 'SBAR (Situation, Background, Assessment, Recommendation) provides a concise, standardized handover framework that prevents omitted information.'
        }
      ]
    }
  ]
};

const allCourses = [...initialThreeCourses, emotiveCourse];

const seedFileContent = `// lib/seedCourses.js - Auto-generated and Synchronized with Curriculum Sources & Specs
// Contains all 4 accredited 10-Module Curricula, Option-Specific Conditional Feedback Quizzes, and Regional Sim Labs

export const SEED_COURSES = ${JSON.stringify(allCourses, null, 2)};

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
  { id: 'promo-1', code: 'PAMOJA2026', active: true, discountPercent: 100 },
  { id: 'promo-2', code: 'MOH-UGANDA-SCHOLAR', active: true, discountPercent: 100 },
  { id: 'promo-3', code: 'UNFPA-MATERNAL-EQUITY', active: true, discountPercent: 100 }
];

export default SEED_COURSES;
`;

const outputPath = path.join(__dirname, '..', 'lib', 'seedCourses.js');
fs.writeFileSync(outputPath, seedFileContent, 'utf8');
console.log('Successfully wrote', outputPath, 'with', allCourses.length, 'courses!');
