// ─── Preview interna — Talleres, Simultáneas y Solidarias ───────────────────
//
// Solo lectura, solo para admin/tesorería (incluye a directorio, que loguea
// con rol admin). Todavía no hay inscripción a estas actividades — es
// exclusivamente para que el comité vea la propuesta de programación antes
// de habilitarla a los asistentes.
//
// Datos cargados a mano desde "24-05-26 - Cronograma gral y por día -
// GeyPro+Académica.xlsx":
//   - Talleres y Simultáneas: hoja "MIERCOLES TM - MEDRANO (V2)"
//   - Solidarias: hoja "MIÉRCOLES TT - CAMPUS 01" (tabla izquierda, la que
//     trae organización + detalle; la tabla derecha de esa hoja es solo un
//     placeholder de aula/cupo sin contenido todavía)
//
// No incluye "Desafío Barreras" (Maccafferri) — es una categoría aparte que
// ya se trackea por su cuenta (Registration.InterestedInMaccaferri).

const TALLERES_SIMULTANEAS = [
    {
        grupo: 'Grupo 1',
        bloques: [
            {
                tipo: 'Talleres',
                horario: '09:00 – 09:45',
                items: [
                    { aula: 'Aula 503', cupo: 30, cod: '1.14', disertante: 'Ezequiel Gauna', eje: 'Hab. Blandas', titulo: 'Pedir no es debilidad. De la autoexigencia a la excelencia: cómo dejar de cargar con todo y aprender a pedir' },
                    { aula: 'Aula 508', cupo: 40, cod: '1.11', disertante: 'Lic. Camila Romero', eje: 'Hab. Blandas', titulo: '¿Cuál es tu límite de fluencia? Cómo reconocer y gestionar las tensiones internas' },
                    { aula: 'Aula 509', cupo: 30, cod: '1.12', disertante: 'Ing. Daniel Bascoy', eje: 'Estructuras', titulo: 'Resistencia efectiva en testigos' },
                    { aula: 'Aula 514', cupo: 30, cod: '1.15', disertante: 'Soledad Corbiere', eje: 'Hab. Blandas', titulo: '¿Todos vemos lo mismo? Modelos mentales y empatía para potenciar tu vida profesional' },
                    { aula: 'Aula 512', cupo: 40, cod: '1.13 a', disertante: 'Ing. Federico Marti (FADIC)', eje: 'Hab. Blandas', titulo: 'Incumbencias (a definir el título)' },
                    { aula: 'Ala 2 a', cupo: 50, cod: '1.6 a', disertante: 'Ing. Anahí Zoratto', eje: 'Estructuras', titulo: 'Ingeniería de detalle y coordinación de instalaciones: Diseñar en la computadora para construir sin errores en la obra' },
                ],
            },
            {
                tipo: 'Simultánea',
                horario: '10:00 – 10:45',
                items: [
                    { aula: 'Aula Magna', cupo: 140, cod: '2.3 a', disertante: 'Ing. Joaquín N. Perrig', eje: 'Hab. Blandas', titulo: 'Aprender a ApreHender: La evolución de un liderazgo consciente' },
                    { aula: 'Ala 1a', cupo: 40, cod: '2.4 a', disertante: 'Ing. Rocío Gentico', eje: 'Estructuras', titulo: 'Impresión 3D de hormigón' },
                    { aula: 'Ala 1 b', cupo: 40, cod: '2.1', disertante: 'Ing. Martín Magallanes', eje: 'Estructuras', titulo: 'El ecosistema BIM en Ingeniería Civil: de los fundamentos teóricos a la tecnología aplicada' },
                ],
            },
        ],
    },
    {
        grupo: 'Grupo 2',
        bloques: [
            {
                tipo: 'Simultánea',
                horario: '09:00 – 09:45',
                items: [
                    { aula: 'Aula Magna', cupo: 200, cod: '2.3 b', disertante: 'Ing. Joaquín N. Perrig', eje: 'Hab. Blandas', titulo: 'Aprender a ApreHender: La evolución de un liderazgo consciente' },
                    { aula: 'Ala 1a', cupo: 50, cod: '2.4 b', disertante: 'Ing. Rocío Gentico', eje: 'Estructuras', titulo: 'Impresión 3D de hormigón' },
                ],
            },
            {
                tipo: 'Talleres',
                horario: '10:00 – 12:00 (Aula 508: 10:00–10:45)',
                items: [
                    { aula: 'Aula 503', cupo: 30, cod: '1.8', disertante: 'Ing. Gerardo Burdisso', eje: 'Sustentabilidad', titulo: 'Sistema de complejos Hidroeléctricos COMAHUE - Río Limay. Taller de práctica de roles en sectores de interés público, privado y sociedad' },
                    { aula: 'Aula 514', cupo: 30, cod: '1.2', disertante: 'Dr. Felipe Bruzzone', eje: 'Hab. Blandas', titulo: 'Inteligencia artificial para trabajar mejor' },
                    { aula: 'Ala 1 a', cupo: 45, cod: '1.17', disertante: 'Ing. Santiago Vazquez e Ing. Marino Rodriguez Azul', eje: 'Estructuras', titulo: 'Del aula a la vida profesional: El camino real detrás de un cálculo estructural' },
                    { aula: 'Aula 508', cupo: 40, cod: '1.3', disertante: 'Ing. Claudio Silvio Risetto', eje: 'Estructuras', titulo: 'Derrumbes. Casos' },
                    { aula: 'Aula 509', cupo: 30, cod: '1.7 a', disertante: 'Ing. Bryan Alejandro Castañón Martínez', eje: 'Estructuras', titulo: 'De la distribución real de tensiones al modelo simplificado: Impacto en la práctica del ingeniero civil' },
                    { aula: 'Aula 512', cupo: 40, cod: '1.13 b', disertante: 'Ing. Federico Marti (FADIC)', eje: 'Hab. Blandas', titulo: 'Incumbencias (a definir el título)' },
                    { aula: 'Ala 1b', cupo: 35, cod: '1.6 b', disertante: 'Ing. Anahí Zoratto', eje: 'Estructuras', titulo: 'Del plano 2D al modelo 3D: Cómo la ingeniería MEP digital transforma el diseño de instalaciones en la obra' },
                ],
            },
        ],
    },
    {
        grupo: 'Grupo 3',
        bloques: [
            {
                tipo: 'Talleres',
                horario: '11:00 – 11:45',
                items: [
                    { aula: 'Aula 508', cupo: 48, cod: '1.1', disertante: 'Ing. Axel Colantuono', eje: 'Hab. Blandas', titulo: '¿Y ahora qué?' },
                    { aula: 'Aula 509', cupo: 38, cod: '1.1', disertante: 'Ing. Mosquera', eje: 'Vías', titulo: '¿Aguanta o no aguanta? Taller de Geotecnia en acción' },
                    { aula: 'Aula 512', cupo: 44, cod: '1.4', disertante: 'Ing. Julio Cesar Tomas', eje: 'Estructuras', titulo: 'Cómo la tecnología está cambiando la forma de diagnosticar estructuras de hormigón' },
                    { aula: 'Ala 2', cupo: 100, cod: '1.7 b', disertante: 'Ing. Bryan Alejandro Castañón Martínez', eje: 'Estructuras', titulo: 'De la distribución real de tensiones al modelo simplificado: Impacto en la práctica del ingeniero civil' },
                    { aula: 'Ala 1b', cupo: 50, cod: '1.18', disertante: 'Ing. Anibal Tolosa', eje: 'Estructuras', titulo: '¿Cómo considerar las cargas horizontales en edificios altos?' },
                ],
            },
            {
                tipo: 'Simultánea',
                horario: '12:00 – 12:45',
                items: [
                    { aula: 'Ala 2a', cupo: 50, cod: '1.16', disertante: 'Maria de los Angeles Sager', eje: 'Hab. Blandas', titulo: 'Ingenieros digitales y emprendedores' },
                    { aula: 'Ala 2b', cupo: 50, cod: '2.05', disertante: 'Grupo Mitre', eje: 'Sustentabilidad', titulo: 'Demolición, excavación y reciclaje: gestión técnica sostenible' },
                    { aula: 'Aula Magna', cupo: 180, cod: '2.02', disertante: 'Nicolas Ocampo', eje: 'Sustentabilidad', titulo: 'Atropellamiento de fauna y su consideración en Estudios de Impacto Ambiental' },
                ],
            },
        ],
    },
];

