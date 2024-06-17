import boto3
import json
from os import environ as env

TABLENAME = "SideKickStack-sidekickTableFDBE0BEC-1HYP1C6X8JDIT"


def handler(event, context):
    print(event)
    client = boto3.client("dynamodb")
    ingestion_sfn = env["INGESTION_SFN"]
    if event["resource"] == "/cases":
        if event["httpMethod"] == "GET":
            print("Getting all cases...")
            response = get_all_dynamo_items(client, "CASE")
            print(response)
            data = response
        elif event["httpMethod"] == "POST":
            print("Adding new case...")
            data = json.loads(event["body"])
            response = put_dynamo_item(client, "CASE", data)
            print(response)
            return {
                "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
                "body": json.dumps({"Id": data["SK"]}),
            }
    elif event["resource"] == "/cases/{case}":
        if event["httpMethod"] == "GET":
            print("Getting a single case...")
            case = event["pathParameters"]["case"]
            response = get_single_dynamo_item(client, "CASE", case)
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
                "body": json.dumps(response),
            }
        elif event["httpMethod"] == "PUT":
            print("Updating a single case...")
            data = json.loads(event["body"])
            caseId = event["pathParameters"]["case"]
            response = update_dynamo_item(client, "CASE", caseId, data["props"])
            print(response)
            data = response["Attributes"]
        elif event["httpMethod"] == "DELETE":
            print("Deleting a single case...")
            case = event["pathParameters"]["case"]
            response = delete_dynamo_item(client, "CASE", case)
            print(response)
            data = response

    elif event["resource"] == "/clients":
        if event["httpMethod"] == "GET":
            print("Getting all clients...")
            response = get_all_dynamo_items(client, "CLIENT")
            print(response)
            data = response
        elif event["httpMethod"] == "POST":
            print("Adding new client...")
            data = json.loads(event["body"])
            response = put_dynamo_item(client, "CLIENT", data)
            print(response)
            return {
                "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
                "body": json.dumps({"Id": data["SK"]}),
            }

    elif event["resource"] == "/clients/{client}":
        if event["httpMethod"] == "GET":
            print("Getting a single client...")
            clientId = event["pathParameters"]["client"]
            response = get_single_dynamo_item(client, "CLIENT", clientId)
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
                "body": json.dumps(response),
            }
        elif event["httpMethod"] == "PUT":
            print("Updating a single client...")
            data = json.loads(event["body"])
            clientId = event["pathParameters"]["client"]
            response = update_dynamo_item(client, "CLIENT", clientId, data["props"])
            print(response)
            data = response["Attributes"]
        elif event["httpMethod"] == "DELETE":
            print("Deleting a single client...")
            clientId = event["pathParameters"]["client"]
            response = delete_dynamo_item(client, "CLIENT", clientId)
            print(response)
            data = response
    elif event["resource"] == "/ingestion":
        print("triggering ingestion...")
        data = json.loads(event["body"])
        sfn_client = boto3.client("stepfunctions")
        response = sfn_client.start_execution(
            stateMachineArn=ingestion_sfn,
            input=json.dumps(data),
        )
        print(response)
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            "body": json.dumps({"executionArn": response["executionArn"]}),
        }
    elif event["resource"] == "/comments/{caseId}":
        if event["httpMethod"] == "GET":
            print("Getting all comments...")
            case_id = event["pathParameters"]["caseId"]
            response = get_single_dynamo_item_begins_with(client, "COMMENT", case_id)
            print(response)
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
                "body": json.dumps(response),
            }
        elif event["httpMethod"] == "POST":
            print("Adding new comment...")
            data = json.loads(event["body"])
            response = put_dynamo_item(client, "COMMENT", data)
            print(response)
            return {
                "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
                "body": json.dumps({"Id": data["SK"]}),
            }
    elif event["resource"] == "/comments/{caseId}/{timestamp}":
        if event["httpMethod"] == "PUT":
            print("Updating a single comment...")
            data = json.loads(event["body"])
            case_id = event["pathParameters"]["caseId"]
            timestamp = event["pathParameters"]["timestamp"]
            response = update_dynamo_item(client, "COMMENT", f'{case_id}#{timestamp}', data["props"])
            print(response)
            data = response["Attributes"]
        elif event["httpMethod"] == "DELETE":
            print("Deleting a single comment...")
            response = delete_dynamo_item(client, "COMMENT", f"{case_id}#{timestamp}")
            print(response)
            data = response
    elif event["resource"] == "/history/{caseId}":
        if event["httpMethod"] == "GET":
            print("Getting all history...")
            case_id = event["pathParameters"]["caseId"]
            response = get_single_dynamo_item_begins_with(client, "CASE-HISTORY", case_id)
            print(response)
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
                "body": json.dumps(response),
            }
        elif event["httpMethod"] == "POST":
            print("Adding new history update...")
            data = json.loads(event["body"])
            response = put_dynamo_item(client, "CASE-HISTORY", data)
            print(response)
            return {
                "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
                "body": json.dumps({"Id": data["SK"]}),
            }
    elif event["resource"] == "/history/{caseId}/{timestamp}":
        if event["httpMethod"] == "DELETE":
            print("Deleting a single history update...")
            data = json.loads(event["body"])
            case_id = event["pathParameters"]["caseId"]
            timestamp = event["pathParameters"]["timestamp"] 
            response = delete_dynamo_item(client, "CASE-HISTORY", f"{case_id}#{timestamp}")
            print(response)
            data = response
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": json.dumps(data),
    }


