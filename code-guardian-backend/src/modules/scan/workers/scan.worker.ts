import os from 'node:os';
import path from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { createReadStream } from 'node:fs';

import { parser } from 'stream-json';

import { pick } from 'stream-json/filters/Pick';
import { streamArray } from 'stream-json/streamers/StreamArray';

import {
  ScanJob,
  ScanStatus,
  TrivyScanResultRaw,
  Vulnerability,
} from '../types/scan.type';
import { ScanService } from '../services/scan.service';
import { CliRunner } from '../../common/runners/cli.runner';
import _CONFIG from '../../../config';

export class ScanWorker {
  constructor(
    private readonly cli: CliRunner,
    private readonly scanService: ScanService,
  ) {}

  async run(job: ScanJob): Promise<void> {
    const { prefix } = _CONFIG.scan.workDir;
    const baseDir = await mkdtemp(path.join(os.tmpdir(), prefix));
    const repoDir = path.join(baseDir, 'repo');
    const reportPath = path.join(baseDir, 'report.json');

    console.log(`[SW:${job.scanId}] tmp=${baseDir}`);
    console.log(`[SW:${job.scanId}] clone ${job.repoUrl} - ${repoDir}`);

    try {
      this.scanService.setStatus(job.scanId, ScanStatus.Scanning);

      await this.cli.run('git', ['clone', '--depth=1', job.repoUrl, repoDir]);

      console.log(`[SW:${job.scanId}] run trivy - ${reportPath}`);
      await this.cli.run('trivy', [
        'repo',
        '--format',
        'json',
        '-o',
        reportPath,
        repoDir,
      ]);

      console.log(`[SW:${job.scanId}] parse report (stream)`);
      const critical = await extractCritical(reportPath);

      console.log(`[SW:${job.scanId}] finished: critical=${critical.length}`);
      this.scanService.setResult(job.scanId, critical);
    } catch (error) {
      const message = toMessage(error);
      console.error(`[SW:${job.scanId}] failed: ${message}`);
      this.scanService.setFailed(job.scanId, message);
    } finally {
      console.log(`[SW:${job.scanId}] cleanup ${baseDir}`);
      await rm(baseDir, { recursive: true, force: true }).catch(
        () => undefined,
      );
    }
  }
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function extractCritical(reportPath: string): Promise<Vulnerability[]> {
  const critical: Vulnerability[] = [];

  const stream = createReadStream(reportPath)
    .pipe(parser())
    .pipe(pick({ filter: 'Results' }))
    .pipe(streamArray());

  for await (const { value: result } of stream as AsyncIterable<{
    value: TrivyScanResultRaw;
  }>) {
    const vulnerabilities = result?.Vulnerabilities;

    if (!Array.isArray(vulnerabilities)) continue;

    for (const vulnerability of vulnerabilities) {
      if (vulnerability?.Severity !== _CONFIG.scan.severity) continue;

      critical.push({
        vulnerabilityId: vulnerability.VulnerabilityID,
        pkgName: vulnerability.PkgName,
        installedVersion: vulnerability.InstalledVersion,
        fixedVersion: vulnerability.FixedVersion,
        title: vulnerability.Title,
        severity: vulnerability.Severity,
        primaryUrl: vulnerability.PrimaryURL,
        description: vulnerability.Description,
      });
    }
  }

  return critical;
}