const SOLIDARIAS = [
    {
        horario: '15:00 – 16:00',
        items: [
            { aula: 'Auditorio', cupo: 100, org: 'Fundación Marolio', tipo: 'Charla', detalle: '1h de duración' },
            { aula: 'Laboratorio Civil', cupo: 80, org: 'Fundación Techo', tipo: 'Taller', detalle: null },
            { aula: 'Aula 1 Lab Física 1° piso', cupo: 100, org: 'Ingenieros Sin Fronteras', tipo: 'Charla', detalle: 'Charla de Ing. Sin Fronteras' },
            { aula: 'Subs. 06', cupo: 74, org: 'Club de Leones', tipo: 'Charla', detalle: '3 bloques: intro, inclusión discapacidad y medio ambiente' },
            { aula: 'Subs. 07', cupo: 89, org: 'Atalaya Sur', tipo: 'Charla', detalle: 'A confirmar si la charla dura 1h o más' },
            { aula: 'Subs. 10', cupo: 40, org: 'Módulo Sanitario', tipo: 'Taller', detalle: null },
            { aula: 'Subs. 13', cupo: 75, org: 'Otromodo', tipo: 'Charla', detalle: 'Posibilidad de hacerla al aire libre si el clima acompaña' },
        ],
    },
    {
        horario: '16:30 – 18:00',
        items: [
            { aula: 'Auditorio', cupo: 100, org: 'Rotaract', tipo: 'Charla', detalle: null },
            { aula: 'Laboratorio Civil', cupo: 80, org: 'Unión Civil', tipo: 'Taller', detalle: 'Subcos incumbencias' },
            { aula: 'Aula 1 Lab Física 1° piso', cupo: 100, org: 'Ingenieros Sin Fronteras', tipo: 'Charla', detalle: 'Subcos + IsF' },
            { aula: 'Subs. 06', cupo: 74, org: 'Colectando Sol', tipo: 'Taller', detalle: null },
            { aula: 'Subs. 07', cupo: 89, org: 'Atalaya Sur', tipo: 'Charla', detalle: 'A confirmar si la charla dura 1h o más' },
            { aula: 'Subs. 10', cupo: 40, org: 'Módulo Sanitario', tipo: 'Taller', detalle: '40 personas' },
            { aula: 'Subs. 13', cupo: 75, org: 'Otromodo', tipo: 'Taller', detalle: 'Posibilidad de hacerla al aire libre si el clima acompaña' },
        ],
    },
];

