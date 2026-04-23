import { Link } from 'react-router-dom';

const SubcommitteesPage = () => {
  const subcommittees = [
    {
      id: 1,
      title: 'Convenios y Patrocinios',
      description: 'Gestión de alianzas estratégicas con empresas, instituciones y organismos que apoyan el congreso a través de convenios y patrocinios.',
      icon: '🤝',
      color: 'bg-blue-100 text-blue-600',
      whatsapp: 'https://chat.whatsapp.com/Ki0szaMJDFoG1e6IgpFivW'
    },
    {
      id: 2,
      title: 'Web y Multimedia',
      description: 'Desarrollo y mantenimiento de la plataforma web, aplicación móvil y contenidos multimedia del evento.',
      icon: '💻',
      color: 'bg-purple-100 text-purple-600',
      whatsapp: 'https://chat.whatsapp.com/GvDnknoRIcZBnMWzIe2bPp'
    },
    {
      id: 3,
      title: 'Género y Disidencias',
      description: 'Promoción de la equidad de género y la diversidad dentro del ámbito de la ingeniería civil y el congreso.',
      icon: '🏳️‍🌈',
      color: 'bg-pink-100 text-pink-600',
      whatsapp: 'https://chat.whatsapp.com/EJvn7xNDL8KBXGosLjEupx'
    },
    {
      id: 4,
      title: 'Finanzas',
      description: 'Administración de los recursos económicos, presupuesto y gestión financiera de ANEIC Argentina.',
      icon: '💰',
      color: 'bg-green-100 text-green-600',
      whatsapp: 'https://chat.whatsapp.com/BGwiTkpdevbG3h8B3tnnOm'
    },
    {
      id: 5,
      title: 'Reglamentos',
      description: 'Elaboración, actualización y control del cumplimiento de los reglamentos internos de la asociación.',
      icon: '📜',
      color: 'bg-yellow-100 text-yellow-600',
      whatsapp: 'https://chat.whatsapp.com/E50toKQOL274cgvQfqhUPG'
    },
    {
      id: 6,
      title: 'Incumbencias',
      description: 'Defensa y difusión de las incumbencias profesionales del ingeniero civil ante organismos y la sociedad.',
      icon: '⚖️',
      color: 'bg-orange-100 text-orange-600',
      whatsapp: 'https://chat.whatsapp.com/GeVhWnpWvzZCcud4BPuK5c'
    },
    {
      id: 7,
      title: 'Académicas',
      description: 'Organización de charlas, talleres, visitas técnicas y actividades de formación académica y profesional.',
      icon: '📚',
      color: 'bg-indigo-100 text-indigo-600',
      whatsapp: 'https://chat.whatsapp.com/BiiQHFEiWeS81ZPkvgB3pz'
    },
    {
      id: 8,
      title: 'Compromiso Social y Medioambiente',
      description: 'Acciones orientadas a la responsabilidad social y la sostenibilidad ambiental dentro y fuera del congreso.',
      icon: '🌱',
      color: 'bg-teal-100 text-teal-600',
      whatsapp: 'https://chat.whatsapp.com/LYQihBvUv3h4cWOLkUHPcS'
    }
  ];

  return (
    <div className="min-h-screen bg-complementary-light font-body pt-24">

      {/* Hero */}
      <div className="bg-institutional text-white py-16 px-4 text-center">
        <span className="inline-block text-complementary-gold font-bold tracking-widest uppercase text-sm mb-3">
          Espacio ANEIC
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white font-title mb-4">
          Subcomisiones de ANEIC&nbsp;Argentina
        </h1>
        <p className="text-gray-300 font-subtitle text-lg max-w-2xl mx-auto">
          Conocé los grupos de trabajo que dan vida a la asociación y al congreso.
          ¡Sumate y participá&nbsp;activamente!
        </p>
      </div>

      {/* ANEIC context strip */}
      <div className="bg-accent border-b border-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-institutional/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-institutional" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-institutional text-sm">¿Qué es ANEIC?</p>
              <p className="text-gray-600 text-sm mt-0.5 max-w-xl">
                La <strong>Asociación Nacional de Estudiantes de Ingeniería Civil</strong> es el organismo que agrupa a los estudiantes de la carrera en toda Argentina.
                Sus subcomisiones son grupos de trabajo voluntario que impulsan las distintas áreas de la&nbsp;asociación.
              </p>
            </div>
          </div>
          <Link
            to="/about#aneic"
            className="flex-shrink-0 text-sm font-bold text-institutional border-2 border-institutional px-5 py-2.5 rounded-full hover:bg-institutional hover:text-white transition-colors uppercase tracking-widest"
          >
            Saber más
          </Link>
        </div>
      </div>

      {/* Cards */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subcommittees.map((sub) => (
            <div
              key={sub.id}
              className="bg-accent rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group border border-gray-200"
            >
              <div className="p-6">
                <div className={`w-14 h-14 rounded-xl ${sub.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {sub.icon}
                </div>
                <h3 className="text-lg font-bold text-institutional font-title mb-3">
                  {sub.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  {sub.description}
                </p>
                <a
                  href={sub.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 font-bold text-sm hover:text-green-700 transition-colors group/btn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Unirse al grupo
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-institutional rounded-3xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold font-title mb-3">¿Querés involucrarte más?</h3>
          <p className="text-gray-300 max-w-xl mx-auto mb-6 font-subtitle">
            Encontrá toda la información sobre ANEIC, su historia y misión en nuestra página&nbsp;institucional.
          </p>
          <Link
            to="/about"
            className="inline-block bg-complementary-gold text-white font-bold px-8 py-3 rounded-full hover:bg-yellow-600 transition-colors shadow-md uppercase tracking-widest text-sm"
          >
            Sobre el Congreso y ANEIC
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SubcommitteesPage;
