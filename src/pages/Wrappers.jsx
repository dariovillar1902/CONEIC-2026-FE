import { Link } from 'react-router-dom';

/* ─── Reutilizable: página en construcción ──────────────────────────── */
const ComingSoon = ({ title, subtitle, icon = '🔧' }) => (
  <div className="pt-24 min-h-screen bg-complementary-light font-body flex flex-col">
    {/* Header institucional */}
    <div className="bg-institutional text-white py-12 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold font-title mb-2">{title}</h1>
      {subtitle && (
        <p className="text-gray-300 font-subtitle max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>

    {/* Cuerpo */}
    <div className="flex-grow flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg text-4xl">
          {icon}
        </div>
        <div className="inline-flex items-center gap-2 bg-complementary-gold/20 border border-complementary-gold/40 text-institutional px-5 py-2 rounded-full font-bold text-sm uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-complementary-gold animate-pulse"></span>
          Próximamente
        </div>
        <p className="text-gray-500 text-lg leading-relaxed mt-4 mb-8">
          Esta sección está en preparación. ¡Volvé pronto para ver las novedades del XVIII&nbsp;CONEIC!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-institutional text-white font-bold px-8 py-3 rounded-full hover:bg-primary-red transition-colors shadow-md uppercase tracking-widest text-sm"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  </div>
);

/* ─── Cronograma y Sedes ─────────────────────────────────────────────── */
import VisualSchedule from '../components/VisualSchedule';

const VENUES = [
  {
    name: 'Auditorio Belgrano',
    address: 'Virrey Loreto 2348, C1426 Cdad. Autónoma de Buenos Aires',
    icon: '🎤',
    color: 'border-vial',
    badge: 'bg-vial/10 text-vial',
    activities: ['Acreditaciones', 'Apertura y Cierre', 'Charlas Magistrales', 'Ponencias Estudiantiles'],
    days: 'Martes y Viernes',
    mapsUrl: 'https://maps.google.com/?q=Virrey+Loreto+2348,+C1426,+Buenos+Aires,+Argentina',
  },
];

export const SchedulePage = () => (
  <div className="pt-24 min-h-screen bg-complementary-light font-body">
    <div className="bg-institutional text-white py-12 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold font-title mb-2">Cronograma y Sedes</h1>
      <p className="text-gray-300 font-subtitle max-w-2xl mx-auto">
        Actividades y lugares del XVIII&nbsp;CONEIC · Buenos Aires · 13 al 16 de octubre&nbsp;2026.
      </p>
    </div>

    {/* ── Schedule section ── */}
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 bg-complementary-gold/20 border border-complementary-gold/40 text-institutional px-5 py-2 rounded-full font-bold text-sm uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-complementary-gold animate-pulse"></span>
          Cronograma tentativo — sujeto a cambios
        </div>
      </div>

      <VisualSchedule />

      {/* Ponencias note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">📝</span>
        <p className="text-sm text-blue-800">
          <strong>Ponencias Estudiantiles</strong> — La convocatoria para presentar trabajos está próxima a abrirse. ¡Pronto podrás postular tu investigación!
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
          <span className="text-lg">🎤</span>
          <span><strong>Charlas Magistrales</strong> — Disertantes nacionales e internacionales</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
          <span className="text-lg">🏗️</span>
          <span><strong>Visitas Técnicas</strong> — Obras emblemáticas de Buenos Aires</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
          <span className="text-lg">🛠️</span>
          <span><strong>Talleres</strong> — Formación práctica en software y metodologías</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
          <span className="text-lg">🤝</span>
          <span><strong>Actividad Solidaria</strong> — Intervención comunitaria</span>
        </div>
      </div>
    </div>

    {/* ── Divider ── */}
    <div className="h-1 bg-gradient-to-r from-institutional via-complementary-gold to-institutional" />

    {/* ── Venues section ── */}
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-complementary-gold font-bold tracking-widest uppercase text-sm">Ubicaciones</span>
        <h2 className="text-3xl font-bold text-institutional font-title mt-2">Sedes del Congreso</h2>
        <p className="text-gray-500 font-subtitle mt-2 max-w-xl mx-auto">
          El XVIII CONEIC se desarrolla en tres espacios complementarios dentro de la Ciudad Autónoma de Buenos Aires.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {VENUES.map(v => (
          <div key={v.name} className={`bg-white rounded-2xl shadow-sm border-t-4 ${v.color} overflow-hidden hover:shadow-lg transition-shadow`}>
            <div className="p-6">
              <div className="text-4xl mb-4">{v.icon}</div>
              <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${v.badge}`}>{v.days}</span>
              <h3 className="text-lg font-bold text-institutional font-title mb-1">{v.name}</h3>
              <p className="text-gray-500 text-xs mb-4">{v.address}</p>
              <ul className="space-y-1 mb-5">
                {v.activities.map(a => (
                  <li key={a} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-complementary-gold flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
              <a href={v.mapsUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-institutional hover:text-primary-red transition-colors uppercase tracking-widest">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ver en mapa
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Sedes ─────────────────────────────────────────────────────────── */
export const VenuesPage = () => (
  <ComingSoon
    title="Sedes"
    subtitle="Los espacios donde se desarrolla el XVIII&nbsp;CONEIC Buenos&nbsp;Aires&nbsp;2026."
    icon="📍"
  />
);

/* ─── Actividades ───────────────────────────────────────────────────── */
export const ActivitiesPage = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <p className="text-gray-500 text-lg text-center max-w-md font-body">
      Próximamente podrás acceder a tus actividades y eventos relacionados al CONEIC con tu usuario.
    </p>
  </div>
);

/* ─── Inscripciones ─────────────────────────────────────────────────── */
import Registration from '../components/Registration';

export const RegistrationPage = () => (
  <div className="pt-24 min-h-screen bg-complementary-light">
    <Registration />
  </div>
);

export const RegistrationPage2 = () => (
  <div className="pt-24 min-h-screen bg-complementary-light">
    <Registration forceOpen />
  </div>
);

