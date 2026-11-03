# Pamoja Clinical Platform — Master Architecture & Antigravity IDE Specification

## 1. ROOT CAUSE OF THE DARK HERO BACKGROUND & HOW TO FIX IT IMMEDIATELY

> **WHY YOUR SCREENSHOT STILL SHOWS A DARK BACKGROUND BELOW A WHITE NAVBAR:**
> 1. Your `Navbar` turned white, proving `globals.css` loaded.
> 2. **However**, your Next.js page files (`app/page.js`, `app/labs/page.js`, `app/courses/[id]/page.js`, `app/studio/page.js`, `app/admin/page.js`) still contain **hardcoded Tailwind dark classes** (`bg-slate-950`, `bg-slate-900`, `bg-[#060b16]`, `from-slate-950`, `text-white`) directly on the `<section>` and `<div>` elements!
> 3. Even when the theme is `'light'`, a `<section className="bg-slate-950 text-white">` will always paint a black background.

### 1.1 Mandatory Rule for Antigravity IDE: Purge Hardcoded Dark Classes in `app/` and `components/`
Every `<main>`, `<section>`, `<header>`, and card `<div>` across all files in `app/` and `components/` **MUST** replace hardcoded `bg-slate-950` / `bg-slate-900` / `text-white` classes with theme-adaptive classes (`pamoja-shell`, `pamoja-card`, `pamoja-subcard`, `pamoja-text-main`, `pamoja-text-muted`) AND we also include a **CSS Light-Mode Override Guardrail** in `app/globals.css` so any leftover `bg-slate-950` or `bg-slate-900` is automatically converted to crisp white/slate-50 when in Light Mode!

---

## 2. DROP-IN `app/globals.css` (WITH AUTOMATIC LIGHT-MODE OVERRIDE GUARDRAIL)

Replace `pamoja-web/app/globals.css` with this exact file. It includes an automatic `html:not(.dark)` guardrail that forces any leftover `bg-slate-950` or `bg-slate-900` section in your Next.js pages to render in **Crisp Light Clinical (`#f8fafc` / `#ffffff`)** whenever Light Mode is active:

```css
@import "tailwindcss";

@layer base {
  :root {
    --bg-shell: #f8fafc;
    --bg-card: #ffffff;
    --bg-subcard: #f8fafc;
    --bg-nav: rgba(255, 255, 255, 0.95);
    --bg-input: #ffffff;
    --border-color: #e2e8f0;
    --border-input: #cbd5e1;
    --text-main: #0f172a;
    --text-muted: #64748b;
  }

  html.dark {
    --bg-shell: #060b16;
    --bg-card: #0d1526;
    --bg-subcard: #111c33;
    --bg-nav: rgba(13, 21, 38, 0.92);
    --bg-input: #060b16;
    --border-color: #1e293b;
    --border-input: #334155;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-shell) !important;
    color: var(--text-main) !important;
    margin: 0;
    transition: background-color 0.2s ease, color 0.2s ease;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, .font-outfit {
    font-family: 'Outfit', sans-serif;
  }
}

/* ============================================================================
   AUTOMATIC LIGHT-THEME ENFORCER FOR LEGACY HARDCODED DARK SECTIONS
   Ensures no section stays black (#020617 / #0f172a) when Light Mode is active
   ============================================================================ */
html:not(.dark) main,
html:not(.dark) section.bg-slate-950,
html:not(.dark) section.bg-slate-900,
html:not(.dark) div.bg-slate-950,
html:not(.dark) .min-h-screen.bg-slate-950 {
  background-color: #f8fafc !important;
  background-image: none !important;
  color: #0f172a !important;
}

html:not(.dark) .bg-slate-900:not(button):not(.badge-dark),
html:not(.dark) .bg-slate-900\/90,
html:not(.dark) .bg-slate-900\/80,
html:not(.dark) .bg-slate-900\/60,
html:not(.dark) .bg-slate-950\/80 {
  background-color: #ffffff !important;
  border-color: #e2e8f0 !important;
  color: #0f172a !important;
}

html:not(.dark) section h1.text-white,
html:not(.dark) section h2.text-white,
html:not(.dark) section h3.text-white,
html:not(.dark) .bg-slate-900 h1.text-white,
html:not(.dark) .bg-slate-900 h2.text-white,
html:not(.dark) .bg-slate-900 h3.text-white,
html:not(.dark) .bg-slate-900 .text-white {
  color: #0f172a !important;
}

html:not(.dark) section p.text-slate-300,
html:not(.dark) section p.text-slate-400,
html:not(.dark) .bg-slate-900 .text-slate-300,
html:not(.dark) .bg-slate-900 .text-slate-400 {
  color: #475569 !important;
}

.pamoja-shell {
  background-color: var(--bg-shell);
  color: var(--text-main);
}

.pamoja-nav {
  background-color: var(--bg-nav);
  color: var(--text-main);
}

.pamoja-card {
  background-color: var(--bg-card);
  border-color: var(--border-color);
  color: var(--text-main);
}

.pamoja-subcard {
  background-color: var(--bg-subcard);
  border-color: var(--border-color);
  color: var(--text-main);
}

.pamoja-input {
  background-color: var(--bg-input);
  border-color: var(--border-input);
  color: var(--text-main);
}

.pamoja-divider {
  border-color: var(--border-color);
}

.pamoja-text-muted {
  color: var(--text-muted);
}

.pamoja-text-main {
  color: var(--text-main);
}
```

