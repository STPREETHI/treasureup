// utils/pdfGenerator.ts — FINAL PROFESSIONAL VERSION
import { Transaction } from "../types";

const toDate = (input: any): Date => {
  if (!input) return new Date();
  if (input instanceof Date) return input;
  if (typeof input.toDate === 'function') return input.toDate();
  return new Date(input);
};

export function generatePdf(title: string, transactions: Transaction[]) {
  if (transactions.length === 0) {
    alert("No transactions to export.");
    return;
  }

  // Sort transactions chronologically
  const sorted = [...transactions].sort((a, b) => {
    return toDate(a.date).getTime() - toDate(b.date).getTime();
  });

  // Group by month
  const grouped: Record<string, Transaction[]> = {};
  sorted.forEach(t => {
    const date = toDate(t.date);
    const key = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  let transactionRows = '';
  let monthlySummaryRows = '';
  let receiptNo = 1001; // Starting receipt number

  // Sort months chronologically
  const sortedMonths = Object.keys(grouped).sort((a, b) => {
    return toDate(`1 ${a}`).getTime() - toDate(`1 ${b}`).getTime();
  });

  sortedMonths.forEach(month => {
    const txns = grouped[month];

    // Monthly totals
    const subscriptionTotal = txns
      .filter(t => t.type === 'Received' && t.reason.toLowerCase().includes('subscription'))
      .reduce((sum, t) => sum + t.amount, 0);

    const otherIncome = txns
      .filter(t => t.type === 'Received' && !t.reason.toLowerCase().includes('subscription'))
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = txns.filter(t => t.type === 'Paid').reduce((sum, t) => sum + t.amount, 0);
    const net = subscriptionTotal + otherIncome - expenses;

    // Monthly summary row
    monthlySummaryRows += `
      <tr style="background-color: #f0fdf4; font-weight: bold; border-top: 3px double #86efac;">
        <td colspan="4"><strong>${month}</strong></td>
        <td style="text-align: right; color: #166534;">₹${subscriptionTotal.toFixed(2)}</td>
        <td style="text-align: right; color: #15803d;">₹${otherIncome.toFixed(2)}</td>
        <td style="text-align: right; color: #dc2626;">₹${expenses.toFixed(2)}</td>
        <td style="text-align: right; color: ${net >= 0 ? '#166534' : '#dc2626'}; font-size: 1.1em;">
          ₹${net.toFixed(2)}
        </td>
      </tr>`;

    // Individual transactions with Receipt No
    txns.forEach(t => {
      const isPaid = t.type === 'Paid';
      const amount = isPaid ? -t.amount : t.amount;
      const isSubscription = t.reason.toLowerCase().includes('subscription');
      const isAnnual = t.amount === 1200 && isSubscription;

      const bgColor = isAnnual ? '#fffbeb' : (isSubscription ? '#f0fdf4' : '');
      const borderLeft = isAnnual ? '5px solid #f59e0b' : (isSubscription ? '3px solid #22c55e' : '');

      transactionRows += `
        <tr style="background-color: ${bgColor}; ${borderLeft ? `border-left: ${borderLeft};` : ''}">
          <td style="font-weight: 600;">#${receiptNo++}</td>
          <td>${toDate(t.date).toLocaleDateString('en-IN')}</td>
          <td>${t.residentName}</td>
          <td>${t.houseNo}</td>
          <td>${t.mode}</td>
          <td style="text-align: right; color: ${isPaid ? '#dc2626' : (isAnnual ? '#d97706' : '#16a34a')}; font-weight: ${isAnnual ? 'bold' : '600'};">
            ${isPaid ? '-' : ''}₹${Math.abs(amount).toFixed(2)}${isAnnual ? ' (Annual)' : ''}
          </td>
          <td>${t.reason}</td>
        </tr>`;
    });
  });

  // Grand totals
  const totalIncome = sorted.filter(t => t.type === 'Received').reduce((s, t) => s + t.amount, 0);
  const totalExpense = sorted.filter(t => t.type === 'Paid').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const today = new Date().toLocaleDateString('en-IN');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background: #f8fafc; color: #1e293b; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    h1 { color: #1e40af; font-size: 36px; margin: 0; }
    .subtitle { color: #64748b; font-size: 18px; }
    .info { margin: 20px 0; font-size: 14px; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 15px; }
    th { background: #4f46e5; color: white; padding: 16px; text-align: left; }
    th:nth-child(6), td:nth-child(6) { text-align: right; }
    td { padding: 14px 16px; border-bottom: 1px solid #e2e8f0; }
    .summary th { background: #f1f5f9; color: #1e293b; }
    .footer { margin-top: 50px; padding: 25px; background: #f8fafc; border-radius: 16px; text-align: right; font-size: 20px; }
    .legend { margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 12px; font-size: 14px; border-left: 5px solid #0ea5e9; }
    .download-btn {
      display: block; margin: 30px auto; padding: 14px 40px; background: #1d4ed8; color: white; 
      border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer;
      box-shadow: 0 4px 15px rgba(29, 78, 216, 0.3);
    }
    .download-btn:hover { background: #1e40af; }
    @media print { 
      body { padding: 10px; background: white; } 
      .container { box-shadow: none; border-radius: 0; }
      .download-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      <p class="subtitle">Society Maintenance & Subscription Statement</p>
      <div class="info">Generated on: ${today} | Total Transactions: ${transactions.length}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Receipt No</th>
          <th>Date</th>
          <th>Resident</th>
          <th>House No</th>
          <th>Mode</th>
          <th>Amount (₹)</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${transactionRows}
      </tbody>
    </table>

    <h2 style="color: #1e40af; margin-top: 50px;">Monthly Summary</h2>
    <table class="summary">
      <thead>
        <tr>
          <th>Month</th>
          <th colspan="2">Subscription Income</th>
          <th>Other Income</th>
          <th>Expenses</th>
          <th>Net</th>
        </tr>
      </thead>
      <tbody>
        ${monthlySummaryRows}
      </tbody>
    </table>

    <div class="footer">
      <div><strong>Total Income:</strong> ₹${totalIncome.toFixed(2)}</div>
      <div><strong>Total Expenses:</strong> ₹${totalExpense.toFixed(2)}</div>
      <div style="font-size: 28px; margin-top: 10px; color: ${balance >= 0 ? '#16a34a' : '#dc2626'}">
        <strong>Final Balance: ₹${balance.toFixed(2)}</strong>
      </div>
    </div>

    <div class="legend">
      <strong>Legend:</strong><br>
      • <span style="color: #22c55e; font-weight: bold;">Green rows</span> = Monthly Subscription (₹100)<br>
      • <span style="color: #f59e0b; font-weight: bold;">Gold highlight</span> = Annual Payment (₹1200 Advance)<br>
      • Red = Expenses
    </div>

    <button onclick="window.print()" class="download-btn">
      Download / Print PDF
    </button>
  </div>
</body>
</html>`;

  // Create downloadable PDF
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Also open in new tab for printing
  const printWin = window.open('', '_blank');
  if (printWin) {
    printWin.document.write(htmlContent);
    printWin.document.close();
    printWin.focus();
  }
}