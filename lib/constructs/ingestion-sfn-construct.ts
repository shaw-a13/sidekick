import { Construct } from "constructs";
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';



export class IngestionSfnConstruct extends Construct {
    public readonly stateMachine: sfn.StateMachine;
    constructor(scope: Construct, id: string, eventBus: events.IEventBus, bucket: s3.IBucket) {
        super(scope, id);
        const callTextract = new tasks.CallAwsService(this, 'Call Textract', {
            service: 'textract',
            action: 'startDocumentAnalysis',
            parameters: {
                DocumentLocation: {
                    S3Object: {
                        Bucket: bucket.bucketName,
                        Name: sfn.JsonPath.stringAt('$.key')
                    }
                },
                FeatureTypes: ['FORMS']
            },
            iamResources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
            resultPath: '$.textractResponse'
        });

        const textractResponseParser = new lambda.Function(this, 'textractResponseParser', {
            code: lambda.Code.fromAsset(('lambda/textract_response_parser'), {
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
            timeout: cdk.Duration.seconds(60)
        });

        textractResponseParser.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['s3:GetObject', 's3:PutObject'],
            resources: [bucket.bucketArn, `${bucket.bucketArn}/*`]
        }))

        textractResponseParser.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['textract:GetDocumentAnalysis'],
            resources: ['*']
        }))

        const getDocumentAnalysisLambdaTask = new tasks.LambdaInvoke(this, 'Get Textract Results',
            {
                lambdaFunction: textractResponseParser, resultPath: '$.textractResults', resultSelector: {
                    "processedResults.$": "$.Payload.processedResults",
                    "rawResults.$": "$.Payload.rawResults"
                }
            })

        this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
            definitionBody: sfn.DefinitionBody.fromChainable(
                callTextract
                    .next(new sfn.Wait(this, 'Wait for textract', { time: sfn.WaitTime.duration(cdk.Duration.seconds(30)) }))
                    .next(getDocumentAnalysisLambdaTask)
            ),
        });

        this.stateMachine.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['textract:StartDocumentAnalysis'],
            resources: ['*']
        }))

        this.stateMachine.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['s3:GetObject'],
            resources: [bucket.bucketArn, `${bucket.bucketArn}/*`]
        }))


        const rule = new events.Rule(this, 'sfn-rule', {
            eventPattern: {
                detailType: ["START-DOCUMENT-EXTRACTION"]
            },
            eventBus: eventBus
        })

        rule.addTarget(new targets.SfnStateMachine(this.stateMachine))
    }

}