/**
 * VisualSchedule — grid estilo tabla de cronograma.
 * Coincide con el diseño de la imagen de referencia:
 *   columnas = días, filas = bloques de actividad, celdas con rowSpan opcionales.
 */

const DAYS = [
  { label: 'MARTES',    date: '4 ago' },
  { label: 'MIÉRCOLES', date: '5 ago' },
  { label: 'JUEVES',    date: '6 ago' },
  { label: 'VIERNES',   date: '7 ago' },
];

/**
 * schedule: array de filas. Cada fila es un array de 4 celdas (una por día).
 * Celda puede ser:
 *   { name, location, span }  → span = rowSpan (default 1)
 *   null                      → celda omitida porque la anterior tiene span > 1
 */
const SCHEDULE = [
  [
    { name: 'Acreditaciones y Apertura', location: 'Auditorio' },
    { name: 'Talleres',                  location: 'Universidad' },
    { name: 'Visitas técnicas',          location: 'Obra / Empresa', span: 2 },
    { name: 'Charlas Magistrales',       location: 'Auditorio' },
  ],
  [
    { name: 'Ponencias Estudiantiles',            location: 'Auditorio' },
    { name: 'Solidarias y Charlas en simultáneo', location: 'Universidad' },
    null,  // ocupado por "Visitas técnicas" de la fila anterior
    { name: 'Charlas Magistrales', location: 'Auditorio' },
  ],
  [
    { name: 'Charlas Magistrales',                location: 'Auditorio' },
    { name: 'Solidarias y Charlas en simultáneo', location: 'Universidad' },
    { name: 'Recreativa',                         location: 'Universidad' },
    { name: 'Acto de cierre',                     location: 'Auditorio' },
  ],
];

const Cell = ({ name, location, span = 1 }) => (
  <td
    rowSpan={span}
    className="border border-gray-200 bg-accent p-4 text-center align-middle"
  >
    <p className="font-bold text-institutional font-title text-sm leading-snug">{name}</p>
    {location && (
      <p className="text-sostenibilidad text-xs font-semibold mt-1">{location}</p>
    )}
  </td>
);

const VisualSchedule = () => (
  <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-200">
    <table className="w-full border-collapse min-w-[560px]">
      <thead>
        <tr>
          {DAYS.map((d) => (
            <th
              key={d.label}
              className="bg-sostenibilidad text-white font-title font-bold uppercase tracking-widest text-sm py-4 px-3 text-center border border-sostenibilidad/40"
            >
              <div>{d.label}</div>
              <div className="text-xs font-normal opacity-75 mt-0.5">{d.date}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SCHEDULE.map((row, rIdx) => (
          <tr key={rIdx}>
            {row.map((cell, cIdx) => {
              if (cell === null) return null;          // omitida por rowSpan superior
              return <Cell key={cIdx} {...cell} />;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default VisualSchedule;
