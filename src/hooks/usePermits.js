import { useState, useEffect, useMemo } from 'react';
import { normalizeStatus, isWithinDays } from '../utils/formatters';

const APIS = {
  dc: { base:'https://data.dc.gov/resource/ivpq-r9en.json', solarWhere:["upper(permit_type_name) like '%SOLAR%'","upper(permit_subtype_name) like '%SOLAR%'","upper(permit_type_name) like '%PHOTOVOLTAIC%'","upper(permit_subtype_name) like '%PHOTOVOLTAIC%'","upper(contractor_trade) like '%SOLAR%'"].join(' OR '), orderField:'application_date', normalize:(p)=>({_source:'dc',_sourceLabel:'DC Open Data',_sourceUrl:'https://opendata.dc.gov/datasets/building-permits/about',permit_number:p.permit_number||'',application_date:p.application_date||'',issue_date:p.issue_date||'',address_1:p.address_1||'',permit_type_name:p.permit_type_name||'',permit_subtype_name:p.permit_subtype_name||'',status_current:p.status_current||'',contractor_company_name:p.contractor_company_name||'',contractor_trade:p.contractor_trade||'',owner_name:p.owner_name||'',municipality:'Washington, DC',state:'DC'}) },
  nj: { base:'https://data.nj.gov/resource/w9se-dmra.json', solarWhere:["upper(permittypedesc) like '%SOLAR%'","upper(permittypedesc) like '%PHOTOVOLTAIC%'","upper(usegroupdesc) like '%SOLAR%'","upper(censusdesc) like '%SOLAR%'"].join(' OR '), orderField:'permitdate', normalize:(p)=>({_source:'nj',_sourceLabel:'NJ Open Data',_sourceUrl:'https://data.nj.gov/Reference-Data/NJ-Construction-Permit-Data/w9se-dmra',permit_number:p.permitno||p.recordid||'',application_date:p.permitdate||'',issue_date:p.certdate||'',address_1:p.block&&p.lot?`Block ${p.block} Lot ${p.lot}`:'',permit_type_name:p.permittypedesc||p.permittype||'',permit_subtype_name:p.usegroupdesc||p.certtypedesc||'',status_current:p.permitstatusdesc||p.status||'',contractor_company_name:'',contractor_trade:'',owner_name:'',municipality:p.muniname||'',state:'NJ'}) },
  tx_austin: { base:'https://data.austintexas.gov/resource/3syk-w9eu.json', solarWhere:["upper(description) like '%SOLAR%'","upper(description) like '%PHOTOVOLTAIC%'","upper(permit_type_desc) like '%SOLAR%'","upper(work_class) like '%SOLAR%'"].join(' OR '), orderField:'applieddate', normalize:(p)=>({_source:'tx_austin',_sourceLabel:'Austin Open Data',_sourceUrl:'https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu',permit_number:p.permit_number||p.permit_num||'',application_date:p.applieddate||p.application_date||'',issue_date:p.issue_date||p.issued_date||'',address_1:p.original_address1||p.address||'',permit_type_name:p.permit_type_desc||p.permittype||'',permit_subtype_name:p.description||p.work_class||'',status_current:p.status_current||p.status||'',contractor_company_name:p.contractor_company_name||p.contractor||'',contractor_trade:p.contractor_trade||'',owner_name:p.applicant_full_name||p.owner||'',municipality:'Austin',state:'TX'}) },
  tx_dallas: { base:'https://www.dallasopendata.com/resource/e7gq-4sah.json', solarWhere:["upper(work_description) like '%SOLAR%'","upper(work_description) like '%PHOTOVOLTAIC%'","upper(permit_type) like '%SOLAR%'"].join(' OR '), orderField:'issued_date', normalize:(p)=>({_source:'tx_dallas',_sourceLabel:'Dallas Open Data',_sourceUrl:'https://www.dallasopendata.com/Services/Building-Permits/e7gq-4sah',permit_number:p.permit_number||'',application_date:p.issued_date||'',issue_date:p.issued_date||'',address_1:p.street_address||'',permit_type_name:p.permit_type||'',permit_subtype_name:p.work_description||p.land_use||'',status_current:p.permit_status||p.status||'Issued',contractor_company_name:p.contractor||'',contractor_trade:'',owner_name:'',municipality:'Dallas',state:'TX'}) },
  ca_sf: { base:'https://data.sfgov.org/resource/i98e-djp9.json', solarWhere:["upper(description) like '%SOLAR%'","upper(description) like '%PHOTOVOLTAIC%'","upper(permit_type) like '%SOLAR%'"].join(' OR '), orderField:'filed_date', normalize:(p)=>({_source:'ca_sf',_sourceLabel:'SF Open Data',_sourceUrl:'https://data.sfgov.org/Housing-and-Buildings/Building-Permits/i98e-djp9',permit_number:p.permit_number||p.application_number||'',application_date:p.filed_date||p.application_date||'',issue_date:p.issued_date||p.issue_date||'',address_1:[p.street_number,p.street_name,p.street_suffix].filter(Boolean).join(' ')||p.address||'',permit_type_name:p.permit_type_definition||p.permit_type||'',permit_subtype_name:p.description||p.work_description||'',status_current:p.status||p.permit_status||'',contractor_company_name:p.contractor_company_name||p.contractor||'',contractor_trade:'',owner_name:p.owner||'',municipality:'San Francisco',state:'CA'}) },
  il_chicago: { base:'https://data.cityofchicago.org/resource/ydr8-5enu.json', solarWhere:["upper(work_description) like '%SOLAR%'","upper(work_description) like '%PHOTOVOLTAIC%'","upper(work_type) like '%SOLAR%'"].join(' OR '), orderField:'application_start_date', normalize:(p)=>({_source:'il_chicago',_sourceLabel:'Chicago Open Data',_sourceUrl:'https://data.cityofchicago.org/Buildings/Building-Permits/ydr8-5enu',permit_number:p.permit_||p.id||'',application_date:p.application_start_date||'',issue_date:p.issue_date||'',address_1:[p.street_number,p.street_direction,p.street_name].filter(Boolean).join(' '),permit_type_name:p.work_type||p.permit_type||'',permit_subtype_name:p.work_description||'',status_current:p.permit_status||p.permit_milestone||'',contractor_company_name:p.contact_2_name||'',contractor_trade:'',owner_name:p.contact_1_name||'',municipality:'Chicago',state:'IL'}) },
  co_fc: { base:'https://opendata.fcgov.com/resource/3ku5-x4k9.json', solarWhere:null, orderField:'date_of_service', normalize:(p)=>({_source:'co_fc',_sourceLabel:'Fort Collins Open Data',_sourceUrl:'https://opendata.fcgov.com/Sustainability/Fort-Collins-Solar-Installations/3ku5-x4k9',permit_number:p.meta_row_id?p.meta_row_id.slice(0,8):'',application_date:p.date_of_service||'',issue_date:p.date_of_service||'',address_1:p.system_address||'',permit_type_name:'Solar Installation',permit_subtype_name:p.system_capacity_kw_dc?`${p.system_capacity_kw_dc} kW DC`:'',status_current:'Installed',contractor_company_name:'',contractor_trade:'',owner_name:'',municipality:'Fort Collins',state:'CO'}) },
  ca_la: { base:'https://data.lacity.org/resource/ysqd-apz7.json', solarWhere:"solar='Y'", orderField:'issue_date', normalize:(p)=>({_source:'ca_la',_sourceLabel:'LA Open Data',_sourceUrl:'https://data.lacity.org/City-Infrastructure-Service-Requests/Building-and-Safety-Electrical-Permits-Issued-from/ysqd-apz7',permit_number:p.permit_nbr||'',application_date:p.submitted_date||p.issue_date||'',issue_date:p.issue_date||'',address_1:p.primary_address||'',permit_type_name:p.permit_group||p.permit_type||'',permit_subtype_name:p.work_desc||p.permit_sub_type||'',status_current:p.status_desc||'',contractor_company_name:'',contractor_trade:'',owner_name:'',municipality:'Los Angeles',state:'CA'}) },
  nc_cary: { base:'https://data.townofcary.org/api/explore/v2.1/catalog/datasets/solar-permit-applications/records', isCary:true, normalize:(p)=>({_source:'nc_cary',_sourceLabel:'Cary Open Data',_sourceUrl:'https://data.townofcary.org/explore/dataset/solar-permit-applications/',permit_number:p.permitnum||p.permit_number||'',application_date:p.applieddate||p.application_date||'',issue_date:p.issuedate||p.issue_date||'',address_1:p.originaladdress1||p.site_address||p.address||'',permit_type_name:p.permit_type||p.type||'Solar Permit',permit_subtype_name:p.description||'',status_current:p.statuscurrent||p.statuscurrentmapped||p.status||'',contractor_company_name:p.contractorcompanyname||p.contractor_company||'',contractor_trade:p.contractortrade||p.contractortrademapped||'',owner_name:p.ownername||p.owner||'',municipality:p.jurisdiction||'Cary',state:'NC'}) },
};

const JURISDICTION_APIS = {
  dc: ['dc'],
  nj: ['nj'],
  tx: ['tx_austin', 'tx_dallas'],
  ca: ['ca_sf', 'ca_la'],
  nc: ['nc_cary'],
  il: ['il_chicago'],
  co: ['co_fc'],
};

async function fetchSource(key) {
  const cfg = APIS[key];
  if (!cfg) return [];
  const where = Array.isArray(cfg.solarWhere) ? cfg.solarWhere.join(' AND ') : cfg.solarWhere;
  const orderBy = cfg.orderField ? '&$order=' + cfg.orderField + ' DESC' : '';
  const url = cfg.base + '?$where=' + encodeURIComponent(where) + orderBy + '&$limit=1000';
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + key);
  const raw = await res.json();
  return raw.map(cfg.normalize);
}
const PORTAL_ONLY_JURISDICTIONS = new Set(['fl', 'az', 'ks', 'montgomery', 'pgcounty']);
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
