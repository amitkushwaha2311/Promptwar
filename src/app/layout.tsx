import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'ProjectPilot AI — From Idea to Viva, Your AI Project Mentor',
  description:
    'AI-powered final-year project mentor and evaluator. Generate project ideas, evaluate feasibility, build roadmaps, practice viva, and audit GitHub code for engineering students.',
  keywords: [
    'final year projects',
    'AI project generator',
    'btech projects',
    'viva preparation',
    'github analyzer',
    'project feasibility',
    'engineering roadmap',
    'AI code submission',
    'student project evaluator',
    'problem statement alignment',
  ],
  authors: [{ name: 'Amit Kushwaha', url: 'https://github.com/amitkushwaha2311' }],
  creator: 'Amit Kushwaha',
  openGraph: {
    title: 'ProjectPilot AI — AI Project Mentor for Final-Year Students',
    description: 'Generate AI-powered project ideas, roadmaps, code evaluations and viva practice for engineering students.',
    url: 'https://projectpilotai.netlify.app',
    siteName: 'ProjectPilot AI',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex bg-[#090B14] text-slate-100 selection:bg-indigo-500 selection:text-white antialiased overflow-hidden">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>

        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden" role="document">
          <Navbar />
          <main
            id="main-content"
            className="flex-1 overflow-y-auto relative"
            role="main"
            aria-label="Main application content"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
