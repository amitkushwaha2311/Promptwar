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

// Curated pool of high-impact final-year project blueprints
const PROJECT_BLUEPRINTS = [
  {
    domain: 'AI/ML',
    type: 'Web Application',
    title: 'AI-Powered ATS Resume Analyzer & Interview Coach',
    shortDescription: 'Deep parsing of resumes against job descriptions with semantic gap analysis and tailored mock interview generation.',
    problemStatement: 'Students and fresh graduates struggle to pass automated Applicant Tracking Systems (ATS) due to keyword mismatches and poorly structured resumes.',
    proposedSolution: 'A multi-stage NLP pipeline that extracts resume entities, calculates semantic cosine similarity against target job descriptions, identifies skill deficiencies, and generates interactive role-specific interview preparation quizzes.',
    targetUsers: 'College placement cells, final-year job seekers, and university career centers.',
    coreFeatures: [
      'PDF/DOCX Resume parsing with regex & Named Entity Recognition (NER)',
      'Semantic keyword matching and ATS compatibility score (0-100%)',
      'Missing skill recommendation matrix with direct course/topic links',
      'Interactive AI interview simulator with speech-to-text feedback',
    ],
    optionalFeatures: [
      'LaTeX resume builder with live ATS preview',
      'GitHub repository audit for verified developer projects',
      'Peer benchmarking within college batches',
    ],
    recommendedTechStack: ['Next.js', 'FastAPI / Python', 'spaCy / Transformers', 'PostgreSQL', 'Tailwind CSS'],
    estimatedDuration: '12-16 weeks',
    difficulty: 'Intermediate' as const,
    innovationScore: 9,
    practicalityScore: 10,
    resumeValue: 9,
    futureScope: ['Integration with LinkedIn Jobs API', 'Automated cold-email draft generator', 'Voice tone analyzer during interview mocks'],
    potentialChallenges: ['Handling complex multi-column PDF layouts', 'Reducing latency during transformer embeddings generation'],
  },
  {
    domain: 'Healthcare',
    type: 'AI/ML',
    title: 'MedScan AI: Automated Chest Radiograph Abnormality Detector',
    shortDescription: 'Computer vision platform for multi-label chest X-ray screening with Grad-CAM visual heatmaps for explainable clinical diagnostics.',
    problemStatement: 'Understaffed rural health centers face severe delays in radiologist interpretations, leading to delayed triage of acute conditions like pneumonia and pneumothorax.',
    proposedSolution: 'A web-accessible diagnostic support system powered by a fine-tuned DenseNet-121 model on the NIH Chest X-ray dataset, producing class probabilities and Grad-CAM interpretability maps showing exact lung lesion locations.',
    targetUsers: 'Primary healthcare centers, medical interns, and diagnostic clinics.',
    coreFeatures: [
      'DICOM & high-resolution PNG image ingestion & DICOM anonymization',
      'Multi-label classification across 14 thoracic conditions',
      'Grad-CAM visual heatmap overlay showing model attention',
      'Structured radiological report generator in PDF format',
    ],
    optionalFeatures: [
      'Offline edge inference using ONNX Runtime',
      'Longitudinal patient history comparison across multiple scans',
      'Audit log for medical regulatory compliance',
    ],
    recommendedTechStack: ['PyTorch', 'FastAPI', 'Next.js', 'PostgreSQL', 'TorchCAM', 'Docker'],
    estimatedDuration: '14-16 weeks',
    difficulty: 'Advanced' as const,
    innovationScore: 9,
    practicalityScore: 8,
    resumeValue: 10,
    futureScope: ['CT and MRI 3D volumetric segmentation', 'Multi-modal diagnostic combining patient lab vitals'],
    potentialChallenges: ['Class imbalance in clinical training data', 'High GPU inference memory overhead'],
  },
  {
    domain: 'Cybersecurity',
    type: 'Web Application',
    title: 'CloudGuard: Automated Kubernetes & Cloud Misconfiguration Scanner',
    shortDescription: 'Static and dynamic security linter for Terraform manifests, Dockerfiles, and AWS/GCP IAM permission creep.',
    problemStatement: 'Over 80% of enterprise cloud data breaches originate from simple infrastructure-as-code misconfigurations and overprivileged service accounts.',
    proposedSolution: 'A CI/CD security orchestrator that analyzes IaC templates, parses IAM policies into permission graph trees, flags CIS benchmark violations, and outputs auto-remediation pull requests.',
    targetUsers: 'DevOps engineers, cloud architects, and security compliance teams.',
    coreFeatures: [
      'Static analysis for Terraform, CloudFormation, and Dockerfiles',
      'IAM least-privilege policy synthesizer and excessive permission alerts',
      'CIS & NIST compliance report dashboard',
      'One-click GitHub Pull Request creation for security fixes',
    ],
    optionalFeatures: [
      'Runtime anomaly detection via eBPF probes',
      'Kubernetes cluster live health audit daemon',
      'Slack and Discord webhook security incident dispatch',
    ],
    recommendedTechStack: ['Go / Node.js', 'Next.js', 'PostgreSQL', 'Open Policy Agent (OPA)', 'Docker'],
    estimatedDuration: '12-14 weeks',
    difficulty: 'Advanced' as const,
    innovationScore: 9,
    practicalityScore: 9,
    resumeValue: 10,
    futureScope: ['Automated zero-day dependency CVE monitoring', 'Real-time honeypot integration'],
    potentialChallenges: ['Parsing intricate cross-cloud IAM schemas', 'Avoiding false-positive alerts on non-critical dev environments'],
  },
  {
    domain: 'FinTech',
    type: 'Web Application',
    title: 'SmartSpend AI: Real-Time Fraud Detection & Micro-Budgeting Hub',
    shortDescription: 'Hybrid transactional fraud detection system combining isolation forests and graph neural networks for anomalous payment flow tracing.',
    problemStatement: 'Traditional rule-based banking firewalls fail to detect modern synthetic identity theft and fast multi-hop layering money muling schemes.',
    proposedSolution: 'An event-driven financial intelligence engine that ingests simulated ISO 20022 transaction streams, detects anomalous velocity and geographic drift, and predicts credit default risks.',
    targetUsers: 'Digital neobanks, financial analysts, and retail banking consumers.',
    coreFeatures: [
      'Real-time transaction stream simulator with synthetic fraud injection',
      'Isolation Forest & XGBoost fraud probability scoring in < 50ms',
      'Interactive transaction network graph visualization using D3/Cytoscape',
      'Automated account hold and SMS/Email two-factor alert pipeline',
    ],
    optionalFeatures: [
      'Predictive cash-flow forecast for upcoming 90 days',
      'Plaid/Stripe sandbox integration for live test accounts',
      'Explainable AI feature attribution via SHAP values',
    ],
    recommendedTechStack: ['Next.js', 'Node.js / Express', 'Python (Scikit-Learn/XGBoost)', 'Redis', 'PostgreSQL'],
    estimatedDuration: '12 weeks',
    difficulty: 'Intermediate' as const,
    innovationScore: 8,
    practicalityScore: 9,
    resumeValue: 9,
    futureScope: ['Decentralized crypto-wallet transaction tracing', 'Biometric transaction authorization'],
    potentialChallenges: ['Extremely low latency inference requirements (<50ms)', 'Handling severe fraud class rarity in datasets'],
  },
  {
    domain: 'IoT',
    type: 'IoT / Automation',
    title: 'AgriSense: Autonomous Precision Irrigation & Crop Disease Diagnostic',
    shortDescription: 'Edge IoT sensor network with solar soil nodes paired with a mobile drone/camera leaf disease image classifier.',
    problemStatement: 'Farmers suffer heavy yield losses from unoptimized flood irrigation and late detection of blight, rust, and fungal crop pests.',
    proposedSolution: 'Low-cost ESP32 LoRa wireless nodes transmit soil moisture, temperature, and NPK metrics to an MQTT gateway, triggering automated solenoid valves while a vision model identifies crop leaf pathology from phone camera photos.',
    targetUsers: 'Agricultural cooperatives, precision farming researchers, and rural farming communities.',
    coreFeatures: [
      'ESP32 / Raspberry Pi telemetry via MQTT / WebSockets',
      'Automated threshold and weather-predictive solenoid valve triggering',
      'Leaf disease classification using MobileNetV3 (Tomato, Potato, Wheat)',
      'Local language voice advisory output for farmers',
    ],
    optionalFeatures: [
      'Solar battery telemetry monitoring',
      'LoRaWAN mesh network for long-range connectivity without cellular data',
      'Market mandi crop price predictive trend dashboard',
    ],
    recommendedTechStack: ['Next.js', 'Python / FastAPI', 'TensorFlow Lite', 'MQTT Broker (Mosquitto)', 'SQLite / PostgreSQL'],
    estimatedDuration: '14-16 weeks',
    difficulty: 'Intermediate' as const,
    innovationScore: 9,
    practicalityScore: 10,
    resumeValue: 9,
    futureScope: ['Autonomous drone flight path mapping', 'Satellite NDVI vegetation index ingestion'],
    potentialChallenges: ['Hardware component availability and calibration', 'Outdoor wireless signal attenuation in rainy conditions'],
  },
  {
    domain: 'Blockchain',
    type: 'Web3 / Blockchain',
    title: 'VeriDegree: Decentralized Academic Credential Verification & NFT Badges',
    shortDescription: 'Tamper-proof academic diploma verification on Polygon/Ethereum with zero-knowledge proof transcript selective disclosure.',
    problemStatement: 'Credential forgery and manual background verification cause widespread hiring fraud and weeks of administrative delay for universities.',
    proposedSolution: 'A cryptographic registry where universities mint tamper-proof soulbound credential tokens (EIP-5114). Employers verify transcripts instantaneously via QR codes without contacting university registrars.',
    targetUsers: 'University registrar offices, background verification agencies, and graduating students.',
    coreFeatures: [
      'Solidity smart contract on Polygon Testnet for credential issuance',
      'Cryptographic SHA-256 PDF transcript hashing and IPFS pinning',
      'Instant QR-code verification portal requiring no login or gas fees for verifiers',
      'Role-based university administrator issuance portal with multi-sig security',
    ],
    optionalFeatures: [
      'Zero-knowledge proof for selective GPA/degree disclosure without revealing full grades',
      'Digital student wallet integration via MetaMask and RainbowKit',
      'Automated LinkedIn credential badge sharing link',
    ],
    recommendedTechStack: ['Next.js', 'Solidity', 'Hardhat / Foundry', 'Ethers.js / Wagmi', 'IPFS (Pinata)'],
    estimatedDuration: '10-12 weeks',
    difficulty: 'Intermediate' as const,
    innovationScore: 8,
    practicalityScore: 9,
    resumeValue: 9,
    futureScope: ['Integration with government national academic depository', 'Cross-chain credential bridges'],
    potentialChallenges: ['Managing smart contract gas costs', 'Ensuring institutional private key management security'],
  },
  {
    domain: 'EdTech',
    type: 'AI/ML',
    title: 'CodeMentor AI: Interactive Debugging & Code Architecture Tutor',
    shortDescription: 'Real-time code execution sandbox that explains runtime stack traces, visualizes memory pointers, and detects anti-patterns.',
    problemStatement: 'Junior students learning programming get stuck on opaque runtime exceptions and fail to visualize pointers, recursion, and object references.',
    proposedSolution: 'A browser-based code playground that steps through Python and C++ code execution, draws visual memory graphs of arrays, linked lists, and stack frames, and provides Socratic conversational debugging hints.',
    targetUsers: 'Computer science undergraduates, coding bootcamp students, and programming instructors.',
    coreFeatures: [
      'Dockerized secure code execution sandbox with CPU/memory limits',
      'Step-by-step memory pointer and call stack dynamic visualization',
      'AI Socratic hint generator that guides students rather than spoiling solutions',
      'Code complexity (Big-O time and space) analyzer',
    ],
    optionalFeatures: [
      'Live collaborative pair programming room with WebRTC',
      'Automated unit test generation for student submissions',
      'Voice explanation synthesis for code walkthroughs',
    ],
    recommendedTechStack: ['Next.js', 'Node.js / Express', 'Docker / Isolate Sandbox', 'Python AST', 'Tailwind CSS'],
    estimatedDuration: '12-14 weeks',
    difficulty: 'Intermediate' as const,
    innovationScore: 9,
    practicalityScore: 10,
    resumeValue: 10,
    futureScope: ['Support for Rust and Go memory visualization', 'Integration with GitHub Classroom'],
    potentialChallenges: ['Secure isolation of untrusted user code execution', 'Low latency WebSocket syncing of execution steps'],
  },
  {
    domain: 'Data Science',
    type: 'AI/ML',
    title: 'EcoTrack: Urban Carbon Footprint & Traffic Emission Simulator',
    shortDescription: 'Spatio-temporal machine learning model analyzing city sensor feeds, road networks, and vehicular emissions.',
    problemStatement: 'Municipal authorities lack granular block-by-block visibility into urban carbon emissions and the impact of traffic rerouting policies.',
    proposedSolution: 'A geospatial dashboard that combines OpenStreetMap road data, synthetic traffic density cameras, and emission dispersion algorithms to predict air quality indices and simulate green corridors.',
    targetUsers: 'Urban town planning departments, environmental research NGOs, and smart city managers.',
    coreFeatures: [
      'Geospatial map visualization with deck.gl / Mapbox layers',
      'Spatio-temporal regression model predicting CO2 and PM2.5 levels',
      'Simulation sandbox: reroute traffic and evaluate emission changes in real-time',
      'Automated climate policy recommendation generator',
    ],
    optionalFeatures: [
      'Public transit carbon offset calculator',
      'Citizen reporting portal for high-emission vehicles',
      'API feed for city digital billboards',
    ],
    recommendedTechStack: ['Next.js', 'Python / GeoPandas', 'Scikit-Learn', 'Deck.gl / Leaflet', 'PostgreSQL (PostGIS)'],
    estimatedDuration: '12-14 weeks',
    difficulty: 'Intermediate' as const,
    innovationScore: 8,
    practicalityScore: 9,
    resumeValue: 9,
    futureScope: ['Satellite imagery integration for urban heat island tracking', 'Electric vehicle charging placement optimizer'],
    potentialChallenges: ['Handling heavy geospatial shapefile calculations in browser', 'Sensor calibration discrepancies'],
  },
];

