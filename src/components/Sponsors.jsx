const sponsorsData = {
  gold: [
    {
      name: 'Druetta Hnos. S.A.',
      logoUrl: 'https://www.druetta.com.ar/images/logo.png',
      url: 'https://www.druetta.com.ar',
      cardBg: 'bg-white',
    },
    {
      name: 'AUSA',
      // Logo saved locally — place file at /public/assets/logo-ausa.png
      logoUrl: '/assets/logo-ausa.png',
      fallbackText: 'AUSA',
      url: 'https://www.ausa.com.ar',
      cardBg: 'bg-white',
    },
  ],
  silver: [
    {
      name: 'Maccaferri',
      // White logo on teal background — card uses teal bg
      logoUrl: 'https://www.maccaferri.com/wp-content/themes/maccaferri/src/images/header/logo-maccaferri.png',
      url: 'https://www.maccaferri.com',
      cardBg: 'bg-[#1a6b6b]',
    },
  ],
};

const SponsorCard = ({ sponsor }) => (
  <a
    href={sponsor.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`${sponsor.cardBg} p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-56 h-32 flex items-center justify-center overflow-hidden group`}
  >
    <img
      src={sponsor.logoUrl}
      alt={sponsor.name}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
      className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-110 transition-transform duration-500"
    />
    <span
      style={{ display: 'none' }}
      className="text-lg font-bold text-gray-700 font-title"
    >
      {sponsor.name}
    </span>
  </a>
);

const Sponsors = () => {
  const TierSection = ({ title, sponsors, color }) => (
    <div className="mb-12 text-center">
      <h3 className={`font-bold font-title uppercase tracking-widest mb-6 text-2xl ${color}`}>
        {title}
      </h3>
      <div className="flex flex-wrap justify-center gap-8 items-center">
        {sponsors.map((s, idx) => (
          <SponsorCard key={idx} sponsor={s} />
        ))}
      </div>
    </div>
  );

  return (
    <section className="bg-white py-20 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-institutional mb-4 font-title uppercase tracking-widest">
            Acompañan
          </h2>
          <p className="text-gray-500 font-body max-w-2xl mx-auto">
            Empresas líderes que hacen posible el XVIII&nbsp;CONEIC.
          </p>
        </div>

        <TierSection title="Sponsors Oro" sponsors={sponsorsData.gold} color="text-yellow-600" />
        <TierSection title="Sponsors Plata" sponsors={sponsorsData.silver} color="text-gray-500" />

        {/* CTA for potential sponsors */}
        <div className="text-center mt-8 pt-12 border-t border-gray-100">
          <p className="text-gray-400 font-body text-sm mb-4 uppercase tracking-widest">¿Tu empresa quiere aparecer aquí?</p>
          <a
            href="mailto:patrociniosconeic@gmail.com"
            className="inline-block bg-institutional text-white px-8 py-3 rounded-full font-bold hover:bg-primary-red transition-colors shadow-md uppercase tracking-widest text-sm"
          >
            Solicitar Brochure
          </a>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
