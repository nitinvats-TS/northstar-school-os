"use client";

import { useEffect, useState } from "react";

type Invoice = {
  amount: string;
  paidAmount: string;
};

type Payment = {
  amount: string;
};

export function FeesDashboard() {
  const [totalInvoiced, setTotalInvoiced] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);

  useEffect(() => {
    async function loadData() {
      const invoiceResponse = await fetch("/api/invoices");
      const invoices: Invoice[] =
        await invoiceResponse.json();

      const paymentResponse = await fetch("/api/payments");
      const payments: Payment[] =
        await paymentResponse.json();

      const invoiced = invoices.reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );

      const collected = payments.reduce(
        (sum, payment) =>
          sum + Number(payment.amount),
        0
      );

      setTotalInvoiced(invoiced);
      setTotalCollected(collected);
    }

    loadData();
  }, []);

  const outstanding =
    totalInvoiced - totalCollected;

  const collectionRate =
    totalInvoiced === 0
      ? 0
      : (
          (totalCollected / totalInvoiced) *
          100
        ).toFixed(2);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Total Invoiced
        </p>

        <h2 className="text-2xl font-bold">
          Rs {totalInvoiced}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Total Collected
        </p>

        <h2 className="text-2xl font-bold">
          Rs {totalCollected}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Outstanding
        </p>

        <h2 className="text-2xl font-bold">
          Rs {outstanding}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Collection Rate
        </p>

        <h2 className="text-2xl font-bold">
          {collectionRate}%
        </h2>
      </div>
    </div>
  );
}