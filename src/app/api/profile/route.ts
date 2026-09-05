import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      college,
      degree,
      branch,
      graduationYear,
      programmingLanguages,
      frameworks,
      technicalSkills,
      areasOfInterest,
      experienceLevel,
      teamSize,
      projectDuration,
    } = body;

    const profile = await prisma.studentProfile.upsert({
      where: { userId: session.id },
      update: {
        college: college || undefined,
        degree: degree || undefined,
        branch: branch || undefined,
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        programmingLanguages: Array.isArray(programmingLanguages)
          ? JSON.stringify(programmingLanguages)
          : programmingLanguages || undefined,
        frameworks: Array.isArray(frameworks) ? JSON.stringify(frameworks) : frameworks || undefined,
        technicalSkills: Array.isArray(technicalSkills)
          ? JSON.stringify(technicalSkills)
          : technicalSkills || undefined,
        areasOfInterest: Array.isArray(areasOfInterest)
          ? JSON.stringify(areasOfInterest)
          : areasOfInterest || undefined,
        experienceLevel: experienceLevel || undefined,
        teamSize: teamSize ? Number(teamSize) : undefined,
        projectDuration: projectDuration || undefined,
      },
      create: {
        userId: session.id,
        college: college || 'University Institute of Technology',
        degree: degree || 'B.Tech',
        branch: branch || 'Computer Science',
        graduationYear: graduationYear ? Number(graduationYear) : 2026,
        programmingLanguages: Array.isArray(programmingLanguages)
          ? JSON.stringify(programmingLanguages)
          : JSON.stringify(['Python', 'JavaScript']),
        frameworks: Array.isArray(frameworks) ? JSON.stringify(frameworks) : JSON.stringify(['React', 'Next.js']),
        technicalSkills: Array.isArray(technicalSkills)
          ? JSON.stringify(technicalSkills)
          : JSON.stringify(['REST APIs', 'Git']),
        areasOfInterest: Array.isArray(areasOfInterest)
          ? JSON.stringify(areasOfInterest)
          : JSON.stringify(['AI', 'Web Development']),
        experienceLevel: experienceLevel || 'Intermediate',
        teamSize: teamSize ? Number(teamSize) : 3,
        projectDuration: projectDuration || '4 months',
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
