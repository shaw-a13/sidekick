import boto3 
import json

TABLENAME = 'SideKickStack-sidekickTableFDBE0BEC-1HYP1C6X8JDIT'

def handler(event, context):
    print(event)
    client = boto3.client('dynamodb')
    table = boto3.resource('dynamodb').Table(TABLENAME)
    if event['resource'] == '/cases':
        if event['httpMethod'] == 'GET':
            print('Getting all cases...')
            response = get_all_dynamo_items(client, 'CASE')
            print(response)
            data = response['Items']
        elif event['httpMethod'] == 'POST':
            print('Adding new case...')
            data = json.loads(event['body'])
            response = put_dynamo_item(client, 'CASE', data)
            print(response)
            return {
                'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps({
                    'Id': data['SK']
                })
            }
    elif event['resource'] == '/cases/{case}':
        if event['httpMethod'] == 'GET':
            print('Getting a single case...')
            case = event['pathParameters']['case']
            response = get_single_dynamo_item(client, 'CASE', case)
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps(response)
            }
        elif event['httpMethod'] == 'PUT':
            print('Updating a single case...')
            data = json.loads(event['body'])
            caseId = event['pathParameters']['case']
            response = update_dynamo_item(client, 'CASE', caseId, data["props"])
            print(response)
            data = response['Attributes']
        elif event['httpMethod'] == 'DELETE':
            print('Deleting a single case...')
            case = event['pathParameters']['case']
            response = delete_dynamo_item(client, 'CASE', case)
            print(response)
            data = response

    elif event['resource'] == '/clients':
        if event['httpMethod'] == 'GET':
            print('Getting all clients...')
            response = get_all_dynamo_items(client, 'CLIENT')
            print(response)
            data = response['Items']
        if event['httpMethod'] == 'POST':
            print('Adding new client...')
            data = json.loads(event['body'])
            response = put_dynamo_item(client, 'CLIENT', data)
            print(response)
            return {
                'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps({
                    'Id': data['SK']
                })
            }
        
    elif event['resource'] == '/clients/{client}':
        if event['httpMethod'] == 'GET':
            print('Getting a single client...')
            clientId = event['pathParameters']['client']
            response = get_single_dynamo_item(client, 'CLIENT', clientId)
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps(response)
            }
        elif event['httpMethod'] == 'PUT':
            print('Updating a single client...')
            data = json.loads(event['body'])
            clientId = event['pathParameters']['client']
            response = update_dynamo_item(client, 'CLIENT', clientId, data["props"])
            print(response)
            data = response['Attributes']
        elif event['httpMethod'] == 'DELETE':
            print('Deleting a single client...')
            clientId = event['pathParameters']['client']
            response = delete_dynamo_item(client, 'CLIENT', clientId)
            print(response)
            data = response
    return {
            'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(data)
        }


def get_all_dynamo_items(client, partition_key):
    return client.query(
        ExpressionAttributeValues={
            ':pk': {
                'S': partition_key
            }
        },
        KeyConditionExpression='PK = :pk',
        TableName=TABLENAME
    )

def get_single_dynamo_item(client, partition_key: str, sort_key: str):
    res = client.query(
        ExpressionAttributeValues={
            ':pk': {
                'S': partition_key
            },
            ':sk': {
                'S': sort_key
            }
        },
        KeyConditionExpression='PK = :pk AND SK = :sk',
        TableName=TABLENAME
    )['Items'][0]
    keys = list(res.keys())
    vals = list(res.values())

    return {key: vals[i]['S'] for i, key in enumerate(keys)} 

def put_dynamo_item(client, primary_key: str, data: dict):
    item = {
        'PK': {
            'S': primary_key
        },
        **{ele: {'S': data[ele]} for ele in data.keys()}
    }
    return client.put_item(
        TableName=TABLENAME,
        Item=item
    )


def update_dynamo_item(client, partition_key: str, sort_key: str, data: dict):
    expression_attribute_names = {f'#{item["key"].lower()}': item['key'] for item in data}
    expression_attribute_values = {f':{item["key"].lower()}': {'S': item['value']} for item in data}
    set_items = [f'#{item["key"].lower()} = :{item["key"].lower()}' for item in data]
    update_expr = f"SET {', '.join(x for x in set_items)}"

    return client.update_item(
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values,
        Key={
            'PK': {
                'S': partition_key
            },
            'SK': {
                'S': sort_key
            }
        },
        ReturnValues='ALL_NEW',
        TableName=TABLENAME,
        UpdateExpression=update_expr
    )

def delete_dynamo_item(client, partition_key: str, sort_key: str):
    return client.delete_item(
        Key={
            'PK': {
                'S': partition_key
            },
            'SK': {
                'S': sort_key
            }
        },
        TableName=TABLENAME
    )