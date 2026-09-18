import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  canAccess,
  decodeSession,
  SESSION_COOKIE,
} from "@/lib/auth";

import {
  listPayments,
  createPayment,
} from "@/lib/fee-store";

export async function GET() {
  const cookieStore = await cookies();

  const user = decodeSession(
    cookieStore.get(SESSION_COOKIE)?.value,
  );

  if (!user || !canAccess(user.role, "/dashboard/fees")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    payments: await listPayments(),
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();

  const user = decodeSession(
    cookieStore.get(SESSION_COOKIE)?.value,
  );

  if (!user || !canAccess(user.role, "/dashboard/fees")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();

  return NextResponse.json({
    payment: await createPayment(body),
  });

  
}
