import csv, os
from datetime import date
from pymongo import MongoClient, ASCENDING

client = MongoClient('mongodb://localhost:27017/')

db_case = client.corona
col_case = db_case.system_info
col_social = db_case.social_media
col_population = db_case.population

rl_system = col_case.find({})

for each_system in rl_system:
    county_FIPS = each_system["county_FIPS"]
    if county_FIPS == None:
        continue
    rl_social = col_social.find_one({"county_fip": county_FIPS})
    rl_pop = col_population.find_one({"Geo_FIPS": int(county_FIPS)})

    if rl_social == None:
        # print(each_system["name"])
        pass
    else:
        print('"', each_system["name"], '"', each_system["B"], rl_social["uniq_users"], rl_social["total_post"], rl_pop["population"])


        #system_info-join_emergency