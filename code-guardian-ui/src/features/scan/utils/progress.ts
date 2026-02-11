export function progressFor(status: string) {
  if (status === "Queued") return 15;
  if (status === "Scanning") return 65;
  if (status === "Finished") return 100;
  if (status === "Failed") return 100;
  return 0;
}
