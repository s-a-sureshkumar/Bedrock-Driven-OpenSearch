import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as openSearch from "aws-cdk-lib/aws-opensearchservice";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { storage } from "./storage/resource";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as osis from "aws-cdk-lib/aws-osis";

const backend = defineBackend({
  auth,
  data,
  storage,
});

const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

const bedrockDataSource = backend.data.addHttpDataSource(
  "BedrockDataSource",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-1",
      signingServiceName: "bedrock",
    },
  },
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [`arn:aws:bedrock:*::foundation-model/${MODEL_ID}`],
  }),
);

backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  MODEL_ID,
};

const tokenTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables.Token;

tokenTable.pointInTimeRecoveryEnabled = true;

tokenTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

const tokenTableArn = backend.data.resources.tables.Token.tableArn;

const tokenTableName = backend.data.resources.tables.Token.tableName;

const dataStack = Stack.of(backend.data);

const openSearchDomain = new openSearch.Domain(dataStack, "OpenSearchDomain", {
  version: openSearch.EngineVersion.OPENSEARCH_2_13,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
    enabled: true,
  },
});

const s3BucketArn = backend.storage.resources.bucket.bucketArn;
const s3BucketName = backend.storage.resources.bucket.bucketName;
const region = dataStack.region;

const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "OpenSearchIntegrationPipelineRole",
  {
    assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
    inlinePolicies: {
      openSearchPipelinePolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["es:DescribeDomain"],
            resources: [
              openSearchDomain.domainArn,
              openSearchDomain.domainArn + "/*",
            ],
            effect: iam.Effect.ALLOW,
          }),
          new iam.PolicyStatement({
            actions: ["es:ESHttp*"],
            resources: [
              openSearchDomain.domainArn,
              openSearchDomain.domainArn + "/*",
            ],
            effect: iam.Effect.ALLOW,
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "s3:GetObject",
              "s3:AbortMultipartUpload",
              "s3:PutObject",
              "s3:PutObjectAcl",
            ],
            resources: [s3BucketArn, s3BucketArn + "/*"],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "dynamodb:DescribeTable",
              "dynamodb:DescribeContinuousBackups",
              "dynamodb:ExportTableToPointInTime",
              "dynamodb:DescribeExport",
              "dynamodb:DescribeStream",
              "dynamodb:GetRecords",
              "dynamodb:GetShardIterator",
            ],
            resources: [tokenTableArn, tokenTableArn + "/*"],
          }),
        ],
      }),
    },
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchIngestionFullAccess",
      ),
    ],
  },
);

const indexName = "tokens";

const indexMapping = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
  },
  mappings: {
    properties: {
      collection_slug: { type: "keyword" },
      identifier: { type: "keyword" },
      name: {
        type: "text",
        fields: { keyword: { type: "keyword", ignore_above: 256 } },
      },
      price: { type: "float" },
      traits: {
        type: "nested",
        properties: {
          trait_type: { type: "keyword" },
          value: { type: "keyword" },
        },
      },
    },
  },
};

const openSearchTemplate = `
version: "2"
dynamodb-pipeline:
  source:
    dynamodb:
      acknowledgments: true
      tables:
        - table_arn: "${tokenTableArn}"
          stream:
            start_position: "LATEST"
          export:
            s3_bucket: "${s3BucketName}"
            s3_region: "${region}"
            s3_prefix: "${tokenTableName}/"
      aws:
        sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
        region: "${region}"
  sink:
    - opensearch:
        hosts:
          - "https://${openSearchDomain.domainEndpoint}"
        index: "${indexName}"
        index_type: "custom"
        template_content: |
          ${JSON.stringify(indexMapping)}
        document_id: '\${getMetadata("primary_key")}'
        action: '\${getMetadata("opensearch_action")}'
        document_version: '\${getMetadata("document_version")}'
        document_version_type: "external"
        bulk_size: 4
        aws:
          sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
          region: "${region}"
`;

const pipelineName = (
  "pipeline-" + dataStack.artifactId.substring(dataStack.artifactId.length - 15)
).toLowerCase();

const logGroup = new logs.LogGroup(dataStack, "LogGroup", {
  logGroupName: `/aws/vendedlogs/OpenSearchService/pipelines/${pipelineName}`,
  removalPolicy: RemovalPolicy.DESTROY,
});

new osis.CfnPipeline(dataStack, "OpenSearchIntegrationPipeline", {
  maxUnits: 4,
  minUnits: 1,
  pipelineConfigurationBody: openSearchTemplate,
  pipelineName: pipelineName,
  logPublishingOptions: {
    isLoggingEnabled: true,
    cloudWatchLogDestination: {
      logGroup: logGroup.logGroupName,
    },
  },
});

backend.data.addOpenSearchDataSource("OpenSearchDataSource", openSearchDomain);
