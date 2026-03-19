import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Phone, ChevronRight, Heart } from "lucide-react";
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
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 md:hidden relative z-10">
      {/* Logo y título */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <div className="relative mb-4">
          <div className="absolute inset-0 gradient-primary opacity-30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="glass-premium rounded-full p-4 shadow-luxury relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <img 
              src={logo} 
              alt="Fuerza Para Seguir" 
              className="w-20 h-20 object-contain relative z-10"
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center">
          <span className="text-gradient-medical">Fuerza Para Seguir</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Rehabilitación Profesional</p>
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
                relative overflow-hidden rounded-2xl transition-all duration-300
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
          className="block w-full animate-fade-in"
          style={{ animationDelay: `${sucursales.length * 100}ms` }}
        >
          <div className="relative overflow-hidden rounded-2xl">
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

        {/* Links adicionales */}
        <div className="flex justify-center gap-4 pt-4 text-sm text-muted-foreground">
          <a href="#contacto" className="hover:text-primary transition-colors">Contacto</a>
          <span>•</span>
          <a href="#nosotros" className="hover:text-primary transition-colors">Nosotros</a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 Fuerza Para Seguir
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Rehabilitación con amor y profesionalismo
        </p>
      </div>
    </div>
  );
}

export default BranchSelector;
