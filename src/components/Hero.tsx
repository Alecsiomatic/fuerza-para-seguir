import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export const Hero = () => {
  const handleCall = () => {
    window.location.href = "tel:4443332009";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          {/* Logo */}
          <div className="mb-8 flex justify-center animate-float">
            <div className="glass-strong rounded-full p-6 shadow-glow-secondary">
              <img 
                src={logo} 
                alt="Clínica Fuerza Para Seguir" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Clínica Fuerza Para Seguir
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-foreground/90 font-light">
            Rehabilitación Profesional de Adicciones
          </p>

          {/* Description */}
          <div className="glass rounded-3xl p-8 md:p-10 mb-10 shadow-glow-primary max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
              Somos una clínica especializada en la rehabilitación de personas con adicciones. 
              Rehabilitamos a nuestros pacientes con un <strong>modelo propio combinado con el gran modelo MINNESOTA</strong>, 
              brindando una recuperación estable y garantizada.
            </p>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleCall}
            size="lg"
            className="gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-glow-primary text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 rounded-full group"
          >
            <Phone className="mr-3 h-6 w-6 group-hover:animate-pulse" />
            Llamar Ahora: 444 333 2009
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
