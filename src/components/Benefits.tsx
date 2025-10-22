import { Shield, Award, Users, AlertCircle } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Tratamientos Especializados",
    description: "Ofrecemos tratamientos especializados para DROGADICCIÓN y ALCOHOLISMO con metodología comprobada basada en el modelo Minnesota.",
    details: "Programas personalizados de 30, 60 y 90 días con terapia individual, grupal y familiar. Incluye desintoxicación médica supervisada y plan de prevención de recaídas.",
    color: "text-primary"
  },
  {
    icon: Award,
    title: "Instalaciones de Primera Clase",
    description: "Contamos con las mejores instalaciones diseñadas específicamente para garantizar la comodidad, seguridad y recuperación efectiva.",
    details: "Dormitorios confortables, áreas de terapia equipadas, espacios recreativos al aire libre, cocina con alimentación balanceada y zonas de descanso con ambientes tranquilos.",
    color: "text-secondary"
  },
  {
    icon: Users,
    title: "Equipo Multidisciplinario",
    description: "Contamos con un equipo de profesionales certificados y con años de experiencia en rehabilitación de adicciones.",
    details: "Médicos psiquiatras, psicólogos clínicos, terapeutas certificados, enfermería las 24 horas y consejeros en adicciones capacitados en el modelo Minnesota.",
    color: "text-primary"
  }
];

export const Benefits = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="beneficios">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-fade-in px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">
            <span className="text-gradient-medical">
              Nuestros Beneficios
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprometidos con tu recuperación y bienestar
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="benefit-card group relative glass-premium rounded-3xl p-8 hover-elevate transition-all duration-500 shadow-premium-gold animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 gradient-medical opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                <div className="benefit-card-content relative z-10">
                  {/* Icon section - fixed height */}
                  <div className={`benefit-card-header ${benefit.color} mb-6 flex justify-center`}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-current opacity-20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
                      <div className="glass-strong rounded-full p-5 shadow-medical-glow group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Title section - fixed height */}
                  <div className="benefit-card-header mb-4 md:mb-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center group-hover:text-primary transition-colors duration-300 premium-text min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center px-2">
                      {benefit.title}
                    </h3>
                    <div className="w-12 sm:w-14 md:w-16 h-1 mx-auto gradient-medical rounded-full opacity-50 group-hover:w-20 sm:group-hover:w-22 md:group-hover:w-24 transition-all duration-500" />
                  </div>
                  
                  {/* Content section - flexible but structured */}
                  <div className="benefit-card-body">
                    <div className="mb-4 md:mb-6">
                      <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed premium-text">
                        {benefit.description}
                      </p>
                    </div>
                    
                    {/* Details section - consistent at bottom */}
                    <div className="glass rounded-lg md:rounded-xl p-3 md:p-4 border border-border/20 mt-auto">
                      <p className="text-xs sm:text-sm text-foreground/70 text-center leading-relaxed premium-text">
                        {benefit.details}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Message */}
        <div className="relative glass-premium rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 shadow-premium-gold border-l-4 md:border-l-8 border-destructive animate-scale-in overflow-hidden hover-elevate">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
          
          <div className="relative z-10 flex flex-col gap-6 md:gap-8">
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="bg-destructive/15 rounded-full p-4 md:p-6 shadow-glow-primary relative">
                  <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-destructive" />
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-5 text-destructive text-shadow">
                NO A LOS ANEXOS
              </h3>
              <div className="space-y-3 md:space-y-4">
                <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed">
                  Es muy importante saber en dónde brindarle la rehabilitación a nuestro ser querido. 
                  Los anexos representan lugares sin certificación que dan un maltrato a los pacientes físico y mental, 
                  sin personal capacitado ni instalaciones adecuadas.
                </p>
                <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 border-l-4 border-primary">
                  <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed mb-2 md:mb-3">
                    <strong className="text-primary font-bold">En nuestra clínica garantizamos un trato profesional, humano y efectivo.</strong>
                  </p>
                  <ul className="space-y-1 md:space-y-2 text-sm sm:text-base text-foreground/80">
                    <li>✓ Personal certificado y supervisión médica constante</li>
                    <li>✓ Instalaciones acondicionadas y seguras</li>
                    <li>✓ Programas terapéuticos basados en evidencia científica</li>
                    <li>✓ Respeto absoluto a la dignidad y derechos humanos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
