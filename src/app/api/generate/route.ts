import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWebsiteCode } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { projectId, prompt } = await req.json();

    if (!projectId || !prompt) {
      return NextResponse.json(
        { error: "ProjectId and prompt are required" },
        { status: 400 }
      );
    }

    // 1. Verify Project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 2. Check User Credits (Generation costs 20 credits)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < 20) {
      return NextResponse.json(
        { error: "Insufficient credits. You need at least 20 credits to generate a website." },
        { status: 402 }
      );
    }

    // 3. Generate Code via AI Engine
    const generated = await generateWebsiteCode(prompt, project.title);

    // 4. Atomic Database Updates (Deduct Credits, Log Transaction, Save Version v1)
    const [updatedUser, newVersion] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          credits: { decrement: 20 },
          transactions: {
            create: {
              amount: -20,
              type: "GENERATE",
            },
          },
        },
        select: { credits: true },
      }),
      prisma.projectVersion.create({
        data: {
          projectId,
          versionNumber: 1,
          prompt,
          filesJson: JSON.stringify({ "index.html": generated.code }),
        },
      }),
      prisma.chatMessage.create({
        data: {
          projectId,
          role: "assistant",
          content: `🎉 I have generated the initial full-stack website for **${project.title}**!\n\n${generated.summary}\n\nYou can now test it live on the right, or ask me to make changes in chat below (e.g. *"change color theme"*, *"add testimonials section"*).`,
        },
      }),
      prisma.project.update({
        where: { id: projectId },
        data: { description: prompt },
      }),
    ]);

    return NextResponse.json({
      success: true,
      version: newVersion,
      code: generated.code,
      remainingCredits: updatedUser.credits,
    });
  } catch (error: any) {
    console.error("Error generating website:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate website" },
      { status: 500 }
    );
  }
}
