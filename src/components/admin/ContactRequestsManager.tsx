import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

export const ContactRequestsManager = () => {
  const queryClient = useQueryClient();

  const { data: requests } = useQuery({
    queryKey: ["admin-contact-requests"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("contact_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-requests"] });
      toast.success("Status updated successfully");
    },
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "in_progress":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contact Requests</h2>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {format(new Date(request.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.phone || "N/A"}</TableCell>
                  <TableCell className="max-w-md truncate">{request.message}</TableCell>
                  <TableCell>
                    <Select
                      value={request.status}
                      onValueChange={(value) =>
                        updateStatusMutation.mutate({ id: request.id, status: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
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
