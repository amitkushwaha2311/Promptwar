export interface StudentContext {
  name?: string;
  college?: string;
  degree?: string;
  branch: string;
  skills: string[];
  interests: string[];
  experienceLevel: string;
  teamSize: number;
  duration: string;
}

export interface GeneratedIdea {
  title: string;
  shortDescription: string;
  problemStatement: string;
  proposedSolution: string;
  targetUsers: string;
  domain?: string;
  type?: string;
  coreFeatures: string[];
  optionalFeatures: string[];
  recommendedTechStack: string[];
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  innovationScore: number; // 1-10
  practicalityScore: number; // 1-10
  resumeValue: number; // 1-10
  futureScope: string[];
  potentialChallenges: string[];
}

export interface FeasibilityAnalysisResult {
  overallFeasibility: number; // 0-100
  technicalComplexity: number; // 1-10
  timeRequirement: number; // 1-10
  cost: number; // 1-10
  dataAvailability: number; // 1-10
  teamCompatibility: number; // 1-10
  deploymentComplexity: number; // 1-10
  explanation: string;
  risks: string[];
}

export interface ScopeOptimizationResult {
  originalScopeAssessment: string;
  mvpFeatures: string[];
  recommendedFeatures: string[];
  advancedFeatures: string[];
  futureScopeFeatures: string[];
  rationale: string;
}

export interface TechStackItem {
  category: 'Frontend' | 'Backend' | 'Database' | 'Authentication' | 'AI_ML' | 'APIs' | 'Storage' | 'Deployment';
  name: string;
  whyRecommended: string;
  advantages: string[];
  alternatives: string[];
}

export interface RoadmapTaskItem {
  weekNumber: number;
  title: string;
  description: string;
  subtasks: string[];
  estimatedHours: number;
  dependencies: string[];
  expectedOutput: string;
  completionCriteria: string;
}

export interface EvaluationResult {
  innovationScore: number; // 1-10
  technicalDepthScore: number; // 1-10
  practicalValueScore: number; // 1-10
  uiUxScore: number; // 1-10
  codeQualityScore: number; // 1-10
  testingScore: number; // 1-10
  docScore: number; // 1-10
  overallScore: number; // 1-10
  whatIsGood: string[];
  whatNeedsImprovement: string[];
  topImprovements: string[];
}

export interface VivaQuestionItem {
  category: 'BASIC' | 'TECHNICAL' | 'ARCHITECTURE' | 'ADVANCED';
  questionText: string;
  idealAnswer: string;
}

export interface VivaEvaluationResult {
  understandingScore: number; // 1-10
  accuracyScore: number; // 1-10
  completenessScore: number; // 1-10
  overallScore: number; // 1-10
  aiFeedback: string;
  improvedAnswer: string;
}
