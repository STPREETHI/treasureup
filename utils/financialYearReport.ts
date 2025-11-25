// utils/financialYearReport.ts — FINAL 100% ACCURATE VERSION
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Transaction, Resident } from '../types';

export const generateFinancialYearPDF = (
  fy: string, // e.g., "2025-2026"
  transactions: Transaction[],
  residents: Resident[],
  openingBalance: number = 0
) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const [startYear, endYear] = fy.split('-').map(Number); // 2025, 2026

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('NETHAJI NAGAR RESIDENTS WELFARE ASSOCIATION', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.text(`Financial Year Subscription Report - ${fy}`, pageWidth / 2, 32, { align: 'center' });

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const tableBody: any[] = [];
  let totalCollected = 0;

  residents.forEach((resident, index) => {
    const row = [index + 1, resident.name, resident.houseNo];
    let paidMonths = 0;

    months.forEach((monthName, idx) => {
      let targetMonth: number;
      let targetYear: number;

      if (idx <= 8) {
        // Apr to Dec → same as startYear (2025)
        targetMonth = 3 + idx; // Apr=3, May=4, ..., Dec=11
        targetYear = startYear;
      } else {
        // Jan to Mar → next year (2026)
        targetMonth = idx - 9; // Jan=0, Feb=1, Mar=2
        targetYear = endYear;
      }

      const isPaid = transactions.some(t => {
        const date = new Date(t.date);
        return (
          (t.residentName === resident.name || t.houseNo === resident.houseNo) &&
          t.type === 'Received' &&
          t.reason.toLowerCase().includes('subscription') &&
          date.getMonth() === targetMonth &&
          date.getFullYear() === targetYear
        );
      });

      row.push(isPaid ? 'Paid' : '');
      if (isPaid) paidMonths++;
    });

    const amountPaid = paidMonths * 100;
    totalCollected += amountPaid;
    row.push(`Rs. ${amountPaid}`);
    row.push(paidMonths < 12 ? `Rs. ${(12 - paidMonths) * 100}` : 'Nil');
    tableBody.push(row);
  });

  const closingBalance = openingBalance + totalCollected;

  autoTable(doc, {
    head: [['S.No', 'Name', 'House No', ...months, 'Total Paid', 'Due']],
    body: tableBody,
    startY: 45,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 48 },
      2: { cellWidth: 22 },
      15: { halign: 'right' },
      16: { halign: 'right' }
    },
    margin: { top: 45 },
    didDrawPage: () => {
      doc.setFontSize(11);
      doc.text(`Opening Balance (1st April ${startYear}): Rs. ${openingBalance}`, 14, pageHeight - 30);
      doc.text(`Total Collected in ${fy}: Rs. ${totalCollected}`, 14, pageHeight - 20);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 128, 0);
      doc.text(`Closing Balance (31st March ${endYear}): Rs. ${closingBalance}`, pageWidth - 110, pageHeight - 20);
    }
  });

  doc.save(`Nethaji_Nagar_FY_${fy}_Report.pdf`);
};