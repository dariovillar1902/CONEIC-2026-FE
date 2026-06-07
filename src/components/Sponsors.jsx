const SPONSORS = [
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

const SponsorCard = ({ sponsor }) => (
    <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sponsor.cardBg} p-6 rounded-2xl shadow-md border border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-64 h-36 flex items-center justify-center overflow-hidden group`}
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
        <span style={{ display: 'none' }} className="text-xl font-bold text-white font-title">
            {sponsor.name}
        </span>
    </a>
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

            <div className="flex flex-wrap justify-center gap-8 items-center mb-14">
                {SPONSORS.map((s) => (
                    <SponsorCard key={s.name} sponsor={s} />
                ))}
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
