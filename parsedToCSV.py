import json
import datetime

f = open('events.json', 'r')
data = json.load(f)
f.close()


def convert(timestart):
    # date = timestart * 1000
    # hours = date.getHours()
    # minutes = "0" + date.getMinutes()
    # second = "0" + date.getSeconds()
    # if (hours > 12):
    #     fintime = hours - 17 + ':' + minutes.substr(-2) + " pm"
    # else:
    #     fintime = hours - 5 + ':' + minutes.substr(-2) + " am"

    # print(fintime)
    # return fintime
    year = timestart // 31556926
    timewithoutyear = timestart - (year * 31556926)
    month = timewithoutyear//2629743
    timewithoutmonth = timewithoutyear - (month * 2629743)
    week = timewithoutmonth // 604800
    timewithoutweek = timewithoutmonth - (week * 604800)
    day = timewithoutweek // 86400
    timewithoutday = timewithoutweek - (day * 86400)
    hour = timewithoutday // 3600
    timewithouthour = timewithoutday - (hour * 3600)
    minute = (timewithouthour // 60) - 22

    am_or_pm = ""
    if minute == 0:
        minute = str("00")

    if (hour > 12):
        hour = hour - 12
        am_or_pm = " pm"

    else:
        hour = hour
        am_or_pm = " am"

    return f'{hour}:{minute}{am_or_pm}'


with open('events.csv', 'w') as f:
    f.write('Subject,Start Date,Start time,All Day Event,Location\n')
    for i in data.keys():
        for j in data[i]:
            if j['is_all_day'] == True:
                f.write(
                    f"{j['title']}, {i[4:6]}/{i[6:]}/{i[:4]},0,True,{j['location']}\n")
            else:
                f.write(
                    f"{j['title']}, {i[4:6]}/{i[6:]}/{i[:4]},{convert(int(j['timestart']))}, False,{j['location']}\n")
