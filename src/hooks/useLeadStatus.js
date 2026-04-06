import { useState, useCallback, useEffect, useRef } from 'react';
import { isConfigured, getUserData, upsertUserData } from '../lib/supabase';

const LS_KEY = 'suntrack_lead_statuses';

export const LEAD_STATUSES = ['New', 'Contacted', 'Pitched', 'Won', 'Lost'];

export const LEAD_STATUS_STYLES = {
  New:       'bg-slate-100 text-slate-600 border-slate-200',
  Contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  Pitched:   'bg-amber-50 text-amber-700 border-amber-200',
  Won:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lost:      'bg-red-50 text-red-600 border-red-200',
};

const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? {}; } catch { return {}; } };

export const useLeadStatus = ({ token, userId }) => {
  const [leadStatuses, setLeadStatuses] = useState(load);
  const syncRef = useRef(null);

  useEffect(() => {
    if (!isConfigured || !token || !userId) return;
    getUserData(token, userId).then((row) => {
      if (row?.lead_statuses) setLeadStatuses((prev) => ({ ...row.lead_statuses, ...prev }));
    });
  }, [token, userId]);

  const setLeadStatus = useCallback((permitNumber, status) => {
    setLeadStatuses((prev) => {
      const next = status ? { ...prev, [permitNumber]: status }
        : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== permitNumber));
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      if (isConfigured && token && userId) {
        clearTimeout(syncRef.current);
        syncRef.current = setTimeout(() => upsertUserData(token, userId, { lead_statuses: next }), 1500);
      }
      return next;
    });
  }, [token, userId]);

  return { leadStatuses, setLeadStatus };
};
