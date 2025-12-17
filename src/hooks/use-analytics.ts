import { useEffect } from "react";

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

// Llamada a la API para registrar eventos
const trackEvent = async (endpoint: string, data: Record<string, unknown>) => {
  try {
    const response = await fetch(`${API_URL}/analytics/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        sessionId: getSessionId(),
        branch: currentBranch, // Incluir sucursal en todos los eventos
      }),
    });
    
    if (!response.ok) {
      console.error(`Error tracking ${endpoint}:`, response.statusText);
    }
  } catch (error) {
    console.error(`Error tracking ${endpoint}:`, error);
  }
};

interface Analytics {
  totalVisits: number;
  callClicks: number;
  lastVisit: string;
  metaPixelEvents: {
    pageViews: number;
    contacts: number;
    leads: number;
    viewContent: number;
    schedule: number;
    scrollDepth: number;
  };
}

const getAnalytics = (): Analytics => {
  const stored = localStorage.getItem("siteAnalytics");
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    totalVisits: 0,
    callClicks: 0,
    lastVisit: new Date().toISOString(),
    metaPixelEvents: {
      pageViews: 0,
      contacts: 0,
      leads: 0,
      viewContent: 0,
      schedule: 0,
      scrollDepth: 0,
    },
  };
};

const saveAnalytics = (analytics: Analytics) => {
  localStorage.setItem("siteAnalytics", JSON.stringify(analytics));
};

export const useAnalytics = (branch?: string) => {
  useEffect(() => {
    // Establecer la sucursal actual
    currentBranch = branch || null;

    // Verificar si ya se contó esta sesión para esta sucursal
    const sessionKey = branch ? `analytics_session_counted_${branch}` : "analytics_session_counted";
    const sessionCounted = sessionStorage.getItem(sessionKey);
    
    if (!sessionCounted) {
      // Registrar visita en la API
      trackEvent('visit', {
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
      });

      // Registrar evento PageView en Meta Pixel
      if (window.fbq) {
        window.fbq("track", "PageView");
      }
      trackEvent('event', {
        eventType: 'page_view',
        eventData: {
          url: window.location.href,
          title: document.title,
        },
      });
      
      // Marcar esta sesión como contada para esta sucursal
      sessionStorage.setItem(sessionKey, "true");
    }

    // Track scroll depth
    let maxScroll = 0;
    const scrollKeyPrefix = branch ? `scroll_${branch}_` : "scroll_";
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        
        if (maxScroll > 75 && !sessionStorage.getItem(`${scrollKeyPrefix}75_tracked`)) {
          trackScrollDepth(75);
          sessionStorage.setItem(`${scrollKeyPrefix}75_tracked`, "true");
        } else if (maxScroll > 50 && !sessionStorage.getItem(`${scrollKeyPrefix}50_tracked`)) {
          trackScrollDepth(50);
          sessionStorage.setItem(`${scrollKeyPrefix}50_tracked`, "true");
        } else if (maxScroll > 25 && !sessionStorage.getItem(`${scrollKeyPrefix}25_tracked`)) {
          trackScrollDepth(25);
          sessionStorage.setItem(`${scrollKeyPrefix}25_tracked`, "true");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [branch]);

  const trackCallClick = () => {
    // Registrar en la API
    trackEvent('event', {
      eventType: 'call_click',
      eventData: {
        buttonLocation: 'main',
        timestamp: new Date().toISOString(),
      },
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

  const trackLead = () => {
    // Registrar en la API
    trackEvent('event', {
      eventType: 'lead',
      eventData: {
        source: 'Contact Form',
        value: 10,
        currency: 'MXN',
      },
    });

    // Disparar evento Lead de Meta Pixel
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
    // Registrar en la API
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
    // Registrar en la API
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
    // Registrar en la API
    trackEvent('event', {
      eventType: 'scroll_depth',
      eventData: {
        depth,
        url: window.location.href,
      },
    });

    if (window.fbq) {
      window.fbq("trackCustom", "ScrollDepth", {
        depth: depth,
        content_name: `Scroll ${depth}%`,
      });
    }
  };

  return {
    trackCallClick,
    trackLead,
    trackViewContent,
    trackSchedule,
  };
};
