// lib/exportReport.ts

interface Employee {
  name: string;
  role: string;
  hoursWorked: number;
  hourlyRate: number;
}

export const exportEmployeeReportCSV = (employees: Employee[]): void => {
  // Define headers with explicit typing
  const headers: string[] = ["Employee", "Role","Hourly Rate", "Hours Worked", "Gross Pay"];
  
  // Create rows data with type safety
  const rows: string[][] = employees.map((employee: Employee) => {
    const grossPay: string = (employee.hourlyRate * employee.hoursWorked).toFixed(2);
    return [
      employee.name,
      employee.role,
      employee.hourlyRate.toFixed(2),
      employee.hoursWorked.toFixed(1),
      `$${grossPay}`
    ];
  });

  // Combine headers and rows with explicit typing
  const csvContent: string = [
    headers.join(","),
    ...rows.map((row: string[]) => row.join(","))
  ].join("\n");

  // Create blob with explicit typing
  const blob: Blob = new Blob([csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const url: string = URL.createObjectURL(blob);
  const link: HTMLAnchorElement = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "employee_report.csv");
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};