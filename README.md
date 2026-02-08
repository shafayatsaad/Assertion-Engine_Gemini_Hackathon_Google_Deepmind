<div align="center">

# 🧪 Assertion Engine

**AI-Powered Academic Research Validation Platform**

[ 🇬🇧 English ](README.md) | [ 🇯🇵 日本語 ](README_JP.md)

<br />

[![Gemini 3](https://img.shields.io/badge/Gemini_3-Google_DeepMind-4285F4?style=flat-square&logo=google&logoColor=white)](https://gemini3.devpost.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<p>
  <b>Assertion Engine</b> is a next-generation research validation platform that allows academics to <b>stress-test their hypotheses</b> before committing time, money, and reputation. Using the power of <b>Gemini 3 API</b>, it analyzes papers, identifies logical vulnerabilities, scans for novelty conflicts, and provides actionable pivot recommendations.
</p>

[🌐 Live Demo](https://assertionengine.vercel.app/) · [Report Bug](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues) · [Request Feature](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues)

</div>

---

## 💡 Project Concept

In academia, research doesn't fail with an error message—it fails **months later** when peer reviewers find flaws, or **after publication** when prior art is discovered.

**Assertion Engine** solves this by providing an AI-powered validation layer that:

1. **Validates Logic**: Uses Gemini 3 to analyze hypothesis structure and identify logical weaknesses.
2. **Scans Novelty**: Detects prior art conflicts with similarity scoring before you publish.
3. **Prescribes Pivots**: Recommends methodology improvements based on identified gaps.

### Core Research Principles

- 🎯 **Validation First**: Test your thesis before investing months of research.
- 🔬 **Statistical Rigor**: AI-powered analysis using state-of-the-art language models.
- 💡 **Actionable Insights**: Get specific recommendations, not generic feedback.

---

## 🚀 Key Features

### 🧠 Mentor AI — Intelligent Feedback Engine

- **Real-time Analysis**: Submit your hypothesis and get instant AI feedback.
- **Logical Weakness Detection**: Identifies gaps, assumptions, and potential counterarguments.
- **Improvement Suggestions**: Provides specific recommendations to strengthen your research.

### 🔬 Specimen Lab — Data Testing Environment

- **Controlled Simulations**: Test data samples against your methodology.
- **Historical Comparison**: Simulate outcomes based on existing datasets.
- **Risk Assessment**: Identify potential data-related issues before they become problems.

### 📊 Novelty Scanner — Prior Art Detection

- **Similarity Scoring**: Quantifies overlap with existing research (0-100% risk score).
- **Source Identification**: Shows exactly which papers conflict with your work.
- **Differentiation Analysis**: Highlights what makes your research unique.

### ⚔️ Strategy Duel — Methodology Stress-Testing

- **Competitive Analysis**: Pit your methodology against rival theories.
- **Debate Simulation**: AI generates counterarguments to find weak points.
- **Strength Assessment**: Understand where your approach excels vs. alternatives.

### 🔐 Secure Authentication

- **Supabase Auth**: Secure login/signup with email verification.
- **Project Management**: Save, track, and revisit your research validations.
- **User Profiles**: Customizable researcher profiles with institutional affiliations.

---

## 💻 Code Spotlight

Assertion Engine uses the Gemini 3 API to power its AI validation engine. Here's a snippet of the novelty analysis logic:

```typescript
// lib/gemini.ts - Novelty Analysis

const analyzeNovelty = async (abstract: string, fullDocument?: string) => {
  const prompt = `
    You are a rigorous academic novelty assessor.
    
    Analyze the following research for:
    1. Prior art conflicts (0-100% risk score)
    2. Key differentiators from existing work
    3. Specific papers that may conflict
    
    If the research contains unique elements like:
    - Novel mathematical models
    - Unique architectural approaches
    - Original datasets or methodologies
    
    Then LOWER the risk score significantly.
    
    Abstract: ${abstract}
    ${fullDocument ? `Full Document: ${fullDocument}` : ''}
  `;
  
  const response = await gemini.generateContent(prompt);
  return parseNoveltyResponse(response);
};
```

---

## 🏗️ Demo Scenarios

The platform supports various research validation scenarios:

| Scenario | Description | Use Case |
| :--- | :--- | :--- |
| **Quick Scan** | Abstract-only analysis | Early-stage hypothesis validation |
| **Deep Analysis** | Full document + abstract | Pre-submission review |
| **Novelty Check** | Prior art conflict detection | Patent/publication readiness |
| **Strategy Review** | Methodology stress-testing | Defending thesis proposals |

---

## 📁 Project Structure

```bash
assertion-engine/
├── components/           # React UI Components
│   ├── Hero.tsx          # Landing page hero section
│   ├── Dashboard.tsx     # Main user dashboard
│   ├── AnalysisPage.tsx  # AI analysis interface
│   ├── NoveltyPage.tsx   # Novelty scanner
│   ├── SpecimenLab.tsx   # Data testing lab
│   ├── Navbar.tsx        # Navigation component
│   └── ProfileDropdown.tsx # User menu
├── lib/                  # Utilities & API
│   ├── supabase.ts       # Supabase client config
│   └── gemini.ts         # Gemini API integration
├── App.tsx               # Main router & layout
├── AppContext.tsx        # Global state management
├── index.css             # Global styles
├── index.html            # HTML entry point
└── vite.config.ts        # Vite configuration
```

---

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Gemini API key

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind.git
cd Assertion-Engine_Gemini_Hackathon_Google_Deepmind

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Server

```bash
npm run dev
```

_Dashboard runs on `http://localhost:5173`_

### 4. Build for Production

```bash
npm run build
npm run preview
```

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

## 🤝 Contributing

Contributions to improve AI analysis accuracy or add new validation modules are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewAnalyzer`)
3. Commit your Changes (`git commit -m 'Add new validation module'`)
4. Push to the Branch (`git push origin feature/NewAnalyzer`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Maintainer

<div align="center">
<table>
<tr>
<td align="center">
  <a href="https://github.com/shafayatsaad">
    <img src="https://github.com/shafayatsaad.png" width="100px" style="border-radius: 50%;" alt="Shafayat Saad"/>
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

<div align="center">

**Made with ❤️ for the Gemini 3 Hackathon**

[![Website](https://img.shields.io/badge/🌐_Visit_Website-assertionengine.vercel.app-10B981?style=for-the-badge)](https://assertionengine.vercel.app/)

</div>
