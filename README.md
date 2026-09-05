# 🚀 ProjectPilot AI

> **AI-powered project management platform with smart task generation, team collaboration, and What-If simulation.**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-projectpilotai.netlify.app-6366f1?style=for-the-badge)](https://projectpilotai.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://projectpilotai.netlify.app)

---

## 🌐 Live Website

**[https://projectpilotai.netlify.app](https://projectpilotai.netlify.app)**

---

## ✨ Features

- 📊 **Smart Dashboard** — Real-time project metrics, progress tracking, and team overview
- 🤖 **AI Task Generation** — Auto-generate tasks and milestones powered by AI
- 🔮 **What-If Simulator** — Simulate project scenarios and predict outcomes
- 👥 **Team Management** — Manage team members, roles, and assignments
- 📋 **Task Tracker** — Kanban-style task management with priority and status
- 📈 **Reports & Analytics** — Visual reports with charts and insights
- 🆔 **Project ID Generator** — Generate unique project identifiers instantly

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) | React Framework (App Router) |
| [Prisma](https://prisma.io) | ORM & Database Layer |
| [SQLite](https://sqlite.org) | Database |
| [Netlify](https://netlify.com) | Deployment & Hosting |
| CSS / Glassmorphism | Premium UI Styling |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/amitkushwaha2311/promptwar.git
cd promptwar

# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma db push

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

This project is deployed on **Netlify**.

- **Live URL**: [https://projectpilotai.netlify.app](https://projectpilotai.netlify.app)
- Automatic deploys from the `main` branch via GitHub integration.

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Prisma database connection string |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/       # Main dashboard
│   ├── project/         # Project listing & details
│   │   └── [id]/        # Individual project dashboard
│   ├── tasks/           # Task management
│   ├── teams/           # Team management
│   ├── reports/         # Analytics & reports
│   ├── simulator/       # What-If simulator
│   └── generate-id/     # Project ID generator
├── components/          # Reusable UI components
├── lib/
│   └── db.ts            # Prisma client setup
└── ...
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

[MIT](LICENSE)

---

<p align="center">Made with ❤️ by <a href="https://github.com/amitkushwaha2311">Amit Kushwaha</a></p>
