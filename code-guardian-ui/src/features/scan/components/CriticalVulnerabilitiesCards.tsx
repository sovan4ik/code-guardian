import type { Vulnerability } from "@/types";

import { Badge } from "@/features/system/components/ui/badge";
import { Button } from "@/features/system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/system/components/ui/card";

import { ExternalLink } from "lucide-react";

export function CriticalVulnerabilitiesCards(props: {
  status: string;
  criticals: Vulnerability[];
}) {
  const { status, criticals } = props;

  return (
    <Card className="border-muted/50">
      <CardHeader>
        <CardTitle>Critical vulnerabilities</CardTitle>
        <CardDescription>
          Only shown when scan status is{" "}
          <span className="font-medium">Finished</span>.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {status !== "Finished" ? (
          <div className="text-sm text-muted-foreground">
            Results will appear here after the scan completes.
          </div>
        ) : criticals.length === 0 ? (
          <div className="text-sm">No CRITICAL vulnerabilities found</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {criticals.map((value, index) => (
              <div
                key={`${value.vulnerabilityId ?? "noid"}-${index}`}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="destructive" className="text-[10px]">
                        {value.severity}
                      </Badge>

                      {value.vulnerabilityId ? (
                        <span className="font-mono text-xs text-muted-foreground">
                          {value.vulnerabilityId}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 text-sm font-semibold leading-snug wrap-break-word">
                      {value.title ?? "—"}
                    </div>
                  </div>

                  {value.primaryUrl ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      <a
                        href={value.primaryUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open
                      </a>
                    </Button>
                  ) : null}
                </div>

                {value.description ? (
                  <p className="mt-2 line-clamp-3 text-xs text-muted-foreground wrap-break-word">
                    {value.description}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    No description
                  </p>
                )}

                <div className="mt-3 grid gap-2 rounded-md bg-muted/40 p-3 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Package</span>
                    <span className="font-mono">{value.pkgName ?? "—"}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Installed</span>
                    <span className="font-mono">
                      {value.installedVersion ?? "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Fixed</span>
                    <span className="font-mono">
                      {value.fixedVersion ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
