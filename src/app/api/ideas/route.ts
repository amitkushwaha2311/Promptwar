import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { AIService } from '@/lib/ai/service';

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();

    const {
      branch,
      skills,
      interests,
      domain,
      difficulty,
      teamSize,
      projectDuration,
      preferredTech,
      aiRequired,
      projectType,
      apiKey,
    } = body;

    const studentSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s: string) => s.trim())
      : ['Python', 'JavaScript'];

    const studentInterests = Array.isArray(interests)
      ? interests
      : typeof interests === 'string'
      ? interests.split(',').map((i: string) => i.trim())
      : ['AI', 'Web Development'];

    const ideas = await AIService.generateIdeas({
      student: {
        branch: branch || session?.profile?.branch || 'Computer Science',
        skills: studentSkills,
        interests: studentInterests,
        experienceLevel: difficulty || 'Intermediate',
        teamSize: Number(teamSize) || 3,
        duration: projectDuration || '4 months',
      },
      domain,
      projectType,
      difficulty,
      aiRequired: Boolean(aiRequired),
      apiKey,
    });

    // If user is authenticated, save the generated ideas for easy review/comparison
    const savedIdeas = [];
    if (session) {
      for (const idea of ideas) {
        const saved = await prisma.projectIdea.create({
          data: {
            userId: session.id,
            title: idea.title,
            shortDescription: idea.shortDescription,
            problemStatement: idea.problemStatement,
            proposedSolution: idea.proposedSolution,
            targetUsers: idea.targetUsers,
            coreFeatures: JSON.stringify(idea.coreFeatures),
            optionalFeatures: JSON.stringify(idea.optionalFeatures),
            recommendedTechStack: JSON.stringify(idea.recommendedTechStack),
            estimatedDuration: idea.estimatedDuration,
            difficulty: idea.difficulty,
            innovationScore: idea.innovationScore,
            practicalityScore: idea.practicalityScore,
            resumeValue: idea.resumeValue,
            futureScope: JSON.stringify(idea.futureScope),
            potentialChallenges: JSON.stringify(idea.potentialChallenges),
          },
        });
        savedIdeas.push({ ...idea, id: saved.id });
      }
    }

    return NextResponse.json({
      success: true,
      ideas: savedIdeas.length > 0 ? savedIdeas : ideas.map((idea, index) => ({ ...idea, id: `temp-${index + 1}` })),
    });
  } catch (error) {
    console.error('Generate Ideas Error:', error);
    return NextResponse.json({ error: 'Failed to generate project ideas' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ ideas: [] });
    }

    const ideas = await prisma.projectIdea.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const parsedIdeas = ideas.map((idea) => ({
      ...idea,
      coreFeatures: JSON.parse(idea.coreFeatures || '[]'),
      optionalFeatures: JSON.parse(idea.optionalFeatures || '[]'),
      recommendedTechStack: JSON.parse(idea.recommendedTechStack || '[]'),
      futureScope: JSON.parse(idea.futureScope || '[]'),
      potentialChallenges: JSON.parse(idea.potentialChallenges || '[]'),
    }));

    return NextResponse.json({ ideas: parsedIdeas });
  } catch (error) {
    console.error('Fetch Ideas Error:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}
