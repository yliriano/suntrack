import { useState, useCallback, useEffect, useRef } from 'react';
import { isConfigured, getUserData, upsertUserData } from '../lib/supabase';

const LS_KEY = 'suntrack_watchlist';
const LS_SEEN_KEY = 'suntrack_last_seen';
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? []; } catch { return []; } };
const loadSeen = () => { try { return JSON.parse(localStorage.getItem(LS_SEEN_KEY)) ?? {}; } catch { return {}; } };
const extractZip = (address) => { const m = address && address.match(/\b(\d{5})(?:-\d{4})?\b/g); return m ? m[m.length-1].slice(0,5) : null; };

export const useWatchlist = ({ token, userId, permits }) => {
  const [watchlist, setWatchlist] = useState(load);
  const [lastSeen, setLastSeen] = useState(loadSeen);
  const syncRef = useRef(null);

  useEffect(() => {
    if (!isConfigured || !token || !userId) return;
    getUserData(token, userId).then((row) => {
      if (row?.watchlist?.length) {
        setWatchlist((prev) => { const merged = [...new Set([...prev, ...row.watchlist])]; localStorage.setItem(LS_KEY, JSON.stringify(merged)); return merged; });
      }
    });
  }, [token, userId]);

  const syncCloud = useCallback((next) => {
    if (!isConfigured || !token || !userId) return;
    clearTimeout(syncRef.current);
    syncRef.current = setTimeout(() => upsertUserData(token, userId, { watchlist: next }), 1500);
  }, [token, userId]);

  const addToWatchlist = useCallback((term) => {
    const trimmed = term.trim(); if (!trimmed) return;
    setWatchlist((prev) => { if (prev.includes(trimmed)) return prev; const next = [...prev, trimmed]; localStorage.setItem(LS_KEY, JSON.stringify(next)); syncCloud(next); return next; });
  }, [syncCloud]);

  const removeFromWatchlist = useCallback((term) => {
    setWatchlist((prev) => { const next = prev.filter((t) => t !== term); localStorage.setItem(LS_KEY, JSON.stringify(next)); syncCloud(next); return next; });
  }, [syncCloud]);

  const markSeen = useCallback((term) => {
    setLastSeen((prev) => { const next = { ...prev, [term]: new Date().toISOString() }; localStorage.setItem(LS_SEEN_KEY, JSON.stringify(next)); return next; });
  }, []);

  const [newPermitNumbers, setNewPermitNumbers] = useState(() => new Set());
  useEffect(() => {
    const s = new Set();
    if (permits && watchlist.length) {
      permits.forEach((p) => {
        const zip = extractZip(p.address_1 || '');
        watchlist.forEach((term) => {
          const termLower = term.toLowerCase();
          const matches = zip === term || (p.address_1 || '').toLowerCase().includes(termLower);
          if (!matches) return;
          const seen = lastSeen[term];
          if (!seen) { s.add(p.permit_number); return; }
          const filed = p.application_date ? new Date(p.application_date) : null;
          if (filed && filed > new Date(seen)) s.add(p.permit_number);
        });
      });
    }
    setNewPermitNumbers(s);
  }, [permits, watchlist, lastSeen]);

  return { watchlist, addToWatchlist, removeFromWatchlist, markSeen, newPermitNumbers, newCount: newPermitNumbers.size };
};
