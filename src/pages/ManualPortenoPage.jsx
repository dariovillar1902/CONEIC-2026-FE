import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;
const IMG = '/assets/manual-porteno';

// ─── Modelo de contenido — replica 1 a 1 el Word "Manual del Porteño v2" ─────
// Tipos de bloque: p (párrafo), list (viñetas), subhead (subtítulo interno),
// img (imagen con caption opcional), table (tabla simple), callout (recuadro
// destacado tipo tip/warning), link (enlace suelto).
const SECTIONS = [
  {
    id: 'transporte',
    num: '1',
    emoji: '🚇',
    title: 'Cómo moverse en transporte público',
    blocks: [
      { type: 'p', text: 'Buenos Aires cuenta con una de las redes de transporte público más completas de Latinoamérica.' },
      { type: 'p', text: 'Con un poco de práctica, vas a poder llegar a cualquier punto de la ciudad de forma rápida y sencilla, sin necesidad de gastar de más en taxis o remises (aunque siempre tenés buenas aplicaciones de viaje como alternativa 😉).' },

      { type: 'subhead', text: '1.1 ¿Cómo se paga?' },
      { type: 'callout', tone: 'warning', text: '¡NO está permitido el pago en efectivo!' },
      { type: 'p', text: 'Por lo que a continuación te dejamos las alternativas para pagar:' },
      { type: 'list', items: [
        'Tarjeta SUBE (obligatoria para los trenes, no para el subte)',
        'Tarjeta de Débito o Crédito (contactless)',
        'QR desde App de Billeteras Virtuales y Bancos (Mercado Pago, Naranja X, Modo, etc.)',
      ] },
      { type: 'link', emoji: '🎬', text: '¿Querés saber cómo pagar con QR? Mirá este breve video explicativo sobre códigos QR en el transporte', href: 'https://www.facebook.com/GCBA/videos/1364843794570607/' },
      { type: 'imgRow', images: [
        { src: `${IMG}/qr-paso1.png`, alt: 'Pasos para pagar el colectivo con QR' },
        { src: `${IMG}/qr-paso2.png`, alt: 'Validador SUBE aceptando el pago' },
      ] },

      { type: 'subhead', text: 'Todo sobre la SUBE (Sistema Único de Boleto Electrónico)' },
      { type: 'p', text: 'Es una de las opciones para usar el subte, los colectivos (buses) y trenes.' },
      { type: 'p', text: '¿Dónde conseguirla? En cualquier kiosco habilitado con el logo SUBE o en algunas sucursales del Correo OCA.' },
      { type: 'p', text: '¿Dónde cargarla? En cajeros automáticos, kioscos, estaciones de subte o de forma online mediante billeteras virtuales y home banking.' },
      { type: 'callout', tone: 'tip', text: 'Cargá siempre más saldo del que pensás usar. En hora pico los kioscos tienen fila y no es raro quedarse sin saldo justo cuando más lo necesitás.' },
      { type: 'callout', tone: 'warning', text: 'Importante sobre las cargas virtuales: Si cargás por app o banco, recordá que tenés que acreditar el saldo antes de viajar. Podés hacerlo de tres formas:' },
      { type: 'list', items: [
        'Directo en el colectivo: Al subir, avisale al chofer "Te pido acreditar la carga" para que active la acreditación en la validadora, apoyás la tarjeta y una vez acreditada, pagás tu boleto normalmente.',
        'Con el celular apoyándolo en la parte trasera (si tu teléfono tiene tecnología NFC y usás la app oficial de SUBE).',
        'En las terminales automáticas ubicadas en estaciones de tren y subte.',
      ] },

      { type: 'subhead', text: '1.2 El Subte (Metro)' },
      { type: 'p', text: 'Es la forma más rápida y práctica de moverse por el centro y las zonas céntricas de la ciudad.' },
      { type: 'p', text: 'Horarios: de lunes a sábado de 5:30 a 22:30 hs (los domingos cuentan con horario reducido)' },
      { type: 'callout', tone: 'warning', text: 'Hora pico (¡evitala si podés!): de 8:00 a 9:30 hs y de 17:30 a 19:30 hs.' },
      { type: 'p', text: 'SIEMPRE: Cuidá tus pertenencias y ponete la mochila adelante.' },
      { type: 'link', text: 'Página web oficial del SUBTE de la Ciudad', href: 'https://buenosaires.gob.ar/gcaba_historico/subte' },
      { type: 'callout', tone: 'info', text: 'Tarifa del subte (2026): $1.753 por viaje con SUBE registrada / $2.541 con SUBE no registrada.' },

      { type: 'subhead', text: 'Líneas de SUBTE' },
      { type: 'table', headers: ['Línea', 'Recorrido principal [Cabeceras]'], rows: [
        ['🩵 Línea A (celeste)', 'Plaza de Mayo (Monserrat)'],
        ['❤️ Línea B (roja)', 'L.N. Alem (San Nicolás) — Juan Manuel de Rosas (Villa Urquiza)'],
        ['💙 Línea C (azul)', 'Retiro (Retiro) — Constitución (Constitución) (eje norte-sur)'],
        ['💚 Línea D (verde oscuro)', 'Catedral (San Nicolás) — Congreso de Tucumán (Belgrano)'],
        ['💜 Línea E (violeta)', 'Retiro (Retiro) — Plaza de los Virreyes (Flores)'],
        ['💛 Línea H (amarillo)', 'Hospitales (Parque Patricios) — Facultad de Derecho (Recoleta)'],
      ] },
      { type: 'img', src: `${IMG}/mapa-subte.png`, alt: 'Mapa de red del Subte de Buenos Aires', href: 'https://buenosaires.gob.ar/gcaba_historico/subte/mapa-del-subte-y-combinaciones' },
      { type: 'subhead', text: 'Mapa Turístico' },
      { type: 'img', src: `${IMG}/mapa-turistico.png`, alt: 'Mapa turístico ilustrado del Subte de Buenos Aires (Emova)', href: 'https://emova.com.ar/index.php/mapas/#gallery-6a9f18b7738e3' },

      { type: 'subhead', text: '1.3 Los Bondis (Buses/Colectivos)' },
      { type: 'p', text: 'Buenos Aires cuenta con más de 200 líneas de colectivos que cubren cada rincón de la ciudad.' },
      { type: 'p', text: 'Son ideales porque te dejan más cerca de tu destino final que el subte (¡aunque el tránsito en hora pico puede hacerlos un poco más lentos!).' },
      { type: 'p', text: '¿Cómo se paga? Con tarjeta SUBE, pago contactless (tarjetas de débito/crédito o celular) o escaneando el código QR desde billeteras virtuales (Mercado Pago, MODO, etc.).' },
      { type: 'p', text: 'Recordá que no se acepta efectivo bajo ningún punto de vista.' },
      { type: 'callout', tone: 'info', text: 'Tarifas: Varían según la distancia recorrida (aprox. entre $888 y $1.138 para tramos habituales).' },

      { type: 'subhead', text: '📱 Apps clave' },
      { type: 'table', headers: ['App', 'Para qué sirve'], rows: [
        ['Google Maps', 'La más completa para armar rutas en tiempo real combinando colectivo, subte, tren y caminatas. Siempre actualizada.'],
        ['Moovit', 'Excelente alternativa local que muestra las próximas salidas con minutos exactos y alertas de servicio.'],
        ['Cuando Subo / Cuándo Llega (GCBA)', 'Aplicaciones oficiales para ver en vivo la ubicación y llegada de los colectivos a cada parada. (Ojo: si figura como "horario programado", puede tener demoras).'],
      ] },

      { type: 'subhead', text: '1.4 Trenes' },
      { type: 'p', text: 'Los trenes metropolitanos conectan CABA con el Gran Buenos Aires. Si te hospedás en la zona metropolitana o querés hacer un viaje cruzando distancias largas, son una excelente opción.' },
      { type: 'callout', tone: 'warning', text: '¡Atención! Por el momento, las líneas de tren SOLO aceptan Tarjeta SUBE.' },
      { type: 'p', text: 'La regla de oro: Tenés que apoyar la tarjeta al subir y también al bajar. Si olvidás marcar al salir, el sistema te descontará el valor máximo del ramal.' },
      { type: 'p', text: 'Tarifa estimada (2026): varía desde los $480 (SUBE registrada) o $960 (sin registrar) hasta los $790 o $1.580 respectivamente, según la distancia del recorrido.' },
      { type: 'link', text: 'Página web oficial de la Red de Trenes', href: 'https://www.argentina.gob.ar/transporte/trenes-argentinos/horarios-tarifas-y-recorridos/areametropolitana' },

      { type: 'subhead', text: 'Líneas de Tren' },
      { type: 'link', text: 'Ver mapa de trenes AMBA en PDF (Argentina.gob.ar)', href: 'https://www.argentina.gob.ar/sites/default/files/mapa_trenes_amba_y_media_distancia_web_2982025.pdf' },
      { type: 'img', src: `${IMG}/mapa-trenes.png`, alt: 'Mapa de la red de trenes del AMBA' },
      { type: 'subhead', text: 'Ubicación de las Cabeceras de Líneas de Tren (CABA)' },
      { type: 'img', src: `${IMG}/mapa-sedes-trenes.png`, alt: 'Ubicación de las sedes del congreso y estaciones de tren cercanas (Retiro, Constitución, Sáenz)' },
    ],
  },

  {
    id: 'apps',
    num: '2',
    emoji: '📱',
    title: 'Apps esenciales para moverse',
    blocks: [
      { type: 'p', text: 'Bajate estas apps antes de llegar. Todas son gratuitas y te van a salvar más de una vez.' },

      { type: 'subhead', text: '2.1 Apps de transporte público' },
      { type: 'table', headers: ['App', 'Para qué sirve'], rows: [
        ['Google Maps', 'La más completa para armar rutas en tiempo real combinando colectivo, subte, tren y caminatas. Siempre actualizada.'],
        ['Moovit', 'Excelente alternativa local que muestra las próximas salidas con minutos exactos y alertas de servicio.'],
        ['Cuando Subo / Cuándo Llega (GCBA)', 'Aplicaciones oficiales para ver en vivo la ubicación y llegada de los colectivos a cada parada. (Ojo: si figura como "horario programado", puede tener demoras).'],
      ] },

      { type: 'subhead', text: '2.2 Apps de autos y taxis' },
      { type: 'p', text: 'Si el transporte público no te cierra (lluvia, horario tarde, mucho equipaje), estas son las opciones:' },
      { type: 'table', headers: ['App / Servicio', 'Descripción y precios estimados'], rows: [
        ['Uber', 'Muy utilizado. Precio dinámico según la demanda. Podés pagar con tarjeta, billetera virtual (Mercado Pago) o efectivo. (Un viaje promedio de 5 km en el centro ronda entre los $6.000 y $15.000)'],
        ['Cabify', 'Suele ofrecer vehículos de muy buena calidad y cuenta con descuentos especiales para usuarios nuevos.'],
        ['Didi', 'Suele tener tarifas más económicas y permite proponer un precio dentro de un rango aceptado por la app.'],
        ['BA Taxi (oficial GCBA) / Taxi Tradicional (calle)', 'Taxis tradicionales (amarillos y negros) con taxímetro. Evita estafas con falsos taxis.'],
      ] },
      { type: 'table', headers: ['Tarifa', 'Valor'], rows: [
        ['Diurna (6:00 a 22:00 hs)', 'Bajada de bandera $1.920 + ficha de $200 cada 200 metros o minuto de espera.'],
        ['Nocturna (22:00 a 6:00 hs)', 'Incremento del 20% (bajada de bandera $2.300 + ficha de $230).'],
      ] },
      { type: 'callout', tone: 'warning', text: 'Cuidado con los taxis no oficiales: Nunca subas a autos que se ofrezcan en el aeropuerto o en la calle sin taxímetro ni app. Siempre usá las apps o los taxis oficiales amarillo-negro.' },

      { type: 'subhead', text: '2.3 Bicis y scooters' },
      { type: 'subhead', text: '🚲 EcoBici (por Tembici)' },
      { type: 'p', text: 'Sistema público y gratuito de bicicletas de la ciudad.' },
      { type: 'p', text: '¿Cómo funciona? Te registrás previamente en la web o app oficial.' },
      { type: 'link', text: 'ecobici.buenosaires.gob.ar', href: 'http://ecobici.buenosaires.gob.ar' },
      { type: 'p', text: 'Tarifa: Tenés viajes gratuitos de hasta 45 minutos (de lunes a viernes) o 60 minutos (fines de semana), con la posibilidad de hacer renovaciones ilimitadas dejando pasar unos minutos entre viaje y viaje.' },
      { type: 'callout', tone: 'tip', text: 'Buenos Aires cuenta con una red larguísima de ciclovías protegidas que atraviesan toda la ciudad. Si te animás a pedalear, es una de las formas más rápidas y lindas de conocer los barrios sin lidiar con el tráfico.' },
      { type: 'subhead', text: '⚡️ Scooters Eléctricos' },
      { type: 'p', text: 'En algunas zonas específicas podés encontrar monopatines eléctricos de libre uso que se alquilan por minuto escaneando un código QR desde aplicaciones móviles.' },
    ],
  },

  {
    id: 'sedes',
    num: '3',
    emoji: '📍',
    title: 'Cómo llegar a las sedes',
    blocks: [
      { type: 'subhead', text: '3.1 Auditorio de Belgrano' },
      { type: 'p', text: '📍 Dirección: Virrey Loreto 2348, Belgrano (zona norte de CABA).', href: 'https://maps.app.goo.gl/w1Rq2oUTDYipcBcbA' },
      { type: 'callout', tone: 'warning', text: 'Zona comercial/residencial, en movimiento constante.' },
      { type: 'p', text: '📅 Días de asistencia: martes 13/10 y viernes 16/10.' },
      { type: 'subhead', text: 'En Subte' },
      { type: 'p', text: 'Línea D: baja en la Estación José Hernández. Camina 2 cuadras.' },
      { type: 'subhead', text: 'En Bondi' },
      { type: 'list', items: [
        'Por Av. Cabildo (frente al auditorio o a 1-2 cuadras). Líneas 41, 59, 67, 152, 161, 168.',
        'Por Av. Luis María Campos (a 7 cuadras). Líneas 15, 29, 57, 60, 64, 118.',
      ] },
      { type: 'callout', tone: 'tip', text: 'Preguntale al chofer o chequeá en Google Maps, varias líneas tienen más de un ramal, así que es importante que te asegures de que te estás tomando el correcto.' },
      { type: 'p', text: 'Por ejemplo, desde Palermo (si te hospedas ahí): colectivo 60 o Línea D.' },
      { type: 'p', text: 'Por ejemplo, desde el Centro / Microcentro: Línea D desde Catedral, directo a Belgrano.' },
      { type: 'img', src: `${IMG}/mapa-auditorio-belgrano.png`, alt: 'Ubicación del Auditorio Belgrano en el mapa' },

      { type: 'subhead', text: '3.2 UTN FRBA – Sede Medrano' },
      { type: 'p', text: '📍 Dirección: Medrano 951, Almagro' },
      { type: 'callout', tone: 'warning', text: 'Zona comercial/residencial, céntrica, muy activa de día.' },
      { type: 'p', text: '📅 Día de asistencia: miércoles 14/10.' },
      { type: 'subhead', text: 'En Subte' },
      { type: 'p', text: 'Línea B: baja en la Estación Medrano, a solo 5 cuadras de la facultad. Es la opción más práctica.' },
      { type: 'callout', tone: 'warning', text: 'Actualmente, la Estación Medrano está cerrada por obras de renovación integral. En caso de que siga cerrada al momento en que estés en CABA, te recomendamos bajar en la Estación Ángel Gallardo (zona más tranquila y residencial) y luego caminar hasta la facultad (aprox. 1.5 km ~ 20 min).' },
      { type: 'subhead', text: 'En Bondi' },
      { type: 'list', items: [
        'Por Av. Córdoba (a 1-2 cuadras): 106, 109, 140.',
        'Por la Av. Medrano (a 1-2 cuadras): 26, 151, 160.',
        'Por Av. Corrientes (a 5-6 cuadras): 24, 71, 92, 124, 127, 168.',
      ] },
      { type: 'img', src: `${IMG}/mapa-utn-medrano.png`, alt: 'Ubicación de UTN FRBA Sede Medrano en el mapa' },

      { type: 'subhead', text: '3.3 UTN FRBA – Sede Campus' },
      { type: 'p', text: '📍 Dirección: Mozart 2300, Villa Lugano' },
      { type: 'callout', tone: 'warning', text: 'Zona residencial e industrial, con movimiento acotado fuera del predio universitario.' },
      { type: 'p', text: '📅 Día de asistencia: miércoles 14/10 por la tarde y jueves 15/10 para la Recreativa.' },
      { type: 'callout', tone: 'tip', text: 'Combinación Recomendada: Subte (Línea E) + Bondi (Línea 7, cartel rojo: ramal "Barrio Samoré"). Tomá la Línea E hasta la estación Plaza de los Virreyes y ahí combiná con el colectivo 7 (ramal Barrio Samoré - cartel rojo; la parada está en Av. Eva Perón 3077 aprox.)' },
      { type: 'subhead', text: 'En Bondi' },
      { type: 'p', text: 'Desde Once: Línea 101 - ramal "Barrio Samoré" (cartel blanco)' },
      { type: 'img', src: `${IMG}/bondi-101.png`, alt: 'Colectivo Línea 101 ramal Barrio Samoré' },
      { type: 'p', text: 'Desde Microcentro: Línea 7 - ramal "Barrio Samoré" (cartel rojo)' },
      { type: 'img', src: `${IMG}/bondi-7.png`, alt: 'Colectivo Línea 7 ramal Barrio Samoré' },
      { type: 'p', text: 'Desde Plaza Italia / Palermo: Línea 145 - ramal "Villa Celina/UTN"' },
      { type: 'img', src: `${IMG}/bondi-145.png`, alt: 'Colectivo Línea 145 ramal Villa Celina/UTN' },
      { type: 'p', text: 'Desde Belgrano: Línea 114' },
      { type: 'p', text: 'Desde Chacarita: Línea 47' },
    ],
  },

  {
    id: 'cerca-de-las-sedes',
    num: '4',
    emoji: '🧭',
    title: '¿Qué hay cerca de las sedes?',
    blocks: [
      { type: 'subhead', text: '4.1 Auditorio Belgrano (Virrey Loreto 2348)' },
      { type: 'list', items: [
        'Gran variedad de cafeterías, heladerías y restaurantes sobre Av. Cabildo y calles aledañas.',
        'Supermercados, farmacias, kioscos y bancos a pocas cuadras.',
        'El Barrio Chino (10-15 minutos caminando), ideal para pasear o comer.',
        'Barrancas de Belgrano, uno de los parques más tradicionales de la ciudad.',
      ] },
      { type: 'callout', tone: 'info', text: 'Seguridad: Es una zona considerada segura y con mucho movimiento. Como en cualquier gran ciudad, se recomienda cuidar las pertenencias, especialmente en avenidas y transporte público.' },

      { type: 'subhead', text: '4.2 UTN Sede Medrano (Medrano 951)' },
      { type: 'p', text: 'Está ubicada en un barrio muy conectado y con mucha vida estudiantil. Durante el día hay gran circulación de personas y comercios.' },
      { type: 'list', items: [
        'Numerosos bares, cafeterías y pizzerías para almorzar o merendar.',
        'Supermercados, kioscos, farmacias y cajeros automáticos.',
        'Plaza Almagro, a unas pocas cuadras, ideal para descansar.',
        'Alto Palermo (centro comercial) a unos 20 minutos caminando o pocos minutos en colectivo.',
        "Fast food: McDonald's, KFC, Mostaza",
        'Parque Centenario a pocas cuadras (hacia la zona de Ángel Gallardo), perfecto para caminar o descansar un rato.',
      ] },
      { type: 'callout', tone: 'info', text: 'Seguridad: Es una zona con bastante movimiento durante gran parte del día. Por la noche conviene circular por avenidas principales (Medrano, Córdoba, Corrientes) y evitar calles muy desiertas.' },

      { type: 'subhead', text: '4.3 UTN Sede Campus' },
      { type: 'p', text: 'A diferencia de las otras sedes, el Campus se encuentra en una zona más residencial e industrial. Dentro del predio universitario hay seguridad y muy buenas instalaciones.' },
      { type: 'p', text: 'El campus cuenta con buffet / comedor universitario y áreas de descanso, ideales para resolver el almuerzo sin necesidad de salir. Cuenta con kiosco y buffet dentro; además, hay una panadería en la esquina.' },
      { type: 'p', text: 'En los alrededores: Parque de la Ciudad, Parque Olímpico de Buenos Aires y Parque Indoamericano (uno de los espacios verdes más grandes de la ciudad).' },
      { type: 'callout', tone: 'info', text: 'Seguridad: Dentro del Campus la seguridad es muy buena. En los alrededores, especialmente de noche, se recomienda permanecer sobre los recorridos principales, utilizar transporte público o aplicaciones de viaje para entrar y salir, y evitar caminar largas distancias fuera del predio.' },
    ],
  },

  {
    id: 'tips',
    num: '5',
    emoji: '💡',
    title: 'Tips esenciales del viajero porteño',
    blocks: [
      { type: 'subhead', text: '5.1 Seguridad' },
      { type: 'list', items: [
        'Guardá el celular en el bolsillo de adelante del pantalón o en una mochila con cierre adelante, nunca a la vista en la calle.',
        'En el subte en hora pico, ponete la mochila adelante.',
        'En general, CABA es una ciudad bastante segura para el turismo, especialmente Palermo, Recoleta, San Telmo, Belgrano y el Microcentro de día.',
        'Tené especial cuidado en los colectivos/trenes/subtes cuando se abren las puertas. Guarda tus pertenencias o estate atento.',
      ] },
      { type: 'img', src: `${IMG}/mapa-riesgo-urbano.png`, alt: 'Ilustración de riesgo y atención urbana por comuna — mapa ilustrativo y orientativo' },

      { type: 'subhead', text: '5.2 Dinero y pagos' },
      { type: 'list', items: [
        'La mayoría de los comercios, restaurantes y supermercados aceptan tarjeta de débito y crédito, transferencias y pagos con apps (Mercado Pago, Modo, Cuenta DNI)',
        'Los mercados de pulgas (San Telmo, por ejemplo) suelen ser efectivo.',
        'Los cajeros automáticos tienen un límite de extracción diario. Si venís del exterior, avisale a tu banco para evitar bloqueos.',
        'No cambies divisas (usd, euros, etc.) en la calle: es ilegal y peligroso. Usá casas de cambio habilitadas o tu tarjeta de débito.',
      ] },

      { type: 'subhead', text: '5.3 Costumbres porteñas' },
      { type: 'list', items: [
        'Los horarios son más tardíos que en el interior: se almuerza de 13 a 14 hs y se comienza a cenar a las 21 hs.',
        'Las panaderías y "kioscos" son omnipresentes: son un recurso infinito para agua, snacks, carga de SUBE y todo lo que necesites.',
        'Aquí, según el barrio, los locales abren de corrido todo el día (no cortan para la siesta).',
      ] },

      { type: 'subhead', text: '5.4 Wi-Fi y conectividad' },
      { type: 'list', items: [
        'Hay Wi-Fi gratuito en plazas, estaciones de subte y muchos espacios públicos (red "BA WiFi").',
        'Si venís de otra provincia con chip de tu operador, verificá la cobertura. Claro, Movistar y Personal tienen buena señal en toda la ciudad.',
      ] },
    ],
  },

  {
    id: 'fin-de-semana',
    num: '6',
    emoji: '🏙️',
    title: 'Qué hacer si tenés el fin de semana libre',
    blocks: [
      { type: 'p', text: 'Si te quedás el fin de semana, aprovechalo. ¡CABA tiene una agenda cultural y gastronómica increíble!' },
      { type: 'link', text: 'Página oficial de Ciudad de Buenos Aires', href: 'https://turismo.buenosaires.gob.ar/es' },

      { type: 'subhead', text: '6.1 Barrios para conocer' },
      { type: 'table', headers: ['Barrio', 'Por qué vale la pena'], rows: [
        ['San Telmo', 'El barrio más antiguo. Feria artesanal los domingos en Plaza Dorrego. Bares históricos, tango, mercado de antigüedades.'],
        ['La Boca', 'El Caminito, conventillos coloridos y la Bombonera. Recomendación: visitarlo solo de día y mantenerse en el circuito turístico principal.'],
        ['Palermo Soho / Hollywood', 'El epicentro de la movida joven. Diseño, boutiques, cafés de especialidad, restaurantes vanguardistas y cercanía a los parques.'],
        ['Recoleta', 'Arquitectura de estilo francés, el icónico Cementerio, el MALBA y cafés históricos como La Biela.'],
        ['Puerto Madero', 'Diques modernos junto al río, el Puente de la Mujer y caminatas hacia la Reserva Ecológica y la Costanera Sur.'],
        ['Almagro / Villa Crespo', 'Barrios auténticos y residenciales, con una gran movida de bodegones, cafés de especialidad y menos masividad turística.'],
      ] },

      { type: 'subhead', text: '6.2 Cultura gratuita o casi' },
      { type: 'list', items: [
        'Palacio Libertad (ex Centro Cultural Kirchner): Imponente edificio en el Microcentro con muestras, conciertos y una cúpula con vista panorámica. Entrada gratuita.',
        'MALBA (Museo de Arte Latinoamericano de Buenos Aires). Ubicado en Palermo, cuenta con una sólida colección de arte moderno y latinoamericano.',
        'Museo Nacional de Bellas Artes (MNBA): Situado en Recoleta, con entrada libre y gratuita y una colección de arte internacional y argentino de primer nivel.',
        'Planetario Galileo Galilei: En los Bosques de Palermo, rodeado de lagos, con funciones astronómicas y espectáculos inmersivos muy recomendables.',
        'Teatro Colón: Una de las casas de ópera más importantes del mundo. Se pueden contratar visitas guiadas para conocer su impresionante sala y arquitectura.',
        'Hipódromo de Palermo. Predio histórico en la zona norte, ideal para caminatas y polo.',
        'El Rosedal, Lagos y Bosques de Palermo. El pulmón verde más grande y concurrido de la ciudad para pasear al aire libre o en bicicleta.',
        'Centro Cultural Recoleta. Espacio joven y dinámico con muestras de arte urbano, talleres, música y exposiciones gratuitas.',
      ] },
      { type: 'link', text: '¿No sabés qué hacer? Consultá la web oficial del GCBA "Qué hacer esta semana"', href: 'https://turismo.buenosaires.gob.ar/es/article/que-hacer-esta-semana' },

      { type: 'subhead', text: '6.3 Gastronomía porteña imperdible' },
      { type: 'list', items: [
        'Empanadas: encontrás de todo tipo según el local.',
        'Choripán: el sándwich nacional. Buscá los puestos en La Costanera o en ferias.',
        'Milanesa napolitana: infaltable en cualquier resto de barrio, bodegones! Enorme y contundente.',
        'Medialunas: el croissant argento. Imprescindibles en el desayuno.',
        'Pizza porteña: más gruesa que la italiana, con mucho queso.',
      ] },
      { type: 'callout', tone: 'tip', text: '⚡️ ¿A la piedra o en molde? Discordia eterna entre barrios. (Guerrín, Banchero, El Cuartito, Las Cuartetas)' },

      { type: 'subhead', text: '6.4 Dónde tomar algo' },
      { type: 'list', items: [
        'Bares notables: Buenos Aires cuenta con cafés declarados Patrimonio Cultural. Lugares con historia y atmósfera única como El Federal (San Telmo), El Gato Negro (Corrientes) o La Biela (Recoleta).',
        'La Avenida Corrientes, conocida como "la calle que nunca duerme", combina librerías abiertas hasta tarde, teatros históricos y pizzerías míticas.',
        'Mercado de San Telmo: Una galería histórica repleta de puestos de comida al paso, antigüedades y tragos. Ideal para almorzar o recorrer el domingo (horario habitual: 10 a 17 hs)',
      ] },
    ],
  },

  {
    id: 'apps-comida',
    num: '7',
    emoji: '🍔',
    title: 'Apps de comida',
    blocks: [
      { type: 'subhead', text: '🛵 PedidosYa' },
      { type: 'p', text: 'Es la aplicación de delivery más utilizada de Argentina. Permite pedir comida de miles de restaurantes, supermercados, farmacias, kioscos y hasta artículos de almacén. También ofrece promociones frecuentes, especialmente pagando con determinados medios de pago.' },
      { type: 'p', text: 'Ideal para: pedir almuerzos, cenas, bebidas o hacer compras rápidas sin salir del alojamiento.' },

      { type: 'subhead', text: '🟢 Rappi' },
      { type: 'p', text: 'Muy similar a PedidosYa, aunque con menor presencia en algunos barrios. Además de comida, ofrece envíos, compras en supermercados, farmacias y otros comercios. En algunas zonas puede tener promociones o restaurantes exclusivos.' },
      { type: 'p', text: 'Ideal para: comparar precios y tiempos de entrega con PedidosYa antes de hacer un pedido.' },

      { type: 'subhead', text: "🍔 McDonald's, Burger King y Mostaza" },
      { type: 'p', text: 'Las principales cadenas de comida rápida cuentan con aplicaciones propias. Desde ellas se pueden acceder a descuentos exclusivos, cupones y promociones que muchas veces no aparecen en las aplicaciones de delivery.' },
      { type: 'p', text: 'Podés pedir en el local con cupones o pedir por delivery, disponibilidad según la zona.' },
      { type: 'p', text: 'Ideal para: conseguir combos a mejor precio si hay un local cercano.' },

      { type: 'subhead', text: '💡 Recomendación' },
      { type: 'p', text: 'Antes de realizar un pedido, vale la pena comparar entre PedidosYa, Rappi y la aplicación oficial del restaurante. Es común encontrar diferencias en el precio del producto, el costo de envío o promociones que pueden hacer ahorrar dinero.' },
      { type: 'p', text: 'Además, muchos restaurantes ofrecen descuentos especiales para el primer pedido o al pagar con determinadas tarjetas o billeteras virtuales.' },
    ],
  },

  {
    id: 'emergencias',
    num: '8',
    emoji: '🆘',
    title: 'Números útiles y emergencias',
    blocks: [
      { type: 'table', headers: ['Servicio', 'Número / Contacto'], rows: [
        ['Emergencias (Policía, Ambulancia, Bomberos)', '911'],
        ['SAME (emergencias médicas de CABA)', '107'],
        ['Turismo BA – Información (gratuito)', '0800-999-2838'],
        ['Subte – Atención al cliente', '0800-555-1616'],
        ['Línea 147 – Atención ciudadana GCBA', '147'],
        ['Chat Booty, Ciudad de Buenos Aires', '+54 9 11 5050'],
      ] },
      { type: 'links', items: [
        { text: 'Turismo CABA — Página Turismo BA', href: 'https://turismo.buenosaires.gob.ar/es' },
        { text: 'Linda BA — Instagram Linda BA', href: 'https://www.instagram.com/lindaenvivo' },
        { text: 'Página web Linda BA', href: 'https://linda.buenosaires.gob.ar/' },
      ] },
      { type: 'callout', tone: 'tip', text: 'Guardá en tu teléfono el número del lugar donde te hospedás y de algún contacto local. Ante cualquier problema, el 911 siempre responde.' },
    ],
  },
];

