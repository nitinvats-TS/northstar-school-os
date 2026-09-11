import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, "", { expires: new Date(0), path: "/" });
    return response;
  } catch {
    return NextResponse.json({ success: false, message: "Unable to sign out." }, { status: 500 });
  }
}