export class IntelligentEngine {
  // Generate customized project ideas based on student input
  static generateIdeas(params: {
    student: StudentContext;
    domain?: string;
    projectType?: string;
    difficulty?: string;
    aiRequired?: boolean;
  }): GeneratedIdea[] {
    const studentSkillsLower = params.student.skills.map((s) => s.toLowerCase());
    const studentInterestsLower = params.student.interests.map((i) => i.toLowerCase());

    // Score blueprints based on relevance to student's profile
    const scored = PROJECT_BLUEPRINTS.map((bp) => {
      let score = 0;

      // Domain match
      if (params.domain && params.domain !== 'All' && bp.domain.toLowerCase().includes(params.domain.toLowerCase())) {
        score += 30;
      }
      if (studentInterestsLower.some((interest) => bp.domain.toLowerCase().includes(interest) || bp.title.toLowerCase().includes(interest))) {
        score += 20;
      }

      // Project type match
      if (params.projectType && params.projectType !== 'All' && bp.type.toLowerCase().includes(params.projectType.toLowerCase())) {
        score += 25;
      }

      // Skill match
      const matchingSkills = bp.recommendedTechStack.filter((tech) =>
        studentSkillsLower.some((skill) => tech.toLowerCase().includes(skill) || skill.includes(tech.toLowerCase()))
      );
      score += matchingSkills.length * 15;

      // Difficulty match
      if (params.difficulty && bp.difficulty.toLowerCase() === params.difficulty.toLowerCase()) {
        score += 15;
      }

      // AI/ML mandatory filter
      if (params.aiRequired && (bp.domain === 'AI/ML' || bp.title.toLowerCase().includes('ai') || bp.recommendedTechStack.some((t) => t.includes('PyTorch') || t.includes('FastAPI') || t.includes('Python')))) {
        score += 25;
      }

      return { blueprint: bp, score };
    });

    // Sort by score descending and take top 6
    scored.sort((a, b) => b.score - a.score);
    const selected = scored.slice(0, 6).map((item) => item.blueprint);

    // If we have fewer than 5, fill from remaining
    if (selected.length < 5) {
      for (const bp of PROJECT_BLUEPRINTS) {
        if (!selected.includes(bp)) {
          selected.push(bp);
          if (selected.length >= 6) break;
        }
      }
    }

    // Customize the duration and skills to the student
    return selected.map((bp) => {
      // Blend student's actual skills into recommended stack if not present
      const customStack = [...bp.recommendedTechStack];
      for (const skill of params.student.skills.slice(0, 2)) {
        if (!customStack.some((s) => s.toLowerCase() === skill.toLowerCase())) {
          customStack.push(skill);
        }
      }

      return {
        ...bp,
        recommendedTechStack: customStack,
        estimatedDuration: params.student.duration || bp.estimatedDuration,
      };
    });
  }

