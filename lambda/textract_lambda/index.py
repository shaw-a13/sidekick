from typing import Dict, Optional
import boto3
import json
from trp import Document

BUCKETNAME = "sidekick-cases"


def handler(event, context):
    print(event)

    job_id = event["JobId"]
    textract = boto3.client("textract")

    response = textract.get_document_analysis(
        job_id=job_id
    )

    print(response)
