import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, verifyPassword, signToken, AUTH_COOKIE_NAME, getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. REGISTER
    if (action === 'register') {
      const { email, password, name, branch, skills, interests } = body;

      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      }

      const passwordHash = hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          studentProfile: {
            create: {
              branch: branch || 'Computer Science',
              programmingLanguages: JSON.stringify(skills || ['Python', 'JavaScript']),
              areasOfInterest: JSON.stringify(interests || ['AI', 'Web Development']),
            },
          },
        },
        include: { studentProfile: true },
      });

      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, profile: user.studentProfile },
      });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // 2. LOGIN
    if (action === 'login') {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: { studentProfile: true },
      });

      if (!user || !verifyPassword(password, user.passwordHash)) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, profile: user.studentProfile },
      });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // 3. LOGOUT
    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.set(AUTH_COOKIE_NAME, '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session Error:', error);
    return NextResponse.json({ user: null });
  }
}
