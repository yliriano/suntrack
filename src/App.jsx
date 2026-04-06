import { useState, useMemo } from 'react';
import { usePermits } from './hooks/usePermits';
import { useAuth } from './hooks/useAuth';
import { useLeadStatus } from './hooks/useLeadStatus';
import { useWatchlist } from './hooks/useWatchlist';
import Filters from './components/Filters';
import MetricCards from './components/MetricCards';
import PermitTable from './components/PermitTable';
import MDPortals from './components/MDPortals';
import HomeownersTab from './components/HomeownersTab';
import Logo from './components/Logo';
import WatchlistPanel from './components/WatchlistPanel';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import { exportToCSV } from './utils/exportCSV';
import { isConfigured } from './lib/supabase';

const DEFAULT_FILTERS = { jurisdiction: 'all', status: 'all', dateRange: '365', keyword: '', leadStatus: 'all' };
const LIVE_JURISDICTIONS = new Set(['all', 'dc', 'nj', 'tx', 'ca', 'nc', 'il', 'co']);
const SHOW_PORTALS = new Set(['all', 'dc', 'nj', 'tx', 'ca', 'nc', 'il', 'co', 'fl', 'az', 'ks', 'montgomery', 'pgcounty']);

function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tab, setTab] = useState('permits');
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const { user, token, loading: authLoading, error: authError, login, register, logout } = useAuth();
  const { filteredData, loading, error, metrics } = usePermits(filters);
  const { leadStatuses, setLeadStatus } = useLeadStatus({ token, userId: user?.id });
  const { watchlist, addToWatchlist, removeFromWatchlist, markSeen, newPermitNumbers, newCount } = useWatchlist({ token, userId: user?.id, permits: filteredData });

  const displayData = useMemo(() => {
    if (filters.leadStatus === 'all') return filteredData;
    if (filters.leadStatus === 'none') return filteredData.filter((p) => !leadStatuses[p.permit_number]);
    return filteredData.filter((p) => leadStatuses[p.permit_number] === filters.leadStatus);
  }, [filteredData, filters.leadStatus, leadStatuses]);

  const showLiveData = LIVE_JURISDICTIONS.has(filters.jurisdiction);
  const showPortals = SHOW_PORTALS.has(filters.jurisdiction);
  const canExport = tab === 'permits' && showLiveData && !loading && displayData.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 sticky top-0 z-10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight leading-tight text-white"><span className="text-amber-400">Sun</span>Track</h1>
              <p className="text-xs text-slate-400 leading-tight hidden sm:block mt-0.5">Solar Permit Intelligence · DC · NJ · TX · CA · NC · IL · CO · KS · FL · AZ · MD · and more</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {tab === 'permits' && showLiveData && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : error ? 'bg-red-400' : 'bg-emerald-400'}`} />
                <span className="text-xs font-medium text-slate-300">{loading ? 'Loading…' : error ? 'API error' : 'Live data'}</span>
              </div>
            )}
            {tab === 'permits' && (
              <button onClick={() => setWatchlistOpen(true)} className="relative inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all" title="Zip Watchlist">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" /></svg>
                <span className="hidden sm:inline">Watchlist</span>
                {newCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-xs font-bold bg-red-500 text-white rounded-full">{newCount > 9 ? '9+' : newCount}</span>}
              </button>
            )}
            <button onClick={() => exportToCSV(displayData, leadStatuses)} disabled={!canExport}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" /></svg>
              Export CSV
            </button>
            {user ? (<UserMenu user={user} onSignOut={logout} />) : (isConfigured && (<button onClick={() => setAuthOpen(true)} className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-all">Sign in</button>))}
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-4 sm:px-6 pt-6 pb-0">
        <div className="max-w-7xl mx-auto">
          {tab === 'permits' && <Filters filters={filters} onChange={setFilters} />}
          <div className="flex gap-1 mt-5 -mb-px">
            <button
              onClick={() => setTab('permits')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${tab === 'permits' ? 'bg-slate-50 text-slate-900 border-amber-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            >
              🔆 Solar Permits
            </button>
            <button
              onClick={() => setTab('homeowners')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${tab === 'homeowners' ? 'bg-slate-50 text-slate-900 border-amber-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            >
              🏠 New Homeowners
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-7">
        {tab === 'homeowners' ? (
          <HomeownersTab solarPermits={filteredData} />
        ) : (
          <>
            {showPortals && <MDPortals jurisdiction={filters.jurisdiction} />}
            {filters.jurisdiction === 'co' && filters.dateRange !== 'all' && !loading && filteredData.length === 0 && (
              <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2.5">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                <span>The Fort Collins solar dataset is a historical registry. Most records are from 2009–2022.{' '}<button className="underline font-semibold" onClick={() => setFilters(f => ({ ...f, dateRange: 'all' }))}>Switch to "All time"</button>{' '}to see all 2,680 installations.</span>
              </div>
            )}
            {isConfigured && !user && (
              <div className="mb-5 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Sign in to sync</span> your lead statuses and watchlist across devices.</p>
                <button onClick={() => setAuthOpen(true)} className="flex-shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-semibold rounded-lg transition-colors">Sign in</button>
              </div>
            )}
            {showLiveData && (<><MetricCards metrics={metrics} loading={loading} /><PermitTable permits={displayData} loading={loading} error={error} leadStatuses={leadStatuses} onLeadStatusChange={setLeadStatus} newPermitNumbers={newPermitNumbers} /></>)}
            {!showLiveData && (
              <div className="mt-2 bg-slate-100 border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
                <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" /></svg>
                Live permit API data is not available for this jurisdiction.<br />Use the portal links above to search permits directly.
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-700/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2"><span className="font-bold text-sm"><span className="text-amber-400">Sun</span><span className="text-white">Track</span></span><span className="text-slate-700">·</span><span>Solar / photovoltaic keyword filter</span></div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="text-slate-600 font-medium">Live sources:</span>
            {[{label:'DC',url:'https://opendata.dc.gov/'},{label:'NJ Statewide',url:'https://data.nj.gov/Reference-Data/NJ-Construction-Permit-Data/w9se-dmra'},{label:'Austin',url:'https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu'},{label:'SF',url:'https://data.sfgov.org/Housing-and-Buildings/Building-Permits/i98e-djp9'},{label:'Los Angeles',url:'https://data.lacity.org/A-Prosperous-City/Building-and-Safety-Permit-Information/pi9x-tg5x'},{label:'Cary NC',url:'https://data.townofcary.org/explore/dataset/solar-permit-applications/'},{label:'Chicago IL',url:'https://data.cityofchicago.org/Buildings/Building-Permits/ydr8-5enu'},{label:'Fort Collins CO',url:'https://opendata.fcgov.com/Sustainability/Fort-Collins-Solar-Installations/3ku5-x4k9'}].map(({label,url})=>(<a key={label} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">{label}</a>))}
          </div>
        </div>
      </footer>

      <WatchlistPanel open={watchlistOpen} onClose={() => setWatchlistOpen(false)} watchlist={watchlist} onAdd={addToWatchlist} onRemove={removeFromWatchlist} onMarkSeen={markSeen} newCount={newCount} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLogin={login} onRegister={register} loading={authLoading} error={authError} />
    </div>
  );
}

export default App;
