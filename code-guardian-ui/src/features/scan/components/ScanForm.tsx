import { Button } from "@/features/system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/system/components/ui/card";
import { Input } from "@/features/system/components/ui/input";
import { Label } from "@/features/system/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/features/system/components/ui/alert";
import { Progress } from "@/features/system/components/ui/progress";
import { Loader2 } from "lucide-react";
import { progressFor } from "../utils/progress";

export function ScanForm(props: {
  repoUrl: string;
  setRepoUrl: (value: string) => void;
  canStart: boolean;
  busy: boolean;
  status: string;
  error: string | null;
  onStart: () => void;
}) {
  const { repoUrl, setRepoUrl, canStart, busy, status, error, onStart } = props;
  const isLocked = busy || status === "Queued" || status === "Scanning";
  return (
    <Card className="border-muted/50">
      <CardHeader>
        <CardTitle>Start a scan</CardTitle>
        <CardDescription>Provide a GitHub repository URL...</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3">
          <Label htmlFor="repo">Repository URL</Label>

          <div className="flex gap-2">
            <Input
              id="repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/sovan4ik/NodeGoat"
              className="font-mono"
            />

            <Button onClick={onStart} disabled={isLocked} className="min-w-30">
              {isLocked ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking…
                </>
              ) : (
                "Start"
              )}
            </Button>
          </div>

          {status !== "Idle" && (
            <div className="pt-2">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{status}</span>
              </div>
              <Progress value={progressFor(status)} />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-3">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="wrap-break-word">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