const CALLOUT_STYLES = {
  tip: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  info: 'bg-sky-50 border-sky-200 text-sky-900',
};

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return block.href ? (
        <a href={block.href} target="_blank" rel="noopener noreferrer" className="text-gray-700 text-sm leading-relaxed hover:underline block">
          {block.text}
        </a>
      ) : (
        <p className="text-gray-700 text-sm leading-relaxed">{block.text}</p>
      );
    case 'subhead':
      return <h3 className="text-complementary-gold font-bold text-sm uppercase tracking-wide mt-2">{block.text}</h3>;
    case 'list':
      return (
        <ul className="list-disc list-outside pl-5 space-y-1.5">
          {block.items.map((it, i) => (
            <li key={i} className="text-gray-700 text-sm leading-relaxed">{it}</li>
          ))}
        </ul>
      );
    case 'callout': {
      const icon = block.tone === 'warning' ? '⚠️' : block.tone === 'tip' ? '💡' : 'ℹ️';
      return (
        <div className={`border rounded-lg px-4 py-3 text-sm leading-relaxed flex gap-2 ${CALLOUT_STYLES[block.tone] || CALLOUT_STYLES.info}`}>
          <span className="shrink-0">{icon}</span>
          <span>{block.text}</span>
        </div>
      );
    }
    case 'link':
      return (
        <a href={block.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-institutional hover:underline">
          {block.emoji && <span>{block.emoji}</span>}
          <span>{block.text}</span>
        </a>
      );
    case 'links':
      return (
        <ul className="space-y-1">
          {block.items.map((it, i) => (
            <li key={i}>
              <a href={it.href} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-institutional hover:underline">
                {it.text}
              </a>
            </li>
          ))}
        </ul>
      );
    case 'img':
      return (
        <figure className="my-1">
          {block.href ? (
            <a href={block.href} target="_blank" rel="noopener noreferrer">
              <img src={block.src} alt={block.alt} loading="lazy" className="w-full rounded-xl border border-gray-200" />
            </a>
          ) : (
            <img src={block.src} alt={block.alt} loading="lazy" className="w-full rounded-xl border border-gray-200" />
          )}
        </figure>
      );
    case 'imgRow':
      return (
        <div className="grid grid-cols-2 gap-3">
          {block.images.map((im, i) => (
            <img key={i} src={im.src} alt={im.alt} loading="lazy" className="w-full rounded-xl border border-gray-200" />
          ))}
        </div>
      );
    case 'table':
      return (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left font-bold text-gray-600 px-4 py-2 uppercase text-xs tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-gray-700 align-top">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

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
    <div id={section.id} className="grid lg:grid-cols-[1fr_260px] gap-4 items-start scroll-mt-24">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-institutional px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">{section.emoji}</span>
          <h2 className="text-white font-title text-xl font-bold">{section.num}. {section.title}</h2>
        </div>
        <div className="px-6 py-5 space-y-3">
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} />
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

/** Mini índice de secciones — versión sidebar fija para desktop. */
function TableOfContents() {
  return (
    <nav className="hidden lg:block sticky top-24 self-start">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Índice</p>
      <ul className="space-y-0.5">
        {SECTIONS.map(s => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-institutional hover:bg-white rounded-lg px-2 py-2 transition"
            >
              <span className="shrink-0">{s.emoji}</span>
              <span className="leading-tight">{s.num}. {s.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Mismo índice, en tira horizontal scrolleable — para mobile/tablet. */
function TableOfContentsMobile() {
  return (
    <nav className="lg:hidden flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6">
      {SECTIONS.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:text-institutional hover:border-institutional transition whitespace-nowrap"
        >
          <span>{s.emoji}</span>
          <span>{s.title}</span>
        </a>
      ))}
    </nav>
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
          Guía práctica para moverse por Buenos Aires — dirigida a estudiantes y visitantes del interior y el exterior del país. Edición 2026.
        </p>
        <p className="text-white/60 text-xs mt-4 font-body max-w-xl mx-auto">
          💬 Los comentarios de la comunidad están junto a cada sección. Podés agregar tu comentario siempre que sea respetuoso y tenga que ver con temas del Manual. Los administradores podrán borrar comentarios que no cumplan con el reglamento.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <TableOfContentsMobile />

        <div className="mt-6 lg:mt-0 lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
          <TableOfContents />

          <div className="space-y-8 min-w-0">
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

            <p className="text-center text-gray-400 text-sm pt-4">
              ¡Bienvenido/a a Buenos Aires! 🧉 🏙️ 🚇 🎭 🍕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
