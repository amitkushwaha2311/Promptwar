import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { taskId, status, subtasks } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    // 1. Update the task
    const updatedTask = await prisma.roadmapTask.update({
      where: { id: taskId },
      data: {
        status: status || undefined,
        subtasks: subtasks ? JSON.stringify(subtasks) : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : status === 'TODO' ? null : undefined,
      },
    });

    // 2. Recalculate overall roadmap progress
    const roadmap = await prisma.projectRoadmap.findFirst({
      where: { projectId },
      include: { tasks: true },
    });

    if (roadmap && roadmap.tasks.length > 0) {
      const completedCount = roadmap.tasks.filter((t) => t.status === 'COMPLETED').length;
      const inProgressCount = roadmap.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const total = roadmap.tasks.length;

      const progressPercent = Math.round(((completedCount + inProgressCount * 0.4) / total) * 100);

      // Determine current phase based on first in-progress or upcoming task
      const activeTask = roadmap.tasks.find((t) => t.status === 'IN_PROGRESS') || roadmap.tasks.find((t) => t.status === 'TODO');
      const currentPhase = activeTask ? activeTask.title : 'Final Review & Submission';

      // Dynamic Project Health Score calculation:
      // Health is a blend of:
      // - Progress vs standard (base 70)
      // - Task completion ratio (up to +20)
      // - Feasibility (from project)
      const healthScore = Math.min(Math.round(65 + (progressPercent / 100) * 25 + (completedCount > 0 ? 8 : 0)), 98);

      await prisma.project.update({
        where: { id: projectId },
        data: {
          overallProgress: progressPercent,
          healthScore,
          currentPhase,
        },
      });

      return NextResponse.json({
        success: true,
        task: updatedTask,
        progressPercent,
        healthScore,
        currentPhase,
      });
    }

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Update Task Error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
