import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const SECTIONS = [
  {
    id: 'transporte',
    emoji: '🚇',
    title: 'Transporte Público',
    content: [
      {
        subtitle: 'SUBE',
        text: 'La tarjeta SUBE es obligatoria para pagar el transporte en Buenos Aires. Podés cargarla en kioscos, farmacias, estaciones de subte y terminales de colectivo. Se compra en el correo o en puntos habilitados (~$2.000).'
      },
      {
        subtitle: 'Subterráneo (Subte)',
        text: 'Seis líneas (A, B, C, D, E, H) que cubren el centro y zonas clave. Precio aprox. $1.414 por viaje con SUBE. Horario: ~5:30 a 22:30 aprox. Las líneas más útiles para CONEIC: Línea D → Sede Belgrano (estación José Hernández), Línea B → UTN FRBA Medrano (estación Medrano), Línea E → UTN FRBA Campus (estación Plaza de los Virreyes).'
      },
      {
        subtitle: 'Colectivos',
        text: 'Más de 200 líneas cubren toda la ciudad y el Gran Buenos Aires. Precio: ~$800–$1.300 con SUBE. Apps recomendadas: Cuándo Llega y Moovit para ver recorridos y tiempos en tiempo real.'
      },
      {
        subtitle: 'Trenes',
        text: 'Líneas Mitre, Sarmiento y Roca para llegar al conurbano bonaerense. También usá SUBE.'
      }
    ]
  },
  {
    id: 'apps',
    emoji: '📱',
    title: 'Apps Esenciales',
    content: [
      {
        subtitle: 'Navegación y transporte',
        text: 'Google Maps — navegación general, rutas en transporte público. Moovit — rutas de colectivo y subte con tiempos en tiempo real. Cuando Subo / Cuándo Llega — para saber exactamente cuándo llega tu colectivo a la parada.'
      },
      {
        subtitle: 'Viajes en auto',
        text: 'Uber, Cabify y DiDi — funcionan bien en CABA. BA Taxi — la app oficial del Gobierno de la Ciudad para taxis con taxímetro oficial.'
      },
      {
        subtitle: 'Movilidad sustentable',
        text: 'EcoBici — bicicletas públicas gratuitas del GCBA (requiere registro previo). Lime y Grin — monopatines eléctricos por zona.'
      }
    ]
  },
  {
    id: 'costos',
    emoji: '💰',
    title: 'Costos Estimados',
    content: [
      {
        subtitle: 'Transporte',
        text: 'Subte: ~$1.414 por viaje · Colectivo: ~$800–$1.300 · Taxi/Uber (viaje corto): $4.000–$8.000 · Remis desde Ezeiza al centro: $40.000–$60.000 · EcoBici: gratuito'
      },
      {
        subtitle: 'Gastronomía',
        text: 'Medialunas en café: $800–$2.000 · Empanadas (unidad): $1.500–$2.500 · Choripán: $3.000–$5.000 · Milanesa con papas: $8.000–$15.000 · Helado (1/4 kg): $4.000–$6.000 · Pizza por porción: $3.000–$5.000'
      },
      {
        subtitle: 'Pagos',
        text: 'Se acepta tarjeta casi en todos lados. El efectivo es útil en puestos de feria y kioscos. Muchos locales aceptan QR (Mercado Pago). Evitá cambiar dólares en la calle.'
      }
    ]
  },
  {
    id: 'sedes',
    emoji: '📍',
    title: 'Cómo Llegar a las Sedes',
    content: [
      {
        subtitle: 'Auditorio Belgrano — Virrey Loreto 2348',
        text: 'Subte Línea D → estación José Hernández (a 5 min a pie). Colectivos: 59, 60, 63, 107, 130 entre otros. Fácil acceso desde el centro tomando la D hacia Congreso de Tucumán.'
      },
      {
        subtitle: 'UTN FRBA Medrano — Av. Medrano 951',
        text: 'Subte Línea B → estación Medrano (salida directa a la facultad). Colectivos: 26, 34, 39, 55, 140. Barrio de Almagro, muy bien conectado.'
      },
      {
        subtitle: 'UTN FRBA Campus — Mozart 2300',
        text: 'Subte Línea E → estación Plaza de los Virreyes (5 min a pie). Colectivos: 2, 7, 36, 45, 97. Barrio de Flores Sur.'
      }
    ]
  },
  {
    id: 'seguridad',
    emoji: '🛡️',
    title: 'Seguridad y Tips',
    content: [
      {
        subtitle: 'Seguridad general',
        text: 'Buenos Aires es una gran ciudad: mantené el celular guardado en transporte público. Evitá mostrar objetos de valor. El centro, Palermo, Recoleta y Belgrano son zonas seguras y turísticas. No aceptes ayuda de desconocidos en los cajeros automáticos.'
      },
      {
        subtitle: 'Clima y ropa',
        text: 'Agosto en Buenos Aires puede ser frío (5–15°C). Llevá abrigo, especialmente para la noche. Las lluvias son frecuentes en el invierno porteño.'
      },
      {
        subtitle: 'WiFi',
        text: 'La red BA WiFi del GCBA es gratuita en plazas, parques y espacios públicos de toda la ciudad. También en el subte hay señal en estaciones. Los bares y cafés casi siempre tienen WiFi libre.'
      }
    ]
  },
  {
    id: 'fin-de-semana',
    emoji: '🏙️',
    title: 'El Fin de Semana en Buenos Aires',
    content: [
      {
        subtitle: 'Barrios que no podés perderte',
        text: 'San Telmo (feria dominical y arquitectura colonial) · La Boca (Caminito, colores y tango) · Palermo (bares, restaurantes, parques y museos) · Recoleta (el cementerio, el MALBA y el CCK) · Puerto Madero (puerto renovado y costanera) · Almagro (barrio cultural y bohemio)'
      },
      {
        subtitle: 'Cultura gratuita',
        text: 'CCK (Centro Cultural Kirchner) — gratis, arquitectura espectacular y eventos. MALBA — descuento para estudiantes. Museo Nacional de Bellas Artes — gratuito. Planetario Galileo Galilei — entrada libre al parque. Teatro Colón — visitas guiadas con costo accesible.'
      },
      {
        subtitle: 'Gastronomía porteña',
        text: 'No te vayas sin probar: empanadas porteñas · choripán en la Costanera · milanesa con papas · medialunas en café con leche · helado artesanal · pizza al molde estilo porteño. Lugares imperdibles: El Federal (San Telmo), Mercado de San Telmo, la calle Corrientes para pizza y teatro a cualquier hora.'
      }
    ]
  },
  {
    id: 'emergencias',
    emoji: '🆘',
    title: 'Números de Emergencia',
    content: [
      {
        subtitle: 'Números clave',
        text: '911 — Policía, ambulancias y bomberos · 107 — SAME (Sistema de Atención Médica de Emergencias) · 0800-999-2838 — Turismo Buenos Aires (atención a turistas) · 147 — Atención GCBA (reclamos y consultas al gobierno porteño)'
      },
      {
        subtitle: 'Farmacias',
        text: 'Hay farmacias de turno las 24 hs en toda la ciudad. Búscalas en Google Maps o preguntá en cualquier farmacia cercana por la "farmacia de turno".'
      }
    ]
  }
];

