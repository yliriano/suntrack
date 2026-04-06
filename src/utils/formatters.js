/**
 * Format an ISO date string to a readable short date.
 * Returns '—' for missing/invalid values.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date)) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const normalizeStatus = (status) => {
  if (!status) return 'unknown';
  const s = status.toUpperCase();
  if (s.includes('ISSUED') || s.includes('PERMIT ISSUED') || s === 'APPROVED' || s.includes('INSTALL') || s.includes('COMPLET') || s.includes('FINAL')) return 'issued';
  if (s.includes('REVIEW') || s.includes('PENDING') || s.includes('PROCESSING') || s.includes('PLAN CHECK') || s.includes('UNDER REVIEW') || s === 'ACTIVE' || s.includes('INSPECTION')) return 'in-review';
  if (s.includes('FILED') || s.includes('RECEIVED') || s.includes('APPLICATION') || s.includes('OPEN') || s === 'INTAKE') return 'filed';
  if (s.includes('EXPIRED') || s.includes('VOID') || s.includes('CANCEL') || s.includes('DENIED') || s.includes('WITHDRAWN')) return 'expired';
  return 'unknown';
};

export const STATUS_LABELS = {
  issued: 'Issued',
  'in-review': 'In Review',
  filed: 'Filed',
  expired: 'Expired',
  unknown: 'Unknown',
};

export const STATUS_COLORS = {
  issued: 'bg-green-100 text-green-800 ring-green-200',
  'in-review': 'bg-amber-100 text-amber-800 ring-amber-200',
  filed: 'bg-blue-100 text-blue-800 ring-blue-200',
  expired: 'bg-red-100 text-red-800 ring-red-200',
  unknown: 'bg-gray-100 text-gray-600 ring-gray-200',
};

export const isWithinDays = (dateStr, days) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
};
