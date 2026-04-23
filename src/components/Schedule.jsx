import { useState, useEffect } from 'react';

/* ─── Type system ───────────────────────────────────────────────────── */

const TYPE_STYLES = {
  general:    { bg: 'bg-gray-50',               text: 'text-gray-700',         dot: 'bg-gray-400' },
  academic:   { bg: 'bg-institutional/8',        text: 'text-institutional',    dot: 'bg-institutional' },
  break:      { bg: 'bg-accent',                 text: 'text-gray-500',         dot: 'bg-complementary-gold' },
  workshop:   { bg: 'bg-vial/10',                text: 'text-vial',             dot: 'bg-vial' },
  visit:      { bg: 'bg-estructuras/10',         text: 'text-estructuras',      dot: 'bg-estructuras' },
  social:     { bg: 'bg-complementary-gold/10',  text: 'text-yellow-700',       dot: 'bg-complementary-gold' },
  solidarity: { bg: 'bg-sostenibilidad/10',      text: 'text-sostenibilidad',   dot: 'bg-sostenibilidad' },
  aneic:      { bg: 'bg-purple-50',              text: 'text-purple-700',       dot: 'bg-purple-500' },
};

const LEGEND = [
  { label: 'Académico',      type: 'academic' },
  { label: 'Taller',         type: 'workshop' },
  { label: 'Visita Técnica', type: 'visit' },
  { label: 'Social',         type: 'social' },
  { label: 'Solidario',      type: 'solidarity' },
  { label: 'ANEIC',          type: 'aneic' },
];

const DAY_COLORS = [
  { headerColor: 'bg-vial text-white',              borderColor: 'border-vial' },
  { headerColor: 'bg-estructuras text-white',       borderColor: 'border-estructuras' },
  { headerColor: 'bg-sostenibilidad text-white',    borderColor: 'border-sostenibilidad' },
  { headerColor: 'bg-complementary-gold text-white', borderColor: 'border-complementary-gold' },
];

/* ─── Infer activity type from title ───────────────────────────────── */

function inferType(title) {
  const t = title.toLowerCase();
  if (t.includes('almuerzo')) return 'break';
  if (t.includes('acreditación') || t.includes('acreditacion') || t.includes('apertura') || t.includes('clausura')) return 'general';
  if (t.includes('charla') || t.includes('panel') || t.includes('conferencia') || t.includes('cierre')) return 'academic';
  if (t.includes('taller')) return 'workshop';
  if (t.includes('visita')) return 'visit';
  if (t.includes('solidaria') || t.includes('solidario')) return 'solidarity';
  if (t.includes('aneic') || t.includes('asamblea')) return 'aneic';
  if (t.includes('cena') || t.includes('peña') || t.includes('recreativa') || t.includes('noche') || t.includes('sorteo') || t.includes('social')) return 'social';
  return 'general';
}

/* ─── Build grid days from API activities ───────────────────────────── */

