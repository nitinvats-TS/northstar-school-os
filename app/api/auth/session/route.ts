import { cookies } from "next/headers";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
    return Response.json(user ? { success: true, user } : { success: false, user: null, message: "No active session." }, { status: user ? 200 : 401 });
  } catch {
    return Response.json({ success: false, user: null, message: "Session service is temporarily unavailable." }, { status: 503 });
  }
}
