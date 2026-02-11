"use client";

import { Separator } from "@/features/system/components/ui/separator";
import { ShieldAlert } from "lucide-react";

import { StatusBadge } from "@/features/scan/components/StatusBadge";
import { ScanForm } from "@/features/scan/components/ScanForm";
import { CriticalVulnerabilitiesCards } from "@/features/scan/components/CriticalVulnerabilitiesCards";

import { useScan } from "@/features/scan/hooks/useScan";
import { MemoryIndicator } from "@/features/system/components/system/MemoryIndicator";

export default function Page() {
  const {
    repoUrl,
    setRepoUrl,
    scanId,
    status,
    criticals,
    error,
    busy,
    canStart,
    onStart,
  } = useScan();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Code Guardian
            </h1>
            <MemoryIndicator />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Trivy wrapper that streams huge JSON reports and keeps only{" "}
            <span className="font-medium">CRITICAL</span> vulnerabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {status !== "Idle" && <StatusBadge status={status} />}
          {scanId && (
            <div className="text-xs text-muted-foreground">
              scanId:{" "}
              <span className="font-mono text-foreground">{scanId}</span>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <ScanForm
        repoUrl={repoUrl}
        setRepoUrl={setRepoUrl}
        canStart={canStart}
        busy={busy}
        status={status}
        error={error}
        onStart={onStart}
      />

      <div className="mt-8 grid gap-6">
        <CriticalVulnerabilitiesCards status={status} criticals={criticals} />
      </div>
    </main>
  );
}
