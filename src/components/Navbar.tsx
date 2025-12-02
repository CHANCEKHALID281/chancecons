import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, Truck } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: logoUrl } = useQuery({
    queryKey: ["logo-content"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "logo")
        .maybeSingle();
      return data?.content || null;
    },
  });

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const scrollToTop = () => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="H&F Ltd" className="h-10 max-w-[150px] object-contain" />
          ) : (
            <>
              <Truck className="w-8 h-8" />
              <span>H&F Ltd</span>
            </>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={scrollToTop} className="text-foreground hover:text-primary transition-colors">
            Home
          </button>
          <button onClick={() => scrollToSection("services")} className="text-foreground hover:text-primary transition-colors">
            Services
          </button>
          <button onClick={() => scrollToSection("availability")} className="text-foreground hover:text-primary transition-colors">
            Availability
          </button>
          <button onClick={() => scrollToSection("gallery")} className="text-foreground hover:text-primary transition-colors">
            Gallery
          </button>
          <button onClick={() => scrollToSection("about")} className="text-foreground hover:text-primary transition-colors">
            About
          </button>
          <button onClick={() => scrollToSection("contact")} className="text-foreground hover:text-primary transition-colors">
            Contact
          </button>
          <Link to="/admin/login">
            <Button variant="outline" size="sm">Admin</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg md:hidden">
            <div className="flex flex-col p-4 gap-4">
              <button onClick={scrollToTop} className="text-left text-foreground hover:text-primary transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection("services")} className="text-left text-foreground hover:text-primary transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection("availability")} className="text-left text-foreground hover:text-primary transition-colors">
                Availability
              </button>
              <button onClick={() => scrollToSection("gallery")} className="text-left text-foreground hover:text-primary transition-colors">
                Gallery
              </button>
              <button onClick={() => scrollToSection("about")} className="text-left text-foreground hover:text-primary transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection("contact")} className="text-left text-foreground hover:text-primary transition-colors">
                Contact
              </button>
              <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Admin</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
