from typing import Dict, Optional
import boto3 
import json
from trp import Document

BUCKETNAME = 'sidekick-cases'

def handler(event, context):
    print(event)

    case_id = event['caseId']
    doc_id = event['key'].split('/')[1]
    s3 = boto3.resource('s3')

    job_id = event["textractResponse"]["JobId"]
    textract = boto3.client("textract")

    response = textract.get_document_analysis(
        JobId=job_id
    )

    print(f"Initial Next Token: {response.get('NextToken')}")
    next_token = response.get('NextToken')

    while next_token and len(next_token) > 1:
        print('Next token detected, getting more results')
        next_response = textract.get_document_analysis(JobId=job_id, NextToken=next_token)
        response['Blocks'].extend(next_response['Blocks'])

        print(f"Next Token: {next_response.get('NextToken')}")
        next_token = next_response.get('NextToken')

    print('All results received')
    print(response)

    rawKey = f'{case_id}/{doc_id}/rawResults/analyzeDocResponse.json'
    rawResult = s3.Object(BUCKETNAME, rawKey)
    rawResult.put(
        Body=(bytes(json.dumps(response).encode('UTF-8')))
    )

    doc = Document(response)

    print(doc)

    results = []

    for page in doc.pages:
        for field in page.form.fields:
            result = build_key_value_pairs(field, 'processedResults.json')
            if result is not None:
                results.append(result)

    processedkey = f'{case_id}/{doc_id}/processedResults/processedResults.json'

    processedResult = s3.Object(BUCKETNAME, processedkey)
    processedResult.put(
        Body=(bytes(json.dumps(results).encode('UTF-8')))
    )
        
    return {"processedResults": processedkey, "rawResults": rawKey}


def build_entity(attribute_name: str, value: str, locations: dict, source: str, score) -> Dict[str, str]:
    """Build attributes for query extraction"""
    return dict(
        key=attribute_name,
        value=value,
        locations=locations,
        source=source,
        score=score,
    )


def build_locations(
    key_raw_object: Optional[dict], value_raw_object: Optional[dict], file_name: str, page_number: int
) -> dict:
    """Build up locations object"""
    location_object = {"fileName": file_name, "pageNumber": page_number}
    for raw_object in (
        {"key": "key", "value": key_raw_object},
        {"key": "value", "value": value_raw_object},
    ):
        if raw_object["value"]:
            geometry = raw_object["value"].get("Geometry")
            location_object[raw_object.get("key")] = {
                "boundingBox": geometry.get("BoundingBox") if geometry else {},
                "polygon": geometry.get("Polygon") if geometry else {},
                "score": raw_object["value"].get("Confidence", 0),
                "pageNumber": page_number,
            }

    return location_object


def build_key_value_pairs(result, file_name: str) -> dict:
    """Build Key-Value Pair result object"""
    entity = {}
    if result.value and result.value.text:
        page = result.block.get("Page", 0)
        locations = build_locations(
            result.key.block,
            result.value.block,
            file_name,
            page,
        )
        value = result.value.text
        entity = build_entity(
            result.key.text if result.key else "",
            value,
            locations,
            file_name,
            result.confidence,
        )
        return entity