const ItemCard = ({ item, showOrg }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-gray-400">{item.aula}</span>
            <span className="text-xs font-bold text-institutional bg-blue-50 px-2 py-0.5 rounded-full shrink-0">Cupo: {item.cupo ?? '—'}</span>
        </div>
        {showOrg ? (
            <>
                <p className="font-bold text-gray-800 text-sm">{item.org}</p>
                <p className="text-xs text-gray-500 mb-1">{item.tipo}</p>
                {item.detalle && <p className="text-xs text-gray-600 italic">{item.detalle}</p>}
            </>
        ) : (
            <>
                {item.cod && <span className="text-[10px] font-mono font-bold text-gray-400 block mb-0.5">Cód. {item.cod}</span>}
                <p className="font-bold text-gray-800 text-sm leading-snug">{item.titulo}</p>
                <p className="text-xs text-gray-500 mt-1">{item.disertante} · <span className="italic">{item.eje}</span></p>
            </>
        )}
    </div>
);

const TalleresSolidariasPreview = () => (
    <div className="space-y-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            ⚠️ <strong>Vista previa interna, no pública.</strong> Todavía nadie puede anotarse a estas actividades — es solo para que el comité revise la propuesta de programación antes de habilitarla a los asistentes.
        </div>

        {/* Talleres y Simultáneas */}
        <section>
            <h2 className="text-xl font-bold text-institutional font-title mb-1">Talleres y Simultáneas</h2>
            <p className="text-sm text-gray-500 mb-6">Miércoles 14/10 · UTN FRBA Sede Medrano</p>

            {TALLERES_SIMULTANEAS.map(grupo => (
                <div key={grupo.grupo} className="mb-8">
                    <h3 className="text-sm font-bold text-white bg-institutional inline-block px-3 py-1 rounded-full mb-4">{grupo.grupo}</h3>
                    {grupo.bloques.map((bloque, bi) => (
                        <div key={bi} className="mb-5">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                {bloque.tipo} · {bloque.horario}
                            </p>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {bloque.items.map((item, ii) => (
                                    <ItemCard key={ii} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </section>

        {/* Solidarias */}
        <section>
            <h2 className="text-xl font-bold text-institutional font-title mb-1">Solidarias</h2>
            <p className="text-sm text-gray-500 mb-6">Miércoles 14/10 · UTN FRBA Sede Campus</p>

            {SOLIDARIAS.map((bloque, bi) => (
                <div key={bi} className="mb-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{bloque.horario}</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {bloque.items.map((item, ii) => (
                            <ItemCard key={ii} item={item} showOrg />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    </div>
);

export default TalleresSolidariasPreview;
