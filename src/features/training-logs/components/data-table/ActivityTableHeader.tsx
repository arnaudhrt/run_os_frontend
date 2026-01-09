import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import { TableHead, TableHeader, TableRow } from "@/lib/ui/table";

export default function TableHeaderBloc() {
  return (
    <TableHeader>
      <TableRow className="bg-muted/50 uppercase text-[10px] font-bold tracking-widest">
        <TableHead className="font-bold text-[10px] tracking-widest uppercase">Date</TableHead>
        <TableHead className="font-bold text-[10px] tracking-widest uppercase">Activity</TableHead>
        <TableHead className="font-bold text-[10px] tracking-widest uppercase">Type</TableHead>
        <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">Distance</TableHead>
        <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">Time</TableHead>
        <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">
          <Tooltip>
            <TooltipTrigger>
              <span className="font-bold text-[10px] tracking-widest uppercase">Pace</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>min/km</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">Avg/Max HR</TableHead>
        <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">Elev</TableHead>
        <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase min-w-20">RPE</TableHead>
        <TableHead className="text-center font-bold text-[10px] tracking-widest uppercase">Notes</TableHead>
      </TableRow>
    </TableHeader>
  );
}
