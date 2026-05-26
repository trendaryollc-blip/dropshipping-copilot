import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAuth } from "@/lib/firebase";
import { getUserByEmail, upsertUser } from "@/lib/database/operations";
import type { User } from "@/lib/database/types";
import { rateLimitRegister } from "@/lib/utils/rate-limit";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(email: string): boolean {
  return emailRegex.test(email) && email.length <= 254;
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitRegister()(request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = getFirebaseAuth();
  if (!auth) {
    return NextResponse.json(
      { error: "Authentication not configured" },
      { status: 500 }
    );
  }

  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (typeof displayName === "string" && displayName.length > 100) {
      return NextResponse.json(
        { error: "Display name must be 100 characters or fewer" },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: typeof displayName === "string" ? displayName.slice(0, 100) : "",
      emailVerified: false,
    });

    const userData: Omit<User, "id" | "createdAt" | "updatedAt"> = {
      email,
      displayName: typeof displayName === "string" ? displayName.slice(0, 100) : "",
      provider: "email",
      isActive: true,
    };

    await upsertUser(userRecord.uid, userData);

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      email: userRecord.email,
      message: "Account created. Sign in on the client to start a session.",
    });
  } catch (error: unknown) {
    console.error("Registration error:", error);

    const err = error as { code?: string };
    if (err.code === "auth/email-already-exists") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    if (err.code === "auth/weak-password") {
      return NextResponse.json(
        { error: "Password is too weak" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}