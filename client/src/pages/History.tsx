import HistoryTable from "@/components/HistoryTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { startOfWeek, subWeeks } from "date-fns";

export default function History() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  // todo: remove mock functionality
  const mockRecords = Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 1}`,
    weekStartDate: subWeeks(currentWeekStart, i),
    auditEmployee1: ["tyler", "nalleli", "claudia", "ana"][i % 4],
    auditEmployee2: ["claudia", "ana", "tyler", "nalleli"][(i + 1) % 4],
    auditDay: (i % 5) + 1,
    balanceCheckEmployee: ["tyler", "claudia", "ana"][i % 3],
    notes: i % 5 === 0 ? "Manual override due to employee absence" : undefined,
  }));

  const handleExport = () => {
    console.log("Export clicked");
    // todo: remove mock functionality - this would export to CSV/PDF
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

      <HistoryTable records={mockRecords} />
    </div>
  );
}
