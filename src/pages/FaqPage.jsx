import { useState } from 'react';

const FAQS = [
  {
    q: '¿Qué documentación necesito entregar al momento de pre-inscribirme?',
    a: 'Es importante que tengas a mano tu información personal (número de DNI, Obra social) y tu certificado de alumno regular en PDF o JPG. Te invitamos a conocer el instructivo de inscripción, donde verás un paso a paso de cómo seguir el proceso.',
  },
  {
    q: '¿Qué es un delegado y por qué tengo que hablar con él?',
    a: 'El delegado es tu nexo directo con la organización del congreso. Su rol es verificar que seas estudiante de la filial y gestionar el cobro de tu inscripción de forma segura. Además, será tu representante y referente durante el congreso, con quien podrás aclarar las consultas que te surjan.',
  },
  {
    q: '¿Cómo encuentro a mi delegado?',
    a: 'Una vez completado el formulario de inscripción, se te informará quién será el/la responsable de tu filial, junto con sus datos de contacto.',
  },
  {
    q: 'Ya completé el formulario y me apareció el cartel de "Solicitud Enviada", ¿ya tengo mi lugar asegurado?',
    a: 'No. Ese cartel indica que tus datos fueron recibidos. El cupo solo se confirma una vez que se haya habilitado tu inscripción y se registra el pago total de la misma.',
  },
  {
    q: '¿Cuánto tiempo tengo que esperar a que el delegado me contacte?',
    a: 'Para agilizar el proceso, te recomendamos que seas vos quien inicie el contacto con tu filial. Sin embargo, recordá que, antes de continuar con el proceso, se deberá habilitar tu inscripción. Por eso, te recomendamos esperar a recibir el mail de confirmación de habilitación antes de comunicarte para coordinar los próximos pasos de la inscripción. De esta manera, evitás depender de tiempos de espera externos y el proceso resulta más ágil para ambas partes.',
  },
  {
    q: 'Mi universidad no aparece en el desplegable, ¿qué hago?',
    a: 'Si tu facultad no tiene una filial activa en ANEIC, contáctate directamente con la cuenta oficial del CoNEIC XVIII por mensaje privado para que te asignemos una filial cercana o te informemos los pasos a seguir.',
  },
  {
    q: '¿Qué pasa si mi delegado no me responde?',
    a: 'Dales un margen de 48-72 horas hábiles. Si pasado ese tiempo no tenés respuesta, escribinos para que podamos dar aviso a la Secretaría de Eventos y regularizar tu situación.',
  },
  {
    q: '¿Qué pasa si mi universidad ya no tiene cupos disponibles?',
    a: 'Cada universidad tiene un cupo asignado. El orden de prioridad será seleccionado en función de tu actividad en tu filial. Si los cupos se llenan, quedarán en lista de espera para poder participar.',
  },
  {
    q: '¿Qué pasa si me equivoco en un dato del formulario?',
    a: 'Informale a tu delegado sobre la confusión. De esta manera podremos resolverlo antes del Congreso.',
  },
  {
    q: 'No me llegó el mail de preinscripción, ¿qué hago?',
    a: 'Revisá la casilla de SPAM, o correo no deseado. Si sigue sin aparecer en el transcurso del día, contactate con nosotros para poder asesorarte.',
  },
  {
    q: '¿Qué métodos de pago se aceptan?',
    a: 'Se acepta únicamente el pago por transferencia. Deberás comunicarte con tu delegado una vez habilitado para coordinar el pago.',
  },
  {
    q: '¿Se puede pagar en cuotas?',
    a: 'Sí, dependiendo de la etapa en la que te pre-incribas, podrás pagar en una o dos cuotas. Recordá que hasta que el segundo pago no sea recibido y registrado en nuestro sistema, la inscripción continuará figurando como pendiente de confirmación.',
  },
  {
    q: '¿Qué pasa si pago la inscripción pero no puedo asistir?',
    a: 'Podés transferir su inscripción a otra persona. La nueva persona participante deberá ser previamente habilitada, a fin de garantizar el cumplimiento de los criterios de prioridad y cupos establecidos para cada delegación. Recordá que queda prohibida la reventa de cupos de inscripción y que los pagos no son reembolsables en ninguna circunstancia.',
  },
  {
    q: '¿Qué pasa si me preinscribí pero no quedé seleccionado?',
    a: 'Estás en lista de espera para la próxima instancia. Es importante que no te vuelvas a preinscribir, ya que tu nombre figura en el sistema.',
  },
];

const FaqItem = ({ item, isOpen, onToggle }) => (
  <div className="border border-gray-200 rounded-2xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-complementary-light transition-colors"
    >
      <span className="font-bold text-institutional font-title pr-4 text-sm md:text-base leading-snug">
        {item.q}
      </span>
      <svg
        className={`w-5 h-5 flex-shrink-0 text-complementary-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
    >
      <div className="px-6 pb-5 pt-1 bg-white border-t border-gray-100">
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.a}</p>
      </div>
    </div>
  </div>
);

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <div className="min-h-screen bg-complementary-light pt-20 font-body">

      {/* Header */}
      <div className="bg-institutional text-white py-16 px-4 text-center">
        <span className="inline-block text-complementary-gold font-bold tracking-widest uppercase text-sm mb-3">
          Ayuda
        </span>
        <h1 className="text-4xl md:text-5xl font-bold font-title mb-4">
          Preguntas Frecuentes
        </h1>
        <p className="text-gray-300 font-subtitle text-lg max-w-xl mx-auto">
          Todo lo que necesitás saber sobre delegados, inscripción y pagos.
        </p>
      </div>

      {/* FAQ list */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        {/* Delegates section */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-complementary-gold mb-4">
          Sobre Delegados
        </h2>
        <div className="space-y-3 mb-10">
          {FAQS.slice(0, 10).map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Payments section */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-complementary-gold mb-4">
          Sobre Pagos e Inscripción
        </h2>
        <div className="space-y-3 mb-12">
          {FAQS.slice(10).map((item, i) => {
            const idx = i + 10;
            return (
              <FaqItem
                key={idx}
                item={item}
                isOpen={openIndex === idx}
                onToggle={() => toggle(idx)}
              />
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
          <p className="text-institutional font-bold font-title text-lg mb-2">¿Tenés otra consulta?</p>
          <p className="text-gray-500 text-sm mb-4">
            Si no encontraste lo que buscabas, escribinos y te respondemos a la brevedad.
          </p>
          <a
            href="mailto:coneic.argentina@gmail.com"
            className="inline-flex items-center gap-2 bg-institutional text-white font-bold px-7 py-3 rounded-full hover:bg-primary-red transition-colors shadow-sm text-sm uppercase tracking-widest"
          >
            Contactar
          </a>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
