import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { AIService } from '@/lib/ai/service';

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      shortDescription,
      problemStatement,
      proposedSolution,
      targetUsers,
      domain,
      projectType,
      difficulty,
      estimatedDuration,
      teamSize,
      coreFeatures,
      optionalFeatures,
      recommendedTechStack,
    } = body;

    if (!title || !shortDescription) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const duration = estimatedDuration || '12 weeks';
    const numTeam = Number(teamSize) || 3;
    const diff = difficulty || 'Intermediate';

    // 1. Create base project record
    const project = await prisma.project.create({
      data: {
        userId: session.id,
        title,
        shortDescription,
        problemStatement: problemStatement || shortDescription,
        proposedSolution: proposedSolution || 'A comprehensive, modern full-stack implementation.',
        targetUsers: targetUsers || 'Students and academic evaluators',
        domain: domain || 'AI/ML',
        projectType: projectType || 'Web Application',
        difficulty: diff,
        estimatedDuration: duration,
        teamSize: numTeam,
        currentPhase: 'Requirements & Design',
        overallProgress: 0,
        healthScore: 88,
        feasibilityScore: 84,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // ~90 days default
      },
    });

    // 2. Run Feasibility & Scope Analyzer
    const featuresList = [
      ...(Array.isArray(coreFeatures) ? coreFeatures : []),
      ...(Array.isArray(optionalFeatures) ? optionalFeatures : []),
    ];
    if (featuresList.length === 0) {
      featuresList.push('Core business logic and data pipeline', 'User authentication and role dashboard', 'Interactive analytics visualizer');
    }

    const techStackList = Array.isArray(recommendedTechStack)
      ? recommendedTechStack
      : ['Next.js', 'PostgreSQL', 'Python', 'Prisma'];

    const analysis = await AIService.analyzeFeasibility({
      title,
      shortDescription,
      features: featuresList,
      techStack: techStackList,
      duration,
      teamSize: numTeam,
      difficulty: diff,
    });

    // Save partitioned features (MVP, RECOMMENDED, ADVANCED, FUTURE_SCOPE)
    const { mvpFeatures, recommendedFeatures, advancedFeatures, futureScopeFeatures } = analysis.scope;

    for (const f of mvpFeatures) {
      await prisma.projectFeature.create({
        data: { projectId: project.id, title: f, description: 'Mandatory core MVP requirement', category: 'MVP', priority: 'HIGH', status: 'TODO' },
      });
    }
    for (const f of recommendedFeatures) {
      await prisma.projectFeature.create({
        data: { projectId: project.id, title: f, description: 'Secondary feature for high technical depth', category: 'RECOMMENDED', priority: 'MEDIUM', status: 'TODO' },
      });
    }
    for (const f of advancedFeatures) {
      await prisma.projectFeature.create({
        data: { projectId: project.id, title: f, description: 'Advanced enhancement for top viva grade', category: 'ADVANCED', priority: 'LOW', status: 'TODO' },
      });
    }
    for (const f of futureScopeFeatures) {
      await prisma.projectFeature.create({
        data: { projectId: project.id, title: f, description: 'Postpone to Phase 2 / Future Scope', category: 'FUTURE_SCOPE', priority: 'LOW', status: 'TODO' },
      });
    }

    // 3. Generate and save Tech Stack recommendations
    const techStackItems = AIService.generateTechStack(title, techStackList);
    for (const t of techStackItems) {
      await prisma.projectTechnology.create({
        data: {
          projectId: project.id,
          category: t.category,
          name: t.name,
          whyRecommended: t.whyRecommended,
          advantages: JSON.stringify(t.advantages),
          alternatives: JSON.stringify(t.alternatives),
        },
      });
    }

    // 4. Generate 12-week Development Roadmap
    const durationWeeks = parseInt(duration.replace(/\D/g, '')) || 12;
    const roadmapTasks = await AIService.generateRoadmap(durationWeeks, title, techStackList, featuresList);

    const roadmap = await prisma.projectRoadmap.create({
      data: {
        projectId: project.id,
        title: `${durationWeeks}-Week Master Development Roadmap`,
        durationWeeks,
        currentWeek: 1,
      },
    });

    for (const task of roadmapTasks) {
      await prisma.roadmapTask.create({
        data: {
          roadmapId: roadmap.id,
          weekNumber: task.weekNumber,
          title: task.title,
          description: task.description,
          subtasks: JSON.stringify(task.subtasks.map((s, i) => ({ id: `${task.weekNumber}-${i}`, text: s, done: false }))),
          estimatedHours: task.estimatedHours,
          dependencies: JSON.stringify(task.dependencies),
          expectedOutput: task.expectedOutput,
          completionCriteria: task.completionCriteria,
          status: 'TODO',
        },
      });
    }

    // Update feasibility score on project record
    await prisma.project.update({
      where: { id: project.id },
      data: { feasibilityScore: analysis.feasibility.overallFeasibility },
    });

    return NextResponse.json({
      success: true,
      projectId: project.id,
      project,
      feasibility: analysis.feasibility,
      scope: analysis.scope,
    });
  } catch (error) {
    console.error('Create Project Error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ projects: [] });
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        features: true,
        technologies: true,
        roadmaps: {
          include: {
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get Projects Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
