import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";

export const Contact = () => {
  const handleCall = () => {
    window.location.href = "tel:4443332009";
  };

  return (
    <section className="py-20 relative overflow-hidden" id="contacto">
      <div className="absolute inset-0 gradient-primary opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Contáctanos
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Estamos aquí para ayudarte. Da el primer paso hacia la recuperación.
            </p>
          </div>

          <div className="glass-strong rounded-3xl p-8 md:p-12 shadow-glow-primary animate-scale-in">
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="glass rounded-full p-4 bg-primary/10">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Teléfono</h3>
                  <a 
                    href="tel:4443332009"
                    className="text-2xl font-bold text-primary hover:text-secondary transition-colors"
                  >
                    444 333 2009
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Disponible las 24 horas
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="glass rounded-full p-4 bg-secondary/10">
                    <MapPin className="w-8 h-8 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Dirección</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Calle Corregidora #707<br />
                    Col: Cabecera Municipal<br />
                    Soledad de Graciano Sánchez,<br />
                    San Luis Potosí
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8 border-t border-border">
              <p className="text-lg mb-6 text-foreground/80">
                No esperes más. Tu recuperación comienza con una llamada.
              </p>
              <Button 
                onClick={handleCall}
                size="lg"
                className="gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-glow-primary text-xl px-12 py-8 rounded-full group"
              >
                <Phone className="mr-3 h-7 w-7 group-hover:animate-pulse" />
                Llamar Ahora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
