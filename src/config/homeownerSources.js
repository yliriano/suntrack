export const HOMEOWNER_APIS = {
  il_cook: {
    label: 'Cook County IL', state: 'IL',
    base: 'https://datacatalog.cookcountyil.gov/resource/wvhk-k5uv.json',
    orderField: 'sale_date',
    normalize: (r) => ({
      id: r.doc_no || r[':id'] || '',
      closeDate: r.sale_date || '',
      buyerName: r.buyer_name || '',
      sellerName: r.seller_name || '',
      address: r.pin ? 'PIN ' + r.pin : '',
      city: r.nbhd ? 'Nbhd ' + r.nbhd : 'Cook County',
      state: 'IL',
      purchasePrice: parseFloat(r.sale_price) || 0,
      source: 'Cook County IL Sales',
      sourceUrl: 'https://datacatalog.cookcountyil.gov/dataset/Cook-County-Assessor-Sales/wvhk-k5uv',
    }),
  },
  md: {
    label: 'Maryland Statewide', state: 'MD',
    base: 'https://opendata.maryland.gov/resource/ed4q-f8tm.json',
    orderField: 'sales_segment_1_transfer_date_yyyy_mm_dd_mdp_field_tradate_sdat_field_89',
    whereClause: 'sales_segment_1_consideration_mdp_field_considr1_sdat_field_90 > 50000',
    normalize: (r) => {
      const rawDate = r['sales_segment_1_transfer_date_yyyy_mm_dd_mdp_field_tradate_sdat_field_89'] || '';
      const closeDate = rawDate ? rawDate.replace(/\./g, '-') : '';
      return {
        id: (r['mdp_property_data_base_record_liber_mdp_field_liber'] || '') + '_' + (r['mdp_property_data_base_record_folio_mdp_field_folio'] || ''),
        closeDate,
        buyerName: '',
        sellerName: '',
        address: r['mdp_street_address_mdp_field_address'] || '',
        city: r['mdp_street_address_city_mdp_field_city'] || r['county_code_mdp_field_county'] || '',
        state: 'MD',
        purchasePrice: parseFloat(r['sales_segment_1_consideration_mdp_field_considr1_sdat_field_90']) || 0,
        source: 'MD Property Transfers',
        sourceUrl: 'https://opendata.maryland.gov/dataset/Maryland-Real-Property-Assessments/ed4q-f8tm',
      };
    },
  },
  ca_sf: {
    label: 'San Francisco CA', state: 'CA',
    base: 'https://data.sfgov.org/resource/wv5m-vpq2.json',
    orderField: 'current_sales_date',
    normalize: (r) => ({
      id: r.apn || r[':id'] || '',
      closeDate: r.current_sales_date || '',
      buyerName: '',
      sellerName: '',
      address: r.property_location || '',
      city: 'San Francisco', state: 'CA',
      purchasePrice: 0,
      source: 'SF Assessor Parcels',
      sourceUrl: 'https://data.sfgov.org/dataset/SF-Assessor-Parcel-Data/wv5m-vpq2',
    }),
  },
};

export const PORTAL_SOURCES = [
  { key: 'nj', label: 'New Jersey Statewide', state: 'NJ', url: 'https://www.njactb.org/', note: 'NJ Association of County Tax Boards – search property transfers by county' },
  { key: 'tx_austin', label: 'Austin TX', state: 'TX', url: 'https://www.traviscad.org/property-search/', note: 'Travis CAD – search recent property sales' },
  { key: 'tx_harris', label: 'Harris County TX', state: 'TX', url: 'https://hcad.org/property-search/real-property/', note: 'Search HCAD for recent deed transfers' },
  { key: 'ca_la', label: 'Los Angeles CA', state: 'CA', url: 'https://assessor.lacounty.gov/homeowners/property-search/', note: 'LA County Assessor – search property sales' },
  { key: 'co_denver', label: 'Denver CO', state: 'CO', url: 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Assessors-Office/Property-Search', note: 'Denver Assessor – search property sales' },
  { key: 'nc_wake', label: 'Wake County NC', state: 'NC', url: 'https://www.wakegov.com/departments-government/tax-administration/data-files-statistics-and-visualizations/real-estate-data', note: 'Download real estate transfer data' },
  { key: 'ks_sedgwick', label: 'Sedgwick County KS', state: 'KS', url: 'https://www.sedgwickcounty.org/appraiser/property-search/', note: 'Search recent property transfers' },
  { key: 'az_maricopa', label: 'Maricopa County AZ', state: 'AZ', url: 'https://mcassessor.maricopa.gov/', note: 'Search Maricopa County Assessor' },
  { key: 'az_pima', label: 'Pima County AZ', state: 'AZ', url: 'https://www.assessor.pima.gov/', note: 'Search Pima County Assessor' },
];
