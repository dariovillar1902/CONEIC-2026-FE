import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/* ─── WhatsApp helper ────────────────────────────────────────────────────────── */
const waUrl = (phone) => `https://wa.me/549${phone.replace(/\D/g, '')}`;

/* ══════════════════════════════════════════════════════════════════════════════
   SPONSORS DATA
══════════════════════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════════════════════
   ENDORSERS DATA
══════════════════════════════════════════════════════════════════════════════ */
const ENDORSERS = [
    {
        shortName: 'UTN.BA',
        fullName: 'Universidad Tecnológica Nacional — Facultad Regional Buenos Aires',
        url: 'https://www.frba.utn.edu.ar',
        logoUrl: '/assets/avales/logo-utnba.jpg',
        logoBg: 'bg-white',
        description: 'Una de las facultades de ingeniería más grandes y prestigiosas del país. Se destaca por su excelencia académica en la formación de profesionales, su fuerte impulso a la investigación científica, la transferencia tecnológica al sistema productivo y un profundo compromiso con el desarrollo social y sostenible de la región.',
    },
    {
        shortName: 'ANEIC',
        fullName: 'ANEIC Argentina',
        url: 'https://www.aneic.org.ar',
        logoUrl: '/assets/avales/logo-aneic.png',
        logoBg: 'bg-white',
        description: 'La red federal estudiantil más importante del país en su área. Nuclea y conecta a futuros profesionales de la ingeniería civil de diversas universidades argentinas, promoviendo la integración, el intercambio académico, el desarrollo técnico y la formación integral a través de eventos, proyectos y actividades comunitarias.',
    },
    {
        shortName: 'AATH',
        fullName: 'Asociación Argentina de Tecnología del Hormigón',
        url: 'https://www.aath.org.ar',
        logoUrl: '/assets/avales/logo-aath.png',
        logoBg: 'bg-white',
        description: 'Asociación civil sin fines de lucro dedicada a promover el avance científico y tecnológico en el campo del hormigón y sus aplicaciones. Reúne a profesionales, investigadores y empresas del sector, fomentando la investigación, la normalización técnica, la capacitación y la difusión de las mejores prácticas constructivas en el país.',
    },
    {
        shortName: 'AAC',
        fullName: 'Asociación Argentina de Carreteras',
        url: 'https://www.aacarreteras.org.ar',
        logoUrl: '/assets/avales/logo-aac.png',
        logoBg: 'bg-white',
        description: 'Institución técnica que actúa como el foro vial argentino por excelencia. Está integrada por los sectores público, privado y académico, y trabaja activamente en la investigación, la capacitación profesional y la transferencia de conocimiento para promover el desarrollo, la modernización y la seguridad de la infraestructura vial del país.',
    },
    {
        shortName: 'CPIC',
        fullName: 'Consejo Profesional de Ingeniería Civil',
        url: 'https://www.cpic.org.ar',
        logoUrl: '/assets/avales/logo-cpic.png',
        logoBg: 'bg-white',
        description: 'Organismo que ejerce el gobierno de la matrícula de los profesionales de la ingeniería civil y disciplinas afines. Su misión es garantizar la excelencia, la ética y la responsabilidad en el ejercicio profesional, velando por la seguridad pública, el resguardo ambiental y el desarrollo sostenible en la planificación y ejecución de las obras.',
    },
];

