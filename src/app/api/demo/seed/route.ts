import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { seedDemoData } from '@/lib/seed';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { autoLogin } = await req.json().catch(() => ({ autoLogin: true }));
    const result = await seedDemoData();

    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      include: { studentProfile: true, projects: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Failed to find seeded user' }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.studentProfile,
      },
      projectId: result.projectId,
    });

    if (autoLogin) {
      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    console.error('Seed API Error:', error);
    return NextResponse.json({ error: 'Failed to seed demo data' }, { status: 500 });
  }
}
