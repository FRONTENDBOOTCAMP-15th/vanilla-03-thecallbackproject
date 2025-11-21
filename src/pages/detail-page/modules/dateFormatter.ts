export function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const normalized = dateStr.replace(/\./g, '-');
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return '';

  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}. ${year}`;
}
