import { Construct } from "constructs";
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';



export class IngestionSfnConstruct extends Construct {
    public readonly stateMachine: sfn.StateMachine;
    constructor(scope: Construct, id: string, eventBus: events.IEventBus) {
        super(scope, id);
        this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
            definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Pass(this, 'StartState')),
        });

        const rule = new events.Rule(this, 'sfn-rule', {
            eventPattern: {
                detailType: ["START-DOCUMENT-EXTRACTION"]
            },
            eventBus: eventBus
        })

        rule.addTarget(new targets.SfnStateMachine(this.stateMachine))
    }

}