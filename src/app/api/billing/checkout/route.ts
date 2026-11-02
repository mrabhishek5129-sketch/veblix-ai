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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Free credit additions are disabled. Free credits are only given once upon initial signup.
    return NextResponse.json(
      {
        error:
          "Online Payment Gateway jald shuru hoga. Free credits sirf naye account banane par ek hi baar milte hain.",
      },
      { status: 403 }
    );
  } catch (error: any) {
    console.error("Billing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
