import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { AIService } from '@/lib/ai/service';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const session = await getSessionUser();
    const body = await req.json();
    const { question, apiKey } = body;

    if (!question || !question.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // 1. Fetch full project context
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        features: true,
        technologies: true,
        roadmaps: {
          include: {
            tasks: { orderBy: { weekNumber: 'asc' } },
          },
        },
        githubRepositories: {
          include: { analyses: { orderBy: { createdAt: 'desc' }, take: 1 } },
        },
        conversations: {
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2. Resolve or create conversation
    let conversation = project.conversations[0];
    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          projectId: project.id,
          userId: session?.id || project.userId,
          title: `${project.title} Mentorship Session`,
        },
        include: { messages: true },
      });
    }

    // 3. Save student question message
    const userMsg = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: question,
      },
    });

    // 4. Assemble rich project context
    const studentSkills: string[] = session?.profile?.programmingLanguages
      ? JSON.parse(session.profile.programmingLanguages)
      : ['Python', 'JavaScript', 'React'];

    const techStackNames = project.technologies.map((t) => t.name);
    const recentMsgs = conversation.messages.slice(-4).map((m) => ({ role: m.role, content: m.content }));

    // 5. Ask AI Mentor
    const answer = await AIService.askMentor({
      question,
      projectTitle: project.title,
      problemStatement: project.problemStatement,
      techStack: techStackNames,
      currentPhase: project.currentPhase,
      studentSkills,
      recentMessages: recentMsgs,
      apiKey,
    });

    // 6. Save mentor response message
    const assistantMsg = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: answer,
      },
    });

    return NextResponse.json({
      success: true,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    });
  } catch (error) {
    console.error('Mentor Chat Error:', error);
    return NextResponse.json({ error: 'Failed to generate mentor response' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;

    const conversation = await prisma.aIConversation.findFirst({
      where: { projectId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json({ messages: conversation?.messages || [] });
  } catch (error) {
    console.error('Get Mentor Messages Error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
