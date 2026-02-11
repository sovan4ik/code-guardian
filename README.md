Asynchronous service for scanning GitHub repositories for security vulnerabilities.

Backend is built around a singleton `container` that wires controller, service, queue, worker, and CLI runner.

Scan requests are enqueued into an in-memory job `queue` and processed by a background `worker`.

Repositories are cloned into a temporary workspace, scanned via `Trivy`, and fully cleaned up after execution.

`Large JSON` reports are processed using Node.js streaming pipelines to strictly control memory usage.

Only `vulnerabilities` with configured severity (e.g. `CRITICAL`) are extracted and stored.

APIs are exposed via REST and GraphQL.

Frontend provides a convenient UI with HTTP / GraphQL protocol switching, scan status polling, and result visualization.

### Run
A docker-compose setup is provided for deployment; all required environment variables are defined there.
For local development, copy variables from `docker-compose.yml` into frontend `.env.local` and backend `.env.development`.
 
```bash 
docker compose up
# or
cd code-guardian-backend && npm install && npm run dev
cd code-guardian-ui && npm install && npm run dev 
```