  // Calculate feasibility scores and optimize scope
  static analyzeFeasibility(project: {
    title: string;
    shortDescription: string;
    features: string[];
    techStack: string[];
    duration?: string;
    teamSize?: number;
    difficulty?: string;
  }): { feasibility: FeasibilityAnalysisResult; scope: ScopeOptimizationResult } {
    const featureCount = project.features.length;
    const teamSize = project.teamSize || 3;
    const duration = project.duration || '12 weeks';

    // Algorithmic feasibility metrics
    const technicalComplexity = project.difficulty === 'Advanced' ? 8 : project.difficulty === 'Beginner' ? 5 : 7;
    const timeRequirement = featureCount > 6 ? 8 : 6;
    const cost = 9; // Primarily open source tech stack
    const dataAvailability = project.title.toLowerCase().includes('x-ray') || project.title.toLowerCase().includes('health') ? 7 : 8;
    const teamCompatibility = teamSize >= 3 ? 9 : 7;
    const deploymentComplexity = project.techStack.some((t) => t.toLowerCase().includes('docker') || t.toLowerCase().includes('kubernetes')) ? 7 : 8;

    const overallFeasibility = Math.round(
      (10 - technicalComplexity) * 2.5 +
        timeRequirement * 2.5 +
        cost * 2.0 +
        dataAvailability * 1.5 +
        teamCompatibility * 1.5
    );

    const explanation = `This project possesses high academic rigor and industry alignment. With a team size of ${teamSize} and a ${duration} timeframe, the workload is well-balanced provided the team prioritizes the core MVP features before attempting optional advanced modules. Technical risks can be mitigated by using standardized pre-trained models and managed cloud databases.`;

    const risks = [
      'Feature creep: Attempting secondary enhancements before stabilizing core APIs.',
      'Dataset latency: Preprocessing raw files or training models locally without GPU resources.',
      'Integration bottlenecks during the final two weeks between frontend and model services.',
    ];

    // Partition project features into MVP, Recommended, Advanced, Future Scope
    const mvpFeatures: string[] = [];
    const recommendedFeatures: string[] = [];
    const advancedFeatures: string[] = [];
    const futureScopeFeatures: string[] = [];

    project.features.forEach((feat, index) => {
      if (index === 0 || index === 1) {
        mvpFeatures.push(feat);
      } else if (index === 2) {
        recommendedFeatures.push(feat);
      } else if (index === 3) {
        advancedFeatures.push(feat);
      } else {
        futureScopeFeatures.push(feat);
      }
    });

    if (mvpFeatures.length === 0) {
      mvpFeatures.push('Core authentication and secure user dashboard');
      mvpFeatures.push('Primary data pipeline and processing logic');
    }
    if (recommendedFeatures.length === 0) {
      recommendedFeatures.push('Interactive analytics dashboard with data export');
    }
    if (advancedFeatures.length === 0) {
      advancedFeatures.push('Automated recommendation engine with confidence metrics');
    }
    if (futureScopeFeatures.length === 0) {
      futureScopeFeatures.push('Multi-tenant cloud deployment and third-party SaaS webhooks');
      futureScopeFeatures.push('Native mobile app with push notifications');
    }

    return {
      feasibility: {
        overallFeasibility: Math.min(Math.max(overallFeasibility, 70), 92),
        technicalComplexity,
        timeRequirement,
        cost,
        dataAvailability,
        teamCompatibility,
        deploymentComplexity,
        explanation,
        risks,
      },
      scope: {
        originalScopeAssessment: `The initial scope is ambitious. To guarantee a high-grade submission without burning out the ${teamSize}-member team, the project is divided into essential MVP requirements and phased enhancements.`,
        mvpFeatures,
        recommendedFeatures,
        advancedFeatures,
        futureScopeFeatures,
        rationale: 'Focusing initially on the MVP guarantees a fully demonstrable, bug-free core system for mid-term review, while allowing recommended features to be introduced safely in later phases.',
      },
    };
  }

