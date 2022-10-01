import json

f = open('out.json', 'r')
data = json.load(f)
f.close()

parsed = {}

for i in data['events'].keys():
    day = []
    for j in data['events'][i]:
        if 'location' in j.keys():
            location = j['location']
        if 'summary' in j.keys():
            description = j['summary']
        if 'image_src' in j.keys():
            img = j['image_src']
        if 'is_all_day' in j.keys():
            isAllDay = j['is_all_day']
        else:
            isAllDay = False
        day.append({
            "id": j['id'],
            "timestart": j['ts_start'] - j['tz_offset'],
            "is_all_day": isAllDay,
            "link": j['href'],
            "title": j['title'],
            "location": location,
            "description": description,
            "img": img,
        })
    parsed.update({i: day})

with open('events.json', 'w') as f:
    json.dump(parsed, f)
