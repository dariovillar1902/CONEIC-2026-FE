const AboutPage = () => {
    return (
        <div className="w-full font-body pt-20">

            {/* ¿Te gustaría colaborar? — Banner */}
            <div className="bg-complementary-gold/15 border-b border-complementary-gold/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold font-title text-institutional">¿Te gustaría colaborar?</h2>
                        <p className="text-gray-600 font-body text-sm mt-1">
                            Estamos buscando estudiantes proactivos para formar parte del comité organizador&nbsp;local.
                        </p>
                    </div>
                    <a
                        href="mailto:coneic.argentina@gmail.com"
                        className="flex-shrink-0 bg-institutional text-white px-8 py-3 rounded-full font-bold hover:bg-primary-red transition-colors shadow-md uppercase tracking-widest text-sm"
                    >
                        ¡Postulate Ahora!
                    </a>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-institutional text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1612294068224-b327dfada2ac?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold font-title mb-6 animate-fade-in-down">Sobre CONEIC</h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-200 leading-relaxed font-subtitle">
                        El encuentro <span className="font-bold">nacional</span> más importante de&nbsp;estudiantes
                        <br />de Ingeniería Civil de&nbsp;Argentina.
                    </p>
                    <p className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed font-subtitle mt-3">
                        Innovación, académica y cultura en un solo&nbsp;lugar.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

                {/* Intro & Definition */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <span className="text-complementary-gold font-bold tracking-widest uppercase text-sm">Nuestra Identidad</span>
                        <h2 className="text-4xl font-bold text-institutional font-title">¿Qué es el&nbsp;CONEIC?</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            El <strong className="text-institutional">Congreso Nacional de Estudiantes de Ingeniería Civil</strong> es una actividad académica, social y cultural que reúne anualmente a más de 1.200 estudiantes de todo el país y&nbsp;Latinoamérica.
                            Durante cuatro días, nos convertimos en el epicentro de la ingeniería, exponiendo los últimos avances en tecnología, métodos constructivos y soluciones&nbsp;sostenibles.
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
                        <h2 className="text-4xl font-bold text-institutional font-title mt-2">Actividades del&nbsp;Congreso</h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <ActivityCard
                            icon="🎤"
                            title="Charlas Magistrales"
                            description="Disertaciones de expertos nacionales e internacionales que comparten su visión sobre los grandes desafíos y obras de la ingeniería moderna."
                        />
                        <ActivityCard
                            icon="🏗️"
                            title="Visitas Técnicas"
                            description="Recorridos exclusivos a las obras de infraestructura más emblemáticas de Buenos Aires: Subtes, Rascacielos, Obras Hidráulicas y el Puerto."
                        />
                        <ActivityCard
                            icon="🛠️"
                            title="Talleres Prácticos"
                            description="Espacios de formación 'Hands-On' donde los estudiantes aplican software de cálculo, nuevos materiales y metodologías ágiles."
                        />
                        <ActivityCard
                            icon="🤝"
                            title="Actividad Solidaria"
                            description="Devolvemos a la sociedad parte de lo que recibimos, realizando intervenciones constructivas en comunidades vulnerables de la región."
                        />
                        <ActivityCard
                            icon="🎉"
                            title="Eventos Sociales"
                            description="Fomentamos el networking y la integración federal a través de cenas, peñas y actividades recreativas cada noche."
                        />
                    </div>
                </div>

                {/* Organization */}
                <div className="bg-accent rounded-3xl p-8 md:p-16">
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
                            <h2 className="text-3xl font-bold text-institutional font-title">Hecho por Estudiantes, para&nbsp;Estudiantes</h2>
                            <p className="text-gray-600 text-lg">
                                La organización del XVIII CONEIC está a cargo de la <strong className="text-institutional">Comisión Organizadora</strong>, conformada íntegramente por estudiantes visionarios de la Universidad Tecnológica Nacional — Facultad Regional Buenos&nbsp;Aires.
                            </p>
                            <p className="text-gray-600">
                                Trabajamos de manera voluntaria y profesional durante más de un año para garantizar la excelencia académica y logística del evento, demostrando la capacidad de gestión de la futura generación de&nbsp;ingenieros.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ANEIC Section */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <span className="text-primary-red font-bold tracking-widest uppercase text-sm">La asociación detrás del congreso</span>
                        <h2 className="text-4xl font-bold text-institutional font-title">¿Qué es&nbsp;ANEIC?</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            La <strong className="text-institutional">Asociación Nacional de Estudiantes de Ingeniería Civil</strong> es el organismo que agrupa y representa a los estudiantes de la carrera en toda Argentina.
                            Fundada con el objetivo de unir voces estudiantiles, defender las incumbencias profesionales y promover el intercambio académico entre facultades de todo el&nbsp;país.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            El CONEIC es el evento insignia de ANEIC, organizado anualmente en una sede universitaria distinta, rotando entre las instituciones miembro de la&nbsp;asociación.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <a
                                href="https://www.instagram.com/aneicargentina"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-institutional text-white px-6 py-3 rounded-full font-bold hover:bg-complementary-gold transition-colors shadow-md text-sm uppercase tracking-widest"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                @aneicargentina
                            </a>
                            <a
                                href="/subcomisiones"
                                className="inline-flex items-center gap-2 border-2 border-institutional text-institutional px-6 py-3 rounded-full font-bold hover:bg-institutional hover:text-white transition-colors text-sm uppercase tracking-widest"
                            >
                                Ver Subcomisiones
                            </a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-institutional/10 rounded-2xl p-6 text-center border border-institutional/20">
                            <h4 className="text-3xl font-bold text-institutional font-title">25+</h4>
                            <p className="text-gray-500 text-sm uppercase mt-1 tracking-wide">Universidades miembro</p>
                        </div>
                        <div className="bg-institutional/10 rounded-2xl p-6 text-center border border-institutional/20">
                            <h4 className="text-3xl font-bold text-institutional font-title">18+</h4>
                            <p className="text-gray-500 text-sm uppercase mt-1 tracking-wide">Años de historia</p>
                        </div>
                        <div className="bg-institutional/10 rounded-2xl p-6 text-center border border-institutional/20">
                            <h4 className="text-3xl font-bold text-institutional font-title">8</h4>
                            <p className="text-gray-500 text-sm uppercase mt-1 tracking-wide">Subcomisiones activas</p>
                        </div>
                        <div className="bg-complementary-gold/15 rounded-2xl p-6 text-center border border-complementary-gold/30">
                            <h4 className="text-3xl font-bold text-institutional font-title">1200+</h4>
                            <p className="text-gray-500 text-sm uppercase mt-1 tracking-wide">Estudiantes representados</p>
                        </div>
                    </div>
                </div>

                {/* CTA Sponsors */}
                <div className="bg-institutional text-white rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-institutional opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-105 transition duration-1000"></div>
                     <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-3xl font-bold font-title mb-6">¿Su empresa busca talento&nbsp;joven?</h3>
                        <p className="text-gray-300 mb-8 font-subtitle text-lg">
                            Participe como sponsor y posicione su marca frente a los 1.200 mejores promedios y líderes estudiantiles de ingeniería civil del&nbsp;país.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="mailto:patrociniosconeic@gmail.com" className="bg-white text-institutional font-bold px-8 py-4 rounded-full hover:bg-complementary-gold hover:text-white transition transform hover:-translate-y-1 shadow-lg uppercase tracking-widest text-sm">
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
    <div className="bg-accent p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group w-full md:w-[calc(33.333%-1.5rem)]">
        <div className="text-4xl mb-6 bg-white w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">{icon}</div>
        <h3 className="text-xl font-bold text-institutional font-title mb-3 group-hover:text-primary-blue transition-colors">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

export default AboutPage;
