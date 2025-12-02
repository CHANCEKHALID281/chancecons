import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

type MaterialType = "construction" | "structural";

export const MaterialsManager = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<MaterialType>("construction");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    in_stock: true,
    price_per_unit: "",
    unit: "ton",
    image_url: "",
  });

  const tableName = activeTab === "construction" ? "construction_materials" : "structural_materials";

  const { data: materials } = useQuery({
    queryKey: [`admin-${tableName}`],
    queryFn: async () => {
      const { data } = await supabase.from(tableName).select("*").order("name");
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from(tableName).insert([{
        ...data,
        price_per_unit: data.price_per_unit ? parseFloat(data.price_per_unit) : null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`admin-${tableName}`] });
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success("Material added successfully");
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from(tableName).update({
        ...data,
        price_per_unit: data.price_per_unit ? parseFloat(data.price_per_unit) : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`admin-${tableName}`] });
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success("Material updated successfully");
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`admin-${tableName}`] });
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success("Material deleted successfully");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      in_stock: true,
      price_per_unit: "",
      unit: "ton",
      image_url: "",
    });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || "",
      in_stock: item.in_stock,
      price_per_unit: item.price_per_unit?.toString() || "",
      unit: item.unit || "ton",
      image_url: item.image_url || "",
    });
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getCategoryOptions = () => {
    if (activeTab === "construction") {
      return ["gravel", "sand", "stones", "other"];
    }
    return ["steel", "cement", "rebar", "other"];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Materials Management</h2>
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as MaterialType); resetForm(); }}>
        <TabsList>
          <TabsTrigger value="construction">Construction Materials</TabsTrigger>
          <TabsTrigger value="structural">Structural Materials</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {isFormOpen && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Material" : "Add New Material"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {getCategoryOptions().map((cat) => (
                            <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price per Unit</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price_per_unit}
                        onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      />
                    </div>
                  </div>

                  <ImageUpload
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    folder="materials"
                    label="Material Image"
                  />

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="in_stock"
                      checked={formData.in_stock}
                      onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                    />
                    <Label htmlFor="in_stock">In Stock</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">{editingId ? "Update" : "Add"} Material</Button>
                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price/Unit</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="capitalize">{item.category}</TableCell>
                      <TableCell>${item.price_per_unit || "N/A"}/{item.unit}</TableCell>
                      <TableCell>{item.in_stock ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