/* ══════════════════════════════════════════════════════════════════════════════
   DELEGATES DATA
   Rules applied:
   • Up to 2 contacts per delegation: Titulares first, then Suplentes if < 2
   • noRep: true → contact is the regional vocal
   • UCA (Buenos Aires) removed entirely per organizers
   • UNPSJB Trelew: only Cristian Schlund Cari (Torres has no phone)
══════════════════════════════════════════════════════════════════════════════ */
const REGIONS = [
    {
        region: 'Centro',
        delegations: [
            {
                university: 'UTN Venado Tuerto',
                contacts: [
                    { name: 'Tomás Stipanovich',  role: 'Titular', phone: '3462638309' },
                    { name: 'Stefania Giumbini',   role: 'Titular', phone: '3462518537' },
                ],
            },
            {
                university: 'UTN Rafaela',
                contacts: [
                    { name: 'Tamara Ghirardotti',  role: 'Titular', phone: '3492610096' },
                    { name: 'Martina Paredes',     role: 'Titular', phone: '3492332171' },
                ],
            },
            {
                university: 'UTN Rosario',
                contacts: [
                    { name: 'Francisco Coppari',  role: 'Titular', phone: '3413208022' },
                    { name: 'Luana Plese',         role: 'Titular', phone: '3406421101' },
                ],
            },
            {
                university: 'UN Rosario',
                contacts: [
                    { name: 'Valentín Córdoba', role: 'Titular', phone: '3382672049' },
                ],
            },
            {
                university: 'UTN Paraná',
                contacts: [
                    { name: 'Ramiro Acosta',   role: 'Titular', phone: '3435339453' },
                    { name: 'Sofía Sattler',   role: 'Titular', phone: '3435444008' },
                ],
            },
            {
                university: 'UTN FR Santa Fe',
                noRep: true,
                contacts: [
                    { name: 'Ana Breit', role: 'Vocal Región Centro', phone: '3462611376' },
                ],
            },
        ],
    },
    {
        region: 'Este',
        delegations: [
            {
                university: 'UN La Plata',
                contacts: [
                    { name: 'Facundo Salomón',     role: 'Titular', phone: '2344410495' },
                    { name: 'Leonel Loera Peroni', role: 'Titular', phone: '2215249407' },
                ],
            },
            {
                university: 'UTN General Pacheco',
                contacts: [
                    { name: 'Santiago Sánchez Díaz', role: 'Titular', phone: '1168576041' },
                    { name: 'Nicolás Bohl',           role: 'Titular', phone: '33397819' },
                ],
            },
            {
                university: 'UTN Buenos Aires',
                contacts: [
                    { name: 'Leandro Díaz',      role: 'Titular', phone: '1134987525' },
                    { name: 'Haylin Silva Rodas', role: 'Titular', phone: '1126834939' },
                ],
            },
            {
                university: 'UN La Matanza',
                contacts: [
                    { name: 'Marisol Rojas Cabañas', role: 'Titular', phone: '1125763197' },
                ],
            },
            {
                university: 'UTN FR Avellaneda',
                noRep: true,
                contacts: [
                    { name: 'Santiago Meneses', role: 'Vocal Región Este', phone: '3462611376' },
                ],
            },
            {
                university: 'Universidad de Belgrano',
                noRep: true,
                contacts: [
                    { name: 'Santiago Meneses', role: 'Vocal Región Este', phone: '3462611376' },
                ],
            },
            {
                university: 'UBA',
                noRep: true,
                contacts: [
                    { name: 'Santiago Meneses', role: 'Vocal Región Este', phone: '3462611376' },
                ],
            },
            {
                university: 'Universidad de la Defensa Nacional',
                noRep: true,
                contacts: [
                    { name: 'Santiago Meneses', role: 'Vocal Región Este', phone: '3462611376' },
                ],
            },
            {
                university: 'UTN FR Concepción del Uruguay',
                noRep: true,
                contacts: [
                    { name: 'Santiago Meneses', role: 'Vocal Región Este', phone: '3462611376' },
                ],
            },
            {
                university: 'UTN FR Concordia',
                noRep: true,
                contacts: [
                    { name: 'Santiago Meneses', role: 'Vocal Región Este', phone: '3462611376' },
                ],
            },
            {
                university: 'UTN FR La Plata',
                noRep: true,
                contacts: [
                    { name: 'Santiago Meneses', role: 'Vocal Región Este', phone: '3462611376' },
                ],
            },
            {
                university: 'UN Morón',
                noRep: true,
                contacts: [
                    { name: 'Santiago Meneses', role: 'Vocal Región Este', phone: '3462611376' },
                ],
            },
        ],
    },
    {
        region: 'Norte',
        delegations: [
            {
                university: 'UNNE',
                contacts: [
                    { name: 'Cristian Ledesma', role: 'Titular', phone: '3794707691' },
                    { name: 'Celeste Sabaj',    role: 'Titular', phone: '3704925065' },
                ],
            },
            {
                university: 'UN Tucumán',
                contacts: [
                    { name: 'Álvaro Brodersen', role: 'Titular', phone: '3815294542' },
                    { name: 'Matías Aranda',    role: 'Titular', phone: '3816633939' },
                ],
            },
            {
                university: 'UTN Tucumán',
                contacts: [
                    { name: 'Lara Chauque',  role: 'Titular', phone: '3813396300' },
                    { name: 'Maite Morales', role: 'Titular', phone: '3813524349' },
                ],
            },
            {
                university: 'UN Santiago del Estero',
                contacts: [
                    { name: 'Nicolás Sarubi',          role: 'Titular', phone: '2213104696' },
                    { name: 'Augusto Robles Cameranesi', role: 'Titular', phone: '3854753078' },
                ],
            },
            {
                university: 'UN Misiones',
                contacts: [
                    { name: 'Estefanía Hundt', role: 'Titular', phone: '3751592942' },
                    { name: 'Nauhel Posnik',   role: 'Titular', phone: '3755542707' },
                ],
            },
            {
                university: 'UCASAL',
                contacts: [
                    { name: 'Daniel Martínez',  role: 'Titular', phone: '3875518269' },
                    { name: 'Alejandra Sulca',  role: 'Titular', phone: '3874812466' },
                ],
            },
            {
                university: 'UN Formosa',
                contacts: [
                    { name: 'Joaquín Rolón', role: 'Titular', phone: '3718443595' },
                    { name: 'Adrián Paz',    role: 'Titular', phone: '3704721155' },
                ],
            },
            {
                university: 'UN Salta',
                contacts: [
                    { name: 'Luis Barrios',          role: 'Titular', phone: '3874464850' },
                    { name: 'Gimena Álvarez Matthews', role: 'Titular', phone: '3875142818' },
                ],
            },
        ],
    },
    {
        region: 'Sur',
        delegations: [
            {
                university: 'UNPSJB Comodoro Rivadavia',
                contacts: [
                    { name: 'Jerónimo Ferro Perea', role: 'Titular', phone: '2974293820' },
                    { name: 'Sergio Gallardo',      role: 'Titular', phone: '2974358699' },
                ],
            },
            {
                university: 'UNPSJB Trelew',
                contacts: [
                    { name: 'Cristian Schlund Cari', role: 'Titular', phone: '2804005635' },
                ],
            },
            {
                university: 'UN Comahue',
                contacts: [
                    { name: 'Santiago Rodríguez Bilej', role: 'Titular', phone: '3516456091' },
                ],
            },
            {
                university: 'UTN Bahía Blanca',
                contacts: [
                    { name: 'Ángel De León',       role: 'Titular', phone: '2914992004' },
                    { name: 'Agustina Manganelli', role: 'Titular', phone: '2914727578' },
                ],
            },
            {
                university: 'UN del Sur',
                contacts: [
                    { name: 'Emiliano Herrera',   role: 'Titular', phone: '2932417721' },
                    { name: 'Florencia Hernández', role: 'Titular', phone: '2984826474' },
                ],
            },
            {
                university: 'UNICEN',
                contacts: [
                    { name: 'Biran Niz',    role: 'Titular', phone: '2284516065' },
                    { name: 'Nahuel Díaz',  role: 'Titular', phone: '2284514141' },
                ],
            },
        ],
    },
    {
        region: 'Oeste',
        delegations: [
            {
                university: 'UN Cuyo',
                contacts: [
                    { name: 'Martina Almirón Tittarelli', role: 'Titular', phone: '2613622661' },
                    { name: 'Agustina Gallegos',          role: 'Titular', phone: '2612574760' },
                ],
            },
            {
                university: 'UN San Juan',
                contacts: [
                    { name: 'Julián Arévalo',         role: 'Titular', phone: '2644697830' },
                    { name: 'Franco Aguilera Aballay', role: 'Titular', phone: '2645868465' },
                ],
            },
            {
                university: 'UN La Rioja',
                contacts: [
                    { name: 'Franco Avila', role: 'Titular', phone: '3804618170' },
                ],
            },
            {
                university: 'UTN La Rioja',
                contacts: [
                    { name: 'Pablo Carrizo',       role: 'Titular', phone: '3837691881' },
                    { name: 'Pablo Carrizo Torres', role: 'Titular', phone: '3804862473' },
                ],
            },
            {
                university: 'UTN Córdoba',
                contacts: [
                    { name: 'Julieta Listello', role: 'Titular', phone: '3573430566' },
                ],
            },
            {
                university: 'UN Córdoba',
                contacts: [
                    { name: 'Sofía Bima León', role: 'Titular', phone: '3516402001' },
                ],
            },
            {
                university: 'UTN San Rafael',
                contacts: [
                    { name: 'Pablo Pérez',           role: 'Titular', phone: '2604356041' },
                    { name: 'Antonella Frana Bisang', role: 'Titular', phone: '2604600707' },
                ],
            },
            {
                university: 'UCC',
                noRep: true,
                contacts: [
                    { name: 'Fernando Cabrera', role: 'Vocal Región Oeste', phone: '2657637553' },
                ],
            },
        ],
    },
];

