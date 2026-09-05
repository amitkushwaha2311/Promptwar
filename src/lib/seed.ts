import prisma from './db';
import { hashPassword } from './auth';

export async function seedDemoData() {
  const demoEmail = 'demo@projectpilot.ai';
  const existing = await prisma.user.findUnique({
    where: { email: demoEmail },
    include: { projects: true },
  });

  if (existing && existing.projects.length > 0) {
    return { success: true, userId: existing.id, projectId: existing.projects[0].id };
  }

  // 1. Create or update Demo User
  const passwordHash = hashPassword('password123');
  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: { passwordHash, name: 'Alex Rivera' },
    create: {
      email: demoEmail,
      name: 'Alex Rivera',
      passwordHash,
      role: 'STUDENT',
    },
  });

  // 2. Student Profile
  await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      college: 'Indian Institute of Technology / State University',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2026,
      programmingLanguages: JSON.stringify(['Python', 'JavaScript', 'TypeScript', 'C++']),
      frameworks: JSON.stringify(['Next.js', 'React', 'FastAPI', 'Node.js']),
      technicalSkills: JSON.stringify(['Machine Learning', 'NLP', 'REST APIs', 'PostgreSQL', 'Docker']),
      areasOfInterest: JSON.stringify(['Artificial Intelligence', 'Full Stack Development', 'Cloud Computing']),
      experienceLevel: 'Intermediate',
      teamSize: 3,
      projectDuration: '4 months',
    },
  });

  // 3. Demo Project
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title: 'AI Resume Analyzer & ATS Optimizer',
      shortDescription: 'Deep parsing of resumes against job descriptions with semantic gap analysis and tailored mock interview generation.',
      problemStatement: 'Students and fresh graduates struggle to pass automated Applicant Tracking Systems (ATS) due to keyword mismatches, formatting errors, and poorly structured resumes.',
      proposedSolution: 'A multi-stage NLP pipeline that extracts resume entities, calculates semantic cosine similarity against target job descriptions, identifies skill deficiencies, and generates interactive role-specific interview preparation quizzes.',
      targetUsers: 'College placement cells, final-year job seekers, and university career centers.',
      domain: 'AI/ML',
      projectType: 'Web Application',
      difficulty: 'Intermediate',
      estimatedDuration: '12 weeks',
      teamSize: 3,
      currentPhase: 'Backend Integration & AI Pipeline',
      overallProgress: 72,
      healthScore: 88,
      feasibilityScore: 84,
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days remaining
    },
  });

  // 4. Features (Scope partition)
  const features = [
    { title: 'PDF & DOCX Resume Parser', description: 'Extract text, contact details, work history, and skills using regex and spaCy NER.', category: 'MVP', priority: 'HIGH', status: 'COMPLETED' },
    { title: 'Semantic ATS Match Score', description: 'Compute cosine similarity embeddings between resume and job description using Sentence-BERT.', category: 'MVP', priority: 'HIGH', status: 'COMPLETED' },
    { title: 'Skill Gap Recommendations', description: 'Highlight missing technical competencies and link to recommended learning paths.', category: 'MVP', priority: 'HIGH', status: 'COMPLETED' },
    { title: 'Role-Specific Interview Question Generator', description: 'Dynamic interview prep questions generated from candidate resume weaknesses.', category: 'RECOMMENDED', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { title: 'Interactive Analytics & Batch Benchmarking', description: 'Visual placement cell dashboard comparing resumes across college batches.', category: 'RECOMMENDED', priority: 'MEDIUM', status: 'TODO' },
    { title: 'LaTeX Resume Auto-Formatter', description: 'Export ATS-friendly standardized LaTeX template with one-click compile.', category: 'ADVANCED', priority: 'LOW', status: 'TODO' },
    { title: 'Live GitHub Code Quality Verification', description: 'Scrape and verify applicant GitHub repositories to validate claimed skills.', category: 'ADVANCED', priority: 'LOW', status: 'TODO' },
    { title: 'Real-Time Voice Tone Analyzer', description: 'Audio sentiment and pacing analysis during live mock interview rehearsals.', category: 'FUTURE_SCOPE', priority: 'LOW', status: 'TODO' },
    { title: 'Multi-Tenant University Placement Portal', description: 'Dedicated enterprise portal for multi-campus placement seasons.', category: 'FUTURE_SCOPE', priority: 'LOW', status: 'TODO' },
  ];

  for (const f of features) {
    await prisma.projectFeature.create({
      data: {
        projectId: project.id,
        ...f,
      },
    });
  }

  // 5. Technologies
  const techs = [
    { category: 'Frontend', name: 'Next.js 14+ (React & TypeScript)', whyRecommended: 'Fast SSR, file-based routing, and modern UI ecosystem.', advantages: JSON.stringify(['TypeScript type safety', 'Server Actions', 'Clean Tailwind integration']), alternatives: JSON.stringify(['React SPA', 'Vue 3']) },
    { category: 'Backend', name: 'FastAPI (Python 3.11)', whyRecommended: 'Asynchronous Python microservice ideal for NLP libraries and model inference.', advantages: JSON.stringify(['Native PyTorch/spaCy integration', 'Pydantic validation', 'Sub-millisecond execution']), alternatives: JSON.stringify(['Express.js', 'Flask']) },
    { category: 'Database', name: 'PostgreSQL with Prisma', whyRecommended: 'Relational integrity for complex student profiles, roadmap tasks, and evaluations.', advantages: JSON.stringify(['Strict foreign keys', 'ACID transactions', 'Prisma generated types']), alternatives: JSON.stringify(['MongoDB', 'MySQL']) },
    { category: 'Authentication', name: 'Secure JWT with HttpOnly Cookies', whyRecommended: 'Stateless, cross-service auth without expensive external providers.', advantages: JSON.stringify(['Bcrypt password hashing', 'HttpOnly cookie XSS prevention', 'Zero cost']), alternatives: JSON.stringify(['NextAuth', 'Firebase Auth']) },
    { category: 'AI_ML', name: 'Sentence-BERT & spaCy NER', whyRecommended: 'Lightweight, high-accuracy semantic embeddings and entity recognition.', advantages: JSON.stringify(['Pretrained on technical texts', 'Runs fast on CPU', 'Explainable similarity scores']), alternatives: JSON.stringify(['OpenAI Embeddings', 'BERT Large']) },
    { category: 'APIs', name: 'RESTful Architecture', whyRecommended: 'Standardized HTTP contracts easily consumable by frontend and placement clients.', advantages: JSON.stringify(['Standard status codes', 'Easy Postman testing', 'Type-safe contracts']), alternatives: JSON.stringify(['GraphQL']) },
    { category: 'Storage', name: 'Cloudflare R2 / Local Disk', whyRecommended: 'Cost-free storage for uploaded resume PDFs and generated reports.', advantages: JSON.stringify(['Zero egress fees', 'S3 compatibility', 'Fingerprinted uploads']), alternatives: JSON.stringify(['AWS S3']) },
    { category: 'Deployment', name: 'Vercel & Railway', whyRecommended: 'Seamless Git push deployments with built-in HTTPS and database hosting.', advantages: JSON.stringify(['Free student tiers', 'Automatic CI/CD', 'Easy environment variables']), alternatives: JSON.stringify(['Docker EC2']) },
  ];

  for (const t of techs) {
    await prisma.projectTechnology.create({
      data: {
        projectId: project.id,
        ...t,
      },
    });
  }

  // 6. Roadmap
  const roadmap = await prisma.projectRoadmap.create({
    data: {
      projectId: project.id,
      title: '12-Week Master Development Roadmap',
      durationWeeks: 12,
      currentWeek: 8,
    },
  });

  const tasks = [
    { weekNumber: 1, title: 'SRS & Architecture Finalization', description: 'Draft formal problem statement, research paper reviews, and system block diagrams.', status: 'COMPLETED', estimatedHours: 12, subtasks: JSON.stringify([{ id: '1', text: 'Define problem boundaries', done: true }, { id: '2', text: 'Complete literature review', done: true }]), expectedOutput: 'Approved SRS document', completionCriteria: 'Mentor sign-off' },
    { weekNumber: 2, title: 'Database Schema & API Contracts', description: 'Design Prisma schema, entity relations, and REST API route specifications.', status: 'COMPLETED', estimatedHours: 15, subtasks: JSON.stringify([{ id: '1', text: 'Create ER diagrams', done: true }, { id: '2', text: 'Write Prisma schema', done: true }]), expectedOutput: 'Database migrations', completionCriteria: 'Clean schema push' },
    { weekNumber: 3, title: 'Authentication & Profile Management', description: 'Implement registration, login, Bcrypt hashing, and student profile onboarding.', status: 'COMPLETED', estimatedHours: 16, subtasks: JSON.stringify([{ id: '1', text: 'Build JWT session handler', done: true }, { id: '2', text: 'Onboarding form', done: true }]), expectedOutput: 'Auth endpoints', completionCriteria: 'Postman tests pass' },
    { weekNumber: 4, title: 'Frontend Shell & Dashboard', description: 'Construct SaaS layout, navigation sidebar, and central project health widgets.', status: 'COMPLETED', estimatedHours: 14, subtasks: JSON.stringify([{ id: '1', text: 'Responsive sidebar', done: true }, { id: '2', text: 'Project health gauge', done: true }]), expectedOutput: 'Dashboard UI', completionCriteria: 'Verified on desktop & mobile' },
    { weekNumber: 5, title: 'PDF & DOCX Resume Parser Engine', description: 'Build resume text extractor using pdf-parse and spaCy Named Entity Recognition.', status: 'COMPLETED', estimatedHours: 20, subtasks: JSON.stringify([{ id: '1', text: 'PDF upload endpoint', done: true }, { id: '2', text: 'NER entity extractor', done: true }]), expectedOutput: 'Parsed JSON resume data', completionCriteria: 'Accurate text extraction' },
    { weekNumber: 6, title: 'Sentence-BERT Semantic Matching Pipeline', description: 'Implement cosine similarity computation between resume embeddings and job descriptions.', status: 'COMPLETED', estimatedHours: 22, subtasks: JSON.stringify([{ id: '1', text: 'Load Sentence-BERT model', done: true }, { id: '2', text: 'Calculate match percentages', done: true }]), expectedOutput: 'ATS score module', completionCriteria: 'Inference under 500ms' },
    { weekNumber: 7, title: 'Results Dashboard & Score Breakdown', description: 'Build interactive score breakdown cards, radar charts, and missing skill badges.', status: 'COMPLETED', estimatedHours: 16, subtasks: JSON.stringify([{ id: '1', text: 'Recharts score visualizer', done: true }, { id: '2', text: 'Missing skills tags', done: true }]), expectedOutput: 'Visual results view', completionCriteria: 'Dynamic state updates' },
    { weekNumber: 8, title: 'Interview Question Generator Integration', description: 'Connect dynamic interview question synthesizer based on candidate weaknesses.', status: 'IN_PROGRESS', estimatedHours: 18, subtasks: JSON.stringify([{ id: '1', text: 'Generate question prompts', done: true }, { id: '2', text: 'Interactive quiz card UI', done: false }]), expectedOutput: 'Interview prep module', completionCriteria: 'Working quiz generator' },
    { weekNumber: 9, title: 'GitHub Code Audit & CI Automation', description: 'Connect GitHub REST API analyzer to audit code structure, tests, and documentation.', status: 'TODO', estimatedHours: 15, subtasks: JSON.stringify([{ id: '1', text: 'GitHub API client', done: false }, { id: '2', text: 'Scoring gauges', done: false }]), expectedOutput: 'GitHub scanner page', completionCriteria: 'Real repo scores shown' },
    { weekNumber: 10, title: 'Unit Testing & Error Hardening', description: 'Write unit tests for scoring heuristics, edge case fallbacks, and user error alerts.', status: 'TODO', estimatedHours: 16, subtasks: JSON.stringify([{ id: '1', text: 'Unit tests for scoring', done: false }, { id: '2', text: 'Error boundary banners', done: false }]), expectedOutput: 'Test suite', completionCriteria: 'Zero unhandled exceptions' },
    { weekNumber: 11, title: 'Production Cloud Deployment', description: 'Deploy application to Vercel/Railway with custom domains and SSL protection.', status: 'TODO', estimatedHours: 12, subtasks: JSON.stringify([{ id: '1', text: 'Vercel deployment', done: false }, { id: '2', text: 'Database cloud backup', done: false }]), expectedOutput: 'Public HTTPS URL', completionCriteria: 'Live deployment ready' },
    { weekNumber: 12, title: 'Final Project Report & Mock Viva', description: 'Compile IEEE format project thesis, 15-slide deck, and practice AI viva simulator.', status: 'TODO', estimatedHours: 16, subtasks: JSON.stringify([{ id: '1', text: 'Draft thesis document', done: false }, { id: '2', text: 'Practice 6 viva questions', done: false }]), expectedOutput: 'Submission thesis & deck', completionCriteria: 'Viva score > 8.5/10' },
  ];

  for (const t of tasks) {
    await prisma.roadmapTask.create({
      data: {
        roadmapId: roadmap.id,
        ...t,
        completedAt: t.status === 'COMPLETED' ? new Date() : null,
      },
    });
  }

  // 7. AI Conversation & Messages
  const conversation = await prisma.aIConversation.create({
    data: {
      projectId: project.id,
      userId: user.id,
      title: 'AI Resume Analyzer Architecture & Viva Prep',
      contextSummary: 'Student asked about handling complex multi-column resumes and model cosine similarity tradeoffs.',
    },
  });

  const messages = [
    {
      role: 'user',
      content: 'How should I handle multi-column resumes in our PDF parser without losing text ordering?',
    },
    {
      role: 'assistant',
      content: `For **AI Resume Analyzer & ATS Optimizer**, multi-column PDFs often cause text extraction tools to read horizontally across both columns, jumbling sentences!

Here is the robust approach:
1. **Use Coordinate-Aware Bounding Boxes**: Instead of a naive text stream, use \`pdfplumber\` or \`PyMuPDF (fitz)\` to extract text blocks along with their \`(x0, y0, x1, y1)\` coordinates.
2. **Column Detection**: Detect horizontal gaps where \( x0 > \text{page\_width} / 2 \). Sort text blocks first by column (\`x\`), then vertically by reading order (\`y\`).
3. **Fallback Extraction**: If OCR or layout parsing fails, fall back to standard layout-preserving mode (\`fitz.open().get_text("blocks")\`).

This demonstrates deep technical maturity to your project examiner!`,
    },
    {
      role: 'user',
      content: 'Why did we choose PostgreSQL instead of MongoDB for our resume analyzer?',
    },
    {
      role: 'assistant',
      content: `Here is the exact architectural defense to give your external viva examiner:

1. **Relational Integrity**: Our application has interconnected relational entities: Students → Resumes → Job Descriptions → Matching Scores → Interview Questions. PostgreSQL enforces strict foreign keys so data is never corrupted or orphaned.
2. **ACID Transactions**: When updating roadmap progress and evaluation scores, atomic multi-table transactions ensure consistency.
3. **Structured + Unstructured (JSONB)**: Postgres supports \`JSONB\` columns, giving us the schema flexibility of MongoDB for dynamic skill tags while retaining SQL indexing and query speed.
4. **Security & Type-Safety**: With Prisma ORM, SQL injection is completely prevented through parameterized queries, and TypeScript types are automatically generated for all tables.`,
    },
  ];

  for (const m of messages) {
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        ...m,
      },
    });
  }

  // 8. GitHub Repository & Analysis
  const repo = await prisma.gitHubRepository.create({
    data: {
      projectId: project.id,
      repoUrl: 'https://github.com/alexrivera/ai-resume-analyzer',
      owner: 'alexrivera',
      repoName: 'ai-resume-analyzer',
      stars: 14,
      forks: 3,
      defaultBranch: 'main',
      languages: JSON.stringify({ TypeScript: 64, Python: 28, CSS: 8 }),
    },
  });

  await prisma.gitHubAnalysis.create({
    data: {
      repositoryId: repo.id,
      codeOrgScore: 82,
      docScore: 68,
      testingScore: 52,
      repoQualityScore: 79,
      activityScore: 85,
      overallScore: 73,
      metricsJson: JSON.stringify({
        languageBreakdown: [{ name: 'TypeScript', percentage: 64 }, { name: 'Python', percentage: 28 }, { name: 'CSS', percentage: 8 }],
        totalCommitsLastMonth: 18,
        contributors: 3,
        hasTestCoverage: true,
        readmeWordCount: 850,
        hasCiWorkflow: false,
      }),
      improvementsJson: JSON.stringify([
        { priority: 1, title: 'Add Unit Tests for Core Scoring Functions', description: 'Current tests cover only basic API endpoints. The core ATS semantic similarity module requires automated assertion tests.', impact: 'HIGH', actionableStep: 'Add `tests/scoring.test.ts` verifying cosine similarity calculations against known benchmark resumes.' },
        { priority: 2, title: 'Add System Architecture Diagram in README', description: 'Examiners appreciate visual flowcharts showing how the Next.js frontend connects to the Python ML microservice.', impact: 'HIGH', actionableStep: 'Include a Mermaid or PNG architecture diagram in `README.md`.' },
        { priority: 3, title: 'Setup GitHub Actions CI Workflow', description: 'Automate build verification on every commit.', impact: 'MEDIUM', actionableStep: 'Add `.github/workflows/ci.yml` running `npm run build` and `npm run test`.' },
        { priority: 4, title: 'Add LICENSE File', description: 'Repository currently lacks an explicit open-source license.', impact: 'LOW', actionableStep: 'Create an MIT LICENSE file in the root repository.' },
      ]),
    },
  });

  // 9. Project Evaluation
  await prisma.projectEvaluation.create({
    data: {
      projectId: project.id,
      innovationScore: 8.8,
      technicalDepthScore: 8.4,
      practicalValueScore: 9.2,
      uiUxScore: 8.5,
      codeQualityScore: 8.0,
      testingScore: 6.8,
      docScore: 8.0,
      overallScore: 8.2,
      whatIsGood: JSON.stringify([
        'Solves a tangible, high-impact problem faced by every final-year graduating student.',
        'Modern, robust technology stack (Next.js, FastAPI, PostgreSQL, Sentence-BERT).',
        'Intuitive, responsive SaaS user interface with instant ATS score visual feedback.',
        'High practical utility and attractive showcase piece for placement interviews.',
      ]),
      whatNeedsImprovement: JSON.stringify([
        'Increase unit test coverage for PDF edge cases (tables, scanned images).',
        'Add GitHub Actions continuous integration workflow before final thesis submission.',
        'Include formal empirical benchmarking comparing model accuracy against human recruiters.',
      ]),
      topImprovements: JSON.stringify([
        'Priority 1: Add automated unit tests for cosine similarity calculation before submission.',
        'Priority 2: Enhance README with architecture flowchart and live demo credentials.',
        'Priority 3: Ensure all database relations have foreign key indexes for query efficiency.',
        'Priority 4: Complete oral rehearsal of the 6 mock viva questions under the Viva tab.',
        'Priority 5: Export high-resolution ER diagram and IEEE formatted summary report.',
      ]),
    },
  });

  // 10. Viva Session & Questions
  const viva = await prisma.vivaSession.create({
    data: {
      projectId: project.id,
      userId: user.id,
      title: 'AI Resume Analyzer Mock Viva Examination',
      overallScore: 8.3,
    },
  });

  const q1 = await prisma.vivaQuestion.create({
    data: {
      sessionId: viva.id,
      category: 'BASIC',
      questionText: 'What is the primary motivation behind AI Resume Analyzer, and how does it differ from traditional keyword search?',
      idealAnswer: 'Traditional keyword search uses rigid exact-word matching which penalizes candidates who use synonyms (e.g., "Full-stack developer" vs "Software engineer"). AI Resume Analyzer utilizes Sentence-BERT dense embeddings to capture semantic intent, scoring the contextual relevance of qualifications rather than raw keyword frequency.',
      orderIndex: 1,
    },
  });

  await prisma.vivaAnswer.create({
    data: {
      questionId: q1.id,
      studentAnswer: 'Traditional ATS only looks for exact words like React. If the user wrote frontend engineering it might fail. Our project uses semantic embeddings with Sentence-BERT so it understands synonyms and contextual meaning of candidate skills.',
      understandingScore: 8.8,
      accuracyScore: 9.0,
      completenessScore: 8.2,
      overallScore: 8.7,
      aiFeedback: 'Great explanation! You accurately contrasted exact matching with dense vector semantics. Mentioning Sentence-BERT shows direct technical command.',
      improvedAnswer: 'To make it even stronger: "Traditional ATS systems rely on Boolean keyword matching which fails on synonyms and context. Our system computes cosine similarity over 384-dimensional Sentence-BERT dense embeddings, evaluating conceptual alignment and reducing false rejection rates by over 30%."',
    },
  });

  const q2 = await prisma.vivaQuestion.create({
    data: {
      sessionId: viva.id,
      category: 'TECHNICAL',
      questionText: 'Why did you choose PostgreSQL with Prisma over MongoDB for storing student resumes and evaluation results?',
      idealAnswer: 'PostgreSQL provides ACID relational integrity with foreign keys linking users, resumes, roadmaps, and evaluations. Prisma generates compile-time TypeScript types ensuring zero runtime schema mismatches, while Postgres JSONB provides schema flexibility where needed.',
      orderIndex: 2,
    },
  });

  await prisma.vivaAnswer.create({
    data: {
      questionId: q2.id,
      studentAnswer: 'We chose PostgreSQL because our data has relations between students, projects, and roadmap tasks. Prisma gives us type-safety in TypeScript, preventing bugs and SQL injection.',
      understandingScore: 8.5,
      accuracyScore: 8.8,
      completenessScore: 7.8,
      overallScore: 8.4,
      aiFeedback: 'Solid justification. Adding a mention of ACID transactions and parameterized queries will impress examiners even further.',
      improvedAnswer: 'PostgreSQL was selected for its ACID transaction guarantees and relational integrity across our core entities. Prisma provides end-to-end type safety, auto-generated migrations, and parameterized query execution which completely prevents SQL injection attacks.',
    },
  });

  const q3 = await prisma.vivaQuestion.create({
    data: {
      sessionId: viva.id,
      category: 'ARCHITECTURE',
      questionText: 'Explain the end-to-end data flow from the moment a student uploads a resume PDF to the display of their ATS score.',
      idealAnswer: 'The student uploads the PDF via a Next.js form. The file is validated and streamed to the FastAPI backend. pdfplumber and spaCy extract the raw text and entity tokens. The Sentence-BERT model generates 384-dimensional vector embeddings, which are compared against the target job description vector via cosine similarity. The normalized score and missing skill tokens are stored in PostgreSQL and returned as a JSON payload for Recharts visualization.',
      orderIndex: 3,
    },
  });

  await prisma.vivaAnswer.create({
    data: {
      questionId: q3.id,
      studentAnswer: 'The user uploads a PDF on Next.js frontend. The backend extracts text using pdfplumber, runs spaCy to get skills, and uses Sentence-BERT to generate embeddings and compute cosine similarity against the job description. The score is saved in database and sent back.',
      understandingScore: 9.0,
      accuracyScore: 9.2,
      completenessScore: 8.5,
      overallScore: 8.9,
      aiFeedback: 'Excellent walkthrough! Clear sequence of events from client upload to NLP pipeline and database persistence.',
      improvedAnswer: 'The architecture cleanly follows a 4-tier flow: 1) Client upload with MIME validation; 2) Microservice text and entity extraction with spaCy; 3) Vector embedding generation and cosine similarity calculation; 4) Database persistence and reactive UI rendering.',
    },
  });

  return { success: true, userId: user.id, projectId: project.id };
}
