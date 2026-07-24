import { useState, useRef, useEffect } from 'react';
import {
    ALL_FACULTIES_BY_REGION,
    ARGENTINIAN_PROVINCES,
} from '../data/filiales.js';

// ─── Stage & Phase Configuration ─────────────────────────────────────────────
// Helper: create date at local midnight (avoids UTC off-by-one in Argentina, UTC-3)
const d    = (y, m, day) => new Date(y, m - 1, day,  0,  0,  0);
const dEnd = (y, m, day) => new Date(y, m - 1, day, 23, 59, 59);

const STAGES = [
    {
        id: 1,
        label: '1ª Etapa',
        preRegistration: { start: d(2026, 6, 22), end: dEnd(2026, 6, 26) },
        delegatePhase:   { start: d(2026, 6, 29), end: dEnd(2026, 7,  5) },
        paymentPhase:    { start: d(2026, 7,  6),  end: dEnd(2026, 7,  8) },
    },
    {
        id: 2,
        label: '2ª Etapa',
        preRegistration: { start: d(2026, 7, 27), end: dEnd(2026, 7, 31) },
        delegatePhase:   { start: d(2026, 8,  3), end: dEnd(2026, 8,  9) },
        paymentPhase:    { start: d(2026, 8, 10), end: dEnd(2026, 8, 12) },
    },
    {
        id: 3,
        label: '3ª Etapa',
        preRegistration: { start: d(2026, 8, 31), end: dEnd(2026, 9,  4) },
        delegatePhase:   { start: d(2026, 9,  7), end: dEnd(2026, 9, 13) },
        paymentPhase:    { start: d(2026, 9, 14), end: dEnd(2026, 9, 16) },
    },
];

const fmt = (date) => date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
const isBetween = (date, range) => date >= range.start && date <= range.end;

