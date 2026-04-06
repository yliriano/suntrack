const CARDS = [
  { key:'total', label:'Total Results', accentColor:'from-blue-500 to-blue-600', bgLight:'bg-blue-50', textColor:'text-blue-600', borderColor:'border-blue-100', icon:(<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414A1 1 0 0 1 19 9.414V19a2 2 0 0 1-2 2z" /></svg>)},
  { key:'issued', label:'Issued', accentColor:'from-emerald-500 to-emerald-600', bgLight:'bg-emerald-50', textColor:'text-emerald-600', borderColor:'border-emerald-100', icon:(<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>)},
  { key:'inReview', label:'In Review', accentColor:'from-amber-400 to-amber-500', bgLight:'bg-amber-50', textColor:'text-amber-600', borderColor:'border-amber-100', icon:(<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>)},
  { key:'filedLast30', label:'Filed (Last 30 Days)', accentColor:'from-violet-500 to-violet-600', bgLight:'bg-violet-50', textColor:'text-violet-600', borderColor:'border-violet-100', icon:(<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" /></svg>)},
];
const Skeleton = () => (<div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse mt-1" />);
const MetricCards = ({ metrics, loading }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {CARDS.map(({ key, label, accentColor, bgLight, textColor, borderColor, icon }) => (
      <div key={key} className={`bg-white border ${borderColor} rounded-2xl shadow-sm overflow-hidden`}>
        <div className={`h-1 w-full bg-gradient-to-r ${accentColor}`} />
        <div className="p-4 flex items-start gap-3">
          <div className={`flex-shrink-0 rounded-xl p-2.5 ${bgLight} ${textColor}`}>{icon}</div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider leading-tight">{label}</p>
            {loading ? <Skeleton /> : <p className={`text-3xl font-bold mt-0.5 tracking-tight ${textColor}`}>{(metrics[key] ?? 0).toLocaleString()}</p>}
          </div>
        </div>
      </div>
    ))}
  </div>
);
export default MetricCards;
