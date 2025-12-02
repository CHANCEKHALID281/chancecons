import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { LogoManager } from "./LogoManager";

export const ContentManager = () => {
  const queryClient = useQueryClient();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const { data: content } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ section, newContent }: { section: string; newContent: string }) => {
      const { error } = await supabase
        .from("site_content")
        .update({ content: newContent })
        .eq("section", section);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      queryClient.invalidateQueries({ queryKey: ["hero-content"] });
      queryClient.invalidateQueries({ queryKey: ["about-content"] });
      queryClient.invalidateQueries({ queryKey: ["mission-content"] });
      toast.success("Content updated successfully");
      setEditingSection(null);
      setEditContent("");
    },
  });

  const handleEdit = (section: string, currentContent: string) => {
    setEditingSection(section);
    setEditContent(currentContent);
  };

  const handleSave = (section: string) => {
    updateMutation.mutate({ section, newContent: editContent });
  };

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      hero: "Hero Section",
      about: "About Us",
      mission: "Mission Statement",
      contact_info: "Contact Information",
    };
    return titles[section] || section;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Content Management</h2>
      <p className="text-muted-foreground">Edit the text content displayed on your public website.</p>

      {/* Logo Manager */}
      <LogoManager />

      <div className="grid gap-6">
        {content?.filter(item => item.section !== "logo").map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{getSectionTitle(item.section)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingSection === item.section ? (
                <>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-32 mt-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSave(item.section)}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingSection(null)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="whitespace-pre-wrap">{item.content}</p>
                  </div>
                  <Button onClick={() => handleEdit(item.section, item.content || "")}>
                    Edit
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
