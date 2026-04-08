const sponsorsData = {
  diamond: [
    {
      name: 'Techint',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Techint_logo.svg/400px-Techint_logo.svg.png',
      url: 'https://www.techint.com',
    },
    {
      name: 'Holcim',
      logoUrl: 'https://www.holcim.com.ar/themes/custom/corporate/components/header/images/holcim_logo_color.svg',
      url: 'https://www.holcim.com.ar',
    },
  ],
  gold: [
    {
      name: 'YPF',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Logo_de_YPF.svg/400px-Logo_de_YPF.svg.png',
      url: 'https://www.ypf.com',
    },
    {
      name: 'CPIC',
      logoUrl: null, // Pending — site down
      url: 'https://cpic.org.ar',
    },
  ],
  silver: [
    {
      name: 'Camarco',
      logoUrl: null, // Pending — site certificate issue
      url: 'https://www.camarco.org.ar',
    },
    {
      name: 'Panedile',
      logoUrl: null, // Pending — site down
      url: 'https://www.panedile.com.ar',
    },
  ],
  bronze: [
    { name: 'Empresa A', logoUrl: null, url: '#' },
    { name: 'Empresa B', logoUrl: null, url: '#' },
  ],
};

const Sponsors = () => {
    const TierSection = ({ title, sponsors, color, size }) => (
        <div className="mb-12 text-center">
            <h3 className={`font-bold font-title uppercase tracking-widest mb-6 ${color} ${size}`}>
                {title}
            </h3>
            <div className="flex flex-wrap justify-center gap-8 items-center">
                {sponsors.map((s, idx) => (
                    <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-56 h-32 flex items-center justify-center overflow-hidden group"
                    >
                         <img
                            src={s.logoUrl || `https://placehold.co/400x200/ffffff/333333?text=${s.name}`}
                            alt={s.name}
                            className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-110 transition-transform grayscale hover:grayscale-0 duration-500"
                        />
                    </a>
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

                <TierSection title="Sponsors Diamante" sponsors={sponsorsData.diamond} color="text-institutional" size="text-2xl" />
                <TierSection title="Sponsors Oro" sponsors={sponsorsData.gold} color="text-yellow-600" size="text-2xl" />
                <TierSection title="Sponsors Plata" sponsors={sponsorsData.silver} color="text-gray-500" size="text-2xl" />
                <TierSection title="Sponsors Bronce" sponsors={sponsorsData.bronze} color="text-orange-700 hover:text-orange-800" size="text-2xl" />

            </div>
        </section>
    );
};

export default Sponsors;
