import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";

export const Contact = () => {
  const handleCall = () => {
    window.location.href = "tel:4443332009";
  };

  return (
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
              Da el primer paso hacia la recuperación de tu ser querido. 
              La atención inmediata puede marcar la diferencia.
            </p>
          </div>

          <div className="glass-premium rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-16 shadow-luxury animate-scale-in border-gradient relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 gradient-radial opacity-20 animate-float" />
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 gradient-radial opacity-20 animate-float" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12">
                {/* Phone */}
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
                          href="tel:4443332009"
                          className="block text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform inline-block mb-1 md:mb-2 break-words"
                        >
                          444 333 2009
                        </a>
                        <p className="text-sm md:text-base text-muted-foreground">
                          🕐 Disponible las 24 horas, los 7 días
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
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
                    Entendemos la urgencia. Podemos iniciar el tratamiento el mismo día de la llamada con disponibilidad inmediata.
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center pt-6 md:pt-10 border-t border-border/50">
                <div className="mb-6 md:mb-8 space-y-2 md:space-y-3 px-2">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                    No esperes más, cada momento cuenta
                  </p>
                  <p className="text-sm md:text-base lg:text-lg xl:text-xl text-foreground/80">
                    Tu recuperación o la de tu ser querido comienza con una simple llamada. 
                    Nuestro equipo está listo para atenderte ahora.
                  </p>
                </div>
                
                <Button 
                  onClick={handleCall}
                  size="lg"
                  className="gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all duration-500 shadow-luxury text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-6 rounded-full group relative overflow-hidden w-full sm:w-auto max-w-full"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <Phone className="mr-2 sm:mr-3 md:mr-4 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 group-hover:animate-pulse relative z-10 flex-shrink-0" />
                  <span className="relative z-10 whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg">Llamar Ahora: 444 333 2009</span>
                </Button>

                <div className="mt-4 md:mt-6 glass rounded-lg md:rounded-xl p-3 md:p-4 max-w-2xl mx-auto">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                    <strong className="text-foreground">Atención inmediata · Confidencial · Profesional</strong>
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    Aceptamos llamadas de familiares. Orientación sin compromiso disponible 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
