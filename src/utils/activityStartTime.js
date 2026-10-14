// Las actividades solidarias (código 3.xx) comienzan a las 15:00 hs; algunas no
// traen hora cargada, así que se usa ese valor cuando falta. Una hora propia
// (por ejemplo una solidaria con visita) tiene prioridad.
export const SOLIDARIA_DEFAULT_START = '15:00';

export const effectiveStartTime = (option) =>
    option?.startTime || (option?.code?.startsWith('3.') ? SOLIDARIA_DEFAULT_START : '');
