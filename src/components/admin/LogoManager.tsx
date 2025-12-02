import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";

export const LogoManager = () => {
  const queryClient = useQueryClient();

  const { data: logoContent } = useQuery({
    queryKey: ["logo-content"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "logo")
        .maybeSingle();
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (logoUrl: string) => {
      if (logoContent) {
        // Update existing
        const { error } = await supabase
          .from("site_content")
          .update({ content: logoUrl })
          .eq("section", "logo");
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("site_content")
          .insert([{ section: "logo", content: logoUrl, title: "Company Logo" }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logo-content"] });
      toast.success("Logo updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update logo", { description: error.message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Logo</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload
          value={logoContent?.content || ""}
          onChange={(url) => updateMutation.mutate(url)}
          folder="branding"
          label="Upload Logo"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Recommended size: 200x60 pixels. PNG or SVG with transparent background works best.
        </p>
      </CardContent>
    </Card>
  );
};
