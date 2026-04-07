const GalleryPage = () => {
    return (
        <div className="min-h-screen bg-complementary-light flex items-center justify-center pt-20">
            <div className="text-center px-4">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg className="w-12 h-12 text-complementary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-title text-institutional mb-4">
                    Galería
                </h1>
                <div className="inline-flex items-center gap-2 bg-complementary-gold/20 border border-complementary-gold/40 text-institutional px-5 py-2 rounded-full font-bold text-sm uppercase tracking-widest mb-6">
                    <span className="w-2 h-2 rounded-full bg-complementary-gold animate-pulse"></span>
                    Próximamente
                </div>
                <p className="text-gray-500 font-body text-lg max-w-md mx-auto">
                    Acá compartiremos los mejores momentos del XVIII&nbsp;CONEIC. ¡Volvé pronto!
                </p>
            </div>
        </div>
    );
};

export default GalleryPage;
