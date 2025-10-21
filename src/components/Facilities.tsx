import facility1 from "@/assets/facility-1.jpg";
import facility2 from "@/assets/facility-2.jpg";
import facility3 from "@/assets/facility-3.jpg";
import facility4 from "@/assets/facility-4.jpg";
import facility5 from "@/assets/facility-5.jpg";
import facility6 from "@/assets/facility-6.jpg";
import facility7 from "@/assets/facility-7.jpg";
import facility8 from "@/assets/facility-8.jpg";
import facility9 from "@/assets/facility-9.jpg";

const facilities = [
  { img: facility8, title: "Fachada Principal", description: "Instalaciones modernas y acogedoras" },
  { img: facility1, title: "Área Común", description: "Espacios amplios y luminosos" },
  { img: facility2, title: "Dormitorios", description: "Camas cómodas y ambiente ordenado" },
  { img: facility3, title: "Área de Descanso", description: "Ambientes decorados con arte motivacional" },
  { img: facility4, title: "Área Recreativa Exterior", description: "Espacios al aire libre para actividades" },
  { img: facility5, title: "Escaleras y Accesos", description: "Certificaciones y reconocimientos visibles" },
  { img: facility6, title: "Área de Juntas", description: "Espacios para terapia grupal" },
  { img: facility7, title: "Certificaciones", description: "Equipo profesional certificado" },
  { img: facility9, title: "Pasillos", description: "Instalaciones limpias y bien mantenidas" },
];

export const Facilities = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="instalaciones">
      <div className="absolute inset-0 gradient-secondary opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Nuestras Instalaciones
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Espacios diseñados para tu comodidad y recuperación
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl glass-premium hover:scale-105 transition-all duration-700 shadow-luxury animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={facility.img}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                />
                {/* Gradient overlay always visible but enhanced on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
              
              {/* Content - Always visible but animated */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-1 gradient-primary rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="text-2xl font-bold mb-3 text-shadow-strong">{facility.title}</h3>
                  <p className="text-base text-white/90 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {facility.description}
                  </p>
                </div>
              </div>

              {/* Border glow effect on hover */}
              <div className="absolute inset-0 rounded-3xl border-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
