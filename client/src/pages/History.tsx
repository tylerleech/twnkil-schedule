import { useQuery } from "@tanstack/react-query";
import { type Assignment } from "@shared/schema";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import HistoryTable from "@/components/HistoryTable";

export default function History() {
  // Fetch all assignments
  const { data: assignments, isLoading } = useQuery<Assignment[]>({
    queryKey: ["/api/assignments"],
  });

  // Transform assignments to the format expected by HistoryTable
  const records = assignments?.map((assignment) => ({
    id: assignment.id,
    weekStartDate: new Date(assignment.weekStartDate),
    auditEmployee1: assignment.auditEmployee1,
    auditEmployee2: assignment.auditEmployee2,
    auditDay: assignment.auditDay,
    balanceCheckEmployee: assignment.balanceCheckEmployee,
    notes: assignment.notes || undefined,
  })) || [];

  const handleExport = () => {
    console.log("Export clicked");
    // TODO: Implement CSV/PDF export
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View past task assignments and track schedule changes
          </p>
        </div>
        <Button onClick={handleExport} data-testid="button-export">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" data-testid="loader-history" />
        </div>
      ) : (
        <HistoryTable records={records} />
      )}
    </div>
  );
}
