/**
 * Utility to convert row objects into a CSV and trigger browser file download.
 */
export function downloadCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((r) =>
      headers
        .map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`)
        .join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Utility to safely copy string to clipboard.
 */
export async function copyToClipboard(text, onSuccess) {
  try {
    await navigator.clipboard.writeText(text);
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
  }
}
