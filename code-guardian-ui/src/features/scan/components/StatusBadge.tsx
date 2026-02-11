import { Badge } from "@/components/ui/badge";
import { CircleCheck, Clock, Search, XCircle } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Queued":
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3.5 w-3.5" />
          Queued
        </Badge>
      );
    case "Scanning":
      return (
        <Badge className="gap-1">
          <Search className="h-3.5 w-3.5" />
          Scanning
        </Badge>
      );
    case "Finished":
      return (
        <Badge variant="outline" className="gap-1">
          <CircleCheck className="h-3.5 w-3.5" />
          Finished
        </Badge>
      );
    case "Failed":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3.5 w-3.5" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
