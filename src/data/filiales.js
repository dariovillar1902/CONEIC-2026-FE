/**
 * CONEIC — Definición de filiales, delegados y vocales por región.
 *
 * "Filial" = Región ANEIC. Cada filial tiene:
 *  - faculties: todas las facultades que pertenecen a esa región
 *  - delegates: delegados nombrados (cada uno gestiona un subconjunto de facultades)
 *  - vocal: vocal de ANEIC para la región (contacto de último recurso)
 *
 * Cuando una facultad no tiene un delegado específico asignado, el sistema
 * usa al delegado que tenga "isRegionalFallback: true" en esa filial.
 * Si no hay delegado en la filial, el contacto es el vocal.
 *
 * ⚠️  Cantidades de cupos, emails de vocales y delegados adicionales están
 *     pendientes de confirmación (ver items 5 y 6 del backlog).
 */

export const FILIALES = {
  Centro: {
    id: 'Centro',
    name: 'Región Centro',
    vocal: {
      name: 'Vocal Región Centro — ANEIC',
      email: 'region.centro@aneic.org.ar', // pendiente de confirmar
    },
    delegates: [
      {
        // Cubre también UTN Santa Fe (sin delegado designado en el Excel)
        name: 'Francisco Coppari',
        faculty: 'UTN - Facultad Regional Rosario',
        phone: '3413208022',
        email: 'delegacion.utn-rosario@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: true,
        managedFaculties: [
          'UTN - Facultad Regional Rosario',
          'UTN - Facultad Regional Santa Fe', // sin delegado designado en Excel
        ],
      },
      {
        name: 'Tomás Daniel Stipanovich',
        faculty: 'UTN - Facultad Regional Venado Tuerto',
        phone: '3462638309',
        email: 'delegacion.utn-venado@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['UTN - Facultad Regional Venado Tuerto'],
      },
      {
        name: 'Tamara Ghirardotti',
        faculty: 'UTN - Facultad Regional Rafaela',
        phone: '3492610096',
        email: 'delegacion.utn-rafaela@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['UTN - Facultad Regional Rafaela'],
      },
      {
        name: 'Valentín Córdoba',
        faculty: 'Universidad Nacional de Rosario',
        phone: '3382672049',
        email: 'delegacion.un-rosario@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de Rosario'],
      },
      {
        name: 'Ramiro Nicolás Acosta',
        faculty: 'UTN - Facultad Regional Paraná',
        phone: '3435339453',
        email: 'delegacion.utn-parana@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['UTN - Facultad Regional Paraná'],
      },
    ],
    faculties: [
      'UTN - Facultad Regional Paraná',
      'UTN - Facultad Regional Rafaela',
      'UTN - Facultad Regional Rosario',
      'Universidad Nacional de Rosario',
      'UTN - Facultad Regional Santa Fe',
      'UTN - Facultad Regional Venado Tuerto',
    ],
  },

  Este: {
    id: 'Este',
    name: 'Región Este',
    vocal: {
      name: 'Vocal Región Este — ANEIC',
      email: 'region.este@aneic.org.ar', // pendiente de confirmar
    },
    delegates: [
      {
        // Cubre todas las facultades de la región sin delegado propio
        name: 'Leandro David Díaz',
        faculty: 'UTN - Facultad Regional Buenos Aires',
        phone: '1134987525',
        email: 'delegacion.utn-frba@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: true,
        managedFaculties: [
          'UTN - Facultad Regional Buenos Aires',
          'UTN - Facultad Regional Avellaneda',
          'Universidad de Buenos Aires',
          'Universidad de Belgrano',
          'Universidad de la Defensa Nacional',
          'UTN - Facultad Regional Concepción del Uruguay',
          'UTN - Facultad Regional Concordia',
          'UTN - Facultad Regional La Plata',
          'Universidad Nacional de Morón',
        ],
      },
      {
        name: 'Santiago Sánchez Díaz',
        faculty: 'UTN - Facultad Regional General Pacheco',
        phone: '1168576041',
        email: 'delegacion.utn-gral-pacheco@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['UTN - Facultad Regional General Pacheco'],
      },
      {
        name: 'Facundo Salomón',
        faculty: 'Universidad Nacional de La Plata',
        phone: '2344410495',
        email: 'delegacion.unlp@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de La Plata'],
      },
      {
        name: 'Marisol Rojas Cabañas',
        faculty: 'Universidad Nacional de la Matanza',
        phone: '1125763197',
        email: 'delegacion.unlam@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de la Matanza'],
      },
      {
        // Sin representación designada — asignada provisionalmente
        name: 'Sofía Ricciardi',
        faculty: 'Universidad Católica Argentina',
        phone: null, // N/A
        email: 'delegacion.uca@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Católica Argentina'],
      },
    ],
    faculties: [
      'UTN - Facultad Regional Avellaneda',
      'Universidad de Belgrano',
      'Universidad de Buenos Aires',
      'Universidad Católica Argentina',
      'Universidad de la Defensa Nacional',
      'UTN - Facultad Regional Buenos Aires',
      'UTN - Facultad Regional Concepción del Uruguay',
      'UTN - Facultad Regional Concordia',
      'UTN - Facultad Regional General Pacheco',
      'Universidad Nacional de la Matanza',
      'Universidad Nacional de La Plata',
      'UTN - Facultad Regional La Plata',
      'Universidad Nacional de Morón',
    ],
  },

  Norte: {
    id: 'Norte',
    name: 'Región Norte',
    vocal: {
      name: 'Vocal Región Norte — ANEIC',
      email: 'region.norte@aneic.org.ar', // pendiente de confirmar
    },
    delegates: [
      {
        // Delegado principal de la región
        name: 'Cristian Ledesma',
        faculty: 'Universidad Nacional del Nordeste',
        phone: '3794707691',
        email: 'delegacion.unne@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: true,
        managedFaculties: ['Universidad Nacional del Nordeste'],
      },
      {
        name: 'Álvaro Brodersen',
        faculty: 'Universidad Nacional de Tucumán',
        phone: '3815294542',
        email: 'delegacion.unt@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de Tucumán'],
      },
      {
        name: 'Lara Chauque',
        faculty: 'UTN - Facultad Regional Tucumán',
        phone: '3813396300',
        email: 'delegacion.utn-tucuman@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['UTN - Facultad Regional Tucumán'],
      },
      {
        name: 'Nicolás Sarubi',
        faculty: 'Universidad Nacional de Santiago del Estero',
        phone: '2213104696',
        email: 'delegacion.unse@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de Santiago del Estero'],
      },
      {
        name: 'Estefanía Hundt',
        faculty: 'Universidad Nacional de Misiones',
        phone: '3751592942',
        email: 'delegacion.unam@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de Misiones'],
      },
      {
        name: 'Luis Barrios',
        faculty: 'Universidad Nacional de Salta',
        phone: '3874464850',
        email: 'delegacion.unsa@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de Salta'],
      },
      {
        name: 'Joaquín Rolón',
        faculty: 'Universidad Nacional de Formosa',
        phone: '3718443595',
        email: 'delegacion.unf@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de Formosa'],
      },
      {
        name: 'Daniel Martínez',
        faculty: 'Universidad Católica de Salta',
        phone: '3875518269',
        email: 'delegacion.ucasal@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Católica de Salta'],
      },
    ],
    faculties: [
      'Universidad Nacional del Nordeste',
      'Universidad Nacional de Formosa',
      'Universidad Nacional de Misiones',
      'Universidad Católica de Salta',
      'Universidad Nacional de Salta',
      'Universidad Nacional de Santiago del Estero',
      'Universidad Nacional de Tucumán',
      'UTN - Facultad Regional Tucumán',
    ],
  },

  Oeste: {
    id: 'Oeste',
    name: 'Región Oeste',
    vocal: {
      name: 'Vocal Región Oeste — ANEIC',
      email: 'region.oeste@aneic.org.ar', // pendiente de confirmar
    },
    delegates: [
      {
        // Cubre UCA Córdoba y UTN Mendoza (sin delegados designados en Excel)
        name: 'Julieta Listello',
        faculty: 'UTN - Facultad Regional Córdoba',
        phone: '3573430566',
        email: 'delegacion.utn-cordoba@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: true,
        managedFaculties: [
          'UTN - Facultad Regional Córdoba',
          'Universidad Católica de Córdoba', // sin delegado designado en Excel
          'UTN - Facultad Regional Mendoza',  // sin delegado designado en Excel
        ],
      },
      {
        name: 'Sofía Bima León',
        faculty: 'Universidad Nacional de Córdoba',
        phone: '3516402001',
        email: 'delegacion.unc@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de Córdoba'],
      },
      {
        name: 'Julián Arévalo',
        faculty: 'Universidad Nacional de San Juan',
        phone: '2644697830',
        email: 'delegacion.unsj@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de San Juan'],
      },
      {
        name: 'Franco Ávila',
        faculty: 'Universidad Nacional de La Rioja',
        phone: '3804618170',
        email: 'delegacion.unlar@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de La Rioja'],
      },
      {
        name: 'Pablo Carrizo',
        faculty: 'UTN - Facultad Regional La Rioja',
        phone: '3837691881',
        email: 'delegacion.utn-la-rioja@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['UTN - Facultad Regional La Rioja'],
      },
      {
        name: 'Martina Almirón Tittarelli',
        faculty: 'Universidad Nacional de Cuyo',
        phone: '2613622661',
        email: 'delegacion.uncuyo@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional de Cuyo'],
      },
      {
        name: 'Pablo Pérez',
        faculty: 'UTN - Facultad Regional San Rafael',
        phone: '2604356041',
        email: 'delegacion.utn-san-rafael@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['UTN - Facultad Regional San Rafael'],
      },
    ],
    faculties: [
      'Universidad Católica de Córdoba',
      'Universidad Nacional de Córdoba',
      'UTN - Facultad Regional Córdoba',
      'UTN - Facultad Regional La Rioja',
      'Universidad Nacional de La Rioja',
      'Universidad Nacional de Cuyo',
      'UTN - Facultad Regional Mendoza',
      'Universidad Nacional de San Juan',
      'UTN - Facultad Regional San Rafael',
    ],
  },

  Sur: {
    id: 'Sur',
    name: 'Región Sur',
    vocal: {
      name: 'Vocal Región Sur — ANEIC',
      email: 'region.sur@aneic.org.ar', // pendiente de confirmar
    },
    delegates: [
      {
        name: 'Jerónimo Ferro Perea',
        faculty: 'Universidad Nacional de la Patagonia San Juan Bosco - Sede Comodoro Rivadavia',
        phone: '2974293820',
        email: 'delegacion.unpsjb-comodoro@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: true,
        managedFaculties: [
          'Universidad Nacional de la Patagonia San Juan Bosco - Sede Comodoro Rivadavia',
        ],
      },
      {
        name: 'Cristian Schlund Cari',
        faculty: 'Universidad Nacional de la Patagonia San Juan Bosco - Sede Trelew',
        phone: '2804005635',
        email: 'delegacion.unpsjb-trelew@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: [
          'Universidad Nacional de la Patagonia San Juan Bosco - Sede Trelew',
        ],
      },
      {
        name: 'Santiago Rodríguez Bilej',
        faculty: 'Universidad Nacional del Comahue',
        phone: '3516456091',
        email: 'delegacion.uncomahue@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional del Comahue'],
      },
      {
        name: 'Brian Niz',
        faculty: 'Universidad Nacional del Centro de la Provincia de Buenos Aires - Sede Olavarría',
        phone: '2284516065',
        email: 'delegacion.unicen@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: [
          'Universidad Nacional del Centro de la Provincia de Buenos Aires - Sede Olavarría',
        ],
      },
      {
        name: 'Emiliano Herrera',
        faculty: 'Universidad Nacional del Sur',
        phone: '2932417721',
        email: 'delegacion.uns@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['Universidad Nacional del Sur'],
      },
      {
        name: 'Ángel de León',
        faculty: 'UTN - Facultad Regional Bahía Blanca',
        phone: '2914992004',
        email: 'delegacion.utn-bahia-blanca@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: false,
        managedFaculties: ['UTN - Facultad Regional Bahía Blanca'],
      },
    ],
    faculties: [
      'Universidad Nacional del Sur',
      'UTN - Facultad Regional Bahía Blanca',
      'Universidad Nacional de la Patagonia San Juan Bosco - Sede Comodoro Rivadavia',
      'Universidad Nacional del Comahue',
      'Universidad Nacional del Centro de la Provincia de Buenos Aires - Sede Olavarría',
      'Universidad Nacional de la Patagonia San Juan Bosco - Sede Trelew',
    ],
  },

  Internacional: {
    id: 'Internacional',
    name: 'Internacional',
    vocal: {
      name: 'Sebastián Burgos',
      phone: null, // pendiente de confirmar
      email: 'internacional@coneic2026.com.ar', // pendiente de confirmar
    },
    delegates: [
      {
        name: 'Sebastián Burgos',
        faculty: 'Internacional',
        phone: null, // pendiente de confirmar
        email: 'internacional@coneic2026.com.ar', // pendiente de confirmar
        isRegionalFallback: true,
        managedFaculties: ['Internacional'],
      },
    ],
    faculties: ['Internacional'],
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Finds which filial a faculty belongs to. Returns the filial object or null. */
export function getFilialForFaculty(faculty) {
  for (const filial of Object.values(FILIALES)) {
    if (filial.faculties.includes(faculty)) return filial;
  }
  return null; // "Otra" / unknown
}

/**
 * Returns the contact for international students.
 */
export function getContactForInternational() {
  const filial = FILIALES['Internacional'];
  const delegate = filial.delegates[0];
  return { ...delegate, filialName: filial.name, isVocal: false };
}

/**
 * Returns the delegate or vocal contact responsible for a given faculty.
 * Priority: specific delegate → regional fallback delegate → vocal.
 */
export function getContactForFaculty(faculty) {
  if (faculty === 'Internacional') return getContactForInternational();

  const filial = getFilialForFaculty(faculty);

  if (!filial) {
    // Faculty not in our list → use generic ANEIC contact
    return {
      name: 'Secretaría ANEIC Argentina',
      email: 'secretaria@aneic.org.ar',
      isVocal: true,
      filialName: 'ANEIC Nacional',
    };
  }

  if (filial.delegates.length > 0) {
    // Look for a delegate that explicitly manages this faculty
    const specific = filial.delegates.find(d => d.managedFaculties.includes(faculty));
    if (specific) return { ...specific, filialName: filial.name, isVocal: false };

    // Fall back to the regional fallback delegate
    const fallback = filial.delegates.find(d => d.isRegionalFallback);
    if (fallback) return { ...fallback, filialName: filial.name, isVocal: false };
  }

  // No delegate at all → return vocal
  return { ...filial.vocal, filialName: filial.name, isVocal: true };
}

/**
 * Returns ALL faculties managed by a given delegate email.
 * Used by the delegate dashboard to show multi-faculty registrations.
 */
export function getManagedFacultiesForDelegate(email) {
  for (const filial of Object.values(FILIALES)) {
    const delegate = filial.delegates.find(d => d.email === email);
    if (delegate) return { delegate, filial, faculties: delegate.managedFaculties };
  }
  return null;
}

/** All faculty names flat list, used in form dropdowns. */
export const ALL_FACULTIES_BY_REGION = Object.values(FILIALES).map(f => ({
  region: f.name,
  faculties: f.faculties,
}));

export const PAYMENT_AMOUNTS = [100000, 55000];

// ── Province → Filial mapping (for "Otra" faculty path) ──────────────────────

export const ARGENTINIAN_PROVINCES = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Ciudad Autónoma de Buenos Aires',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

/** Maps each Argentine province to the ANEIC filial id that covers it. */
const PROVINCE_TO_FILIAL_ID = {
  'Buenos Aires':                    'Este',
  'Ciudad Autónoma de Buenos Aires': 'Este',
  'Entre Ríos':                      'Centro',
  'Santa Fe':                        'Centro',
  'Catamarca':                       'Norte',
  'Chaco':                           'Norte',
  'Corrientes':                      'Norte',
  'Formosa':                         'Norte',
  'Jujuy':                           'Norte',
  'Misiones':                        'Norte',
  'Salta':                           'Norte',
  'Santiago del Estero':             'Norte',
  'Tucumán':                         'Norte',
  'Córdoba':                         'Oeste',
  'La Rioja':                        'Oeste',
  'Mendoza':                         'Oeste',
  'San Juan':                        'Oeste',
  'San Luis':                        'Oeste',
  'Chubut':                          'Sur',
  'La Pampa':                        'Sur',
  'Neuquén':                         'Sur',
  'Río Negro':                       'Sur',
  'Santa Cruz':                      'Sur',
  'Tierra del Fuego':                'Sur',
};

export const INTERNATIONAL_COUNTRIES = [
  'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela',
  'México', 'Costa Rica', 'Cuba', 'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panamá', 'República Dominicana',
  'España', 'Otro país',
];

/**
 * Returns the delegate/vocal contact for a given Argentine province.
 * Follows the same priority chain as getContactForFaculty.
 */
export function getContactForProvince(province) {
  const filialId = PROVINCE_TO_FILIAL_ID[province];
  if (!filialId) {
    return {
      name: 'Secretaría ANEIC Argentina',
      email: 'secretaria@aneic.org.ar',
      isVocal: true,
      filialName: 'ANEIC Nacional',
    };
  }
  const filial = FILIALES[filialId];
  if (filial.delegates.length > 0) {
    const fallback = filial.delegates.find(d => d.isRegionalFallback);
    if (fallback) return { ...fallback, filialName: filial.name, isVocal: false };
  }
  return { ...filial.vocal, filialName: filial.name, isVocal: true };
}
