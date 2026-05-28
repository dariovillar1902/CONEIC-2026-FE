import { useState } from 'react';

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII'];

// Ordered most-recent → oldest for display
const PREV_EDITIONS = [
  { edition: 17, year: 2025, city: 'San Rafael' },
  { edition: 16, year: 2024, city: 'Córdoba' },
  { edition: 15, year: 2023, city: 'Corrientes' },
  { edition: 14, year: 2022, city: 'Rosario' },
  { edition: 13, year: 2021, city: 'La Plata' },
  { edition: 12, year: 2019, city: 'Tucumán' },
  { edition: 11, year: 2018, city: 'La Plata' },
  { edition: 10, year: 2017, city: 'Neuquén' },
  { edition: 9,  year: 2016, city: 'Mendoza' },
  { edition: 8,  year: 2015, city: 'San Juan' },
  { edition: 7,  year: 2014, city: 'Córdoba' },
  { edition: 6,  year: 2013, city: 'Tucumán' },
  { edition: 5,  year: 2012, city: 'Rosario' },
  { edition: 4,  year: 2011, city: 'Buenos Aires' },
  { edition: 3,  year: 2010, city: 'Mendoza' },
  { edition: 2,  year: 2009, city: 'Santa Fe' },
  { edition: 1,  year: 2008, city: 'Rosario' },
];

// Rotate through a set of elegant palette backgrounds
const CARD_PALETTES = [
  { bg: 'bg-institutional',     text: 'text-white',             numColor: 'text-complementary-gold' },
  { bg: 'bg-primary-red',       text: 'text-white',             numColor: 'text-white/70' },
  { bg: 'bg-slate-800',         text: 'text-white',             numColor: 'text-sky-300' },
  { bg: 'bg-indigo-900',        text: 'text-white',             numColor: 'text-indigo-300' },
  { bg: 'bg-emerald-900',       text: 'text-white',             numColor: 'text-emerald-300' },
  { bg: 'bg-amber-800',         text: 'text-white',             numColor: 'text-amber-300' },
];

const EditionCard = ({ item }) => {
  const palette = CARD_PALETTES[(item.edition - 1) % CARD_PALETTES.length];
  return (
    <div className={`${palette.bg} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col`}>
      {/* Number block */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-4">
        <span className={`font-title font-black leading-none select-none ${palette.numColor}`}
          style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
          {ROMAN[item.edition - 1]}
        </span>
        <span className={`${palette.text} font-title font-bold text-lg mt-1 tracking-widest uppercase`}>
          CONEIC
        </span>
      </div>
      {/* Info strip */}
      <div className="bg-black/20 px-5 py-3 text-center">
        <p className={`${palette.text} font-bold text-sm tracking-wide`}>{item.year}</p>
        {item.city && (
          <p className={`${palette.text} text-xs opacity-80 mt-0.5`}>{item.city}</p>
        )}
      </div>
    </div>
  );
};

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-complementary-light pt-20 font-body">

      {/* Current edition — coming soon */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg className="w-12 h-12 text-complementary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-title text-institutional mb-4 text-center">
          Galería
        </h1>
        <div className="inline-flex items-center gap-2 bg-complementary-gold/20 border border-complementary-gold/40 text-institutional px-5 py-2 rounded-full font-bold text-sm uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-complementary-gold animate-pulse"></span>
          XVIII CONEIC — Próximamente
        </div>
        <p className="text-gray-500 font-body text-lg max-w-md mx-auto text-center">
          Acá compartiremos los mejores momentos del XVIII&nbsp;CONEIC. ¡Volvé pronto!
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mx-4 md:mx-auto md:max-w-7xl"></div>

      {/* Previous editions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-complementary-gold font-bold tracking-widest uppercase text-sm">Historia del congreso</span>
          <h2 className="text-3xl md:text-4xl font-bold font-title text-institutional mt-2">
            Ediciones Anteriores
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Más de 17 años reuniendo a los mejores estudiantes de ingeniería civil de&nbsp;Argentina.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {PREV_EDITIONS.map((item) => (
            <EditionCard key={item.edition} item={item} />
          ))}
        </div>

        {/* Link to ANEIC archive */}
        <div className="mt-10 text-center">
          <a
            href="https://sites.google.com/view/aneicarg/eventos/congreso-nacional"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-institutional text-white font-bold px-8 py-3 rounded-full hover:bg-primary-red transition-colors shadow-md uppercase tracking-widest text-sm"
          >
            Ver todas las ediciones en ANEIC Argentina
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  );
};

export default GalleryPage;
