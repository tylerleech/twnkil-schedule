import { useState } from 'react';
import EditAssignmentModal from '../EditAssignmentModal';
import { Button } from '@/components/ui/button';

export default function EditAssignmentModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)} data-testid="button-open-modal">
        Open Edit Modal
      </Button>
      <EditAssignmentModal
        open={open}
        onOpenChange={setOpen}
        currentAuditPair={["tyler", "claudia"]}
        currentAuditDay={3}
        currentBalanceEmployee="ana"
        onSave={(data) => {
          console.log('Saved:', data);
          setOpen(false);
        }}
      />
    </div>
  );
}
