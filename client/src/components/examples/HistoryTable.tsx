import HistoryTable from '../HistoryTable';
import { startOfWeek, subWeeks } from 'date-fns';
import { generateSchedules } from '@/utils/scheduleGenerator';

export default function HistoryTableExample() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const startWeek = subWeeks(currentWeekStart, 4); // Start 4 weeks ago
  
  // Generate 5 weeks of random schedules with varying days
  const schedules = generateSchedules(startWeek, 5);
  
  const mockRecords = schedules.reverse().map((schedule, index) => ({
    id: String(index + 1),
    weekStartDate: schedule.weekStartDate,
    auditEmployee1: schedule.auditEmployee1,
    auditEmployee2: schedule.auditEmployee2,
    auditDay: schedule.auditDay,
    balanceCheckEmployee: schedule.balanceCheckEmployee,
    notes: index === 2 ? "Employee requested day change" : undefined,
  }));

  return <HistoryTable records={mockRecords} />;
}