  // Generate recommended tech stack breakdown with why, advantages, and alternatives
  static generateTechStack(projectTitle: string, userStack?: string[]): TechStackItem[] {
    const isAI = projectTitle.toLowerCase().includes('ai') || projectTitle.toLowerCase().includes('model') || projectTitle.toLowerCase().includes('scan');

    return [
      {
        category: 'Frontend',
        name: 'Next.js 14+ (React & TypeScript)',
        whyRecommended: 'Provides server-side rendering, robust file-based routing, and built-in API support with excellent developer productivity.',
        advantages: ['Type-safety with TypeScript', 'Fast page loads with SSR', 'Massive ecosystem of UI libraries like Tailwind CSS'],
        alternatives: ['Vite + React SPA', 'Vue 3 / Nuxt', 'Angular'],
      },
      {
        category: 'Backend',
        name: isAI ? 'FastAPI (Python 3.11)' : 'Next.js Server Actions & Route Handlers',
        whyRecommended: isAI
          ? 'FastAPI offers asynchronous high-performance REST APIs with automatic Swagger documentation and native support for Python ML packages.'
          : 'Integrated backend layer inside Next.js reduces DevOps complexity and allows shared TypeScript models across client and server.',
        advantages: isAI
          ? ['Zero-overhead integration with PyTorch/Scikit-Learn', 'Automatic OpenAPI validation', 'Asynchronous request handling']
          : ['Single repo and unified deployment', 'Zero CORS issues', 'Server-side secrets protection'],
        alternatives: ['Express.js / Node.js', 'Go (Gin)', 'Django REST Framework'],
      },
      {
        category: 'Database',
        name: 'PostgreSQL with Prisma ORM',
        whyRecommended: 'Industry-standard relational database providing strict ACID compliance, relational integrity, and rapid querying.',
        advantages: ['Prisma type-safe client generation', 'Robust indexing and foreign key constraints', 'Seamless local development via SQLite/PostgreSQL'],
        alternatives: ['MongoDB (NoSQL)', 'MySQL', 'Supabase'],
      },
      {
        category: 'Authentication',
        name: 'Secure Token & Session Auth (Bcrypt + JWT)',
        whyRecommended: 'Cryptographically sound authentication pattern with zero heavy third-party vendor lock-in, perfect for academic viva inspection.',
        advantages: ['Complete control over user roles and student profiles', 'Stateless verification', 'Zero external auth cost'],
        alternatives: ['NextAuth.js / Auth.js', 'Clerk', 'Firebase Auth'],
      },
      {
        category: 'AI_ML',
        name: isAI ? 'PyTorch / HuggingFace Transformers' : 'Statistical Analytics & Heuristic Engines',
        whyRecommended: isAI
          ? 'De-facto deep learning framework with rich pre-trained model repositories, active research community, and clean Pythonic debugging.'
          : 'High-speed deterministic algorithms and scoring matrices without GPU dependency.',
        advantages: isAI
          ? ['Transfer learning from state-of-the-art weights', 'Dynamic computation graph', 'Exportable to ONNX for production']
          : ['Instant sub-millisecond execution', '100% predictable output', 'Low hosting footprint'],
        alternatives: ['TensorFlow / Keras', 'OpenAI API', 'Scikit-Learn'],
      },
      {
        category: 'APIs',
        name: 'RESTful JSON Architecture with Zod Validation',
        whyRecommended: 'Simple, predictable endpoints adhering to HTTP standards, easily testable with Postman and cURL.',
        advantages: ['Human-readable request/response contracts', 'Universal client compatibility', 'Comprehensive error status codes'],
        alternatives: ['GraphQL', 'tRPC', 'gRPC'],
      },
      {
        category: 'Storage',
        name: 'Cloudflare R2 or Local Disk Storage with File Fingerprinting',
        whyRecommended: 'Cost-effective object storage for uploaded PDFs, datasets, and generated reports with S3-compatible APIs.',
        advantages: ['Zero egress fees with Cloudflare R2', 'Easy local fallback during development', 'Support for large binary payloads'],
        alternatives: ['AWS S3', 'Firebase Cloud Storage', 'Supabase Storage'],
      },
      {
        category: 'Deployment',
        name: 'Vercel (Frontend/Next.js) & Render / Railway (Backend/Database)',
        whyRecommended: 'Generous student tiers, continuous deployment directly from GitHub commits, and automated HTTPS certificates.',
        advantages: ['Zero-config Git push deployments', 'Automatic environment variable encryption', 'Built-in server health logs'],
        alternatives: ['Docker on DigitalOcean Droplet', 'AWS EC2 / ECS', 'Google Cloud Run'],
      },
    ];
  }

