"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
};

type FeeStructure = {
  id: string;
  name: string;
  amount: number;
};

export function InvoiceForm() {
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<FeeStructure[]>([]);

  const [studentId, setStudentId] = useState("");
  const [feeStructureId, setFeeStructureId] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    async function loadData() {
      const studentResponse = await fetch("/api/students");
      const studentData = await studentResponse.json();

      const feesResponse = await fetch("/api/fees");
      const feesData = await feesResponse.json();

      setStudents(studentData.students ?? []);
      setFees(feesData.fees ?? []);
    }

    loadData();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        feeStructureId,
        dueDate,
      }),
    });

    if (!response.ok) {
      alert("Failed to create invoice");
      return;
    }

    alert("Invoice created successfully");

    setStudentId("");
    setFeeStructureId("");
    setDueDate("");

    window.location.reload();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Student
        </label>

        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full rounded-lg border p-2"
          required
        >
          <option value="">Select Student</option>

          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.admissionNo} - {student.firstName}{" "}
              {student.lastName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Fee Structure
        </label>

        <select
          value={feeStructureId}
          onChange={(e) => setFeeStructureId(e.target.value)}
          className="w-full rounded-lg border p-2"
          required
        >
          <option value="">Select Fee Structure</option>

          {fees.map((fee) => (
            <option key={fee.id} value={fee.id}>
              {fee.name} (Rs {fee.amount})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Due Date
        </label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-lg border p-2"
          required
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-[#1c5b4d] px-4 py-2 text-white"
      >
        Create Invoice
      </button>
    </form>
  );
}