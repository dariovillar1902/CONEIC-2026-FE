const Venues = () => {
  const venues = [
    {
      name: 'Sede Central: Centro de Convenciones',
      address: 'Av. Figueroa Alcorta 2099, C1425 CABA',
      description: 'El lugar principal donde se realizarán las charlas magistrales y acreditaciones. Un espacio icónico de la ciudad con capacidad para miles de\u00a0estudiantes.',
      embedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.654573678553!2d-58.39602492350749!3d-34.58760085664539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb57a70087445%3A0xea842cf50800b3cd!2sCentro%20de%20Convenciones%20de%20Buenos%20Aires%20(CEC)!5e0!3m2!1ses!2sar!4v1705689123456!5m2!1ses!2sar',
      mapsUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+de+Buenos+Aires,+Av.+Figueroa+Alcorta+2099,+CABA',
    },
    {
      name: 'Sede Actividades: UTN Buenos Aires',
      address: 'Medrano 951, C1179 CABA',
      description: 'Sede para talleres prácticos y competencias. La casa de estudios anfitriona, ubicada en el corazón de\u00a0Almagro.',
      embedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.687989512345!2d-58.42263722350638!3d-34.61204095793617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca5e396cd597%3A0x6b4f746400db0df7!2sUniversidad%20Tecnolo%CC%81gica%20Nacional%20%7C%20Facultad%20Regional%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1705689198765!5m2!1ses!2sar',
      mapsUrl: 'https://maps.google.com/?q=UTN+Facultad+Regional+Buenos+Aires,+Medrano+951,+CABA',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {venues.map((venue, idx) => (
        <div key={idx} className="bg-accent p-8 rounded-xl shadow-lg border-2 border-institutional">
          <h3 className="text-2xl font-bold text-institutional mb-4 font-title">{venue.name}</h3>
          <p className="text-gray-600 mb-6 font-body leading-relaxed">
            <strong className="block text-primary-red mb-1">{venue.address}</strong>
            {venue.description}
          </p>
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-100 shadow-inner relative group cursor-pointer"
          >
            <iframe
                src={venue.embedSrc}
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: 'none' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={venue.name}
            ></iframe>
            <div className="absolute inset-0 bg-transparent group-hover:bg-institutional/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-institutional text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Abrir en Google Maps
              </span>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default Venues;