function SectionCard({ section }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-institutional px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">{section.emoji}</span>
        <h2 className="text-white font-title text-xl font-bold">{section.title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">
        {section.content.map((item, i) => (
          <div key={i}>
            <h3 className="text-complementary-gold font-bold text-sm uppercase tracking-wide mb-1">
              {item.subtitle}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentsSection({ user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/manual-comments`)
      .then(r => r.json())
      .then(data => setComments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/manual-comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorEmail: user.email,
          authorName: user.name || user.email.split('@')[0],
          content: text.trim()
        })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Error al enviar el comentario.');
        return;
      }
      const created = await res.json();
      setComments(prev => [created, ...prev]);
      setText('');
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💬</span>
        <h2 className="font-title text-2xl font-bold text-gray-800">Comentarios de la comunidad</h2>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        ¿Ya conocés Buenos Aires? Compartí un tip útil para tus colegas.
        {!user && ' Iniciá sesión para comentar.'}
      </p>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-institutional resize-none"
            rows={3}
            maxLength={1000}
            placeholder="Escribí tu tip o recomendación (máx. 1000 caracteres)…"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{text.length}/1000</span>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="bg-institutional text-white text-sm font-bold px-5 py-2 rounded-xl hover:opacity-90 disabled:opacity-50 transition"
            >
              {submitting ? 'Enviando…' : 'Publicar tip'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando comentarios…</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm italic">Aún no hay comentarios. ¡Sé el primero en compartir un tip!</p>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-gray-800">{c.authorName}</span>
                <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManualPortenoPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Header */}
      <div className="bg-institutional text-white py-16 px-4 text-center">
        <p className="text-complementary-gold font-bold tracking-widest uppercase text-sm mb-3">
          CONEIC 2026 · Buenos Aires
        </p>
        <h1 className="font-title text-4xl sm:text-5xl font-bold mb-4">
          Manual del Porteño
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto font-body">
          Todo lo que necesitás saber para moverte, comer y disfrutar Buenos Aires durante el congreso.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-1">
          {SECTIONS.map(section => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>

        <CommentsSection user={user} />
      </div>
    </div>
  );
}
