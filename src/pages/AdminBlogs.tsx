import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/RichTextEditor";
import { 
  Plus, Pencil, Trash2, Eye, EyeOff, Upload, Youtube, Image, Video,
  Calendar, FileText, Building2, MapPin, Globe, ArrowLeft, Save, Send,
  RefreshCw, BarChart3, Clock, CheckCircle, XCircle, Archive
} from "lucide-react";

// Credenciales
const ADMIN_EMAIL = "Admin@fuerzaparaseguir.com";
const ADMIN_PASSWORD = "Admin123";

// API URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Sucursales
const SUCURSALES = [
  { id: 'corregidora', nombre: 'Corregidora', icon: Building2, color: 'bg-blue-500' },
  { id: 'tierra-blanca', nombre: 'Tierra Blanca', icon: MapPin, color: 'bg-amber-500' },
  { id: 'valles', nombre: 'Cd. Valles', icon: MapPin, color: 'bg-emerald-500' },
  { id: 'home', nombre: 'Inicio (General)', icon: Globe, color: 'bg-purple-500' },
];

interface Blog {
  id: number;
  branch: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  media_url: string | null;
  media_type: 'image' | 'video' | 'youtube';
  youtube_id: string | null;
  author: string;
  status: 'draft' | 'published' | 'archived';
  publish_date: string;
  views: number;
  created_at: string;
}

interface BlogStats {
  total: number;
  published: number;
  drafts: number;
  total_views: number;
  byBranch: { branch: string; count: number; views: number }[];
}

