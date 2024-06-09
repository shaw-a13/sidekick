import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as events from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import path = require('path');
import { IngestionSfnConstruct } from './constructs/ingestion-sfn-construct';

const REACT_APP = 'resources/build';

export class SidekickStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sidekickBus = new events.EventBus(this, 'sidekickBus', {
      eventBusName: 'SidekickBus'
    });

    const siteBucket = new s3.Bucket(this, 'FrontendBucket', {
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distribution = new cloudfront.Distribution(this, 'CloudfrontDistribution', {
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });


    const caseBucket = new s3.Bucket(this, 'caseBucket', {
      bucketName: 'sidekick-cases',
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [{ allowedHeaders: ['*'], allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.GET], allowedOrigins: [`https://${distribution.domainName}`, 'http://localhost:3000'] }],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const ingestionSfn = new IngestionSfnConstruct(this, 'ingestion-state-machine', sidekickBus, caseBucket);

    const sidekickApiLambda = new lambda.Function(this, 'sidekickApiLambda', {
      code: lambda.Code.fromAsset(('lambda/sidekick_api'), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_9.bundlingImage,
          command: [
            'bash', '-c',
            'pip install -r requirements.txt -t /asset-output && rsync -r . /asset-output'
          ],
        },
      }),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
      environment: {
        INGESTION_SFN: ingestionSfn.stateMachine.stateMachineArn
      }
    });

    const sidekickTable = new dynamodb.Table(this, 'sidekickTable', {
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      }
    });

    sidekickApiLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:DescribeTable', 'dynamodb:Scan', 'dynamodb:Query', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
      resources: [sidekickTable.tableArn]
    }))

    sidekickApiLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['states:StartExecution'],
      resources: [ingestionSfn.stateMachine.stateMachineArn]
    }))

    const authorizerLambda = new lambda.Function(this, 'AuthorizerLambda', {
      code: lambda.Code.fromAsset(('lambda/authorizer_lambda'), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_9.bundlingImage,
          command: [
            'bash', '-c',
            'pip install -r requirements.txt -t /asset-output && rsync -r . /asset-output'
          ],
        },
      }),
      logGroup: new cdk.aws_logs.LogGroup(this, 'AuthorizerLogGroup'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
    });

    new s3Deployment.BucketDeployment(this, 'BucketDeployment', {
      sources: [s3Deployment.Source.asset('frontend/build')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    const pool = new cognito.UserPool(this, 'Pool', {
      selfSignUpEnabled: true,
      signInAliases: { username: true, email: true }
    });

    new cognito.UserPoolDomain(this, 'domain', {
      userPool: pool,
      cognitoDomain: {
        domainPrefix: 'sidekick'
      }
    })

    pool.addClient('app-client', {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: [`https://${distribution.domainName}/home`],
        logoutUrls: [`https://${distribution.domainName}/login`],
      },
    });

    const authorizer = new apiGateway.TokenAuthorizer(this, 'ApiAuthorizer', {
      handler: authorizerLambda,
    });

    const sidekickApi = new apiGateway.LambdaRestApi(this, 'sidekickApi', {
      handler: sidekickApiLambda,
      proxy: false,
      defaultMethodOptions: {
        authorizer
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS
      }
    });

    const cases = sidekickApi.root.addResource('cases', {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS
      }
    });
    cases.addMethod('GET');
    cases.addMethod('POST');

    const singleCase = cases.addResource('{case}');
    singleCase.addMethod('GET');
    singleCase.addMethod('PUT');
    singleCase.addMethod('DELETE');

    const clients = sidekickApi.root.addResource('clients', {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS
      }
    });
    clients.addMethod('GET');
    clients.addMethod('POST');

    const singleClient = clients.addResource('{client}');
    singleClient.addMethod('GET');
    singleClient.addMethod('PUT');
    singleClient.addMethod('DELETE');

    const ingestion = sidekickApi.root.addResource('ingestion', {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS
      }
    });
    ingestion.addMethod('POST');

    const comments = sidekickApi.root.addResource('comments', {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS
      }
    });

    const caseComments = comments.addResource('{caseId}');
    caseComments.addMethod('GET');
    caseComments.addMethod('POST');


    const singleComment = caseComments.addResource('{commentId}');
    singleComment.addMethod('GET');
    singleComment.addMethod('PUT');
    singleComment.addMethod('DELETE');


    const history = sidekickApi.root.addResource('history', {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS
      }
    });

    const caseHistory = history.addResource('{caseId}');
    caseHistory.addMethod('GET');
    caseHistory.addMethod('POST');


    const singleHistory = caseHistory.addResource('{historyId}');
    singleHistory.addMethod('GET');
    singleHistory.addMethod('PUT');
    singleHistory.addMethod('DELETE');

    const generatePresignedUrlLambda = new lambda.Function(this, 'GeneratePresignedUrlLambda', {
      code: lambda.Code.fromAsset(('lambda/generate_presigned_url'), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_9.bundlingImage,
          command: [
            'bash', '-c',
            'pip install -r requirements.txt -t /asset-output && rsync -r . /asset-output'
          ],
        },
      }),
      environment: {
        S3_BUCKET: caseBucket.bucketName
      },
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
    });

    generatePresignedUrlLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        's3:PutObject',
      ],
      resources: [caseBucket.bucketArn, `${caseBucket.bucketArn}/*`],
      effect: iam.Effect.ALLOW
    }))

    const upload = sidekickApi.root.addResource('upload', {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS
      },
    });

    const documentUpload = upload.addResource('{caseId}')
    documentUpload.addMethod('GET', new apiGateway.LambdaIntegration(generatePresignedUrlLambda));


    const downloadLambda = new lambda.Function(this, 'DownloadLambda', {
      code: lambda.Code.fromAsset(('lambda/download_s3_file'), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_9.bundlingImage,
          command: [
            'bash', '-c',
            'pip install -r requirements.txt -t /asset-output && rsync -r . /asset-output'
          ],
        },
      }),
      environment: {
        S3_BUCKET: caseBucket.bucketName
      },
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
    });

    downloadLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        's3:GetObject',
        's3:ListBucket',
      ],
      resources: [caseBucket.bucketArn, `${caseBucket.bucketArn}/*`],
      effect: iam.Effect.ALLOW
    }))

    const download = sidekickApi.root.addResource('download', {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS
      },
    });

    const documentDownload = download.addResource('{caseId}')
    documentDownload.addMethod('GET', new apiGateway.LambdaIntegration(downloadLambda));


    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: distribution.domainName,
      description: 'The distribution URL',
      exportName: 'CloudfrontURL',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: siteBucket.bucketName,
      description: 'The name of the S3 bucket',
      exportName: 'BucketName',
    });

    new cdk.CfnOutput(this, 'CaseApiUrl', {
      value: sidekickApi.url,
      description: 'The case api URL',
      exportName: 'CaseApiUrl',
    });
  }
}