function buildGridFromApi(activities) {
  const grouped = {};
  activities.forEach(act => {
    const d = new Date(act.startTime);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    if (!grouped[key]) grouped[key] = { key, activities: [] };
    grouped[key].activities.push(act);
  });

  return Object.values(grouped)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((group, idx) => {
      const firstDate = new Date(group.activities[0].startTime);
      const color = DAY_COLORS[idx % DAY_COLORS.length];
      return {
        day: firstDate.toLocaleDateString('es-AR', { weekday: 'long' })
          .replace(/^\w/, c => c.toUpperCase()),
        date: firstDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
        ...color,
        slots: group.activities
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
          .map(act => ({
            time: `${new Date(act.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}–${new Date(act.endTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
            name: act.title,
            type: inferType(act.title),
            detail: act.description || '',
          })),
      };
    });
}

/* ─── Static fallback data (used when API is empty) ─────────────────── */

const STATIC_DAYS = [
  {
    day: 'Martes',   date: '4 ago',
    headerColor: 'bg-vial text-white',              borderColor: 'border-vial',
    slots: [
      { time: '09:00–10:00', name: 'Acreditación y Bienvenida',             type: 'general' },
      { time: '10:00–13:00', name: 'Charla Magistral Inaugural',             type: 'academic',   detail: 'Conferencia de apertura con disertante nacional' },
      { time: '13:00–14:30', name: 'Almuerzo',                               type: 'break' },
      { time: '14:30–17:00', name: 'Taller: BIM aplicado a infraestructura', type: 'workshop',   detail: 'Herramientas y metodología BIM' },
      { time: '17:00–18:30', name: 'Taller: Diseño Sismorresistente',        type: 'workshop',   detail: 'Normativa y casos reales' },
      { time: '20:00–22:30', name: 'Cena de Bienvenida',                     type: 'social' },
    ],
  },
  {
    day: 'Miércoles', date: '5 ago',
    headerColor: 'bg-estructuras text-white',       borderColor: 'border-estructuras',
    slots: [
      { time: '09:00–09:30', name: 'Acreditación',                           type: 'general' },
      { time: '09:30–12:00', name: 'Charla Magistral: Infraestructura Hídrica', type: 'academic', detail: 'Gestión de recursos hídricos en Argentina' },
      { time: '12:00–13:30', name: 'Panel: Obras emblemáticas de Buenos Aires', type: 'academic', detail: 'Puerto · Subterráneos · Autopistas urbanas' },
      { time: '13:30–15:00', name: 'Almuerzo',                               type: 'break' },
      { time: '15:00–19:00', name: 'Visita Técnica',                         type: 'visit',      detail: 'Recorrido exclusivo por obras emblemáticas de Buenos Aires' },
      { time: '20:30–23:00', name: 'Peña Federal',                           type: 'social' },
    ],
  },
  {
    day: 'Jueves',   date: '6 ago',
    headerColor: 'bg-sostenibilidad text-white',    borderColor: 'border-sostenibilidad',
    slots: [
      { time: '09:00–09:30', name: 'Acreditación',                           type: 'general' },
      { time: '09:30–12:30', name: 'Taller: Nuevos Materiales',              type: 'workshop',   detail: 'Nanotecnología · Hormigones especiales · Geosintéticos' },
      { time: '12:30–14:00', name: 'Almuerzo',                               type: 'break' },
      { time: '14:00–17:00', name: 'Actividad Solidaria',                    type: 'solidarity', detail: 'Intervención constructiva en comunidad local' },
      { time: '17:00–19:00', name: 'Asamblea ANEIC',                         type: 'aneic' },
      { time: '20:30–23:00', name: 'Noche Temática: Folklore Porteño',       type: 'social' },
    ],
  },
  {
    day: 'Viernes',  date: '7 ago',
    headerColor: 'bg-complementary-gold text-white', borderColor: 'border-complementary-gold',
    slots: [
      { time: '09:00–09:30', name: 'Acreditación',                           type: 'general' },
      { time: '09:30–12:00', name: 'Charla de Cierre: Sostenibilidad',       type: 'academic',   detail: 'Construcción sostenible y el futuro de la ingeniería civil' },
      { time: '12:00–13:30', name: 'Almuerzo',                               type: 'break' },
      { time: '14:00–16:00', name: 'Actividad Recreativa y Sorteos',         type: 'social' },
      { time: '16:00–18:00', name: 'Acto de Clausura',                       type: 'general',    detail: 'Entrega de diplomas y cierre oficial del XVIII CONEIC' },
    ],
  },
];

/* ─── Grid component (shared for API and static data) ───────────────── */

const ScheduleGrid = ({ days, isStatic }) => {
  const [expandedDay, setExpandedDay]   = useState(null);
  const [mobileOpen,  setMobileOpen]    = useState({});

  const toggleDesktop = (idx) => setExpandedDay(prev => prev === idx ? null : idx);
  const toggleMobile  = (idx) => setMobileOpen(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div>
      {isStatic && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-complementary-gold/20 border border-complementary-gold/40 text-institutional px-5 py-2 rounded-full font-bold text-sm uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-complementary-gold animate-pulse"></span>
            Cronograma tentativo — Confirmación próximamente
          </div>
        </div>
      )}

      {/* Desktop: 4 columns */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {days.map((day, idx) => (
          <div key={idx} className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-t-4 ${day.borderColor} overflow-hidden flex flex-col`}>
            <button
              onClick={() => toggleDesktop(idx)}
              className={`w-full flex items-center justify-between px-4 py-3 ${day.headerColor} font-title font-bold hover:opacity-90 transition-opacity`}
            >
              <div className="text-left">
                <div className="text-lg leading-tight">{day.day}</div>
                <div className="text-xs font-normal opacity-80">{day.date}</div>
              </div>
              <svg className={`w-4 h-4 transition-transform duration-200 ${expandedDay === idx ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="divide-y divide-gray-100 flex-grow">
              {day.slots.map((slot, sIdx) => {
                const style = TYPE_STYLES[slot.type] || TYPE_STYLES.general;
                return (
                  <div key={sIdx} className={`px-3 py-3 ${style.bg}`}>
                    <div className="flex items-start gap-2">
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`}></span>
                      <div>
                        <div className="text-[11px] text-gray-400 font-mono leading-none mb-0.5">{slot.time}</div>
                        <div className={`text-sm font-bold leading-snug ${style.text}`}>{slot.name}</div>
                        {expandedDay === idx && slot.detail && (
                          <div className="text-xs text-gray-500 mt-1 leading-relaxed">{slot.detail}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: stacked accordion */}
      <div className="md:hidden space-y-3">
        {days.map((day, idx) => {
          const isOpen = !!mobileOpen[idx];
          return (
            <div key={idx} className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 ${day.borderColor} overflow-hidden`}>
              <button
                onClick={() => toggleMobile(idx)}
                className={`w-full flex items-center justify-between px-4 py-4 ${day.headerColor}`}
              >
                <div className="text-left">
                  <div className="text-lg font-bold font-title">{day.day}</div>
                  <div className="text-sm font-normal opacity-80">{day.date}</div>
                </div>
                <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="divide-y divide-gray-100">
                  {day.slots.map((slot, sIdx) => {
                    const style = TYPE_STYLES[slot.type] || TYPE_STYLES.general;
                    return (
                      <div key={sIdx} className={`px-4 py-3 ${style.bg}`}>
                        <div className="flex items-start gap-3">
                          <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${style.dot}`}></span>
                          <div>
                            <div className="text-xs text-gray-400 font-mono">{slot.time}</div>
                            <div className={`font-bold ${style.text}`}>{slot.name}</div>
                            {slot.detail && <div className="text-xs text-gray-500 mt-1">{slot.detail}</div>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {LEGEND.map(item => {
          const style = TYPE_STYLES[item.type];
          return (
            <div key={item.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 ${style.bg} ${style.text}`}>
              <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────────────────── */

const Schedule = () => {
  const [activities, setActivities] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/activities`)
      .then(res => res.json())
      .then(data => { setActivities(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-institutional border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-subtitle">Cargando cronograma...</p>
      </div>
    );
  }

  if (activities.length > 0) {
    return <ScheduleGrid days={buildGridFromApi(activities)} isStatic={false} />;
  }

  return <ScheduleGrid days={STATIC_DAYS} isStatic={true} />;
};

export default Schedule;