def get_all_dynamo_items(client, partition_key):
    res = client.query(
        ExpressionAttributeValues={":pk": {"S": partition_key}},
        KeyConditionExpression="PK = :pk",
        TableName=TABLENAME,
    )
    result_list = []
    [
        result_list.append(
            {
                key: list(item.values())[i]["S"]
                for i, key in enumerate(list(item.keys()))
            }
        )
        for item in res["Items"]
    ]
    return result_list


def get_single_dynamo_item_begins_with(client, partition_key: str, sort_key: str):
    res = client.query(
        ExpressionAttributeValues={":pk": {"S": partition_key}, ":sk": {"S": sort_key}},
        KeyConditionExpression="PK = :pk AND begins_with( SK, :sk)",
        TableName=TABLENAME,
    )
    result_list = []
    [
        result_list.append(
            {
                key: list(item.values())[i]["S"]
                for i, key in enumerate(list(item.keys()))
            }
        )
        for item in res["Items"]
    ]

    return result_list

def get_single_dynamo_item(client, partition_key: str, sort_key: str):
    res = client.query(
        ExpressionAttributeValues={":pk": {"S": partition_key}, ":sk": {"S": sort_key}},
        KeyConditionExpression="PK = :pk AND SK = :sk",
        TableName=TABLENAME,
    )["Items"][0]
    keys = list(res.keys())
    vals = list(res.values())

    return {key: vals[i]["S"] for i, key in enumerate(keys)}


def put_dynamo_item(client, primary_key: str, data: dict):
    item = {"PK": {"S": primary_key}, **{ele: {"S": data[ele]} for ele in data.keys()}}
    return client.put_item(TableName=TABLENAME, Item=item)


def update_dynamo_item(client, partition_key: str, sort_key: str, data: dict):
    expression_attribute_names = {
        f'#{item["key"].lower()}': item["key"] for item in data
    }
    expression_attribute_values = {
        f':{item["key"].lower()}': {"S": item["value"]} for item in data
    }
    set_items = [f'#{item["key"].lower()} = :{item["key"].lower()}' for item in data]
    update_expr = f"SET {', '.join(x for x in set_items)}"

    return client.update_item(
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values,
        Key={"PK": {"S": partition_key}, "SK": {"S": sort_key}},
        ReturnValues="ALL_NEW",
        TableName=TABLENAME,
        UpdateExpression=update_expr,
    )


def delete_dynamo_item(client, partition_key: str, sort_key: str):
    return client.delete_item(
        Key={"PK": {"S": partition_key}, "SK": {"S": sort_key}}, TableName=TABLENAME
    )