  // Generate week-by-week development roadmap
  static generateRoadmap(durationWeeks = 12, projectTitle: string): RoadmapTaskItem[] {
    const weeks = Math.max(durationWeeks, 8);
    const roadmap: RoadmapTaskItem[] = [];

    roadmap.push({
      weekNumber: 1,
      title: 'Problem Definition & System Requirements (SRS)',
      description: 'Document the formal problem statement, research existing literature, and create Software Requirements Specification (SRS).',
      subtasks: ['Write formal problem statement & objectives', 'Compile literature review of existing solutions', 'Define functional & non-functional requirements'],
      estimatedHours: 12,
      dependencies: [],
      expectedOutput: 'Approved SRS document & research notes',
      completionCriteria: 'Project mentor signs off on scope boundaries',
    });

    roadmap.push({
      weekNumber: 2,
      title: 'System Architecture & Database Schema Design',
      description: 'Draft the high-level system architecture, entity-relationship (ER) diagrams, and API endpoint contracts.',
      subtasks: ['Create system architecture block diagram', 'Design normalized relational schema with primary/foreign keys', 'Document REST API contracts with JSON schemas'],
      estimatedHours: 15,
      dependencies: ['Week 1'],
      expectedOutput: 'Prisma schema file, ER diagram, and API blueprint',
      completionCriteria: 'Database migrations execute cleanly with seed data',
    });

    roadmap.push({
      weekNumber: 3,
      title: 'Core Backend Setup & Authentication Module',
      description: 'Implement user registration, secure password hashing, session tokens, and protected route middlewares.',
      subtasks: ['Setup repository structure and environment configs', 'Implement register/login endpoints with Bcrypt & JWT', 'Write auth middleware to guard student endpoints'],
      estimatedHours: 18,
      dependencies: ['Week 2'],
      expectedOutput: 'Functional authentication system with session management',
      completionCriteria: 'Postman tests pass for valid/invalid credentials',
    });

    roadmap.push({
      weekNumber: 4,
      title: 'Frontend UI Shell & Student Dashboard',
      description: 'Build modern responsive layout, navigation sidebar, student profile page, and base state management.',
      subtasks: ['Create responsive SaaS navigation and theme shell', 'Build student profile form and onboarding wizard', 'Implement central dashboard card widgets'],
      estimatedHours: 16,
      dependencies: ['Week 3'],
      expectedOutput: 'Navigable web interface connected to auth state',
      completionCriteria: 'Student can log in and view their personal dashboard',
    });

    roadmap.push({
      weekNumber: 5,
      title: 'Primary Data Pipeline / Core Business Logic',
      description: 'Construct the foundational data ingestion, file upload parsers, and preprocessing pipelines.',
      subtasks: ['Build secure file upload endpoint with size & MIME validation', 'Implement text extraction and parsing routines', 'Save normalized records to database'],
      estimatedHours: 20,
      dependencies: ['Week 4'],
      expectedOutput: 'Working upload and data normalization pipeline',
      completionCriteria: 'Sample student files parse accurately without errors',
    });

    roadmap.push({
      weekNumber: 6,
      title: 'AI / Algorithm Implementation (Core Feature)',
      description: 'Integrate the central intelligent module (ML model inference, NLP scoring, or algorithmic engine).',
      subtasks: ['Load model weights or setup AI inference service', 'Build prompt engineering / scoring heuristics', 'Format model output into structured JSON responses'],
      estimatedHours: 22,
      dependencies: ['Week 5'],
      expectedOutput: 'End-to-end algorithmic processing pipeline',
      completionCriteria: 'Inference returns expected predictions within latency budget',
    });

    roadmap.push({
      weekNumber: 7,
      title: 'Interactive User Interface & Visualizations',
      description: 'Develop data visualization components, progress gauges, score breakdowns, and result cards.',
      subtasks: ['Integrate Recharts / SVG visual gauges for scores', 'Build interactive result filtering and inspection modals', 'Add copy, share, and PDF export triggers'],
      estimatedHours: 16,
      dependencies: ['Week 6'],
      expectedOutput: 'Rich visualization screens for student project results',
      completionCriteria: 'Data updates dynamically based on backend responses',
    });

    roadmap.push({
      weekNumber: 8,
      title: 'Scope Enhancements & Recommended Features',
      description: 'Implement tier-2 recommended features (e.g. comparison matrices, history logs, feedback alerts).',
      subtasks: ['Build project history and saved state drawer', 'Implement comparison table across multiple runs', 'Add real-time toast feedback and validation alerts'],
      estimatedHours: 15,
      dependencies: ['Week 7'],
      expectedOutput: 'Polished feature-complete application',
      completionCriteria: 'All recommended scope items functioning reliably',
    });

    roadmap.push({
      weekNumber: 9,
      title: 'GitHub Integration & Code Refactoring',
      description: 'Connect repository tracking, clean up spaghetti code, modularize services, and audit code style.',
      subtasks: ['Organize code into clean modular services and types', 'Run linter and resolve all warnings and TypeScript errors', 'Connect GitHub API scanner for repo health checks'],
      estimatedHours: 14,
      dependencies: ['Week 8'],
      expectedOutput: 'Clean, modular codebase with GitHub sync',
      completionCriteria: 'Zero build errors and clean Git commit history',
    });

    roadmap.push({
      weekNumber: 10,
      title: 'Comprehensive Testing & Edge Case Hardening',
      description: 'Execute unit tests, API integration tests, and handle unexpected inputs, rate limits, and network errors.',
      subtasks: ['Write unit tests for core scoring functions', 'Test edge cases (empty inputs, oversized files, malformed JSON)', 'Verify user-friendly error banners and retry states'],
      estimatedHours: 16,
      dependencies: ['Week 9'],
      expectedOutput: 'Test suite and hardened error handling',
      completionCriteria: 'App handles failed API or network calls gracefully',
    });

    roadmap.push({
      weekNumber: 11,
      title: 'Production Deployment & Performance Optimization',
      description: 'Deploy web app and backend to cloud hosting with SSL certificates and environment variables.',
      subtasks: ['Deploy Next.js application to Vercel/Railway', 'Verify live database connections and SSL security headers', 'Optimize asset loading and bundle sizes'],
      estimatedHours: 12,
      dependencies: ['Week 10'],
      expectedOutput: 'Live publicly accessible HTTPS URL',
      completionCriteria: 'Application is accessible and performs smoothly on mobile/desktop',
    });

    roadmap.push({
      weekNumber: 12,
      title: 'Final Project Report & Viva Examination Preparation',
      description: 'Compile the IEEE/university final project report, slide deck, and practice project viva questions.',
      subtasks: ['Compile final project documentation (Abstract, Architecture, Results, Conclusion)', 'Create professional 15-slide presentation deck', 'Conduct simulated mock viva sessions with AI Mentor'],
      estimatedHours: 15,
      dependencies: ['Week 11'],
      expectedOutput: 'Complete submission dossier & viva readiness',
      completionCriteria: 'Student scores 8.5+ in mock viva evaluation',
    });

    return roadmap.slice(0, weeks);
  }

