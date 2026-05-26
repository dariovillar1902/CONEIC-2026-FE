// ─── Committee data ───────────────────────────────────────────────────────────
// Photos: place files in /public/assets/committee/<slug>.jpg
// (e.g. sofia-pizzamus.jpg). If not found, styled initials are shown instead.

const AREAS = [
    {
        area: 'Dirección',
        icon: '⭐',
        accentClass: 'border-complementary-gold',
        headerClass: 'bg-institutional text-white',
        members: [
            { name: 'Sofia Pizzamus', role: 'Directora' },
            { name: 'Candela Poggi',  role: 'Directora' },
        ],
        advisor: { name: 'María Emilia Bezmalinovich', role: 'Asesora de Directorio' },
    },
    {
        area: 'Tesorería y Finanzas',
        icon: '💰',
        accentClass: 'border-emerald-500',
        headerClass: 'bg-emerald-700 text-white',
        members: [
            { name: 'Alvaro Carmona',      role: 'Tesorero' },
            { name: 'Wilson Choque García', role: 'Miembro' },
        ],
        advisor: null,
    },
    {
        area: 'Académica',
        icon: '🎓',
        accentClass: 'border-primary-blue',
        headerClass: 'bg-blue-800 text-white',
        members: [
            { name: 'Giuliana Ietto' },
            { name: 'Joel Choque García' },
            { name: 'Stick Guevara' },
        ],
        advisor: null,
    },
    {
        area: 'Gestión y Protocolo',
        icon: '📋',
        accentClass: 'border-teal-500',
        headerClass: 'bg-teal-700 text-white',
        members: [
            { name: 'Julieta Listello' },
        ],
        advisor: { name: 'Josefina Yarke Ariet', role: 'Asesora' },
    },
    {
        area: 'Prensa y Difusión',
        icon: '📢',
        accentClass: 'border-violet-500',
        headerClass: 'bg-violet-700 text-white',
        members: [
            { name: 'Carol Lombardino Petrocinio' },
        ],
        advisor: { name: 'Victoria Ortiz', role: 'Asesora' },
    },
    {
        area: 'Auspicios y Patrocinios',
        icon: '🤝',
        accentClass: 'border-amber-500',
        headerClass: 'bg-amber-700 text-white',
        members: [
            { name: 'Gian Luca De Caro' },
        ],
        advisor: { name: 'Nerea Oliveras', role: 'Asesora' },
    },
    {
        area: 'Web e Infraestructura',
        icon: '💻',
        accentClass: 'border-sky-500',
        headerClass: 'bg-sky-700 text-white',
        members: [
            { name: 'Dario Villar' },
            { name: 'Tobias Martinez' },
        ],
        advisor: null,
    },
    {
        area: 'Logística y Eventos',
        icon: '📍',
        accentClass: 'border-primary-red',
        headerClass: 'bg-primary-red text-white',
        members: [
            { name: 'Tomás Emilio Alcayaga' },
            { name: 'Haylin Nadeyva Silva Rodas' },
            { name: 'Leandro David Díaz' },
        ],
        advisor: null,
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Converts a full name to a URL-safe slug used for photo lookup */
const toSlug = (name) =>
    name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

/** Returns up to 2 initials from a full name */
const initials = (name) => {
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
};

// Palette used to color initials avatars when no photo is available
const AVATAR_COLORS = [
    'bg-institutional',
    'bg-blue-800',
    'bg-teal-700',
    'bg-emerald-700',
    'bg-violet-700',
    'bg-amber-700',
    'bg-sky-700',
    'bg-primary-red',
];

let colorIndex = 0;
const nextColor = () => AVATAR_COLORS[colorIndex++ % AVATAR_COLORS.length];
const colorMap = {};
const getColor = (name) => {
    if (!colorMap[name]) colorMap[name] = nextColor();
    return colorMap[name];
};

// ─── MemberCard ───────────────────────────────────────────────────────────────
const MemberCard = ({ member, isAdvisor = false }) => {
    const slug = toSlug(member.name);
    const photoSrc = `/assets/committee/${slug}.jpg`;

    return (
        <div className={`flex flex-col items-center text-center p-4 rounded-xl ${isAdvisor ? 'bg-gray-50 border border-dashed border-gray-200' : 'bg-white border border-gray-100 shadow-sm'} hover:shadow-md transition-shadow`}>

            {/* Photo / avatar */}
            <div className="relative mb-3">
                <img
                    src={photoSrc}
                    alt={member.name}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                    className={`w-20 h-20 rounded-full object-cover object-top border-2 ${isAdvisor ? 'border-gray-300' : 'border-complementary-gold/40'}`}
                />
                {/* Fallback avatar */}
                <div
                    style={{ display: 'none' }}
                    className={`w-20 h-20 rounded-full ${getColor(member.name)} flex items-center justify-center border-2 ${isAdvisor ? 'border-gray-300' : 'border-complementary-gold/40'}`}
                >
                    <span className="text-white font-bold font-title text-xl">
                        {initials(member.name)}
                    </span>
                </div>

                {/* Advisor badge */}
                {isAdvisor && (
                    <div className="absolute -bottom-1 -right-1 bg-complementary-gold text-institutional text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full leading-none">
                        Asesor/a
                    </div>
                )}
            </div>

            <p className={`font-bold text-sm leading-tight ${isAdvisor ? 'text-gray-500' : 'text-institutional'} font-subtitle`}>
                {member.name}
            </p>
            {member.role && (
                <p className="text-xs text-gray-400 mt-0.5 font-body">{member.role}</p>
            )}
        </div>
    );
};

// ─── AreaCard ─────────────────────────────────────────────────────────────────
const AreaCard = ({ area }) => (
    <div className={`bg-white rounded-2xl shadow-sm border-t-4 ${area.accentClass} overflow-hidden`}>

        {/* Area header */}
        <div className={`${area.headerClass} px-6 py-4 flex items-center gap-3`}>
            <span className="text-2xl">{area.icon}</span>
            <h3 className="font-bold font-title uppercase tracking-widest text-sm">
                {area.area}
            </h3>
        </div>

        {/* Members grid */}
        <div className="p-6">
            {area.members.length === 0 && !area.advisor ? (
                <p className="text-gray-400 text-sm text-center py-4 font-body italic">
                    Integrantes por confirmar
                </p>
            ) : (
                <div className="flex flex-wrap gap-4 justify-start">
                    {area.members.map((m) => (
                        <MemberCard key={m.name} member={m} />
                    ))}
                    {area.advisor && (
                        <MemberCard member={area.advisor} isAdvisor />
                    )}
                </div>
            )}
        </div>
    </div>
);

// ─── Exported section content (used by AboutPage tabs) ────────────────────────
export const CommitteeSectionContent = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {AREAS.map((area) => (
            <AreaCard key={area.area} area={area} />
        ))}
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const CommitteePage = () => (
    <div className="pt-24 min-h-screen bg-complementary-light font-body">

        {/* Header */}
        <div className="bg-institutional text-white py-14 px-4 text-center">
            <p className="text-complementary-gold font-bold text-xs uppercase tracking-widest mb-3">
                XVIII CONEIC · Buenos Aires 2026
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-title mb-3">
                Comité Organizador
            </h1>
            <p className="text-gray-300 font-subtitle max-w-2xl mx-auto text-lg">
                El equipo detrás del congreso nacional más importante de estudiantes
                de ingeniería civil de Argentina.
            </p>
        </div>

        {/* Gold accent bar */}
        <div className="h-1 bg-gradient-to-r from-institutional via-complementary-gold to-institutional" />

        {/* Areas grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
            {AREAS.map((area) => (
                <AreaCard key={area.area} area={area} />
            ))}
        </div>
    </div>
);

export default CommitteePage;
