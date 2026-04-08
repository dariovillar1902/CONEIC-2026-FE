import Schedule from '../components/Schedule';

export const SchedulePage = () => (
  <div className="pt-24 min-h-screen bg-complementary-light">
    <div className="bg-institutional text-white py-12 px-4 mb-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold font-title mb-2">Cronograma</h1>
      <p className="text-gray-300 font-subtitle max-w-2xl mx-auto">
        Horarios, ubicaciones y actividades del XVIII&nbsp;CONEIC.
      </p>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <Schedule />
    </div>
  </div>
);

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

import ActivitiesAdvanced from '../components/ActivitiesAdvanced';
export const ActivitiesPage = () => <div className="pt-24 min-h-screen bg-complementary-light"><ActivitiesAdvanced /></div>;

import Registration from '../components/Registration';
export const RegistrationPage = () => <div className="pt-24 min-h-screen bg-complementary-light"><Registration /></div>;

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
      <a href="mailto:patrociniosconeic@gmail.com" className="inline-block bg-complementary-light text-institutional font-bold px-8 py-4 rounded-full hover:bg-complementary-gold hover:text-white transition transform hover:-translate-y-1 shadow-lg uppercase tracking-widest text-sm">
        Solicitar Brochure
      </a>
    </div>
  </div>
);
