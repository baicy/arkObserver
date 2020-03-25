import re
import os
import json
output = {}
for root, dirs, files in os.walk(r".\\avatars\\", topdown=False):
    for name in files:
        if name.find('.png') > -1:
            match = re.match('^char_([^_]+_[^_]+)_([^\.]*)',name)
            if not match:
                continue
            key = match.groups()[0]
            id = match.groups()[1]
            if key not in output:
                output[key]=[]
            output[key].append(id)

print(output)
text = json.dumps(output, separators=(',', ':'))
with open(r'../../src/json/avatars.json', 'w', encoding='utf-8-sig') as f:
    f.write(text)

            
