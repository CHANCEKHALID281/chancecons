import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Gallery = () => {
  const { data: galleryImages } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Work</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our equipment and completed projects
          </p>
        </div>

        {galleryImages && galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id} 
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={image.image_url} 
                  alt={image.title || "Gallery image"} 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {image.title && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <h3 className="font-semibold text-lg">{image.title}</h3>
                      {image.description && (
                        <p className="text-sm text-white/90">{image.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Gallery images will appear here soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};
