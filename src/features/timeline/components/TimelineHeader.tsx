export default function TimelineHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold mb-1">Timeline</h1>
        <p className="text-muted-foreground">
          Detailed, visual representation of your running journey, highlighting races, training phases, weekly volume and elevation targets.
        </p>
      </div>
    </div>
  );
}
