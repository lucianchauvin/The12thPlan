import json

f = open('events.json', 'r')
data = json.load(f)
f.close()


with open('events.csv', 'w') as f:
    f.write('date,id,timestart,is_all_day,link,title,location,description,img')
for i in data['events'].keys():
    
