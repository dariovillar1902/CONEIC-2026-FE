const FaqPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold font-title text-institutional">Preguntas Frecuentes</h1>
        <p className="text-gray-500 font-body text-lg">
          El contenido de esta sección estará disponible pronto.
        </p>
        <p className="text-gray-400 font-body text-sm">
          ¿Tenés alguna consulta urgente? Escribinos a{' '}
          <a
            href="mailto:secretaria@aneic.org.ar"
            className="text-primary-blue underline hover:text-institutional"
          >
            secretaria@aneic.org.ar
          </a>
        </p>
      </div>
    </div>
  );
};

export default FaqPage;
