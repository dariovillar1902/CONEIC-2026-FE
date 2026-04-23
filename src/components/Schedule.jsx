import { useState, useEffect } from 'react';

/* ─── Static fallback data ─────────────────────────────────────────── */

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

const STATIC_DAYS = [
  {
    day: 'Martes',
    date: '4 ago',
    headerColor: 'bg-vial text-white',
    borderColor: 'border-vial',
    slots: [
      { time: '09:00–10:00', name: 'Acreditación y Bienvenida', type: 'general' },
      { time: '10:00–13:00', name: 'Charla Magistral Inaugural', type: 'academic', detail: 'Conferencia de apertura con disertante de nivel nacional' },
      { time: '13:00–14:30', name: 'Almuerzo', type: 'break' },
      { time: '14:30–18:00', name: 'Talleres Temáticos', type: 'workshop', detail: 'Estructuras · Vial · Sostenibilidad' },
      { time: '20:00–22:00', name: 'Cena de Bienvenida', type: 'social' },
    ],
  },
  {
    day: 'Miércoles',
    date: '5 ago',
    headerColor: 'bg-estructuras text-white',
    borderColor: 'border-estructuras',
    slots: [
      { time: '09:00–09:30', name: 'Acreditación', type: 'general' },
      { time: '09:30–12:30', name: 'Charlas Magistrales', type: 'academic', detail: 'Paneles de expertos en infraestructura y construcción' },
      { time: '12:30–14:00', name: 'Almuerzo', type: 'break' },
      { time: '14:00–18:00', name: 'Visita Técnica', type: 'visit', detail: 'Recorrido exclusivo por obras emblemáticas de Buenos Aires' },
      { time: '20:00–23:00', name: 'Peña Federal', type: 'social' },
    ],
  },
  {
    day: 'Jueves',
    date: '6 ago',
    headerColor: 'bg-sostenibilidad text-white',
    borderColor: 'border-sostenibilidad',
    slots: [
      { time: '09:00–09:30', name: 'Acreditación', type: 'general' },
      { time: '09:30–12:30', name: 'Talleres Prácticos', type: 'workshop', detail: 'BIM · Nuevos materiales · Metodologías ágiles' },
      { time: '12:30–14:00', name: 'Almuerzo', type: 'break' },
      { time: '14:00–17:00', name: 'Actividad Solidaria', type: 'solidarity', detail: 'Intervención constructiva en comunidad local' },
      { time: '17:00–19:00', name: 'Asamblea ANEIC', type: 'aneic' },
      { time: '20:00–23:00', name: 'Noche Temática', type: 'social' },
    ],
  },
  {
    day: 'Viernes',
    date: '7 ago',
    headerColor: 'bg-complementary-gold text-white',
    borderColor: 'border-complementary-gold',
    slots: [
      { time: '09:00–09:30', name: 'Acreditación', type: 'general' },
      { time: '09:30–12:00', name: 'Charla de Cierre', type: 'academic', detail: 'Reflexiones y perspectivas de la ingeniería del futuro' },
      { time: '12:00–13:30', name: 'Almuerzo', type: 'break' },
      { time: '14:00–16:00', name: 'Actividad Recreativa y Sorteos', type: 'social' },
      { time: '16:00–18:00', name: 'Acto de Clausura', type: 'general', detail: 'Entrega de diplomas y cierre oficial del XVIII CONEIC' },
    ],
  },
];

const LEGEND = [
  { label: 'Académico',      type: 'academic' },
  { label: 'Taller',         type: 'workshop' },
  { label: 'Visita Técnica', type: 'visit' },
  { label: 'Social',         type: 'social' },
  { label: 'Solidario',      type: 'solidarity' },
  { label: 'ANEIC',          type: 'aneic' },
];

/* ─── Static Grid Component ────────────────────────────────────────── */

