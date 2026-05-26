import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAuth } from "@/lib/firebase";
import { getUserByEmail } from "@/lib/database/operations";
import { rateLimitLogin } from "@/lib/utils/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimitLogin()(request);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = getFirebaseAuth();
  if (!auth) {
    return NextResponse.json(
      { error: "Authentication not configured" },
      { status: 500 }
    );
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verify password using Firebase Admin SDK
    // Note: Firebase Admin SDK doesn't have a direct login method
    // For login, you typically use Firebase Client SDK on the frontend
    // This endpoint is for server-side verification if needed
    
    // For now, we'll check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // In a real implementation, you'd use Firebase Client SDK for authentication
    // on the frontend, then verify the token on the server
    return NextResponse.json({
      success: true,
      message: "Use Firebase Client SDK for authentication",
      user: {
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
