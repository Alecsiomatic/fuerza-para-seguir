import { Shield, Award, Users, AlertCircle } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Tratamientos Especializados",
    description: "Ofrecemos tratamientos especializados para DROGADICCIÓN y ALCOHOLISMO con metodología comprobada.",
    color: "text-primary"
  },
  {
    icon: Award,
    title: "Mejores Instalaciones",
    description: "Contamos con las mejores instalaciones para garantizar la comodidad y recuperación de nuestros pacientes.",
    color: "text-secondary"
  },
  {
    icon: Users,
    title: "Equipo Profesional",
    description: "Contamos con un equipo profesional y certificado para la rehabilitación de tu ser querido.",
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
                className="glass rounded-3xl p-8 hover:scale-105 transition-all duration-300 shadow-glow-primary animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${benefit.color} mb-6 flex justify-center`}>
                  <div className="glass-strong rounded-full p-4">
                    <Icon className="w-12 h-12" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">
                  {benefit.title}
                </h3>
                <p className="text-foreground/70 text-center leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Important Message */}
        <div className="glass-strong rounded-3xl p-8 md:p-10 shadow-glow-secondary border-l-4 border-destructive animate-scale-in">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0">
              <div className="bg-destructive/10 rounded-full p-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-destructive">
                NO A LOS ANEXOS
              </h3>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Es muy importante saber en dónde brindarle la rehabilitación a nuestro ser querido. 
                Los anexos dan un maltrato a los pacientes físico y mental. 
                <strong className="text-primary"> En nuestra clínica garantizamos un trato profesional, humano y efectivo.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
