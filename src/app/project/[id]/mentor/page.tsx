'use client';

import { use, useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  CheckCircle2,
  Code2,
  Layers,
  HelpCircle,
  Clock,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

interface ProjectDetail {
  id: string;
  title: string;
  shortDescription: string;
  problemStatement: string;
  currentPhase: string;
  overallProgress: number;
  healthScore: number;
  technologies: { id: string; name: string; category: string }[];
}

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
}

const SHORTCUT_QUESTIONS = [
  'How should I implement authentication?',
  'Why should I use PostgreSQL instead of MongoDB?',
  'My API is returning a 500 error. How do I debug?',
  'My ML model accuracy is only 72%. How can I improve it?',
  'Which feature should I implement next?',
  'My project is too large. What should I remove?',
];

export default function MentorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProjectAndChat() {
      try {
        const [projRes, chatRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/projects/${id}/mentor`),
        ]);

        if (projRes.ok) {
          const data = await projRes.json();
          if (data.project) setProject(data.project);
        }

        if (chatRes.ok) {
          const chatData = await chatRes.json();
          if (chatData.messages && chatData.messages.length > 0) {
            setMessages(chatData.messages);
          } else {
            // Initial welcoming message if none exist
            setMessages([
              {
                role: 'assistant',
                content: `Hello! I am your **ProjectPilot AI Mentor** for **${project?.title || 'your final-year project'}**.\n\nI have full context on your architecture, tech stack, and current milestone (**${project?.currentPhase || 'Phase 1'}**). How can I help you accelerate your implementation today?`,
              },
            ]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadProjectAndChat();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const question = textToSend || input;
    if (!question.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${id}/mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (data.assistantMessage) {
        setMessages((prev) => [...prev, data.assistantMessage]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please try asking again!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-xs text-slate-400">
        Initializing AI Mentor session...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      
      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 overflow-hidden">
        {/* Chat Header with Context Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white">ProjectPilot AI Mentor</h1>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Context Loaded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Trained on: {project.title} • {project.technologies.slice(0, 3).map((t) => t.name).join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 shadow-sm relative group ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-900/80 text-slate-200 border border-slate-800 rounded-bl-xs'
                  }`}
                >
                  {/* Markdown formatted content */}
                  <div className="space-y-2 whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.content, index)}
                      className="absolute top-3 right-3 p-1 rounded bg-slate-800/80 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedIndex === index ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="h-7 w-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-2.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 text-slate-400 text-[11px]">AI Mentor analyzing codebase & architecture...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Shortcut Question Pills */}
        <div className="pt-2 pb-2 shrink-0 border-t border-slate-800/80">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Quick Mentorship Questions:
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SHORTCUT_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 hover:border-indigo-500 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="pt-2 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about authentication, database schema, 500 errors, model accuracy..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-4 pr-10 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
