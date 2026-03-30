

const sponsorsData = {
  diamond: [
    { name: 'Techint', logo: 'Techint' }, // Placeholder
    { name: 'Holcim', logo: 'Holcim' }
  ],
  gold: [
    { name: 'YPF', logo: 'YPF' },
    { name: 'CPIC', logo: 'CPIC' }
  ],
  silver: [
    { name: 'Camarco', logo: 'Camarco' },
    { name: 'Panedile', logo: 'Panedile' }
  ],
  bronze: [
    { name: 'Empresa A', logo: 'A' },
    { name: 'Empresa B', logo: 'B' }
  ]
};

const Sponsors = () => {
    const TierSection = ({ title, sponsors, color, size }) => (
        <div className="mb-12 text-center">
            <h3 className={`font-bold font-title uppercase tracking-widest mb-6 ${color} ${size}`}>
                {title}
            </h3>
            <div className="flex flex-wrap justify-center gap-8 items-center">
                {sponsors.map((s, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-56 h-32 flex items-center justify-center overflow-hidden group">
                         {/* Using Placehold.co for reliable logo placeholders with company name */}
                         <img 
                            src={`https://placehold.co/400x200/ffffff/333333?text=${s.name}`} 
                            alt={s.name} 
                            className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-110 transition-transform grayscale hover:grayscale-0 duration-500"
                        />
                    </div>
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
                        Empresas líderes que hacen posible el XVIII CONEIC.
                    </p>
                </div>
                
                <TierSection title="Sponsors Diamante" sponsors={sponsorsData.diamond} color="text-institutional" size="text-3xl" />
                <TierSection title="Sponsors Oro" sponsors={sponsorsData.gold} color="text-yellow-600" size="text-2xl" />
                <TierSection title="Sponsors Plata" sponsors={sponsorsData.silver} color="text-gray-500" size="text-xl" />
                <TierSection title="Sponsors Bronce" sponsors={sponsorsData.bronze} color="text-orange-700 hover:text-orange-800" size="text-lg" />

            </div>
        </section>
    );
};

export default Sponsors;