  // Answer mentor questions with deep project context
  static answerMentorQuestion(params: {
    question: string;
    projectTitle: string;
    problemStatement: string;
    techStack: string[];
    currentPhase: string;
    studentSkills: string[];
  }): string {
    const q = params.question.toLowerCase();

    if (q.includes('auth') || q.includes('login') || q.includes('jwt') || q.includes('bcrypt')) {
      return `For **${params.projectTitle}**, here is the recommended approach to implement authentication:

1. **Password Security**: Never store plaintext passwords. Hash them using \`scrypt\` or \`bcryptjs\` with at least 10 salt rounds before saving to your database.
2. **Session Token**: Generate an \`HMAC-SHA256\` signed JWT containing only non-sensitive identifiers (\`userId\`, \`role\`, \`exp\`). Set an expiration of 7 days.
3. **Cookie Storage**: Store the token in an \`httpOnly\`, \`sameSite: lax\`, and \`secure\` cookie. This protects the student session from Cross-Site Scripting (XSS) attacks.
4. **Middleware Guard**: Intercept requests in your Next.js \`middleware.ts\` or API route handler to check for cookie presence before granting access to protected routes like \`/dashboard\` and \`/project\`.

\`\`\`typescript
// Example secure password hashing snippet
import crypto from 'crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return \`\${salt}:\${hash}\`;
}
\`\`\`
This satisfies university security audit requirements!`;
    }

    if (q.includes('500') || q.includes('error') || q.includes('fail') || q.includes('bug')) {
      return `Debugging a **500 Internal Server Error** in **${params.projectTitle}**:

A 500 error means an unhandled exception crashed your backend handler before an HTTP response was dispatched. Follow this 4-step triage:

1. **Inspect Server Logs**: Look at your terminal running \`npm run dev\` or your hosting log stream. Look for the exact stack trace and line number.
2. **Database Null Checks**: Most 500 errors in student projects happen when trying to access a nested property on a \`null\` object (e.g. \`user.studentProfile.branch\` when the profile hasn't been created yet). Always use optional chaining (\`user?.studentProfile?.branch\`).
3. **JSON Parse Exceptions**: If receiving incoming payloads, wrap \`JSON.parse()\` or \`await req.json()\` inside a \`try...catch\` block to handle malformed requests cleanly with a \`400 Bad Request\` instead of a 500 crash.
4. **Environment Variables**: Check if your database connection string or secret keys are missing or spelled incorrectly in \`.env\`.

Wrap your API route in:
\`\`\`typescript
try {
  // Your business logic
  return NextResponse.json({ success: true, data });
} catch (error) {
  console.error("API Route Error:", error);
  return NextResponse.json({ error: "Operation failed. Check server logs." }, { status: 500 });
}
\`\`\``;
    }

    if (q.includes('accuracy') || q.includes('72%') || q.includes('model') || q.includes('ml') || q.includes('predict')) {
      return `Improving model performance for **${params.projectTitle}** (currently ~72%):

In final-year projects, examiners look at **methodology** just as much as raw accuracy. Here is how to boost performance and defend your results:

1. **Address Class Imbalance**: If certain classes have significantly fewer samples, use SMOTE (Synthetic Minority Over-sampling) or apply focal loss / class weights during training.
2. **Feature Engineering**: Instead of relying solely on raw text or basic tokens, extract domain-specific signals (e.g., n-grams, technical entity density, TF-IDF ratios).
3. **Pretrained Ensembling**: Combine your classifier with a fine-tuned lightweight Transformer (e.g. \`sentence-transformers/all-MiniLM-L6-v2\` or \`distilbert-base-uncased\`). Transfer learning typically bumps accuracy from 72% to 88%+.
4. **Hyperparameter Tuning**: Run a GridSearch or Optuna trial on learning rates (try 1e-4 vs 3e-5) and batch sizes.
5. **Viva Defense Tip**: In your viva, show the confusion matrix! Explain *which* specific classes caused misclassifications and state that precision on critical classes was prioritized over overall recall.`;
    }

    if (q.includes('postgresql') || q.includes('database') || q.includes('sqlite') || q.includes('mongodb')) {
      return `Why **PostgreSQL** is the right choice for **${params.projectTitle}**:

1. **Relational Integrity**: Final-year projects involve structured relational models (Students → Projects → Roadmaps → Evaluations). Foreign key constraints prevent orphaned records.
2. **ACID Transactions**: Financial, authentication, and scoring mutations require atomic execution so partial writes never corrupt state.
3. **JSONB Flexibility**: PostgreSQL supports semi-structured JSONB columns, giving you the schema flexibility of MongoDB alongside the relational power of SQL.
4. **Prisma Type-Safety**: Pairing Postgres with Prisma ORM auto-generates TypeScript types for your entire database, eliminating SQL injection vulnerabilities and runtime schema errors.
5. **Smooth Local to Production**: You can develop locally with SQLite and migrate to cloud Postgres (Supabase, Neon, Railway) by simply changing the \`DATABASE_URL\` connection string!`;
    }

    if (q.includes('large') || q.includes('scope') || q.includes('remove') || q.includes('cut')) {
      return `Scope Optimization Advice for **${params.projectTitle}**:

Your project's current phase is **${params.currentPhase}**. It is smart to trim excessive scope early to ensure high quality before submission!

**What to keep as MUST-HAVE (MVP)**:
- Core data processing and scoring pipeline.
- Interactive student dashboard and clean visual results.
- End-to-end working flow from input to evaluation.

**What to postpone to 'Future Scope'**:
- Multi-language localization (keep English only).
- Real-time WebRTC audio/video chat (use text-based interaction instead).
- Native iOS/Android app wrappers (ensure the web UI is mobile-responsive instead).
- Complex custom payment gateways.

**In your viva defense**: You will score higher with a **flawless, polished MVP** than with an unfinished complex system that throws errors during your live examiner demo!`;
    }

    if (q.includes('next') || q.includes('what should i do') || q.includes('which feature')) {
      return `Next recommended feature for **${params.projectTitle}**:

Based on your current milestone (**${params.currentPhase}**) and tech stack (${params.techStack.slice(0, 3).join(', ')}):

1. **Next Immediate Step**: Complete the end-to-end integration of your primary business logic with the frontend dashboard. Make sure you can input sample test data and view formatted output cards.
2. **Validation**: Add client-side validation to catch empty fields before firing backend requests.
3. **Visual Polish**: Add a loading skeleton state and toast notification so the user knows the AI is processing their request.
4. **Check your Roadmap**: Navigate to the **Roadmap** tab to check off completed subtasks and keep your **Project Health Score** high!`;
    }

    // Default contextual answer
    return `Regarding your question about **${params.projectTitle}**:

In the **${params.currentPhase}** phase, ensure your implementation adheres to solid architectural patterns:
- Keep business logic decoupled from UI components.
- Validate all incoming payloads before processing.
- Write unit tests for your core calculation functions.
- Given your skills in **${params.studentSkills.join(', ')}**, make sure to highlight modular software engineering principles in your final project report.

Feel free to ask for specific code snippets, database schemas, or viva explanations on any part of your system!`;
  }

