```markdown
# PAMOJA PREMIUM — ANTIGRAVITY AGENT GOVERNANCE RULES (.agents/rules/pamoja-architecture.md)

1. VISUAL CONTINUITY MANDATE:
   - Never replace the Pamoja design language. Always use 'Outfit' for headings, 'Inter' for body, Slate-900 dark cards for Course Catalog & Continue Learning banners, Cyan-to-Blue gradients (`from-cyan-500 to-blue-600`) for primary actions, and `rounded-[2rem]` card geometry.
   - Anonymous sessions MUST default to `role: 'guest'` and render `<MarketingLanding />` until explicit authentication.

2. PEDAGOGICAL, SIMULATION & AI GROUNDING MANDATE:
   - Courses MUST follow a Dynamic, Content-Driven Modular Architecture (1 to 20+ Modules: 1–3 Module Rapid Refreshers, 4–8 Module Clinical Certificates, and 9+ Module Mastery Curricula) with rich Sub-Topics, Resource-Stratified Practical Application Deep-Dives (Gold-Standard vs. HC III/IV Resource-Adapted Protocol), and Option-Specific Conditional Feedback (each option A, B, C, D has its own tailored clinical feedback).
   - Never abbreviate "Modules" as "Mod" or "Mods" in UI badges or metrics; always write out "Module" or "Modules" clearly.
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
   - Support Mobile Money (M-Pesa, MTN MoMo, Airtel Money via Paystack/Flutterwave), Card payments, and Cryptographic Smart Vouchers (`PAMOJA2026`, `FREE100`, `PMJ-GLOBAL-100`, and Geo-Fenced NGO Grant Vouchers).
   - Support the 3-Path Student Voucher & Freemium Redemption Engine: (1) Dashboard Instant Voucher Bar, (2) Inline Freemium Module 2+ Gate inside the Course Player, and (3) URL Auto-Redeem (`?voucher=CODE`) + Voucher-First Checkout Modal.
```
