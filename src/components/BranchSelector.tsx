import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, ChevronRight, Heart, Clock, Award, Users, Building2 } from "lucide-react";
import logo from "@/assets/logo.png";

interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  disponible: boolean;
  caracteristicas?: string[];
  emoji?: string;
}

const sucursales: Sucursal[] = [
  {
    id: "corregidora",
    nombre: "Corregidora",
    direccion: "Calle Corregidora #707, Col. Cabecera Municipal",
    ciudad: "Soledad de Graciano Sánchez, S.L.P.",
    telefono: "444 333 2009",
    disponible: true,
    emoji: "🏥",
  },
  {
    id: "tierra-blanca",
    nombre: "Tierra Blanca",
    direccion: "Calle Segunda Sur #65, Col. Tierra Blanca",
    ciudad: "C.P. 78364, San Luis Potosí",
    telefono: "444 185 8752",
    disponible: true,
    emoji: "🌿",
  },
  {
    id: "valles",
    nombre: "Cd. Valles",
    direccion: "Calle Encino #206, Col. Loma Bonita",
    ciudad: "C.P. 79020, Cd. Valles, S.L.P.",
    telefono: "444 185 8751",
    disponible: true,
    emoji: "🌴",
  },
];

export function BranchSelector() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-start py-6 px-4 md:hidden relative z-10">
      {/* Video de YouTube */}
      <div className="w-full max-w-md mb-6 animate-fade-in">
        <div className="relative rounded-2xl overflow-hidden shadow-luxury" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/IPAYqxW9B7U?si=yrRccM19vm6zrCrv&rel=0&modestbranding=1"
            title="Clínica Fuerza Para Seguir - Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Logo y título */}
      <div className="flex flex-col items-center mb-6 animate-fade-in">
        <div className="relative mb-3">
          <div className="absolute inset-0 gradient-primary opacity-30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="glass-premium rounded-full p-3 shadow-luxury relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <img 
              src={logo} 
              alt="Fuerza Para Seguir" 
              className="w-16 h-16 object-contain relative z-10"
            />
          </div>
        </div>
        <h1 className="text-xl font-bold text-center">
          <span className="text-gradient-medical">Clínica Fuerza Para Seguir</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Rehabilitación Profesional de Adicciones</p>
      </div>

      {/* Descripción */}
      <p className="text-sm text-foreground/80 text-center max-w-md mb-6 leading-relaxed px-2">
        Somos una clínica especializada en la rehabilitación de personas con adicciones.
        Contamos con instalaciones modernas y un equipo de profesionales comprometidos
        con tu recuperación.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-md mb-8">
        <div className="glass-premium rounded-xl p-3 text-center">
          <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold text-primary">24/7</div>
          <div className="text-[10px] text-muted-foreground">Atención</div>
        </div>
        <div className="glass-premium rounded-xl p-3 text-center">
          <Award className="w-5 h-5 text-secondary mx-auto mb-1" />
          <div className="text-lg font-bold text-secondary">100%</div>
          <div className="text-[10px] text-muted-foreground">Certificados</div>
        </div>
        <div className="glass-premium rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold text-primary">+15</div>
          <div className="text-[10px] text-muted-foreground">Años Exp.</div>
        </div>
        <div className="glass-premium rounded-xl p-3 text-center">
          <Building2 className="w-5 h-5 text-secondary mx-auto mb-1" />
          <div className="text-lg font-bold text-secondary">3</div>
          <div className="text-[10px] text-muted-foreground">Sucursales</div>
        </div>
      </div>

      {/* Título sucursales */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gradient-medical">Nuestras Instalaciones</h2>
        <p className="text-xs text-muted-foreground">Selecciona una sucursal</p>
      </div>

      {/* Selector de sucursales estilo Linktree */}
      <div className="w-full max-w-md space-y-3">
        {sucursales.map((sucursal, index) => (
          <Link
            key={sucursal.id}
            to={`/${sucursal.id}`}
            className="block w-full animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredId(sucursal.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div 
              className={`
                relative overflow-hidden rounded-2xl transition-all duration-300 active:scale-[0.98]
                ${hoveredId === sucursal.id ? 'scale-[1.02]' : 'scale-100'}
              `}
            >
              {/* Liquid glass background */}
              <div className="absolute inset-0 glass-premium" />
              
              {/* Gradient overlay on hover */}
              <div 
                className={`
                  absolute inset-0 gradient-primary opacity-0 transition-opacity duration-300
                  ${hoveredId === sucursal.id ? 'opacity-10' : ''}
                `}
              />
              
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              
              {/* Content */}
              <div className="relative z-10 flex items-center justify-between p-4 py-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sucursal.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {sucursal.nombre}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {sucursal.telefono}
                    </p>
                  </div>
                </div>
                <ChevronRight 
                  className={`
                    w-5 h-5 text-muted-foreground transition-all duration-300
                    ${hoveredId === sucursal.id ? 'translate-x-1 text-primary' : ''}
                  `}
                />
              </div>
              
              {/* Bottom border glow */}
              <div 
                className={`
                  absolute bottom-0 left-0 right-0 h-[2px] gradient-medical opacity-0 transition-opacity duration-300
                  ${hoveredId === sucursal.id ? 'opacity-100' : ''}
                `}
              />
            </div>
          </Link>
        ))}

        {/* Botón de llamada directa */}
        <a
          href="tel:4443332009"
          className="block w-full animate-fade-in mt-4"
          style={{ animationDelay: `${sucursales.length * 100}ms` }}
        >
          <div className="relative overflow-hidden rounded-2xl active:scale-[0.98] transition-transform">
            {/* Gradient background for CTA */}
            <div className="absolute inset-0 gradient-medical" />
            
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center gap-3 p-4 py-5 text-white">
              <Phone className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">Llamar Ahora</span>
              <Heart className="w-4 h-4" />
            </div>
          </div>
        </a>
      </div>

      {/* Sección de ayuda */}
      <div className="w-full max-w-md mt-8 glass-premium rounded-2xl p-5 text-center">
        <h3 className="font-bold text-gradient-medical mb-2">¿Necesitas Ayuda?</h3>
        <p className="text-xs text-foreground/80 mb-3">
          Estamos disponibles las 24 horas para atender tu llamada. 
          Da el primer paso hacia la recuperación.
        </p>
        <div className="flex justify-center gap-2 text-xs text-muted-foreground">
          <span>💚 Confidencial</span>
          <span>•</span>
          <span>🏥 Profesional</span>
          <span>•</span>
          <span>🤝 Sin juicios</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 text-center border-t border-border/30 w-full max-w-md">
        <p className="text-xs text-muted-foreground">
          © 2026 Clínica Fuerza Para Seguir
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Rehabilitación con amor y profesionalismo
        </p>
      </div>
    </div>
  );
}

export default BranchSelector;
