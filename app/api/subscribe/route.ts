import { NextResponse } from "next/server";

interface SubscribeRequest {
  email: string;
  name?: string;
}

export async function POST(request: Request) {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, name } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Log the subscription (will be replaced with Supabase integration later)
    console.log("=== NEW WAITLIST SIGNUP ===");
    console.log("Email:", email);
    if (name) console.log("Name:", name);
    console.log("Timestamp:", new Date().toISOString());
    console.log("===========================");

    // Return success response
    return NextResponse.json({
      success: true,
      message: "You're on the waitlist! We'll notify you when early access opens.",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}