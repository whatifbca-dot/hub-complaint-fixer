import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Complaint, ComplaintStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Building2, LogOut, Filter, Moon, Sun, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { useTheme } from "next-themes";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [adminReply, setAdminReply] = useState("");
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("Pending");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [complaintToDelete, setComplaintToDelete] = useState<Complaint | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(complaints.filter(c => c.status === filterStatus));
    }
  }, [filterStatus, complaints]);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const hasAdminRole = roleData?.some(r => r.role === "admin");
      
      if (!hasAdminRole) {
        navigate("/student-dashboard");
        return;
      }

      // Fetch all complaints with profile data
      const { data: complaintsData, error } = await supabase
        .from("complaints")
        .select(`
          *,
          profiles (
            full_name,
            email,
            roll_number
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComplaints(complaintsData as any || []);
      setFilteredComplaints(complaintsData as any || []);
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

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;

    try {
      const { error } = await supabase
        .from("complaints")
        .update({
          status: newStatus,
          admin_reply: adminReply || null,
        })
        .eq("id", selectedComplaint.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Complaint updated successfully",
      });

      setSelectedComplaint(null);
      setAdminReply("");
      checkAdmin();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const openComplaintDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setAdminReply(complaint.admin_reply || "");
  };

  const handleDeleteComplaint = async () => {
    if (!complaintToDelete) return;

    try {
      const { error } = await supabase
        .from("complaints")
        .delete()
        .eq("id", complaintToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Complaint deleted successfully",
      });

      setComplaintToDelete(null);
      checkAdmin();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Brototype</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">All Complaints</h2>
            <p className="text-muted-foreground">Manage and respond to student complaints</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl">
                {complaints.filter(c => c.status === "Pending").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl">
                {complaints.filter(c => c.status === "In Progress").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resolved</CardDescription>
              <CardTitle className="text-3xl">
                {complaints.filter(c => c.status === "Resolved").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Complaints List */}
        <div className="grid gap-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1 cursor-pointer" onClick={() => openComplaintDialog(complaint)}>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {complaint.complaint_id}
                        </span>
                        <span>•</span>
                        <span>{format(new Date(complaint.created_at), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="text-sm">
                        <strong>Student:</strong> {complaint.profiles?.full_name} ({complaint.profiles?.roll_number})
                      </div>
                      <div className="text-sm">
                        <strong>Email:</strong> {complaint.profiles?.email}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 items-start">
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                    {complaint.status === "Resolved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setComplaintToDelete(complaint);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent onClick={() => openComplaintDialog(complaint)} className="cursor-pointer">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Category: </span>
                    <span className="text-sm text-foreground">{complaint.category}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Description: </span>
                    <span className="text-sm text-foreground">{complaint.description}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Update Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Complaint</DialogTitle>
            <DialogDescription>
              {selectedComplaint?.complaint_id} - {selectedComplaint?.profiles?.full_name}
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {selectedComplaint.title}</div>
                  <div><strong>Category:</strong> {selectedComplaint.category}</div>
                  <div><strong>Description:</strong> {selectedComplaint.description}</div>
                  {selectedComplaint.attachment_url && (
                    <div>
                      <strong>Attachment:</strong>{" "}
                      <a
                        href={selectedComplaint.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View File
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ComplaintStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Reply</label>
                <Textarea
                  placeholder="Enter your response to the student..."
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateComplaint} className="flex-1">
                  Update Complaint
                </Button>
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!complaintToDelete} onOpenChange={() => setComplaintToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resolved Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this complaint? This action cannot be undone.
              {complaintToDelete && (
                <div className="mt-2 text-sm">
                  <strong>Complaint ID:</strong> {complaintToDelete.complaint_id}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComplaint} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
