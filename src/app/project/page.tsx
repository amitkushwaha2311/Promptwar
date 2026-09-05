import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export default async function ProjectDefaultPage() {
  const session = await getSessionUser();

  if (session) {
    const project = await prisma.project.findFirst({
      where: { userId: session.id },
      orderBy: { updatedAt: 'desc' },
    });

    if (project) {
      redirect(`/project/${project.id}`);
    }
  }

  // If not logged in or no project, check for demo project
  const demoProject = await prisma.project.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (demoProject) {
    redirect(`/project/${demoProject.id}`);
  }

  redirect('/dashboard');
}
