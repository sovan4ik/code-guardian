import { spawn } from 'node:child_process';

export type CliRunnerOptions = {
  timeoutMs?: number; // default 10 min
  stderrLimit?: number; // default 64 KB
};

export class CliRunner {
  private readonly timeoutMs: number;
  private readonly stderrLimit: number;

  constructor(opts: CliRunnerOptions = {}) {
    this.timeoutMs = opts.timeoutMs ?? 10 * 60_000;
    this.stderrLimit = opts.stderrLimit ?? 64_000;
  }

  run(cmd: string, args: readonly string[], cwd?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(cmd, args, {
        cwd,
        stdio: ['ignore', 'ignore', 'pipe'],
      });

      let stderr = '';
      process.stderr.on('data', (data) => {
        if (stderr.length < this.stderrLimit) stderr += data.toString();
      });

      const timer = setTimeout(() => {
        process.kill('SIGKILL');
        reject(new Error(`${cmd} timed out after ${this.timeoutMs}ms`));
      }, this.timeoutMs);

      const finish = (err?: Error) => {
        clearTimeout(timer);
        err ? reject(err) : resolve();
      };

      process.on('error', (error) =>
        finish(error instanceof Error ? error : new Error(String(error))),
      );
      process.on('close', (code) => {
        if (code === 0) return finish();
        const tail = stderr.trim();
        finish(
          new Error(`${cmd} failed (code ${code})${tail ? `: ${tail}` : ''}`),
        );
      });
    });
  }
}
