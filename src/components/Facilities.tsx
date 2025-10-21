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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl glass hover:scale-105 transition-all duration-500 shadow-glow-primary animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={facility.img}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                <p className="text-sm text-white/90">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
