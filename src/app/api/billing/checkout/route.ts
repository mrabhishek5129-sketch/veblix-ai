import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { planId, amountCredits, priceInr } = await req.json();

    if (!amountCredits || !planId) {
      return NextResponse.json(
        { error: "Invalid purchase details" },
        { status: 400 }
      );
    }

    // Process top-up transaction in DB
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          credits: { increment: amountCredits },
          transactions: {
            create: {
              amount: amountCredits,
              type: "PURCHASE",
            },
          },
        },
        select: { credits: true },
      }),
      prisma.transaction.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Successfully added ${amountCredits} credits to your account!`,
      credits: updatedUser.credits,
      transaction,
    });
  } catch (error: any) {
    console.error("Billing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process purchase" },
      { status: 500 }
    );
  }
}
