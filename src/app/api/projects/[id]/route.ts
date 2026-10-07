import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
        },
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id] - Handle actions like Rollback
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const projectId = params.id;
    const { action, versionId } = await req.json();

    if (action === "rollback") {
      if (!versionId) {
        return NextResponse.json(
          { error: "Version ID is required for rollback" },
          { status: 400 }
        );
      }

      // Find target version
      const targetVersion = await prisma.projectVersion.findUnique({
        where: { id: versionId },
      });

      if (!targetVersion || targetVersion.projectId !== projectId) {
        return NextResponse.json(
          { error: "Target version not found" },
          { status: 404 }
        );
      }

      // Fetch latest version number
      const latestVersion = await prisma.projectVersion.findFirst({
        where: { projectId },
        orderBy: { versionNumber: "desc" },
      });

      const nextVersionNumber = (latestVersion?.versionNumber || 1) + 1;

      // Create new version with restored code
      const [newVersion, aiMessage] = await prisma.$transaction([
        prisma.projectVersion.create({
          data: {
            projectId,
            versionNumber: nextVersionNumber,
            prompt: `Rollback to v${targetVersion.versionNumber}`,
            filesJson: targetVersion.filesJson,
          },
        }),
        prisma.chatMessage.create({
          data: {
            projectId,
            role: "assistant",
            content: `⏪ Restored project state from **Version ${targetVersion.versionNumber}** (created as v${nextVersionNumber}).`,
          },
        }),
        prisma.project.update({
          where: { id: projectId },
          data: { updatedAt: new Date() },
        }),
      ]);

      return NextResponse.json({
        success: true,
        version: newVersion,
        message: aiMessage.content,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in project action:", error);
    return NextResponse.json(
      { error: error.message || "Action failed" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
