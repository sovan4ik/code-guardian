import { useEffect, useMemo, useRef, useState } from "react";
import { _API, _GQL_API } from "@/api";
import {
  ApiMode,
  ScanStatus,
  ScanStatusResponse,
  Vulnerability,
} from "@/types";
import { toast } from "sonner";

const POLL_MS = 2000;

function getClient(mode: ApiMode) {
  return mode === ApiMode.GQL ? _GQL_API.scan : _API.scan;
}

export function useScan() {
  const [apiMode, setApiMode] = useState<ApiMode>(ApiMode.REST);

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

  useEffect(() => {
    stopPolling();
    setError(null);
    setCriticals([]);
    setStatus("Idle");
    setScanId(null);
    activeScanRef.current = null;
  }, [apiMode]);

  async function pollOnce(id: string) {
    const client = getClient(apiMode);
    const data: ScanStatusResponse = await client.getScanStatus(id);

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

      const client = getClient(apiMode);
      const res = await client.startScan(repoUrl.trim());

      setScanId(res.scanId);
      activeScanRef.current = res.scanId;
      setStatus(res.status);

      toast.success("Scan started", {
        description: `${apiMode} | scanId: ${res.scanId}`,
      });

      await pollOnce(res.scanId);

      timerRef.current = window.setInterval(() => {
        const id = activeScanRef.current;
        if (!id) return;
        pollOnce(id).catch((error) => {
          setError(error instanceof Error ? error.message : String(error));
        });
      }, POLL_MS);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      setStatus("Idle");
      setScanId(null);
      activeScanRef.current = null;

      toast("Start failed", {
        description: message,
      });
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    return () => stopPolling();
  }, []);

  return {
    apiMode,
    setApiMode,
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
