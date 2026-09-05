import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { AIService } from '@/lib/ai/service';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        roadmaps: { include: { tasks: true } },
        githubRepositories: { include: { analyses: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const tasks = project.roadmaps[0]?.tasks || [];
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;

    // Run evaluation
    const evaluation = AIService.evaluateProject(
      project.title,
      project.overallProgress,
      tasks.length,
      completedTasks
    );

    // Persist to database
    const saved = await prisma.projectEvaluation.create({
      data: {
        projectId,
        innovationScore: evaluation.innovationScore,
        technicalDepthScore: evaluation.technicalDepthScore,
        practicalValueScore: evaluation.practicalValueScore,
        uiUxScore: evaluation.uiUxScore,
        codeQualityScore: evaluation.codeQualityScore,
        testingScore: evaluation.testingScore,
        docScore: evaluation.docScore,
        overallScore: evaluation.overallScore,
        whatIsGood: JSON.stringify(evaluation.whatIsGood),
        whatNeedsImprovement: JSON.stringify(evaluation.whatNeedsImprovement),
        topImprovements: JSON.stringify(evaluation.topImprovements),
      },
    });

    return NextResponse.json({
      success: true,
      evaluation: {
        ...evaluation,
        id: saved.id,
        createdAt: saved.createdAt,
      },
    });
  } catch (error) {
    console.error('Project Evaluation Error:', error);
    return NextResponse.json({ error: 'Failed to run project evaluation' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;

    const evaluation = await prisma.projectEvaluation.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    if (!evaluation) {
      return NextResponse.json({ evaluation: null });
    }

    return NextResponse.json({
      evaluation: {
        ...evaluation,
        whatIsGood: JSON.parse(evaluation.whatIsGood || '[]'),
        whatNeedsImprovement: JSON.parse(evaluation.whatNeedsImprovement || '[]'),
        topImprovements: JSON.parse(evaluation.topImprovements || '[]'),
      },
    });
  } catch (error) {
    console.error('Get Evaluation Error:', error);
    return NextResponse.json({ error: 'Failed to fetch evaluation' }, { status: 500 });
  }
}
