import csv, os
from datetime import date
from pymongo import MongoClient, ASCENDING

client = MongoClient('mongodb://localhost:27017/')

db_case = client.corona
col_case = db_case.system_info
col_social = db_case.date_emergency
col_population = db_case.population

rl_system = col_case.find({})

for each_system in rl_system:
    county_FIPS = each_system["state"]
    if county_FIPS == None:
        continue
    rl_social = col_social.find_one({"State": county_FIPS})

    if rl_social == None:
        print(each_system["name"], county_FIPS)
        pass
    else:
        print('"', each_system["name"], '"',";", rl_social["Difference"])


