import { useState, useEffect } from 'react';

const Schedule = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/activities`)
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching activities:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-institutional border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-subtitle">Cargando cronograma...</p>
      </div>
    );
  }

  if (error || activities.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-subtitle text-lg">El cronograma estará disponible próximamente.</p>
      </div>
    );
  }

  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.startTime).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  const sortedDays = Object.keys(groupedActivities).sort((a, b) => {
      const actA = groupedActivities[a][0];
      const actB = groupedActivities[b][0];
      return new Date(actA.startTime) - new Date(actB.startTime);
  });

  return (
    <div className="max-w-5xl mx-auto">
        {sortedDays.map(day => (
            <div key={day} className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-institutional font-title capitalize bg-accent px-4 py-2 rounded-lg shadow-sm border border-gray-200 inline-block">
                        {day}
                    </h2>
                    <div className="h-0.5 flex-grow bg-gray-200"></div>
                </div>

                <div className="space-y-4">
                    {groupedActivities[day]
                        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                        .map((activity) => (
                        <div key={activity.id} className="relative pl-8 md:pl-0">
                            {/* Timeline Line (Desktop) */}
                            <div className="hidden md:block absolute left-[148px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div className="hidden md:block absolute left-[142px] top-6 w-3.5 h-3.5 bg-institutional rounded-full border-2 border-white shadow"></div>

                            <div className="flex flex-col md:flex-row md:gap-12 group">
                                {/* Time Column — prominent */}
                                <div className="md:w-32 md:text-right flex-shrink-0 pt-4">
                                    <span className="block text-2xl font-bold text-institutional font-title">
                                        {new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="text-sm text-gray-400 font-subtitle">
                                        a {new Date(activity.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* Content Card */}
                                <div className="flex-grow bg-accent border-l-4 border-complementary-gold md:border-l-0 md:border md:border-gray-200 shadow-md hover:shadow-xl transition-all p-6 rounded-r-xl md:rounded-xl relative">
                                    {/* Location — prominent at top, clickable to Google Maps */}
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mb-3 text-sm font-bold text-primary-red uppercase tracking-wider bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full w-fit transition-colors"
                                    >
                                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {activity.location}
                                    </a>

                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-institutional font-title group-hover:text-primary-blue transition-colors">
                                                {activity.title}
                                            </h3>
                                            <p className="text-gray-600 mt-2 font-body leading-relaxed text-sm">
                                                {activity.description}
                                            </p>
                                        </div>

                                        {activity.speaker && (
                                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 flex-shrink-0">
                                                 <img src={activity.speaker.imageUrl} alt={activity.speaker.name} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                                                 <div>
                                                    <p className="text-xs font-bold text-gray-900 leading-tight">{activity.speaker.name}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{activity.speaker.title}</p>
                                                 </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
  );
};

export default Schedule;
