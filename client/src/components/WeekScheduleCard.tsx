import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, User, Edit } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";

interface WeekScheduleCardProps {
  weekStartDate: Date;
  auditEmployee1: string;
  auditEmployee2: string;
  auditDay: number; // 1-5 for Mon-Fri
  balanceCheckEmployee: string;
  onEdit?: () => void;
  onGenerateNext?: () => void;
  isCurrentWeek?: boolean;
}

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function WeekScheduleCard({
  weekStartDate,
  auditEmployee1,
  auditEmployee2,
  auditDay,
  balanceCheckEmployee,
  onEdit,
  onGenerateNext,
  isCurrentWeek = false,
}: WeekScheduleCardProps) {
  const weekEnd = addDays(weekStartDate, 6);
  const auditDate = addDays(weekStartDate, auditDay - 1);

  return (
    <Card className="w-full" data-testid="card-week-schedule">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {format(weekStartDate, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </CardTitle>
          {isCurrentWeek && (
            <Badge variant="secondary" className="mt-2" data-testid="badge-current-week">
              Current Week
            </Badge>
          )}
        </div>
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            data-testid="button-edit-schedule"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Foreign Currency Audit */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Foreign Currency Audit
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium"
                data-testid={`avatar-${auditEmployee1}`}
              >
                {auditEmployee1.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium capitalize" data-testid={`text-employee-${auditEmployee1}`}>
                {auditEmployee1}
              </span>
            </div>
            <span className="text-muted-foreground">&</span>
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium"
                data-testid={`avatar-${auditEmployee2}`}
              >
                {auditEmployee2.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium capitalize" data-testid={`text-employee-${auditEmployee2}`}>
                {auditEmployee2}
              </span>
            </div>
          </div>
          <div>
            <Badge className="rounded-full px-3 py-1" data-testid="badge-audit-day">
              {dayNames[auditDay - 1]}, {format(auditDate, "MMM d")}
            </Badge>
          </div>
        </div>

        {/* Branch Balance Check */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Branch Balance Check
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium"
              data-testid={`avatar-balance-${balanceCheckEmployee}`}
            >
              {balanceCheckEmployee.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium capitalize" data-testid={`text-balance-employee-${balanceCheckEmployee}`}>
              {balanceCheckEmployee}
            </span>
          </div>
        </div>

        {onGenerateNext && isCurrentWeek && (
          <div className="pt-4">
            <Button
              onClick={onGenerateNext}
              className="w-full"
              data-testid="button-generate-next"
            >
              Generate Next Week
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
