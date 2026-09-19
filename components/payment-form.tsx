"use client";

import { useEffect, useState } from "react";

type Invoice = {
  id: string;
  invoiceNumber: string;
};

export function PaymentForm() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [referenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    async function loadInvoices() {
      const response = await fetch("/api/invoices");
      const data = await response.json();

      setInvoices(data);
    }

    loadInvoices();
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoiceId,
        amount: Number(amount),
        method,
        referenceNumber,
      }),
    });

    if (!response.ok) {
      alert("Failed to record payment");
      return;
    }

    alert("Payment recorded successfully");

    setInvoiceId("");
    setAmount("");
    setMethod("CASH");
    setReferenceNumber("");

    window.location.reload();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Invoice
        </label>

        <select
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          className="w-full rounded-lg border p-2"
          required
        >
          <option value="">Select Invoice</option>

          {invoices.map((invoice) => (
            <option
              key={invoice.id}
              value={invoice.id}
            >
              {invoice.invoiceNumber}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Amount
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Payment Method
        </label>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full rounded-lg border p-2"
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="BANK_TRANSFER">
            Bank Transfer
          </option>
          <option value="UPI">UPI</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Reference Number
        </label>

        <input
          value={referenceNumber}
          onChange={(e) =>
            setReferenceNumber(e.target.value)
          }
          className="w-full rounded-lg border p-2"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-[#1c5b4d] px-4 py-2 text-white"
      >
        Record Payment
      </button>
    </form>
  );
}