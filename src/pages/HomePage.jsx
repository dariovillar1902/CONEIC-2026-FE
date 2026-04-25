import { Link } from 'react-router-dom';
import Sponsors from '../components/Sponsors';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-institutional text-white min-h-[85vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-institutional/60 via-institutional/40 to-institutional/80 z-10"></div>
             <img
                src="/assets/hero-buenos-aires.png"
                alt="Buenos Aires"
                className="w-full h-full object-cover object-center"
             />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-20">
          <div className="mb-8 flex justify-center animate-fade-in">
             <img src="/assets/LOGO_V-CONEIC-COLOR-BLANCO.png" alt="CONEIC Logo" className="h-64 md:h-80 object-contain drop-shadow-2xl" />
          </div>
          <div className="space-y-2 mb-12 animate-fade-in-up">
              <p className="text-2xl md:text-3xl font-bold font-title tracking-widest text-complementary-gold uppercase">
                Buenos Aires 2026
              </p>
          </div>

          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-body font-light text-gray-300 leading-relaxed">
            El encuentro <span className="font-bold">nacional</span> más importante de&nbsp;estudiantes
            de&nbsp;Ingeniería Civil de&nbsp;Argentina.
          </p>
          <p className="text-base md:text-lg mb-12 max-w-2xl mx-auto font-body font-light text-gray-400 leading-relaxed -mt-8">
            Innovación, técnica y cultura en el corazón del&nbsp;país.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
            <Link to="/registration" className="bg-primary-red hover:bg-red-900 text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-red-900/40 hover:shadow-xl uppercase tracking-widest text-sm border-2 border-primary-red">
              Inscribirse
            </Link>
            <Link to="/schedule" className="bg-transparent hover:bg-white/10 text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1 backdrop-blur-sm border-2 border-white uppercase tracking-widest text-sm">
              Cronograma
            </Link>
          </div>
        </div>
      </section>

      {/* Thematic Axes */}
      <section className="relative z-30 -mt-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Estructuras */}
          <div className="bg-accent p-6 rounded-xl shadow-2xl border-b-4 border-estructuras transform hover:-translate-y-2 transition duration-300 group cursor-default overflow-hidden">
              <div className="h-52 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-estructuras/10 relative">
                  <div className="absolute inset-0 bg-estructuras/15"></div>
                  <img src="/assets/Miscelaneos-Estructuras.png" alt="Estructuras" className="w-[300%] h-[300%] object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold font-title text-estructuras mb-2">Estructuras</h3>
              <p className="text-gray-600 font-body text-sm leading-relaxed">
                  Últimas tendencias en cálculo, rascacielos y&nbsp;megaconstrucciones.
              </p>
          </div>

          {/* Vial */}
          <div className="bg-accent p-6 rounded-xl shadow-2xl border-b-4 border-vial transform hover:-translate-y-2 transition duration-300 group cursor-default overflow-hidden">
              <div className="h-52 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-vial/10 relative">
                  <div className="absolute inset-0 bg-vial/15"></div>
                  <img src="/assets/Miscelaneos-Vial.png" alt="Vial" className="w-[300%] h-[300%] object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold font-title text-vial mb-2">Vial</h3>
              <p className="text-gray-600 font-body text-sm leading-relaxed">
                  Infraestructura inteligente, conectividad y planificación urbana&nbsp;moderna.
              </p>
          </div>

          {/* Sostenibilidad */}
          <div className="bg-accent p-6 rounded-xl shadow-2xl border-b-4 border-sostenibilidad transform hover:-translate-y-2 transition duration-300 group cursor-default overflow-hidden">
              <div className="h-52 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-sostenibilidad/10 relative">
                  <div className="absolute inset-0 bg-sostenibilidad/15"></div>
                  <img src="/assets/Miscelaneos-Sostenibilidad.png" alt="Sostenibilidad" className="w-[200%] h-[200%] object-cover object-center rotate-90 opacity-90 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold font-title text-sostenibilidad mb-2">Sostenibilidad</h3>
              <p className="text-gray-600 font-body text-sm leading-relaxed">
                  Energías renovables y el impacto ambiental de la ingeniería del&nbsp;mañana.
              </p>
          </div>
        </div>
      </section>

      <Sponsors />
    </>
  );
};

export default HomePage;
