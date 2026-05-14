import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import {
    ALL_FACULTIES_BY_REGION,
    getContactForFaculty,
    getContactForProvince,
    ARGENTINIAN_PROVINCES,
} from '../data/filiales.js';

// ─── Stage & Phase Configuration ─────────────────────────────────────────────
// NOTE: All dates are preliminary pending approval by ANEIC Argentina CD.
// Prices are assumed and must be confirmed before launch.
const STAGES = [
    {
        id: 1,
        label: 'Primera Etapa',
        priceFull: 100000,
        priceInstallment: 55000,
        preRegistration: { start: new Date('2026-05-25'), end: new Date('2026-05-31') },
        delegatePhase:   { start: new Date('2026-06-01'), end: new Date('2026-06-07') },
        paymentPhase:    { start: new Date('2026-06-08'), end: new Date('2026-06-14') },
    },
    {
        id: 2,
        label: 'Segunda Etapa',
        priceFull: 130000,
        priceInstallment: 70000,
        preRegistration: { start: new Date('2026-06-29'), end: new Date('2026-07-05') },
        delegatePhase:   { start: new Date('2026-07-06'), end: new Date('2026-07-12') },
        paymentPhase:    { start: new Date('2026-07-13'), end: new Date('2026-07-19') },
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
    if (today > STAGES[0].paymentPhase.end && today < STAGES[1].preRegistration.start)
        return { stage: STAGES[1], phase: 'between' };
    return { stage: null, phase: 'closed' };
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validateFields = (data, isOtra, province) => {
    const errs = {};
    if (!data.name.trim()) errs.name = 'El nombre es requerido.';
    if (!data.lastname.trim()) errs.lastname = 'El apellido es requerido.';
    const dniDigits = data.dni.replace(/\D/g, '');
    if (!/^\d{7,8}$/.test(dniDigits)) errs.dni = 'El DNI debe tener 7 u 8 dígitos.';
    if (!data.phone.trim()) errs.phone = 'El celular es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Ingresá un email válido.';
    if (!data.faculty) errs.faculty = 'Seleccioná una facultad o delegación.';
    if (isOtra && !province) errs.province = 'Seleccioná tu provincia.';
    if (!data.emergencyContactName.trim()) errs.emergencyContactName = 'El nombre del contacto de emergencia es requerido.';
    if (!data.emergencyContactPhone.trim()) errs.emergencyContactPhone = 'El teléfono de emergencia es requerido.';
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
    { key: 'delegatePhase',   label: 'Delegados' },
    { key: 'paymentPhase',    label: 'Pagos' },
];

const RegistrationTimeline = ({ today }) => (
    <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
            Cronograma — Fechas preliminares
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-center">
            {STAGES.map((stage, si) => (
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
            text: `La pre-inscripción para la Segunda Etapa abre el ${fmt(STAGES[1].preRegistration.start)}.`,
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
const Registration = () => {
    const form = useRef();
    const today = new Date();
    const { stage: currentStage, phase: currentPhase } = getCurrentPhase(today);
    const isFormOpen = true; // TODO: remove before launch — bypasses date restriction for demo

    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [dietarySelection, setDietarySelection] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

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

    // Resolved contact (delegate or ANEIC vocal) for the selected faculty/province
    const delegateContact = isOtra
        ? (selectedProvince ? getContactForProvince(selectedProvince) : null)
        : (selectedFaculty  ? getContactForFaculty(selectedFaculty)   : null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const name                 = form.current.user_name.value;
        const lastname             = form.current.user_lastname.value;
        const dni                  = form.current.user_dni.value;
        const phone                = form.current.user_phone.value;
        const email                = form.current.user_email.value;
        const emergencyContactName = form.current.user_emergency_contact.value;
        const emergencyContactPhone = form.current.user_emergency_phone.value;

        const errs = validateFields(
            { name, lastname, dni, phone, email, faculty: selectedFaculty, emergencyContactName, emergencyContactPhone },
            isOtra,
            selectedProvince,
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

        // Faculty value: "Otra (Provincia)" when isOtra
        const facultyValue = isOtra ? `Otra (${selectedProvince})` : selectedFaculty;

        try {
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
                    emergencyContactPhone,
                    stageName:             currentStage?.label ?? 'Demo',
                    price:                 currentStage?.priceFull ?? 0,
                }),
            });

            if (response.status === 409) {
                setIsDuplicate(true);
                return;
            }

            const data = await response.json();
            const generatedPassword = data.generatedPassword ?? null;

            // Send confirmation email via EmailJS (non-blocking)
            const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_REGISTRATION;
            const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (serviceId && templateId && publicKey) {
                try {
                    await emailjs.send(
                        serviceId,
                        templateId,
                        {
                            to_name:        name,
                            to_email:       email,
                            faculty:        facultyValue,
                            delegate_name:  delegateContact?.name  ?? 'tu delegado',
                            delegate_email: delegateContact?.email ?? 'secretaria@aneic.org.ar',
                            filial_name:    delegateContact?.filialName ?? 'ANEIC Nacional',
                            temp_password:  generatedPassword ?? '—',
                            login_url:      `${window.location.origin}/login`,
                        },
                        publicKey,
                    );
                } catch {
                    // email optional — continue regardless
                }
            }

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
                    El email ingresado ya tiene una pre-inscripción registrada en el sistema.
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
    if (isSuccess) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border border-gray-100 p-12 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-institutional font-title mb-4">¡Solicitud Enviada!</h2>
                <p className="text-gray-600 font-body text-lg max-w-xl mx-auto mb-8">
                    Hemos recibido tu pre-inscripción correctamente.
                </p>

                {/* Per-filial contact info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-lg mx-auto mb-4 text-left">
                    <p className="text-sm text-blue-800 font-bold mb-1">
                        📋 Próximo paso: coordiná con tu{' '}
                        {delegateContact?.isVocal ? 'vocal ANEIC' : 'delegado/a'}
                    </p>
                    {delegateContact ? (
                        <>
                            <p className="text-sm text-blue-700">
                                Filial: <strong>{delegateContact.filialName}</strong>
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                                Contacto: <strong>{delegateContact.name}</strong> —{' '}
                                <a href={`mailto:${delegateContact.email}`} className="font-bold underline hover:text-blue-900">
                                    {delegateContact.email}
                                </a>
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-blue-700">
                            Contactá a tu delegado para coordinar el pago y confirmar tu vacante.
                        </p>
                    )}
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-lg mx-auto mb-4 text-left">
                    <p className="text-sm text-green-800 font-bold mb-1">🔑 Tu acceso al portal</p>
                    <p className="text-sm text-green-700">
                        Te enviamos un email con una contraseña temporaria. Ingresá con tu email universitario y cambiá la contraseña en tu primer inicio de sesión.
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-lg mx-auto mb-8">
                    <p className="text-sm text-yellow-800 font-bold">⚠️ Importante</p>
                    <p className="text-sm text-yellow-700">
                        Tu cupo no está asegurado hasta que tu delegado habilite tu inscripción y confirme el pago.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setIsSuccess(false);
                        setSelectedFaculty('');
                        setSelectedProvince('');
                        setErrors({});
                        setSubmitted(false);
                    }}
                    className="text-primary-blue font-bold hover:underline"
                >
                    Volver al formulario
                </button>
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
                            <p className="text-3xl font-bold text-primary-red">${currentStage.priceFull.toLocaleString('es-AR')}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                o 2 cuotas de ${currentStage.priceInstallment.toLocaleString('es-AR')}
                            </p>
                            <p className="text-xs text-green-600 font-bold mt-1">
                                Cierra el {fmt(currentStage.preRegistration.end)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <RegistrationTimeline today={today} />

            {/* Content: form or phase banner */}
            <div className="p-10">
                {!isFormOpen ? (
                    <PhaseBanner phase={currentPhase} stage={currentStage} />
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
                                        DNI (Sin puntos) <Req />
                                    </label>
                                    <input
                                        name="user_dni"
                                        type="text"
                                        inputMode="numeric"
                                        className={fieldCls(errors, submitted, 'dni')}
                                        placeholder="12345678"
                                        data-field-error={submitted && !!errors.dni}
                                    />
                                    <FieldError msg={submitted ? errors.dni : ''} />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Celular (+54 9...) <Req />
                                    </label>
                                    <input
                                        name="user_phone"
                                        type="tel"
                                        className={fieldCls(errors, submitted, 'phone')}
                                        placeholder="+54 9 11 1234 5678"
                                        data-field-error={submitted && !!errors.phone}
                                    />
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
                                        Email Universitario <Req />
                                    </label>
                                    <input
                                        name="user_email"
                                        type="email"
                                        className={fieldCls(errors, submitted, 'email')}
                                        placeholder="juan@utn.edu.ar"
                                        data-field-error={submitted && !!errors.email}
                                    />
                                    <FieldError msg={submitted ? errors.email : ''} />
                                </div>

                                {/* Faculty selector — full width */}
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
                                            {ALL_FACULTIES_BY_REGION.map(({ region, faculties }) => (
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

                                    {/* ── Conocé tu filial ─────────────────────────────────── */}
                                    {delegateContact && (
                                        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                                            <span className="text-2xl leading-none mt-0.5">🏛️</span>
                                            <div className="text-sm text-blue-800 space-y-0.5">
                                                <p className="font-bold text-blue-900">
                                                    Conocé tu filial — {delegateContact.filialName}
                                                </p>
                                                {delegateContact.isVocal ? (
                                                    <p>
                                                        Tu región no tiene delegado designado aún. Tu contacto de referencia es el/la{' '}
                                                        <strong>{delegateContact.name}</strong>:{' '}
                                                        <a href={`mailto:${delegateContact.email}`} className="underline hover:text-blue-900 font-semibold">
                                                            {delegateContact.email}
                                                        </a>
                                                    </p>
                                                ) : (
                                                    <p>
                                                        Tu delegado/a es <strong>{delegateContact.name}</strong>. Podés contactarle en{' '}
                                                        <a href={`mailto:${delegateContact.email}`} className="underline hover:text-blue-900 font-semibold">
                                                            {delegateContact.email}
                                                        </a>{' '}
                                                        para coordinar el pago y confirmar tu vacante.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Certificate upload */}
                                <div className="group md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Certificado de Alumno Regular (PDF)
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition cursor-pointer relative">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-blue hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-blue">
                                                    <span>Subir un archivo</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} />
                                                </label>
                                                <p className="pl-1">o arrastrar y soltar</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PDF hasta 5MB</p>
                                            {file && <p className="text-sm font-bold text-green-600 mt-2">Archivo seleccionado: {file.name}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección 3: Datos de Salud y Emergencia */}
                        <div>
                            <h4 className="text-lg font-bold text-institutional mb-6 border-l-4 border-complementary-gold pl-3 uppercase tracking-wide">3. Salud y Emergencia</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Grupo Sanguíneo
                                    </label>
                                    <select name="user_blood" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800">
                                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>0+</option><option>0-</option>
                                    </select>
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
                                        Obra Social / Prepaga
                                    </label>
                                    <input name="user_insurance" type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="Ej. OSDE / Swiss Medical / Ninguna" />
                                </div>
                                <div className="group md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">
                                        Afecciones Médicas / Alergias
                                    </label>
                                    <input name="user_medical" type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="Asma, alergias, medicación crónica, etc." />
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

                        {/* Terms */}
                        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex items-start gap-4 hover:bg-blue-50 transition-colors cursor-pointer">
                            <input required type="checkbox" className="mt-1 h-5 w-5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue cursor-pointer" />
                            <div className="space-y-1">
                                <p className="font-bold text-institutional text-sm">Términos y Condiciones</p>
                                <p className="text-sm text-gray-600 font-body leading-relaxed">
                                    Acepto los términos. Entiendo que esta es una <strong>pre-inscripción</strong> sujeta a validación por mi delegado.
                                    El pago se realizará posteriormente siguiendo las instrucciones de mi delegación.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group w-full bg-gradient-to-r from-primary-red to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-red-900/20 transition-all transform hover:-translate-y-1 font-title tracking-wider uppercase relative overflow-hidden ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
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

                        <p className="text-center text-xs text-gray-400">
                            Una vez enviada, contactá a tu delegado para agilizar la validación.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Registration;
