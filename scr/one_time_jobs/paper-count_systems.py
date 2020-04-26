import csv, os
from datetime import date
from pymongo import MongoClient, ASCENDING

client = MongoClient('mongodb://localhost:27017/')

db_case = client.corona
col_case = db_case.system_info

rl_case = col_case.find({})


county_set = set()
city_set = set()
state_set = set()

for each_system in rl_case:
    county = each_system["county"]
    city = each_system["metro_area"]
    state = each_system["state"]
    lat = each_system['lat']

    if lat != None:
    
        county_set.add(county)
        city_set.add(city)
        state_set.add(state)

print(len(county_set))
print(len(city_set))
print(len(state_set))