import { Link } from 'react-router-dom';
import Sponsors from '../components/Sponsors';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-institutional text-white min-h-[85vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-institutional/80 via-institutional/60 to-institutional/90 mix-blend-multiply z-10"></div>
             <img 
                src="https://images.unsplash.com/photo-1589901863506-8dca08f7aa95?q=80&w=2000&auto=format&fit=crop" 
                alt="Buenos Aires Obelisco" 
                className="w-full h-full object-cover opacity-60 grayscale-[50%]"
             />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-20">
          <div className="mb-8 flex justify-center animate-fade-in">
             <img src="/assets/LOGO_V-CONEIC-FULL-BLANCO.png" alt="CONEIC Logo" className="h-64 md:h-80 object-contain drop-shadow-2xl" />
          </div>
          {/* Text is redundant with FULL logo, but keeping date/location */}
          <div className="space-y-2 mb-12 animate-fade-in-up">
              <p className="text-2xl md:text-3xl font-bold font-title tracking-widest text-complementary-gold uppercase">
                Buenos Aires 2026
              </p>
          </div>
          
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-body font-light text-gray-300 leading-relaxed">
            El encuentro más importante de estudiantes de ingeniería civil de Argentina.
            <br className="hidden md:block" />
            Innovación, técnica y cultura en el corazón del país.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
            <Link to="/registration" className="bg-primary-red hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-red-900/50 hover:shadow-xl uppercase tracking-widest text-sm border-2 border-primary-red">
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
          <div className="bg-white p-6 rounded-xl shadow-2xl border-b-4 border-primary-blue transform hover:-translate-y-2 transition duration-300 group cursor-default overflow-hidden">
              <div className="h-40 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-blue-50">
                  <img src="/assets/Miscelaneos-Estructuras.png" alt="Estructuras" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold font-title text-primary-blue mb-2">Estructuras</h3>
              <p className="text-gray-600 font-body text-sm leading-relaxed">
                  Últimas tendencias en cálculo, rascacielos y megaconstrucciones.
              </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-2xl border-b-4 border-primary-red transform hover:-translate-y-2 transition duration-300 group cursor-default overflow-hidden">
              <div className="h-40 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-red-50">
                   <img src="/assets/Miscelaneos-Vial.png" alt="Vial" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold font-title text-primary-red mb-2">Vial</h3>
              <p className="text-gray-600 font-body text-sm leading-relaxed">
                  Infraestructura inteligente, conectividad y planificación urbana moderna.
              </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-2xl border-b-4 border-primary-green transform hover:-translate-y-2 transition duration-300 group cursor-default overflow-hidden">
              <div className="h-40 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-green-50">
                   <img src="/assets/Miscelaneos-Sostenibilidad.png" alt="Sostenibilidad" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold font-title text-primary-green mb-2">Sostenibilidad</h3>
              <p className="text-gray-600 font-body text-sm leading-relaxed">
                  Energías renovables y el impacto ambiental de la ingeniería del mañana.
              </p>
          </div>
        </div>
      </section>

      <Sponsors />
    </>
  );
};

export default HomePage;
