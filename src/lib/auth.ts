import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 din tak login rahega (no auto logout)
    updateAge: 24 * 60 * 60,   // har 24 ghante me refresh hoga
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      if (trigger === "update" && session?.credits !== undefined) {
        token.credits = session.credits;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;

        // Fetch fresh credit balance from database
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { credits: true, role: true },
          });
          if (freshUser) {
            (session.user as any).credits = freshUser.credits;
            (session.user as any).role = freshUser.role;
          }
        } catch (e) {
          console.error("Error refreshing user credits in session", e);
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "ai-website-builder-super-secret-key-btech-2026",
};
