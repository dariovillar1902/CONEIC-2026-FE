import { useState } from 'react';
import ProgramDetail, { useProgram } from './ProgramDetail';
import { PROGRAM_DAYS } from '../data/programDefaults';

/**
 * VisualSchedule — grid estilo tabla de cronograma.
 * Coincide con el diseño de la imagen de referencia:
 *   columnas = días, filas = bloques de actividad, celdas con rowSpan opcionales.
 */

const DAYS = [
  { label: 'MARTES',    date: '13 oct' },
  { label: 'MIÉRCOLES', date: '14 oct' },
  { label: 'JUEVES',    date: '15 oct' },
  { label: 'VIERNES',   date: '16 oct' },
];

/**
 * schedule: array de filas. Cada fila es un array de 4 celdas (una por día).
 * Celda puede ser:
 *   { name, location, span }  → span = rowSpan (default 1)
 *   null                      → celda omitida porque la anterior tiene span > 1
 */
const SCHEDULE = [
  // Bloque mañana
  [
    { name: 'Acreditaciones y Apertura',  location: 'Auditorio Belgrano' },
    { name: 'Talleres y Simultáneas',     location: '' },
    { name: 'Visitas Técnicas',           location: '', span: 2 },
    { name: 'Charlas Magistrales',        location: 'Auditorio Belgrano' },
  ],
  // Bloque tarde temprano
  [
    { name: 'Ponencias Estudiantiles',         location: 'Auditorio Belgrano' },
    { name: 'Solidarias – Compromiso Social',  location: '' },
    null,
    { name: 'Charlas Magistrales',             location: 'Auditorio Belgrano' },
  ],
  // Bloque tarde
  [
    { name: 'Charlas Magistrales',             location: 'Auditorio Belgrano' },
    { name: 'Solidarias – Compromiso Social',  location: '' },
    { name: 'Asamblea ANEIC + Recreativa',     location: 'UTN Campus' },
    { name: 'Acto de Cierre',                  location: 'Auditorio Belgrano' },
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

const ProgramSection = () => {
  const program = useProgram();
  const [day, setDay] = useState('martes');
  if (!program) return null;
  return (
    <section className="mt-10">
      <h3 className="text-xl font-bold text-institutional font-title mb-1">Programa detallado</h3>
      <p className="text-sm text-gray-500 mb-4">Charlas Magistrales y Ponencias Estudiantiles, en orden de presentación.</p>
      <div className="flex gap-2 mb-4 flex-wrap">
        {PROGRAM_DAYS.map((d) => (
          <button key={d.key} onClick={() => setDay(d.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${day === d.key ? 'bg-institutional text-white' : 'bg-gray-100 text-gray-600'}`}>
            {d.label}
          </button>
        ))}
      </div>
      <ProgramDetail items={program[day]} />
    </section>
  );
};

const VisualSchedule = () => (
  <>
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
  <ProgramSection />
  </>
);

export default VisualSchedule;
