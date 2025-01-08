// lib/exportReport.ts
import { jsPDF } from "jspdf";

export const exportEmployeeReport = (employees: any[]) => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Employee Report", 14, 20);

  const tableColumn = ["Employee", "Role", "Hours Worked", "Gross Pay"];
  const tableRows = employees.map((employee) => {
    const grossPay = (employee.hourlyRate * employee.hoursWorked).toFixed(2); // Calculate gross pay
    return [
      employee.name,
      employee.role,
      employee.hoursWorked.toFixed(1),
      `$${grossPay}`, 
    ];
  });

  const margin = 14;
  const rowHeight = 10;
  const columnWidth = [40, 40, 40, 40, 50]; // Define column widths
  let currentY = 30;

  // Draw table header
  for (let i = 0; i < tableColumn.length; i++) {
    doc.rect(margin + columnWidth.slice(0, i).reduce((a, b) => a + b, 0), currentY, columnWidth[i], rowHeight);
    doc.text(tableColumn[i], margin + columnWidth.slice(0, i).reduce((a, b) => a + b, 0) + 2, currentY + 6);
  }

  currentY += rowHeight;

  // Draw table rows
  for (let i = 0; i < tableRows.length; i++) {
    for (let j = 0; j < tableRows[i].length; j++) {
      doc.rect(margin + columnWidth.slice(0, j).reduce((a, b) => a + b, 0), currentY, columnWidth[j], rowHeight);
      doc.text(tableRows[i][j], margin + columnWidth.slice(0, j).reduce((a, b) => a + b, 0) + 2, currentY + 6);
    }
    currentY += rowHeight;
  }

  doc.save("employee_report.pdf");
};
