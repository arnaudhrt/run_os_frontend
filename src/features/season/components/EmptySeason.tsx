import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/lib/ui/empty";
import { ArrowUpRightIcon, Folder } from "lucide-react";
import { Button } from "@/lib/ui/button";
import CreateSeasonDialog from "./CreateSeasonDialog";

export default function EmptySeason() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%]">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-12 rounded-full">
            <Folder className="size-5 " />
          </EmptyMedia>
          <EmptyTitle>No Season Yet</EmptyTitle>
          <EmptyDescription>You haven&apos;t created any season yet. Get started by creating your first season.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <CreateSeasonDialog>
              <Button size="lg">Create Season</Button>
            </CreateSeasonDialog>
          </div>
        </EmptyContent>
        <Button variant="link" asChild className="text-muted-foreground" size="sm">
          <a href="#">
            Learn More <ArrowUpRightIcon />
          </a>
        </Button>
      </Empty>
    </div>
  );
}
