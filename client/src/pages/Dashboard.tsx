import { useState } from "react";
import WeekScheduleCard from "@/components/WeekScheduleCard";
import EditAssignmentModal from "@/components/EditAssignmentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfWeek, addWeeks, format } from "date-fns";
import { Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const nextWeekStart = addWeeks(currentWeekStart, 1);

  // todo: remove mock functionality
  // Note: Different pairs AND different days for consecutive weeks
  const [currentWeek, setCurrentWeek] = useState({
    weekStartDate: currentWeekStart,
    auditEmployee1: "tyler",
    auditEmployee2: "claudia",
    auditDay: 3, // Wednesday
    balanceCheckEmployee: "ana",
  });

  const [nextWeek, setNextWeek] = useState({
    weekStartDate: nextWeekStart,
    auditEmployee1: "nalleli",
    auditEmployee2: "ana",
    auditDay: 1, // Monday - different day than current week
    balanceCheckEmployee: "tyler",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCurrent, setEditingCurrent] = useState(true);

  const handleEdit = (isCurrent: boolean) => {
    setEditingCurrent(isCurrent);
    setEditModalOpen(true);
  };

  const handleSave = (data: any) => {
    console.log("Saved assignment:", data);
    if (editingCurrent) {
      setCurrentWeek((prev) => ({ ...prev, ...data }));
    } else {
      setNextWeek((prev) => ({ ...prev, ...data }));
    }
  };

  const handleGenerateNext = () => {
    console.log("Generate next week clicked");
    // todo: remove mock functionality - this would call the backend to generate next week
  };

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
            <p className="text-xs text-muted-foreground mt-1">
              Audit scheduled for {dayNames[currentWeek.auditDay - 1]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="text-upcoming-count">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks scheduled for next week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Week Schedule */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Current Week</h2>
        </div>
        <WeekScheduleCard
          weekStartDate={currentWeek.weekStartDate}
          auditEmployee1={currentWeek.auditEmployee1}
          auditEmployee2={currentWeek.auditEmployee2}
          auditDay={currentWeek.auditDay}
          balanceCheckEmployee={currentWeek.balanceCheckEmployee}
          onEdit={() => handleEdit(true)}
          onGenerateNext={handleGenerateNext}
          isCurrentWeek={true}
        />
      </div>

      {/* Upcoming Week Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Next Week</h2>
        </div>
        <WeekScheduleCard
          weekStartDate={nextWeek.weekStartDate}
          auditEmployee1={nextWeek.auditEmployee1}
          auditEmployee2={nextWeek.auditEmployee2}
          auditDay={nextWeek.auditDay}
          balanceCheckEmployee={nextWeek.balanceCheckEmployee}
          onEdit={() => handleEdit(false)}
        />
      </div>

      <EditAssignmentModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        currentAuditPair={
          editingCurrent
            ? [currentWeek.auditEmployee1, currentWeek.auditEmployee2]
            : [nextWeek.auditEmployee1, nextWeek.auditEmployee2]
        }
        currentAuditDay={editingCurrent ? currentWeek.auditDay : nextWeek.auditDay}
        currentBalanceEmployee={
          editingCurrent ? currentWeek.balanceCheckEmployee : nextWeek.balanceCheckEmployee
        }
        onSave={handleSave}
      />
    </div>
  );
}
