import numpy as np
import matplotlib.pyplot as plt
import scipy.optimize
import csv
import os
from datetime import date
from pymongo import MongoClient, ASCENDING
from scipy.optimize import leastsq
client = MongoClient('mongodb://localhost:27017/')

db_corona = client.corona
col_system = db_corona.system_info
col_case = db_corona.case_count
col_ridership = db_corona.ridership

col_occu = db_corona.census_race

rl_system = col_system.find({})
for each_system in rl_system:
    system_name =  each_system["name"]
    county_FIPS = each_system["county_FIPS"]
    if county_FIPS == None:
        continue

    rl_occu = col_occu.find_one({"Geo_FIPS": str(int(county_FIPS))})
    # print(rl_occu)
    try:
        a1 = rl_occu["white_pop"]
        
        a2 = rl_occu["asian_pop"]

        a0 = rl_occu["total_race_pop"]
    except:
        print(county_FIPS)
    print('"', system_name ,'"', a1, a2, a0)