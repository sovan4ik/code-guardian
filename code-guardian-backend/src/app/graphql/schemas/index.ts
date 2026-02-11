const schemas = `
    type Vulnerability {
      vulnerabilityId: String!
      pkgName: String
      installedVersion: String
      fixedVersion: String
      title: String
      severity: String
      description: String
      primaryUrl: String
    }

    type Scan {
      id: ID!
      status: String!
      error: String
      criticalVulnerabilities: [Vulnerability!]!
    }

    input StartScanInput {
      repoUrl: String!
    }

    type Query {
      scan(id: ID!): Scan
    }

    type Mutation {
      startScan(input: StartScanInput!): Scan!
    }
  `;
export default schemas;
