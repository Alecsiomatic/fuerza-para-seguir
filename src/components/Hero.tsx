import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export const Hero = () => {
  const handleCall = () => {
    window.location.href = "tel:4443332009";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Multiple animated background layers */}
      <div className="absolute inset-0 gradient-primary opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)] animate-float" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(121,195,106,0.1),transparent_50%)] animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center animate-fade-in">
          {/* Logo with premium effects */}
          <div className="mb-12 flex justify-center animate-float">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary opacity-30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="glass-premium rounded-full p-8 shadow-luxury relative border-gradient">
                <img 
                  src={logo} 
                  alt="Clínica Fuerza Para Seguir" 
                  className="w-40 h-40 md:w-52 md:h-52 object-contain relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Main heading with enhanced effects */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-shadow-strong animate-scale-in">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Clínica Fuerza Para Seguir
            </span>
          </h1>

          {/* Tagline with elegant underline */}
          <div className="mb-10">
            <p className="text-2xl md:text-3xl lg:text-4xl mb-4 text-foreground/90 font-light">
              Rehabilitación Profesional de Adicciones
            </p>
            <div className="w-32 h-1 mx-auto gradient-primary rounded-full opacity-60" />
          </div>

          {/* Enhanced description */}
          <div className="glass-premium rounded-3xl p-10 md:p-14 mb-12 shadow-luxury max-w-4xl mx-auto border-gradient animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-6">
              <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-light">
                Somos una clínica especializada en la rehabilitación de personas con adicciones, 
                comprometidos con brindar un tratamiento integral, humano y efectivo.
              </p>
              <div className="w-24 h-px mx-auto gradient-primary opacity-40" />
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
                Rehabilitamos a nuestros pacientes con un <strong className="text-primary font-semibold">modelo propio combinado con el prestigioso modelo MINNESOTA</strong>, 
                reconocido mundialmente por su efectividad en el tratamiento de adicciones.
              </p>
              <div className="glass rounded-2xl p-6 mt-6 border-l-4 border-secondary">
                <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                  Nuestro enfoque terapéutico se basa en <strong className="text-secondary">12 pasos de recuperación</strong>, 
                  terapia individual y grupal, acompañamiento médico-psiquiátrico las 24 horas, 
                  y un programa de reinserción social que garantiza resultados duraderos.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-border/30">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Atención Médica</div>
                  <div className="text-xs text-muted-foreground/70 mt-1">Supervisión Continua</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Certificado</div>
                  <div className="text-xs text-muted-foreground/70 mt-1">Equipo Profesional</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">+15</div>
                  <div className="text-sm text-muted-foreground">Años</div>
                  <div className="text-xs text-muted-foreground/70 mt-1">De Experiencia</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={handleCall}
              size="lg"
              className="gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all duration-500 shadow-luxury text-xl md:text-2xl px-12 md:px-16 py-8 md:py-10 rounded-full group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <Phone className="mr-4 h-7 w-7 group-hover:animate-pulse relative z-10" />
              <span className="relative z-10">Llamar Ahora: 444 333 2009</span>
            </Button>
            <p className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
              Disponible las 24 horas · Respuesta inmediata
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] animate-shimmer" />
    </section>
  );
};
