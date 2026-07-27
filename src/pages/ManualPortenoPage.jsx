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

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Comment thread anchored to a single section — Word-style margin comment. */
function SectionCommentPanel({ sectionId, comments, user, onAdd, onDelete }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  function canDelete(comment) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.email?.toLowerCase() === comment.authorEmail?.toLowerCase();
  }

  async function handleDelete(comment) {
    if (!window.confirm('¿Borrar este comentario?')) return;
    setDeletingId(comment.id);
    try {
      const res = await fetch(
        `${API}/api/manual-comments/${comment.id}?requesterEmail=${encodeURIComponent(user.email)}`,
        { method: 'DELETE' }
      );
      if (res.ok) onDelete(comment.id);
    } finally {
      setDeletingId(null);
    }
  }

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
          sectionId,
          content: text.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Error al enviar el comentario.');
        return;
      }
      const created = await res.json();
      onAdd(created);
      setText('');
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  const visibleComments = expanded ? comments : comments.slice(0, 2);

  return (
    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 lg:sticky lg:top-24 h-fit">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">💬</span>
        <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">
          Comentarios {comments.length > 0 && `(${comments.length})`}
        </p>
      </div>

      {comments.length === 0 ? (
        <p className="text-xs text-gray-400 italic mb-3">Sin comentarios todavía.</p>
      ) : (
        <div className="space-y-2 mb-3">
          {visibleComments.map(c => (
            <div key={c.id} className="bg-white border border-amber-100 rounded-lg px-3 py-2">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-xs text-gray-800">{c.authorName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">{formatDate(c.createdAt)}</span>
                  {canDelete(c) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                      title="Borrar comentario"
                      className="text-gray-300 hover:text-red-500 transition disabled:opacity-40 text-xs leading-none"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{c.content}</p>
            </div>
          ))}
          {comments.length > 2 && (
            <button
              type="button"
              onClick={() => setExpanded(v => !v)}
              className="text-xs text-amber-700 font-bold hover:underline"
            >
              {expanded ? 'Ver menos' : `Ver ${comments.length - 2} más`}
            </button>
          )}
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-institutional resize-none bg-white"
            rows={2}
            maxLength={1000}
            placeholder="Agregar un tip sobre esta sección…"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex items-center justify-between mt-1.5">
            {error ? (
              <p className="text-red-500 text-[10px]">{error}</p>
            ) : <span />}
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="bg-institutional text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {submitting ? 'Enviando…' : 'Comentar'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-[10px] text-gray-400">Iniciá sesión para comentar.</p>
      )}
    </div>
  );
}

function SectionRow({ section, comments, user, onAdd, onDelete }) {
  return (
    <div className="grid lg:grid-cols-[1fr_260px] gap-4 items-start">
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

      <SectionCommentPanel
        sectionId={section.id}
        comments={comments}
        user={user}
        onAdd={onAdd}
        onDelete={onDelete}
      />
    </div>
  );
}

export default function ManualPortenoPage() {
  const { user } = useAuth();
  const [commentsBySection, setCommentsBySection] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/manual-comments`)
      .then(r => r.json())
      .then(data => {
        const grouped = {};
        for (const c of data) {
          (grouped[c.sectionId] ??= []).push(c);
        }
        setCommentsBySection(grouped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleAdd(sectionId, comment) {
    setCommentsBySection(prev => ({
      ...prev,
      [sectionId]: [comment, ...(prev[sectionId] || [])],
    }));
  }

  function handleDelete(sectionId, commentId) {
    setCommentsBySection(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).filter(c => c.id !== commentId),
    }));
  }

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
        <p className="text-white/60 text-xs mt-4 font-body">
          💬 Los comentarios de la comunidad están junto a cada sección.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {loading ? (
          <p className="text-gray-400 text-sm text-center">Cargando manual…</p>
        ) : (
          SECTIONS.map(section => (
            <SectionRow
              key={section.id}
              section={section}
              comments={commentsBySection[section.id] || []}
              user={user}
              onAdd={comment => handleAdd(section.id, comment)}
              onDelete={commentId => handleDelete(section.id, commentId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
