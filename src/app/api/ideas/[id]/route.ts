import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const idea = await prisma.projectIdea.findUnique({
      where: { id },
    });

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const parsedIdea = {
      ...idea,
      coreFeatures: JSON.parse(idea.coreFeatures || '[]'),
      optionalFeatures: JSON.parse(idea.optionalFeatures || '[]'),
      recommendedTechStack: JSON.parse(idea.recommendedTechStack || '[]'),
      futureScope: JSON.parse(idea.futureScope || '[]'),
      potentialChallenges: JSON.parse(idea.potentialChallenges || '[]'),
    };

    return NextResponse.json({ idea: parsedIdea });
  } catch (error) {
    console.error('Get Idea Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve idea' }, { status: 500 });
  }
}
