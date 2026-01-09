import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/lib/ui/alert-dialog";
import { Label } from "@/lib/ui/label";
import { Input } from "@/lib/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui/tabs";

interface SyncDatesDialogProps {
  type: string;
  setType: (type: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onSync: (params: { startDate: string; endDate: string }) => void;
}

export default function SyncDatesDialog({ open, type, loading, setType, onSync, onOpenChange }: SyncDatesDialogProps) {
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSync = () => {
    if (type === "date" && singleDate) {
      onSync({ startDate: singleDate, endDate: singleDate });
    } else if (type === "range" && startDate) {
      onSync({ startDate, endDate: endDate || startDate });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSingleDate("");
      setStartDate("");
      setEndDate("");
    }
    onOpenChange(isOpen);
  };

  const isDisabled = type === "date" ? !singleDate : !startDate;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-semibold text-lg">Sync Activities</AlertDialogTitle>
        </AlertDialogHeader>
        <Tabs value={type} onValueChange={setType}>
          <TabsList>
            <TabsTrigger value="date">Date</TabsTrigger>
            <TabsTrigger value="range">Date range</TabsTrigger>
          </TabsList>
          <TabsContent value="date">
            <div className="mt-3">
              <Label>Date</Label>
              <Input type="date" className="w-full mt-2" value={singleDate} onChange={(e) => setSingleDate(e.target.value)} />
            </div>
          </TabsContent>
          <TabsContent value="range">
            <div className="space-y-3 mt-3">
              <div>
                <Label>From</Label>
                <Input type="date" className="w-full mt-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label>To</Label>
                <Input type="date" className="w-full mt-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSync} className="cursor-pointer" disabled={isDisabled}>
            Sync
            {loading && <Loader2 className="animate-spin size-4" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
