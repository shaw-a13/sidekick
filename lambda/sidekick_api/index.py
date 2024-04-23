import boto3 
import json

def handler(event, context):
    print(event)
    client = boto3.client('dynamodb')
    table = boto3.resource('dynamodb').Table('SideKickStack-sidekickTableFDBE0BEC-1HYP1C6X8JDIT')
    if event['resource'] == '/cases':
        if event['httpMethod'] == 'GET':
            print('Getting all cases...')
            response = table.scan()
            data = response['Items']
            return {
                'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps(data)
                }
    elif event['resource'] == '/clients':
        if event['httpMethod'] == 'POST':
            print('Adding new client...')
            data = json.loads(event['body'])
            print(data)
            print(type(data))
            print(data.get('clientId'))
            print(data.get('firstName'))
            response = client.put_item(
                TableName='SideKickStack-sidekickTableFDBE0BEC-1HYP1C6X8JDIT',
                Item={
                    'PK': {
                        'S': "CLIENT"
                    },
                    'SK': {
                        'S': data['clientId']
                    },
                    'firstName': {
                        'S': data['firstName']
                    },
                    'lastName': {
                        'S': data['lastName']
                    },
                    'addressLine1': {
                        'S': data['addressLine1']
                    },
                    'addressLine2': {
                        'S': data['addressLine2']
                    },
                    'postcode': {
                        'S': data['postcode']
                    },
                    'county': {
                        'S': data['county']
                    },
                    'city': {
                        'S': data['city']
                    },
                    'phoneNumber': {
                        'S': data['phoneNumber']
                    },
                    'email': {
                        'S': data['email']
                    }
                }
            )
        return {
            'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
        }

