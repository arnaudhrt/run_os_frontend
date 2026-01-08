import { TableCell, TableRow } from "@/lib/ui/table";
import { ActivityBadge } from "./ActivityBadge";
import { format } from "date-fns";

export default function RestDayTableRow({ index, date }: { index: number; date: string }) {
  return (
    <TableRow key={index} className="font-mono text-sm bg-gray-50 hover:bg-gray-50">
      <TableCell className="font-medium font-sans whitespace-nowrap">{format(new Date(date), "EEE do")}</TableCell>
      <TableCell>
        <ActivityBadge type="rest_day" />
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
