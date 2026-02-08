<div align="center">

<!-- HEADER BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,19,20,24&height=200&section=header&text=Assertion%20Engine&fontSize=60&fontAlignY=35&animation=fadeIn&desc=AI-Powered%20Academic%20Research%20Validation&descAlignY=55&descSize=18" width="100%" />

<!-- LANGUAGE TOGGLE -->
<br/>

[![English](https://img.shields.io/badge/🇺🇸_English-SELECTED-10B981?style=for-the-badge&labelColor=1E293B)](./README.md)
[![日本語](https://img.shields.io/badge/🇯🇵_日本語-CLICK_TO_SWITCH-64748B?style=for-the-badge&labelColor=1E293B)](./README_JP.md)

<br/>

<!-- TECH BADGES -->
[![Gemini 3](https://img.shields.io/badge/Gemini_3-Google_DeepMind-4285F4?style=flat-square&logo=google&logoColor=white)](https://gemini3.devpost.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

<br/>

<!-- ACTION BUTTONS -->
[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-assertionengine.vercel.app-00C853?style=for-the-badge&labelColor=1E293B)](https://assertionengine.vercel.app/)
[![GitHub](https://img.shields.io/badge/📂_SOURCE_CODE-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind)
[![Hackathon](https://img.shields.io/badge/🏆_HACKATHON-Gemini_3-8B5CF6?style=for-the-badge)](https://gemini3.devpost.com/)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🚨 Problem Statement](#-problem-statement)
- [✨ Features](#-features)
- [🏗 System Architecture](#-system-architecture)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🎬 Demo](#-demo)
- [👤 Developer](#-developer)
- [📄 License](#-license)

---

## 🎯 Overview

**Assertion Engine** is a next-generation research validation platform built for the **Gemini 3 Hackathon** by Google DeepMind. It allows researchers to **stress-test their hypotheses** before committing time, money, and reputation.

Using the power of **Gemini 3 API**, the platform analyzes academic papers, identifies logical vulnerabilities, scans for novelty conflicts, and provides actionable pivot recommendations.

### 🔑 Key Capabilities

| Module | Description |
|--------|-------------|
| 🧠 **Mentor AI** | Instant feedback from an academic AI core |
| 🔬 **Specimen Lab** | Test data samples in controlled environments |
| ⚔️ **Strategy Duel** | Pit methodologies against competing theories |
| 📊 **Novelty Scanner** | Detect prior art conflicts before publishing |

---

## 🚨 Problem Statement

Academic researchers face critical challenges:

| Problem | Impact |
|---------|--------|
| ❌ **Wasted Resources** | Months of work on flawed hypotheses |
| ❌ **Reputation Damage** | Publishing easily-refutable claims |
| ❌ **Novelty Conflicts** | Unknown prior art discovered post-publication |
| ❌ **Logic Gaps** | Undetected flaws in methodology |

> **Manual validation is time-consuming and error-prone.** Assertion Engine automates the validation pipeline—saving time, protecting reputation, and increasing the quality of published research.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure login/signup powered by Supabase |
| 📝 **Project Management** | Create, manage, and track research projects |
| 🧠 **Mentor AI Analysis** | AI-powered hypothesis validation with Gemini 3 |
| 🔬 **Specimen Lab** | Interactive data sample testing environment |
| 📊 **Novelty Scanner** | Prior art conflict detection with similarity scoring |
| ⚔️ **Strategy Duel** | Methodology stress-testing against rival theories |
| 📈 **Real-time Metrics** | Confidence scores, logic consistency, novelty index |
| 🎨 **Premium UI/UX** | Modern glassmorphism design with smooth animations |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                    React + TypeScript + Vite                            │
│         Landing Page | Dashboard | Analysis | Novelty Scanner           │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌───────────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│   Supabase Auth       │ │  Supabase DB    │ │   Gemini 3 API      │
│                       │ │                 │ │                     │
│ • User Management     │ │ • Profiles      │ │ • Hypothesis Check  │
│ • JWT Tokens          │ │ • Projects      │ │ • Novelty Analysis  │
│ • Session Handling    │ │ • Metrics       │ │ • Risk Assessment   │
└───────────────────────┘ └─────────────────┘ └─────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Component-based UI |
| **Build Tool** | Vite 5 | Fast development & bundling |
| **Styling** | Tailwind CSS + Custom CSS | Modern responsive design |
| **Animation** | Framer Motion | Smooth transitions & effects |
| **Auth & DB** | Supabase | Authentication & PostgreSQL |
| **AI Engine** | Google Gemini 3 API | Hypothesis validation & analysis |
| **Deployment** | Vercel | Global CDN hosting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind.git
cd Assertion-Engine_Gemini_Hackathon_Google_Deepmind

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
assertion-engine/
├── components/
│   ├── Hero.tsx              # Landing page hero section
│   ├── Navbar.tsx            # Navigation bar
│   ├── Dashboard.tsx         # Main dashboard
│   ├── AnalysisPage.tsx      # AI analysis interface
│   ├── NoveltyPage.tsx       # Novelty scanner
│   ├── SpecimenLab.tsx       # Data testing lab
│   └── ...                   # Other components
├── lib/
│   ├── supabase.ts           # Supabase client config
│   └── gemini.ts             # Gemini API integration
├── App.tsx                   # Main application router
├── AppContext.tsx            # Global state management
├── index.css                 # Global styles
└── package.json              # Dependencies
```

---

## 🎬 Demo

<div align="center">

[![Try Demo](https://img.shields.io/badge/🚀_TRY_LIVE_DEMO-assertionengine.vercel.app-10B981?style=for-the-badge&labelColor=1E293B)](https://assertionengine.vercel.app/)

</div>

### Demo Workflow

1. **Sign Up** — Create an account
2. **Create Project** — Add your research hypothesis
3. **AI Analysis** — Get instant validation feedback
4. **Novelty Scan** — Check for prior art conflicts
5. **Review Metrics** — View confidence scores

---

## 👤 Developer

<div align="center">
<table>
<tr>
<td align="center">
  <a href="https://github.com/shafayatsaad">
    <img src="https://github.com/shafayatsaad.png" width="120px" style="border-radius: 50%;" alt="Shafayat Saad"/>
    <br />
    <strong>Shafayat Saad</strong>
  </a>
  <br />
  <sub>Full-Stack Developer</sub>
  <br /><br />
  <a href="https://github.com/shafayatsaad">
    <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/shafayatsaad/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://shafayatsaad.vercel.app/">
    <img src="https://img.shields.io/badge/Portfolio-000?style=flat-square&logo=vercel&logoColor=white" alt="Portfolio" />
  </a>
  <a href="mailto:shafayat.saad30@gmail.com">
    <img src="https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="Email" />
  </a>
</td>
</tr>
</table>
</div>

---

## 🏆 Hackathon

<div align="center">

[![Gemini 3 Hackathon](https://img.shields.io/badge/Google_DeepMind-Gemini_3_Hackathon-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gemini3.devpost.com/)

</div>

This project was built for the **Gemini 3 Hackathon** hosted by **Google DeepMind**.

| Attribute | Details |
|-----------|---------|
| **Event** | Gemini 3 Hackathon: Build What's Next |
| **Host** | Google DeepMind |
| **Prize Pool** | $100,000 |
| **Theme** | Machine Learning / AI, Open Ended, Social Good |

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,19,20,24&height=100&section=footer" width="100%" />

Made with ❤️ for the Gemini 3 Hackathon

[![Website](https://img.shields.io/badge/🌐_VISIT_WEBSITE-assertionengine.vercel.app-10B981?style=for-the-badge)](https://assertionengine.vercel.app/)

</div>
