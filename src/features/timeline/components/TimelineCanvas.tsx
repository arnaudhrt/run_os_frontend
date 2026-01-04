import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { Flag, Trophy, Medal, ChevronLeft, ChevronRight, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RaceModel } from "../models/race.model";
import type { TrainingCycleModel, WeeklyStats } from "../models/training-cycle.model";
import { ButtonGroup } from "@/lib/ui/button-group";
import { Button } from "@/lib/ui/button";
import { NativeSelect, NativeSelectOption } from "@/lib/ui/native-select";
import { RaceDetailsDialog } from "./RaceDetailsDialog";
import { VolumeChart } from "./VolumeChart";
import { CreateRaceDialog } from "./CreateRaceDialog";
import { CreateTrainingCycleDialog } from "./CreateTrainingCycleDialog";
import type { CreateRaceParams, RaceLoadingState, UpdateRaceParams } from "../controllers/race.controller";
import type { CreateTrainingCycleParams, TrainingCycleLoadingState } from "../controllers/training-cycle.controller";
import { computePhasesFromCycles, generateYearOptions, getISOWeek, getMonthName, getWeekStart } from "../utils/timeline.utils";
import {
  CHART_TRACK_HEIGHT,
  HEADER_HEIGHT,
  MS_PER_WEEK,
  PHASE_TRACK_HEIGHT,
  phaseColors,
  RACE_TRACK_HEIGHT,
  TOTAL_WEEKS,
  ZOOM_CONFIG,
  ZOOM_MODES,
  type ZoomMode,
} from "../utils/timeline.const";
import { addWeeks } from "date-fns";

interface TimelineCanvasProps {
  races: RaceModel[];
  trainingCycles: TrainingCycleModel[];
  raceLoading: RaceLoadingState;
  trainingCycleLoading: TrainingCycleLoadingState;
  onCreateRace: (data: CreateRaceParams) => void;
  onUpdateRace: (data: UpdateRaceParams) => void;
  onCreateTrainingCycle: (data: CreateTrainingCycleParams) => void;
  today: Date;
  currentYear: number;
  weeklyStats: WeeklyStats[];
}

interface WeekData {
  date: Date;
  weekNum: number;
  month: string;
  year: number;
  isFirstOfMonth: boolean;
}

