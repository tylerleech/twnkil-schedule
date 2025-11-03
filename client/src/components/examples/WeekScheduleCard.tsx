import WeekScheduleCard from '../WeekScheduleCard';
import { startOfWeek } from 'date-fns';

export default function WeekScheduleCardExample() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  return (
    <WeekScheduleCard
      weekStartDate={currentWeekStart}
      auditEmployee1="tyler"
      auditEmployee2="claudia"
      auditDay={3}
      balanceCheckEmployee="ana"
      onEdit={() => console.log('Edit clicked')}
      onGenerateNext={() => console.log('Generate next week clicked')}
      isCurrentWeek={true}
    />
  );
}
