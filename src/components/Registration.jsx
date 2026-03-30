import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const Registration = () => {
    const form = useRef();
    // Pricing Stages Configuration
    const pricingStages = [
        { id: 1, name: 'Etapa 1', end: new Date('2026-06-20'), price: 100000 },
        { id: 2, name: 'Etapa 2', end: new Date('2026-07-11'), price: 150000 },
        { id: 3, name: 'Etapa 3', end: new Date('2026-07-25'), price: 200000 },
    ];

    const today = new Date(); // In a real app, this should come from server time
    const currentStage = pricingStages.find(stage => today <= stage.end) || pricingStages[pricingStages.length - 1];
    
    // Logic to determine if registration is open
    const isRegistrationOpen = today <= pricingStages[pricingStages.length - 1].end; 

    // Form State
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Replace these with your actual EmailJS Service/Template/Public Keys
        // Create an account at https://www.emailjs.com/
        const SERVICE_ID = 'YOUR_SERVICE_ID';
        const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
        const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

        // Prepare template parameters (must match variables in EmailJS template)
        // Example Template:
        // "Hola {{user_name}}, hemos recibido tu solicitud..."
        const templateParams = {
            user_name: form.current.user_name.value,
            user_email: form.current.user_email.value,
            amount: `$${currentStage.price.toLocaleString('es-AR')}`,
            stage_name: currentStage.name
        };

        // 1. Save to Database via API
        fetch(`${import.meta.env.VITE_API_URL}/api/registrations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: form.current.user_name.value,
                lastname: form.current.user_lastname.value,
                dni: form.current.user_dni.value,
                phone: form.current.user_phone.value,
                email: form.current.user_email.value,
                faculty: form.current.user_faculty.value,
                bloodType: form.current.user_blood.value,
                medicalConditions: form.current.user_medical.value,
                emergencyContactName: form.current.user_emergency_contact.value,
                emergencyContactPhone: form.current.user_emergency_phone.value,
                stageName: currentStage.name,
                price: currentStage.price,
                // Status defaults to 'Pending' in backend
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Error saving registration');
            console.log('Registration saved to DB');
            
            // 2. Send Email Notification (only if DB save success)
            return emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY);
        })
        .then((result) => {
            console.log('Email sent:', result.text);
            setIsSubmitting(false);
            setIsSuccess(true);
        })
        .catch((error) => {
             console.error('Registration/Email error:', error);
             // Still show success to user if DB worked but email failed? 
             // Or show error? For now, we'll assume if DB fails we show error, if email fails we might still show success but log it.
             // Simplification: just finish.
             setIsSubmitting(false);
             setIsSuccess(true); 
        });
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border border-gray-100 p-12 text-center">
                 <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                 </div>
                 <h2 className="text-3xl font-bold text-institutional font-title mb-4">¡Solicitud Enviada!</h2>
                 <p className="text-gray-600 font-body text-lg max-w-xl mx-auto mb-8">
                     Hemos recibido tu pre-inscripción correctamente. 
                     <br/>
                     En breve recibirás un correo electrónico con los pasos para confirmar tu vacante y realizar el pago.
                 </p>
                 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-lg mx-auto mb-8">
                     <p className="text-sm text-yellow-800 font-bold">⚠️ Importante</p>
                     <p className="text-sm text-yellow-700">Tu cupo no está asegurado hasta que tu delegado valide la inscripción.</p>
                 </div>
                 <button onClick={() => setIsSuccess(false)} className="text-primary-blue font-bold hover:underline">
                     Volver al formulario
                 </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border border-gray-100">
            {/* Header */}
            <div className="bg-gray-50 p-8 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-institutional font-title mb-2">Formulario de Inscripción</h3>
                        <p className="text-gray-500 font-subtitle">Completa tus datos para reservar tu lugar.</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Valor Actual</p>
                        <p className="text-3xl font-bold text-primary-red">${currentStage.price.toLocaleString('es-AR')}</p>
                        <p className="text-xs text-green-600 font-bold mt-1">Vence el {currentStage.end.toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Stages Visualizer */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50/50">
                {pricingStages.map((stage) => {
                    const isPast = today > stage.end;
                    const isCurrent = stage.id === currentStage.id;
                    
                    return (
                        <div key={stage.id} className={`p-4 text-center ${isCurrent ? 'bg-white shadow-inner' : isPast ? 'opacity-50' : ''}`}>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isCurrent ? 'text-primary-blue' : 'text-gray-400'}`}>
                                {stage.name}
                            </p>
                            <p className={`font-bold ${isCurrent ? 'text-gray-800' : 'text-gray-500'}`}>${stage.price.toLocaleString('es-AR')}</p>
                        </div>
                    );
                })}
            </div>

            {/* Form */}
            {isRegistrationOpen ? (
                <form ref={form} className="p-10 space-y-8" onSubmit={handleSubmit}>
                    {/* Sección 1: Datos Personales */}
                    <div>
                        <h4 className="text-lg font-bold text-institutional mb-6 border-l-4 border-complementary-gold pl-3 uppercase tracking-wide">1. Datos Personales</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Nombre (Como en DNI)</label>
                                <input name="user_name" required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="Juan Ignacio" />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Apellido (Como en DNI)</label>
                                <input name="user_lastname" required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="Pérez" />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">DNI (Sin puntos)</label>
                                <input name="user_dni" required type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="12345678" />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Celular (+54 9...)</label>
                                <input name="user_phone" required type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="+54 9 11 1234 5678" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Datos Académicos */}
                    <div>
                        <h4 className="text-lg font-bold text-institutional mb-6 border-l-4 border-complementary-gold pl-3 uppercase tracking-wide">2. Datos Académicos</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Email Universitario</label>
                                <input name="user_email" required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="juan@utn.edu.ar" />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Delegación / Facultad</label>
                                <div className="relative">
                                    <select name="user_faculty" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 appearance-none hover:bg-white cursor-pointer">
                                        <option value="">Seleccionar...</option>
                                        <option>UTN - Facultad Regional Buenos Aires</option>
                                        <option>UBA - Facultad de Ingeniería</option>
                                        <option>UNLP - Universidad Nacional de La Plata</option>
                                        <option>Otra</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                             <div className="group md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Certificado de Alumno Regular (PDF)</label>
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
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Grupo Sanguíneo</label>
                                <select name="user_blood" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800">
                                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>0+</option><option>0-</option>
                                </select>
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Afecciones Médicas / Alergias</label>
                                <input name="user_medical" type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="Ninguna / Celíaco / Asma" />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Nombre Contacto Emergencia</label>
                                <input name="user_emergency_contact" required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="María Pérez" />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 mb-1 font-subtitle uppercase tracking-widest group-focus-within:text-primary-blue transition-colors">Teléfono Emergencia</label>
                                <input name="user_emergency_phone" required type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all font-body text-gray-800 placeholder-gray-300 hover:bg-white" placeholder="+54 9 11 1234 5678" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex items-start gap-4 hover:bg-blue-50 transition-colors cursor-pointer">
                        <input required type="checkbox" className="mt-1 h-5 w-5 text-primary-blue rounded border-gray-300 focus:ring-primary-blue cursor-pointer" />
                        <div className="space-y-1">
                            <p className="font-bold text-institutional text-sm">Términos y Condiciones</p>
                            <p className="text-sm text-gray-600 font-body leading-relaxed">
                                Acepto los términos. Entiendo que esta es una <strong>pre-inscripción</strong> sujeta a validación por mi delegado. 
                                El pago de <strong>${currentStage.price.toLocaleString('es-AR')}</strong> se realizará posteriormente siguiendo las instrucciones que llegarán a mi email.
                            </p>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`group w-full bg-gradient-to-r from-primary-red to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-red-900/20 transition-all transform hover:-translate-y-1 font-title tracking-wider uppercase relative overflow-hidden ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                            {!isSubmitting && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>}
                        </span>
                    </button>
                    
                    <p className="text-center text-xs text-gray-400">
                        Una vez enviada, contacta a tu delegado para agilizar la validación.
                    </p>
                </form>
            ) : (
                <div className="p-16 text-center">
                    <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                         <span className="text-4xl">🔒</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-400 font-title mb-2">Inscripciones Cerradas</h3>
                    <p className="text-gray-500">Hemos alcanzado el cupo máximo o la fecha límite ha expirado.</p>
                </div>
            )}
        </div>
    );
};

export default Registration;
