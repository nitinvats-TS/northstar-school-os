import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        student: true,
        feeStructure: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const feeStructure = await prisma.feeStructure.findUnique({
      where: {
        id: body.feeStructureId,
      },
    });

    if (!feeStructure) {
      return NextResponse.json(
        { message: "Fee structure not found" },
        { status: 404 }
      );
    }

    const count = await prisma.invoice.count();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${String(count + 1).padStart(4, "0")}`,
        studentId: body.studentId,
        feeStructureId: body.feeStructureId,
        amount: feeStructure.amount,
        dueDate: new Date(body.dueDate),
      },
    });

    return NextResponse.json(invoice, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
