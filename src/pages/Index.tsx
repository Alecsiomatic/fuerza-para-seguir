import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Facilities } from "@/components/Facilities";
import { Contact } from "@/components/Contact";
import { FloatingCallButton } from "@/components/FloatingCallButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Benefits />
      <Facilities />
      <Contact />
      <FloatingCallButton />
      
      {/* Footer */}
      <footer className="py-8 glass-strong border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Clínica Fuerza Para Seguir. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
