import WeekScheduleCard from "@/components/WeekScheduleCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { startOfWeek, addWeeks, subWeeks, format, differenceInWeeks } from "date-fns";
import { useState } from "react";

export default function Schedule() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [selectedWeek, setSelectedWeek] = useState(currentWeekStart);

  // todo: remove mock functionality - generate varying schedules
  const getScheduleForWeek = (weekStart: Date) => {
    const weeksDiff = differenceInWeeks(weekStart, currentWeekStart);
    const employees = ["tyler", "nalleli", "claudia", "ana"];
    const balanceEmployees = ["tyler", "claudia", "ana"];
    
    // Rotate pairs and days to ensure variation
    const pairIndex = Math.abs(weeksDiff) % 6;
    const pairs = [
      ["tyler", "claudia"],
      ["nalleli", "ana"],
      ["tyler", "nalleli"],
      ["claudia", "ana"],
      ["tyler", "ana"],
      ["nalleli", "claudia"],
    ];
    
    // Ensure consecutive weeks have different days (1-5 for Mon-Fri)
    const dayIndex = (Math.abs(weeksDiff) % 5) + 1;
    const balanceIndex = Math.abs(weeksDiff) % 3;
    
    return {
      weekStartDate: weekStart,
      auditEmployee1: pairs[pairIndex][0],
      auditEmployee2: pairs[pairIndex][1],
      auditDay: dayIndex,
      balanceCheckEmployee: balanceEmployees[balanceIndex],
    };
  };

  const mockSchedule = getScheduleForWeek(selectedWeek);

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
