import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Corregidora from "./pages/Corregidora";
import TierraBlanca from "./pages/TierraBlanca";
import Valles from "./pages/Valles";
import Admin from "./pages/AdminExtended";
import AdminBlogs from "./pages/AdminBlogs";
import NotFound from "./pages/NotFound";
import { BlogPost } from "./components/BlogSection";
import { ParticlesBackground } from "./components/ParticlesBackground";

const queryClient = new QueryClient();

// Wrapper para páginas de blog individual
const BlogPageWrapper = () => {
  const { branch, slug } = useParams<{ branch: string; slug: string }>();
  if (!branch || !slug) return <NotFound />;
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <BlogPost branch={branch} slug={slug} />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/corregidora" element={<Corregidora />} />
          <Route path="/tierra-blanca" element={<TierraBlanca />} />
          <Route path="/valles" element={<Valles />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/extended" element={<Admin />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/:branch/blog/:slug" element={<BlogPageWrapper />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
