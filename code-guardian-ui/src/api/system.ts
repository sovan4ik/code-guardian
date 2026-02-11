import { HttpClient } from "@/lib/http";
import { MemoryStatus } from "@/types";

export class SystemApi extends HttpClient {
  os(): Promise<MemoryStatus> {
    return this.request({
      url: "/os",
      method: "GET",
    });
  }
}
