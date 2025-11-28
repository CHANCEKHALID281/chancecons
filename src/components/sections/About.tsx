import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Award } from "lucide-react";

export const About = () => {
  const { data: aboutContent } = useQuery({
    queryKey: ["about-content"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "about")
        .single();
      return data;
    },
  });

  const { data: missionContent } = useQuery({
    queryKey: ["mission-content"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "mission")
        .single();
      return data;
    },
  });

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">About H&F Ltd</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building excellence, one project at a time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-in">
            <h3 className="text-3xl font-bold text-foreground mb-6">Who We Are</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {aboutContent?.content || 
                "H&F Ltd is your trusted partner for all construction needs. With years of experience in the industry, we provide top-quality equipment rentals, professional land levelling services, and a comprehensive selection of construction and structural materials."}
            </p>
          </div>

          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 animate-fade-in">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-foreground">Our Mission</h4>
                  <p className="text-muted-foreground">
                    {missionContent?.content ||
                      "To deliver exceptional construction services and materials that exceed our customers' expectations while maintaining the highest standards of safety and quality."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-xl transition-shadow animate-fade-in">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-xl mb-2">Quality First</h4>
              <p className="text-muted-foreground">
                Top-grade equipment and materials meeting all industry standards
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="font-bold text-xl mb-2">Customer Focus</h4>
              <p className="text-muted-foreground">
                Dedicated support and service to ensure your project success
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h4 className="font-bold text-xl mb-2">Reliability</h4>
              <p className="text-muted-foreground">
                On-time delivery and dependable service you can count on
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
