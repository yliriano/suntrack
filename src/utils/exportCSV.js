const escapeCell = (val) => {
  const str = val == null ? '' : String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

export const exportToCSV = (permits, leadStatuses = {}) => {
  if (!permits || permits.length === 0) return;

  const HEADERS = [
    'Filed Date','Issue Date','Permit #','Address','State','Municipality',
    'Owner','Contractor','Contractor Trade','Permit Type','Permit Subtype',
    'Status','Lead Status','Source',
  ];

  const rows = permits.map((p) => [
    p.application_date ? new Date(p.application_date).toLocaleDateString('en-US') : '',
    p.issue_date ? new Date(p.issue_date).toLocaleDateString('en-US') : '',
    p.permit_number || '',
    p.address_1 || '',
    p.state || '',
    p.municipality || '',
    p.owner_name || '',
    p.contractor_company_name || '',
    p.contractor_trade || '',
    p.permit_type_name || '',
    p.permit_subtype_name || '',
    p.status_current || '',
    (p.permit_number && leadStatuses[p.permit_number]) || '',
    p._sourceLabel || '',
  ]);

  const csvContent = [HEADERS, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');
  const today = new Date().toISOString().slice(0, 10);
  const filename = `solar-permits-${today}.csv`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click();
  document.body.removeChild(link); URL.revokeObjectURL(url);
};
