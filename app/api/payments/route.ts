import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        invoice: true,
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payment = await prisma.payment.create({
      data: {
        invoiceId: body.invoiceId,
        amount: body.amount,
        method: body.method,
        referenceNumber: body.referenceNumber,
      },
    });

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: body.invoiceId,
      },
    });

    if (invoice) {
      const newPaidAmount =
        Number(invoice.paidAmount) + Number(body.amount);

      let status = invoice.status;

      if (newPaidAmount >= Number(invoice.amount)) {
        status = "PAID";
      } else if (newPaidAmount > 0) {
        status = "PARTIAL";
      }

      await prisma.invoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          paidAmount: newPaidAmount,
          status,
        },
      });
    }

    return NextResponse.json(payment, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to record payment" },
      { status: 500 }
    );
  }
}