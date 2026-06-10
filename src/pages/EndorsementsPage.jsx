// ─── Institutional endorsers ──────────────────────────────────────────────────
// Logos: place files in /public/assets/avales/ (e.g. logo-utnba.png).
// If the image fails to load the institution name is shown as fallback text.
const ENDORSERS = [
    {
        shortName: 'UTN.BA',
        fullName: 'Universidad Tecnológica Nacional — Facultad Regional Buenos Aires',
        url: 'https://www.frba.utn.edu.ar',
        logoUrl: '/assets/avales/logo-utnba.png',
        logoBg: 'bg-white',
        description:
            'Una de las facultades de ingeniería más grandes y prestigiosas del país. Se destaca por su excelencia académica en la formación de profesionales, su fuerte impulso a la investigación científica, la transferencia tecnológica al sistema productivo y un profundo compromiso con el desarrollo social y sostenible de la región.',
    },
    {
        shortName: 'ANEIC',
        fullName: 'ANEIC Argentina',
        url: 'https://sites.google.com/view/aneicarg/inicio?authuser=0',
        logoUrl: '/assets/avales/logo-aneic.png',
        logoBg: 'bg-white',
        description:
            'La red federal estudiantil más importante del país en su área. Nuclea y conecta a futuros profesionales de la ingeniería civil de diversas universidades argentinas, promoviendo la integración, el intercambio académico, el desarrollo técnico y la formación integral a través de eventos, proyectos y actividades comunitarias.',
    },
    {
        shortName: 'AATH',
        fullName: 'Asociación Argentina de Tecnología del Hormigón',
        url: 'https://www.aath.org.ar',
        logoUrl: '/assets/avales/logo-aath.png',
        logoBg: 'bg-white',
        description:
            'Asociación civil sin fines de lucro dedicada a promover el avance científico y tecnológico en el campo del hormigón y sus aplicaciones. Reúne a profesionales, investigadores y empresas del sector, fomentando la investigación, la normalización técnica, la capacitación y la difusión de las mejores prácticas constructivas en el país.',
    },
    {
        shortName: 'AAC',
        fullName: 'Asociación Argentina de Carreteras',
        url: 'https://www.aacarreteras.org.ar',
        logoUrl: '/assets/avales/logo-aac.png',
        logoBg: 'bg-white',
        description:
            'Institución técnica que actúa como el foro vial argentino por excelencia. Está integrada por los sectores público, privado y académico, y trabaja activamente en la investigación, la capacitación profesional y la transferencia de conocimiento para promover el desarrollo, la modernización y la seguridad de la infraestructura vial del país.',
    },
    {
        shortName: 'CPIC',
        fullName: 'Consejo Profesional de Ingeniería Civil',
        url: 'https://www.cpic.org.ar',
        logoUrl: '/assets/avales/logo-cpic.png',
        logoBg: 'bg-white',
        description:
            'Organismo que ejerce el gobierno de la matrícula de los profesionales de la ingeniería civil y disciplinas afines. Su misión es garantizar la excelencia, la ética y la responsabilidad en el ejercicio profesional, velando por la seguridad pública, el resguardo ambiental y el desarrollo sostenible en la planificación y ejecución de las obras.',
    },
];

// ─── Card ─────────────────────────────────────────────────────────────────────
const EndorserCard = ({ endorser }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row items-stretch">

        {/* Logo panel */}
        <a
            href={endorser.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${endorser.logoBg} flex items-center justify-center shrink-0 w-full sm:w-44 h-36 sm:h-auto border-b sm:border-b-0 sm:border-r border-gray-100 p-6 group`}
        >
            <img
                src={endorser.logoUrl}
                alt={endorser.shortName}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                }}
                className="max-w-full max-h-20 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            {/* Fallback: styled initials */}
            <div
                style={{ display: 'none' }}
                className="w-20 h-20 rounded-xl bg-institutional flex items-center justify-center"
            >
                <span className="text-complementary-gold font-black font-title text-lg leading-tight text-center px-1">
                    {endorser.shortName}
                </span>
            </div>
        </a>

        {/* Text panel */}
        <div className="flex flex-col justify-center px-7 py-6 flex-1">
            <a
                href={endorser.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 mb-1"
            >
                <h3 className="text-lg font-bold text-institutional font-title group-hover:text-primary-red transition-colors">
                    {endorser.fullName}
                </h3>
                {/* External link icon */}
                <svg className="w-4 h-4 text-gray-300 group-hover:text-primary-red transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
            <p className="text-sm text-gray-500 font-body leading-relaxed">
                {endorser.description}
            </p>
        </div>
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const EndorsementsPage = () => (
    <div className="pt-24 min-h-screen bg-complementary-light font-body">

        {/* Header */}
        <div className="bg-institutional text-white py-14 px-4 text-center">
            <p className="text-complementary-gold font-bold text-xs uppercase tracking-widest mb-3">
                XVIII CONEIC · Buenos Aires 2026
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-title mb-3">
                Avales Institucionales
            </h1>
            <p className="text-gray-300 font-subtitle max-w-2xl mx-auto text-lg">
                Instituciones que respaldan y acompañan el congreso más importante
                de estudiantes de ingeniería civil del país.
            </p>
        </div>

        {/* Gold accent bar */}
        <div className="h-1 bg-gradient-to-r from-institutional via-complementary-gold to-institutional" />

        {/* Cards */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
            {ENDORSERS.map((e) => (
                <EndorserCard key={e.shortName} endorser={e} />
            ))}
        </div>

        {/* Footer note */}
        <div className="text-center pb-16 px-4">
            <p className="text-gray-400 text-xs font-body uppercase tracking-widest">
                ¿Tu institución quiere sumarse?&nbsp;
                <a href="mailto:patrociniosconeic@gmail.com" className="text-complementary-gold hover:underline font-bold">
                    Contactanos
                </a>
            </p>
        </div>
    </div>
);

export default EndorsementsPage;
