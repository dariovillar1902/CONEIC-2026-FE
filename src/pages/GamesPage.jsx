const GamesPage = () => {
    return (
        <div className="min-h-screen bg-complementary-light flex items-center justify-center pt-20">
            <div className="text-center px-4">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg className="w-12 h-12 text-complementary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-title text-institutional mb-4">
                    CONEIC Games
                </h1>
                <div className="inline-flex items-center gap-2 bg-complementary-gold/20 border border-complementary-gold/40 text-institutional px-5 py-2 rounded-full font-bold text-sm uppercase tracking-widest mb-6">
                    <span className="w-2 h-2 rounded-full bg-complementary-gold animate-pulse"></span>
                    Próximamente
                </div>
                <p className="text-gray-500 font-body text-lg max-w-md mx-auto">
                    Esta sección estará disponible pronto. ¡Volvé a visitarnos!
                </p>
            </div>
        </div>
    );
};

export default GamesPage;
