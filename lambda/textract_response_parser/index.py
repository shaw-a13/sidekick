from typing import Dict, Optional
import boto3 
import json
from trp import Document

BUCKETNAME = 'sidekick-cases'

def handler(event, context):
    print(event)

    case_id = event['caseId']
    s3 = boto3.resource('s3')

    content_object = s3.Object(BUCKETNAME, f'{event["caseId"]}/rawResults/analyzeDocResponse.json')
    file_content = content_object.get()['Body'].read().decode('utf-8')
    json_content = json.loads(file_content)
    print(json_content)

    doc = Document(json_content)

    results = []

    for page in doc.pages:
        for field in page.form.fields:
            result = build_key_value_pairs(field, 'processedResults.json')
            if result is not None:
                results.append(result)

    key = f'{case_id}/processedResults/processedResults.json'

    processedResult = s3.Object(BUCKETNAME, key)
    processedResult.put(
        Body=(bytes(json.dumps(results).encode('UTF-8')))
    )
        
    return key


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
