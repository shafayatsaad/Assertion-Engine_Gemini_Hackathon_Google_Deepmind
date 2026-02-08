<div align="center">

<!-- ANIMATED HEADER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:10B981,50:06B6D4,100:8B5CF6&height=220&section=header&text=Assertion%20Engine&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=AI-Powered%20Academic%20Research%20Validation&descAlignY=55&descSize=18&descColor=ffffff" width="100%" />

<!-- LANGUAGE TOGGLE -->
[ 🇬🇧 English ](README.md) | [ 🇯🇵 日本語 ](README_JP.md)

<br />


<!-- GITHUB STATS -->
<!-- 
[![Stars](https://img.shields.io/github/stars/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind?style=for-the-badge&logo=github&color=yellow)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/stargazers)
[![Forks](https://img.shields.io/github/forks/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind?style=for-the-badge&logo=github&color=blue)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/fork)
[![Issues](https://img.shields.io/github/issues/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind?style=for-the-badge&logo=github&color=red)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues)
[![License](https://img.shields.io/github/license/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind?style=for-the-badge&color=green)](https://opensource.org/licenses/MIT)

<br />
-->

<!-- TECH BADGES -->
[![Gemini 3](https://img.shields.io/badge/Gemini_3-Google_DeepMind-4285F4?style=flat-square&logo=google&logoColor=white)](https://gemini3.devpost.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

<br />

<p>
  <b>Assertion Engine</b> is a next-generation research validation platform that allows academics to <b>stress-test their hypotheses</b> before committing time, money, and reputation. Using the power of <b>Gemini 3 API</b>, it analyzes papers, identifies logical vulnerabilities, scans for novelty conflicts, and provides actionable pivot recommendations.
</p>

<br />

<!-- ACTION BUTTONS -->
[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-10B981?style=for-the-badge&labelColor=1E293B)](https://assertionengine.vercel.app/)
[![Star This Repo](https://img.shields.io/badge/⭐_Star_This_Repo-Support_Us-FFD700?style=for-the-badge&labelColor=1E293B)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-Issues-EF4444?style=for-the-badge&labelColor=1E293B)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues)
[![Request Feature](https://img.shields.io/badge/✨_Request_Feature-Ideas-8B5CF6?style=for-the-badge&labelColor=1E293B)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🚨 Problem Statement](#-problem-statement)
- [✨ Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📡 API Documentation](#-api-documentation)
- [🤖 Agent Descriptions](#-agent-descriptions)
- [🎬 Demo Scenario](#-demo-scenario)
- [👥 Team](#-team)

---

## 🎯 Overview

**Assertion Engine** is built for the **Gemini 3 Hackathon** by Google DeepMind. It provides an AI-powered validation layer that helps researchers validate their work before publication.

### Why Assertion Engine?

- 🎯 **Validation First**: Test your thesis before investing months of research.
- 🔬 **Statistical Rigor**: AI-powered analysis using Gemini 3's advanced reasoning.
- 💡 **Actionable Insights**: Get specific recommendations, not generic feedback.
- ⚡ **Real-time Processing**: Instant analysis with 1.2ms average response time.

---

## 🚨 Problem Statement

In academia, research doesn't fail with an error message—it fails **months later** when peer reviewers find flaws, or **after publication** when prior art is discovered.

| Problem | Impact |
|---------|--------|
| ❌ **Wasted Resources** | Months of work on flawed hypotheses |
| ❌ **Reputation Damage** | Publishing easily-refutable claims |
| ❌ **Novelty Conflicts** | Unknown prior art discovered post-publication |
| ❌ **Logic Gaps** | Undetected flaws in methodology |

> **Manual validation is time-consuming and error-prone.** Assertion Engine automates the validation pipeline—saving time, protecting reputation, and increasing research quality.

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

## 🏗️ System Architecture

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

### Data Flow

1. **User** submits research hypothesis → Routed to **Mentor AI Agent**
2. Structured analysis flows → **Novelty Scanner Agent**
3. Risk assessment generated by **Strategy Duel Agent**
4. Outputs aggregated and displayed on dashboard
5. Follow-up queries → Routed to **Q&A Agent**

---

## 🛠️ Tech Stack

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

- Node.js 18+
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
```

_Dashboard runs on `http://localhost:5173`_

### Production Build

```bash
npm run build
npm run preview
```

---

## 📡 API Documentation

### Base Integration

The platform uses **Gemini 3 API** for all AI-powered analysis. Here's how it integrates:

```typescript
// lib/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeHypothesis = async (content: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

### Supabase Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data (name, email, institution) |
| `projects` | Research projects with hypothesis data |
| `analysis_results` | Cached AI analysis results |

---

## 🤖 Agent Descriptions

### 1. Mentor AI Agent
| Attribute | Description |
|-----------|-------------|
| **Role** | Analyzes hypothesis structure; identifies logical weaknesses and assumptions |
| **Input** | Raw hypothesis text or research abstract |
| **Output** | Structured feedback with improvement recommendations |

### 2. Novelty Scanner Agent
| Attribute | Description |
|-----------|-------------|
| **Role** | Detects prior art conflicts; calculates similarity scores |
| **Input** | Abstract + optional full document |
| **Output** | Risk score (0-100%), conflicting papers list, differentiation analysis |

### 3. Specimen Lab Agent
| Attribute | Description |
|-----------|-------------|
| **Role** | Tests data samples against methodology assumptions |
| **Input** | Data samples + research methodology |
| **Output** | Simulation results, potential data issues, risk assessment |

### 4. Strategy Duel Agent
| Attribute | Description |
|-----------|-------------|
| **Role** | Stress-tests methodology against competing theories |
| **Input** | User methodology + research field |
| **Output** | Counterarguments, weakness identification, strength assessment |

---

## 🎬 Demo Scenario

### Research Context
A PhD student testing a hypothesis about "AI-driven climate prediction models."

### Sample Workflow

```
1. User signs up → Creates new project
2. Enters hypothesis: "Deep learning models can predict regional 
   climate patterns more accurately than traditional methods."
3. Mentor AI analyzes → Identifies 3 logical gaps
4. Novelty Scanner runs → Finds 85% novelty score (low risk)
5. Strategy Duel → Tests against 2 competing methodologies
```

### Expected Output

**📝 Mentor AI Feedback:**
- ✅ Hypothesis is testable and specific
- ⚠️ Needs clarification on "regional" scope
- ⚠️ Missing baseline comparison criteria

**📊 Novelty Score:**
| Metric | Value | Status |
|--------|-------|--------|
| Prior Art Risk | 15% | 🟢 Low |
| Methodology Overlap | 23% | 🟢 Low |
| Key Differentiator | Novel data fusion approach | ✅ Unique |

**⚔️ Strategy Duel:**
- Strength: Novel architecture approach
- Weakness: Limited to temperate regions
- Recommendation: Expand geographic scope in Phase 2

---

## 👥 Team

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
    <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/shafayatsaad/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://shafayatsaad.vercel.app/">
    <img src="https://img.shields.io/badge/Portfolio-000?style=flat-square&logo=vercel&logoColor=white" />
  </a>
  <a href="mailto:shafayat.saad30@gmail.com">
    <img src="https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white" />
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

| Attribute | Details |
|-----------|---------|
| **Event** | Gemini 3 Hackathon: Build What's Next |
| **Host** | Google DeepMind |
| **Prize Pool** | $100,000 |
| **Theme** | Machine Learning / AI, Open Ended, Social Good |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewAnalyzer`)
3. Commit your Changes (`git commit -m 'Add new validation module'`)
4. Push to the Branch (`git push origin feature/NewAnalyzer`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

<!-- FOOTER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:10B981,50:06B6D4,100:8B5CF6&height=120&section=footer" width="100%" />

**Made with ❤️ for the Gemini 3 Hackathon**

[![Website](https://img.shields.io/badge/🌐_Visit_Website-assertionengine.vercel.app-10B981?style=for-the-badge)](https://assertionengine.vercel.app/)

</div>
