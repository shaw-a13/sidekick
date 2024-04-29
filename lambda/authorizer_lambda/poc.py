import jwt
import time


# token = 'Bearer wskodjwokd.eyJpc3MiOiJodHRwczovL2Rldi1111112eHg0Znd1em9oaThrLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJDYkhGYlVvNzJ0SGR0cmVzSWdvWkpGMlE2WkVXdjQ5U0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9zaWRla2ljay1hcGkuY29tIiwiaWF0IjoxNzA4MzY5MDIzLCJleHAiOjE3MDg0NTU0MjMsImF6cCI6IkNiSEZiVW83MnRIZHRyZXNJZ29aSkYyUTZaRVd2NDlTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.R4JVYm4FRQFmFNLlSHJaTkF67BX7g8Q_MUOwf7RE7uNAG7bHOsVmvaz4SvAvyiBEJWfZ80-cw65O5oWWprwk6BrDaSEnraXDfntQB8Y5183WTTnlnr48r2TJ9FdYeR3vLtp9Ec5H5jX8bdREPs9cfFVRJabqVf4r8AcDzIn3pUci-4_2VWMvaHy_zIdW9OhaCD7nmLttDmMDKbYbaaZZR_eS2CdW7txCd112ruY4E8n6zBLo46XZXRaHi3v5r5g-eCJCOv6M46DwpurH99z7kZ7FBiXky7597BsfDGl7Pc_dWMhG-AttM87pEbcMya8d6o9HH1HLVMyb4Wa-IFmQwQ'
# stripped = token.split('Bearer ')[1]
# res = jwt.decode(stripped, options={'verify_aud': False, 'verify_signature':False})

# # 1708451519 < 
# # print(int(time.time()))
# print(res)
data = [
    {"key": "clientId", "value": "TestID"},
    {"key": "firstName", "value": "John"} 
]

# d = {ele: {'S': data[ele]} for ele in data.keys()}

# item = {
#         'PK': {
#             'S': 'CLIENT'
#         },
#         **{ele: {'S': data[ele]} for ele in data.keys()}
# }

# print(item)

expression_attribute_names = {f'#{item["key"].lower()}': item['key'] for item in data}
print(expression_attribute_names)
expression_attribute_values = {f':{item["key"].lower()}': {'S': item['value']} for item in data}
print(expression_attribute_values)

set_items = [f':{item["key"].lower()} = {item["key"].lower()}' for item in data]
set_expr = f"SET {', '.join(x for x in set_items)}"

print(set_expr)
