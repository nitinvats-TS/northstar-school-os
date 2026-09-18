import { prisma } from "@/lib/prisma";

function serializeFeeStructure(fee: any) {
  return {
    ...fee,
    amount: Number(fee.amount),
    createdAt: fee.createdAt.toISOString(),
    updatedAt: fee.updatedAt.toISOString(),
  };
}

function serializeInvoice(invoice: any) {
  return {
    ...invoice,
    amount: Number(invoice.amount),
    paidAmount: Number(invoice.paidAmount),
    dueDate: invoice.dueDate.toISOString(),
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
  };
}

function serializePayment(payment: any) {
  return {
    ...payment,
    amount: Number(payment.amount),
    paymentDate: payment.paymentDate.toISOString(),
    createdAt: payment.createdAt.toISOString(),
  };
}

export async function listFeeStructures() {
  const fees = await prisma.feeStructure.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return fees.map(serializeFeeStructure);
}

export async function createFeeStructure(data: {
  name: string;
  description?: string;
  amount: number;
  className?: string;
  section?: string;
}) {
  const fee = await prisma.feeStructure.create({
    data,
  });

  return serializeFeeStructure(fee);
}

export async function listInvoices() {
  const invoices = await prisma.invoice.findMany({
    include: {
      student: true,
      feeStructure: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices.map(serializeInvoice);
}

export async function createInvoice(data: {
  invoiceNumber: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  dueDate: string;
}) {
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: data.invoiceNumber,
      studentId: data.studentId,
      feeStructureId: data.feeStructureId,
      amount: data.amount,
      dueDate: new Date(data.dueDate),
    },
  });

  return serializeInvoice(invoice);
}

export async function listPayments() {
  const payments = await prisma.payment.findMany({
    include: {
      invoice: true,
    },
    orderBy: {
      paymentDate: "desc",
    },
  });

  return payments.map(serializePayment);
}

export async function createPayment(data: {
  invoiceId: string;
  amount: number;
  method: string;
  referenceNumber?: string;
}) {
  const payment = await prisma.payment.create({
    data: {
      invoiceId: data.invoiceId,
      amount: data.amount,
      method: data.method as any,
      referenceNumber: data.referenceNumber,
    },
  });

  return serializePayment(payment);
}