  // Generate viva examination questions
  static generateVivaQuestions(projectTitle: string, techStack: string[]): VivaQuestionItem[] {
    const stackStr = techStack.join(', ');
    return [
      {
        category: 'BASIC',
        questionText: `What is the primary motivation and real-world problem statement addressed by ${projectTitle}?`,
        idealAnswer: `The project addresses critical inefficiencies in current manual or legacy workflows by providing an automated, scalable solution. It bridges the gap between raw data input and actionable intelligence, significantly reducing turnaround time and human error for our target end-users.`,
      },
      {
        category: 'TECHNICAL',
        questionText: `Why did you select your specific tech stack (${stackStr}) over alternative architectures?`,
        idealAnswer: `We selected this stack to optimize developer velocity, type-safety, and execution performance. Next.js provides full-stack TypeScript capabilities with server-side rendering and API routes. PostgreSQL with Prisma ensures strict relational integrity and eliminates runtime schema mismatches, while our model layer offers low-latency inference. Alternatives like monolithic PHP or unvalidated NoSQL lacked the type-safety and asynchronous scaling required.`,
      },
      {
        category: 'ARCHITECTURE',
        questionText: `Walk me through the end-to-end data flow when a user submits a request in ${projectTitle}.`,
        idealAnswer: `When a request is submitted, the frontend validates input types before dispatching a secure HTTP POST with an authentication cookie. The API route authenticates the session, parses the payload with schema validation, and passes it to the core service layer. The service performs data normalization, queries the database, triggers the algorithmic or AI module, persists the state atomically, and returns a structured JSON response to the client for dynamic UI rendering.`,
      },
      {
        category: 'ADVANCED',
        questionText: `What happens if your system experiences high concurrent traffic or external API rate limits? How is fault tolerance achieved?`,
        idealAnswer: `The system is designed with graceful degradation and defense-in-depth: database connection pooling prevents saturation, stateless JWT sessions enable horizontal scaling across serverless instances, and external service calls are wrapped in exponential-backoff retry blocks with fallback heuristic engines to ensure uninterrupted availability even during third-party service outages.`,
      },
      {
        category: 'TECHNICAL',
        questionText: `How did you test your application, and what measures did you take to prevent common security vulnerabilities like XSS and SQL Injection?`,
        idealAnswer: `We implemented multi-level testing: unit tests for core scoring heuristics and integration tests for API routes. For security, SQL injection is completely prevented through parameterized queries generated by Prisma ORM. Cross-Site Scripting (XSS) is mitigated by React's automatic string escaping, and session cookies are set to HttpOnly and SameSite=Lax. Sensitive endpoints enforce input size and type validation.`,
      },
      {
        category: 'ADVANCED',
        questionText: `What are the chief technical limitations of your project, and what would you implement in Phase 2?`,
        idealAnswer: `The current limitation is that inference requires adequate server memory and models depend on the diversity of our initial dataset. In Phase 2, we plan to implement edge-device ONNX runtime compilation, introduce automated CI/CD retraining pipelines using incoming user feedback loops, and add native mobile application push notifications.`,
      },
    ];
  }

