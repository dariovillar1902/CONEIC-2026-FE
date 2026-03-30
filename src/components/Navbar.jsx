import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check if we are on homepage to handle transparency
    const isHome = location.pathname === '/';
    // If not home, always use "scrolled" style (solid background)
    const effectiveScrolled = scrolled || !isHome;

    const navLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Cronograma', href: '/schedule' },
        { name: 'Actividades', href: '/activities' }, // Or public info
        { name: 'Sedes', href: '/venues' },
        { name: 'Juegos', href: '/games' },
        { name: 'Galería', href: '/gallery' },
        { name: 'Subcomisiones', href: '/subcomisiones' },
        { name: 'Sobre Nosotros', href: '/about' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${effectiveScrolled ? 'bg-institutional/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                         <Link to="/" className="flex items-center gap-3">
                             <img src="/assets/LOGO_H-CONEIC-FULL-BLANCO.png" className="h-10 w-auto" alt="CONEIC Logo" />
                             {/* Text hidden on mobile or redundant if logo has text? Logo has text. So maybe hide text span or keep for SEO/Accessibility but visually hidden? 
                                 The file is LOGO_H... (Horizontal). It likely contains the text 'CONEIC'. 
                                 Let's keep the text for now but if the logo has text, we might remove the span. 
                                 Assuming 'FULL' means symbol + text.
                             */}
                         </Link>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.href} 
                                className={`font-subtitle text-xs font-bold uppercase tracking-widest transition-colors duration-300 hover:text-complementary-gold ${effectiveScrolled ? 'text-gray-300' : 'text-white drop-shadow-sm'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link 
                            to="/login" 
                            className="bg-primary-red text-white py-2 px-6 rounded-full font-bold font-subtitle text-xs uppercase tracking-widest shadow-md hover:bg-red-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            Ingresar
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-complementary-gold focus:outline-none transition"
                        >
                            <svg className="h-8 w-8 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-institutional border-t border-gray-800 absolute w-full shadow-2xl animate-fade-in-down h-screen">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 rounded-lg text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 font-subtitle uppercase tracking-widest transition"
                            >
                                {link.name}
                            </Link>
                        ))}
                         <Link 
                            to="/login" 
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 mt-4 text-center rounded-lg text-sm font-bold bg-primary-red text-white hover:bg-red-700 font-subtitle uppercase tracking-widest transition"
                        >
                            Ingresar
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
