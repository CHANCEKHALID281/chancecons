import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Drill, Mountain, Package, Building2, Wrench } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Truck Rental",
    description: "Heavy-duty trucks for all your transportation needs. Reliable, well-maintained fleet available for short or long-term rentals.",
  },
  {
    icon: Drill,
    title: "Excavator Rental",
    description: "Modern excavators for excavation and earthmoving projects. Various sizes available to match your project requirements.",
  },
  {
    icon: Mountain,
    title: "Land Levelling",
    description: "Professional land levelling and site preparation services. Expert operators ensure perfect flatness for your construction foundation.",
  },
  {
    icon: Wrench,
    title: "Flatness Preparation",
    description: "Precision ground preparation services for optimal construction readiness. Advanced equipment for perfect surface preparation.",
  },
  {
    icon: Package,
    title: "Construction Materials",
    description: "Quality gravel, sand, stones and aggregates. Delivered fresh to your site in the quantities you need.",
  },
  {
    icon: Building2,
    title: "Structural Materials",
    description: "Premium steel, cement, rebar and structural components. Certified materials meeting all industry standards.",
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive construction solutions to power your projects from start to finish
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
