import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment'
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs';
import path = require('path');

const REACT_APP = 'resources/build';

export class SidekickStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sampleLambda = new lambda.Function(this, 'MyFunction', {
      code: lambda.Code.fromAsset(('lambda/sample_lambda'), {
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
    });

    //Create S3 Bucket for our website
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
        ],
    });

    new s3Deployment.BucketDeployment(this, 'BucketDeployment', {
        sources: [s3Deployment.Source.asset('resources/frontend')],
        destinationBucket: siteBucket,
        distribution,
        distributionPaths: ['/*'],
    });

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
  }
}
