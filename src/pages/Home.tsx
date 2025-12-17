import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, ArrowRight, Building2, Users, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { useAnalytics } from "@/hooks/use-analytics";

// Sucursales disponibles
const sucursales = [
  {
    id: "corregidora",
    nombre: "Instalaciones Corregidora",
    direccion: "Calle Corregidora #707, Col. Cabecera Municipal",
    ciudad: "Soledad de Graciano Sánchez, S.L.P.",
    telefono: "444 333 2009",
    disponible: true,
    caracteristicas: ["Capacidad 30 pacientes", "Áreas verdes", "Gimnasio"],
  },
  {
    id: "tierra-blanca",
    nombre: "Sucursal Tierra Blanca",
    direccion: "Calle Segunda Sur #65, Col. Tierra Blanca",
    ciudad: "C.P. 78364, San Luis Potosí",
    telefono: "444 185 8752",
    disponible: true,
    caracteristicas: ["Ambiente familiar", "Jardines", "Terapia grupal"],
  },
  {
    id: "valles",
    nombre: "Sucursal Cd. Valles",
    direccion: "Calle Encino #206, Col. Loma Bonita",
    ciudad: "C.P. 79020, Cd. Valles, S.L.P.",
    telefono: "444 185 8751",
    disponible: true,
    caracteristicas: ["Naturaleza", "Huasteca", "Ambiente tranquilo"],
  },
];

const Home = () => {
  // Registrar analytics para la página principal
  useAnalytics("home");

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 gradient-primary opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-6xl mx-auto text-center">
              {/* Video de YouTube */}
              <div className="mb-10 w-full max-w-4xl mx-auto animate-fade-in">
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-2xl shadow-luxury"
                    src="https://www.youtube.com/embed/IPAYqxW9B7U?si=yrRccM19vm6zrCrv&rel=0&modestbranding=1"
                    title="Clínica Fuerza Para Seguir - Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* Logo */}
              <div className="mb-8 md:mb-12 flex justify-center animate-float">
                <div className="relative">
                  <div className="absolute inset-0 gradient-primary opacity-30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
                  <div className="glass-premium rounded-full p-6 md:p-8 shadow-luxury relative border-gradient">
                    <img 
                      src={logo} 
                      alt="Clínica Fuerza Para Seguir" 
                      className="w-32 h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Título Principal */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-scale-in">
                <span className="text-gradient-medical">
                  Clínica Fuerza Para Seguir
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-foreground/90 font-light">
                Rehabilitación Profesional de Adicciones
              </p>
              
              <div className="w-32 h-1 mx-auto gradient-medical rounded-full opacity-70 mb-8" />

              <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-12 leading-relaxed">
                Somos una clínica especializada en la rehabilitación de personas con adicciones.
                Contamos con instalaciones modernas y un equipo de profesionales comprometidos
                con tu recuperación.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 max-w-4xl mx-auto">
                <div className="glass-premium rounded-2xl p-4 md:p-6">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Atención</div>
                </div>
                <div className="glass-premium rounded-2xl p-4 md:p-6">
                  <Award className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-secondary">100%</div>
                  <div className="text-sm text-muted-foreground">Certificados</div>
                </div>
                <div className="glass-premium rounded-2xl p-4 md:p-6">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-primary">+15</div>
                  <div className="text-sm text-muted-foreground">Años Exp.</div>
                </div>
                <div className="glass-premium rounded-2xl p-4 md:p-6">
                  <Building2 className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-secondary">{sucursales.length}</div>
                  <div className="text-sm text-muted-foreground">Sucursales</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selector de Sucursales */}
        <section className="py-20 relative" id="sucursales">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-gradient-medical">
                  Nuestras Instalaciones
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Selecciona una sucursal para conocer más sobre nuestros servicios y ubicación
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {sucursales.map((sucursal) => (
                <Card 
                  key={sucursal.id}
                  className={`glass-premium border-gradient overflow-hidden group hover-elevate transition-all duration-500 ${
                    !sucursal.disponible ? 'opacity-60' : ''
                  }`}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="glass-strong rounded-full p-4 bg-primary/10 group-hover:scale-110 transition-transform">
                        <Building2 className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                          {sucursal.nombre}
                        </h3>
                        {!sucursal.disponible && (
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">Próximamente</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-foreground/80">
                          <p>{sucursal.direccion}</p>
                          <p>{sucursal.ciudad}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <a 
                          href={`tel:${sucursal.telefono.replace(/\s/g, '')}`}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          {sucursal.telefono}
                        </a>
                      </div>
                    </div>

                    {sucursal.caracteristicas && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {sucursal.caracteristicas.map((car, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {car}
                          </span>
                        ))}
                      </div>
                    )}

                    {sucursal.disponible ? (
                      <Link to={`/${sucursal.id}`}>
                        <Button className="w-full gradient-medical text-white group-hover:opacity-90">
                          Ver Instalación
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full">
                        Próximamente
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Card para futuras sucursales */}
              <Card className="glass-premium border-dashed border-2 border-muted-foreground/30 overflow-hidden">
                <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
                  <div className="glass-strong rounded-full p-4 bg-muted/20 mb-4">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    Nueva Sucursal
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Próximamente más ubicaciones para servirte mejor
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sección de Contacto General */}
        <section className="py-20 relative">
          <div className="absolute inset-0 gradient-primary opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-gradient-medical">¿Necesitas Ayuda?</span>
              </h2>
              <p className="text-lg text-foreground/80 mb-8">
                Estamos disponibles las 24 horas para atender tu llamada. 
                Da el primer paso hacia la recuperación.
              </p>
              
              <a href="tel:4443332009">
                <Button size="lg" className="gradient-medical text-white text-lg px-8 py-6 rounded-full shadow-premium-gold hover:opacity-90 transition-all">
                  <Phone className="w-6 h-6 mr-3" />
                  Llamar Ahora: 444 333 2009
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border/50 glass-strong">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Clínica Fuerza Para Seguir
              </p>
              <p className="text-muted-foreground">
                Rehabilitación Profesional de Adicciones
              </p>
              <div className="w-24 h-px mx-auto gradient-primary opacity-40" />
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
