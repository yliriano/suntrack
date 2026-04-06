import { useState, useEffect, useMemo } from 'react';
import { normalizeStatus, isWithinDays } from '../utils/formatters';

const APIS = {
  dc: { base:'https://data.dc.gov/resource/ivpq-r9en.json', solarWhere:"upper(permit_type_name) like '%SOLAR%' OR upper(permit_subtype_name) like '%SOLAR%' OR upper(permit_type_name) like '%PHOTOVOLTAIC%'", orderField:'application_date', normalize:(p)=>({_source:'dc',_sourceLabel:'DC Open Data',_sourceUrl:'https://opendata.dc.gov/datasets/building-permits/about',permit_number:p.permit_number||'',application_date:p.application_date||'',issue_date:p.issue_date||'',address_1:p.address_1||'',permit_type_name:p.permit_type_name||'',permit_subtype_name:p.permit_subtype_name||'',permit_status:normalizeStatus(p.permit_status||''),contractor_trade:p.contractor_trade||''}) },
  nj: { base:'https://data.nj.gov/resource/w9se-dmra.json', solarWhere:"censusnumber = 438", orderField:'permitdate', normalize:(p)=>({_source:'nj',_sourceLabel:'NJ Statewide',_sourceUrl:'https://data.nj.gov/Housing-and-Buildings/NJ-Construction-Permit-Data/w9se-dmra',permit_number:p.permitno||'',application_date:p.permitdate||'',issue_date:p.permitdate||'',address_1:(p.muniname||'')+(p.county?', '+p.county+' County':''),permit_type_name:p.permittypedesc||'',permit_subtype_name:p.censusdesc||'Solar Energy',permit_status:normalizeStatus(p.status||p.permitstatusdesc||''),contractor_trade:''}) },
  tx_austin: { base:'https://data.austintexas.gov/resource/3syk-w9eu.json', solarWhere:"upper(description) like '%SOLAR%' OR upper(description) like '%PHOTOVOLTAIC%'", orderField:'applieddate', normalize:(p)=>({_source:'tx_austin',_sourceLabel:'Austin TX',_sourceUrl:'https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu',permit_number:p.permit_number||'',application_date:p.applieddate||'',issue_date:p.issue_date||'',address_1:p.original_address1||'',permit_type_name:p.permit_type_desc||'',permit_subtype_name:p.description||'',permit_status:normalizeStatus(p.status_current||''),contractor_trade:p.contractor_company_name||''}) },
  ca_sf: { base:'https://data.sfgov.org/resource/i98e-djp9.json', solarWhere:"upper(description) like '%SOLAR%' OR upper(description) like '%PHOTOVOLTAIC%'", orderField:'filed_date', normalize:(p)=>({_source:'ca_sf',_sourceLabel:'San Francisco CA',_sourceUrl:'https://data.sfgov.org/Housing-and-Buildings/Building-Permits/i98e-djp9',permit_number:p.permit_number||'',application_date:p.filed_date||'',issue_date:p.issued_date||'',address_1:(p.street_number||'')+' '+(p.street_name||''),permit_type_name:p.permit_type_definition||'',permit_subtype_name:p.description||'',permit_status:normalizeStatus(p.status||''),contractor_trade:''}) },
  il_chicago: { base:'https://data.cityofchicago.org/resource/ydr8-5enu.json', solarWhere:"upper(work_description) like '%SOLAR%' OR upper(work_description) like '%PHOTOVOLTAIC%'", orderField:'application_start_date', normalize:(p)=>({_source:'il_chicago',_sourceLabel:'Chicago IL',_sourceUrl:'https://data.cityofchicago.org/Buildings/Building-Permits/ydr8-5enu',permit_number:p.permit_||p.id||'',application_date:p.application_start_date||'',issue_date:p.issue_date||'',address_1:(p.street_number||'')+' '+(p.street_direction||'')+' '+(p.street_name||''),permit_type_name:p.permit_type||'',permit_subtype_name:p.work_description||'',permit_status:normalizeStatus(p.permit_status||''),contractor_trade:p.contact_1_name||''}) },
  co_fc: { base:'https://opendata.fcgov.com/resource/3ku5-x4k9.json', solarWhere:null, orderField:'date_of_service', normalize:(p)=>({_source:'co_fc',_sourceLabel:'Fort Collins CO',_sourceUrl:'https://opendata.fcgov.com/Neighborhood-Livability-and-Social-Health/Building-Permits/3ku5-x4k9',permit_number:p.permit_number||'',application_date:p.date_of_service||'',issue_date:p.date_of_service||'',address_1:p.system_address||p.address||'',permit_type_name:'Solar Permit',permit_subtype_name:p.system_capacity_kw_dc?`${p.system_capacity_kw_dc} kW DC`:'',permit_status:normalizeStatus(p.status||''),contractor_trade:''}) },
  ca_la: { base:'https://data.lacity.org/resource/pi9x-tg5x.json', solarWhere:"upper(work_desc) like '%SOLAR%' OR upper(work_desc) like '%PHOTOVOLTAIC%'", orderField:'issue_date', normalize:(p)=>({_source:'ca_la',_sourceLabel:'Los Angeles CA',_sourceUrl:'https://data.lacity.org/A-Prosperous-City/Building-and-Safety-Permit-Information/pi9x-tg5x',permit_number:p.permit_nbr||'',application_date:p.issue_date||'',issue_date:p.issue_date||'',address_1:p.primary_address||'',permit_type_name:p.permit_type||'',permit_subtype_name:p.work_desc||'',permit_status:normalizeStatus(p.status_desc||''),contractor_trade:''}) },
  nc_cary: { base:'https://data.townofcary.org/api/explore/v2.1/catalog/datasets/solar-permit-applications/records', apiType:'opendatasoft', orderField:'applieddate', normalize:(p)=>({_source:'nc_cary',_sourceLabel:'Cary NC',_sourceUrl:'https://data.townofcary.org/explore/dataset/solar-permit-applications',permit_number:p.permitnum||'',application_date:p.applieddate||'',issue_date:p.issuedate||'',address_1:p.originaladdress1||'',permit_type_name:'Solar Permit',permit_subtype_name:p.description||'',permit_status:normalizeStatus(p.statuscurrent||''),contractor_trade:p.contractorcompanyname||''}) },
};

