import {
  StudentContext,
  GeneratedIdea,
  FeasibilityAnalysisResult,
  ScopeOptimizationResult,
  TechStackItem,
  RoadmapTaskItem,
  EvaluationResult,
  VivaQuestionItem,
  VivaEvaluationResult,
} from './types';
import { IntelligentEngine } from './intelligentEngine';
import {
  AI_SYSTEM_INSTRUCTIONS,
  buildIdeaGenerationPrompt,
  buildFeasibilityPrompt,
  buildRoadmapPrompt,
  buildMentorPrompt,
  buildVivaPrompt,
} from './prompts';

// Helper to extract and sanitize JSON from LLM markdown responses
function extractJson<T>(rawText: string): T | null {
  try {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean) as T;
  } catch (e) {
    console.warn('Failed to parse LLM JSON response:', e);
    return null;
  }
}

// Low-level LLM caller supporting Gemini or OpenAI
async function callLLM(prompt: string, customApiKey?: string): Promise<string | null> {
  const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. Try Gemini if key is provided
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `${AI_SYSTEM_INSTRUCTIONS}\n\n${prompt}` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn('Gemini API call error, falling back:', e);
    }
  }

  // 2. Try OpenAI if key is provided
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: AI_SYSTEM_INSTRUCTIONS },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch (e) {
      console.warn('OpenAI API call error, falling back:', e);
    }
  }

  return null;
}

export class AIService {
  // 1. Generate Project Ideas
  static async generateIdeas(params: {
    student: StudentContext;
    domain?: string;
    projectType?: string;
    difficulty?: string;
    aiRequired?: boolean;
    apiKey?: string;
  }): Promise<GeneratedIdea[]> {
    const prompt = buildIdeaGenerationPrompt(params);
    const raw = await callLLM(prompt, params.apiKey);
    if (raw) {
      const parsed = extractJson<GeneratedIdea[]>(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
        return parsed;
      }
    }
    // Reliable intelligent domain engine fallback
    return IntelligentEngine.generateIdeas(params);
  }

  // 2. Analyze Feasibility & Scope
  static async analyzeFeasibility(
    project: {
      title: string;
      shortDescription: string;
      features: string[];
      techStack: string[];
      duration?: string;
      teamSize?: number;
      difficulty?: string;
    },
    apiKey?: string
  ): Promise<{ feasibility: FeasibilityAnalysisResult; scope: ScopeOptimizationResult }> {
    const prompt = buildFeasibilityPrompt({
      title: project.title,
      shortDescription: project.shortDescription,
      features: project.features,
      techStack: project.techStack,
      duration: project.duration || '12 weeks',
      teamSize: project.teamSize || 3,
    });
    const raw = await callLLM(prompt, apiKey);
    if (raw) {
      const parsed = extractJson<{ feasibility: FeasibilityAnalysisResult; scope: ScopeOptimizationResult }>(raw);
      if (parsed?.feasibility?.overallFeasibility && parsed?.scope?.mvpFeatures) {
        return parsed;
      }
    }
    return IntelligentEngine.analyzeFeasibility(project);
  }

  // 3. Recommended Tech Stack
  static generateTechStack(projectTitle: string, userStack?: string[]): TechStackItem[] {
    return IntelligentEngine.generateTechStack(projectTitle, userStack);
  }

  // 4. Generate Development Roadmap
  static async generateRoadmap(
    durationWeeks: number,
    projectTitle: string,
    techStack: string[],
    features: string[],
    apiKey?: string
  ): Promise<RoadmapTaskItem[]> {
    const prompt = buildRoadmapPrompt({
      title: projectTitle,
      durationWeeks,
      techStack,
      features,
    });
    const raw = await callLLM(prompt, apiKey);
    if (raw) {
      const parsed = extractJson<RoadmapTaskItem[]>(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
        return parsed;
      }
    }
    return IntelligentEngine.generateRoadmap(durationWeeks, projectTitle);
  }

  // 5. AI Project Mentor Chat
  static async askMentor(params: {
    question: string;
    projectTitle: string;
    problemStatement: string;
    techStack: string[];
    currentPhase: string;
    studentSkills: string[];
    recentMessages?: { role: string; content: string }[];
    apiKey?: string;
  }): Promise<string> {
    const prompt = buildMentorPrompt({
      student: {
        branch: 'Computer Science',
        skills: params.studentSkills,
        interests: [],
        experienceLevel: 'Intermediate',
        teamSize: 3,
        duration: '12 weeks',
      },
      projectTitle: params.projectTitle,
      problemStatement: params.problemStatement,
      techStack: params.techStack,
      currentPhase: params.currentPhase,
      recentMessages: params.recentMessages || [],
      userQuestion: params.question,
    });

    const raw = await callLLM(prompt, params.apiKey);
    if (raw && raw.trim().length > 30) {
      return raw.trim();
    }
    return IntelligentEngine.answerMentorQuestion(params);
  }

  // 6. Viva Simulator Questions & Evaluation
  static async generateVivaQuestions(projectTitle: string, techStack: string[], apiKey?: string): Promise<VivaQuestionItem[]> {
    const prompt = buildVivaPrompt(projectTitle, techStack);
    const raw = await callLLM(prompt, apiKey);
    if (raw) {
      const parsed = extractJson<VivaQuestionItem[]>(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].questionText) {
        return parsed;
      }
    }
    return IntelligentEngine.generateVivaQuestions(projectTitle, techStack);
  }

  static evaluateVivaAnswer(question: string, studentAnswer: string): VivaEvaluationResult {
    return IntelligentEngine.evaluateVivaAnswer(question, studentAnswer);
  }

  // 7. Final Project Evaluation
  static evaluateProject(projectTitle: string, progress: number, taskCount: number, completedTasks: number): EvaluationResult {
    return IntelligentEngine.evaluateProject(projectTitle, progress, taskCount, completedTasks);
  }
}
