import { HOMEOWNER_APIS } from '../config/homeownerSources';

const CACHE_TTL = 15 * 60 * 1000;
const CACHE_PREFIX = 'suntrack_homeowners_';

async function fetchOne(key) {
  const cfg = HOMEOWNER_APIS[key];
  if (!cfg) return { key, data: [], error: 'Unknown source' };
  const cacheKey = CACHE_PREFIX + key;
  try {
    const hit = sessionStorage.getItem(cacheKey);
    if (hit) {
      const { ts, data } = JSON.parse(hit);
      if (Date.now() - ts < CACHE_TTL) return { key, data, error: null };
    }
  } catch(e) {}
  try {
    const dollar = '$';
    const orderQ = cfg.orderField ? `&${dollar}order=${cfg.orderField}+DESC` : '';
    const whereQ = cfg.whereClause ? `&${dollar}where=${encodeURIComponent(cfg.whereClause)}` : '';
    const url = `${cfg.base}?${dollar}limit=300${orderQ}${whereQ}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error('Unexpected response format');
    const data = raw.map(cfg.normalize);
    try { sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data })); } catch(e) {}
    return { key, data, error: null };
  } catch(err) {
    return { key, data: [], error: err.message };
  }
}

export async function fetchHomeowners(stateFilter) {
  const keys = Object.keys(HOMEOWNER_APIS).filter(k =>
    !stateFilter || stateFilter === 'all' || HOMEOWNER_APIS[k].state === stateFilter
  );
  const results = await Promise.allSettled(keys.map(fetchOne));
  const records = [];
  const errors = {};
  for (const r of results) {
    if (r.status === 'fulfilled') {
      const { key, data, error } = r.value;
      if (error) errors[key] = error;
      records.push(...data);
    }
  }
  records.sort((a, b) => {
    if (!a.closeDate) return 1;
    if (!b.closeDate) return -1;
    return b.closeDate.localeCompare(a.closeDate);
  });
  return { records, errors };
}

export function clearHomeownersCache() {
  Object.keys(HOMEOWNER_APIS).forEach(key => {
    try { sessionStorage.removeItem(CACHE_PREFIX + key); } catch(e) {}
  });
}
