import { FastifyReply, FastifyRequest } from 'fastify';
import { CommonService } from '../../services/common.service';

class CommonController {
  constructor(private readonly commonService: CommonService) {}

  public async health(_req: FastifyRequest, rep: FastifyReply) {
    const result = this.commonService.getHealth();
    return rep.code(200).send(result);
  }

  public async getMemory(_req: FastifyRequest, rep: FastifyReply) {
    const result = this.commonService.getOsMemory();
    return rep.code(200).send(result);
  }
}

export default CommonController;
