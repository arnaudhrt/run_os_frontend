import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { Flag, Trophy, Medal, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import type { RaceModel } from "../models/race.model";
import type { PhaseModel } from "../models/phase.model";
import type { PhaseType } from "@/lib/types/type";
import { ButtonGroup } from "@/lib/ui/button-group";
import { Button } from "@/lib/ui/button";
import { NativeSelect, NativeSelectOption } from "@/lib/ui/native-select";

interface TimelineCanvasProps {
  races: RaceModel[];
  phases: PhaseModel[];
}

type ZoomMode = "3m" | "6m" | "9m";

interface WeekData {
  date: Date;
  weekNum: number;
  month: string;
  year: number;
  isFirstOfMonth: boolean;
}

const HEADER_HEIGHT = 64;
const RACE_TRACK_HEIGHT = 80;
const PHASE_TRACK_HEIGHT = 100;
const TOTAL_WEEKS = 104; // 2 years
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const ZOOM_CONFIG: Record<ZoomMode, { visibleWeeks: number; label: string }> = {
  "3m": { visibleWeeks: 13, label: "3 Months" },
  "6m": { visibleWeeks: 26, label: "6 Months" },
  "9m": { visibleWeeks: 39, label: "9 Months" },
};

const ZOOM_MODES: ZoomMode[] = ["3m", "6m", "9m"];

const phaseColors: Record<PhaseType, { bg: string; border: string; text: string }> = {
  base: { bg: "bg-blue-100", border: "border-l-blue-500", text: "text-blue-700" },
  build: { bg: "bg-amber-100", border: "border-l-amber-500", text: "text-amber-700" },
  peak: { bg: "bg-red-100", border: "border-l-red-500", text: "text-red-700" },
  taper: { bg: "bg-purple-100", border: "border-l-purple-500", text: "text-purple-700" },
  recovery: { bg: "bg-green-100", border: "border-l-green-500", text: "text-green-700" },
  off: { bg: "bg-zinc-100", border: "border-l-zinc-400", text: "text-zinc-600" },
};

const priorityIcons: Record<1 | 2 | 3, typeof Trophy> = {
  1: Trophy,
  2: Medal,
  3: Flag,
};

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function generateYearOptions(currentYear: number): number[] {
  const years: number[] = [];
  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    years.push(y);
  }
  return years;
}

