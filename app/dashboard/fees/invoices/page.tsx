import { InvoiceList } from "@/components/invoice-list";
import { InvoiceForm } from "@/components/invoice-form";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-slate-500">
            Manage student invoices and fee collections.
          </p>
        </div>

        <button className="rounded-lg bg-[#1c5b4d] px-4 py-2 text-white">
          Create Invoice
        </button>
      </div>
      
      <InvoiceForm />

      <div className="rounded-xl bg-white p-6 shadow-sm">
          <InvoiceList />
      </div>
    </div>
  );
}