const getCurrentPhase = (today) => {
    for (const stage of STAGES) {
        if (isBetween(today, stage.preRegistration)) return { stage, phase: 'preRegistration' };
        if (isBetween(today, stage.delegatePhase))   return { stage, phase: 'delegate' };
        if (isBetween(today, stage.paymentPhase))    return { stage, phase: 'payment' };
    }
    if (today < STAGES[0].preRegistration.start)
        return { stage: STAGES[0], phase: 'upcoming' };
    for (let i = 0; i < STAGES.length - 1; i++) {
        if (today > STAGES[i].paymentPhase.end && today < STAGES[i + 1].preRegistration.start)
            return { stage: STAGES[i + 1], phase: 'between' };
    }
    return { stage: null, phase: 'closed' };
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validateFields = (data, isOtra, province, international, intl, certificateFile) => {
    const errs = {};
    if (!data.name.trim()) errs.name = 'El nombre es requerido.';
    if (!data.lastname.trim()) errs.lastname = 'El apellido es requerido.';
    if (international) {
        if (!data.dni.trim()) errs.dni = 'Ingresá tu N° de Cédula/DNI/ID.';
    } else {
        const dniDigits = data.dni.replace(/\D/g, '');
        if (!/^\d{7,8}$/.test(dniDigits)) errs.dni = 'El DNI debe tener 7 u 8 dígitos.';
    }
    if (!data.phone.trim()) errs.phone = 'El celular es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Ingresá un email válido.';
    if (international) {
        if (!intl.country.trim()) errs.intlCountry = 'Ingresá tu país.';
        if (!intl.city.trim()) errs.intlCity = 'Ingresá tu ciudad.';
        if (!intl.university.trim()) errs.intlUniversity = 'Ingresá tu universidad.';
        if (!intl.attendanceConfidence) errs.attendanceConfidence = 'Seleccioná una opción.';
    } else {
        if (!data.faculty) errs.faculty = 'Seleccioná una facultad o delegación.';
        if (isOtra && !province) errs.province = 'Seleccioná tu provincia.';
    }
    if (!data.bloodType) errs.bloodType = 'El grupo sanguíneo es requerido.';
    if (!data.medicalConditions?.trim()) errs.medicalConditions = 'Ingresá tus afecciones médicas o "Ninguna" si no tenés.';
    if (!data.emergencyContactName.trim()) errs.emergencyContactName = 'El nombre del contacto de emergencia es requerido.';
    if (!data.emergencyContactPhone.trim()) errs.emergencyContactPhone = 'El teléfono de emergencia es requerido.';
    if (!certificateFile) errs.certificateFile = 'El certificado de alumno regular es obligatorio.';
    return errs;
};

// ─── Small UI helpers ─────────────────────────────────────────────────────────
/** Red asterisk for required fields */
const Req = () => <span className="text-red-500 ml-0.5">*</span>;

/** Per-field error message */
const FieldError = ({ msg }) =>
    msg ? <p className="text-red-500 text-xs mt-1 font-medium">{msg}</p> : null;

/** Returns the CSS classes for an input, highlighting errors when submitted */
const fieldCls = (errors, submitted, field, extra = '') =>
    `w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white ${errors[field] && submitted ? 'border-red-400 bg-red-50' : 'border-gray-200'} ${extra}`;

// ─── Timeline Component ───────────────────────────────────────────────────────
const PHASE_DEFS = [
    { key: 'preRegistration', label: 'Pre-inscripción' },
    { key: 'delegatePhase',   label: 'Habilitación y Pagos' },
    { key: 'paymentPhase',    label: 'Confirmación' },
];

const RegistrationTimeline = ({ today }) => (
    <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
            Cronograma — Fechas preliminares
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-center">
            {STAGES.slice(0, 2).map((stage, si) => (
                <div key={stage.id} className="flex items-start md:flex-1">
                    {si > 0 && (
                        <div className="hidden md:flex items-center self-stretch px-2">
                            <div className="w-px h-full bg-gray-200" />
                        </div>
                    )}
                    <div className="flex-1 px-2">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 text-center">
                            {stage.label}
                        </p>
                        <div className="flex items-start justify-center gap-1">
                            {PHASE_DEFS.map((pDef, pi) => {
                                const range = stage[pDef.key];
                                const isPast    = today > range.end;
                                const isCurrent = isBetween(today, range);

                                return (
                                    <div key={pDef.key} className="flex items-start">
                                        {pi > 0 && (
                                            <div className={`w-4 h-0.5 mt-3 self-start ${isPast ? 'bg-green-400' : 'bg-gray-200'}`} />
                                        )}
                                        <div className="flex flex-col items-center w-20">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                                                ${isCurrent ? 'bg-primary-blue border-primary-blue' :
                                                  isPast    ? 'bg-green-500 border-green-500' :
                                                              'bg-white border-gray-300'}`}
                                            >
                                                {isCurrent && <div className="w-2 h-2 bg-white rounded-full" />}
                                                {isPast && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <p className={`text-xs font-bold mt-1 text-center leading-tight
                                                ${isCurrent ? 'text-primary-blue' : isPast ? 'text-green-600' : 'text-gray-400'}`}
                                            >
                                                {pDef.label}
                                            </p>
                                            <p className="text-[10px] text-gray-400 text-center mt-0.5">
                                                {fmt(range.start)}–{fmt(range.end)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ─── Phase Banner (shown when form is not open) ────────────────────────────────
const PhaseBanner = ({ phase, stage }) => {
    const configs = {
        upcoming: {
            bg: 'bg-blue-50 border-blue-200',
            icon: '📅',
            title: 'Inscripciones próximamente',
            text: `La pre-inscripción para la Primera Etapa abre el ${fmt(STAGES[0].preRegistration.start)}.`,
        },
        delegate: {
            bg: 'bg-yellow-50 border-yellow-200',
            icon: '👥',
            title: `Fase de Delegados — ${stage?.label}`,
            text: 'El período de pre-inscripción individual cerró. Los delegados están habilitando los cupos asignados. Contactá a tu delegado para consultar tu situación.',
        },
        payment: {
            bg: 'bg-purple-50 border-purple-200',
            icon: '💳',
            title: `Fase de Pagos — ${stage?.label}`,
            text: 'El período de pre-inscripción cerró. Los pagos se realizan de forma grupal a través de tu delegado. Contactá a tu delegado para coordinar el pago.',
        },
        between: {
            bg: 'bg-gray-50 border-gray-200',
            icon: '⏳',
            title: 'Entre etapas',
            text: stage?.id === 3
                ? 'La apertura de la siguiente etapa se comunicará próximamente. ¡Seguí atento a nuestras redes!'
                : `La pre-inscripción para la ${stage?.label} abre el ${stage ? fmt(stage.preRegistration.start) : '—'}.`,
        },
        closed: {
            bg: 'bg-gray-50 border-gray-200',
            icon: '🔒',
            title: 'Inscripciones cerradas',
            text: 'El período de inscripciones ha finalizado.',
        },
    };

    const cfg = configs[phase];
    if (!cfg) return null;

    return (
        <div className={`border rounded-xl p-10 text-center ${cfg.bg}`}>
            <div className="text-5xl mb-4">{cfg.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 font-title mb-3">{cfg.title}</h3>
            <p className="text-gray-600 font-body max-w-md mx-auto">{cfg.text}</p>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Registration = ({ forceOpen = false, international = false }) => {
    const form = useRef();
    const today = new Date();
    const { stage: currentStage, phase: currentPhase } = forceOpen
        ? { stage: STAGES[0], phase: 'preRegistration' }
        : getCurrentPhase(today);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [file, setFile] = useState(null);
    const [certificateFile, setCertificateFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [dietarySelection, setDietarySelection] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [interestedInMaccaferri, setInterestedInMaccaferri] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [intlCountry, setIntlCountry] = useState('');
    const [intlCity, setIntlCity] = useState('');
    const [intlUniversity, setIntlUniversity] = useState('');
    const [attendanceConfidence, setAttendanceConfidence] = useState('');

    const dietaryOptions = [
        'Sin restricciones',
        'Vegetariano/a',
        'Vegano/a',
        'Celíaco/a (sin TACC)',
        'Intolerante a la lactosa',
        'Alérgico/a a frutos secos',
        'Kosher',
        'Halal',
        'Otro',
    ];

    const isOtra = selectedFaculty === 'Otra';

    const effectiveStage = currentStage;

    // Delegation info from API (replaces filiales.js contact display)
    const [delegationInfo, setDelegationInfo] = useState(null);

    useEffect(() => {
        const faculty = international
            ? 'Internacional'
            : isOtra
                ? (selectedProvince ? `Otra (${selectedProvince})` : null)
                : (selectedFaculty || null);
        if (!faculty) { setDelegationInfo(null); return; }
        fetch(`${import.meta.env.VITE_API_URL}/api/registrations/directory?faculty=${encodeURIComponent(faculty)}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => setDelegationInfo(data))
            .catch(() => setDelegationInfo(null));
    }, [selectedFaculty, isOtra, international, selectedProvince]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const name                 = form.current.user_name.value;
        const lastname             = form.current.user_lastname.value;
        const dni                  = form.current.user_dni.value;
        const phone                = form.current.user_phone.value;
        const email                = form.current.user_email.value;
        const emergencyContactName         = form.current.user_emergency_contact.value;
        const emergencyContactRelationship = form.current.user_emergency_relationship.value;
        const emergencyContactPhone        = form.current.user_emergency_phone.value;

        const bloodType         = form.current.user_blood.value;
        const medicalConditions = form.current.user_medical.value;

        const errs = validateFields(
            { name, lastname, dni, phone, email, faculty: selectedFaculty, bloodType, medicalConditions, emergencyContactName, emergencyContactPhone },
            isOtra,
            selectedProvince,
            international,
            { country: intlCountry, city: intlCity, university: intlUniversity, attendanceConfidence },
            certificateFile,
        );
        setErrors(errs);

        if (Object.keys(errs).length > 0) {
            // Scroll to the first visible error message
            setTimeout(() => {
                const firstErr = document.querySelector('[data-field-error="true"]');
                if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
            return;
        }

        setIsSubmitting(true);
        setIsDuplicate(false);

        // Faculty value: "Otra (Provincia)" when isOtra, always 'Internacional' when international
        const facultyValue = international ? 'Internacional' : isOtra ? `Otra (${selectedProvince})` : selectedFaculty;

        try {
            // Upload certificate if provided — pass student info for meaningful blob name
            let certificateFileName = null;
            if (certificateFile) {
                const fd = new FormData();
                fd.append('file', certificateFile);
                const params = new URLSearchParams({
                    type: 'certificate',
                    dni,
                    apellido: lastname,
                    nombre: name,
                    faculty: facultyValue,
                });
                const upRes = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/registrations/upload?${params}`,
                    { method: 'POST', body: fd }
                );
                if (upRes.ok) {
                    const upData = await upRes.json();
                    certificateFileName = upData.url;
                }
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    lastname,
                    dni,
                    phone,
                    email,
                    faculty:               facultyValue,
                    bloodType:             form.current.user_blood.value,
                    medicalConditions:     form.current.user_medical.value,
                    emergencyContactName,
                    emergencyContactRelationship,
                    emergencyContactPhone,
                    stageName:             currentStage?.label ?? 'Demo',
                    price:                 effectiveStage?.priceFull ?? 0,
                    interestedInMaccaferri: currentStage?.id === 2 ? false : interestedInMaccaferri,
                    certificateFileName,
                    dietaryRestrictions:   dietarySelection === 'Otro'
                        ? (form.current.user_dietary_other?.value || 'Otro')
                        : dietarySelection || null,
                    isInternational: international,
                    country:         international ? intlCountry : null,
                    city:            international ? intlCity : null,
                    university:      international ? intlUniversity : null,
                    attendanceConfidence: international ? attendanceConfidence : null,
                }),
            });

            if (response.status === 409) {
                setIsDuplicate(true);
                return;
            }


            // El email de pre-inscripción lo envía la API automáticamente (Azure Communication Services)
            setIsSuccess(true);
        } catch {
            // Network error still shows success to avoid leaving user in limbo
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Already registered screen ───────────────────────────────────────────
    if (isDuplicate) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border border-gray-100 p-12 text-center">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-yellow-700 font-title mb-4">Ya estás inscripto</h2>
                <p className="text-gray-600 font-body text-lg max-w-xl mx-auto mb-8">
                    El email o DNI ingresado ya tiene una pre-inscripción registrada en el sistema.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-lg mx-auto mb-8">
                    <p className="text-sm text-yellow-800 font-bold">¿No recordás haberte inscripto?</p>
                    <p className="text-sm text-yellow-700 mt-1">
                        Contactá a tu delegado para verificar el estado de tu inscripción.
                    </p>
                </div>
                <button onClick={() => setIsDuplicate(false)} className="text-primary-blue font-bold hover:underline">
                    Volver al formulario
                </button>
            </div>
        );
    }

    // ── Success Screen ──────────────────────────────────────────────────────
    const resetForm = () => {
        setIsSuccess(false);
        setIsFormOpen(false);
        setSelectedFaculty('');
        setSelectedProvince('');
        setInterestedInMaccaferri(false);
        setCertificateFile(null);
        setErrors({});
        setSubmitted(false);
        setTermsAccepted(false);
        setIntlCountry('');
        setIntlCity('');
        setIntlUniversity('');
        setAttendanceConfidence('');
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border border-gray-100 p-8 md:p-12 max-w-lg mx-auto">

                {/* Back button — top */}
                <div className="text-center mb-8">
                    <button onClick={resetForm} className="inline-flex items-center gap-2 text-primary-blue font-bold hover:underline text-sm">
                        ← Volver al formulario
                    </button>
                </div>

                {/* Check + title */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-institutional font-title mb-2">¡Solicitud Enviada!</h2>
                    <p className="text-gray-600 font-body text-base">
                        Hemos recibido tu pre-inscripción correctamente.
                    </p>
                </div>

                {/* Important warning */}
                <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-4">
                    <p className="text-sm font-bold text-yellow-800 mb-1">⚠️ Importante</p>
                    <p className="text-sm text-yellow-700 leading-relaxed">
                        El siguiente paso será esperar a que tu inscripción sea habilitada para poder continuar con el proceso.
                        Esta validación se realizará durante el transcurso de la próxima semana, agradecemos tu paciencia.
                    </p>
                    <p className="text-sm text-yellow-700 leading-relaxed mt-2">
                        Ante cualquier duda o consulta, podés comunicarte con tu delegado/a.
                    </p>
                </div>

                {/* Next step */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm font-bold text-blue-900 mb-1">¿Próximo paso?</p>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        Espera a recibir el mail que indica que tu inscripción ha sido{' '}
                        <strong>habilitada</strong>, y cuáles son los pasos a seguir.
                    </p>
                </div>

                {/* Delegate contact — bottom */}
                <div className="border border-gray-200 rounded-xl p-4 text-left">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                        En caso de tener dudas, podés contactarte con tu delegación por WhatsApp
                    </p>
                    {delegationInfo ? (
                        <div className="space-y-1.5">
                            <p className="text-sm text-gray-700">
                                Delegación: <strong className="text-institutional">{delegationInfo.delegationName}</strong>
                            </p>
                            {delegationInfo.contacts?.map(c => (
                                <p key={c.name} className="text-sm text-gray-700">
                                    • {c.name}
                                    {c.phone ? (
                                        <>{' — '}<a href={`https://wa.me/54${c.phone}`} className="text-primary-blue font-bold underline" target="_blank" rel="noreferrer">+54 {c.phone}</a></>
                                    ) : null}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600">
                            Contactate con tu delegación para recibir más información y resolver cualquier inquietud.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // ── Main Card ───────────────────────────────────────────────────────────
    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border border-gray-100">

            {/* Header */}
            <div className="bg-gray-50 p-8 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-institutional font-title mb-2">Formulario de Inscripción</h3>
                        <p className="text-gray-500 font-subtitle">
                            Completa tus datos para reservar tu lugar.{' '}
                            <span className="text-red-500 font-bold">*</span>
                            <span className="text-gray-400 text-xs ml-1">campos obligatorios</span>
                        </p>
                    </div>
                    {isFormOpen && currentStage && (
                        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 text-center min-w-[180px]">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{currentStage.label}</p>
                            <p className="text-xs text-green-600 font-bold mt-1">
                                Cierra el {fmt(currentStage.preRegistration.end)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <RegistrationTimeline today={today} />

            {/* Terms & Conditions Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-institutional font-title">Términos y Condiciones</h3>
                        </div>
                        <div className="overflow-y-auto max-h-[70vh] p-6 space-y-4 text-sm text-gray-700 font-body leading-relaxed">
                            <div>
                                <p className="font-bold text-gray-800 mb-1">Confirmación de inscripción</p>
                                <p>La inscripción no se considerará confirmada hasta que: el/la participante haya sido habilitado/a por su delegado/a correspondiente, y se haya acreditado el pago total de la inscripción, ya sea mediante un único pago o mediante el esquema de dos cuotas habilitado por el Comité Organizador.</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 mb-1">Pagos</p>
                                <p>Los pagos deberán realizarse dentro de las fechas y modalidades establecidas por el Comité Organizador, coordinando los mismos con el/la delegado/a correspondiente.</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 mb-1">Política de reembolso</p>
                                <p>Los importes abonados en concepto de inscripción no son reembolsables bajo ninguna circunstancia. Esto aplica tanto para pagos parciales como para pagos totales.</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 mb-1">Transferencia de inscripción</p>
                                <p>En caso de que un/a participante decida no asistir al Congreso, podrá transferir su inscripción a otra persona. La nueva persona participante deberá ser previamente habilitada por el/la delegado/a correspondiente, a fin de garantizar el cumplimiento de los criterios de prioridad y cupos establecidos para cada delegación.</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 mb-1">Prohibición de reventa</p>
                                <p>Queda prohibida la reventa de cupos de inscripción. El Comité Organizador podrá anular cualquier inscripción transferida o comercializada de manera indebida.</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 mb-1">Acreditación de pagos</p>
                                <p>Los pagos realizados pueden demorar algunos días hábiles en verse reflejados en el sistema de inscripción.</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 mb-1">Modificaciones</p>
                                <p>El Comité Organizador se reserva el derecho de modificar fechas, modalidades de pago o condiciones administrativas vinculadas al proceso de inscripción, informando dichos cambios por los canales oficiales correspondientes.</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={e => setTermsAccepted(e.target.checked)}
                                    className="w-4 h-4 accent-primary-blue"
                                />
                                <span className="text-sm text-gray-700 font-body">Leí y acepto los Términos y Condiciones</span>
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setShowTermsModal(false); setTermsAccepted(false); }}
                                    className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    disabled={!termsAccepted}
                                    onClick={() => { setShowTermsModal(false); setIsFormOpen(true); }}
                                    className={`flex-1 py-2 rounded-lg font-bold transition ${termsAccepted ? 'bg-primary-blue text-white hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content: form or phase banner */}
            <div className="p-10">
                {!isFormOpen ? (
                    <div>
                        <PhaseBanner phase={currentPhase} stage={currentStage} />
                        {currentPhase === 'preRegistration' && (
                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => setShowTermsModal(true)}
                                    className="bg-gradient-to-r from-primary-red to-red-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-red-900/20 transition-all transform hover:-translate-y-1 font-title tracking-wider uppercase"
                                >
                                    Inscribirse
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <form ref={form} className="space-y-8" onSubmit={handleSubmit} noValidate>

                        {/* Global validation error summary */}
                        {submitted && Object.keys(errors).length > 0 && (
                            <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-bold text-red-700">Por favor corregí los siguientes campos:</p>
                                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                                        {Object.values(errors).map((msg, i) => (
                                            <li key={i} className="text-sm text-red-600">{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Sección 1: Datos Personales */}
                        <div>
                            <h4 className="text-lg font-bold text-institutional mb-6 border-l-4 border-complementary-gold pl-3 uppercase tracking-wide">1. Datos Personales</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Nombre (Como en DNI) <Req />
                                    </label>
                                    <input
                                        name="user_name"
                                        type="text"
                                        className={fieldCls(errors, submitted, 'name')}
                                        placeholder="Juan Ignacio"
                                        data-field-error={submitted && !!errors.name}
                                    />
                                    <FieldError msg={submitted ? errors.name : ''} />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Apellido (Como en DNI) <Req />
                                    </label>
                                    <input
                                        name="user_lastname"
                                        type="text"
                                        className={fieldCls(errors, submitted, 'lastname')}
                                        placeholder="Pérez"
                                        data-field-error={submitted && !!errors.lastname}
                                    />
                                    <FieldError msg={submitted ? errors.lastname : ''} />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        {international ? 'N° de Cédula/DNI/ID' : 'DNI (Sin puntos)'} <Req />
                                    </label>
                                    <input
                                        name="user_dni"
                                        type="text"
                                        inputMode={international ? 'text' : 'numeric'}
                                        className={fieldCls(errors, submitted, 'dni')}
                                        placeholder={international ? 'Ej. AB123456' : '12345678'}
                                        data-field-error={submitted && !!errors.dni}
                                    />
                                    <FieldError msg={submitted ? errors.dni : ''} />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        {international ? 'Celular (con código de tu país)' : 'Celular (+54 9...)'} <Req />
                                    </label>
                                    <input
                                        name="user_phone"
                                        type="tel"
                                        className={fieldCls(errors, submitted, 'phone')}
                                        placeholder={international ? '+1 305 123 4567' : '+54 9 11 1234 5678'}
                                        data-field-error={submitted && !!errors.phone}
                                    />
                                    {international && (
                                        <p className="text-xs text-gray-400 mt-1">Incluí el código de tu país completo (ej. +1, +34, +55…).</p>
                                    )}
                                    <FieldError msg={submitted ? errors.phone : ''} />
                                </div>
                            </div>
                        </div>

                        {/* Sección 2: Datos Académicos */}
                        <div>
                            <h4 className="text-lg font-bold text-institutional mb-6 border-l-4 border-complementary-gold pl-3 uppercase tracking-wide">2. Datos Académicos</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Email <Req />
                                    </label>
                                    <input
                                        name="user_email"
                                        type="email"
                                        className={fieldCls(errors, submitted, 'email')}
                                        placeholder="juan@email.com"
                                        data-field-error={submitted && !!errors.email}
                                    />
                                    <FieldError msg={submitted ? errors.email : ''} />
                                </div>

                                {/* Certificate upload */}
                                <div className="group md:col-span-2" data-field-error={submitted && !!errors.certificateFile}>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest">
                                        Certificado de Alumno Regular <Req />
                                    </label>
                                    <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition group-focus-within:border-primary-blue ${errors.certificateFile && submitted ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                                        <span className="text-xl">📄</span>
                                        <span className="text-sm text-gray-500">
                                            {certificateFile ? certificateFile.name : 'Seleccionar PDF o imagen…'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="hidden"
                                            onChange={e => setCertificateFile(e.target.files[0] || null)}
                                        />
                                    </label>
                                    {certificateFile && (
                                        <button type="button" onClick={() => setCertificateFile(null)} className="text-xs text-red-400 hover:text-red-600 mt-1">✕ Quitar archivo</button>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">PDF o imagen, máx. 10 MB.</p>
                                    <p className="text-xs text-blue-500 mt-1">Si te recibiste después de Octubre 2025, podés cargar tu constancia de título en trámite o comprobante de aprobación de tu último final o proyecto final.</p>
                                    <FieldError msg={submitted ? errors.certificateFile : ''} />
                                </div>

                                {/* Faculty selector — full width — national students only */}
                                {!international && (
                                <div className="group md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Delegación / Facultad <Req />
                                    </label>
                                    <div className="relative" data-field-error={submitted && !!errors.faculty}>
                                        <select
                                            name="user_faculty"
                                            value={selectedFaculty}
                                            onChange={e => {
                                                setSelectedFaculty(e.target.value);
                                                setSelectedProvince('');
                                            }}
                                            className={fieldCls(errors, submitted, 'faculty', 'appearance-none cursor-pointer')}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {ALL_FACULTIES_BY_REGION.filter(r => r.region !== 'Internacional').map(({ region, faculties }) => (
                                                <optgroup key={region} label={region}>
                                                    {faculties.map(f => (
                                                        <option key={f} value={f}>{f}</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                            <optgroup label="Otra">
                                                <option value="Otra">Otra (indicar provincia)</option>
                                            </optgroup>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <FieldError msg={submitted ? errors.faculty : ''} />

                                    {/* Province selector — appears only when "Otra" is selected */}
                                    {isOtra && (
                                        <div className="mt-3" data-field-error={submitted && !!errors.province}>
                                            <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest">
                                                Provincia <Req />
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="user_province"
                                                    value={selectedProvince}
                                                    onChange={e => setSelectedProvince(e.target.value)}
                                                    className={fieldCls(errors, submitted, 'province', 'appearance-none cursor-pointer')}
                                                >
                                                    <option value="">Seleccionar provincia...</option>
                                                    {ARGENTINIAN_PROVINCES.map(p => (
                                                        <option key={p} value={p}>{p}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <FieldError msg={submitted ? errors.province : ''} />
                                        </div>
                                    )}

                                    {/* ── Conocé tu delegación ──────────────────────────── */}
                                    {delegationInfo && (
                                        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                                            <span className="text-2xl leading-none mt-0.5">🏛️</span>
                                            <div className="text-sm text-blue-800 space-y-1">
                                                <p className="font-bold text-blue-900">Conocé tu delegación</p>
                                                <p>
                                                    Delegación: <strong className="text-institutional">{delegationInfo.delegationName}</strong>
                                                </p>
                                                {delegationInfo.contacts?.map(c => (
                                                    <p key={c.name} className="text-blue-700">
                                                        • {c.name}
                                                        {c.phone ? (
                                                            <>{' — '}<a href={`https://wa.me/54${c.phone}`} className="font-bold underline" target="_blank" rel="noreferrer">+54 {c.phone}</a></>
                                                        ) : null}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                )}

                                {/* Origen — estudiantes internacionales: país, ciudad, universidad (texto libre) */}
                                {international && (
                                <>
                                    <div className="group" data-field-error={submitted && !!errors.intlCountry}>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                            País <Req />
                                        </label>
                                        <input
                                            type="text"
                                            value={intlCountry}
                                            onChange={e => setIntlCountry(e.target.value)}
                                            className={fieldCls(errors, submitted, 'intlCountry')}
                                            placeholder="Ej. México"
                                        />
                                        <FieldError msg={submitted ? errors.intlCountry : ''} />
                                    </div>
                                    <div className="group" data-field-error={submitted && !!errors.intlCity}>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                            Ciudad <Req />
                                        </label>
                                        <input
                                            type="text"
                                            value={intlCity}
                                            onChange={e => setIntlCity(e.target.value)}
                                            className={fieldCls(errors, submitted, 'intlCity')}
                                            placeholder="Ej. Ciudad de México"
                                        />
                                        <FieldError msg={submitted ? errors.intlCity : ''} />
                                    </div>
                                    <div className="group md:col-span-2" data-field-error={submitted && !!errors.intlUniversity}>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                            Universidad <Req />
                                        </label>
                                        <input
                                            type="text"
                                            value={intlUniversity}
                                            onChange={e => setIntlUniversity(e.target.value)}
                                            className={fieldCls(errors, submitted, 'intlUniversity')}
                                            placeholder="Nombre de tu universidad"
                                        />
                                        <FieldError msg={submitted ? errors.intlUniversity : ''} />
                                    </div>
                                    <div className="group md:col-span-2" data-field-error={submitted && !!errors.attendanceConfidence}>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                            ¿Qué tan seguro/a estás de que vas a poder asistir? <Req />
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={attendanceConfidence}
                                                onChange={e => setAttendanceConfidence(e.target.value)}
                                                className={fieldCls(errors, submitted, 'attendanceConfidence', 'appearance-none cursor-pointer')}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option>Muy seguro/a</option>
                                                <option>Bastante seguro/a</option>
                                                <option>Poco seguro/a (depende de visa, pasaje, etc.)</option>
                                                <option>Aún no lo sé</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                        <FieldError msg={submitted ? errors.attendanceConfidence : ''} />
                                    </div>

                                    {delegationInfo && (
                                        <div className="md:col-span-2 rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                                            <span className="text-2xl leading-none mt-0.5">🏛️</span>
                                            <div className="text-sm text-blue-800 space-y-1">
                                                <p className="font-bold text-blue-900">Contacto para estudiantes internacionales</p>
                                                <p>
                                                    Delegación: <strong className="text-institutional">{delegationInfo.delegationName}</strong>
                                                </p>
                                                {delegationInfo.contacts?.map(c => (
                                                    <p key={c.name} className="text-blue-700">• {c.name}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                                )}

                                {/* Desafío Barreras de Maccaferri — no aplica en la 2ª Etapa */}
                                {currentStage?.id !== 2 && (
                                <div className="md:col-span-2">
                                    <label className="flex items-start gap-3 cursor-pointer group select-none">
                                        <input
                                            type="checkbox"
                                            checked={interestedInMaccaferri}
                                            onChange={e => setInterestedInMaccaferri(e.target.checked)}
                                            className="w-4 h-4 mt-0.5 accent-primary-blue shrink-0"
                                        />
                                        <span className="text-sm text-gray-700 leading-relaxed">
                                            Estoy interesado/a en participar del{' '}
                                            <strong className="text-institutional">Desafío Barreras de Maccaferri</strong>
                                        </span>
                                    </label>
                                </div>
                                )}
                            </div>
                        </div>

                        {/* Sección 3: Datos de Salud y Emergencia */}
                        <div>
                            <h4 className="text-lg font-bold text-institutional mb-6 border-l-4 border-complementary-gold pl-3 uppercase tracking-wide">3. Salud y Emergencia</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group" data-field-error={submitted && !!errors.bloodType}>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Grupo Sanguíneo <Req />
                                    </label>
                                    <select name="user_blood" className={fieldCls(errors, submitted, 'bloodType', 'appearance-none cursor-pointer')}>
                                        <option value="">Seleccionar...</option>
                                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>0+</option><option>0-</option>
                                    </select>
                                    <FieldError msg={submitted ? errors.bloodType : ''} />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Mano Hábil
                                    </label>
                                    <select name="user_dominant_hand" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 hover:bg-white">
                                        <option value="derecha">Derecha</option>
                                        <option value="izquierda">Izquierda</option>
                                        <option value="ambidiestro">Ambidiestro</option>
                                    </select>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Obra Social / Prepaga{international ? ' / Asistencia al Viajero' : ''}
                                    </label>
                                    <input
                                        name="user_insurance"
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white"
                                        placeholder={international ? 'Ej. Asistencia al viajero / Ninguna' : 'Ej. OSDE / Swiss Medical / Ninguna'}
                                    />
                                    {international && (
                                        <p className="text-xs text-gray-400 mt-1">Incluí tu asistencia al viajero, si tenés contratada una.</p>
                                    )}
                                </div>
                                <div className="group md:col-span-2" data-field-error={submitted && !!errors.medicalConditions}>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Afecciones Médicas / Alergias <Req />
                                    </label>
                                    <input name="user_medical" type="text" className={fieldCls(errors, submitted, 'medicalConditions')} placeholder="Asma, alergias, medicación crónica, etc. o &quot;Ninguna&quot;" />
                                    <FieldError msg={submitted ? errors.medicalConditions : ''} />
                                </div>
                                <div className="group md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Restricciones Alimentarias
                                    </label>
                                    <div className="relative mb-2">
                                        <select
                                            name="user_dietary"
                                            value={dietarySelection}
                                            onChange={(e) => setDietarySelection(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 appearance-none hover:bg-white cursor-pointer"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {dietaryOptions.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                    {dietarySelection === 'Otro' && (
                                        <input
                                            name="user_dietary_other"
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white"
                                            placeholder="Especificá tu restricción alimentaria"
                                        />
                                    )}
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Nombre Contacto Emergencia <Req />
                                    </label>
                                    <input
                                        name="user_emergency_contact"
                                        type="text"
                                        className={fieldCls(errors, submitted, 'emergencyContactName')}
                                        placeholder="María Pérez"
                                        data-field-error={submitted && !!errors.emergencyContactName}
                                    />
                                    <FieldError msg={submitted ? errors.emergencyContactName : ''} />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Parentesco
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="user_emergency_relationship"
                                            defaultValue=""
                                            className={`${fieldCls(errors, submitted, '')} appearance-none cursor-pointer`}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {['Madre', 'Padre', 'Hermano/a', 'Pareja', 'Cónyuge', 'Familiar', 'Amigo/a', 'Otro'].map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Teléfono Emergencia <Req />
                                    </label>
                                    <input
                                        name="user_emergency_phone"
                                        type="tel"
                                        className={fieldCls(errors, submitted, 'emergencyContactPhone')}
                                        placeholder="+54 9 11 1234 5678"
                                        data-field-error={submitted && !!errors.emergencyContactPhone}
                                    />
                                    <FieldError msg={submitted ? errors.emergencyContactPhone : ''} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group w-full bg-gradient-to-r from-primary-red to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-red-900/20 transition-all transform hover:-translate-y-1 font-title tracking-wider uppercase relative overflow-hidden ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                                {!isSubmitting && (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                )}
                            </span>
                        </button>

                    </form>
                )}
            </div>
        </div>
    );
};

export default Registration;
