import json
import boto3
import uuid

from os import environ as env

# Configure S3 client
s3 = boto3.client('s3')

def handler(event, context):
    print(event)
    # Get the bucket name from environment variable
    bucket_name = env['S3_BUCKET']
    key = f'{uuid.uuid4()}.pdf'      # Generate a unique key for the object

    # Generate pre-signed URL
    presigned_url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': bucket_name, 
            'Key': key,
            'ContentType': 'application/pdf',  # Set the Content-Type for .pdf
        },
        ExpiresIn=3600,    # The expiration time of the URL (in seconds), here it's set to 1 hour
        HttpMethod='PUT'   # Only allow PUT requests on the url
    )

    # Construct the response
    response = {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        },
        'body': json.dumps({
            'presignedUrl': presigned_url,
            'key': key
        })
    }

    print(response)

    return response