// Portal configurations for all non-live or supplemental jurisdictions
const PORTALS = {

  // ── Washington, DC ─────────────────────────────────────────────────────────
  dc: {
    label: 'Washington, DC',
    accentColor: 'border-l-blue-500',
    cards: [
      {
        name: 'DC Open Data – Building Permits',
        dept: 'Dept. of Consumer & Regulatory Affairs (DCRA)',
        url: 'https://opendata.dc.gov/datasets/building-permits/about',
        tip: 'Live data fetched automatically. Use this portal to explore the full dataset and apply custom filters.',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'DCRA Permit Center',
        dept: 'Online Permit Search',
        url: 'https://dcra.dc.gov/service/permit-and-license-lookup',
        tip: 'Search DC permits by address, permit number, or owner name. Use "Solar" or "Photovoltaic" as the work type.',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'SolarApp+ (DC)',
        dept: 'NRECA / National solar permit platform',
        url: 'https://solarapp.nreca.coop/',
        tip: 'DC participates in SolarApp+ for expedited solar permits. Look up addresses and check permit status.',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
    ],
  },

  // ── New Jersey ─────────────────────────────────────────────────────────────
  // (also in nj key below for portal-only fallback)

  // ── Florida ────────────────────────────────────────────────────────────────
  fl: {
    label: 'Florida',
    accentColor: 'border-l-orange-500',
    cards: [
      {
        name: 'Miami-Dade County',
        dept: 'Miami-Dade Open Data Hub',
        url: 'https://opendata.miamidade.gov/',
        tip: 'Search "Building Permit" datasets; filter by work type for solar.',
        btn: 'bg-orange-600 hover:bg-orange-700',
        badge: 'bg-orange-50 text-orange-700',
      },
      {
        name: 'City of Orlando',
        dept: 'Building & Development Permit Data',
        url: 'https://www.orlando.gov/Building-Development/Permits-Inspections/Other/View-Permitting-Data',
        tip: 'View and download permitting data; search for solar or PV permits.',
        btn: 'bg-orange-600 hover:bg-orange-700',
        badge: 'bg-orange-50 text-orange-700',
      },
      {
        name: 'Florida DBPR',
        dept: 'Dept. of Business & Professional Regulation',
        url: 'https://www.myfloridalicense.com/wl11.asp?mode=0&SID=',
        tip: 'Look up licensed solar contractors and permit holders statewide.',
        btn: 'bg-orange-600 hover:bg-orange-700',
        badge: 'bg-orange-50 text-orange-700',
      },
    ],
  },

  // ── California ─────────────────────────────────────────────────────────────
  ca: {
    label: 'California',
    accentColor: 'border-l-yellow-500',
    cards: [
      {
        name: 'San Francisco Open Data',
        dept: 'DataSF – Building Permits',
        url: 'https://data.sfgov.org/Housing-and-Buildings/Building-Permits/i98e-djp9',
        tip: 'Live data fetched automatically. Use this portal to explore or cross-reference.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
      {
        name: 'Los Angeles',
        dept: 'LA Open Data – Electrical Permits (Solar)',
        url: 'https://data.lacity.org/City-Infrastructure-Service-Requests/Building-and-Safety-Electrical-Permits-Issued-from/ysqd-apz7',
        tip: 'Live data fetched automatically (70,000+ solar permits). Use this portal to explore or export the full dataset.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
      {
        name: 'San Diego',
        dept: 'Development Services – Permit Search',
        url: 'https://www.sandiego.gov/development-services/permits',
        tip: 'Use the online permit search portal; search by work description "Solar".',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
      {
        name: 'San Jose',
        dept: 'Planning, Building & Code Enforcement',
        url: 'https://www.sanjoseca.gov/your-government/departments-offices/planning-building-code-enforcement/building/permits',
        tip: 'Search San Jose building permits; use "Solar" or "Photovoltaic" as the permit description keyword.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
      {
        name: 'Sacramento',
        dept: 'Community Development – Building Permits',
        url: 'https://www.cityofsacramento.org/community-development/building',
        tip: 'Search Sacramento building permits by address or permit type; select "Solar" or "PV" work type.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
      {
        name: 'Oakland',
        dept: 'Planning & Building – Permit Center',
        url: 'https://aca.accela.com/OAKLAND/',
        tip: 'Search Oakland permits; enter "Solar" in the work type or description field.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
      {
        name: 'Long Beach',
        dept: 'Development Services – Permit Center',
        url: 'https://aca.accela.com/LONGBEACH/',
        tip: 'Search Long Beach permits by address or permit type. Use "Solar" as the work description keyword.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
    ],
  },

  // ── Texas ──────────────────────────────────────────────────────────────────
  tx: {
    label: 'Texas',
    accentColor: 'border-l-red-500',
    cards: [
      {
        name: 'City of Austin',
        dept: 'Austin Open Data – Issued Construction Permits',
        url: 'https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu',
        tip: 'Live data fetched automatically. This portal allows additional filtering and download.',
        btn: 'bg-red-600 hover:bg-red-700',
        badge: 'bg-red-50 text-red-700',
      },
      {
        name: 'City of Dallas',
        dept: 'Dallas OpenData – Building Permits',
        url: 'https://www.dallasopendata.com/Services/Building-Permits/e7gq-4sah',
        tip: 'Live data fetched automatically. Use this portal for additional filters and exports.',
        btn: 'bg-red-600 hover:bg-red-700',
        badge: 'bg-red-50 text-red-700',
      },
      {
        name: 'City of Houston',
        dept: 'Houston Permitting Center',
        url: 'https://www.houstonpermittingcenter.org/',
        tip: 'Search permits by address, permit number, or contractor name. Enter "Solar" in the work type field.',
        btn: 'bg-red-600 hover:bg-red-700',
        badge: 'bg-red-50 text-red-700',
      },
      {
        name: 'City of San Antonio',
        dept: 'Development Services Dept. – Permits',
        url: 'https://www.sanantonio.gov/DSD/Permits',
        tip: 'Search residential and commercial solar permits for San Antonio addresses.',
        btn: 'bg-red-600 hover:bg-red-700',
        badge: 'bg-red-50 text-red-700',
      },
      {
        name: 'City of Fort Worth',
        dept: 'Development Services – Permit Search',
        url: 'https://aca-prod.accela.com/FORTWORTHTX/Default.aspx',
        tip: 'Search active and historical permits; use "Solar" as the work type keyword.',
        btn: 'bg-red-600 hover:bg-red-700',
        badge: 'bg-red-50 text-red-700',
      },
      {
        name: 'City of Plano',
        dept: 'Building Inspections – Permit Search',
        url: 'https://plano.gov/188/Building-Inspections',
        tip: 'Search for solar permits by address or permit number on the Plano permit portal.',
        btn: 'bg-red-600 hover:bg-red-700',
        badge: 'bg-red-50 text-red-700',
      },
      {
        name: 'City of Arlington',
        dept: 'Development Services – Permits & Inspections',
        url: 'https://aca.arlingtontx.gov/CitizenAccess/',
        tip: 'Access Arlington\'s online permit portal; search by address or permit type "Solar".',
        btn: 'bg-red-600 hover:bg-red-700',
        badge: 'bg-red-50 text-red-700',
      },
      {
        name: 'City of El Paso',
        dept: 'Development Services – Permit Search',
        url: 'https://permits.elpasotexas.gov/',
        tip: 'Search residential and commercial solar permits for El Paso addresses.',
        btn: 'bg-red-600 hover:bg-red-700',
        badge: 'bg-red-50 text-red-700',
      },
    ],
  },

  // ── Arizona ────────────────────────────────────────────────────────────────
  az: {
    label: 'Arizona',
    accentColor: 'border-l-amber-500',
    cards: [
      {
        name: 'Maricopa County (Phoenix area)',
        dept: 'Maricopa County Permits',
        url: 'https://mcpermits.maricopa.gov/',
        tip: 'Covers unincorporated Maricopa County. Search by address or permit number.',
        btn: 'bg-amber-600 hover:bg-amber-700',
        badge: 'bg-amber-50 text-amber-700',
      },
      {
        name: 'City of Phoenix',
        dept: 'Planning & Development Dept.',
        url: 'https://www.phoenix.gov/pdd/permits',
        tip: 'Search residential and commercial solar permits for City of Phoenix addresses.',
        btn: 'bg-amber-600 hover:bg-amber-700',
        badge: 'bg-amber-50 text-amber-700',
      },
      {
        name: 'Pima County (Tucson area)',
        dept: 'Building Permits Resources',
        url: 'https://www.pima.gov/1038/Building-Permits-Resources',
        tip: 'Search by permit type; select "Solar" or "Photovoltaic" from the work type list.',
        btn: 'bg-amber-600 hover:bg-amber-700',
        badge: 'bg-amber-50 text-amber-700',
      },
    ],
  },

  // ── North Carolina ─────────────────────────────────────────────────────────
  nc: {
    label: 'North Carolina',
    accentColor: 'border-l-blue-500',
    cards: [
      {
        name: 'Town of Cary – Solar Permits',
        dept: 'Cary Open Data – Solar Permit Applications',
        url: 'https://data.townofcary.org/explore/dataset/solar-permit-applications/',
        tip: 'Live data fetched automatically (dedicated solar dataset). Use this portal to browse visually.',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'City of Raleigh',
        dept: 'Planning & Development – Permits',
        url: 'https://raleighnc.gov/permits',
        tip: 'Search Raleigh building permits by address; filter by permit type "Solar" or "Photovoltaic".',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'Wake County',
        dept: 'Wake County Permits & Inspections',
        url: 'https://permits.wakegov.com/',
        tip: 'Covers unincorporated Wake County (Raleigh-Durham metro area). Search by address or permit number.',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'Charlotte-Mecklenburg',
        dept: 'Building Permits Portal',
        url: 'https://www.charlottenc.gov/growth-and-development/permits-and-construction/building-permits',
        tip: 'Search Charlotte & Mecklenburg County permits; filter by work type "Solar".',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'City of Durham',
        dept: 'Development Services – Building Permits',
        url: 'https://durhamnc.gov/2252/Building-Permits',
        tip: 'Search Durham building permits by address or permit number; look for "Solar" in work description.',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'City of Greensboro',
        dept: 'Planning & Development – Permits',
        url: 'https://www.greensboro-nc.gov/departments/planning-and-development/permits',
        tip: 'Search Greensboro building permits; enter "Solar" or "PV" in the description field.',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'City of Winston-Salem',
        dept: 'Inspections – Building Permits',
        url: 'https://www.cityofws.org/departments/inspections',
        tip: 'Search Winston-Salem permits by address; filter by work type for solar installations.',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
    ],
  },

  // ── Illinois ───────────────────────────────────────────────────────────────
  il: {
    label: 'Illinois',
    accentColor: 'border-l-blue-600',
    cards: [
      {
        name: 'City of Chicago',
        dept: 'Chicago Open Data – Building Permits',
        url: 'https://data.cityofchicago.org/Buildings/Building-Permits/ydr8-5enu',
        tip: 'Live data fetched automatically. Use this portal to explore the full dataset and apply additional filters.',
        btn: 'bg-blue-700 hover:bg-blue-800',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'City of Chicago Permit Portal',
        dept: 'Dept. of Buildings – Online Permits',
        url: 'https://webapps1.chicago.gov/buildingrecords/',
        tip: 'Search individual permit records by address or permit number.',
        btn: 'bg-blue-700 hover:bg-blue-800',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'City of Aurora',
        dept: 'Building & Permits Division',
        url: 'https://www.aurora-il.org/188/Permits-Inspections',
        tip: 'Search Aurora building permits; enter "Solar" or "Photovoltaic" in the work type field.',
        btn: 'bg-blue-700 hover:bg-blue-800',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'City of Rockford',
        dept: 'Building & Inspections – Permit Search',
        url: 'https://rockfordil.gov/city-services/building/permits/',
        tip: 'Search Rockford permits by address or permit type; look for Solar/PV work descriptions.',
        btn: 'bg-blue-700 hover:bg-blue-800',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'City of Springfield',
        dept: 'Office of Planning & Economic Development',
        url: 'https://www.springfieldil.gov/1086/Building-Permits',
        tip: 'Search Springfield building permits; filter by permit type or work description for solar.',
        btn: 'bg-blue-700 hover:bg-blue-800',
        badge: 'bg-blue-50 text-blue-700',
      },
      {
        name: 'Illinois IDFPR',
        dept: 'Dept. of Financial & Professional Regulation',
        url: 'https://www.idfpr.com/LicenseLookUp/licenselookup.asp',
        tip: 'Look up licensed solar contractors and electricians statewide.',
        btn: 'bg-blue-700 hover:bg-blue-800',
        badge: 'bg-blue-50 text-blue-700',
      },
    ],
  },

  // ── Colorado ───────────────────────────────────────────────────────────────
  co: {
    label: 'Colorado',
    accentColor: 'border-l-sky-500',
    cards: [
      {
        name: 'Fort Collins Solar Installations',
        dept: 'Fort Collins Open Data – Solar Registry',
        url: 'https://opendata.fcgov.com/Sustainability/Fort-Collins-Solar-Installations/3ku5-x4k9',
        tip: 'Live data fetched automatically. Dedicated solar installation dataset for Fort Collins.',
        btn: 'bg-sky-600 hover:bg-sky-700',
        badge: 'bg-sky-50 text-sky-700',
      },
      {
        name: 'City & County of Denver',
        dept: 'Denver Community Planning & Development',
        url: 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Community-Planning-and-Development/Building-Permits-Inspections',
        tip: 'Search building permits by address; filter by "Solar" or "PV" work type.',
        btn: 'bg-sky-600 hover:bg-sky-700',
        badge: 'bg-sky-50 text-sky-700',
      },
      {
        name: 'Colorado Springs',
        dept: 'Pikes Peak Regional Building Dept.',
        url: 'https://ppbd.org/',
        tip: 'Search residential and commercial solar permits for the Colorado Springs / El Paso County area.',
        btn: 'bg-sky-600 hover:bg-sky-700',
        badge: 'bg-sky-50 text-sky-700',
      },
      {
        name: 'City of Boulder',
        dept: 'Planning & Development Services – Permits',
        url: 'https://bouldercolorado.gov/services/building-permits',
        tip: 'Search Boulder building permits by address; look for "Solar" or "Photovoltaic" permit types.',
        btn: 'bg-sky-600 hover:bg-sky-700',
        badge: 'bg-sky-50 text-sky-700',
      },
      {
        name: 'City of Aurora',
        dept: 'Building & Development – Permits',
        url: 'https://www.auroragov.org/business_in_aurora/planning_building/building_permits',
        tip: 'Search Aurora CO permits; enter "Solar" in the work description field.',
        btn: 'bg-sky-600 hover:bg-sky-700',
        badge: 'bg-sky-50 text-sky-700',
      },
      {
        name: 'City of Lakewood',
        dept: 'Community Resources – Building Permits',
        url: 'https://www.lakewood.org/Government/Departments/Community-Resources/Building-and-Safety/Building-Permits',
        tip: 'Search Lakewood building permits by address or permit number for solar installations.',
        btn: 'bg-sky-600 hover:bg-sky-700',
        badge: 'bg-sky-50 text-sky-700',
      },
    ],
  },

  // ── Kansas ─────────────────────────────────────────────────────────────────
  ks: {
    label: 'Kansas',
    accentColor: 'border-l-yellow-600',
    cards: [
      {
        name: 'City of Wichita',
        dept: 'Development Services – Building Permits',
        url: 'https://www.wichita.gov/PWU/MiscDocs/Pages/Permit-Search.aspx',
        tip: 'Search active and historical permits; enter "Solar" or "Photovoltaic" in the description field.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
      {
        name: 'Johnson County / Overland Park',
        dept: 'Planning & Development Services',
        url: 'https://www.jocogov.org/dept/development-development-services/page/building-safety',
        tip: 'Covers unincorporated Johnson County and Overland Park area solar permits.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
      {
        name: 'Shawnee County (Topeka)',
        dept: 'Building Inspections Division',        url: 'https://www.snco.us/planning/page.aspx?page=permits',
        tip: 'Search permits for the Topeka/Shawnee County area by address or permit type.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
    ],
  },

  // ── Maryland counties ──────────────────────────────────────────────────────
  montgomery: {
    label: 'Montgomery County, MD',
    accentColor: 'border-l-blue-500',
    cards: [
      {
        name: 'Montgomery County, MD',
        dept: 'Department of Permitting Services (DPS)',
        url: 'https://permittingservices.montgomerycountymd.gov/DPS/online/eSearch.aspx',
        tip: 'Select "Solar" or "Photovoltaic" from the permit type dropdown, or search by address.',
        btn: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-50 text-blue-700',
      },
    ],
  },
  pgcounty: {
    label: "Prince George's County, MD",
    accentColor: 'border-l-emerald-500',
    cards: [
      {
        name: "Prince George's County, MD",
        dept: "Dept. of Permitting, Inspections & Enforcement (DPIE)",
        url: 'https://dpiestatus.princegeorgescountymd.gov/Site/Public/Citizens/ActivitySearch.aspx',
        tip: 'Use Activity Search — enter "Solar" as the permit type keyword or search by address.',
        btn: 'bg-emerald-600 hover:bg-emerald-700',
        badge: 'bg-emerald-50 text-emerald-700',
      },
    ],
  },

  // ── New Jersey (supplemental portal even though we have live data) ──────────
  nj: {
    label: 'New Jersey',
    accentColor: 'border-l-yellow-500',
    cards: [
      {
        name: 'NJ Construction Permit Data',
        dept: 'NJ Dept. of Community Affairs – Open Data',
        url: 'https://data.nj.gov/Reference-Data/NJ-Construction-Permit-Data/w9se-dmra',
        tip: 'Statewide construction permit data. Filter by permit type or municipality to find solar-related permits.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
      {
        name: 'NJ DCA Data Hub',
        dept: 'Division of Codes & Standards',
        url: 'https://njdca-data-hub-njdca.hub.arcgis.com/search?tags=permits,construction,codes',
        tip: 'Additional permit datasets including code enforcement and construction activity.',
        btn: 'bg-yellow-600 hover:bg-yellow-700',
        badge: 'bg-yellow-50 text-yellow-700',
      },
    ],
  },
};

// Jurisdictions that show portal cards
const PORTAL_JURISDICTIONS = Object.keys(PORTALS);

// Portal-only jurisdictions (no live data — portals labeled "Permit Portals")
// Live jurisdictions get cards labeled "Reference Portals"
const PORTAL_ONLY = new Set(['fl', 'az', 'ks', 'montgomery', 'pgcounty']);

const LinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const PortalCard = ({ card }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-300 hover:shadow-sm transition-all group">
    <div>
      <h4 className="font-semibold text-slate-800 text-sm leading-tight">{card.name}</h4>
      <p className="text-xs text-slate-400 mt-0.5 font-medium">{card.dept}</p>
    </div>
    <p className="text-xs text-slate-500 leading-relaxed flex-1">{card.tip}</p>
    <a href={card.url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 px-3 py-2 rounded-lg transition-all self-start shadow-sm group-hover:shadow">
      Open Portal
      <LinkIcon />
    </a>
  </div>
);

const StatePortalGroup = ({ jurisdictionKey }) => {
  const config = PORTALS[jurisdictionKey];
  if (!config) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="px-5 py-3.5 bg-slate-900 flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        </svg>
        <h3 className="text-sm font-bold text-white">{config.label}</h3>
      </div>
      <div className={`p-4 grid grid-cols-1 ${config.cards.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''} gap-3`}>
        {config.cards.map((card) => (
          <PortalCard key={card.name} card={card} />
        ))}
      </div>
    </div>
  );
};

const MDPortals = ({ jurisdiction }) => {
  let keys = [];

  if (jurisdiction === 'all') {
    keys = ['montgomery', 'pgcounty'];
  } else if (PORTAL_JURISDICTIONS.includes(jurisdiction)) {
    keys = [jurisdiction];
  }

  if (keys.length === 0) return null;

  const isPortalOnly = keys.every((k) => PORTAL_ONLY.has(k));

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {isPortalOnly ? 'Permit Portals' : 'Reference Portals'}
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      {keys.map((key) => (
        <StatePortalGroup key={key} jurisdictionKey={key} />
      ))}
      {isPortalOnly && (
        <p className="mt-2 text-xs text-slate-400 text-center">
          Live API data is not available for this jurisdiction. Use the portals above to search directly.
        </p>
      )}
    </div>
  );
};

export default MDPortals;
