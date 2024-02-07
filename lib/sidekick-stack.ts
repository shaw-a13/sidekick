import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs';
import path = require('path');

// import * as sqs from 'aws-cdk-lib/aws-sqs';

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
  }
}
