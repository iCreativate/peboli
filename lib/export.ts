/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
) {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get all unique keys from the data
  const keys = Object.keys(data[0]) as (keyof T)[];

  // Create CSV header row
  const headerRow = keys.map(key => {
    const header = headers?.[key] || String(key);
    // Escape commas and quotes in headers
    return `"${header.replace(/"/g, '""')}"`;
  }).join(',');

  // Create CSV data rows
  const dataRows = data.map(row => {
    return keys.map(key => {
      const value = row[key];
      // Convert value to string and escape
      const stringValue = value == null ? '' : String(value);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  // Combine header and data
  const csvContent = [headerRow, ...dataRows].join('\n');

  // Add BOM for Excel compatibility with special characters
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to Excel format (XLSX) using SheetJS
 * Falls back to CSV if library is not available
 */
export async function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>,
  sheetName: string = 'Sheet1'
) {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  try {
    // Try to use xlsx library if available
    const XLSX = await import('xlsx').catch(() => null);
    
    if (XLSX) {
      // Get all unique keys from the data
      const keys = Object.keys(data[0]) as (keyof T)[];

      // Create worksheet data
      const worksheetData = [
        // Header row
        keys.map(key => headers?.[key] || String(key)),
        // Data rows
        ...data.map(row => keys.map(key => {
          const value = row[key];
          return value == null ? '' : value;
        }))
      ];

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generate Excel file
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else {
      // Fallback to CSV
      console.warn('xlsx library not available, falling back to CSV');
      exportToCSV(data, filename, headers);
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    // Fallback to CSV
    exportToCSV(data, filename, headers);
  }
}

/**
 * Export data with format selection (CSV or Excel)
 */
export async function exportData<T extends Record<string, any>>(
  data: T[],
  filename: string,
  format: 'csv' | 'excel' = 'csv',
  headers?: Record<keyof T, string>,
  sheetName?: string
) {
  if (format === 'excel') {
    await exportToExcel(data, filename, headers, sheetName);
  } else {
    exportToCSV(data, filename, headers);
  }
}