const StaticScheduleGrid = () => {
  // expandedDay = index of day whose detail rows are visible (desktop)
  // On mobile each card is independently expanded
  const [expandedDay, setExpandedDay] = useState(null);
  const [mobileOpen, setMobileOpen] = useState({});

  const toggleDesktopDay = (idx) =>
    setExpandedDay((prev) => (prev === idx ? null : idx));

  const toggleMobileDay = (idx) =>
    setMobileOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div>
      {/* Tentative notice */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-complementary-gold/20 border border-complementary-gold/40 text-institutional px-5 py-2 rounded-full font-bold text-sm uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-complementary-gold animate-pulse"></span>
          Cronograma tentativo — Confirmación próximamente
        </div>
      </div>

      {/* ── Desktop: 4 columns side by side ── */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {STATIC_DAYS.map((day, idx) => (
          <div
            key={day.day}
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-t-4 ${day.borderColor} overflow-hidden flex flex-col`}
          >
            {/* Day header — click to show/hide detail text */}
            <button
              onClick={() => toggleDesktopDay(idx)}
              className={`w-full flex items-center justify-between px-4 py-3 ${day.headerColor} font-title font-bold hover:opacity-90 transition-opacity`}
            >
              <div className="text-left">
                <div className="text-lg leading-tight">{day.day}</div>
                <div className="text-xs font-normal opacity-80">{day.date}</div>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${expandedDay === idx ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Slots */}
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

      {/* ── Mobile: stacked accordion ── */}
      <div className="md:hidden space-y-3">
        {STATIC_DAYS.map((day, idx) => {
          const isOpen = !!mobileOpen[idx];
          return (
            <div
              key={day.day}
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 ${day.borderColor} overflow-hidden`}
            >
              <button
                onClick={() => toggleMobileDay(idx)}
                className={`w-full flex items-center justify-between px-4 py-4 ${day.headerColor}`}
              >
                <div className="text-left">
                  <div className="text-lg font-bold font-title">{day.day}</div>
                  <div className="text-sm font-normal opacity-80">{day.date}</div>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
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
                            {slot.detail && (
                              <div className="text-xs text-gray-500 mt-1">{slot.detail}</div>
                            )}
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
        {LEGEND.map((item) => {
          const style = TYPE_STYLES[item.type];
          return (
            <div
              key={item.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 ${style.bg} ${style.text}`}
            >
              <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Main Schedule Component ──────────────────────────────────────── */

const Schedule = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/activities`)
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-institutional border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-subtitle">Cargando cronograma...</p>
      </div>
    );
  }

  /* Show static grid when API has no data yet */
  if (error || activities.length === 0) {
    return <StaticScheduleGrid />;
  }

  /* ── Live data from API ── */
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.startTime).toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  const sortedDays = Object.keys(groupedActivities).sort((a, b) => {
    const actA = groupedActivities[a][0];
    const actB = groupedActivities[b][0];
    return new Date(actA.startTime) - new Date(actB.startTime);
  });

  return (
    <div className="max-w-5xl mx-auto">
      {sortedDays.map(day => (
        <div key={day} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-institutional font-title capitalize bg-accent px-4 py-2 rounded-lg shadow-sm border border-gray-200 inline-block">
              {day}
            </h2>
            <div className="h-0.5 flex-grow bg-gray-200"></div>
          </div>

          <div className="space-y-4">
            {groupedActivities[day]
              .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
              .map((activity) => (
                <div key={activity.id} className="relative pl-8 md:pl-0">
                  <div className="hidden md:block absolute left-[148px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="hidden md:block absolute left-[142px] top-6 w-3.5 h-3.5 bg-institutional rounded-full border-2 border-white shadow"></div>

                  <div className="flex flex-col md:flex-row md:gap-12 group">
                    <div className="md:w-32 md:text-right flex-shrink-0 pt-4">
                      <span className="block text-2xl font-bold text-institutional font-title">
                        {new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-sm text-gray-400 font-subtitle">
                        a {new Date(activity.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex-grow bg-accent border-l-4 border-complementary-gold md:border-l-0 md:border md:border-gray-200 shadow-md hover:shadow-xl transition-all p-6 rounded-r-xl md:rounded-xl relative">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mb-3 text-sm font-bold text-primary-red uppercase tracking-wider bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full w-fit transition-colors"
                      >
                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {activity.location}
                      </a>

                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-institutional font-title group-hover:text-primary-blue transition-colors">
                            {activity.title}
                          </h3>
                          <p className="text-gray-600 mt-2 font-body leading-relaxed text-sm">
                            {activity.description}
                          </p>
                        </div>

                        {activity.speaker && (
                          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 flex-shrink-0">
                            <img src={activity.speaker.imageUrl} alt={activity.speaker.name} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                            <div>
                              <p className="text-xs font-bold text-gray-900 leading-tight">{activity.speaker.name}</p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide">{activity.speaker.title}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Schedule;