  // Evaluate student's viva answer
  static evaluateVivaAnswer(question: string, studentAnswer: string): VivaEvaluationResult {
    const wordCount = studentAnswer.trim().split(/\s+/).length;
    const answerLower = studentAnswer.toLowerCase();

    // Scoring heuristics based on technical depth, keywords, and length
    let understanding = 7.0;
    let accuracy = 7.0;
    let completeness = 7.0;

    const technicalKeywords = ['architecture', 'database', 'api', 'security', 'prisma', 'latency', 'scale', 'validation', 'token', 'model', 'dataset', 'sql', 'jwt', 'pipeline', 'component'];
    const matchedKeywords = technicalKeywords.filter((k) => answerLower.includes(k));

    if (wordCount > 30) completeness += 1.0;
    if (wordCount > 70) completeness += 1.0;
    if (wordCount < 15) {
      completeness -= 2.0;
      understanding -= 1.5;
    }

    if (matchedKeywords.length >= 2) {
      understanding += 1.0;
      accuracy += 0.8;
    }
    if (matchedKeywords.length >= 4) {
      understanding += 1.0;
      accuracy += 1.2;
    }

    understanding = Math.min(Math.max(Math.round(understanding * 10) / 10, 5.0), 9.8);
    accuracy = Math.min(Math.max(Math.round(accuracy * 10) / 10, 5.0), 9.6);
    completeness = Math.min(Math.max(Math.round(completeness * 10) / 10, 4.5), 9.5);

    const overallScore = Math.round(((understanding * 0.35 + accuracy * 0.35 + completeness * 0.3) * 10)) / 10;

    const aiFeedback =
      overallScore >= 8.5
        ? 'Excellent answer! You demonstrated strong technical grasp, cited specific architectural justifications, and answered with professional confidence.'
        : overallScore >= 7.0
        ? 'Good response. You captured the core concept well. To impress strict external examiners, elaborate more on specific design tradeoffs and security considerations.'
        : 'Acceptable starting point, but too brief or generic. Mention exact technical mechanisms (e.g. naming the protocols, libraries, or schema constraints) rather than generalities.';

    const improvedAnswer = `An exemplary response to this question is: "In our project, we addressed this directly through our architectural design. We decoupled the presentation layer from backend business logic using RESTful APIs with strict schema validation. For state persistence, we utilized PostgreSQL with Prisma ORM for relational integrity and parameterized query safety. By handling edge cases gracefully and incorporating fallback handlers, the system maintains high availability and verifiable accuracy under academic evaluation."`;

    return {
      understandingScore: understanding,
      accuracyScore: accuracy,
      completenessScore: completeness,
      overallScore,
      aiFeedback,
      improvedAnswer,
    };
  }

  // Generate final project evaluation
  static evaluateProject(projectTitle: string, progress: number, taskCount: number, completedTasks: number): EvaluationResult {
    const completionRatio = taskCount > 0 ? completedTasks / taskCount : 0.75;

    const innovationScore = 8.5;
    const technicalDepthScore = 8.2;
    const practicalValueScore = 9.0;
    const uiUxScore = 8.4;
    const codeQualityScore = 8.0;
    const testingScore = completionRatio > 0.7 ? 7.8 : 6.5;
    const docScore = 8.2;

    const overallScore = Math.round(
      ((innovationScore + technicalDepthScore + practicalValueScore + uiUxScore + codeQualityScore + testingScore + docScore) / 7) * 10
    ) / 10;

    return {
      innovationScore,
      technicalDepthScore,
      practicalValueScore,
      uiUxScore,
      codeQualityScore,
      testingScore,
      docScore,
      overallScore,
      whatIsGood: [
        'Clear problem statement directly addressing real-world user pain points.',
        'Modern, well-chosen technology stack with high industry demand (Next.js, TypeScript, PostgreSQL).',
        'Strong modular architecture with clean separation between UI components and backend logic.',
        'High practical utility and attractive resume value for recruitment drives.',
      ],
      whatNeedsImprovement: [
        'Expand automated test coverage across edge cases and malformed API payloads.',
        'Refine the README documentation to include comprehensive local setup commands and architecture diagrams.',
        'Add explicit loading skeletons and accessibility ARIA labels on all interactive controls.',
      ],
      topImprovements: [
        'Priority 1: Add automated unit tests for core scoring heuristics before final submission.',
        'Priority 2: Enhance the GitHub README with installation steps, screenshots, and live demo link.',
        'Priority 3: Ensure database indexes are created on frequently queried foreign keys.',
        'Priority 4: Complete the viva simulator questions under the Viva tab to practice oral defenses.',
        'Priority 5: Export a clean PDF documentation report containing system architecture and ER diagrams.',
      ],
    };
  }
}
