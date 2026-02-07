import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Phone, Users, TrendingUp, Settings, RefreshCw, Building2, Home, MapPin } from "lucide-react";

// Credenciales hardcodeadas
const ADMIN_EMAIL = "Admin@fuerzaparaseguir.com";
const ADMIN_PASSWORD = "Admin123";

// API URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Sucursales disponibles
const SUCURSALES = [
  { id: 'todas', nombre: 'General', icon: Building2, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500' },
  { id: 'home', nombre: 'Landing Principal', icon: Home, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500', ruta: '/' },
  { id: 'corregidora', nombre: 'Corregidora', icon: Building2, color: 'text-primary', bgColor: 'bg-primary/10', borderColor: 'border-primary', telefono: '444 333 2009', ruta: '/corregidora' },
  { id: 'tierra-blanca', nombre: 'Tierra Blanca', icon: MapPin, color: 'text-amber-500', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500', telefono: '444 185 8752', ruta: '/tierra-blanca' },
  { id: 'valles', nombre: 'Cd. Valles', icon: MapPin, color: 'text-emerald-600', bgColor: 'bg-emerald-600/10', borderColor: 'border-emerald-600', telefono: '444 185 8751', ruta: '/valles' },
];

interface Analytics {
  totalVisits: number;
  callClicks: number;
  lastVisit: string;
  metaPixelEvents: {
    pageViews: number;
    contacts: number;
    leads: number;
    viewContent: number;
    schedule: number;
  };
  scrollDepth: {
    scroll25: number;
    scroll50: number;
    scroll75: number;
  };
}

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedBranch, setSelectedBranch] = useState("corregidora"); // Por defecto Corregidora
  const [analytics, setAnalytics] = useState<Analytics>({
    totalVisits: 0,
    callClicks: 0,
    lastVisit: new Date().toISOString(),
    metaPixelEvents: {
      pageViews: 0,
      contacts: 0,
      leads: 0,
      viewContent: 0,
      schedule: 0,
    },
    scrollDepth: {
      scroll25: 0,
      scroll50: 0,
      scroll75: 0,
    },
  });

  const loadAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      // Cargar desde la API con filtro de sucursal
      const branchParam = selectedBranch !== 'todas' ? `?branch=${selectedBranch}` : '';
      const response = await fetch(`${API_URL}/analytics/summary${branchParam}`);
      if (response.ok) {
        const { data } = await response.json();
        setAnalytics({
          totalVisits: data.totalVisits || 0,
          callClicks: data.callClicks || 0,
          lastVisit: new Date().toISOString(),
          metaPixelEvents: {
            pageViews: data.pageviewEvents || 0,
            contacts: data.contactEvents || 0,
            leads: data.leadEvents || 0,
            viewContent: data.viewContentEvents || 0,
            schedule: data.scheduleEvents || 0,
          },
          scrollDepth: {
            scroll25: data.scroll_25 || 0,
            scroll50: data.scroll_50 || 0,
            scroll75: data.scroll_75 || 0,
          },
        });
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch]);

  useEffect(() => {
    // Verificar si ya está autenticado
    const authStatus = sessionStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadAnalytics();
    }
  }, [loadAnalytics]);

  // Recargar cuando cambia la sucursal
  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [selectedBranch, isAuthenticated, loadAnalytics]);

  // Auto-refresh cada 5 segundos cuando está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      loadAnalytics();
    }, 5000); // 5 segundos

    return () => clearInterval(interval);
  }, [isAuthenticated, loadAnalytics]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      loadAnalytics();
    } else {
      setError("Credenciales incorrectas");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  const resetAnalytics = async () => {
    if (confirm("¿Estás seguro de que quieres resetear todas las estadísticas?")) {
      try {
        // Resetear en la API
        const response = await fetch(`${API_URL}/analytics/reset`, {
          method: 'POST',
        });
        
        if (response.ok) {
          alert("Estadísticas reseteadas exitosamente");
        }
      } catch (error) {
        console.error('Error resetting analytics:', error);
      }
      
      // Resetear localStorage también
      const resetData: Analytics = {
        totalVisits: 0,
        callClicks: 0,
        lastVisit: new Date().toISOString(),
        metaPixelEvents: {
          pageViews: 0,
          contacts: 0,
          leads: 0,
          viewContent: 0,
          schedule: 0,
        },
        scrollDepth: {
          scroll25: 0,
          scroll50: 0,
          scroll75: 0,
        },
      };
      localStorage.setItem("siteAnalytics", JSON.stringify(resetData));
      setAnalytics(resetData);
      loadAnalytics(); // Recargar datos después de resetear
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@fuerzaparaseguir.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Volver al Sitio
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard de Analytics</h1>
            <p className="text-muted-foreground">Clínica Fuerza Para Seguir</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-muted-foreground">
                En vivo • Última actualización: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={loadAnalytics}
                disabled={isLoading}
                className="ml-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              Ver Sitio
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Tabs por Sucursal */}
        <Tabs value={selectedBranch} onValueChange={setSelectedBranch} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            {SUCURSALES.map((sucursal) => {
              const Icon = sucursal.icon;
              return (
                <TabsTrigger 
                  key={sucursal.id} 
                  value={sucursal.id}
                  className={`flex items-center gap-2 py-3 data-[state=active]:${sucursal.bgColor}`}
                >
                  <Icon className={`h-4 w-4 ${selectedBranch === sucursal.id ? sucursal.color : ''}`} />
                  <span className="hidden sm:inline">{sucursal.nombre}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {SUCURSALES.map((sucursal) => (
            <TabsContent key={sucursal.id} value={sucursal.id} className="space-y-6">
              {/* Sucursal Header Card */}
              <Card className={`border-l-4 ${sucursal.borderColor}`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${sucursal.bgColor}`}>
                        <sucursal.icon className={`h-6 w-6 ${sucursal.color}`} />
                      </div>
                      <div>
                        <h2 className={`text-xl font-bold ${sucursal.color}`}>
                          {sucursal.id === 'todas' ? 'Vista General - Todas las Sucursales' : 
                           sucursal.id === 'home' ? 'Landing Principal (Corporativo)' :
                           `Sucursal ${sucursal.nombre}`}
                        </h2>
                        {'telefono' in sucursal && sucursal.telefono && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {sucursal.telefono}
                          </p>
                        )}
                      </div>
                    </div>
                    {'ruta' in sucursal && sucursal.ruta && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(sucursal.ruta as string)}
                        className={`${sucursal.color} hover:${sucursal.bgColor}`}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Ver Página
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className={`border-t-2 ${sucursal.borderColor}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Visitas Totales</CardTitle>
                    <Users className={`h-4 w-4 ${sucursal.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${sucursal.color}`}>{analytics.totalVisits}</div>
                    <p className="text-xs text-muted-foreground">
                      Última visita: {new Date(analytics.lastVisit).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>

                <Card className={`border-t-2 ${sucursal.borderColor}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clics en Llamada</CardTitle>
                    <Phone className={`h-4 w-4 ${sucursal.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${sucursal.color}`}>{analytics.callClicks}</div>
                    <p className="text-xs text-muted-foreground">
                      Tasa: {analytics.totalVisits > 0 ? ((analytics.callClicks / analytics.totalVisits) * 100).toFixed(1) : 0}%
                    </p>
                  </CardContent>
                </Card>

                <Card className={`border-t-2 ${sucursal.borderColor}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">PageViews</CardTitle>
                    <TrendingUp className={`h-4 w-4 ${sucursal.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${sucursal.color}`}>{analytics.metaPixelEvents.pageViews}</div>
                    <p className="text-xs text-muted-foreground">Vistas rastreadas</p>
                  </CardContent>
                </Card>

                <Card className={`border-t-2 ${sucursal.borderColor}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Leads</CardTitle>
                    <Settings className={`h-4 w-4 ${sucursal.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${sucursal.color}`}>{analytics.metaPixelEvents.leads}</div>
                    <p className="text-xs text-muted-foreground">
                      Contactos: {analytics.metaPixelEvents.contacts}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ViewContent</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.metaPixelEvents.viewContent}</div>
                    <p className="text-xs text-muted-foreground">Secciones vistas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Schedule</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.metaPixelEvents.schedule}</div>
                    <p className="text-xs text-muted-foreground">Intenciones agenda</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Scroll Depth</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">25%</span>
                        <span className="font-bold">{analytics.scrollDepth.scroll25}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">50%</span>
                        <span className="font-bold">{analytics.scrollDepth.scroll50}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">75%</span>
                        <span className="font-bold">{analytics.scrollDepth.scroll75}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Meta Pixel Configuration - Fuera de las tabs */}
        <Card className="mt-8 mb-8">
          <CardHeader>
            <CardTitle>Configuración de Meta Pixel</CardTitle>
            <CardDescription>
              Eventos disponibles y su estado actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">PageView</h3>
                  <p className="text-sm text-muted-foreground">
                    Se dispara automáticamente en cada visita
                  </p>
                </div>
                <div className="text-sm bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                  Activo
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Contact</h3>
                  <p className="text-sm text-muted-foreground">
                    Se dispara al hacer clic en el botón de llamada
                  </p>
                </div>
                <div className="text-sm bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                  Activo
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Lead</h3>
                  <p className="text-sm text-muted-foreground">
                    Se dispara cuando se completa una acción de contacto
                  </p>
                </div>
                <div className="text-sm bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                  Activo
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">ViewContent</h3>
                  <p className="text-sm text-muted-foreground">
                    Se dispara al visualizar secciones importantes (Beneficios, Instalaciones)
                  </p>
                </div>
                <div className="text-sm bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                  Activo
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Schedule</h3>
                  <p className="text-sm text-muted-foreground">
                    Se dispara al solicitar una cita o consulta
                  </p>
                </div>
                <div className="text-sm bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                  Configurado
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">ScrollDepth (Custom)</h3>
                  <p className="text-sm text-muted-foreground">
                    Trackea scroll al 25%, 50%, 75% de la página
                  </p>
                </div>
                <div className="text-sm bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                  Activo
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Pixel Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configuraciones Avanzadas del Pixel</CardTitle>
            <CardDescription>
              Parámetros y opciones de tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Pixel ID</h3>
                <code className="text-sm bg-muted px-2 py-1 rounded">2322312914895746</code>
                <p className="text-sm text-muted-foreground mt-2">
                  ID del pixel actualmente configurado
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Parámetros de Conversión</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <strong>Currency:</strong> MXN (Pesos Mexicanos)</li>
                  <li>• <strong>Contact Value:</strong> $1 MXN</li>
                  <li>• <strong>Lead Value:</strong> $10 MXN</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Eventos Automáticos</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✅ PageView automático al cargar</li>
                  <li>✅ Scroll depth tracking (25%, 50%, 75%)</li>
                  <li>✅ Contact tracking en botones de llamada</li>
                  <li>✅ Session-based visit counting</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Test Mode
                </h3>
                <p className="text-sm text-muted-foreground">
                  Para probar el pixel, usa la extensión{" "}
                  <strong>Meta Pixel Helper</strong> de Chrome. Verifica que todos los
                  eventos se disparen correctamente antes de lanzar campañas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
            <CardDescription>Administra tus datos de analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={loadAnalytics}
              className="w-full md:w-auto"
            >
              Refrescar Datos
            </Button>
            <Button
              variant="destructive"
              onClick={resetAnalytics}
              className="w-full md:w-auto ml-0 md:ml-2"
            >
              Resetear Estadísticas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
