import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Facilities } from "@/components/Facilities";
import { Contact } from "@/components/Contact";
import { FloatingCallButton } from "@/components/FloatingCallButton";
import { ParticlesBackground } from "@/components/ParticlesBackground";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <Hero />
        <Benefits />
        <Facilities />
        <Contact />
        <FloatingCallButton />
        
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

export default Index;
