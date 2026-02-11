import { FastifyReply, FastifyRequest } from 'fastify';
import { ScanService } from '../services/scan.service';
import { CreateScan, GetScan } from '../interfaces/req.interface';

class ScanController {
  constructor(private readonly scanService: ScanService) {}

  public async createScan(req: FastifyRequest<CreateScan>, rep: FastifyReply) {
    const result = this.scanService.createScan(req.body.repoUrl);
    return rep.code(201).send(result);
  }

  public async getScan(req: FastifyRequest<GetScan>, rep: FastifyReply) {
    const result = this.scanService.getScan(req.params.scanId);
    if (!result)
      return rep
        .code(404)
        .send({ message: `Scan with id: ${req.params.scanId} not found` });
    return rep.code(200).send(result);
  }

  public async getQueue(req: FastifyRequest<any>, rep: FastifyReply) {
    return rep.code(200).send({
      queue: this.scanService.getQueue(),
    });
  }
}

export default ScanController;
