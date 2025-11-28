import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-construction.jpg";

export const Hero = () => {
  const { data: heroContent } = useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "hero")
        .single();
      return data;
    },
  });

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/70" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center text-primary-foreground z-10 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          {heroContent?.title || "H&F Ltd"}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
          {heroContent?.content || "Professional Construction Equipment & Materials"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Our Services <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact Us
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
