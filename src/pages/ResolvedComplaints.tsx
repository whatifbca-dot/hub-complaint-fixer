import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Complaint } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Building2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function ResolvedComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchResolvedComplaints();
  }, []);

  const fetchResolvedComplaints = async () => {
    try {
      // Fetch all resolved complaints (public access via RLS policy)
      const { data: complaintsData, error } = await supabase
        .from("complaints")
        .select(`
          *,
          profiles (
            full_name,
            roll_number
          )
        `)
        .eq("status", "Resolved")
        .order("resolved_at", { ascending: false });

      if (error) throw error;
      setComplaints(complaintsData as any || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Brototype</h1>
              <p className="text-sm text-muted-foreground">Resolved Complaints</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/student-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Resolved Complaints</h2>
          <p className="text-muted-foreground">
            View all complaints that have been successfully resolved for transparency
          </p>
        </div>

        {complaints.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No resolved complaints yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="border-success/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                      </div>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {complaint.complaint_id}
                          </span>
                          <span>•</span>
                          <span>Resolved on {format(new Date(complaint.resolved_at!), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="text-sm">
                          <strong>By:</strong> {complaint.profiles?.full_name} ({complaint.profiles?.roll_number})
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge status={complaint.status} />
                      <PriorityBadge priority={complaint.priority} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <p className="text-sm font-medium text-foreground">{complaint.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Issue</p>
                      <p className="text-sm text-foreground">{complaint.description}</p>
                    </div>
                    {complaint.admin_reply && (
                      <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                        <p className="text-sm font-medium text-success mb-1">Resolution</p>
                        <p className="text-sm text-foreground">{complaint.admin_reply}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
