import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/history - Deletes all projects and versions history for the authenticated user
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // Find all projects belonging to user
    const userProjects = await prisma.project.findMany({
      where: { userId },
      select: { id: true },
    });
    const projectIds = userProjects.map((p) => p.id);

    if (projectIds.length > 0) {
      await prisma.$transaction([
        prisma.chatMessage.deleteMany({ where: { projectId: { in: projectIds } } }),
        prisma.projectVersion.deleteMany({ where: { projectId: { in: projectIds } } }),
        prisma.project.deleteMany({ where: { id: { in: projectIds } } }),
      ]);
    }

    return NextResponse.json({ success: true, message: 'All history cleared successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('History delete error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
