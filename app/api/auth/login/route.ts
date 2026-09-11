import { NextResponse } from "next/server";
import { encodeSession, SESSION_COOKIE } from "@/lib/auth";
import { findUserByCredentials, toSessionUser } from "@/lib/user-data";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
    if (!body?.email || !body.password) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    const user = await findUserByCredentials(body.email, body.password);
    if (!user) {
      return NextResponse.json({ success: false, message: "We could not match that email and password." }, { status: 401 });
    }

    const sessionUser = toSessionUser(user);
    const response = NextResponse.json({ success: true, user: sessionUser });
    response.cookies.set(SESSION_COOKIE, encodeSession(sessionUser), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, message: "Authentication service is temporarily unavailable." }, { status: 503 });
  }
}
