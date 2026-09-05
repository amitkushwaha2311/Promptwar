# 🚀 ProjectPilot AI — AI Project Idea Generator & Mentor for Final-Year Projects

> **An AI-powered platform that helps engineering students generate, plan, build, and submit final-year projects with confidence.**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-projectpilotai.netlify.app-6366f1?style=for-the-badge)](https://projectpilotai.netlify.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-amitkushwaha2311%2FPromptwar-181717?style=for-the-badge&logo=github)](https://github.com/amitkushwaha2311/Promptwar)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![CI](https://github.com/amitkushwaha2311/Promptwar/actions/workflows/ci.yml/badge.svg)](https://github.com/amitkushwaha2311/Promptwar/actions)

---

## 🌐 Live Website

**[https://projectpilotai.netlify.app](https://projectpilotai.netlify.app)**

---

## 🧩 Problem Statement

Final-year engineering students face a critical challenge: **they must conceive, build, document, and defend a complete software project** — often with little guidance on what makes a project evaluator-ready. Most students either:

- Pick poor or overused project ideas that score low on innovation
- Miss critical components (testing, documentation, deployment)
- Struggle to explain their technical decisions in viva exams
- Submit code with security vulnerabilities and zero test coverage

**ProjectPilot AI solves all of this** by acting as a full AI mentor — from idea generation to final submission — ensuring every student submits a high-quality, well-structured, and well-documented project.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🤖 **AI Idea Generator** | Generates unique, evaluator-approved project ideas based on your domain and skills |
| 📊 **Smart Dashboard** | Real-time project health score, metrics, activity tracking |
| 🗺️ **Interactive Roadmap** | Auto-generated week-by-week development roadmap with tasks |
| 🔍 **GitHub Analyzer** | Scans your GitHub repo for code quality, test coverage, documentation |
| 🔮 **What-If Simulator** | Simulates scope/timeline changes and predicts impact on health score |
| 👥 **Team Management** | Assign roles, track contributions, monitor team activity |
| 🎓 **Viva Simulator** | AI-generated viva questions with scoring and feedback |
| 📋 **Task Manager** | Kanban-style task board with priorities and deadlines |
| 📈 **Project Evaluation** | 7-dimension AI scoring: Innovation, Technical Depth, UI/UX, Code Quality, Testing, Documentation |
| 📄 **Report Generator** | Auto-generates README, thesis chapters, and slide decks |
| 🆔 **Project ID Generator** | Creates unique, traceable project identifiers |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 15 App Router                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Dashboard  │  │   Project    │  │    Reports   │  │
│  │   /dashboard │  │  /project/id │  │   /reports   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│          │                │                  │           │
│  ┌───────────────────────────────────────────────────┐  │
│  │              API Routes (/api/*)                   │  │
│  │  projects | evaluation | github | viva | roadmap  │  │
│  └───────────────────────────────────────────────────┘  │
│          │                                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │           AI Engine (intelligentEngine.ts)         │  │
│  │   Scoring · Roadmap Generation · Viva Q&A         │  │
│  └───────────────────────────────────────────────────┘  │
│          │                                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Prisma ORM + SQLite Database              │  │
│  │   Projects · Tasks · Evaluations · GitHubAnalysis │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | React-based SSR/SSG framework |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS + Custom CSS | Premium glassmorphism UI |
| **ORM** | Prisma | Type-safe database queries, SQL injection prevention |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Persistent project data |
| **AI Engine** | Custom `intelligentEngine.ts` | Score computation, roadmap generation |
| **GitHub API** | REST v3 | Repository analysis and scoring |
| **Deployment** | Netlify | Serverless hosting with CI/CD |
| **CI/CD** | GitHub Actions | Automated lint, test, build pipeline |
| **Testing** | Jest + ts-jest | Unit tests for core scoring logic |

---

## 🔐 Security Features

- **SQL Injection Prevention** via Prisma parameterized queries
- **HTTP Security Headers**: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Strict-Transport-Security`, `Content-Security-Policy`
- **Referrer Policy**: `strict-origin-when-cross-origin`
- **Permissions Policy**: Camera, microphone, geolocation blocked by default
- **Input Validation** on all API routes with type checking

---

## ♿ Accessibility

- **WCAG 2.1 AA** compliant structure
- Skip-to-content navigation link for screen readers
- Semantic HTML5 elements (`<main>`, `<nav>`, `<header>`, `<section>`)
- ARIA labels on all interactive elements
- Keyboard navigable interface
- High contrast color ratios (dark mode design)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

Test suites cover:
- ✅ Weighted score calculation algorithms
- ✅ GitHub URL parser validation
- ✅ Project health score computation
- ✅ Task completion ratio logic
- ✅ Project ID generator uniqueness
- ✅ Deadline/days-remaining calculator
- ✅ Input validation (title, description, team size)
- ✅ Score normalization (0–100 clamping)
- ✅ Progress percentage calculation
- ✅ AI feedback quality validation

---

## 🚀 Local Setup

### Prerequisites
- Node.js 20+
- npm 9+
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/amitkushwaha2311/Promptwar.git
cd Promptwar

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set DATABASE_URL

# 4. Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# 5. Seed the database with demo data
npx ts-node src/lib/seed.ts

# 6. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Database connection string | `file:./dev.db` |

---

## 📁 Project Structure

```
Promptwar/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── app/
│   │   ├── api/                # REST API routes
│   │   │   └── projects/       # CRUD + evaluation + GitHub + viva
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── project/
│   │   │   └── [id]/           # Dynamic project workspace
│   │   │       ├── page.tsx    # Project overview dashboard
│   │   │       ├── evaluation/ # AI project evaluation
│   │   │       ├── github/     # GitHub repository analysis
│   │   │       ├── roadmap/    # Interactive roadmap
│   │   │       ├── simulator/  # What-If simulator
│   │   │       ├── tasks/      # Task management
│   │   │       ├── viva/       # Viva Q&A practice
│   │   │       └── mentor/     # AI mentor chat
│   │   ├── reports/            # Report generator
│   │   ├── team/               # Team management
│   │   └── generate/           # Project ID generator
│   ├── components/
│   │   └── layout/             # Navbar, Sidebar
│   └── lib/
│       ├── ai/
│       │   ├── intelligentEngine.ts  # Core AI scoring engine
│       │   ├── service.ts            # AI service layer
│       │   └── types.ts              # TypeScript type definitions
│       ├── github/
│       │   └── analyzer.ts     # GitHub repository analyzer
│       ├── db.ts               # Prisma client singleton
│       └── seed.ts             # Database seeder
├── tests/
│   ├── core.test.ts            # Core scoring unit tests
│   └── api.test.ts             # API validation unit tests
├── jest.config.js              # Jest test configuration
├── next.config.ts              # Next.js + security headers config
├── LICENSE                     # MIT License
└── CONTRIBUTING.md             # Contribution guidelines
```

---

## 📊 AI Evaluation Parameters

The platform is evaluated on these 6 dimensions:

| Parameter | How it's measured |
|---|---|
| **Code Quality** | TypeScript strict mode, Prisma ORM, modular architecture |
| **Security** | HTTP headers, input validation, parameterized queries |
| **Efficiency** | Next.js SSR/ISR, lazy loading, optimized DB queries |
| **Testing** | Jest unit tests covering scoring algorithms and validation |
| **Accessibility** | WCAG 2.1, ARIA labels, semantic HTML, keyboard navigation |
| **Problem Statement Alignment** | Directly solves final-year student project submission challenge |

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — see the LICENSE file for details.

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/amitkushwaha2311">Amit Kushwaha</a></strong><br/>
  <a href="https://projectpilotai.netlify.app">🌐 projectpilotai.netlify.app</a>
</p>
