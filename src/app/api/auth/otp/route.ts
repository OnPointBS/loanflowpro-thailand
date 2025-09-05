import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { email, otp, firstName, lastName, workspaceName } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const result = await convex.mutation(api.auth.verifyOTP, {
      email,
      otp,
      firstName,
      lastName,
      workspaceName,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
        sessionToken: result.sessionToken,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "OTP verification failed" },
      { status: 500 }
    );
  }
}
