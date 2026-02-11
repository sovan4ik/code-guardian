import { useEffect, useMemo, useRef, useState } from "react";
import { _API } from "@/api";
import type { ScanStatus, ScanStatusResponse, Vulnerability } from "@/types";
import { toast } from "sonner";

const POLL_MS = 2000;

export function useScan() {
  const [repoUrl, setRepoUrl] = useState(
    "https://github.com/sovan4ik/NodeGoat",
  );
  const [scanId, setScanId] = useState<string | null>(null);
  const [status, setStatus] = useState<ScanStatus | "Idle">("Idle");
  const [criticals, setCriticals] = useState<Vulnerability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const timerRef = useRef<number | null>(null);
  const activeScanRef = useRef<string | null>(null);

  const canStart = useMemo(
    () => repoUrl.trim().length > 0 && !busy,
    [repoUrl, busy],
  );

  function stopPolling() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function pollOnce(id: string) {
    const data: ScanStatusResponse = await _API.scan.getScanStatus(id);

    if (activeScanRef.current !== id) return;

    setStatus(data.status);

    if (data.status === "Finished") {
      stopPolling();
      setCriticals(data.criticalVulnerabilities ?? []);
      toast("Scan finished", {
        description: `Found ${data.criticalVulnerabilities?.length ?? 0} CRITICAL vulnerabilities`,
      });
    }

    if (data.status === "Failed") {
      stopPolling();
      setError(data.error ?? "Scan failed");
      toast("Scan failed", {
        description: data.error ?? "Unknown error",
      });
    }
  }

  async function onStart() {
    setBusy(true);
    setError(null);
    setCriticals([]);

    try {
      stopPolling();

      const res = await _API.scan.startScan(repoUrl.trim());
      setScanId(res.scanId);
      activeScanRef.current = res.scanId;
      setStatus(res.status);

      toast.success("Scan started", {
        description: `scanId: ${res.scanId}`,
      });

      await pollOnce(res.scanId);

      timerRef.current = window.setInterval(() => {
        const id = activeScanRef.current;
        if (!id) return;
        pollOnce(id).catch((e) => {
          setError(e instanceof Error ? e.message : String(e));
        });
      }, POLL_MS);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStatus("Idle");
      setScanId(null);
      activeScanRef.current = null;

      toast("Start failed", {
        description: msg,
      });
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    return () => stopPolling();
  }, []);

  return {
    repoUrl,
    setRepoUrl,
    scanId,
    status,
    criticals,
    error,
    busy,
    canStart,
    onStart,
  };
}
