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
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex bg-[#090B14] text-slate-100 selection:bg-indigo-500 selection:text-white antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto relative">{children}</main>
        </div>
      </body>
    </html>
  );
}
