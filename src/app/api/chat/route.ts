import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { refineWebsiteCode } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { projectId, message } = await req.json();

    if (!projectId || !message) {
      return NextResponse.json(
        { error: "ProjectId and message are required" },
        { status: 400 }
      );
    }

    // 1. Verify Project & Check Credits (Conversational edit costs 5 credits)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < 5) {
      return NextResponse.json(
        { error: "Insufficient credits. You need at least 5 credits for an AI edit." },
        { status: 402 }
      );
    }

    // 2. Fetch Latest Version & Chat History
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
        messages: {
          orderBy: { createdAt: "asc" },
          take: 8,
        },
      },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const latestVersion = project.versions[0];
    let currentCode = "";
    if (latestVersion?.filesJson) {
      try {
        const parsed = JSON.parse(latestVersion.filesJson);
        currentCode = parsed["index.html"] || parsed["App.js"] || "";
      } catch (e) {
        currentCode = latestVersion.filesJson;
      }
    }

    if (!currentCode) {
      return NextResponse.json(
        { error: "No existing code found to modify. Please generate the website first." },
        { status: 400 }
      );
    }

    // 3. Save User Message
    await prisma.chatMessage.create({
      data: {
        projectId,
        role: "user",
        content: message,
      },
    });

    // 4. Run AI Refinement
    const historyFormatted = project.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const refined = await refineWebsiteCode(currentCode, message, historyFormatted);

    const nextVersionNumber = (latestVersion?.versionNumber || 1) + 1;

    // 5. Database Transaction: Deduct 5 credits, save version snapshot, save AI reply
    const [updatedUser, newVersion, aiMessage] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          credits: { decrement: 5 },
          transactions: {
            create: {
              amount: -5,
              type: "EDIT",
            },
          },
        },
        select: { credits: true },
      }),
      prisma.projectVersion.create({
        data: {
          projectId,
          versionNumber: nextVersionNumber,
          prompt: message,
          filesJson: JSON.stringify({ "index.html": refined.updatedCode }),
        },
      }),
      prisma.chatMessage.create({
        data: {
          projectId,
          role: "assistant",
          content: `✅ ${refined.aiExplanation}`,
        },
      }),
      prisma.project.update({
        where: { id: projectId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return NextResponse.json({
      success: true,
      reply: aiMessage.content,
      code: refined.updatedCode,
      version: newVersion,
      remainingCredits: updatedUser.credits,
    });
  } catch (error: any) {
    console.error("Error in chat refinement:", error);
    return NextResponse.json(
      { error: error.message || "Failed to refine website" },
      { status: 500 }
    );
  }
}