export default function AdminBlogs() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Blog states
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [selectedBranch, setSelectedBranch] = useState("todas");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    branch: 'corregidora',
    title: '',
    excerpt: '',
    content: '',
    youtube_url: '',
    publish_date: new Date().toISOString().slice(0, 16),
    status: 'draft' as 'draft' | 'published'
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);

  // Load blogs
  const loadBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedBranch !== 'todas') params.append('branch', selectedBranch);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const res = await fetch(`${API_URL}/blogs/admin?${params}`);
      if (res.ok) {
        const { data } = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch, selectedStatus]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/blogs/stats`);
      if (res.ok) {
        const { data } = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadBlogs();
      loadStats();
    }
  }, [loadBlogs, loadStats]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBlogs();
    }
  }, [selectedBranch, selectedStatus, isAuthenticated, loadBlogs]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      loadBlogs();
      loadStats();
    } else {
      setError("Credenciales incorrectas");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      setFormData(prev => ({ ...prev, youtube_url: '' }));
    }
  };

  // Handle form reset
  const resetForm = () => {
    setFormData({
      branch: 'corregidora',
      title: '',
      excerpt: '',
      content: '',
      youtube_url: '',
      publish_date: new Date().toISOString().slice(0, 16),
      status: 'draft'
    });
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setEditingBlog(null);
    setIsCreating(false);
  };

  // Start editing
  const startEditing = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      branch: blog.branch,
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content,
      youtube_url: blog.youtube_id ? `https://youtube.com/watch?v=${blog.youtube_id}` : '',
      publish_date: blog.publish_date ? new Date(blog.publish_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      status: blog.status === 'archived' ? 'draft' : blog.status
    });
    if (blog.media_url) {
      // Construir URL completa para el preview
      const baseUrl = window.location.origin;
      setMediaPreview(blog.media_url.startsWith('http') ? blog.media_url : `${baseUrl}${blog.media_url}`);
      setMediaType(blog.media_type as 'image' | 'video' || 'image');
    }
    setIsCreating(true);
  };

  // Submit form
  const handleSubmit = async (publishNow = false) => {
    try {
      setIsLoading(true);
      const data = new FormData();
      data.append('branch', formData.branch);
      data.append('title', formData.title);
      data.append('excerpt', formData.excerpt);
      data.append('content', formData.content);
      data.append('publish_date', formData.publish_date);
      data.append('status', publishNow ? 'published' : formData.status);
      
      if (formData.youtube_url) {
        data.append('youtube_url', formData.youtube_url);
      }
      
      if (mediaFile) {
        data.append('media', mediaFile);
      }

      const url = editingBlog 
        ? `${API_URL}/blogs/admin/${editingBlog.id}`
        : `${API_URL}/blogs/admin`;
      
      const res = await fetch(url, {
        method: editingBlog ? 'PUT' : 'POST',
        body: data
      });

      if (res.ok) {
        resetForm();
        loadBlogs();
        loadStats();
      } else {
        const error = await res.json();
        alert(error.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete blog
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este blog?')) return;
    
    try {
      const res = await fetch(`${API_URL}/blogs/admin/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadBlogs();
        loadStats();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  // Change status
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/blogs/admin/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadBlogs();
        loadStats();
      }
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md glass-premium">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gradient-medical">
              Admin - Blog
            </CardTitle>
            <CardDescription>Ingresa tus credenciales</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full gradient-medical text-white">
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Blog editor
  if (isCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={resetForm}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSubmit(false)} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" /> Guardar borrador
              </Button>
              <Button className="gradient-medical text-white" onClick={() => handleSubmit(true)} disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" /> Publicar
              </Button>
            </div>
          </div>

          <Card className="glass-premium">
            <CardHeader>
              <CardTitle>{editingBlog ? 'Editar Blog' : 'Nuevo Blog'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sucursal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sucursal</Label>
                  <Select value={formData.branch} onValueChange={(v) => setFormData(prev => ({ ...prev, branch: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUCURSALES.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${s.color}`} />
                            {s.nombre}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fecha de publicación</Label>
                  <Input
                    type="datetime-local"
                    value={formData.publish_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                  />
                </div>
              </div>

              {/* Título */}
              <div>
                <Label>Título</Label>
                <Input
                  placeholder="Escribe el título del blog..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-semibold"
                />
              </div>

              {/* Extracto */}
              <div>
                <Label>Extracto (resumen corto)</Label>
                <Textarea
                  placeholder="Un breve resumen que aparecerá en las tarjetas..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Media */}
              <div className="space-y-4">
                <Label>Imagen o Video</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Subir archivo</Label>
                    <div className="mt-2 border-2 border-dashed rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Arrastra o haz clic para subir
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, GIF, MP4 (max 50MB)
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">O URL de YouTube</Label>
                    <div className="mt-2">
                      <div className="flex gap-2">
                        <Youtube className="h-5 w-5 text-red-500 mt-2.5" />
                        <Input
                          placeholder="https://youtube.com/watch?v=..."
                          value={formData.youtube_url}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, youtube_url: e.target.value }));
                            setMediaFile(null);
                            setMediaPreview(null);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Preview */}
                {(mediaPreview || formData.youtube_url) && (
                  <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
                    {formData.youtube_url ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${formData.youtube_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1] || ''}`}
                        allowFullScreen
                      />
                    ) : mediaPreview ? (
                      mediaType === 'video' ? (
                        <video src={mediaPreview} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                      )
                    ) : null}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setMediaFile(null);
                        setMediaPreview(null);
                        setMediaType(null);
                        setFormData(prev => ({ ...prev, youtube_url: '' }));
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div>
                <Label>Contenido del blog</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Escribe el contenido completo del blog..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient-medical">Blog Manager</h1>
            <p className="text-muted-foreground">Administra los blogs de todas las sucursales</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/extended")}>
              <BarChart3 className="h-4 w-4 mr-2" /> Analytics
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Ver Sitio
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-premium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Blogs</p>
                    <p className="text-3xl font-bold text-primary">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-premium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Publicados</p>
                    <p className="text-3xl font-bold text-green-500">{stats.published}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-premium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Borradores</p>
                    <p className="text-3xl font-bold text-amber-500">{stats.drafts}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-premium">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Vistas Totales</p>
                    <p className="text-3xl font-bold text-blue-500">{stats.total_views?.toLocaleString() || 0}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Create */}
        <div className="flex flex-wrap items-center gap-4">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sucursal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las sucursales</SelectItem>
              {SUCURSALES.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="published">Publicados</SelectItem>
              <SelectItem value="draft">Borradores</SelectItem>
              <SelectItem value="archived">Archivados</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={loadBlogs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <div className="flex-1" />

          <Button className="gradient-medical text-white" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nuevo Blog
          </Button>
        </div>

        {/* Blog List */}
        <div className="grid gap-4">
          {blogs.length === 0 ? (
            <Card className="glass-premium">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No hay blogs aún</p>
                <Button className="mt-4" onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Crear el primero
                </Button>
              </CardContent>
            </Card>
          ) : (
            blogs.map(blog => {
              const sucursal = SUCURSALES.find(s => s.id === blog.branch);
              return (
                <Card key={blog.id} className="glass-premium hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {blog.youtube_id ? (
                          <img
                            src={`https://img.youtube.com/vi/${blog.youtube_id}/mqdefault.jpg`}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : blog.media_url ? (
                          blog.media_type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Video className="h-8 w-8 text-muted-foreground" />
                            </div>
                          ) : (
                            <img src={blog.media_url} alt={blog.title} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={sucursal?.color + ' text-white'}>
                                {sucursal?.nombre}
                              </Badge>
                              <Badge variant={
                                blog.status === 'published' ? 'default' :
                                blog.status === 'draft' ? 'secondary' : 'outline'
                              }>
                                {blog.status === 'published' ? 'Publicado' :
                                 blog.status === 'draft' ? 'Borrador' : 'Archivado'}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg truncate">{blog.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {blog.excerpt || blog.content.substring(0, 100)}...
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => startEditing(blog)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {blog.status === 'draft' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStatusChange(blog.id, 'published')}
                              >
                                <Send className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            {blog.status === 'published' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStatusChange(blog.id, 'archived')}
                              >
                                <Archive className="h-4 w-4 text-amber-500" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(blog.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(blog.publish_date).toLocaleDateString('es-MX')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {blog.views} vistas
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
