const PREV_EDITIONS = [
  {
    edition: 'XVII CONEIC — Mendoza 2024',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    alt: 'Congreso estudiantil Mendoza 2024',
  },
  {
    edition: 'XVI CONEIC — Córdoba 2023',
    src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?q=80&w=800&auto=format&fit=crop',
    alt: 'Congreso estudiantil Córdoba 2023',
  },
  {
    edition: 'XV CONEIC — Rosario 2022',
    src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
    alt: 'Congreso estudiantil Rosario 2022',
  },
  {
    edition: 'XIV CONEIC — Tucumán 2019',
    src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
    alt: 'Congreso estudiantil Tucumán 2019',
  },
  {
    edition: 'XIII CONEIC — La Plata 2018',
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    alt: 'Congreso estudiantil La Plata 2018',
  },
  {
    edition: 'XII CONEIC — Neuquén 2017',
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
    alt: 'Congreso estudiantil Neuquén 2017',
  },
];

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-complementary-light pt-20 font-body">

      {/* Current edition — coming soon */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg className="w-12 h-12 text-complementary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-title text-institutional mb-4 text-center">
          Galería
        </h1>
        <div className="inline-flex items-center gap-2 bg-complementary-gold/20 border border-complementary-gold/40 text-institutional px-5 py-2 rounded-full font-bold text-sm uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-complementary-gold animate-pulse"></span>
          XVIII CONEIC — Próximamente
        </div>
        <p className="text-gray-500 font-body text-lg max-w-md mx-auto text-center">
          Acá compartiremos los mejores momentos del XVIII&nbsp;CONEIC. ¡Volvé pronto!
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mx-4 md:mx-auto md:max-w-7xl"></div>

      {/* Previous editions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-complementary-gold font-bold tracking-widest uppercase text-sm">Historia del congreso</span>
          <h2 className="text-3xl md:text-4xl font-bold font-title text-institutional mt-2">
            Ediciones Anteriores
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Más de 18 años reuniendo a los mejores estudiantes de ingeniería civil de&nbsp;Argentina.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREV_EDITIONS.map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-institutional/80 via-institutional/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white font-bold font-title text-sm">{item.edition}</p>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm font-bold text-institutional font-title">{item.edition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default GalleryPage;
