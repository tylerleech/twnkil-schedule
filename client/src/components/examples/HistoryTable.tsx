import HistoryTable from '../HistoryTable';
import { startOfWeek, subWeeks } from 'date-fns';

export default function HistoryTableExample() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  // todo: remove mock functionality - ensure varying days for consecutive weeks
  const mockRecords = [
    {
      id: "1",
      weekStartDate: currentWeekStart,
      auditEmployee1: "tyler",
      auditEmployee2: "claudia",
      auditDay: 3, // Wed
      balanceCheckEmployee: "ana",
    },
    {
      id: "2",
      weekStartDate: subWeeks(currentWeekStart, 1),
      auditEmployee1: "nalleli",
      auditEmployee2: "ana",
      auditDay: 1, // Mon - different from week 1
      balanceCheckEmployee: "tyler",
    },
    {
      id: "3",
      weekStartDate: subWeeks(currentWeekStart, 2),
      auditEmployee1: "claudia",
      auditEmployee2: "nalleli",
      auditDay: 5, // Fri - different from week 2
      balanceCheckEmployee: "claudia",
      notes: "Employee requested day change",
    },
    {
      id: "4",
      weekStartDate: subWeeks(currentWeekStart, 3),
      auditEmployee1: "tyler",
      auditEmployee2: "ana",
      auditDay: 2, // Tue - different from week 3
      balanceCheckEmployee: "tyler",
    },
    {
      id: "5",
      weekStartDate: subWeeks(currentWeekStart, 4),
      auditEmployee1: "nalleli",
      auditEmployee2: "claudia",
      auditDay: 4, // Thu - different from week 4
      balanceCheckEmployee: "ana",
    },
  ];

  return <HistoryTable records={mockRecords} />;
}
