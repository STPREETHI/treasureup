// utils/csvGenerator.ts
import { Transaction } from "../types";

export function generateCsv(filename: string, transactions: Transaction[]) {
  if (transactions.length === 0) {
    alert("No transactions to export.");
    return;
  }

  // Sort by date first
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const headers = [
    "Date",
    "Month",
    "Resident Name",
    "House No",
    "Mode",
    "Type",
    "Amount (INR)",
    "Category",
    "Reason",
    "Notes"
  ];

  const rows = sorted.map(t => {
    const date = new Date(t.date);
    const monthName = date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long' 
    });

    const isSubscription = t.reason.toLowerCase().includes('subscription');
    const isAnnual = t.amount === 1200 && isSubscription;

    const amount = t.type === 'Paid' ? -t.amount : t.amount;
    const category = 
      t.type === 'Paid' ? 'Expense' :
      isSubscription ? 'Monthly Subscription' :
      'Other Income';

    const notes = isAnnual ? 'Annual Payment (₹1200 Advance)' : '';

    return [
      date.toLocaleDateString('en-CA'),           // YYYY-MM-DD (sorts perfectly in Excel)
      `"${monthName}"`,
      `"${t.residentName.replace(/"/g, '""')}"`,
      `"${t.houseNo.replace(/"/g, '""')}"`,
      t.mode,
      t.type,
      amount.toFixed(2),
      `"${category}"`,
      `"${t.reason.replace(/"/g, '""')}"`,
      `"${notes}"`
    ];
  });

  // Add BOM for proper Hindi/Unicode support in Excel
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("Your browser does not support file downloads.");
  }
}