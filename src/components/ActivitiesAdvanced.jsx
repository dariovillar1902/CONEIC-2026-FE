import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const activitiesData = {
  "evento": "CoNEIC XVIII Buenos Aires 2026",
  "bloques": [
    {
      "id": 1,
      "nombre": "Charlas Simultáneas: Primer Bloque",
      "horario": "Sábado 14/03 - 09:00 hs",
      "actividades": [
        { "id": "1.1", "titulo": "¿Cómo implementar un laboratorio BIM en mi universidad?", "disertante": "Joel Oggero" },
        { "id": "1.2", "titulo": "Soluciones de Valor Agregado: Innovación en la obra civil de CABA", "disertante": "ArcelorMittal Acindar" },
        { "id": "1.3", "titulo": "Transformación Digital en AEC: Entornos BIM en Buenos Aires", "disertante": "BIM FORUM ARGENTINA" }
      ]
    },
    {
      "id": 2,
      "nombre": "Charlas Simultáneas: Segundo Bloque",
      "horario": "Sábado 14/03 - 11:00 hs",
      "actividades": [
        { "id": "2.1", "titulo": "Combo: Entre lo fugaz y lo eterno / Eficiencia Energética", "disertantes": ["Arq. Recabarren", "Arq. López", "Mgtr. Vanoli"] },
        { "id": "2.4", "titulo": "Mi camino del aula a trabajar en movilidad urbana", "disertante": "Mgtr. Ing. Catalina Vanoli" }
      ]
    },
    {
      "id": 3,
      "nombre": "Visitas Técnicas (Buenos Aires 2026)",
      "horario": "Domingo 15/03 - 14:00 hs",
      "actividades": [
        { "id": "3.1", "titulo": "Estación Depuradora Riachuelo", "epp": "Casco y zapato de seguridad", "descripcion": "Visita a la megaobra de saneamiento." },
        { "id": "3.4", "titulo": "Túneles y Estaciones: Línea F", "epp": "Casco y zapato de seguridad", "descripcion": "Análisis in situ de métodos constructivos." },
        { "id": "3.13", "titulo": "Planta de Cemento y Hormigón (Holcim)", "epp": "Casco, zapato, chaleco y protección ocular" },
        { "id": "3.16", "titulo": "Obras del Viaducto Belgrano Sur", "epp": "Calzado cerrado, casco y chaleco" }
      ]
    },
    {
      "id": 4,
      "nombre": "Compromiso Social y Medio Ambiente",
      "horario": "Domingo 15/03 - 17:00 hs",
      "actividades": [
        { "id": "4.1", "titulo": "WORKSHOP: Género y Disidencias en Ingeniería", "responsables": "Agustina Gaggio, Ing. Lucila Martinazzo" },
        { "id": "4.4", "titulo": "Taller de Instalaciones y Proceso Social", "organiza": "Ingeniería Sin Fronteras Argentina" },
        { "id": "4.6", "titulo": "Centros de Transferencia de Residuos en AMBA", "disertante": "Ing. Sergio Nirich" }
      ]
    }
  ]
};

