import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { AIService } from '@/lib/ai/service';

// 1. GET current viva session, questions, and answers
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;

    const session = await prisma.vivaSession.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            answers: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Get Viva Session Error:', error);
    return NextResponse.json({ error: 'Failed to fetch viva session' }, { status: 500 });
  }
}

// 2. POST to generate/regenerate viva questions
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const sessionUser = await getSessionUser();
    const body = await req.json().catch(() => ({}));

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { technologies: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const techNames = project.technologies.map((t) => t.name);

    // Generate questions
    const generatedQuestions = await AIService.generateVivaQuestions(project.title, techNames, body.apiKey);

    // Create session
    const vivaSession = await prisma.vivaSession.create({
      data: {
        projectId,
        userId: sessionUser?.id || project.userId,
        title: `${project.title} Mock Viva Examination`,
      },
    });

    // Create questions
    const createdQuestions = [];
    let order = 1;
    for (const q of generatedQuestions) {
      const created = await prisma.vivaQuestion.create({
        data: {
          sessionId: vivaSession.id,
          category: q.category,
          questionText: q.questionText,
          idealAnswer: q.idealAnswer,
          orderIndex: order++,
        },
      });
      createdQuestions.push({ ...created, answers: [] });
    }

    return NextResponse.json({
      success: true,
      session: {
        ...vivaSession,
        questions: createdQuestions,
      },
    });
  } catch (error) {
    console.error('Generate Viva Error:', error);
    return NextResponse.json({ error: 'Failed to generate viva session' }, { status: 500 });
  }
}

// 3. PUT to submit an answer to a viva question and get AI evaluation
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { questionId, studentAnswer } = body;

    if (!questionId || !studentAnswer || !studentAnswer.trim()) {
      return NextResponse.json({ error: 'Question ID and student answer are required' }, { status: 400 });
    }

    const question = await prisma.vivaQuestion.findUnique({
      where: { id: questionId },
      include: { session: true },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Evaluate answer with AI
    const evaluation = AIService.evaluateVivaAnswer(question.questionText, studentAnswer);

    // Save answer & score
    const savedAnswer = await prisma.vivaAnswer.create({
      data: {
        questionId: question.id,
        studentAnswer,
        understandingScore: evaluation.understandingScore,
        accuracyScore: evaluation.accuracyScore,
        completenessScore: evaluation.completenessScore,
        overallScore: evaluation.overallScore,
        aiFeedback: evaluation.aiFeedback,
        improvedAnswer: evaluation.improvedAnswer,
      },
    });

    // Recalculate session overall score
    const allAnswers = await prisma.vivaAnswer.findMany({
      where: {
        question: { sessionId: question.sessionId },
      },
    });

    if (allAnswers.length > 0) {
      const avg =
        allAnswers.reduce((sum, a) => sum + a.overallScore, 0) / allAnswers.length;
      await prisma.vivaSession.update({
        where: { id: question.sessionId },
        data: { overallScore: Math.round(avg * 10) / 10 },
      });
    }

    return NextResponse.json({
      success: true,
      answer: savedAnswer,
      evaluation,
    });
  } catch (error) {
    console.error('Submit Viva Answer Error:', error);
    return NextResponse.json({ error: 'Failed to evaluate viva answer' }, { status: 500 });
  }
}
