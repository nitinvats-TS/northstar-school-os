"use client";

import { useEffect, useState } from "react";

type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: string;
  paidAmount: string;
  status: string;

  student: {
    firstName: string;
    lastName: string;
  };

  feeStructure: {
    name: string;
  };
};

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const response = await fetch("/api/invoices");
        const data = await response.json();

        setInvoices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  if (loading) {
    return <p>Loading invoices...</p>;
  }

  if (invoices.length === 0) {
    return <p>No invoices found.</p>;
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-sm text-slate-500">
            <th className="pb-3">Invoice</th>
            <th className="pb-3">Student</th>
            <th className="pb-3">Fee Structure</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Paid</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b">
              <td className="py-3">{invoice.invoiceNumber}</td>

              <td>
                {invoice.student.firstName}{" "}
                {invoice.student.lastName}
              </td>

              <td>{invoice.feeStructure.name}</td>

              <td>Rs {invoice.amount}</td>

              <td>Rs {invoice.paidAmount}</td>

              <td>{invoice.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}