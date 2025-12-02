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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

export const EquipmentManager = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "truck" as "truck" | "excavator" | "other",
    description: "",
    available: true,
    rental_price_per_day: "",
    image_url: "",
  });

  const { data: equipment } = useQuery({
    queryKey: ["admin-equipment"],
    queryFn: async () => {
      const { data } = await supabase.from("equipment").select("*").order("name");
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("equipment").insert([{
        ...data,
        rental_price_per_day: data.rental_price_per_day ? parseFloat(data.rental_price_per_day) : null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast.success("Equipment added successfully");
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("equipment").update({
        ...data,
        rental_price_per_day: data.rental_price_per_day ? parseFloat(data.rental_price_per_day) : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast.success("Equipment updated successfully");
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("equipment").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-equipment"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast.success("Equipment deleted successfully");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "truck",
      description: "",
      available: true,
      rental_price_per_day: "",
      image_url: "",
    });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      type: item.type,
      description: item.description || "",
      available: item.available,
      rental_price_per_day: item.rental_price_per_day?.toString() || "",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Equipment Management</h2>
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Equipment" : "Add New Equipment"}</CardTitle>
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
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="excavator">Excavator</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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

              <div>
                <Label htmlFor="price">Rental Price (per day)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.rental_price_per_day}
                  onChange={(e) => setFormData({ ...formData, rental_price_per_day: e.target.value })}
                />
              </div>

              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="equipment"
                label="Equipment Image"
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Available for Rent</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Update" : "Add"} Equipment</Button>
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
                <TableHead>Type</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="capitalize">{item.type}</TableCell>
                  <TableCell>${item.rental_price_per_day || "N/A"}</TableCell>
                  <TableCell>{item.available ? "Yes" : "No"}</TableCell>
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
    </div>
  );
};
