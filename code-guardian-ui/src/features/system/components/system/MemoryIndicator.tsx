"use client";

import { Card } from "../ui/card";
import { useMemoryStatus } from "@/features/system/hooks/useMemoryStatus";

export function MemoryIndicator() {
  const { data } = useMemoryStatus();

  if (!data) return null;

  const { rssMB, heapUsedMB, maxOldSpaceMB } = data;

  return (
    <Card className="px-3 py-2">
      <div className="text-xs">
        <div className="font-medium">RSS {rssMB} MB</div>
        <div className="text-muted-foreground">
          Heap {heapUsedMB} MB{" "}
          <span className="ml-2 font-mono text-[11px] text-muted-foreground/80">
            / {maxOldSpaceMB} MB
          </span>
        </div>
      </div>
    </Card>
  );
}
