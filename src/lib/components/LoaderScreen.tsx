import { Loader2 } from "lucide-react";

export default function LoaderScreen() {
  return (
    <div className="min-h-screen w-full absolute inset-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center gap-2">
          <Loader2 className="size-5 animate-spin" />
          <p className="font-semibold tracking-wider">Loading...</p>
        </div>
      </div>
    </div>
  );
}
