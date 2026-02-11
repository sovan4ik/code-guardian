"use client";

import { useEffect, useRef, useState } from "react";
import { _API } from "@/api";
import type { MemoryStatus } from "@/types";

const POLL_MS = 500;
const BACKOFF_MS = 10_000;
const MAX_FAILS = 5;

export function useMemoryStatus() {
  const [data, setData] = useState<MemoryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const aliveRef = useRef(true);
  const failCountRef = useRef(0);

  function stop() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function schedule(ms: number) {
    stop();
    timerRef.current = window.setTimeout(() => {
      tick().catch(() => {});
    }, ms);
  }

  async function tick() {
    if (!aliveRef.current) return;

    try {
      const result = await _API.system.os();
      if (!aliveRef.current) return;

      setData(result);
      setError(null);
      failCountRef.current = 0;

      schedule(POLL_MS);
    } catch (e) {
      if (!aliveRef.current) return;

      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);

      failCountRef.current += 1;

      if (failCountRef.current >= MAX_FAILS) {
        failCountRef.current = 0;
        schedule(BACKOFF_MS);
      } else {
        schedule(POLL_MS);
      }
    }
  }

  useEffect(() => {
    aliveRef.current = true;
    tick().catch(() => {});
    return () => {
      aliveRef.current = false;
      stop();
    };
  }, []);

  return { data, error };
}
