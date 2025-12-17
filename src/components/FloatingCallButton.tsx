import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/use-analytics";

export const FloatingCallButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { trackCallClick } = useAnalytics();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleCall = () => {
    trackCallClick();
    window.location.href = "tel:4443332009";
  };

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
    >
      <Button
        onClick={handleCall}
        size="lg"
        className="gradient-medical text-white hover:opacity-90 transition-all duration-300 shadow-premium-gold rounded-full h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 p-0 group animate-medical-glow"
        aria-label="Llamar ahora a la clínica"
      >
        <Phone className="h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 group-hover:animate-pulse" />
      </Button>
    </div>
  );
};
