const AboutPage = () => {
    return (
        <div className="w-full font-body pt-20">
            {/* Hero Section */}
            <div className="relative bg-institutional text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1612294068224-b327dfada2ac?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold font-title mb-6 animate-fade-in-down">Sobre CONEIC</h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-200 leading-relaxed font-subtitle">
                        El evento anual más importante para los futuros ingenieros civiles de Argentina.
                        <br />Innovación, Académica y Cultura en un solo lugar.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
                
                {/* Intro & Definition */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <span className="text-complementary-gold font-bold tracking-widest uppercase text-sm">Nuestra Identidad</span>
                        <h2 className="text-4xl font-bold text-institutional font-title">¿Qué es el CONEIC?</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            El <strong className="text-institutional">Congreso Nacional de Estudiantes de Ingeniería Civil</strong> es una actividad académica, social y cultural que reúne anualmente a más de 1,200 estudiantes de todo el país y Latinoamérica. 
                            Durante cuatro días, nos convertimos en el epicentro de la ingeniería, exponiendo los últimos avances en tecnología, métodos constructivos y soluciones sostenibles.
                        </p>
                        <div className="flex gap-8 pt-4">
                            <div>
                                <h4 className="text-3xl font-bold text-primary-blue">18+</h4>
                                <p className="text-gray-500 text-sm uppercase">Ediciones</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-primary-blue">25+</h4>
                                <p className="text-gray-500 text-sm uppercase">Universidades</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-primary-blue">1200+</h4>
                                <p className="text-gray-500 text-sm uppercase">Asistentes</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-complementary-gold/20 rounded-2xl transform rotate-3"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000&auto=format&fit=crop" 
                            alt="Auditorio Lleno" 
                            className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover"
                        />
                    </div>
                </div>

                {/* What We Do (Activities) */}
                <div>
                     <div className="text-center mb-12">
                        <span className="text-primary-blue font-bold tracking-widest uppercase text-sm">Experiencia Integral</span>
                        <h2 className="text-4xl font-bold text-institutional font-title mt-2">Actividades del Congreso</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Charlas */}
                        <ActivityCard 
                            icon="🎤"
                            title="Charlas Magistrales" 
                            description="Disertaciones de expertos nacionales e internacionales que comparten su visión sobre los grandes desafíos y obras de la ingeniería moderna."
                        />
                        {/* Visitas */}
                        <ActivityCard 
                            icon="🏗️"
                            title="Visitas Técnicas" 
                            description="Recorridos exclusivos a las obras de infraestructura más emblemáticas de Buenos Aires: Subtes, Rascacielos, Obras Hidráulicas y el Puerto."
                        />
                         {/* Talleres */}
                        <ActivityCard 
                            icon="🛠️"
                            title="Talleres Prácticos" 
                            description="Espacios de formación 'Hands-On' donde los estudiantes aplican software de cálculo, nuevos materiales y metodologías ágiles."
                        />
                         {/* Ponencias */}
                        <ActivityCard 
                            icon="📄"
                            title="Ponencias Estudiantiles" 
                            description="Un espacio para que los futuros profesionales presenten sus trabajos de investigación ante un jurado calificado y sus pares."
                        />
                         {/* Solidarias */}
                        <ActivityCard 
                            icon="🤝"
                            title="Actividad Solidaria" 
                            description="Devolvemos a la sociedad parte de lo que recibimos, realizando intervenciones constructivas en comunidades vulnerables de la región."
                        />
                         {/* Social */}
                        <ActivityCard 
                            icon="🎉"
                            title="Eventos Sociales" 
                            description="Fomentamos el networking y la integración federal a través de cenas, peñas y actividades recreativas cada noche."
                        />
                    </div>
                </div>

                {/* Organization */}
                <div className="bg-gray-50 rounded-3xl p-8 md:p-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                             <img 
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
                                alt="Equipo Organizador" 
                                className="rounded-2xl shadow-lg grayscale hover:grayscale-0 transition duration-500"
                            />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <span className="text-primary-red font-bold tracking-widest uppercase text-sm">Organización</span>
                            <h2 className="text-3xl font-bold text-institutional font-title">Hecho por Estudiantes, para Estudiantes</h2>
                            <p className="text-gray-600 text-lg">
                                La organización del XVIII CONEIC está a cargo de la <strong className="text-institutional">Comisión Organizadora</strong>, conformada íntegramente por estudiantes visionarios de la Universidad Tecnológica Nacional - Facultad Regional Buenos Aires.
                            </p>
                            <p className="text-gray-600">
                                Trabajamos de manera voluntaria y profesional durante más de un año para garantizar la excelencia académica y logística del evento, demostrando la capacidad de gestión de la futura generación de ingenieros.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Sponsors */}
                <div className="bg-institutional text-white rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-institutional opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-105 transition duration-1000"></div>
                     <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-3xl font-bold font-title mb-6">¿Su empresa busca talento joven?</h3>
                        <p className="text-gray-300 mb-8 font-subtitle text-lg">
                            Participe como sponsor y posicione su marca frente a los 1,200 mejores promedios y líderes estudiantiles de ingeniería civil del país.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="mailto:sponsors@coneic2026.com.ar" className="bg-white text-institutional font-bold px-8 py-4 rounded-full hover:bg-complementary-gold hover:text-white transition transform hover:-translate-y-1 shadow-lg uppercase tracking-widest text-sm">
                                Solicitar Brochure
                            </a>
                        </div>
                     </div>
                </div>

            </div>
        </div>
    );
};

const ActivityCard = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div className="text-4xl mb-6 bg-gray-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-bold text-institutional font-title mb-3 group-hover:text-primary-blue transition-colors">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

export default AboutPage;
