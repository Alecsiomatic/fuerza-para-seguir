import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, ArrowLeft, Shield, Heart, Users, Clock, Award, Mountain } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAnalytics } from "@/hooks/use-analytics";
import { ParticlesBackground } from "@/components/ParticlesBackground";

// Imágenes de la sucursal Cd Valles
const facilities = [
  { img: "/valles/IMG_6337.jpg", title: "Fachada Principal", description: "Entrada acogedora en el corazón de la Huasteca" },
  { img: "/valles/IMG_6305.jpg", title: "Áreas Comunes", description: "Espacios amplios para convivencia y actividades" },
  { img: "/valles/IMG_6539.jpg", title: "Instalaciones", description: "Ambiente cómodo y seguro para tu recuperación" },
  { img: "/valles/IMG_6531.jpg", title: "Espacios Verdes", description: "Áreas naturales para meditación y reflexión" },
];

const benefits = [
  {
    icon: Mountain,
    title: "En la Huasteca",
    description: "Ubicados en Ciudad Valles, rodeados de naturaleza y tranquilidad"
  },
  {
    icon: Heart,
    title: "Atención Cercana",
    description: "Trato personalizado y humano para cada paciente"
  },
  {
    icon: Users,
    title: "Comunidad de Apoyo",
    description: "Compañerismo y solidaridad en tu proceso de recuperación"
  },
  {
    icon: Clock,
    title: "Disponibilidad 24/7",
    description: "Siempre hay alguien para escucharte y apoyarte"
  },
  {
    icon: Shield,
    title: "Entorno Seguro",
    description: "Ambiente protegido y libre de tentaciones"
  },
  {
    icon: Award,
    title: "Metodología Probada",
    description: "Modelo Minnesota adaptado a nuestro enfoque integral"
  }
];