export default function TimelineCanvas({ races, phases }: TimelineCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const yearOptions = useMemo(() => generateYearOptions(currentYear), [currentYear]);

  const [zoomMode, setZoomMode] = useState<ZoomMode>("6m");
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Calculate week width based on zoom mode and container width
  const weekWidth = useMemo(() => {
    if (containerWidth === 0) return 140;
    const visibleWeeks = ZOOM_CONFIG[zoomMode].visibleWeeks;
    return Math.floor(containerWidth / visibleWeeks);
  }, [containerWidth, zoomMode]);

  // Generate weeks data and calculate positions
  // For selected year 2025: shows Jul 2024 → full 2025 → Jun 2026
  const { weeks, todayOffset, timelineStart } = useMemo(() => {
    // Start from July 1st of the previous year (6 months before selected year)
    const start = getWeekStart(new Date(selectedYear - 1, 6, 1)); // July 1st of previous year
    const weeksArray: WeekData[] = [];

    let prevMonthYear = "";
    for (let i = 0; i < TOTAL_WEEKS; i++) {
      const weekDate = addWeeks(start, i);
      const month = getMonthName(weekDate);
      const year = weekDate.getFullYear();
      const monthYear = `${month}-${year}`;
      weeksArray.push({
        date: weekDate,
        weekNum: getISOWeek(weekDate),
        month,
        year,
        isFirstOfMonth: monthYear !== prevMonthYear,
      });
      prevMonthYear = monthYear;
    }

    const todayPos = ((today.getTime() - start.getTime()) / MS_PER_WEEK) * weekWidth;

    return { weeks: weeksArray, todayOffset: todayPos, timelineStart: start };
  }, [selectedYear, weekWidth, today]);

  // Scroll to today on mount and when zoom/year changes
  useEffect(() => {
    if (scrollRef.current && containerWidth > 0) {
      const scrollPos = todayOffset - containerWidth / 2;
      scrollRef.current.scrollLeft = Math.max(0, scrollPos);
    }
  }, [todayOffset, containerWidth, zoomMode, selectedYear]);

  const getPositionForDate = useCallback(
    (dateStr: string): number => {
      const date = new Date(dateStr);
      return ((date.getTime() - timelineStart.getTime()) / MS_PER_WEEK) * weekWidth;
    },
    [timelineStart, weekWidth]
  );

  const getWidthForDateRange = useCallback(
    (startStr: string, endStr: string): number => {
      const start = new Date(startStr);
      const end = new Date(endStr);
      return ((end.getTime() - start.getTime()) / MS_PER_WEEK) * weekWidth;
    },
    [weekWidth]
  );

  const totalWidth = TOTAL_WEEKS * weekWidth;

  const handlePrevYear = () => setSelectedYear((y) => y - 1);
  const handleNextYear = () => setSelectedYear((y) => y + 1);
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Zoom Tabs */}
        <ButtonGroup>
          {ZOOM_MODES.map((mode) => (
            <Button key={mode} variant="outline" size="sm" className={`${zoomMode === mode && "bg-muted"}`} onClick={() => setZoomMode(mode)}>
              {ZOOM_CONFIG[mode].label}
            </Button>
          ))}
        </ButtonGroup>

        {/* Year Selector */}
        <div className="flex items-center">
          <Button onClick={handlePrevYear} variant="ghost" size="sm" disabled={selectedYear <= currentYear - 2}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <NativeSelect value={selectedYear} onChange={handleYearChange} size="sm">
            {yearOptions.map((year) => (
              <NativeSelectOption key={year} value={year}>
                {year}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Button onClick={handleNextYear} variant="ghost" size="sm" disabled={selectedYear >= currentYear + 2}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div ref={scrollRef} className="overflow-x-auto scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300">
          <div className="relative" style={{ width: totalWidth, minWidth: "100%" }}>
            {/* Header Track - Ruler */}
            <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur-sm" style={{ height: HEADER_HEIGHT }}>
              <div className="relative flex h-full">
                {weeks.map((week, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col justify-end border-zinc-200/50 px-2 pb-1 ${week.isFirstOfMonth && "border-l"}`}
                    style={{ width: weekWidth, minWidth: weekWidth }}
                  >
                    {!week.isFirstOfMonth && <div className="absolute bottom-0 left-0 h-1/2 w-px  bg-zinc-200/50"></div>}
                    {week.isFirstOfMonth && (
                      <div className="absolute left-2 top-1 flex items-center whitespace-nowrap gap-1.5">
                        <span className="text-xs font-semibold text-zinc-900">
                          {week.month}, {week.year}
                        </span>
                      </div>
                    )}
                    <span className="text-[10px] text-zinc-400">W{week.weekNum}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Race Track */}
            <div className="relative border-b border-zinc-200" style={{ height: RACE_TRACK_HEIGHT }}>
              {/* Week grid lines */}
              <div className="absolute inset-0 flex">
                {weeks.map((_, index) => (
                  <div key={index} className="border-l border-zinc-100" style={{ width: weekWidth, minWidth: weekWidth }} />
                ))}
              </div>

              {/* Race Pins */}
              {races.map((race) => {
                const position = getPositionForDate(race.race_date);
                if (position < 0 || position > totalWidth) return null;

                const Icon = priorityIcons[race.priority];
                const isPast = new Date(race.race_date) < today;

                return (
                  <>
                    <div
                      className={cn(
                        "absolute top-[43px] bottom-0 w-0.5 bg-slate-700",
                        race.priority === 1 && "bg-amber-500",
                        race.priority === 2 && "bg-slate-600",
                        race.priority === 3 && "bg-slate-300",
                        isPast && "opacity-50"
                      )}
                      style={{ left: position }}
                    ></div>
                    <div
                      className={cn(
                        "absolute top-0 -translate-x-1/2 flex flex-col items-center gap-0.5 transition-transform hover:scale-110",
                        isPast && "opacity-50"
                      )}
                      style={{ left: position + 1 }}
                    >
                      <span className="max-w-20 truncate text-[10px] font-medium text-zinc-600">{race.name}</span>
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full border-2",
                          race.priority === 1 && "border-amber-500 bg-amber-100 text-amber-600",
                          race.priority === 2 && "border-slate-600 bg-slate-100 text-slate-600",
                          race.priority === 3 && "border-slate-300 bg-slate-50 text-slate-500"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </>
                );
              })}
            </div>

            {/* Phase Track */}
            <div className="relative" style={{ height: PHASE_TRACK_HEIGHT }}>
              {/* Week grid lines */}
              <div className="absolute inset-0 flex">
                {weeks.map((_, index) => (
                  <div key={index} className="border-r border-zinc-100" style={{ width: weekWidth, minWidth: weekWidth }} />
                ))}
              </div>

              {/* Phase Blocks */}
              {phases.map((phase) => {
                const position = getPositionForDate(phase.start_date);
                const width = getWidthForDateRange(phase.start_date, phase.end_date);

                if (position + width < 0 || position > totalWidth) return null;

                const colors = phaseColors[phase.phase_type];
                const isPast = new Date(phase.end_date) < today;

                return (
                  <Tooltip key={phase.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "absolute top-2 bottom-2 rounded-r-md border-l-4 transition-all hover:brightness-95",
                          colors.bg,
                          colors.border,
                          isPast && "opacity-50"
                        )}
                        style={{
                          left: Math.max(0, position),
                          width: Math.max(40, width),
                        }}
                      >
                        <div className="flex h-full items-center px-2">
                          <span className={cn("text-xs font-medium capitalize truncate", colors.text)}>{phase.phase_type}</span>
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div className="space-y-1">
                        <p className="font-semibold capitalize">{phase.phase_type} Phase</p>
                        <p className="text-zinc-400">
                          {formatDate(phase.start_date)} - {formatDate(phase.end_date)}
                        </p>
                        {phase.description && <p className="max-w-[200px] text-zinc-500">{phase.description}</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Today Line */}
            <div className="absolute top-0 bottom-0 z-30 w-0.5 bg-orange-500" style={{ left: todayOffset }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                TODAY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