const JURISDICTION_APIS = {
  dc: ['dc'],
  nj: ['nj'],
  tx: ['tx_austin'],
  ca: ['ca_sf', 'ca_la'],
  nc: ['nc_cary'],
  il: ['il_chicago'],
  co: ['co_fc'],
};

const PORTAL_ONLY_JURISDICTIONS = new Set(['fl', 'az', 'ks', 'montgomery', 'pgcounty']);

const CACHE_TTL = 30 * 60 * 1000;

async function fetchSource(key) {
  const cacheKey = 'st_v2_' + key;
  try {
    const hit = localStorage.getItem(cacheKey);
    if (hit) {
      const { ts, data } = JSON.parse(hit);
      if (Date.now() - ts < CACHE_TTL) return data;
    }
  } catch(e) {}
  const cfg = APIS[key];
  if (!cfg) return [];
  let raw;
  if (cfg.apiType === 'opendatasoft') {
    const orderQ = cfg.orderField ? '&order_by=' + cfg.orderField + '%20desc' : '';
    const res = await fetch(cfg.base + '?limit=300' + orderQ);
    if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + key);
    const j = await res.json();
    raw = j.results || [];
  } else {
    const whereQ = cfg.solarWhere ? '?$where=' + encodeURIComponent(cfg.solarWhere) + '&' : '?';
    const orderBy = cfg.orderField ? '$order=' + cfg.orderField + ' DESC&' : '';
    const url = cfg.base + whereQ + orderBy + '$limit=300';
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + key);
    raw = await res.json();
  }
  const result = raw.map(cfg.normalize);
  try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: result })); } catch(e) {}
  return result;
}

export const usePermits = (filters) => {
  // Cache fetched data per source key so we don't re-fetch on filter changes
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKeys = JURISDICTION_APIS[filters.jurisdiction] || [];

  useEffect(() => {
    if (PORTAL_ONLY_JURISDICTIONS.has(filters.jurisdiction)) return;

    const missing = apiKeys.filter((k) => !(k in cache));
    if (missing.length === 0) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.allSettled(
      missing.map((k) =>
        fetchSource(k)
          .then((d) => ({ key: k, data: d }))
          .catch((err) => Promise.reject({ key: k, err }))
      )
    ).then((results) => {
        if (cancelled) return;
        const newCache = { ...cache };
        results.forEach((r) => {
          if (r.status === 'fulfilled') {
            newCache[r.value.key] = r.value.data;
          } else {
            // Mark failed source as empty so it isn't retried in this session
            newCache[r.reason?.key || ''] = [];
          }
        });
        setCache(newCache);
        const failed = results.filter((r) => r.status === 'rejected');
        if (failed.length === results.length && results.length > 0) {
          setError('Could not load permit data from any source.');
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.jurisdiction]);

  // Combine all relevant cached sources
  const combined = useMemo(() => {
    return apiKeys.flatMap((k) => cache[k] || []);
  }, [cache, apiKeys]);

  // Client-side filtering
  const filteredData = useMemo(() => {
    if (PORTAL_ONLY_JURISDICTIONS.has(filters.jurisdiction)) return [];

    let data = combined;

    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange, 10);
      data = data.filter((p) => isWithinDays(p.application_date, days));
    }

    if (filters.status !== 'all') {
      data = data.filter((p) => normalizeStatus(p.status_current) === filters.status);
    }

    const kw = filters.keyword.trim().toLowerCase();
    if (kw) {
      data = data.filter((p) =>
        (p.address_1 || '').toLowerCase().includes(kw) ||
        (p.contractor_company_name || '').toLowerCase().includes(kw) ||
        (p.permit_number || '').toLowerCase().includes(kw) ||
        (p.owner_name || '').toLowerCase().includes(kw) ||
        (p.permit_type_name || '').toLowerCase().includes(kw) ||
        (p.permit_subtype_name || '').toLowerCase().includes(kw) ||
        (p.municipality || '').toLowerCase().includes(kw) ||
        (p.state || '').toLowerCase().includes(kw)
      );
    }

    return data;
  }, [combined, filters]);

  // Metrics
  const metrics = useMemo(() => ({
    total: filteredData.length,
    issued: filteredData.filter((p) => normalizeStatus(p.status_current) === 'issued').length,
    inReview: filteredData.filter((p) => normalizeStatus(p.status_current) === 'in-review').length,
    filedLast30: combined.filter((p) => isWithinDays(p.application_date, 30)).length,
  }), [filteredData, combined]);

  return { filteredData, loading, error, metrics };
};
