// Las actividades solidarias (código 3.xx) comienzan a las 15:00 hs; algunas no
// traen hora cargada, así que se usa ese valor cuando falta. Una hora propia
// (por ejemplo una solidaria con visita) tiene prioridad.
export const SOLIDARIA_DEFAULT_START = '15:00';

// Talleres del segundo turno en UCA: arrancan 11:30 (el catálogo trae 11:00).
// Al no tener hora de fin confirmada, se oculta la de catálogo.
const START_OVERRIDES = { '1.12': '11:30', '1.13': '11:30', '1.14': '11:30' };

export const effectiveStartTime = (option) =>
    START_OVERRIDES[option?.code] ||
    option?.startTime ||
    (option?.code?.startsWith('3.') ? SOLIDARIA_DEFAULT_START : '');

export const effectiveEndTime = (option) => (START_OVERRIDES[option?.code] ? '' : option?.endTime || '');

// Coffee break del miércoles para quienes tienen alguna actividad en UCA.
export const UCA_COFFEE = {
    title: 'Coffee break',
    startTime: '11:00',
    venue: 'UCA - Puerto Madero',
    room: 'Auditorio - Edificio Magno',
};

export const isUcaActivity = (option) => (option?.venue ?? '').toUpperCase().startsWith('UCA');
