"use client";

import { useEffect, useState } from "react";

type Payment = {
  id: string;
  amount: string;
  method: string;
  paymentDate: string;

  invoice: {
    invoiceNumber: string;
  };
};

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    async function loadPayments() {
      const response = await fetch("/api/payments");
      const data = await response.json();

      setPayments(data);
    }

    loadPayments();
  }, []);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        Recent Payments
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-sm text-slate-500">
            <th className="pb-3">Invoice</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Method</th>
            <th className="pb-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b">
              <td className="py-3">
                {payment.invoice.invoiceNumber}
              </td>

              <td>Rs {payment.amount}</td>

              <td>{payment.method}</td>

              <td>
                {new Date(
                  payment.paymentDate
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}