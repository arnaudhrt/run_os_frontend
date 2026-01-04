import { useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import { Calendar } from "@/lib/ui/calendar";
import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  weekOffset: number;
  onWeekChange: (offset: number) => void;
  className?: string;
}

function getWeekDates(offset: number): { start: Date; end: Date } {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset + offset * 7);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return { start: weekStart, end: weekEnd };
}

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

function formatDateRange(start: Date, end: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", options);

  if (start.getMonth() === end.getMonth()) {
    return `${startStr} – ${end.getDate()}`;
  }

  const endStr = end.toLocaleDateString("en-US", options);
  return `${startStr} – ${endStr}`;
}

function getWeekLabel(offset: number): string {
  if (offset === 0) return "This week";
  if (offset === 1) return "Next week";
  if (offset === -1) return "Last week";
  if (offset > 1) return `${offset} weeks ahead`;
  return `${Math.abs(offset)} weeks ago`;
}

export function WeekSelector({ weekOffset, onWeekChange, className }: WeekSelectorProps) {
  const { start, end } = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const weekNumber = useMemo(() => getWeekNumber(start), [start]);
  const dateRange = useMemo(() => formatDateRange(start, end), [start, end]);
  const weekLabel = useMemo(() => getWeekLabel(weekOffset), [weekOffset]);

  const handlePrevWeek = () => onWeekChange(weekOffset - 1);
  const handleNextWeek = () => onWeekChange(weekOffset + 1);
  const handleToday = () => onWeekChange(0);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() + mondayOffset);
    currentWeekStart.setHours(0, 0, 0, 0);

    const selectedDayOfWeek = date.getDay();
    const selectedMondayOffset = selectedDayOfWeek === 0 ? -6 : 1 - selectedDayOfWeek;
    const selectedWeekStart = new Date(date);
    selectedWeekStart.setDate(date.getDate() + selectedMondayOffset);
    selectedWeekStart.setHours(0, 0, 0, 0);

    const diffTime = selectedWeekStart.getTime() - currentWeekStart.getTime();
    const diffWeeks = Math.round(diffTime / (7 * 24 * 60 * 60 * 1000));

    onWeekChange(diffWeeks);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button variant="ghost" size="icon" className="size-8" onClick={handlePrevWeek} aria-label="Previous week">
        <ChevronLeft className="size-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className={cn("py-2 h-auto min-w-52 justify-center gap-2 font-normal", weekOffset !== 0 && "text-foreground")}>
            <CalendarDays className="size-4  text-muted-foreground" />
            <div className="flex flex-col items-start leading-tight">
              <span className="font-medium">{dateRange}</span>
              <span className="text-xs text-muted-foreground">
                Week {weekNumber} · {weekLabel}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar mode="single" selected={start} onSelect={handleDateSelect} defaultMonth={start} showWeekNumber weekStartsOn={1} />
          {weekOffset !== 0 && (
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full" onClick={handleToday}>
                Go to current week
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="icon" className="size-8" onClick={handleNextWeek} aria-label="Next week">
        <ChevronRight className="size-4" />
      </Button>

      {weekOffset !== 0 && (
        <Button variant="outline" size="sm" className="ml-1" onClick={handleToday}>
          Today
        </Button>
      )}
    </div>
  );
}
