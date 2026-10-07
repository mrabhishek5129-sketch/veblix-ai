import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { target, otp, newPassword } = await req.json();

    if (!target || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Saari fields required hain." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password kam se kam 6 characters ka hona chahiye." },
        { status: 400 }
      );
    }

    // Find user by otpTarget
    const user = await prisma.user.findFirst({
      where: { otpTarget: target },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User nahi mila. Dobara try karo." },
        { status: 404 }
      );
    }

    // Check OTP matches
    if (user.otp !== otp) {
      return NextResponse.json(
        { error: "Galat OTP! Dobara check karo." },
        { status: 400 }
      );
    }

    // Check OTP expiry
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return NextResponse.json(
        { error: "OTP expire ho gaya. Naya OTP mangao." },
        { status: 400 }
      );
    }

    // Hash new password & update — also clear OTP fields
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
        otpTarget: null,
      },
    });

    return NextResponse.json({
      message: "Password successfully reset ho gaya! Ab login karo.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Kuch galat ho gaya. Dobara try karo." },
      { status: 500 }
    );
  }
}
