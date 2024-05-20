import json
import boto3
import uuid

from os import environ as env

# Configure S3 client
s3 = boto3.client("s3")


def handler(event, context):
    print(event)
    print(event["headers"])
    caseId = event["pathParameters"]["caseId"]
    # Get the bucket name from environment variable
    bucket_name = env["S3_BUCKET"]
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=f"{caseId}/")

    print(response)
    docs = []
    for fol in response.get("Contents", []):
        if fol["Key"].split("/")[1] not in docs:
            docs.append(fol["Key"].split("/")[1])

    print(docs)

    urls = [{"id": doc, "original": "", "processed": ""} for doc in docs]

    for i, url in enumerate(urls):
        # Generate pre-signed URL
        url["original"] = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": bucket_name,
                "Key": f"{caseId}/{docs[i]}/original/{docs[i]}.pdf",
            },
            ExpiresIn=3600,  # The expiration time of the URL (in seconds), here it's set to 1 hour
            HttpMethod="GET",  # Only allow GET requests on the url
        )

        url["processed"] = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": bucket_name,
                "Key": f"{caseId}/{docs[i]}/processedResults/processedResults.json",
            },
            ExpiresIn=3600,  # The expiration time of the URL (in seconds), here it's set to 1 hour
            HttpMethod="GET",  # Only allow GET requests on the url
        )

    print(urls)
    print(json.dumps(urls))

    # Construct the response
    response = {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": event["headers"].get('origin')},
        "body": json.dumps({"urls": urls}),
    }

    print(response)

    return response
