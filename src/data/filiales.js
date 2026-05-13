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
    delegates: [],  // pendiente de designación
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
        name: 'Delegado/a UTN FRBA',
        faculty: 'UTN - Facultad Regional Buenos Aires',
        email: 'delegate@frba.utn.edu.ar',
        // Gestiona todas las facultades de la región que no tienen delegado propio
        isRegionalFallback: true,
        managedFaculties: [
          'UTN - Facultad Regional Buenos Aires',
          'UTN - Facultad Regional Avellaneda',
          'Universidad de Buenos Aires',
          'Universidad de Belgrano',
          'Universidad Católica Argentina',
          'Universidad de la Defensa Nacional',
          'UTN - Facultad Regional Concepción del Uruguay',
          'UTN - Facultad Regional Concordia',
          'Universidad Nacional de la Matanza',
          'Universidad Nacional de La Plata',
          'UTN - Facultad Regional La Plata',
          'Universidad Nacional de Morón',
        ],
      },
      {
        name: 'Delegado/a UTN FRGP',
        faculty: 'UTN - Facultad Regional General Pacheco',
        email: 'delegate@frgp.utn.edu.ar',
        isRegionalFallback: false,
        managedFaculties: [
          'UTN - Facultad Regional General Pacheco',
        ],
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
    delegates: [],  // pendiente de designación
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
    delegates: [],  // pendiente de designación
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
    delegates: [],  // pendiente de designación
    faculties: [
      'Universidad Nacional del Sur',
      'UTN - Facultad Regional Bahía Blanca',
      'Universidad Nacional de la Patagonia San Juan Bosco - Sede Comodoro Rivadavia',
      'Universidad Nacional del Comahue',
      'Universidad Nacional del Centro de la Provincia de Buenos Aires - Sede Olavarría',
      'Universidad Nacional de la Patagonia San Juan Bosco - Sede Trelew',
    ],
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
 * Returns the delegate or vocal contact responsible for a given faculty.
 * Priority: specific delegate → regional fallback delegate → vocal.
 */
export function getContactForFaculty(faculty) {
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