const ActivitiesAdvanced = () => {
    const { user } = useAuth();
    // State map: { blockId: activityId }
    const [selections, setSelections] = useState({});

    const handleSelect = (blockId, activityId) => {
        setSelections(prev => ({
            ...prev,
            [blockId]: activityId // This enforces 1 per block logic automatically (Radio behavior)
        }));
    };

    const isSelected = (blockId, activityId) => selections[blockId] === activityId;

    if (!user) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-md shadow-sm text-center">
                <h3 className="text-xl font-bold text-yellow-800 mb-2 font-title">Inscripciones Cerradas para Visitantes</h3>
                <p className="text-yellow-700 font-body">Debes iniciar sesión como <strong>Asistente</strong> para poder elegir tus actividades.</p>
                <div className="mt-6 opacity-50 pointer-events-none filter blur-[2px] transform scale-95">
                     {/* Preview of interface (blurred) */}
                     <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (user.role === 'non_enrolled') {
         return (
             <div className="bg-red-50 border-l-4 border-red-400 p-8 rounded-md shadow-sm text-center">
                 <h3 className="text-xl font-bold text-red-800 mb-2 font-title">Acceso Restringido</h3>
                 <p className="text-red-700 font-body">Tu usuario no tiene permisos para inscribirse a actividades. Contacta a soporte.</p>
             </div>
         );
    }

    return (
        <div className="space-y-12">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-800 text-lg mb-2 font-title">Instrucciones</h3>
                <ul className="list-disc list-inside text-blue-700 font-body space-y-1">
                    <li>Elige <strong>una actividad por bloque</strong>.</li>
                    <li>Verifica el horario para no superponer intereses.</li>
                    <li>Las visitas técnicas requieren EPP (Elementos de Protección Personal).</li>
                </ul>
            </div>

            {activitiesData.bloques.map((block) => (
                <div key={block.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-t-8 border-institutional">
                    <div className="bg-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-200">
                        <h3 className="text-xl font-bold text-institutional font-title">{block.nombre}</h3>
                        <span className="text-sm font-bold text-primary-red bg-red-50 px-3 py-1 rounded-full uppercase tracking-wide mt-2 md:mt-0 font-subtitle">{block.horario}</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {block.actividades.map((act) => (
                            <div 
                                key={act.id} 
                                onClick={() => handleSelect(block.id, act.id)}
                                className={`
                                    relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 transform group
                                    ${isSelected(block.id, act.id) 
                                        ? 'border-primary-green bg-green-50/50 shadow-lg scale-[1.02] ring-2 ring-primary-green/20' 
                                        : 'border-gray-100 hover:border-primary-blue/30 hover:shadow-xl hover:-translate-y-1 bg-white'
                                    }
                                `}
                            >
                                {isSelected(block.id, act.id) && (
                                    <div className="absolute -top-3 -right-3 bg-primary-green text-white rounded-full p-1 shadow-md animate-bounce-in">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                )}
                                
                                <h4 className="font-bold text-institutional mb-3 pr-6 font-title text-xl leading-snug group-hover:text-primary-blue transition-colors">{act.titulo}</h4>
                                
                                <div className="space-y-2 mb-4">
                                    {act.disertante && (
                                        <div className="flex items-center text-sm text-gray-600 font-subtitle">
                                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-lg">🎤</span>
                                            <div>
                                                <span className="block text-xs uppercase tracking-wider text-gray-400 font-bold">Disertante</span>
                                                <span className="font-bold text-gray-800">{act.disertante}</span>
                                            </div>
                                        </div>
                                    )}
                                    {act.disertantes && (
                                        <div className="flex items-start text-sm text-gray-600 font-subtitle">
                                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-lg shrink-0">👥</span>
                                            <div>
                                                <span className="block text-xs uppercase tracking-wider text-gray-400 font-bold">Panel</span>
                                                <span className="font-bold text-gray-800 leading-tight">{act.disertantes.join(", ")}</span>
                                            </div>
                                        </div>
                                    )}
                                    {act.responsables && (
                                         <div className="flex items-start text-sm text-gray-600 font-subtitle">
                                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-lg shrink-0">📋</span>
                                            <div>
                                                <span className="block text-xs uppercase tracking-wider text-gray-400 font-bold">Responsable</span>
                                                <span className="font-bold text-gray-800">{act.responsables}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {act.epp && (
                                    <div className="mt-4 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100 flex items-center gap-2">
                                        <span className="text-lg">👷</span>
                                        <span className="text-xs font-bold text-orange-800 font-subtitle uppercase tracking-wide">
                                            Requiere EPP: {act.epp}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-subtitle">
                                        Cupos Limitados
                                    </span>
                                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-colors ${isSelected(block.id, act.id) ? 'bg-primary-green text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary-blue group-hover:text-white'}`}>
                                        {isSelected(block.id, act.id) ? 'Seleccionado' : 'Seleccionar'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            {Object.keys(selections).length > 0 && (
                <div className="sticky bottom-4 mx-auto max-w-xl bg-institutional text-white p-4 rounded-xl shadow-2xl flex justify-between items-center z-50 animate-bounce-in">
                    <div>
                        <p className="font-bold text-lg font-title">Resumen de Selección</p>
                        <p className="text-sm text-gray-300 font-body">{Object.keys(selections).length} actividades seleccionadas</p>
                    </div>
                    <button className="bg-complementary-gold text-institutional px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition shadow-lg font-subtitle uppercase">
                        Confirmar
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivitiesAdvanced;
