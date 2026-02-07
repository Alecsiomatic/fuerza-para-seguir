import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReportGenerator } from "@/components/ReportGenerator";
import { 
  Eye, EyeOff, Phone, Users, TrendingUp, RefreshCw, Building2, MapPin,
  Smartphone, Monitor, Tablet, Globe, Clock, MousePointer, ArrowUpRight,
  BarChart3, PieChart, Activity, Zap, Target, UserCheck, UserPlus,
  Chrome, Apple, Laptop, ChevronRight
} from "lucide-react";

// Credenciales
const ADMIN_EMAIL = "Admin@fuerzaparaseguir.com";
const ADMIN_PASSWORD = "Admin123";

// API URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Sucursales
const SUCURSALES = [
  { id: 'todas', nombre: 'Todas', icon: Building2, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { id: 'corregidora', nombre: 'Corregidora', icon: Building2, color: 'text-blue-500', bgColor: 'bg-blue-500/10', pixel: '1536525286984531' },
  { id: 'tierra-blanca', nombre: 'Tierra Blanca', icon: MapPin, color: 'text-amber-500', bgColor: 'bg-amber-500/10', pixel: '1229815818187940' },
  { id: 'valles', nombre: 'Cd. Valles', icon: MapPin, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', pixel: '1234602605435689' },
];

// Días de la semana
const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Componente para mostrar un stat card
const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "text-primary" }: any) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')}/10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-2 flex items-center text-xs">
          <ArrowUpRight className={`h-3 w-3 mr-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
          <span className={trend >= 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(trend)}% vs período anterior
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Componente para barras de distribución
const DistributionBar = ({ label, value, total, color = "bg-primary" }: any) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value} ({percentage.toFixed(1)}%)</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

// Componente para icono de dispositivo
const DeviceIcon = ({ type }: { type: string }) => {
  switch (type?.toLowerCase()) {
    case 'mobile': return <Smartphone className="h-4 w-4" />;
    case 'tablet': return <Tablet className="h-4 w-4" />;
    default: return <Monitor className="h-4 w-4" />;
  }
};

// Componente para icono de navegador
const BrowserIcon = ({ name }: { name: string }) => {
  switch (name?.toLowerCase()) {
    case 'chrome': return <Chrome className="h-4 w-4" />;
    case 'safari': return <Apple className="h-4 w-4" />;
    default: return <Globe className="h-4 w-4" />;
  }
};

export default function AdminExtended() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedBranch, setSelectedBranch] = useState("corregidora");
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [realtimeData, setRealtimeData] = useState<any>(null);
  const [sessionsData, setSessionsData] = useState<any[]>([]);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Cargar dashboard principal
      const dashboardRes = await fetch(`${API_URL}/analytics/dashboard/${selectedBranch}?period=${selectedPeriod}d`);
      if (dashboardRes.ok) {
        const { data } = await dashboardRes.json();
        setDashboardData(data);
      }
      
      // Cargar datos en tiempo real
      const realtimeRes = await fetch(`${API_URL}/analytics/realtime/${selectedBranch}`);
      if (realtimeRes.ok) {
        const { data } = await realtimeRes.json();
        setRealtimeData(data);
      }
      
      // Cargar sesiones recientes
      const sessionsRes = await fetch(`${API_URL}/analytics/sessions/${selectedBranch}?limit=20`);
      if (sessionsRes.ok) {
        const { data } = await sessionsRes.json();
        setSessionsData(data);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch, selectedPeriod]);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadDashboard();
    }
  }, [loadDashboard]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [selectedBranch, selectedPeriod, isAuthenticated, loadDashboard]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, loadDashboard]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      loadDashboard();
    } else {
      setError("Credenciales incorrectas");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Panel de Analytics</CardTitle>
            <CardDescription>Dashboard completo de métricas por sucursal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
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
              <Button type="submit" className="w-full">Iniciar Sesión</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summary = dashboardData?.summary || {};
  const currentSucursal = SUCURSALES.find(s => s.id === selectedBranch);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900/50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Analytics</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-muted-foreground">
                En vivo • {lastUpdate.toLocaleTimeString()}
              </span>
              <Button variant="ghost" size="sm" onClick={loadDashboard} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 días</SelectItem>
                <SelectItem value="30">30 días</SelectItem>
                <SelectItem value="90">90 días</SelectItem>
              </SelectContent>
            </Select>
            {selectedBranch === 'todas' && (
              <ReportGenerator branch="todas" branchName="Todas las Sucursales" />
            )}
            <Button variant="outline" onClick={() => navigate("/")}>Ver Sitio</Button>
            <Button variant="destructive" onClick={handleLogout}>Salir</Button>
          </div>
        </div>

        {/* Tabs de sucursales */}
        <Tabs value={selectedBranch} onValueChange={setSelectedBranch}>
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            {SUCURSALES.map((suc) => (
              <TabsTrigger key={suc.id} value={suc.id} className="flex items-center gap-2">
                <suc.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{suc.nombre}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedBranch} className="space-y-6 mt-6">
            
            {/* Info de sucursal y pixel */}
            {currentSucursal && currentSucursal.id !== 'todas' && (
              <Card className={`border-l-4 ${currentSucursal.color.replace('text-', 'border-')}`}>
                <CardContent className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${currentSucursal.bgColor}`}>
                      <currentSucursal.icon className={`h-5 w-5 ${currentSucursal.color}`} />
                    </div>
                    <div>
                      <h2 className="font-semibold">{currentSucursal.nombre}</h2>
                      <p className="text-xs text-muted-foreground">Pixel: {currentSucursal.pixel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ReportGenerator branch={currentSucursal.id} branchName={currentSucursal.nombre} />
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      <Activity className="h-3 w-3 mr-1" /> Pixel Activo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tiempo real */}
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Zap className="h-8 w-8 text-green-500" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Visitantes activos ahora</p>
                      <p className="text-4xl font-bold text-green-500">{realtimeData?.activeVisitors || 0}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Últimos 5 minutos</p>
                </div>
              </CardContent>
            </Card>

            {/* Métricas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Visitas Totales"
                value={summary.totalVisits?.toLocaleString() || 0}
                subtitle={`${summary.uniqueVisitors || 0} únicos`}
                icon={Users}
                color="text-blue-500"
              />
              <StatCard
                title="Clics en Llamar"
                value={summary.callClicks?.toLocaleString() || 0}
                subtitle={`${summary.conversionRate || 0}% conversión`}
                icon={Phone}
                color="text-green-500"
              />
              <StatCard
                title="Tiempo Promedio"
                value={`${Math.floor((summary.avgTimeOnPage || 0) / 60)}:${String((summary.avgTimeOnPage || 0) % 60).padStart(2, '0')}`}
                subtitle="min:seg en página"
                icon={Clock}
                color="text-purple-500"
              />
              <StatCard
                title="Tasa Conversión"
                value={`${summary.sessionConversionRate || 0}%`}
                subtitle="sesiones convertidas"
                icon={Target}
                color="text-amber-500"
              />
            </div>

            {/* Segunda fila de métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Nuevos Visitantes"
                value={summary.newVisitors?.toLocaleString() || 0}
                icon={UserPlus}
                color="text-cyan-500"
              />
              <StatCard
                title="Recurrentes"
                value={summary.returningVisitors?.toLocaleString() || 0}
                icon={UserCheck}
                color="text-indigo-500"
              />
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Dispositivos</p>
                  <div className="flex items-center gap-4">
                    {dashboardData?.deviceBreakdown?.map((d: any) => (
                      <div key={d.device_type} className="flex items-center gap-1">
                        <DeviceIcon type={d.device_type} />
                        <span className="text-sm font-medium">{d.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Top Navegador</p>
                  <div className="flex items-center gap-2">
                    <BrowserIcon name={dashboardData?.browserBreakdown?.[0]?.browser} />
                    <span className="font-medium">{dashboardData?.browserBreakdown?.[0]?.browser || '-'}</span>
                    <Badge variant="secondary">{dashboardData?.browserBreakdown?.[0]?.percentage || 0}%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos y distribuciones */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Fuentes de tráfico */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" /> Fuentes de Tráfico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData?.trafficSources?.map((source: any) => (
                    <DistributionBar
                      key={source.source}
                      label={source.source}
                      value={source.count}
                      total={summary.totalVisits}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Dispositivos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" /> Dispositivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData?.deviceBreakdown?.map((device: any) => (
                    <div key={device.device_type} className="flex items-center gap-3">
                      <DeviceIcon type={device.device_type} />
                      <div className="flex-1">
                        <DistributionBar
                          label={device.device_type || 'Desconocido'}
                          value={device.count}
                          total={summary.totalVisits}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Navegadores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Chrome className="h-5 w-5" /> Navegadores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData?.browserBreakdown?.slice(0, 5).map((browser: any) => (
                    <div key={browser.browser} className="flex items-center gap-3">
                      <BrowserIcon name={browser.browser} />
                      <div className="flex-1">
                        <DistributionBar
                          label={browser.browser || 'Desconocido'}
                          value={browser.count}
                          total={summary.totalVisits}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sistemas Operativos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Laptop className="h-5 w-5" /> Sistemas Operativos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData?.osBreakdown?.slice(0, 5).map((os: any) => (
                    <DistributionBar
                      key={os.os}
                      label={os.os || 'Desconocido'}
                      value={os.count}
                      total={summary.totalVisits}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Scroll Depth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-5 w-5" /> Profundidad de Scroll
                  </CardTitle>
                  <CardDescription>Qué tanto scrollean los visitantes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[25, 50, 75, 100].map((depth) => {
                    const data = dashboardData?.scrollDepth?.find((s: any) => s.depth_percentage === depth);
                    return (
                      <DistributionBar
                        key={depth}
                        label={`${depth}% de la página`}
                        value={data?.count || 0}
                        total={summary.totalVisits}
                        color={depth === 100 ? 'bg-green-500' : depth >= 75 ? 'bg-blue-500' : 'bg-primary'}
                      />
                    );
                  })}
                </CardContent>
              </Card>

              {/* Horarios más activos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" /> Horarios Más Activos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const data = dashboardData?.hourlyVisits?.find((h: any) => h.hour === hour);
                      const maxVisits = Math.max(...(dashboardData?.hourlyVisits?.map((h: any) => h.count) || [1]));
                      const intensity = data ? (data.count / maxVisits) * 100 : 0;
                      return (
                        <div
                          key={hour}
                          className="aspect-square rounded flex items-center justify-center text-xs"
                          style={{
                            backgroundColor: `hsl(142, 76%, ${100 - intensity * 0.6}%)`,
                            color: intensity > 50 ? 'white' : 'inherit'
                          }}
                          title={`${hour}:00 - ${data?.count || 0} visitas`}
                        >
                          {hour}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Hora del día (0-23)</p>
                </CardContent>
              </Card>
            </div>

            {/* Sesiones Recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" /> Sesiones Recientes
                </CardTitle>
                <CardDescription>Últimas 20 sesiones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Fecha</th>
                        <th className="text-left py-2">Dispositivo</th>
                        <th className="text-left py-2">Navegador</th>
                        <th className="text-left py-2">Fuente</th>
                        <th className="text-left py-2">Páginas</th>
                        <th className="text-left py-2">Tiempo</th>
                        <th className="text-left py-2">Scroll</th>
                        <th className="text-left py-2">Conversión</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessionsData.map((session: any, idx: number) => (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="py-2">
                            {new Date(session.first_visit).toLocaleDateString('es-MX', { 
                              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                            })}
                          </td>
                          <td className="py-2">
                            <div className="flex items-center gap-1">
                              <DeviceIcon type={session.device_type} />
                              <span className="capitalize">{session.device_type || '-'}</span>
                            </div>
                          </td>
                          <td className="py-2">{session.browser || '-'}</td>
                          <td className="py-2">
                            <Badge variant="outline" className="text-xs">
                              {session.referrer_source || 'direct'}
                            </Badge>
                          </td>
                          <td className="py-2">{session.page_views}</td>
                          <td className="py-2">
                            {Math.floor(session.total_time_seconds / 60)}:{String(session.total_time_seconds % 60).padStart(2, '0')}
                          </td>
                          <td className="py-2">{session.max_scroll_depth}%</td>
                          <td className="py-2">
                            {session.converted ? (
                              <Badge className="bg-green-500 text-xs">
                                <Phone className="h-3 w-3 mr-1" /> Llamó
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* UTM Campaigns */}
            {dashboardData?.utmSources?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> Campañas UTM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Source</th>
                          <th className="text-left py-2">Medium</th>
                          <th className="text-left py-2">Campaign</th>
                          <th className="text-right py-2">Visitas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.utmSources.map((utm: any, idx: number) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2">{utm.utm_source || '-'}</td>
                            <td className="py-2">{utm.utm_medium || '-'}</td>
                            <td className="py-2">{utm.utm_campaign || '-'}</td>
                            <td className="py-2 text-right font-medium">{utm.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Idiomas y Resoluciones */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Idiomas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dashboardData?.languages?.slice(0, 5).map((lang: any) => (
                      <div key={lang.language} className="flex justify-between">
                        <span>{lang.language}</span>
                        <Badge variant="secondary">{lang.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resoluciones de Pantalla</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dashboardData?.screenResolutions?.slice(0, 5).map((res: any) => (
                      <div key={res.resolution} className="flex justify-between">
                        <span>{res.resolution}</span>
                        <Badge variant="secondary">{res.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
