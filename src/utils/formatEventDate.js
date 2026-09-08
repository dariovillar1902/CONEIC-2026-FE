// La API guarda fechas en UTC (DateTime.Now en un contenedor Linux, que
// corre en UTC) pero las serializa sin sufijo 'Z' — un string tipo
// "2026-09-08T14:59:30.13". Si se lo pasás directo a `new Date(...)`, el
// navegador lo interpreta como si YA fuera hora local, no UTC — así que
// todo se ve corrido +3hs respecto de la hora real de Argentina.
// `parseUtc` fuerza la interpretación correcta agregando la 'Z' faltante.
export const parseUtc = (raw) => {
    if (!raw) return null;
    return new Date(raw.endsWith('Z') ? raw : `${raw}Z`);
};

// La Elección de Actividades abrió el 2026-09-08 a las 12:00 ART (15:00 UTC).
// Por el margen del deploy programado, un puñado de selecciones quedaron
// registradas entre 11:58 y 11:59:59 ART — un adelanto de hasta 2 minutos
// sin relevancia real, pero que en pantalla se ve raro contra el horario
// anunciado. Para esas (y solo esas) mostramos la hora oficial de apertura;
// el dato real en la base queda intacto.
const OPENING_MASK_START = new Date('2026-09-08T14:58:00.000Z');
const OPENING_MASK_END = new Date('2026-09-08T15:00:00.000Z'); // exclusivo
const OPENING_DISPLAY_AS = new Date('2026-09-08T15:00:00.000Z'); // = 12:00 PM ART

/**
 * Formatea una fecha ISO (sin 'Z') de la API a hora de Argentina, con el
 * pequeño ajuste de apertura descripto arriba.
 * @param {string} raw
 * @param {Intl.DateTimeFormatOptions} [opts]
 */
export const formatEventDate = (raw, opts = {}) => {
    const d = parseUtc(raw);
    if (!d) return '—';
    const display = (d >= OPENING_MASK_START && d < OPENING_MASK_END) ? OPENING_DISPLAY_AS : d;
    return display.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', ...opts });
};
