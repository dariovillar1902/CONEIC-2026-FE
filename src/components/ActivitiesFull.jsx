import { useState } from 'react';

const ActivitiesFull = () => {
    // Mock data, eventually could come from API
    const activitiesList = [
        { id: 1, title: 'Visita Técnica: Represa', date: 'Viernes 16/10 09:00', type: 'Visita', slots: 30, filled: 15 },
        { id: 2, title: 'Taller de Suelos', date: 'Jueves 15/10 14:00', type: 'Taller', slots: 20, filled: 20 },
        { id: 3, title: 'Recorrido Obra Subte', date: 'Viernes 16/10 11:00', type: 'Visita', slots: 25, filled: 5 },
    ];

    const [selected, setSelected] = useState({});

    const toggleSelection = (id) => {
        setSelected(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activitiesList.map(act => (
                <div key={act.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full font-subtitle ${act.type === 'Visita' ? 'bg-green-100 text-primary-green' : 'bg-yellow-100 text-complementary-gold'}`}>
                                {act.type}
                            </span>
                            <span className="text-sm font-medium text-gray-500 font-subtitle">{act.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-institutional mb-3 font-title">{act.title}</h3>
                        <p className="text-sm text-gray-600 mb-6 font-body">Cupos: <span className="font-bold">{act.filled}</span>/{act.slots}</p>
                        
                        <button 
                            onClick={() => toggleSelection(act.id)}
                            disabled={act.filled >= act.slots && !selected[act.id]}
                            className={`w-full py-3 px-4 rounded-lg font-bold transition-colors font-subtitle uppercase text-sm ${
                                selected[act.id] 
                                    ? 'bg-red-50 text-primary-red border-2 border-primary-red hover:bg-red-100' 
                                    : act.filled >= act.slots 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-primary-blue text-white hover:bg-blue-800 shadow-md hover:shadow-lg'
                            }`}
                        >
                            {selected[act.id] ? 'Cancelar Inscripción' : act.filled >= act.slots ? 'Cupos Agotados' : 'Inscribirse'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivitiesFull;
