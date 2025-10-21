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
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nuestros Beneficios
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprometidos con tu recuperación y bienestar
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative glass-premium rounded-3xl p-10 hover:scale-105 transition-all duration-500 shadow-luxury animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className={`${benefit.color} mb-8 flex justify-center`}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-current opacity-20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
                      <div className="glass-strong rounded-full p-6 shadow-glow-primary group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-14 h-14" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <div className="w-16 h-1 mx-auto gradient-primary rounded-full opacity-40 mb-6 group-hover:w-24 transition-all duration-500" />
                  <p className="text-base md:text-lg text-foreground/80 text-center leading-relaxed mb-4">
                    {benefit.description}
                  </p>
                  <div className="glass rounded-xl p-4 mt-4 border border-border/20">
                    <p className="text-sm text-foreground/70 text-center leading-relaxed">
                      {benefit.details}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Message */}
        <div className="relative glass-premium rounded-3xl p-10 md:p-14 shadow-luxury border-l-8 border-destructive animate-scale-in overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="bg-destructive/15 rounded-full p-6 shadow-glow-primary relative">
                  <AlertCircle className="w-16 h-16 text-destructive" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-3xl md:text-4xl font-bold mb-5 text-destructive text-shadow">
                NO A LOS ANEXOS
              </h3>
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
                  Es muy importante saber en dónde brindarle la rehabilitación a nuestro ser querido. 
                  Los anexos representan lugares sin certificación que dan un maltrato a los pacientes físico y mental, 
                  sin personal capacitado ni instalaciones adecuadas.
                </p>
                <div className="glass rounded-2xl p-6 border-l-4 border-primary">
                  <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-3">
                    <strong className="text-primary font-bold">En nuestra clínica garantizamos un trato profesional, humano y efectivo.</strong>
                  </p>
                  <ul className="space-y-2 text-base text-foreground/80">
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
