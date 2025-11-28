import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Tag } from "lucide-react";

export const Availability = () => {
  const { data: equipment } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data } = await supabase
        .from("equipment")
        .select("*")
        .order("name");
      return data || [];
    },
  });

  const { data: constructionMaterials } = useQuery({
    queryKey: ["construction_materials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("construction_materials")
        .select("*")
        .order("name");
      return data || [];
    },
  });

  const { data: structuralMaterials } = useQuery({
    queryKey: ["structural_materials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("structural_materials")
        .select("*")
        .order("name");
      return data || [];
    },
  });

  const { data: promotions } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("promotions")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <section id="availability" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Current Availability</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Live updates on equipment and materials in stock
          </p>
        </div>

        {/* Promotions Banner */}
        {promotions && promotions.length > 0 && (
          <div className="mb-8 space-y-4">
            {promotions.map((promo) => (
              <Card key={promo.id} className="bg-gradient-to-r from-secondary/20 to-accent/20 border-2 border-secondary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-secondary" />
                      <CardTitle className="text-xl">{promo.title}</CardTitle>
                    </div>
                    {promo.discount_percentage && (
                      <Badge className="bg-secondary text-secondary-foreground">
                        {promo.discount_percentage}% OFF
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{promo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="construction">Construction Materials</TabsTrigger>
            <TabsTrigger value="structural">Structural Materials</TabsTrigger>
          </TabsList>

          <TabsContent value="equipment">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment?.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      {item.available ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <Badge variant={item.available ? "default" : "secondary"}>
                      {item.available ? "Available" : "Rented"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                    {item.rental_price_per_day && (
                      <p className="mt-3 font-semibold text-primary">
                        ${item.rental_price_per_day}/day
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="construction">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {constructionMaterials?.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      {item.in_stock ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <Badge variant={item.in_stock ? "default" : "secondary"}>
                      {item.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                    {item.price_per_unit && (
                      <p className="mt-3 font-semibold text-primary">
                        ${item.price_per_unit}/{item.unit}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="structural">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {structuralMaterials?.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      {item.in_stock ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <Badge variant={item.in_stock ? "default" : "secondary"}>
                      {item.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                    {item.price_per_unit && (
                      <p className="mt-3 font-semibold text-primary">
                        ${item.price_per_unit}/{item.unit}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
