import { FeesDashboard } from "@/components/fees-dashboard";
import { PaymentHistory } from "@/components/payment-history";

export default function FeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Fees Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Financial overview and collections.
        </p>
      </div>

      <FeesDashboard />

      <PaymentHistory />
    </div>
  );
}