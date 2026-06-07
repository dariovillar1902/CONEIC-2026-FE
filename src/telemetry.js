import { ApplicationInsights } from '@microsoft/applicationinsights-web';

/**
 * Azure Application Insights — telemetría del frontend.
 *
 * Rastrea automáticamente:
 *   - Page views (con cada cambio de ruta)
 *   - Errores JS no capturados
 *   - Performance (LCP, FID, CLS)
 *   - Llamadas fetch/XHR (duración y errores)
 *
 * El objeto `appInsights` queda exportado para eventos personalizados:
 *   import { appInsights } from './telemetry';
 *   appInsights?.trackEvent({ name: 'RegistrationSubmitted' });
 */

const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;

let appInsights = null;

if (connectionString) {
    appInsights = new ApplicationInsights({
        config: {
            connectionString,
            // Tracking automático de navegación SPA via History API
            enableAutoRouteTracking: true,
            // Propaga correlation IDs a las llamadas a la API (une trazas frontend+backend)
            enableCorsCorrelation: true,
            enableRequestHeaderTracking: true,
            enableResponseHeaderTracking: true,
            // Captura excepciones JS no manejadas
            disableExceptionTracking: false,
            // Muestreo al 100% (bajarlo si el volumen es alto)
            samplingPercentage: 100,
        },
    });

    appInsights.loadAppInsights();
    appInsights.trackPageView(); // registra la página inicial
}

export { appInsights };