const REGION_STYLE = {
    Centro: { accent: 'border-vial',              header: 'bg-vial text-white',              pill: 'bg-vial/10 text-vial' },
    Este:   { accent: 'border-sky-500',            header: 'bg-sky-700 text-white',            pill: 'bg-sky-100 text-sky-700' },
    Norte:  { accent: 'border-amber-600',          header: 'bg-amber-700 text-white',          pill: 'bg-amber-50 text-amber-700' },
    Sur:    { accent: 'border-estructuras',        header: 'bg-estructuras text-white',        pill: 'bg-blue-50 text-blue-700' },
    Oeste:  { accent: 'border-sostenibilidad',     header: 'bg-sostenibilidad text-white',     pill: 'bg-green-50 text-green-700' },
};

/* ══════════════════════════════════════════════════════════════════════════════
   SPONSORS TAB
══════════════════════════════════════════════════════════════════════════════ */
const SponsorsTab = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap justify-center gap-8 items-center mb-14 min-h-[160px]">
            {SPONSORS.map((s) => (
                <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${s.cardBg} p-6 rounded-2xl shadow-md border border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-64 h-36 flex items-center justify-center overflow-hidden group`}
                >
                    <img
                        src={s.logoUrl}
                        alt={s.name}
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <span style={{ display: 'none' }} className="text-xl font-bold text-white font-title">{s.name}</span>
                </a>
            ))}
        </div>

        <div className="bg-institutional rounded-3xl p-10 text-center text-white">
            <h3 className="text-3xl font-bold font-title mb-4">¿Su empresa busca talento&nbsp;joven?</h3>
            <p className="text-gray-300 mb-8 font-subtitle text-lg max-w-2xl mx-auto">
                Participe como sponsor y posicione su marca frente a los 1.200 mejores promedios y líderes estudiantiles
                de ingeniería civil del&nbsp;país.
            </p>
            <a
                href="mailto:patrociniosconeic@gmail.com"
                className="inline-block bg-complementary-light text-institutional font-bold px-8 py-4 rounded-full hover:bg-complementary-gold hover:text-white transition transform hover:-translate-y-1 shadow-lg uppercase tracking-widest text-sm"
            >
                Solicitar Brochure
            </a>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   AVALES TAB
══════════════════════════════════════════════════════════════════════════════ */
const AvalesTab = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
        {ENDORSERS.map((e) => (
            <div
                key={e.shortName}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row items-stretch"
            >
                {/* Logo */}
                <a
                    href={e.url} target="_blank" rel="noopener noreferrer"
                    className={`${e.logoBg} flex items-center justify-center shrink-0 w-full sm:w-44 h-36 sm:h-auto border-b sm:border-b-0 sm:border-r border-gray-100 p-6 group`}
                >
                    <img
                        src={e.logoUrl} alt={e.shortName}
                        onError={(ev) => { ev.target.style.display = 'none'; ev.target.nextSibling.style.display = 'flex'; }}
                        className="max-w-full max-h-20 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div style={{ display: 'none' }} className="w-20 h-20 rounded-xl bg-institutional flex items-center justify-center">
                        <span className="text-complementary-gold font-black font-title text-lg leading-tight text-center px-1">{e.shortName}</span>
                    </div>
                </a>

                {/* Text */}
                <div className="flex flex-col justify-center px-7 py-6 flex-1">
                    <a href={e.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-institutional font-title group-hover:text-primary-red transition-colors">
                            {e.fullName}
                        </h3>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-primary-red transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                    <p className="text-sm text-gray-500 font-body leading-relaxed">{e.description}</p>
                </div>
            </div>
        ))}

        <div className="text-center pt-4">
            <p className="text-gray-400 text-xs font-body uppercase tracking-widest">
                ¿Tu institución quiere sumarse?&nbsp;
                <a href="mailto:patrociniosconeic@gmail.com" className="text-complementary-gold hover:underline font-bold">Contactanos</a>
            </p>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   DELEGATES TAB
══════════════════════════════════════════════════════════════════════════════ */
const DelegationCard = ({ delegation }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${delegation.noRep ? 'opacity-80' : ''}`}>
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
            <h4 className="font-bold text-institutional text-sm font-title leading-tight">{delegation.university}</h4>
            {delegation.noRep && (
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Sin delegación
                </span>
            )}
        </div>
        <div className="px-4 py-3 space-y-2">
            {delegation.contacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-bold text-gray-800 leading-tight">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.role}</p>
                    </div>
                    <a
                        href={waUrl(c.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs px-3 py-1.5 rounded-full transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {c.phone}
                    </a>
                </div>
            ))}
        </div>
    </div>
);

const DelegadosTab = () => {
    const [search, setSearch] = useState('');
    const q = search.toLowerCase();

    const filtered = REGIONS.map((r) => ({
        ...r,
        delegations: r.delegations.filter(
            (d) => d.university.toLowerCase().includes(q) || d.contacts.some((c) => c.name.toLowerCase().includes(q))
        ),
    })).filter((r) => r.delegations.length > 0);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Search */}
            <div className="mb-8 max-w-md mx-auto">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por universidad o delegado…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-institutional text-sm font-body"
                    />
                </div>
            </div>

            {filtered.length === 0 && (
                <p className="text-center text-gray-400 py-16 font-body">No se encontraron resultados.</p>
            )}

            {filtered.map((r) => {
                const style = REGION_STYLE[r.region] || REGION_STYLE.Centro;
                return (
                    <div key={r.region} className="mb-10">
                        {/* Region header */}
                        <div className={`inline-flex items-center gap-2 ${style.pill} font-bold uppercase tracking-widest text-xs px-4 py-1.5 rounded-full mb-4`}>
                            <span className={`w-2 h-2 rounded-full ${style.accent.replace('border-', 'bg-')}`}></span>
                            Región {r.region}
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {r.delegations.map((d) => (
                                <DelegationCard key={d.university} delegation={d} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════════ */
// Delegados tab hidden for privacy (phone numbers). Re-enable by restoring the entry.
const TABS = [
    { id: 'sponsors',   label: 'Sponsors' },
    { id: 'avales',     label: 'Avales Institucionales' },
];

const HERO_CONTENT = {
    sponsors:  { title: 'Nuestros Sponsors',          subtitle: 'Empresas líderes que hacen posible el XVIII CONEIC Buenos Aires 2026.' },
    avales:    { title: 'Avales Institucionales',      subtitle: 'Instituciones que respaldan y acompañan el congreso más importante de estudiantes de ingeniería civil del país.' },
    delegados: { title: 'Delegados y Contactos',       subtitle: 'Encontrá al delegado o vocal de tu universidad para consultas sobre la inscripción.' },
};

const SupportPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = TABS.find((t) => t.id === searchParams.get('tab'))?.id ?? 'sponsors';

    const setTab = (id) => {
        setSearchParams(id === 'sponsors' ? {} : { tab: id });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hero = HERO_CONTENT[activeTab];

    return (
        <div className="pt-24 min-h-screen bg-complementary-light font-body">

            {/* Hero */}
            <div className="bg-institutional text-white py-12 px-4 text-center">
                <p className="text-complementary-gold font-bold text-xs uppercase tracking-widest mb-3">
                    XVIII CONEIC · Buenos Aires 2026
                </p>
                <h1 className="text-4xl md:text-5xl font-bold font-title mb-3 transition-all">{hero.title}</h1>
                <p className="text-gray-300 font-subtitle max-w-2xl mx-auto text-lg">{hero.subtitle}</p>
            </div>

            {/* Gold bar */}
            <div className="h-1 bg-gradient-to-r from-institutional via-complementary-gold to-institutional" />

            {/* Tab bar */}
            <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
                    <div className="flex gap-1 py-2 min-w-max">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`px-5 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeTab === t.id
                                        ? 'bg-institutional text-white shadow-sm'
                                        : 'text-gray-500 hover:text-institutional hover:bg-gray-100'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab content */}
            {activeTab === 'sponsors'  && <SponsorsTab />}
            {activeTab === 'avales'    && <AvalesTab />}
            {activeTab === 'delegados' && <DelegadosTab />}
        </div>
    );
};

export default SupportPage;
