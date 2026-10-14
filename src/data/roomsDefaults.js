// Aulas por actividad (clave = código de la actividad). Valor inicial: cuando un admin
// guarda cambios en la pestaña "Aulas" se persiste en AppSettings ("ActivityRooms").
// 'maccaferri' es el Desafío de Barreras, que no tiene código de actividad.
export const ROOMS_SETTING_KEY = 'ActivityRooms';

export const DEFAULT_ROOMS = {
    '2.04': 'Subsuelo 13',
    maccaferri: 'Subsuelo 05',
    '1.03': 'Subsuelo 06',
    '1.06': 'Subsuelo 07',
    '1.05': 'Subsuelo 08',
    '1.04': 'Aula 140',
};
