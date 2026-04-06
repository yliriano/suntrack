import { LEAD_STATUSES } from '../hooks/useLeadStatus';

const SELECT_CLASS = 'w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 transition-all placeholder-slate-500 appearance-none cursor-pointer [&>option]:bg-slate-800 [&>option]:text-slate-100 [&>optgroup]:bg-slate-900 [&>optgroup]:text-slate-400';
const LABEL_CLASS = 'block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2';
const LIVE_JURISDICTIONS = new Set(['all', 'dc', 'nj', 'tx', 'ca', 'nc', 'il', 'co']);
const SearchIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>);

const Filters = ({ filters, onChange }) => {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  const isPortalOnly = !LIVE_JURISDICTIONS.has(filters.jurisdiction);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className={LABEL_CLASS}>Jurisdiction</label>
        <select className={SELECT_CLASS} value={filters.jurisdiction} onChange={(e) => set('jurisdiction', e.target.value)}>
          <option value="all">All Jurisdictions</option>
          <optgroup label="── Live Data ──">
            <option value="dc">Washington, DC</option>
            <option value="nj">New Jersey (Statewide)</option>
            <option value="tx">Texas (Austin + Dallas)</option>
            <option value="ca">California (SF + Los Angeles)</option>
            <option value="nc">North Carolina (Cary)</option>
            <option value="il">Illinois (Chicago)</option>
            <option value="co">Colorado (Fort Collins)</option>
          </optgroup>
          <optgroup label="── Portal Links ──">
            <option value="ks">Kansas</option>
            <option value="fl">Florida</option>
            <option value="az">Arizona</option>
            <option value="montgomery">Montgomery County, MD</option>
            <option value="pgcounty">Prince George's County, MD</option>
          </optgroup>
        </select>
      </div>
      <div>
        <label className={LABEL_CLASS}>Status</label>
        <select className={SELECT_CLASS} value={filters.status} onChange={(e) => set('status', e.target.value)} disabled={isPortalOnly}>
          <option value="all">All Statuses</option><option value="issued">Issued</option><option value="in-review">In Review</option><option value="filed">Filed</option><option value="expired">Expired</option>
        </select>
      </div>
      <div>
        <label className={LABEL_CLASS}>Date Range</label>
        <select className={SELECT_CLASS} value={filters.dateRange} onChange={(e) => set('dateRange', e.target.value)} disabled={isPortalOnly}>
          <option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="180">Last 180 days</option><option value="365">Last 12 months</option><option value="all">All time</option>
        </select>
      </div>
      <div>
        <label className={LABEL_CLASS}>Lead Status</label>
        <select className={SELECT_CLASS} value={filters.leadStatus} onChange={(e) => set('leadStatus', e.target.value)} disabled={isPortalOnly}>
          <option value="all">All Leads</option><option value="none">— Untagged</option>
          {LEAD_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>
      <div>
        <label className={LABEL_CLASS}>Search</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 pointer-events-none"><SearchIcon /></span>
          <input type="text" className={`${SELECT_CLASS} pl-9`} placeholder="Address, contractor…" value={filters.keyword} onChange={(e) => set('keyword', e.target.value)} disabled={isPortalOnly} />
        </div>
      </div>
    </div>
  );
};
export default Filters;
