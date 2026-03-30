import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SubcommitteesPage = () => {
  const subcommittees = [
    {
      id: 1,
      title: 'Académica',
      description: 'Encargada de la organización de charlas, talleres y visitas técnicas. Buscamos promover el intercambio de conocimientos y la excelencia académica.',
      icon: '📚',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      title: 'Sociales',
      description: 'Responsable de las actividades recreativas y de integración. Fiestas, juegos y eventos para conocer estudiantes de todo el país.',
      icon: '🎉',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 3,
      title: 'Deportes',
      description: 'Organización de torneos y actividades deportivas para fomentar el trabajo en equipo y la vida saludable.',
      icon: '⚽',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 4,
      title: 'Logística',
      description: 'Coordinación de transporte, alojamientos y movimientos internos. El motor que hace que todo funcione.',
      icon: '🚌',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 5,
      title: 'Prensa y Difusión',
      description: 'Comunicación oficial del evento, redes sociales y contacto con los medios. ¡La voz del CONEIC!',
      icon: '📢',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 6,
      title: 'Sostenibilidad',
      description: 'Garantizar que el evento sea amigable con el medio ambiente, gestionando residuos y promoviendo prácticas ecológicas.',
      icon: '🌱',
      color: 'bg-teal-100 text-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-body flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-institutional font-title">
            Espacio de Subcomisiones
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conocé las áreas que hacen posible el XVIII CONEIC Buenos Aires 2026.
            ¡Sumate y sé parte del equipo!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subcommittees.map((sub) => (
            <div key={sub.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 group border border-gray-100">
              <div className="p-8">
                <div className={`w-16 h-16 rounded-2xl ${sub.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {sub.icon}
                </div>
                <h3 className="text-2xl font-bold text-institutional font-title mb-4">
                  {sub.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {sub.description}
                </p>
                <button className="text-primary-blue font-bold hover:text-blue-700 flex items-center gap-2 group/btn">
                  Saber más
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-institutional rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold font-title">¿Te gustaría colaborar?</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Estamos buscando estudiantes proactivos para formar parte del comité organizador local.
            </p>
            <button className="bg-complementary-gold text-institutional px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg transform hover:scale-105 active:scale-95">
              ¡Postulate Ahora!
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubcommitteesPage;
