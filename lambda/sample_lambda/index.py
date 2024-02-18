import boto3 
import json

def handler(event, context):
    print(event)
    if event['httpMethod'] == 'GET':
        print('Getting all cases...')
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('SideKickStack-sidekickTableFDBE0BEC-1HYP1C6X8JDIT')
        response = table.scan()
        data = response['Items']
        return {
            'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
            'body': json.dumps(data)
            }

