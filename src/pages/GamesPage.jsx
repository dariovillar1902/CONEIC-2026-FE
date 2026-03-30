const GamesPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-red to-complementary-gold font-title mb-4 animate-pulse">
                    CONEIC GAMES
                </h2>
                <p className="text-gray-600 font-subtitle text-xl">¡Participá y ganá premios increíbles de nuestros sponsors!</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
                {/* Raffle Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-2 transition duration-500 border-4 border-complementary-gold">
                    <div className="bg-complementary-gold p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 animate-pulse"></div>
                        <span className="text-6xl mb-4 block">🎟️</span>
                        <h3 className="text-3xl font-bold text-institutional font-title uppercase tracking-widest relative z-10">Gran Sorteo Final</h3>
                        <p className="font-bold text-institutional/80 mt-2 relative z-10">Viernes 20 - Cena de Gala</p>
                    </div>
                    <div className="p-8 text-center space-y-6">
                        <p className="text-gray-600 font-body text-lg">
                            Participás automáticamente con tu entrada. ¡Premios sorpresa incluyendo tablets, becas y kits de ingeniería!
                        </p>
                        <div className="bg-gray-100 p-4 rounded-xl inline-block">
                             <p className="text-xs uppercase text-gray-500 font-bold mb-1">Tu número de sorteo</p>
                             <p className="text-3xl font-mono font-bold text-institutional tracking-[0.5em]">8492</p>
                        </div>
                        <button className="w-full bg-institutional text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-900 transition shadow-lg">
                            Ver mis chances
                        </button>
                    </div>
                </div>

                {/* Question Game Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-2 transition duration-500 border-4 border-primary-blue">
                    <div className="bg-primary-blue p-8 text-center text-white relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 animate-pulse delay-100"></div>
                        <span className="text-6xl mb-4 block">🧠</span>
                        <h3 className="text-3xl font-bold font-title uppercase tracking-widest relative z-10">Trivia Ingeniera</h3>
                        <p className="font-bold text-white/80 mt-2 relative z-10">Desafía tu conocimiento</p>
                    </div>
                    <div className="p-8 text-center space-y-6">
                        <p className="text-gray-600 font-body text-lg">
                            Respondé correctamente 5 preguntas de ingeniería civil y ganá merchandising oficial al instante.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-xl inline-block w-full">
                             <div className="flex justify-between text-sm font-bold text-primary-blue mb-2">
                                <span>Progreso Diario</span>
                                <span>2/5</span>
                             </div>
                             <div className="w-full bg-blue-200 rounded-full h-2.5">
                                <div className="bg-primary-blue h-2.5 rounded-full" style={{ width: '40%' }}></div>
                             </div>
                        </div>
                        <button className="w-full bg-gradient-to-r from-primary-blue to-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:shadow-xl hover:shadow-blue-500/30 transition shadow-lg ring-offset-2 ring-primary-blue">
                            Jugar Ahora
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamesPage;
