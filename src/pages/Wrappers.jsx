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
export const SchedulePage = () => (
  <ComingSoon
    title="Cronograma"
    subtitle="Horarios, ubicaciones y actividades del XVIII&nbsp;CONEIC."
    icon="📅"
  />
);

/* ─── Sedes ─────────────────────────────────────────────────────────── */
import Venues from '../components/Venues';

export const VenuesPage = () => (
  <div className="pt-24 min-h-screen bg-complementary-light">
    <div className="bg-institutional text-white py-12 px-4 mb-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold font-title mb-2">Sedes</h1>
      <p className="text-gray-300 font-subtitle max-w-2xl mx-auto">
        Los espacios donde se desarrolla el XVIII&nbsp;CONEIC Buenos&nbsp;Aires&nbsp;2026.
      </p>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <Venues />
    </div>
  </div>
);

/* ─── Actividades ───────────────────────────────────────────────────── */
import ActivitiesAdvanced from '../components/ActivitiesAdvanced';
export const ActivitiesPage = () => (
  <div className="pt-24 min-h-screen bg-complementary-light">
    <ActivitiesAdvanced />
  </div>
);

/* ─── Inscripciones ─────────────────────────────────────────────────── */
export const RegistrationPage = () => (
  <ComingSoon
    title="Inscripciones"
    subtitle="Registrate para participar del XVIII&nbsp;CONEIC Buenos&nbsp;Aires&nbsp;2026."
    icon="📋"
  />
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
