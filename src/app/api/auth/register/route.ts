import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, mobile, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile ? mobile.trim().replace(/\D/g, "") : undefined;

    // Validate mobile if provided
    if (cleanMobile && cleanMobile.length !== 10) {
      return NextResponse.json(
        { error: "Mobile number 10 digits ka hona chahiye." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Check mobile already used
    if (cleanMobile) {
      const mobileExists = await prisma.user.findFirst({
        where: { mobile: cleanMobile },
      });
      if (mobileExists) {
        return NextResponse.json(
          { error: "Is mobile number se pehle se account bana hua hai." },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with 1,000 free bonus credits
    const newUser = await prisma.user.create({
      data: {
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        mobile: cleanMobile || null,
        password: hashedPassword,
        credits: 1000,
        transactions: {
          create: {
            amount: 1000,
            type: "SIGNUP_BONUS",
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        credits: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully with 1,000 free credits!",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
