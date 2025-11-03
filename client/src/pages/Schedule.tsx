import WeekScheduleCard from "@/components/WeekScheduleCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { startOfWeek, addWeeks, subWeeks, format } from "date-fns";
import { useState } from "react";

export default function Schedule() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [selectedWeek, setSelectedWeek] = useState(currentWeekStart);

  // todo: remove mock functionality
  const mockSchedule = {
    weekStartDate: selectedWeek,
    auditEmployee1: "tyler",
    auditEmployee2: "claudia",
    auditDay: 3,
    balanceCheckEmployee: "ana",
  };

  const handlePrevWeek = () => {
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(addWeeks(selectedWeek, 1));
  };

  const handleToday = () => {
    setSelectedWeek(currentWeekStart);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Schedule</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and navigate through weekly task schedules
        </p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevWeek}
            data-testid="button-prev-week"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            data-testid="button-next-week"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" data-testid="text-selected-week">
            Week of {format(selectedWeek, "MMMM d, yyyy")}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleToday}
            data-testid="button-today"
          >
            Today
          </Button>
        </div>
      </div>

      {/* Schedule Card */}
      <WeekScheduleCard
        weekStartDate={mockSchedule.weekStartDate}
        auditEmployee1={mockSchedule.auditEmployee1}
        auditEmployee2={mockSchedule.auditEmployee2}
        auditDay={mockSchedule.auditDay}
        balanceCheckEmployee={mockSchedule.balanceCheckEmployee}
      />
    </div>
  );
}
