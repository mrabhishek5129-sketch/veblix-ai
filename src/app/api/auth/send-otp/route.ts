import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTPEmail, generateOTP } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { method, value } = await req.json();
    // method: "email" | "mobile"
    // value: email address or mobile number

    if (!method || !value) {
      return NextResponse.json(
        { error: "Method aur value required hai." },
        { status: 400 }
      );
    }

    // Find user by email or mobile
    let user;
    if (method === "email") {
      user = await prisma.user.findUnique({ where: { email: value } });
    } else if (method === "mobile") {
      user = await prisma.user.findFirst({ where: { mobile: value } });
    } else {
      return NextResponse.json({ error: "Invalid method." }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json(
        {
          error:
            method === "email"
              ? "Is email se koi account nahi mila."
              : "Is mobile number se koi account nahi mila.",
        },
        { status: 404 }
      );
    }

    // Generate OTP & expiry (10 minutes)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to DB
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry, otpTarget: value },
    });

    // Send OTP
    if (method === "email") {
      try {
        await sendOTPEmail(value, otp, user.name || undefined);
        return NextResponse.json({
          message: `OTP aapki email ${value} pe bheja gaya hai.`,
          maskedTarget: maskEmail(value),
        });
      } catch (emailErr) {
        console.warn("Nodemailer failed, falling back to on-screen demo OTP:", emailErr);
        // Fallback so user is not blocked even if Gmail SMTP is not configured
        return NextResponse.json({
          message: `OTP generate ho gaya hai.`,
          maskedTarget: maskEmail(value),
          demoOtp: otp,
        });
      }
    } else {
      // Mobile: Demo mode — real SMS ke liye Twilio chahiye
      console.log(`📱 [DEMO] Mobile OTP for ${value}: ${otp}`);
      return NextResponse.json({
        message: `OTP ${maskMobile(value)} pe bheja gaya hai.`,
        maskedTarget: maskMobile(value),
        demoOtp: otp,
      });
    }
  } catch (error: any) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "OTP bhejne mein error aaya. Dobara try karo." },
      { status: 500 }
    );
  }
}

// Helper: mask email — ab****@gmail.com
function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  const masked =
    user.length <= 2
      ? user[0] + "***"
      : user.slice(0, 2) + "*".repeat(user.length - 2);
  return `${masked}@${domain}`;
}

// Helper: mask mobile — ******7890
function maskMobile(mobile: string): string {
  return "*".repeat(mobile.length - 4) + mobile.slice(-4);
}