const Valles = () => {
  const { trackCallClick } = useAnalytics("valles");

  // Inicializar Meta Pixel específico para Valles
  useEffect(() => {
    // Cargar el script de Facebook Pixel si no existe
    if (!document.getElementById('fb-pixel-valles')) {
      const script = document.createElement('script');
      script.id = 'fb-pixel-valles';
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1234602605435689');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    } else {
      // Si ya existe el pixel, solo trackear PageView
      if (window.fbq) {
        window.fbq('track', 'PageView');
      }
    }
  }, []);
  
  const handleCall = (phone: string) => {
    trackCallClick();
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      
      {/* Botón para volver */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <Button variant="outline" size="sm" className="glass-premium shadow-lg hover:scale-105 transition-transform">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Todas las sucursales
          </Button>
        </Link>
      </div>

      {/* Badge de sucursal */}
      <div className="fixed top-4 right-4 z-50">
        <div className="glass-premium px-4 py-2 rounded-full shadow-lg">
          <span className="text-sm font-medium text-primary">📍 Sucursal Cd. Valles</span>
        </div>
      </div>
      
      <div className="relative z-10">
        {/* Hero Section - Cd Valles: Diseño con tonos verdes/naturaleza */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Imagen de fondo a pantalla completa */}
          <div className="absolute inset-0">
            <img 
              src="/valles/IMG_6531.jpg" 
              alt="Sucursal Cd. Valles" 
              className="w-full h-full object-cover"
            />
            {/* Overlay gradiente elegante - tonos verdes */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-teal-900/30" />
          </div>
          
          {/* Efectos de luz */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-5xl mx-auto text-center animate-fade-in">
              
              {/* Badge destacado */}
              <div className="mb-8 animate-scale-in">
                <span className="inline-flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm md:text-base font-semibold shadow-lg">
                  <Mountain className="w-5 h-5" />
                  En el Corazón de la Huasteca
                </span>
              </div>

              {/* Logo */}
              <div className="mb-8 flex justify-center animate-float">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/40 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
                  <div className="bg-white/10 backdrop-blur-md rounded-full p-5 shadow-2xl border border-white/20">
                    <img 
                      src={logo} 
                      alt="Clínica Fuerza Para Seguir" 
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Título principal */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-scale-in">
                <span className="text-white drop-shadow-2xl">Sucursal</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Cd. Valles
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light mb-4 drop-shadow-lg">
                Clínica Fuerza Para Seguir
              </p>
              
              <div className="w-32 h-1 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-8" />

              {/* Descripción en glass card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 mb-10 shadow-2xl border border-white/20 max-w-3xl mx-auto">
                <p className="text-lg sm:text-xl text-white/95 leading-relaxed mb-6">
                  Un espacio de <strong className="text-emerald-400">paz y naturaleza</strong> en la hermosa región Huasteca. 
                  El ambiente ideal para tu proceso de recuperación.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm">
                    <Mountain className="w-4 h-4 text-emerald-400" /> Naturaleza
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm">
                    <Heart className="w-4 h-4 text-emerald-400" /> Atención Personalizada
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm">
                    <Clock className="w-4 h-4 text-emerald-400" /> 24/7
                  </span>
                </div>
              </div>

              {/* Botón de llamada */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
                <Button 
                  size="lg"
                  onClick={() => handleCall('4441858751')}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-lg md:text-xl px-10 md:px-14 py-6 md:py-8 rounded-full shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-500 w-full sm:w-auto border-2 border-white/20"
                >
                  <span className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <Phone className="w-6 h-6 md:w-7 md:h-7 mr-3 animate-pulse relative z-10" />
                  <span className="relative z-10 font-bold">444 185 8751</span>
                </Button>
              </div>
              
              {/* Scroll indicator */}
              <div className="mt-12 animate-bounce">
                <div className="w-8 h-12 mx-auto border-2 border-white/40 rounded-full flex items-start justify-center p-2">
                  <div className="w-2 h-3 bg-white/60 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Estilo verde/naturaleza */}
        <section className="py-20 relative overflow-hidden" id="beneficios">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/5 to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ¿Por qué elegirnos?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Más de 15 años transformando vidas con dedicación y profesionalismo
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="glass-premium rounded-3xl p-8 hover:scale-105 transition-all duration-500 shadow-luxury animate-fade-in group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors" />
                    <div className="glass-premium rounded-full p-4 w-16 h-16 flex items-center justify-center relative">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="py-20 relative overflow-hidden" id="instalaciones">
          <div className="absolute inset-0 gradient-secondary opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Nuestras Instalaciones
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Espacios diseñados para tu comodidad y recuperación
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl glass-premium hover:scale-105 transition-all duration-700 shadow-luxury animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={facility.img}
                      alt={facility.title}
                      className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-bold text-white mb-2">{facility.title}</h3>
                    <p className="text-white/80 text-sm">{facility.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-20 relative overflow-hidden" id="contacto">
          <div className="absolute inset-0 gradient-primary opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 md:mb-12 animate-fade-in">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-2">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Contáctanos Ahora
                  </span>
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                  Estamos aquí para ayudarte las 24 horas del día, los 7 días de la semana.
                </p>
              </div>

              <div className="glass-premium rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-16 shadow-luxury animate-scale-in border-gradient relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 gradient-radial opacity-20 animate-float" />
                <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 gradient-radial opacity-20 animate-float" style={{ animationDelay: '1s' }} />
                
                <div className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12">
                    {/* Teléfono */}
                    <div className="group">
                      <div className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8 hover:scale-105 transition-all duration-500 shadow-glow-primary">
                        <div className="flex items-start gap-4 md:gap-6">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
                              <div className="glass-premium rounded-full p-3 md:p-5 bg-primary/10 relative">
                                <Phone className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-primary">Teléfono</h3>
                            <a 
                              href="tel:4441858751"
                              className="block text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform inline-block mb-2"
                            >
                              444 185 8751
                            </a>
                            <p className="text-sm md:text-base text-muted-foreground mt-2">
                              🕐 Disponible 24/7
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dirección */}
                    <div className="group">
                      <div className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8 hover:scale-105 transition-all duration-500 shadow-glow-secondary">
                        <div className="flex items-start gap-4 md:gap-6">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <div className="absolute inset-0 bg-secondary/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                              <div className="glass-premium rounded-full p-3 md:p-5 bg-secondary/10 relative">
                                <MapPin className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-secondary">Dirección</h3>
                            <p className="text-sm md:text-base lg:text-lg text-foreground/90 leading-relaxed break-words">
                              Calle Encino #206<br />
                              Col. Loma Bonita<br />
                              Entre Álamo y Pino<br />
                              C.P. 79020<br />
                              Cd. Valles, S.L.P.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
                    <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 border-l-4 border-primary">
                      <h4 className="font-bold text-primary mb-2 md:mb-3 text-base md:text-lg">Evaluación Inicial Gratuita</h4>
                      <p className="text-xs md:text-sm text-foreground/80">
                        Nuestros especialistas realizan una valoración completa sin costo para determinar el mejor programa de tratamiento.
                      </p>
                    </div>
                    <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 border-l-4 border-secondary">
                      <h4 className="font-bold text-secondary mb-2 md:mb-3 text-base md:text-lg">Proceso de Admisión Rápido</h4>
                      <p className="text-xs md:text-sm text-foreground/80">
                        Entendemos la urgencia. Podemos iniciar el tratamiento el mismo día de la llamada.
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center">
                    <Button 
                      size="lg"
                      onClick={() => handleCall('4441858751')}
                      className="group relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 hover:bg-pos-100 text-white text-lg md:text-xl lg:text-2xl px-10 md:px-16 py-6 md:py-8 rounded-full shadow-premium-gold hover:scale-110 transition-all duration-500 animate-medical-glow"
                    >
                      <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <Phone className="w-6 h-6 md:w-8 md:h-8 mr-3 md:mr-4 animate-pulse relative z-10" />
                      <span className="relative z-10 font-bold">Llamar Ahora - 444 185 8751</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Call Button - Estilo verde */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => handleCall('4441858751')}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full w-16 h-16 md:w-20 md:h-20 shadow-lg shadow-emerald-500/30 hover:scale-110 transition-all duration-500 p-0"
          >
            <Phone className="w-7 h-7 md:w-9 md:h-9 animate-pulse" />
          </Button>
        </div>

        {/* Footer - Estilo verde */}
        <footer className="py-12 border-t border-emerald-500/20 bg-gradient-to-t from-emerald-950/10 to-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Clínica Fuerza Para Seguir
              </p>
              <p className="text-muted-foreground">
                Sucursal Cd. Valles - Recuperación en armonía con la naturaleza
              </p>
              <div className="w-24 h-px mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 opacity-40" />
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Todos los derechos reservados.
              </p>
              <Link to="/" className="text-sm text-emerald-500 hover:text-emerald-400 hover:underline inline-block mt-2">
                Ver todas las sucursales
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Valles;
