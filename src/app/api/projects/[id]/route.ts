import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        features: {
          orderBy: { createdAt: 'asc' },
        },
        technologies: {
          orderBy: { createdAt: 'asc' },
        },
        roadmaps: {
          include: {
            tasks: {
              orderBy: { weekNumber: 'asc' },
            },
          },
        },
        conversations: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        githubRepositories: {
          include: {
            analyses: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
        evaluations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        vivaSessions: {
          include: {
            questions: {
              include: {
                answers: true,
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Get Project Error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title || undefined,
        currentPhase: body.currentPhase || undefined,
        overallProgress: body.overallProgress !== undefined ? Number(body.overallProgress) : undefined,
        healthScore: body.healthScore !== undefined ? Number(body.healthScore) : undefined,
        feasibilityScore: body.feasibilityScore !== undefined ? Number(body.feasibilityScore) : undefined,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error('Update Project Error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