---

## 3. DROP-IN REPLACEMENT FOR `pamoja-web/app/page.js` (CRISP LIGHT CLINICAL HERO & DASHBOARD)

See [`app/page.js`](file:///c:/Users/HP/Documents/Pamoja/pamoja-web/app/page.js) for the live Crisp Light Clinical Hero, Feature Pills, Course Catalog, Instant Voucher Bar, and Role-Aware Super Administrator vs. Clinician Dashboard.

---

## 4. MASTER ARCHITECTURE & ANTIGRAVITY IDE SPECIFICATION (v7.0)

### 4.1 Idempotent Practical Certification (Zero Double-Award CPD)
* **Check Escrow Balance:** The `handleGradeOsce` function in `app/labs/page.js` checks if candidate's `labPendingPoints > 0` before disbursing credits.
* **Instant Disable State:** `disabled={isSubmittingCertification || alreadyCertifiedForCourse || !canManageLabs}` prevents double-clicking during asynchronous transactions.
* **Immediate Zeroing:** `labPendingPoints` and `pendingPoints` are set to `0` immediately in both real-time user records and Escrow tables upon successful OSCE rubric submission (station averages >= 80%).

### 4.2 Persistent Light/Dark Theme User Preferences
* **LocalStorage Keys:** Hydrates and synchronizes with `'pmj_thm'` (with fallback to `'pamoja_theme_v10'` and `'pamoja_theme_v11'`).
* **Firestore Cloud Profile Sync:** For authenticated non-guest clinicians, `themePreference` syncs directly to `users/{uid}` in Firestore so preferences persist across different mobile and desktop devices.
* **Zero CSS Glitches:** Standard `.dark` class applied conditionally to the document root element with smooth 200ms background transitions.

### 4.3 Comprehensive Dropdowns with "Other (Specify)" Fallbacks
* **`SelectWithOther` component:** Used for Title, Cadre, Specialty, and Facility Tier. Selecting "Other" dynamically renders a required text input field allowing the clinician to manually specify their exact credential or clinic tier.
* **`CountrySelect` component:** Uses `<optgroup>` to pin primary operational hubs at the top ("📍 Pinned & Regional Hubs") including South Africa, Uganda, Kenya, Tanzania, Rwanda, Nigeria, and Ghana, followed by all African nations in alphabetical order ("🌍 All Countries (A–Z)"), and "Other Country (Specify)...".

### 4.4 AI Pedagogical Compiler Multi-Module Robust Regex
* **Canonical Function:** `parseRawCurriculumIntoModules` exported from `lib/curriculumParser.js`.
* **Boundary Regex:** Robust detection matching `/(?:^|\n)(?:#+\s*)?Module\s*(\d+)\s*[:\-–]\s*([^\n]+)/gi` and case-insensitive module/unit/section headers.
* **Attachment Preservation:** Retains attached files (video, audio, PDFs, docs) and attaches them to `topics[0].resources` and `mainVideoUrl`.
* **Rural Keyword Extraction:** Scans for keywords (`rural`, `hc iii`, `hc iv`, `low-resource`, `under-resourced`, `tamponade`, `nasg`) and maps them directly into dedicated `hc3Adaptation` and `ruralProtocol` fields.

### 4.5 Role Guards & Super Admin Clearance
* **No Irrelevant Student Metrics:** Super Admin (`superuser`), Registrar (`registrar`), and System Support (`support`) headers do not display student badges or pending practical counters.
* **Guest State:** Fully anonymous/guest profiles hide personal CPD metrics until explicit login or registration.
