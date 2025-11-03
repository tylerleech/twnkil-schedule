import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAuditPair: [string, string];
  currentAuditDay: number;
  currentBalanceEmployee: string;
  onSave: (data: {
    auditEmployee1: string;
    auditEmployee2: string;
    auditDay: number;
    balanceCheckEmployee: string;
    notes?: string;
  }) => void;
}

const employees = ["tyler", "nalleli", "claudia", "ana"];
const balanceEmployees = ["tyler", "claudia", "ana"]; // excluding nalleli
const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function EditAssignmentModal({
  open,
  onOpenChange,
  currentAuditPair,
  currentAuditDay,
  currentBalanceEmployee,
  onSave,
}: EditAssignmentModalProps) {
  const [selectedAudit, setSelectedAudit] = useState<string[]>(currentAuditPair);
  const [selectedDay, setSelectedDay] = useState(currentAuditDay);
  const [selectedBalance, setSelectedBalance] = useState(currentBalanceEmployee);
  const [notes, setNotes] = useState("");

  const handleAuditToggle = (employee: string) => {
    if (selectedAudit.includes(employee)) {
      setSelectedAudit(selectedAudit.filter((e) => e !== employee));
    } else if (selectedAudit.length < 2) {
      setSelectedAudit([...selectedAudit, employee]);
    }
  };

  const handleSave = () => {
    if (selectedAudit.length === 2) {
      onSave({
        auditEmployee1: selectedAudit[0],
        auditEmployee2: selectedAudit[1],
        auditDay: selectedDay,
        balanceCheckEmployee: selectedBalance,
        notes: notes || undefined,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-edit-assignment">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Modify the task assignments for this week. Changes are useful when employees are absent or unavailable.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Foreign Currency Audit Pair */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Foreign Currency Audit Pair (Select 2)</Label>
            <div className="grid grid-cols-2 gap-3">
              {employees.map((employee) => (
                <button
                  key={employee}
                  onClick={() => handleAuditToggle(employee)}
                  className={`p-4 rounded-md border-2 text-left transition-colors hover-elevate active-elevate-2 ${
                    selectedAudit.includes(employee)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  data-testid={`button-select-audit-${employee}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {employee.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium capitalize">{employee}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedAudit.length}/2 selected
            </p>
          </div>

          {/* Audit Day */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Audit Day</Label>
            <div className="flex flex-wrap gap-2">
              {dayNames.map((day, index) => (
                <Button
                  key={day}
                  variant={selectedDay === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(index + 1)}
                  data-testid={`button-day-${index + 1}`}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Branch Balance Check */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Branch Balance Check Employee</Label>
            <div className="grid grid-cols-3 gap-3">
              {balanceEmployees.map((employee) => (
                <button
                  key={employee}
                  onClick={() => setSelectedBalance(employee)}
                  className={`p-3 rounded-md border-2 text-center transition-colors hover-elevate active-elevate-2 ${
                    selectedBalance === employee
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  data-testid={`button-select-balance-${employee}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {employee.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium capitalize">{employee}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-medium">
              Reason for Change (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="e.g., Employee on vacation, sick leave, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
              data-testid="input-notes"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedAudit.length !== 2}
            data-testid="button-save"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
