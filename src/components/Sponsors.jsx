const SPONSORS_ORO = [
    {
        name: 'Ag+Zinc',
        logoUrl: '/assets/sponsors/logo-agzinc.png',
        url: 'https://www.agzinc.com.ar/',
        cardBg: 'bg-[#1c3a5e]',
    },
    {
        name: 'Penetron',
        logoUrl: '/assets/sponsors/logo-penetron.png',
        url: 'https://penetron.com.ar/',
        cardBg: 'bg-[#2a2a2a]',
    },
];

const SPONSORS_PLATA = [
    {
        name: 'Fadic',
        logoUrl: '/assets/sponsors/logo-fadic.png',
        url: 'http://fadic.ar/',
        cardBg: 'bg-[#2d2d2d]',
    },
    {
        name: 'Maccaferri',
        logoUrl: 'https://www.maccaferri.com/wp-content/themes/maccaferri/src/images/header/logo-maccaferri.png',
        url: 'https://www.maccaferri.com/latam',
        cardBg: 'bg-[#1a6b6b]',
    },
    {
        name: 'MCH Estructuras Metálicas',
        logoUrl: '/assets/sponsors/logo-mch.png',
        url: 'https://mch-srl.com.ar/',
        cardBg: 'bg-[#1a1a2e]',
    },
];

const SponsorCard = ({ sponsor, size = 'md' }) => {
    const sizeClass = size === 'lg'
        ? 'w-80 h-44'
        : 'w-64 h-36';
    return (
        <a
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sponsor.cardBg} ${sizeClass} p-6 rounded-2xl shadow-md border border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center overflow-hidden group`}
        >
            <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                }}
                className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-500"
            />
            <span style={{ display: 'none' }} className="text-xl font-bold text-white font-title text-center">
                {sponsor.name}
            </span>
        </a>
    );
};

const TierLabel = ({ label, color }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className={`h-px flex-1 ${color}`}></div>
        <span className={`font-black uppercase tracking-widest text-xs px-4 py-1 rounded-full border ${color.replace('bg-', 'border-').replace('/30', '')} ${color}`}>
            {label}
        </span>
        <div className={`h-px flex-1 ${color}`}></div>
    </div>
);

const Sponsors = () => (
    <section className="bg-white py-20 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
                <h2 className="text-4xl font-bold text-institutional mb-4 font-title uppercase tracking-widest">
                    Sponsors
                </h2>
                <p className="text-gray-500 font-body max-w-2xl mx-auto">
                    Empresas que hacen posible el XVIII&nbsp;CONEIC Buenos Aires&nbsp;2026.
                </p>
            </div>

            {/* Oro */}
            <div className="mb-10">
                <TierLabel label="Oro" color="bg-yellow-100 text-yellow-700 border-yellow-300" />
                <div className="flex flex-wrap justify-center gap-8 items-center">
                    {SPONSORS_ORO.map((s) => (
                        <SponsorCard key={s.name} sponsor={s} size="lg" />
                    ))}
                </div>
            </div>

            {/* Plata */}
            <div className="mb-14">
                <TierLabel label="Plata" color="bg-gray-100 text-gray-500 border-gray-300" />
                <div className="flex flex-wrap justify-center gap-8 items-center">
                    {SPONSORS_PLATA.map((s) => (
                        <SponsorCard key={s.name} sponsor={s} />
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-10 border-t border-gray-100">
                <p className="text-gray-400 font-body text-xs mb-4 uppercase tracking-widest">
                    ¿Tu empresa quiere aparecer aquí?
                </p>
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

export default Sponsors;
