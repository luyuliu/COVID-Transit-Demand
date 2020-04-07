import csv, os, math
from datetime import date
from pymongo import MongoClient, ASCENDING

client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_system = db_corona.ridership_actual
col_case = db_corona.case_count
col_ridership = db_corona.ridership

rl_system = col_system.find({})

diff_sum = 0
diffsquare_sum = 0
count = 0
for each_system in rl_system:
    system_name = each_system["name"]
    actual_B = each_system["justified_actual_B"]
    actual_date = each_system["actual_B_date"].strftime("%Y%m%d")
    record_from_app = col_ridership.find_one({"date": actual_date, "system_name": system_name})
    app_B = record_from_app["demand_decrease"]
    print('"', system_name, '"', app_B, actual_B)
    diff_sum += app_B - actual_B
    diffsquare_sum += (app_B - actual_B) * (app_B - actual_B)
    count += 1


print(diff_sum/count, math.sqrt(diffsquare_sum/count), count)