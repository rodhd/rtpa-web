import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function CourtAvailability() {
  const today = new Date();
  const days = Array.from({ length: 3 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const timeSlots: string[] = [];
  for (let hour = 8; hour < 22; hour++) {
    timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
    timeSlots.push(`${String(hour).padStart(2, '0')}:30`);
  }
  
  // Dummy reserved slots for visualization
  const reservedSlots: Record<string, string[]> = {
      [days[0].toISOString().split('T')[0]]: ['09:00', '09:30', '10:00', '14:00', '14:30'],
      [days[1].toISOString().split('T')[0]]: ['11:00', '11:30', '16:00', '16:30', '17:00'],
      [days[2].toISOString().split('T')[0]]: ['08:00', '08:30', '12:00', '12:30', '20:00', '20:30', '21:00', '21:30'],
  }

  const now = new Date();

  return (
    <TooltipProvider>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {days.map(day => {
            const dateString = day.toISOString().split('T')[0];
            const dailyReservedSlots = reservedSlots[dateString] || [];
            return (
              <div key={day.toISOString()}>
                <p className="text-sm font-medium mb-2">
                  {day.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <div className="flex w-full h-4 rounded-md overflow-hidden border">
                  {timeSlots.map(slot => {
                    const [hour, minute] = slot.split(":").map(Number);
                    const slotDateTime = new Date(day);
                    slotDateTime.setHours(hour, minute, 0, 0);

                    const isReserved = dailyReservedSlots.includes(slot);
                    const isInThePast = slotDateTime < now;

                    return (
                      <Tooltip key={slot}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-full h-full ${
                              isInThePast
                                ? "bg-gray-400"
                                : isReserved
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{slot}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
} 