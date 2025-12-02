import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

export const GalleryManager = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
  });

  const { data: gallery } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("gallery").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Image added to gallery");
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Image removed from gallery");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "",
    });
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Image</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="gallery"
                label="Image *"
              />

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Equipment, Projects, Materials"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Image</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery?.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <img 
              src={item.image_url} 
              alt={item.title || "Gallery image"} 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              {item.title && <h3 className="font-semibold mb-1">{item.title}</h3>}
              {item.description && <p className="text-sm text-muted-foreground mb-3">{item.description}</p>}
              <Button 
                size="sm" 
                variant="destructive" 
                className="w-full"
                onClick={() => deleteMutation.mutate(item.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
