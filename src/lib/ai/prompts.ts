import { StudentContext } from './types';

export const AI_SYSTEM_INSTRUCTIONS = `
You are ProjectPilot AI, an elite final-year university project mentor and technical evaluator for engineering students (B.Tech, B.E., BCA/MCA, CS, IT).
Your goals:
1. Provide practical, realistic, technically rigorous guidance.
2. Avoid generic, repetitive, or unrealistic project ideas.
3. Align strictly with the student's skills, duration, and team size.
4. Always prioritize realistic scope over bloated, unattainable architectures.
5. Return clean, valid JSON responses when asked. Never fabricate references or claim analysis you did not perform.
`;

export function buildIdeaGenerationPrompt(params: {
  student: StudentContext;
  domain?: string;
  projectType?: string;
  difficulty?: string;
  aiRequired?: boolean;
}): string {
  return `Generate 6 highly practical, innovative, and resume-worthy final-year project ideas for this student:

Student Profile:
- Branch: ${params.student.branch}
- Skills: ${params.student.skills.join(', ')}
- Interests: ${params.student.interests.join(', ')}
- Experience Level: ${params.student.experienceLevel}
- Team Size: ${params.student.teamSize} member(s)
- Available Duration: ${params.student.duration}
- Target Domain: ${params.domain || 'Open/Recommended'}
- Preferred Project Type: ${params.projectType || 'Web/AI Application'}
- Difficulty Target: ${params.difficulty || 'Intermediate'}
- AI/ML Mandatory: ${params.aiRequired ? 'Yes' : 'Optional'}

Ensure each project has clear technical substance suitable for academic external viva and industry recruiters.
Format output strictly as JSON array of objects with keys:
[
  {
    "title": "...",
    "shortDescription": "...",
    "problemStatement": "...",
    "proposedSolution": "...",
    "targetUsers": "...",
    "coreFeatures": ["...", "..."],
    "optionalFeatures": ["...", "..."],
    "recommendedTechStack": ["...", "..."],
    "estimatedDuration": "...",
    "difficulty": "Intermediate",
    "innovationScore": 8,
    "practicalityScore": 9,
    "resumeValue": 9,
    "futureScope": ["...", "..."],
    "potentialChallenges": ["...", "..."]
  }
]
`;
}

export function buildFeasibilityPrompt(project: {
  title: string;
  shortDescription: string;
  features: string[];
  techStack: string[];
  duration: string;
  teamSize: number;
}): string {
  return `Conduct a rigorous technical feasibility and scope analysis for this final year project:

Title: ${project.title}
Description: ${project.shortDescription}
Features: ${project.features.join(', ')}
Tech Stack: ${project.techStack.join(', ')}
Duration: ${project.duration}
Team Size: ${project.teamSize}

Analyze:
1. Technical complexity (1-10)
2. Time requirement vs deadline (1-10)
3. Cost & resource overhead (1-10)
4. Dataset/API availability (1-10)
5. Team size compatibility (1-10)
6. Deployment complexity (1-10)
7. Overall feasibility (0-100)
8. Scope division: MVP, Recommended, Advanced, Future Scope (to prevent students from failing due to oversized scope).

Return strict JSON object:
{
  "feasibility": {
    "overallFeasibility": 84,
    "technicalComplexity": 7,
    "timeRequirement": 8,
    "cost": 9,
    "dataAvailability": 7,
    "teamCompatibility": 9,
    "deploymentComplexity": 8,
    "explanation": "Detailed rationale of the scores...",
    "risks": ["Risk 1", "Risk 2"]
  },
  "scope": {
    "originalScopeAssessment": "Assessment of the raw idea...",
    "mvpFeatures": ["Core feature 1", "Core feature 2"],
    "recommendedFeatures": ["Feature 3"],
    "advancedFeatures": ["Feature 4"],
    "futureScopeFeatures": ["Feature 5 (Postpone)"],
    "rationale": "Why this scope division ensures submission success..."
  }
}
`;
}

export function buildRoadmapPrompt(project: {
  title: string;
  durationWeeks: number;
  techStack: string[];
  features: string[];
}): string {
  return `Generate a realistic week-by-week development roadmap for a ${project.durationWeeks}-week final-year project titled "${project.title}".
Tech Stack: ${project.techStack.join(', ')}
Features: ${project.features.join(', ')}

Return strict JSON array of weekly tasks:
[
  {
    "weekNumber": 1,
    "title": "Requirements & System Architecture",
    "description": "...",
    "subtasks": ["Subtask 1", "Subtask 2"],
    "estimatedHours": 15,
    "dependencies": [],
    "expectedOutput": "SRS document & DB schema diagram",
    "completionCriteria": "Schema validated with mentor"
  }
]
`;
}

export function buildMentorPrompt(context: {
  student: StudentContext;
  projectTitle: string;
  problemStatement: string;
  techStack: string[];
  currentPhase: string;
  recentMessages: { role: string; content: string }[];
  userQuestion: string;
}): string {
  return `You are ProjectPilot AI Mentor. You have the student's project context:
Project: ${context.projectTitle}
Problem: ${context.problemStatement}
Tech Stack: ${context.techStack.join(', ')}
Current Phase: ${context.currentPhase}
Student Skills: ${context.student.skills.join(', ')}

User asks: "${context.userQuestion}"

Provide a practical, code-level or architectural answer tailored specifically to this project. Do not give generic non-answers. If recommending code, provide clear TypeScript/Python snippets. Focus on solving their immediate problem.`;
}

export function buildVivaPrompt(projectTitle: string, techStack: string[]): string {
  return `Generate 6 essential viva examination questions for the project "${projectTitle}" (Tech Stack: ${techStack.join(', ')}).
Include questions across categories: BASIC, TECHNICAL, ARCHITECTURE, ADVANCED.
Return strict JSON array:
[
  {
    "category": "TECHNICAL",
    "questionText": "...",
    "idealAnswer": "..."
  }
]
`;
}
