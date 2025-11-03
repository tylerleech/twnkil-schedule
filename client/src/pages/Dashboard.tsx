import { useState } from "react";
import WeekScheduleCard from "@/components/WeekScheduleCard";
import EditAssignmentModal from "@/components/EditAssignmentModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfWeek, addWeeks, format } from "date-fns";
import { Clock, TrendingUp, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Assignment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const nextWeekStart = addWeeks(currentWeekStart, 1);
  const { toast } = useToast();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Fetch current week assignment
  const { data: currentWeek, isLoading: currentLoading } = useQuery<Assignment>({
    queryKey: ["/api/assignments/week", currentWeekStart.toISOString()],
  });

  // Fetch next week assignment
  const { data: nextWeek, isLoading: nextLoading } = useQuery<Assignment>({
    queryKey: ["/api/assignments/week", nextWeekStart.toISOString()],
  });

  // Generate next week mutation
  const generateNextMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/assignments/generate-next");
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate all assignment queries
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"], exact: false });
      toast({
        title: "Success",
        description: "Next week's schedule has been generated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate next week's schedule",
        variant: "destructive",
      });
    },
  });

  // Update assignment mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/assignments/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate all assignment queries including week-specific ones
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"], exact: false });
      toast({
        title: "Success",
        description: "Assignment has been updated",
      });
      setEditModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update assignment",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setEditModalOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingAssignment) {
      updateMutation.mutate({ id: editingAssignment.id, data });
    }
  };

  const handleGenerateNext = () => {
    generateNextMutation.mutate();
  };

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const isLoading = currentLoading || nextLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" data-testid="loader-dashboard" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage weekly task assignments and view upcoming schedules
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="text-current-week-date">
              {format(currentWeekStart, "MMM d, yyyy")}
            </div>
            {currentWeek && (
              <p className="text-xs text-muted-foreground mt-1">
                Audit scheduled for {dayNames[currentWeek.auditDay - 1]}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="text-upcoming-count">
              {nextWeek ? 2 : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {nextWeek ? "Tasks scheduled for next week" : "No tasks scheduled yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Week Schedule */}
      {currentWeek ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Current Week</h2>
          </div>
          <WeekScheduleCard
            weekStartDate={new Date(currentWeek.weekStartDate)}
            auditEmployee1={currentWeek.auditEmployee1}
            auditEmployee2={currentWeek.auditEmployee2}
            auditDay={currentWeek.auditDay}
            balanceCheckEmployee={currentWeek.balanceCheckEmployee}
            onEdit={() => handleEdit(currentWeek)}
            onGenerateNext={handleGenerateNext}
            isCurrentWeek={true}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No assignment for current week</p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Week Preview */}
      {nextWeek ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Next Week</h2>
          </div>
          <WeekScheduleCard
            weekStartDate={new Date(nextWeek.weekStartDate)}
            auditEmployee1={nextWeek.auditEmployee1}
            auditEmployee2={nextWeek.auditEmployee2}
            auditDay={nextWeek.auditDay}
            balanceCheckEmployee={nextWeek.balanceCheckEmployee}
            onEdit={() => handleEdit(nextWeek)}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No assignment for next week</p>
          </CardContent>
        </Card>
      )}

      {editingAssignment && (
        <EditAssignmentModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          currentAuditPair={[editingAssignment.auditEmployee1, editingAssignment.auditEmployee2]}
          currentAuditDay={editingAssignment.auditDay}
          currentBalanceEmployee={editingAssignment.balanceCheckEmployee}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
