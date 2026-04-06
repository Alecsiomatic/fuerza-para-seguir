import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, ArrowRight, Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// API URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  publish_date: string;
  views: number;
}

interface BlogSectionProps {
  branch: string;
  limit?: number;
  showTitle?: boolean;
}

export function BlogSection({ branch, limit = 3, showTitle = true }: BlogSectionProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs/public/${branch}?limit=${limit}`);
        if (res.ok) {
          const { data } = await res.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBlogs();
  }, [branch, limit]);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-premium rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="blog">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gradient-medical">Nuestro Blog</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artículos, consejos y recursos para apoyar tu camino hacia la recuperación
            </p>
            <div className="w-24 h-1 mx-auto gradient-medical rounded-full mt-6 opacity-70" />
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} branch={branch} />
          ))}
        </div>

        {blogs.length >= limit && (
          <div className="text-center mt-12">
            <Link to={`/${branch}/blog`}>
              <Button variant="outline" size="lg" className="group">
                Ver todos los artículos
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

interface BlogCardProps {
  blog: Blog;
  index: number;
  branch: string;
}

function BlogCard({ blog, index, branch }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calcular tiempo de lectura
  const readingTime = Math.max(1, Math.ceil(blog.content.length / 1000));

  return (
    <Link
      to={`/${branch}/blog/${blog.slug}`}
      className="block group animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="h-full relative">
        {/* Card con efecto liquid glass */}
        <div className={`
          h-full rounded-2xl overflow-hidden transition-all duration-500
          ${isHovered ? 'scale-[1.02] shadow-2xl' : 'scale-100'}
        `}>
          {/* Glass background */}
          <div className="absolute inset-0 glass-premium" />
          
          {/* Gradient border on hover */}
          <div className={`
            absolute inset-0 rounded-2xl transition-opacity duration-500
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `} style={{
            background: 'linear-gradient(135deg, transparent, transparent)',
            padding: '2px',
          }}>
            <div className="absolute inset-0 rounded-2xl gradient-medical opacity-20" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Media */}
            <div className="aspect-video relative overflow-hidden">
              {blog.youtube_id ? (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${blog.youtube_id}/maxresdefault.jpg`}
                    alt={blog.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${blog.youtube_id}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`
                      w-16 h-16 rounded-full bg-white/90 flex items-center justify-center
                      shadow-xl transition-transform duration-300
                      ${isHovered ? 'scale-110' : 'scale-100'}
                    `}>
                      <Play className="h-6 w-6 text-primary fill-primary ml-1" />
                    </div>
                  </div>
                </>
              ) : blog.media_url ? (
                <img
                  src={blog.media_url}
                  alt={blog.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
              ) : (
                <div className="w-full h-full gradient-primary opacity-20 flex items-center justify-center">
                  <span className="text-6xl opacity-50">📖</span>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Text content */}
            <div className="p-6 space-y-4">
              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(blog.publish_date).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingTime} min
                </span>
              </div>

              {/* Title */}
              <h3 className={`
                text-xl font-bold leading-tight transition-colors duration-300
                ${isHovered ? 'text-primary' : 'text-foreground'}
              `}>
                {blog.title}
              </h3>

              {/* Excerpt */}
              <p className="text-muted-foreground line-clamp-2">
                {blog.excerpt || blog.content.substring(0, 150)}...
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {blog.views} vistas
                </span>
                <span className={`
                  flex items-center gap-1 text-sm font-medium transition-all duration-300
                  ${isHovered ? 'text-primary translate-x-1' : 'text-muted-foreground'}
                `}>
                  Leer más <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Componente para página individual de blog
interface BlogPostProps {
  branch: string;
  slug: string;
}

export function BlogPost({ branch, slug }: BlogPostProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs/public/${branch}/${slug}`);
        if (res.ok) {
          const { data } = await res.json();
          setBlog(data);
        } else {
          setError('Blog no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el blog');
      } finally {
        setIsLoading(false);
      }
    };
    loadBlog();
  }, [branch, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link to={`/${branch}`}>
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  const readingTime = Math.max(1, Math.ceil(blog.content.length / 1000));

  return (
    <article className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <Link 
            to={`/${branch}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" /> Volver
          </Link>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient-medical">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {new Date(blog.publish_date).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {readingTime} min de lectura
            </span>
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {blog.views} vistas
            </span>
          </div>
        </header>

        {/* Featured Media */}
        {(blog.youtube_id || blog.media_url) && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-luxury">
            {blog.youtube_id ? (
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${blog.youtube_id}?rel=0`}
                  title={blog.title}
                  allowFullScreen
                />
              </div>
            ) : blog.media_type === 'video' ? (
              <video
                src={blog.media_url!}
                controls
                className="w-full aspect-video object-cover"
              />
            ) : (
              <img
                src={blog.media_url!}
                alt={blog.title}
                className="w-full aspect-video object-cover"
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="glass-premium rounded-2xl p-8 md:p-12">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-foreground prose-headings:font-bold
              prose-p:text-foreground/80 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-ul:text-foreground/80 prose-ol:text-foreground/80
            "
          >
            {/* Renderizar contenido - por ahora como texto plano con saltos de línea */}
            {blog.content.split('\n').map((paragraph, i) => (
              paragraph.trim() && (
                <p key={i} className="mb-4">{paragraph}</p>
              )
            ))}
          </div>
        </div>

        {/* Author & Share */}
        <div className="mt-12 glass-premium rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full gradient-medical flex items-center justify-center text-white font-bold">
              {blog.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{blog.author}</p>
              <p className="text-sm text-muted-foreground">Equipo Fuerza Para Seguir</p>
            </div>
          </div>
          
          <Link to={`/${branch}#blog`}>
            <Button variant="outline">
              Más artículos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default BlogSection;
