import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (command: string, event: string, params?: Record<string, unknown>) => void;
  }
}

// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'https://fuerzaparaseguir.com/api';

// Variable para almacenar la sucursal actual
let currentBranch: string | null = null;

// Obtener o crear session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Detectar tipo de dispositivo
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Detectar navegador
const getBrowserInfo = (): { name: string; version: string } => {
  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = '';

  if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.split('Firefox/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.split('Edg/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.split('Chrome/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.split('Version/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Opera') || ua.includes('OPR/')) {
    name = 'Opera';
    version = ua.split('OPR/')[1]?.split(' ')[0] || ua.split('Opera/')[1]?.split(' ')[0] || '';
  }

  return { name, version };
};

// Detectar sistema operativo
const getOSInfo = (): { name: string; version: string } => {
  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = '';

  if (ua.includes('Windows NT 10.0')) {
    name = 'Windows';
    version = '10/11';
  } else if (ua.includes('Windows NT 6.3')) {
    name = 'Windows';
    version = '8.1';
  } else if (ua.includes('Windows NT 6.2')) {
    name = 'Windows';
    version = '8';
  } else if (ua.includes('Windows NT 6.1')) {
    name = 'Windows';
    version = '7';
  } else if (ua.includes('Mac OS X')) {
    name = 'macOS';
    const match = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
    version = match ? match[1].replace(/_/g, '.') : '';
  } else if (ua.includes('Android')) {
    name = 'Android';
    const match = ua.match(/Android (\d+\.?\d*)/);
    version = match ? match[1] : '';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    name = 'iOS';
    const match = ua.match(/OS (\d+_\d+)/);
    version = match ? match[1].replace('_', '.') : '';
  } else if (ua.includes('Linux')) {
    name = 'Linux';
  }

  return { name, version };
};

// Obtener parámetros UTM
const getUTMParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
  };
};

// Obtener fuente del referrer
const getReferrerSource = (): string => {
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    
    if (host.includes('google')) return 'google';
    if (host.includes('facebook') || host.includes('fb.com')) return 'facebook';
    if (host.includes('instagram')) return 'instagram';
    if (host.includes('twitter') || host.includes('x.com')) return 'twitter';
    if (host.includes('tiktok')) return 'tiktok';
    if (host.includes('youtube')) return 'youtube';
    if (host.includes('linkedin')) return 'linkedin';
    if (host.includes('bing')) return 'bing';
    if (host.includes('yahoo')) return 'yahoo';
    
    return host;
  } catch {
    return 'unknown';
  }
};

// Verificar si es visitante recurrente
const isReturningVisitor = (): boolean => {
  const hasVisited = localStorage.getItem('has_visited');
  if (!hasVisited) {
    localStorage.setItem('has_visited', 'true');
    localStorage.setItem('first_visit_date', new Date().toISOString());
    return false;
  }
  return true;
};

// Obtener datos completos del visitante
const getVisitorData = () => {
  const browser = getBrowserInfo();
  const os = getOSInfo();
  const utm = getUTMParams();
  const deviceType = getDeviceType();

  return {
    // Sesión
    sessionId: getSessionId(),
    
    // Dispositivo
    deviceType,
    isMobile: deviceType === 'mobile',
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    
    // Navegador
    browser: browser.name,
    browserVersion: browser.version,
    
    // Sistema Operativo
    os: os.name,
    osVersion: os.version,
    
    // Idioma y zona horaria
    language: navigator.language || 'unknown',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    
    // Fuente de tráfico
    referrer: document.referrer || 'direct',
    referrerSource: getReferrerSource(),
    ...utm,
    
    // Página
    landingPage: window.location.pathname,
    pageUrl: window.location.href,
    pageTitle: document.title,
    
    // Visitante
    isReturning: isReturningVisitor(),
    
    // User Agent completo
    userAgent: navigator.userAgent,
    
    // Conexión (si está disponible)
    connectionType: (navigator as any).connection?.effectiveType || 'unknown',
    
    // Timestamp
    timestamp: new Date().toISOString(),
    localTime: new Date().toLocaleString(),
  };
};

