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

/* ─── Cronograma ────────────────────────────────────────────────────── */
import VisualSchedule from '../components/VisualSchedule';

export const SchedulePage = () => (
  <div className="pt-24 min-h-screen bg-complementary-light font-body">
    <div className="bg-institutional text-white py-12 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold font-title mb-2">Cronograma</h1>
      <p className="text-gray-300 font-subtitle max-w-2xl mx-auto">
        Actividades del XVIII&nbsp;CONEIC · Buenos Aires · 4 al 7 de agosto&nbsp;2026.
      </p>
    </div>

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Tentative badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 bg-complementary-gold/20 border border-complementary-gold/40 text-institutional px-5 py-2 rounded-full font-bold text-sm uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-complementary-gold animate-pulse"></span>
          Cronograma tentativo — sujeto a cambios
        </div>
      </div>

      <VisualSchedule />

      {/* Legend */}
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
import ActivitiesAdvanced from '../components/ActivitiesAdvanced';
export const ActivitiesPage = () => (
  <div className="pt-24 min-h-screen bg-complementary-light">
    <ActivitiesAdvanced />
  </div>
);

/* ─── Inscripciones ─────────────────────────────────────────────────── */
import Registration from '../components/Registration';

export const RegistrationPage = () => (
  <div className="pt-24 min-h-screen bg-complementary-light">
    <Registration />
  </div>
);

/* ─── Sponsors ──────────────────────────────────────────────────────── */
import Sponsors from '../components/Sponsors';

export const SponsorsPage = () => (
  <div className="pt-24 min-h-screen bg-complementary-light">
    <div className="bg-institutional text-white py-12 px-4 mb-0 text-center">
      <h1 className="text-4xl md:text-5xl font-bold font-title mb-2">Nuestros Sponsors</h1>
      <p className="text-gray-300 font-subtitle max-w-2xl mx-auto">
        Empresas líderes que hacen posible el XVIII&nbsp;CONEIC Buenos&nbsp;Aires&nbsp;2026.
      </p>
    </div>
    <Sponsors />
    <div className="bg-institutional text-white py-16 px-4 text-center">
      <h3 className="text-3xl font-bold font-title mb-4">¿Su empresa busca talento&nbsp;joven?</h3>
      <p className="text-gray-300 mb-8 font-subtitle text-lg max-w-2xl mx-auto">
        Participe como sponsor y posicione su marca frente a los 1.200 mejores promedios y líderes estudiantiles de ingeniería civil del&nbsp;país.
      </p>
      <a
        href="mailto:patrociniosconeic@gmail.com"
        className="inline-block bg-complementary-light text-institutional font-bold px-8 py-4 rounded-full hover:bg-complementary-gold hover:text-white transition transform hover:-translate-y-1 shadow-lg uppercase tracking-widest text-sm"
      >
        Solicitar Brochure
      </a>
    </div>
  </div>
);
