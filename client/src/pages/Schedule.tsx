import WeekScheduleCard from "@/components/WeekScheduleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { startOfWeek, addWeeks, subWeeks, format } from "date-fns";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Assignment } from "@shared/schema";

export default function Schedule() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [selectedWeek, setSelectedWeek] = useState(currentWeekStart);

  // Fetch assignment for selected week
  const { data: assignment, isLoading } = useQuery<Assignment>({
    queryKey: ["/api/assignments/week", selectedWeek.toISOString()],
  });

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
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" data-testid="loader-schedule" />
        </div>
      ) : assignment ? (
        <WeekScheduleCard
          weekStartDate={new Date(assignment.weekStartDate)}
          auditEmployee1={assignment.auditEmployee1}
          auditEmployee2={assignment.auditEmployee2}
          auditDay={assignment.auditDay}
          balanceCheckEmployee={assignment.balanceCheckEmployee}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-assignment">
              No assignment found for this week
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
