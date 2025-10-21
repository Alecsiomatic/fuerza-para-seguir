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

          <div className="glass-premium rounded-3xl p-10 md:p-16 shadow-luxury animate-scale-in border-gradient relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 gradient-radial opacity-20 animate-float" />
            <div className="absolute bottom-0 left-0 w-64 h-64 gradient-radial opacity-20 animate-float" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-10 mb-12">
                {/* Phone */}
                <div className="group">
                  <div className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all duration-500 shadow-glow-primary">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
                          <div className="glass-premium rounded-full p-5 bg-primary/10 relative">
                            <Phone className="w-10 h-10 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-primary">Teléfono</h3>
                        <a 
                          href="tel:4443332009"
                          className="block text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform inline-block mb-2"
                        >
                          444 333 2009
                        </a>
                        <p className="text-base text-muted-foreground">
                          🕐 Disponible las 24 horas, los 7 días
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="group">
                  <div className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all duration-500 shadow-glow-secondary">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-secondary/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                          <div className="glass-premium rounded-full p-5 bg-secondary/10 relative">
                            <MapPin className="w-10 h-10 text-secondary" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-secondary">Dirección</h3>
                        <p className="text-lg text-foreground/90 leading-relaxed">
                          Calle Corregidora #707<br />
                          Col: Cabecera Municipal<br />
                          Soledad de Graciano Sánchez,<br />
                          San Luis Potosí
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center pt-10 border-t border-border/50">
                <div className="mb-8 space-y-3">
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    No esperes más
                  </p>
                  <p className="text-lg md:text-xl text-foreground/80">
                    Tu recuperación comienza con una llamada
                  </p>
                </div>
                
                <Button 
                  onClick={handleCall}
                  size="lg"
                  className="gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all duration-500 shadow-luxury text-xl md:text-2xl px-16 py-10 rounded-full group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <Phone className="mr-4 h-8 w-8 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">Llamar Ahora</span>
                </Button>

                <p className="mt-6 text-sm text-muted-foreground">
                  Atención inmediata · Confidencial · Profesional
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