// Llamada a la API para registrar eventos
const trackEvent = async (endpoint: string, data: Record<string, unknown>) => {
  try {
    const visitorData = getVisitorData();
    const response = await fetch(`${API_URL}/analytics/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...visitorData,
        ...data,
        branch: currentBranch,
      }),
    });
    
    if (!response.ok) {
      console.error(`Error tracking ${endpoint}:`, response.statusText);
    }
  } catch (error) {
    console.error(`Error tracking ${endpoint}:`, error);
  }
};

export const useAnalytics = (branch?: string) => {
  const startTime = useRef(Date.now());
  const hasTrackedVisit = useRef(false);

  useEffect(() => {
    // Establecer la sucursal actual
    currentBranch = branch || null;

    // Solo trackear visita una vez por carga de página
    if (!hasTrackedVisit.current) {
      hasTrackedVisit.current = true;
      
      // Registrar visita completa
      trackEvent('visit', {
        eventType: 'page_visit',
      });

      // Registrar evento PageView en Meta Pixel
      if (window.fbq) {
        window.fbq("track", "PageView");
      }
    }

    // Track scroll depth
    let maxScroll = 0;
    const scrollKeyPrefix = branch ? `scroll_${branch}_` : "scroll_";
    
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        
        // Trackear en intervalos de 25%
        [25, 50, 75, 100].forEach(threshold => {
          if (maxScroll >= threshold && !sessionStorage.getItem(`${scrollKeyPrefix}${threshold}_tracked`)) {
            trackScrollDepth(threshold);
            sessionStorage.setItem(`${scrollKeyPrefix}${threshold}_tracked`, "true");
          }
        });
      }
    };

    // Track tiempo en página
    const trackTimeInterval = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);
      if (timeOnPage % 30 === 0 && timeOnPage > 0) { // Cada 30 segundos
        trackEvent('time-on-page', {
          timeOnPageSeconds: timeOnPage,
          maxScrollDepth: maxScroll,
        });
      }
    }, 30000);

    // Track cuando el usuario sale de la página
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);
      
      // Usar sendBeacon para asegurar que se envíe
      const data = JSON.stringify({
        ...getVisitorData(),
        branch: currentBranch,
        timeOnPageSeconds: timeOnPage,
        maxScrollDepth: maxScroll,
        eventType: 'page_exit',
      });
      
      navigator.sendBeacon(`${API_URL}/analytics/page-exit`, data);
    };

    // Track clics para heatmap
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Solo trackear clics en elementos interactivos
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        trackEvent('click', {
          clickX: e.pageX,
          clickY: e.pageY,
          elementTag: target.tagName,
          elementId: target.id || null,
          elementClass: target.className || null,
          elementText: target.textContent?.substring(0, 100) || null,
        });
      }
    };

    // Track errores de JavaScript
    const handleError = (event: ErrorEvent) => {
      trackEvent('js-error', {
        errorMessage: event.message,
        errorStack: event.error?.stack || null,
        errorFile: event.filename,
        errorLine: event.lineno,
        errorColumn: event.colno,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("click", handleClick);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("error", handleError);
      clearInterval(trackTimeInterval);
    };
  }, [branch]);

  const trackCallClick = (phoneNumber?: string) => {
    const visitorData = getVisitorData();
    
    trackEvent('call-click', {
      buttonLocation: 'main',
      phoneNumber: phoneNumber || 'unknown',
    });

    // Meta Pixel
    if (window.fbq) {
      window.fbq("track", "Contact", {
        content_name: "Call Button Click",
        content_category: "Phone Call",
        value: 1,
        currency: "MXN",
      });
    }
  };

  const trackLead = (source?: string) => {
    trackEvent('event', {
      eventType: 'lead',
      eventData: {
        source: source || 'Contact Form',
        value: 10,
        currency: 'MXN',
      },
    });

    if (window.fbq) {
      window.fbq("track", "Lead", {
        content_name: "Contact Form Submit",
        content_category: "Lead Generation",
        value: 10,
        currency: "MXN",
      });
    }
  };

  const trackViewContent = (contentName: string) => {
    trackEvent('event', {
      eventType: 'view_content',
      eventData: {
        contentName,
        contentCategory: 'section',
      },
    });

    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: contentName,
        content_type: "section",
      });
    }
  };

  const trackSchedule = () => {
    trackEvent('event', {
      eventType: 'schedule',
      eventData: {
        type: 'Appointment Request',
        value: 5,
        currency: 'MXN',
      },
    });

    if (window.fbq) {
      window.fbq("track", "Schedule", {
        content_name: "Appointment Request",
        content_category: "Consultation",
      });
    }
  };

  const trackScrollDepth = (depth: number) => {
    trackEvent('scroll-depth', {
      depthPercentage: depth,
    });

    if (window.fbq) {
      window.fbq("trackCustom", "ScrollDepth", {
        depth: depth,
        content_name: `Scroll ${depth}%`,
      });
    }
  };

  const trackCustomEvent = (eventName: string, eventData?: Record<string, unknown>) => {
    trackEvent('event', {
      eventType: eventName,
      eventData: eventData || {},
    });

    if (window.fbq) {
      window.fbq("trackCustom", eventName, eventData);
    }
  };

  return {
    trackCallClick,
    trackLead,
    trackViewContent,
    trackSchedule,
    trackCustomEvent,
  };
};
