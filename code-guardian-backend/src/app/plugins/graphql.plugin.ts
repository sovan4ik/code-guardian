import type { FastifyPluginAsync } from 'fastify';
import mercurius from 'mercurius';
import { ScanContainer } from '../../modules/scan/scan.container';
import schemas from '../graphql/schemas';

export const graphqlPlugin: FastifyPluginAsync = async (app) => {
  const schema = schemas;

  const resolvers = {
    Query: {
      scan: async (_: unknown, args: { id: string }) =>
        ScanContainer.scanService.getScan(args.id) ?? null,
    },

    Mutation: {
      startScan: async (_: unknown, args: { input: { repoUrl: string } }) => {
        const res = ScanContainer.scanService.createScan(args.input.repoUrl);

        return {
          id: res.scanId,
          status: res.status,
          error: null,
          criticalVulnerabilities: [],
        };
      },
    },

    Scan: {
      criticalVulnerabilities: (root: any) =>
        root?.criticalVulnerabilities ?? [],
    },
  };

  await app.register(mercurius, { schema, resolvers, graphiql: true });
};