export default function TimelineCanvas({
  races,
  trainingCycles,
  today,
  currentYear,
  onCreateRace,
  onUpdateRace,
  raceLoading,
  trainingCycleLoading,
  onCreateTrainingCycle,
  weeklyStats,
}: TimelineCanvasProps) {
  const [openRaceDetails, setOpenRaceDetails] = useState(false);
  const [openCreateRace, setOpenCreateRace] = useState(false);
  const [openCreateTrainingCycle, setOpenCreateTrainingCycle] = useState(false);
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);
  const [chartSelection, setChartSelection] = useState("volume");

  // Derive selectedRace from races array - always up to date
  const selectedRace = useMemo(() => (selectedRaceId ? races.find((r) => r.id === selectedRaceId) ?? null : null), [races, selectedRaceId]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const yearOptions = useMemo(() => generateYearOptions(currentYear), [currentYear]);

  // Compute phases with dates from training cycles
  const computedPhases = useMemo(() => computePhasesFromCycles(trainingCycles), [trainingCycles]);

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

  const handleChartSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartSelection(e.target.value);
  };

  const priorityIcons: Record<1 | 2 | 3, typeof Trophy> = {
    1: Trophy,
    2: Medal,
    3: Flag,
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Zoom Tabs */}
        <div className="flex gap-3 items-center">
          <ButtonGroup>
            {ZOOM_MODES.map((mode) => (
              <Button key={mode} variant="outline" size="sm" className={`${zoomMode === mode && "bg-muted"}`} onClick={() => setZoomMode(mode)}>
                {ZOOM_CONFIG[mode].label}
              </Button>
            ))}
          </ButtonGroup>

          <NativeSelect value={chartSelection} onChange={handleChartSelection} size="sm" className="rounded-lg">
            <NativeSelectOption className="text-sm" value="volume">
              Volume
            </NativeSelectOption>
            <NativeSelectOption value="time">Time</NativeSelectOption>
            <NativeSelectOption value="elevation">Elevation</NativeSelectOption>
          </NativeSelect>
          <div className="flex items-center -ml-2">
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

        <div className="flex gap-2">
          <Button onClick={() => setOpenCreateRace(true)}>
            <Flag className="size-4" />
            Create Race
          </Button>
          <Button variant="outline" onClick={() => setOpenCreateTrainingCycle(true)}>
            <Target className="size-4" />
            Create Training Cycle
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="absolute top-0 left-0 bottom-0 z-50 bg-white border-r border-zinc-200">
          <div style={{ height: HEADER_HEIGHT, width: "30px" }} className="border-b "></div>
          <div style={{ height: RACE_TRACK_HEIGHT, width: "30px" }} className="border-b flex justify-center items-center">
            <p className="text-xs text-muted-foreground font-medium -rotate-90">Races</p>
          </div>
          <div style={{ height: PHASE_TRACK_HEIGHT, width: "30px" }} className="border-b flex justify-center items-center">
            <p className="text-xs text-muted-foreground font-medium -rotate-90">Training</p>
          </div>
          <div style={{ height: CHART_TRACK_HEIGHT, width: "30px" }} className="border-b flex justify-center items-center">
            <p className="text-xs text-muted-foreground font-medium -rotate-90">Chart</p>
          </div>
        </div>
        <div ref={scrollRef} className="overflow-x-auto scrollable">
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
                        "absolute top-[53px] bottom-0 w-0.5 bg-slate-700",
                        race.priority === 1 && "bg-amber-500",
                        race.priority === 2 && "bg-slate-600",
                        race.priority === 3 && "bg-slate-300",
                        isPast && "opacity-50"
                      )}
                      style={{ left: position }}
                    ></div>
                    <div
                      className={cn("absolute top-0 -translate-x-1/2 flex flex-col items-center gap-0.5 cursor-pointer", isPast && "opacity-50")}
                      style={{ left: position + 1 }}
                      onClick={() => {
                        setSelectedRaceId(race.id);
                        setOpenRaceDetails(true);
                      }}
                    >
                      <span className="max-w-20 truncate text-[10px] font-medium text-zinc-600">{race.name}</span>
                      <div
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-110",
                          race.priority === 1 && "border-amber-500 bg-amber-100 text-amber-600",
                          race.priority === 2 && "border-slate-600 bg-slate-100 text-slate-600",
                          race.priority === 3 && "border-slate-300 bg-slate-50 text-slate-500"
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                    </div>
                  </>
                );
              })}
            </div>

            {/* Phase Track */}
            <div className="relative" style={{ height: PHASE_TRACK_HEIGHT }}>
              {/* Week grid lines */}
              <div className="absolute border-b inset-0 flex">
                {weeks.map((_, index) => (
                  <div key={index} className="border-l border-zinc-100" style={{ width: weekWidth, minWidth: weekWidth }} />
                ))}
              </div>

              {/* Phase Blocks */}
              {computedPhases.map((phase) => {
                const position = getPositionForDate(phase.start_date);
                const width = getWidthForDateRange(phase.start_date, phase.end_date);

                if (position + width < 0 || position > totalWidth) return null;

                const colors = phaseColors[phase.phase_type];
                const isPast = new Date(phase.end_date) < today;

                return (
                  <div
                    className={cn(
                      "absolute top-2 bottom-2 rounded  border-t border-r border-b border-l-4 transition-all",
                      colors.bg,
                      colors.border,
                      isPast && "opacity-50"
                    )}
                    key={phase.id}
                    style={{
                      left: Math.max(0, position),
                      width: Math.max(40, width),
                    }}
                    title={`${phase.phase_type}`}
                  >
                    <div className={cn("h-full gap-0.5 py-2 px-3 flex items-center")}>
                      <span className={cn("font-semibold capitalize truncate text-sm", colors.text)}>{phase.phase_type}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart Track */}
            <div className="relative border-zinc-200" style={{ height: CHART_TRACK_HEIGHT }}>
              {/* Week grid lines */}
              <div className="absolute inset-0 flex">
                {weeks.map((week, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col justify-end border-zinc-200/50 border-l px-2 pb-1`}
                    style={{ width: weekWidth, minWidth: weekWidth }}
                  >
                    <span className="text-[10px] text-zinc-400">W{week.weekNum}</span>
                  </div>
                ))}
              </div>
              {/* Volume Chart */}
              <div className="absolute inset-0 pb-5">
                <VolumeChart width={totalWidth} height={CHART_TRACK_HEIGHT} selection={chartSelection} data={weeklyStats} weekWidth={weekWidth} />
              </div>
            </div>

            {/* Today Line */}
            <div className="absolute top-5 bottom-0 z-30 w-0.5 bg-blue-500" style={{ left: todayOffset }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded bg-blue-500 px-2 py-1 text-[10px] font-bold text-white">TODAY</div>
            </div>
          </div>
        </div>
      </div>
      <RaceDetailsDialog
        open={openRaceDetails}
        onOpenChange={setOpenRaceDetails}
        onUpdateRace={onUpdateRace}
        loading={raceLoading.update}
        race={selectedRace}
      />
      {onCreateRace && (
        <CreateRaceDialog open={openCreateRace} onOpenChange={setOpenCreateRace} onSubmit={onCreateRace} loading={raceLoading.create} />
      )}
      <CreateTrainingCycleDialog
        open={openCreateTrainingCycle}
        onOpenChange={setOpenCreateTrainingCycle}
        onSubmit={onCreateTrainingCycle}
        loading={trainingCycleLoading.create}
        races={races}
      />
    </div>
  );
}
