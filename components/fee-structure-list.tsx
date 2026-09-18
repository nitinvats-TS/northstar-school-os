"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";

import type { FeeStructureRow } from "@/lib/fee-types";

import { WalletCards } from "lucide-react";

export function FeeStructureList() {
  const [fees, setFees] = useState<FeeStructureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    className: "",
    section: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/fees")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ?? "Fees could not be loaded.",
          );
        }

        setFees(data.fees);
      })
      .catch((loadError: Error) => {
        setError(loadError.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function saveFeeStructure() {
    try {
      setSaving(true);

      const response = await fetch("/api/fees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          amount: Number(form.amount),
          className: form.className,
          section: form.section,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create fee structure");
      }

      const result = await response.json();

      setFees((current) => [...current, result.fee]);

      setForm({
        name: "",
        description: "",
        amount: "",
        className: "",
        section: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Could not create fee structure.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e3e9eb] bg-white p-10 text-center text-sm text-slate-500">
        Loading fee structures...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-[#f0c9c4] bg-[#fff7f5] p-5 text-sm text-[#b35d58]"
      >
        {error}
      </div>
    );
  }

  const rows = fees.map((fee) => ({
    name: fee.name,
    description: fee.description ?? "-",
    amount: `Rs ${fee.amount}`,
    class: fee.className ?? "-",
    section: fee.section ?? "-",
    search: `${fee.name} ${fee.description ?? ""}`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-[#0f5c4d] px-4 py-2 text-sm font-medium text-white"
        >
          + New Fee Structure
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-[#e3e9eb] bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="rounded-xl border p-3"
            />

            <input
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              className="rounded-xl border p-3"
            />

            <input
              placeholder="Class"
              value={form.className}
              onChange={(e) =>
                setForm({
                  ...form,
                  className: e.target.value,
                })
              }
              className="rounded-xl border p-3"
            />

            <input
              placeholder="Section"
              value={form.section}
              onChange={(e) =>
                setForm({
                  ...form,
                  section: e.target.value,
                })
              }
              className="rounded-xl border p-3"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="rounded-xl border p-3 md:col-span-2"
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={saveFeeStructure}
              disabled={saving}
              className="rounded-xl bg-[#0f5c4d] px-4 py-2 text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Fee Structure"}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Fee Structures"
          value={String(fees.length)}
          detail="Active fee categories"
          icon={WalletCards}
        />
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "amount", label: "Amount" },
          { key: "class", label: "Class" },
          { key: "section", label: "Section" },
        ]}
        rows={rows}
        searchPlaceholder="Search fee structures..."
      />
    </div>
  );
}